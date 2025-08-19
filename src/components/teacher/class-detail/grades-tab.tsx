'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Class, Student } from '@/lib/database-services';
import { Award, TrendingUp, TrendingDown, BarChart3, Users, FileText } from 'lucide-react';

interface ClassGradesTabProps {
  classItem: Class;
  students: Student[];
  teacherId: string;
}

export function ClassGradesTab({ classItem, students, teacherId }: ClassGradesTabProps) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('current');

  // Mock grades data
  const studentGrades = students.map(student => ({
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
      rank: Math.floor(Math.random() * students.length) + 1 
    }
  }));

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'English'];

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

  const calculateClassAverage = (subject?: string) => {
    if (subject && subject !== 'all') {
      const scores = studentGrades.map(sg => sg.grades[subject as keyof typeof sg.grades]?.score || 0);
      return Math.round(scores.reduce((acc, score) => acc + score, 0) / scores.length);
    }
    const averages = studentGrades.map(sg => sg.overall.average);
    return Math.round(averages.reduce((acc, avg) => acc + avg, 0) / averages.length);
  };

  const getGradeDistribution = () => {
    const grades = studentGrades.map(sg => sg.overall.grade);
    const distribution = {
      'A': grades.filter(g => g.startsWith('A')).length,
      'B': grades.filter(g => g.startsWith('B')).length,
      'C': grades.filter(g => g.startsWith('C')).length,
      'D': grades.filter(g => g.startsWith('D')).length,
      'F': grades.filter(g => g.startsWith('F')).length,
    };
    return distribution;
  };

  const gradeDistribution = getGradeDistribution();
  const classAverage = calculateClassAverage(selectedSubject);

  return (
    <div className="space-y-6">
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
              {Math.round((gradeDistribution.A / students.length) * 100)}% of class
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
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Graded this term
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div>
          <label className="text-sm font-medium">Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="ml-2 px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Term:</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="ml-2 px-3 py-2 border rounded-md text-sm"
          >
            <option value="current">Current Term</option>
            <option value="previous">Previous Term</option>
            <option value="year">Full Year</option>
          </select>
        </div>
      </div>

      {/* Grade Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
          <CardDescription>Distribution of grades across the class</CardDescription>
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
                      style={{ width: `${(count / students.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12">{count} ({Math.round((count / students.length) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Student Grades</CardTitle>
          <CardDescription>Detailed grades for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentGrades
              .sort((a, b) => b.overall.average - a.overall.average)
              .map(({ student, grades, overall }) => (
                <div key={student.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {student.firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-muted-foreground">
                          Rank #{overall.rank} • Average: {overall.average}%
                        </div>
                      </div>
                    </div>
                    <Badge variant={getGradeBadgeVariant(overall.grade)}>
                      {overall.grade}
                    </Badge>
                  </div>
                  
                  {selectedSubject === 'all' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                  ) : (
                    <div className="flex items-center justify-center p-4">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getGradeColor(grades[selectedSubject as keyof typeof grades].grade)}`}>
                          {grades[selectedSubject as keyof typeof grades].score}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Grade: {grades[selectedSubject as keyof typeof grades].grade}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Management</CardTitle>
          <CardDescription>Common grading tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Grade New Assignment
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report Card
            </Button>
            <Button variant="outline" className="justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress Analysis
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Parent Conference
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
