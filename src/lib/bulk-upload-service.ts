'use client';

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Student, GuardianInfo, Class } from './database-services';
import { generateStudentId } from './form-utils';

// Bulk upload interfaces
export interface BulkUploadError {
  row: number;
  field: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}

export interface BulkUploadResult {
  success: boolean;
  processedCount: number;
  errorCount: number;
  warningCount: number;
  errors: BulkUploadError[];
  validData: Partial<Student>[];
  rawData: any[];
}

export interface StudentBulkData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  classId: string;
  grade: string;
  section: string;
  bloodGroup?: string;
  religion?: string;
  nationality: string;
  previousSchool?: string;
  // Guardian fields (up to 3 guardians)
  guardian1Name?: string;
  guardian1Relationship?: string;
  guardian1Phone?: string;
  guardian1Email?: string;
  guardian1Occupation?: string;
  guardian1Workplace?: string;
  guardian1IsPrimary?: string;
  guardian1IsEmergencyContact?: string;
  guardian1CanPickup?: string;
  guardian1HasFinancialResponsibility?: string;
  guardian2Name?: string;
  guardian2Relationship?: string;
  guardian2Phone?: string;
  guardian2Email?: string;
  guardian2Occupation?: string;
  guardian2Workplace?: string;
  guardian2IsPrimary?: string;
  guardian2IsEmergencyContact?: string;
  guardian2CanPickup?: string;
  guardian2HasFinancialResponsibility?: string;
  guardian3Name?: string;
  guardian3Relationship?: string;
  guardian3Phone?: string;
  guardian3Email?: string;
  guardian3Occupation?: string;
  guardian3Workplace?: string;
  guardian3IsPrimary?: string;
  guardian3IsEmergencyContact?: string;
  guardian3CanPickup?: string;
  guardian3HasFinancialResponsibility?: string;
}

// Template generation
export function generateStudentTemplate(): StudentBulkData[] {
  return [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+2348012345678',
      dateOfBirth: '2010-06-15',
      gender: 'male',
      address: '123 Main Street, Lagos, Nigeria',
      classId: '', // Will be populated with actual class IDs
      grade: '8',
      section: 'A',
      bloodGroup: 'O+',
      religion: 'Christianity',
      nationality: 'Nigerian',
      previousSchool: 'ABC Primary School',
      guardian1Name: 'Jane Doe',
      guardian1Relationship: 'mother',
      guardian1Phone: '+2348023456789',
      guardian1Email: 'jane.doe@example.com',
      guardian1Occupation: 'Teacher',
      guardian1Workplace: 'XYZ School',
      guardian1IsPrimary: 'true',
      guardian1IsEmergencyContact: 'true',
      guardian1CanPickup: 'true',
      guardian1HasFinancialResponsibility: 'true',
      guardian2Name: 'Robert Doe',
      guardian2Relationship: 'father',
      guardian2Phone: '+2348034567890',
      guardian2Email: 'robert.doe@example.com',
      guardian2Occupation: 'Engineer',
      guardian2Workplace: 'Tech Corp',
      guardian2IsPrimary: 'false',
      guardian2IsEmergencyContact: 'true',
      guardian2CanPickup: 'true',
      guardian2HasFinancialResponsibility: 'false',
    }
  ];
}

// Field mapping and validation rules
export const STUDENT_FIELD_MAPPING = {
  firstName: { required: true, type: 'string', label: 'First Name' },
  lastName: { required: true, type: 'string', label: 'Last Name' },
  email: { required: false, type: 'email', label: 'Email' },
  phone: { required: false, type: 'phone', label: 'Phone' },
  dateOfBirth: { required: true, type: 'date', label: 'Date of Birth' },
  gender: { required: true, type: 'enum', values: ['male', 'female', 'other'], label: 'Gender' },
  address: { required: false, type: 'string', label: 'Address' },
  classId: { required: true, type: 'string', label: 'Class ID' },
  grade: { required: true, type: 'enum', values: ['7', '8', '9', '10', '11', '12'], label: 'Grade' },
  section: { required: true, type: 'enum', values: ['A', 'B', 'C', 'D'], label: 'Section' },
  bloodGroup: { required: false, type: 'enum', values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], label: 'Blood Group' },
  religion: { required: false, type: 'string', label: 'Religion' },
  nationality: { required: true, type: 'string', label: 'Nationality' },
  previousSchool: { required: false, type: 'string', label: 'Previous School' },
};

export const GUARDIAN_FIELD_MAPPING = {
  name: { required: true, type: 'string', label: 'Name' },
  relationship: { required: true, type: 'enum', values: ['father', 'mother', 'guardian', 'grandparent', 'uncle', 'aunt', 'sibling', 'other'], label: 'Relationship' },
  phone: { required: true, type: 'phone', label: 'Phone' },
  email: { required: false, type: 'email', label: 'Email' },
  occupation: { required: false, type: 'string', label: 'Occupation' },
  workplace: { required: false, type: 'string', label: 'Workplace' },
  isPrimary: { required: false, type: 'boolean', label: 'Is Primary' },
  isEmergencyContact: { required: false, type: 'boolean', label: 'Is Emergency Contact' },
  canPickup: { required: false, type: 'boolean', label: 'Can Pickup' },
  hasFinancialResponsibility: { required: false, type: 'boolean', label: 'Has Financial Responsibility' },
};

// File parsing functions
export async function parseExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Convert to objects using first row as headers
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const result = rows.map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}

export async function parseCSVFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      }
    });
  });
}

// Validation functions
function validateField(value: any, fieldConfig: any, fieldName: string, rowIndex: number): BulkUploadError[] {
  const errors: BulkUploadError[] = [];
  
  // Check required fields
  if (fieldConfig.required && (!value || value.toString().trim() === '')) {
    errors.push({
      row: rowIndex,
      field: fieldName,
      value,
      message: `${fieldConfig.label} is required`,
      severity: 'error'
    });
    return errors;
  }
  
  // Skip validation if field is empty and not required
  if (!value || value.toString().trim() === '') {
    return errors;
  }
  
  const stringValue = value.toString().trim();
  
  // Type-specific validation
  switch (fieldConfig.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(stringValue)) {
        errors.push({
          row: rowIndex,
          field: fieldName,
          value,
          message: `${fieldConfig.label} must be a valid email address`,
          severity: 'error'
        });
      }
      break;
      
    case 'phone':
      const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
      if (!phoneRegex.test(stringValue) || stringValue.length < 10) {
        errors.push({
          row: rowIndex,
          field: fieldName,
          value,
          message: `${fieldConfig.label} must be a valid phone number`,
          severity: 'error'
        });
      }
      break;
      
    case 'date':
      const date = new Date(stringValue);
      if (isNaN(date.getTime())) {
        errors.push({
          row: rowIndex,
          field: fieldName,
          value,
          message: `${fieldConfig.label} must be a valid date (YYYY-MM-DD)`,
          severity: 'error'
        });
      }
      break;
      
    case 'enum':
      if (!fieldConfig.values.includes(stringValue.toLowerCase())) {
        errors.push({
          row: rowIndex,
          field: fieldName,
          value,
          message: `${fieldConfig.label} must be one of: ${fieldConfig.values.join(', ')}`,
          severity: 'error'
        });
      }
      break;
      
    case 'boolean':
      if (!['true', 'false', '1', '0', 'yes', 'no'].includes(stringValue.toLowerCase())) {
        errors.push({
          row: rowIndex,
          field: fieldName,
          value,
          message: `${fieldConfig.label} must be true/false, yes/no, or 1/0`,
          severity: 'error'
        });
      }
      break;
  }
  
  return errors;
}

function parseGuardiansFromRow(row: any, rowIndex: number): { guardians: GuardianInfo[], errors: BulkUploadError[] } {
  const guardians: GuardianInfo[] = [];
  const errors: BulkUploadError[] = [];
  
  for (let i = 1; i <= 3; i++) {
    const guardianData = {
      name: row[`guardian${i}Name`],
      relationship: row[`guardian${i}Relationship`],
      phone: row[`guardian${i}Phone`],
      email: row[`guardian${i}Email`],
      occupation: row[`guardian${i}Occupation`],
      workplace: row[`guardian${i}Workplace`],
      isPrimary: row[`guardian${i}IsPrimary`],
      isEmergencyContact: row[`guardian${i}IsEmergencyContact`],
      canPickup: row[`guardian${i}CanPickup`],
      hasFinancialResponsibility: row[`guardian${i}HasFinancialResponsibility`],
    };
    
    // Check if guardian has any data
    const hasGuardianData = Object.values(guardianData).some(value => value && value.toString().trim() !== '');
    
    if (hasGuardianData) {
      // Validate guardian fields
      Object.entries(GUARDIAN_FIELD_MAPPING).forEach(([field, config]) => {
        const value = guardianData[field as keyof typeof guardianData];
        const fieldErrors = validateField(value, config, `guardian${i}${field.charAt(0).toUpperCase() + field.slice(1)}`, rowIndex);
        errors.push(...fieldErrors);
      });
      
      if (errors.filter(e => e.field.startsWith(`guardian${i}`) && e.severity === 'error').length === 0) {
        guardians.push({
          name: guardianData.name?.toString().trim() || '',
          relationship: guardianData.relationship?.toString().toLowerCase() || 'guardian',
          phone: guardianData.phone?.toString().trim() || '',
          email: guardianData.email?.toString().trim() || '',
          occupation: guardianData.occupation?.toString().trim() || '',
          workplace: guardianData.workplace?.toString().trim() || '',
          isPrimary: ['true', '1', 'yes'].includes(guardianData.isPrimary?.toString().toLowerCase() || 'false'),
          isEmergencyContact: ['true', '1', 'yes'].includes(guardianData.isEmergencyContact?.toString().toLowerCase() || 'true'),
          canPickup: ['true', '1', 'yes'].includes(guardianData.canPickup?.toString().toLowerCase() || 'true'),
          hasFinancialResponsibility: ['true', '1', 'yes'].includes(guardianData.hasFinancialResponsibility?.toString().toLowerCase() || 'false'),
        });
      }
    }
  }
  
  // Ensure at least one guardian exists
  if (guardians.length === 0) {
    errors.push({
      row: rowIndex,
      field: 'guardian1Name',
      value: '',
      message: 'At least one guardian is required',
      severity: 'error'
    });
  }
  
  // Ensure only one primary guardian
  const primaryGuardians = guardians.filter(g => g.isPrimary);
  if (primaryGuardians.length === 0 && guardians.length > 0) {
    guardians[0].isPrimary = true;
  } else if (primaryGuardians.length > 1) {
    errors.push({
      row: rowIndex,
      field: 'guardians',
      value: '',
      message: 'Only one guardian can be marked as primary',
      severity: 'warning'
    });
    // Fix by keeping first primary and unmarking others
    let foundFirst = false;
    guardians.forEach(g => {
      if (g.isPrimary && foundFirst) {
        g.isPrimary = false;
      } else if (g.isPrimary) {
        foundFirst = true;
      }
    });
  }
  
  return { guardians, errors };
}

// Main validation function
export function validateBulkData(rawData: any[], existingStudents: Student[], classes: Class[]): BulkUploadResult {
  const errors: BulkUploadError[] = [];
  const validData: Partial<Student>[] = [];
  let processedCount = 0;
  
  const classIds = classes.map(c => c.id);
  const classNames = classes.map(c => c.name.toLowerCase());
  
  rawData.forEach((row, index) => {
    const rowIndex = index + 2; // +2 because Excel rows start at 1 and we skip header
    processedCount++;
    
    // Validate basic student fields
    Object.entries(STUDENT_FIELD_MAPPING).forEach(([field, config]) => {
      const value = row[field];
      const fieldErrors = validateField(value, config, field, rowIndex);
      errors.push(...fieldErrors);
    });
    
    // Validate class ID (allow both ID and name)
    const classValue = row.classId?.toString().trim();
    if (classValue && !classIds.includes(classValue) && !classNames.includes(classValue.toLowerCase())) {
      errors.push({
        row: rowIndex,
        field: 'classId',
        value: classValue,
        message: `Class '${classValue}' not found. Use class ID or name.`,
        severity: 'error'
      });
    }
    
    // Parse and validate guardians
    const { guardians, errors: guardianErrors } = parseGuardiansFromRow(row, rowIndex);
    errors.push(...guardianErrors);
    
    // Check for duplicate student IDs or emails
    const email = row.email?.toString().trim();
    if (email && existingStudents.some(s => s.email?.toLowerCase() === email.toLowerCase())) {
      errors.push({
        row: rowIndex,
        field: 'email',
        value: email,
        message: `Email '${email}' already exists`,
        severity: 'warning'
      });
    }
    
    // If no critical errors for this row, prepare student data
    const rowErrors = errors.filter(e => e.row === rowIndex && e.severity === 'error');
    if (rowErrors.length === 0) {
      // Find actual class ID if class name was provided
      let actualClassId = row.classId?.toString().trim();
      const matchingClass = classes.find(c => 
        c.id === actualClassId || c.name.toLowerCase() === actualClassId?.toLowerCase()
      );
      if (matchingClass) {
        actualClassId = matchingClass.id;
      }
      
      const studentData: Partial<Student> = {
        firstName: row.firstName?.toString().trim(),
        lastName: row.lastName?.toString().trim(),
        email: row.email?.toString().trim() || '',
        phone: row.phone?.toString().trim() || '',
        dateOfBirth: new Date(row.dateOfBirth),
        gender: row.gender?.toString().toLowerCase() as 'male' | 'female' | 'other',
        address: row.address?.toString().trim() || '',
        classId: actualClassId,
        grade: row.grade?.toString().trim(),
        section: row.section?.toString().trim(),
        bloodGroup: row.bloodGroup?.toString().trim() || '',
        religion: row.religion?.toString().trim() || '',
        nationality: row.nationality?.toString().trim(),
        previousSchool: row.previousSchool?.toString().trim() || '',
        guardians: guardians,
        admissionDate: new Date(),
        studentId: generateStudentId(existingStudents),
        rollNumber: existingStudents.length + validData.length + 1,
        status: 'active',
        feesPaid: false,
        hostelResident: false,
        transportRequired: false,
        academicYear: '2024-2025'
      };
      
      validData.push(studentData);
    }
  });
  
  const errorCount = errors.filter(e => e.severity === 'error').length;
  const warningCount = errors.filter(e => e.severity === 'warning').length;
  
  return {
    success: errorCount === 0,
    processedCount,
    errorCount,
    warningCount,
    errors,
    validData,
    rawData
  };
}

// Export functions
export function exportStudentTemplate(classes: Class[]): void {
  const template = generateStudentTemplate();
  
  // Add class information as comments
  const classInfo = classes.map(c => ({
    'Class ID': c.id,
    'Class Name': c.name,
    'Grade': c.grade,
    'Section': c.section
  }));
  
  const wb = XLSX.utils.book_new();
  
  // Student template sheet
  const wsTemplate = XLSX.utils.json_to_sheet(template);
  XLSX.utils.book_append_sheet(wb, wsTemplate, 'Student Template');
  
  // Class reference sheet
  const wsClasses = XLSX.utils.json_to_sheet(classInfo);
  XLSX.utils.book_append_sheet(wb, wsClasses, 'Class Reference');
  
  // Download file
  XLSX.writeFile(wb, 'student_bulk_upload_template.xlsx');
}

export function exportValidationErrors(errors: BulkUploadError[]): void {
  const errorData = errors.map(error => ({
    'Row': error.row,
    'Field': error.field,
    'Value': error.value,
    'Error Type': error.severity,
    'Message': error.message
  }));
  
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(errorData);
  XLSX.utils.book_append_sheet(wb, ws, 'Validation Errors');
  
  XLSX.writeFile(wb, 'bulk_upload_validation_errors.xlsx');
}
