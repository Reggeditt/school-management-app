'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  UserCheck,
  GraduationCap,
  Grid3X3,
  List,
  ChevronRight
} from 'lucide-react';

// Custom hooks and services
import { useTeacherData } from '@/hooks/teacher';
import { Student } from '@/lib/database-services';

interface StudentAnalytics {
  attendancePercentage: number;
  gradeAverage: number;
  letterGrade: string;
  attendanceTrend: 'up' | 'down' | 'stable';
  gradeTrend: 'up' | 'down' | 'stable';
  lastAttendance: string;
  classesEnrolled: number;
}

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'grade' | 'performance' | 'attendance';

export default function TeacherStudentsPage() {
  const { 
    teacherClasses, 
    teacherStudents, 
    loading, 
    error 
  } = useTeacherData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [studentAnalytics, setStudentAnalytics] = useState<{ [studentId: string]: StudentAnalytics }>({});

  // Generate mock analytics for students
  useEffect(() => {
    const analytics: { [studentId: string]: StudentAnalytics } = {};
    
    teacherStudents.forEach(student => {
      const attendance = Math.floor(Math.random() * 30) + 70; // 70-100%
      const grade = Math.floor(Math.random() * 30) + 70; // 70-100%
      const trends = ['up', 'down', 'stable'] as const;
      
      analytics[student.id] = {
        attendancePercentage: attendance,
        gradeAverage: grade,
        letterGrade: grade >= 90 ? 'A' : grade >= 80 ? 'B' : grade >= 70 ? 'C' : grade >= 60 ? 'D' : 'F',
        attendanceTrend: trends[Math.floor(Math.random() * trends.length)],
        gradeTrend: trends[Math.floor(Math.random() * trends.length)],
        lastAttendance: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        classesEnrolled: Math.floor(Math.random() * 3) + 1
      };
    });
    
    setStudentAnalytics(analytics);
  }, [teacherStudents]);

  // Filter students based on search, class, and filter type
  const filteredStudents = teacherStudents.filter(student => {
    const analytics = studentAnalytics[student.id];
    
    // Search filter
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toString().includes(searchTerm) ||
                         (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Class filter
    const matchesClass = selectedClass === 'all' || 
                        teacherClasses.some(cls => cls.id === selectedClass && cls.currentStrength > 0);
    
    // Performance filters
    let matchesFilter = true;
    if (analytics) {
      switch (filterType) {
        case 'performance':
          matchesFilter = analytics.gradeAverage < 70; // Students struggling academically
          break;
        case 'attendance':
          matchesFilter = analytics.attendancePercentage < 80; // Students with attendance issues
          break;
        case 'grade':
          matchesFilter = analytics.letterGrade === 'A'; // Top performers
          break;
        default:
          matchesFilter = true;
      }
    }
    
    return matchesSearch && matchesClass && matchesFilter;
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4" />; // Placeholder for stable
    }
  };

  const StudentGridCard = ({ student }: { student: Student }) => {
    const analytics = studentAnalytics[student.id];
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.profilePicture} />
              <AvatarFallback>
                {getInitials(student.firstName, student.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">
                {student.firstName} {student.lastName}
              </CardTitle>
              <CardDescription>
                Roll: {student.rollNumber}
              </CardDescription>
            </div>
            {analytics && (
              <Badge variant={analytics.letterGrade === 'A' ? 'default' : 
                           analytics.letterGrade === 'F' ? 'destructive' : 'secondary'}>
                {analytics.letterGrade}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {analytics && (
            <>
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className={`text-xl font-bold ${getAttendanceColor(analytics.attendancePercentage)}`}>
                    {analytics.attendancePercentage}%
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center">
                    Attendance {getTrendIcon(analytics.attendanceTrend)}
                  </div>
                </div>
                <div>
                  <div className={`text-xl font-bold ${getGradeColor(analytics.gradeAverage)}`}>
                    {analytics.gradeAverage}%
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center">
                    Average {getTrendIcon(analytics.gradeTrend)}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {student.email}
                </div>
                {student.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {student.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {analytics.classesEnrolled} classes enrolled
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/teacher/students/${student.id}`}>
                <ChevronRight className="h-4 w-4 mr-1" />
                View Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const StudentListItem = ({ student }: { student: Student }) => {
    const analytics = studentAnalytics[student.id];
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={student.profilePicture} />
                <AvatarFallback>
                  {getInitials(student.firstName, student.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">
                  {student.firstName} {student.lastName}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Roll: {student.rollNumber}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {student.email}
                  </span>
                  {student.phone && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {student.phone}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {analytics && (
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-sm font-medium">Attendance</div>
                  <div className={`text-lg font-bold flex items-center ${getAttendanceColor(analytics.attendancePercentage)}`}>
                    {analytics.attendancePercentage}%
                    <span className="ml-1">{getTrendIcon(analytics.attendanceTrend)}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm font-medium">Grade</div>
                  <div className={`text-lg font-bold flex items-center ${getGradeColor(analytics.gradeAverage)}`}>
                    {analytics.letterGrade}
                    <span className="ml-1">{getTrendIcon(analytics.gradeTrend)}</span>
                  </div>
                </div>
                
                <Button size="sm" asChild>
                  <Link href={`/teacher/students/${student.id}`}>
                    View Profile
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculate summary statistics
  const summaryStats = {
    totalStudents: teacherStudents.length,
    averageAttendance: Math.round(
      Object.values(studentAnalytics).reduce((sum, analytics) => sum + analytics.attendancePercentage, 0) / 
      Object.values(studentAnalytics).length || 0
    ),
    averageGrade: Math.round(
      Object.values(studentAnalytics).reduce((sum, analytics) => sum + analytics.gradeAverage, 0) / 
      Object.values(studentAnalytics).length || 0
    ),
    atRiskStudents: Object.values(studentAnalytics).filter(analytics => 
      analytics.attendancePercentage < 75 || analytics.gradeAverage < 70
    ).length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
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
          <h3 className="text-lg font-semibold mb-2">Error Loading Students</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">My Students</h1>
        <p className="text-muted-foreground">
          Monitor and track performance of all students in your classes
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAttendanceColor(summaryStats.averageAttendance)}`}>
              {summaryStats.averageAttendance}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(summaryStats.averageGrade)}`}>
              {summaryStats.averageGrade}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryStats.atRiskStudents}</div>
            <p className="text-xs text-muted-foreground">Students needing attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students by name, roll number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {teacherClasses.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="grade">Top Performers</SelectItem>
            <SelectItem value="performance">Academic Risk</SelectItem>
            <SelectItem value="attendance">Attendance Issues</SelectItem>
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

      {/* Students List/Grid */}
      {filteredStudents.length > 0 ? (
        <div className={
          viewMode === 'grid' 
            ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        }>
          {filteredStudents.map((student) => (
            viewMode === 'grid' ? (
              <StudentGridCard key={student.id} student={student} />
            ) : (
              <StudentListItem key={student.id} student={student} />
            )
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          {searchTerm || selectedClass !== 'all' || filterType !== 'all' ? (
            <>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground">
                No students match your search and filter criteria. Try adjusting your filters.
              </p>
            </>
          ) : (
            <>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students</h3>
              <p className="text-muted-foreground">
                No students are assigned to your classes yet.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
