'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Clock,
  FileText,
  Users,
  Home,
  GraduationCap
} from 'lucide-react';

// Custom hooks and services
import { useTeacherData } from '@/hooks/teacher';
import { Student } from '@/lib/database-services';

interface StudentDetailAnalytics {
  attendancePercentage: number;
  gradeAverage: number;
  letterGrade: string;
  attendanceTrend: 'up' | 'down' | 'stable';
  gradeTrend: 'up' | 'down' | 'stable';
  recentGrades: Array<{
    assignment: string;
    grade: number;
    maxPoints: number;
    date: string;
    type: 'assignment' | 'quiz' | 'test' | 'project';
  }>;
  attendanceHistory: Array<{
    date: string;
    status: 'present' | 'absent' | 'late';
    class: string;
  }>;
  behaviorNotes: Array<{
    date: string;
    note: string;
    type: 'positive' | 'negative' | 'neutral';
    teacher: string;
  }>;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StudentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  
  const { 
    teacherClasses, 
    teacherStudents, 
    loading, 
    error 
  } = useTeacherData();

  const [analytics, setAnalytics] = useState<StudentDetailAnalytics | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');

  const currentStudent = teacherStudents.find(student => student.id === studentId);

  // Generate detailed analytics for the student
  useEffect(() => {
    if (currentStudent) {
      const attendance = Math.floor(Math.random() * 30) + 70; // 70-100%
      const grade = Math.floor(Math.random() * 30) + 70; // 70-100%
      const trends = ['up', 'down', 'stable'] as const;
      
      // Generate recent grades
      const recentGrades = [
        {
          assignment: 'Math Quiz #3',
          grade: 85,
          maxPoints: 100,
          date: '2024-01-15',
          type: 'quiz' as const
        },
        {
          assignment: 'Science Project',
          grade: 92,
          maxPoints: 100,
          date: '2024-01-12',
          type: 'project' as const
        },
        {
          assignment: 'History Test',
          grade: 78,
          maxPoints: 100,
          date: '2024-01-10',
          type: 'test' as const
        },
        {
          assignment: 'English Essay',
          grade: 88,
          maxPoints: 100,
          date: '2024-01-08',
          type: 'assignment' as const
        }
      ];

      // Generate attendance history
      const attendanceHistory = [];
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const statuses = ['present', 'present', 'present', 'absent', 'late']; // Weighted towards present
        attendanceHistory.push({
          date: date.toISOString().split('T')[0],
          status: statuses[Math.floor(Math.random() * statuses.length)] as 'present' | 'absent' | 'late',
          class: 'Mathematics'
        });
      }

      // Generate behavior notes
      const behaviorNotes = [
        {
          date: '2024-01-15',
          note: 'Excellent participation in group discussion',
          type: 'positive' as const,
          teacher: 'Mr. Johnson'
        },
        {
          date: '2024-01-12',
          note: 'Helped classmate with difficult concept',
          type: 'positive' as const,
          teacher: 'Ms. Smith'
        },
        {
          date: '2024-01-08',
          note: 'Late submission of homework',
          type: 'negative' as const,
          teacher: 'Mr. Davis'
        }
      ];

      setAnalytics({
        attendancePercentage: attendance,
        gradeAverage: grade,
        letterGrade: grade >= 90 ? 'A' : grade >= 80 ? 'B' : grade >= 70 ? 'C' : grade >= 60 ? 'D' : 'F',
        attendanceTrend: trends[Math.floor(Math.random() * trends.length)],
        gradeTrend: trends[Math.floor(Math.random() * trends.length)],
        recentGrades,
        attendanceHistory,
        behaviorNotes
      });
    }
  }, [currentStudent]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <UserCheck className="h-4 w-4" />;
      case 'absent':
        return <UserX className="h-4 w-4" />;
      case 'late':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getBehaviorColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-800';
      case 'assignment':
        return 'bg-green-100 text-green-800';
      case 'test':
        return 'bg-red-100 text-red-800';
      case 'project':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
        
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error || !currentStudent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Student Not Found</h3>
          <p className="text-muted-foreground mb-4">
            {error || "The requested student could not be found."}
          </p>
          <Button asChild>
            <Link href="/teacher/students">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
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
          <Link href="/teacher/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={currentStudent.profilePicture} />
            <AvatarFallback>
              {getInitials(currentStudent.firstName, currentStudent.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">
              {currentStudent.firstName} {currentStudent.lastName}
            </h1>
            <p className="text-muted-foreground">
              Roll Number: {currentStudent.rollNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getAttendanceColor(analytics.attendancePercentage)}`}>
                {analytics.attendancePercentage}%
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="mr-1">Trend:</span>
                {getTrendIcon(analytics.attendanceTrend)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grade Average</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getGradeColor(analytics.gradeAverage)}`}>
                {analytics.gradeAverage}%
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span className="mr-1">Trend:</span>
                {getTrendIcon(analytics.gradeTrend)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Letter Grade</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={analytics.letterGrade === 'A' ? 'default' : 
                              analytics.letterGrade === 'F' ? 'destructive' : 'secondary'} 
                       className="text-lg px-3 py-1">
                  {analytics.letterGrade}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div className="font-medium">Last seen today</div>
                <div className="text-muted-foreground">Math class</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <p className="font-medium">{currentStudent.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <p className="font-medium">{currentStudent.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="font-medium">{currentStudent.dateOfBirth.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="font-medium capitalize">{currentStudent.gender}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{currentStudent.email || 'No email provided'}</span>
                  </div>
                  {currentStudent.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{currentStudent.phone}</span>
                    </div>
                  )}
                  {currentStudent.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{currentStudent.address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
                    <p className="font-medium">{currentStudent.rollNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Admission Date</label>
                    <p className="font-medium">{currentStudent.admissionDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={currentStudent.status === 'active' ? 'default' : 'secondary'}>
                      {currentStudent.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Classes Enrolled</label>
                    <p className="font-medium">
                      {teacherClasses.filter(cls => cls.currentStrength > 0).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Latest assignments and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="space-y-4">
                  {analytics.recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{grade.assignment}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={getAssignmentTypeColor(grade.type)}>
                              {grade.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{grade.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}/{grade.maxPoints}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round((grade.grade / grade.maxPoints) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>Last 10 days of attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="space-y-3">
                  {analytics.attendanceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                        </div>
                        <div>
                          <div className="font-medium">{record.class}</div>
                          <div className="text-sm text-muted-foreground">{record.date}</div>
                        </div>
                      </div>
                      
                      <Badge variant="outline" className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavior Notes</CardTitle>
              <CardDescription>Teacher observations and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics && (
                <div className="space-y-4">
                  {analytics.behaviorNotes.map((note, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className={getBehaviorColor(note.type)}>
                          {note.type}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {note.date} • {note.teacher}
                        </div>
                      </div>
                      <p className="text-sm">{note.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
