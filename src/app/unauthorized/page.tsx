import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-red-50 to-orange-100 dark:from-gray-900 dark:to-red-950">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-red-600 dark:text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/login">
                Sign In Again
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">
                Go Home
              </Link>
            </Button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Error Code: 403 - Forbidden
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
