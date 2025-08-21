'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DaySchedule, ScheduleItem } from "@/services/schedule.service";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Square
} from "lucide-react";

interface DayViewProps {
  daySchedule: DaySchedule;
  onNavigateDay: (direction: 'prev' | 'next') => void;
  onItemStatusUpdate: (itemId: string, status: ScheduleItem['status']) => void;
  loading?: boolean;
}

interface TimelineItemProps {
  item: ScheduleItem;
  isNext?: boolean;
  onStatusUpdate: (itemId: string, status: ScheduleItem['status']) => void;
}

function TimelineItem({ item, isNext = false, onStatusUpdate }: TimelineItemProps) {
  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'scheduled': return 'bg-gray-300';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getCardColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'in-progress': return 'border-blue-200 bg-blue-50';
      case 'scheduled': return 'border-gray-200 bg-white';
      case 'cancelled': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const getStatusIcon = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-gray-600" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: ScheduleItem['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-start space-x-4">
      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${getStatusColor(item.status)} ${isNext ? 'ring-4 ring-blue-200' : ''}`}></div>
        <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
      </div>

      {/* Content */}
      <Card className={`flex-1 ${getCardColor(item.status)} ${isNext ? 'ring-2 ring-blue-300' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {getStatusIcon(item.status)}
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <Badge variant="secondary" className={getTypeColor(item.type)}>
                  {item.type}
                </Badge>
                {isNext && (
                  <Badge variant="default" className="bg-blue-500">
                    Next
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">
                {item.time} - {getEndTime(item.time, item.duration)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{item.room}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>{item.subject}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{item.className}</span>
            </div>
            {item.studentsCount > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{item.studentsCount} students</span>
              </div>
            )}
          </div>

          {item.description && (
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
          )}

          {/* Quick actions */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {item.status === 'scheduled' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStatusUpdate(item.id, 'in-progress')}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              )}
              {item.status === 'in-progress' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStatusUpdate(item.id, 'completed')}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Button>
              )}
              {item.status !== 'cancelled' && item.status !== 'completed' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onStatusUpdate(item.id, 'cancelled')}
                >
                  <Square className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              )}
            </div>

            {item.type === 'class' && (
              <div className="flex space-x-1">
                <Button asChild size="sm" variant="ghost">
                  <Link href="/teacher/attendance">
                    Attendance
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/teacher/classes">
                    Class Details
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DayView({ 
  daySchedule, 
  onNavigateDay, 
  onItemStatusUpdate,
  loading = false 
}: DayViewProps) {
  const isToday = daySchedule.date === new Date().toISOString().split('T')[0];
  const dayDate = new Date(daySchedule.date);
  
  // Find next upcoming item
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const nextItem = isToday ? daySchedule.items.find(item => 
    item.time > currentTime && item.status !== 'completed' && item.status !== 'cancelled'
  ) : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <span>{daySchedule.dayName}</span>
            {isToday && (
              <Badge variant="default">Today</Badge>
            )}
          </h2>
          <p className="text-gray-600">
            {dayDate.toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onNavigateDay('prev')}
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigateDay('next')}
            disabled={loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {daySchedule.items.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2">No Classes Scheduled</h3>
              <p className="text-gray-500 mb-4">
                You have no classes or meetings scheduled for this day.
              </p>
              <Button asChild>
                <Link href="/teacher/schedule/new">
                  Add Schedule Item
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {daySchedule.items.map((item, index) => (
              <TimelineItem
                key={item.id}
                item={item}
                isNext={nextItem?.id === item.id}
                onStatusUpdate={onItemStatusUpdate}
              />
            ))}
            
            {/* End of day marker */}
            <div className="flex items-center space-x-4 pt-4">
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              <div className="text-sm text-gray-500">End of day</div>
            </div>
          </>
        )}
      </div>

      {/* Summary */}
      {daySchedule.items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Day Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {daySchedule.items.filter(item => item.type === 'class').length}
                </div>
                <div className="text-sm text-gray-600">Classes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {daySchedule.items.filter(item => item.type === 'meeting').length}
                </div>
                <div className="text-sm text-gray-600">Meetings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {daySchedule.items.filter(item => item.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(daySchedule.items.reduce((sum, item) => sum + item.duration, 0) / 60 * 10) / 10}h
                </div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
