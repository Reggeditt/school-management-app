/**
 * Utility functions for grade calculations and analytics
 */

export interface GradeRecord {
  score: number;
  grade: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface StudentGrade {
  student: any;
  grades: Record<string, GradeRecord>;
  overall: {
    average: number;
    grade: string;
    rank: number;
  };
}

/**
 * Convert numerical score to letter grade
 */
export function scoreToGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 65) return 'C+';
  if (score >= 60) return 'C';
  if (score >= 55) return 'C-';
  if (score >= 50) return 'D';
  return 'F';
}

/**
 * Get color class for grade display
 */
export function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-green-600';
  if (grade.startsWith('B')) return 'text-blue-600';
  if (grade.startsWith('C')) return 'text-yellow-600';
  if (grade.startsWith('D')) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get badge variant for grade display
 */
export function getGradeBadgeVariant(grade: string): 'default' | 'secondary' | 'outline' | 'destructive' {
  if (grade.startsWith('A')) return 'default';
  if (grade.startsWith('B')) return 'secondary';
  if (grade.startsWith('C')) return 'outline';
  return 'destructive';
}

/**
 * Calculate class average for a specific subject or overall
 */
export function calculateClassAverage(
  studentGrades: StudentGrade[], 
  subject?: string
): number {
  if (studentGrades.length === 0) return 0;
  
  if (!subject || subject === 'all') {
    const averages = studentGrades.map(sg => sg.overall.average);
    return Math.round(averages.reduce((acc, avg) => acc + avg, 0) / averages.length);
  } else {
    const scores = studentGrades
      .map(sg => sg.grades[subject]?.score || 0)
      .filter(score => score > 0);
    
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
  }
}

/**
 * Get grade distribution for analytics
 */
export function getGradeDistribution(
  studentGrades: StudentGrade[], 
  subject?: string
): Record<string, number> {
  const grades = studentGrades.map(sg => 
    !subject || subject === 'all' 
      ? sg.overall.grade 
      : sg.grades[subject]?.grade || 'F'
  );
  
  return {
    'A': grades.filter(g => g.startsWith('A')).length,
    'B': grades.filter(g => g.startsWith('B')).length,
    'C': grades.filter(g => g.startsWith('C')).length,
    'D': grades.filter(g => g.startsWith('D')).length,
    'F': grades.filter(g => g.startsWith('F')).length,
  };
}

/**
 * Generate performance insights
 */
export function getPerformanceInsights(studentGrades: StudentGrade[]): {
  topPerformers: StudentGrade[];
  atRiskStudents: StudentGrade[];
  improvingStudents: StudentGrade[];
  decliningStudents: StudentGrade[];
} {
  return {
    topPerformers: studentGrades
      .filter(sg => sg.overall.average >= 85)
      .sort((a, b) => b.overall.average - a.overall.average)
      .slice(0, 5),
    
    atRiskStudents: studentGrades
      .filter(sg => sg.overall.average < 60)
      .sort((a, b) => a.overall.average - b.overall.average),
    
    improvingStudents: studentGrades
      .filter(sg => {
        const trends = Object.values(sg.grades).map(g => g.trend);
        return trends.filter(t => t === 'up').length > trends.filter(t => t === 'down').length;
      }),
    
    decliningStudents: studentGrades
      .filter(sg => {
        const trends = Object.values(sg.grades).map(g => g.trend);
        return trends.filter(t => t === 'down').length > trends.filter(t => t === 'up').length;
      })
  };
}

/**
 * Generate mock grade data for testing
 */
export function generateMockGrades(students: any[], subjects: string[]): StudentGrade[] {
  return students.map((student, index) => {
    const grades: Record<string, GradeRecord> = {};
    
    subjects.forEach(subject => {
      const score = Math.floor(Math.random() * 35) + 60; // 60-95 range
      grades[subject] = {
        score,
        grade: scoreToGrade(score),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
    });
    
    const averageScore = Object.values(grades).reduce((sum, g) => sum + g.score, 0) / subjects.length;
    
    return {
      student,
      grades,
      overall: {
        average: Math.round(averageScore),
        grade: scoreToGrade(averageScore),
        rank: index + 1 // This would be calculated differently in real implementation
      }
    };
  });
}
