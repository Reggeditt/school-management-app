'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
}

interface AttendanceRecord {
  id: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused' | 'sick';
  subject?: string;
  period?: string;
  note?: string;
  markedBy: string;
  markedAt: Date;
}

interface AttendanceSummary {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  excusedDays: number;
  sickDays: number;
  attendanceRate: number;
  punctualityRate: number;
}

interface MonthlyAttendance {
  month: string;
  year: number;
  records: AttendanceRecord[];
  summary: AttendanceSummary;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [monthlyAttendance, setMonthlyAttendance] = useState<MonthlyAttendance[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("current");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAttendanceData();
  }, [selectedChild, selectedMonth]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockChildren: Child[] = [
        {
          id: '1',
          name: 'Emma Johnson',
          grade: 'Grade 9',
          class: 'Grade 9A',
          studentId: 'STU001'
        },
        {
          id: '2',
          name: 'Michael Johnson',
          grade: 'Grade 6',
          class: 'Grade 6B',
          studentId: 'STU002'
        }
      ];

      // Generate mock attendance records
      const generateAttendanceRecords = (month: number, year: number) => {
        const records: AttendanceRecord[] = [];
        const daysInMonth = new Date(year, month, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month - 1, day);
          const dayOfWeek = date.getDay();
          
          // Skip weekends
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;
          
          // Skip future dates
          if (date > new Date()) continue;
          
          // Generate random attendance status (mostly present)
          const random = Math.random();
          let status: AttendanceRecord['status'];
          if (random < 0.85) status = 'present';
          else if (random < 0.90) status = 'late';
          else if (random < 0.95) status = 'sick';
          else if (random < 0.98) status = 'excused';
          else status = 'absent';
          
          records.push({
            id: `${day}-${month}-${year}`,
            date,
            status,
            markedBy: 'System',
            markedAt: new Date(date.getTime() + 8 * 60 * 60 * 1000), // 8 AM
            note: status !== 'present' ? `${status} - auto generated` : undefined
          });
        }
        
        return records;
      };

      const calculateSummary = (records: AttendanceRecord[]): AttendanceSummary => {
        const totalDays = records.length;
        const presentDays = records.filter(r => r.status === 'present').length;
        const absentDays = records.filter(r => r.status === 'absent').length;
        const lateDays = records.filter(r => r.status === 'late').length;
        const excusedDays = records.filter(r => r.status === 'excused').length;
        const sickDays = records.filter(r => r.status === 'sick').length;
        
        return {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          excusedDays,
          sickDays,
          attendanceRate: totalDays > 0 ? Math.round(((presentDays + lateDays) / totalDays) * 100) : 0,
          punctualityRate: totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0
        };
      };

      const currentDate = new Date();
      const mockMonthlyAttendance: MonthlyAttendance[] = [
        {
          month: 'January',
          year: 2025,
          records: generateAttendanceRecords(1, 2025),
          summary: { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, excusedDays: 0, sickDays: 0, attendanceRate: 0, punctualityRate: 0 }
        },
        {
          month: 'December',
          year: 2024,
          records: generateAttendanceRecords(12, 2024),
          summary: { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, excusedDays: 0, sickDays: 0, attendanceRate: 0, punctualityRate: 0 }
        },
        {
          month: 'November',
          year: 2024,
          records: generateAttendanceRecords(11, 2024),
          summary: { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, excusedDays: 0, sickDays: 0, attendanceRate: 0, punctualityRate: 0 }
        }
      ];

      // Calculate summaries
      mockMonthlyAttendance.forEach(month => {
        month.summary = calculateSummary(month.records);
      });

      setChildren(mockChildren);
      setMonthlyAttendance(mockMonthlyAttendance);
    } catch (error) {
      console.error("Error loading attendance data:", error);
      toast({
        title: "Error",
        description: "Failed to load attendance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'excused': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'sick': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return '✅';
      case 'late': return '⏰';
      case 'absent': return '❌';
      case 'excused': return '📝';
      case 'sick': return '🤒';
      default: return '❓';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const currentMonth = monthlyAttendance.find(month => 
    month.month === new Date().toLocaleDateString('en-US', { month: 'long' }) &&
    month.year === new Date().getFullYear()
  );

  const overallSummary = monthlyAttendance.reduce((total, month) => ({
    totalDays: total.totalDays + month.summary.totalDays,
    presentDays: total.presentDays + month.summary.presentDays,
    absentDays: total.absentDays + month.summary.absentDays,
    lateDays: total.lateDays + month.summary.lateDays,
    excusedDays: total.excusedDays + month.summary.excusedDays,
    sickDays: total.sickDays + month.summary.sickDays,
    attendanceRate: 0,
    punctualityRate: 0
  }), { totalDays: 0, presentDays: 0, absentDays: 0, lateDays: 0, excusedDays: 0, sickDays: 0, attendanceRate: 0, punctualityRate: 0 });

  if (overallSummary.totalDays > 0) {
    overallSummary.attendanceRate = Math.round(((overallSummary.presentDays + overallSummary.lateDays) / overallSummary.totalDays) * 100);
    overallSummary.punctualityRate = Math.round((overallSummary.presentDays / overallSummary.totalDays) * 100);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Attendance</h1>
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
          <h1 className="text-3xl font-bold">Attendance Tracking</h1>
          <p className="text-muted-foreground">
            Monitor daily attendance and punctuality
          </p>
        </div>
        <Button>
          📊 Download Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {children.map(child => (
              <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Month</SelectItem>
            <SelectItem value="previous">Previous Month</SelectItem>
            <SelectItem value="all">All Months</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Input
            placeholder="Search by date or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Attendance Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <div className="text-2xl">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSummary.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {overallSummary.presentDays + overallSummary.lateDays} of {overallSummary.totalDays} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Punctuality Rate</CardTitle>
            <div className="text-2xl">⏰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSummary.punctualityRate}%</div>
            <p className="text-xs text-muted-foreground">
              {overallSummary.presentDays} on-time arrivals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <div className="text-2xl">❌</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSummary.absentDays}</div>
            <p className="text-xs text-muted-foreground">
              Unexcused absences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <div className="text-2xl">⏰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSummary.lateDays}</div>
            <p className="text-xs text-muted-foreground">
              Tardy arrivals
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="records">Detailed Records</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Monthly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance</CardTitle>
                <CardDescription>
                  Attendance breakdown by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyAttendance.map((month, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{month.month} {month.year}</h4>
                        <Badge className="bg-primary/10 text-primary">
                          {month.summary.attendanceRate}% Rate
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Present:</span>
                            <span className="font-medium text-green-600">
                              {month.summary.presentDays}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Late:</span>
                            <span className="font-medium text-yellow-600">
                              {month.summary.lateDays}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Absent:</span>
                            <span className="font-medium text-red-600">
                              {month.summary.absentDays}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Excused:</span>
                            <span className="font-medium text-blue-600">
                              {month.summary.excusedDays}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sick:</span>
                            <span className="font-medium text-purple-600">
                              {month.summary.sickDays}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-medium">
                              {month.summary.totalDays}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${month.summary.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Patterns */}
            <Card>
              <CardHeader>
                <CardTitle>Attendance Patterns</CardTitle>
                <CardDescription>
                  Insights and trends analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">📈</div>
                      <h4 className="font-medium">Overall Trend</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Attendance rate is {overallSummary.attendanceRate >= 95 ? 'excellent' : 
                      overallSummary.attendanceRate >= 90 ? 'good' : 
                      overallSummary.attendanceRate >= 85 ? 'satisfactory' : 'needs improvement'} 
                      at {overallSummary.attendanceRate}%.
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">⏰</div>
                      <h4 className="font-medium">Punctuality</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {overallSummary.lateDays === 0 ? 'Perfect punctuality record!' :
                      `${overallSummary.lateDays} late arrival${overallSummary.lateDays !== 1 ? 's' : ''} this term.`}
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">🎯</div>
                      <h4 className="font-medium">Attendance Goal</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {overallSummary.attendanceRate >= 95 ? 
                        'Meeting attendance goal of 95%+' :
                        `${95 - overallSummary.attendanceRate}% below target attendance rate`
                      }
                    </p>
                  </div>

                  {overallSummary.absentDays > 0 && (
                    <div className="p-4 border rounded-lg border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-2xl">⚠️</div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200">
                          Attendance Alert
                        </h4>
                      </div>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        {overallSummary.absentDays} unexcused absence{overallSummary.absentDays !== 1 ? 's' : ''} this term. 
                        Please contact the school if this continues.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>
                  Click on a date to view attendance details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legend & Details</CardTitle>
                <CardDescription>
                  Attendance status indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Status Legend</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { status: 'present', label: 'Present', icon: '✅' },
                        { status: 'late', label: 'Late Arrival', icon: '⏰' },
                        { status: 'absent', label: 'Absent', icon: '❌' },
                        { status: 'excused', label: 'Excused Absence', icon: '📝' },
                        { status: 'sick', label: 'Sick Leave', icon: '🤒' }
                      ].map(({ status, label, icon }) => (
                        <div key={status} className="flex items-center gap-2">
                          <Badge className={getStatusColor(status)}>
                            {icon} {label}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        Selected Date: {formatDate(selectedDate)}
                      </h4>
                      {currentMonth && currentMonth.records
                        .filter(record => 
                          record.date.toDateString() === selectedDate.toDateString()
                        )
                        .map(record => (
                          <div key={record.id} className="p-2 border rounded">
                            <div className="flex items-center justify-between">
                              <Badge className={getStatusColor(record.status)}>
                                {getStatusIcon(record.status)} {record.status}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {record.markedAt.toLocaleTimeString()}
                              </span>
                            </div>
                            {record.note && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {record.note}
                              </p>
                            )}
                          </div>
                        ))
                      }
                      {(!currentMonth || !currentMonth.records.some(record => 
                        record.date.toDateString() === selectedDate.toDateString()
                      )) && (
                        <p className="text-sm text-muted-foreground">
                          No attendance record for this date.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Detailed Records Tab */}
        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Complete attendance history with details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked By</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentMonth && currentMonth.records
                    .filter(record => 
                      !searchTerm || 
                      record.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      formatDate(record.date).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .sort((a, b) => b.date.getTime() - a.date.getTime())
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {record.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          {record.date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)} {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.markedBy}</TableCell>
                        <TableCell>
                          {record.markedAt.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell>
                          {record.note ? (
                            <span className="text-sm text-muted-foreground">
                              {record.note}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
