# School Management System - Developer Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Authentication & User Management](#authentication--user-management)
4. [Teacher Portal](#teacher-portal)
5. [Admin Portal](#admin-portal)
6. [Data Management](#data-management)
7. [File Structure](#file-structure)
8. [Core Services](#core-services)
9. [Database Schema](#database-schema)
10. [Maintenance Guidelines](#maintenance-guidelines)
11. [Common Tasks](#common-tasks)
12. [Troubleshooting](#troubleshooting)

---

## System Overview

The School Management System is a comprehensive Next.js 15 application built with TypeScript, React, and Firebase. It provides separate portals for different user types (Admin, Teacher, Student, Parent) with role-based access control.

### Technology Stack

- **Frontend**: Next.js 15.4.6, React, TypeScript
- **UI Components**: Radix UI components with Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication)
- **State Management**: React Context API
- **Build Tool**: Next.js with Turbopack
- **Package Manager**: pnpm

### Key Features

- Role-based authentication and authorization
- Real-time data synchronization with Firebase
- Responsive design for mobile and desktop
- Multi-tenant architecture (school-based)
- Comprehensive user management
- Academic management (classes, students, subjects)

---

## Architecture

### High-Level Architecture

```text

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Firebase      │    │   Services      │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Next.js App │ │◄──►│ │ Firestore   │ │◄──►│ │ Database    │ │
│ │             │ │    │ │ Database    │ │    │ │ Services    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ Auth        │ │◄──►│ │ Firebase    │ │◄──►│ │ Teacher     │ │
│ │ Context     │ │    │ │ Auth        │ │    │ │ Services    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture

```text
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Core services and utilities
└── middleware.ts          # Next.js middleware for auth
```

---

## Authentication & User Management

### Firebase Authentication Integration

The system uses Firebase Authentication with a custom user profile system:

1. **Firebase Auth UID**: Primary identifier for all users
2. **User Profiles**: Stored in Firestore with role and school information
3. **Document IDs**: Firebase UID is used as document ID for direct lookup

### Authentication Flow

```typescript
// User Login Process
1. User enters credentials → Firebase Auth
2. Firebase returns UID + JWT token
3. System fetches user profile from Firestore using UID
4. Context updates with user data and role
5. Middleware redirects based on role
```

### Key Files

- `src/contexts/auth-context.tsx` - Authentication state management
- `src/middleware.ts` - Route protection and role-based redirects
- `src/lib/services/teacher-account-service.ts` - Teacher account creation

### User Roles

- **admin**: Full system access
- **teacher**: Teacher portal access
- **student**: Student portal access
- **parent**: Parent portal access
- **accountant**: Financial management access
- **hr**: HR management access

---

## Teacher Portal

### Overview

The Teacher Portal provides comprehensive tools for educators to manage their classes, students, and academic activities.

### Portal Structure

```text
/teacher/
├── dashboard/              # Overview of teacher's activities
├── classes/               # Class management and details
│   └── [id]/             # Individual class page
├── students/              # Student management
│   └── [id]/             # Individual student page
├── gradebook/             # Grade management
├── attendance/            # Attendance tracking
├── assignments/           # Assignment management
├── grades/               # Grade entry and reports
├── messages/             # Communication hub
├── profile/              # Teacher profile management
├── schedule/             # Teaching schedule
├── resources/            # Educational resources
└── settings/             # Account settings
```

### Portal Features

#### 1. Dashboard (`/teacher/dashboard`)

- Quick overview of classes and students
- Recent activities and notifications
- Performance metrics and statistics
- Quick action buttons for common tasks

#### 2. Class Management (`/teacher/classes`)

- View all assigned classes
- Class statistics (enrollment, attendance)
- Grid and list view options
- Class filtering and search

#### 3. Student Management (`/teacher/students`)

- View all students across classes
- Student profiles and academic records
- Performance tracking
- Communication with students/parents

#### 4. Gradebook (`/teacher/gradebook`)

- Grade entry and management
- Assessment creation
- Grade calculations and reports
- Parent/student grade sharing

### Data Flow

```text
// Teacher Data Loading
useTeacherData() hook:
1. Gets teacher ID from authenticated user (Firebase UID)
2. Fetches teacher's assigned classes
3. Loads students for those classes
4. Provides helper functions for data manipulation
```

### Key Components

- `useTeacherData` hook - Primary data source
- `TeacherService` - Business logic layer
- Teacher-specific UI components in `/components/teacher/`

---

## Admin Portal

### Overview

The Admin Portal provides comprehensive system administration capabilities for school management.

### Portal Structure

```text
/admin/
├── dashboard/              # System overview and metrics
├── users/                 # User account management
├── teachers/              # Teacher management
│   └── [id]/             # Individual teacher page
├── students/              # Student management
│   └── [id]/             # Individual student page
├── classes/               # Class management
│   └── [id]/             # Individual class page
├── subjects/              # Subject/curriculum management
├── attendance/            # Attendance overview
├── exams/                # Examination management
├── timetable/            # School timetable management
└── settings/             # System settings
```

### Key Features

#### 1. User Management (`/admin/users`)

- Create and manage all user accounts
- Role assignment and permissions
- Account activation/deactivation
- Bulk user operations

#### 2. Teacher Management (`/admin/teachers`)

- Teacher account creation with Firebase Auth integration
- Profile management and verification
- Class assignments
- Performance tracking

#### 3. Student Management (`/admin/students`)

- Student enrollment and records
- Class assignments and transfers
- Academic history tracking
- Parent account linking

#### 4. Academic Management

- **Classes**: Create and manage classes, assign teachers
- **Subjects**: Curriculum and subject management
- **Timetable**: Schedule creation and management
- **Exams**: Examination scheduling and management

### Teacher Account Creation Process

```typescript
// New Teacher Creation Flow
1. Admin fills teacher form (personal + auth details)
2. TeacherAccountService.createTeacherAccount():
   a. Creates Firebase Auth account with post request to api route (to avoid current account switching bug.) the call returns the UID of the account just created.
   b. Creates Firestore user document with a document ID matching the UID from firebase auth
   c. a unique teachers ID is created for the teacher
   d. Creates Firestore teacher document
   e. Links accounts using Firebase UID
3. Teacher can immediately log in with provided credentials
```

---

## Data Management

### Database Architecture

The system uses Firebase Firestore with the following principles:

1. **Document IDs = Firebase UIDs** for all user-related documents
2. **School-based multi-tenancy** - all data scoped by schoolId
3. **Denormalized data** for performance optimization
4. **Real-time subscriptions** for live updates

### Core Collections

```txt
firestore/
├── schools/               # School information
├── users/{uid}/          # User accounts (linked to Firebase Auth)
├── teachers/{uid}/       # Teacher profiles (uid = Firebase UID)
├── students/{id}/        # Student profiles
├── classes/{id}/         # Class information
├── subjects/{id}/        # Subject/course information
├── attendance/{id}/      # Attendance records
└── grades/{id}/          # Grade records
```

### Data Relationships

```typescript
// User → Teacher Relationship
users/{firebaseUID} {
  role: 'teacher',
  schoolId: string,
  profile: {
    teacherId: firebaseUID  // Points to teachers collection
  }
}

teachers/{firebaseUID} {
  // Teacher profile data
  schoolId: string,
  subjects: string[],      // Array of subject IDs
  classes: string[]        // Array of class IDs
}

// Class → Students Relationship
classes/{classId} {
  students: string[],      // Array of student IDs
  teacherId: string,       // Firebase UID of assigned teacher
  schoolId: string
}
```

### Data Service Layer

#### DatabaseService (`src/lib/database-services.ts`)
Core CRUD operations for all entities:
- User management
- Teacher management  
- Student management
- Class management
- Academic data operations

#### TeacherAccountService (`src/lib/services/teacher-account-service.ts`)
Specialized service for teacher account creation:
- Combines Firebase Auth + Firestore operations
- Ensures data consistency
- Handles error scenarios

#### StoreContext (`src/contexts/store-context.tsx`)
Global state management:
- Caches frequently used data
- Provides reactive data updates
- Manages loading states

---

## File Structure

### Key Directories

```
src/
├── app/                           # Next.js App Router
│   ├── admin/                    # Admin portal pages
│   ├── teacher/                  # Teacher portal pages
│   ├── student/                  # Student portal pages
│   ├── parent/                   # Parent portal pages
│   ├── api/                      # API routes
│   └── globals.css               # Global styles
├── components/                    # Reusable components
│   ├── ui/                       # Base UI components (Radix)
│   ├── admin/                    # Admin-specific components
│   ├── teacher/                  # Teacher-specific components
│   ├── students/                 # Student management components
│   ├── classes/                  # Class management components
│   └── navigation/               # Navigation components
├── contexts/                      # React Context providers
│   ├── auth-context.tsx          # Authentication state
│   └── store-context.tsx         # Global app state
├── hooks/                         # Custom React hooks
│   ├── teacher/                  # Teacher-specific hooks
│   └── useAuth.ts               # Authentication hook
├── lib/                          # Core libraries and services
│   ├── services/                 # Business logic services
│   ├── utils/                    # Utility functions
│   ├── database-services.ts      # Core database operations
│   ├── firebase.ts              # Firebase configuration
│   └── demo-data.ts             # Demo data generation
└── middleware.ts                  # Next.js middleware
```

### Component Organization

```
components/
├── ui/                    # Base components (buttons, forms, etc.)
├── [entity]/             # Entity-specific components
│   ├── [entity]-form-dialog.tsx     # Create/edit forms
│   ├── [entity]-detail-view.tsx     # Detail pages
│   └── tabs/                         # Tab components for detail views
└── navigation/           # Navigation and layout components
```

---

## Core Services

### 1. DatabaseService

Central service for all database operations:

```typescript
// Key Methods
class DatabaseService {
  // User Management
  static async createUser(userData, firebaseUID): Promise<string>
  static async getUserById(uid): Promise<User | null>
  
  // Teacher Management  
  static async createTeacher(teacherData, firebaseUID): Promise<string>
  static async getTeacherById(uid): Promise<Teacher | null>
  static async getTeachersBySchool(schoolId): Promise<Teacher[]>
  
  // Class Management
  static async createClass(classData): Promise<string>
  static async getClassesBySchool(schoolId): Promise<Class[]>
  static async getClassesByTeacher(teacherId): Promise<Class[]>
}
```

### 2. TeacherAccountService

Specialized service for teacher account management:

```typescript
class TeacherAccountService {
  // Creates complete teacher account (Auth + Profile)
  static async createTeacherAccount(data: {
    email: string,
    password: string,
    teacherData: TeacherProfileData
  }): Promise<{uid: string, teacherId: string}>
  
  // Helper methods
  static generateTeacherId(): string
  static async updateTeacherPassword(uid, newPassword): Promise<void>
}
```

### 3. Custom Hooks

#### useTeacherData
Primary hook for teacher portal data:

```typescript
const {
  teacherClasses,        // Teacher's assigned classes
  teacherStudents,       // All students in teacher's classes
  loading,               // Loading state
  error,                 // Error state
  teacherId,            // Current teacher's ID
  refetch,              // Refresh data function
  getStudentsForClass,  // Helper function
  getClassById         // Helper function
} = useTeacherData();
```

#### useAuth
Authentication state management:

```typescript
const {
  user,                 // Current authenticated user
  loading,              // Auth loading state
  login,               // Login function
  logout,              // Logout function
  isAuthenticated      // Authentication status
} = useAuth();
```

---

## Database Schema

### Users Collection
```typescript
interface User {
  id: string;              // Firebase UID
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'accountant' | 'hr';
  schoolId: string;
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    [role]: string;        // Role-specific ID (e.g., teacherId)
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Teachers Collection
```typescript
interface Teacher {
  id: string;              // Firebase UID
  schoolId: string;
  teacherId: string;       // Human-readable ID (TCH001)
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subjects: string[];      // Subject IDs
  classes: string[];       // Class IDs
  department?: string;
  qualification?: string;
  experience?: number;
  joiningDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Classes Collection
```typescript
interface Class {
  id: string;
  schoolId: string;
  name: string;            // e.g., "Grade 10A"
  grade: string;           // e.g., "10"
  section: string;         // e.g., "A"
  teacherId: string;       // Firebase UID of class teacher
  subjects: string[];      // Subject IDs
  students: string[];      // Student IDs
  roomNumber?: string;
  maxCapacity: number;
  currentStrength: number;
  academicYear: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Students Collection
```typescript
interface GuardianInfo {
  id?: string;                    // Optional unique ID for the guardian
  name: string;
  relationship: 'father' | 'mother' | 'guardian' | 'grandparent' | 'uncle' | 'aunt' | 'sibling' | 'other';
  phone: string;
  email?: string;
  address?: string;
  occupation?: string;
  workplace?: string;
  workPhone?: string;
  isPrimary: boolean;             // Designates primary contact
  isEmergencyContact: boolean;    // Can be contacted in emergencies
  canPickup: boolean;             // Authorized to pick up student
  hasFinancialResponsibility: boolean; // Responsible for fees
  notes?: string;
}

interface Student {
  id: string;
  schoolId: string;
  studentId: string;       // Human-readable ID (STU001)
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  guardians: GuardianInfo[];      // Array of guardians/parents
  classId: string;         // Current class
  rollNumber: string;
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Maintenance Guidelines

### Code Standards

1. **TypeScript**: Strict mode enabled, all code must be typed
2. **ESLint**: Use provided configuration, warnings should be addressed
3. **Component Structure**: Follow established patterns for consistency
4. **File Naming**: kebab-case for files, PascalCase for components

### Development Workflow

1. **Branch Strategy**: Feature branches from `main`
2. **Commits**: Conventional commits format
3. **Testing**: Run build before committing
4. **Code Review**: Required for all changes

### Performance Considerations

1. **Firebase Reads**: Minimize unnecessary document reads
2. **Caching**: Use StoreContext for frequently accessed data
3. **Lazy Loading**: Components and data should load on demand
4. **Indexing**: Ensure Firestore composite indexes for complex queries

### Security Guidelines

1. **Authentication**: Always verify user authentication in middleware
2. **Authorization**: Check user roles before data access
3. **Data Validation**: Validate all inputs on client and server
4. **Firebase Rules**: Keep Firestore security rules restrictive

---

## Common Tasks

### Adding a New Page to Teacher Portal

1. Create page file: `src/app/teacher/[page-name]/page.tsx`
2. Add navigation link in teacher layout
3. Update middleware for route protection
4. Add any required components in `src/components/teacher/`

### Creating a New User Role

1. Update `User` interface in `database-services.ts`
2. Add role to authentication middleware
3. Create portal structure in `src/app/[role]/`
4. Update navigation and routing logic

### Adding a New Database Entity

1. Define interface in `database-services.ts`
2. Add CRUD methods to `DatabaseService`
3. Create management components
4. Add to admin portal if needed
5. Update demo data if applicable

### Implementing Real-time Updates

```typescript
// Example: Real-time class updates
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'classes'),
    (snapshot) => {
      const classes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClasses(classes);
    }
  );
  
  return () => unsubscribe();
}, []);
```

### Debugging Data Issues

1. **Check Firebase Console**: Verify data structure
2. **Console Logs**: Add logging to trace data flow
3. **Network Tab**: Monitor Firestore requests
4. **React DevTools**: Inspect component state

---

## Troubleshooting

### Common Issues

#### 1. Authentication Loops
**Symptoms**: Infinite redirects or auth state flickering
**Solution**: Check middleware logic and auth context dependencies

#### 2. Data Not Loading
**Symptoms**: Empty components or perpetual loading states
**Solution**: Verify Firestore security rules and user permissions

#### 3. Build Failures
**Symptoms**: TypeScript errors during build
**Solution**: 
- Check for missing page exports
- Verify all imports are correct
- Ensure all required props are provided

#### 4. Performance Issues
**Symptoms**: Slow page loads or excessive Firebase reads
**Solution**:
- Implement proper caching strategies
- Use pagination for large datasets
- Optimize component re-renders

### Debug Commands

```bash
# Check build issues
pnpm run build

# Type checking
pnpm run type-check

# Lint issues
pnpm run lint

# Development with detailed logging
pnpm run dev

# Clear Next.js cache
rm -rf .next
```

### Firebase Debugging

1. **Enable Firebase Debug Mode**:
   ```javascript
   import { connectFirestoreEmulator } from 'firebase/firestore';
   // Use emulator for development
   ```

2. **Check Security Rules**:
   ```javascript
   // Test in Firebase Console Rules Playground
   ```

3. **Monitor Usage**:
   - Check Firebase Console for read/write counts
   - Monitor authentication metrics

---

## Environment Setup

### Prerequisites
- Node.js 18+
- pnpm package manager
- Firebase project with Firestore and Auth enabled

### Development Setup

1. **Clone Repository**:
   ```bash
   git clone [repository-url]
   cd school-management-app
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Environment Variables**:
   ```bash
   # .env.local
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Start Development Server**:
   ```bash
   pnpm run dev
   ```

### Production Deployment

1. **Build Application**:
   ```bash
   pnpm run build
   ```

2. **Deploy** (Vercel recommended):
   ```bash
   vercel deploy
   ```

---

## Future Enhancements

### Planned Features
1. **Mobile Application**: React Native companion app
2. **Offline Support**: Progressive Web App features
3. **Advanced Analytics**: Detailed reporting dashboard
4. **Integration APIs**: Third-party system integrations
5. **Notification System**: Real-time notifications
6. **File Management**: Document upload and sharing

### Architecture Improvements
1. **Microservices**: Break down into smaller services
2. **Caching Layer**: Redis for improved performance
3. **API Gateway**: Centralized API management
4. **Event Sourcing**: Better audit trails
5. **Search Engine**: Advanced search capabilities

---

## Support and Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

### Key Contacts
- **Lead Developer**: [Contact Information]
- **System Administrator**: [Contact Information]
- **Firebase Administrator**: [Contact Information]

### Emergency Procedures
1. **System Down**: Check Firebase status, verify deployment
2. **Data Issues**: Backup procedures and recovery steps
3. **Security Breach**: Immediate response protocol

---

*Last Updated: August 21, 2025*
*Version: 1.0.0*
