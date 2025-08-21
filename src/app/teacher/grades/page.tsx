'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useTeacherData } from "@/hooks/teacher";
import { GradeTable, Assignment } from "@/components/teacher/grade-table";
import { GradeService, GradeStats, StudentGradeSummary } from "@/services/grade.service";
import Link from "next/link";
import {
  GraduationCap,
  Download,
  Upload,
  TrendingUp,
  BarChart3,
  Users,
  Award,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function TeacherGradesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { classes: teacherClasses, loading: dataLoading } = useTeacherData();
  
  const [loading, setLoading] = useState(true);
  const [studentGrades, setStudentGrades] = useState<StudentGradeSummary[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [gradeStats, setGradeStats] = useState<GradeStats | null>(null);
  const [updating, setUpdating] = useState(false);

  // Get school ID and teacher ID
  const schoolId = user?.profile?.schoolId || 'default-school-id';
  const teacherId = user?.uid || '';

  useEffect(() => {
    if (teacherId && schoolId) {
      loadGrades();
    }
  }, [teacherId, schoolId]);

  const loadGrades = async () => {
    try {
      setLoading(true);
      
      const [grades, stats] = await Promise.all([
        GradeService.getTeacherGrades(teacherId, schoolId),
        GradeService.getGradeStats(teacherId, schoolId)
      ]);
      
      setStudentGrades(grades);
      setGradeStats(stats);
      
      // Extract unique assignments from grades
      const assignmentMap = new Map<string, Assignment>();
      grades.forEach(student => {
        Object.entries(student.assignments).forEach(([assignmentId, assignment]) => {
          if (!assignmentMap.has(assignmentId)) {
            assignmentMap.set(assignmentId, {
              id: assignmentId,
              title: assignment.title,
              maxPoints: assignment.maxPoints,
              dueDate: '', // Would come from assignment data
              className: student.className,
              submissionCount: 0, // Would be calculated
              gradedCount: 0 // Would be calculated
            });
          }
        });
      });
      
      setAssignments(Array.from(assignmentMap.values()));
      
    } catch (error) {
      console.error('Error loading grades:', error);
      toast({
        title: "Error",
        description: "Failed to load grades. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGradeUpdate = async (studentId: string, assignmentId: string, grade: number | null) => {
    try {
      setUpdating(true);
      
      await GradeService.updateGrade(studentId, assignmentId, grade);
      
      // Update local state
      setStudentGrades(prev => prev.map(student => {
        if (student.studentId === studentId) {
          const updatedAssignments = { ...student.assignments };
          if (updatedAssignments[assignmentId]) {
            updatedAssignments[assignmentId] = {
              ...updatedAssignments[assignmentId],
              grade,
              gradedAt: new Date().toISOString()
            };
          }
          
          // Recalculate overall grade
          const gradedAssignments = Object.values(updatedAssignments).filter(a => (a as any).grade !== null);
          const totalPoints = gradedAssignments.reduce((sum, a) => sum + ((a as any).grade || 0), 0);
          const maxPoints = gradedAssignments.reduce((sum, a) => sum + (a as any).maxPoints, 0);
          const overallGrade = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
          
          return {
            ...student,
            assignments: updatedAssignments,
            overallGrade
          };
        }
        return student;
      }));
      
      toast({
        title: "Grade Updated",
        description: "Student grade has been successfully updated.",
      });
      
    } catch (error) {
      console.error('Error updating grade:', error);
      toast({
        title: "Error",
        description: "Failed to update grade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkExport = async () => {
    try {
      const csvContent = await GradeService.exportGrades(teacherId, schoolId);
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `grades_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Grades have been exported to CSV file.",
      });
      
    } catch (error) {
      console.error('Error exporting grades:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export grades. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Grade Book</h1>
          <p className="text-gray-600 mt-1">
            Manage student grades and track academic progress
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadGrades} disabled={updating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleBulkExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Grades
          </Button>
          <Button asChild>
            <Link href="/teacher/assignments">
              <Upload className="h-4 w-4 mr-2" />
              New Assignment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {gradeStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gradeStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all classes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Grades</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gradeStats.pendingGrades}</div>
              <p className="text-xs text-muted-foreground">
                Assignments to grade
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Average</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gradeStats.classAverage.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Overall performance
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">{gradeStats.topPerformer}</div>
              <p className="text-xs text-muted-foreground">
                Highest grade
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grade Table */}
      <GradeTable
        studentGrades={studentGrades}
        assignments={assignments}
        loading={loading}
        onGradeUpdate={handleGradeUpdate}
        onBulkExport={handleBulkExport}
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/assignments" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Create Assignment</h3>
                  <p className="text-sm text-gray-500">Add new assignment to grade</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/analytics" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Analytics</h3>
                  <p className="text-sm text-gray-500">Grade trends and insights</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/students" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Student Profiles</h3>
                  <p className="text-sm text-gray-500">View individual progress</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
