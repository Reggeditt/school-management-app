// Sibling relationship utilities
import { Student, GuardianInfo } from './database-services';

export interface SiblingInfo {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
  classId: string;
  relationship: 'brother' | 'sister' | 'sibling';
  sharedGuardians: string[]; // Names of shared guardians
}

/**
 * Find all siblings for a student based on shared guardians
 */
export function findStudentSiblings(targetStudent: Student, allStudents: Student[]): SiblingInfo[] {
  const siblings: SiblingInfo[] = [];
  
  if (!targetStudent.guardians || targetStudent.guardians.length === 0) {
    return siblings;
  }

  // Get all guardian phone numbers for the target student (most reliable identifier)
  const targetGuardianPhones = targetStudent.guardians
    .map(g => g.phone)
    .filter(phone => phone && phone.trim().length > 0);

  if (targetGuardianPhones.length === 0) {
    return siblings;
  }

  // Check each other student
  for (const student of allStudents) {
    // Skip self
    if (student.id === targetStudent.id) {
      continue;
    }

    // Skip if no guardians
    if (!student.guardians || student.guardians.length === 0) {
      continue;
    }

    // Get guardian phones for this student
    const studentGuardianPhones = student.guardians
      .map(g => g.phone)
      .filter(phone => phone && phone.trim().length > 0);

    // Find shared guardian phones
    const sharedPhones = targetGuardianPhones.filter(phone => 
      studentGuardianPhones.includes(phone)
    );

    // If they share at least one guardian, they're siblings
    if (sharedPhones.length > 0) {
      // Get the names of shared guardians
      const sharedGuardians = targetStudent.guardians
        .filter(g => sharedPhones.includes(g.phone))
        .map(g => g.name);

      // Determine relationship based on gender
      let relationship: 'brother' | 'sister' | 'sibling' = 'sibling';
      if (student.gender === 'male') {
        relationship = 'brother';
      } else if (student.gender === 'female') {
        relationship = 'sister';
      }

      siblings.push({
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        grade: student.grade,
        section: student.section,
        classId: student.classId,
        relationship,
        sharedGuardians
      });
    }
  }

  // Sort by grade (younger first) then by name
  siblings.sort((a, b) => {
    const gradeA = parseInt(a.grade) || 0;
    const gradeB = parseInt(b.grade) || 0;
    if (gradeA !== gradeB) {
      return gradeA - gradeB;
    }
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  });

  return siblings;
}

/**
 * Alternative method: Find siblings by matching guardian names (less reliable)
 */
export function findStudentSiblingsByName(targetStudent: Student, allStudents: Student[]): SiblingInfo[] {
  const siblings: SiblingInfo[] = [];
  
  if (!targetStudent.guardians || targetStudent.guardians.length === 0) {
    return siblings;
  }

  // Get all guardian names for the target student
  const targetGuardianNames = targetStudent.guardians
    .map(g => g.name.toLowerCase().trim())
    .filter(name => name.length > 0);

  if (targetGuardianNames.length === 0) {
    return siblings;
  }

  // Check each other student
  for (const student of allStudents) {
    // Skip self
    if (student.id === targetStudent.id) {
      continue;
    }

    // Skip if no guardians
    if (!student.guardians || student.guardians.length === 0) {
      continue;
    }

    // Get guardian names for this student
    const studentGuardianNames = student.guardians
      .map(g => g.name.toLowerCase().trim())
      .filter(name => name.length > 0);

    // Find shared guardian names
    const sharedNames = targetGuardianNames.filter(name => 
      studentGuardianNames.includes(name)
    );

    // If they share at least one guardian name, they might be siblings
    if (sharedNames.length > 0) {
      // Get the actual names of shared guardians
      const sharedGuardians = targetStudent.guardians
        .filter(g => sharedNames.includes(g.name.toLowerCase().trim()))
        .map(g => g.name);

      // Determine relationship based on gender
      let relationship: 'brother' | 'sister' | 'sibling' = 'sibling';
      if (student.gender === 'male') {
        relationship = 'brother';
      } else if (student.gender === 'female') {
        relationship = 'sister';
      }

      siblings.push({
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        grade: student.grade,
        section: student.section,
        classId: student.classId,
        relationship,
        sharedGuardians
      });
    }
  }

  // Sort by grade (younger first) then by name
  siblings.sort((a, b) => {
    const gradeA = parseInt(a.grade) || 0;
    const gradeB = parseInt(b.grade) || 0;
    if (gradeA !== gradeB) {
      return gradeA - gradeB;
    }
    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
  });

  return siblings;
}

/**
 * Get sibling statistics for a student
 */
export function getSiblingStats(targetStudent: Student, allStudents: Student[]) {
  const siblings = findStudentSiblings(targetStudent, allStudents);
  
  return {
    totalSiblings: siblings.length,
    brothers: siblings.filter(s => s.relationship === 'brother').length,
    sisters: siblings.filter(s => s.relationship === 'sister').length,
    olderSiblings: siblings.filter(s => {
      const siblingGrade = parseInt(s.grade) || 0;
      const targetGrade = parseInt(targetStudent.grade) || 0;
      return siblingGrade > targetGrade;
    }).length,
    youngerSiblings: siblings.filter(s => {
      const siblingGrade = parseInt(s.grade) || 0;
      const targetGrade = parseInt(targetStudent.grade) || 0;
      return siblingGrade < targetGrade;
    }).length,
    sameGradeSiblings: siblings.filter(s => s.grade === targetStudent.grade).length
  };
}
