'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useTeacherData } from "@/hooks/teacher";
import { DashboardStats } from "@/components/teacher/dashboard-stats";
import Link from "next/link";
import {
  Calendar,
  ClipboardList,
  MessageSquare,
  Bell,
  Plus,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Users
} from "lucide-react";

interface RecentActivity {
  id: string;
  type: 'assignment' | 'grade' | 'attendance' | 'message' | 'announcement';
  title: string;
  description: string;
  timestamp: Date;
  status?: 'pending' | 'completed' | 'overdue' | 'new';
  priority?: 'high' | 'medium' | 'low';
}

interface UpcomingClass {
  id: string;
  className: string;
  subject: string;
  time: string;
  room: string;
  studentsCount: number;
  duration: string;
  nextTopic?: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    loading, 
    error, 
    teacherData, 
    classes, 
    students, 
    dashboardStats, 
    refreshData 
  } = useTeacherData();

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    // Load additional dashboard data
    loadRecentActivities();
    loadUpcomingClasses();
  }, [classes]);

  const loadRecentActivities = async () => {
    // Mock recent activities - in real app, this would come from the service
    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'assignment',
        title: 'Mathematics Assignment #5',
        description: 'New assignment submitted by 15 students',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'new',
        priority: 'medium'
      },
      {
        id: '2',
        type: 'grade',
        title: 'Science Quiz Results',
        description: 'Graded 25 quiz papers for Grade 10A',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'completed',
        priority: 'low'
      },
      {
        id: '3',
        type: 'attendance',
        title: 'Attendance Alert',
        description: '3 students with low attendance in Grade 9B',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'pending',
        priority: 'high'
      },
      {
        id: '4',
        type: 'message',
        title: 'Parent Message',
        description: 'New message from Sarah Johnson\'s parent',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        status: 'new',
        priority: 'medium'
      }
    ];
    setRecentActivities(mockActivities);
  };

  const loadUpcomingClasses = async () => {
    // Mock upcoming classes - in real app, this would come from the service
    const mockUpcomingClasses: UpcomingClass[] = [
      {
        id: '1',
        className: 'Grade 10A',
        subject: 'Mathematics',
        time: '09:00 AM',
        room: 'Room 201',
        studentsCount: 28,
        duration: '45 min',
        nextTopic: 'Quadratic Equations'
      },
      {
        id: '2',
        className: 'Grade 10B',
        subject: 'Mathematics',
        time: '10:30 AM',
        room: 'Room 201',
        studentsCount: 30,
        duration: '45 min',
        nextTopic: 'Algebraic Expressions'
      },
      {
        id: '3',
        className: 'Grade 9B',
        subject: 'Science',
        time: '02:00 PM',
        room: 'Lab 1',
        studentsCount: 25,
        duration: '60 min',
        nextTopic: 'Chemical Reactions'
      }
    ];
    setUpcomingClasses(mockUpcomingClasses);
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'assignment': return ClipboardList;
      case 'grade': return BookOpen;
      case 'attendance': return Users;
      case 'message': return MessageSquare;
      case 'announcement': return Bell;
      default: return Bell;
    }
  };

  const getActivityColor = (priority: RecentActivity['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      case 'new': return Bell;
      default: return Clock;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        <DashboardStats stats={{
          totalClasses: 0,
          totalStudents: 0,
          pendingAssignments: 0,
          gradedAssignments: 0,
          todayAttendance: 0,
          upcomingClasses: 0,
          averageGrade: 0,
          attendanceRate: 0
        }} loading={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {teacherData?.firstName || user?.email?.split('@')[0] || 'Teacher'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your classes today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <Link href="/teacher/messages">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
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

      {/* Dashboard Stats */}
      {dashboardStats && (
        <DashboardStats stats={dashboardStats} loading={loading} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Classes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Today's Classes</CardTitle>
              <CardDescription>Your schedule for today</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/teacher/schedule">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No classes scheduled for today</p>
            ) : (
              upcomingClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {classItem.className} - {classItem.subject}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {classItem.time}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      {classItem.room} • {classItem.studentsCount} students • {classItem.duration}
                    </p>
                    {classItem.nextTopic && (
                      <p className="text-xs text-blue-600 mt-1">
                        Topic: {classItem.nextTopic}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No recent activities</p>
            ) : (
              recentActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const StatusIcon = getStatusIcon(activity.status);
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.priority)}`}>
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.description}
                      </p>
                      {activity.status && (
                        <Badge variant="outline" className="mt-2 text-xs">
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/teacher/attendance">
                <Users className="h-6 w-6" />
                <span>Take Attendance</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/teacher/assignments">
                <ClipboardList className="h-6 w-6" />
                <span>Create Assignment</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/teacher/grades">
                <BookOpen className="h-6 w-6" />
                <span>Grade Papers</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
              <Link href="/teacher/analytics">
                <Eye className="h-6 w-6" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
