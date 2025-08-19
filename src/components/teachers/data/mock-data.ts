export const getStudentPerformance = () => ({
  overallStats: {
    totalStudents: 156,
    averageClassPerformance: 87.3,
    overallPassRate: 94.2,
    teachingEffectiveness: "Excellent"
  },
  classPerformance: [
    {
      className: "Grade 12A",
      subject: "Advanced Mathematics",
      students: 28,
      averageGrade: 95.8,
      passRate: 100,
      trend: "improving",
      topPerformers: ["Sarah Johnson", "Michael Chen", "Emma Rodriguez"],
      strugglingStudents: ["None - All students performing well"]
    },
    {
      className: "Grade 11B",
      subject: "Algebra II",
      students: 32,
      averageGrade: 82.4,
      passRate: 90.6,
      trend: "stable",
      topPerformers: ["David Kim", "Lisa Wang", "James Miller"],
      strugglingStudents: ["Tom Wilson", "Amy Brown", "Kevin Davis"]
    },
    {
      className: "Grade 10B",
      subject: "Geometry",
      students: 29,
      averageGrade: 78.9,
      passRate: 86.2,
      trend: "improving",
      topPerformers: ["Maria Garcia", "John Smith", "Alex Thompson"],
      strugglingStudents: ["Robert Jones", "Emily Taylor", "Chris Anderson"]
    }
  ],
  recentAssessments: [
    {
      assessment: "Midterm Exam - Calculus",
      class: "Grade 12A",
      date: "2024-11-15",
      average: 91.5,
      participation: 100
    },
    {
      assessment: "Unit Test - Quadratic Functions",
      class: "Grade 11B",
      date: "2024-11-12",
      average: 84.2,
      participation: 96.9
    },
    {
      assessment: "Quiz - Triangle Properties",
      class: "Grade 10B",
      date: "2024-11-10",
      average: 79.8,
      participation: 93.1
    }
  ]
});

export const getTeacherSchedule = () => ({
  totalHours: 35,
  teachingHours: 28,
  preparationHours: 4,
  meetingHours: 2,
  freeHours: 1,
  weeklySchedule: {
    monday: [
      { time: "8:00-8:45", subject: "Grade 12A - Calculus", room: "Room 201", type: "class", students: 28 },
      { time: "8:45-9:30", subject: "Grade 11B - Algebra II", room: "Room 203", type: "class", students: 32 },
      { time: "9:30-10:15", subject: "Break", type: "break" },
      { time: "10:15-11:00", subject: "Grade 10B - Geometry", room: "Room 108", type: "class", students: 30 },
      { time: "11:00-11:45", subject: "Lesson Preparation", type: "preparation" },
      { time: "11:45-12:30", subject: "Grade 9C - Pre-Algebra", room: "Room 205", type: "class", students: 26 },
      { time: "12:30-1:15", subject: "Lunch Break", type: "break" },
      { time: "1:15-2:00", subject: "Free Period", type: "break" }
    ],
    tuesday: [
      { time: "8:00-8:45", subject: "Grade 11B - Algebra II", room: "Room 203", type: "class", students: 32 },
      { time: "8:45-9:30", subject: "Grade 12A - Statistics", room: "Room 201", type: "class", students: 28 },
      { time: "9:30-10:15", subject: "Break", type: "break" },
      { time: "10:15-11:00", subject: "Grade 10B - Geometry", room: "Room 108", type: "class", students: 30 },
      { time: "11:00-11:45", subject: "Department Meeting", type: "meeting" },
      { time: "11:45-12:30", subject: "Grade 9C - Pre-Algebra", room: "Room 205", type: "class", students: 26 },
      { time: "12:30-1:15", subject: "Lunch Break", type: "break" },
      { time: "1:15-2:00", subject: "Grading Time", type: "preparation" }
    ],
    wednesday: [
      { time: "8:00-8:45", subject: "Grade 12A - Calculus", room: "Room 201", type: "class", students: 28 },
      { time: "8:45-9:30", subject: "Grade 11B - Algebra II", room: "Room 203", type: "class", students: 32 },
      { time: "9:30-10:15", subject: "Break", type: "break" },
      { time: "10:15-11:00", subject: "Grade 10B - Geometry", room: "Room 108", type: "class", students: 30 },
      { time: "11:00-11:45", subject: "Lesson Preparation", type: "preparation" },
      { time: "11:45-12:30", subject: "Grade 9C - Pre-Algebra", room: "Room 205", type: "class", students: 26 },
      { time: "12:30-1:15", subject: "Lunch Break", type: "break" },
      { time: "1:15-2:00", subject: "Free Period", type: "break" }
    ],
    thursday: [
      { time: "8:00-8:45", subject: "Grade 11B - Algebra II", room: "Room 203", type: "class", students: 32 },
      { time: "8:45-9:30", subject: "Grade 12A - Statistics", room: "Room 201", type: "class", students: 28 },
      { time: "9:30-10:15", subject: "Break", type: "break" },
      { time: "10:15-11:00", subject: "Grade 10B - Geometry", room: "Room 108", type: "class", students: 30 },
      { time: "11:00-11:45", subject: "Parent Conference", type: "meeting" },
      { time: "11:45-12:30", subject: "Grade 9C - Pre-Algebra", room: "Room 205", type: "class", students: 26 },
      { time: "12:30-1:15", subject: "Lunch Break", type: "break" },
      { time: "1:15-2:00", subject: "Grading Time", type: "preparation" }
    ],
    friday: [
      { time: "8:00-8:45", subject: "Grade 12A - Calculus", room: "Room 201", type: "class", students: 28 },
      { time: "8:45-9:30", subject: "Grade 11B - Algebra II", room: "Room 203", type: "class", students: 32 },
      { time: "9:30-10:15", subject: "Break", type: "break" },
      { time: "10:15-11:00", subject: "Grade 10B - Geometry", room: "Room 108", type: "class", students: 30 },
      { time: "11:00-11:45", subject: "Grade 9C - Pre-Algebra", room: "Room 205", type: "class", students: 26 },
      { time: "11:45-12:30", subject: "Lesson Preparation", type: "preparation" },
      { time: "12:30-1:15", subject: "Lunch Break", type: "break" },
      { time: "1:15-2:00", subject: "Free Period", type: "break" }
    ]
  },
  summary: {
    weeklyHours: 28,
    classesPerWeek: 18,
    subjectsCount: 3,
    freePeriods: 7
  },
  timetable: [
    {
      time: "8:00 - 8:45",
      days: [
        { class: "Grade 12A", subject: "Calculus", room: "Room 201" },
        null,
        { class: "Grade 11B", subject: "Algebra II", room: "Room 203" },
        { class: "Grade 12A", subject: "Statistics", room: "Room 201" },
        null
      ]
    },
    {
      time: "8:45 - 9:30",
      days: [
        { class: "Grade 11B", subject: "Algebra II", room: "Room 203" },
        { class: "Grade 10B", subject: "Geometry", room: "Room 205" },
        null,
        { class: "Grade 11B", subject: "Algebra II", room: "Room 203" },
        { class: "Grade 12A", subject: "Calculus", room: "Room 201" }
      ]
    },
    {
      time: "9:45 - 10:30",
      days: [
        null,
        { class: "Grade 12A", subject: "Statistics", room: "Room 201" },
        { class: "Grade 10B", subject: "Geometry", room: "Room 205" },
        null,
        { class: "Grade 10B", subject: "Geometry", room: "Room 205" }
      ]
    },
    {
      time: "10:30 - 11:15",
      days: [
        { class: "Grade 10B", subject: "Geometry", room: "Room 205" },
        { class: "Grade 11B", subject: "Algebra II", room: "Room 203" },
        { class: "Grade 12A", subject: "Calculus", room: "Room 201" },
        { class: "Grade 10B", subject: "Geometry", room: "Room 205" },
        null
      ]
    },
    {
      time: "12:00 - 12:45",
      days: [
        { class: "Grade 12A", subject: "Statistics", room: "Room 201" },
        null,
        { class: "Grade 11B", subject: "Algebra II", room: "Room 203" },
        { class: "Grade 12A", subject: "Calculus", room: "Room 201" },
        { class: "Grade 11B", subject: "Algebra II", room: "Room 203" }
      ]
    }
  ],
  conflicts: [
    {
      type: "Double Booking",
      description: "Two classes scheduled at the same time on Wednesday",
      time: "Wednesday 2:00 PM - Rooms 201 & 203"
    }
  ],
  upcomingEvents: [
    {
      title: "Parent-Teacher Conference",
      description: "Individual meetings with Grade 12A parents",
      date: "2024-12-05",
      time: "3:00 PM",
      priority: "high"
    },
    {
      title: "Department Meeting",
      description: "Mathematics department monthly meeting",
      date: "2024-12-03",
      time: "4:30 PM",
      priority: "medium"
    },
    {
      title: "Grade Submission Deadline",
      description: "Submit all semester grades",
      date: "2024-12-15",
      time: "5:00 PM",
      priority: "high"
    }
  ],
  substituteHistory: [
    {
      type: "Substitute Required",
      reason: "Medical Leave",
      class: "Grade 11B",
      subject: "Algebra II",
      date: "2024-11-20",
      coveredBy: "Ms. Thompson",
      status: "completed"
    },
    {
      type: "Coverage Provided",
      reason: "Conference Attendance",
      class: "Grade 10A",
      subject: "Geometry",
      date: "2024-11-18",
      coveredBy: "Dr. Johnson",
      status: "completed"
    }
  ]
});

export const getSalaryData = () => ({
  current: {
    grossSalary: 4200,
    netSalary: 3150,
    totalAllowances: 800,
    totalDeductions: 1050
  },
  breakdown: {
    allowances: [
      {
        name: "Housing Allowance",
        description: "Monthly housing support",
        amount: 500,
        percentage: 12
      },
      {
        name: "Transport Allowance",
        description: "Transportation reimbursement",
        amount: 200,
        percentage: 5
      },
      {
        name: "Professional Development",
        description: "Training and certification support",
        amount: 100,
        percentage: 2.4
      }
    ],
    deductions: [
      {
        name: "Federal Income Tax",
        description: "Federal tax deduction",
        amount: 650,
        percentage: 15.5
      },
      {
        name: "State Tax",
        description: "State income tax",
        amount: 200,
        percentage: 4.8
      },
      {
        name: "Health Insurance",
        description: "Medical & dental coverage",
        amount: 150,
        percentage: 3.6
      },
      {
        name: "Retirement Fund",
        description: "401k contribution",
        amount: 50,
        percentage: 1.2
      }
    ]
  },
  payHistory: [
    {
      month: "November",
      year: 2024,
      netAmount: 3150,
      paidDate: "2024-11-30",
      status: "paid"
    },
    {
      month: "October",
      year: 2024,
      netAmount: 3150,
      paidDate: "2024-10-31",
      status: "paid"
    },
    {
      month: "September",
      year: 2024,
      netAmount: 3150,
      paidDate: "2024-09-30",
      status: "paid"
    }
  ],
  reviews: [
    {
      type: "Annual Performance Review",
      effectiveDate: "2024-09-01",
      increaseType: "percentage",
      increaseValue: 8,
      previousSalary: 3900,
      newSalary: 4200,
      reason: "Excellent performance, student achievement improvement, and professional development completion"
    },
    {
      type: "Cost of Living Adjustment",
      effectiveDate: "2024-01-01",
      increaseType: "percentage",
      increaseValue: 3.5,
      previousSalary: 3770,
      newSalary: 3900,
      reason: "Annual cost of living adjustment per district policy"
    }
  ],
  tax: {
    annualDeducted: 10200,
    effectiveRate: 20.2,
    documents: [
      { name: "W-2 Form 2024", type: "tax-form" },
      { name: "Tax Summary 2024", type: "summary" },
      { name: "Deduction Details", type: "breakdown" }
    ]
  }
});

export const getSubmissionsData = () => ({
  documents: [
    {
      id: "DOC001",
      title: "Lesson Plan - Week 12",
      type: "lesson-plan",
      subject: "Mathematics",
      class: "Grade 12A",
      submittedDate: "2025-08-18",
      dueDate: "2025-08-19",
      status: "submitted",
      size: "2.4 MB",
      format: "PDF",
      description: "Weekly lesson plan covering calculus derivatives"
    },
    {
      id: "DOC002",
      title: "Student Progress Report",
      type: "progress-report",
      subject: "Mathematics",
      class: "Grade 11B",
      submittedDate: "2025-08-15",
      dueDate: "2025-08-16",
      status: "approved",
      size: "1.8 MB",
      format: "Excel",
      description: "Mid-semester progress report for all students"
    },
    {
      id: "DOC003",
      title: "Professional Development Certificate",
      type: "certification",
      subject: "Professional Development",
      class: "N/A",
      submittedDate: "2025-08-10",
      dueDate: "2025-08-31",
      status: "under-review",
      size: "856 KB",
      format: "PDF",
      description: "Certification from Advanced Teaching Methods Workshop"
    },
    {
      id: "DOC004",
      title: "Exam Question Bank",
      type: "assessment",
      subject: "Mathematics",
      class: "Grade 10B",
      submittedDate: "2025-08-12",
      dueDate: "2025-08-20",
      status: "submitted",
      size: "3.2 MB",
      format: "Word",
      description: "Comprehensive question bank for geometry final exam"
    },
    {
      id: "DOC005",
      title: "Curriculum Update Proposal",
      type: "curriculum",
      subject: "Mathematics",
      class: "All Grades",
      submittedDate: "2025-08-05",
      dueDate: "2025-08-15",
      status: "rejected",
      size: "1.2 MB",
      format: "PDF",
      description: "Proposal for integrating more practical applications",
      rejectionReason: "Needs more detailed implementation timeline"
    },
    {
      id: "DOC006",
      title: "Parent Conference Notes",
      type: "meeting-notes",
      subject: "General",
      class: "Grade 12A",
      submittedDate: "2025-08-08",
      dueDate: "2025-08-10",
      status: "approved",
      size: "645 KB",
      format: "Word",
      description: "Summary of parent-teacher conference meetings"
    }
  ],
  stats: {
    totalSubmissions: 6,
    pendingReview: 1,
    approved: 2,
    rejected: 1,
    onTime: 5,
    late: 1
  },
  categories: [
    { name: "Lesson Plans", count: 1, icon: "book" },
    { name: "Progress Reports", count: 1, icon: "trending-up" },
    { name: "Certifications", count: 1, icon: "award" },
    { name: "Assessments", count: 1, icon: "clipboard" },
    { name: "Curriculum", count: 1, icon: "layers" },
    { name: "Meeting Notes", count: 1, icon: "users" }
  ]
});

export const getPerformanceData = () => ({
  rating: 4.8,
  studentSatisfaction: 95,
  classesAssigned: 3,
  subjectsAssigned: 2,
  recentActivity: [
    { date: '2025-08-15', activity: 'Conducted Grade 10 Mathematics exam', type: 'exam' },
    { date: '2025-08-14', activity: 'Submitted lesson plans for next week', type: 'planning' },
    { date: '2025-08-13', activity: 'Parent-teacher meeting scheduled', type: 'meeting' },
    { date: '2025-08-12', activity: 'Graded assignments for Grade 9', type: 'grading' }
  ],
  achievements: [
    { title: 'Teacher of the Month', date: '2025-07-01', description: 'Recognized for outstanding performance' },
    { title: 'Perfect Attendance', date: '2025-06-01', description: 'No absences in academic year' },
    { title: 'Student Favorite', date: '2025-05-01', description: 'Highest student satisfaction rating' }
  ]
});

export const getTeacherClasses = () => [
  {
    id: 'cls-001',
    name: 'Grade 12A',
    grade: 12,
    students: 28,
    subject: 'Advanced Mathematics',
    room: 'Room 305',
    schedule: 'MWF 9:00-10:30'
  },
  {
    id: 'cls-002', 
    name: 'Grade 11B',
    grade: 11,
    students: 32,
    subject: 'Algebra II',
    room: 'Room 203',
    schedule: 'TTh 11:00-12:30'
  },
  {
    id: 'cls-003',
    name: 'Grade 10B',
    grade: 10,
    students: 30,
    subject: 'Geometry',
    room: 'Room 108',
    schedule: 'MWF 1:00-2:30'
  },
  {
    id: 'cls-004',
    name: 'Grade 9C',
    grade: 9,
    students: 26,
    subject: 'Pre-Algebra',
    room: 'Room 205',
    schedule: 'TTh 2:00-3:30'
  }
];
