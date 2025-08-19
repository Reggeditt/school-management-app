'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  roles?: string[];
}

export function AuthRedirect({ children, redirectTo = '/admin/dashboard', roles }: AuthRedirectProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Check if user has the required role
      if (roles && !roles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }

      // Redirect based on user role if no specific redirect provided
      const defaultRedirects: Record<string, string> = {
        admin: '/admin/dashboard',
        teacher: '/teacher/dashboard',
        student: '/student/dashboard',
        parent: '/parent/dashboard',
        staff: '/admin/dashboard'
      };

      const targetPath = redirectTo === '/admin/dashboard' 
        ? defaultRedirects[user.role] || '/admin/dashboard'
        : redirectTo;

      router.push(targetPath);
    }
  }, [user, loading, router, redirectTo, roles]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
