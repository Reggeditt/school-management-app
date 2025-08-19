import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DatabaseService, User } from '@/lib/database-services';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!authToken || userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    const role = searchParams.get('role');

    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: 'School ID is required' },
        { status: 400 }
      );
    }

    let users: User[];

    if (role) {
      users = await DatabaseService.getUsersByRole(role, schoolId);
    } else {
      users = await DatabaseService.getAllUsers(schoolId);
    }

    // Enhance users with additional info from their profiles
    const enhancedUsers = await Promise.all(
      users.map(async (user) => {
        let additionalInfo: any = {};
        
        // Get profile information based on user role and profileId
        if (user.profileId) {
          try {
            let profileData = null;
            switch (user.role) {
              case 'teacher':
                profileData = await DatabaseService.getTeacherById(user.profileId);
                if (profileData) {
                  additionalInfo = {
                    name: `${profileData.firstName} ${profileData.lastName}`,
                    department: profileData.department,
                  };
                }
                break;
              case 'student':
                profileData = await DatabaseService.getStudentById(user.profileId);
                if (profileData) {
                  additionalInfo = {
                    name: `${profileData.firstName} ${profileData.lastName}`,
                    department: `${profileData.grade} - ${profileData.section}`,
                  };
                }
                break;
              default:
                additionalInfo = {
                  name: user.email.split('@')[0],
                  department: user.role.charAt(0).toUpperCase() + user.role.slice(1),
                };
            }
          } catch (error) {additionalInfo = {
              name: user.email.split('@')[0],
              department: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            };
          }
        } else {
          additionalInfo = {
            name: user.email.split('@')[0],
            department: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          };
        }

        return {
          ...user,
          ...additionalInfo,
          lastLoginFormatted: user.lastLogin 
            ? formatRelativeTime(user.lastLogin)
            : 'Never',
          statusColor: user.isActive ? 'bg-green-500' : 'bg-gray-500',
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: enhancedUsers,
    });
  } catch (error: any) {return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;
    const userRole = cookieStore.get('user-role')?.value;

    if (!authToken || userRole !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, password, role, name, department, permissions, isActive, schoolId } = body;

    // Validate required fields
    if (!email || !password || !role || !name || !schoolId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields including schoolId' },
        { status: 400 }
      );
    }

    // Create user in Firebase Auth
    const auth = getAuth();
    let userCredential;
    
    try {
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (authError: any) {
      return NextResponse.json(
        { success: false, message: `Failed to create user account: ${authError.message}` },
        { status: 400 }
      );
    }

    const firebaseUser = userCredential.user;

    // Create user profile in Firestore
    const userProfile: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      email,
      role: role as 'admin' | 'teacher' | 'student' | 'parent',
      schoolId: schoolId,
      isActive: isActive !== undefined ? isActive : true,
      permissions: permissions || getDefaultPermissions(role),
    };

    try {
      // Create user document with the Firebase UID
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userProfile,
        profile: {
          name,
          department: department || '',
          createdAt: new Date(),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const newUser = {
        id: firebaseUser.uid,
        ...userProfile,
        name,
        department: department || '',
        lastLoginFormatted: 'Never',
        statusColor: userProfile.isActive ? 'bg-green-500' : 'bg-gray-500',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        user: newUser,
      });
    } catch (firestoreError: any) {
      // If Firestore fails, try to delete the Firebase Auth user
      try {
        await firebaseUser.delete();
      } catch (deleteError) {}
      
      throw firestoreError;
    }
  } catch (error: any) {return NextResponse.json(
      { success: false, message: 'Failed to create user', error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get default permissions based on role
function getDefaultPermissions(role: string): string[] {
  const defaultPermissions = {
    admin: ["manage_users", "manage_school", "view_analytics", "manage_data", "system_settings"],
    teacher: ["view_classes", "manage_attendance", "manage_grades", "view_students", "manage_assignments"],
    student: ["view_grades", "view_attendance", "view_schedule", "submit_assignments", "view_announcements"],
    parent: ["view_child_grades", "view_child_attendance", "view_child_schedule", "communicate_teachers"],
    staff: ["view_basic_data", "manage_resources", "view_schedules"]
  };

  return defaultPermissions[role as keyof typeof defaultPermissions] || [];
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
}
