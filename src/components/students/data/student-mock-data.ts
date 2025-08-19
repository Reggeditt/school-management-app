// Mock data for student components - in real app, this would come from the database

export const getStudentSiblings = () => {
  return [
    {
      id: 'sibling1',
      name: 'Sarah Johnson',
      grade: '7th',
      section: 'A',
      relationship: 'Sister'
    }
  ];
};

export const getStudentMedicalConditions = () => {
  return [
    {
      condition: 'Asthma',
      severity: 'Mild',
      medication: 'Albuterol inhaler',
      notes: 'Keep inhaler available during sports activities'
    },
    {
      condition: 'Food Allergy',
      severity: 'Severe',
      medication: 'EpiPen',
      notes: 'Allergic to peanuts and tree nuts'
    }
  ];
};

export const getStudentEmergencyContacts = (student: any) => {
  return [
    {
      name: student.parentName,
      relationship: 'Parent/Guardian',
      phone: student.parentPhone,
      email: student.parentEmail || '',
      isPrimary: true
    },
    {
      name: student.emergencyContact || 'N/A',
      relationship: 'Emergency Contact',
      phone: student.emergencyPhone || 'N/A',
      email: '',
      isPrimary: false
    }
  ];
};

export const getStudentAcademicData = (selectedAcademicYear: string, selectedTerm: string) => {
  const academicRecords: Record<string, Record<string, any>> = {
    '2024-2025': {
      current: {
        gpa: 3.8,
        attendance: 92,
        subjects: [
          { name: 'Mathematics', grades: [88, 92, 85], average: 88.3, trend: 'improving' },
          { name: 'English', grades: [85, 83, 89], average: 85.7, trend: 'improving' },
          { name: 'Science', grades: [82, 84, 86], average: 84.0, trend: 'improving' },
          { name: 'History', grades: [90, 88, 91], average: 89.7, trend: 'stable' },
          { name: 'Physical Education', grades: [95, 93, 97], average: 95.0, trend: 'stable' }
        ],
        termGrowth: 12,
        cumulativePerformance: {
          totalCredits: 120,
          earnedCredits: 115,
          overallGPA: 3.75
        },
        recentActivity: [
          { date: '2025-08-15', activity: 'Submitted Math Assignment #5', type: 'assignment' },
          { date: '2025-08-14', activity: 'Attended Science Lab Session', type: 'attendance' },
          { date: '2025-08-13', activity: 'Received A+ in English Essay', type: 'grade' },
          { date: '2025-08-12', activity: 'Participated in Sports Day', type: 'activity' }
        ]
      },
      'term-1': {
        gpa: 3.6,
        attendance: 89,
        subjects: [
          { name: 'Mathematics', grades: [85, 88], average: 86.5, trend: 'improving' },
          { name: 'English', grades: [82, 85], average: 83.5, trend: 'improving' },
          { name: 'Science', grades: [80, 82], average: 81.0, trend: 'improving' },
          { name: 'History', grades: [88, 90], average: 89.0, trend: 'improving' },
          { name: 'Physical Education', grades: [92, 95], average: 93.5, trend: 'improving' }
        ],
        recentActivity: [
          { date: '2025-04-15', activity: 'Term 1 Final Exams', type: 'exam' },
          { date: '2025-04-10', activity: 'Science Project Presentation', type: 'project' }
        ]
      },
      'term-2': {
        gpa: 3.7,
        attendance: 91,
        subjects: [
          { name: 'Mathematics', grades: [86, 90], average: 88.0, trend: 'improving' },
          { name: 'English', grades: [83, 87], average: 85.0, trend: 'improving' },
          { name: 'Science', grades: [81, 85], average: 83.0, trend: 'improving' },
          { name: 'History', grades: [87, 91], average: 89.0, trend: 'stable' },
          { name: 'Physical Education', grades: [93, 96], average: 94.5, trend: 'improving' }
        ],
        recentActivity: [
          { date: '2025-07-15', activity: 'Term 2 Final Exams', type: 'exam' },
          { date: '2025-07-08', activity: 'Math Competition - 2nd Place', type: 'achievement' }
        ]
      }
    },
    '2023-2024': {
      'year-end': {
        gpa: 3.5,
        attendance: 87,
        subjects: [
          { name: 'Mathematics', grades: [78, 82, 85], average: 81.7, trend: 'improving' },
          { name: 'English', grades: [80, 79, 83], average: 80.7, trend: 'stable' },
          { name: 'Science', grades: [75, 78, 80], average: 77.7, trend: 'improving' },
          { name: 'History', grades: [85, 87, 88], average: 86.7, trend: 'improving' },
          { name: 'Physical Education', grades: [90, 92, 94], average: 92.0, trend: 'improving' }
        ],
        recentActivity: [
          { date: '2024-06-15', activity: 'Year End Final Exams', type: 'exam' },
          { date: '2024-06-01', activity: 'Graduation Ceremony', type: 'ceremony' }
        ]
      }
    }
  };
  
  return academicRecords[selectedAcademicYear]?.[selectedTerm] || academicRecords['2024-2025'].current;
};

export const getStudentAttendanceData = (selectedAttendanceYear: string) => {
  const attendanceRecords: Record<string, any> = {
    '2024-2025': {
      monthlyData: [
        { month: 'August', present: 22, total: 23, percentage: 95.7 },
        { month: 'July', present: 20, total: 22, percentage: 90.9 },
        { month: 'June', present: 19, total: 21, percentage: 90.5 },
        { month: 'May', present: 21, total: 23, percentage: 91.3 },
        { month: 'April', present: 18, total: 20, percentage: 90.0 },
        { month: 'March', present: 20, total: 22, percentage: 90.9 }
      ],
      yearlyTrend: 'improving',
      averageAttendance: 92.1,
      totalDays: 131,
      presentDays: 120,
      absentDays: 11,
      lateArrivals: 3
    },
    '2023-2024': {
      averageAttendance: 87.5,
      totalDays: 180,
      presentDays: 158,
      absentDays: 22,
      yearlyTrend: 'stable',
      monthlyData: []
    }
  };
  
  return attendanceRecords[selectedAttendanceYear] || attendanceRecords['2024-2025'];
};

export const calculateStudentGrowthMetric = (academicData: any) => {
  const previousYearData = {
    gpa: 3.5,
    attendance: 87
  };
  
  const gpaGrowth = ((academicData.gpa - previousYearData.gpa) / previousYearData.gpa) * 100;
  const attendanceGrowth = ((academicData.attendance - previousYearData.attendance) / previousYearData.attendance) * 100;
  
  return {
    gpa: {
      current: academicData.gpa,
      previous: previousYearData.gpa,
      growth: gpaGrowth,
      trend: gpaGrowth > 0 ? 'improving' : gpaGrowth < 0 ? 'declining' : 'stable'
    },
    attendance: {
      current: academicData.attendance,
      previous: previousYearData.attendance,
      growth: attendanceGrowth,
      trend: attendanceGrowth > 0 ? 'improving' : attendanceGrowth < 0 ? 'declining' : 'stable'
    }
  };
};

export const getStudentVaccinations = () => {
  return [
    {
      vaccine: 'COVID-19',
      date: '2023-09-15',
      dueDate: '2024-09-15',
      status: 'completed'
    },
    {
      vaccine: 'Flu Shot',
      date: '2024-08-20',
      dueDate: '2025-08-20',
      status: 'completed'
    },
    {
      vaccine: 'Tdap',
      date: '2022-05-10',
      dueDate: '2032-05-10',
      status: 'completed'
    },
    {
      vaccine: 'Meningococcal',
      date: null,
      dueDate: '2025-01-15',
      status: 'overdue'
    }
  ];
};

export const getStudentMedicalHistory = () => {
  return [
    {
      date: '2024-08-15',
      type: 'Routine Checkup',
      provider: 'Dr. Sarah Wilson',
      notes: 'Annual physical exam - all vitals normal',
      status: 'completed'
    },
    {
      date: '2024-03-22',
      type: 'Sick Visit',
      provider: 'Dr. Michael Chen',
      notes: 'Treated for mild cold symptoms',
      status: 'completed'
    },
    {
      date: '2023-12-10',
      type: 'Emergency',
      provider: 'Emergency Room',
      notes: 'Minor sports injury - sprained ankle',
      status: 'completed'
    }
  ];
};

export const getStudentActivityLog = () => {
  return [
    {
      date: '2025-08-15',
      time: '10:30 AM',
      activity: 'Submitted Math Assignment #5',
      type: 'assignment',
      details: 'Algebra problems on quadratic equations'
    },
    {
      date: '2025-08-14',
      time: '2:15 PM',
      activity: 'Attended Science Lab Session',
      type: 'attendance',
      details: 'Chemistry lab - Acid-base reactions'
    },
    {
      date: '2025-08-13',
      time: '11:45 AM',
      activity: 'Received A+ in English Essay',
      type: 'grade',
      details: 'Essay on "To Kill a Mockingbird" - 98/100'
    },
    {
      date: '2025-08-12',
      time: '3:00 PM',
      activity: 'Participated in Sports Day',
      type: 'activity',
      details: 'Track and field events - 2nd place in 200m'
    },
    {
      date: '2025-08-11',
      time: '9:00 AM',
      activity: 'Parent-Teacher Conference',
      type: 'meeting',
      details: 'Discussed academic progress with parents'
    },
    {
      date: '2025-08-10',
      time: '1:20 PM',
      activity: 'Library Book Checkout',
      type: 'library',
      details: 'Checked out "The Great Gatsby" for English class'
    }
  ];
};
