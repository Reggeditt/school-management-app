'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { 
  OverviewStats, 
  ClassAnalyticsCards, 
  StudentRiskTable, 
  PerformanceCharts,
  InsightsCard 
} from "@/components/teacher/analytics-components";
import { 
  AnalyticsService, 
  AnalyticsOverview, 
  ClassAnalytics, 
  StudentAnalytics, 
  PerformanceData 
} from "@/services/analytics.service";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Users,
  Download,
  RefreshCw,
  Target,
  BookOpen,
  Calendar,
  Award
} from "lucide-react";

export default function TeacherAnalyticsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [classAnalytics, setClassAnalytics] = useState<ClassAnalytics[]>([]);
  const [studentAnalytics, setStudentAnalytics] = useState<StudentAnalytics[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  // Get teacher ID
  const teacherId = user?.uid || '';

  useEffect(() => {
    if (teacherId) {
      loadAnalytics();
    }
  }, [teacherId, selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      const [
        overviewData,
        classData,
        studentData,
        performanceDataResult,
        insightsData
      ] = await Promise.all([
        AnalyticsService.getAnalyticsOverview(teacherId),
        AnalyticsService.getClassAnalytics(teacherId),
        AnalyticsService.getStudentAnalytics(teacherId),
        AnalyticsService.getPerformanceData(teacherId, selectedPeriod),
        AnalyticsService.getInsights(teacherId)
      ]);
      
      setOverview(overviewData);
      setClassAnalytics(classData);
      setStudentAnalytics(studentData);
      setPerformanceData(performanceDataResult);
      setInsights(insightsData);
      
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
    toast({
      title: "Analytics Refreshed",
      description: "All analytics data has been updated.",
    });
  };

  const handleExport = async (type: 'overview' | 'students' | 'classes') => {
    try {
      const csvContent = await AnalyticsService.exportAnalytics(teacherId, type);
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_${type}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: `${type} analytics have been exported to CSV file.`,
      });
      
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export analytics. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Insights into student performance and class engagement
          </p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedPeriod} onValueChange={(value: 'week' | 'month' | 'semester') => setSelectedPeriod(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="semester">Semester</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleExport('overview')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      {overview && (
        <OverviewStats overview={overview} loading={loading} />
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Class Performance</CardTitle>
                <CardDescription>
                  Performance summary across all your classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClassAnalyticsCards classData={classAnalytics} loading={loading} />
              </CardContent>
            </Card>

            {/* Insights */}
            <InsightsCard insights={insights} loading={loading} />
          </div>

          {/* Performance Charts */}
          <PerformanceCharts data={performanceData} loading={loading} />
        </TabsContent>
        
        <TabsContent value="classes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Class Analytics</h2>
            <Button variant="outline" onClick={() => handleExport('classes')}>
              <Download className="h-4 w-4 mr-2" />
              Export Classes
            </Button>
          </div>
          
          <ClassAnalyticsCards classData={classAnalytics} loading={loading} />
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Student Performance Analysis</h2>
            <Button variant="outline" onClick={() => handleExport('students')}>
              <Download className="h-4 w-4 mr-2" />
              Export Students
            </Button>
          </div>
          
          <StudentRiskTable students={studentAnalytics} loading={loading} />
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Performance Trends</h2>
            <div className="text-sm text-gray-600">
              Showing {selectedPeriod} view
            </div>
          </div>
          
          <PerformanceCharts data={performanceData} loading={loading} />
          
          {/* Additional trend insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grade Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Highest Average</span>
                    <span className="font-medium">
                      {Math.max(...performanceData.map(d => d.averageGrade)).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest Average</span>
                    <span className="font-medium">
                      {Math.min(...performanceData.map(d => d.averageGrade)).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Improvement</span>
                    <span className="font-medium text-green-600">
                      +{(
                        performanceData[performanceData.length - 1]?.averageGrade - 
                        performanceData[0]?.averageGrade
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Best Day</span>
                    <span className="font-medium">
                      {Math.max(...performanceData.map(d => d.attendanceRate))}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest Day</span>
                    <span className="font-medium">
                      {Math.min(...performanceData.map(d => d.attendanceRate))}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average</span>
                    <span className="font-medium">
                      {(performanceData.reduce((sum, d) => sum + d.attendanceRate, 0) / performanceData.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Best Completion</span>
                    <span className="font-medium">
                      {Math.max(...performanceData.map(d => d.assignmentCompletion))}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Lowest Completion</span>
                    <span className="font-medium">
                      {Math.min(...performanceData.map(d => d.assignmentCompletion))}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average</span>
                    <span className="font-medium">
                      {(performanceData.reduce((sum, d) => sum + d.assignmentCompletion, 0) / performanceData.length).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/grades" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Grade Book</h3>
                  <p className="text-sm text-gray-500">Manage student grades</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/attendance" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Attendance</h3>
                  <p className="text-sm text-gray-500">Track student attendance</p>
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
                  <p className="text-sm text-gray-500">View detailed profiles</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
