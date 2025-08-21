'use client';

import { DatabaseService } from '@/lib/database-services';

export interface GradeRecord {
  id: string;
  studentId: string;
  assignmentId: string;
  subjectId: string;
  teacherId: string;
  grade: number;
  maxPoints: number;
  percentage: number;
  letterGrade: string;
  feedback?: string;
  gradedAt: Date;
  submittedAt?: Date;
}

export interface StudentGradeSummary {
  studentId: string;
  studentName: string;
  studentEmail?: string;
  classId: string;
  className: string;
  overallGrade: number;
  attendanceRate: number;
  trend: 'up' | 'down' | 'stable';
  assignments: {
    [assignmentId: string]: {
      title: string;
      grade: number | null;
      maxPoints: number;
      submittedAt?: string;
      gradedAt?: string;
      feedback?: string;
    };
  };
}

export interface GradeStats {
  totalStudents: number;
  gradedAssignments: number;
  pendingGrades: number;
  averageGrade: number;
  topPerformer: string;
  classAverage: number;
  attendanceCorrelation: number;
}

export class GradeService {
  
  /**
   * Get all grades for a teacher's classes
   */
  static async getTeacherGrades(teacherId: string, schoolId: string): Promise<StudentGradeSummary[]> {
    try {
      // This would typically fetch from the grades collection
      // For now, generating mock data based on teacher's classes and students
      
      const classes = await DatabaseService.getClasses(schoolId);
      const teacherClasses = classes.filter(cls => cls.classTeacherId === teacherId);
      
      const allStudentGrades: StudentGradeSummary[] = [];
      
      for (const cls of teacherClasses) {
        const students = await DatabaseService.getStudents(schoolId, {
          studentGrade: cls.grade,
          studentSection: cls.section
        });
        
        for (const student of students) {
          // Generate mock assignments for this class
          const mockAssignments = this.generateMockAssignments();
          
          const assignments: StudentGradeSummary['assignments'] = {};
          let totalPoints = 0;
          let earnedPoints = 0;
          let gradedCount = 0;
          
          mockAssignments.forEach(assignment => {
            const hasGrade = Math.random() > 0.3; // 70% of assignments are graded
            const grade = hasGrade ? Math.floor(Math.random() * assignment.maxPoints * 0.4) + assignment.maxPoints * 0.6 : null;
            
            assignments[assignment.id] = {
              title: assignment.title,
              grade,
              maxPoints: assignment.maxPoints,
              submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              gradedAt: hasGrade ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
              feedback: hasGrade && Math.random() > 0.5 ? this.generateMockFeedback() : undefined
            };
            
            if (hasGrade && grade !== null) {
              earnedPoints += grade;
              gradedCount++;
            }
            totalPoints += assignment.maxPoints;
          });
          
          const overallGrade = gradedCount > 0 ? (earnedPoints / (gradedCount * (totalPoints / mockAssignments.length))) * 100 : 0;
          const attendanceRate = Math.floor(Math.random() * 20) + 80; // 80-100%
          
          allStudentGrades.push({
            studentId: student.id,
            studentName: `${student.firstName} ${student.lastName}`,
            studentEmail: student.email,
            classId: cls.id,
            className: cls.name,
            overallGrade,
            attendanceRate,
            trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
            assignments
          });
        }
      }
      
      return allStudentGrades;
    } catch (error) {
      console.error('Error fetching teacher grades:', error);
      throw new Error('Failed to fetch grades');
    }
  }

  /**
   * Update a student's grade for an assignment
   */
  static async updateGrade(
    studentId: string,
    assignmentId: string,
    grade: number | null,
    feedback?: string
  ): Promise<void> {
    try {
      // This would update the grade in the database
      console.log('Updating grade:', { studentId, assignmentId, grade, feedback });
      
      // In a real implementation, this would:
      // 1. Validate the grade is within bounds
      // 2. Update the grade record in Firestore
      // 3. Recalculate overall grades
      // 4. Send notifications if needed
      
      // Mock delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error updating grade:', error);
      throw new Error('Failed to update grade');
    }
  }

  /**
   * Get grade statistics for a teacher
   */
  static async getGradeStats(teacherId: string, schoolId: string): Promise<GradeStats> {
    try {
      const studentGrades = await this.getTeacherGrades(teacherId, schoolId);
      
      const totalStudents = studentGrades.length;
      let totalGradedAssignments = 0;
      let totalPendingGrades = 0;
      let totalGradePoints = 0;
      let gradedStudentCount = 0;
      
      studentGrades.forEach(student => {
        Object.values(student.assignments).forEach(assignment => {
          if (assignment.grade !== null) {
            totalGradedAssignments++;
            totalGradePoints += (assignment.grade / assignment.maxPoints) * 100;
          } else {
            totalPendingGrades++;
          }
        });
        
        if (student.overallGrade > 0) {
          gradedStudentCount++;
        }
      });
      
      const averageGrade = gradedStudentCount > 0 ? 
        studentGrades.reduce((sum, s) => sum + s.overallGrade, 0) / gradedStudentCount : 0;
      
      const topPerformer = studentGrades.reduce((top, current) => 
        current.overallGrade > top.overallGrade ? current : top, 
        studentGrades[0] || { studentName: 'N/A', overallGrade: 0 }
      );
      
      return {
        totalStudents,
        gradedAssignments: totalGradedAssignments,
        pendingGrades: totalPendingGrades,
        averageGrade,
        topPerformer: topPerformer.studentName,
        classAverage: averageGrade,
        attendanceCorrelation: Math.random() * 0.4 + 0.6 // Mock correlation
      };
    } catch (error) {
      console.error('Error calculating grade stats:', error);
      throw new Error('Failed to calculate grade statistics');
    }
  }

  /**
   * Export grades to CSV format
   */
  static async exportGrades(teacherId: string, schoolId: string): Promise<string> {
    try {
      const studentGrades = await this.getTeacherGrades(teacherId, schoolId);
      
      if (studentGrades.length === 0) {
        return 'No grades to export';
      }
      
      // Get all unique assignments
      const allAssignments = new Set<string>();
      studentGrades.forEach(student => {
        Object.keys(student.assignments).forEach(assignmentId => {
          allAssignments.add(assignmentId);
        });
      });
      
      const assignmentIds = Array.from(allAssignments);
      const headers = ['Student Name', 'Class', 'Overall Grade', 'Attendance Rate', ...assignmentIds];
      
      const rows = studentGrades.map(student => [
        student.studentName,
        student.className,
        student.overallGrade.toFixed(1),
        student.attendanceRate.toFixed(1),
        ...assignmentIds.map(id => {
          const assignment = student.assignments[id];
          return assignment ? `${assignment.grade || 0}/${assignment.maxPoints}` : '';
        })
      ]);
      
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      return csvContent;
    } catch (error) {
      console.error('Error exporting grades:', error);
      throw new Error('Failed to export grades');
    }
  }

  /**
   * Generate mock assignments for testing
   */
  private static generateMockAssignments() {
    return [
      { id: 'assignment_1', title: 'Quiz 1', maxPoints: 25 },
      { id: 'assignment_2', title: 'Homework 1', maxPoints: 50 },
      { id: 'assignment_3', title: 'Midterm Exam', maxPoints: 100 },
      { id: 'assignment_4', title: 'Project 1', maxPoints: 75 },
      { id: 'assignment_5', title: 'Quiz 2', maxPoints: 25 },
      { id: 'assignment_6', title: 'Final Exam', maxPoints: 150 }
    ];
  }

  /**
   * Generate mock feedback for testing
   */
  private static generateMockFeedback(): string {
    const feedbacks = [
      'Great work! Keep it up.',
      'Good effort, but needs improvement in calculations.',
      'Excellent understanding of the concepts.',
      'Please review the material and see me during office hours.',
      'Outstanding work! Perfect score.',
      'Good work overall, minor errors in the final section.',
      'Needs more practice with problem-solving techniques.',
      'Very good! Clear explanation of the process.'
    ];
    
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  }
}
