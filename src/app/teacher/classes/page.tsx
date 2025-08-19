'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Skeleton } from '@/components/ui/skeleton';
import { TeacherService } from '@/lib/services/teacher-service';
import { Class, Student } from '@/lib/database-services';
import { Users, Calendar, Clock, BookOpen, BarChart3, Plus, Eye } from 'lucide-react';

export default function TeacherClassesPage() {
  const { user } = useAuth();
  const { state, loadClasses, loadStudents } = useStore();
  const [teacherClasses, setTeacherClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  
  const teacherService = TeacherService.getInstance();
  const teacherId = user?.uid || '';

  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!teacherId) return;
      
      try {
        setLoading(true);
        
        // Load data from store first
        await Promise.all([loadClasses(), loadStudents()]);
        
        // Get teacher's classes
        const classes = await teacherService.getTeacherClasses(teacherId);
        setTeacherClasses(classes);
      } catch (error) {
        console.error('Error fetching teacher classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [teacherId, loadClasses, loadStudents, teacherService]);

  const getClassStats = (classObj: Class) => {
    const currentEnrollment = classObj.students?.length || 0;
    const maxCapacity = classObj.maxCapacity || 30;
    const capacityPercentage = Math.round((currentEnrollment / maxCapacity) * 100);
    
    // Mock additional stats
    const avgGrade = Math.floor(Math.random() * 15) + 80; // 80-95
    const attendanceRate = Math.floor(Math.random() * 10) + 85; // 85-95
    
    return {
      currentEnrollment,
      maxCapacity,
      capacityPercentage,
      avgGrade,
      attendanceRate
    };
  };

  const getCapacityBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return 'destructive';
    if (percentage >= 75) return 'outline';
    return 'secondary';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Classes</h1>
          <p className="text-muted-foreground">
            Manage and view details for all your assigned classes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Request New Class
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teacherClasses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teacherClasses.reduce((total, cls) => total + (cls.students?.length || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Class Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teacherClasses.length > 0
                ? Math.round(
                    teacherClasses.reduce((total, cls) => total + (cls.students?.length || 0), 0) /
                    teacherClasses.length
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Students per class
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(Math.random() * 3) + 2}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teacherClasses.map((classObj) => {
          const stats = getClassStats(classObj);
          
          return (
            <Card key={classObj.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{classObj.name}</CardTitle>
                    <CardDescription>
                      {classObj.subjects} • Grade {classObj.grade}
                    </CardDescription>
                  </div>
                  <Badge variant={getCapacityBadgeVariant(stats.capacityPercentage)}>
                    {stats.capacityPercentage}% Full
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enrollment */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Enrollment</span>
                  </div>
                  <span className="font-medium">
                    {stats.currentEnrollment}/{stats.maxCapacity}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${stats.capacityPercentage}%` }}
                  ></div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Avg Grade</div>
                    <div className="font-medium text-green-600">{stats.avgGrade}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Attendance</div>
                    <div className="font-medium text-blue-600">{stats.attendanceRate}%</div>
                  </div>
                </div>

                {/* Schedule Info */}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {typeof classObj.schedule === 'string' 
                      ? classObj.schedule 
                      : 'Mon, Wed, Fri 10:00 AM'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/teacher/classes/${classObj.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    Quick Actions
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {teacherClasses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Classes Assigned</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any classes assigned yet. Contact the administration to get started.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Class Assignment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
