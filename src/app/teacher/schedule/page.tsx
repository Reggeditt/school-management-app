'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { WeekView } from "@/components/teacher/week-view";
import { DayView } from "@/components/teacher/day-view";
import { ScheduleService, DaySchedule, ScheduleStats, ScheduleItem } from "@/services/schedule.service";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Download,
  Plus,
  TrendingUp,
  Users,
  BookOpen,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function TeacherSchedulePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [weekSchedule, setWeekSchedule] = useState<DaySchedule[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<DaySchedule | null>(null);
  const [scheduleStats, setScheduleStats] = useState<ScheduleStats | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [updating, setUpdating] = useState(false);

  // Get teacher ID
  const teacherId = user?.uid || '';

  useEffect(() => {
    if (teacherId) {
      loadScheduleData();
    }
  }, [teacherId, currentWeek]);

  useEffect(() => {
    if (teacherId && viewMode === 'day') {
      loadDaySchedule();
    }
  }, [teacherId, currentDay, viewMode]);

  const loadScheduleData = async () => {
    try {
      setLoading(true);
      
      const [weekData, stats] = await Promise.all([
        ScheduleService.getWeeklySchedule(teacherId, currentWeek),
        ScheduleService.getScheduleStats(teacherId)
      ]);
      
      setWeekSchedule(weekData.days);
      setScheduleStats(stats);
      
      // Load today's schedule
      const today = await ScheduleService.getTodaySchedule(teacherId);
      setTodaySchedule(today);
      
    } catch (error) {
      console.error('Error loading schedule:', error);
      toast({
        title: "Error",
        description: "Failed to load schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDaySchedule = async () => {
    try {
      const dayIndex = currentDay.getDay();
      const daySchedule: DaySchedule = {
        date: currentDay.toISOString().split('T')[0],
        dayName: currentDay.toLocaleDateString('en-US', { weekday: 'long' }),
        items: await ScheduleService.generateDaySchedule(teacherId, currentDay, dayIndex)
      };
      
      setTodaySchedule(daySchedule);
    } catch (error) {
      console.error('Error loading day schedule:', error);
    }
  };

  const handleNavigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const handleNavigateDay = (direction: 'prev' | 'next') => {
    const newDay = new Date(currentDay);
    newDay.setDate(newDay.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDay(newDay);
  };

  const handleStatusUpdate = async (itemId: string, status: ScheduleItem['status']) => {
    try {
      setUpdating(true);
      
      await ScheduleService.updateScheduleStatus(itemId, status);
      
      // Update local state
      if (viewMode === 'week') {
        setWeekSchedule(prev => prev.map(day => ({
          ...day,
          items: day.items.map(item => 
            item.id === itemId ? { ...item, status } : item
          )
        })));
      } else if (todaySchedule) {
        setTodaySchedule(prev => prev ? {
          ...prev,
          items: prev.items.map(item => 
            item.id === itemId ? { ...item, status } : item
          )
        } : null);
      }
      
      toast({
        title: "Status Updated",
        description: "Schedule item status has been updated successfully.",
      });
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleExportSchedule = async () => {
    try {
      const csvContent = await ScheduleService.exportSchedule(teacherId, currentWeek);
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `schedule_${currentWeek.toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Schedule has been exported to CSV file.",
      });
      
    } catch (error) {
      console.error('Error exporting schedule:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">
            Manage your classes, meetings, and events
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={loadScheduleData} disabled={updating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${updating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportSchedule}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild>
            <Link href="/teacher/schedule/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      {scheduleStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleStats.totalClasses}</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleStats.totalHours}h</div>
              <p className="text-xs text-muted-foreground">
                Weekly total
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleStats.upcomingClasses}</div>
              <p className="text-xs text-muted-foreground">
                Remaining this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduleStats.completedToday}</div>
              <p className="text-xs text-muted-foreground">
                Classes finished
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Next Class Alert */}
      {scheduleStats?.nextClass && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Next Class</h3>
                <p className="text-blue-700">
                  {scheduleStats.nextClass.title} - {scheduleStats.nextClass.className} at {scheduleStats.nextClass.time} in {scheduleStats.nextClass.room}
                </p>
              </div>
              <div className="ml-auto">
                <Button asChild size="sm">
                  <Link href="/teacher/attendance">
                    Take Attendance
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Views */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'week' | 'day')} className="space-y-4">
        <TabsList>
          <TabsTrigger value="week">Week View</TabsTrigger>
          <TabsTrigger value="day">Day View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="week" className="space-y-4">
          <WeekView
            weekSchedule={weekSchedule}
            currentWeek={currentWeek}
            onNavigateWeek={handleNavigateWeek}
            onItemStatusUpdate={handleStatusUpdate}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="day" className="space-y-4">
          {todaySchedule && (
            <DayView
              daySchedule={todaySchedule}
              onNavigateDay={handleNavigateDay}
              onItemStatusUpdate={handleStatusUpdate}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/classes" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">View Classes</h3>
                  <p className="text-sm text-gray-500">Manage your classes</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/attendance" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Take Attendance</h3>
                  <p className="text-sm text-gray-500">Mark student attendance</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <Link href="/teacher/assignments" className="block">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Assignments</h3>
                  <p className="text-sm text-gray-500">Manage assignments</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
