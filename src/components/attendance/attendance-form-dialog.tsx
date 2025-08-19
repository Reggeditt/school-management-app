'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Attendance } from '@/lib/database-services';
import { AttendanceFormData, validateAttendanceForm, generateAttendanceId } from '@/lib/form-utils';

interface AttendanceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attendance?: Attendance | null;
  selectedDate?: string;
  selectedClassId?: string;
}

export function AttendanceFormDialog({
  isOpen,
  onClose,
  attendance,
  selectedDate = new Date().toISOString().split('T')[0],
  selectedClassId
}: AttendanceFormDialogProps) {
  const { state, addAttendance, updateAttendance } = useStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<AttendanceFormData>({
    studentId: '',
    classId: selectedClassId || '',
    date: selectedDate,
    status: 'present',
    checkInTime: '',
    checkOutTime: '',
    remarks: '',
    period: undefined,
    subject: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or attendance changes
  useEffect(() => {
    if (isOpen) {
      if (attendance) {
        // Edit mode
        setFormData({
          studentId: attendance.studentId,
          classId: attendance.classId,
          date: attendance.date.toISOString().split('T')[0],
          status: attendance.status,
          checkInTime: attendance.checkInTime ? 
            attendance.checkInTime.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '',
          checkOutTime: attendance.checkOutTime ? 
            attendance.checkOutTime.toLocaleTimeString('en-US', { 
              hour12: false, 
              hour: '2-digit', 
              minute: '2-digit' 
            }) : '',
          remarks: attendance.remarks || '',
          period: attendance.period,
          subject: attendance.subject || ''
        });
      } else {
        // Add mode
        setFormData({
          studentId: '',
          classId: selectedClassId || '',
          date: selectedDate,
          status: 'present',
          checkInTime: '',
          checkOutTime: '',
          remarks: '',
          period: undefined,
          subject: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, attendance, selectedDate, selectedClassId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateAttendanceForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const attendanceData = {
        schoolId: 'school-001', // This should come from auth context
        studentId: formData.studentId,
        classId: formData.classId,
        date: new Date(formData.date),
        status: formData.status as 'present' | 'absent' | 'late' | 'excused',
        checkInTime: formData.checkInTime ? 
          new Date(`${formData.date}T${formData.checkInTime}:00`) : undefined,
        checkOutTime: formData.checkOutTime ? 
          new Date(`${formData.date}T${formData.checkOutTime}:00`) : undefined,
        remarks: formData.remarks || undefined,
        markedBy: 'current-user-id', // This should come from auth context
        period: formData.period,
        subject: formData.subject || undefined
      };

      if (attendance) {
        // Update existing attendance
        await updateAttendance(attendance.id, attendanceData);
        toast({
          title: 'Success',
          description: 'Attendance updated successfully',
        });
      } else {
        // Create new attendance
        await addAttendance(attendanceData);
        toast({
          title: 'Success',
          description: 'Attendance marked successfully',
        });
      }

      onClose();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to save attendance. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = state.students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getClassName = (classId: string) => {
    const classItem = state.classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'absent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'late': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'excused': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Filter students by selected class
  const availableStudents = state.students.filter(student => 
    !formData.classId || student.classId === formData.classId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {attendance ? 'Edit Attendance' : 'Mark Attendance'}
          </DialogTitle>
          <DialogDescription>
            {attendance ? 'Update attendance record' : 'Mark attendance for a student'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Class Selection */}
            <div className="space-y-2">
              <Label htmlFor="classId">Class *</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, classId: value, studentId: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {state.classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classId && <p className="text-sm text-red-500">{errors.classId}</p>}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>
          </div>

          {/* Student Selection */}
          <div className="space-y-2">
            <Label htmlFor="studentId">Student *</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}
              disabled={!formData.classId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} - {student.rollNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.studentId && <p className="text-sm text-red-500">{errors.studentId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>

            {/* Period */}
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={formData.period?.toString() || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, period: value ? parseInt(value) : undefined }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((period) => (
                    <SelectItem key={period} value={period.toString()}>
                      Period {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.period && <p className="text-sm text-red-500">{errors.period}</p>}
            </div>
          </div>

          {/* Time Fields - Only show for Present/Late status */}
          {(formData.status === 'present' || formData.status === 'late') && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkInTime: e.target.value }))}
                />
                {errors.checkInTime && <p className="text-sm text-red-500">{errors.checkInTime}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                />
                {errors.checkOutTime && <p className="text-sm text-red-500">{errors.checkOutTime}</p>}
              </div>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject name (optional)"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          {/* Preview */}
          {formData.studentId && formData.classId && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Student:</strong> {getStudentName(formData.studentId)}</p>
                <p><strong>Class:</strong> {getClassName(formData.classId)}</p>
                <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <Badge className={getStatusColor(formData.status)}>{formData.status}</Badge></p>
                {formData.period && <p><strong>Period:</strong> {formData.period}</p>}
                {formData.subject && <p><strong>Subject:</strong> {formData.subject}</p>}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (attendance ? 'Update Attendance' : 'Mark Attendance')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
