'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Skeleton } from '@/components/ui/skeleton';
import { TeacherService } from '@/lib/services/teacher-service';
import { Class, Student } from '@/lib/database-services';
import { ArrowLeft, Users, Calendar, FileText, Award, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import tab components
import { ClassOverviewTab } from '@/components/teacher/class-detail/overview-tab';
import { ClassStudentsTab } from '@/components/teacher/class-detail/students-tab';
import { ClassAttendanceTab } from '@/components/teacher/class-detail/attendance-tab';
import { ClassAssignmentsTab } from '@/components/teacher/class-detail/assignments-tab';
import { ClassGradesTab } from '@/components/teacher/class-detail/grades-tab';

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { state, loadClasses, loadStudents } = useStore();
  const { toast } = useToast();
  
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const teacherService = TeacherService.getInstance();
  const teacherId = user?.uid || '';
  const classId = params.id as string;

  useEffect(() => {
    const fetchClassData = async () => {
      if (!teacherId || !classId) return;
      
      try {
        setLoading(true);
        
        // Load base data
        await Promise.all([loadClasses(), loadStudents()]);
        
        // Get teacher classes to verify access
        const teacherClasses = await teacherService.getTeacherClasses(teacherId);
        const targetClass = teacherClasses.find(cls => cls.id === classId);
        
        if (!targetClass) {
          toast({
            title: "Access Denied",
            description: "You don't have access to this class.",
            variant: "destructive"
          });
          router.push('/teacher/classes');
          return;
        }
        
        setClassItem(targetClass);
        
        // Get students for this class
        const allStudents = await teacherService.getTeacherStudents(teacherId);
        const studentsInClass = allStudents.filter(student => 
          targetClass.students?.includes(student.id)
        );
        setClassStudents(studentsInClass);
        
      } catch (error) {
        console.error('Error fetching class data:', error);
        toast({
          title: "Error",
          description: "Failed to load class details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [teacherId, classId, loadClasses, loadStudents, teacherService, toast, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Class Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested class could not be found or you don't have access to it.
        </p>
        <Button onClick={() => router.push('/teacher/classes')}>
          Back to Classes
        </Button>
      </div>
    );
  }

  const capacity = classItem.maxCapacity || 30;
  const occupancyRate = Math.round((classStudents.length / capacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/teacher/classes')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Classes
        </Button>
      </div>

      {/* Class Info Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{classItem.name}</CardTitle>
              <CardDescription className="text-base">
                Grade {classItem.grade} • Section {classItem.section || 'A'}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge 
                variant={occupancyRate > 90 ? "destructive" : occupancyRate > 70 ? "default" : "secondary"}
              >
                {occupancyRate}% Capacity
              </Badge>
              <Badge variant="outline">
                {classStudents.length}/{capacity} Students
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{classStudents.length} Students</div>
                <div className="text-xs text-muted-foreground">Enrolled</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">95%</div>
                <div className="text-xs text-muted-foreground">Avg Attendance</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">5</div>
                <div className="text-xs text-muted-foreground">Assignments</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">B+</div>
                <div className="text-xs text-muted-foreground">Avg Grade</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ClassOverviewTab 
            classItem={classItem} 
            students={classStudents}
            teacherId={teacherId}
          />
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <ClassStudentsTab 
            classItem={classItem} 
            students={classStudents}
            teacherId={teacherId}
          />
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-6">
          <ClassAttendanceTab 
            classItem={classItem} 
            students={classStudents}
            teacherId={teacherId}
          />
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-6">
          <ClassAssignmentsTab 
            classItem={classItem} 
            students={classStudents}
            teacherId={teacherId}
          />
        </TabsContent>
        
        <TabsContent value="grades" className="space-y-6">
          <ClassGradesTab 
            classItem={classItem} 
            students={classStudents}
            teacherId={teacherId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
