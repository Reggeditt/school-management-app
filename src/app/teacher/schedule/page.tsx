'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleEvent {
  id: string;
  title: string;
  subject: string;
  class: string;
  room: string;
  startTime: Date;
  endTime: Date;
  type: 'class' | 'meeting' | 'duty' | 'break';
  description?: string;
}

interface TimeSlot {
  time: string;
  events: ScheduleEvent[];
}

export default function TeacherSchedule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());

  useEffect(() => {
    loadSchedule();
  }, [selectedWeekStart]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const today = new Date();
      const mockSchedule: ScheduleEvent[] = [
        // Monday
        {
          id: '1',
          title: 'Mathematics - Algebra',
          subject: 'Mathematics',
          class: 'Grade 9A',
          room: 'Room 101',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1, 8, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1, 9, 0),
          type: 'class',
          description: 'Linear equations and problem solving'
        },
        {
          id: '2',
          title: 'Physics - Motion',
          subject: 'Physics',
          class: 'Grade 11A',
          room: 'Lab 201',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1, 10, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1, 11, 0),
          type: 'class',
          description: 'Velocity and acceleration experiments'
        },
        {
          id: '3',
          title: 'Teacher Meeting',
          subject: 'Administration',
          class: 'All Teachers',
          room: 'Conference Room',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1, 15, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 1, 16, 0),
          type: 'meeting',
          description: 'Monthly curriculum review meeting'
        },
        // Tuesday
        {
          id: '4',
          title: 'Mathematics - Geometry',
          subject: 'Mathematics',
          class: 'Grade 10B',
          room: 'Room 102',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2, 8, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2, 9, 0),
          type: 'class',
          description: 'Triangles and geometric proofs'
        },
        {
          id: '5',
          title: 'Break Duty',
          subject: 'Supervision',
          class: 'All Grades',
          room: 'Cafeteria',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2, 12, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 2, 13, 0),
          type: 'duty',
          description: 'Lunch break supervision'
        },
        // Wednesday
        {
          id: '6',
          title: 'Chemistry Lab',
          subject: 'Chemistry',
          class: 'Grade 10A',
          room: 'Lab 301',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 3, 9, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 3, 10, 30),
          type: 'class',
          description: 'Chemical reactions practical experiments'
        },
        {
          id: '7',
          title: 'Mathematics - Statistics',
          subject: 'Mathematics',
          class: 'Grade 12A',
          room: 'Room 105',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 3, 14, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 3, 15, 0),
          type: 'class',
          description: 'Probability and data analysis'
        },
        // Thursday
        {
          id: '8',
          title: 'Physics - Electricity',
          subject: 'Physics',
          class: 'Grade 11B',
          room: 'Lab 202',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 4, 10, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 4, 11, 30),
          type: 'class',
          description: 'Circuit analysis and Ohms law'
        },
        // Friday
        {
          id: '9',
          title: 'Mathematics Review',
          subject: 'Mathematics',
          class: 'Grade 9B',
          room: 'Room 103',
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 5, 8, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 5, 9, 0),
          type: 'class',
          description: 'Weekly review and Q&A session'
        }
      ];

      setSchedule(mockSchedule);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load schedule",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-100';
      case 'duty': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-100';
      case 'break': return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return '📚';
      case 'meeting': return '🤝';
      case 'duty': return '👮';
      case 'break': return '☕';
      default: return '📅';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  // Group events by day
  const groupEventsByDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return {
        date,
        dayName: days[i],
        events: schedule.filter(event => {
          const eventDate = new Date(event.startTime);
          return eventDate.getDay() === i;
        }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      };
    });

    return weekDays;
  };

  // Get today's events
  const getTodaysEvents = () => {
    const today = new Date();
    return schedule.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === today.toDateString();
    }).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  };

  const weekDays = groupEventsByDay();
  const todaysEvents = getTodaysEvents();

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
          <h1 className="text-3xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">
            Your weekly teaching schedule and appointments
          </p>
        </div>
        <Button>
          📅 Export Schedule
        </Button>
      </div>

      {/* Today's Schedule Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📅</span>
            Today's Schedule
          </CardTitle>
          <CardDescription>
            {formatDate(new Date())}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">🎉</div>
              <p>No classes scheduled for today!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                      <span className="mx-2">•</span>
                      <span>{event.room}</span>
                      <span className="mx-2">•</span>
                      <span>{event.class}</span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>
            Complete schedule for this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weekDays.filter(day => day.dayName !== 'Sunday' && day.dayName !== 'Saturday').map((day) => (
              <Card key={day.dayName} className={day.date.toDateString() === new Date().toDateString() ? 'border-primary' : ''}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{day.dayName}</CardTitle>
                  <CardDescription>
                    {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {day.events.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <div className="text-2xl mb-1">📴</div>
                      <p className="text-sm">No classes</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {day.events.map((event) => (
                        <div key={event.id} className="p-2 rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{getEventTypeIcon(event.type)}</span>
                            <span className="text-sm font-medium truncate">{event.title}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {event.room} • {event.class}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Classes This Week
            </CardTitle>
            <div className="text-2xl">📚</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedule.filter(event => event.type === 'class').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Regular class sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meetings
            </CardTitle>
            <div className="text-2xl">🤝</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedule.filter(event => event.type === 'meeting').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Staff meetings scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Duty Hours
            </CardTitle>
            <div className="text-2xl">👮</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedule.filter(event => event.type === 'duty').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Supervision duties
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Teaching Hours
            </CardTitle>
            <div className="text-2xl">⏱️</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {schedule.filter(event => event.type === 'class').reduce((total, event) => {
                const duration = (event.endTime.getTime() - event.startTime.getTime()) / (1000 * 60 * 60);
                return total + duration;
              }, 0).toFixed(1)}h
            </div>
            <p className="text-xs text-muted-foreground">
              Total this week
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
