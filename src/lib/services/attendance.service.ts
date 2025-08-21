import { DatabaseService } from '@/lib/database-services';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  timestamp: string;
  notes?: string;
  classId: string;
  sessionId: string;
  date: string;
  teacherId: string;
}

export interface ClassSession {
  id: string;
  classId: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  teacherId: string;
  location?: string;
  duration: number; // in minutes
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
  previousRate?: number;
}

export interface AttendanceReport {
  studentId: string;
  studentName: string;
  rollNumber: number;
  totalSessions: number;
  presentSessions: number;
  absentSessions: number;
  lateSessions: number;
  excusedSessions: number;
  attendanceRate: number;
  trend: 'improving' | 'declining' | 'stable';
}

export interface AttendanceFilters {
  classId?: string;
  date?: string;
  status?: AttendanceRecord['status'];
  studentId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export class AttendanceService {
  /**
   * Get class sessions for a teacher on a specific date
   */
  static async getClassSessions(teacherId: string, date: string): Promise<ClassSession[]> {
    try {
      // This would query the sessions collection
      console.log('Getting sessions for teacher:', teacherId, 'date:', date);
      
      // Mock data for different session statuses
      const mockSessions: ClassSession[] = [
        {
          id: `session_1_${date}`,
          classId: 'class-1',
          className: 'Grade 10 Mathematics',
          subject: 'Algebra',
          date,
          startTime: '09:00',
          endTime: '10:00',
          totalStudents: 25,
          presentCount: 22,
          absentCount: 2,
          lateCount: 1,
          excusedCount: 0,
          status: 'completed',
          teacherId,
          location: 'Room 101',
          duration: 60
        },
        {
          id: `session_2_${date}`,
          classId: 'class-2',
          className: 'Grade 11 Mathematics',
          subject: 'Geometry',
          date,
          startTime: '10:15',
          endTime: '11:15',
          totalStudents: 28,
          presentCount: 26,
          absentCount: 1,
          lateCount: 1,
          excusedCount: 0,
          status: 'ongoing',
          teacherId,
          location: 'Room 102',
          duration: 60
        },
        {
          id: `session_3_${date}`,
          classId: 'class-3',
          className: 'Grade 9 Mathematics',
          subject: 'Basic Algebra',
          date,
          startTime: '13:00',
          endTime: '14:00',
          totalStudents: 30,
          presentCount: 0,
          absentCount: 0,
          lateCount: 0,
          excusedCount: 0,
          status: 'scheduled',
          teacherId,
          location: 'Room 103',
          duration: 60
        },
        {
          id: `session_4_${date}`,
          classId: 'class-4',
          className: 'Grade 12 Mathematics',
          subject: 'Calculus',
          date,
          startTime: '14:15',
          endTime: '15:15',
          totalStudents: 20,
          presentCount: 19,
          absentCount: 1,
          lateCount: 0,
          excusedCount: 0,
          status: 'completed',
          teacherId,
          location: 'Room 104',
          duration: 60
        }
      ];

      return mockSessions;
    } catch (error) {
      console.error('Error fetching class sessions:', error);
      throw new Error('Failed to fetch class sessions');
    }
  }

  /**
   * Get attendance records for a specific class and date
   */
  static async getAttendanceRecords(classId: string, date: string): Promise<AttendanceRecord[]> {
    try {
      // This would query the attendance records
      console.log('Getting attendance for class:', classId, 'date:', date);
      
      // Generate mock attendance records
      const studentCount = 25;
      const mockRecords: AttendanceRecord[] = [];
      
      for (let i = 1; i <= studentCount; i++) {
        const statuses: AttendanceRecord['status'][] = ['present', 'absent', 'late', 'excused'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        // Higher probability for present
        const status = Math.random() < 0.85 ? 'present' : randomStatus;
        
        mockRecords.push({
          id: `attendance_${classId}_${date}_${i}`,
          studentId: `student_${i}`,
          studentName: `Student ${i.toString().padStart(2, '0')}`,
          rollNumber: i,
          status,
          timestamp: new Date().toISOString(),
          notes: status === 'excused' ? 'Medical appointment' : '',
          classId,
          sessionId: `session_${classId}_${date}`,
          date,
          teacherId: 'teacher-1'
        });
      }

      return mockRecords;
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      throw new Error('Failed to fetch attendance records');
    }
  }

  /**
   * Save attendance records for a session
   */
  static async saveAttendance(sessionId: string, records: AttendanceRecord[]): Promise<void> {
    try {
      // This would save attendance records to the database
      console.log('Saving attendance for session:', sessionId, records.length, 'records');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving attendance:', error);
      throw new Error('Failed to save attendance');
    }
  }

  /**
   * Update a single attendance record
   */
  static async updateAttendanceRecord(recordId: string, updates: Partial<AttendanceRecord>): Promise<void> {
    try {
      // This would update a specific attendance record
      console.log('Updating attendance record:', recordId, updates);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw new Error('Failed to update attendance record');
    }
  }

  /**
   * Calculate attendance statistics
   */
  static calculateStats(records: AttendanceRecord[]): AttendanceStats {
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const excused = records.filter(r => r.status === 'excused').length;
    
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate
    };
  }

  /**
   * Get attendance report for a class over a date range
   */
  static async getAttendanceReport(
    classId: string, 
    startDate: string, 
    endDate: string
  ): Promise<AttendanceReport[]> {
    try {
      // This would generate a comprehensive attendance report
      console.log('Generating attendance report for class:', classId, startDate, 'to', endDate);
      
      // Mock report data
      const mockReport: AttendanceReport[] = [];
      
      for (let i = 1; i <= 25; i++) {
        const totalSessions = 20;
        const presentSessions = Math.floor(totalSessions * (0.7 + Math.random() * 0.3));
        const absentSessions = Math.floor((totalSessions - presentSessions) * 0.6);
        const lateSessions = Math.floor((totalSessions - presentSessions - absentSessions) * 0.7);
        const excusedSessions = totalSessions - presentSessions - absentSessions - lateSessions;
        
        const attendanceRate = Math.round((presentSessions / totalSessions) * 100);
        
        // Determine trend based on recent vs historical performance
        const recentRate = Math.random() * 100;
        let trend: AttendanceReport['trend'] = 'stable';
        if (recentRate > attendanceRate + 5) trend = 'improving';
        if (recentRate < attendanceRate - 5) trend = 'declining';
        
        mockReport.push({
          studentId: `student_${i}`,
          studentName: `Student ${i.toString().padStart(2, '0')}`,
          rollNumber: i,
          totalSessions,
          presentSessions,
          absentSessions,
          lateSessions,
          excusedSessions,
          attendanceRate,
          trend
        });
      }

      return mockReport.sort((a, b) => a.rollNumber - b.rollNumber);
    } catch (error) {
      console.error('Error generating attendance report:', error);
      throw new Error('Failed to generate attendance report');
    }
  }

  /**
   * Export attendance data to CSV
   */
  static async exportAttendance(
    classId: string, 
    startDate: string, 
    endDate: string
  ): Promise<string> {
    try {
      const report = await this.getAttendanceReport(classId, startDate, endDate);
      
      const headers = [
        'Roll Number',
        'Student Name',
        'Total Sessions',
        'Present',
        'Absent',
        'Late',
        'Excused',
        'Attendance Rate (%)',
        'Trend'
      ];

      const csvContent = [
        headers.join(','),
        ...report.map(student => [
          student.rollNumber,
          `"${student.studentName}"`,
          student.totalSessions,
          student.presentSessions,
          student.absentSessions,
          student.lateSessions,
          student.excusedSessions,
          student.attendanceRate,
          student.trend
        ].join(','))
      ].join('\n');

      return csvContent;
    } catch (error) {
      console.error('Error exporting attendance:', error);
      throw new Error('Failed to export attendance data');
    }
  }

  /**
   * Get attendance trends for dashboard
   */
  static async getAttendanceTrends(teacherId: string, days: number = 7): Promise<{
    date: string;
    attendanceRate: number;
    totalStudents: number;
  }[]> {
    try {
      // This would calculate attendance trends over time
      console.log('Getting attendance trends for teacher:', teacherId, 'days:', days);
      
      const trends = [];
      const today = new Date();
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        trends.push({
          date: date.toISOString().split('T')[0],
          attendanceRate: 75 + Math.random() * 20, // 75-95%
          totalStudents: 100 + Math.floor(Math.random() * 50)
        });
      }

      return trends;
    } catch (error) {
      console.error('Error fetching attendance trends:', error);
      throw new Error('Failed to fetch attendance trends');
    }
  }

  /**
   * Send attendance notifications to parents
   */
  static async sendAttendanceNotifications(
    classId: string, 
    date: string, 
    absentStudents: string[]
  ): Promise<void> {
    try {
      // This would send notifications to parents of absent students
      console.log('Sending attendance notifications for class:', classId, 'absent students:', absentStudents.length);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw new Error('Failed to send attendance notifications');
    }
  }

  /**
   * Get students with low attendance
   */
  static async getLowAttendanceStudents(
    teacherId: string, 
    threshold: number = 75
  ): Promise<AttendanceReport[]> {
    try {
      // This would identify students with attendance below threshold
      console.log('Getting low attendance students for teacher:', teacherId, 'threshold:', threshold);
      
      // Generate mock data for students with low attendance
      const mockLowAttendance: AttendanceReport[] = [
        {
          studentId: 'student_5',
          studentName: 'Student 05',
          rollNumber: 5,
          totalSessions: 20,
          presentSessions: 12,
          absentSessions: 6,
          lateSessions: 2,
          excusedSessions: 0,
          attendanceRate: 60,
          trend: 'declining'
        },
        {
          studentId: 'student_12',
          studentName: 'Student 12',
          rollNumber: 12,
          totalSessions: 20,
          presentSessions: 14,
          absentSessions: 4,
          lateSessions: 2,
          excusedSessions: 0,
          attendanceRate: 70,
          trend: 'stable'
        },
        {
          studentId: 'student_18',
          studentName: 'Student 18',
          rollNumber: 18,
          totalSessions: 20,
          presentSessions: 13,
          absentSessions: 5,
          lateSessions: 1,
          excusedSessions: 1,
          attendanceRate: 65,
          trend: 'improving'
        }
      ];

      return mockLowAttendance.filter(student => student.attendanceRate < threshold);
    } catch (error) {
      console.error('Error fetching low attendance students:', error);
      throw new Error('Failed to fetch low attendance students');
    }
  }

  /**
   * Start a new attendance session
   */
  static async startSession(classId: string, date: string): Promise<ClassSession> {
    try {
      // This would create a new attendance session
      console.log('Starting session for class:', classId, 'date:', date);
      
      const session: ClassSession = {
        id: `session_${classId}_${date}_${Date.now()}`,
        classId,
        className: 'Mock Class',
        subject: 'Mock Subject',
        date,
        startTime: new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        endTime: '',
        totalStudents: 25,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        excusedCount: 0,
        status: 'ongoing',
        teacherId: 'teacher-1',
        duration: 60
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return session;
    } catch (error) {
      console.error('Error starting session:', error);
      throw new Error('Failed to start attendance session');
    }
  }

  /**
   * End an attendance session
   */
  static async endSession(sessionId: string): Promise<void> {
    try {
      // This would close the attendance session
      console.log('Ending session:', sessionId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error ending session:', error);
      throw new Error('Failed to end attendance session');
    }
  }

  /**
   * Get attendance status icon and color
   */
  static getStatusDisplay(status: AttendanceRecord['status']): {
    icon: string;
    color: string;
    bgColor: string;
  } {
    switch (status) {
      case 'present':
        return {
          icon: 'CheckCircle',
          color: 'text-green-600',
          bgColor: 'bg-green-50 text-green-700'
        };
      case 'absent':
        return {
          icon: 'XCircle',
          color: 'text-red-600',
          bgColor: 'bg-red-50 text-red-700'
        };
      case 'late':
        return {
          icon: 'Clock',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 text-yellow-700'
        };
      case 'excused':
        return {
          icon: 'AlertCircle',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 text-blue-700'
        };
      default:
        return {
          icon: 'AlertCircle',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50 text-gray-700'
        };
    }
  }

  /**
   * Validate attendance data
   */
  static validateAttendanceData(records: AttendanceRecord[]): string[] {
    const errors: string[] = [];

    if (records.length === 0) {
      errors.push('No attendance records to save');
    }

    records.forEach((record, index) => {
      if (!record.studentId) {
        errors.push(`Record ${index + 1}: Student ID is required`);
      }
      
      if (!record.status) {
        errors.push(`Record ${index + 1}: Attendance status is required`);
      }
      
      if (!['present', 'absent', 'late', 'excused'].includes(record.status)) {
        errors.push(`Record ${index + 1}: Invalid attendance status`);
      }
    });

    return errors;
  }
}
