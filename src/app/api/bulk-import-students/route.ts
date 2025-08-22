import { NextRequest, NextResponse } from 'next/server';
import { 
  addMultipleStudents, 
  Student 
} from '@/lib/database-services';

export async function POST(request: NextRequest) {
  try {
    const { students }: { students: Partial<Student>[] } = await request.json();
    
    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { success: false, error: 'Invalid student data provided' },
        { status: 400 }
      );
    }

    // Validate that all required fields are present
    for (const student of students) {
      if (!student.firstName || !student.lastName || !student.classId) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields in student data' },
          { status: 400 }
        );
      }
    }

    // Add students to database
    const results = await addMultipleStudents(students as Student[]);
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${results.length} students`,
      importedCount: results.length,
      studentIds: results.map((s: Student) => s.id)
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to import students' 
      },
      { status: 500 }
    );
  }
}
