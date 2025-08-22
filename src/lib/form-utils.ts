import { Student, Teacher, Class, GuardianInfo } from '@/lib/database-services';
import { 
  generateStudentId as generateNewStudentId, 
  generateTeacherId as generateNewTeacherId 
} from '@/lib/id-generator';

// Student form validation
export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  guardians: GuardianInfo[];
  classId: string;
  grade: string;
  section: string;
  bloodGroup: string;
  religion: string;
  nationality: string;
  previousSchool?: string;
}

export interface StudentFormErrors {
  [key: string]: string;
}

export const validateStudentForm = (data: Partial<StudentFormData>): StudentFormErrors => {
  const errors: StudentFormErrors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }

  if (!data.guardians || data.guardians.length === 0) {
    errors.guardians = 'At least one guardian is required';
  } else {
    // Validate each guardian
    data.guardians.forEach((guardian, index) => {
      if (!guardian.name?.trim()) {
        errors[`guardian_${index}_name`] = `Guardian ${index + 1} name is required`;
      }
      if (!guardian.phone?.trim()) {
        errors[`guardian_${index}_phone`] = `Guardian ${index + 1} phone is required`;
      }
      if (!guardian.relationship) {
        errors[`guardian_${index}_relationship`] = `Guardian ${index + 1} relationship is required`;
      }
    });

    // Ensure at least one primary guardian exists
    const hasPrimaryGuardian = data.guardians.some(g => g.isPrimary);
    if (!hasPrimaryGuardian) {
      errors.primaryGuardian = 'At least one guardian must be marked as primary';
    }
  }

  if (!data.classId) {
    errors.classId = 'Class selection is required';
  }

  if (!data.grade) {
    errors.grade = 'Grade is required';
  }

  if (!data.section) {
    errors.section = 'Section is required';
  }

  if (!data.nationality?.trim()) {
    errors.nationality = 'Nationality is required';
  }

  return errors;
};

// Teacher form validation
export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  qualification: string;
  experience: number;
  department: string;
  subjects: string[];
  designation: string;
  salary: number;
  emergencyContact: string;
  emergencyPhone: string;
}

export const validateTeacherForm = (data: Partial<TeacherFormData>): StudentFormErrors => {
  const errors: StudentFormErrors = {};

  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  }

  if (!data.qualification?.trim()) {
    errors.qualification = 'Qualification is required';
  }

  if (!data.department?.trim()) {
    errors.department = 'Department is required';
  }

  if (!data.designation?.trim()) {
    errors.designation = 'Designation is required';
  }

  if (!data.salary || data.salary <= 0) {
    errors.salary = 'Please enter a valid salary amount';
  }

  return errors;
};

// Utility functions
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1;
  }
  return age;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    case 'graduated': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    case 'transferred': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    case 'on_leave': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
  }
};

export const generateStudentId = (existingStudents: Student[]): string => {
  const existingIds = existingStudents.map(s => s.studentId);
  return generateNewStudentId(existingIds);
};

export const generateTeacherId = (existingTeachers: Teacher[]): string => {
  const existingIds = existingTeachers.map(t => t.teacherId);
  return generateNewTeacherId(existingIds);
};

// Class form validation
export interface ClassFormData {
  name: string;
  section: string;
  grade: string;
  academicYear: string;
  classTeacherId: string;
  subjects: string[];
  students: string[];
  schedule: Record<string, any>;
  maxCapacity: number;
  roomNumber: string;
  description?: string;
}

export const validateClassForm = (data: Partial<ClassFormData>, existingClasses: Class[], editingClassId?: string): StudentFormErrors => {
  const errors: StudentFormErrors = {};

  if (!data.name?.trim()) {
    errors.name = 'Class name is required';
  }

  if (!data.grade?.trim()) {
    errors.grade = 'Grade is required';
  }

  if (!data.section?.trim()) {
    errors.section = 'Section is required';
  }

  if (!data.academicYear?.trim()) {
    errors.academicYear = 'Academic year is required';
  }

  if (!data.classTeacherId?.trim()) {
    errors.classTeacherId = 'Class teacher is required';
  }

  if (!data.roomNumber?.trim()) {
    errors.roomNumber = 'Room number is required';
  }

  if (!data.maxCapacity || data.maxCapacity <= 0) {
    errors.maxCapacity = 'Please enter a valid capacity';
  }

  // Check for duplicate class (grade + section + academic year)
  const duplicate = existingClasses.find(cls => 
    cls.grade === data.grade && 
    cls.section === data.section && 
    cls.academicYear === data.academicYear &&
    cls.id !== editingClassId
  );

  if (duplicate) {
    errors.section = `Class ${data.grade}${data.section} already exists for academic year ${data.academicYear}`;
  }

  return errors;
};

export const generateClassId = (grade: string, section: string): string => {
  return `CLS${grade}${section}${new Date().getFullYear()}`;
};

// Subject form validation
export interface SubjectFormData {
  name: string;
  code: string;
  description?: string;
  grade: string;
  type: 'core' | 'elective' | 'language' | 'practical';
  credits: number;
  totalMarks: number;
  passingMarks: number;
  teacherIds: string[];
  classIds: string[];
  syllabus?: string;
  books?: string[];
}

export const validateSubjectForm = (data: Partial<SubjectFormData>, existingSubjects: any[], editingSubjectId?: string): StudentFormErrors => {
  const errors: StudentFormErrors = {};

  if (!data.name?.trim()) {
    errors.name = 'Subject name is required';
  }

  if (!data.code?.trim()) {
    errors.code = 'Subject code is required';
  } else if (!/^[A-Z]{2,6}$/.test(data.code)) {
    errors.code = 'Subject code must be 2-6 uppercase letters (e.g., MATH, ENG)';
  }

  if (!data.grade?.trim()) {
    errors.grade = 'Grade is required';
  }

  if (!data.type) {
    errors.type = 'Subject type is required';
  }

  if (!data.credits || data.credits <= 0) {
    errors.credits = 'Please enter valid credits (greater than 0)';
  }

  if (!data.totalMarks || data.totalMarks <= 0) {
    errors.totalMarks = 'Please enter valid total marks (greater than 0)';
  }

  if (!data.passingMarks || data.passingMarks <= 0) {
    errors.passingMarks = 'Please enter valid passing marks (greater than 0)';
  }

  if (data.passingMarks && data.totalMarks && data.passingMarks >= data.totalMarks) {
    errors.passingMarks = 'Passing marks must be less than total marks';
  }

  // Check for duplicate subject code in the same grade
  const duplicate = existingSubjects.find(sub => 
    sub.code === data.code && 
    sub.grade === data.grade &&
    sub.id !== editingSubjectId
  );

  if (duplicate) {
    errors.code = `Subject code ${data.code} already exists for grade ${data.grade}`;
  }

  return errors;
};

export const generateSubjectId = (existingSubjects: any[]): string => {
  const count = existingSubjects.length + 1;
  return `SUB${count.toString().padStart(4, '0')}`;
};

// Attendance Form Data Interface
export interface AttendanceFormData {
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  remarks?: string;
  period?: number;
  subject?: string;
}

export const validateAttendanceForm = (data: Partial<AttendanceFormData>): StudentFormErrors => {
  const errors: StudentFormErrors = {};

  if (!data.studentId?.trim()) {
    errors.studentId = 'Student is required';
  }

  if (!data.classId?.trim()) {
    errors.classId = 'Class is required';
  }

  if (!data.date?.trim()) {
    errors.date = 'Date is required';
  }

  if (!data.status) {
    errors.status = 'Attendance status is required';
  }

  // Validate time format if provided
  if (data.checkInTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.checkInTime)) {
    errors.checkInTime = 'Check-in time must be in HH:MM format';
  }

  if (data.checkOutTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.checkOutTime)) {
    errors.checkOutTime = 'Check-out time must be in HH:MM format';
  }

  // Validate period number if provided
  if (data.period && (data.period < 1 || data.period > 8)) {
    errors.period = 'Period must be between 1 and 8';
  }

  return errors;
};

export const generateAttendanceId = (existingAttendance: any[]): string => {
  const count = existingAttendance.length + 1;
  return `ATT${count.toString().padStart(6, '0')}`;
};

// Exam Form Data Interface
export interface ExamFormData {
  name: string;
  type: 'midterm' | 'final' | 'monthly' | 'weekly' | 'surprise';
  description?: string;
  classIds: string[];
  subjectId: string;
  teacherId: string;
  totalMarks: number;
  passingMarks: number;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  instructions?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  academicYear: string;
}

export const validateExamForm = (data: Partial<ExamFormData>): StudentFormErrors => {
  const errors: StudentFormErrors = {};

  if (!data.name?.trim()) {
    errors.name = 'Exam name is required';
  }

  if (!data.type) {
    errors.type = 'Exam type is required';
  }

  if (!data.classIds || data.classIds.length === 0) {
    errors.classIds = 'At least one class must be selected';
  }

  if (!data.subjectId?.trim()) {
    errors.subjectId = 'Subject is required';
  }

  if (!data.teacherId?.trim()) {
    errors.teacherId = 'Teacher is required';
  }

  if (!data.totalMarks || data.totalMarks <= 0) {
    errors.totalMarks = 'Total marks must be greater than 0';
  }

  if (!data.passingMarks || data.passingMarks <= 0) {
    errors.passingMarks = 'Passing marks must be greater than 0';
  }

  if (data.totalMarks && data.passingMarks && data.passingMarks > data.totalMarks) {
    errors.passingMarks = 'Passing marks cannot exceed total marks';
  }

  if (!data.date?.trim()) {
    errors.date = 'Exam date is required';
  }

  if (!data.startTime?.trim()) {
    errors.startTime = 'Start time is required';
  }

  if (!data.endTime?.trim()) {
    errors.endTime = 'End time is required';
  }

  // Validate time format
  if (data.startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.startTime)) {
    errors.startTime = 'Start time must be in HH:MM format';
  }

  if (data.endTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.endTime)) {
    errors.endTime = 'End time must be in HH:MM format';
  }

  // Validate that end time is after start time
  if (data.startTime && data.endTime) {
    const start = new Date(`2000-01-01T${data.startTime}:00`);
    const end = new Date(`2000-01-01T${data.endTime}:00`);
    if (end <= start) {
      errors.endTime = 'End time must be after start time';
    }
  }

  if (!data.duration || data.duration <= 0) {
    errors.duration = 'Duration must be greater than 0 minutes';
  }

  if (!data.academicYear?.trim()) {
    errors.academicYear = 'Academic year is required';
  }

  return errors;
};

export const generateExamId = (existingExams: any[]): string => {
  const count = existingExams.length + 1;
  return `EXM${count.toString().padStart(4, '0')}`;
};

// School Settings Form Data Interface
export interface SchoolSettingsFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  establishedYear: number;
  principalName: string;
}

export const validateSchoolSettingsForm = (data: Partial<SchoolSettingsFormData>) => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = 'School name is required';
  }

  if (!data.address?.trim()) {
    errors.address = 'School address is required';
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (data.website && !/^https?:\/\/.+\..+/.test(data.website)) {
    errors.website = 'Please enter a valid website URL';
  }

  if (!data.establishedYear || data.establishedYear < 1800 || data.establishedYear > new Date().getFullYear()) {
    errors.establishedYear = 'Please enter a valid establishment year';
  }

  if (!data.principalName?.trim()) {
    errors.principalName = 'Principal name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// User Preferences Interface
export interface UserPreferencesFormData {
  emailNotifications: {
    attendance: boolean;
    exams: boolean;
    fees: boolean;
    events: boolean;
  };
  smsNotifications: {
    emergency: boolean;
    attendance: boolean;
    fees: boolean;
  };
  academicSettings: {
    currentYear: string;
    gradeRanges: {
      A: string;
      B: string;
      C: string;
      D: string;
      F: string;
    };
  };
  securitySettings: {
    passwordExpiry: boolean;
    passwordExpiryDays: number;
    twoFactorAuth: {
      admin: boolean;
      teachers: boolean;
      parents: boolean;
    };
  };
}

export const validateUserPreferencesForm = (data: Partial<UserPreferencesFormData>) => {
  const errors: Record<string, string> = {};

  // Basic validation - most preferences are optional or have default values
  if (data.academicSettings?.currentYear && !data.academicSettings.currentYear.trim()) {
    errors.currentYear = 'Academic year cannot be empty if provided';
  }

  if (data.securitySettings?.passwordExpiryDays && data.securitySettings.passwordExpiryDays < 1) {
    errors.passwordExpiryDays = 'Password expiry days must be at least 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
