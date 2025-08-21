import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { DatabaseService, Teacher } from '@/lib/database-services';

export interface CreateTeacherAccountData {
  // Authentication fields
  email: string;
  password: string;
  
  // Teacher profile fields
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  qualification: string;
  experience: number;
  department: string;
  designation: string;
  joiningDate: Date;
  salary: number;
  emergencyContact: string;
  emergencyPhone: string;
  bloodGroup?: string;
  bankAccount?: string;
  panNumber?: string;
  aadharNumber?: string;
  profilePicture?: string;
  schoolId: string;
}

export interface TeacherAccountResult {
  firebaseUID: string;
  teacherId: string;
  teacher: Teacher;
}

/**
 * Service for creating teacher accounts with Firebase Auth + Firestore integration
 */
export class TeacherAccountService {
  
  /**
   * Create a complete teacher account (Firebase Auth + User Profile + Teacher Record)
   */
  static async createTeacherAccount(data: CreateTeacherAccountData): Promise<TeacherAccountResult> {
    try {
      console.log('🔥 Creating Firebase Auth account for:', data.email);
      
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const firebaseUID = userCredential.user.uid;
      console.log('✅ Firebase Auth user created with UID:', firebaseUID);
      
      // Step 2: Generate teacher business ID
      const teacherId = await this.generateTeacherId(data.schoolId);
      console.log('📝 Generated teacherId:', teacherId);
      
      // Step 3: Create user profile in Firestore
      const userProfile = {
        role: 'teacher' as const,
        profile: {
          name: `${data.firstName} ${data.lastName}`,
          schoolId: data.schoolId,
          department: data.department,
          createdAt: new Date()
        }
      };
      
      await setDoc(doc(db, 'users', firebaseUID), userProfile);
      console.log('✅ User profile created');
      
      // Step 4: Create teacher record using Firebase UID as document ID
      const teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'> = {
        schoolId: data.schoolId,
        userId: firebaseUID,
        teacherId: teacherId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        qualification: data.qualification,
        experience: data.experience,
        department: data.department,
        subjects: [], // Will be assigned later
        classes: [], // Will be assigned later
        designation: data.designation,
        joiningDate: data.joiningDate,
        salary: data.salary,
        status: 'active',
        profilePicture: data.profilePicture,
        emergencyContact: data.emergencyContact,
        emergencyPhone: data.emergencyPhone,
        bloodGroup: data.bloodGroup,
        bankAccount: data.bankAccount,
        panNumber: data.panNumber,
        aadharNumber: data.aadharNumber,
      };
      
      // Use the new method that takes Firebase UID
      await DatabaseService.createTeacher(teacherData, firebaseUID);
      console.log('✅ Teacher record created with document ID:', firebaseUID);
      
      // Step 5: Get the created teacher record
      const createdTeacher = await DatabaseService.getTeacherById(firebaseUID);
      if (!createdTeacher) {
        throw new Error('Failed to retrieve created teacher record');
      }
      
      return {
        firebaseUID,
        teacherId,
        teacher: createdTeacher
      };
      
    } catch (error) {
      console.error('❌ Error creating teacher account:', error);
      
      // Cleanup: If we created Firebase user but failed later, we should delete it
      // Note: In production, you might want more sophisticated cleanup
      if (error instanceof Error) {
        throw new Error(`Failed to create teacher account: ${error.message}`);
      }
      throw new Error('Failed to create teacher account due to unknown error');
    }
  }
  
  /**
   * Generate a unique teacher ID for the school
   */
  private static async generateTeacherId(schoolId: string): Promise<string> {
    try {
      // Get existing teachers to find the next available ID
      const teachers = await DatabaseService.getTeachers(schoolId);
      
      // Extract numeric parts from existing teacher IDs (e.g., "TCH001" -> 1)
      const existingNumbers = teachers
        .map(teacher => teacher.teacherId)
        .filter(id => id.startsWith('TCH'))
        .map(id => parseInt(id.replace('TCH', ''), 10))
        .filter(num => !isNaN(num));
      
      // Find the next available number
      const nextNumber = existingNumbers.length > 0 
        ? Math.max(...existingNumbers) + 1 
        : 1;
      
      // Format as TCH001, TCH002, etc.
      return `TCH${nextNumber.toString().padStart(3, '0')}`;
      
    } catch (error) {
      console.error('Error generating teacher ID:', error);
      // Fallback to timestamp-based ID
      const timestamp = Date.now().toString().slice(-6);
      return `TCH${timestamp}`;
    }
  }
  
  /**
   * Update teacher password (admin function)
   */
  static async updateTeacherPassword(teacherFirebaseUID: string, newPassword: string): Promise<void> {
    // Note: Updating password for another user requires Admin SDK
    // For now, this is a placeholder - implement with Firebase Admin SDK
    throw new Error('Password update requires Firebase Admin SDK implementation');
  }
  
  /**
   * Deactivate teacher account
   */
  static async deactivateTeacher(teacherFirebaseUID: string): Promise<void> {
    try {
      // Update teacher status in Firestore
      await DatabaseService.updateTeacher(teacherFirebaseUID, { status: 'inactive' });
      
      // Note: Disabling Firebase Auth user requires Admin SDK
      // For now, we just update the Firestore record
      console.log('✅ Teacher deactivated in Firestore');
      
    } catch (error) {
      console.error('Error deactivating teacher:', error);
      throw error;
    }
  }
}
