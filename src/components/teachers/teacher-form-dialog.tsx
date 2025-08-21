'use client';

import { Teacher } from '@/lib/database-services';
import { FormField, FormDialog } from '@/components/ui/form-dialog';
import { TeacherFormData, validateTeacherForm } from '@/lib/form-utils';
import { TeacherAccountService, CreateTeacherAccountData } from '@/lib/services/teacher-account-service';
import { useAuth } from '@/contexts/auth-context';

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
  const { user } = useAuth();
  const schoolId = user?.profile?.schoolId || '';

  const formFields: FormField[] = [
    // Authentication Section (only for new teachers)
    ...(isEditing ? [] : [
      {
        name: 'email',
        label: 'Login Email Address *',
        type: 'email' as const,
        required: true,
        placeholder: 'e.g., j.doe@stmarysschool.edu.ng'
      },
      {
        name: 'password',
        label: 'Initial Password *',
        type: 'text' as const, // Using text instead of password for now
        required: true,
        placeholder: 'Enter a secure password (min 8 characters)'
      }
    ]),
    // For editing, email is shown but cannot be changed
    ...(isEditing ? [{
      name: 'email',
      label: 'Email Address (Cannot be changed)',
      type: 'email' as const,
      required: true,
      placeholder: 'Email address'
    }] : []),
    {
      name: 'firstName',
      label: 'First Name *',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter first name'
    },
    {
      name: 'lastName',
      label: 'Last Name *',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter last name'
    },
    {
      name: 'phone',
      label: 'Phone Number *',
      type: 'tel' as const,
      required: true,
      placeholder: 'Enter phone number'
    },
    {
      name: 'dateOfBirth',
      label: 'Date of Birth *',
      type: 'date' as const,
      required: true
    },
    {
      name: 'gender',
      label: 'Gender *',
      type: 'select' as const,
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
      type: 'textarea' as const,
      placeholder: 'Enter home address'
    },
    {
      name: 'qualification',
      label: 'Highest Qualification *',
      type: 'text' as const,
      required: true,
      placeholder: 'e.g., B.Ed, M.Sc, Ph.D'
    },
    {
      name: 'experience',
      label: 'Years of Experience *',
      type: 'number' as const,
      required: true,
      placeholder: 'Enter years of experience'
    },
    {
      name: 'department',
      label: 'Department *',
      type: 'select' as const,
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
      label: 'Designation *',
      type: 'select' as const,
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
      name: 'joiningDate',
      label: 'Joining Date *',
      type: 'date' as const,
      required: true
    },
    {
      name: 'salary',
      label: 'Monthly Salary *',
      type: 'number' as const,
      required: true,
      placeholder: 'Enter monthly salary amount'
    },
    {
      name: 'emergencyContact',
      label: 'Emergency Contact Name *',
      type: 'text' as const,
      required: true,
      placeholder: 'Enter emergency contact name'
    },
    {
      name: 'emergencyPhone',
      label: 'Emergency Contact Phone *',
      type: 'tel' as const,
      required: true,
      placeholder: 'Enter emergency contact phone'
    },
    {
      name: 'bloodGroup',
      label: 'Blood Group',
      type: 'select' as const,
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
      name: 'bankAccount',
      label: 'Bank Account Number',
      type: 'text' as const,
      placeholder: 'Enter bank account number'
    },
    {
      name: 'panNumber',
      label: 'PAN Number',
      type: 'text' as const,
      placeholder: 'Enter PAN number'
    },
    {
      name: 'aadharNumber',
      label: 'Aadhar Number',
      type: 'text' as const,
      placeholder: 'Enter Aadhar number'
    }
  ];

  const handleSubmit = async (formData: Record<string, any>): Promise<boolean> => {
    try {
      if (isEditing) {
        // Update existing teacher (no Firebase Auth changes)
        const teacherData: Partial<Teacher> = {
          ...formData,
          dateOfBirth: new Date(formData.dateOfBirth),
          joiningDate: new Date(formData.joiningDate)
        };
        return await onSubmit(teacherData);
      } else {
        // Create new teacher account with Firebase Auth
        const createData: CreateTeacherAccountData = {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          dateOfBirth: new Date(formData.dateOfBirth),
          gender: formData.gender,
          address: formData.address || '',
          qualification: formData.qualification,
          experience: parseInt(formData.experience) || 0,
          department: formData.department,
          designation: formData.designation,
          joiningDate: new Date(formData.joiningDate),
          salary: parseFloat(formData.salary) || 0,
          emergencyContact: formData.emergencyContact,
          emergencyPhone: formData.emergencyPhone,
          bloodGroup: formData.bloodGroup,
          bankAccount: formData.bankAccount,
          panNumber: formData.panNumber,
          aadharNumber: formData.aadharNumber,
          schoolId: schoolId
        };

        // Use the new service to create complete teacher account
        const result = await TeacherAccountService.createTeacherAccount(createData);
        
        console.log('✅ Teacher account created:', result);
        
        // Return success (the service handles all creation logic)
        return true;
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      return false;
    }
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
    joiningDate: teacher.joiningDate.toISOString().split('T')[0],
    salary: teacher.salary,
    emergencyContact: teacher.emergencyContact,
    emergencyPhone: teacher.emergencyPhone,
    bloodGroup: teacher.bloodGroup,
    bankAccount: teacher.bankAccount,
    panNumber: teacher.panNumber,
    aadharNumber: teacher.aadharNumber
  } : {};

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Teacher' : 'Add New Teacher'}
      description={isEditing ? 'Update teacher information' : 'Create a new teacher account with login credentials'}
      fields={formFields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitText={isEditing ? 'Update Teacher' : 'Create Teacher Account'}
    />
  );
}
