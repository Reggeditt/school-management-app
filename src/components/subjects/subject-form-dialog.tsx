'use client';

import { useState, useEffect } from 'react';
import { Subject, Teacher, Class } from '@/lib/database-services';
import { FormDialog } from '@/components/ui/form-dialog';
import { SubjectFormData, validateSubjectForm, generateSubjectId } from '@/lib/form-utils';

interface SubjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  subject?: Subject | null;
  existingSubjects: Subject[];
  teachers: Teacher[];
  classes: Class[];
  onSubmit: (subjectData: Partial<Subject>) => Promise<boolean>;
}

export function SubjectFormDialog({
  open,
  onClose,
  subject: subjectToEdit,
  existingSubjects,
  teachers,
  classes,
  onSubmit
}: SubjectFormDialogProps) {
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    code: '',
    description: '',
    grade: '',
    type: 'core',
    credits: 1,
    totalMarks: 100,
    passingMarks: 35,
    teacherIds: [],
    classIds: [],
    syllabus: '',
    books: []
  });

  // Reset form when dialog opens/closes or subject changes
  useEffect(() => {
    if (open) {
      if (subjectToEdit) {
        setFormData({
          name: subjectToEdit.name,
          code: subjectToEdit.code,
          description: subjectToEdit.description || '',
          grade: subjectToEdit.grade,
          type: subjectToEdit.type,
          credits: subjectToEdit.credits,
          totalMarks: subjectToEdit.totalMarks,
          passingMarks: subjectToEdit.passingMarks,
          teacherIds: subjectToEdit.teacherIds,
          classIds: subjectToEdit.classIds,
          syllabus: subjectToEdit.syllabus || '',
          books: subjectToEdit.books || []
        });
      } else {
        setFormData({
          name: '',
          code: '',
          description: '',
          grade: '',
          type: 'core',
          credits: 1,
          totalMarks: 100,
          passingMarks: 35,
          teacherIds: [],
          classIds: [],
          syllabus: '',
          books: []
        });
      }
    }
  }, [open, subjectToEdit]);

  // Handle form submission
  const handleSubmit = async (): Promise<boolean> => {
    const subjectData: Partial<Subject> = {
      ...formData
    };

    return await onSubmit(subjectData);
  };

  // Form fields configuration
  const formFields = [
    {
      name: 'name',
      label: 'Subject Name',
      type: 'text' as const,
      placeholder: 'Enter subject name (e.g., Mathematics, English Literature)',
      required: true,
      value: formData.name,
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, name: value }))
    },
    {
      name: 'code',
      label: 'Subject Code',
      type: 'text' as const,
      placeholder: 'Enter subject code (e.g., MATH, ENG, SCI)',
      required: true,
      value: formData.code,
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, code: value.toUpperCase() }))
    },
    {
      name: 'grade',
      label: 'Grade/Standard',
      type: 'select' as const,
      placeholder: 'Select grade',
      required: true,
      value: formData.grade,
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, grade: value })),
      options: [
        { label: 'Pre-KG', value: 'pre-kg' },
        { label: 'LKG', value: 'lkg' },
        { label: 'UKG', value: 'ukg' },
        { label: 'Grade 1', value: 'grade-1' },
        { label: 'Grade 2', value: 'grade-2' },
        { label: 'Grade 3', value: 'grade-3' },
        { label: 'Grade 4', value: 'grade-4' },
        { label: 'Grade 5', value: 'grade-5' },
        { label: 'Grade 6', value: 'grade-6' },
        { label: 'Grade 7', value: 'grade-7' },
        { label: 'Grade 8', value: 'grade-8' },
        { label: 'Grade 9', value: 'grade-9' },
        { label: 'Grade 10', value: 'grade-10' },
        { label: 'Grade 11', value: 'grade-11' },
        { label: 'Grade 12', value: 'grade-12' }
      ]
    },
    {
      name: 'type',
      label: 'Subject Type',
      type: 'select' as const,
      placeholder: 'Select subject type',
      required: true,
      value: formData.type,
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, type: value as 'core' | 'elective' | 'language' | 'practical' })),
      options: [
        { label: 'Core Subject', value: 'core' },
        { label: 'Elective Subject', value: 'elective' },
        { label: 'Language', value: 'language' },
        { label: 'Practical/Lab', value: 'practical' }
      ]
    },
    {
      name: 'credits',
      label: 'Credits',
      type: 'number' as const,
      placeholder: 'Enter subject credits',
      required: true,
      value: formData.credits.toString(),
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, credits: parseInt(value) || 1 }))
    },
    {
      name: 'totalMarks',
      label: 'Total Marks',
      type: 'number' as const,
      placeholder: 'Enter total marks for the subject',
      required: true,
      value: formData.totalMarks.toString(),
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, totalMarks: parseInt(value) || 100 }))
    },
    {
      name: 'passingMarks',
      label: 'Passing Marks',
      type: 'number' as const,
      placeholder: 'Enter minimum marks to pass',
      required: true,
      value: formData.passingMarks.toString(),
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, passingMarks: parseInt(value) || 35 }))
    },
    {
      name: 'description',
      label: 'Description (Optional)',
      type: 'textarea' as const,
      placeholder: 'Enter subject description, objectives, or additional information...',
      required: false,
      value: formData.description,
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, description: value }))
    },
    {
      name: 'syllabus',
      label: 'Syllabus/Curriculum (Optional)',
      type: 'textarea' as const,
      placeholder: 'Enter syllabus outline, topics covered, or curriculum details...',
      required: false,
      value: formData.syllabus,
      onChange: (value: string) => setFormData((prev: SubjectFormData) => ({ ...prev, syllabus: value }))
    }
  ];

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
      description={subjectToEdit ? 'Update subject information and settings.' : 'Create a new subject with grading configuration and teacher assignment.'}
      fields={formFields}
      onSubmit={handleSubmit}
      submitText={subjectToEdit ? 'Update Subject' : 'Add Subject'}
    />
  );
}
