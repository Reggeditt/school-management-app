'use client';

import { Teacher } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTeacherSchedule } from '../data/mock-data';
import { Clock, MapPin, Users, Calendar, Coffee, BookOpen } from 'lucide-react';

interface ScheduleTabProps {
  teacher: Teacher;
}

export function ScheduleTab({ teacher }: ScheduleTabProps) {
  const scheduleData = getTeacherSchedule();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class': return <BookOpen className="h-4 w-4" />;
      case 'break': return <Coffee className="h-4 w-4" />;
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'preparation': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'default';
      case 'break': return 'secondary';
      case 'meeting': return 'destructive';
      case 'preparation': return 'outline';
      default: return 'secondary';
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule Overview</CardTitle>
          <CardDescription>Teaching hours and schedule distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{scheduleData.totalHours}</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{scheduleData.teachingHours}</p>
              <p className="text-sm text-muted-foreground">Teaching Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{scheduleData.preparationHours}</p>
              <p className="text-sm text-muted-foreground">Prep Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{scheduleData.meetingHours}</p>
              <p className="text-sm text-muted-foreground">Meeting Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{scheduleData.freeHours}</p>
              <p className="text-sm text-muted-foreground">Free Hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Schedule Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day) => (
          <Card key={day}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {scheduleData.weeklySchedule[day.toLowerCase() as keyof typeof scheduleData.weeklySchedule].map((slot, index) => (
                  <div key={index} className="p-2 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1">
                        {getTypeIcon(slot.type)}
                        <span className="text-xs font-medium">{slot.time}</span>
                      </div>
                      <Badge variant={getTypeColor(slot.type)} className="text-xs">
                        {slot.type}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{slot.subject}</p>
                    {slot.room && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{slot.room}</span>
                      </div>
                    )}
                    {slot.students && (
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{slot.students} students</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Schedule Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Teaching</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{width: `${(scheduleData.teachingHours / scheduleData.totalHours) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{scheduleData.teachingHours}h</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Preparation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{width: `${(scheduleData.preparationHours / scheduleData.totalHours) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{scheduleData.preparationHours}h</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Meetings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{width: `${(scheduleData.meetingHours / scheduleData.totalHours) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{scheduleData.meetingHours}h</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Free Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{width: `${(scheduleData.freeHours / scheduleData.totalHours) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{scheduleData.freeHours}h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Full Calendar
              </Button>
              <Button className="w-full" variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Export Schedule
              </Button>
              <Button className="w-full" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button className="w-full" variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Room Assignments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Parent-Teacher Conference</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 3:00 PM - Room 305</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Grade 12A Mathematics Exam</p>
                <p className="text-sm text-muted-foreground">Friday, 9:00 AM - Room 305</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Department Meeting</p>
                <p className="text-sm text-muted-foreground">Friday, 2:00 PM - Conference Room B</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
