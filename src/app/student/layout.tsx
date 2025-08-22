'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout } from '@/components/navigation/app-layout';
import { useAuth } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';

interface StudentLayoutProps {
  children: ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const { user, signOut } = useAuth();

  const userInfo = user?.profile ? {
    name: user.profile.name || 'Student',
    email: user.email || '',
    role: user.role || 'student',
    avatar: undefined
  } : undefined;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      // Handle logout error silently
    }
  };

  return (
    <ProtectedRoute requiredRole="student">
      <AppLayout 
        portalType="student" 
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
