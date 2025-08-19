'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  GraduationCap,
  ClipboardList,
  BarChart3,
  TrendingUp,
  TrendingDown,
  User
} from "lucide-react";

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  attendance: number;
  currentGrade: number;
  lastSubmission?: Date;
  status: 'active' | 'inactive';
}

interface ClassDetail {
  id: string;
  name: string;
  subject: string;
  grade: string;
  description: string;
  studentsCount: number;
  schedule: {
    day: string;
    time: string;
    room: string;
  }[];
  students: Student[];
  recentAttendance: number;
  avgGrade: number;
  pendingAssignments: number;
  completedAssignments: number;
}

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);

  useEffect(() => {
    if (params.id) {
      loadClassDetail(params.id as string);
    }
  }, [params.id, user]);

  const loadClassDetail = async (classId: string) => {
    if (!user?.profile?.schoolId) return;

    try {
      setLoading(true);
      
      // Simulate loading class detail
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setClassDetail({
        id: classId,
        name: 'Grade 10A',
        subject: 'Mathematics',
        grade: '10',
        description: 'Advanced mathematics focusing on algebra, geometry, and basic calculus concepts.',
        studentsCount: 28,
        schedule: [
          { day: 'Monday', time: '8:00 AM - 9:00 AM', room: 'Room 201' },
          { day: 'Wednesday', time: '10:00 AM - 11:00 AM', room: 'Room 201' },
          { day: 'Friday', time: '2:00 PM - 3:00 PM', room: 'Room 201' }
        ],
        recentAttendance: 96,
        avgGrade: 85,
        pendingAssignments: 3,
        completedAssignments: 12,
        students: [
          {
            id: '1',
            studentId: 'STU001',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+233 123 456 789',
            attendance: 98,
            currentGrade: 92,
            lastSubmission: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'active'
          },
          {
            id: '2',
            studentId: 'STU002',
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@email.com',
            phone: '+233 987 654 321',
            attendance: 95,
            currentGrade: 88,
            lastSubmission: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            status: 'active'
          },
          {
            id: '3',
            studentId: 'STU003',
            firstName: 'Michael',
            lastName: 'Johnson',
            email: 'michael.johnson@email.com',
            phone: '+233 555 123 456',
            attendance: 92,
            currentGrade: 78,
            lastSubmission: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            status: 'active'
          },
          {
            id: '4',
            studentId: 'STU004',
            firstName: 'Sarah',
            lastName: 'Williams',
            email: 'sarah.williams@email.com',
            phone: '+233 111 222 333',
            attendance: 89,
            currentGrade: 85,
            lastSubmission: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'active'
          },
          {
            id: '5',
            studentId: 'STU005',
            firstName: 'David',
            lastName: 'Brown',
            email: 'david.brown@email.com',
            phone: '+233 444 555 666',
            attendance: 87,
            currentGrade: 81,
            lastSubmission: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            status: 'active'
          }
        ]
      });

    } catch (error) {
      toast.error("Failed to load class details");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'bg-green-100 text-green-800 border-green-200';
    if (attendance >= 85) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (grade >= 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading class details...</p>
        </div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Class not found</h2>
        <p className="mt-2 text-gray-600">The class you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{classDetail.name}</h1>
            <p className="text-muted-foreground">{classDetail.subject} • Grade {classDetail.grade}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/teacher/attendance?class=${classDetail.id}`}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Take Attendance
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/teacher/assignments?class=${classDetail.id}`}>
              <FileText className="mr-2 h-4 w-4" />
              Create Assignment
            </Link>
          </Button>
        </div>
      </div>

      {/* Class Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{classDetail.studentsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ClipboardList className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold">{classDetail.recentAttendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Grade</p>
                <p className="text-2xl font-bold">{classDetail.avgGrade}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                <p className="text-2xl font-bold">{classDetail.pendingAssignments + classDetail.completedAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Class Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{classDetail.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Subject</h4>
                    <p className="text-sm text-muted-foreground">{classDetail.subject}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Grade Level</h4>
                    <p className="text-sm text-muted-foreground">Grade {classDetail.grade}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Assignment: Quadratic Equations</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Attendance: Monday Class</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Quiz: Algebra Fundamentals</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Graded
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>
                View and manage students in this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Current Grade</TableHead>
                      <TableHead>Last Submission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classDetail.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {student.firstName[0]}{student.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.firstName} {student.lastName}</div>
                              <div className="text-sm text-muted-foreground">{student.studentId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {student.email}
                            </div>
                            <div className="flex items-center mt-1 text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {student.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getAttendanceColor(student.attendance)}>
                            {student.attendance}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getGradeColor(student.currentGrade)}>
                            {student.currentGrade}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {student.lastSubmission ? (
                            <span className="text-sm text-muted-foreground">
                              {student.lastSubmission.toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">No submissions</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={student.status === 'active' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-gray-100 text-gray-800 border-gray-200'
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/teacher/students/${student.id}`}>
                              <User className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>
                Weekly schedule for {classDetail.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classDetail.schedule.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-medium">{session.day}</div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{session.room}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{classDetail.subject}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">A (90-100%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">B (80-89%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">40%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">C (70-79%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">D (60-69%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">F (Below 60%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '2%' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Week</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">96%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Week</span>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-600">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Month</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">94%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Month</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-600">91%</span>
                    </div>
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
