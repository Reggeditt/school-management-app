'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  Bell
} from "lucide-react";

interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  gradedAssignments: number;
  todayAttendance: number;
  upcomingClasses: number;
}

interface RecentActivity {
  id: string;
  type: 'assignment' | 'grade' | 'attendance' | 'message';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'overdue';
}

interface UpcomingClass {
  id: string;
  className: string;
  subject: string;
  time: string;
  room: string;
  studentsCount: number;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStats>({
    totalClasses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    gradedAssignments: 0,
    todayAttendance: 0,
    upcomingClasses: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Simulate loading dashboard data
      // In real implementation, these would be API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setStats({
        totalClasses: 5,
        totalStudents: 142,
        pendingAssignments: 8,
        gradedAssignments: 15,
        todayAttendance: 95,
        upcomingClasses: 3,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'assignment',
          title: 'Math Quiz Submitted',
          description: '12 new submissions from Grade 10A',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          status: 'pending'
        },
        {
          id: '2',
          type: 'grade',
          title: 'Science Test Graded',
          description: 'Completed grading for Grade 9B',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: '3',
          type: 'attendance',
          title: 'Attendance Updated',
          description: 'Morning attendance for all classes',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          status: 'completed'
        },
        {
          id: '4',
          type: 'message',
          title: 'Parent Message',
          description: 'New message from Sarah Johnson\'s parent',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          status: 'pending'
        }
      ]);

      setUpcomingClasses([
        {
          id: '1',
          className: 'Grade 10A',
          subject: 'Mathematics',
          time: '10:00 AM',
          room: 'Room 201',
          studentsCount: 28
        },
        {
          id: '2',
          className: 'Grade 9B',
          subject: 'Science',
          time: '11:30 AM',
          room: 'Lab 1',
          studentsCount: 25
        },
        {
          id: '3',
          className: 'Grade 10B',
          subject: 'Mathematics',
          time: '2:00 PM',
          room: 'Room 201',
          studentsCount: 30
        }
      ]);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'grade':
        return <GraduationCap className="h-4 w-4" />;
      case 'attendance':
        return <ClipboardList className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Teacher'}!</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your classes today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/teacher/classes">
              <Users className="mr-2 h-4 w-4" />
              View Classes
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
                <p className="text-2xl font-bold">{stats.pendingAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold">{stats.todayAttendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Today&apos;s Classes
            </CardTitle>
            <CardDescription>
              Your upcoming classes for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{classItem.subject}</h4>
                      <Badge variant="outline">{classItem.className}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {classItem.time}
                      </span>
                      <span>{classItem.room}</span>
                      <span>{classItem.studentsCount} students</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/teacher/classes/${classItem.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-2">No classes scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest activities and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      {activity.status && (
                        <Badge variant="outline" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Bell className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-2">No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions for efficient classroom management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/teacher/attendance">
                <ClipboardList className="h-6 w-6 mb-2" />
                Take Attendance
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/teacher/assignments">
                <FileText className="h-6 w-6 mb-2" />
                Create Assignment
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/teacher/grades">
                <GraduationCap className="h-6 w-6 mb-2" />
                Grade Work
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/teacher/resources">
                <BookOpen className="h-6 w-6 mb-2" />
                Add Resources
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
