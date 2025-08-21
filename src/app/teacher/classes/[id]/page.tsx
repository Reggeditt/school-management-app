'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  Calendar, 
  MapPin, 
  BookOpen, 
  TrendingUp,
  Search,
  ArrowLeft,
  Phone,
  Mail,
  UserCheck,
  UserX,
  Clock,
  Award,
  AlertTriangle,
  Download,
  Plus,
  Edit,
  MoreVertical
} from 'lucide-react';

// Custom hooks and services
import { useTeacherData } from '@/hooks/teacher';
import { Class, Student } from '@/lib/database-services';

interface StudentAttendance {
  studentId: string;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

interface StudentGrade {
  studentId: string;
  assignments: number;
  tests: number;
  projects: number;
  overall: number;
  letterGrade: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ClassDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const classId = resolvedParams.id;
  
  const { 
    teacherClasses, 
    teacherStudents, 
    loading, 
    error, 
    getStudentsForClass 
  } = useTeacherData();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'grade'>('name');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Mock data for demonstration
  const [attendanceData, setAttendanceData] = useState<{ [studentId: string]: StudentAttendance }>({});
  const [gradeData, setGradeData] = useState<{ [studentId: string]: StudentGrade }>({});

  const currentClass = teacherClasses.find(cls => cls.id === classId);
  const classStudents = getStudentsForClass(classId);

  // Generate mock attendance and grade data
  useEffect(() => {
    const attendance: { [studentId: string]: StudentAttendance } = {};
    const grades: { [studentId: string]: StudentGrade } = {};

    classStudents.forEach(student => {
      const present = Math.floor(Math.random() * 20) + 15;
      const absent = Math.floor(Math.random() * 5) + 1;
      const late = Math.floor(Math.random() * 3);
      const total = present + absent + late;
      
      attendance[student.id] = {
        studentId: student.id,
        present,
        absent,
        late,
        percentage: Math.round((present / total) * 100)
      };

      const assignments = Math.floor(Math.random() * 30) + 70;
      const tests = Math.floor(Math.random() * 30) + 70;
      const projects = Math.floor(Math.random() * 30) + 70;
      const overall = Math.round((assignments + tests + projects) / 3);
      
      grades[student.id] = {
        studentId: student.id,
        assignments,
        tests,
        projects,
        overall,
        letterGrade: overall >= 90 ? 'A' : overall >= 80 ? 'B' : overall >= 70 ? 'C' : overall >= 60 ? 'D' : 'F'
      };
    });

    setAttendanceData(attendance);
    setGradeData(grades);
  }, [classStudents]);

  // Filter and sort students
  const filteredStudents = classStudents
    .filter(student => 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'attendance':
          return (attendanceData[b.id]?.percentage || 0) - (attendanceData[a.id]?.percentage || 0);
        case 'grade':
          return (gradeData[b.id]?.overall || 0) - (gradeData[a.id]?.overall || 0);
        default:
          return 0;
      }
    });

  // Calculate class statistics
  const classStats = {
    totalStudents: classStudents.length,
    averageAttendance: Math.round(
      Object.values(attendanceData).reduce((sum, data) => sum + data.percentage, 0) / 
      Object.values(attendanceData).length || 0
    ),
    averageGrade: Math.round(
      Object.values(gradeData).reduce((sum, data) => sum + data.overall, 0) / 
      Object.values(gradeData).length || 0
    ),
    attendanceIssues: Object.values(attendanceData).filter(data => data.percentage < 75).length,
    gradeIssues: Object.values(gradeData).filter(data => data.overall < 70).length
  };

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !currentClass) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Class Not Found</h3>
          <p className="text-muted-foreground mb-4">
            {error || "The requested class could not be found."}
          </p>
          <Button asChild>
            <Link href="/teacher/classes">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/teacher/classes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{currentClass.name}</h1>
          <p className="text-muted-foreground">
            Grade {currentClass.grade} • Section {currentClass.section} • Room {currentClass.roomNumber}
          </p>
        </div>
      </div>

      {/* Class Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {currentClass.currentStrength}/{currentClass.maxCapacity} capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getAttendanceColor(classStats.averageAttendance)}`}>
              {classStats.averageAttendance}%
            </div>
            <p className="text-xs text-muted-foreground">
              {classStats.attendanceIssues} students below 75%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(classStats.averageGrade)}`}>
              {classStats.averageGrade}%
            </div>
            <p className="text-xs text-muted-foreground">
              {classStats.gradeIssues} students below 70%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" className="w-full" asChild>
              <Link href={`/teacher/attendance?class=${classId}`}>
                <UserCheck className="h-4 w-4 mr-2" />
                Take Attendance
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Class Information */}
            <Card>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Academic Year</label>
                    <p className="font-medium">{currentClass.academicYear}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Room Number</label>
                    <p className="font-medium">{currentClass.roomNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Strength</label>
                    <p className="font-medium">{currentClass.currentStrength} students</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Max Capacity</label>
                    <p className="font-medium">{currentClass.maxCapacity} students</p>
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="text-sm font-medium text-muted-foreground">Capacity</label>
                  <Progress 
                    value={(currentClass.currentStrength / currentClass.maxCapacity) * 100} 
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((currentClass.currentStrength / currentClass.maxCapacity) * 100)}% full
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <UserCheck className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Attendance taken</p>
                      <p className="text-xs text-muted-foreground">2 hours ago • 28/30 present</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Assignment graded</p>
                      <p className="text-xs text-muted-foreground">1 day ago • Math Quiz #3</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Test scheduled</p>
                      <p className="text-xs text-muted-foreground">3 days ago • Mid-term exam</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={(value: 'name' | 'attendance' | 'grade') => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="attendance">Attendance (High to Low)</SelectItem>
                <SelectItem value="grade">Grade (High to Low)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button>
          </div>

          {/* Students List */}
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const attendance = attendanceData[student.id];
              const grade = gradeData[student.id];
              
              return (
                <Card key={student.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={student.profilePicture} />
                          <AvatarFallback>
                            {getInitials(student.firstName, student.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold">
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
                      
                      <div className="flex items-center space-x-6 text-right">
                        <div>
                          <div className="text-sm font-medium">Attendance</div>
                          <div className={`text-lg font-bold ${getAttendanceColor(attendance?.percentage || 0)}`}>
                            {attendance?.percentage || 0}%
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm font-medium">Grade</div>
                          <div className={`text-lg font-bold ${getGradeColor(grade?.overall || 0)}`}>
                            {grade?.letterGrade || 'N/A'}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/students/${student.id}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {filteredStudents.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No students match your search criteria.' : 'No students in this class.'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Attendance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Distribution</CardTitle>
                <CardDescription>Student attendance percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Excellent (90%+)</span>
                    <span className="text-sm font-medium text-green-600">
                      {Object.values(attendanceData).filter(data => data.percentage >= 90).length} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Good (75-89%)</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {Object.values(attendanceData).filter(data => data.percentage >= 75 && data.percentage < 90).length} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Poor (&lt;75%)</span>
                    <span className="text-sm font-medium text-red-600">
                      {Object.values(attendanceData).filter(data => data.percentage < 75).length} students
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Overall grade performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">A (90%+)</span>
                    <span className="text-sm font-medium text-green-600">
                      {Object.values(gradeData).filter(data => data.overall >= 90).length} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">B (80-89%)</span>
                    <span className="text-sm font-medium text-blue-600">
                      {Object.values(gradeData).filter(data => data.overall >= 80 && data.overall < 90).length} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">C (70-79%)</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {Object.values(gradeData).filter(data => data.overall >= 70 && data.overall < 80).length} students
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">D/F (&lt;70%)</span>
                    <span className="text-sm font-medium text-red-600">
                      {Object.values(gradeData).filter(data => data.overall < 70).length} students
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
