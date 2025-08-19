import { DatabaseService, Student, Teacher, Class, Subject, School, User } from './database-services';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

// ==================== DEMO DATA GENERATOR ====================

export class DemoDataSeeder {
  
  // ==================== DEMO USER ACCOUNTS ====================
  
  static readonly DEMO_USERS = [
    {
      email: 'admin@stmarysschool.edu.ng',
      password: 'Admin123!',
      role: 'admin' as const,
      firstName: 'Dr. Adebola',
      lastName: 'Johnson',
      designation: 'Principal',
    },
    {
      email: 'headteacher@stmarysschool.edu.ng',
      password: 'Teacher123!',
      role: 'admin' as const,
      firstName: 'Mrs. Grace',
      lastName: 'Okafor',
      designation: 'Head Teacher',
    },
    {
      email: 'j.adebayo@stmarysschool.edu.ng',
      password: 'Teacher123!',
      role: 'teacher' as const,
      firstName: 'John',
      lastName: 'Adebayo',
      designation: 'Mathematics Teacher',
    },
    {
      email: 's.okonkwo@stmarysschool.edu.ng',
      password: 'Teacher123!',
      role: 'teacher' as const,
      firstName: 'Sarah',
      lastName: 'Okonkwo',
      designation: 'English Teacher',
    },
    {
      email: 'student@stmarysschool.edu.ng',
      password: 'Student123!',
      role: 'student' as const,
      firstName: 'Chioma',
      lastName: 'Okwu',
      designation: 'Student',
    },
    {
      email: 'parent1@gmail.com',
      password: 'Parent123!',
      role: 'parent' as const,
      firstName: 'Mr. Emmanuel',
      lastName: 'Adebayo',
      designation: 'Parent',
    },
  ];

  // ==================== DEMO SCHOOL DATA ====================
  
  static readonly DEMO_SCHOOL: Omit<School, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'St. Mary\'s Secondary School',
    address: '123 Education Road, Lagos, Nigeria',
    phone: '+234-901-234-5678',
    email: 'info@stmarysschool.edu.ng',
    website: 'https://stmarysschool.edu.ng',
    establishedYear: 1995,
    principalName: 'Dr. Adebola Johnson',
    totalStudents: 450,
    totalTeachers: 35,
    academicYear: '2024-2025',
  };
  
  // ==================== DEMO SUBJECTS ====================
  
  static readonly DEMO_SUBJECTS: Omit<Subject, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Mathematics',
      code: 'MATH',
      description: 'Core mathematics curriculum',
      grade: '10',
      type: 'core',
      credits: 6,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [],
      classIds: [],
    },
    {
      name: 'English Language',
      code: 'ENG',
      description: 'English language and literature',
      grade: '10',
      type: 'core',
      credits: 6,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [],
      classIds: [],
    },
    {
      name: 'Physics',
      code: 'PHY',
      description: 'Physical sciences',
      grade: '10',
      type: 'core',
      credits: 5,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [],
      classIds: [],
    },
    {
      name: 'Chemistry',
      code: 'CHEM',
      description: 'Chemical sciences',
      grade: '10',
      type: 'core',
      credits: 5,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [],
      classIds: [],
    },
    {
      name: 'Biology',
      code: 'BIO',
      description: 'Biological sciences',
      grade: '10',
      type: 'core',
      credits: 5,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [],
      classIds: [],
    },
    {
      name: 'Computer Science',
      code: 'CS',
      description: 'Introduction to computer science',
      grade: '10',
      type: 'elective',
      credits: 4,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [],
      classIds: [],
    },
  ];
  
  // ==================== DEMO TEACHERS ====================
  
  static readonly DEMO_TEACHERS: Omit<Teacher, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>[] = [
    {
      teacherId: 'TCH001',
      firstName: 'John',
      lastName: 'Adebayo',
      email: 'j.adebayo@stmarysschool.edu.ng',
      phone: '+234-803-123-4567',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'male',
      address: '45 Teachers Village, Ikeja, Lagos',
      qualification: 'B.Sc Mathematics, M.Ed',
      experience: 12,
      department: 'Science',
      subjects: [],
      classes: [],
      designation: 'Head of Mathematics Department',
      joiningDate: new Date('2015-09-01'),
      salary: 180000,
      status: 'active',
      emergencyContact: 'Mrs. Funmi Adebayo',
      emergencyPhone: '+234-803-987-6543',
      bloodGroup: 'O+',
    },
    {
      teacherId: 'TCH002',
      firstName: 'Sarah',
      lastName: 'Okonkwo',
      email: 's.okonkwo@stmarysschool.edu.ng',
      phone: '+234-805-234-5678',
      dateOfBirth: new Date('1985-08-22'),
      gender: 'female',
      address: '78 Education Close, Victoria Island, Lagos',
      qualification: 'B.A English, M.A Literature',
      experience: 8,
      department: 'Languages',
      subjects: [],
      classes: [],
      designation: 'Senior Teacher',
      joiningDate: new Date('2018-01-15'),
      salary: 160000,
      status: 'active',
      emergencyContact: 'Mr. Chidi Okonkwo',
      emergencyPhone: '+234-805-876-5432',
      bloodGroup: 'A+',
    },
    {
      teacherId: 'TCH003',
      firstName: 'Michael',
      lastName: 'Babatunde',
      email: 'm.babatunde@stmarysschool.edu.ng',
      phone: '+234-807-345-6789',
      dateOfBirth: new Date('1978-11-10'),
      gender: 'male',
      address: '123 Science Avenue, Surulere, Lagos',
      qualification: 'B.Sc Physics, M.Sc Applied Physics',
      experience: 15,
      department: 'Science',
      subjects: [],
      classes: [],
      designation: 'Head of Science Department',
      joiningDate: new Date('2012-03-20'),
      salary: 200000,
      status: 'active',
      emergencyContact: 'Mrs. Bola Babatunde',
      emergencyPhone: '+234-807-765-4321',
      bloodGroup: 'B+',
    },
  ];
  
  // ==================== DEMO CLASSES ====================
  
  static readonly DEMO_CLASSES: Omit<Class, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Class 10A',
      grade: '10',
      section: 'A',
      classTeacherId: '',
      subjects: [],
      students: [],
      maxCapacity: 40,
      currentStrength: 35,
      roomNumber: 'R101',
      academicYear: '2024-2025',
      schedule: {
        monday: {
          '1': {
            subjectId: '',
            teacherId: '',
            startTime: '08:00',
            endTime: '08:45',
          },
          '2': {
            subjectId: '',
            teacherId: '',
            startTime: '08:45',
            endTime: '09:30',
          },
        },
      },
    },
    {
      name: 'Class 10B',
      grade: '10',
      section: 'B',
      classTeacherId: '',
      subjects: [],
      students: [],
      maxCapacity: 40,
      currentStrength: 38,
      roomNumber: 'R102',
      academicYear: '2024-2025',
      schedule: {},
    },
    {
      name: 'Class 10C',
      grade: '10',
      section: 'C',
      classTeacherId: '',
      subjects: [],
      students: [],
      maxCapacity: 40,
      currentStrength: 33,
      roomNumber: 'R103',
      academicYear: '2024-2025',
      schedule: {},
    },
  ];
  
  // ==================== DEMO STUDENTS ====================
  
  static generateDemoStudents(count: number = 50): Omit<Student, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>[] {
    const firstNames = [
      'Adebayo', 'Chidi', 'Fatima', 'Kemi', 'Tunde', 'Ngozi', 'Emeka', 'Aisha',
      'Biodun', 'Chioma', 'Ibrahim', 'Folake', 'Uche', 'Zainab', 'Segun', 'Amara',
      'Kunle', 'Hadiza', 'Tobi', 'Khadija', 'Gbenga', 'Hauwa', 'Femi', 'Safiya',
      'Lanre', 'Maryam', 'Dele', 'Rahma', 'Wale', 'Asma', 'Ade', 'Balkisu',
    ];
    
    const lastNames = [
      'Adebayo', 'Okafor', 'Ibrahim', 'Johnson', 'Okoro', 'Mohammed', 'Williams',
      'Eze', 'Abdullahi', 'Brown', 'Nwoko', 'Suleiman', 'Davis', 'Okonkwo',
      'Yusuf', 'Thompson', 'Chukwu', 'Garba', 'Wilson', 'Onyeka', 'Ahmad',
      'Smith', 'Udoh', 'Bello', 'Jones', 'Ekpo', 'Musa', 'Robinson',
    ];
    
    const sections = ['A', 'B', 'C'];
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const religions = ['Christianity', 'Islam', 'Traditional'];
    
    const students: Omit<Student, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>[] = [];
    
    // Add our demo student first
    students.push({
      studentId: 'STU001',
      firstName: 'Chioma',
      lastName: 'Okwu',
      email: 'student@stmarysschool.edu.ng',
      phone: '+234-901-234-5678',
      dateOfBirth: new Date(2008, 5, 15),
      gender: 'female',
      address: '15 Victoria Island Road, Lagos',
      parentName: 'Mrs. Grace Okwu',
      parentPhone: '+234-901-234-5679',
      parentEmail: 'grace.okwu@gmail.com',
      emergencyContact: 'Grace Okwu',
      emergencyPhone: '+234-901-234-5679',
      classId: '',
      grade: '10',
      section: 'A',
      rollNumber: 1,
      admissionDate: new Date(2024, 8, 1),
      status: 'active',
      bloodGroup: 'O+',
      religion: 'Christianity',
      nationality: 'Nigerian',
      feesPaid: true,
      hostelResident: false,
      transportRequired: true,
      academicYear: '2024-2025',
    });
    
    for (let i = 2; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
      const religion = religions[Math.floor(Math.random() * religions.length)];
      
      const student: Omit<Student, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'> = {
        studentId: `STU${i.toString().padStart(3, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.stmarysschool.edu.ng`,
        phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        dateOfBirth: new Date(2008 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender,
        address: `${Math.floor(Math.random() * 999 + 1)} ${['Lagos Street', 'Abuja Avenue', 'Port Harcourt Road', 'Kano Close', 'Ibadan Drive'][Math.floor(Math.random() * 5)]}, Lagos`,
        parentName: `${gender === 'male' ? 'Mr.' : 'Mrs.'} ${firstName} ${lastName} Sr.`,
        parentPhone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        parentEmail: `parent.${lastName.toLowerCase()}@gmail.com`,
        emergencyContact: `${firstName} Family`,
        emergencyPhone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        classId: '',
        grade: '10',
        section,
        rollNumber: i,
        admissionDate: new Date(2024, 8, Math.floor(Math.random() * 15) + 1),
        status: 'active',
        bloodGroup,
        religion,
        nationality: 'Nigerian',
        feesPaid: Math.random() > 0.2,
        hostelResident: Math.random() > 0.7,
        transportRequired: Math.random() > 0.5,
        academicYear: '2024-2025',
      };
      
      students.push(student);
    }
    
    return students;
  }
  
  // ==================== USER CREATION METHODS ====================
  
  static async createDemoUsers(schoolId: string): Promise<{ [email: string]: string }> {
    try {
      console.log('👥 Creating demo user accounts...');
      
      const userIdMap: { [email: string]: string } = {};
      
      for (const userData of this.DEMO_USERS) {
        try {
          // Create Firebase Auth user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          );
          
          const firebaseUser = userCredential.user;
          userIdMap[userData.email] = firebaseUser.uid;
          
          // Create user profile in Firestore using the Firebase Auth UID as document ID
          const userProfile = {
            email: userData.email,
            role: userData.role,
            schoolId,
            isActive: true,
            permissions: this.getPermissionsForRole(userData.role),
            profile: {
              name: `${userData.firstName} ${userData.lastName}`,
              schoolId, // Add schoolId to profile
              createdAt: new Date()
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          // Use setDoc with the Firebase Auth UID as the document ID
          await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
          
          console.log(`✅ Created user: ${userData.email} (${userData.role}) UID: ${firebaseUser.uid}`);
          
          
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            console.log(`⚠️ User already exists: ${userData.email}`);
          } else {
            console.error(`❌ Error creating user ${userData.email}:`, error);
          }
        }
      }
      
      console.log('✅ Demo user accounts created successfully!');
      return userIdMap;
      
    } catch (error) {
      console.error('❌ Error creating demo users:', error);
      throw error;
    }
  }
  
  static getPermissionsForRole(role: string): string[] {
    switch (role) {
      case 'admin':
        return [
          'manage_students',
          'manage_teachers',
          'manage_classes',
          'manage_subjects',
          'manage_attendance',
          'manage_exams',
          'manage_fees',
          'view_reports',
          'manage_settings',
        ];
      case 'teacher':
        return [
          'view_students',
          'view_classes',
          'manage_attendance',
          'manage_exams',
          'view_reports',
        ];
      case 'student':
        return [
          'view_profile',
          'view_attendance',
          'view_grades',
          'view_schedule',
        ];
      case 'parent':
        return [
          'view_child_profile',
          'view_child_attendance',
          'view_child_grades',
          'view_child_schedule',
          'communicate_teachers',
        ];
      default:
        return [];
    }
  }

  // ==================== SEEDING METHODS ====================
  
  static async seedDemoData(schoolId: string): Promise<void> {
    try {
      console.log('🌱 Starting demo data seeding...');
      
      // 0. Create demo users first and get the UID mapping
      const userIdMap = await this.createDemoUsers(schoolId);
      
      // 1. Create subjects
      console.log('📚 Creating subjects...');
      const subjectIds: string[] = [];
      for (const subject of this.DEMO_SUBJECTS) {
        const id = await DatabaseService.createSubject({ ...subject, schoolId });
        subjectIds.push(id);
      }
      console.log(`✅ Created ${subjectIds.length} subjects`);
      
      // 2. Create teachers with linked user IDs
      console.log('👨‍🏫 Creating teachers...');
      const teacherUserIds: string[] = [];
      for (const teacher of this.DEMO_TEACHERS) {
        const userId = userIdMap[teacher.email];
        const id = await DatabaseService.createTeacher({ 
          ...teacher, 
          schoolId,
          userId, // Link to Firebase Auth UID
          subjects: subjectIds.slice(0, 2), // Assign first 2 subjects to each teacher
        });
        // Store the Firebase Auth UID for class assignment
        if (userId) {
          teacherUserIds.push(userId);
        }
      }
      console.log(`✅ Created ${this.DEMO_TEACHERS.length} teachers`);
      
      // 3. Create classes with teacher UIDs
      console.log('🏫 Creating classes...');
      const classIds: string[] = [];
      for (let i = 0; i < this.DEMO_CLASSES.length; i++) {
        const classData = this.DEMO_CLASSES[i];
        const id = await DatabaseService.createClass({ 
          ...classData, 
          schoolId,
          classTeacherId: teacherUserIds[i] || teacherUserIds[0], // Use Firebase Auth UID
          subjects: subjectIds,
        });
        classIds.push(id);
      }
      console.log(`✅ Created ${classIds.length} classes`);
      
      // 4. Create students
      console.log('👥 Creating students...');
      const students = this.generateDemoStudents(50);
      const studentIds: string[] = [];
      
      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        const classIndex = ['A', 'B', 'C'].indexOf(student.section);
        const id = await DatabaseService.createStudent({ 
          ...student, 
          schoolId,
          classId: classIds[classIndex] || classIds[0],
        });
        studentIds.push(id);
      }
      console.log(`✅ Created ${studentIds.length} students`);
      
      // 5. Update class student counts
      console.log('📝 Updating class student counts...');
      for (let i = 0; i < classIds.length; i++) {
        const sectionStudents = studentIds.filter((_, index) => {
          const student = students[index];
          return student.section === this.DEMO_CLASSES[i].section;
        });
        
        await DatabaseService.updateClass(classIds[i], {
          students: sectionStudents,
          currentStrength: sectionStudents.length,
        });
      }
      
      console.log('🎉 Demo data seeding completed successfully!');
      console.log(`📊 Summary:
        - Subjects: ${subjectIds.length}
        - Teachers: ${this.DEMO_TEACHERS.length}
        - Classes: ${classIds.length}
        - Students: ${studentIds.length}
        - Demo Users: ${this.DEMO_USERS.length}
      `);
      
    } catch (error) {
      console.error('❌ Error seeding demo data:', error);
      throw error;
    }
  }
  
  // ==================== CLEANUP METHODS ====================
  
  static async cleanupDemoData(schoolId: string): Promise<void> {
    try {
      console.log('🧹 Starting demo data cleanup...');
      
      // Get all data for the school
      const [students, teachers, classes, subjects] = await Promise.all([
        DatabaseService.getStudents(schoolId),
        DatabaseService.getTeachers(schoolId),
        DatabaseService.getClasses(schoolId),
        DatabaseService.getSubjects(schoolId),
      ]);
      
      // Delete all students
      for (const student of students) {
        await DatabaseService.deleteStudent(student.id);
      }
      
      // Delete all teachers
      for (const teacher of teachers) {
        await DatabaseService.deleteTeacher(teacher.id);
      }
      
      // Delete all classes
      for (const cls of classes) {
        await DatabaseService.deleteClass(cls.id);
      }
      
      // Delete all subjects
      for (const subject of subjects) {
        await DatabaseService.deleteSubject(subject.id);
      }
      
      console.log('✅ Demo data cleanup completed!');
      
    } catch (error) {
      console.error('❌ Error cleaning up demo data:', error);
      throw error;
    }
  }
}

// ==================== HELPER FUNCTIONS ====================

export async function initializeDemoSchool(): Promise<string> {
  try {
    const schoolId = await DatabaseService.createSchool(DemoDataSeeder.DEMO_SCHOOL);
    await DemoDataSeeder.seedDemoData(schoolId);
    return schoolId;
  } catch (error) {
    console.error('Error initializing demo school:', error);
    throw error;
  }
}

export function generateDemoAttendance(studentIds: string[], classIds: string[], date: Date = new Date()) {
  const attendance = [];
  
  for (const studentId of studentIds) {
    const status = Math.random() > 0.15 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late';
    const checkInTime = status === 'present' || status === 'late' 
      ? new Date(date.getTime() + Math.random() * 3600000) // Random time within first hour
      : undefined;
    
    attendance.push({
      studentId,
      classId: classIds[Math.floor(Math.random() * classIds.length)],
      date,
      status,
      checkInTime,
      markedBy: 'SYSTEM',
      remarks: status === 'late' ? 'Late arrival' : status === 'absent' ? 'Unexcused absence' : undefined,
    });
  }
  
  return attendance;
}
