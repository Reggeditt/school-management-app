import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { TeacherService } from '@/lib/services/teacher-service';
import { Class, Student } from '@/lib/database-services';

/**
 * Custom hook for managing teacher data (classes and students)
 * Handles loading states and error management
 */
export function useTeacherData() {
  const { user } = useAuth();
  const { loadClasses, loadStudents } = useStore();
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [teacherStudents, setTeacherStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const teacherService = TeacherService.getInstance();
  const teacherId = user?.uid || '';
  
  // For now, use the correct school ID - this should come from user.profile.schoolId eventually
  const schoolId = user?.profile?.schoolId || 'Mm0lqil8qb5OMmyz4IyX';
  
  console.log('🔍 User profile schoolId:', user?.profile?.schoolId);
  console.log('🔍 Using schoolId:', schoolId);

  const fetchTeacherData = async () => {
    // Don't proceed if teacherId is not available yet
    if (!teacherId || !user || !schoolId) {
      setLoading(false);
      setError(null);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching teacher data for teacherId:', teacherId, 'schoolId:', schoolId);
      
      // Load base data from store
      await Promise.all([loadClasses(), loadStudents()]);
      
      // Get teacher-specific data
      const [classes, students] = await Promise.all([
        teacherService.getTeacherClasses(teacherId, schoolId),
        teacherService.getTeacherStudents(teacherId, schoolId)
      ]);
      
      console.log('📚 Teacher classes loaded:', classes.length);
      console.log('👥 Teacher students loaded:', students.length);
      
      setTeacherClasses(classes);
      setTeacherStudents(students);
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setError('Failed to load teacher data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data when we have a valid user, teacherId, and schoolId
    if (user && teacherId && schoolId) {
      fetchTeacherData();
    } else if (!user) {
      // Reset state when no user
      setTeacherClasses([]);
      setTeacherStudents([]);
      setLoading(true);
      setError(null);
    } else {
      // Set loading to false if missing required data
      setLoading(false);
    }
  }, [user, teacherId, schoolId]); // Fixed: consistent dependency array

  const getStudentsForClass = useCallback((classId: string): Student[] => {
    const selectedClass = teacherClasses.find(cls => cls.id === classId);
    if (!selectedClass) return [];
    
    return teacherStudents.filter(student => 
      selectedClass.students?.includes(student.id)
    );
  }, [teacherClasses, teacherStudents]);

  const getClassById = useCallback((classId: string): Class | undefined => {
    return teacherClasses.find(cls => cls.id === classId);
  }, [teacherClasses]);

  return {
    teacherClasses,
    teacherStudents,
    loading,
    error,
    teacherId,
    refetch: fetchTeacherData,
    getStudentsForClass,
    getClassById
  };
}
