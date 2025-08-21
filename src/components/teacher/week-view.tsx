'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DaySchedule, ScheduleItem } from "@/services/schedule.service";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Edit,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Eye,
  MoreHorizontal
} from "lucide-react";

interface WeekViewProps {
  weekSchedule: DaySchedule[];
  currentWeek: Date;
  onNavigateWeek: (direction: 'prev' | 'next') => void;
  onItemStatusUpdate: (itemId: string, status: ScheduleItem['status']) => void;
  loading?: boolean;
}

interface ScheduleItemCardProps {
  item: ScheduleItem;
  onStatusUpdate: (itemId: string, status: ScheduleItem['status']) => void;
}

interface DayColumnProps {
  day: DaySchedule;
  onStatusUpdate: (itemId: string, status: ScheduleItem['status']) => void;
}

function ScheduleItemCard({ item, onStatusUpdate }: ScheduleItemCardProps) {
  const getStatusColor = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'scheduled': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: ScheduleItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
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

  return (
    <Card className={`mb-3 border-l-4 hover:shadow-md transition-shadow ${getStatusColor(item.status)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getStatusIcon(item.status)}
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <Badge variant="secondary" className={getTypeColor(item.type)}>
                {item.type}
              </Badge>
            </div>
            
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{item.time} ({item.duration} min)</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span>{item.room}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="h-3 w-3" />
                <span>{item.className} - {item.subject}</span>
              </div>
              {item.studentsCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{item.studentsCount} students</span>
                </div>
              )}
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{item.title}</DialogTitle>
                <DialogDescription>
                  Schedule details and options
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Time</label>
                    <p className="text-sm text-gray-600">{item.time} ({item.duration} minutes)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Room</label>
                    <p className="text-sm text-gray-600">{item.room}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Class</label>
                    <p className="text-sm text-gray-600">{item.className}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <p className="text-sm text-gray-600">{item.subject}</p>
                  </div>
                </div>
                
                {item.description && (
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex space-x-2 mt-2">
                    {(['scheduled', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={item.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => onStatusUpdate(item.id, status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/teacher/classes`}>
                      View Class
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href={`/teacher/attendance`}>
                      Take Attendance
                    </Link>
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function DayColumn({ day, onStatusUpdate }: DayColumnProps) {
  const isToday = day.date === new Date().toISOString().split('T')[0];
  const isWeekend = new Date(day.date).getDay() === 0 || new Date(day.date).getDay() === 6;
  
  return (
    <div className={`space-y-3 ${isToday ? 'ring-2 ring-blue-200 rounded-lg p-3' : ''}`}>
      <div className="text-center">
        <h3 className={`font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
          {day.dayName}
        </h3>
        <p className={`text-sm ${isToday ? 'text-blue-500' : 'text-gray-500'}`}>
          {new Date(day.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          })}
        </p>
        {isToday && (
          <Badge variant="default" className="mt-1">Today</Badge>
        )}
      </div>
      
      <div className="min-h-[200px]">
        {day.items.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              {isWeekend ? 'Weekend' : 'No classes scheduled'}
            </p>
          </div>
        ) : (
          day.items.map((item) => (
            <ScheduleItemCard
              key={item.id}
              item={item}
              onStatusUpdate={onStatusUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}

export function WeekView({ 
  weekSchedule, 
  currentWeek, 
  onNavigateWeek, 
  onItemStatusUpdate,
  loading = false 
}: WeekViewProps) {
  const weekStart = new Date(currentWeek);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

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
        <div className="grid grid-cols-7 gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {weekStart.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric' 
            })} - {weekEnd.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </h2>
          <p className="text-gray-600">Weekly schedule overview</p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onNavigateWeek('prev')}
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigateWeek('next')}
            disabled={loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekSchedule.map((day) => (
          <DayColumn
            key={day.date}
            day={day}
            onStatusUpdate={onItemStatusUpdate}
          />
        ))}
      </div>
    </div>
  );
}
