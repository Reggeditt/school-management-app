'use client';

import { useState } from 'react';
import { Class, Student, Teacher, Subject } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { DataTable } from '@/components/navigation/data-table';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { SubjectsTab } from './tabs/subjects-tab';
import { ClassTimetableTab } from './tabs/class-timetable-tab';

interface ClassDetailViewProps {
  classItem: Class;
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ClassDetailView({ 
  classItem, 
  students, 
  teachers, 
  subjects,
  onEdit, 
  onDelete, 
  onClose 
}: ClassDetailViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { updateSubject } = useStore();
  const { toast } = useToast();

  // Helper functions
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getClassTeacher = () => {
    return teachers.find(t => t.id === classItem.classTeacherId);
  };

  const getClassStudents = () => {
    return students.filter(s => classItem.students.includes(s.id));
  };

  const getCapacityPercentage = () => {
    return Math.round((classItem.currentStrength / classItem.maxCapacity) * 100);
  };

  const getCapacityColor = () => {
    const percentage = getCapacityPercentage();
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Student table columns
  const studentColumns = [
    {
      key: 'student',
      label: 'Student',
      render: (value: any, student: Student) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.profilePicture} />
            <AvatarFallback>
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.firstName} {student.lastName}</div>
            <div className="text-sm text-muted-foreground">Roll: {student.rollNumber}</div>
          </div>
        </div>
      )
    },
    {
      key: 'studentId',
      label: 'Student ID'
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'} className="capitalize">
          {value}
        </Badge>
      )
    }
  ];

  // Mock academic performance data
  const academicData = {
    averageGrade: 'B+',
    averageAttendance: 88,
    subjectPerformance: [
      { subject: 'Mathematics', average: 85, grade: 'B+' },
      { subject: 'English', average: 82, grade: 'B' },
      { subject: 'Science', average: 90, grade: 'A-' },
      { subject: 'History', average: 78, grade: 'B-' },
      { subject: 'Physical Education', average: 95, grade: 'A+' }
    ],
    recentEvents: [
      { date: '2025-08-15', event: 'Mathematics Unit Test', type: 'exam' },
      { date: '2025-08-14', event: 'Science Fair Preparation', type: 'activity' },
      { date: '2025-08-13', event: 'Parent-Teacher Meeting', type: 'meeting' },
      { date: '2025-08-12', event: 'Sports Day Practice', type: 'activity' }
    ]
  };

  const classTeacher = getClassTeacher();
  const classStudents = getClassStudents();

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
            <h1 className="text-2xl font-bold">Class Details</h1>
            <p className="text-muted-foreground">View and manage class information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            {getNavigationIcon('edit')}
            Edit Class
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            {getNavigationIcon('trash')}
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Class Overview Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {classItem.name}
                  </CardTitle>
                  <CardDescription className="text-base space-y-1">
                    <div className="flex items-center gap-4">
                      <span><strong>Grade:</strong> {classItem.grade}</span>
                      <span><strong>Section:</strong> {classItem.section}</span>
                      <span><strong>Room:</strong> {classItem.roomNumber}</span>
                      <span><strong>Academic Year:</strong> {classItem.academicYear}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span><strong>Class Teacher:</strong> {classTeacher ? `${classTeacher.firstName} ${classTeacher.lastName}` : 'Not Assigned'}</span>
                      <span><strong>Capacity:</strong> 
                        <span className={getCapacityColor()}> {classItem.currentStrength}/{classItem.maxCapacity}</span>
                      </span>
                    </div>
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{getCapacityPercentage()}%</div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={getCapacityPercentage()} className="w-full" />
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
              <TabsTrigger value="timetable">Timetable</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Class Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getNavigationIcon('school')}
                      Class Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Class Name</span>
                        <span className="font-medium">{classItem.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Grade</span>
                        <span className="font-medium">{classItem.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Section</span>
                        <span className="font-medium">{classItem.section}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Number</span>
                        <span className="font-medium">{classItem.roomNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Academic Year</span>
                        <span className="font-medium">{classItem.academicYear}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Capacity & Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getNavigationIcon('users')}
                      Capacity & Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{classItem.currentStrength}</div>
                      <p className="text-sm text-muted-foreground">Current Students</p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Maximum Capacity</span>
                        <span className="font-medium">{classItem.maxCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available Seats</span>
                        <span className="font-medium">{classItem.maxCapacity - classItem.currentStrength}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity Used</span>
                        <span className={`font-medium ${getCapacityColor()}`}>
                          {getCapacityPercentage()}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getNavigationIcon('settings')}
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        {getNavigationIcon('user-plus')}
                        Add Student
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        {getNavigationIcon('calendar')}
                        View Schedule
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        {getNavigationIcon('file')}
                        Generate Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        {getNavigationIcon('mail')}
                        Send Announcement
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Students</CardTitle>
                  <CardDescription>
                    List of all students in {classItem.name} ({classStudents.length} students)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={classStudents}
                    columns={studentColumns}
                    searchable={true}
                    searchPlaceholder="Search students..."
                    searchKeys={['firstName', 'lastName', 'studentId']}
                    emptyStateMessage="No students assigned to this class"
                    actions={{
                      create: {
                        label: "Add Student",
                        onClick: () => console.log('Add student to class')
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Teacher Tab */}
            <TabsContent value="teacher" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Teacher</CardTitle>
                  <CardDescription>Information about the assigned class teacher</CardDescription>
                </CardHeader>
                <CardContent>
                  {classTeacher ? (
                    <div className="flex items-start gap-4 p-4 rounded-lg border">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={classTeacher.profilePicture} />
                        <AvatarFallback className="text-lg">
                          {classTeacher.firstName[0]}{classTeacher.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {classTeacher.firstName} {classTeacher.lastName}
                        </h3>
                        <p className="text-muted-foreground">{classTeacher.designation}</p>
                        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Department:</span>
                            <p>{classTeacher.department}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Experience:</span>
                            <p>{classTeacher.experience} years</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Email:</span>
                            <p>{classTeacher.email}</p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Phone:</span>
                            <p>{classTeacher.phone}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline">
                            {getNavigationIcon('mail')}
                            Send Email
                          </Button>
                          <Button size="sm" variant="outline">
                            {getNavigationIcon('phone')}
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            {getNavigationIcon('eye')}
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">{getNavigationIcon('user-x')}</div>
                      <p className="text-muted-foreground mb-4">No teacher assigned to this class</p>
                      <Button>Assign Teacher</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{academicData.averageGrade}</div>
                      <p className="text-sm text-muted-foreground">Class Average Grade</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Attendance</span>
                        <span className="text-sm font-medium">{academicData.averageAttendance}%</span>
                      </div>
                      <Progress value={academicData.averageAttendance} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Subject Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {academicData.subjectPerformance.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{subject.subject}</div>
                            <div className="text-xs text-muted-foreground">Average: {subject.average}%</div>
                          </div>
                          <Badge variant="outline">
                            {subject.grade}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Class Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {academicData.recentEvents.map((event, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="mt-1">
                          {event.type === 'exam' && getNavigationIcon('file')}
                          {event.type === 'activity' && getNavigationIcon('trophy')}
                          {event.type === 'meeting' && getNavigationIcon('users')}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Schedule</CardTitle>
                  <CardDescription>Weekly timetable and schedule for {classItem.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">{getNavigationIcon('calendar')}</div>
                    <p className="text-muted-foreground mb-4">Schedule Management</p>
                    <p className="text-sm text-muted-foreground">
                      Detailed class schedule and timetable management coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-6">
              <SubjectsTab 
                classItem={classItem}
                subjects={subjects}
                teachers={teachers}
                onSubjectChange={async (subjectId: string, isAssigned: boolean) => {
                  try {
                    const subject = subjects.find(s => s.id === subjectId);
                    if (!subject) return;

                    let newClassIds = [...(subject.classIds || [])];
                    if (isAssigned) {
                      if (!newClassIds.includes(classItem.id)) {
                        newClassIds.push(classItem.id);
                      }
                    } else {
                      newClassIds = newClassIds.filter(id => id !== classItem.id);
                    }

                    await updateSubject(subjectId, { classIds: newClassIds });
                    toast({
                      title: "Success",
                      description: `Subject ${isAssigned ? 'assigned to' : 'removed from'} class`,
                    });
                  } catch (error) {
                    console.error('Error updating subject assignment:', error);
                    toast({
                      title: "Error",
                      description: "Failed to update subject assignment",
                      variant: "destructive"
                    });
                  }
                }}
              />
            </TabsContent>

            {/* Timetable Tab */}
            <TabsContent value="timetable" className="space-y-6">
              <ClassTimetableTab 
                classItem={classItem}
                subjects={subjects.filter(s => s.classIds?.includes(classItem.id))}
                teachers={teachers}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
