import { useState } from 'react';

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  note?: string;
}

/**
 * Custom hook for managing attendance functionality
 */
export function useAttendance(initialRecords: AttendanceRecord[] = []) {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialRecords);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const updateAttendanceStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, status }
          : record
      )
    );
  };

  const updateAttendanceNote = (studentId: string, note: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.studentId === studentId 
          ? { ...record, note }
          : record
      )
    );
  };

  const markAllPresent = () => {
    setAttendanceRecords(prev => 
      prev.map(record => ({ ...record, status: 'present' as const }))
    );
  };

  const markAllAbsent = () => {
    setAttendanceRecords(prev => 
      prev.map(record => ({ ...record, status: 'absent' as const }))
    );
  };

  const getAttendanceStats = () => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    
    return {
      total,
      present,
      absent,
      late,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0,
      latePercentage: total > 0 ? Math.round((late / total) * 100) : 0
    };
  };

  const initializeRecords = (studentIds: string[]) => {
    const newRecords = studentIds.map(studentId => ({
      studentId,
      status: 'present' as const,
      note: ''
    }));
    setAttendanceRecords(newRecords);
  };

  const saveAttendance = async (classId: string, teacherId: string) => {
    setSaving(true);
    try {
      // Mock save operation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would call your attendance service
      // await attendanceService.saveAttendance({
      //   classId,
      //   teacherId,
      //   date: selectedDate,
      //   records: attendanceRecords
      // });
      
      return { success: true, message: 'Attendance saved successfully' };
    } catch (error) {
      console.error('Error saving attendance:', error);
      return { success: false, message: 'Failed to save attendance' };
    } finally {
      setSaving(false);
    }
  };

  return {
    attendanceRecords,
    setAttendanceRecords,
    selectedDate,
    setSelectedDate,
    saving,
    updateAttendanceStatus,
    updateAttendanceNote,
    markAllPresent,
    markAllAbsent,
    getAttendanceStats,
    initializeRecords,
    saveAttendance
  };
}
