import { NextResponse } from 'next/server';
import { initializeDemoSchool, DemoDataSeeder } from '../../../lib/demo-data';

export async function POST() {
  try {
    
    // Create demo school and seed with data
    const schoolId = await initializeDemoSchool();
    
    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully!',
      schoolId,
      data: {
        school: DemoDataSeeder.DEMO_SCHOOL.name,
        subjects: DemoDataSeeder.DEMO_SUBJECTS.length,
        teachers: DemoDataSeeder.DEMO_TEACHERS.length,
        classes: DemoDataSeeder.DEMO_CLASSES.length,
        students: 50,
      },
    });
  } catch (error: any) {

    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed demo data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    
    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: 'School ID is required' },
        { status: 400 }
      );
    }
    

    await DemoDataSeeder.cleanupDemoData(schoolId);
    
    return NextResponse.json({
      success: true,
      message: 'Demo data cleaned up successfully!',
    });
  } catch (error: any) {

    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to clean up demo data',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
