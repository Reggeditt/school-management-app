'use client';

import { Teacher } from '@/lib/database-services';
import { FormField, FormDialog } from '@/components/ui/form-dialog';
import { TeacherFormData, validateTeacherForm, generateTeacherId } from '@/lib/form-utils';

interface TeacherFormDialogProps {
  open: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
  existingTeachers: Teacher[];
  onSubmit: (data: Partial<Teacher>) => Promise<boolean>;
}

export function TeacherFormDialog({ 
  open, 
  onClose, 
  teacher, 
  existingTeachers,
  onSubmit 
}: TeacherFormDialogProps) {
  const isEditing = !!teacher;

  const formFields: FormField[] = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter first name'
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter last name'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter email address'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
      required: true,
      placeholder: 'Enter phone number'
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
      ]
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter home address'
    },
    {
      name: 'qualification',
      label: 'Highest Qualification',
      type: 'text',
      required: true,
      placeholder: 'e.g., B.Ed, M.Sc, Ph.D'
    },
    {
      name: 'experience',
      label: 'Years of Experience',
      type: 'number',
      required: true,
      placeholder: 'Enter years of experience'
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: [
        { label: 'Mathematics', value: 'Mathematics' },
        { label: 'Science', value: 'Science' },
        { label: 'English', value: 'English' },
        { label: 'Social Studies', value: 'Social Studies' },
        { label: 'Computer Science', value: 'Computer Science' },
        { label: 'Arts', value: 'Arts' },
        { label: 'Physical Education', value: 'Physical Education' },
        { label: 'Languages', value: 'Languages' }
      ]
    },
    {
      name: 'designation',
      label: 'Designation',
      type: 'select',
      required: true,
      options: [
        { label: 'Head Teacher', value: 'Head Teacher' },
        { label: 'Senior Teacher', value: 'Senior Teacher' },
        { label: 'Subject Teacher', value: 'Subject Teacher' },
        { label: 'Assistant Teacher', value: 'Assistant Teacher' },
        { label: 'Substitute Teacher', value: 'Substitute Teacher' }
      ]
    },
    {
      name: 'salary',
      label: 'Monthly Salary',
      type: 'number',
      required: true,
      placeholder: 'Enter monthly salary amount'
    },
    {
      name: 'emergencyContact',
      label: 'Emergency Contact Name',
      type: 'text',
      placeholder: 'Enter emergency contact name'
    },
    {
      name: 'emergencyPhone',
      label: 'Emergency Contact Phone',
      type: 'tel',
      placeholder: 'Enter emergency contact phone'
    }
  ];

  const handleSubmit = async (formData: Record<string, any>): Promise<boolean> => {
    // Validate form data
    const errors = validateTeacherForm(formData as TeacherFormData);
    if (Object.keys(errors).length > 0) {
      return false;
    }

    // Prepare teacher data
    const teacherData: Partial<Teacher> = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
      joiningDate: teacher?.joiningDate || new Date(),
      teacherId: teacher?.teacherId || generateTeacherId(existingTeachers),
      status: teacher?.status || 'active',
      subjects: teacher?.subjects || [],
      classes: teacher?.classes || []
    };

    return await onSubmit(teacherData);
  };

  // Prepare initial data for editing
  const initialData = teacher ? {
    firstName: teacher.firstName,
    lastName: teacher.lastName,
    email: teacher.email,
    phone: teacher.phone,
    dateOfBirth: teacher.dateOfBirth.toISOString().split('T')[0],
    gender: teacher.gender,
    address: teacher.address,
    qualification: teacher.qualification,
    experience: teacher.experience,
    department: teacher.department,
    designation: teacher.designation,
    salary: teacher.salary,
    emergencyContact: teacher.emergencyContact,
    emergencyPhone: teacher.emergencyPhone
  } : {};

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Teacher' : 'Add New Teacher'}
      description={isEditing ? 'Update teacher information' : 'Enter teacher details to create a new record'}
      fields={formFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitText={isEditing ? 'Update Teacher' : 'Add Teacher'}
    />
  );
}
