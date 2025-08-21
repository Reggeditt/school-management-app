'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Search,
  Edit,
  Save,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Award,
  AlertTriangle,
  Eye,
  MessageSquare,
  Download
} from "lucide-react";

export interface StudentGrade {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  className: string;
  assignments: {
    [assignmentId: string]: {
      title: string;
      grade: number | null;
      maxPoints: number;
      submittedAt?: string;
      gradedAt?: string;
      feedback?: string;
    };
  };
  overallGrade: number;
  attendanceRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Assignment {
  id: string;
  title: string;
  maxPoints: number;
  dueDate: string;
  className: string;
  submissionCount: number;
  gradedCount: number;
}

interface GradeEntryProps {
  grade: number | null;
  maxPoints: number;
  onGradeChange: (grade: number | null) => void;
  editable?: boolean;
}

function GradeEntry({ grade, maxPoints, onGradeChange, editable = true }: GradeEntryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempGrade, setTempGrade] = useState(grade?.toString() || '');

  const handleSave = () => {
    const numGrade = tempGrade === '' ? null : parseFloat(tempGrade);
    if (numGrade !== null && (numGrade < 0 || numGrade > maxPoints)) {
      return; // Invalid grade
    }
    onGradeChange(numGrade);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempGrade(grade?.toString() || '');
    setIsEditing(false);
  };

  const getGradeColor = (grade: number | null, maxPoints: number) => {
    if (grade === null) return 'text-gray-400';
    const percentage = (grade / maxPoints) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!editable) {
    return (
      <span className={getGradeColor(grade, maxPoints)}>
        {grade !== null ? `${grade}/${maxPoints}` : '-'}
      </span>
    );
  }

  if (isEditing) {
    return (
      <div className="flex items-center space-x-1">
        <Input
          type="number"
          value={tempGrade}
          onChange={(e) => setTempGrade(e.target.value)}
          className="w-16 h-8 text-sm"
          max={maxPoints}
          min={0}
          step={0.1}
        />
        <span className="text-sm text-gray-500">/{maxPoints}</span>
        <Button size="sm" variant="ghost" onClick={handleSave} className="h-6 w-6 p-0">
          <Save className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 w-6 p-0">
          ×
        </Button>
      </div>
    );
  }

  return (
    <div 
      className={`cursor-pointer hover:bg-gray-50 p-1 rounded flex items-center space-x-1 ${getGradeColor(grade, maxPoints)}`}
      onClick={() => setIsEditing(true)}
    >
      <span>{grade !== null ? `${grade}/${maxPoints}` : '-'}</span>
      <Edit className="h-3 w-3 opacity-50" />
    </div>
  );
}

interface GradeTableProps {
  studentGrades: StudentGrade[];
  assignments: Assignment[];
  loading?: boolean;
  onGradeUpdate: (studentId: string, assignmentId: string, grade: number | null) => void;
  onBulkExport?: () => void;
}

export function GradeTable({ 
  studentGrades, 
  assignments, 
  loading = false, 
  onGradeUpdate,
  onBulkExport 
}: GradeTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null);

  const filteredStudents = studentGrades.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOverallGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Grade Book</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            {onBulkExport && (
              <Button variant="outline" onClick={onBulkExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Student</TableHead>
                <TableHead className="w-24">Class</TableHead>
                {assignments.map(assignment => (
                  <TableHead key={assignment.id} className="text-center min-w-24">
                    <div className="text-xs">
                      <div className="font-medium">{assignment.title}</div>
                      <div className="text-gray-500">({assignment.maxPoints} pts)</div>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center w-24">Overall</TableHead>
                <TableHead className="text-center w-16">Trend</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.studentId} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {student.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{student.studentName}</div>
                        {student.studentEmail && (
                          <div className="text-xs text-gray-500">{student.studentEmail}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {student.className}
                    </Badge>
                  </TableCell>
                  {assignments.map(assignment => {
                    const assignmentGrade = student.assignments[assignment.id];
                    return (
                      <TableCell key={assignment.id} className="text-center">
                        <GradeEntry
                          grade={assignmentGrade?.grade || null}
                          maxPoints={assignment.maxPoints}
                          onGradeChange={(grade) => onGradeUpdate(student.studentId, assignment.id, grade)}
                        />
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center">
                    <Badge className={getOverallGradeColor(student.overallGrade)}>
                      {student.overallGrade.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getTrendIcon(student.trend)}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{student.studentName} - Grade Details</DialogTitle>
                          <DialogDescription>
                            Overall Grade: {student.overallGrade.toFixed(1)}% | Attendance: {student.attendanceRate.toFixed(1)}%
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {assignments.map(assignment => {
                            const grade = student.assignments[assignment.id];
                            return (
                              <div key={assignment.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">{assignment.title}</h4>
                                  <Badge variant="outline">
                                    {grade?.grade || 0}/{assignment.maxPoints}
                                  </Badge>
                                </div>
                                {grade?.feedback && (
                                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    <strong>Feedback:</strong> {grade.feedback}
                                  </div>
                                )}
                                {grade?.submittedAt && (
                                  <div className="text-xs text-gray-500 mt-2">
                                    Submitted: {new Date(grade.submittedAt).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found matching your search criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
