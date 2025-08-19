'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface TimetableEditorProps {
  timetables: Record<string, TimetableEntry[]>;
  onTimetableChange: (timetables: Record<string, TimetableEntry[]>) => void;
  selectedClass: string;
  onClassChange: (classId: string) => void;
  settings: TimetableSettings;
}

export function TimetableEditor({ 
  timetables, 
  onTimetableChange, 
  selectedClass, 
  onClassChange, 
  settings 
}: TimetableEditorProps) {
  const { state } = useStore();
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const classTimetable = selectedClass ? timetables[selectedClass] || [] : [];
  const selectedClassData = state.classes.find(c => c.id === selectedClass);

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

      // Add lunch break
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

  const handleEditEntry = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setShowEditDialog(true);
  };

  const handleAddEntry = (day: string, slot: TimeSlot) => {
    const newEntry: TimetableEntry = {
      id: `${selectedClass}-${day}-${slot.id}-new`,
      classId: selectedClass,
      subjectId: '',
      teacherId: '',
      timeSlot: slot,
      dayOfWeek: day as any,
      room: ''
    };
    setEditingEntry(newEntry);
    setShowEditDialog(true);
  };

  const handleSaveEntry = () => {
    if (!editingEntry || !selectedClass) return;

    const updatedTimetable = [...classTimetable];
    const existingIndex = updatedTimetable.findIndex(e => e.id === editingEntry.id);

    if (existingIndex >= 0) {
      updatedTimetable[existingIndex] = editingEntry;
    } else {
      updatedTimetable.push(editingEntry);
    }

    onTimetableChange({
      ...timetables,
      [selectedClass]: updatedTimetable
    });

    setShowEditDialog(false);
    setEditingEntry(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!selectedClass) return;

    const updatedTimetable = classTimetable.filter(e => e.id !== entryId);
    onTimetableChange({
      ...timetables,
      [selectedClass]: updatedTimetable
    });
  };

  const getAvailableSubjects = () => {
    return state.subjects.filter(s => s.classIds?.includes(selectedClass));
  };

  const getAvailableTeachers = (subjectId?: string) => {
    if (!subjectId) return state.teachers;
    return state.teachers.filter(t => t.subjects?.includes(subjectId));
  };

  const checkConflicts = (entry: TimetableEntry) => {
    const conflicts = [];
    
    // Check teacher conflicts
    const teacherConflicts = Object.values(timetables).flat().filter(e => 
      e.id !== entry.id &&
      e.teacherId === entry.teacherId &&
      e.dayOfWeek === entry.dayOfWeek &&
      e.timeSlot.startTime === entry.timeSlot.startTime
    );
    
    if (teacherConflicts.length > 0) {
      conflicts.push('Teacher has another class at this time');
    }

    return conflicts;
  };

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('edit')}
            Edit Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={selectedClass} onValueChange={onClassChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class to edit timetable" />
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

      {/* Editable Timetable Grid */}
      {selectedClass ? (
        <Card>
          <CardHeader>
            <CardTitle>
              Edit Timetable for Grade {selectedClassData?.grade}{selectedClassData?.section}
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
                        
                        if (slot.type === 'recess' || slot.type === 'lunch') {
                          return (
                            <td key={day} className="p-3 text-center">
                              <div className={`p-2 rounded text-sm ${
                                slot.type === 'recess' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                {slot.type === 'recess' ? 'Recess' : 'Lunch Break'}
                              </div>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={day} className="p-3">
                            {entry ? (
                              <div className="bg-blue-50 border border-blue-200 p-2 rounded group hover:bg-blue-100 transition-colors">
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
                                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleEditEntry(entry)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    className="h-6 px-2 text-xs"
                                  >
                                    Delete
                                  </Button>
                                </div>
                                {checkConflicts(entry).length > 0 && (
                                  <div className="text-xs text-red-600 mt-1">
                                    ⚠️ Conflicts detected
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddEntry(day, slot)}
                                className="w-full h-16 border-2 border-dashed border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center text-xs text-gray-400 hover:text-blue-600 transition-colors"
                              >
                                + Add Period
                              </button>
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
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              <div className="text-4xl mb-4">{getNavigationIcon('edit')}</div>
              <h3 className="text-lg font-medium mb-2">Select a Class</h3>
              <p>Choose a class from the dropdown above to edit its timetable.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Entry Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntry?.id.includes('new') ? 'Add Period' : 'Edit Period'}
            </DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4">
              <div>
                <Label>Time Slot</Label>
                <div className="text-sm text-muted-foreground">
                  {editingEntry.timeSlot.startTime} - {editingEntry.timeSlot.endTime} 
                  ({editingEntry.dayOfWeek})
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={editingEntry.subjectId} 
                  onValueChange={(value) => setEditingEntry({...editingEntry, subjectId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSubjects().map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teacher">Teacher</Label>
                <Select 
                  value={editingEntry.teacherId} 
                  onValueChange={(value) => setEditingEntry({...editingEntry, teacherId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTeachers(editingEntry.subjectId).map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="room">Room (Optional)</Label>
                <Input
                  id="room"
                  value={editingEntry.room || ''}
                  onChange={(e) => setEditingEntry({...editingEntry, room: e.target.value})}
                  placeholder="Enter room number or name"
                />
              </div>

              {checkConflicts(editingEntry).length > 0 && (
                <div className="text-sm text-red-600">
                  <strong>Conflicts:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    {checkConflicts(editingEntry).map((conflict, index) => (
                      <li key={index}>{conflict}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEntry}
                  disabled={!editingEntry.subjectId || !editingEntry.teacherId}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
