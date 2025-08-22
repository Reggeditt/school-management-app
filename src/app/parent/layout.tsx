'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout } from '@/components/navigation/app-layout';
import { useAuth } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';

interface ParentLayoutProps {
  children: ReactNode;
}

export default function ParentLayout({ children }: ParentLayoutProps) {
  const { user, signOut } = useAuth();

  const userInfo = user?.profile ? {
    name: user.profile.name || 'Parent',
    email: user.email || '',
    role: user.role || 'parent',
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
    <ProtectedRoute requiredRole="parent">
      <AppLayout 
        portalType="parent" 
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
