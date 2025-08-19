'use client';

import { useState, useEffect } from 'react';
import { Class, Subject, Teacher } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { useToast } from '@/components/ui/use-toast';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'recess' | 'lunch';
  duration: number;
}

interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  timeSlot: TimeSlot;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  room?: string;
}

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

interface ClassTimetableTabProps {
  classItem: Class;
  subjects: Subject[];
  teachers: Teacher[];
}

export function ClassTimetableTab({ classItem, subjects, teachers }: ClassTimetableTabProps) {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings] = useState<TimetableSettings>({
    schoolStartTime: '08:00',
    schoolEndTime: '15:00',
    classDuration: 45,
    recessDuration: 15,
    lunchDuration: 45,
    numberOfRecess: 2,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    maxPeriodsPerDay: 7,
    minBreakBetweenClasses: 5
  });
  const { toast } = useToast();

  // Generate time slots for the day
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date(`2024-01-01 ${settings.schoolStartTime}`);
    const endTime = new Date(`2024-01-01 ${settings.schoolEndTime}`);
    
    let currentTime = new Date(startTime);
    let slotId = 1;
    
    while (currentTime < endTime) {
      const slotStart = currentTime.toTimeString().slice(0, 5);
      const slotEnd = new Date(currentTime.getTime() + settings.classDuration * 60000).toTimeString().slice(0, 5);
      
      // Add regular class period
      slots.push({
        id: `slot-${slotId}`,
        startTime: slotStart,
        endTime: slotEnd,
        type: 'class',
        duration: settings.classDuration
      });
      
      currentTime = new Date(currentTime.getTime() + settings.classDuration * 60000);
      
      // Add break after certain periods
      if (slotId === 2) { // Morning break after 2nd period
        const breakEnd = new Date(currentTime.getTime() + settings.recessDuration * 60000);
        slots.push({
          id: `break-${slotId}`,
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: breakEnd.toTimeString().slice(0, 5),
          type: 'recess',
          duration: settings.recessDuration
        });
        currentTime = breakEnd;
      } else if (slotId === 4) { // Lunch break after 4th period
        const lunchEnd = new Date(currentTime.getTime() + settings.lunchDuration * 60000);
        slots.push({
          id: `lunch-${slotId}`,
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: lunchEnd.toTimeString().slice(0, 5),
          type: 'lunch',
          duration: settings.lunchDuration
        });
        currentTime = lunchEnd;
      } else {
        // Small break between classes
        currentTime = new Date(currentTime.getTime() + settings.minBreakBetweenClasses * 60000);
      }
      
      slotId++;
      
      if (slotId > settings.maxPeriodsPerDay) break;
    }
    
    return slots;
  };

  // Improved weekly timetable generation algorithm
  const generateWeeklyTimetable = () => {
    if (subjects.length === 0) {
      toast({
        title: "No Subjects",
        description: "Please assign subjects to this class first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const timeSlots = generateTimeSlots().filter(slot => slot.type === 'class');
      const timetableEntries: TimetableEntry[] = [];
      
      // Calculate weekly subject distribution
      const totalSlotsPerWeek = timeSlots.length * settings.workingDays.length;
      const subjectDistribution = calculateSubjectDistribution(subjects, totalSlotsPerWeek);
      
      // Generate timetable for each day
      settings.workingDays.forEach((day, dayIndex) => {
        const dayEntries = generateDayTimetable(
          day as any, 
          timeSlots, 
          subjects, 
          subjectDistribution, 
          dayIndex
        );
        timetableEntries.push(...dayEntries);
      });
      
      setTimetable(timetableEntries);
      
      toast({
        title: "Success",
        description: `Timetable generated for ${classItem.name}`,
      });
      
    } catch (error) {
      console.error('Error generating timetable:', error);
      toast({
        title: "Error",
        description: "Failed to generate timetable",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate how many periods each subject should have per week
  const calculateSubjectDistribution = (subjects: Subject[], totalSlots: number) => {
    const distribution: { [subjectId: string]: number } = {};
    
    // Base distribution based on subject credits and type
    const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
    
    subjects.forEach(subject => {
      let baseSlots = Math.floor((subject.credits / totalCredits) * totalSlots);
      
      // Ensure core subjects get minimum slots
      if (subject.type === 'core' && baseSlots < 3) {
        baseSlots = 3;
      }
      
      // Ensure at least 1 slot for all subjects
      if (baseSlots < 1) {
        baseSlots = 1;
      }
      
      distribution[subject.id] = baseSlots;
    });
    
    return distribution;
  };

  // Generate timetable for a specific day with subject variety
  const generateDayTimetable = (
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday',
    timeSlots: TimeSlot[],
    subjects: Subject[],
    weeklyDistribution: { [subjectId: string]: number },
    dayIndex: number
  ): TimetableEntry[] => {
    const dayEntries: TimetableEntry[] = [];
    
    // Create a pool of subjects for this day based on weekly distribution
    const subjectPool: string[] = [];
    
    Object.entries(weeklyDistribution).forEach(([subjectId, totalSlots]) => {
      const slotsForThisDay = Math.ceil(totalSlots / settings.workingDays.length);
      
      // Add subject to pool based on day rotation
      for (let i = 0; i < slotsForThisDay; i++) {
        if ((dayIndex + i) % settings.workingDays.length < totalSlots % settings.workingDays.length || 
            i < Math.floor(totalSlots / settings.workingDays.length)) {
          subjectPool.push(subjectId);
        }
      }
    });
    
    // Shuffle the subject pool for variety
    const shuffledPool = [...subjectPool].sort(() => Math.random() - 0.5);
    
    // Assign subjects to time slots
    timeSlots.forEach((slot, index) => {
      if (index < shuffledPool.length) {
        const subjectId = shuffledPool[index];
        const subject = subjects.find(s => s.id === subjectId);
        
        if (subject) {
          // Find teacher for this subject
          const teacher = teachers.find(t => 
            (t.subjects?.includes(subject.id)) || 
            (subject.teacherIds?.includes(t.id))
          );
          
          if (teacher) {
            dayEntries.push({
              id: `${classItem.id}-${day}-${slot.id}`,
              classId: classItem.id,
              subjectId: subject.id,
              teacherId: teacher.id,
              timeSlot: slot,
              dayOfWeek: day,
              room: `Room ${Math.floor(Math.random() * 20) + 1}`
            });
          }
        }
      }
    });
    
    return dayEntries;
  };

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
  };

  // Group timetable by day
  const getTimetableByDay = () => {
    const dayTimetables: { [day: string]: TimetableEntry[] } = {};
    
    settings.workingDays.forEach(day => {
      dayTimetables[day] = timetable.filter(entry => entry.dayOfWeek === day);
    });
    
    return dayTimetables;
  };

  const dayTimetables = getTimetableByDay();

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getNavigationIcon('calendar')}
                Class Timetable
              </CardTitle>
              <CardDescription>
                Weekly timetable for {classItem.name} - {subjects.length} subjects assigned
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={generateWeeklyTimetable}
                disabled={isGenerating || subjects.length === 0}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    {getNavigationIcon('refresh-cw')}
                    Generate Timetable
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Timetable Display */}
      {timetable.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-4">{getNavigationIcon('calendar')}</div>
              <p className="text-muted-foreground mb-4">No timetable generated</p>
              <p className="text-sm text-muted-foreground mb-4">
                {subjects.length === 0 
                  ? 'Please assign subjects to this class first' 
                  : 'Click "Generate Timetable" to create a weekly schedule'
                }
              </p>
              {subjects.length === 0 && (
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh Page
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {settings.workingDays.map(day => (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="capitalize">{day}</CardTitle>
                <CardDescription>
                  {dayTimetables[day]?.length || 0} periods scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dayTimetables[day]?.map((entry, index) => (
                    <div key={entry.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          Period {index + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {entry.timeSlot.startTime} - {entry.timeSlot.endTime}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {getSubjectName(entry.subjectId)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getTeacherName(entry.teacherId)}
                        </div>
                        {entry.room && (
                          <div className="text-xs text-muted-foreground">
                            {entry.room}
                          </div>
                        )}
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No classes scheduled</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
