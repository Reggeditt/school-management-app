'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  type AttendanceRecord, 
  type ClassSession, 
  type AttendanceStats,
  type AttendanceReport,
  AttendanceService 
} from '@/lib/services/attendance.service';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  Download,
  Filter,
  Search,
  Play,
  Square,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  FileText
} from "lucide-react";

interface AttendanceStatsCardsProps {
  stats: AttendanceStats;
  loading?: boolean;
}

export function AttendanceStatsCards({ stats, loading }: AttendanceStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="ml-4 space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              <p className="text-xs text-muted-foreground">{stats.attendanceRate}% rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Absent</p>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              {stats.excused > 0 && (
                <p className="text-xs text-muted-foreground">{stats.excused} excused</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ClassSessionsOverviewProps {
  sessions: ClassSession[];
  selectedClass: string;
  onClassSelect: (classId: string) => void;
  onStartSession?: (classId: string) => void;
  onEndSession?: (sessionId: string) => void;
  loading?: boolean;
}

export function ClassSessionsOverview({ 
  sessions, 
  selectedClass, 
  onClassSelect, 
  onStartSession,
  onEndSession,
  loading 
}: ClassSessionsOverviewProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: ClassSession['status']) => {
    switch (status) {
      case 'ongoing': return 'destructive';
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Sessions
        </CardTitle>
        <CardDescription>Overview of all your classes for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedClass === session.classId ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
              }`}
              onClick={() => onClassSelect(session.classId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h4 className="font-medium">{session.className}</h4>
                    <p className="text-sm text-muted-foreground">
                      {session.startTime} - {session.endTime} • {session.subject}
                      {session.location && ` • ${session.location}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {session.presentCount}/{session.totalStudents}
                  </div>
                  {session.status === 'scheduled' && onStartSession && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartSession(session.classId);
                      }}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  )}
                  {session.status === 'ongoing' && onEndSession && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEndSession(session.id);
                      }}
                    >
                      <Square className="h-3 w-3 mr-1" />
                      End
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {sessions.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Sessions Today</h3>
            <p className="text-muted-foreground">
              No classes are scheduled for today
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AttendanceControlsProps {
  selectedClass: string;
  selectedDate: string;
  classes: Array<{ id: string; name: string }>;
  onClassChange: (classId: string) => void;
  onDateChange: (date: string) => void;
  onExport?: () => void;
  onSendNotifications?: () => void;
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  saving?: boolean;
}

export function AttendanceControls({
  selectedClass,
  selectedDate,
  classes,
  onClassChange,
  onDateChange,
  onExport,
  onSendNotifications,
  hasUnsavedChanges,
  onSave,
  saving
}: AttendanceControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Class:</label>
          <Select value={selectedClass} onValueChange={onClassChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        )}
        
        {onSendNotifications && (
          <Button variant="outline" onClick={onSendNotifications}>
            <Bell className="h-4 w-4 mr-2" />
            Notify Parents
          </Button>
        )}
        
        {hasUnsavedChanges && onSave && (
          <Button onClick={onSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onStatusChange: (studentId: string, status: AttendanceRecord['status']) => void;
  className?: string;
  loading?: boolean;
}

export function AttendanceTable({ 
  records, 
  onStatusChange, 
  className, 
  loading 
}: AttendanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    const display = AttendanceService.getStatusDisplay(status);
    switch (display.icon) {
      case 'CheckCircle': return <CheckCircle className={`h-4 w-4 ${display.color}`} />;
      case 'XCircle': return <XCircle className={`h-4 w-4 ${display.color}`} />;
      case 'Clock': return <Clock className={`h-4 w-4 ${display.color}`} />;
      case 'AlertCircle': return <AlertCircle className={`h-4 w-4 ${display.color}`} />;
      default: return <AlertCircle className={`h-4 w-4 ${display.color}`} />;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.rollNumber.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Student Attendance - {className}
        </CardTitle>
        <CardDescription>
          Mark attendance for selected date
        </CardDescription>
        
        {/* Search and Filter */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="excused">Excused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll No.</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.rollNumber}</TableCell>
                <TableCell>{record.studentName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <Badge className={AttendanceService.getStatusDisplay(record.status).bgColor}>
                      {record.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={record.status === 'present' ? 'default' : 'outline'}
                      onClick={() => onStatusChange(record.studentId, 'present')}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === 'absent' ? 'destructive' : 'outline'}
                      onClick={() => onStatusChange(record.studentId, 'absent')}
                    >
                      Absent
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === 'late' ? 'secondary' : 'outline'}
                      onClick={() => onStatusChange(record.studentId, 'late')}
                    >
                      Late
                    </Button>
                    <Button
                      size="sm"
                      variant={record.status === 'excused' ? 'secondary' : 'outline'}
                      onClick={() => onStatusChange(record.studentId, 'excused')}
                    >
                      Excused
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(record.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Add notes..."
                    value={record.notes || ''}
                    onChange={(e) => {
                      // Handle notes change
                      console.log('Notes changed for', record.studentId, e.target.value);
                    }}
                    className="w-32 text-xs"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Students Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No students available for this class'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AttendanceReportTableProps {
  report: AttendanceReport[];
  loading?: boolean;
}

export function AttendanceReportTable({ report, loading }: AttendanceReportTableProps) {
  const [sortField, setSortField] = useState<keyof AttendanceReport>('rollNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof AttendanceReport) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedReport = [...report].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getTrendIcon = (trend: AttendanceReport['trend']) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Attendance Report
        </CardTitle>
        <CardDescription>
          Comprehensive attendance summary for the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('rollNumber')}
              >
                Roll No.
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('studentName')}
              >
                Student Name
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('attendanceRate')}
              >
                Attendance Rate
              </TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead>Late</TableHead>
              <TableHead>Excused</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReport.map((student) => (
              <TableRow key={student.studentId}>
                <TableCell className="font-medium">{student.rollNumber}</TableCell>
                <TableCell>{student.studentName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            student.attendanceRate >= 90 ? 'bg-green-500' :
                            student.attendanceRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium">
                      {student.attendanceRate}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-green-600">{student.presentSessions}</TableCell>
                <TableCell className="text-red-600">{student.absentSessions}</TableCell>
                <TableCell className="text-yellow-600">{student.lateSessions}</TableCell>
                <TableCell className="text-blue-600">{student.excusedSessions}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(student.trend)}
                    <span className="text-sm capitalize">{student.trend}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface AttendanceHeaderProps {
  onExport?: () => void;
  onViewReport?: () => void;
}

export function AttendanceHeader({ onExport, onViewReport }: AttendanceHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground">
          Track and manage student attendance for your classes
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onViewReport && (
          <Button variant="outline" onClick={onViewReport}>
            <FileText className="h-4 w-4 mr-2" />
            View Report
          </Button>
        )}
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        )}
      </div>
    </div>
  );
}
