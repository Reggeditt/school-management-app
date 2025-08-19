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
import { Checkbox } from '@/components/ui/checkbox';
import { Exam } from '@/lib/database-services';
import { ExamFormData, validateExamForm, generateExamId } from '@/lib/form-utils';

interface ExamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: Exam | null;
}

export function ExamFormDialog({
  isOpen,
  onClose,
  exam
}: ExamFormDialogProps) {
  const { state, addExam, updateExam } = useStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<ExamFormData>({
    name: '',
    type: 'midterm',
    description: '',
    classIds: [],
    subjectId: '',
    teacherId: '',
    totalMarks: 100,
    passingMarks: 35,
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    instructions: '',
    status: 'scheduled',
    academicYear: new Date().getFullYear().toString()
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or exam changes
  useEffect(() => {
    if (isOpen) {
      if (exam) {
        // Edit mode
        setFormData({
          name: exam.name,
          type: exam.type,
          description: exam.description || '',
          classIds: exam.classIds,
          subjectId: exam.subjectId,
          teacherId: exam.teacherId,
          totalMarks: exam.totalMarks,
          passingMarks: exam.passingMarks,
          date: exam.date.toISOString().split('T')[0],
          startTime: exam.startTime,
          endTime: exam.endTime,
          duration: exam.duration,
          instructions: exam.instructions || '',
          status: exam.status,
          academicYear: exam.academicYear
        });
      } else {
        // Add mode
        setFormData({
          name: '',
          type: 'midterm',
          description: '',
          classIds: [],
          subjectId: '',
          teacherId: '',
          totalMarks: 100,
          passingMarks: 35,
          date: '',
          startTime: '',
          endTime: '',
          duration: 60,
          instructions: '',
          status: 'scheduled',
          academicYear: new Date().getFullYear().toString()
        });
      }
      setErrors({});
    }
  }, [isOpen, exam]);

  // Calculate duration when times change
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}:00`);
      const end = new Date(`2000-01-01T${formData.endTime}:00`);
      const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      if (diffMinutes > 0) {
        setFormData(prev => ({ ...prev, duration: diffMinutes }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateExamForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const examData = {
        schoolId: 'school-001', // This should come from auth context
        name: formData.name,
        type: formData.type,
        description: formData.description || undefined,
        classIds: formData.classIds,
        subjectId: formData.subjectId,
        teacherId: formData.teacherId,
        totalMarks: formData.totalMarks,
        passingMarks: formData.passingMarks,
        date: new Date(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration: formData.duration,
        instructions: formData.instructions || undefined,
        status: formData.status,
        academicYear: formData.academicYear
      };

      if (exam) {
        // Update existing exam
        await updateExam(exam.id, examData);
        toast({
          title: 'Success',
          description: 'Exam updated successfully',
        });
      } else {
        // Create new exam
        await addExam(examData);
        toast({
          title: 'Success',
          description: 'Exam created successfully',
        });
      }

      onClose();
    } catch (error) {toast({
        title: 'Error',
        description: 'Failed to save exam. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = state.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = state.teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
  };

  const getClassName = (classId: string) => {
    const classItem = state.classes.find(c => c.id === classId);
    return classItem ? classItem.name : 'Unknown Class';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'midterm': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'final': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'monthly': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'weekly': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'surprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const handleClassSelection = (classId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      classIds: checked 
        ? [...prev.classIds, classId]
        : prev.classIds.filter(id => id !== classId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {exam ? 'Edit Exam' : 'Create New Exam'}
          </DialogTitle>
          <DialogDescription>
            {exam ? 'Update exam details' : 'Create a new exam for your school'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Exam Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mid-Term Examination"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Exam Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="midterm">Mid-Term</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="surprise">Surprise Test</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the exam..."
              rows={2}
            />
          </div>

          {/* Subject and Teacher */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subjectId">Subject *</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {state.subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name} ({subject.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher *</Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {state.teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.firstName} {teacher.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teacherId && <p className="text-sm text-red-500">{errors.teacherId}</p>}
            </div>
          </div>

          {/* Classes Selection */}
          <div className="space-y-2">
            <Label>Classes *</Label>
            <div className="grid grid-cols-2 gap-2 p-3 border rounded-md max-h-32 overflow-y-auto">
              {state.classes.map((classItem) => (
                <div key={classItem.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`class-${classItem.id}`}
                    checked={formData.classIds.includes(classItem.id)}
                    onCheckedChange={(checked) => handleClassSelection(classItem.id, checked as boolean)}
                  />
                  <Label htmlFor={`class-${classItem.id}`} className="text-sm">
                    {classItem.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.classIds && <p className="text-sm text-red-500">{errors.classIds}</p>}
          </div>

          {/* Marks Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks *</Label>
              <Input
                id="totalMarks"
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) || 0 }))}
                min="1"
              />
              {errors.totalMarks && <p className="text-sm text-red-500">{errors.totalMarks}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingMarks">Passing Marks *</Label>
              <Input
                id="passingMarks"
                type="number"
                value={formData.passingMarks}
                onChange={(e) => setFormData(prev => ({ ...prev, passingMarks: parseInt(e.target.value) || 0 }))}
                min="1"
                max={formData.totalMarks}
              />
              {errors.passingMarks && <p className="text-sm text-red-500">{errors.passingMarks}</p>}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-4 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                min="1"
                disabled
              />
            </div>
          </div>

          {/* Status and Academic Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYear">Academic Year *</Label>
              <Input
                id="academicYear"
                value={formData.academicYear}
                onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
                placeholder="2024-2025"
              />
              {errors.academicYear && <p className="text-sm text-red-500">{errors.academicYear}</p>}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Special instructions for the exam..."
              rows={3}
            />
          </div>

          {/* Preview */}
          {formData.name && formData.subjectId && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Preview</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Exam:</strong> {formData.name}</p>
                <p><strong>Type:</strong> <Badge className={getTypeColor(formData.type)}>{formData.type}</Badge></p>
                <p><strong>Subject:</strong> {getSubjectName(formData.subjectId)}</p>
                {formData.teacherId && <p><strong>Teacher:</strong> {getTeacherName(formData.teacherId)}</p>}
                <p><strong>Classes:</strong> {formData.classIds.map(getClassName).join(', ')}</p>
                <p><strong>Marks:</strong> {formData.totalMarks} (Pass: {formData.passingMarks})</p>
                {formData.date && (
                  <p><strong>Date & Time:</strong> {new Date(formData.date).toLocaleDateString()} 
                  {formData.startTime && ` at ${formData.startTime}`}
                  {formData.endTime && ` - ${formData.endTime}`}
                  {formData.duration && ` (${formData.duration} mins)`}</p>
                )}
                <p><strong>Status:</strong> <Badge className={getStatusColor(formData.status)}>{formData.status}</Badge></p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (exam ? 'Update Exam' : 'Create Exam')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
