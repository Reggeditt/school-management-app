/**
 * Utility functions for attendance calculations and analytics
 */

export interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  note?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  absent: number;
  late: number;
  presentPercentage: number;
  absentPercentage: number;
  latePercentage: number;
}

/**
 * Calculate attendance statistics from records
 */
export function calculateAttendanceStats(records: AttendanceRecord[]): AttendanceStats {
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  
  return {
    total,
    present,
    absent,
    late,
    presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
    absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0,
    latePercentage: total > 0 ? Math.round((late / total) * 100) : 0
  };
}

/**
 * Get attendance status color for UI display
 */
export function getAttendanceStatusColor(status: 'present' | 'absent' | 'late'): string {
  switch (status) {
    case 'present': return 'text-green-600 bg-green-50 border-green-200';
    case 'absent': return 'text-red-600 bg-red-50 border-red-200';
    case 'late': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Initialize attendance records for a list of students
 */
export function initializeAttendanceRecords(
  studentIds: string[], 
  defaultStatus: 'present' | 'absent' | 'late' = 'present'
): AttendanceRecord[] {
  return studentIds.map(studentId => ({
    studentId,
    status: defaultStatus,
    note: ''
  }));
}

/**
 * Update attendance record status
 */
export function updateAttendanceRecord(
  records: AttendanceRecord[],
  studentId: string,
  status: 'present' | 'absent' | 'late',
  note?: string
): AttendanceRecord[] {
  return records.map(record => 
    record.studentId === studentId 
      ? { ...record, status, ...(note !== undefined && { note }) }
      : record
  );
}

/**
 * Bulk update attendance records
 */
export function bulkUpdateAttendance(
  records: AttendanceRecord[],
  status: 'present' | 'absent' | 'late'
): AttendanceRecord[] {
  return records.map(record => ({ ...record, status }));
}

/**
 * Get attendance trends for analytics
 */
export function getAttendanceTrends(
  historicalData: Array<{
    date: string;
    records: AttendanceRecord[];
  }>
): {
  averageAttendance: number;
  trend: 'improving' | 'declining' | 'stable';
  consistentAttendees: string[];
  frequentAbsentees: string[];
} {
  if (historicalData.length === 0) {
    return {
      averageAttendance: 0,
      trend: 'stable',
      consistentAttendees: [],
      frequentAbsentees: []
    };
  }

  // Calculate average attendance percentage
  const attendancePercentages = historicalData.map(data => {
    const stats = calculateAttendanceStats(data.records);
    return stats.presentPercentage;
  });

  const averageAttendance = Math.round(
    attendancePercentages.reduce((sum, pct) => sum + pct, 0) / attendancePercentages.length
  );

  // Determine trend (compare first half vs second half)
  const midPoint = Math.floor(attendancePercentages.length / 2);
  const firstHalf = attendancePercentages.slice(0, midPoint);
  const secondHalf = attendancePercentages.slice(midPoint);
  
  const firstHalfAvg = firstHalf.reduce((sum, pct) => sum + pct, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, pct) => sum + pct, 0) / secondHalf.length;
  
  let trend: 'improving' | 'declining' | 'stable' = 'stable';
  if (secondHalfAvg > firstHalfAvg + 2) trend = 'improving';
  else if (secondHalfAvg < firstHalfAvg - 2) trend = 'declining';

  // Find consistent attendees and frequent absentees
  const studentAttendance: Record<string, { present: number; total: number }> = {};
  
  historicalData.forEach(data => {
    data.records.forEach(record => {
      if (!studentAttendance[record.studentId]) {
        studentAttendance[record.studentId] = { present: 0, total: 0 };
      }
      studentAttendance[record.studentId].total++;
      if (record.status === 'present') {
        studentAttendance[record.studentId].present++;
      }
    });
  });

  const consistentAttendees = Object.entries(studentAttendance)
    .filter(([_, data]) => (data.present / data.total) >= 0.95)
    .map(([studentId]) => studentId);

  const frequentAbsentees = Object.entries(studentAttendance)
    .filter(([_, data]) => (data.present / data.total) <= 0.8)
    .map(([studentId]) => studentId);

  return {
    averageAttendance,
    trend,
    consistentAttendees,
    frequentAbsentees
  };
}

/**
 * Export attendance data to CSV format
 */
export function exportAttendanceToCSV(
  date: string,
  className: string,
  records: AttendanceRecord[],
  students: Array<{ id: string; firstName: string; lastName: string; studentId: string }>
): string {
  const headers = ['Student ID', 'First Name', 'Last Name', 'Status', 'Notes'];
  const rows = records.map(record => {
    const student = students.find(s => s.id === record.studentId);
    return [
      student?.studentId || '',
      student?.firstName || '',
      student?.lastName || '',
      record.status,
      record.note || ''
    ];
  });

  const csvContent = [
    `Attendance Report - ${className}`,
    `Date: ${date}`,
    '',
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}
