import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { AccessControlService, SUBSCRIPTION_PLANS } from '@/lib/subscription-service';
import { School } from '@/lib/database-services';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UseSubscriptionReturn {
  school: School | null;
  loading: boolean;
  error: string | null;
  
  // Subscription info
  currentPlan: typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS] | null;
  subscriptionStatus: School['subscription']['status'] | null;
  daysRemaining: { type: 'active' | 'grace' | 'expired'; days: number; message: string } | null;
  
  // Access control
  hasFeatureAccess: (feature: string) => boolean;
  hasActiveSubscription: boolean;
  isRestricted: boolean;
  availableActions: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canExport: boolean;
    canImport: boolean;
  };
  
  // Usage limits
  usageLimits: {
    withinLimits: boolean;
    exceeded: string[];
    warnings: string[];
  };
  
  // Refresh function
  refreshSubscription: () => void;
}

/**
 * Hook for managing subscription access control and status
 */
export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get school data and subscription info
  useEffect(() => {
    if (!user?.profile?.schoolId) {
      setLoading(false);
      setError('No school associated with user');
      return;
    }

    const schoolRef = doc(db, 'schools', user.profile.schoolId);
    
    const unsubscribe = onSnapshot(
      schoolRef,
      (doc) => {
        if (doc.exists()) {
          const schoolData = { id: doc.id, ...doc.data() } as School;
          
          // Update subscription status based on current date
          const updatedStatus = AccessControlService.updateSubscriptionStatus(schoolData);
          if (updatedStatus !== schoolData.subscription.status) {
            // Note: In a real app, you'd want to update this in the database
            schoolData.subscription.status = updatedStatus;
          }
          
          setSchool(schoolData);
          setError(null);
        } else {
          setError('School not found');
          setSchool(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching school subscription:', error);
        setError('Failed to load subscription information');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.profile?.schoolId, refreshTrigger]);

  // Memoized values
  const currentPlan = school ? SUBSCRIPTION_PLANS[school.subscription.plan] : null;
  const subscriptionStatus = school?.subscription.status || null;
  const hasActiveSubscription = school ? AccessControlService.hasActiveSubscription(school) : false;
  const isRestricted = school ? AccessControlService.isRestricted(school) : true;
  const availableActions = school ? AccessControlService.getAvailableActions(school) : {
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canExport: false,
    canImport: false
  };
  const usageLimits = school ? AccessControlService.checkUsageLimits(school) : {
    withinLimits: false,
    exceeded: [],
    warnings: []
  };
  const daysRemaining = school ? AccessControlService.getDaysRemaining(school) : null;

  const hasFeatureAccess = (feature: string): boolean => {
    if (!school) return false;
    return AccessControlService.hasFeatureAccess(school, feature);
  };

  const refreshSubscription = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    school,
    loading,
    error,
    currentPlan,
    subscriptionStatus,
    daysRemaining,
    hasFeatureAccess,
    hasActiveSubscription,
    isRestricted,
    availableActions,
    usageLimits,
    refreshSubscription
  };
}

/**
 * Hook for checking specific feature access
 */
export function useFeatureAccess(feature: string): {
  hasAccess: boolean;
  loading: boolean;
  reason?: string;
} {
  const { hasFeatureAccess, loading, isRestricted, hasActiveSubscription, currentPlan } = useSubscription();
  
  const hasAccess = hasFeatureAccess(feature);
  
  let reason: string | undefined;
  if (!hasAccess) {
    if (isRestricted) {
      reason = 'Account is restricted due to payment issues. Please contact billing.';
    } else if (!hasActiveSubscription) {
      reason = 'Subscription required for this feature.';
    } else if (currentPlan && !currentPlan.features.includes(feature)) {
      reason = `This feature is not available in your ${currentPlan.name} plan.`;
    }
  }

  return {
    hasAccess,
    loading,
    reason
  };
}

/**
 * Hook for checking usage limits
 */
export function useUsageLimits(): {
  canAddStudents: boolean;
  canAddTeachers: boolean;
  canAddClasses: boolean;
  storageAvailable: number;
  loading: boolean;
  warnings: string[];
} {
  const { school, currentPlan, usageLimits, loading } = useSubscription();

  if (!school || !currentPlan) {
    return {
      canAddStudents: false,
      canAddTeachers: false,
      canAddClasses: false,
      storageAvailable: 0,
      loading,
      warnings: []
    };
  }

  const canAddStudents = currentPlan.limits.maxStudents === -1 || 
    school.usage.currentStudents < currentPlan.limits.maxStudents;
  
  const canAddTeachers = currentPlan.limits.maxTeachers === -1 || 
    school.usage.currentTeachers < currentPlan.limits.maxTeachers;
  
  const canAddClasses = currentPlan.limits.maxClasses === -1 || 
    school.usage.currentClasses < currentPlan.limits.maxClasses;
  
  const storageAvailable = currentPlan.limits.maxStorage === -1 ? 
    Infinity : 
    Math.max(0, currentPlan.limits.maxStorage - school.usage.storageUsed);

  return {
    canAddStudents,
    canAddTeachers,
    canAddClasses,
    storageAvailable,
    loading,
    warnings: usageLimits.warnings
  };
}

/**
 * HOC for protecting features based on subscription
 */
export function withSubscriptionAccess<T extends object>(
  Component: React.ComponentType<T>,
  requiredFeature: string,
  fallbackComponent?: React.ComponentType
) {
  return function ProtectedComponent(props: T) {
    const { hasAccess, loading, reason } = useFeatureAccess(requiredFeature);

    if (loading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!hasAccess) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent {...props} />;
      }

      return (
        <div className="p-6 text-center">
          <div className="max-w-md mx-auto">
            <div className="rounded-full bg-yellow-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Feature Not Available</h3>
            <p className="text-gray-600 mb-4">{reason}</p>
            <button
              onClick={() => window.location.href = '/admin/settings'}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
