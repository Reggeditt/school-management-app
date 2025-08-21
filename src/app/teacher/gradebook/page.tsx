'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Calculator, 
  TrendingUp,
  Search,
  Plus,
  Download,
  Upload,
  Edit,
  Save,
  Users,
  Award,
  BarChart3,
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';

// Custom hooks and services
import { useTeacherData } from '@/hooks/teacher';
import { Class, Student } from '@/lib/database-services';

interface Assignment {
  id: string;
  name: string;
  type: 'assignment' | 'quiz' | 'test' | 'project';
  maxPoints: number;
  dueDate: string;
  classId: string;
}

interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  points: number;
  submittedAt?: string;
  notes?: string;
}

interface StudentGradebook {
  student: Student;
  grades: { [assignmentId: string]: Grade };
  average: number;
  letterGrade: string;
}

export default function GradebookPage() {
  const { 
    teacherClasses, 
    teacherStudents, 
    loading, 
    error, 
    getStudentsForClass 
  } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradebook, setGradebook] = useState<StudentGradebook[]>([]);
  const [editingGrade, setEditingGrade] = useState<{ studentId: string; assignmentId: string } | null>(null);
  const [tempGradeValue, setTempGradeValue] = useState<string>('');

  // Mock assignments data
  useEffect(() => {
    if (selectedClass) {
      const mockAssignments: Assignment[] = [
        {
          id: 'assgn1',
          name: 'Math Quiz #1',
          type: 'quiz',
          maxPoints: 20,
          dueDate: '2024-01-15',
          classId: selectedClass
        },
        {
          id: 'assgn2',
          name: 'Algebra Assignment',
          type: 'assignment',
          maxPoints: 50,
          dueDate: '2024-01-20',
          classId: selectedClass
        },
        {
          id: 'assgn3',
          name: 'Mid-term Test',
          type: 'test',
          maxPoints: 100,
          dueDate: '2024-01-25',
          classId: selectedClass
        },
        {
          id: 'assgn4',
          name: 'Group Project',
          type: 'project',
          maxPoints: 75,
          dueDate: '2024-02-01',
          classId: selectedClass
        }
      ];
      setAssignments(mockAssignments);

      // Generate mock grades
      const classStudents = getStudentsForClass(selectedClass);
      const mockGrades: Grade[] = [];
      
      classStudents.forEach(student => {
        mockAssignments.forEach(assignment => {
          const points = Math.floor(Math.random() * assignment.maxPoints * 0.4) + 
                        Math.floor(assignment.maxPoints * 0.6); // 60-100% range
          
          mockGrades.push({
            id: `grade_${student.id}_${assignment.id}`,
            studentId: student.id,
            assignmentId: assignment.id,
            points,
            submittedAt: new Date().toISOString()
          });
        });
      });
      
      setGrades(mockGrades);
    }
  }, [selectedClass, getStudentsForClass]);

  // Calculate gradebook
  useEffect(() => {
    if (selectedClass && assignments.length > 0 && grades.length > 0) {
      const classStudents = getStudentsForClass(selectedClass);
      
      const studentGradebooks: StudentGradebook[] = classStudents.map(student => {
        const studentGrades: { [assignmentId: string]: Grade } = {};
        let totalPoints = 0;
        let maxTotalPoints = 0;

        assignments.forEach(assignment => {
          const grade = grades.find(g => g.studentId === student.id && g.assignmentId === assignment.id);
          if (grade) {
            studentGrades[assignment.id] = grade;
            totalPoints += grade.points;
          }
          maxTotalPoints += assignment.maxPoints;
        });

        const average = maxTotalPoints > 0 ? (totalPoints / maxTotalPoints) * 100 : 0;
        const letterGrade = 
          average >= 90 ? 'A' :
          average >= 80 ? 'B' :
          average >= 70 ? 'C' :
          average >= 60 ? 'D' : 'F';

        return {
          student,
          grades: studentGrades,
          average,
          letterGrade
        };
      });

      setGradebook(studentGradebooks);
    }
  }, [selectedClass, assignments, grades, getStudentsForClass]);

  const filteredGradebook = gradebook.filter(entry =>
    entry.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.student.rollNumber.toString().includes(searchTerm)
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-100 text-blue-800';
      case 'assignment': return 'bg-green-100 text-green-800';
      case 'test': return 'bg-red-100 text-red-800';
      case 'project': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleGradeEdit = (studentId: string, assignmentId: string, currentPoints: number) => {
    setEditingGrade({ studentId, assignmentId });
    setTempGradeValue(currentPoints.toString());
  };

  const handleGradeSave = (studentId: string, assignmentId: string) => {
    const newPoints = parseFloat(tempGradeValue);
    const assignment = assignments.find(a => a.id === assignmentId);
    
    if (assignment && !isNaN(newPoints) && newPoints >= 0 && newPoints <= assignment.maxPoints) {
      setGrades(prev => prev.map(grade => 
        grade.studentId === studentId && grade.assignmentId === assignmentId
          ? { ...grade, points: newPoints }
          : grade
      ));
    }
    
    setEditingGrade(null);
    setTempGradeValue('');
  };

  const classStats = gradebook.length > 0 ? {
    totalStudents: gradebook.length,
    classAverage: Math.round(gradebook.reduce((sum, entry) => sum + entry.average, 0) / gradebook.length),
    aGrades: gradebook.filter(entry => entry.letterGrade === 'A').length,
    failingGrades: gradebook.filter(entry => entry.letterGrade === 'F').length
  } : null;

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
        
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Gradebook</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gradebook</h1>
        <p className="text-muted-foreground">
          Manage grades and track student performance across your classes
        </p>
      </div>

      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Class</CardTitle>
          <CardDescription>Choose a class to view and manage grades</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full md:w-80">
              <SelectValue placeholder="Select a class to view grades" />
            </SelectTrigger>
            <SelectContent>
              {teacherClasses.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name} - Grade {classItem.grade}, Section {classItem.section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedClass && classStats && (
        <>
          {/* Class Statistics */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classStats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getGradeColor(classStats.classAverage)}`}>
                  {classStats.classAverage}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">A Grades</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{classStats.aGrades}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((classStats.aGrades / classStats.totalStudents) * 100)}% of class
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{classStats.failingGrades}</div>
                <p className="text-xs text-muted-foreground">Students failing</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
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
            
            <div className="flex space-x-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Grades
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Grades
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Assignment
              </Button>
            </div>
          </div>

          {/* Gradebook Table */}
          <Card>
            <CardHeader>
              <CardTitle>Class Gradebook</CardTitle>
              <CardDescription>
                Click on any grade to edit. Assignment types: 
                {assignments.map((assignment, index) => (
                  <Badge key={assignment.id} variant="outline" className={`ml-2 ${getTypeColor(assignment.type)}`}>
                    {assignment.type}
                  </Badge>
                ))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-60">Student</TableHead>
                      {assignments.map((assignment) => (
                        <TableHead key={assignment.id} className="text-center min-w-32">
                          <div className="space-y-1">
                            <div className="font-medium">{assignment.name}</div>
                            <Badge variant="outline" className={getTypeColor(assignment.type)}>
                              {assignment.type}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {assignment.maxPoints} pts
                            </div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Average</TableHead>
                      <TableHead className="text-center">Letter Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGradebook.map((entry) => (
                      <TableRow key={entry.student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={entry.student.profilePicture} />
                              <AvatarFallback>
                                {getInitials(entry.student.firstName, entry.student.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {entry.student.firstName} {entry.student.lastName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Roll: {entry.student.rollNumber}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        {assignments.map((assignment) => {
                          const grade = entry.grades[assignment.id];
                          const isEditing = editingGrade?.studentId === entry.student.id && 
                                          editingGrade?.assignmentId === assignment.id;
                          
                          return (
                            <TableCell key={assignment.id} className="text-center">
                              {isEditing ? (
                                <div className="flex items-center space-x-1">
                                  <Input
                                    type="number"
                                    value={tempGradeValue}
                                    onChange={(e) => setTempGradeValue(e.target.value)}
                                    className="w-16 h-8 text-center"
                                    max={assignment.maxPoints}
                                    min="0"
                                  />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleGradeSave(entry.student.id, assignment.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Save className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : grade ? (
                                <button
                                  onClick={() => handleGradeEdit(entry.student.id, assignment.id, grade.points)}
                                  className="text-center hover:bg-gray-100 p-2 rounded cursor-pointer"
                                >
                                  <div className="font-medium">{grade.points}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {Math.round((grade.points / assignment.maxPoints) * 100)}%
                                  </div>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleGradeEdit(entry.student.id, assignment.id, 0)}
                                  className="text-muted-foreground hover:bg-gray-100 p-2 rounded cursor-pointer"
                                >
                                  <div>-</div>
                                  <div className="text-xs">Not graded</div>
                                </button>
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell className="text-center">
                          <div className={`font-bold ${getGradeColor(entry.average)}`}>
                            {Math.round(entry.average)}%
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={entry.letterGrade === 'A' ? 'default' : 
                                       entry.letterGrade === 'F' ? 'destructive' : 'secondary'}>
                            {entry.letterGrade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedClass && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select a Class</h3>
          <p className="text-muted-foreground">
            Choose a class from the dropdown above to view and manage grades.
          </p>
        </div>
      )}
    </div>
  );
}
