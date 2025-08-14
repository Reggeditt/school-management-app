'use client';

import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Home,
  LogOut,
  User,
  FileText,
  Clock,
  Star,
  Bell,
  Settings
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps) {
  const { user, signOut } = useAuth();
  const { state } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'student') {
      router.push('/unauthorized');
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  // Find current student data
  const currentStudent = state.students.find(s => s.email === user?.email);

  if (!user || user.role !== 'student') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Student Portal
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentStudent ? `${currentStudent.firstName} ${currentStudent.lastName}` : user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt="Student Avatar" />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {currentStudent ? 
                        `${currentStudent.firstName[0]}${currentStudent.lastName[0]}` : 
                        user.email?.[0].toUpperCase()
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {currentStudent ? 
                        `${currentStudent.firstName} ${currentStudent.lastName}` : 
                        'Student'
                      }
                    </CardTitle>
                    {currentStudent && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">ID: {currentStudent.studentId}</p>
                        <Badge variant="secondary" className="text-xs">
                          Grade {currentStudent.grade}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <nav className="space-y-1">
                  <Link href="/student/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-3" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/student/profile">
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Button>
                  </Link>
                  <Link href="/student/grades">
                    <Button variant="ghost" className="w-full justify-start">
                      <Star className="h-4 w-4 mr-3" />
                      Grades & Results
                    </Button>
                  </Link>
                  <Link href="/student/attendance">
                    <Button variant="ghost" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-3" />
                      Attendance
                    </Button>
                  </Link>
                  <Link href="/student/subjects">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-3" />
                      My Subjects
                    </Button>
                  </Link>
                  <Link href="/student/schedule">
                    <Button variant="ghost" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-3" />
                      Class Schedule
                    </Button>
                  </Link>
                  <Link href="/student/assignments">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-3" />
                      Assignments
                    </Button>
                  </Link>
                  
                  <Separator className="my-4" />
                  
                  <Link href="/student/settings">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </Link>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
