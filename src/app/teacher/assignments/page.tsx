'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  class: string;
  dueDate: Date;
  assignedDate: Date;
  totalPoints: number;
  status: 'draft' | 'published' | 'overdue' | 'completed';
  submissionCount: number;
  totalStudents: number;
  type: 'homework' | 'project' | 'quiz' | 'exam';
}

export default function TeacherAssignments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Algebra Chapter 5 Homework',
          description: 'Complete exercises 1-20 from Chapter 5: Linear Equations',
          subject: 'Mathematics',
          class: 'Grade 9A',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          assignedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          totalPoints: 100,
          status: 'published',
          submissionCount: 18,
          totalStudents: 25,
          type: 'homework'
        },
        {
          id: '2',
          title: 'Science Fair Project',
          description: 'Design and conduct an experiment related to chemical reactions',
          subject: 'Chemistry',
          class: 'Grade 10B',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          totalPoints: 200,
          status: 'published',
          submissionCount: 12,
          totalStudents: 22,
          type: 'project'
        },
        {
          id: '3',
          title: 'Physics Quiz - Motion',
          description: 'Quiz covering velocity, acceleration, and displacement',
          subject: 'Physics',
          class: 'Grade 11A',
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          assignedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          totalPoints: 50,
          status: 'overdue',
          submissionCount: 19,
          totalStudents: 20,
          type: 'quiz'
        },
        {
          id: '4',
          title: 'Essay: Modern Literature',
          description: 'Write a 1000-word essay analyzing themes in contemporary literature',
          subject: 'English',
          class: 'Grade 12A',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          assignedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          totalPoints: 150,
          status: 'published',
          submissionCount: 8,
          totalStudents: 18,
          type: 'homework'
        }
      ];

      setAssignments(mockAssignments);
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

  const filteredAssignments = assignments.filter(assignment => 
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
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

  const handleCreateAssignment = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Assignment creation will be available soon",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Assignments</h1>
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
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            Manage and track assignments for your classes
          </p>
        </div>
        <Button onClick={handleCreateAssignment}>
          + Create Assignment
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAssignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {assignment.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(assignment.status)}>
                  {assignment.status}
                </Badge>
                <Badge variant="outline" className={getTypeColor(assignment.type)}>
                  {assignment.type}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>📚 {assignment.subject} - {assignment.class}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📅 Due: {formatDate(assignment.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥 {assignment.submissionCount}/{assignment.totalStudents} submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️ {assignment.totalPoints} points</span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(assignment.submissionCount / assignment.totalStudents) * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm 
                ? "Try adjusting your search terms."
                : "Get started by creating your first assignment."}
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateAssignment}>
                + Create Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
