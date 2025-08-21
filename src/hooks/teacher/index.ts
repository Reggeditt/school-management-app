'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { TeacherService, TeacherClassInfo, TeacherDashboardStats } from '@/services/teacher.service';
import { Teacher, Student, Subject } from '@/lib/database-services';

export interface UseTeacherDataResult {
  loading: boolean;
  error: string | null;
  teacherData: Teacher | null;
  classes: TeacherClassInfo[];
  students: Student[];
  subjects: Subject[];
  dashboardStats: TeacherDashboardStats | null;
  refreshData: () => Promise<void>;
  refreshClasses: () => Promise<void>;
  refreshStudents: (classId?: string) => Promise<void>;
  refreshSubjects: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

export function useTeacherData(): UseTeacherDataResult {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teacherData, setTeacherData] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<TeacherClassInfo[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dashboardStats, setDashboardStats] = useState<TeacherDashboardStats | null>(null);

  // Get school ID from user profile or context
  const schoolId = user?.profile?.schoolId || 'default-school-id'; // You may need to adjust this
  // Use uid as teacherId since the profile doesn't have teacherId property yet
  const teacherId = user?.uid || '';

  const refreshData = async () => {
    if (!teacherId || !schoolId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all teacher data in parallel
      const [teacher, teacherClasses, teacherStudents, teacherSubjects, stats] = await Promise.all([
        TeacherService.getTeacherProfile(teacherId),
        TeacherService.getTeacherClasses(teacherId, schoolId),
        TeacherService.getTeacherStudents(teacherId, schoolId),
        TeacherService.getTeacherSubjects(teacherId, schoolId),
        TeacherService.getDashboardStats(teacherId, schoolId)
      ]);

      setTeacherData(teacher);
      setClasses(teacherClasses);
      setStudents(teacherStudents);
      setSubjects(teacherSubjects);
      setDashboardStats(stats);
    } catch (err) {
      console.error('Error loading teacher data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load teacher data');
    } finally {
      setLoading(false);
    }
  };

  const refreshClasses = async () => {
    if (!teacherId || !schoolId) return;
    
    try {
      setError(null);
      const teacherClasses = await TeacherService.getTeacherClasses(teacherId, schoolId);
      setClasses(teacherClasses);
    } catch (err) {
      console.error('Error refreshing classes:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh classes');
    }
  };

  const refreshStudents = async (classId?: string) => {
    if (!teacherId || !schoolId) return;
    
    try {
      setError(null);
      const teacherStudents = await TeacherService.getTeacherStudents(teacherId, schoolId, classId);
      setStudents(teacherStudents);
    } catch (err) {
      console.error('Error refreshing students:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh students');
    }
  };

  const refreshSubjects = async () => {
    if (!teacherId || !schoolId) return;
    
    try {
      setError(null);
      const teacherSubjects = await TeacherService.getTeacherSubjects(teacherId, schoolId);
      setSubjects(teacherSubjects);
    } catch (err) {
      console.error('Error refreshing subjects:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh subjects');
    }
  };

  const refreshStats = async () => {
    if (!teacherId || !schoolId) return;
    
    try {
      setError(null);
      const stats = await TeacherService.getDashboardStats(teacherId, schoolId);
      setDashboardStats(stats);
    } catch (err) {
      console.error('Error refreshing stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh dashboard stats');
    }
  };

  useEffect(() => {
    if (user && teacherId && schoolId) {
      refreshData();
    }
  }, [user, teacherId, schoolId]);

  return {
    loading,
    error,
    teacherData,
    classes,
    students,
    subjects,
    dashboardStats,
    refreshData,
    refreshClasses,
    refreshStudents,
    refreshSubjects,
    refreshStats
  };
}
