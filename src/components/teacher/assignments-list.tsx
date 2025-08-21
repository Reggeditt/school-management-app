'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Download,
  BookOpen,
  MoreVertical
} from "lucide-react";

export interface Assignment {
  id: string;
  title: string;
  description: string;
  className: string;
  classId: string;
  subject: string;
  dueDate: Date;
  maxPoints: number;
  status: 'draft' | 'published' | 'closed';
  submissionsCount: number;
  totalStudents: number;
  createdDate: Date;
  attachments?: string[];
}

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignmentId: string) => void;
  onViewSubmissions?: (assignmentId: string) => void;
}

export function AssignmentCard({ assignment, onEdit, onDelete, onViewSubmissions }: AssignmentCardProps) {
  const submissionProgress = (assignment.submissionsCount / assignment.totalStudents) * 100;
  
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'published': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = assignment.status === 'published' && new Date() > assignment.dueDate;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getStatusColor(assignment.status)}>
                {getStatusIcon(assignment.status)}
                <span className="ml-1 capitalize">{assignment.status}</span>
              </Badge>
              {isOverdue && (
                <Badge variant="destructive">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Overdue
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg text-gray-900">{assignment.title}</CardTitle>
            <CardDescription className="text-sm">
              {assignment.className} • {assignment.subject}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {assignment.description}
        </p>

        {/* Assignment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Due: {formatDate(assignment.dueDate)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{assignment.maxPoints} points</span>
          </div>
        </div>

        {/* Submission Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Submissions</span>
            <span className="font-medium">
              {assignment.submissionsCount}/{assignment.totalStudents}
            </span>
          </div>
          <Progress value={submissionProgress} className="h-2" />
        </div>

        {/* Attachments */}
        {assignment.attachments && assignment.attachments.length > 0 && (
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {assignment.attachments.length} attachment{assignment.attachments.length > 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewSubmissions?.(assignment.id)}>
            <Eye className="h-4 w-4 mr-1" />
            View ({assignment.submissionsCount})
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit?.(assignment)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete?.(assignment.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface AssignmentsListProps {
  assignments: Assignment[];
  loading?: boolean;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignmentId: string) => void;
  onViewSubmissions?: (assignmentId: string) => void;
  emptyMessage?: string;
}

export function AssignmentsList({ 
  assignments, 
  loading = false, 
  onEdit, 
  onDelete, 
  onViewSubmissions,
  emptyMessage = "No assignments found."
}: AssignmentsListProps) {
  if (loading) {
    return (
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
    );
  }

  if (assignments.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Assignments Found</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {assignments.map((assignment) => (
        <AssignmentCard 
          key={assignment.id} 
          assignment={assignment}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewSubmissions={onViewSubmissions}
        />
      ))}
    </div>
  );
}
