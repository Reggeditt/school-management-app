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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
}

interface GradeReport {
  id: string;
  term: string;
  year: string;
  subjects: {
    subject: string;
    grade: string;
    percentage: number;
    teacher: string;
    comments: string;
  }[];
  overallGPA: number;
  overallGrade: string;
  rank: number;
  totalStudents: number;
  attendance: number;
  behavior: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  issued: Date;
}

interface AttendanceReport {
  id: string;
  period: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  attendanceRate: number;
  punctualityRate: number;
  monthlyBreakdown: {
    month: string;
    present: number;
    absent: number;
    late: number;
    total: number;
  }[];
}

interface BehaviorReport {
  id: string;
  period: string;
  overallBehavior: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  categories: {
    category: string;
    rating: number;
    maxRating: number;
    comments: string;
  }[];
  incidents: {
    date: Date;
    type: 'positive' | 'negative';
    description: string;
    action: string;
  }[];
  teacherComments: string;
}

interface ProgressReport {
  id: string;
  term: string;
  improvements: string[];
  strengths: string[];
  areasForGrowth: string[];
  goals: string[];
  parentComments?: string;
  teacherComments: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [gradeReports, setGradeReports] = useState<GradeReport[]>([]);
  const [attendanceReports, setAttendanceReports] = useState<AttendanceReport[]>([]);
  const [behaviorReports, setBehaviorReports] = useState<BehaviorReport[]>([]);
  const [progressReports, setProgressReports] = useState<ProgressReport[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadReportsData();
  }, [selectedChild, selectedPeriod]);

  const loadReportsData = async () => {
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

      const mockGradeReports: GradeReport[] = [
        {
          id: '1',
          term: 'Fall Term 2024',
          year: '2024-2025',
          overallGPA: 3.7,
          overallGrade: 'A-',
          rank: 5,
          totalStudents: 28,
          attendance: 96,
          behavior: 'excellent',
          issued: new Date('2024-12-15'),
          subjects: [
            {
              subject: 'Mathematics',
              grade: 'A',
              percentage: 89,
              teacher: 'Dr. Sarah Wilson',
              comments: 'Excellent understanding of algebraic concepts. Shows strong problem-solving skills.'
            },
            {
              subject: 'English',
              grade: 'A-',
              percentage: 87,
              teacher: 'Ms. Emily Brown',
              comments: 'Great improvement in essay writing. Creative and thoughtful analysis in literature discussions.'
            },
            {
              subject: 'Science',
              grade: 'A',
              percentage: 91,
              teacher: 'Prof. John Davis',
              comments: 'Outstanding performance in laboratory work. Shows genuine interest in scientific inquiry.'
            },
            {
              subject: 'History',
              grade: 'B+',
              percentage: 84,
              teacher: 'Mr. Robert Smith',
              comments: 'Good research skills and historical analysis. Could improve on timeline memorization.'
            },
            {
              subject: 'Physical Education',
              grade: 'A',
              percentage: 95,
              teacher: 'Coach Mike Wilson',
              comments: 'Excellent teamwork and leadership skills. Consistent participation and effort.'
            }
          ]
        },
        {
          id: '2',
          term: 'Spring Term 2024',
          year: '2023-2024',
          overallGPA: 3.5,
          overallGrade: 'B+',
          rank: 8,
          totalStudents: 28,
          attendance: 94,
          behavior: 'good',
          issued: new Date('2024-06-15'),
          subjects: [
            {
              subject: 'Mathematics',
              grade: 'B+',
              percentage: 85,
              teacher: 'Dr. Sarah Wilson',
              comments: 'Steady improvement throughout the term. Needs to work on confidence during tests.'
            },
            {
              subject: 'English',
              grade: 'A-',
              percentage: 88,
              teacher: 'Ms. Emily Brown',
              comments: 'Excellent creative writing skills. Participates well in class discussions.'
            },
            {
              subject: 'Science',
              grade: 'B',
              percentage: 82,
              teacher: 'Prof. John Davis',
              comments: 'Good understanding of concepts but needs to pay more attention to detail in lab reports.'
            }
          ]
        }
      ];

      const mockAttendanceReports: AttendanceReport[] = [
        {
          id: '1',
          period: 'Fall Term 2024',
          totalDays: 90,
          presentDays: 86,
          absentDays: 2,
          lateDays: 2,
          excusedDays: 0,
          attendanceRate: 96,
          punctualityRate: 95,
          monthlyBreakdown: [
            { month: 'September', present: 20, absent: 0, late: 1, total: 21 },
            { month: 'October', present: 22, absent: 1, late: 0, total: 23 },
            { month: 'November', present: 21, absent: 1, late: 1, total: 23 },
            { month: 'December', present: 23, absent: 0, late: 0, total: 23 }
          ]
        }
      ];

      const mockBehaviorReports: BehaviorReport[] = [
        {
          id: '1',
          period: 'Fall Term 2024',
          overallBehavior: 'excellent',
          teacherComments: 'Emma is a model student who consistently demonstrates respect, responsibility, and kindness. She is a positive influence on her peers.',
          categories: [
            { category: 'Respect for Others', rating: 5, maxRating: 5, comments: 'Always courteous and considerate' },
            { category: 'Following Instructions', rating: 5, maxRating: 5, comments: 'Excellent listener and follows directions' },
            { category: 'Class Participation', rating: 4, maxRating: 5, comments: 'Active participant, could speak up more' },
            { category: 'Cooperation', rating: 5, maxRating: 5, comments: 'Works well with all classmates' },
            { category: 'Self-Control', rating: 5, maxRating: 5, comments: 'Excellent emotional regulation' }
          ],
          incidents: [
            {
              date: new Date('2024-11-15'),
              type: 'positive',
              description: 'Helped new student feel welcome',
              action: 'Peer recognition award'
            },
            {
              date: new Date('2024-10-20'),
              type: 'positive',
              description: 'Led successful group project',
              action: 'Leadership recognition'
            }
          ]
        }
      ];

      const mockProgressReports: ProgressReport[] = [
        {
          id: '1',
          term: 'Fall Term 2024',
          teacherComments: 'Emma has shown remarkable growth this term. Her analytical thinking has improved significantly, and she approaches challenges with confidence.',
          improvements: [
            'Mathematical problem-solving speed increased by 25%',
            'Essay writing quality improved from B to A level',
            'Science lab accuracy improved to 95%',
            'Increased participation in class discussions'
          ],
          strengths: [
            'Strong analytical thinking skills',
            'Excellent time management',
            'Natural leadership abilities',
            'Creative problem-solving approach',
            'Positive attitude towards learning'
          ],
          areasForGrowth: [
            'Could benefit from more confidence in public speaking',
            'Time management during exam situations',
            'Asking for help when needed',
            'Taking on more challenging projects'
          ],
          goals: [
            'Join the debate team to improve public speaking',
            'Participate in the upcoming science fair',
            'Mentor a younger student in mathematics',
            'Maintain current GPA while taking on advanced courses'
          ]
        }
      ];

      setChildren(mockChildren);
      setGradeReports(mockGradeReports);
      setAttendanceReports(mockAttendanceReports);
      setBehaviorReports(mockBehaviorReports);
      setProgressReports(mockProgressReports);
    } catch (error) {
      console.error("Error loading reports data:", error);
      toast({
        title: "Error",
        description: "Failed to load reports data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (reportType: string, reportId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${reportType} report...`,
    });
    // Implement actual download logic here
  };

  const getBehaviorColor = (behavior: string) => {
    switch (behavior) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'satisfactory': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'needs_improvement': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (['C+', 'C', 'C-'].includes(grade)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reports</h1>
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
          <h1 className="text-3xl font-bold">Academic Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive reports on academic performance and progress
          </p>
        </div>
        <Button onClick={() => downloadReport('All', 'comprehensive')}>
          📄 Download All Reports
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

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Term</SelectItem>
            <SelectItem value="previous">Previous Term</SelectItem>
            <SelectItem value="year">Academic Year</SelectItem>
            <SelectItem value="all">All Periods</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="grades" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grades">Grade Reports</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Grade Reports Tab */}
        <TabsContent value="grades" className="space-y-4">
          {gradeReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{report.term} - Report Card</CardTitle>
                    <CardDescription>
                      Issued: {formatDate(report.issued)} • GPA: {report.overallGPA} ({report.overallGrade})
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getGradeColor(report.overallGrade)}>
                      {report.overallGrade}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => downloadReport('Grade', report.id)}>
                      📄 Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Subject Grades */}
                  <div>
                    <h4 className="font-medium mb-3">Subject Grades</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>%</TableHead>
                          <TableHead>Teacher</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.subjects.map((subject, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{subject.subject}</TableCell>
                            <TableCell>
                              <Badge className={getGradeColor(subject.grade)}>
                                {subject.grade}
                              </Badge>
                            </TableCell>
                            <TableCell>{subject.percentage}%</TableCell>
                            <TableCell className="text-sm">{subject.teacher}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary & Comments */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Overall Performance</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Class Rank:</span>
                          <span className="font-medium ml-2">{report.rank} of {report.totalStudents}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Attendance:</span>
                          <span className="font-medium ml-2">{report.attendance}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Behavior:</span>
                          <Badge className={getBehaviorColor(report.behavior)}>
                            {report.behavior.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">GPA:</span>
                          <span className="font-medium ml-2">{report.overallGPA}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Teacher Comments</h4>
                      <div className="space-y-2">
                        {report.subjects.map((subject, index) => (
                          <div key={index} className="p-2 border rounded text-sm">
                            <div className="font-medium">{subject.subject}:</div>
                            <div className="text-muted-foreground">{subject.comments}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Attendance Reports Tab */}
        <TabsContent value="attendance" className="space-y-4">
          {attendanceReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Attendance Report - {report.period}</CardTitle>
                    <CardDescription>
                      Overall Rate: {report.attendanceRate}% • Punctuality: {report.punctualityRate}%
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadReport('Attendance', report.id)}>
                    📄 Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Summary Stats */}
                  <div>
                    <h4 className="font-medium mb-3">Attendance Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Present Days</span>
                        <span className="font-medium text-green-600">{report.presentDays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Absent Days</span>
                        <span className="font-medium text-red-600">{report.absentDays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Late Days</span>
                        <span className="font-medium text-yellow-600">{report.lateDays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Excused Days</span>
                        <span className="font-medium text-blue-600">{report.excusedDays}</span>
                      </div>
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="font-medium">Total School Days</span>
                        <span className="font-medium">{report.totalDays}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Attendance Rate</span>
                        <span>{report.attendanceRate}%</span>
                      </div>
                      <Progress value={report.attendanceRate} className="h-2" />
                    </div>
                  </div>

                  {/* Monthly Breakdown */}
                  <div>
                    <h4 className="font-medium mb-3">Monthly Breakdown</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Absent</TableHead>
                          <TableHead>Late</TableHead>
                          <TableHead>Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.monthlyBreakdown.map((month, index) => {
                          const rate = Math.round(((month.present + month.late) / month.total) * 100);
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{month.month}</TableCell>
                              <TableCell className="text-green-600">{month.present}</TableCell>
                              <TableCell className="text-red-600">{month.absent}</TableCell>
                              <TableCell className="text-yellow-600">{month.late}</TableCell>
                              <TableCell>
                                <Badge variant={rate >= 95 ? 'default' : rate >= 90 ? 'secondary' : 'destructive'}>
                                  {rate}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Behavior Reports Tab */}
        <TabsContent value="behavior" className="space-y-4">
          {behaviorReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Behavior Report - {report.period}</CardTitle>
                    <CardDescription>
                      Overall Rating: {report.overallBehavior.replace('_', ' ')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getBehaviorColor(report.overallBehavior)}>
                      {report.overallBehavior.replace('_', ' ')}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => downloadReport('Behavior', report.id)}>
                      📄 Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Behavior Categories */}
                  <div>
                    <h4 className="font-medium mb-3">Behavior Categories</h4>
                    <div className="space-y-3">
                      {report.categories.map((category, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{category.category}</span>
                            <span className="text-sm">{category.rating}/{category.maxRating}</span>
                          </div>
                          <Progress value={(category.rating / category.maxRating) * 100} className="h-2" />
                          {category.comments && (
                            <p className="text-xs text-muted-foreground">{category.comments}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Incidents & Comments */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Notable Incidents</h4>
                      <div className="space-y-2">
                        {report.incidents.map((incident, index) => (
                          <div key={index} className={`p-3 border rounded-lg ${
                            incident.type === 'positive' ? 'border-green-200 bg-green-50 dark:bg-green-950' : 
                            'border-red-200 bg-red-50 dark:bg-red-950'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={incident.type === 'positive' ? 'default' : 'destructive'}>
                                {incident.type === 'positive' ? '✅' : '⚠️'} {incident.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {incident.date.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-1">{incident.description}</p>
                            <p className="text-xs text-muted-foreground">Action: {incident.action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Teacher Comments</h4>
                      <div className="p-3 border rounded-lg bg-muted/50">
                        <p className="text-sm">{report.teacherComments}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Progress Reports Tab */}
        <TabsContent value="progress" className="space-y-4">
          {progressReports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Progress Report - {report.term}</CardTitle>
                    <CardDescription>
                      Comprehensive progress assessment and goal setting
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadReport('Progress', report.id)}>
                    📄 Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Improvements & Strengths */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        📈 Improvements This Term
                      </h4>
                      <ul className="space-y-2">
                        {report.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        💪 Strengths
                      </h4>
                      <ul className="space-y-2">
                        {report.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Areas for Growth & Goals */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🌱 Areas for Growth
                      </h4>
                      <ul className="space-y-2">
                        {report.areasForGrowth.map((area, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        🎯 Goals for Next Term
                      </h4>
                      <ul className="space-y-2">
                        {report.goals.map((goal, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Teacher Comments</h4>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm">{report.teacherComments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
