'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Calendar, ClipboardList, Award, BookOpen, Clock, TrendingUp } from 'lucide-react';

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const { state, loadClasses, loadStudents, loadAttendance, loadSubjects } = useStore();

  useEffect(() => {
    loadClasses();
    loadStudents();
    loadAttendance();
    loadSubjects();
  }, [loadClasses, loadStudents, loadAttendance, loadSubjects]);

  if (state.loading.classes || state.loading.students) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // Get teacher's classes and students
  const teacherId = user?.uid || '';
  const teacherClasses = state.classes?.filter(cls => cls.classTeacherId === teacherId) || [];
  const teacherStudents = state.students?.filter(student => 
    teacherClasses.some(cls => cls.students?.includes(student.id))
  ) || [];

  // Calculate today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = state.attendance?.filter(att => {
    const attDate = new Date(att.date).toISOString().split('T')[0];
    return attDate === today && teacherClasses.some(cls => cls.id === att.classId);
  }) || [];

  // Get upcoming assignments (mock data for now)
  const upcomingAssignments = [
    { id: '1', title: 'Math Homework Chapter 5', dueDate: '2024-03-25', class: 'Grade 10-A' },
    { id: '2', title: 'Science Lab Report', dueDate: '2024-03-27', class: 'Grade 10-B' },
    { id: '3', title: 'English Essay', dueDate: '2024-03-30', class: 'Grade 9-A' },
  ];

  // Recent activities (mock data)
  const recentActivities = [
    { id: '1', action: 'Marked attendance for Grade 10-A', time: '2 hours ago' },
    { id: '2', action: 'Graded Math quiz for Grade 10-B', time: '5 hours ago' },
    { id: '3', action: 'Created new assignment for Grade 9-A', time: '1 day ago' },
    { id: '4', action: 'Updated lesson plan for Chemistry', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.profile?.name || 'Teacher'}!
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active class sections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherStudents.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAttendance.length}</div>
            <p className="text-xs text-muted-foreground">
              Classes marked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">
              To be graded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>Your assigned class sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teacherClasses.length > 0 ? (
                teacherClasses.map(cls => (
                  <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Grade {cls.grade} • {cls.students?.length || 0} students
                      </div>
                    </div>
                    <Badge variant="outline">{cls.section || 'A'}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No classes assigned yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>Assignments due soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAssignments.map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{assignment.title}</div>
                    <div className="text-sm text-muted-foreground">{assignment.class}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{assignment.dueDate}</div>
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Due Soon
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>This week's summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Classes Taught</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">12</Badge>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Assignments Graded</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">8</Badge>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance Marked</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">5 days</Badge>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Avg Class Attendance</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">94%</Badge>
                  <TrendingUp className="h-3 w-3 text-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
