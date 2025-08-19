'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Attendance } from '@/lib/database-services';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceFormDialog } from '@/components/attendance/attendance-form-dialog';
import { formatDate } from '@/lib/form-utils';
import { CalendarDays, Users, UserCheck, UserX, Clock } from 'lucide-react';

export default function AttendancePage() {
  const { 
    state, 
    loadAttendance,
    loadStudents,
    loadClasses,
    addAttendance, 
    updateAttendance, 
    deleteAttendance 
  } = useStore();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  // Load data on component mount
  useEffect(() => {
    loadAttendance(new Date(selectedDate));
    loadStudents();
    loadClasses();
  }, [loadAttendance, loadStudents, loadClasses, selectedDate]);

  // Get student name by ID
  const getStudentName = (studentId: string) => {
    const student = state.students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  // Get class name by ID
  const getClassName = (classId: string) => {
    const classItem = state.classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'excused': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const filteredAttendance = selectedClassId 
      ? state.attendance.filter(a => a.classId === selectedClassId)
      : state.attendance;

    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(a => a.status === 'present').length;
    const absent = filteredAttendance.filter(a => a.status === 'absent').length;
    const late = filteredAttendance.filter(a => a.status === 'late').length;
    const excused = filteredAttendance.filter(a => a.status === 'excused').length;

    return {
      total,
      present,
      absent,
      late,
      excused,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0
    };
  };

  const stats = calculateStats();

  // Handle delete attendance
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await deleteAttendance(id);
        toast({
          title: 'Success',
          description: 'Attendance record deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete attendance record',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle edit attendance
  const handleEdit = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsFormOpen(true);
  };

  // Handle add new attendance
  const handleAdd = () => {
    setSelectedAttendance(null);
    setIsFormOpen(true);
  };

  // Filter data
  const filteredAttendance = state.attendance.filter(attendance => {
    const matchesClass = !selectedClassId || attendance.classId === selectedClassId;
    const matchesDate = attendance.date.toDateString() === new Date(selectedDate).toDateString();
    return matchesClass && matchesDate;
  });

  // Table columns configuration
  const columns: Column<Attendance>[] = [
    {
      key: 'student',
      title: 'Student',
      render: (_, attendance) => {
        const student = state.students.find(s => s.id === attendance.studentId);
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                {student ? `${student.firstName[0]}${student.lastName[0]}` : 'UK'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{getStudentName(attendance.studentId)}</div>
              <div className="text-sm text-muted-foreground">
                {student?.rollNumber}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'class',
      title: 'Class',
      render: (_, attendance) => (
        <div className="text-sm font-medium">
          {getClassName(attendance.classId)}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, attendance) => (
        <Badge className={getStatusColor(attendance.status)}>
          {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
        </Badge>
      )
    },
    {
      key: 'time',
      title: 'Time',
      render: (_, attendance) => (
        <div className="text-sm">
          {attendance.checkInTime && (
            <div>In: {attendance.checkInTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</div>
          )}
          {attendance.checkOutTime && (
            <div>Out: {attendance.checkOutTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</div>
          )}
        </div>
      )
    },
    {
      key: 'details',
      title: 'Details',
      render: (_, attendance) => (
        <div className="text-sm">
          {attendance.period && <div>Period: {attendance.period}</div>}
          {attendance.subject && <div>Subject: {attendance.subject}</div>}
          {attendance.remarks && (
            <div className="text-muted-foreground truncate max-w-32" title={attendance.remarks}>
              {attendance.remarks}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, attendance) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(attendance)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(attendance.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <Button onClick={handleAdd}>
          Mark Attendance
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          <label className="text-sm font-medium">Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <label className="text-sm font-medium">Class:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All Classes</option>
            {state.classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.present} ({stats.presentPercentage}%)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.absent} ({stats.absentPercentage}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.late}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excused</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Table */}
      <DataTable
        data={filteredAttendance}
        columns={columns}
        title={`Attendance Records - ${new Date(selectedDate).toLocaleDateString()}`}
        description={selectedClassId 
          ? `Showing attendance for ${getClassName(selectedClassId)}` 
          : 'Showing attendance for all classes'
        }
        searchPlaceholder="Search students..."
        filters={[
          {
            label: 'Status',
            value: 'status',
            options: [
              { label: 'Present', value: 'present' },
              { label: 'Absent', value: 'absent' },
              { label: 'Late', value: 'late' },
              { label: 'Excused', value: 'excused' }
            ]
          },
          {
            label: 'Class',
            value: 'classId',
            options: state.classes.map(c => ({ label: c.name, value: c.id }))
          }
        ]}
        loading={state.loading.attendance}
        onAdd={handleAdd}
        addButtonText="Mark Attendance"
      />

      {/* Form Dialog */}
      <AttendanceFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedAttendance(null);
        }}
        attendance={selectedAttendance}
        selectedDate={selectedDate}
        selectedClassId={selectedClassId}
      />
    </div>
  );
}