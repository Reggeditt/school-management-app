'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { CommandMenu } from '@/components/command-menu';
import { ProtectedRoute } from '@/components/protected-route';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-background border-r">
        <div className="p-4">
          <h1 className="text-2xl font-bold">SchoolSync</h1>
          <p className="text-sm text-muted-foreground">Admin Portal</p>
        </div>
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/admin/dashboard" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/students" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Students
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/teachers" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Teachers
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/classes" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Classes
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/subjects" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Subjects
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/attendance" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Attendance
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/exams" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exams
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/settings" 
                className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div>
            {/* Breadcrumb or page title can go here */}
          </div>
          <div className="flex items-center space-x-4">
            <CommandMenu />
            <ThemeToggle />
            <div className="relative">
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-sm hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {user?.profile?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <span>{user?.profile?.name || 'Admin User'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute requiredRole="admin">
        <AdminLayoutContent>
          {children}
        </AdminLayoutContent>
      </ProtectedRoute>
    </AuthProvider>
  );
}