import { NextResponse } from 'next/server';
import { DemoDataSeeder } from '../../../lib/demo-data';

export async function POST() {
  try {
    
    // Create all demo schools with comprehensive data
    const schoolIds = await DemoDataSeeder.seedAllSchools();
    
    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully for all 3 schools!',
      schoolIds,
      data: {
        schools: [
          { name: 'Ghana National School', status: 'active', id: schoolIds.ghanaSchoolId },
          { name: 'Ashanti Academy', status: 'grace_period', id: schoolIds.ashantiSchoolId },
          { name: 'Volta College', status: 'restricted', id: schoolIds.voltaSchoolId }
        ],
        totalFamilies: DemoDataSeeder.DEMO_FAMILIES.length,
        totalStudents: DemoDataSeeder.DEMO_STUDENTS.length,
        subjectsPerSchool: DemoDataSeeder.DEMO_SUBJECTS.length,
        usersPerSchool: 7,
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
