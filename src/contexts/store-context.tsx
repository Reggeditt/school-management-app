/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
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
    school: boolean;
    preferences: boolean;
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
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: { id: string; data: Partial<Subject> } }
  | { type: 'DELETE_SUBJECT'; payload: string }
  | { type: 'SET_ATTENDANCE'; payload: Attendance[] }
  | { type: 'ADD_ATTENDANCE'; payload: Attendance }
  | { type: 'UPDATE_ATTENDANCE'; payload: { id: string; data: Partial<Attendance> } }
  | { type: 'DELETE_ATTENDANCE'; payload: string }
  | { type: 'SET_EXAMS'; payload: Exam[] }
  | { type: 'ADD_EXAM'; payload: Exam }
  | { type: 'UPDATE_EXAM'; payload: { id: string; data: Partial<Exam> } }
  | { type: 'DELETE_EXAM'; payload: string }
  | { type: 'SET_SCHOOL'; payload: School }
  | { type: 'SET_STATS'; payload: Partial<StoreState['stats']> }
  | { type: 'SET_FILTERS'; payload: Partial<StoreState['filters']> }
  | { type: 'SET_ERROR'; payload: { key: string; error: string | null } }
  | { type: 'SET_USER_PREFERENCES'; payload: any }
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
    school: false,
    preferences: false,
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
      
    case 'ADD_SUBJECT':
      return {
        ...state,
        subjects: [...state.subjects, action.payload],
        stats: {
          ...state.stats,
          totalSubjects: state.stats.totalSubjects + 1,
        },
      };
      
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(subject =>
          subject.id === action.payload.id
            ? { ...subject, ...action.payload.data }
            : subject
        ),
      };
      
    case 'DELETE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.filter(subject => subject.id !== action.payload),
        stats: {
          ...state.stats,
          totalSubjects: state.stats.totalSubjects - 1,
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
      
    case 'ADD_ATTENDANCE':
      return {
        ...state,
        attendance: [...state.attendance, action.payload],
      };
      
    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.map(attendance =>
          attendance.id === action.payload.id
            ? { ...attendance, ...action.payload.data }
            : attendance
        ),
      };
      
    case 'DELETE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.filter(attendance => attendance.id !== action.payload),
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
      
    case 'ADD_EXAM':
      return {
        ...state,
        exams: [...state.exams, action.payload],
        stats: {
          ...state.stats,
          activeExams: action.payload.status === 'active' 
            ? state.stats.activeExams + 1 
            : state.stats.activeExams,
        },
      };
      
    case 'UPDATE_EXAM':
      return {
        ...state,
        exams: state.exams.map(exam =>
          exam.id === action.payload.id
            ? { ...exam, ...action.payload.data }
            : exam
        ),
        stats: {
          ...state.stats,
          activeExams: state.exams.filter(exam => 
            exam.id === action.payload.id 
              ? (action.payload.data.status || exam.status) === 'active'
              : exam.status === 'active'
          ).length,
        },
      };
      
    case 'DELETE_EXAM':
      const deletedExam = state.exams.find(exam => exam.id === action.payload);
      return {
        ...state,
        exams: state.exams.filter(exam => exam.id !== action.payload),
        stats: {
          ...state.stats,
          activeExams: deletedExam?.status === 'active' 
            ? state.stats.activeExams - 1 
            : state.stats.activeExams,
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
      
    case 'SET_USER_PREFERENCES':
      return {
        ...state,
        // For now, we'll just store preferences in a simple way
        // This can be expanded later to have proper user preferences structure
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
  addSubject: (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  
  loadAttendance: (date?: Date) => Promise<void>;
  addAttendance: (attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAttendance: (id: string, data: Partial<Attendance>) => Promise<void>;
  deleteAttendance: (id: string) => Promise<void>;
  
  loadExams: () => Promise<void>;
  addExam: (examData: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExam: (id: string, data: Partial<Exam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;
  
  loadDashboardData: () => Promise<void>;
  
  // Settings methods
  loadSchool: () => Promise<void>;
  updateSchool: (data: Partial<School>) => Promise<void>;
  updateUserPreferences: (preferences: any) => Promise<void>;
  
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
  const loadStudents = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'students', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: null } });
      
      const schoolId = getSchoolId();
      const students = await DatabaseService.getStudents(schoolId, state.filters);
      
      dispatch({ type: 'SET_STUDENTS', payload: students });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'students', value: false } });
    }
  }, [user?.profile?.schoolId, state.filters]);

  const addStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const schoolId = getSchoolId();
      const id = await DatabaseService.createStudent({ ...studentData, schoolId });
      const newStudent = await DatabaseService.getStudentById(id);
      
      if (newStudent) {
        dispatch({ type: 'ADD_STUDENT', payload: newStudent });
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
      throw error;
    }
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    try {
      await DatabaseService.updateStudent(id, data);
      dispatch({ type: 'UPDATE_STUDENT', payload: { id, data } });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      await DatabaseService.deleteStudent(id);
      dispatch({ type: 'DELETE_STUDENT', payload: id });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'students', error: error.message } });
      throw error;
    }
  };

  const loadTeachers = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'teachers', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: null } });
      
      const schoolId = getSchoolId();
      const teachers = await DatabaseService.getTeachers(schoolId, state.filters);
      
      dispatch({ type: 'SET_TEACHERS', payload: teachers });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'teachers', value: false } });
    }
  }, [user?.profile?.schoolId, state.filters]);

  const addTeacher = async (teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const schoolId = getSchoolId();
      const id = await DatabaseService.createTeacher({ ...teacherData, schoolId });
      const newTeacher = await DatabaseService.getTeacherById(id);
      
      if (newTeacher) {
        dispatch({ type: 'ADD_TEACHER', payload: newTeacher });
      }
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
      throw error;
    }
  };

  const updateTeacher = async (id: string, data: Partial<Teacher>) => {
    try {
      await DatabaseService.updateTeacher(id, data);
      dispatch({ type: 'UPDATE_TEACHER', payload: { id, data } });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
      throw error;
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      await DatabaseService.deleteTeacher(id);
      dispatch({ type: 'DELETE_TEACHER', payload: id });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'teachers', error: error.message } });
      throw error;
    }
  };

  const loadClasses = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'classes', value: true } });
      dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: null } });
      
      const schoolId = getSchoolId();
      const classes = await DatabaseService.getClasses(schoolId, state.filters);
      
      dispatch({ type: 'SET_CLASSES', payload: classes });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'classes', value: false } });
    }
  }, [user?.profile?.schoolId, state.filters]);

  const addClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const schoolId = getSchoolId();
      const id = await DatabaseService.createClass({ ...classData, schoolId });
      const newClass = await DatabaseService.getClassById(id);
      
      if (newClass) {
        dispatch({ type: 'ADD_CLASS', payload: newClass });
      }
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
      throw error;
    }
  };

  const updateClass = async (id: string, data: Partial<Class>) => {
    try {
      await DatabaseService.updateClass(id, data);
      dispatch({ type: 'UPDATE_CLASS', payload: { id, data } });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
      throw error;
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await DatabaseService.deleteClass(id);
      dispatch({ type: 'DELETE_CLASS', payload: id });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'classes', error: error.message } });
      throw error;
    }
  };

  // Subject methods
  const addSubject = async (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const schoolId = getSchoolId();
      const id = await DatabaseService.createSubject({ ...subjectData, schoolId });
      const newSubject = { ...subjectData, id, schoolId, createdAt: new Date(), updatedAt: new Date() };
      dispatch({ type: 'ADD_SUBJECT', payload: newSubject });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'subjects', error: error.message } });
      throw error;
    }
  };

  const updateSubject = async (id: string, data: Partial<Subject>) => {
    try {
      await DatabaseService.updateSubject(id, data);
      dispatch({ type: 'UPDATE_SUBJECT', payload: { id, data } });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'subjects', error: error.message } });
      throw error;
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await DatabaseService.deleteSubject(id);
      dispatch({ type: 'DELETE_SUBJECT', payload: id });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'subjects', error: error.message } });
      throw error;
    }
  };

  const loadSubjects = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'subjects', value: true } });
      const schoolId = getSchoolId();
      const subjects = await DatabaseService.getSubjects(schoolId);
      dispatch({ type: 'SET_SUBJECTS', payload: subjects });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'subjects', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'subjects', value: false } });
    }
  }, [user?.profile?.schoolId]);

  const loadAttendance = useCallback(async (date?: Date) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'attendance', value: true } });
      const schoolId = getSchoolId();
      const attendance = await DatabaseService.getAttendance(schoolId, date);
      dispatch({ type: 'SET_ATTENDANCE', payload: attendance });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'attendance', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'attendance', value: false } });
    }
  }, [user?.profile?.schoolId]);

  const addAttendance = async (attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newAttendance = await DatabaseService.createAttendance(attendanceData);
      dispatch({ type: 'ADD_ATTENDANCE', payload: newAttendance });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'attendance', error: error.message } });
      throw error;
    }
  };

  const updateAttendance = async (id: string, data: Partial<Attendance>) => {
    try {
      const updatedAttendance = await DatabaseService.updateAttendance(id, data);
      dispatch({ type: 'UPDATE_ATTENDANCE', payload: { id, data: updatedAttendance } });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'attendance', error: error.message } });
      throw error;
    }
  };

  const deleteAttendance = async (id: string) => {
    try {
      await DatabaseService.deleteAttendance(id);
      dispatch({ type: 'DELETE_ATTENDANCE', payload: id });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'attendance', error: error.message } });
      throw error;
    }
  };

  const loadExams = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: { key: 'exams', value: true } });
      const schoolId = getSchoolId();
      const exams = await DatabaseService.getExams(schoolId);
      dispatch({ type: 'SET_EXAMS', payload: exams });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'exams', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'exams', value: false } });
    }
  }, [user?.profile?.schoolId]);

  const addExam = async (examData: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const examId = await DatabaseService.createExam(examData);
      const newExam = { 
        ...examData, 
        id: examId, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      } as Exam;
      dispatch({ type: 'ADD_EXAM', payload: newExam });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'exams', error: error.message } });
      throw error;
    }
  };

  const updateExam = async (id: string, data: Partial<Exam>) => {
    try {
      const updatedExam = await DatabaseService.updateExam(id, data);
      dispatch({ type: 'UPDATE_EXAM', payload: { id, data: updatedExam } });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'exams', error: error.message } });
      throw error;
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await DatabaseService.deleteExam(id);
      dispatch({ type: 'DELETE_EXAM', payload: id });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'exams', error: error.message } });
      throw error;
    }
  };

  const loadDashboardData = useCallback(async () => {
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
      
      // Calculate attendance rate (will be recalculated when students data loads)
      const todayAttendance = await DatabaseService.getAttendance(schoolId, new Date());
      // Note: We'll calculate attendance rate in a separate effect when students data changes
      
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'dashboard', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'dashboard', value: false } });
    }
  }, [loadStudents, loadTeachers, loadClasses, loadSubjects]);

  const setFilters = (filters: Partial<StoreState['filters']>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Settings methods
  const loadSchool = useCallback(async () => {
    try {
      if (!user?.profile?.schoolId) {
        throw new Error('No school ID found');
      }
      
      dispatch({ type: 'SET_LOADING', payload: { key: 'school', value: true } });
      
      const school = await DatabaseService.getSchool(user.profile.schoolId);
      if (school) {
        dispatch({ type: 'SET_SCHOOL', payload: school });
      }
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'school', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'school', value: false } });
    }
  }, [user?.profile?.schoolId]);

  const updateSchool = async (data: Partial<School>) => {
    try {
      if (!user?.profile?.schoolId) {
        throw new Error('No school ID found');
      }
      
      dispatch({ type: 'SET_LOADING', payload: { key: 'school', value: true } });
      
      await DatabaseService.updateSchool(user.profile.schoolId, data);
      
      // Reload school data
      const updatedSchool = await DatabaseService.getSchool(user.profile.schoolId);
      if (updatedSchool) {
        dispatch({ type: 'SET_SCHOOL', payload: updatedSchool });
      }
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'school', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'school', value: false } });
    }
  };

  const updateUserPreferences = async (preferences: any) => {
    try {
      if (!user?.uid) {
        throw new Error('No user ID found');
      }
      
      dispatch({ type: 'SET_LOADING', payload: { key: 'preferences', value: true } });
      
      // Update user preferences in database (this would be implemented in DatabaseService)
      // For now, just update local state
      dispatch({ type: 'SET_USER_PREFERENCES', payload: preferences });
    } catch (error: any) {dispatch({ type: 'SET_ERROR', payload: { key: 'preferences', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'preferences', value: false } });
    }
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  // Auto-load data when user changes
  useEffect(() => {
    if (user?.profile?.schoolId) {
      loadDashboardData();
    }
  }, [user?.profile?.schoolId, loadDashboardData]);

  // Calculate attendance rate when students data changes
  useEffect(() => {
    const calculateAttendanceRate = async () => {
      if (state.students.length > 0 && user?.profile?.schoolId) {
        try {
          const schoolId = getSchoolId();
          const todayAttendance = await DatabaseService.getAttendance(schoolId, new Date());
          const totalStudents = state.students.length;
          const presentStudents = todayAttendance.filter((att: Attendance) => att.status === 'present').length;
          const attendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
          
          dispatch({ type: 'SET_STATS', payload: { attendanceRate } });
        } catch (error: any) {}
      }
    };

    calculateAttendanceRate();
  }, [state.students.length, user?.profile?.schoolId]);

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
    addSubject,
    updateSubject,
    deleteSubject,
    loadAttendance,
    addAttendance,
    updateAttendance,
    deleteAttendance,
    loadExams,
    addExam,
    updateExam,
    deleteExam,
    loadDashboardData,
    loadSchool,
    updateSchool,
    updateUserPreferences,
    setFilters,
    clearErrors,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}
