'use client';

import { useState, useEffect } from 'react';
import { AttendanceHeader } from '@/components/teacher/attendance-components';
import { AttendanceStatsCards } from '@/components/teacher/attendance-components';
import { ClassSessionsOverview } from '@/components/teacher/attendance-components';
import { AttendanceControls } from '@/components/teacher/attendance-components';
import { AttendanceTable } from '@/components/teacher/attendance-components';
import { AttendanceReportTable } from '@/components/teacher/attendance-components';
import { useToast } from "@/components/ui/use-toast";
import { 
  AttendanceService,
  type AttendanceRecord,
  type ClassSession,
  type AttendanceStats,
  type AttendanceReport
} from '@/lib/services/attendance.service';

export default function AttendancePage() {
  const { toast } = useToast();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [view, setView] = useState<'attendance' | 'report'>('attendance');
  
  // Data state
  const [classes] = useState([
    { id: 'class1', name: 'Mathematics - Class 10A' },
    { id: 'class2', name: 'Physics - Class 11B' },
    { id: 'class3', name: 'Chemistry - Class 12C' },
  ]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    attendanceRate: 0
  });
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReport[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Load today's sessions
        const todaySessions = await AttendanceService.getClassSessions('teacher1', selectedDate);
        setSessions(todaySessions);
        
        // Set default class if none selected
        if (!selectedClass && todaySessions.length > 0) {
          setSelectedClass(todaySessions[0].classId);
        }
        
      } catch (error) {
        console.error('Failed to initialize attendance data:', error);
        toast({
          title: "Error",
          description: "Failed to load attendance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [selectedDate, toast]);

  // Load attendance data when class or date changes
  useEffect(() => {
    const loadAttendanceData = async () => {
      if (!selectedClass || !selectedDate) return;
      
      try {
        setLoading(true);
        
        // Load attendance records
        const records = await AttendanceService.getAttendanceRecords(selectedClass, selectedDate);
        setAttendanceRecords(records);
        
        // Calculate stats
        const attendanceStats = AttendanceService.calculateStats(records);
        setStats(attendanceStats);
        
        // Load report data if in report view
        if (view === 'report') {
          const startDate = new Date(selectedDate);
          startDate.setDate(startDate.getDate() - 30); // Last 30 days
          const report = await AttendanceService.getAttendanceReport(
            selectedClass,
            startDate.toISOString().split('T')[0],
            selectedDate
          );
          setAttendanceReport(report);
        }
        
      } catch (error) {
        console.error('Failed to load attendance data:', error);
        toast({
          title: "Error",
          description: "Failed to load attendance data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAttendanceData();
  }, [selectedClass, selectedDate, view, toast]);

  // Event handlers
  const handleClassSelect = (classId: string) => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Do you want to continue?')) {
        setSelectedClass(classId);
        setHasUnsavedChanges(false);
      }
    } else {
      setSelectedClass(classId);
    }
  };

  const handleDateChange = (date: string) => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Do you want to continue?')) {
        setSelectedDate(date);
        setHasUnsavedChanges(false);
      }
    } else {
      setSelectedDate(date);
    }
  };

  const handleStatusChange = async (studentId: string, status: AttendanceRecord['status']) => {
    try {
      const updatedRecords = attendanceRecords.map(record => 
        record.studentId === studentId 
          ? { ...record, status, timestamp: new Date().toISOString() }
          : record
      );
      
      setAttendanceRecords(updatedRecords);
      setHasUnsavedChanges(true);
      
      // Recalculate stats
      const newStats = AttendanceService.calculateStats(updatedRecords);
      setStats(newStats);
      
      toast({
        title: "Status Updated",
        description: `Student status changed to ${status}`,
      });
      
    } catch (error) {
      console.error('Failed to update attendance status:', error);
      toast({
        title: "Error",
        description: "Failed to update attendance status",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!selectedClass || !selectedDate) return;
    
    try {
      setSaving(true);
      
      // Save records one by one
      for (const record of attendanceRecords) {
        await AttendanceService.updateAttendanceRecord(record.id, {
          status: record.status,
          notes: record.notes,
          timestamp: record.timestamp
        });
      }
      setHasUnsavedChanges(false);
      
      toast({
        title: "Success",
        description: "Attendance data saved successfully",
      });
      
    } catch (error) {
      console.error('Failed to save attendance data:', error);
      toast({
        title: "Error",
        description: "Failed to save attendance data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStartSession = async (classId: string) => {
    try {
      await AttendanceService.startSession(classId, selectedDate);
      
      // Refresh sessions
      const updatedSessions = await AttendanceService.getClassSessions('teacher1', selectedDate);
      setSessions(updatedSessions);
      
      toast({
        title: "Session Started",
        description: "Attendance session has been started",
      });
      
    } catch (error) {
      console.error('Failed to start session:', error);
      toast({
        title: "Error",
        description: "Failed to start attendance session",
        variant: "destructive",
      });
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      await AttendanceService.endSession(sessionId);
      
      // Refresh sessions
      const updatedSessions = await AttendanceService.getClassSessions('teacher1', selectedDate);
      setSessions(updatedSessions);
      
      toast({
        title: "Session Ended",
        description: "Attendance session has been ended",
      });
      
    } catch (error) {
      console.error('Failed to end session:', error);
      toast({
        title: "Error",
        description: "Failed to end attendance session",
        variant: "destructive",
      });
    }
  };

  const handleExport = async () => {
    if (!selectedClass) return;
    
    try {
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      
      await AttendanceService.getAttendanceReport(
        selectedClass,
        startDate.toISOString().split('T')[0],
        selectedDate
      );
      
      toast({
        title: "Export Successful",
        description: "Attendance report has been exported",
      });
      
    } catch (error) {
      console.error('Failed to export report:', error);
      toast({
        title: "Error",
        description: "Failed to export attendance report",
        variant: "destructive",
      });
    }
  };

  const handleSendNotifications = async () => {
    if (!selectedClass || !selectedDate) return;
    
    try {
      const absentStudents = attendanceRecords.filter(record => record.status === 'absent');
      
      if (absentStudents.length === 0) {
        toast({
          title: "No Notifications Needed",
          description: "No absent students found for today",
        });
        return;
      }
      
      const absentStudentIds = absentStudents.map(student => student.studentId);
      await AttendanceService.sendAttendanceNotifications(selectedClass, selectedDate, absentStudentIds);
      
      toast({
        title: "Notifications Sent",
        description: `Sent absence notifications for ${absentStudents.length} students`,
      });
      
    } catch (error) {
      console.error('Failed to send notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send absence notifications",
        variant: "destructive",
      });
    }
  };

  const selectedClassName = classes.find(cls => cls.id === selectedClass)?.name || '';

  if (loading && !selectedClass) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AttendanceHeader 
        onExport={handleExport}
        onViewReport={() => setView(view === 'attendance' ? 'report' : 'attendance')}
      />

      {/* Stats Cards */}
      <AttendanceStatsCards stats={stats} loading={loading} />

      {/* Today's Sessions Overview */}
      <ClassSessionsOverview
        sessions={sessions}
        selectedClass={selectedClass}
        onClassSelect={handleClassSelect}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        loading={loading}
      />

      {/* Controls */}
      <AttendanceControls
        selectedClass={selectedClass}
        selectedDate={selectedDate}
        classes={classes}
        onClassChange={handleClassSelect}
        onDateChange={handleDateChange}
        onExport={handleExport}
        onSendNotifications={handleSendNotifications}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        saving={saving}
      />

      {/* Main Content */}
      {view === 'attendance' ? (
        <AttendanceTable
          records={attendanceRecords}
          onStatusChange={handleStatusChange}
          className={selectedClassName}
          loading={loading}
        />
      ) : (
        <AttendanceReportTable
          report={attendanceReport}
          loading={loading}
        />
      )}
    </div>
  );
}
