'use client';

import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import {
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  TrendingUp
} from 'lucide-react';

export default function StudentAttendance() {
  const { user } = useAuth();
  const { state } = useStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  // Find current student data
  const currentStudent = state.students.find(s => s.email === user?.email);
  
  // Get student's attendance records
  const studentAttendance = state.attendance.filter(a => 
    currentStudent && a.studentId === currentStudent.id
  );

  // Get student's subjects for filtering
  const studentClasses = state.classes.filter(c => 
    currentStudent && c.students.includes(currentStudent.id)
  );
  const studentSubjects = state.subjects.filter(s => 
    studentClasses.some(c => s.classIds.includes(c.id))
  );

  // Filter attendance by month and subject
  const filteredAttendance = studentAttendance.filter(record => {
    const recordMonth = new Date(record.date).getMonth();
    if (selectedMonth !== 'all' && recordMonth.toString() !== selectedMonth) {
      return false;
    }
    
    if (selectedSubject !== 'all' && record.subject !== selectedSubject) {
      return false;
    }
    
    return true;
  });

  // Calculate statistics
  const totalDays = filteredAttendance.length;
  const presentDays = filteredAttendance.filter(a => a.status === 'present').length;
  const absentDays = filteredAttendance.filter(a => a.status === 'absent').length;
  const lateDays = filteredAttendance.filter(a => a.status === 'late').length;
  const excusedDays = filteredAttendance.filter(a => a.status === 'excused').length;

  const attendanceRate = totalDays > 0 ? (presentDays / totalDays * 100) : 0;

  // Get attendance for selected date
  const selectedDateAttendance = selectedDate 
    ? studentAttendance.filter(a => {
        const attendanceDate = new Date(a.date);
        return attendanceDate.toDateString() === selectedDate.toDateString();
      })
    : [];

  // Monthly attendance summary
  const monthlyStats = Array.from({ length: 12 }, (_, index) => {
    const monthAttendance = studentAttendance.filter(a => {
      return new Date(a.date).getMonth() === index;
    });
    
    const monthTotal = monthAttendance.length;
    const monthPresent = monthAttendance.filter(a => a.status === 'present').length;
    const monthRate = monthTotal > 0 ? (monthPresent / monthTotal * 100) : 0;
    
    return {
      month: index,
      total: monthTotal,
      present: monthPresent,
      rate: monthRate,
      name: new Date(2024, index).toLocaleString('default', { month: 'short' })
    };
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'excused': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{attendanceRate.toFixed(1)}%</div>
            <Progress value={attendanceRate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{presentDays}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalDays} total days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentDays}</div>
            <p className="text-xs text-muted-foreground">
              {totalDays > 0 ? ((absentDays / totalDays) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lateDays}</div>
            <p className="text-xs text-muted-foreground">
              This academic year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {monthlyStats.map((month) => (
                    <SelectItem key={month.month} value={month.month.toString()}>
                      {month.name} ({month.rate.toFixed(0)}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {studentSubjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                present: studentAttendance
                  .filter(a => a.status === 'present')
                  .map(a => new Date(a.date)),
                absent: studentAttendance
                  .filter(a => a.status === 'absent')
                  .map(a => new Date(a.date)),
                late: studentAttendance
                  .filter(a => a.status === 'late')
                  .map(a => new Date(a.date))
              }}
              modifiersStyles={{
                present: { backgroundColor: '#dcfce7', color: '#166534' },
                absent: { backgroundColor: '#fee2e2', color: '#dc2626' },
                late: { backgroundColor: '#fef3c7', color: '#d97706' }
              }}
            />
            
            {selectedDate && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                {selectedDateAttendance.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateAttendance.map((record) => (
                      <div key={record.id} className="flex items-center gap-2">
                        {getStatusIcon(record.status)}
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        <span className="text-sm">{record.subject || 'General'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No attendance record for this date</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length > 0 ? (
                  filteredAttendance
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 20)
                    .map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {formatDate(record.date)}
                        </TableCell>
                        <TableCell>
                          {record.subject || 'General'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(record.status)}
                            <Badge className={getStatusColor(record.status)}>
                              {record.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatTime(record.checkInTime)}
                        </TableCell>
                        <TableCell>
                          {formatTime(record.checkOutTime)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {record.remarks || '-'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No attendance records found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Attendance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {monthlyStats.map((month) => (
              <div key={month.month} className="text-center p-4 border rounded-lg">
                <h4 className="font-medium">{month.name}</h4>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {month.rate.toFixed(0)}%
                  </div>
                  <p className="text-sm text-gray-500">
                    {month.present}/{month.total}
                  </p>
                </div>
                <Progress value={month.rate} className="mt-2 h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Warning */}
      {attendanceRate < 75 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                  Attendance Warning
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Your attendance rate is {attendanceRate.toFixed(1)}%, which is below the required minimum of 75%. 
                  Please ensure regular attendance to avoid academic penalties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
