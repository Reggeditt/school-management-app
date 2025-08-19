'use client';

import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  User,
  Clock,
  Award,
  FileText,
  CheckCircle
} from 'lucide-react';

export default function StudentSubjects() {
  const { user } = useAuth();
  const { state } = useStore();

  // Find current student data
  const currentStudent = state.students.find(s => s.email === user?.email);
  
  // Get student's classes
  const studentClasses = state.classes.filter(c => 
    currentStudent && c.students.includes(currentStudent.id)
  );

  // Get student's subjects
  const studentSubjects = state.subjects.filter(s => 
    studentClasses.some(c => s.classIds.includes(c.id))
  );

  // Get teachers for subjects
  const getSubjectTeachers = (subjectId: string) => {
    const subject = state.subjects.find(s => s.id === subjectId);
    if (!subject) return [];
    
    return subject.teacherIds.map(teacherId => 
      state.teachers.find(t => t.id === teacherId)
    ).filter(Boolean);
  };

  // Get student's exams for performance calculation
  const studentExams = state.exams.filter(e => 
    studentClasses.some(c => e.classIds.includes(c.id))
  );

  const getSubjectPerformance = (subjectId: string) => {
    const subjectExams = studentExams.filter(e => e.subjectId === subjectId);
    if (subjectExams.length === 0) return { average: 0, grade: 'N/A', examCount: 0 };

    const totalScore = subjectExams.reduce((sum, exam) => {
      const result = exam.results?.[currentStudent?.id || ''];
      return sum + (result?.marksObtained || 0);
    }, 0);

    const totalPossible = subjectExams.reduce((sum, exam) => sum + exam.totalMarks, 0);
    const average = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;

    let grade = 'F';
    if (average >= 90) grade = 'A';
    else if (average >= 80) grade = 'B';
    else if (average >= 70) grade = 'C';
    else if (average >= 60) grade = 'D';

    return { average, grade, examCount: subjectExams.length };
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800 border-green-200';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'F': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Subjects</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentSubjects.length}</div>
            <p className="text-xs text-muted-foreground">Enrolled this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Subjects</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentSubjects.filter(s => s.type === 'core').length}
            </div>
            <p className="text-xs text-muted-foreground">Compulsory subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Electives</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentSubjects.filter(s => s.type === 'elective').length}
            </div>
            <p className="text-xs text-muted-foreground">Optional subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentSubjects.reduce((sum, s) => sum + s.credits, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Academic credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentSubjects.map((subject) => {
          const performance = getSubjectPerformance(subject.id);
          const teachers = getSubjectTeachers(subject.id);

          return (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">{subject.code}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline" className="capitalize">
                      {subject.type}
                    </Badge>
                    <Badge className={getGradeColor(performance.grade)}>
                      {performance.grade}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subject.description}
                </p>

                <Separator />

                {/* Performance */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Performance</span>
                    <span className="text-sm text-gray-500">
                      {performance.average.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={performance.average} className="h-2" />
                </div>

                {/* Subject Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Credits</p>
                    <p className="font-semibold">{subject.credits}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Exams Taken</p>
                    <p className="font-semibold">{performance.examCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Marks</p>
                    <p className="font-semibold">{subject.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Passing Marks</p>
                    <p className="font-semibold">{subject.passingMarks}</p>
                  </div>
                </div>

                <Separator />

                {/* Teachers */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Subject Teachers
                  </h4>
                  {teachers.length > 0 ? (
                    <div className="space-y-2">
                      {teachers.map((teacher) => (
                        <div key={teacher?.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-indigo-600">
                              {teacher?.firstName?.[0]}{teacher?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {teacher?.firstName} {teacher?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {teacher?.designation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No teachers assigned</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Syllabus
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {studentSubjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Subjects Found
            </h3>
            <p className="text-gray-500">
              You are not currently enrolled in any subjects. Please contact the administration office.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
