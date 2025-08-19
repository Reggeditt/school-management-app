'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';

export function DataSetupHelper() {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const { state, updateSubject, updateTeacher, updateClass } = useStore();
  const { toast } = useToast();

  const setupDemoDataRelationships = async () => {
    setIsSettingUp(true);
    try {// Setup subject-class relationships
      const subjectClassMappings = [
        { subjectName: 'Mathematics', classGrades: ['10', '9'] },
        { subjectName: 'English Language', classGrades: ['10', '9'] },
        { subjectName: 'Physics', classGrades: ['10'] },
        { subjectName: 'Chemistry', classGrades: ['10'] },
        { subjectName: 'Biology', classGrades: ['10', '9'] },
        { subjectName: 'Computer Science', classGrades: ['10', '9'] }
      ];

      // Setup teacher-subject relationships
      const teacherSubjectMappings = [
        { teacherName: 'John Adebayo', subjects: ['Mathematics', 'Physics'] },
        { teacherName: 'Sarah Okonkwo', subjects: ['English Language', 'Biology'] },
        { teacherName: 'Michael Babatunde', subjects: ['Chemistry', 'Computer Science'] }
      ];

      // Update subjects with class assignments
      for (const mapping of subjectClassMappings) {
        const subject = state.subjects.find(s => s.name === mapping.subjectName);
        if (subject) {
          const classIds = state.classes
            .filter(c => mapping.classGrades.includes(c.grade))
            .map(c => c.id);
          
          if (classIds.length > 0) {
            await updateSubject(subject.id, { classIds });}
        }
      }

      // Update teachers with subject assignments
      for (const mapping of teacherSubjectMappings) {
        const teacher = state.teachers.find(t => 
          `${t.firstName} ${t.lastName}` === mapping.teacherName
        );
        if (teacher) {
          const subjectIds = state.subjects
            .filter(s => mapping.subjects.includes(s.name))
            .map(s => s.id);
          
          if (subjectIds.length > 0) {
            await updateTeacher(teacher.id, { subjects: subjectIds });}
        }
      }

      // Update subjects with teacher assignments
      for (const mapping of teacherSubjectMappings) {
        const teacher = state.teachers.find(t => 
          `${t.firstName} ${t.lastName}` === mapping.teacherName
        );
        if (teacher) {
          for (const subjectName of mapping.subjects) {
            const subject = state.subjects.find(s => s.name === subjectName);
            if (subject) {
              const currentTeacherIds = subject.teacherIds || [];
              if (!currentTeacherIds.includes(teacher.id)) {
                await updateSubject(subject.id, { 
                  teacherIds: [...currentTeacherIds, teacher.id] 
                });}
            }
          }
        }
      }

      toast({
        title: "Success",
        description: "Data relationships have been set up successfully!",
      });

    } catch (error) {toast({
        title: "Error",
        description: "Failed to set up data relationships",
        variant: "destructive"
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  const getRelationshipStatus = () => {
    const subjectsWithClasses = state.subjects.filter(s => s.classIds && s.classIds.length > 0).length;
    const subjectsWithTeachers = state.subjects.filter(s => s.teacherIds && s.teacherIds.length > 0).length;
    const teachersWithSubjects = state.teachers.filter(t => t.subjects && t.subjects.length > 0).length;

    return {
      subjectsWithClasses,
      subjectsWithTeachers,
      teachersWithSubjects,
      totalSubjects: state.subjects.length,
      totalTeachers: state.teachers.length
    };
  };

  const status = getRelationshipStatus();
  const needsSetup = status.subjectsWithClasses === 0 || status.subjectsWithTeachers === 0 || status.teachersWithSubjects === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getNavigationIcon('database')}
          Data Relationship Setup
        </CardTitle>
        <CardDescription>
          Configure relationships between classes, subjects, and teachers for proper timetable generation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {needsSetup && (
          <Alert>
            <AlertDescription>
              Some data relationships are missing. This may cause timetable generation to fail.
              Click the setup button below to configure proper relationships.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {status.subjectsWithClasses} / {status.totalSubjects}
            </div>
            <p className="text-sm text-muted-foreground">Subjects with Classes</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {status.subjectsWithTeachers} / {status.totalSubjects}
            </div>
            <p className="text-sm text-muted-foreground">Subjects with Teachers</p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {status.teachersWithSubjects} / {status.totalTeachers}
            </div>
            <p className="text-sm text-muted-foreground">Teachers with Subjects</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={setupDemoDataRelationships}
            disabled={isSettingUp}
            className="flex items-center gap-2"
          >
            {isSettingUp ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Setting up...
              </>
            ) : (
              <>
                {getNavigationIcon('settings')}
                Setup Data Relationships
              </>
            )}
          </Button>
          
          {!needsSetup && (
            <Badge variant="default" className="flex items-center gap-1">
              {getNavigationIcon('check')}
              Relationships Configured
            </Badge>
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>This setup will:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Assign subjects to appropriate grade classes</li>
            <li>Link teachers to their subject specializations</li>
            <li>Create bidirectional relationships for timetable generation</li>
            <li>Enable proper subject distribution across the week</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
