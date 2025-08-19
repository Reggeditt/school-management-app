'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Class, Student } from '@/lib/database-services';
import { Calendar, Users, FileText, Award, Clock, TrendingUp } from 'lucide-react';

interface ClassOverviewTabProps {
  classItem: Class;
  students: Student[];
  teacherId: string;
}

export function ClassOverviewTab({ classItem, students, teacherId }: ClassOverviewTabProps) {
  // Mock data for demonstration
  const recentAssignments = [
    { id: '1', title: 'Math Quiz Chapter 5', dueDate: '2024-03-25', submitted: 28, total: 30 },
    { id: '2', title: 'Science Lab Report', dueDate: '2024-03-27', submitted: 25, total: 30 },
    { id: '3', title: 'History Essay', dueDate: '2024-03-30', submitted: 30, total: 30 },
  ];

  const attendanceData = [
    { date: '2024-03-18', present: 28, absent: 2, percentage: 93.3 },
    { date: '2024-03-19', present: 29, absent: 1, percentage: 96.7 },
    { date: '2024-03-20', present: 27, absent: 3, percentage: 90.0 },
    { date: '2024-03-21', present: 30, absent: 0, percentage: 100 },
    { date: '2024-03-22', present: 28, absent: 2, percentage: 93.3 },
  ];

  const averageAttendance = attendanceData.reduce((acc, day) => acc + day.percentage, 0) / attendanceData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled in class
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageAttendance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              This week average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentAssignments.length}</div>
            <p className="text-xs text-muted-foreground">
              Active assignments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Overall grade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>Latest assignments and submission status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAssignments.map(assignment => {
                const submissionRate = Math.round((assignment.submitted / assignment.total) * 100);
                return (
                  <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{assignment.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Due: {assignment.dueDate}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {assignment.submitted}/{assignment.total}
                      </div>
                      <Badge 
                        variant={submissionRate === 100 ? "default" : submissionRate > 80 ? "secondary" : "destructive"}
                      >
                        {submissionRate}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
            <CardDescription>Daily attendance for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.map(day => (
                <div key={day.date} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {day.present} present, {day.absent} absent
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{day.percentage}%</div>
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

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Subject-wise performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Mathematics</div>
                  <div className="text-sm text-muted-foreground">Last assessment</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">87%</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Science</div>
                  <div className="text-sm text-muted-foreground">Last assessment</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">82%</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2%
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">English</div>
                  <div className="text-sm text-muted-foreground">Last assessment</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">89%</div>
                  <div className="flex items-center text-xs text-red-600">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    -1%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Class schedule and important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">Parent-Teacher Meeting</div>
                  <div className="text-sm text-muted-foreground">March 28, 2024 - 3:00 PM</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">Mid-term Exams</div>
                  <div className="text-sm text-muted-foreground">April 1-5, 2024</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="font-medium">Science Fair Project Due</div>
                  <div className="text-sm text-muted-foreground">April 10, 2024</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
