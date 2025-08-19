// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DatabaseService, Class, Student, Subject, Attendance, Teacher } from '@/lib/database-services';

/**
 * Teacher Service - Handles all teacher-specific business logic
 * Following separation of concerns principle
 */
export class TeacherService {
  private static instance: TeacherService;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): TeacherService {
    if (!TeacherService.instance) {
      TeacherService.instance = new TeacherService();
    }
    return TeacherService.instance;
  }

  /**
   * Get all classes assigned to a specific teacher
   */
  async getTeacherClasses(teacherId: string, schoolId: string): Promise<Class[]> {
    if (!teacherId) {
      console.error('TeacherService: teacherId is required but not provided');
      throw new Error('Teacher ID is required');
    }
    
    if (!schoolId) {
      console.error('TeacherService: schoolId is required but not provided');
      throw new Error('School ID is required');
    }
    
    try {
      console.log('🔍 Getting classes for teacherId (Firebase Auth UID):', teacherId, 'schoolId:', schoolId);
      const allClasses = await DatabaseService.getClasses(schoolId);
      
      // Filter classes where the teacher is assigned as class teacher
      // teacherId here is the Firebase Auth UID
      const teacherClasses = allClasses.filter(cls => cls.classTeacherId === teacherId);
      console.log('📚 Found', teacherClasses.length, 'classes for teacher');
      
      if (teacherClasses.length === 0) {
        console.log('⚠️ No classes found. Available classes:', allClasses.map(c => ({ 
          id: c.id, 
          name: c.name, 
          classTeacherId: c.classTeacherId 
        })));
      }
      
      return teacherClasses;
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
      throw new Error('Failed to fetch teacher classes');
    }
  }

  /**
   * Get all students in teacher's classes
   */
  async getTeacherStudents(teacherId: string, schoolId: string): Promise<Student[]> {
    if (!teacherId) {
      console.error('TeacherService: teacherId is required but not provided');
      throw new Error('Teacher ID is required');
    }
    
    if (!schoolId) {
      console.error('TeacherService: schoolId is required but not provided');
      throw new Error('School ID is required');
    }
    
    try {
      console.log('👥 Getting students for teacherId:', teacherId, 'schoolId:', schoolId);
      const teacherClasses = await this.getTeacherClasses(teacherId, schoolId);
      const allStudents = await DatabaseService.getStudents(schoolId);
      
      const studentIds = new Set();
      teacherClasses.forEach(cls => {
        cls.students?.forEach(studentId => studentIds.add(studentId));
      });
      
      const teacherStudents = allStudents.filter(student => studentIds.has(student.id));
      console.log('👥 Found', teacherStudents.length, 'students for teacher');
      return teacherStudents;
    } catch (error) {
      console.error('Error fetching teacher students:', error);
      throw new Error('Failed to fetch teacher students');
    }
  }

  /**
   * Get subjects taught by a teacher
   */
  async getTeacherSubjects(teacherId: string, schoolId: string): Promise<Subject[]> {
    if (!teacherId) {
      throw new Error('Teacher ID is required');
    }
    
    if (!schoolId) {
      throw new Error('School ID is required');
    }
    
    try {
      const allSubjects = await DatabaseService.getSubjects(schoolId);
      return allSubjects.filter(subject => subject.teacherIds?.includes(teacherId));
    } catch (error) {
      console.error('Error fetching teacher subjects:', error);
      throw new Error('Failed to fetch teacher subjects');
    }
  }

  /**
   * Mark attendance for a class
   */
  async markAttendance(attendanceData: {
    classId: string;
    teacherId: string;
    date: string;
    students: { studentId: string; status: 'present' | 'absent' | 'late' }[];
  }): Promise<boolean> {
    try {
      const { classId, teacherId, date, students } = attendanceData;
      
      // Verify teacher has access to this class
      const teacherClasses = await this.getTeacherClasses(teacherId);
      const hasAccess = teacherClasses.some(cls => cls.id === classId);
      
      if (!hasAccess) {
        throw new Error('Teacher does not have access to this class');
      }

      // Create attendance records
      const attendancePromises = students.map(student => 
        DatabaseService.addAttendance({
          id: `${classId}-${student.studentId}-${date}`,
          studentId: student.studentId,
          classId,
          date,
          status: student.status,
          markedBy: teacherId,
          timestamp: new Date().toISOString()
        })
      );

      await Promise.all(attendancePromises);
      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw new Error('Failed to mark attendance');
    }
  }

  /**
   * Get attendance records for teacher's classes
   */
  async getTeacherAttendance(teacherId: string, date?: string): Promise<Attendance[]> {
    try {
      const teacherClasses = await this.getTeacherClasses(teacherId);
      const classIds = teacherClasses.map(cls => cls.id);
      
      const allAttendance = await DatabaseService.getAttendance();
      
      return allAttendance.filter(attendance => {
        const matchesClass = classIds.includes(attendance.classId);
        const matchesDate = date ? attendance.date === date : true;
        return matchesClass && matchesDate;
      });
    } catch (error) {
      console.error('Error fetching teacher attendance:', error);
      throw new Error('Failed to fetch attendance records');
    }
  }

  /**
   * Get class schedule for a teacher
   */
  async getTeacherSchedule(teacherId: string): Promise<any[]> {
    try {
      // This would typically come from a timetable service
      // For now, return mock data
      return [
        {
          id: '1',
          classId: 'class1',
          subject: 'Mathematics',
          startTime: '09:00',
          endTime: '10:00',
          dayOfWeek: 1, // Monday
          classroom: 'Room 101'
        },
        {
          id: '2',
          classId: 'class2',
          subject: 'Physics',
          startTime: '10:30',
          endTime: '11:30',
          dayOfWeek: 1, // Monday
          classroom: 'Lab 2'
        }
      ];
    } catch (error) {
      console.error('Error fetching teacher schedule:', error);
      throw new Error('Failed to fetch teacher schedule');
    }
  }

  /**
   * Get teacher dashboard statistics
   */
  async getTeacherDashboardStats(teacherId: string): Promise<{
    totalClasses: number;
    totalStudents: number;
    todayAttendance: number;
    pendingAssignments: number;
  }> {
    try {
      const [teacherClasses, teacherStudents, todayAttendance] = await Promise.all([
        this.getTeacherClasses(teacherId),
        this.getTeacherStudents(teacherId),
        this.getTeacherAttendance(teacherId, new Date().toISOString().split('T')[0])
      ]);

      // Pending assignments would come from assignments service
      const pendingAssignments = 3; // Mock data

      return {
        totalClasses: teacherClasses.length,
        totalStudents: teacherStudents.length,
        todayAttendance: todayAttendance.length,
        pendingAssignments
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Create assignment (would integrate with assignments service)
   */
  async createAssignment(assignmentData: {
    title: string;
    description: string;
    dueDate: string;
    classId: string;
    teacherId: string;
    subjectId: string;
  }): Promise<boolean> {
    try {
      // Verify teacher has access to this class
      const teacherClasses = await this.getTeacherClasses(assignmentData.teacherId);
      const hasAccess = teacherClasses.some(cls => cls.id === assignmentData.classId);
      
      if (!hasAccess) {
        throw new Error('Teacher does not have access to this class');
      }

      // This would integrate with an assignments service
      console.log('Creating assignment:', assignmentData);
      return true;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw new Error('Failed to create assignment');
    }
  }

  /**
   * Grade assignment (would integrate with grading service)
   */
  async gradeAssignment(gradeData: {
    assignmentId: string;
    studentId: string;
    grade: string;
    feedback?: string;
    teacherId: string;
  }): Promise<boolean> {
    try {
      // This would integrate with a grading service
      console.log('Grading assignment:', gradeData);
      return true;
    } catch (error) {
      console.error('Error grading assignment:', error);
      throw new Error('Failed to grade assignment');
    }
  }
}
