'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Calendar, 
  BookOpen, 
  TrendingUp,
  MessageSquare,
  ClipboardCheck,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  GraduationCap,
  FileText
} from 'lucide-react';

// Custom hooks and components
import { useTeacherData } from '@/hooks/teacher';
import { useAuth } from '@/contexts/auth-context';

interface DashboardStats {
  totalClasses: number;
  totalStudents: number;
  todayAttendanceRate: number;
  pendingTasks: number;
  avgClassSize: number;
  completedAssignments: number;
}

interface TodaySchedule {
  id: string;
  className: string;
  subject: string;
  time: string;
  room: string;
  status: 'upcoming' | 'current' | 'completed';
}

interface RecentActivity {
  id: string;
  type: 'attendance' | 'grade' | 'assignment' | 'message';
  title: string;
  description: string;
  time: string;
  className?: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { 
    teacherClasses, 
    teacherStudents, 
    loading, 
    error 
  } = useTeacherData();

  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    todayAttendanceRate: 0,
    pendingTasks: 0,
    avgClassSize: 0,
    completedAssignments: 0
  });

  const [todaySchedule] = useState<TodaySchedule[]>([
    {
      id: '1',
      className: 'Class 10A',
      subject: 'Mathematics',
      time: '08:00 - 08:45',
      room: 'R101',
      status: 'completed'
    },
    {
      id: '2',
      className: 'Class 10B',
      subject: 'Mathematics',
      time: '09:00 - 09:45',
      room: 'R102',
      status: 'current'
    },
    {
      id: '3',
      className: 'Class 9A',
      subject: 'Algebra',
      time: '10:30 - 11:15',
      room: 'R101',
      status: 'upcoming'
    }
  ]);

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'attendance',
      title: 'Attendance Marked',
      description: 'Class 10A - 35/40 students present',
      time: '2 hours ago',
      className: 'Class 10A'
    },
    {
      id: '2',
      type: 'assignment',
      title: 'New Assignment Submitted',
      description: 'John Adebayo submitted Algebra Homework',
      time: '4 hours ago',
      className: 'Class 9A'
    },
    {
      id: '3',
      type: 'grade',
      title: 'Grades Updated',
      description: 'Mathematics Quiz grades posted',
      time: '1 day ago',
      className: 'Class 10B'
    }
  ]);

  // Calculate stats when data loads
  useEffect(() => {
    if (teacherClasses.length > 0 && teacherStudents.length > 0) {
      const totalStudents = teacherStudents.length;
      const avgClassSize = Math.round(totalStudents / teacherClasses.length);
      
      setStats({
        totalClasses: teacherClasses.length,
        totalStudents,
        todayAttendanceRate: 92, // Mock data - would be calculated from actual attendance
        pendingTasks: 8, // Mock data
        avgClassSize,
        completedAssignments: 15 // Mock data
      });
    }
  }, [teacherClasses, teacherStudents]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'current':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'upcoming':
        return <Calendar className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <ClipboardCheck className="h-4 w-4 text-blue-500" />;
      case 'grade':
        return <Award className="h-4 w-4 text-green-500" />;
      case 'assignment':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-orange-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-96" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.profile?.name || 'Teacher'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening in your classes today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Avg {stats.avgClassSize} students per class
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all your classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.todayAttendanceRate}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Grades & assignments to review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Your classes for {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher/schedule">
                View Full Schedule
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaySchedule.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="font-medium">{item.className}</p>
                    <p className="text-sm text-muted-foreground">{item.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.time}</p>
                  <p className="text-xs text-muted-foreground">{item.room}</p>
                </div>
              </div>
            ))}
            {todaySchedule.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Classes Today</h3>
                <p className="text-muted-foreground">Enjoy your free day!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/teacher/attendance">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Mark Attendance
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/teacher/grades">
                <BookOpen className="mr-2 h-4 w-4" />
                Enter Grades
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/teacher/students">
                <Users className="mr-2 h-4 w-4" />
                View Students
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/teacher/classes">
                <GraduationCap className="mr-2 h-4 w-4" />
                My Classes
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" disabled>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
              <Badge variant="secondary" className="ml-auto">Soon</Badge>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/teacher/schedule">
                <Calendar className="mr-2 h-4 w-4" />
                View Schedule
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & My Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <div className="flex items-center mt-1 space-x-2">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    {activity.className && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.className}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                <p className="text-muted-foreground">Your recent actions will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Classes Quick Access */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Classes</CardTitle>
              <CardDescription>Quick access to your assigned classes</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/teacher/classes">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {teacherClasses.slice(0, 4).map((classItem) => (
              <Link
                key={classItem.id}
                href={`/teacher/classes/${classItem.id}`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{classItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {classItem.currentStrength} students • Room {classItem.roomNumber}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {teacherClasses.length === 0 && (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Classes Assigned</h3>
                <p className="text-muted-foreground">Contact administration to get classes assigned</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
