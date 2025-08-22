'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { DemoSeedButton } from '@/components/demo-seed-button';
import { DemoDeleteButton } from '@/components/demo-delete-button';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { state, loadDashboardData } = useStore();

  useEffect(() => {
    if (user?.profile?.schoolId) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  if (state.loading.dashboard) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-muted-foreground mt-1">
            Welcome back, Admin!
          </div>
        </div>
        <div className="flex gap-3">
          <DemoSeedButton />
          <DemoDeleteButton />
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.stats.totalTeachers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.stats.totalClasses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all grades</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.67 0 3.2.46 4.53 1.25" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.stats.attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Today&apos;s attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>Latest student registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.students.slice(0, 5).map((student) => (
              <div key={student.id} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Grade {student.grade}{student.section} • Roll No: {student.rollNumber}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {student.status === 'active' ? '✅' : '❌'}
                </div>
              </div>
            ))}
            {state.students.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No students found. Add students using the Students page.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Teachers */}
        <Card>
          <CardHeader>
            <CardTitle>Teaching Staff</CardTitle>
            <CardDescription>Active teachers and their departments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.teachers.slice(0, 5).map((teacher) => (
              <div key={teacher.id} className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {teacher.firstName} {teacher.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {teacher.department} • {teacher.designation}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {teacher.experience}y exp
                </div>
              </div>
            ))}
            {state.teachers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No teachers found. Add teachers using the Teachers page.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Classes Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Classes Overview</CardTitle>
          <CardDescription>Current class structure and capacity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {state.classes.map((classItem) => (
              <div key={classItem.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{classItem.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    classItem.currentStrength >= classItem.maxCapacity * 0.9 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  }`}>
                    {classItem.currentStrength}/{classItem.maxCapacity}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Room: {classItem.roomNumber}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(classItem.currentStrength / classItem.maxCapacity) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((classItem.currentStrength / classItem.maxCapacity) * 100)}% capacity
                </p>
              </div>
            ))}
            {state.classes.length === 0 && (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No classes found. Add classes using the Classes page.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {Object.keys(state.errors).length > 0 && (
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(state.errors).map(([key, error]) => 
              error && (
                <p key={key} className="text-sm text-red-600 dark:text-red-400">
                  {key}: {error}
                </p>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
