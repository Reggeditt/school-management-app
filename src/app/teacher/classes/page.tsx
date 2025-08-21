'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Calendar, 
  MapPin, 
  BookOpen, 
  TrendingUp,
  Search,
  Filter,
  ChevronRight,
  GraduationCap,
  Clock,
  UserCheck,
  AlertCircle,
  Grid3X3,
  List
} from 'lucide-react';

// Custom hooks and components
import { useTeacherData } from '@/hooks/teacher';
import { Class, Student } from '@/lib/database-services';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'grade' | 'section';

interface ClassStats {
  totalStudents: number;
  averageAttendance: number;
  pendingGrades: number;
}

export default function TeacherClassesPage() {
  const { 
    teacherClasses, 
    teacherStudents, 
    loading, 
    error, 
    getStudentsForClass 
  } = useTeacherData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [classStats, setClassStats] = useState<{ [classId: string]: ClassStats }>({});

  // Calculate stats for each class
  useEffect(() => {
    const stats: { [classId: string]: ClassStats } = {};
    
    teacherClasses.forEach((classItem) => {
      const classStudents = getStudentsForClass(classItem.id);
      stats[classItem.id] = {
        totalStudents: classStudents.length,
        averageAttendance: Math.floor(Math.random() * 20) + 80, // Mock data
        pendingGrades: Math.floor(Math.random() * 10) + 1 // Mock data
      };
    });
    
    setClassStats(stats);
  }, [teacherClasses, teacherStudents]); // Use teacherStudents instead of getStudentsForClass

  // Filter classes based on search and grade
  const filteredClasses = teacherClasses.filter((classItem) => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.section.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === 'all' || classItem.grade === selectedGrade;
    
    return matchesSearch && matchesGrade;
  });

  // Get unique grades for filter
  const availableGrades = Array.from(new Set(teacherClasses.map(cls => cls.grade))).sort();

  const ClassGridItem = ({ classItem }: { classItem: Class }) => {
    const stats = classStats[classItem.id];
    const students = getStudentsForClass(classItem.id);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{classItem.name}</CardTitle>
              <CardDescription>
                Grade {classItem.grade} • Section {classItem.section}
              </CardDescription>
            </div>
            <Badge variant={stats?.averageAttendance > 90 ? "default" : "secondary"}>
              {stats?.averageAttendance || 0}% Attendance
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats?.totalStudents || 0}</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats?.averageAttendance || 0}%</div>
              <div className="text-xs text-muted-foreground">Attendance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats?.pendingGrades || 0}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </div>

          {/* Class Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              Room {classItem.roomNumber}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              Academic Year {classItem.academicYear}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2" />
              {classItem.currentStrength}/{classItem.maxCapacity} capacity
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/teacher/classes/${classItem.id}`}>
                <ChevronRight className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/teacher/attendance?class=${classItem.id}`}>
                <UserCheck className="h-4 w-4 mr-1" />
                Attendance
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ClassListItem = ({ classItem }: { classItem: Class }) => {
    const stats = classStats[classItem.id];
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{classItem.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Grade {classItem.grade} • Section {classItem.section}</span>
                  <span>•</span>
                  <span>{stats?.totalStudents || 0} students</span>
                  <span>•</span>
                  <span>Room {classItem.roomNumber}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium">{stats?.averageAttendance || 0}% Attendance</div>
                <div className="text-xs text-muted-foreground">
                  {stats?.pendingGrades || 0} pending grades
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/teacher/attendance?class=${classItem.id}`}>
                    <UserCheck className="h-4 w-4 mr-1" />
                    Attendance
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/teacher/classes/${classItem.id}`}>
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Classes</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Classes</h1>
        <p className="text-muted-foreground">
          Manage and view details of your assigned classes
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherClasses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.values(classStats).reduce((sum, stats) => sum + stats.totalStudents, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(classStats).length > 0 
                ? Math.round(Object.values(classStats).reduce((sum, stats) => sum + stats.averageAttendance, 0) / Object.values(classStats).length)
                : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Object.values(classStats).reduce((sum, stats) => sum + stats.pendingGrades, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search classes by name, grade, or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {availableGrades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                Grade {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Classes List/Grid */}
      {filteredClasses.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        }>
          {filteredClasses.map((classItem) => (
            viewMode === 'grid' ? (
              <ClassGridItem key={classItem.id} classItem={classItem} />
            ) : (
              <ClassListItem key={classItem.id} classItem={classItem} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {searchTerm || selectedGrade !== 'all' ? (
            <>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Classes Found</h3>
              <p className="text-muted-foreground">
                No classes match your search criteria. Try adjusting your filters.
              </p>
            </>
          ) : (
            <>
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Classes Assigned</h3>
              <p className="text-muted-foreground">
                Contact your administration to get classes assigned to you.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
