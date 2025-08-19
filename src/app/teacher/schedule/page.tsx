'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Skeleton } from '@/components/ui/skeleton';
import { TeacherService } from '@/lib/services/teacher-service';
import { Class } from '@/lib/database-services';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Filter,
  Download
} from 'lucide-react';

interface ScheduleEvent {
  id: string;
  classId: string;
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  classroom: string;
  studentCount: number;
  color: string;
}

export default function TeacherSchedulePage() {
  const { user } = useAuth();
  const { state, loadClasses } = useStore();
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(0); // 0 = current week
  const [selectedView, setSelectedView] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  
  const teacherService = TeacherService.getInstance();
  const teacherId = user?.uid || '';

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!teacherId) return;
      
      try {
        setLoading(true);
        await loadClasses();
        const classes = await teacherService.getTeacherClasses(teacherId);
        setTeacherClasses(classes);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [teacherId, loadClasses, teacherService]);

  // Generate mock schedule data based on teacher's classes
  const generateSchedule = (): ScheduleEvent[] => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];
    const classrooms = ['Room 101', 'Room 102', 'Lab A', 'Lab B', 'Auditorium'];
    const timeSlots = [
      { start: '08:00', end: '09:00' },
      { start: '09:15', end: '10:15' },
      { start: '10:30', end: '11:30' },
      { start: '11:45', end: '12:45' },
      { start: '14:00', end: '15:00' },
      { start: '15:15', end: '16:15' },
    ];

    const schedule: ScheduleEvent[] = [];

    teacherClasses.forEach((classItem, classIndex) => {
      // Generate 2-3 sessions per class throughout the week
      const sessionsPerWeek = Math.floor(Math.random() * 2) + 2; // 2-3 sessions
      
      for (let i = 0; i < sessionsPerWeek; i++) {
        const dayOfWeek = (classIndex * 2 + i + 1) % 5 + 1; // Monday to Friday
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        
        schedule.push({
          id: `${classItem.id}-${dayOfWeek}-${i}`,
          classId: classItem.id,
          className: classItem.name,
          subject: classItem.subjects?.[0] || 'General',
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          dayOfWeek,
          classroom: classrooms[classIndex % classrooms.length],
          studentCount: classItem.students?.length || 0,
          color: colors[classIndex % colors.length]
        });
      }
    });

    return schedule.sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const schedule = generateSchedule();

  const getCurrentWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDay + 1 + (currentWeek * 7));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getCurrentWeekDates();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];

  const getEventsForDay = (dayOfWeek: number) => {
    return schedule.filter(event => event.dayOfWeek === dayOfWeek);
  };

  const getEventAtTime = (dayOfWeek: number, timeSlot: string) => {
    return schedule.find(event => 
      event.dayOfWeek === dayOfWeek && 
      event.startTime <= timeSlot && 
      event.endTime > timeSlot
    );
  };

  const getTodayStats = () => {
    const today = new Date().getDay();
    const todayEvents = getEventsForDay(today);
    return {
      totalClasses: todayEvents.length,
      totalStudents: todayEvents.reduce((sum, event) => sum + event.studentCount, 0),
      nextClass: todayEvents.find(event => event.startTime > new Date().toTimeString().slice(0, 5)),
      currentClass: todayEvents.find(event => {
        const now = new Date().toTimeString().slice(0, 5);
        return event.startTime <= now && event.endTime > now;
      })
    };
  };

  const todayStats = getTodayStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">
            View your class timetable and manage your schedule
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      {/* Today's Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Students today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Class</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayStats.currentClass ? todayStats.currentClass.className : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayStats.currentClass ? 
                `${todayStats.currentClass.startTime} - ${todayStats.currentClass.endTime}` : 
                'No active class'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Class</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayStats.nextClass ? todayStats.nextClass.startTime : 'None'}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayStats.nextClass ? todayStats.nextClass.className : 'No more classes today'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedView === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('week')}
          >
            Week View
          </Button>
          <Button
            variant={selectedView === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('day')}
          >
            Day View
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-4">
            {weekDates[1].toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric' 
            })} - {weekDates[5].toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentWeek(prev => prev + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Schedule Grid */}
      {selectedView === 'week' ? (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>Your class timetable for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-2 min-w-full">
                {/* Header */}
                <div className="p-2 font-medium text-sm">Time</div>
                {weekDates.slice(1, 6).map((date, index) => (
                  <div key={index} className="p-2 text-center">
                    <div className="font-medium text-sm">
                      {dayNames[index + 1]}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {date.getDate()}
                    </div>
                  </div>
                ))}

                {/* Time slots */}
                {timeSlots.map(timeSlot => (
                  <React.Fragment key={timeSlot}>
                    <div className="p-2 text-sm text-muted-foreground border-t">
                      {timeSlot}
                    </div>
                    {[1, 2, 3, 4, 5].map(dayOfWeek => {
                      const event = getEventAtTime(dayOfWeek, timeSlot);
                      return (
                        <div key={`${dayOfWeek}-${timeSlot}`} className="p-1 border-t min-h-[60px]">
                          {event && (
                            <div className={`${event.color} text-white p-2 rounded text-xs h-full`}>
                              <div className="font-medium truncate">{event.className}</div>
                              <div className="text-xs opacity-90">{event.subject}</div>
                              <div className="text-xs opacity-80 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.classroom}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {dayNames[selectedDay]} Schedule
                </CardTitle>
                <CardDescription>
                  {weekDates[selectedDay].toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </div>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="px-3 py-2 border rounded-md text-sm"
              >
                {dayNames.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getEventsForDay(selectedDay).length > 0 ? (
                getEventsForDay(selectedDay).map(event => (
                  <div key={event.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${event.color}`}></div>
                        <div>
                          <div className="font-medium">{event.className}</div>
                          <div className="text-sm text-muted-foreground">{event.subject}</div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {event.startTime} - {event.endTime}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-muted-foreground space-x-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.classroom}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.studentCount} students
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No classes scheduled for this day.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common schedule-related tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              View Full Calendar
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Set Reminders
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Class Details
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Print Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
