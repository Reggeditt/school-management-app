import { DatabaseService } from '@/lib/database-services';

export interface ClassAnalytics {
  id: string;
  className: string;
  subject: string;
  totalStudents: number;
  averageGrade: number;
  attendanceRate: number;
  assignmentsCompleted: number;
  totalAssignments: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface StudentAnalytics {
  studentId: string;
  studentName: string;
  className: string;
  currentGrade: number;
  previousGrade: number;
  gradeChange: number;
  attendanceRate: number;
  assignmentsOnTime: number;
  totalAssignments: number;
  completionRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  strengths: string[];
  concerns: string[];
}

export interface PerformanceData {
  period: string;
  date: string;
  averageGrade: number;
  attendanceRate: number;
  assignmentCompletion: number;
  studentEngagement: number;
}

export interface AnalyticsOverview {
  totalStudents: number;
  totalClasses: number;
  overallAverageGrade: number;
  overallAttendanceRate: number;
  totalAssignments: number;
  completedAssignments: number;
  atRiskStudents: number;
  improvingStudents: number;
  topPerformer: string;
}

export interface SubjectAnalytics {
  subject: string;
  averageGrade: number;
  studentCount: number;
  passRate: number;
  improvementRate: number;
  challengingTopics: string[];
  successfulTopics: string[];
}

export interface AttendanceAnalytics {
  date: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
}

export interface GradeDistribution {
  gradeRange: string;
  count: number;
  percentage: number;
}

export class AnalyticsService {
  
  /**
   * Get comprehensive analytics overview for teacher
   */
  static async getAnalyticsOverview(teacherId: string): Promise<AnalyticsOverview> {
    try {
      // In a real implementation, this would aggregate data from Firestore
      // For now, we'll generate mock data based on teacher's classes
      
      return {
        totalStudents: 83,
        totalClasses: 3,
        overallAverageGrade: 8.1,
        overallAttendanceRate: 92,
        totalAssignments: 73,
        completedAssignments: 68,
        atRiskStudents: 8,
        improvingStudents: 12,
        topPerformer: 'Alice Johnson'
      };
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      throw error;
    }
  }

  /**
   * Get class-level analytics
   */
  static async getClassAnalytics(teacherId: string): Promise<ClassAnalytics[]> {
    try {
      const classAnalytics: ClassAnalytics[] = [
        {
          id: 'class_1',
          className: 'Grade 10A',
          subject: 'Mathematics',
          totalStudents: 28,
          averageGrade: 8.5,
          attendanceRate: 96,
          assignmentsCompleted: 22,
          totalAssignments: 25,
          trend: 'up',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'class_2',
          className: 'Grade 10B',
          subject: 'Mathematics',
          totalStudents: 30,
          averageGrade: 8.2,
          attendanceRate: 88,
          assignmentsCompleted: 25,
          totalAssignments: 28,
          trend: 'stable',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'class_3',
          className: 'Grade 9B',
          subject: 'Science',
          totalStudents: 25,
          averageGrade: 7.8,
          attendanceRate: 92,
          assignmentsCompleted: 18,
          totalAssignments: 20,
          trend: 'up',
          lastUpdated: new Date().toISOString()
        }
      ];
      
      return classAnalytics;
    } catch (error) {
      console.error('Error fetching class analytics:', error);
      throw error;
    }
  }

  /**
   * Get student-level analytics
   */
  static async getStudentAnalytics(teacherId: string): Promise<StudentAnalytics[]> {
    try {
      const studentAnalytics: StudentAnalytics[] = [
        {
          studentId: 'student_1',
          studentName: 'Alice Johnson',
          className: 'Grade 10A',
          currentGrade: 8.5,
          previousGrade: 8.2,
          gradeChange: 0.3,
          attendanceRate: 96,
          assignmentsOnTime: 18,
          totalAssignments: 20,
          completionRate: 90,
          riskLevel: 'low',
          strengths: ['Problem solving', 'Class participation'],
          concerns: []
        },
        {
          studentId: 'student_2',
          studentName: 'Bob Smith',
          className: 'Grade 10A',
          currentGrade: 7.2,
          previousGrade: 7.8,
          gradeChange: -0.6,
          attendanceRate: 88,
          assignmentsOnTime: 15,
          totalAssignments: 20,
          completionRate: 75,
          riskLevel: 'medium',
          strengths: ['Homework completion'],
          concerns: ['Test performance', 'Attendance']
        },
        {
          studentId: 'student_3',
          studentName: 'David Wilson',
          className: 'Grade 10B',
          currentGrade: 6.5,
          previousGrade: 6.8,
          gradeChange: -0.3,
          attendanceRate: 78,
          assignmentsOnTime: 12,
          totalAssignments: 20,
          completionRate: 60,
          riskLevel: 'high',
          strengths: ['Creative thinking'],
          concerns: ['Attendance', 'Assignment completion', 'Test scores']
        },
        {
          studentId: 'student_4',
          studentName: 'Emma Brown',
          className: 'Grade 9B',
          currentGrade: 8.9,
          previousGrade: 8.4,
          gradeChange: 0.5,
          attendanceRate: 98,
          assignmentsOnTime: 19,
          totalAssignments: 20,
          completionRate: 95,
          riskLevel: 'low',
          strengths: ['Consistent performance', 'Leadership'],
          concerns: []
        },
        {
          studentId: 'student_5',
          studentName: 'Alex Chen',
          className: 'Grade 9B',
          currentGrade: 7.6,
          previousGrade: 7.1,
          gradeChange: 0.5,
          attendanceRate: 94,
          assignmentsOnTime: 17,
          totalAssignments: 20,
          completionRate: 85,
          riskLevel: 'low',
          strengths: ['Improvement trend', 'Effort'],
          concerns: []
        }
      ];
      
      return studentAnalytics.sort((a, b) => b.currentGrade - a.currentGrade);
    } catch (error) {
      console.error('Error fetching student analytics:', error);
      throw error;
    }
  }

  /**
   * Get performance data over time
   */
  static async getPerformanceData(teacherId: string, period: 'week' | 'month' | 'semester'): Promise<PerformanceData[]> {
    try {
      const now = new Date();
      const performanceData: PerformanceData[] = [];
      
      // Generate data based on selected period
      const periods = period === 'week' ? 7 : period === 'month' ? 30 : 120;
      const intervalDays = period === 'week' ? 1 : period === 'month' ? 1 : 7;
      
      for (let i = periods - 1; i >= 0; i -= intervalDays) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Generate realistic fluctuating data
        const baseGrade = 8.0 + (Math.random() - 0.5) * 0.6;
        const baseAttendance = 90 + Math.random() * 8;
        const baseCompletion = 85 + Math.random() * 10;
        const baseEngagement = 75 + Math.random() * 20;
        
        performanceData.push({
          period: period === 'week' 
            ? date.toLocaleDateString('en-US', { weekday: 'short' })
            : period === 'month'
            ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : `Week ${Math.ceil((periods - i) / 7)}`,
          date: date.toISOString().split('T')[0],
          averageGrade: Math.round(baseGrade * 10) / 10,
          attendanceRate: Math.round(baseAttendance),
          assignmentCompletion: Math.round(baseCompletion),
          studentEngagement: Math.round(baseEngagement)
        });
      }
      
      return performanceData;
    } catch (error) {
      console.error('Error fetching performance data:', error);
      throw error;
    }
  }

  /**
   * Get subject-specific analytics
   */
  static async getSubjectAnalytics(teacherId: string): Promise<SubjectAnalytics[]> {
    try {
      const subjectAnalytics: SubjectAnalytics[] = [
        {
          subject: 'Mathematics',
          averageGrade: 8.35,
          studentCount: 58,
          passRate: 94,
          improvementRate: 78,
          challengingTopics: ['Quadratic equations', 'Trigonometry'],
          successfulTopics: ['Linear algebra', 'Basic geometry']
        },
        {
          subject: 'Science',
          averageGrade: 7.8,
          studentCount: 25,
          passRate: 88,
          improvementRate: 84,
          challengingTopics: ['Chemical reactions', 'Physics calculations'],
          successfulTopics: ['Scientific method', 'Biology concepts']
        }
      ];
      
      return subjectAnalytics;
    } catch (error) {
      console.error('Error fetching subject analytics:', error);
      throw error;
    }
  }

  /**
   * Get attendance analytics
   */
  static async getAttendanceAnalytics(teacherId: string, days: number = 30): Promise<AttendanceAnalytics[]> {
    try {
      const now = new Date();
      const attendanceData: AttendanceAnalytics[] = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;
        
        const totalStudents = 83;
        const presentCount = Math.floor(totalStudents * (0.88 + Math.random() * 0.12));
        const lateCount = Math.floor((totalStudents - presentCount) * 0.3);
        const absentCount = totalStudents - presentCount - lateCount;
        
        attendanceData.push({
          date: date.toISOString().split('T')[0],
          presentCount,
          absentCount,
          lateCount,
          attendanceRate: Math.round((presentCount / totalStudents) * 100)
        });
      }
      
      return attendanceData;
    } catch (error) {
      console.error('Error fetching attendance analytics:', error);
      throw error;
    }
  }

  /**
   * Get grade distribution
   */
  static async getGradeDistribution(teacherId: string): Promise<GradeDistribution[]> {
    try {
      return [
        { gradeRange: '9.0-10.0', count: 12, percentage: 14.5 },
        { gradeRange: '8.0-8.9', count: 28, percentage: 33.7 },
        { gradeRange: '7.0-7.9', count: 24, percentage: 28.9 },
        { gradeRange: '6.0-6.9', count: 15, percentage: 18.1 },
        { gradeRange: '5.0-5.9', count: 3, percentage: 3.6 },
        { gradeRange: 'Below 5.0', count: 1, percentage: 1.2 }
      ];
    } catch (error) {
      console.error('Error fetching grade distribution:', error);
      throw error;
    }
  }

  /**
   * Export analytics data to CSV
   */
  static async exportAnalytics(teacherId: string, type: 'overview' | 'students' | 'classes'): Promise<string> {
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (type === 'overview') {
        const overview = await this.getAnalyticsOverview(teacherId);
        const headers = ['Metric', 'Value'];
        const rows = [
          headers.join(','),
          `Total Students,${overview.totalStudents}`,
          `Total Classes,${overview.totalClasses}`,
          `Overall Average Grade,${overview.overallAverageGrade}`,
          `Overall Attendance Rate,${overview.overallAttendanceRate}%`,
          `Total Assignments,${overview.totalAssignments}`,
          `Completed Assignments,${overview.completedAssignments}`,
          `At Risk Students,${overview.atRiskStudents}`,
          `Improving Students,${overview.improvingStudents}`,
          `Top Performer,"${overview.topPerformer}"`
        ];
        return rows.join('\n');
      }
      
      if (type === 'students') {
        const students = await this.getStudentAnalytics(teacherId);
        const headers = ['Student Name', 'Class', 'Current Grade', 'Grade Change', 'Attendance Rate', 'Completion Rate', 'Risk Level'];
        const rows = [headers.join(',')];
        
        students.forEach(student => {
          const row = [
            `"${student.studentName}"`,
            `"${student.className}"`,
            student.currentGrade.toString(),
            student.gradeChange.toString(),
            `${student.attendanceRate}%`,
            `${student.completionRate}%`,
            student.riskLevel
          ];
          rows.push(row.join(','));
        });
        
        return rows.join('\n');
      }
      
      if (type === 'classes') {
        const classes = await this.getClassAnalytics(teacherId);
        const headers = ['Class Name', 'Subject', 'Total Students', 'Average Grade', 'Attendance Rate', 'Assignments Completed', 'Total Assignments', 'Trend'];
        const rows = [headers.join(',')];
        
        classes.forEach(cls => {
          const row = [
            `"${cls.className}"`,
            `"${cls.subject}"`,
            cls.totalStudents.toString(),
            cls.averageGrade.toString(),
            `${cls.attendanceRate}%`,
            cls.assignmentsCompleted.toString(),
            cls.totalAssignments.toString(),
            cls.trend
          ];
          rows.push(row.join(','));
        });
        
        return rows.join('\n');
      }
      
      throw new Error('Invalid export type');
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw error;
    }
  }

  /**
   * Get insights and recommendations based on analytics
   */
  static async getInsights(teacherId: string): Promise<string[]> {
    try {
      const [overview, students, classes] = await Promise.all([
        this.getAnalyticsOverview(teacherId),
        this.getStudentAnalytics(teacherId),
        this.getClassAnalytics(teacherId)
      ]);
      
      const insights: string[] = [];
      
      // Attendance insights
      if (overview.overallAttendanceRate < 85) {
        insights.push('📉 Overall attendance is below 85%. Consider reaching out to frequently absent students.');
      } else if (overview.overallAttendanceRate > 95) {
        insights.push('✅ Excellent attendance rate! Your students are highly engaged.');
      }
      
      // Grade insights
      if (overview.overallAverageGrade > 8.5) {
        insights.push('🎉 Outstanding academic performance across all classes!');
      } else if (overview.overallAverageGrade < 7.0) {
        insights.push('📚 Consider reviewing curriculum difficulty or providing additional support.');
      }
      
      // At-risk student insights
      if (overview.atRiskStudents > 0) {
        insights.push(`⚠️ ${overview.atRiskStudents} students need additional attention and support.`);
      }
      
      // Assignment completion insights
      const completionRate = (overview.completedAssignments / overview.totalAssignments) * 100;
      if (completionRate < 80) {
        insights.push('📝 Assignment completion rate is low. Consider adjusting assignment load or deadlines.');
      }
      
      // Class performance insights
      const bestClass = classes.reduce((best, current) => 
        current.averageGrade > best.averageGrade ? current : best
      );
      const worstClass = classes.reduce((worst, current) => 
        current.averageGrade < worst.averageGrade ? current : worst
      );
      
      if (classes.length > 1) {
        insights.push(`🏆 ${bestClass.className} is performing exceptionally well (${bestClass.averageGrade}/10).`);
        if (worstClass.averageGrade < 7.5) {
          insights.push(`🎯 ${worstClass.className} may benefit from additional support or modified teaching approach.`);
        }
      }
      
      // Improvement trends
      const improvingCount = students.filter(s => s.gradeChange > 0).length;
      if (improvingCount > students.length * 0.6) {
        insights.push('📈 Majority of students are showing grade improvements. Great teaching!');
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }
}
