'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { useStore } from '@/contexts/store-context';

interface TimetableSettings {
  schoolStartTime: string;
  schoolEndTime: string;
  classDuration: number;
  recessDuration: number;
  lunchDuration: number;
  numberOfRecess: number;
  workingDays: string[];
  maxPeriodsPerDay: number;
  minBreakBetweenClasses: number;
}

interface TimetableGeneratorProps {
  settings: TimetableSettings;
  onGenerateAll: () => void;
  onGenerateClass: (classId: string) => void;
  isGenerating: boolean;
}

export function TimetableGenerator({ 
  settings, 
  onGenerateAll, 
  onGenerateClass, 
  isGenerating 
}: TimetableGeneratorProps) {
  const { state } = useStore();

  const validateSettings = () => {
    const issues = [];
    
    if (settings.workingDays.length === 0) {
      issues.push('No working days selected');
    }
    
    if (state.classes.length === 0) {
      issues.push('No classes available');
    }
    
    if (state.subjects.length === 0) {
      issues.push('No subjects available');
    }
    
    if (state.teachers.length === 0) {
      issues.push('No teachers available');
    }
    
    const schoolDuration = calculateSchoolDuration();
    const requiredTime = calculateRequiredTime();
    
    if (requiredTime > schoolDuration) {
      issues.push(`Not enough time in school day. Required: ${requiredTime}min, Available: ${schoolDuration}min`);
    }
    
    return issues;
  };

  const calculateSchoolDuration = () => {
    const start = new Date(`2000-01-01T${settings.schoolStartTime}:00`);
    const end = new Date(`2000-01-01T${settings.schoolEndTime}:00`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  };

  const calculateRequiredTime = () => {
    const classTime = settings.maxPeriodsPerDay * settings.classDuration;
    const recessTime = settings.numberOfRecess * settings.recessDuration;
    const lunchTime = settings.lunchDuration;
    const breakTime = (settings.maxPeriodsPerDay - 1) * settings.minBreakBetweenClasses;
    
    return classTime + recessTime + lunchTime + breakTime;
  };

  const issues = validateSettings();
  const canGenerate = issues.length === 0;

  return (
    <div className="space-y-6">
      {/* Generation Settings Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('settings')}
            Generation Settings Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{settings.workingDays.length}</div>
              <div className="text-sm text-muted-foreground">Working Days</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{settings.maxPeriodsPerDay}</div>
              <div className="text-sm text-muted-foreground">Periods/Day</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{settings.classDuration}min</div>
              <div className="text-sm text-muted-foreground">Class Duration</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <div className="text-2xl font-bold">{settings.numberOfRecess}</div>
              <div className="text-sm text-muted-foreground">Recess Periods</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>School Hours:</span>
              <span>{settings.schoolStartTime} - {settings.schoolEndTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total School Time:</span>
              <span>{calculateSchoolDuration()} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Required Time:</span>
              <span>{calculateRequiredTime()} minutes</span>
            </div>
            <Progress 
              value={(calculateRequiredTime() / calculateSchoolDuration()) * 100} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Validation Issues */}
      {issues.length > 0 && (
        <Alert>
          <div className="flex items-start gap-2">
            {getNavigationIcon('alert-triangle')}
            <div>
              <AlertDescription>
                <strong>Issues found:</strong>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Available Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('users')}
              Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{state.classes.length}</div>
            <div className="space-y-2">
              {state.classes.slice(0, 3).map(classData => (
                <div key={classData.id} className="flex justify-between items-center">
                  <span className="text-sm">Grade {classData.grade}{classData.section}</span>
                  <Badge variant="outline">{classData.students.length} students</Badge>
                </div>
              ))}
              {state.classes.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{state.classes.length - 3} more classes
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('book')}
              Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{state.subjects.length}</div>
            <div className="space-y-2">
              {state.subjects.slice(0, 3).map(subject => (
                <div key={subject.id} className="flex justify-between items-center">
                  <span className="text-sm">{subject.name}</span>
                  <Badge variant="outline">{subject.code}</Badge>
                </div>
              ))}
              {state.subjects.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{state.subjects.length - 3} more subjects
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('graduation-cap')}
              Teachers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{state.teachers.length}</div>
            <div className="space-y-2">
              {state.teachers.slice(0, 3).map(teacher => (
                <div key={teacher.id} className="flex justify-between items-center">
                  <span className="text-sm">{teacher.firstName} {teacher.lastName}</span>
                  <Badge variant="outline">{teacher.subjects?.length || 0} subjects</Badge>
                </div>
              ))}
              {state.teachers.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{state.teachers.length - 3} more teachers
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('zap')}
            Generate Timetables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={onGenerateAll}
              disabled={!canGenerate || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  {getNavigationIcon('loader')}
                  Generating All Timetables...
                </>
              ) : (
                <>
                  {getNavigationIcon('zap')}
                  Generate All Timetables
                </>
              )}
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Or generate individually:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {state.classes.map(classData => (
                <Button
                  key={classData.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onGenerateClass(classData.id)}
                  disabled={!canGenerate || isGenerating}
                >
                  Grade {classData.grade}{classData.section}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
