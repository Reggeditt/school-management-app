/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './auth-context';
import { DatabaseService, Student, Teacher, Class, Subject, Attendance, Exam, School } from '../lib/database-services';

// Types for the store state
export interface StoreState {
  // Loading states
  loading: {
    students: boolean;
    teachers: boolean;
    classes: boolean;
    subjects: boolean;
    attendance: boolean;
    exams: boolean;
    dashboard: boolean;
  };
  
  // Data collections
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  subjects: Subject[];
  attendance: Attendance[];
  exams: Exam[];
  
  // School info
  school: School | null;
  
  // Statistics
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSubjects: number;
    attendanceRate: number;
    activeExams: number;
  };
  
  // Filters and pagination
  filters: {
    studentGrade?: string;
    studentSection?: string;
    teacherDepartment?: string;
    classGrade?: string;
  };
  
  // Error handling
  errors: {
    [key: string]: string | null;
  };
}

// Action types
export type StoreAction =
  | { type: 'SET_LOADING'; payload: { key: keyof StoreState['loading']; value: boolean } }
  | { type: 'SET_STUDENTS'; payload: Student[] }
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: { id: string; data: Partial<Student> } }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'SET_TEACHERS'; payload: Teacher[] }
  | { type: 'ADD_TEACHER'; payload: Teacher }
  | { type: 'UPDATE_TEACHER'; payload: { id: string; data: Partial<Teacher> } }
  | { type: 'DELETE_TEACHER'; payload: string }
  | { type: 'SET_CLASSES'; payload: Class[] }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: { id: string; data: Partial<Class> } }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'SET_ATTENDANCE'; payload: Attendance[] }
  | { type: 'SET_EXAMS'; payload: Exam[] }
  | { type: 'SET_SCHOOL'; payload: School }
  | { type: 'SET_STATS'; payload: Partial<StoreState['stats']> }
  | { type: 'SET_FILTERS'; payload: Partial<StoreState['filters']> }
  | { type: 'SET_ERROR'; payload: { key: string; error: string | null } }
  | { type: 'CLEAR_ERRORS' };

// Initial state
const initialState: StoreState = {
  loading: {
    students: false,
    teachers: false,
    classes: false,
    subjects: false,
    attendance: false,
    exams: false,
    dashboard: false,
  },
  students: [],
  teachers: [],
  classes: [],
  subjects: [],
  attendance: [],
  exams: [],
  school: null,
  stats: {
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    attendanceRate: 0,
    activeExams: 0,
  },
  filters: {},
  errors: {},
};

// Reducer function
function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };
      
    case 'SET_STUDENTS':
      return {
        ...state,
        students: action.payload,
        stats: {
          ...state.stats,
          totalStudents: action.payload.length,
        },
      };
      
    case 'ADD_STUDENT':
      return {
        ...state,
        students: [...state.students, action.payload],
        stats: {
          ...state.stats,
          totalStudents: state.stats.totalStudents + 1,
        },
      };
      
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(student =>
          student.id === action.payload.id
            ? { ...student, ...action.payload.data }
            : student
        ),
      };
      
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(student => student.id !== action.payload),
        stats: {
          ...state.stats,
          totalStudents: state.stats.totalStudents - 1,
        },
      };
      
    case 'SET_TEACHERS':
      return {
        ...state,
        teachers: action.payload,
        stats: {
          ...state.stats,
          totalTeachers: action.payload.length,
        },
      };
      
    case 'ADD_TEACHER':
      return {
        ...state,
        teachers: [...state.teachers, action.payload],
        stats: {
          ...state.stats,
          totalTeachers: state.stats.totalTeachers + 1,
        },
      };
      
    case 'UPDATE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.map(teacher =>
          teacher.id === action.payload.id
            ? { ...teacher, ...action.payload.data }
            : teacher
        ),
      };
      
    case 'DELETE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.filter(teacher => teacher.id !== action.payload),
        stats: {
          ...state.stats,
          totalTeachers: state.stats.totalTeachers - 1,
        },
      };
      
    case 'SET_CLASSES':
      return {
        ...state,
        classes: action.payload,
        stats: {
          ...state.stats,
          totalClasses: action.payload.length,
        },
      };
      
    case 'ADD_CLASS':
      return {
        ...state,
        classes: [...state.classes, action.payload],
        stats: {
          ...state.stats,
          totalClasses: state.stats.totalClasses + 1,
        },
      };
      
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map(cls =>
          cls.id === action.payload.id
            ? { ...cls, ...action.payload.data }
            : cls
        ),
      };
      
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter(cls => cls.id !== action.payload),
        stats: {
          ...state.stats,
          totalClasses: state.stats.totalClasses - 1,
        },
      };
      
    case 'SET_SUBJECTS':
      return {
        ...state,
        subjects: action.payload,
        stats: {
          ...state.stats,
          totalSubjects: action.payload.length,
        },
      };
      
    case 'SET_ATTENDANCE':
      return {
        ...state,
        attendance: action.payload,
      };
      
    case 'SET_EXAMS':
      return {
        ...state,
        exams: action.payload,
        stats: {
          ...state.stats,
          activeExams: action.payload.filter(exam => exam.status === 'active').length,
        },
      };
      
    case 'SET_SCHOOL':
      return {
        ...state,
        school: action.payload,
      };
      
    case 'SET_STATS':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      };
      
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error,
        },
      };
      
    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };
      
    default:
      return state;
  }
}

// Context interface
interface StoreContextType {
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
  
  // Action creators
  loadStudents: () => Promise<void>;
  addStudent: (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  loadTeachers: () => Promise<void>;
  addTeacher: (teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTeacher: (id: string, data: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  
  loadClasses: () => Promise<void>;
  addClass: (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateClass: (id: string, data: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  
  loadSubjects: () => Promise<void>;
  loadAttendance: (date?: Date) => Promise<void>;
  loadExams: () => Promise<void>;
  loadDashboardData: () => Promise<void>;
  
  setFilters: (filters: Partial<StoreState['filters']>) => void;
  clearErrors: () => void;
}

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Hook to use store
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

// Store provider component
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);
  const { user } = useAuth();

  // Helper function to get school ID
  const getSchoolId = () => user?.profile?.schoolId || 'demo-school';

  // Action creators
  const loadStudents = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'students', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: null } });
      
      const schoolId = getSchoolId();
      const students = await DatabaseService.getStudents(schoolId, state.filters);
      
      dispatch({ type: 'SET_STUDENTS', payload: students });
    } catch (error: any) {
      console.error('Error loading students:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'students', value: false } });
    }
  };

  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const schoolId = getSchoolId();
      const id = await DatabaseService.createStudent({ ...studentData, schoolId });
      const newStudent = await DatabaseService.getStudentById(id);
      
      if (newStudent) {
        dispatch({ type: 'ADD_STUDENT', payload: newStudent });
      }
    } catch (error: any) {
      console.error('Error adding student:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
      throw error;
    }
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    try {
      await DatabaseService.updateStudent(id, data);
      dispatch({ type: 'UPDATE_STUDENT', payload: { id, data } });
    } catch (error: any) {
      console.error('Error updating student:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await DatabaseService.deleteStudent(id);
      dispatch({ type: 'DELETE_STUDENT', payload: id });
    } catch (error: any) {
      console.error('Error deleting student:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
      throw error;
    }
  };

  const loadTeachers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'teachers', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: null } });
      
      const schoolId = getSchoolId();
      const teachers = await DatabaseService.getTeachers(schoolId, state.filters);
      
      dispatch({ type: 'SET_TEACHERS', payload: teachers });
    } catch (error: any) {
      console.error('Error loading teachers:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'teachers', value: false } });
    }
  };

  const addTeacher = async (teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const schoolId = getSchoolId();
      const id = await DatabaseService.createTeacher({ ...teacherData, schoolId });
      const newTeacher = await DatabaseService.getTeacherById(id);
      
      if (newTeacher) {
        dispatch({ type: 'ADD_TEACHER', payload: newTeacher });
      }
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
      throw error;
    }
  };

  const updateTeacher = async (id: string, data: Partial<Teacher>) => {
    try {
      await DatabaseService.updateTeacher(id, data);
      dispatch({ type: 'UPDATE_TEACHER', payload: { id, data } });
    } catch (error: any) {
      console.error('Error updating teacher:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
      throw error;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      await DatabaseService.deleteTeacher(id);
      dispatch({ type: 'DELETE_TEACHER', payload: id });
    } catch (error: any) {
      console.error('Error deleting teacher:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
      throw error;
    }
  };

  const loadClasses = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'classes', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: null } });
      
      const schoolId = getSchoolId();
      const classes = await DatabaseService.getClasses(schoolId, state.filters);
      
      dispatch({ type: 'SET_CLASSES', payload: classes });
    } catch (error: any) {
      console.error('Error loading classes:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'classes', value: false } });
    }
  };

  const addClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const schoolId = getSchoolId();
      const id = await DatabaseService.createClass({ ...classData, schoolId });
      const newClass = await DatabaseService.getClassById(id);
      
      if (newClass) {
        dispatch({ type: 'ADD_CLASS', payload: newClass });
      }
    } catch (error: any) {
      console.error('Error adding class:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
      throw error;
    }
  };

  const updateClass = async (id: string, data: Partial<Class>) => {
    try {
      await DatabaseService.updateClass(id, data);
      dispatch({ type: 'UPDATE_CLASS', payload: { id, data } });
    } catch (error: any) {
      console.error('Error updating class:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
      throw error;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await DatabaseService.deleteClass(id);
      dispatch({ type: 'DELETE_CLASS', payload: id });
    } catch (error: any) {
      console.error('Error deleting class:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
      throw error;
    }
  };

  const loadSubjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'subjects', value: true } });
      const schoolId = getSchoolId();
      const subjects = await DatabaseService.getSubjects(schoolId);
      dispatch({ type: 'SET_SUBJECTS', payload: subjects });
    } catch (error: any) {
      console.error('Error loading subjects:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'subjects', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'subjects', value: false } });
    }
  };

  const loadAttendance = async (date?: Date) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'attendance', value: true } });
      const schoolId = getSchoolId();
      const attendance = await DatabaseService.getAttendance(schoolId, date);
      dispatch({ type: 'SET_ATTENDANCE', payload: attendance });
    } catch (error: any) {
      console.error('Error loading attendance:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'attendance', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'attendance', value: false } });
    }
  };

  const loadExams = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'exams', value: true } });
      const schoolId = getSchoolId();
      const exams = await DatabaseService.getExams(schoolId);
      dispatch({ type: 'SET_EXAMS', payload: exams });
    } catch (error: any) {
      console.error('Error loading exams:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'exams', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'exams', value: false } });
    }
  };

  const loadDashboardData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'dashboard', value: true } });
      const schoolId = getSchoolId();
      
      // Load all data in parallel
      await Promise.all([
        loadStudents(),
        loadTeachers(),
        loadClasses(),
        loadSubjects(),
      ]);
      
      // Calculate attendance rate
      const todayAttendance = await DatabaseService.getAttendance(schoolId, new Date());
      const totalStudents = state.students.length;
      const presentStudents = todayAttendance.filter((att: Attendance) => att.status === 'present').length;
      const attendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
      
      dispatch({ type: 'SET_STATS', payload: { attendanceRate } });
    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      dispatch({ type: 'SET_ERROR', payload: { key: 'dashboard', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'dashboard', value: false } });
    }
  };

  const setFilters = (filters: Partial<StoreState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Auto-load data when user changes
  useEffect(() => {
    if (user?.profile?.schoolId) {
      loadDashboardData();
    }
  }, [user?.profile?.schoolId]);

  const value: StoreContextType = {
    state,
    dispatch,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    loadTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    loadClasses,
    addClass,
    updateClass,
    deleteClass,
    loadSubjects,
    loadAttendance,
    loadExams,
    loadDashboardData,
    setFilters,
    clearErrors,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
