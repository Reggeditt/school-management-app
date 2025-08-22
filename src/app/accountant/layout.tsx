'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout } from '@/components/navigation/app-layout';
import { useAuth } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';

interface AccountantLayoutProps {
  children: ReactNode;
}

export default function AccountantLayout({ children }: AccountantLayoutProps) {
  const { user, signOut } = useAuth();

  const userInfo = user?.profile ? {
    name: user.profile.name || 'Accountant',
    email: user.email || '',
    role: user.role || 'accountant',
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
    <ProtectedRoute requiredRole="accountant">
      <AppLayout 
        portalType="accountant" 
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
