import React from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { getSubscriptionStatusColor, getSubscriptionStatusText, PricingCalculator } from '@/lib/subscription-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, Users, BookOpen, HardDrive, Calendar } from 'lucide-react';

/**
 * Subscription Status Card - Shows current plan and status
 */
export function SubscriptionStatusCard() {
  const { 
    school,
    currentPlan, 
    subscriptionStatus, 
    daysRemaining, 
    loading,
    isRestricted,
    usageLimits 
  } = useSubscription();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!currentPlan || !subscriptionStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Subscription Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Unable to load subscription information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{currentPlan.name}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{currentPlan.description}</p>
          </div>
          <Badge className={getSubscriptionStatusColor(subscriptionStatus)}>
            {getSubscriptionStatusText(subscriptionStatus)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing Info */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Current Term Cost</span>
          </div>
          <div className="text-right">
            {school && (
              <>
                <span className="text-lg font-bold">
                  {PricingCalculator.getDisplayPrice(currentPlan, school.usage.currentStudents)}
                </span>
                <p className="text-xs text-green-600">
                  Per student: {currentPlan.price.currency} {currentPlan.price.perStudentPerTerm}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Current Term Info */}
        {school?.subscription.currentTerm && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-sm font-medium text-blue-800">
                  {school.subscription.currentTerm.name}
                </span>
                <p className="text-xs text-blue-600">
                  {school.subscription.currentTerm.studentCount} students enrolled
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Days Remaining */}
        {daysRemaining && (
          <div className={`p-3 rounded-lg ${
            daysRemaining.type === 'active' ? 'bg-green-50' :
            daysRemaining.type === 'grace' ? 'bg-yellow-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center space-x-2">
              <Calendar className={`w-4 h-4 ${
                daysRemaining.type === 'active' ? 'text-green-600' :
                daysRemaining.type === 'grace' ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <span className="text-sm font-medium">{daysRemaining.message}</span>
            </div>
          </div>
        )}

        {/* Usage Warnings */}
        {!usageLimits.withinLimits && (
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Usage Limits Exceeded</p>
                <ul className="text-xs text-red-600 mt-1 space-y-1">
                  {usageLimits.exceeded.map((limit, index) => (
                    <li key={index}>• {limit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Warning for approaching limits */}
        {usageLimits.warnings.length > 0 && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Approaching Limits</p>
                <ul className="text-xs text-yellow-600 mt-1 space-y-1">
                  {usageLimits.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {isRestricted && (
            <Button className="w-full" variant="destructive">
              <CreditCard className="w-4 h-4 mr-2" />
              Update Payment Method
            </Button>
          )}
          
          <Button variant="outline" className="w-full">
            View Usage Details
          </Button>
          
          <Button variant="outline" className="w-full">
            Change Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Usage Overview Component - Shows current usage vs limits
 */
export function UsageOverview() {
  const { school, currentPlan, loading } = useSubscription();

  if (loading || !school || !currentPlan) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const getUsagePercentage = (current: number, max: number) => {
    if (max === -1) return 0; // Unlimited
    return Math.min((current / max) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const usageMetrics = [
    {
      label: 'Students',
      icon: Users,
      current: school.usage.currentStudents,
      max: currentPlan.limits.maxStudents,
      percentage: getUsagePercentage(school.usage.currentStudents, currentPlan.limits.maxStudents)
    },
    {
      label: 'Teachers',
      icon: Users,
      current: school.usage.currentTeachers,
      max: currentPlan.limits.maxTeachers,
      percentage: getUsagePercentage(school.usage.currentTeachers, currentPlan.limits.maxTeachers)
    },
    {
      label: 'Classes',
      icon: BookOpen,
      current: school.usage.currentClasses,
      max: currentPlan.limits.maxClasses,
      percentage: getUsagePercentage(school.usage.currentClasses, currentPlan.limits.maxClasses)
    },
    {
      label: 'Storage (MB)',
      icon: HardDrive,
      current: school.usage.storageUsed,
      max: currentPlan.limits.maxStorage,
      percentage: getUsagePercentage(school.usage.storageUsed, currentPlan.limits.maxStorage)
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Usage Overview</CardTitle>
        <p className="text-sm text-gray-600">Current usage compared to plan limits</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {usageMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{metric.label}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {metric.current.toLocaleString()} / {metric.max === -1 ? '∞' : metric.max.toLocaleString()}
                </span>
              </div>
              {metric.max !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(metric.percentage)}`}
                    style={{ width: `${metric.percentage}%` }}
                  ></div>
                </div>
              )}
              {metric.max === -1 && (
                <div className="text-xs text-green-600 font-medium">Unlimited</div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * Quick Access Control Status - Small status indicator
 */
export function QuickSubscriptionStatus() {
  const { subscriptionStatus, daysRemaining, isRestricted, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-xs text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!subscriptionStatus) return null;

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        subscriptionStatus === 'active' ? 'bg-green-500' :
        subscriptionStatus === 'grace_period' ? 'bg-yellow-500' :
        'bg-red-500'
      }`}></div>
      <span className={`text-xs ${
        isRestricted ? 'text-red-600' : 'text-gray-600'
      }`}>
        {daysRemaining?.type === 'grace' ? `${daysRemaining.days}d grace` :
         daysRemaining?.type === 'expired' ? 'Restricted' :
         getSubscriptionStatusText(subscriptionStatus)}
      </span>
    </div>
  );
}

/**
 * Feature Access Gate - Wraps content that requires specific access
 */
interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgrade?: boolean;
}

export function FeatureGate({ feature, children, fallback, showUpgrade = true }: FeatureGateProps) {
  const { hasFeatureAccess, isRestricted, currentPlan } = useSubscription();

  if (hasFeatureAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
      <div className="max-w-sm mx-auto">
        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">
          {isRestricted ? 'Account Restricted' : 'Feature Not Available'}
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          {isRestricted ? 
            'Please update your payment method to restore access.' :
            `This feature requires a higher plan than ${currentPlan?.name || 'your current plan'}.`
          }
        </p>
        {showUpgrade && (
          <Button size="sm" variant="outline">
            {isRestricted ? 'Update Payment' : 'Upgrade Plan'}
          </Button>
        )}
      </div>
    </div>
  );
}
