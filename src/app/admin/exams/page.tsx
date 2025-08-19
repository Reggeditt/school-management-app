'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Exam } from '@/lib/database-services';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExamFormDialog } from '@/components/exams/exam-form-dialog';
import { formatDate } from '@/lib/form-utils';
import { Calendar, Clock, Users, BookOpen, GraduationCap } from 'lucide-react';

export default function ExamsPage() {
  const { 
    state, 
    loadExams,
    loadStudents,
    loadClasses,
    loadSubjects,
    loadTeachers,
    addExam, 
    updateExam, 
    deleteExam 
  } = useStore();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadExams();
    loadStudents();
    loadClasses();
    loadSubjects();
    loadTeachers();
  }, [loadExams, loadStudents, loadClasses, loadSubjects, loadTeachers]);

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = state.subjects.find(s => s.id === subjectId);
    return subject ? subject.name : 'Unknown Subject';
  };

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = state.teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
  };

  // Get class names by IDs
  const getClassNames = (classIds: string[]) => {
    return classIds
      .map(id => {
        const classItem = state.classes.find(c => c.id === id);
        return classItem ? classItem.name : null;
      })
      .filter(Boolean)
      .join(', ') || 'No Classes';
  };

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'midterm': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'final': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'monthly': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'weekly': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'surprise': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const total = state.exams.length;
    const scheduled = state.exams.filter(e => e.status === 'scheduled').length;
    const active = state.exams.filter(e => e.status === 'active').length;
    const completed = state.exams.filter(e => e.status === 'completed').length;
    const upcoming = state.exams.filter(e => e.status === 'scheduled' && new Date(e.date) > new Date()).length;

    return { total, scheduled, active, completed, upcoming };
  };

  const stats = calculateStats();

  // Handle delete exam
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteExam(id);
        toast({
          title: 'Success',
          description: 'Exam deleted successfully',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete exam',
          variant: 'destructive',
        });
      }
    }
  };

  // Handle edit exam
  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setIsFormOpen(true);
  };

  // Handle add new exam
  const handleAdd = () => {
    setSelectedExam(null);
    setIsFormOpen(true);
  };

  // Table columns configuration
  const columns: Column<Exam>[] = [
    {
      key: 'exam',
      title: 'Exam Details',
      render: (_, exam) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
              {exam.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{exam.name}</div>
            <div className="text-sm text-muted-foreground">
              {getSubjectName(exam.subjectId)}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type & Status',
      render: (_, exam) => (
        <div className="space-y-1">
          <Badge className={getTypeColor(exam.type)}>
            {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
          </Badge>
          <div>
            <Badge className={getStatusColor(exam.status)}>
              {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
            </Badge>
          </div>
        </div>
      )
    },
    {
      key: 'schedule',
      title: 'Schedule',
      render: (_, exam) => (
        <div className="text-sm">
          <div className="font-medium">{new Date(exam.date).toLocaleDateString()}</div>
          <div className="text-muted-foreground">
            {exam.startTime} - {exam.endTime}
          </div>
          <div className="text-muted-foreground">
            Duration: {exam.duration} mins
          </div>
        </div>
      )
    },
    {
      key: 'marks',
      title: 'Marks',
      render: (_, exam) => (
        <div className="text-sm">
          <div className="font-medium">Total: {exam.totalMarks}</div>
          <div className="text-muted-foreground">
            Pass: {exam.passingMarks} ({Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)
          </div>
        </div>
      )
    },
    {
      key: 'classes',
      title: 'Classes & Teacher',
      render: (_, exam) => (
        <div className="text-sm">
          <div className="font-medium">{getClassNames(exam.classIds)}</div>
          <div className="text-muted-foreground">
            {getTeacherName(exam.teacherId)}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, exam) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(exam)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(exam.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exam Management</h1>
        <Button onClick={handleAdd}>
          Create Exam
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.upcoming}</div>
          </CardContent>
        </Card>
      </div>

      {/* Exams Table */}
      <DataTable
        data={state.exams}
        columns={columns}
        title="Exams List"
        description="Complete list of all exams with their schedules and details"
        searchPlaceholder="Search exams by name, subject, or teacher..."
        filters={[
          {
            label: 'Type',
            value: 'type',
            options: [
              { label: 'Mid-Term', value: 'midterm' },
              { label: 'Final', value: 'final' },
              { label: 'Monthly', value: 'monthly' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Surprise', value: 'surprise' }
            ]
          },
          {
            label: 'Status',
            value: 'status',
            options: [
              { label: 'Scheduled', value: 'scheduled' },
              { label: 'Active', value: 'active' },
              { label: 'Completed', value: 'completed' },
              { label: 'Cancelled', value: 'cancelled' }
            ]
          },
          {
            label: 'Subject',
            value: 'subjectId',
            options: state.subjects.map(s => ({ label: s.name, value: s.id }))
          }
        ]}
        loading={state.loading.exams}
        onAdd={handleAdd}
        addButtonText="Create Exam"
      />

      {/* Form Dialog */}
      <ExamFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedExam(null);
        }}
        exam={selectedExam}
      />
    </div>
  );
}