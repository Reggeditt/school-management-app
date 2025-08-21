'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useTeacherData } from '@/hooks/teacher';
import { StudentsList } from "@/components/teacher/students-list";
import Link from "next/link";
import { 
  Users, 
  Filter,
  TrendingUp,
  Mail,
  Calendar,
  BookOpen,
  Award,
  UserCheck,
  GraduationCap,
  Grid3X3,
  List,
  Download,
  Plus
} from 'lucide-react';

type ViewMode = 'grid' | 'list';

export default function TeacherStudentsPage() {
  const { 
    classes: teacherClasses, 
    students: teacherStudents, 
    loading, 
    error,
    refreshStudents,
    dashboardStats
  } = useTeacherData();

  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Filter students based on selected class
  const filteredStudents = (teacherStudents || []).filter(student => {
    if (selectedClass === 'all') return true;
    return student.classId === selectedClass;
  });

  // Get unique classes for filter
  const availableClasses = [
    { id: 'all', name: 'All Classes' },
    ...teacherClasses.map(cls => ({
      id: cls.id,
      name: `${cls.name} (${cls.studentsCount} students)`
    }))
  ];

  // Handle search change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Handle class selection
  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    if (classId !== 'all') {
      refreshStudents(classId);
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
          <p className="text-gray-600 mt-1">
            Monitor student progress and manage class rosters
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => refreshStudents()}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/teacher/attendance">
              <Plus className="h-4 w-4 mr-2" />
              Take Attendance
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {dashboardStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across {dashboardStats.totalClasses} classes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.todayAttendance}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((dashboardStats.todayAttendance / dashboardStats.totalStudents) * 100)}% attendance rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.averageGrade}%</div>
              <p className="text-xs text-muted-foreground">
                Class performance
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.pendingAssignments}</div>
              <p className="text-xs text-muted-foreground">
                Assignments to grade
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Students Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Students Overview</CardTitle>
              <CardDescription>
                {filteredStudents.length} of {teacherStudents.length} students
                {selectedClass !== 'all' && ' in selected class'}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={selectedClass} onValueChange={handleClassChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Students List */}
          <StudentsList
            students={filteredStudents}
            loading={loading}
            viewMode={viewMode}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            showActions={true}
            emptyMessage={
              selectedClass === 'all' 
                ? "No students found. Make sure you have classes assigned."
                : "No students found in the selected class."
            }
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/attendance" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Take Attendance</h3>
                  <p className="text-sm text-gray-500">Mark student attendance</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/grades" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Grade Assignments</h3>
                  <p className="text-sm text-gray-500">Review and grade work</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/messages" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Mail className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Contact Parents</h3>
                  <p className="text-sm text-gray-500">Send messages to parents</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/analytics" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Analytics</h3>
                  <p className="text-sm text-gray-500">Student performance data</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
