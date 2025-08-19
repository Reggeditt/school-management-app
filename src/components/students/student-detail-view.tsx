'use client';

import { useState } from 'react';
import { Student, Class } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/navigation/data-table';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';

// Import tab components
import { OverviewTab } from './tabs/overview-tab';
import { FamilyTab } from './tabs/family-tab';
import { MedicalTab } from './tabs/medical-tab';
import { AcademicTab } from './tabs/academic-tab';
import { AttendanceTab } from './tabs/attendance-tab';
import { ActivityTab } from './tabs/activity-tab';

interface StudentDetailViewProps {
  student: Student;
  classes: Class[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function StudentDetailView({ 
  student, 
  classes, 
  onEdit, 
  onDelete, 
  onClose 
}: StudentDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [selectedTerm, setSelectedTerm] = useState('current');
  const [selectedAttendanceYear, setSelectedAttendanceYear] = useState('2024-2025');

  // Helper functions
  const getClassInfo = () => {
    const studentClass = classes.find(c => c.students.includes(student.id));
    return studentClass ? `Grade ${studentClass.grade}${studentClass.section}` : 'Not Assigned';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            {getNavigationIcon('arrow-left')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Student Details</h1>
            <p className="text-muted-foreground">View and manage student information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            {getNavigationIcon('edit')}
            Edit Student
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            {getNavigationIcon('trash')}
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Student Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={student.profilePicture} />
                  <AvatarFallback className="text-lg">
                    {student.firstName[0]}{student.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{student.firstName} {student.lastName}</h2>
                      <p className="text-lg text-muted-foreground">{getClassInfo()}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <StatusBadge status={student.status} />
                        <span className="text-sm text-muted-foreground">ID: {student.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tab Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Tab Content */}
            <TabsContent value="overview" className="space-y-6">
              <OverviewTab student={student} />
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
              <FamilyTab student={student} classes={classes} />
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <MedicalTab student={student} />
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <AcademicTab 
                student={student}
                selectedAcademicYear={selectedAcademicYear}
                selectedTerm={selectedTerm}
                onAcademicYearChange={setSelectedAcademicYear}
                onTermChange={setSelectedTerm}
              />
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <AttendanceTab 
                student={student}
                selectedAttendanceYear={selectedAttendanceYear}
                onAttendanceYearChange={setSelectedAttendanceYear}
              />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <ActivityTab student={student} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
