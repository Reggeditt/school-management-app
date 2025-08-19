'use client';

import { useState } from 'react';
import { Class, Subject, Teacher } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';

interface SubjectsTabProps {
  classItem: Class;
  subjects: Subject[];
  teachers: Teacher[];
  onSubjectChange: (subjectId: string, isAssigned: boolean) => Promise<void>;
}

export function SubjectsTab({ classItem, subjects, teachers, onSubjectChange }: SubjectsTabProps) {
  const [selectedGrade, setSelectedGrade] = useState<string>(classItem.grade);

  // Get subjects assigned to this class
  const getAssignedSubjects = () => {
    return subjects.filter(subject => subject.classIds?.includes(classItem.id));
  };

  // Get available subjects for this grade
  const getAvailableSubjects = () => {
    return subjects.filter(subject => 
      subject.grade === classItem.grade && 
      !subject.classIds?.includes(classItem.id)
    );
  };

  // Get teacher name for a subject
  const getSubjectTeachers = (subject: Subject) => {
    if (!subject.teacherIds || subject.teacherIds.length === 0) {
      return 'No teacher assigned';
    }
    return subject.teacherIds
      .map(teacherId => {
        const teacher = teachers.find(t => t.id === teacherId);
        return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown';
      })
      .join(', ');
  };

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'elective': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'language': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'practical': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const assignedSubjects = getAssignedSubjects();
  const availableSubjects = getAvailableSubjects();

  return (
    <div className="space-y-6">
      {/* Assigned Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('book-open')}
            Assigned Subjects ({assignedSubjects.length})
          </CardTitle>
          <CardDescription>
            Subjects currently assigned to {classItem.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignedSubjects.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">{getNavigationIcon('book-open')}</div>
              <p className="text-muted-foreground mb-4">No subjects assigned</p>
              <p className="text-sm text-muted-foreground">
                Assign subjects from the available subjects below
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedSubjects.map((subject) => (
                <div key={subject.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                    <Badge className={getSubjectTypeColor(subject.type)}>
                      {subject.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credits:</span>
                      <span>{subject.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Marks:</span>
                      <span>{subject.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teacher:</span>
                      <span className="text-right">{getSubjectTeachers(subject)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onSubjectChange(subject.id, false)}
                    >
                      Remove from Class
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Subjects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('plus')}
            Available Subjects ({availableSubjects.length})
          </CardTitle>
          <CardDescription>
            Grade {classItem.grade} subjects available for assignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableSubjects.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">{getNavigationIcon('check-circle')}</div>
              <p className="text-muted-foreground mb-4">All grade subjects assigned</p>
              <p className="text-sm text-muted-foreground">
                All available subjects for Grade {classItem.grade} have been assigned to this class
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSubjects.map((subject) => (
                <div key={subject.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                    <Badge className={getSubjectTypeColor(subject.type)}>
                      {subject.type}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credits:</span>
                      <span>{subject.credits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Marks:</span>
                      <span>{subject.totalMarks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teacher:</span>
                      <span className="text-right">{getSubjectTeachers(subject)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => onSubjectChange(subject.id, true)}
                    >
                      Assign to Class
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('bar-chart')}
            Subject Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{assignedSubjects.length}</div>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {assignedSubjects.filter(s => s.type === 'core').length}
              </div>
              <p className="text-sm text-muted-foreground">Core Subjects</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {assignedSubjects.filter(s => s.type === 'elective').length}
              </div>
              <p className="text-sm text-muted-foreground">Electives</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {assignedSubjects.reduce((sum, s) => sum + s.credits, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total Credits</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
