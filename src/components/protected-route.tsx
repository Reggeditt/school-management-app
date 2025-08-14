'use client'

import { useAuth, UserRole } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Redirect if not authenticated
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      // Check role-based access
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!allowedRoles.includes(user.role)) {
          // Redirect to appropriate dashboard based on user role
          const dashboardPath = user.role === 'admin' ? '/admin/dashboard' :
                               user.role === 'teacher' ? '/teacher/dashboard' :
                               user.role === 'student' ? '/student/dashboard' :
                               user.role === 'parent' ? '/parent/dashboard' : '/';
          router.push(dashboardPath);
          return;
        }
      }
    }
  }, [user, loading, requiredRole, router, fallbackPath]);

  // Show loading skeleton while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex">
        <div className="w-64 border-r p-4">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or doesn't have required role
  if (!user) {
    return null;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(user.role)) {
      return null;
    }
  }

  return <>{children}</>;
}
