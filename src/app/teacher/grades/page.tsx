'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
}

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentType: string;
  pointsEarned: number;
  totalPoints: number;
  percentage: number;
  letterGrade: string;
  submittedAt: Date;
  gradedAt: Date;
  feedback?: string;
}

interface GradeSummary {
  studentId: string;
  studentName: string;
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  letterGrade: string;
  assignmentCount: number;
}

export default function TeacherGrades() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [gradeSummaries, setGradeSummaries] = useState<GradeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockGrades: Grade[] = [
        {
          id: '1',
          studentId: 's1',
          studentName: 'John Smith',
          assignmentId: 'a1',
          assignmentTitle: 'Algebra Chapter 5 Homework',
          assignmentType: 'homework',
          pointsEarned: 85,
          totalPoints: 100,
          percentage: 85,
          letterGrade: 'B',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          feedback: 'Good work on most problems. Review factoring methods.'
        },
        {
          id: '2',
          studentId: 's1',
          studentName: 'John Smith',
          assignmentId: 'a2',
          assignmentTitle: 'Science Fair Project',
          assignmentType: 'project',
          pointsEarned: 180,
          totalPoints: 200,
          percentage: 90,
          letterGrade: 'A-',
          submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          gradedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          feedback: 'Excellent experiment design and presentation.'
        },
        {
          id: '3',
          studentId: 's2',
          studentName: 'Emma Johnson',
          assignmentId: 'a1',
          assignmentTitle: 'Algebra Chapter 5 Homework',
          assignmentType: 'homework',
          pointsEarned: 95,
          totalPoints: 100,
          percentage: 95,
          letterGrade: 'A',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          feedback: 'Perfect work! All problems solved correctly.'
        },
        {
          id: '4',
          studentId: 's2',
          studentName: 'Emma Johnson',
          assignmentId: 'a3',
          assignmentTitle: 'Physics Quiz - Motion',
          assignmentType: 'quiz',
          pointsEarned: 42,
          totalPoints: 50,
          percentage: 84,
          letterGrade: 'B',
          submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          gradedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          feedback: 'Good understanding of concepts. Minor calculation errors.'
        },
        {
          id: '5',
          studentId: 's3',
          studentName: 'Michael Brown',
          assignmentId: 'a1',
          assignmentTitle: 'Algebra Chapter 5 Homework',
          assignmentType: 'homework',
          pointsEarned: 72,
          totalPoints: 100,
          percentage: 72,
          letterGrade: 'C',
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          gradedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          feedback: 'Needs improvement on complex equations. Come to office hours.'
        }
      ];

      setGrades(mockGrades);
      
      // Calculate grade summaries
      const studentGrades = mockGrades.reduce((acc, grade) => {
        if (!acc[grade.studentId]) {
          acc[grade.studentId] = {
            studentId: grade.studentId,
            studentName: grade.studentName,
            totalPoints: 0,
            earnedPoints: 0,
            assignmentCount: 0
          };
        }
        
        acc[grade.studentId].totalPoints += grade.totalPoints;
        acc[grade.studentId].earnedPoints += grade.pointsEarned;
        acc[grade.studentId].assignmentCount += 1;
        
        return acc;
      }, {} as Record<string, any>);

      const summaries: GradeSummary[] = Object.values(studentGrades).map((summary: any) => {
        const percentage = Math.round((summary.earnedPoints / summary.totalPoints) * 100);
        return {
          ...summary,
          percentage,
          letterGrade: getLetterGrade(percentage)
        };
      });

      setGradeSummaries(summaries);
    } catch (error) {
      console.error("Error loading grades:", error);
      toast({
        title: "Error",
        description: "Failed to load grades",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLetterGrade = (percentage: number): string => {
    if (percentage >= 97) return 'A+';
    if (percentage >= 93) return 'A';
    if (percentage >= 90) return 'A-';
    if (percentage >= 87) return 'B+';
    if (percentage >= 83) return 'B';
    if (percentage >= 80) return 'B-';
    if (percentage >= 77) return 'C+';
    if (percentage >= 73) return 'C';
    if (percentage >= 70) return 'C-';
    if (percentage >= 67) return 'D+';
    if (percentage >= 63) return 'D';
    if (percentage >= 60) return 'D-';
    return 'F';
  };

  const getGradeColor = (letterGrade: string) => {
    if (['A+', 'A', 'A-'].includes(letterGrade)) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (['B+', 'B', 'B-'].includes(letterGrade)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (['C+', 'C', 'C-'].includes(letterGrade)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    if (['D+', 'D', 'D-'].includes(letterGrade)) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const filteredGrades = grades.filter(grade => 
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.assignmentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSummaries = gradeSummaries.filter(summary => 
    summary.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gradebook</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gradebook</h1>
          <p className="text-muted-foreground">
            Track and manage student grades and performance
          </p>
        </div>
        <Button>
          📊 Export Grades
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search students or assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Grade Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Grades</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Grade Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Grade Summary</CardTitle>
              <CardDescription>
                Overall performance across all assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assignments</TableHead>
                    <TableHead>Points Earned</TableHead>
                    <TableHead>Total Points</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSummaries.map((summary) => (
                    <TableRow key={summary.studentId}>
                      <TableCell className="font-medium">{summary.studentName}</TableCell>
                      <TableCell>{summary.assignmentCount}</TableCell>
                      <TableCell>{summary.earnedPoints}</TableCell>
                      <TableCell>{summary.totalPoints}</TableCell>
                      <TableCell>{summary.percentage}%</TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(summary.letterGrade)}>
                          {summary.letterGrade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Grades Tab */}
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Assignment Grades</CardTitle>
              <CardDescription>
                Detailed breakdown of all graded assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Graded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGrades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">{grade.studentName}</TableCell>
                      <TableCell>{grade.assignmentTitle}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {grade.assignmentType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {grade.pointsEarned}/{grade.totalPoints}
                      </TableCell>
                      <TableCell>
                        <Badge className={getGradeColor(grade.letterGrade)}>
                          {grade.letterGrade} ({grade.percentage}%)
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(grade.submittedAt)}</TableCell>
                      <TableCell>{formatDate(grade.gradedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Class Average
                </CardTitle>
                <div className="text-2xl">📊</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gradeSummaries.length > 0 
                    ? Math.round(gradeSummaries.reduce((sum, s) => sum + s.percentage, 0) / gradeSummaries.length)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Overall class performance
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  A Students
                </CardTitle>
                <div className="text-2xl">🌟</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gradeSummaries.filter(s => ['A+', 'A', 'A-'].includes(s.letterGrade)).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Students with A grades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Needs Help
                </CardTitle>
                <div className="text-2xl">⚠️</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {gradeSummaries.filter(s => ['D+', 'D', 'D-', 'F'].includes(s.letterGrade)).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Students below C grade
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assignments Graded
                </CardTitle>
                <div className="text-2xl">✅</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{grades.length}</div>
                <p className="text-xs text-muted-foreground">
                  Total graded submissions
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>
                Breakdown of letter grades across all students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'].map(grade => {
                  const count = gradeSummaries.filter(s => s.letterGrade === grade).length;
                  const percentage = gradeSummaries.length > 0 ? (count / gradeSummaries.length) * 100 : 0;
                  
                  return (
                    <div key={grade} className="flex items-center space-x-3">
                      <div className="w-8 text-sm font-medium">{grade}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-sm text-muted-foreground">
                        {count} ({Math.round(percentage)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
