'use client';

import { Student, Class } from '@/lib/database-services';
import { FormField, FormDialog } from '@/components/ui/form-dialog';
import { StudentFormData, validateStudentForm, generateStudentId } from '@/lib/form-utils';

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
  classes: Class[];
  existingStudents: Student[];
  onSubmit: (data: Partial<Student>) => Promise<boolean>;
}

export function StudentFormDialog({ 
  open, 
  onClose, 
  student, 
  classes, 
  existingStudents,
  onSubmit 
}: StudentFormDialogProps) {
  const isEditing = !!student;

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
      placeholder: 'Enter email address'
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'tel',
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
      name: 'parentName',
      label: 'Parent/Guardian Name',
      type: 'text',
      required: true,
      placeholder: 'Enter parent or guardian name'
    },
    {
      name: 'parentPhone',
      label: 'Parent/Guardian Phone',
      type: 'tel',
      required: true,
      placeholder: 'Enter parent or guardian phone'
    },
    {
      name: 'parentEmail',
      label: 'Parent/Guardian Email',
      type: 'email',
      placeholder: 'Enter parent or guardian email'
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
    },
    {
      name: 'classId',
      label: 'Class',
      type: 'select',
      required: true,
      options: classes.map(cls => ({
        label: cls.name,
        value: cls.id
      }))
    },
    {
      name: 'grade',
      label: 'Grade',
      type: 'select',
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
      type: 'select',
      required: true,
      options: [
        { label: 'Section A', value: 'A' },
        { label: 'Section B', value: 'B' },
        { label: 'Section C', value: 'C' },
        { label: 'Section D', value: 'D' }
      ]
    },
    {
      name: 'bloodGroup',
      label: 'Blood Group',
      type: 'select',
      options: [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' }
      ]
    },
    {
      name: 'religion',
      label: 'Religion',
      type: 'text',
      placeholder: 'Enter religion'
    },
    {
      name: 'nationality',
      label: 'Nationality',
      type: 'text',
      required: true,
      placeholder: 'Enter nationality'
    },
    {
      name: 'previousSchool',
      label: 'Previous School',
      type: 'text',
      placeholder: 'Enter previous school name'
    }
  ];

  const handleSubmit = async (formData: Record<string, any>): Promise<boolean> => {
    // Validate form data
    const errors = validateStudentForm(formData as StudentFormData);
    if (Object.keys(errors).length > 0) {
      return false;
    }

    // Prepare student data
    const studentData: Partial<Student> = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth),
      admissionDate: student?.admissionDate || new Date(),
      studentId: student?.studentId || generateStudentId(existingStudents),
      rollNumber: student?.rollNumber || existingStudents.length + 1,
      status: student?.status || 'active',
      feesPaid: student?.feesPaid || false,
      hostelResident: student?.hostelResident || false,
      transportRequired: student?.transportRequired || false,
      academicYear: '2024-2025' // This should come from school settings
    };

    return await onSubmit(studentData);
  };

  // Prepare initial data for editing
  const initialData = student ? {
    firstName: student.firstName,
    lastName: student.lastName,
    email: student.email,
    phone: student.phone,
    dateOfBirth: student.dateOfBirth.toISOString().split('T')[0],
    gender: student.gender,
    address: student.address,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    parentEmail: student.parentEmail,
    emergencyContact: student.emergencyContact,
    emergencyPhone: student.emergencyPhone,
    classId: student.classId,
    grade: student.grade,
    section: student.section,
    bloodGroup: student.bloodGroup,
    religion: student.religion,
    nationality: student.nationality,
    previousSchool: student.previousSchool
  } : {};

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Student' : 'Add New Student'}
      description={isEditing ? 'Update student information' : 'Enter student details to create a new record'}
      fields={formFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitText={isEditing ? 'Update Student' : 'Add Student'}
    />
  );
}
