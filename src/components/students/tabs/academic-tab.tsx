'use client';

import { Student } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { getStudentAcademicData, calculateStudentGrowthMetric } from '../data/student-mock-data';
import { formatDate } from '../utils/student-utils';

interface AcademicTabProps {
  student: Student;
  selectedAcademicYear: string;
  selectedTerm: string;
  onAcademicYearChange: (year: string) => void;
  onTermChange: (term: string) => void;
}

export function AcademicTab({ 
  student, 
  selectedAcademicYear, 
  selectedTerm,
  onAcademicYearChange,
  onTermChange
}: AcademicTabProps) {
  const academicData = getStudentAcademicData(selectedAcademicYear, selectedTerm);
  const growthMetrics = calculateStudentGrowthMetric(academicData);

  return (
    <div className="space-y-6">
      {/* Academic Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Academic Year:</span>
            <Select value={selectedAcademicYear} onValueChange={onAcademicYearChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Term:</span>
            <Select value={selectedTerm} onValueChange={onTermChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="term-1">Term 1</SelectItem>
                <SelectItem value="term-2">Term 2</SelectItem>
                <SelectItem value="year-end">Year End</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button variant="outline">
          {getNavigationIcon('download')}
          Export Report
        </Button>
      </div>

      {/* Academic Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('trending-up')}
              Academic Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{academicData.gpa}</div>
              <p className="text-sm text-muted-foreground">Current GPA</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              {growthMetrics.gpa.trend === 'improving' && (
                <div className="flex items-center gap-1 text-green-600">
                  {getNavigationIcon('arrow-up')}
                  <span className="text-sm">+{growthMetrics.gpa.growth.toFixed(1)}%</span>
                </div>
              )}
              {growthMetrics.gpa.trend === 'declining' && (
                <div className="flex items-center gap-1 text-red-600">
                  {getNavigationIcon('arrow-down')}
                  <span className="text-sm">{growthMetrics.gpa.growth.toFixed(1)}%</span>
                </div>
              )}
              {growthMetrics.gpa.trend === 'stable' && (
                <div className="flex items-center gap-1 text-gray-600">
                  {getNavigationIcon('arrow-right')}
                  <span className="text-sm">Stable</span>
                </div>
              )}
            </div>
            {academicData.termGrowth && (
              <div className="text-center text-sm text-muted-foreground">
                {academicData.termGrowth}% improvement this term
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('award')}
              Cumulative Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {academicData.cumulativePerformance && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Overall GPA</span>
                  <span className="font-medium">{academicData.cumulativePerformance.overallGPA}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Credits Earned</span>
                  <span className="font-medium">
                    {academicData.cumulativePerformance.earnedCredits}/{academicData.cumulativePerformance.totalCredits}
                  </span>
                </div>
                <Progress 
                  value={(academicData.cumulativePerformance.earnedCredits / academicData.cumulativePerformance.totalCredits) * 100} 
                  className="h-2" 
                />
                <div className="text-xs text-muted-foreground text-center">
                  {Math.round((academicData.cumulativePerformance.earnedCredits / academicData.cumulativePerformance.totalCredits) * 100)}% Complete
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('calendar')}
              Current Term
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{selectedTerm.charAt(0).toUpperCase() + selectedTerm.slice(1)}</div>
              <p className="text-sm text-muted-foreground">{selectedAcademicYear}</p>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Attendance</span>
                <span className="font-medium">{academicData.attendance}%</span>
              </div>
              <Progress value={academicData.attendance} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance by Term */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('book')}
            Subject Performance - {selectedTerm}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {academicData.subjects?.map((subject: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{subject.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      Avg: {subject.average}%
                    </Badge>
                    {subject.trend === 'improving' && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {getNavigationIcon('trending-up')} Improving
                      </Badge>
                    )}
                    {subject.trend === 'declining' && (
                      <Badge variant="destructive">
                        {getNavigationIcon('trending-down')} Declining
                      </Badge>
                    )}
                    {subject.trend === 'stable' && (
                      <Badge variant="secondary">
                        {getNavigationIcon('minus')} Stable
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <span>Recent Grades:</span>
                      {subject.grades?.map((grade: number, gradeIndex: number) => (
                        <span key={gradeIndex} className="px-2 py-1 bg-white rounded text-xs font-medium">
                          {grade}%
                        </span>
                      ))}
                    </div>
                    <Progress value={subject.average} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Academic Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('activity')}
            Recent Academic Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {academicData.recentActivity?.map((activity: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="mt-1">
                  {activity.type === 'assignment' && getNavigationIcon('file')}
                  {activity.type === 'attendance' && getNavigationIcon('calendar')}
                  {activity.type === 'grade' && getNavigationIcon('star')}
                  {activity.type === 'activity' && getNavigationIcon('trophy')}
                  {activity.type === 'exam' && getNavigationIcon('clipboard')}
                  {activity.type === 'project' && getNavigationIcon('folder')}
                  {activity.type === 'achievement' && getNavigationIcon('award')}
                  {activity.type === 'ceremony' && getNavigationIcon('graduation-cap')}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.activity}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(activity.date)}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
