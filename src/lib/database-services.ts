// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  writeBatch,
  DocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== TYPE DEFINITIONS ====================

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  establishedYear: number;
  principalName: string;
  totalStudents: number;
  totalTeachers: number;
  academicYear: string;
  
  // 🔐 Subscription Management Fields
  subscription: {
    plan: 'free' | 'basic' | 'standard' | 'premium' | 'enterprise';
    status: 'active' | 'grace_period' | 'restricted' | 'suspended';
    currentTermStart: Date;
    currentTermEnd: Date;
    nextBillingDate: Date;
    gracePeriodEnd?: Date; // 10 days after due date
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    features: string[]; // List of enabled features
    
    // Term-based billing
    currentTerm: {
      name: string; // e.g., "Term 1 2024/2025"
      startDate: Date;
      endDate: Date;
      studentCount: number; // Students enrolled at billing time
      amountCharged: number;
    };
  };
  
  // 📊 Usage & Limits
  usage: {
    currentStudents: number;
    currentTeachers: number;
    currentClasses: number;
    storageUsed: number; // in MB
    monthlyActiveUsers: number;
  };
  
  // 💰 Payment Information
  billing: {
    contactEmail: string;
    contactPhone: string;
    address?: string;
    currency: 'NGN' | 'USD' | 'EUR' | 'GBP' | 'GHS';
    paymentMethod?: 'card' | 'bank_transfer' | 'mobile_money';
    lastInvoiceId?: string;
    nextInvoiceAmount?: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface GuardianInfo {
  id?: string; // Optional unique ID for the guardian
  name: string;
  relationship: 'father' | 'mother' | 'guardian' | 'grandparent' | 'uncle' | 'aunt' | 'sibling' | 'other';
  phone: string;
  email?: string;
  address?: string;
  occupation?: string;
  workplace?: string;
  workPhone?: string;
  isPrimary: boolean; // Designates primary contact
  isEmergencyContact: boolean; // Can be contacted in emergencies
  canPickup: boolean; // Authorized to pick up student
  hasFinancialResponsibility: boolean; // Responsible for fees
  notes?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  studentId: string; // unique student ID like "STU001"
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  guardians: GuardianInfo[]; // Array of guardians/parents
  classId: string;
  grade: string;
  section: string;
  rollNumber: number;
  admissionDate: Date;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  profilePicture?: string;
  medicalInfo?: string;
  bloodGroup?: string;
  religion?: string;
  nationality: string;
  previousSchool?: string;
  feesPaid: boolean;
  hostelResident: boolean;
  transportRequired: boolean;
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  schoolId: string;
  teacherId: string; // unique teacher ID like "TCH001"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  qualification: string;
  experience: number; // years
  department: string;
  subjects: string[]; // subject IDs
  classes: string[]; // class IDs
  designation: string; // "Head Teacher", "Subject Teacher", etc.
  joiningDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'resigned';
  profilePicture?: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodGroup?: string;
  bankAccount?: string;
  panNumber?: string;
  aadharNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string; // "Class 10A"
  grade: string; // "10"
  section: string; // "A"
  classTeacherId: string;
  subjects: string[]; // subject IDs
  students: string[]; // student IDs
  maxCapacity: number;
  currentStrength: number;
  roomNumber: string;
  academicYear: string;
  schedule: {
    [day: string]: {
      [period: string]: {
        subjectId: string;
        teacherId: string;
        startTime: string;
        endTime: string;
      };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string; // "MATH", "ENG", etc.
  description?: string;
  grade: string;
  type: 'core' | 'elective' | 'language' | 'practical';
  credits: number;
  totalMarks: number;
  passingMarks: number;
  teacherIds: string[];
  classIds: string[];
  syllabus?: string;
  books?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  date: Date;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: Date;
  checkOutTime?: Date;
  remarks?: string;
  markedBy: string; // teacher ID
  period?: number;
  subject?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exam {
  id: string;
  schoolId: string;
  name: string;
  type: 'midterm' | 'final' | 'monthly' | 'weekly' | 'surprise';
  description?: string;
  classIds: string[];
  subjectId: string;
  teacherId: string;
  totalMarks: number;
  passingMarks: number;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  instructions?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  results?: {
    [studentId: string]: {
      marksObtained: number;
      grade: string;
      rank?: number;
      remarks?: string;
    };
  };
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fee {
  id: string;
  schoolId: string;
  studentId: string;
  academicYear: string;
  feeType: 'tuition' | 'admission' | 'examination' | 'transport' | 'hostel' | 'library' | 'laboratory' | 'sports' | 'other';
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  paymentMethod?: 'cash' | 'cheque' | 'card' | 'online' | 'bank_transfer';
  transactionId?: string;
  remarks?: string;
  waiveReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  schoolId: string;
  profileId?: string; // points to student/teacher/parent document
  isActive: boolean;
  lastLogin?: Date;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ==================== UTILITY FUNCTIONS ====================

const prepareDocumentForFirestore = (data: Record<string, unknown>) => {
  const prepared = { ...data };
  
  // Convert Date objects to Timestamps
  Object.keys(prepared).forEach(key => {
    if (prepared[key] instanceof Date) {
      prepared[key] = Timestamp.fromDate(prepared[key] as Date);
    }
  });
  
  // Remove undefined values
  Object.keys(prepared).forEach(key => {
    if (prepared[key] === undefined) {
      delete prepared[key];
    }
  });
  
  return prepared;
};

const processDocumentFromFirestore = (doc: DocumentSnapshot<DocumentData>) => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  if (!data) return null;
  
  const processed: Record<string, unknown> = { id: doc.id, ...data };
  
  // Convert Timestamps back to Dates
  Object.keys(processed).forEach(key => {
    if (processed[key] instanceof Timestamp) {
      processed[key] = (processed[key] as Timestamp).toDate();
    }
  });
  
  return processed;
};

// ==================== DATABASE SERVICE CLASS ====================

export class DatabaseService {
  // ==================== SCHOOL METHODS ====================
  
  static async getSchool(schoolId: string): Promise<School | null> {
    try {
      const docRef = doc(db, 'schools', schoolId);
      const docSnap = await getDoc(docRef);
      return processDocumentFromFirestore(docSnap) as School | null;
    } catch (error) {

      throw error;
    }
  }
  
  static async createSchool(schoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...schoolData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'schools'), data);
      return docRef.id;
    } catch (error) {

      throw error;
    }
  }

  static async updateSchool(id: string, updateData: Partial<Omit<School, 'id' | 'createdAt'>>): Promise<School> {
    try {
      const data = prepareDocumentForFirestore({
        ...updateData,
        updatedAt: new Date(),
      });
      
      const docRef = doc(db, 'schools', id);
      await updateDoc(docRef, data);
      
      const updatedDoc = await getDoc(docRef);
      return processDocumentFromFirestore(updatedDoc) as School;
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== STUDENT METHODS ====================
  
  static async getStudents(
    schoolId: string,
    filters?: { studentGrade?: string; studentSection?: string }
  ): Promise<Student[]> {
    try {
      let q = query(
        collection(db, 'students'),
        where('schoolId', '==', schoolId),
        orderBy('firstName')
      );
      
      if (filters?.studentGrade) {
        q = query(q, where('grade', '==', filters.studentGrade));
      }
      
      if (filters?.studentSection) {
        q = query(q, where('section', '==', filters.studentSection));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map(doc => processDocumentFromFirestore(doc))
        .filter(doc => doc !== null) as unknown as Student[];
    } catch (error) {

      throw error;
    }
  }
  
  static async getStudentById(id: string): Promise<Student | null> {
    try {
      const docRef = doc(db, 'students', id);
      const docSnap = await getDoc(docRef);
      return processDocumentFromFirestore(docSnap) as unknown as Student | null;
    } catch (error: unknown) {

      throw error;
    }
  }
  
  static async createStudent(studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...studentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'students'), data);
      return docRef.id;
    } catch (error) {

      throw error;
    }
  }
  
  static async updateStudent(id: string, studentData: Partial<Student>): Promise<void> {
    try {
      const data = prepareDocumentForFirestore({
        ...studentData,
        updatedAt: new Date(),
      });
      
      const docRef = doc(db, 'students', id);
      await updateDoc(docRef, data);
    } catch (error) {

      throw error;
    }
  }
  
  static async deleteStudent(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'students', id);
      await deleteDoc(docRef);
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== TEACHER METHODS ====================
  
  static async getTeachers(
    schoolId: string,
    filters?: { teacherDepartment?: string }
  ): Promise<Teacher[]> {
    try {
      let q = query(
        collection(db, 'teachers'),
        where('schoolId', '==', schoolId),
        orderBy('firstName')
      );
      
      if (filters?.teacherDepartment) {
        q = query(q, where('department', '==', filters.teacherDepartment));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc)) as unknown as Teacher[];
    } catch (error: unknown) {

      throw error;
    }
  }
  
  static async getTeacherById(id: string): Promise<Teacher | null> {
    try {
      const docRef = doc(db, 'teachers', id);
      const docSnap = await getDoc(docRef);
      return processDocumentFromFirestore(docSnap) as Teacher | null;
    } catch (error) {

      throw error;
    }
  }
  
  static async createTeacher(teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...teacherData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'teachers'), data);
      return docRef.id;
    } catch (error) {

      throw error;
    }
  }
  
  static async updateTeacher(id: string, teacherData: Partial<Teacher>): Promise<void> {
    try {
      const data = prepareDocumentForFirestore({
        ...teacherData,
        updatedAt: new Date(),
      });
      
      const docRef = doc(db, 'teachers', id);
      await updateDoc(docRef, data);
    } catch (error) {

      throw error;
    }
  }
  
  static async deleteTeacher(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'teachers', id);
      await deleteDoc(docRef);
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== CLASS METHODS ====================
  
  static async getClasses(
    schoolId: string,
    filters?: { classGrade?: string }
  ): Promise<Class[]> {
    try {
      let q = query(
        collection(db, 'classes'),
        where('schoolId', '==', schoolId),
        orderBy('grade'),
        orderBy('section')
      );
      
      if (filters?.classGrade) {
        q = query(q, where('grade', '==', filters.classGrade));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc) as Class);
    } catch (error) {

      throw error;
    }
  }
  
  static async getClassById(id: string): Promise<Class | null> {
    try {
      const docRef = doc(db, 'classes', id);
      const docSnap = await getDoc(docRef);
      return processDocumentFromFirestore(docSnap) as Class | null;
    } catch (error) {

      throw error;
    }
  }
  
  static async createClass(classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...classData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'classes'), data);
      return docRef.id;
    } catch (error) {

      throw error;
    }
  }
  
  static async updateClass(id: string, classData: Partial<Class>): Promise<void> {
    try {
      const data = prepareDocumentForFirestore({
        ...classData,
        updatedAt: new Date(),
      });
      
      const docRef = doc(db, 'classes', id);
      await updateDoc(docRef, data);
    } catch (error) {

      throw error;
    }
  }
  
  static async deleteClass(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'classes', id);
      await deleteDoc(docRef);
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== SUBJECT METHODS ====================
  
  static async getSubjects(schoolId: string, grade?: string): Promise<Subject[]> {
    try {
      let q = query(
        collection(db, 'subjects'),
        where('schoolId', '==', schoolId),
        orderBy('name')
      );
      
      if (grade) {
        q = query(q, where('grade', '==', grade));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc) as Subject);
    } catch (error) {

      throw error;
    }
  }
  
  static async getSubjectById(id: string): Promise<Subject | null> {
    try {
      const docRef = doc(db, 'subjects', id);
      const docSnap = await getDoc(docRef);
      return processDocumentFromFirestore(docSnap) as Subject | null;
    } catch (error) {

      throw error;
    }
  }
  
  static async createSubject(subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...subjectData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'subjects'), data);
      return docRef.id;
    } catch (error) {

      throw error;
    }
  }
  
  static async updateSubject(id: string, subjectData: Partial<Subject>): Promise<void> {
    try {
      const data = prepareDocumentForFirestore({
        ...subjectData,
        updatedAt: new Date(),
      });
      
      const docRef = doc(db, 'subjects', id);
      await updateDoc(docRef, data);
    } catch (error) {

      throw error;
    }
  }
  
  static async deleteSubject(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'subjects', id);
      await deleteDoc(docRef);
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== ATTENDANCE METHODS ====================
  
  static async getAttendance(
    schoolId: string,
    date?: Date,
    classId?: string,
    studentId?: string
  ): Promise<Attendance[]> {
    try {
      let q = query(
        collection(db, 'attendance'),
        where('schoolId', '==', schoolId)
      );
      
      if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        q = query(q, 
          where('date', '>=', Timestamp.fromDate(startOfDay)),
          where('date', '<=', Timestamp.fromDate(endOfDay))
        );
      }
      
      if (classId) {
        q = query(q, where('classId', '==', classId));
      }
      
      if (studentId) {
        q = query(q, where('studentId', '==', studentId));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc) as Attendance);
    } catch (error) {

      throw error;
    }
  }
  
  static async markAttendance(attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...attendanceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'attendance'), data);
      return docRef.id;
    } catch (error) {

      throw error;
    }
  }

  static async createAttendance(attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>): Promise<Attendance> {
    try {
      const data = prepareDocumentForFirestore({
        ...attendanceData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'attendance'), data);
      const newDoc = await getDoc(docRef);
      return processDocumentFromFirestore(newDoc) as Attendance;
    } catch (error) {

      throw error;
    }
  }

  static async updateAttendance(id: string, updateData: Partial<Omit<Attendance, 'id' | 'createdAt'>>): Promise<Attendance> {
    try {
      const data = prepareDocumentForFirestore({
        ...updateData,
        updatedAt: new Date(),
      });
      
      const docRef = doc(db, 'attendance', id);
      await updateDoc(docRef, data);
      
      const updatedDoc = await getDoc(docRef);
      return processDocumentFromFirestore(updatedDoc) as Attendance;
    } catch (error) {

      throw error;
    }
  }

  static async deleteAttendance(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'attendance', id);
      await deleteDoc(docRef);
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== EXAM METHODS ====================
  
  static async getExams(schoolId: string, classId?: string): Promise<Exam[]> {
    try {
      let q = query(
        collection(db, 'exams'),
        where('schoolId', '==', schoolId),
        orderBy('date', 'desc')
      );
      
      if (classId) {
        q = query(q, where('classIds', 'array-contains', classId));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc) as Exam);
    } catch (error) {

      throw error;
    }
  }
  
  static async createExam(examData: Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...examData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'exams'), data);
      return docRef.id;
    } catch (error) {

      throw error;
    }
  }

  static async updateExam(id: string, updateData: Partial<Omit<Exam, 'id' | 'createdAt'>>): Promise<Exam> {
    try {
      const data = prepareDocumentForFirestore({
        ...updateData,
        updatedAt: new Date(),
      });
      
      const docRef = doc(db, 'exams', id);
      await updateDoc(docRef, data);
      
      const updatedDoc = await getDoc(docRef);
      return processDocumentFromFirestore(updatedDoc) as Exam;
    } catch (error) {

      throw error;
    }
  }

  static async deleteExam(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'exams', id);
      await deleteDoc(docRef);
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== FEE METHODS ====================
  
  static async getFees(schoolId: string, studentId?: string): Promise<Fee[]> {
    try {
      let q = query(
        collection(db, 'fees'),
        where('schoolId', '==', schoolId),
        orderBy('dueDate', 'desc')
      );
      
      if (studentId) {
        q = query(q, where('studentId', '==', studentId));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc) as Fee);
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== USER METHODS ====================
  
  static async getUserProfile(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      return processDocumentFromFirestore(docSnap) as User | null;
    } catch (error) {

      throw error;
    }
  }
  
  static async createUserProfile(userProfile: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const data = prepareDocumentForFirestore({
        ...userProfile,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const docRef = await addDoc(collection(db, 'users'), data);
      return docRef.id;
    } catch (error: unknown) {

      throw error;
    }
  }

  static async getAllUsers(schoolId?: string): Promise<User[]> {
    try {
      let q = collection(db, 'users');
      
      if (schoolId) {
        q = query(collection(db, 'users'), where('schoolId', '==', schoolId));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc) as User);
    } catch (error) {

      throw error;
    }
  }

  static async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const data = prepareDocumentForFirestore({
        ...updates,
        updatedAt: new Date(),
      });
      
      await updateDoc(userRef, data);
    } catch (error) {

      throw error;
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {

      throw error;
    }
  }

  static async getUsersByRole(role: string, schoolId?: string): Promise<User[]> {
    try {
      let q = query(collection(db, 'users'), where('role', '==', role));
      
      if (schoolId) {
        q = query(collection(db, 'users'), where('role', '==', role), where('schoolId', '==', schoolId));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => processDocumentFromFirestore(doc) as User);
    } catch (error) {

      throw error;
    }
  }

  static async toggleUserStatus(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        await updateDoc(userRef, {
          isActive: !userData.isActive,
          updatedAt: Timestamp.fromDate(new Date())
        });
      }
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== BATCH OPERATIONS ====================
  
  static async batchCreateStudents(studentsData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const ids: string[] = [];
      
      studentsData.forEach(studentData => {
        const docRef = doc(collection(db, 'students'));
        const data = prepareDocumentForFirestore({
          ...studentData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        batch.set(docRef, data);
        ids.push(docRef.id);
      });
      
      await batch.commit();
      return ids;
    } catch (error) {

      throw error;
    }
  }
  
  static async batchMarkAttendance(attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const ids: string[] = [];
      
      attendanceData.forEach(attendance => {
        const docRef = doc(collection(db, 'attendance'));
        const data = prepareDocumentForFirestore({
          ...attendance,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        
        batch.set(docRef, data);
        ids.push(docRef.id);
      });
      
      await batch.commit();
      return ids;
    } catch (error) {

      throw error;
    }
  }
  
  // ==================== REAL-TIME LISTENERS ====================
  
  static subscribeToStudents(
    schoolId: string,
    callback: (students: Student[]) => void,
    filters?: { studentGrade?: string; studentSection?: string }
  ): () => void {
    let q = query(
      collection(db, 'students'),
      where('schoolId', '==', schoolId),
      orderBy('firstName')
    );
    
    if (filters?.studentGrade) {
      q = query(q, where('grade', '==', filters.studentGrade));
    }
    
    if (filters?.studentSection) {
      q = query(q, where('section', '==', filters.studentSection));
    }
    
    return onSnapshot(q, (snapshot) => {
      const students = snapshot.docs.map(doc => processDocumentFromFirestore(doc) as Student);
      callback(students);
    });
  }
  
  static subscribeToAttendance(
    schoolId: string,
    date: Date,
    callback: (attendance: Attendance[]) => void
  ): () => void {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const q = query(
      collection(db, 'attendance'),
      where('schoolId', '==', schoolId),
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay))
    );
    
    return onSnapshot(q, (snapshot) => {
      const attendance = snapshot.docs.map(doc => processDocumentFromFirestore(doc) as Attendance);
      callback(attendance);
    });
  }
  
  // ==================== ANALYTICS METHODS ====================
  
  static async getSchoolStatistics(schoolId: string): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSubjects: number;
    todayAttendanceRate: number;
    activeExams: number;
    pendingFees: number;
  }> {
    try {
      const [
        studentsSnapshot,
        teachersSnapshot,
        classesSnapshot,
        subjectsSnapshot,
        todayAttendance,
        activeExams,
        pendingFees
      ] = await Promise.all([
        getDocs(query(collection(db, 'students'), where('schoolId', '==', schoolId))),
        getDocs(query(collection(db, 'teachers'), where('schoolId', '==', schoolId))),
        getDocs(query(collection(db, 'classes'), where('schoolId', '==', schoolId))),
        getDocs(query(collection(db, 'subjects'), where('schoolId', '==', schoolId))),
        this.getAttendance(schoolId, new Date()),
        getDocs(query(collection(db, 'exams'), where('schoolId', '==', schoolId), where('status', '==', 'active'))),
        getDocs(query(collection(db, 'fees'), where('schoolId', '==', schoolId), where('status', '==', 'pending')))
      ]);
      
      const totalStudents = studentsSnapshot.size;
      const presentToday = todayAttendance.filter((att: Attendance) => att.status === 'present').length;
      const todayAttendanceRate = totalStudents > 0 ? (presentToday / totalStudents) * 100 : 0;
      
      return {
        totalStudents,
        totalTeachers: teachersSnapshot.size,
        totalClasses: classesSnapshot.size,
        totalSubjects: subjectsSnapshot.size,
        todayAttendanceRate,
        activeExams: activeExams.size,
        pendingFees: pendingFees.size,
      };
    } catch (error) {

      throw error;
    }
  }
}

// ==================== EXPORTED UTILITY FUNCTIONS ====================

// Export convenience functions for bulk operations
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    return studentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateOfBirth: doc.data().dateOfBirth?.toDate() || new Date(),
      admissionDate: doc.data().admissionDate?.toDate() || new Date(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Student[];
  } catch (error) {
    console.error('Error getting all students:', error);
    throw error;
  }
};

export const getAllClasses = async (): Promise<Class[]> => {
  try {
    const classesSnapshot = await getDocs(collection(db, 'classes'));
    return classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Class[];
  } catch (error) {
    console.error('Error getting all classes:', error);
    throw error;
  }
};

export const addMultipleStudents = async (students: Partial<Student>[]): Promise<Student[]> => {
  try {
    const batch = writeBatch(db);
    const results: Student[] = [];
    
    // Process students in batches of 500 (Firestore limit)
    const batchSize = 500;
    
    for (let i = 0; i < students.length; i += batchSize) {
      const currentBatch = students.slice(i, i + batchSize);
      
      for (const studentData of currentBatch) {
        const docRef = doc(collection(db, 'students'));
        
        const studentWithTimestamps = {
          ...studentData,
          dateOfBirth: studentData.dateOfBirth ? Timestamp.fromDate(new Date(studentData.dateOfBirth)) : Timestamp.now(),
          admissionDate: studentData.admissionDate ? Timestamp.fromDate(new Date(studentData.admissionDate)) : Timestamp.now(),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        
        batch.set(docRef, studentWithTimestamps);
        
        results.push({
          id: docRef.id,
          ...studentData,
          dateOfBirth: studentData.dateOfBirth || new Date(),
          admissionDate: studentData.admissionDate || new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Student);
      }
      
      // Commit the batch
      await batch.commit();
    }
    
    return results;
  } catch (error) {
    console.error('Error adding multiple students:', error);
    throw error;
  }
};

// ==================== SUBSCRIPTION MANAGEMENT ====================

/**
 * Update school subscription status
 */
export const updateSubscriptionStatus = async (
  schoolId: string, 
  status: School['subscription']['status']
): Promise<void> => {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, {
      'subscription.status': status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};

/**
 * Update school subscription plan with term-based billing
 */
export const updateSubscriptionPlan = async (
  schoolId: string,
  plan: School['subscription']['plan'],
  features: string[],
  termInfo: {
    name: string;
    startDate: Date;
    endDate: Date;
    studentCount: number;
    amountCharged: number;
  }
): Promise<void> => {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, {
      'subscription.plan': plan,
      'subscription.features': features,
      'subscription.status': 'active',
      'subscription.currentTermStart': Timestamp.fromDate(termInfo.startDate),
      'subscription.currentTermEnd': Timestamp.fromDate(termInfo.endDate),
      'subscription.nextBillingDate': Timestamp.fromDate(termInfo.endDate),
      'subscription.currentTerm': {
        name: termInfo.name,
        startDate: Timestamp.fromDate(termInfo.startDate),
        endDate: Timestamp.fromDate(termInfo.endDate),
        studentCount: termInfo.studentCount,
        amountCharged: termInfo.amountCharged,
      },
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw error;
  }
};

/**
 * Record payment for term-based subscription
 */
export const recordSubscriptionPayment = async (
  schoolId: string,
  amount: number,
  termInfo: {
    name: string;
    startDate: Date;
    endDate: Date;
    studentCount: number;
  },
  currency: string = 'GHS'
): Promise<void> => {
  try {
    const schoolRef = doc(db, 'schools', schoolId);

    await updateDoc(schoolRef, {
      'subscription.status': 'active',
      'subscription.lastPaymentDate': Timestamp.now(),
      'subscription.lastPaymentAmount': amount,
      'subscription.currentTermStart': Timestamp.fromDate(termInfo.startDate),
      'subscription.currentTermEnd': Timestamp.fromDate(termInfo.endDate),
      'subscription.nextBillingDate': Timestamp.fromDate(termInfo.endDate),
      'subscription.gracePeriodEnd': null, // Clear grace period
      'subscription.currentTerm': {
        name: termInfo.name,
        startDate: Timestamp.fromDate(termInfo.startDate),
        endDate: Timestamp.fromDate(termInfo.endDate),
        studentCount: termInfo.studentCount,
        amountCharged: amount,
      },
      'billing.lastPayment.amount': amount,
      'billing.lastPayment.currency': currency,
      'billing.lastPayment.date': Timestamp.now(),
      'billing.lastPayment.status': 'completed',
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error recording subscription payment:', error);
    throw error;
  }
};

/**
 * Update school usage statistics
 */
export const updateSchoolUsage = async (
  schoolId: string,
  usage: Partial<School['usage']>
): Promise<void> => {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    const updateData: any = { updatedAt: Timestamp.now() };
    
    // Build update object with proper field paths
    Object.entries(usage).forEach(([key, value]) => {
      updateData[`usage.${key}`] = value;
    });

    await updateDoc(schoolRef, updateData);
  } catch (error) {
    console.error('Error updating school usage:', error);
    throw error;
  }
};

/**
 * Get schools with overdue payments (for background processing)
 */
export const getOverdueSchools = async (): Promise<School[]> => {
  try {
    const now = Timestamp.now();
    const schoolsQuery = query(
      collection(db, 'schools'),
      where('subscription.currentTermEnd', '<', now),
      where('subscription.status', 'in', ['active', 'grace_period'])
    );
    
    const snapshot = await getDocs(schoolsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      subscription: {
        ...doc.data().subscription,
        currentTermStart: doc.data().subscription?.currentTermStart?.toDate() || new Date(),
        currentTermEnd: doc.data().subscription?.currentTermEnd?.toDate() || new Date(),
        nextBillingDate: doc.data().subscription?.nextBillingDate?.toDate() || new Date(),
        gracePeriodEnd: doc.data().subscription?.gracePeriodEnd?.toDate(),
        lastPaymentDate: doc.data().subscription?.lastPaymentDate?.toDate(),
        currentTerm: {
          ...doc.data().subscription?.currentTerm,
          startDate: doc.data().subscription?.currentTerm?.startDate?.toDate() || new Date(),
          endDate: doc.data().subscription?.currentTerm?.endDate?.toDate() || new Date(),
        }
      }
    })) as School[];
  } catch (error) {
    console.error('Error getting overdue schools:', error);
    throw error;
  }
};

/**
 * Trigger grace period for overdue school
 */
export const triggerGracePeriod = async (schoolId: string): Promise<void> => {
  try {
    const gracePeriodEnd = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days grace
    
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, {
      'subscription.status': 'grace_period',
      'subscription.gracePeriodEnd': Timestamp.fromDate(gracePeriodEnd),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error triggering grace period:', error);
    throw error;
  }
};

/**
 * Restrict school access after grace period
 */
export const restrictSchoolAccess = async (schoolId: string): Promise<void> => {
  try {
    const schoolRef = doc(db, 'schools', schoolId);
    await updateDoc(schoolRef, {
      'subscription.status': 'restricted',
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error restricting school access:', error);
    throw error;
  }
};

/**
 * Auto-calculate and update usage statistics for a school
 */
export const refreshSchoolUsageStats = async (schoolId: string): Promise<void> => {
  try {
    // Get current counts from collections
    const [studentsSnapshot, teachersSnapshot, classesSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'students'), where('schoolId', '==', schoolId))),
      getDocs(query(collection(db, 'teachers'), where('schoolId', '==', schoolId))),
      getDocs(query(collection(db, 'classes'), where('schoolId', '==', schoolId)))
    ]);

    const usage = {
      currentStudents: studentsSnapshot.size,
      currentTeachers: teachersSnapshot.size,
      currentClasses: classesSnapshot.size,
      lastUpdated: new Date(),
    };

    await updateSchoolUsage(schoolId, usage);
  } catch (error) {
    console.error('Error refreshing school usage stats:', error);
    throw error;
  }
};
