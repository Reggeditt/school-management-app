'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student } from '@/lib/database-services';
import Link from "next/link";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  Eye,
  MoreVertical,
  Filter
} from "lucide-react";

interface StudentCardProps {
  student: Student;
  viewMode?: 'grid' | 'list';
  showActions?: boolean;
}

export function StudentCard({ student, viewMode = 'grid', showActions = true }: StudentCardProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 90) return 'bg-green-100 text-green-800';
    if (attendance >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getGradeColor = (grade: string) => {
    const gradeMap: Record<string, string> = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return gradeMap[grade] || 'bg-gray-100 text-gray-800';
  };

  if (viewMode === 'list') {
    return (
      <TableRow className="hover:bg-gray-50">
        <TableCell>
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={student.profilePicture} />
              <AvatarFallback className="text-xs">
                {getInitials(student.firstName, student.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">
                {student.firstName} {student.lastName}
              </div>
              <div className="text-sm text-gray-500">ID: {student.studentId}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline">
            Grade {student.grade} - {student.section}
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          <span className="font-medium">{student.rollNumber}</span>
        </TableCell>
        <TableCell>
          <div className="text-sm">
            <div className="text-gray-900">{student.email}</div>
            {student.phone && (
              <div className="text-gray-500">{student.phone}</div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-center">
          {/* This would come from attendance calculation */}
          <Badge className={getAttendanceColor(85)}>
            85%
          </Badge>
        </TableCell>
        <TableCell className="text-center">
          {/* This would come from grade calculation */}
          <Badge className={getGradeColor('B+')}>
            B+
          </Badge>
        </TableCell>
        <TableCell>
          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
            {student.status}
          </Badge>
        </TableCell>
        {showActions && (
          <TableCell>
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/teacher/students/${student.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        )}
      </TableRow>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={student.profilePicture} />
              <AvatarFallback>
                {getInitials(student.firstName, student.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-500">ID: {student.studentId}</p>
            </div>
          </div>
          {showActions && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/teacher/students/${student.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Class</span>
          </div>
          <Badge variant="outline">
            Grade {student.grade} - {student.section}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Roll No.</span>
          </div>
          <span className="text-sm font-medium">{student.rollNumber}</span>
        </div>

        {student.email && (
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600 truncate">{student.email}</span>
          </div>
        )}

        {student.phone && (
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{student.phone}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-3 border-t">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">Attendance</div>
            <Badge className={`${getAttendanceColor(85)} mt-1`}>
              85%
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">Grade</div>
            <Badge className={`${getGradeColor('B+')} mt-1`}>
              B+
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
            {student.status}
          </Badge>
          {showActions && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/teacher/students/${student.id}`}>
                View Details
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface StudentsListProps {
  students: Student[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function StudentsList({ 
  students, 
  loading = false, 
  viewMode = 'grid',
  searchTerm = '',
  onSearchChange,
  showActions = true,
  emptyMessage = "No students found."
}: StudentsListProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    onSearchChange?.(value);
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  if (loading) {
    if (viewMode === 'list') {
      return (
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                  {showActions && <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search students..."
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Results */}
      {filteredStudents.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-500">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : viewMode === 'list' ? (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead className="text-center">Roll No.</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Attendance</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  viewMode="list"
                  showActions={showActions}
                />
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              viewMode="grid"
              showActions={showActions}
            />
          ))}
        </div>
      )}
    </div>
  );
}
