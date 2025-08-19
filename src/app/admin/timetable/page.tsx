'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { useStore } from '@/contexts/store-context';
import { DataSetupHelper } from '@/components/setup/data-setup-helper';
import { TimetableGenerator } from './components/timetable-generator';
import { TimetableEditor } from './components/timetable-editor';
import { TimetableView } from './components/timetable-view';
import { TimetableSettings } from './components/timetable-settings';

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'recess' | 'lunch';
  duration: number; // in minutes
}

export interface TimetableEntry {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  timeSlot: TimeSlot;
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  room?: string;
}

export interface TimetableSettings {
  schoolStartTime: string;
  schoolEndTime: string;
  classDuration: number; // in minutes
  recessDuration: number;
  lunchDuration: number;
  numberOfRecess: number;
  workingDays: string[];
  maxPeriodsPerDay: number;
  minBreakBetweenClasses: number;
}

export default function TimetablePage() {
  const { state, loadClasses, loadSubjects, loadTeachers } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [timetables, setTimetables] = useState<Record<string, TimetableEntry[]>>({});
  const [settings, setSettings] = useState<TimetableSettings>({
    schoolStartTime: '08:00',
    schoolEndTime: '15:00',
    classDuration: 45,
    recessDuration: 15,
    lunchDuration: 30,
    numberOfRecess: 2,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    maxPeriodsPerDay: 8,
    minBreakBetweenClasses: 5
  });
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadClasses();
    loadSubjects();
    loadTeachers();
  }, [loadClasses, loadSubjects, loadTeachers]);

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startTime = new Date(`2000-01-01T${settings.schoolStartTime}:00`);
    const endTime = new Date(`2000-01-01T${settings.schoolEndTime}:00`);
    
    let currentTime = new Date(startTime);
    let slotId = 0;
    let recessCount = 0;

    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime() + settings.classDuration * 60000);
      
      // Add class period
      if (nextTime <= endTime) {
        slots.push({
          id: `slot-${slotId++}`,
          startTime: currentTime.toTimeString().slice(0, 5),
          endTime: nextTime.toTimeString().slice(0, 5),
          type: 'class',
          duration: settings.classDuration
        });
        currentTime = nextTime;
      }

      // Add recess if needed and there's time
      if (recessCount < settings.numberOfRecess && currentTime < endTime) {
        const recessEndTime = new Date(currentTime.getTime() + settings.recessDuration * 60000);
        if (recessEndTime <= endTime) {
          slots.push({
            id: `recess-${recessCount}`,
            startTime: currentTime.toTimeString().slice(0, 5),
            endTime: recessEndTime.toTimeString().slice(0, 5),
            type: 'recess',
            duration: settings.recessDuration
          });
          currentTime = recessEndTime;
          recessCount++;
        }
      }

      // Add lunch break (typically after 3-4 periods)
      if (slots.filter(s => s.type === 'class').length === 4 && currentTime < endTime) {
        const lunchEndTime = new Date(currentTime.getTime() + settings.lunchDuration * 60000);
        if (lunchEndTime <= endTime) {
          slots.push({
            id: 'lunch',
            startTime: currentTime.toTimeString().slice(0, 5),
            endTime: lunchEndTime.toTimeString().slice(0, 5),
            type: 'lunch',
            duration: settings.lunchDuration
          });
          currentTime = lunchEndTime;
        }
      }
    }

    return slots;
  };

  // Calculate weekly subject distribution based on credits and importance
  const calculateSubjectDistribution = (subjects: any[], totalSlots: number) => {
    const distribution: { [subjectId: string]: number } = {};
    
    if (subjects.length === 0) return distribution;
    
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
  const generateDayTimetableWithDistribution = (
    day: string,
    timeSlots: any[],
    subjects: any[],
    weeklyDistribution: { [subjectId: string]: number },
    dayIndex: number,
    classId: string
  ) => {
    const dayEntries: any[] = [];
    
    // Create a pool of subjects for this day based on weekly distribution
    const subjectPool: string[] = [];
    
    Object.entries(weeklyDistribution).forEach(([subjectId, totalSlots]) => {
      const slotsForThisDay = Math.ceil(totalSlots / settings.workingDays.length);
      
      // Add subject to pool based on day rotation for even distribution
      for (let i = 0; i < slotsForThisDay; i++) {
        if ((dayIndex + i) % settings.workingDays.length < totalSlots % settings.workingDays.length || 
            i < Math.floor(totalSlots / settings.workingDays.length)) {
          subjectPool.push(subjectId);
        }
      }
    });
    
    // Shuffle the subject pool for variety while maintaining distribution
    const shuffledPool = [...subjectPool].sort(() => Math.random() - 0.5);
    
    // Assign subjects to time slots
    timeSlots.forEach((slot, index) => {
      if (index < shuffledPool.length && index < settings.maxPeriodsPerDay) {
        const subjectId = shuffledPool[index];
        const subject = subjects.find(s => s.id === subjectId);
        
        if (subject) {
          // Find teacher for this subject
          const teacher = state.teachers.find(t => 
            (t.subjects?.includes(subject.id)) || 
            (subject.teacherIds?.includes(t.id))
          );
          
          if (teacher) {
            dayEntries.push({
              id: `${classId}-${day}-${slot.id}`,
              classId,
              subjectId: subject.id,
              teacherId: teacher.id,
              timeSlot: slot,
              dayOfWeek: day as any,
              room: `Room ${Math.floor(Math.random() * 20) + 1}`
            });
          } else {
            console.warn(`No teacher found for subject: ${subject.name} (${subject.id})`);
          }
        }
      }
    });
    
    return dayEntries;
  };

  const generateTimetableForClass = async (classId: string) => {
    setIsGenerating(true);
    try {
      const classData = state.classes.find(c => c.id === classId);
      if (!classData) {
        throw new Error('Class not found');
      }

      const classSubjects = state.subjects.filter(s => s.classIds?.includes(classId));
      const timeSlots = generateTimeSlots().filter(slot => slot.type === 'class');
      
      // Check if there are subjects assigned to this class
      if (classSubjects.length === 0) {
        console.warn(`No subjects assigned to class ${classData.name}`);
        return;
      }
      
      const timetableEntries: TimetableEntry[] = [];
      
      // Calculate weekly subject distribution
      const totalSlotsPerWeek = timeSlots.length * settings.workingDays.length;
      const subjectDistribution = calculateSubjectDistribution(classSubjects, totalSlotsPerWeek);
      
      // Generate timetable for each day with weekly distribution
      settings.workingDays.forEach((day: string, dayIndex: number) => {
        const dayEntries = generateDayTimetableWithDistribution(
          day,
          timeSlots,
          classSubjects,
          subjectDistribution,
          dayIndex,
          classId
        );
        timetableEntries.push(...dayEntries);
      });

      setTimetables(prev => ({
        ...prev,
        [classId]: timetableEntries
      }));
      
    } catch (error) {
      console.error('Error generating timetable:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAllTimetables = async () => {
    setIsGenerating(true);
    try {
      // Debug: Log current data state
      console.log('Classes available:', state.classes.length);
      console.log('Subjects available:', state.subjects.length);
      console.log('Teachers available:', state.teachers.length);
      
      // Debug: Check if subjects have classIds and teacherIds
      state.subjects.forEach(subject => {
        console.log(`Subject ${subject.name}:`, {
          classIds: subject.classIds?.length || 0,
          teacherIds: subject.teacherIds?.length || 0
        });
      });
      
      // Debug: Check if teachers have subjects
      state.teachers.forEach(teacher => {
        console.log(`Teacher ${teacher.firstName} ${teacher.lastName}:`, {
          subjects: teacher.subjects?.length || 0
        });
      });
      
      for (const classData of state.classes) {
        await generateTimetableForClass(classData.id);
      }
    } catch (error) {
      console.error('Error generating all timetables:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTimetableStats = () => {
    const totalClasses = state.classes.length;
    const generatedTimetables = Object.keys(timetables).length;
    const totalEntries = Object.values(timetables).flat().length;
    
    return {
      totalClasses,
      generatedTimetables,
      totalEntries,
      completion: totalClasses > 0 ? (generatedTimetables / totalClasses) * 100 : 0
    };
  };

  const stats = getTimetableStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Academic Timetable</h1>
          <p className="text-muted-foreground">Create and manage school timetables and schedules</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline">
                {getNavigationIcon('settings')}
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Timetable Settings</DialogTitle>
                <DialogDescription>
                  Configure the basic parameters for timetable generation
                </DialogDescription>
              </DialogHeader>
              <TimetableSettings 
                settings={settings} 
                onSettingsChange={setSettings}
                onClose={() => setShowSettings(false)}
              />
            </DialogContent>
          </Dialog>
          <Button 
            onClick={generateAllTimetables}
            disabled={isGenerating || state.classes.length === 0}
          >
            {isGenerating ? (
              <>
                {getNavigationIcon('loader')}
                Generating...
              </>
            ) : (
              <>
                {getNavigationIcon('zap')}
                Generate All Timetables
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
              </div>
              {getNavigationIcon('users')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Generated Timetables</p>
                <p className="text-2xl font-bold">{stats.generatedTimetables}</p>
              </div>
              {getNavigationIcon('calendar')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Periods</p>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
              </div>
              {getNavigationIcon('clock')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completion</p>
                <p className="text-2xl font-bold">{Math.round(stats.completion)}%</p>
              </div>
              {getNavigationIcon('check-circle')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="view">View Timetables</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Data Setup Helper */}
          <DataSetupHelper />
          
          {/* Classes Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getNavigationIcon('list')}
                Classes Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.classes.map(classData => {
                  const hasTimetable = timetables[classData.id];
                  const classSubjects = state.subjects.filter(s => s.classIds?.includes(classData.id));
                  
                  return (
                    <Card key={classData.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          Grade {classData.grade}{classData.section}
                        </h3>
                        <Badge variant={hasTimetable ? "default" : "secondary"}>
                          {hasTimetable ? "Generated" : "Pending"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Students: {classData.students.length}</p>
                        <p>Subjects: {classSubjects.length}</p>
                        {hasTimetable && (
                          <p>Periods: {timetables[classData.id].length}</p>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => generateTimetableForClass(classData.id)}
                          disabled={isGenerating}
                        >
                          {hasTimetable ? "Regenerate" : "Generate"}
                        </Button>
                        {hasTimetable && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedClass(classData.id);
                              setActiveTab('view');
                            }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <TimetableGenerator 
            settings={settings}
            onGenerateAll={generateAllTimetables}
            onGenerateClass={generateTimetableForClass}
            isGenerating={isGenerating}
          />
        </TabsContent>

        <TabsContent value="view">
          <TimetableView 
            timetables={timetables}
            selectedClass={selectedClass}
            onClassChange={setSelectedClass}
            settings={settings}
          />
        </TabsContent>

        <TabsContent value="edit">
          <TimetableEditor 
            timetables={timetables}
            onTimetableChange={setTimetables}
            selectedClass={selectedClass}
            onClassChange={setSelectedClass}
            settings={settings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
