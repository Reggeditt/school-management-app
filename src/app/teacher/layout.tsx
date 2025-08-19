'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout } from '@/components/navigation/app-layout';
import { useAuth } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';

interface TeacherLayoutProps {
  children: ReactNode;
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const { user, signOut } = useAuth();

  const userInfo = user?.profile ? {
    name: user.profile.name || 'Teacher',
    email: user.email || '',
    role: user.role || 'teacher',
    avatar: undefined
  } : undefined;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <AppLayout 
        portalType="teacher" 
        userInfo={userInfo}
        onSignOut={handleSignOut}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </AppLayout>
    </ProtectedRoute>
  );
}
