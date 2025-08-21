'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClassAnalytics, StudentAnalytics, AnalyticsOverview } from "@/services/analytics.service";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Award,
  Target
} from "lucide-react";

interface OverviewStatsProps {
  overview: AnalyticsOverview;
  loading?: boolean;
}

interface ClassAnalyticsCardProps {
  classData: ClassAnalytics[];
  loading?: boolean;
}

interface StudentRiskTableProps {
  students: StudentAnalytics[];
  loading?: boolean;
}

interface PerformanceChartsProps {
  data: Array<{
    period: string;
    averageGrade: number;
    attendanceRate: number;
    assignmentCompletion: number;
  }>;
  loading?: boolean;
}

export function OverviewStats({ overview, loading = false }: OverviewStatsProps) {
  if (loading) {
    return (
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
    );
  }

  const completionRate = (overview.completedAssignments / overview.totalAssignments) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.totalStudents}</div>
          <p className="text-xs text-muted-foreground">
            Across {overview.totalClasses} classes
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.overallAverageGrade}/10</div>
          <p className="text-xs text-muted-foreground">
            Overall performance
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.overallAttendanceRate}%</div>
          <Progress value={overview.overallAttendanceRate} className="mt-2" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assignment Completion</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
          <p className="text-xs text-muted-foreground">
            {overview.completedAssignments}/{overview.totalAssignments} completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function ClassAnalyticsCards({ classData, loading = false }: ClassAnalyticsCardProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50';
      case 'down': return 'text-red-600 bg-red-50';
      case 'stable': return 'text-gray-600 bg-gray-50';
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 8.5) return 'text-green-600';
    if (grade >= 7.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {classData.map((classItem) => (
        <Card key={classItem.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{classItem.className}</CardTitle>
                <p className="text-sm text-gray-600">{classItem.subject}</p>
              </div>
              <Badge className={getTrendColor(classItem.trend)}>
                <span className="flex items-center space-x-1">
                  {getTrendIcon(classItem.trend)}
                  <span className="capitalize">{classItem.trend}</span>
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Students</p>
                  <p className="font-medium">{classItem.totalStudents}</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Grade</p>
                  <p className={`font-medium ${getGradeColor(classItem.averageGrade)}`}>
                    {classItem.averageGrade}/10
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Attendance</span>
                  <span className="font-medium">{classItem.attendanceRate}%</span>
                </div>
                <Progress value={classItem.attendanceRate} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Assignments</span>
                  <span className="font-medium">
                    {classItem.assignmentsCompleted}/{classItem.totalAssignments}
                  </span>
                </div>
                <Progress 
                  value={(classItem.assignmentsCompleted / classItem.totalAssignments) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StudentRiskTable({ students, loading = false }: StudentRiskTableProps) {
  const getRiskColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getGradeChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGradeChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return <BarChart3 className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show high and medium risk students first
  const sortedStudents = [...students].sort((a, b) => {
    const riskOrder = { high: 3, medium: 2, low: 1 };
    return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span>Student Performance Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedStudents.map((student) => (
            <div 
              key={student.studentId} 
              className="p-4 rounded-lg border hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div>
                    <h4 className="font-medium">{student.studentName}</h4>
                    <p className="text-sm text-gray-600">{student.className}</p>
                  </div>
                </div>
                <Badge className={getRiskColor(student.riskLevel)}>
                  {student.riskLevel} risk
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Current Grade</p>
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{student.currentGrade}/10</span>
                    <span className={`flex items-center ${getGradeChangeColor(student.gradeChange)}`}>
                      {getGradeChangeIcon(student.gradeChange)}
                      <span className="ml-1">
                        {student.gradeChange > 0 ? '+' : ''}{student.gradeChange}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-gray-600">Attendance</p>
                  <p className="font-medium">{student.attendanceRate}%</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Completion Rate</p>
                  <p className="font-medium">{student.completionRate}%</p>
                </div>
                
                <div>
                  <p className="text-gray-600">On-time Assignments</p>
                  <p className="font-medium">{student.assignmentsOnTime}/{student.totalAssignments}</p>
                </div>
              </div>
              
              {student.concerns.length > 0 && (
                <div className="mt-3 p-2 bg-red-50 rounded text-sm">
                  <p className="text-red-700 font-medium">Concerns:</p>
                  <p className="text-red-600">{student.concerns.join(', ')}</p>
                </div>
              )}
              
              {student.strengths.length > 0 && (
                <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                  <p className="text-green-700 font-medium">Strengths:</p>
                  <p className="text-green-600">{student.strengths.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceCharts({ data, loading = false }: PerformanceChartsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  // Simple bar chart representation using CSS
  const maxGrade = Math.max(...data.map(d => d.averageGrade));
  const maxAttendance = Math.max(...data.map(d => d.attendanceRate));
  const maxCompletion = Math.max(...data.map(d => d.assignmentCompletion));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Grade Trend */}
          <div>
            <h4 className="font-medium mb-3 text-blue-600">Average Grade Trend</h4>
            <div className="flex items-end space-x-2 h-24">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t"
                    style={{ 
                      height: `${(item.averageGrade / maxGrade) * 100}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1 text-center">
                    {item.period}
                  </span>
                  <span className="text-xs font-medium text-blue-600">
                    {item.averageGrade}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Attendance Trend */}
          <div>
            <h4 className="font-medium mb-3 text-green-600">Attendance Rate Trend</h4>
            <div className="flex items-end space-x-2 h-24">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-green-500 rounded-t"
                    style={{ 
                      height: `${(item.attendanceRate / maxAttendance) * 100}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1 text-center">
                    {item.period}
                  </span>
                  <span className="text-xs font-medium text-green-600">
                    {item.attendanceRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Assignment Completion Trend */}
          <div>
            <h4 className="font-medium mb-3 text-purple-600">Assignment Completion Trend</h4>
            <div className="flex items-end space-x-2 h-24">
              {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500 rounded-t"
                    style={{ 
                      height: `${(item.assignmentCompletion / maxCompletion) * 100}%`,
                      minHeight: '4px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-1 text-center">
                    {item.period}
                  </span>
                  <span className="text-xs font-medium text-purple-600">
                    {item.assignmentCompletion}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function InsightsCard({ insights, loading = false }: { insights: string[]; loading?: boolean }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-blue-500" />
          <span>Insights & Recommendations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"
            >
              {insight}
            </div>
          ))}
          
          {insights.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No specific insights available at this time.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
