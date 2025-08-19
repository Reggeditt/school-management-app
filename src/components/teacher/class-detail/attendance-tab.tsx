'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Class, Student } from '@/lib/database-services';
import { Calendar, Users, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface ClassAttendanceTabProps {
  classItem: Class;
  students: Student[];
  teacherId: string;
}

export function ClassAttendanceTab({ classItem, students, teacherId }: ClassAttendanceTabProps) {
  const [selectedWeek, setSelectedWeek] = useState('current');

  // Mock attendance data
  const attendanceData = [
    { date: '2024-03-18', present: 28, absent: 2, late: 0, percentage: 93.3 },
    { date: '2024-03-19', present: 29, absent: 1, late: 0, percentage: 96.7 },
    { date: '2024-03-20', present: 27, absent: 2, late: 1, percentage: 90.0 },
    { date: '2024-03-21', present: 30, absent: 0, late: 0, percentage: 100 },
    { date: '2024-03-22', present: 28, absent: 1, late: 1, percentage: 93.3 },
  ];

  const weeklyAverage = attendanceData.reduce((acc, day) => acc + day.percentage, 0) / attendanceData.length;

  // Mock student attendance records
  const studentAttendance = students.map(student => ({
    student,
    attendance: {
      present: Math.floor(Math.random() * 5) + 15, // 15-20 days
      absent: Math.floor(Math.random() * 3), // 0-3 days
      late: Math.floor(Math.random() * 2), // 0-2 days
      percentage: Math.floor(Math.random() * 15) + 85 // 85-100%
    }
  }));

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 95) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 85) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percentage >= 75) return { status: 'average', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyAverage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +2.3% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfect Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentAttendance.filter(s => s.attendance.percentage === 100).length}</div>
            <p className="text-xs text-muted-foreground">
              Students with 100%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentAttendance.filter(s => s.attendance.percentage < 85).length}</div>
            <p className="text-xs text-muted-foreground">
              Below 85% attendance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chronic Tardiness</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentAttendance.filter(s => s.attendance.late > 5).length}</div>
            <p className="text-xs text-muted-foreground">
              Frequently late
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Attendance Trend</CardTitle>
          <CardDescription>Daily attendance for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {attendanceData.map(day => (
              <div key={day.date} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Present: {day.present}, Absent: {day.absent}, Late: {day.late}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{day.percentage}%</div>
                  <Badge 
                    variant={day.percentage === 100 ? "default" : day.percentage > 90 ? "secondary" : "destructive"}
                  >
                    {day.percentage === 100 ? "Perfect" : day.percentage > 90 ? "Good" : "Low"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Attendance List */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Attendance</CardTitle>
          <CardDescription>Attendance record for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentAttendance
              .sort((a, b) => b.attendance.percentage - a.attendance.percentage)
              .map(({ student, attendance }) => {
                const status = getAttendanceStatus(attendance.percentage);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {student.firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-muted-foreground">
                          Present: {attendance.present}, Absent: {attendance.absent}, Late: {attendance.late}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${status.color}`}>
                        {attendance.percentage}%
                      </div>
                      <Badge 
                        variant={status.status === 'excellent' ? "default" : 
                                status.status === 'good' ? "secondary" : 
                                status.status === 'average' ? "outline" : "destructive"}
                      >
                        {status.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common attendance-related tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Mark Today's Attendance
            </Button>
            <Button variant="outline" className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2" />
              Generate Attendance Report
            </Button>
            <Button variant="outline" className="justify-start">
              <XCircle className="h-4 w-4 mr-2" />
              Contact Absent Students
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Late Students Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
