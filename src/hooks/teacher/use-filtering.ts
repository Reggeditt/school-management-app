import { useState, useMemo } from 'react';
import { Student } from '@/lib/database-services';

/**
 * Custom hook for filtering and searching functionality
 * Provides reusable filtering logic for teacher pages
 */
export function useFiltering<T extends Record<string, any>>(
  data: T[],
  initialFilters: Record<string, any> = {}
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search term filtering
      if (searchTerm) {
        const searchableText = Object.values(item)
          .filter(value => typeof value === 'string')
          .join(' ')
          .toLowerCase();
        
        if (!searchableText.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Custom filters
      for (const [key, value] of Object.entries(filters)) {
        if (value && value !== 'all') {
          if (item[key] !== value) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchTerm, filters]);

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters(initialFilters);
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    filteredData
  };
}

/**
 * Specialized hook for student filtering
 */
export function useStudentFiltering(
  students: Student[],
  classes: any[] = [],
  initialClassFilter = 'all'
) {
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    updateFilter, 
    clearFilters 
  } = useFiltering(students, { classId: initialClassFilter });

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Search term filtering
      if (searchTerm) {
        const searchableText = `${student.firstName} ${student.lastName} ${student.email || ''} ${student.studentId}`.toLowerCase();
        if (!searchableText.includes(searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Class filtering
      if (filters.classId && filters.classId !== 'all') {
        const studentClass = classes.find(cls => cls.students?.includes(student.id));
        if (studentClass?.id !== filters.classId) {
          return false;
        }
      }

      return true;
    });
  }, [students, classes, searchTerm, filters.classId]);

  return {
    searchTerm,
    setSearchTerm,
    selectedClass: filters.classId,
    setSelectedClass: (classId: string) => updateFilter('classId', classId),
    filteredStudents,
    clearFilters
  };
}
