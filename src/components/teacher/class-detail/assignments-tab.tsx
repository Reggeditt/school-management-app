'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Class, Student } from '@/lib/database-services';
import { FileText, Plus, Calendar, Users, CheckCircle, Clock, Eye } from 'lucide-react';

interface ClassAssignmentsTabProps {
  classItem: Class;
  students: Student[];
  teacherId: string;
}

export function ClassAssignmentsTab({ classItem, students, teacherId }: ClassAssignmentsTabProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock assignments data
  const assignments = [
    {
      id: '1',
      title: 'Math Quiz - Chapter 5',
      subject: 'Mathematics',
      type: 'quiz',
      dueDate: '2024-03-25',
      totalMarks: 50,
      status: 'active',
      submissions: 28,
      totalStudents: students.length,
      averageScore: 42,
      createdAt: '2024-03-20'
    },
    {
      id: '2',
      title: 'Science Lab Report',
      subject: 'Physics',
      type: 'report',
      dueDate: '2024-03-27',
      totalMarks: 100,
      status: 'active',
      submissions: 25,
      totalStudents: students.length,
      averageScore: 78,
      createdAt: '2024-03-18'
    },
    {
      id: '3',
      title: 'History Essay - World War II',
      subject: 'History',
      type: 'essay',
      dueDate: '2024-03-15',
      totalMarks: 75,
      status: 'completed',
      submissions: 30,
      totalStudents: students.length,
      averageScore: 65,
      createdAt: '2024-03-10'
    },
    {
      id: '4',
      title: 'English Literature Analysis',
      subject: 'English',
      type: 'analysis',
      dueDate: '2024-03-30',
      totalMarks: 80,
      status: 'draft',
      submissions: 0,
      totalStudents: students.length,
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

  const getGradePercentage = (score: number, total: number) => {
    return Math.round((score / total) * 100);
  };

  return (
    <div className="space-y-6">
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
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignments.filter(a => a.status === 'completed').length}</div>
            <p className="text-xs text-muted-foreground">
              Finished grading
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

      {/* Filters and Actions */}
      <div className="flex justify-between items-center">
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map(assignment => {
          const submissionRate = getSubmissionRate(assignment.submissions, assignment.totalStudents);
          const gradePercentage = assignment.totalMarks > 0 ? getGradePercentage(assignment.averageScore, assignment.totalMarks) : 0;
          
          return (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getTypeIcon(assignment.type)}</div>
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>
                        {assignment.subject} • {assignment.type} • {assignment.totalMarks} marks
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(assignment.status)}>
                    {assignment.status}
                  </Badge>
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

                {/* Grade Distribution (for completed assignments) */}
                {assignment.status === 'completed' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Class Average</span>
                      <span>{gradePercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          gradePercentage >= 80 ? 'bg-green-600' : 
                          gradePercentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${gradePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {assignment.status === 'active' && (
                    <Button size="sm" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Grade Submissions
                    </Button>
                  )}
                  {assignment.status === 'draft' && (
                    <Button size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Templates</CardTitle>
          <CardDescription>Quick-create assignments from common templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              📝 Quiz Template
            </Button>
            <Button variant="outline" className="justify-start">
              📄 Lab Report
            </Button>
            <Button variant="outline" className="justify-start">
              ✍️ Essay Assignment
            </Button>
            <Button variant="outline" className="justify-start">
              🔍 Research Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
