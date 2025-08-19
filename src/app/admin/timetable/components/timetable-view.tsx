'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { useStore } from '@/contexts/store-context';

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

interface TimetableViewProps {
  timetables: Record<string, TimetableEntry[]>;
  selectedClass: string;
  onClassChange: (classId: string) => void;
  settings: TimetableSettings;
}

export function TimetableView({ 
  timetables, 
  selectedClass, 
  onClassChange, 
  settings 
}: TimetableViewProps) {
  const { state } = useStore();

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

      // Add recess if needed
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

  const timeSlots = generateTimeSlots();
  const classTimetable = selectedClass ? timetables[selectedClass] || [] : [];
  const selectedClassData = state.classes.find(c => c.id === selectedClass);

  const getTimetableForDay = (day: string) => {
    return classTimetable.filter(entry => entry.dayOfWeek === day);
  };

  const getEntryForSlot = (day: string, slotId: string) => {
    return classTimetable.find(entry => 
      entry.dayOfWeek === day && entry.timeSlot.id === slotId
    );
  };

  const getSubjectName = (subjectId: string) => {
    const subject = state.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = state.teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
  };

  const exportTimetable = () => {
    if (!selectedClass || !classTimetable.length) return;
    
    // Simple CSV export
    const csvContent = [
      ['Day', 'Time', 'Subject', 'Teacher', 'Room'],
      ...classTimetable.map(entry => [
        entry.dayOfWeek,
        `${entry.timeSlot.startTime} - ${entry.timeSlot.endTime}`,
        getSubjectName(entry.subjectId),
        getTeacherName(entry.teacherId),
        entry.room || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-${selectedClassData?.grade}${selectedClassData?.section}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Class Selection and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('calendar')}
              View Timetable
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedClass && classTimetable.length > 0 && (
                <Button variant="outline" onClick={exportTimetable}>
                  {getNavigationIcon('download')}
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedClass} onValueChange={onClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class to view timetable" />
                </SelectTrigger>
                <SelectContent>
                  {state.classes.map(classData => (
                    <SelectItem key={classData.id} value={classData.id}>
                      Grade {classData.grade}{classData.section} ({classData.students.length} students)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedClass && (
              <Badge variant="outline">
                {classTimetable.length} periods scheduled
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timetable Grid */}
      {selectedClass && classTimetable.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Timetable for Grade {selectedClassData?.grade}{selectedClassData?.section}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 bg-muted">Time</th>
                    {settings.workingDays.map(day => (
                      <th key={day} className="text-center p-3 bg-muted capitalize">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map(slot => (
                    <tr key={slot.id} className="border-b">
                      <td className="p-3 font-medium bg-muted/50">
                        <div className="text-sm">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {slot.duration}min
                        </div>
                      </td>
                      {settings.workingDays.map(day => {
                        const entry = getEntryForSlot(day, slot.id);
                        
                        if (slot.type === 'recess') {
                          return (
                            <td key={day} className="p-3 text-center">
                              <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-sm">
                                Recess
                              </div>
                            </td>
                          );
                        }
                        
                        if (slot.type === 'lunch') {
                          return (
                            <td key={day} className="p-3 text-center">
                              <div className="bg-orange-100 text-orange-800 p-2 rounded text-sm">
                                Lunch Break
                              </div>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={day} className="p-3">
                            {entry ? (
                              <div className="bg-blue-50 border border-blue-200 p-2 rounded">
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
                            ) : (
                              <div className="h-16 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                                Free Period
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : selectedClass ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              <div className="text-4xl mb-4">{getNavigationIcon('calendar-x')}</div>
              <h3 className="text-lg font-medium mb-2">No Timetable Generated</h3>
              <p>This class doesn't have a generated timetable yet.</p>
              <Button className="mt-4" variant="outline">
                Generate Timetable
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              <div className="text-4xl mb-4">{getNavigationIcon('calendar')}</div>
              <h3 className="text-lg font-medium mb-2">Select a Class</h3>
              <p>Choose a class from the dropdown above to view its timetable.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
