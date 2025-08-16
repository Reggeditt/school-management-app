'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";

interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  studentId: string;
}

interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  classroom: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  color: string;
}

interface SchoolEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type: 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday' | 'exam' | 'announcement';
  location?: string;
  isAllDay: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: Date;
  type: 'homework' | 'project' | 'quiz' | 'exam';
  status: 'pending' | 'submitted' | 'graded';
}

export default function SchedulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("all");
  const [classSchedules, setClassSchedules] = useState<ClassSchedule[]>([]);
  const [schoolEvents, setSchoolEvents] = useState<SchoolEvent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadScheduleData();
  }, [selectedChild]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockChildren: Child[] = [
        {
          id: '1',
          name: 'Emma Johnson',
          grade: 'Grade 9',
          class: 'Grade 9A',
          studentId: 'STU001'
        },
        {
          id: '2',
          name: 'Michael Johnson',
          grade: 'Grade 6',
          class: 'Grade 6B',
          studentId: 'STU002'
        }
      ];

      const mockClassSchedules: ClassSchedule[] = [
        // Monday
        { id: '1', subject: 'Mathematics', teacher: 'Dr. Sarah Wilson', classroom: 'Room 101', startTime: '08:00', endTime: '08:45', dayOfWeek: 1, color: 'bg-blue-500' },
        { id: '2', subject: 'English', teacher: 'Ms. Emily Brown', classroom: 'Room 205', startTime: '08:50', endTime: '09:35', dayOfWeek: 1, color: 'bg-green-500' },
        { id: '3', subject: 'Science', teacher: 'Prof. John Davis', classroom: 'Lab 1', startTime: '09:40', endTime: '10:25', dayOfWeek: 1, color: 'bg-purple-500' },
        { id: '4', subject: 'History', teacher: 'Mr. Robert Smith', classroom: 'Room 302', startTime: '10:45', endTime: '11:30', dayOfWeek: 1, color: 'bg-orange-500' },
        { id: '5', subject: 'Physical Education', teacher: 'Coach Mike Wilson', classroom: 'Gymnasium', startTime: '11:35', endTime: '12:20', dayOfWeek: 1, color: 'bg-red-500' },
        
        // Tuesday
        { id: '6', subject: 'Science', teacher: 'Prof. John Davis', classroom: 'Lab 1', startTime: '08:00', endTime: '08:45', dayOfWeek: 2, color: 'bg-purple-500' },
        { id: '7', subject: 'Mathematics', teacher: 'Dr. Sarah Wilson', classroom: 'Room 101', startTime: '08:50', endTime: '09:35', dayOfWeek: 2, color: 'bg-blue-500' },
        { id: '8', subject: 'Art', teacher: 'Ms. Lisa Garcia', classroom: 'Art Studio', startTime: '09:40', endTime: '10:25', dayOfWeek: 2, color: 'bg-pink-500' },
        { id: '9', subject: 'English', teacher: 'Ms. Emily Brown', classroom: 'Room 205', startTime: '10:45', endTime: '11:30', dayOfWeek: 2, color: 'bg-green-500' },
        { id: '10', subject: 'Music', teacher: 'Mr. David Taylor', classroom: 'Music Room', startTime: '11:35', endTime: '12:20', dayOfWeek: 2, color: 'bg-indigo-500' },

        // Wednesday  
        { id: '11', subject: 'Mathematics', teacher: 'Dr. Sarah Wilson', classroom: 'Room 101', startTime: '08:00', endTime: '08:45', dayOfWeek: 3, color: 'bg-blue-500' },
        { id: '12', subject: 'Science', teacher: 'Prof. John Davis', classroom: 'Lab 1', startTime: '08:50', endTime: '09:35', dayOfWeek: 3, color: 'bg-purple-500' },
        { id: '13', subject: 'Geography', teacher: 'Ms. Anna Martinez', classroom: 'Room 404', startTime: '09:40', endTime: '10:25', dayOfWeek: 3, color: 'bg-teal-500' },
        { id: '14', subject: 'English', teacher: 'Ms. Emily Brown', classroom: 'Room 205', startTime: '10:45', endTime: '11:30', dayOfWeek: 3, color: 'bg-green-500' },
        { id: '15', subject: 'Computer Science', teacher: 'Mr. Tech Guru', classroom: 'Computer Lab', startTime: '11:35', endTime: '12:20', dayOfWeek: 3, color: 'bg-gray-500' },

        // Thursday
        { id: '16', subject: 'English', teacher: 'Ms. Emily Brown', classroom: 'Room 205', startTime: '08:00', endTime: '08:45', dayOfWeek: 4, color: 'bg-green-500' },
        { id: '17', subject: 'History', teacher: 'Mr. Robert Smith', classroom: 'Room 302', startTime: '08:50', endTime: '09:35', dayOfWeek: 4, color: 'bg-orange-500' },
        { id: '18', subject: 'Mathematics', teacher: 'Dr. Sarah Wilson', classroom: 'Room 101', startTime: '09:40', endTime: '10:25', dayOfWeek: 4, color: 'bg-blue-500' },
        { id: '19', subject: 'Science', teacher: 'Prof. John Davis', classroom: 'Lab 1', startTime: '10:45', endTime: '11:30', dayOfWeek: 4, color: 'bg-purple-500' },
        { id: '20', subject: 'Language Arts', teacher: 'Ms. Cultural Expert', classroom: 'Room 501', startTime: '11:35', endTime: '12:20', dayOfWeek: 4, color: 'bg-yellow-500' },

        // Friday
        { id: '21', subject: 'Physical Education', teacher: 'Coach Mike Wilson', classroom: 'Gymnasium', startTime: '08:00', endTime: '08:45', dayOfWeek: 5, color: 'bg-red-500' },
        { id: '22', subject: 'Mathematics', teacher: 'Dr. Sarah Wilson', classroom: 'Room 101', startTime: '08:50', endTime: '09:35', dayOfWeek: 5, color: 'bg-blue-500' },
        { id: '23', subject: 'English', teacher: 'Ms. Emily Brown', classroom: 'Room 205', startTime: '09:40', endTime: '10:25', dayOfWeek: 5, color: 'bg-green-500' },
        { id: '24', subject: 'Study Hall', teacher: 'Various', classroom: 'Library', startTime: '10:45', endTime: '11:30', dayOfWeek: 5, color: 'bg-gray-400' },
        { id: '25', subject: 'Assembly', teacher: 'Principal', classroom: 'Auditorium', startTime: '11:35', endTime: '12:20', dayOfWeek: 5, color: 'bg-purple-400' }
      ];

      const mockSchoolEvents: SchoolEvent[] = [
        {
          id: '1',
          title: 'Parent-Teacher Conference',
          description: 'Individual meetings with teachers to discuss student progress',
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          startTime: '09:00',
          endTime: '15:00',
          type: 'meeting',
          location: 'School Cafeteria',
          isAllDay: false,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Science Fair',
          description: 'Annual science project exhibition and competition',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          startTime: '10:00',
          endTime: '14:00',
          type: 'academic',
          location: 'School Hall',
          isAllDay: false,
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Winter Break',
          description: 'School holiday - no classes',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          type: 'holiday',
          isAllDay: true,
          priority: 'low'
        },
        {
          id: '4',
          title: 'Basketball Championship',
          description: 'Inter-school basketball tournament finals',
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          startTime: '16:00',
          endTime: '18:00',
          type: 'sports',
          location: 'Sports Complex',
          isAllDay: false,
          priority: 'medium'
        },
        {
          id: '5',
          title: 'Mid-term Exams Begin',
          description: 'First day of mid-term examinations',
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          startTime: '08:00',
          endTime: '12:00',
          type: 'exam',
          location: 'Various Classrooms',
          isAllDay: false,
          priority: 'high'
        }
      ];

      const mockAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Algebra Homework Chapter 5',
          subject: 'Mathematics',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          type: 'homework',
          status: 'pending'
        },
        {
          id: '2',
          title: 'Science Lab Report',
          subject: 'Science',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          type: 'project',
          status: 'pending'
        },
        {
          id: '3',
          title: 'History Essay',
          subject: 'History',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          type: 'project',
          status: 'pending'
        },
        {
          id: '4',
          title: 'English Quiz',
          subject: 'English',
          dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          type: 'quiz',
          status: 'pending'
        }
      ];

      setChildren(mockChildren);
      setClassSchedules(mockClassSchedules);
      setSchoolEvents(mockSchoolEvents);
      setAssignments(mockAssignments);
    } catch (error) {
      console.error("Error loading schedule data:", error);
      toast({
        title: "Error",
        description: "Failed to load schedule data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'sports': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'cultural': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'meeting': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'holiday': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'exam': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'announcement': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'graded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (dayIndex: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
  };

  const getWeekDays = (startDate: Date) => {
    const week = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1); // Start from Monday
    
    for (let i = 0; i < 5; i++) { // Monday to Friday
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(currentWeek);
  const timeSlots = [
    '08:00', '08:45', '08:50', '09:35', '09:40', '10:25', '10:45', '11:30', '11:35', '12:20'
  ];

  const upcomingEvents = schoolEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const upcomingAssignments = assignments
    .filter(assignment => assignment.dueDate >= new Date() && assignment.status === 'pending')
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Schedule</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Class Schedule</h1>
          <p className="text-muted-foreground">
            View timetables, events, and upcoming assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            📅 Export Calendar
          </Button>
          <Button>
            📊 Print Schedule
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {children.map(child => (
              <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={viewMode} onValueChange={(value: 'week' | 'month') => setViewMode(value)}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="View mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week View</SelectItem>
            <SelectItem value="month">Month View</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1">
          <Input
            placeholder="Search classes, events, or assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="timetable" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timetable">Weekly Timetable</TabsTrigger>
          <TabsTrigger value="events">School Events</TabsTrigger>
          <TabsTrigger value="assignments">Upcoming Assignments</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        {/* Timetable Tab */}
        <TabsContent value="timetable" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Weekly Class Schedule</CardTitle>
                  <CardDescription>
                    Current week: {weekDays[0].toLocaleDateString()} - {weekDays[4].toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newWeek = new Date(currentWeek);
                      newWeek.setDate(newWeek.getDate() - 7);
                      setCurrentWeek(newWeek);
                    }}
                  >
                    ← Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentWeek(new Date())}
                  >
                    Today
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const newWeek = new Date(currentWeek);
                      newWeek.setDate(newWeek.getDate() + 7);
                      setCurrentWeek(newWeek);
                    }}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-6 gap-1">
                    {/* Header row */}
                    <div className="p-2 font-medium text-center bg-muted">Time</div>
                    {weekDays.map((day, index) => (
                      <div key={index} className="p-2 font-medium text-center bg-muted">
                        <div>{getDayName(day.getDay())}</div>
                        <div className="text-sm text-muted-foreground">
                          {day.getDate()}/{day.getMonth() + 1}
                        </div>
                      </div>
                    ))}

                    {/* Time slots */}
                    {[
                      { start: '08:00', end: '08:45' },
                      { start: '08:50', end: '09:35' },
                      { start: '09:40', end: '10:25' },
                      { start: '10:45', end: '11:30' },
                      { start: '11:35', end: '12:20' }
                    ].map((slot, timeIndex) => (
                      <div key={timeIndex} className="contents">
                        <div className="p-2 text-sm text-center border bg-muted/50">
                          {formatTime(slot.start)} - {formatTime(slot.end)}
                        </div>
                        {weekDays.map((day, dayIndex) => {
                          const dayOfWeek = day.getDay();
                          const classForSlot = classSchedules.find(
                            cls => cls.dayOfWeek === dayOfWeek && cls.startTime === slot.start
                          );
                          
                          return (
                            <div key={`${timeIndex}-${dayIndex}`} className="p-1 border min-h-[80px]">
                              {classForSlot && (
                                <div className={`p-2 rounded text-white text-xs ${classForSlot.color}`}>
                                  <div className="font-medium">{classForSlot.subject}</div>
                                  <div className="truncate">{classForSlot.teacher}</div>
                                  <div className="truncate">{classForSlot.classroom}</div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Today's Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Classes</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {classSchedules
                  .filter(cls => cls.dayOfWeek === new Date().getDay())
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${cls.color}`}></div>
                        <div>
                          <div className="font-medium">{cls.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {cls.teacher} • {cls.classroom}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                      </div>
                    </div>
                  ))}
                {classSchedules.filter(cls => cls.dayOfWeek === new Date().getDay()).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No classes scheduled for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Important school events and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className={`p-4 border rounded-lg ${getPriorityColor(event.priority)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge className={getEventTypeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                          {event.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {event.description}
                            </p>
                          )}
                          <div className="text-sm space-y-1">
                            <div>📅 {formatDate(event.date)}</div>
                            {!event.isAllDay && event.startTime && (
                              <div>⏰ {formatTime(event.startTime)} - {formatTime(event.endTime || '')}</div>
                            )}
                            {event.location && (
                              <div>📍 {event.location}</div>
                            )}
                          </div>
                        </div>
                        <Badge variant={event.priority === 'high' ? 'destructive' : 
                                     event.priority === 'medium' ? 'default' : 'secondary'}>
                          {event.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {upcomingEvents.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No upcoming events
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Calendar</CardTitle>
                <CardDescription>
                  Click on a date to view events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                {selectedDate && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">
                      Events on {formatDate(selectedDate)}
                    </h4>
                    {schoolEvents
                      .filter(event => 
                        event.date.toDateString() === selectedDate.toDateString()
                      )
                      .map(event => (
                        <div key={event.id} className="p-2 border rounded text-sm">
                          <div className="font-medium">{event.title}</div>
                          <Badge className={getEventTypeColor(event.type)} size="sm">
                            {event.type}
                          </Badge>
                        </div>
                      ))
                    }
                    {schoolEvents.filter(event => 
                      event.date.toDateString() === selectedDate.toDateString()
                    ).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No events on this date
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
              <CardDescription>
                Homework, projects, and exams due soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Days Left</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAssignments.map((assignment) => {
                    const daysLeft = Math.ceil((assignment.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {assignment.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(assignment.dueDate)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={daysLeft <= 1 ? 'destructive' : 
                                        daysLeft <= 3 ? 'default' : 'secondary'}>
                            {daysLeft} days
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {upcomingAssignments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming assignments
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Full Calendar View</CardTitle>
              <CardDescription>
                Comprehensive view of classes, events, and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold mb-2">Full Calendar Coming Soon</h3>
                <p>Interactive calendar with all events, classes, and assignments will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
