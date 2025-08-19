import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteUser as deleteFirebaseUser, getAuth } from 'firebase/auth';
import { DatabaseService } from '@/lib/database-services';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PUT /api/users/[id] - Update a user
export async function PUT(request: NextRequest, { params }: RouteContext) {
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

    const resolvedParams = await params;
    const userId = resolvedParams.id;
    const body = await request.json();

    // Update user in Firestore
    await DatabaseService.updateUser(userId, body);

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error: any) {return NextResponse.json(
      { success: false, message: 'Failed to update user', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(request: NextRequest, { params }: RouteContext) {
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

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    // Get user details first to check if it's the last admin
    const user = await DatabaseService.getUserProfile(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if this is the last admin user
    if (user.role === 'admin') {
      const allAdmins = await DatabaseService.getUsersByRole('admin', user.schoolId);
      const activeAdmins = allAdmins.filter(admin => admin.isActive && admin.id !== userId);
      
      if (activeAdmins.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Cannot delete the last active admin user' },
          { status: 400 }
        );
      }
    }

    // Delete user from Firestore
    await DatabaseService.deleteUser(userId);

    // Note: We cannot delete the Firebase Auth user from server-side
    // This would need to be handled by an admin SDK with service account credentials
    // For now, we'll just delete the Firestore document

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {return NextResponse.json(
      { success: false, message: 'Failed to delete user', error: error.message },
      { status: 500 }
    );
  }
}
