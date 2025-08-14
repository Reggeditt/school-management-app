'use client';

import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Award,
  Activity
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { state } = useStore();

  // Find current student data
  const currentStudent = state.students.find(s => s.email === user?.email);
  
  // Get student's classes
  const studentClasses = state.classes.filter(c => 
    currentStudent && c.students.includes(currentStudent.id)
  );

  // Get student's subjects
  const studentSubjects = state.subjects.filter(s => 
    studentClasses.some(c => s.classIds.includes(c.id))
  );

  // Get student's attendance records
  const studentAttendance = state.attendance.filter(a => 
    currentStudent && a.studentId === currentStudent.id
  );

  // Get student's exam records
  const studentExams = state.exams.filter(e => 
    studentClasses.some(c => e.classIds.includes(c.id))
  );

  // Calculate statistics
  const totalClasses = studentClasses.length;
  const totalSubjects = studentSubjects.length;
  const attendanceRate = studentAttendance.length > 0 
    ? (studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length * 100)
    : 0;

  // Calculate average grade
  const gradePoints = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
  const recentExams = studentExams.slice(-5);
  const averageGrade = recentExams.length > 0
    ? recentExams.reduce((sum, exam) => {
        const studentResult = exam.results?.[currentStudent?.id || ''];
        const grade = studentResult?.grade || 'F';
        return sum + (gradePoints[grade as keyof typeof gradePoints] || 0);
      }, 0) / recentExams.length
    : 0;

  const getGradeFromPoints = (points: number): string => {
    if (points >= 3.5) return 'A';
    if (points >= 2.5) return 'B';
    if (points >= 1.5) return 'C';
    if (points >= 0.5) return 'D';
    return 'F';
  };

  // Upcoming assignments/exams (mock data for now)
  const upcomingItems = [
    { id: 1, title: 'Mathematics Test', type: 'exam', date: '2025-08-20', subject: 'Mathematics' },
    { id: 2, title: 'English Essay', type: 'assignment', date: '2025-08-22', subject: 'English' },
    { id: 3, title: 'Physics Lab Report', type: 'assignment', date: '2025-08-25', subject: 'Physics' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {currentStudent ? currentStudent.firstName : 'Student'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's your academic overview for today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubjects}</div>
            <p className="text-xs text-muted-foreground">Enrolled subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Grade</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getGradeFromPoints(averageGrade)}</div>
            <p className="text-xs text-muted-foreground">Average GPA: {averageGrade.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExams.slice(0, 3).map((exam, index) => {
                  const studentResult = exam.results?.[currentStudent?.id || ''];
                  const subject = studentSubjects.find(s => s.id === exam.subjectId);
                  
                  return (
                    <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium">{exam.name}</p>
                        <p className="text-sm text-gray-500">{subject?.name}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={
                          studentResult?.grade === 'A' ? 'default' :
                          studentResult?.grade === 'B' ? 'secondary' :
                          studentResult?.grade === 'C' ? 'outline' : 'destructive'
                        }>
                          {studentResult?.grade || 'N/A'}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">
                          {studentResult?.marksObtained || 0}/{exam.totalMarks}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {recentExams.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent exam results available</p>
                  </div>
                )}

                <div className="pt-4">
                  <Link href="/student/grades">
                    <Button variant="outline" className="w-full">
                      View All Results
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                My Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentSubjects.map((subject) => {
                  // Calculate subject-specific grade
                  const subjectExams = studentExams.filter(e => e.subjectId === subject.id);
                  const subjectAverage = subjectExams.length > 0
                    ? subjectExams.reduce((sum, exam) => {
                        const result = exam.results?.[currentStudent?.id || ''];
                        return sum + (result?.marksObtained || 0);
                      }, 0) / subjectExams.length
                    : 0;

                  return (
                    <div key={subject.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{subject.name}</h3>
                        <Badge variant="outline">{subject.code}</Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{subject.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{subjectAverage.toFixed(1)}%</span>
                        </div>
                        <Progress value={subjectAverage} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {studentSubjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No subjects enrolled</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Upcoming Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="mt-1">
                      {item.type === 'exam' ? (
                        <FileText className="h-4 w-4 text-blue-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <Link href="/student/schedule">
                <Button variant="outline" size="sm" className="w-full">
                  View Full Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/student/attendance">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Check Attendance
                  </Button>
                </Link>
                <Link href="/student/grades">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Star className="h-4 w-4 mr-2" />
                    View Grades
                  </Button>
                </Link>
                <Link href="/student/assignments">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Assignments
                  </Button>
                </Link>
                <Link href="/student/profile">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Attendance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {attendanceRate.toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Present Days</span>
                    <span className="font-medium text-green-600">
                      {studentAttendance.filter(a => a.status === 'present').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Absent Days</span>
                    <span className="font-medium text-red-600">
                      {studentAttendance.filter(a => a.status === 'absent').length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Late Arrivals</span>
                    <span className="font-medium text-yellow-600">
                      {studentAttendance.filter(a => a.status === 'late').length}
                    </span>
                  </div>
                </div>

                <Progress value={attendanceRate} className="h-2" />
                
                {attendanceRate < 75 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Attendance below 75% required minimum
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
