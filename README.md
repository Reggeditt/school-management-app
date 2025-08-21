# School Management System - Quick Start Guide

## 🚀 Getting Started

This is a comprehensive school management system built with Next.js 15, TypeScript, and Firebase. It provides separate portals for administrators, teachers, students, and parents.

## 📋 Prerequisites

- **Node.js** 18 or higher
- **pnpm** package manager
- **Firebase** project with Firestore and Authentication enabled

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd school-management-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. **Start development server**
   ```bash
   pnpm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin portal
│   ├── teacher/           # Teacher portal
│   ├── student/           # Student portal
│   └── parent/            # Parent portal
├── components/            # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom hooks
├── lib/                   # Core services and utilities
└── middleware.ts          # Authentication middleware
```

## 🔐 Authentication System

### User Roles
- **Admin**: Full system access and management
- **Teacher**: Class and student management
- **Student**: Academic activities and progress
- **Parent**: Child's academic monitoring

### Firebase Integration
- Users are authenticated via Firebase Auth
- Firebase UID is used as the document ID in Firestore
- Role-based access control via middleware

## 📚 Key Features

### Teacher Portal (/teacher)
- **Dashboard**: Overview of classes and activities
- **Classes**: Manage assigned classes and view details
- **Students**: Student management and academic records
- **Gradebook**: Grade entry and assessment management
- **Attendance**: Track and manage student attendance
- **Resources**: Educational materials and curriculum
- **Settings**: Profile and account management

### Admin Portal (/admin)
- **User Management**: Create and manage all user accounts
- **Teacher Management**: Teacher profiles and assignments
- **Student Management**: Student enrollment and records
- **Class Management**: Class creation and organization
- **System Settings**: School configuration and settings

## 🗄️ Database Schema

### Core Collections
- `users/{uid}` - User accounts linked to Firebase Auth
- `teachers/{uid}` - Teacher profiles (uid = Firebase UID)
- `students/{id}` - Student profiles and records
- `classes/{id}` - Class information and assignments
- `schools/{id}` - School information and settings

### Key Relationships
- Teachers are linked to users via Firebase UID
- Students are assigned to classes
- Classes are assigned to teachers
- All data is scoped by school ID

## 🛠️ Development Commands

```bash
# Development
pnpm run dev              # Start development server
pnpm run build            # Build for production
pnpm run start            # Start production server

# Code Quality
pnpm run lint             # Run ESLint
pnpm run type-check       # TypeScript type checking

# Database
pnpm run seed             # Seed demo data (if implemented)
```

## 🔧 Core Services

### DatabaseService
Central service for all database operations:
```typescript
import { DatabaseService } from '@/lib/database-services';

// User operations
await DatabaseService.createUser(userData, firebaseUID);
await DatabaseService.getUserById(uid);

// Teacher operations
await DatabaseService.createTeacher(teacherData, firebaseUID);
await DatabaseService.getTeachersBySchool(schoolId);
```

### TeacherAccountService
Specialized service for teacher account creation:
```typescript
import { TeacherAccountService } from '@/lib/services/teacher-account-service';

// Create complete teacher account
await TeacherAccountService.createTeacherAccount({
  email: 'teacher@school.edu',
  password: 'password123',
  teacherData: { /* teacher profile data */ }
});
```

## 🎣 Custom Hooks

### useAuth
Authentication state management:
```typescript
const { user, loading, login, logout, isAuthenticated } = useAuth();
```

### useTeacherData
Teacher-specific data loading:
```typescript
const {
  teacherClasses,
  teacherStudents,
  loading,
  error,
  getStudentsForClass
} = useTeacherData();
```

## 🎨 UI Components

Built with Radix UI and Tailwind CSS:
- Consistent design system
- Accessible components
- Dark/light mode support
- Responsive design

## 🚨 Common Issues & Solutions

### Build Failures
- Ensure all pages export a default React component
- Check for TypeScript errors
- Verify all imports are correct

### Authentication Issues
- Check Firebase configuration
- Verify environment variables
- Check middleware routing logic

### Data Loading Issues
- Verify Firestore security rules
- Check user permissions
- Ensure proper error handling

## 📝 Making Changes

### Adding a New Teacher Portal Page
1. Create file: `src/app/teacher/[page-name]/page.tsx`
2. Add navigation link in teacher layout
3. Update middleware for route protection

### Adding a New Database Entity
1. Define interface in `database-services.ts`
2. Add CRUD methods to `DatabaseService`
3. Create management components
4. Update admin portal if needed

## 🔒 Security Considerations

- All routes are protected by authentication middleware
- Role-based access control enforced
- Firebase security rules restrict data access
- Input validation on all forms

## 📖 Documentation

For comprehensive documentation, see:
- `SYSTEM_DOCUMENTATION.md` - Complete system architecture
- Component documentation in respective folders
- Firebase setup guides in `/docs` (if available)

## 🐛 Debugging

### Enable Debug Mode
```bash
# Start with detailed logging
DEBUG=* pnpm run dev

# Firebase debug mode
export FIRESTORE_EMULATOR_HOST="localhost:8080"
```

### Common Debug Steps
1. Check browser console for errors
2. Verify Firebase Console for data
3. Check network tab for API calls
4. Use React DevTools for component state

## 🤝 Contributing

1. Create feature branch from `main`
2. Make changes with proper TypeScript types
3. Run tests and build before committing
4. Create pull request with description

## 📞 Support

For technical issues:
1. Check existing documentation
2. Search codebase for similar implementations
3. Contact development team
4. Create issue with reproduction steps

---

**Happy coding! 🎉**