'use client';

import { Student } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { getStudentAttendanceData, calculateStudentGrowthMetric, getStudentAcademicData } from '../data/student-mock-data';

interface AttendanceTabProps {
  student: Student;
  selectedAttendanceYear: string;
  onAttendanceYearChange: (year: string) => void;
}

export function AttendanceTab({ 
  student, 
  selectedAttendanceYear,
  onAttendanceYearChange
}: AttendanceTabProps) {
  const attendanceData = getStudentAttendanceData(selectedAttendanceYear);
  const academicData = getStudentAcademicData(selectedAttendanceYear, 'current');
  const growthMetrics = calculateStudentGrowthMetric(academicData);

  return (
    <div className="space-y-6">
      {/* Attendance Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Academic Year:</span>
            <Select value={selectedAttendanceYear} onValueChange={onAttendanceYearChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button variant="outline">
          {getNavigationIcon('download')}
          Export Attendance
        </Button>
      </div>

      {/* Attendance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('calendar-check')}
              Overall Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{attendanceData.averageAttendance}%</div>
            <Progress value={attendanceData.averageAttendance} className="w-full mb-2" />
            <div className="flex items-center justify-center gap-2">
              {growthMetrics.attendance.trend === 'improving' && (
                <div className="flex items-center gap-1 text-green-600">
                  {getNavigationIcon('arrow-up')}
                  <span className="text-sm">+{growthMetrics.attendance.growth.toFixed(1)}%</span>
                </div>
              )}
              {growthMetrics.attendance.trend === 'declining' && (
                <div className="flex items-center gap-1 text-red-600">
                  {getNavigationIcon('arrow-down')}
                  <span className="text-sm">{growthMetrics.attendance.growth.toFixed(1)}%</span>
                </div>
              )}
              {growthMetrics.attendance.trend === 'stable' && (
                <div className="flex items-center gap-1 text-gray-600">
                  {getNavigationIcon('arrow-right')}
                  <span className="text-sm">Stable</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('calendar')}
              Days Present
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{attendanceData.presentDays}</div>
            <p className="text-sm text-muted-foreground">out of {attendanceData.totalDays} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('calendar-x')}
              Days Absent
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{attendanceData.absentDays}</div>
            <p className="text-sm text-muted-foreground">total absences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('clock')}
              Late Arrivals
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{attendanceData.lateArrivals || 0}</div>
            <p className="text-sm text-muted-foreground">this year</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Attendance Breakdown */}
      {attendanceData.monthlyData && attendanceData.monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('bar-chart')}
              Monthly Attendance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.monthlyData.map((month: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="font-medium w-20">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Present: {month.present}</span>
                        <span>Total: {month.total}</span>
                      </div>
                      <Progress value={month.percentage} className="h-2 w-64" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{month.percentage.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">
                      {month.percentage >= 95 ? 'Excellent' : 
                       month.percentage >= 90 ? 'Good' : 
                       month.percentage >= 80 ? 'Fair' : 'Needs Improvement'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('trending-up')}
            Attendance Growth Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Attendance Performance Summary
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Student shows {attendanceData.yearlyTrend} attendance pattern</li>
              <li>• Current attendance rate is {attendanceData.averageAttendance}% (Target: 90%+)</li>
              <li>• {attendanceData.averageAttendance >= 95 ? 'Excellent attendance record' : 
                    attendanceData.averageAttendance >= 90 ? 'Good attendance, keep it up!' : 
                    'Attendance needs improvement - consider intervention'}</li>
              {attendanceData.lateArrivals > 0 && (
                <li>• Monitor punctuality - {attendanceData.lateArrivals} late arrivals this year</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
