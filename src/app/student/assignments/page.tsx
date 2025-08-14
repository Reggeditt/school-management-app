'use client';

import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Edit,
  Filter
} from 'lucide-react';

export default function StudentAssignments() {
  const { user } = useAuth();
  const { state } = useStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Find current student data
  const currentStudent = state.students.find(s => s.email === user?.email);
  
  // Get student's classes and subjects
  const studentClasses = state.classes.filter(c => 
    currentStudent && c.students.includes(currentStudent.id)
  );
  const studentSubjects = state.subjects.filter(s => 
    studentClasses.some(c => s.classIds.includes(c.id))
  );

  // Mock assignments data - in a real app, this would come from the database
  const mockAssignments = [
    {
      id: '1',
      title: 'Quadratic Equations Problem Set',
      subject: 'Mathematics',
      subjectId: studentSubjects[0]?.id || '1',
      description: 'Solve the given quadratic equations using various methods including factoring, completing the square, and the quadratic formula.',
      dueDate: new Date('2025-08-25'),
      assignedDate: new Date('2025-08-15'),
      status: 'pending' as const,
      priority: 'high' as const,
      totalMarks: 50,
      submittedAt: null,
      grade: null,
      feedback: null,
      attachments: ['quadratic_problems.pdf'],
      submissionType: 'file' as const
    },
    {
      id: '2',
      title: 'Shakespeare Essay - Hamlet Analysis',
      subject: 'English Literature',
      subjectId: studentSubjects[1]?.id || '2',
      description: 'Write a 1000-word essay analyzing the character development of Hamlet throughout the play.',
      dueDate: new Date('2025-08-30'),
      assignedDate: new Date('2025-08-10'),
      status: 'submitted' as const,
      priority: 'medium' as const,
      totalMarks: 100,
      submittedAt: new Date('2025-08-20'),
      grade: 85,
      feedback: 'Excellent analysis with strong textual evidence. Consider exploring more themes in future essays.',
      attachments: ['hamlet_analysis.docx'],
      submissionType: 'text' as const
    },
    {
      id: '3',
      title: 'Lab Report - Chemical Reactions',
      subject: 'Chemistry',
      subjectId: studentSubjects[2]?.id || '3',
      description: 'Document your observations from the chemical reactions lab and provide analysis of the results.',
      dueDate: new Date('2025-08-22'),
      assignedDate: new Date('2025-08-12'),
      status: 'overdue' as const,
      priority: 'high' as const,
      totalMarks: 75,
      submittedAt: null,
      grade: null,
      feedback: null,
      attachments: ['lab_template.pdf'],
      submissionType: 'file' as const
    },
    {
      id: '4',
      title: 'Historical Timeline Project',
      subject: 'History',
      subjectId: studentSubjects[3]?.id || '4',
      description: 'Create a comprehensive timeline of World War II events with key battles and dates.',
      dueDate: new Date('2025-09-05'),
      assignedDate: new Date('2025-08-18'),
      status: 'pending' as const,
      priority: 'low' as const,
      totalMarks: 60,
      submittedAt: null,
      grade: null,
      feedback: null,
      attachments: ['timeline_requirements.pdf'],
      submissionType: 'online' as const
    }
  ];

  // Filter assignments
  const filteredAssignments = mockAssignments.filter(assignment => {
    if (selectedSubject !== 'all' && assignment.subjectId !== selectedSubject) {
      return false;
    }
    if (selectedStatus !== 'all' && assignment.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  // Calculate statistics
  const totalAssignments = mockAssignments.length;
  const pendingAssignments = mockAssignments.filter(a => a.status === 'pending').length;
  const submittedAssignments = mockAssignments.filter(a => a.status === 'submitted').length;
  const overdueAssignments = mockAssignments.filter(a => a.status === 'overdue').length;
  const completionRate = totalAssignments > 0 ? (submittedAssignments / totalAssignments * 100) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'graded': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'graded': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export List
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">Due soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{submittedAssignments}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
            <Progress value={completionRate} className="mt-2 h-2" />
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="graded">Graded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Assignments</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAssignments})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueAssignments})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-3">
                      {getStatusIcon(assignment.status)}
                      {assignment.title}
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{assignment.subject}</span>
                      <span>•</span>
                      <span className={getPriorityColor(assignment.priority)}>
                        {assignment.priority} priority
                      </span>
                      <span>•</span>
                      <span>{assignment.totalMarks} marks</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Due: {formatDate(assignment.dueDate)}</p>
                    <p className={`text-xs ${
                      getDaysUntilDue(assignment.dueDate) < 0 
                        ? 'text-red-600' 
                        : getDaysUntilDue(assignment.dueDate) <= 3 
                        ? 'text-yellow-600' 
                        : 'text-gray-500'
                    }`}>
                      {getDaysUntilDue(assignment.dueDate) < 0 
                        ? `${Math.abs(getDaysUntilDue(assignment.dueDate))} days overdue`
                        : getDaysUntilDue(assignment.dueDate) === 0
                        ? 'Due today'
                        : `${getDaysUntilDue(assignment.dueDate)} days left`
                      }
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {assignment.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Assigned: {formatDate(assignment.assignedDate)}
                    </span>
                    {assignment.submittedAt && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Submitted: {formatDate(assignment.submittedAt)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {assignment.status === 'pending' && (
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    )}
                    {assignment.status === 'submitted' && assignment.grade && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Grade: {assignment.grade}/{assignment.totalMarks}
                      </Button>
                    )}
                  </div>
                </div>

                {assignment.feedback && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                      Teacher Feedback
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {assignment.feedback}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredAssignments.filter(a => a.status === 'pending').map((assignment) => (
            <Card key={assignment.id} className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                      {assignment.title}
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      {assignment.subject} • Due: {formatDate(assignment.dueDate)}
                    </p>
                  </div>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Work on Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {filteredAssignments.filter(a => a.status === 'submitted').map((assignment) => (
            <Card key={assignment.id} className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      {assignment.title}
                    </h3>
                    <p className="text-green-700 dark:text-green-300 mt-1">
                      {assignment.subject} • Submitted: {assignment.submittedAt ? formatDate(assignment.submittedAt) : 'N/A'}
                    </p>
                  </div>
                  {assignment.grade && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Grade: {assignment.grade}/{assignment.totalMarks}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {filteredAssignments.filter(a => a.status === 'overdue').map((assignment) => (
            <Card key={assignment.id} className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      {assignment.title}
                    </h3>
                    <p className="text-red-700 dark:text-red-300 mt-1">
                      {assignment.subject} • {Math.abs(getDaysUntilDue(assignment.dueDate))} days overdue
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Late
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Overdue Warning */}
      {overdueAssignments > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Overdue Assignments
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">
                  You have {overdueAssignments} overdue assignment{overdueAssignments > 1 ? 's' : ''}. 
                  Please submit them as soon as possible to avoid academic penalties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
