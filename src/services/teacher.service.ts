'use client';

import { DatabaseService, Teacher, Class, Student, Subject, Attendance } from '@/lib/database-services';

export interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  gradedAssignments: number;
  todayAttendance: number;
  upcomingClasses: number;
  averageGrade: number;
  attendanceRate: number;
}

export interface TeacherClassInfo extends Class {
  nextClass?: {
    day: string;
    time: string;
    room: string;
  };
  recentAttendance: number;
  pendingAssignments: number;
  avgGrade: number;
  studentsCount: number;
}

export interface AssignmentInfo {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  dueDate: Date;
  status: 'draft' | 'published' | 'closed';
  submissionCount: number;
  totalStudents: number;
  gradedCount: number;
  averageGrade?: number;
  type: 'homework' | 'project' | 'quiz' | 'test';
  priority: 'low' | 'medium' | 'high';
}

export interface GradeInfo {
  id: string;
  studentId: string;
  studentName: string;
  assignmentId: string;
  assignmentTitle: string;
  subjectId: string;
  subjectName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  status: 'graded' | 'pending' | 'late_submission';
  submissionDate: Date;
  gradedDate?: Date;
  feedback?: string;
}

export class TeacherService {
  
  /**
   * Get teacher profile with classes and subjects
   */
  static async getTeacherProfile(teacherId: string): Promise<Teacher | null> {
    try {
      return await DatabaseService.getTeacherById(teacherId);
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      throw new Error('Failed to fetch teacher profile');
    }
  }

  /**
   * Get classes assigned to a teacher
   */
  static async getTeacherClasses(teacherId: string, schoolId: string): Promise<TeacherClassInfo[]> {
    try {
      // Get all classes for the school
      const allClasses = await DatabaseService.getClasses(schoolId);
      
      // Filter classes where teacher is the class teacher or teaches a subject
      const teacherClasses = allClasses.filter(cls => 
        cls.classTeacherId === teacherId || 
        // Check if teacher teaches any subject in this class (would need subject assignment logic)
        true // Simplified for now
      );

      // Enhance class data with additional info
      const enhancedClasses: TeacherClassInfo[] = await Promise.all(
        teacherClasses.map(async (cls) => {
          // Get students count
          const students = await DatabaseService.getStudents(schoolId, { 
            studentGrade: cls.grade, 
            studentSection: cls.section 
          });

          // Calculate attendance rate (would need attendance data)
          const recentAttendance = Math.round(Math.random() * 20 + 80); // Mock for now

          // Get pending assignments count (would need assignment data)
          const pendingAssignments = Math.round(Math.random() * 5);

          // Calculate average grade (would need grade data)
          const avgGrade = Math.round(Math.random() * 20 + 70);

          // Calculate next class (from schedule)
          const nextClass = this.getNextClassFromSchedule(cls.schedule);

          return {
            ...cls,
            studentsCount: students.length,
            recentAttendance,
            pendingAssignments,
            avgGrade,
            nextClass
          };
        })
      );

      return enhancedClasses;
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      throw new Error('Failed to fetch teacher classes');
    }
  }

  /**
   * Get students for teacher's classes
   */
  static async getTeacherStudents(teacherId: string, schoolId: string, classId?: string): Promise<Student[]> {
    try {
      if (classId) {
        // Get students for specific class
        const classData = await DatabaseService.getClassById(classId);
        if (!classData) return [];
        
        return await DatabaseService.getStudents(schoolId, {
          studentGrade: classData.grade,
          studentSection: classData.section
        });
      } else {
        // Get all students from teacher's classes
        const teacherClasses = await this.getTeacherClasses(teacherId, schoolId);
        const allStudents: Student[] = [];
        
        for (const cls of teacherClasses) {
          const students = await DatabaseService.getStudents(schoolId, {
            studentGrade: cls.grade,
            studentSection: cls.section
          });
          allStudents.push(...students);
        }
        
        // Remove duplicates
        const uniqueStudents = allStudents.filter((student, index, self) => 
          index === self.findIndex(s => s.id === student.id)
        );
        
        return uniqueStudents;
      }
    } catch (error) {
      console.error('Error fetching teacher students:', error);
      throw new Error('Failed to fetch teacher students');
    }
  }

  /**
   * Get subjects taught by teacher
   */
  static async getTeacherSubjects(teacherId: string, schoolId: string): Promise<Subject[]> {
    try {
      const teacher = await this.getTeacherProfile(teacherId);
      if (!teacher || !teacher.subjects.length) return [];

      const subjects: Subject[] = [];
      for (const subjectId of teacher.subjects) {
        const subject = await DatabaseService.getSubjectById(subjectId);
        if (subject) {
          subjects.push(subject);
        }
      }

      return subjects;
    } catch (error) {
      console.error('Error fetching teacher subjects:', error);
      throw new Error('Failed to fetch teacher subjects');
    }
  }

  /**
   * Get dashboard statistics for teacher
   */
  static async getDashboardStats(teacherId: string, schoolId: string): Promise<TeacherDashboardStats> {
    try {
      const classes = await this.getTeacherClasses(teacherId, schoolId);
      const students = await this.getTeacherStudents(teacherId, schoolId);

      // For now, we'll calculate basic stats and use mock data for complex ones
      // In a real implementation, these would query specific collections

      const totalClasses = classes.length;
      const totalStudents = students.length;
      
      // These would be calculated from actual assignment and attendance data
      const pendingAssignments = classes.reduce((sum, cls) => sum + cls.pendingAssignments, 0);
      const gradedAssignments = Math.round(Math.random() * 15 + 10);
      const todayAttendance = Math.round(Math.random() * totalStudents * 0.2 + totalStudents * 0.8);
      const upcomingClasses = classes.filter(cls => cls.nextClass).length;
      const averageGrade = classes.reduce((sum, cls) => sum + cls.avgGrade, 0) / (classes.length || 1);
      const attendanceRate = classes.reduce((sum, cls) => sum + cls.recentAttendance, 0) / (classes.length || 1);

      return {
        totalClasses,
        totalStudents,
        pendingAssignments,
        gradedAssignments,
        todayAttendance,
        upcomingClasses,
        averageGrade: Math.round(averageGrade),
        attendanceRate: Math.round(attendanceRate)
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      throw new Error('Failed to calculate dashboard statistics');
    }
  }

  /**
   * Helper method to calculate next class from schedule
   */
  private static getNextClassFromSchedule(schedule: Class['schedule']): { day: string; time: string; room: string } | undefined {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Simple logic to find next class - would need more sophisticated implementation
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (const day of days) {
      if (schedule[day]) {
        const periods = Object.keys(schedule[day]);
        for (const period of periods) {
          const classInfo = schedule[day][period];
          // This is a simplified version - would need proper time parsing
          return {
            day,
            time: classInfo.startTime,
            room: 'Room 201' // Would get from class info
          };
        }
      }
    }

    return undefined;
  }

  /**
   * Get attendance data for teacher's classes
   */
  static async getClassAttendance(classId: string, date?: Date): Promise<Attendance[]> {
    try {
      // This would query attendance collection
      // For now, returning empty array as attendance methods aren't implemented in DatabaseService
      console.log('Getting attendance for class:', classId, 'date:', date);
      return [];
    } catch (error) {
      console.error('Error fetching class attendance:', error);
      throw new Error('Failed to fetch class attendance');
    }
  }

  /**
   * Mark attendance for students
   */
  static async markAttendance(attendanceRecords: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    try {
      // This would create attendance records
      // Would need to implement attendance methods in DatabaseService
      console.log('Marking attendance:', attendanceRecords);
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw new Error('Failed to mark attendance');
    }
  }
}
