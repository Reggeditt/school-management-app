'use client';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import {
  Users,
  ClipboardList,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Download,
  Filter
} from "lucide-react";

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  studentsCount: number;
}

interface AttendanceRecord {
  date: string;
  classId: string;
  students: Student[];
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
}

export default function TeacherAttendancePage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const selectedClassId = searchParams.get('class');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>(selectedClassId || '');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    loadClasses();
  }, [user]);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadStudents();
      loadAttendanceRecord();
    }
  }, [selectedClass, selectedDate]);

  const loadClasses = async () => {
    if (!user?.profile?.schoolId) return;

    try {
      setLoading(true);
      
      // Simulate loading classes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for demonstration
      const mockClasses = [
        { id: '1', name: 'Grade 10A', subject: 'Mathematics', studentsCount: 28 },
        { id: '2', name: 'Grade 9B', subject: 'Science', studentsCount: 25 },
        { id: '3', name: 'Grade 10B', subject: 'Mathematics', studentsCount: 30 },
        { id: '4', name: 'Grade 11A', subject: 'Advanced Mathematics', studentsCount: 22 },
        { id: '5', name: 'Grade 8C', subject: 'Basic Mathematics', studentsCount: 32 }
      ];
      
      setClasses(mockClasses);
      
      if (!selectedClass && mockClasses.length > 0) {
        setSelectedClass(mockClasses[0].id);
      }

    } catch (error) {
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    if (!selectedClass) return;

    try {
      // Simulate loading students
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock student data
      const mockStudents = [
        { id: '1', studentId: 'STU001', firstName: 'John', lastName: 'Doe', status: 'present' as const },
        { id: '2', studentId: 'STU002', firstName: 'Jane', lastName: 'Smith', status: 'present' as const },
        { id: '3', studentId: 'STU003', firstName: 'Michael', lastName: 'Johnson', status: 'present' as const },
        { id: '4', studentId: 'STU004', firstName: 'Sarah', lastName: 'Williams', status: 'present' as const },
        { id: '5', studentId: 'STU005', firstName: 'David', lastName: 'Brown', status: 'present' as const },
        { id: '6', studentId: 'STU006', firstName: 'Emily', lastName: 'Davis', status: 'present' as const },
        { id: '7', studentId: 'STU007', firstName: 'James', lastName: 'Wilson', status: 'present' as const },
        { id: '8', studentId: 'STU008', firstName: 'Lisa', lastName: 'Anderson', status: 'present' as const },
        { id: '9', studentId: 'STU009', firstName: 'Robert', lastName: 'Taylor', status: 'present' as const },
        { id: '10', studentId: 'STU010', firstName: 'Michelle', lastName: 'Thomas', status: 'present' as const }
      ];
      
      setStudents(mockStudents);

    } catch (error) {
      toast.error("Failed to load students");
    }
  };

  const loadAttendanceRecord = async () => {
    if (!selectedClass || !selectedDate) return;

    try {
      // Check if attendance already exists for this date
      const existingRecord = attendanceRecords.find(
        record => record.date === selectedDate && record.classId === selectedClass
      );

      if (existingRecord) {
        setStudents(existingRecord.students);
      }
    } catch (error) {
    }
  };

  const updateStudentStatus = (studentId: string, status: Student['status']) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'present' as const })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, status: 'absent' as const })));
  };

  const saveAttendance = async () => {
    if (!selectedClass || !selectedDate || students.length === 0) {
      toast.error("Please select a class and ensure students are loaded");
      return;
    }

    try {
      setSaving(true);

      // Calculate totals
      const totalPresent = students.filter(s => s.status === 'present').length;
      const totalAbsent = students.filter(s => s.status === 'absent').length;
      const totalLate = students.filter(s => s.status === 'late').length;
      const totalExcused = students.filter(s => s.status === 'excused').length;

      const attendanceRecord: AttendanceRecord = {
        date: selectedDate,
        classId: selectedClass,
        students: [...students],
        totalPresent,
        totalAbsent,
        totalLate,
        totalExcused
      };

      // Update local records
      setAttendanceRecords(prev => {
        const filtered = prev.filter(record => 
          !(record.date === selectedDate && record.classId === selectedClass)
        );
        return [...filtered, attendanceRecord];
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Attendance saved successfully");

    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const attendanceStats = {
    present: students.filter(s => s.status === 'present').length,
    absent: students.filter(s => s.status === 'absent').length,
    late: students.filter(s => s.status === 'late').length,
    excused: students.filter(s => s.status === 'excused').length,
    total: students.length
  };

  const attendancePercentage = attendanceStats.total > 0 
    ? Math.round((attendanceStats.present / attendanceStats.total) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">
            Take and manage student attendance for your classes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={saveAttendance} disabled={saving || students.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Attendance Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classInfo) => (
                    <SelectItem key={classInfo.id} value={classInfo.id}>
                      {classInfo.name} - {classInfo.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={markAllPresent} className="flex-1">
                Mark All Present
              </Button>
              <Button variant="outline" onClick={markAllAbsent} className="flex-1">
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{attendanceStats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Present</p>
                  <p className="text-2xl font-bold">{attendanceStats.present}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Absent</p>
                  <p className="text-2xl font-bold">{attendanceStats.absent}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Late</p>
                  <p className="text-2xl font-bold">{attendanceStats.late}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Excused</p>
                  <p className="text-2xl font-bold">{attendanceStats.excused}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ClipboardList className="mr-2 h-5 w-5" />
                Student Attendance
              </div>
              {students.length > 0 && (
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {attendancePercentage}% Present
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Mark attendance for {classes.find(c => c.id === selectedClass)?.name} on {new Date(selectedDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Please select a class to view students.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
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
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{student.studentId}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(student.status)}
                            <Badge variant="outline" className={getStatusColor(student.status)}>
                              {student.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant={student.status === 'present' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateStudentStatus(student.id, 'present')}
                            >
                              Present
                            </Button>
                            <Button
                              variant={student.status === 'absent' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateStudentStatus(student.id, 'absent')}
                            >
                              Absent
                            </Button>
                            <Button
                              variant={student.status === 'late' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateStudentStatus(student.id, 'late')}
                            >
                              Late
                            </Button>
                            <Button
                              variant={student.status === 'excused' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => updateStudentStatus(student.id, 'excused')}
                            >
                              Excused
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
