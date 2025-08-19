'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { AppLayout } from '@/components/navigation/app-layout';
import { useAuth } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/error-boundary';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut } = useAuth();

  const userInfo = user?.profile ? {
    name: user.profile.name || 'Admin User',
    email: user.email || '',
    role: user.role || 'admin',
    avatar: undefined
  } : undefined;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {}
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <AppLayout 
        portalType="admin" 
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