'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Class, Student } from '@/lib/database-services';
import { Search, Mail, Phone, Eye, UserCheck, UserX } from 'lucide-react';

interface ClassStudentsTabProps {
  classItem: Class;
  students: Student[];
  teacherId: string;
}

export function ClassStudentsTab({ classItem, students, teacherId }: ClassStudentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: Date | string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getAttendanceStatus = (studentId: string) => {
    // Mock attendance data
    const attendance = Math.floor(Math.random() * 20) + 80; // 80-100%
    if (attendance >= 95) return { status: 'excellent', color: 'bg-green-500', percentage: attendance };
    if (attendance >= 85) return { status: 'good', color: 'bg-blue-500', percentage: attendance };
    if (attendance >= 75) return { status: 'average', color: 'bg-yellow-500', percentage: attendance };
    return { status: 'poor', color: 'bg-red-500', percentage: attendance };
  };

  const getGradeStatus = (studentId: string) => {
    // Mock grade data
    const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];
    return grades[Math.floor(Math.random() * grades.length)];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Class Students</h3>
          <p className="text-sm text-muted-foreground">
            {students.length} students enrolled in {classItem.name}
          </p>
        </div>
        <Badge variant="outline">
          {students.length} Students
        </Badge>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <UserCheck className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>Complete list of students in this class</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const attendance = getAttendanceStatus(student.id);
                  const grade = getGradeStatus(student.id);
                  
                  return (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {student.firstName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{student.firstName} {student.lastName}</div>
                            <div className="text-sm text-muted-foreground">
                              Age: {calculateAge(student.dateOfBirth)}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.rollNumber || student.id.slice(-4)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {student.email && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1" />
                              {student.email}
                            </div>
                          )}
                          {student.phone && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {student.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${attendance.color}`}></div>
                          <span className="text-sm font-medium">{attendance.percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={grade.startsWith('A') ? "default" : grade.startsWith('B') ? "secondary" : "outline"}
                        >
                          {grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm ? 'No students found matching your search.' : 'No students enrolled in this class.'}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Excellent (95%+)</span>
              <span className="font-medium">{Math.floor(students.length * 0.6)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Good (85-94%)</span>
              <span className="font-medium">{Math.floor(students.length * 0.3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Needs Attention (&lt;85%)</span>
              <span className="font-medium">{Math.floor(students.length * 0.1)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">A Grades</span>
              <span className="font-medium">{Math.floor(students.length * 0.4)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">B Grades</span>
              <span className="font-medium">{Math.floor(students.length * 0.5)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">C Grades</span>
              <span className="font-medium">{Math.floor(students.length * 0.1)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button size="sm" variant="outline" className="w-full justify-start">
              <UserCheck className="h-4 w-4 mr-2" />
              Mark Today's Attendance
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              Send Class Announcement
            </Button>
            <Button size="sm" variant="outline" className="w-full justify-start">
              <Eye className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
