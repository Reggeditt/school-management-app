'use client';

import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Student, Class, Teacher } from './database-services';

// Export interfaces
export interface ExportOptions {
  format: 'csv' | 'excel';
  includeGuardians?: boolean;
  includeStats?: boolean;
  filename?: string;
}

export interface StudentExportData {
  // Basic Information
  'Student ID': string;
  'First Name': string;
  'Last Name': string;
  'Email': string;
  'Phone': string;
  'Date of Birth': string;
  'Age': number;
  'Gender': string;
  'Address': string;
  
  // Academic Information
  'Class': string;
  'Grade': string;
  'Section': string;
  'Roll Number': number;
  'Academic Year': string;
  'Status': string;
  
  // Additional Information
  'Blood Group': string;
  'Religion': string;
  'Nationality': string;
  'Previous School': string;
  'Admission Date': string;
  
  // Guardian Information (if included)
  'Primary Guardian Name'?: string;
  'Primary Guardian Phone'?: string;
  'Primary Guardian Email'?: string;
  'Primary Guardian Relationship'?: string;
  'Emergency Contact Name'?: string;
  'Emergency Contact Phone'?: string;
  'Total Guardians'?: number;
  
  // Status Information
  'Fees Paid': string;
  'Hostel Resident': string;
  'Transport Required': string;
}

// Utility functions
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export function calculateAge(dateOfBirth: Date | string): number {
  const birth = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Main export function
export function prepareStudentExportData(
  students: Student[], 
  classes: Class[], 
  options: ExportOptions = { format: 'excel' }
): StudentExportData[] {
  const classMap = new Map(classes.map(c => [c.id, c]));
  
  return students.map(student => {
    const studentClass = classMap.get(student.classId);
    const primaryGuardian = student.guardians?.find(g => g.isPrimary);
    const emergencyContact = student.guardians?.find(g => g.isEmergencyContact);
    
    const baseData: StudentExportData = {
      'Student ID': student.studentId || '',
      'First Name': student.firstName,
      'Last Name': student.lastName,
      'Email': student.email || '',
      'Phone': student.phone || '',
      'Date of Birth': formatDate(student.dateOfBirth),
      'Age': calculateAge(student.dateOfBirth),
      'Gender': student.gender || '',
      'Address': student.address || '',
      'Class': studentClass?.name || 'Unknown',
      'Grade': student.grade || '',
      'Section': student.section || '',
      'Roll Number': student.rollNumber || 0,
      'Academic Year': student.academicYear || '',
      'Status': student.status || 'active',
      'Blood Group': student.bloodGroup || '',
      'Religion': student.religion || '',
      'Nationality': student.nationality || '',
      'Previous School': student.previousSchool || '',
      'Admission Date': formatDate(student.admissionDate),
      'Fees Paid': student.feesPaid ? 'Yes' : 'No',
      'Hostel Resident': student.hostelResident ? 'Yes' : 'No',
      'Transport Required': student.transportRequired ? 'Yes' : 'No',
    };
    
    // Add guardian information if requested
    if (options.includeGuardians) {
      baseData['Primary Guardian Name'] = primaryGuardian?.name || '';
      baseData['Primary Guardian Phone'] = primaryGuardian?.phone || '';
      baseData['Primary Guardian Email'] = primaryGuardian?.email || '';
      baseData['Primary Guardian Relationship'] = primaryGuardian?.relationship || '';
      baseData['Emergency Contact Name'] = emergencyContact?.name || '';
      baseData['Emergency Contact Phone'] = emergencyContact?.phone || '';
      baseData['Total Guardians'] = student.guardians?.length || 0;
    }
    
    return baseData;
  });
}

// Export to CSV
export function exportToCSV(data: StudentExportData[], filename: string = 'students_export'): void {
  const csv = Papa.unparse(data, {
    header: true,
    delimiter: ',',
    quotes: true
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export to Excel
export function exportToExcel(
  data: StudentExportData[], 
  filename: string = 'students_export',
  includeStats: boolean = false,
  classes: Class[] = []
): void {
  const workbook = XLSX.utils.book_new();
  
  // Main students sheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Auto-fit columns
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  const columnWidths: { wch: number }[] = [];
  
  for (let col = range.s.c; col <= range.e.c; col++) {
    let maxWidth = 10;
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        const cellLength = cell.v.toString().length;
        maxWidth = Math.max(maxWidth, cellLength);
      }
    }
    columnWidths.push({ wch: Math.min(maxWidth + 2, 50) });
  }
  worksheet['!cols'] = columnWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
  
  // Add statistics sheet if requested
  if (includeStats) {
    const stats = generateExportStatistics(data, classes);
    const statsWorksheet = XLSX.utils.json_to_sheet(stats);
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistics');
  }
  
  // Add class summary sheet
  if (classes.length > 0) {
    const classSummary = generateClassSummary(data, classes);
    const classWorksheet = XLSX.utils.json_to_sheet(classSummary);
    XLSX.utils.book_append_sheet(workbook, classWorksheet, 'Class Summary');
  }
  
  // Download file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

// Generate statistics for export
function generateExportStatistics(data: StudentExportData[], classes: Class[]) {
  const stats = [
    { Metric: 'Total Students', Value: data.length },
    { Metric: 'Total Classes', Value: classes.length },
    { Metric: 'Male Students', Value: data.filter(s => s.Gender.toLowerCase() === 'male').length },
    { Metric: 'Female Students', Value: data.filter(s => s.Gender.toLowerCase() === 'female').length },
    { Metric: 'Active Students', Value: data.filter(s => s.Status === 'active').length },
    { Metric: 'Hostel Residents', Value: data.filter(s => s['Hostel Resident'] === 'Yes').length },
    { Metric: 'Transport Users', Value: data.filter(s => s['Transport Required'] === 'Yes').length },
    { Metric: 'Fees Paid', Value: data.filter(s => s['Fees Paid'] === 'Yes').length },
  ];
  
  // Age distribution
  const ageGroups = {
    '10-12': 0,
    '13-15': 0,
    '16-18': 0,
    '19+': 0
  };
  
  data.forEach(student => {
    const age = student.Age;
    if (age >= 10 && age <= 12) ageGroups['10-12']++;
    else if (age >= 13 && age <= 15) ageGroups['13-15']++;
    else if (age >= 16 && age <= 18) ageGroups['16-18']++;
    else if (age >= 19) ageGroups['19+']++;
  });
  
  Object.entries(ageGroups).forEach(([range, count]) => {
    stats.push({ Metric: `Age ${range}`, Value: count });
  });
  
  return stats;
}

// Generate class summary
function generateClassSummary(data: StudentExportData[], classes: Class[]) {
  const classSummary = classes.map(cls => {
    const classStudents = data.filter(s => s.Class === cls.name);
    const maleCount = classStudents.filter(s => s.Gender.toLowerCase() === 'male').length;
    const femaleCount = classStudents.filter(s => s.Gender.toLowerCase() === 'female').length;
    
    return {
      'Class Name': cls.name,
      'Grade': cls.grade,
      'Section': cls.section,
      'Total Students': classStudents.length,
      'Male': maleCount,
      'Female': femaleCount,
      'Room Number': cls.roomNumber || 'Not Assigned',
      'Max Capacity': cls.maxCapacity || 0,
      'Current Strength': cls.currentStrength || classStudents.length
    };
  });
  
  return classSummary;
}

// Main export function that handles both formats
export function exportStudents(
  students: Student[],
  classes: Class[],
  options: ExportOptions = { format: 'excel', includeGuardians: true, includeStats: true }
): void {
  const exportData = prepareStudentExportData(students, classes, options);
  const filename = options.filename || `students_export_${new Date().toISOString().split('T')[0]}`;
  
  if (options.format === 'csv') {
    exportToCSV(exportData, filename);
  } else {
    exportToExcel(exportData, filename, options.includeStats, classes);
  }
}

// Export selected students
export function exportSelectedStudents(
  selectedStudents: Student[],
  allClasses: Class[],
  options: ExportOptions = { format: 'excel', includeGuardians: true }
): void {
  if (selectedStudents.length === 0) {
    alert('No students selected for export');
    return;
  }
  
  const filename = options.filename || `selected_students_${selectedStudents.length}_${new Date().toISOString().split('T')[0]}`;
  const exportData = prepareStudentExportData(selectedStudents, allClasses, options);
  
  if (options.format === 'csv') {
    exportToCSV(exportData, filename);
  } else {
    exportToExcel(exportData, filename, options.includeStats, allClasses);
  }
}

// Export all students
export function exportAllStudents(
  students: Student[],
  classes: Class[],
  format: 'csv' | 'excel' = 'excel'
): void {
  exportStudents(students, classes, {
    format,
    includeGuardians: true,
    includeStats: true,
    filename: `all_students_${students.length}_${new Date().toISOString().split('T')[0]}`
  });
}
