'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Skeleton } from '@/components/ui/skeleton';
import { TeacherService } from '@/lib/services/teacher-service';
import { Class } from '@/lib/database-services';
import { FileText, Plus, Calendar, Users, CheckCircle, Clock, Eye, Edit, Trash2 } from 'lucide-react';

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();
  const { state, loadClasses } = useStore();
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  
  const teacherService = TeacherService.getInstance();
  const teacherId = user?.uid || '';

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) return;
      
      try {
        setLoading(true);
        await loadClasses();
        const classes = await teacherService.getTeacherClasses(teacherId);
        setTeacherClasses(classes);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId, loadClasses, teacherService]);

  // Mock assignments data
  const assignments = [
    {
      id: '1',
      title: 'Math Quiz - Chapter 5',
      subject: 'Mathematics',
      class: 'Grade 10-A',
      classId: 'class1',
      type: 'quiz',
      dueDate: '2024-03-25',
      totalMarks: 50,
      status: 'active',
      submissions: 28,
      totalStudents: 30,
      averageScore: 42,
      createdAt: '2024-03-20'
    },
    {
      id: '2',
      title: 'Science Lab Report',
      subject: 'Physics',
      class: 'Grade 10-B',
      classId: 'class2',
      type: 'report',
      dueDate: '2024-03-27',
      totalMarks: 100,
      status: 'active',
      submissions: 25,
      totalStudents: 28,
      averageScore: 78,
      createdAt: '2024-03-18'
    },
    {
      id: '3',
      title: 'History Essay - World War II',
      subject: 'History',
      class: 'Grade 9-A',
      classId: 'class3',
      type: 'essay',
      dueDate: '2024-03-15',
      totalMarks: 75,
      status: 'completed',
      submissions: 30,
      totalStudents: 30,
      averageScore: 65,
      createdAt: '2024-03-10'
    },
    {
      id: '4',
      title: 'English Literature Analysis',
      subject: 'English',
      class: 'Grade 11-A',
      classId: 'class4',
      type: 'analysis',
      dueDate: '2024-03-30',
      totalMarks: 80,
      status: 'draft',
      submissions: 0,
      totalStudents: 25,
      averageScore: 0,
      createdAt: '2024-03-22'
    }
  ];

  const filteredAssignments = assignments.filter(assignment => {
    if (activeFilter === 'all') return true;
    return assignment.status === activeFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'draft': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '📝';
      case 'report': return '📄';
      case 'essay': return '✍️';
      case 'analysis': return '🔍';
      default: return '📋';
    }
  };

  const getSubmissionRate = (submissions: number, total: number) => {
    return Math.round((submissions / total) * 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            Create and manage assignments for your classes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.length}</div>
            <p className="text-xs text-muted-foreground">
              This semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              Currently open
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <CheckCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'active').reduce((acc, a) => acc + a.submissions, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Submissions to grade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Submission Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(assignments.reduce((acc, a) => acc + getSubmissionRate(a.submissions, a.totalStudents), 0) / assignments.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Student completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'active', 'completed', 'draft'].map(filter => (
          <Button
            key={filter}
            size="sm"
            variant={activeFilter === filter ? "default" : "outline"}
            onClick={() => setActiveFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map(assignment => {
            const submissionRate = getSubmissionRate(assignment.submissions, assignment.totalStudents);
            const isOverdue = new Date(assignment.dueDate) < new Date() && assignment.status === 'active';
            
            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{getTypeIcon(assignment.type)}</div>
                      <div>
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <CardDescription>
                          {assignment.class} • {assignment.subject} • {assignment.totalMarks} marks
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isOverdue && <Badge variant="destructive">Overdue</Badge>}
                      <Badge variant={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Assignment Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <div className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submissions:</span>
                      <div className="font-medium">{assignment.submissions}/{assignment.totalStudents}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Submission Rate:</span>
                      <div className="font-medium">{submissionRate}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Average Score:</span>
                      <div className="font-medium">
                        {assignment.averageScore > 0 ? `${assignment.averageScore}/${assignment.totalMarks}` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {assignment.status !== 'draft' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Submission Progress</span>
                        <span>{submissionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${submissionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {assignment.status === 'active' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Grade ({assignment.submissions})
                      </Button>
                    )}
                    {assignment.status === 'draft' && (
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Publish
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Assignments Found</h3>
              <p className="text-muted-foreground mb-4">
                {activeFilter === 'all' ? 'Create your first assignment to get started.' : `No ${activeFilter} assignments found.`}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
