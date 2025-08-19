'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Skeleton } from '@/components/ui/skeleton';
import { TeacherService } from '@/lib/services/teacher-service';
import { Class, Student } from '@/lib/database-services';
import { Award, TrendingUp, TrendingDown, BarChart3, Users, FileText, Download, Edit, Plus } from 'lucide-react';

export default function TeacherGradesPage() {
  const { user } = useAuth();
  const { state, loadClasses, loadStudents } = useStore();
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [teacherStudents, setTeacherStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  
  const teacherService = TeacherService.getInstance();
  const teacherId = user?.uid || '';

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) return;
      
      try {
        setLoading(true);
        
        await Promise.all([loadClasses(), loadStudents()]);
        
        const [classes, students] = await Promise.all([
          teacherService.getTeacherClasses(teacherId),
          teacherService.getTeacherStudents(teacherId)
        ]);
        
        setTeacherClasses(classes);
        setTeacherStudents(students);
        
        if (classes.length > 0 && selectedClass === 'all') {
          setSelectedClass(classes[0].id);
        }
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId, loadClasses, loadStudents, teacherService, selectedClass]);

  // Mock grades data
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English'];
  
  const studentGrades = teacherStudents.map(student => ({
    student,
    grades: {
      Mathematics: { score: Math.floor(Math.random() * 30) + 70, grade: 'A', trend: Math.random() > 0.5 ? 'up' : 'down' },
      Physics: { score: Math.floor(Math.random() * 25) + 65, grade: 'B+', trend: Math.random() > 0.5 ? 'up' : 'down' },
      Chemistry: { score: Math.floor(Math.random() * 35) + 60, grade: 'B', trend: Math.random() > 0.5 ? 'up' : 'down' },
      English: { score: Math.floor(Math.random() * 20) + 75, grade: 'A-', trend: Math.random() > 0.5 ? 'up' : 'down' },
    },
    overall: { 
      average: Math.floor(Math.random() * 25) + 70, 
      grade: 'B+', 
      rank: Math.floor(Math.random() * teacherStudents.length) + 1 
    }
  }));

  const filteredStudentGrades = selectedClass === 'all' 
    ? studentGrades 
    : studentGrades.filter(sg => {
        const studentClass = teacherClasses.find(cls => cls.students?.includes(sg.student.id));
        return studentClass?.id === selectedClass;
      });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600';
    if (grade.startsWith('B')) return 'text-blue-600';
    if (grade.startsWith('C')) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeVariant = (grade: string) => {
    if (grade.startsWith('A')) return 'default';
    if (grade.startsWith('B')) return 'secondary';
    if (grade.startsWith('C')) return 'outline';
    return 'destructive';
  };

  const calculateClassAverage = () => {
    if (filteredStudentGrades.length === 0) return 0;
    
    if (selectedSubject === 'all') {
      const averages = filteredStudentGrades.map(sg => sg.overall.average);
      return Math.round(averages.reduce((acc, avg) => acc + avg, 0) / averages.length);
    } else {
      const scores = filteredStudentGrades.map(sg => sg.grades[selectedSubject as keyof typeof sg.grades]?.score || 0);
      return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
    }
  };

  const getGradeDistribution = () => {
    const grades = filteredStudentGrades.map(sg => 
      selectedSubject === 'all' 
        ? sg.overall.grade 
        : sg.grades[selectedSubject as keyof typeof sg.grades]?.grade || 'F'
    );
    
    return {
      'A': grades.filter(g => g.startsWith('A')).length,
      'B': grades.filter(g => g.startsWith('B')).length,
      'C': grades.filter(g => g.startsWith('C')).length,
      'D': grades.filter(g => g.startsWith('D')).length,
      'F': grades.filter(g => g.startsWith('F')).length,
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const gradeDistribution = getGradeDistribution();
  const classAverage = calculateClassAverage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Grades</h1>
          <p className="text-muted-foreground">
            View and manage student grades across your classes
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Grades
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Grade
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Average</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classAverage}%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +3.2% from last term
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A Grades</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradeDistribution.A}</div>
            <p className="text-xs text-muted-foreground">
              {filteredStudentGrades.length > 0 ? Math.round((gradeDistribution.A / filteredStudentGrades.length) * 100) : 0}% of students
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradeDistribution.D + gradeDistribution.F}</div>
            <p className="text-xs text-muted-foreground">
              Below passing grade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStudentGrades.length}</div>
            <p className="text-xs text-muted-foreground">
              Across selected classes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div>
          <label className="text-sm font-medium">Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="ml-2 px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Classes</option>
            {teacherClasses.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-2 px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Overall Grade</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Distribution of grades for selected filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                    <span className="font-medium">{grade}</span>
                  </div>
                  <span className="text-sm">Grade {grade}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${filteredStudentGrades.length > 0 ? (count / filteredStudentGrades.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-16">
                    {count} ({filteredStudentGrades.length > 0 ? Math.round((count / filteredStudentGrades.length) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Grades Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Student Grades</CardTitle>
              <CardDescription>
                {selectedClass === 'all' ? 'All classes' : teacherClasses.find(c => c.id === selectedClass)?.name}
                {selectedSubject !== 'all' && ` • ${selectedSubject}`}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudentGrades.length > 0 ? (
            <div className="space-y-3">
              {filteredStudentGrades
                .sort((a, b) => {
                  if (selectedSubject === 'all') {
                    return b.overall.average - a.overall.average;
                  } else {
                    const aScore = a.grades[selectedSubject as keyof typeof a.grades]?.score || 0;
                    const bScore = b.grades[selectedSubject as keyof typeof b.grades]?.score || 0;
                    return bScore - aScore;
                  }
                })
                .map(({ student, grades, overall }) => {
                  const displayData = selectedSubject === 'all' 
                    ? { score: overall.average, grade: overall.grade, rank: overall.rank }
                    : { 
                        score: grades[selectedSubject as keyof typeof grades]?.score || 0, 
                        grade: grades[selectedSubject as keyof typeof grades]?.grade || 'F',
                        rank: null
                      };

                  return (
                    <div key={student.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {student.firstName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{student.firstName} {student.lastName}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {student.studentId}
                              {displayData.rank && ` • Rank #${displayData.rank}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className={`text-xl font-bold ${getGradeColor(displayData.grade)}`}>
                              {displayData.score}%
                            </div>
                            <Badge variant={getGradeBadgeVariant(displayData.grade)}>
                              {displayData.grade}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {selectedSubject === 'all' && (
                        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                          {Object.entries(grades).map(([subject, data]) => (
                            <div key={subject} className="text-center p-2 border rounded">
                              <div className="text-xs text-muted-foreground">{subject}</div>
                              <div className="flex items-center justify-center space-x-1">
                                <span className={`font-medium ${getGradeColor(data.grade)}`}>
                                  {data.score}%
                                </span>
                                {data.trend === 'up' ? (
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                              <div className="text-xs">({data.grade})</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No students found for the selected filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common grade management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Grade Assignment
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Progress Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Gradebook
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="h-4 w-4 mr-2" />
              Honor Roll
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
