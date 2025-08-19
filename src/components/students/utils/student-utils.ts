// Utility functions for student components

export const calculateAge = (dateOfBirth: Date | string): number => {
  const birth = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

export const getGradeColor = (grade: string): string => {
  const gradeValue = parseFloat(grade);
  if (gradeValue >= 90) return 'bg-emerald-100 text-emerald-800';
  if (gradeValue >= 80) return 'bg-blue-100 text-blue-800';
  if (gradeValue >= 70) return 'bg-yellow-100 text-yellow-800';
  if (gradeValue >= 60) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

export const calculateGPA = (grades: Array<{ grade: string; credits: number }>): number => {
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const totalCredits = grades.reduce((sum, grade) => sum + grade.credits, 0);
  const totalPoints = grades.reduce((sum, grade) => {
    const points = gradePoints[grade.grade as keyof typeof gradePoints] || 0;
    return sum + (points * grade.credits);
  }, 0);

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
};

export const getAttendanceStatus = (percentage: number): {
  status: 'excellent' | 'good' | 'average' | 'poor';
  color: string;
  description: string;
} => {
  if (percentage >= 95) {
    return {
      status: 'excellent',
      color: 'bg-emerald-100 text-emerald-800',
      description: 'Excellent attendance'
    };
  }
  if (percentage >= 85) {
    return {
      status: 'good',
      color: 'bg-blue-100 text-blue-800',
      description: 'Good attendance'
    };
  }
  if (percentage >= 75) {
    return {
      status: 'average',
      color: 'bg-yellow-100 text-yellow-800',
      description: 'Average attendance'
    };
  }
  return {
    status: 'poor',
    color: 'bg-red-100 text-red-800',
    description: 'Poor attendance'
  };
};
