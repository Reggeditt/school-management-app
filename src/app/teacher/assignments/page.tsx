'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useTeacherData } from "@/hooks/teacher";
import { AssignmentsList, Assignment } from "@/components/teacher/assignments-list";
import { AssignmentService } from "@/services/assignment.service";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  FileText,
  BookOpen,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { classes: teacherClasses, loading: dataLoading } = useTeacherData();
  
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [assignmentStats, setAssignmentStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    closed: 0,
    overdue: 0,
    pendingGrading: 0
  });

  // Get school ID and teacher ID
  const schoolId = user?.profile?.schoolId || 'default-school-id';
  const teacherId = user?.uid || '';

  useEffect(() => {
    if (teacherId && schoolId) {
      loadAssignments();
      loadAssignmentStats();
    }
  }, [teacherId, schoolId]);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const fetchedAssignments = await AssignmentService.getTeacherAssignments(teacherId, schoolId);
      setAssignments(fetchedAssignments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAssignmentStats = async () => {
    try {
      const stats = await AssignmentService.getAssignmentStats(teacherId, schoolId);
      setAssignmentStats(stats);
    } catch (error) {
      console.error('Error loading assignment stats:', error);
    }
  };

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesClass = filterClass === 'all' || assignment.classId === filterClass;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  // Handle assignment actions
  const handleEditAssignment = (assignment: Assignment) => {
    // In a real app, this would open an edit modal or navigate to edit page
    toast({
      title: "Edit Assignment",
      description: `Editing ${assignment.title}`,
    });
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await AssignmentService.deleteAssignment(assignmentId);
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });
      loadAssignmentStats(); // Refresh stats
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assignment",
        variant: "destructive",
      });
    }
  };

  const handleViewSubmissions = (assignmentId: string) => {
    // In a real app, this would navigate to submissions page
    toast({
      title: "View Submissions",
      description: `Viewing submissions for assignment ${assignmentId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600 mt-1">
            Create and manage assignments for your classes
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadAssignments}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignmentStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignmentStats.draft}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignmentStats.published}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignmentStats.closed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{assignmentStats.overdue}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignmentStats.pendingGrading}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assignments Overview</CardTitle>
              <CardDescription>
                {filteredAssignments.length} of {assignments.length} assignments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {teacherClasses.map(cls => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignments List */}
          <AssignmentsList
            assignments={filteredAssignments}
            loading={loading || dataLoading}
            onEdit={handleEditAssignment}
            onDelete={handleDeleteAssignment}
            onViewSubmissions={handleViewSubmissions}
            emptyMessage="No assignments found. Create your first assignment to get started."
          />
        </CardContent>
      </Card>
    </div>
  );
}
