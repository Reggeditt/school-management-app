'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  type: 'homework' | 'project' | 'quiz' | 'exam';
  dueDate: Date;
  submittedDate?: Date;
  grade?: string;
  points?: number;
  totalPoints: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  feedback?: string;
}

interface SubjectGrade {
  subject: string;
  currentGrade: string;
  percentage: number;
  assignments: Assignment[];
  teacher: string;
  totalAssignments: number;
  completedAssignments: number;
}

interface TermGrades {
  term: string;
  subjects: SubjectGrade[];
  overallGPA: number;
  overallGrade: string;
  rank?: number;
  totalStudents?: number;
}

export default function AcademicProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [termGrades, setTermGrades] = useState<TermGrades[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("current");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAcademicData();
  }, [selectedChild, selectedTerm]);

  const loadAcademicData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockChildren: Child[] = [
        {
          id: '1',
          name: 'Emma Johnson',
          grade: 'Grade 9',
          class: 'Grade 9A',
          studentId: 'STU001'
        },
        {
          id: '2',
          name: 'Michael Johnson',
          grade: 'Grade 6',
          class: 'Grade 6B',
          studentId: 'STU002'
        }
      ];

      const mockTermGrades: TermGrades[] = [
        {
          term: 'Current Term (Fall 2025)',
          overallGPA: 3.7,
          overallGrade: 'A-',
          rank: 5,
          totalStudents: 28,
          subjects: [
            {
              subject: 'Mathematics',
              currentGrade: 'A',
              percentage: 89,
              teacher: 'Dr. Sarah Wilson',
              totalAssignments: 8,
              completedAssignments: 7,
              assignments: [
                {
                  id: '1',
                  title: 'Algebra Test Chapter 5',
                  subject: 'Mathematics',
                  type: 'exam',
                  dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                  submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                  grade: 'A',
                  points: 85,
                  totalPoints: 100,
                  status: 'graded',
                  feedback: 'Excellent work on quadratic equations. Minor calculation error in problem 12.'
                },
                {
                  id: '2',
                  title: 'Geometry Homework',
                  subject: 'Mathematics',
                  type: 'homework',
                  dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                  totalPoints: 50,
                  status: 'pending'
                },
                {
                  id: '3',
                  title: 'Statistics Project',
                  subject: 'Mathematics',
                  type: 'project',
                  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                  totalPoints: 150,
                  status: 'pending'
                }
              ]
            },
            {
              subject: 'Science',
              currentGrade: 'A-',
              percentage: 87,
              teacher: 'Prof. John Davis',
              totalAssignments: 6,
              completedAssignments: 5,
              assignments: [
                {
                  id: '4',
                  title: 'Chemical Reactions Lab Report',
                  subject: 'Science',
                  type: 'project',
                  dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                  submittedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
                  grade: 'A-',
                  points: 87,
                  totalPoints: 100,
                  status: 'graded',
                  feedback: 'Good analysis and methodology. Include more detailed observations next time.'
                },
                {
                  id: '5',
                  title: 'Physics Quiz - Motion',
                  subject: 'Science',
                  type: 'quiz',
                  dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                  totalPoints: 25,
                  status: 'pending'
                }
              ]
            },
            {
              subject: 'English',
              currentGrade: 'B+',
              percentage: 84,
              teacher: 'Ms. Emily Brown',
              totalAssignments: 7,
              completedAssignments: 6,
              assignments: [
                {
                  id: '6',
                  title: 'Shakespeare Essay',
                  subject: 'English',
                  type: 'project',
                  dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                  submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                  grade: 'B+',
                  points: 84,
                  totalPoints: 100,
                  status: 'graded',
                  feedback: 'Well-structured essay with good analysis. Work on thesis statement clarity.'
                }
              ]
            }
          ]
        }
      ];

      setChildren(mockChildren);
      setTermGrades(mockTermGrades);
    } catch (error) {
      console.error("Error loading academic data:", error);
      toast({
        title: "Error",
        description: "Failed to load academic data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (['C+', 'C', 'C-'].includes(grade)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'project': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'quiz': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const currentTerm = termGrades.find(term => term.term.includes('Current'));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Academic Progress</h1>
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
          <h1 className="text-3xl font-bold">Academic Progress</h1>
          <p className="text-muted-foreground">
            Track grades, assignments, and academic performance
          </p>
        </div>
        <Button>
          📊 Download Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {children.map(child => (
              <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Term</SelectItem>
            <SelectItem value="previous">Previous Term</SelectItem>
            <SelectItem value="all">All Terms</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Input
            placeholder="Search subjects or assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Overall Performance Summary */}
      {currentTerm && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
              <div className="text-2xl">📊</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentTerm.overallGPA}</div>
              <p className="text-xs text-muted-foreground">
                Grade: {currentTerm.overallGrade}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
              <div className="text-2xl">🏆</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentTerm.rank || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                out of {currentTerm.totalStudents || 'N/A'} students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <div className="text-2xl">📚</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentTerm.subjects.length}</div>
              <p className="text-xs text-muted-foreground">
                Active subjects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <div className="text-2xl">📝</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentTerm.subjects.reduce((total, subject) => total + subject.completedAssignments, 0)} / {currentTerm.subjects.reduce((total, subject) => total + subject.totalAssignments, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Completed
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subjects">Subject Grades</TabsTrigger>
          <TabsTrigger value="assignments">All Assignments</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          {currentTerm && (
            <div className="grid gap-4">
              {currentTerm.subjects.map((subject, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{subject.subject}</CardTitle>
                        <CardDescription>Teacher: {subject.teacher}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={getGradeColor(subject.currentGrade)}>
                          {subject.currentGrade} ({subject.percentage}%)
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress: {subject.completedAssignments}/{subject.totalAssignments} assignments</span>
                        <span>{Math.round((subject.completedAssignments / subject.totalAssignments) * 100)}% complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(subject.completedAssignments / subject.totalAssignments) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Recent Assignments</h4>
                        {subject.assignments.slice(0, 3).map((assignment) => (
                          <div key={assignment.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{assignment.title}</span>
                                <Badge variant="outline" className={getTypeColor(assignment.type)}>
                                  {assignment.type}
                                </Badge>
                                <Badge className={getStatusColor(assignment.status)}>
                                  {assignment.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Due: {formatDate(assignment.dueDate)}
                                {assignment.points && (
                                  <span> • Score: {assignment.points}/{assignment.totalPoints}</span>
                                )}
                              </div>
                            </div>
                            {assignment.grade && (
                              <Badge className={getGradeColor(assignment.grade)}>
                                {assignment.grade}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>
                Complete list of assignments across all subjects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTerm && currentTerm.subjects.flatMap(subject => 
                    subject.assignments.filter(assignment =>
                      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  ).map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.title}</TableCell>
                      <TableCell>{assignment.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getTypeColor(assignment.type)}>
                          {assignment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(assignment.dueDate)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assignment.grade ? (
                          <Badge className={getGradeColor(assignment.grade)}>
                            {assignment.grade}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {assignment.points 
                          ? `${assignment.points}/${assignment.totalPoints}`
                          : `- /${assignment.totalPoints}`
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tracking Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Trends</CardTitle>
              <CardDescription>
                Performance trends and insights over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-lg font-semibold mb-2">Progress Charts Coming Soon</h3>
                <p>Visual progress tracking and analytics will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
