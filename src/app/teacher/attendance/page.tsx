'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Save,
  Download,
  AlertCircle
} from 'lucide-react';

// Custom hooks and components
import { useTeacherData, useAttendance } from '@/hooks/teacher';
import { FilterSearchBar, AttendanceMarkingCard } from '@/components/teacher';
import { calculateAttendanceStats, exportAttendanceToCSV } from '@/lib/utils/teacher';

export default function TeacherAttendancePage() {
  const { 
    teacherClasses, 
    teacherStudents, 
    loading, 
    error, 
    teacherId,
    getStudentsForClass 
  } = useTeacherData();

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    attendanceRecords,
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
  } = useAttendance();

  // Initialize attendance records when class is selected
  useEffect(() => {
    if (selectedClass) {
      const classStudents = getStudentsForClass(selectedClass);
      const studentIds = classStudents.map(student => student.id);
      initializeRecords(studentIds);
    }
  }, [selectedClass, getStudentsForClass, initializeRecords]);

  // Set default class when classes load
  useEffect(() => {
    if (teacherClasses.length > 0 && !selectedClass) {
      setSelectedClass(teacherClasses[0].id);
    }
  }, [teacherClasses, selectedClass]);

  const handleSaveAttendance = async () => {
    if (!selectedClass || !teacherId) return;
    
    const result = await saveAttendance(selectedClass, teacherId);
    if (result.success) {
      // Show success message (you could use a toast here)
      console.log('Attendance saved successfully');
    } else {
      // Show error message
      console.error('Failed to save attendance');
    }
  };

  const handleExportAttendance = () => {
    if (!selectedClass) return;
    
    const selectedClassData = teacherClasses.find(cls => cls.id === selectedClass);
    const classStudents = getStudentsForClass(selectedClass);
    
    const csvContent = exportAttendanceToCSV(
      selectedDate,
      selectedClassData?.name || 'Unknown Class',
      attendanceRecords,
      classStudents
    );
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${selectedDate}_${selectedClassData?.name.replace(/\s+/g, '_')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredStudents = getStudentsForClass(selectedClass).filter(student => {
    if (!searchTerm) return true;
    const searchableText = `${student.firstName} ${student.lastName} ${student.studentId}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

  const stats = getAttendanceStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">
            Mark and track student attendance for your classes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportAttendance}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveAttendance} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Select Class</label>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a class" />
            </SelectTrigger>
            <SelectContent>
              {teacherClasses.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name} ({getStudentsForClass(classItem.id).length} students)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Search */}
      <FilterSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search students by name or ID..."
      />

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {selectedClass ? teacherClasses.find(c => c.id === selectedClass)?.name : 'No class selected'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.presentPercentage}% attendance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <p className="text-xs text-muted-foreground">
              {stats.absentPercentage}% of students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground">
              {stats.latePercentage}% of students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedClass && (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={markAllPresent}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Present
          </Button>
          <Button variant="outline" onClick={markAllAbsent}>
            <XCircle className="h-4 w-4 mr-2" />
            Mark All Absent
          </Button>
        </div>
      )}

      {/* Attendance Grid */}
      {selectedClass && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => {
            const attendanceRecord = attendanceRecords.find(r => r.studentId === student.id);
            if (!attendanceRecord) return null;

            return (
              <AttendanceMarkingCard
                key={student.id}
                student={student}
                attendanceRecord={attendanceRecord}
                onStatusChange={updateAttendanceStatus}
                onNoteChange={updateAttendanceNote}
              />
            );
          })}
        </div>
      )}

      {selectedClass && filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? 'No students match your search criteria.' : 'This class has no students enrolled.'}
          </p>
        </div>
      )}
    </div>
  );
}
