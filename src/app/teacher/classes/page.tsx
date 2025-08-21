"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { useTeacherData } from "@/hooks/teacher";
import { ClassesList } from "@/components/teacher/classes-list";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Grid3X3,
  List,
  Filter,
  BookOpen,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function TeacherClassesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { loading, error, classes, refreshClasses, dashboardStats } =
    useTeacherData();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  // Filter classes based on search and grade
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.section.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade === "all" || cls.grade === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  // Get unique grades for filter
  const availableGrades = [
    "all",
    ...Array.from(new Set(classes.map((cls) => cls.grade))),
  ];

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600 mt-1">
            Manage your classes and track student progress
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => refreshClasses()}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link href="/teacher/assignments">
              <Plus className="h-4 w-4 mr-2" />
              New Assignment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {dashboardStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Classes
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalClasses}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.totalStudents}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Attendance
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.attendanceRate}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats.averageGrade}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Classes Overview</CardTitle>
              <CardDescription>
                {filteredClasses.length} of {classes.length} classes
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                {availableGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade === "all" ? "All Grades" : `Grade ${grade}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Classes List */}
          <ClassesList
            classes={filteredClasses}
            loading={loading}
            viewMode={viewMode}
            emptyMessage="No classes found. Contact admin to assign classes."
          />
        </CardContent>
      </Card>
    </div>
  );
}
