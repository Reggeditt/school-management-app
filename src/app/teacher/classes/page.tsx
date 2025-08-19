'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import Link from "next/link";
import {
  Users,
  Search,
  Calendar,
  Clock,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Eye,
  FileText,
  BarChart3
} from "lucide-react";

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  grade: string;
  studentsCount: number;
  schedule: {
    day: string;
    time: string;
    room: string;
  }[];
  nextClass?: {
    day: string;
    time: string;
    room: string;
  };
  recentAttendance: number;
  pendingAssignments: number;
  avgGrade: number;
}

export default function TeacherClassesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    loadClasses();
  }, [user]);

  const loadClasses = async () => {
    if (!user?.profile?.schoolId) return;

    try {
      setLoading(true);
      
      // Simulate loading classes data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      setClasses([
        {
          id: '1',
          name: 'Grade 10A',
          subject: 'Mathematics',
          grade: '10',
          studentsCount: 28,
          schedule: [
            { day: 'Monday', time: '8:00 AM - 9:00 AM', room: 'Room 201' },
            { day: 'Wednesday', time: '10:00 AM - 11:00 AM', room: 'Room 201' },
            { day: 'Friday', time: '2:00 PM - 3:00 PM', room: 'Room 201' }
          ],
          nextClass: { day: 'Monday', time: '8:00 AM', room: 'Room 201' },
          recentAttendance: 96,
          pendingAssignments: 3,
          avgGrade: 85
        },
        {
          id: '2',
          name: 'Grade 9B',
          subject: 'Science',
          grade: '9',
          studentsCount: 25,
          schedule: [
            { day: 'Tuesday', time: '9:00 AM - 10:00 AM', room: 'Lab 1' },
            { day: 'Thursday', time: '11:00 AM - 12:00 PM', room: 'Lab 1' }
          ],
          nextClass: { day: 'Tuesday', time: '9:00 AM', room: 'Lab 1' },
          recentAttendance: 92,
          pendingAssignments: 1,
          avgGrade: 78
        },
        {
          id: '3',
          name: 'Grade 10B',
          subject: 'Mathematics',
          grade: '10',
          studentsCount: 30,
          schedule: [
            { day: 'Monday', time: '11:00 AM - 12:00 PM', room: 'Room 202' },
            { day: 'Wednesday', time: '2:00 PM - 3:00 PM', room: 'Room 202' },
            { day: 'Friday', time: '9:00 AM - 10:00 AM', room: 'Room 202' }
          ],
          nextClass: { day: 'Monday', time: '11:00 AM', room: 'Room 202' },
          recentAttendance: 89,
          pendingAssignments: 2,
          avgGrade: 82
        },
        {
          id: '4',
          name: 'Grade 11A',
          subject: 'Advanced Mathematics',
          grade: '11',
          studentsCount: 22,
          schedule: [
            { day: 'Tuesday', time: '1:00 PM - 2:00 PM', room: 'Room 201' },
            { day: 'Thursday', time: '8:00 AM - 9:00 AM', room: 'Room 201' }
          ],
          nextClass: { day: 'Tuesday', time: '1:00 PM', room: 'Room 201' },
          recentAttendance: 95,
          pendingAssignments: 4,
          avgGrade: 88
        },
        {
          id: '5',
          name: 'Grade 8C',
          subject: 'Basic Mathematics',
          grade: '8',
          studentsCount: 32,
          schedule: [
            { day: 'Monday', time: '2:00 PM - 3:00 PM', room: 'Room 105' },
            { day: 'Wednesday', time: '8:00 AM - 9:00 AM', room: 'Room 105' },
            { day: 'Friday', time: '11:00 AM - 12:00 PM', room: 'Room 105' }
          ],
          nextClass: { day: 'Monday', time: '2:00 PM', room: 'Room 105' },
          recentAttendance: 88,
          pendingAssignments: 1,
          avgGrade: 75
        }
      ]);

    } catch (error) {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter((classInfo) =>
    classInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classInfo.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classInfo.grade.includes(searchTerm)
  );

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
          <p className="mt-2 text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">
            Manage your classes, students, and academic activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/teacher/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{classes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{classes.reduce((sum, c) => sum + c.studentsCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending Work</p>
                <p className="text-2xl font-bold">{classes.reduce((sum, c) => sum + c.pendingAssignments, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">
                  {Math.round(classes.reduce((sum, c) => sum + c.recentAttendance, 0) / classes.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      <Card>
        <CardHeader>
          <CardTitle>Class Directory</CardTitle>
          <CardDescription>
            View and manage all your assigned classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                className="w-[300px] pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Next Class</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Avg Grade</TableHead>
                  <TableHead>Pending Work</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((classInfo) => (
                  <TableRow key={classInfo.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{classInfo.name}</div>
                        <div className="text-sm text-muted-foreground">Grade {classInfo.grade}</div>
                      </div>
                    </TableCell>
                    <TableCell>{classInfo.subject}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {classInfo.studentsCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      {classInfo.nextClass ? (
                        <div className="text-sm">
                          <div className="font-medium">{classInfo.nextClass.day}</div>
                          <div className="text-muted-foreground">
                            {classInfo.nextClass.time} • {classInfo.nextClass.room}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No upcoming class</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getAttendanceColor(classInfo.recentAttendance)}>
                        {classInfo.recentAttendance}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getGradeColor(classInfo.avgGrade)}>
                        {classInfo.avgGrade}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {classInfo.pendingAssignments > 0 ? (
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                          {classInfo.pendingAssignments} pending
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          All caught up
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/classes/${classInfo.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/attendance?class=${classInfo.id}`}>
                            <ClipboardList className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/teacher/grades?class=${classInfo.id}`}>
                            <GraduationCap className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredClasses.length} of {classes.length} classes
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
