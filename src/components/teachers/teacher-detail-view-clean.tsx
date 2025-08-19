'use client';

import { useState } from 'react';
import { Teacher, Class } from '@/lib/database-services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { StatusBadge } from '@/components/navigation/data-table';
import { OverviewTab } from './tabs/overview-tab';
import { ActivityTab } from './tabs/activity-tab';
import { SubmissionsTab } from './tabs/submissions-tab';
import { ClassesTab } from './tabs/classes-tab';
import { SubjectsTab } from './tabs/subjects-tab';
import { PerformanceTab } from './tabs/performance-tab';
import { ScheduleTab } from './tabs/schedule-tab';
import { SalaryTab } from './tabs/salary-tab';

interface TeacherDetailViewProps {
  teacher: Teacher;
  classes: Class[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function TeacherDetailView({ teacher, classes, onEdit, onDelete, onClose }: TeacherDetailViewProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-card">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${teacher.firstName} ${teacher.lastName}`} />
            <AvatarFallback>{teacher.firstName[0]}{teacher.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{teacher.firstName} {teacher.lastName}</h1>
            <p className="text-muted-foreground">{teacher.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge status={teacher.status} />
              <Badge variant="outline">ID: {teacher.teacherId}</Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            {getNavigationIcon('edit')}
            Edit
          </Button>
          <Button variant="outline" onClick={onDelete}>
            {getNavigationIcon('delete')}
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            {getNavigationIcon('x')}
            Close
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="salary">Salary</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="flex-1 overflow-auto space-y-6">
              <OverviewTab teacher={teacher} classes={classes} />
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="classes" className="flex-1 overflow-auto space-y-6">
              <ClassesTab teacher={teacher} classes={classes} />
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="flex-1 overflow-auto space-y-6">
              <SubjectsTab teacher={teacher} />
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="flex-1 overflow-auto space-y-6">
              <PerformanceTab teacher={teacher} />
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="flex-1 overflow-auto space-y-6">
              <ScheduleTab teacher={teacher} />
            </TabsContent>

            {/* Salary Tab */}
            <TabsContent value="salary" className="flex-1 overflow-auto space-y-6">
              <SalaryTab teacher={teacher} />
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="flex-1 overflow-auto space-y-6">
              <SubmissionsTab 
                selectedAcademicYear={selectedAcademicYear}
                setSelectedAcademicYear={setSelectedAcademicYear}
              />
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="flex-1 overflow-auto space-y-6">
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
