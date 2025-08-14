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
  limit,
  startAfter,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Generic types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student extends BaseEntity {
  studentId: string;
  name: string;
  email?: string;
  grade: string;
  section: string;
  gender: 'Male' | 'Female';
  contactNumber?: string;
  parentEmail?: string;
  parentPhone?: string;
  address?: string;
  dateOfBirth?: Date;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Transferred';
  schoolId: string;
}

export interface Teacher extends BaseEntity {
  teacherId: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  qualification: string;
  contactNumber: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  schoolId: string;
}

export interface Class extends BaseEntity {
  className: string;
  grade: string;
  section: string;
  teacherId: string;
  subjects: string[];
  studentIds: string[];
  maxStudents: number;
  schoolId: string;
}

// Database service class
export class DatabaseService {
  // Generic CRUD operations
  static async create<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const now = new Date();
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      });
      return docRef.id;
    } catch (error) {
      console.error(`Error creating ${collectionName}:`, error);
      throw error;
    }
  }

  static async getById<T extends BaseEntity>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${collectionName} by ID:`, error);
      throw error;
    }
  }

  static async getAll<T extends BaseEntity>(
    collectionName: string, 
    filters?: { field: string; operator: any; value: any }[],
    orderByField?: string,
    limitCount?: number
  ): Promise<T[]> {
    try {
      let q = query(collection(db, collectionName));
      
      // Apply filters
      if (filters) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }

      // Apply ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField));
      }

      // Apply limit
      if (limitCount) {
        q = query(q, limit(limitCount));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as T[];
    } catch (error) {
      console.error(`Error getting all ${collectionName}:`, error);
      throw error;
    }
  }

  static async update<T>(collectionName: string, id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    }
  }

  static async delete(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting ${collectionName}:`, error);
      throw error;
    }
  }

  // Specific methods for students
  static async getStudentsByClass(grade: string, section: string, schoolId: string): Promise<Student[]> {
    return this.getAll<Student>('students', [
      { field: 'grade', operator: '==', value: grade },
      { field: 'section', operator: '==', value: section },
      { field: 'schoolId', operator: '==', value: schoolId },
      { field: 'status', operator: '==', value: 'Active' }
    ], 'name');
  }

  static async getTeachersByDepartment(department: string, schoolId: string): Promise<Teacher[]> {
    return this.getAll<Teacher>('teachers', [
      { field: 'department', operator: '==', value: department },
      { field: 'schoolId', operator: '==', value: schoolId },
      { field: 'status', operator: '==', value: 'Active' }
    ], 'name');
  }

  static async getClassesByTeacher(teacherId: string, schoolId: string): Promise<Class[]> {
    return this.getAll<Class>('classes', [
      { field: 'teacherId', operator: '==', value: teacherId },
      { field: 'schoolId', operator: '==', value: schoolId }
    ], 'className');
  }

  // Analytics methods
  static async getStudentCount(schoolId: string): Promise<number> {
    const students = await this.getAll<Student>('students', [
      { field: 'schoolId', operator: '==', value: schoolId },
      { field: 'status', operator: '==', value: 'Active' }
    ]);
    return students.length;
  }

  static async getTeacherCount(schoolId: string): Promise<number> {
    const teachers = await this.getAll<Teacher>('teachers', [
      { field: 'schoolId', operator: '==', value: schoolId },
      { field: 'status', operator: '==', value: 'Active' }
    ]);
    return teachers.length;
  }

  static async getClassCount(schoolId: string): Promise<number> {
    const classes = await this.getAll<Class>('classes', [
      { field: 'schoolId', operator: '==', value: schoolId }
    ]);
    return classes.length;
  }
}

// Utility functions for data seeding (development only)
export async function seedDemoData(schoolId: string) {
  if (process.env.NODE_ENV !== 'development') return;

  try {
    console.log('Seeding demo data...');

    // Create demo students
    const demoStudents: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        studentId: 'STU001',
        name: 'John Doe',
        grade: '10',
        section: 'A',
        gender: 'Male',
        contactNumber: '+233123456789',
        email: 'john.doe@student.school',
        status: 'Active',
        schoolId
      },
      {
        studentId: 'STU002',
        name: 'Jane Smith',
        grade: '10',
        section: 'B',
        gender: 'Female',
        contactNumber: '+233123456790',
        email: 'jane.smith@student.school',
        status: 'Active',
        schoolId
      }
    ];

    for (const student of demoStudents) {
      await DatabaseService.create<Student>('students', student);
    }

    // Create demo teachers
    const demoTeachers: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        teacherId: 'TCH001',
        name: 'Dr. Robert Anderson',
        email: 'robert.anderson@teacher.school',
        department: 'Science',
        subjects: ['Physics', 'Chemistry'],
        qualification: 'Ph.D',
        contactNumber: '+233123456791',
        status: 'Active',
        schoolId
      },
      {
        teacherId: 'TCH002',
        name: 'Mrs. Sarah Johnson',
        email: 'sarah.johnson@teacher.school',
        department: 'Mathematics',
        subjects: ['Algebra', 'Geometry'],
        qualification: 'M.Sc',
        contactNumber: '+233123456792',
        status: 'Active',
        schoolId
      }
    ];

    for (const teacher of demoTeachers) {
      await DatabaseService.create<Teacher>('teachers', teacher);
    }

    console.log('Demo data seeded successfully!');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
}
