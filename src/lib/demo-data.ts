import { DatabaseService, Student, Teacher, Class, Subject, School, User } from './database-services';
import { 
  generateStudentId, 
  generateTeacherId, 
  generateClassId, 
  generateSubjectId 
} from './id-generator';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';

// ==================== DEMO DATA GENERATOR ====================

export class DemoDataSeeder {
  
  // ==================== DEMO FAMILIES FOR SIBLING TESTING ====================
  
  static readonly DEMO_FAMILIES = [
    {
      familyId: 'fam_001',
      lastName: 'Asante',
      parentEmail: 'mr.asante@gmail.com',
      parentName: 'Mr. Kwame Asante',
      parentPhone: '+233-24-123-4567',
      address: '15 Osu Oxford Street, Accra'
    },
    {
      familyId: 'fam_002', 
      lastName: 'Osei',
      parentEmail: 'mrs.osei@yahoo.com',
      parentName: 'Mrs. Akosua Osei',
      parentPhone: '+233-20-987-6543',
      address: '42 Ring Road East, Accra'
    },
    {
      familyId: 'fam_003',
      lastName: 'Mensah',
      parentEmail: 'kofi.mensah@outlook.com', 
      parentName: 'Mr. Kofi Mensah',
      parentPhone: '+233-26-555-7890',
      address: '8 Spintex Road, Accra'
    },
    {
      familyId: 'fam_004',
      lastName: 'Boateng',
      parentEmail: 'ama.boateng@gmail.com',
      parentName: 'Mrs. Ama Boateng', 
      parentPhone: '+233-24-321-9876',
      address: '25 Achimota Mile 7, Accra'
    },
    {
      familyId: 'fam_005',
      lastName: 'Darko',
      parentEmail: 'yaw.darko@hotmail.com',
      parentName: 'Mr. Yaw Darko',
      parentPhone: '+233-55-444-3333',
      address: '12 East Legon, Accra'
    }
  ];

  // ==================== SCHOOL 1: ACTIVE SUBSCRIPTION ====================
  
  static readonly GHANA_NATIONAL_SCHOOL = {
    school: {
      name: 'Ghana National Secondary School',
      address: '45 Independence Avenue, Accra, Ghana',
      phone: '+233-30-221-4567',
      email: 'info@gnss.edu.gh',
      website: 'https://gnss.edu.gh',
      establishedYear: 1957,
      principalName: 'Dr. Kwame Nkrumah',
      totalStudents: 280,
      totalTeachers: 25,
      academicYear: '2024-2025',
      // ACTIVE SUBSCRIPTION - Standard Plan
      subscription: {
        plan: 'standard' as const,
        status: 'active' as const,
        currentTermStart: new Date('2024-09-01'),
        currentTermEnd: new Date('2024-12-15'),
        nextBillingDate: new Date('2024-12-15'),
        lastPaymentDate: new Date('2024-08-20'),
        lastPaymentAmount: 7000, // 280 students × ₵25
        features: ['student_management', 'teacher_management', 'class_management', 'attendance_tracking', 'grade_management', 'exam_management', 'parent_portal', 'student_portal', 'advanced_analytics'],
        currentTerm: {
          name: 'Term 1 2024/2025',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2024-12-15'),
          studentCount: 280,
          amountCharged: 7000
        }
      },
      usage: {
        currentStudents: 280,
        currentTeachers: 25,
        currentClasses: 12,
        storageUsed: 850,
        monthlyActiveUsers: 305, // students + teachers
        lastUpdated: new Date()
      },
      billing: {
        contactEmail: 'billing@gnss.edu.gh',
        contactPhone: '+233-30-221-4567',
        address: 'P.O. Box 123, Accra Central, Ghana',
        currency: 'GHS' as const,
        paymentMethod: 'mobile_money' as const
      }
    },
    users: [
      {
        email: 'admin@gnss.edu.gh',
        password: 'Admin123!',
        role: 'admin' as const,
        firstName: 'Dr. Kwame',
        lastName: 'Nkrumah',
        designation: 'Principal'
      },
      {
        email: 'teacher@gnss.edu.gh',
        password: 'Teacher123!',
        role: 'teacher' as const,
        firstName: 'Mrs. Akosua',
        lastName: 'Mensah',
        designation: 'Mathematics Teacher'
      },
      {
        email: 'student@gnss.edu.gh', 
        password: 'Student123!',
        role: 'student' as const,
        firstName: 'Kwabena',
        lastName: 'Asante',
        designation: 'Student'
      },
      {
        email: 'parent@gnss.edu.gh',
        password: 'Parent123!',
        role: 'parent' as const,
        firstName: 'Mr. Kwame',
        lastName: 'Asante',
        designation: 'Parent'
      },
      {
        email: 'accountant@gnss.edu.gh',
        password: 'Account123!',
        role: 'accountant' as const,
        firstName: 'Mrs. Efua',
        lastName: 'Osei',
        designation: 'School Accountant'
      },
      {
        email: 'hr@gnss.edu.gh',
        password: 'HR123!',
        role: 'hr' as const,
        firstName: 'Mr. Kofi',
        lastName: 'Boateng',
        designation: 'HR Manager'
      },
      {
        email: 'staff@gnss.edu.gh',
        password: 'Staff123!',
        role: 'staff' as const,
        firstName: 'Miss Ama',
        lastName: 'Darko',
        designation: 'Administrative Staff'
      }
    ]
  };

  // ==================== SCHOOL 2: GRACE PERIOD ====================
  
  static readonly ASHANTI_ACADEMY = {
    school: {
      name: 'Ashanti Academy',
      address: '78 Kumasi Cultural Centre Road, Kumasi, Ghana',
      phone: '+233-32-202-8901',
      email: 'info@ashantiacademy.edu.gh',
      website: 'https://ashantiacademy.edu.gh',
      establishedYear: 1970,
      principalName: 'Mrs. Yaa Asantewaa',
      totalStudents: 180,
      totalTeachers: 18,
      academicYear: '2024-2025',
      // GRACE PERIOD - Basic Plan
      subscription: {
        plan: 'basic' as const,
        status: 'grace_period' as const,
        currentTermStart: new Date('2024-05-01'),
        currentTermEnd: new Date('2024-08-15'), // Term ended 7 days ago
        nextBillingDate: new Date('2024-08-15'),
        gracePeriodEnd: new Date('2024-08-25'), // Grace period ends in 3 days
        lastPaymentDate: new Date('2024-04-20'),
        lastPaymentAmount: 2700, // 180 students × ₵15
        features: ['student_management', 'teacher_management', 'attendance_tracking', 'grade_management', 'parent_portal', 'basic_analytics'],
        currentTerm: {
          name: 'Term 2 2024/2025',
          startDate: new Date('2024-05-01'),
          endDate: new Date('2024-08-15'),
          studentCount: 180,
          amountCharged: 2700
        }
      },
      usage: {
        currentStudents: 180,
        currentTeachers: 18,
        currentClasses: 8,
        storageUsed: 320,
        monthlyActiveUsers: 198, // students + teachers
        lastUpdated: new Date()
      },
      billing: {
        contactEmail: 'accounts@ashantiacademy.edu.gh',
        contactPhone: '+233-32-202-8901',
        address: 'P.O. Box 456, Kumasi, Ghana',
        currency: 'GHS' as const,
        paymentMethod: 'bank_transfer' as const
      }
    },
    users: [
      {
        email: 'admin@ashantiacademy.edu.gh',
        password: 'Admin123!',
        role: 'admin' as const,
        firstName: 'Mrs. Yaa',
        lastName: 'Asantewaa',
        designation: 'Principal'
      },
      {
        email: 'teacher@ashantiacademy.edu.gh',
        password: 'Teacher123!',
        role: 'teacher' as const,
        firstName: 'Mr. Kwaku',
        lastName: 'Osei',
        designation: 'Science Teacher'
      },
      {
        email: 'student@ashantiacademy.edu.gh',
        password: 'Student123!',
        role: 'student' as const,
        firstName: 'Abena',
        lastName: 'Osei',
        designation: 'Student'
      },
      {
        email: 'parent@ashantiacademy.edu.gh',
        password: 'Parent123!',
        role: 'parent' as const,
        firstName: 'Mrs. Akosua',
        lastName: 'Osei',
        designation: 'Parent'
      },
      {
        email: 'accountant@ashantiacademy.edu.gh',
        password: 'Account123!',
        role: 'accountant' as const,
        firstName: 'Mr. Kwame',
        lastName: 'Frimpong',
        designation: 'Bursar'
      },
      {
        email: 'hr@ashantiacademy.edu.gh',
        password: 'HR123!',
        role: 'hr' as const,
        firstName: 'Miss Adwoa',
        lastName: 'Mensah',
        designation: 'HR Officer'
      },
      {
        email: 'staff@ashantiacademy.edu.gh',
        password: 'Staff123!',
        role: 'staff' as const,
        firstName: 'Mr. Yaw',
        lastName: 'Boateng',
        designation: 'Librarian'
      }
    ]
  };

  // ==================== SCHOOL 3: RESTRICTED (PAYMENT EXPIRED) ====================
  
  static readonly VOLTA_COLLEGE = {
    school: {
      name: 'Volta College',
      address: '33 Ho Central Market Road, Ho, Ghana',
      phone: '+233-36-202-5432',
      email: 'info@voltacollege.edu.gh',
      website: 'https://voltacollege.edu.gh',
      establishedYear: 1985,
      principalName: 'Mr. Edem Agbodza',
      totalStudents: 120,
      totalTeachers: 12,
      academicYear: '2024-2025',
      // RESTRICTED - Free Plan (Overdue)
      subscription: {
        plan: 'free' as const,
        status: 'restricted' as const,
        currentTermStart: new Date('2024-01-15'),
        currentTermEnd: new Date('2024-04-30'), // Term ended 3+ months ago
        nextBillingDate: new Date('2024-04-30'),
        gracePeriodEnd: new Date('2024-05-10'), // Grace period ended 3+ months ago
        lastPaymentDate: new Date('2024-01-10'),
        lastPaymentAmount: 0, // Free plan
        features: ['student_management', 'basic_attendance', 'simple_grading'],
        currentTerm: {
          name: 'Term 1 2024/2025',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-04-30'),
          studentCount: 120,
          amountCharged: 0
        }
      },
      usage: {
        currentStudents: 120,
        currentTeachers: 12,
        currentClasses: 6,
        storageUsed: 95,
        monthlyActiveUsers: 132, // students + teachers
        lastUpdated: new Date()
      },
      billing: {
        contactEmail: 'finance@voltacollege.edu.gh',
        contactPhone: '+233-36-202-5432',
        address: 'P.O. Box 789, Ho, Volta Region, Ghana',
        currency: 'GHS' as const,
        paymentMethod: 'mobile_money' as const
      }
    },
    users: [
      {
        email: 'admin@voltacollege.edu.gh',
        password: 'Admin123!',
        role: 'admin' as const,
        firstName: 'Mr. Edem',
        lastName: 'Agbodza',
        designation: 'Principal'
      },
      {
        email: 'teacher@voltacollege.edu.gh',
        password: 'Teacher123!',
        role: 'teacher' as const,
        firstName: 'Mrs. Comfort',
        lastName: 'Mensah',
        designation: 'English Teacher'
      },
      {
        email: 'student@voltacollege.edu.gh',
        password: 'Student123!',
        role: 'student' as const,
        firstName: 'Edem',
        lastName: 'Mensah',
        designation: 'Student'
      },
      {
        email: 'parent@voltacollege.edu.gh',
        password: 'Parent123!',
        role: 'parent' as const,
        firstName: 'Mr. Kofi',
        lastName: 'Mensah',
        designation: 'Parent'
      },
      {
        email: 'accountant@voltacollege.edu.gh',
        password: 'Account123!',
        role: 'accountant' as const,
        firstName: 'Miss Rejoice',
        lastName: 'Agbodza',
        designation: 'Finance Officer'
      },
      {
        email: 'hr@voltacollege.edu.gh',
        password: 'HR123!',
        role: 'hr' as const,
        firstName: 'Mr. Emmanuel',
        lastName: 'Klutse',
        designation: 'HR Assistant'
      },
      {
        email: 'staff@voltacollege.edu.gh',
        password: 'Staff123!',
        role: 'staff' as const,
        firstName: 'Mrs. Grace',
        lastName: 'Darko',
        designation: 'Secretary'
      }
    ]
  };

  // ==================== DEMO SUBJECTS (SHARED ACROSS SCHOOLS) ====================
  
  static readonly DEMO_SUBJECTS = [
    {
      name: 'Mathematics',
      code: 'MATH',
      description: 'Core mathematics curriculum',
      grade: '10',
      type: 'core' as const,
      credits: 6,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [] as string[],
      classIds: [] as string[]
    },
    {
      name: 'English Language',
      code: 'ENG',
      description: 'English language and literature',
      grade: '10',
      type: 'core' as const,
      credits: 6,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [] as string[],
      classIds: [] as string[]
    },
    {
      name: 'Integrated Science',
      code: 'SCI',
      description: 'General science curriculum',
      grade: '10',
      type: 'core' as const,
      credits: 5,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [] as string[],
      classIds: [] as string[]
    },
    {
      name: 'Social Studies',
      code: 'SS',
      description: 'Social studies and history',
      grade: '10',
      type: 'core' as const,
      credits: 4,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [] as string[],
      classIds: [] as string[]
    },
    {
      name: 'Religious & Moral Education',
      code: 'RME',
      description: 'Religious and moral education',
      grade: '10',
      type: 'core' as const,
      credits: 3,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [] as string[],
      classIds: [] as string[]
    },
    {
      name: 'Information Technology',
      code: 'ICT',
      description: 'Computer literacy and programming',
      grade: '10',
      type: 'elective' as const,
      credits: 4,
      totalMarks: 100,
      passingMarks: 40,
      teacherIds: [] as string[],
      classIds: [] as string[]
    }
  ];

  // ==================== DEMO STUDENTS WITH FAMILY RELATIONSHIPS ====================
  
  static readonly DEMO_STUDENTS = [
    // GHANA NATIONAL SCHOOL STUDENTS
    // Family 1: Asante Family (2 siblings)
    {
      firstName: 'Kwabena',
      lastName: 'Asante',
      dateOfBirth: new Date('2008-03-15'),
      gender: 'male' as const,
      grade: '10',
      section: 'A',
      rollNumber: 'GNS001',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mr. Kwame Asante',
      parentPhone: '+233-24-123-4567',
      parentEmail: 'mr.asante@gmail.com',
      address: '15 Osu Oxford Street, Accra',
      familyId: 'fam_001',
      school: 'ghana_national'
    },
    {
      firstName: 'Akosua',
      lastName: 'Asante',
      dateOfBirth: new Date('2009-07-22'),
      gender: 'female' as const,
      grade: '9',
      section: 'B',
      rollNumber: 'GNS002',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mr. Kwame Asante',
      parentPhone: '+233-24-123-4567',
      parentEmail: 'mr.asante@gmail.com',
      address: '15 Osu Oxford Street, Accra',
      familyId: 'fam_001',
      school: 'ghana_national'
    },
    // Family 2: Osei Family (3 siblings)
    {
      firstName: 'Kofi',
      lastName: 'Osei',
      dateOfBirth: new Date('2007-11-10'),
      gender: 'male' as const,
      grade: '11',
      section: 'A',
      rollNumber: 'GNS003',
      admissionDate: new Date('2023-01-15'),
      parentName: 'Mrs. Akosua Osei',
      parentPhone: '+233-20-987-6543',
      parentEmail: 'mrs.osei@yahoo.com',
      address: '42 Ring Road East, Accra',
      familyId: 'fam_002',
      school: 'ghana_national'
    },
    {
      firstName: 'Ama',
      lastName: 'Osei',
      dateOfBirth: new Date('2008-05-18'),
      gender: 'female' as const,
      grade: '10',
      section: 'B',
      rollNumber: 'GNS004',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mrs. Akosua Osei',
      parentPhone: '+233-20-987-6543',
      parentEmail: 'mrs.osei@yahoo.com',
      address: '42 Ring Road East, Accra',
      familyId: 'fam_002',
      school: 'ghana_national'
    },
    {
      firstName: 'Kwame',
      lastName: 'Osei',
      dateOfBirth: new Date('2010-01-25'),
      gender: 'male' as const,
      grade: '8',
      section: 'A',
      rollNumber: 'GNS005',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mrs. Akosua Osei',
      parentPhone: '+233-20-987-6543',
      parentEmail: 'mrs.osei@yahoo.com',
      address: '42 Ring Road East, Accra',
      familyId: 'fam_002',
      school: 'ghana_national'
    },

    // ASHANTI ACADEMY STUDENTS  
    // Family 3: Mensah Family (2 siblings)
    {
      firstName: 'Abena',
      lastName: 'Mensah',
      dateOfBirth: new Date('2008-09-12'),
      gender: 'female' as const,
      grade: '10',
      section: 'A',
      rollNumber: 'ASH001',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mr. Kofi Mensah',
      parentPhone: '+233-26-555-7890',
      parentEmail: 'kofi.mensah@outlook.com',
      address: '8 Spintex Road, Accra',
      familyId: 'fam_003',
      school: 'ashanti_academy'
    },
    {
      firstName: 'Yaw',
      lastName: 'Mensah',
      dateOfBirth: new Date('2009-12-08'),
      gender: 'male' as const,
      grade: '9',
      section: 'A',
      rollNumber: 'ASH002',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mr. Kofi Mensah',
      parentPhone: '+233-26-555-7890',
      parentEmail: 'kofi.mensah@outlook.com',
      address: '8 Spintex Road, Accra',
      familyId: 'fam_003',
      school: 'ashanti_academy'
    },
    // Family 4: Boateng Family (2 siblings)
    {
      firstName: 'Efua',
      lastName: 'Boateng',
      dateOfBirth: new Date('2008-04-20'),
      gender: 'female' as const,
      grade: '10',
      section: 'B',
      rollNumber: 'ASH003',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mrs. Ama Boateng',
      parentPhone: '+233-24-321-9876',
      parentEmail: 'ama.boateng@gmail.com',
      address: '25 Achimota Mile 7, Accra',
      familyId: 'fam_004',
      school: 'ashanti_academy'
    },
    {
      firstName: 'Kwaku',
      lastName: 'Boateng',
      dateOfBirth: new Date('2009-08-14'),
      gender: 'male' as const,
      grade: '9',
      section: 'B',
      rollNumber: 'ASH004',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mrs. Ama Boateng',
      parentPhone: '+233-24-321-9876',
      parentEmail: 'ama.boateng@gmail.com',
      address: '25 Achimota Mile 7, Accra',
      familyId: 'fam_004',
      school: 'ashanti_academy'
    },

    // VOLTA COLLEGE STUDENTS
    // Family 5: Darko Family (2 siblings)
    {
      firstName: 'Edem',
      lastName: 'Darko',
      dateOfBirth: new Date('2008-06-30'),
      gender: 'male' as const,
      grade: '10',
      section: 'A',
      rollNumber: 'VOL001',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mr. Yaw Darko',
      parentPhone: '+233-55-444-3333',
      parentEmail: 'yaw.darko@hotmail.com',
      address: '12 East Legon, Accra',
      familyId: 'fam_005',
      school: 'volta_college'
    },
    {
      firstName: 'Comfort',
      lastName: 'Darko',
      dateOfBirth: new Date('2009-10-16'),
      gender: 'female' as const,
      grade: '9',
      section: 'A',
      rollNumber: 'VOL002',
      admissionDate: new Date('2024-01-15'),
      parentName: 'Mr. Yaw Darko',
      parentPhone: '+233-55-444-3333',
      parentEmail: 'yaw.darko@hotmail.com',
      address: '12 East Legon, Accra',
      familyId: 'fam_005',
      school: 'volta_college'
    }
  ];
  
  // ==================== DEMO TEACHERS ====================
  
  static readonly DEMO_TEACHERS: Omit<Teacher, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>[] = [
    {
      teacherId: generateTeacherId([]),
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
      teacherId: generateTeacherId([]),
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
      teacherId: generateTeacherId([]),
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
    const relationships = ['father', 'mother', 'guardian', 'grandparent', 'uncle', 'aunt'] as const;
    const occupations = ['Engineer', 'Doctor', 'Teacher', 'Lawyer', 'Business Owner', 'Civil Servant', 'Accountant', 'Nurse'];
    
    const students: Omit<Student, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>[] = [];
    const existingIds: string[] = [];
    
    // Helper function to generate guardians
    const generateGuardians = (lastName: string, i: number, useFamilyGuardians?: { father: any, mother: any }) => {
      const guardians = [];
      
      // If family guardians are provided (for siblings), use them
      if (useFamilyGuardians) {
        guardians.push(useFamilyGuardians.father);
        guardians.push(useFamilyGuardians.mother);
        return guardians;
      }
      
      // Primary guardian (usually father or mother)
      const fatherGuardian = {
        name: `Mr. ${lastNames[Math.floor(Math.random() * lastNames.length)]} ${lastName}`,
        relationship: 'father' as const,
        phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        email: `${lastName.toLowerCase()}.father@gmail.com`,
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        isPrimary: true,
        isEmergencyContact: true,
        canPickup: true,
        hasFinancialResponsibility: true,
      };
      guardians.push(fatherGuardian);
      
      // Secondary guardian (usually mother)
      const motherGuardian = {
        name: `Mrs. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`,
        relationship: 'mother' as const,
        phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        email: `${lastName.toLowerCase()}.mother@gmail.com`,
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        isPrimary: false,
        isEmergencyContact: true,
        canPickup: true,
        hasFinancialResponsibility: false,
      };
      guardians.push(motherGuardian);
      
      // Store these guardians for potential siblings
      if (Math.random() > 0.8) { // 20% chance this family will have siblings
        (global as any).familyGuardians = (global as any).familyGuardians || {};
        (global as any).familyGuardians[lastName] = { father: fatherGuardian, mother: motherGuardian };
      }
      
      // Sometimes add a third guardian (grandparent, uncle, etc.)
      if (Math.random() > 0.7) {
        const relationship = relationships[Math.floor(Math.random() * relationships.length)];
        const isFemalRelationship = relationship === 'aunt' || relationship === 'mother';
        guardians.push({
          name: `${isFemalRelationship ? 'Mrs.' : 'Mr.'} ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
          relationship,
          phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
          email: `${lastName.toLowerCase()}.${relationship}@gmail.com`,
          isPrimary: false,
          isEmergencyContact: true,
          canPickup: true,
          hasFinancialResponsibility: false,
        });
      }
      
      return guardians;
    };
    
    // Add our demo student first
    const demoStudentId = generateStudentId(existingIds);
    existingIds.push(demoStudentId);
    students.push({
      studentId: demoStudentId,
      firstName: 'Chioma',
      lastName: 'Okwu',
      email: 'student@stmarysschool.edu.ng',
      phone: '+234-901-234-5678',
      dateOfBirth: new Date(2008, 5, 15),
      gender: 'female',
      address: '15 Victoria Island Road, Lagos',
      guardians: [
        {
          name: 'Mrs. Grace Okwu',
          relationship: 'mother',
          phone: '+234-901-234-5679',
          email: 'grace.okwu@gmail.com',
          occupation: 'Engineer',
          isPrimary: true,
          isEmergencyContact: true,
          canPickup: true,
          hasFinancialResponsibility: true,
        },
        {
          name: 'Mr. Peter Okwu',
          relationship: 'father',
          phone: '+234-901-234-5680',
          email: 'peter.okwu@gmail.com',
          occupation: 'Doctor',
          isPrimary: false,
          isEmergencyContact: true,
          canPickup: true,
          hasFinancialResponsibility: true,
        }
      ],
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
    
    // Create some intentional sibling groups first
    const siblingFamilies = [
      { lastName: 'Johnson', members: ['Emeka', 'Chioma', 'Kemi'] },
      { lastName: 'Adebayo', members: ['Tunde', 'Folake'] },
      { lastName: 'Ibrahim', members: ['Fatima', 'Aisha', 'Yusuf'] },
      { lastName: 'Okafor', members: ['Chidi', 'Ngozi'] },
    ];
    
    let studentCount = 2; // Start after our demo student
    
    // Generate sibling families
    for (const family of siblingFamilies) {
      // Create shared guardians for this family
      const fatherGuardian = {
        name: `Mr. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${family.lastName}`,
        relationship: 'father' as const,
        phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        email: `${family.lastName.toLowerCase()}.father@gmail.com`,
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        isPrimary: true,
        isEmergencyContact: true,
        canPickup: true,
        hasFinancialResponsibility: true,
      };
      
      const motherGuardian = {
        name: `Mrs. ${firstNames[Math.floor(Math.random() * firstNames.length)]} ${family.lastName}`,
        relationship: 'mother' as const,
        phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        email: `${family.lastName.toLowerCase()}.mother@gmail.com`,
        occupation: occupations[Math.floor(Math.random() * occupations.length)],
        isPrimary: false,
        isEmergencyContact: true,
        canPickup: true,
        hasFinancialResponsibility: false,
      };
      
      const familyGuardians = { father: fatherGuardian, mother: motherGuardian };
      
      // Create each family member
      for (let j = 0; j < family.members.length; j++) {
        const firstName = family.members[j];
        const section = sections[Math.floor(Math.random() * sections.length)];
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
        const religion = religions[Math.floor(Math.random() * religions.length)];
        const grade = ['8', '9', '10', '11'][j] || '10'; // Different grades for siblings
        
        const studentId = generateStudentId(existingIds);
        existingIds.push(studentId);
        
        const student: Omit<Student, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'> = {
          studentId,
          firstName,
          lastName: family.lastName,
          email: `${firstName.toLowerCase()}.${family.lastName.toLowerCase()}@student.stmarysschool.edu.ng`,
          phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
          dateOfBirth: new Date(2006 + j, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1), // Age difference
          gender,
          address: `${Math.floor(Math.random() * 999 + 1)} ${['Lagos Street', 'Abuja Avenue', 'Port Harcourt Road'][Math.floor(Math.random() * 3)]}, Lagos`,
          guardians: generateGuardians(family.lastName, studentCount, familyGuardians),
          classId: '',
          grade,
          section,
          rollNumber: studentCount,
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
        studentCount++;
      }
    }
    
    // Generate remaining individual students
    for (let i = studentCount; i <= count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const section = sections[Math.floor(Math.random() * sections.length)];
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
      const religion = religions[Math.floor(Math.random() * religions.length)];
      
      const studentId = generateStudentId(existingIds);
      existingIds.push(studentId);
      
      const student: Omit<Student, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'> = {
        studentId,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.stmarysschool.edu.ng`,
        phone: `+234-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        dateOfBirth: new Date(2008 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        gender,
        address: `${Math.floor(Math.random() * 999 + 1)} ${['Lagos Street', 'Abuja Avenue', 'Port Harcourt Road', 'Kano Close', 'Ibadan Drive'][Math.floor(Math.random() * 5)]}, Lagos`,
        guardians: generateGuardians(lastName, i),
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
  
  // ==================== MAIN SEEDING METHODS ====================
  
  static async seedAllSchools(): Promise<{
    ghanaSchoolId: string;
    ashantiSchoolId: string;
    voltaSchoolId: string;
  }> {
    try {
      console.log('🌱 Starting complete demo data seeding for all schools...');
      
      // Create all 3 schools
      const ghanaSchoolId = await DatabaseService.createSchool(this.GHANA_NATIONAL_SCHOOL.school);
      const ashantiSchoolId = await DatabaseService.createSchool(this.ASHANTI_ACADEMY.school);
      const voltaSchoolId = await DatabaseService.createSchool(this.VOLTA_COLLEGE.school);
      
      console.log(`✅ Created schools:
        - Ghana National: ${ghanaSchoolId}
        - Ashanti Academy: ${ashantiSchoolId}
        - Volta College: ${voltaSchoolId}`);
      
      // Create users for each school
      await this.createDemoUsers(ghanaSchoolId, this.GHANA_NATIONAL_SCHOOL.users);
      await this.createDemoUsers(ashantiSchoolId, this.ASHANTI_ACADEMY.users);
      await this.createDemoUsers(voltaSchoolId, this.VOLTA_COLLEGE.users);
      
      // Create subjects for each school
      await this.seedSubjects(ghanaSchoolId);
      await this.seedSubjects(ashantiSchoolId);
      await this.seedSubjects(voltaSchoolId);
      
      // Create students with family relationships
      await this.seedStudentsWithFamilies(ghanaSchoolId, ashantiSchoolId, voltaSchoolId);
      
      console.log('🎉 All demo data seeded successfully!');
      console.log(`📊 Summary:
        - Schools: 3
        - Users per school: 7
        - Total families: ${this.DEMO_FAMILIES.length}
        - Total students: ${this.DEMO_STUDENTS.length}
        - Subjects per school: ${this.DEMO_SUBJECTS.length}`);
      
      return {
        ghanaSchoolId,
        ashantiSchoolId,
        voltaSchoolId
      };
      
    } catch (error) {
      console.error('❌ Error seeding all schools:', error);
      throw error;
    }
  }

  static async createDemoUsers(schoolId: string, users: any[]): Promise<void> {
    try {
      console.log(`👥 Creating demo user accounts for school ${schoolId}...`);
      
      for (const userData of users) {
        try {
          // Create Firebase Auth user
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            userData.email,
            userData.password
          );
          
          const firebaseUser = userCredential.user;
          
          // Create user profile in Firestore using the Firebase Auth UID as document ID
          const userProfile = {
            email: userData.email,
            role: userData.role,
            profile: {
              name: `${userData.firstName} ${userData.lastName}`,
              schoolId: schoolId,
              department: userData.designation
            }
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
          
          console.log(`✅ Created user: ${userData.email} (${userData.role})`);
          
        } catch (error: any) {
          if (error.code === 'auth/email-already-in-use') {
            console.log(`⚠️ User already exists: ${userData.email}`);
          } else {
            console.error(`❌ Error creating user ${userData.email}:`, error);
          }
        }
      }
      
    } catch (error) {
      console.error('❌ Error creating demo users:', error);
      throw error;
    }
  }

  static async seedSubjects(schoolId: string): Promise<void> {
    try {
      console.log(`📚 Creating subjects for school ${schoolId}...`);
      
      for (const subject of this.DEMO_SUBJECTS) {
        const id = await DatabaseService.createSubject({ ...subject, schoolId });
        console.log(`✅ Created subject: ${subject.name} (${id})`);
      }
      
    } catch (error) {
      console.error('❌ Error creating subjects:', error);
      throw error;
    }
  }

  static async seedStudentsWithFamilies(ghanaSchoolId: string, ashantiSchoolId: string, voltaSchoolId: string): Promise<void> {
    try {
      console.log('👨‍👩‍👧‍👦 Creating students with family relationships...');
      
      const schoolMap = {
        'ghana_national': ghanaSchoolId,
        'ashanti_academy': ashantiSchoolId,
        'volta_college': voltaSchoolId
      };
      
      for (const studentData of this.DEMO_STUDENTS) {
        const schoolId = schoolMap[studentData.school as keyof typeof schoolMap];
        
        if (!schoolId) {
          console.error(`❌ Unknown school: ${studentData.school}`);
          continue;
        }
        
        const student = {
          studentId: studentData.rollNumber,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          dateOfBirth: studentData.dateOfBirth,
          gender: studentData.gender,
          grade: studentData.grade,
          section: studentData.section,
          rollNumber: parseInt(studentData.rollNumber.replace(/\D/g, '')), // Extract number from rollNumber
          admissionDate: studentData.admissionDate,
          address: studentData.address,
          schoolId: schoolId,
          // Required fields
          guardians: [
            {
              name: studentData.parentName,
              email: studentData.parentEmail,
              phone: studentData.parentPhone,
              relationship: 'father' as const,
              address: studentData.address,
              occupation: 'Professional',
              isPrimary: true,
              isEmergencyContact: true,
              canPickup: true,
              hasFinancialResponsibility: true
            }
          ],
          classId: `class_${studentData.grade}_${studentData.section.toLowerCase()}`,
          nationality: 'Ghanaian',
          feesPaid: true,
          hostelResident: false,
          transportRequired: false,
          status: 'active' as const,
          academicYear: '2024-2025',
          // Optional fields
          bloodGroup: 'O+',
          medicalInfo: '',
          // Family relationship fields (custom)
          familyId: studentData.familyId
        };
        
        const id = await DatabaseService.createStudent(student);
        console.log(`✅ Created student: ${studentData.firstName} ${studentData.lastName} (${studentData.familyId})`);
      }
      
      console.log('✅ All students created with family relationships!');
      
    } catch (error) {
      console.error('❌ Error creating students:', error);
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
      
      // 1. Create subjects
      console.log('📚 Creating subjects...');
      const subjectIds: string[] = [];
      for (const subject of this.DEMO_SUBJECTS) {
        const id = await DatabaseService.createSubject({ ...subject, schoolId });
        subjectIds.push(id);
      }
      console.log(`✅ Created ${subjectIds.length} subjects`);
      
      // 2. Create teachers
      console.log('👨‍🏫 Creating teachers...');
      const teacherIds: string[] = [];
      for (const teacher of this.DEMO_TEACHERS) {
        const id = await DatabaseService.createTeacher({ 
          ...teacher, 
          schoolId,
          subjects: subjectIds.slice(0, 2), // Assign first 2 subjects to each teacher
        });
        teacherIds.push(id);
      }
      console.log(`✅ Created ${teacherIds.length} teachers`);
      
      // 3. Create classes
      console.log('🏫 Creating classes...');
      const classIds: string[] = [];
      for (let i = 0; i < this.DEMO_CLASSES.length; i++) {
        const classData = this.DEMO_CLASSES[i];
        const id = await DatabaseService.createClass({ 
          ...classData, 
          schoolId,
          classTeacherId: teacherIds[i] || teacherIds[0],
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
      
      // 5. Create demo user accounts
      console.log('👥 Creating demo user accounts...');
      await this.createDemoUsers(schoolId, [
        {
          email: 'admin@school.edu.gh',
          password: 'Admin123!',
          role: 'admin',
          firstName: 'School',
          lastName: 'Administrator',
          designation: 'Principal'
        }
      ]);
      
      console.log('🎉 Demo data seeding completed successfully!');
      console.log(`📊 Summary:
        - Subjects: ${subjectIds.length}
        - Teachers: ${teacherIds.length}
        - Classes: ${classIds.length}
        - Students: ${studentIds.length}
        - Demo Users: 1
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

export async function initializeAllDemoSchools(): Promise<{
  ghanaSchoolId: string;
  ashantiSchoolId: string;
  voltaSchoolId: string;
}> {
  try {
    return await DemoDataSeeder.seedAllSchools();
  } catch (error) {
    console.error('Error initializing demo schools:', error);
    throw error;
  }
}

export async function initializeDemoSchool(): Promise<string> {
  try {
    // For backward compatibility, create just the Ghana National School
    const result = await DemoDataSeeder.seedAllSchools();
    return result.ghanaSchoolId;
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

/**
 * Get siblings for a student based on familyId
 */
export function getSiblings(studentId: string, allStudents: any[]): any[] {
  const student = allStudents.find(s => s.id === studentId);
  if (!student?.familyId) return [];
  
  return allStudents.filter(s => 
    s.familyId === student.familyId && s.id !== studentId
  );
}

/**
 * Get family summary for testing
 */
export function getFamilySummary(): { familyId: string; lastName: string; children: number }[] {
  const familyMap = new Map();
  
  DemoDataSeeder.DEMO_STUDENTS.forEach(student => {
    if (!familyMap.has(student.familyId)) {
      familyMap.set(student.familyId, {
        familyId: student.familyId,
        lastName: student.lastName,
        children: 0
      });
    }
    familyMap.get(student.familyId).children++;
  });
  
  return Array.from(familyMap.values());
}
