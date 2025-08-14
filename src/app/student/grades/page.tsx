'use client';

import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import {
  Star,
  TrendingUp,
  Award,
  FileText,
  Calendar,
  BarChart3,
  Download,
  Filter
} from 'lucide-react';

export default function StudentGrades() {
  const { user } = useAuth();
  const { state } = useStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

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

  // Get student's exam records
  const studentExams = state.exams.filter(e => 
    studentClasses.some(c => e.classIds.includes(c.id))
  );

  // Filter exams by student results
  const examsWithResults = studentExams
    .map(exam => {
      const studentResult = exam.results?.[currentStudent?.id || ''];
      if (studentResult) {
        return {
          ...exam,
          studentResult,
          subject: studentSubjects.find(s => s.id === exam.subjectId)
        };
      }
      return null;
    })
    .filter(Boolean);

  // Apply filters
  const filteredExams = examsWithResults.filter(exam => {
    if (!exam) return false;
    
    if (selectedSubject !== 'all' && exam.subjectId !== selectedSubject) {
      return false;
    }
    
    // Add term filtering if needed
    return true;
  });

  // Calculate statistics
  const gradePoints = { 'A': 4, 'B': 3, 'C': 2, 'D': 1, 'F': 0 };
  const totalExams = filteredExams.length;
  const averageScore = totalExams > 0 
    ? filteredExams.reduce((sum, exam) => sum + (exam?.studentResult.marksObtained || 0), 0) / totalExams
    : 0;
  
  const averageGrade = totalExams > 0
    ? filteredExams.reduce((sum, exam) => {
        const grade = exam?.studentResult.grade || 'F';
        return sum + (gradePoints[grade as keyof typeof gradePoints] || 0);
      }, 0) / totalExams
    : 0;

  const getGradeFromPoints = (points: number): string => {
    if (points >= 3.5) return 'A';
    if (points >= 2.5) return 'B';
    if (points >= 1.5) return 'C';
    if (points >= 0.5) return 'D';
    return 'F';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Subject-wise performance
  const subjectPerformance = studentSubjects.map(subject => {
    const subjectExams = filteredExams.filter(e => e?.subjectId === subject.id);
    const subjectAverage = subjectExams.length > 0
      ? subjectExams.reduce((sum, exam) => sum + (exam?.studentResult.marksObtained || 0), 0) / subjectExams.length
      : 0;
    
    const subjectGradeAvg = subjectExams.length > 0
      ? subjectExams.reduce((sum, exam) => {
          const grade = exam?.studentResult.grade || 'F';
          return sum + (gradePoints[grade as keyof typeof gradePoints] || 0);
        }, 0) / subjectExams.length
      : 0;

    return {
      subject,
      average: subjectAverage,
      gradeAverage: subjectGradeAvg,
      examCount: subjectExams.length,
      grade: getGradeFromPoints(subjectGradeAvg)
    };
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Grades & Results</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGrade.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Grade: {getGradeFromPoints(averageGrade)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExams}</div>
            <p className="text-xs text-muted-foreground">
              Completed this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Not calculated
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {studentSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  <SelectItem value="1">First Term</SelectItem>
                  <SelectItem value="2">Second Term</SelectItem>
                  <SelectItem value="3">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList>
          <TabsTrigger value="results">Exam Results</TabsTrigger>
          <TabsTrigger value="subjects">Subject Performance</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                      <TableRow key={exam?.id}>
                        <TableCell className="font-medium">{exam?.name}</TableCell>
                        <TableCell>{exam?.subject?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {exam?.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(exam?.date || new Date())}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{exam?.studentResult.marksObtained}/{exam?.totalMarks}</span>
                            <span className="text-sm text-gray-500">
                              ({((exam?.studentResult.marksObtained || 0) / (exam?.totalMarks || 1) * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGradeColor(exam?.studentResult.grade || 'F')}>
                            {exam?.studentResult.grade}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {exam?.studentResult.rank ? `#${exam.studentResult.rank}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No exam results found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjectPerformance.map((performance) => (
              <Card key={performance.subject.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{performance.subject.name}</span>
                    <Badge className={getGradeColor(performance.grade)}>
                      {performance.grade}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span>{performance.average.toFixed(1)}%</span>
                      </div>
                      <Progress value={performance.average} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Exams Taken</p>
                        <p className="font-semibold">{performance.examCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">GPA</p>
                        <p className="font-semibold">{performance.gradeAverage.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Performance Analytics</p>
                <p>Detailed performance trends and analytics charts will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
