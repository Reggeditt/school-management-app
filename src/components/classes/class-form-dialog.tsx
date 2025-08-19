'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Class, Student, Teacher } from '@/lib/database-services';
import { FormDialog } from '@/components/ui/form-dialog';
import { ClassFormData, validateClassForm, generateClassId } from '@/lib/form-utils';

interface ClassFormDialogProps {
  open: boolean;
  onClose: () => void;
  class?: Class | null;
  existingClasses: Class[];
  students: Student[];
  teachers: Teacher[];
  onSubmit: (classData: Partial<Class>) => Promise<boolean>;
}

export function ClassFormDialog({
  open,
  onClose,
  class: classToEdit,
  existingClasses,
  students,
  teachers,
  onSubmit
}: ClassFormDialogProps) {
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    section: '',
    grade: '',
    academicYear: new Date().getFullYear().toString(),
    classTeacherId: '',
    subjects: [],
    students: [],
    schedule: {},
    maxCapacity: 30,
    roomNumber: '',
    description: ''
  });

  // Reset form when dialog opens/closes or class changes
  useEffect(() => {
    if (open) {
      if (classToEdit) {
        setFormData({
          name: classToEdit.name,
          section: classToEdit.section,
          grade: classToEdit.grade,
          academicYear: classToEdit.academicYear,
          classTeacherId: classToEdit.classTeacherId,
          subjects: classToEdit.subjects,
          students: classToEdit.students,
          schedule: classToEdit.schedule,
          maxCapacity: classToEdit.maxCapacity,
          roomNumber: classToEdit.roomNumber,
          description: ''
        });
      } else {
        setFormData({
          name: '',
          section: '',
          grade: '',
          academicYear: new Date().getFullYear().toString(),
          classTeacherId: '',
          subjects: [],
          students: [],
          schedule: {},
          maxCapacity: 30,
          roomNumber: '',
          description: ''
        });
      }
    }
  }, [open, classToEdit]);

  // Handle form submission
  const handleSubmit = useCallback(async (data: Record<string, any>): Promise<boolean> => {
    const classData: Partial<Class> = {
      name: data.name,
      section: data.section,
      grade: data.grade,
      academicYear: data.academicYear,
      classTeacherId: data.classTeacherId,
      roomNumber: data.roomNumber,
      maxCapacity: parseInt(data.maxCapacity) || 30,
      subjects: classToEdit?.subjects || [],
      students: classToEdit?.students || [],
      schedule: classToEdit?.schedule || {},
      currentStrength: classToEdit?.currentStrength || 0
    };

    return await onSubmit(classData);
  }, [classToEdit, onSubmit]);

  // Memoize form fields to prevent infinite loops
  const formFields = useMemo(() => [
    {
      name: 'name',
      label: 'Class Name',
      type: 'text' as const,
      placeholder: 'Enter class name (e.g., Grade 1A, Class 10 Science)',
      required: true
    },
    {
      name: 'grade',
      label: 'Grade/Level',
      type: 'select' as const,
      placeholder: 'Select grade level',
      required: true,
      options: [
        { label: 'Grade 7', value: '7' },
        { label: 'Grade 8', value: '8' },
        { label: 'Grade 9', value: '9' },
        { label: 'Grade 10', value: '10' },
        { label: 'Grade 11', value: '11' },
        { label: 'Grade 12', value: '12' }
      ]
    },
    {
      name: 'section',
      label: 'Section',
      type: 'select' as const,
      placeholder: 'Select section',
      required: true,
      options: [
        { label: 'Section A', value: 'A' },
        { label: 'Section B', value: 'B' },
        { label: 'Section C', value: 'C' },
        { label: 'Section D', value: 'D' },
        { label: 'Section E', value: 'E' }
      ]
    },
    {
      name: 'academicYear',
      label: 'Academic Year',
      type: 'select' as const,
      placeholder: 'Select academic year',
      required: true,
      options: [
        { label: '2023-24', value: '2023' },
        { label: '2024-25', value: '2024' },
        { label: '2025-26', value: '2025' },
        { label: '2026-27', value: '2026' }
      ]
    },
    {
      name: 'classTeacherId',
      label: 'Class Teacher',
      type: 'select' as const,
      placeholder: 'Select class teacher',
      required: true,
      options: teachers.map(teacher => ({
        label: `${teacher.firstName} ${teacher.lastName} (${teacher.department})`,
        value: teacher.id
      }))
    },
    {
      name: 'roomNumber',
      label: 'Classroom/Room Number',
      type: 'text' as const,
      placeholder: 'Enter room number (e.g., Room 101, Lab A)',
      required: true
    },
    {
      name: 'maxCapacity',
      label: 'Class Capacity',
      type: 'number' as const,
      placeholder: 'Enter maximum students capacity',
      required: true
    },
    {
      name: 'description',
      label: 'Description (Optional)',
      type: 'textarea' as const,
      placeholder: 'Enter additional class information...',
      required: false
    }
  ], [teachers]);

  // Create initial data object
  const initialData = useMemo(() => ({
    name: formData.name,
    grade: formData.grade,
    section: formData.section,
    academicYear: formData.academicYear,
    classTeacherId: formData.classTeacherId,
    roomNumber: formData.roomNumber,
    maxCapacity: formData.maxCapacity.toString(),
    description: formData.description
  }), [formData]);

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={classToEdit ? 'Edit Class' : 'Add New Class'}
      description={classToEdit ? 'Update class information and settings.' : 'Create a new class with teacher assignment and capacity settings.'}
      fields={formFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitText={classToEdit ? 'Update Class' : 'Add Class'}
    />
  );
}
