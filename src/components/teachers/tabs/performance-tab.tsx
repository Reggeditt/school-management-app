'use client';

import { Teacher } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStudentPerformance } from '../data/mock-data';
import { TrendingUp, TrendingDown, Minus, Trophy, Users, Target, BookOpen } from 'lucide-react';

interface PerformanceTabProps {
  teacher: Teacher;
}

export function PerformanceTab({ teacher }: PerformanceTabProps) {
  const performanceData = getStudentPerformance();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{performanceData.overallStats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-2xl font-bold">{performanceData.overallStats.averageClassPerformance}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">{performanceData.overallStats.overallPassRate}%</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Effectiveness</p>
                <p className="text-lg font-bold">{performanceData.overallStats.teachingEffectiveness}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Class Performance Breakdown</CardTitle>
          <CardDescription>Detailed performance metrics for each class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {performanceData.classPerformance.map((classData, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{classData.className}</h4>
                    <p className="text-sm text-muted-foreground">{classData.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(classData.trend)}
                    <span className={`text-sm font-medium ${getTrendColor(classData.trend)}`}>
                      {classData.trend}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Students</p>
                    <p className="font-medium">{classData.students}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Grade</p>
                    <p className="font-medium">{classData.averageGrade}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                    <p className="font-medium">{classData.passRate}%</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Class Performance</span>
                    <span>{classData.averageGrade}%</span>
                  </div>
                  <Progress value={classData.averageGrade} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">Top Performers</p>
                    <div className="space-y-1">
                      {classData.topPerformers.map((student, idx) => (
                        <Badge key={idx} variant="outline" className="mr-1 mb-1">
                          {student}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-600 mb-2">Needs Support</p>
                    <div className="space-y-1">
                      {classData.strugglingStudents.map((student, idx) => (
                        <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                          {student}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Excellent Results</p>
                  <p className="text-sm text-green-600">Grade 12A showing outstanding performance</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Target className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Growth Opportunity</p>
                  <p className="text-sm text-yellow-600">Grade 10B could benefit from additional support</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Trophy className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Above Average</p>
                  <p className="text-sm text-blue-600">Overall performance exceeds school average</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Teaching Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Student Engagement</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Knowledge Retention</span>
                  <span>89%</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Class Management</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Parent Satisfaction</span>
                  <span>88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
