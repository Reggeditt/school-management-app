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
  Bell,
  Plus,
  Eye,
  BarChart3,
  Award,
  Target,
  Zap
} from "lucide-react";

interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  gradedAssignments: number;
  todayAttendance: number;
  upcomingClasses: number;
  averageGrade: number;
  attendanceRate: number;
}

interface RecentActivity {
  id: string;
  type: 'assignment' | 'grade' | 'attendance' | 'message' | 'announcement';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'overdue' | 'new';
  priority?: 'low' | 'medium' | 'high';
}

interface UpcomingClass {
  id: string;
  className: string;
  subject: string;
  time: string;
  room: string;
  studentsCount: number;
  status: 'upcoming' | 'current' | 'completed';
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual data fetching
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock teacher stats
      const mockStats: TeacherStats = {
        totalClasses: 4,
        totalStudents: 125,
        pendingAssignments: 8,
        gradedAssignments: 15,
        todayAttendance: 95,
        upcomingClasses: 3,
        averageGrade: 8.2,
        attendanceRate: 92
      };

      // Mock recent activities
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'assignment',
          title: 'New Assignment Submitted',
          description: 'Sarah Johnson submitted Math Assignment #3',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          status: 'new',
          priority: 'medium'
        },
        {
          id: '2',
          type: 'message',
          title: 'Parent Message',
          description: 'New message from Michael Smith\'s parent',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          status: 'new',
          priority: 'high'
        },
        {
          id: '3',
          type: 'attendance',
          title: 'Attendance Marked',
          description: 'Grade 10A attendance completed for today',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          status: 'completed',
          priority: 'low'
        },
        {
          id: '4',
          type: 'grade',
          title: 'Grades Updated',
          description: 'Science test grades published for Grade 9B',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          status: 'completed',
          priority: 'medium'
        }
      ];

      // Mock upcoming classes
      const mockUpcomingClasses: UpcomingClass[] = [
        {
          id: '1',
          className: 'Grade 10A',
          subject: 'Mathematics',
          time: '09:00 - 10:00',
          room: 'Room 101',
          studentsCount: 28,
          status: 'upcoming'
        },
        {
          id: '2',
          className: 'Grade 9B',
          subject: 'Science',
          time: '11:00 - 12:00',
          room: 'Lab 02',
          studentsCount: 25,
          status: 'upcoming'
        },
        {
          id: '3',
          className: 'Grade 10B',
          subject: 'Mathematics',
          time: '14:00 - 15:00',
          room: 'Room 103',
          studentsCount: 30,
          status: 'upcoming'
        }
      ];

      setStats(mockStats);
      setRecentActivities(mockActivities);
      setUpcomingClasses(mockUpcomingClasses);
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
      case 'assignment': return <FileText className="h-4 w-4" />;
      case 'grade': return <Award className="h-4 w-4" />;
      case 'attendance': return <ClipboardList className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'announcement': return <Bell className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, status?: string) => {
    if (status === 'new') return 'text-blue-600';
    if (status === 'overdue') return 'text-red-600';
    
    switch (type) {
      case 'assignment': return 'text-purple-600';
      case 'grade': return 'text-green-600';
      case 'attendance': return 'text-orange-600';
      case 'message': return 'text-blue-600';
      case 'announcement': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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

  const teacherName = user?.profile?.name || user?.email?.split('@')[0] || 'Teacher';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {teacherName}!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your classes today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/teacher/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/teacher/assignments">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{stats?.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats?.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Assignments</p>
                <p className="text-2xl font-bold">{stats?.pendingAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
                <p className="text-2xl font-bold">{stats?.todayAttendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Your upcoming classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{classItem.className} - {classItem.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {classItem.time} • {classItem.room} • {classItem.studentsCount} students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{classItem.status}</Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/teacher/classes/${classItem.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingClasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No more classes scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Performance */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/teacher/attendance">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/teacher/assignments">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Assignment
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/teacher/grades">
                  <Award className="h-4 w-4 mr-2" />
                  Enter Grades
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/teacher/messages">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Average Grade</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats?.averageGrade}</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Attendance Rate</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{stats?.attendanceRate}%</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Graded Assignments</span>
                <span className="font-medium">{stats?.gradedAssignments}</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/teacher/analytics">
                  View Detailed Analytics
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activities
          </CardTitle>
          <CardDescription>Latest updates from your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className={`mt-1 ${getActivityColor(activity.type, activity.status)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {activity.status === 'new' && (
                      <Badge variant="destructive" className="text-xs">New</Badge>
                    )}
                    {activity.priority === 'high' && (
                      <Badge variant="outline" className="text-xs">High Priority</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}