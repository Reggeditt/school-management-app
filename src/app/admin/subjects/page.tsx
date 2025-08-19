'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Subject } from '@/lib/database-services';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SubjectFormDialog } from '@/components/subjects/subject-form-dialog';
import { formatDate } from '@/lib/form-utils';

export default function SubjectsPage() {
  const { 
    state, 
    loadSubjects,
    loadTeachers,
    loadClasses,
    addSubject, 
    updateSubject, 
    deleteSubject 
  } = useStore();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadSubjects();
    loadTeachers(); // Need for teacher assignment
    loadClasses(); // Need for class assignment
  }, [loadSubjects, loadTeachers, loadClasses]);

  // Get teacher names by IDs
  const getTeacherNames = (teacherIds: string[]) => {
    return teacherIds
      .map(id => {
        const teacher = state.teachers.find(t => t.id === id);
        return teacher ? `${teacher.firstName} ${teacher.lastName}` : null;
      })
      .filter(Boolean)
      .join(', ') || 'Not Assigned';
  };

  // Get class names by IDs
  const getClassNames = (classIds: string[]) => {
    return classIds
      .map(id => {
        const classItem = state.classes.find(c => c.id === id);
        return classItem ? classItem.name : null;
      })
      .filter(Boolean)
      .join(', ') || 'Not Assigned';
  };

  // Get subject type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'elective': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'language': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'practical': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  // Table columns configuration
  const columns: Column<Subject>[] = [
    {
      key: 'subject',
      title: 'Subject Details',
      render: (_, subject) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
              {subject.code}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{subject.name}</div>
            <div className="text-sm text-muted-foreground">
              {subject.code} • Grade {subject.grade}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      title: 'Type & Credits',
      render: (_, subject) => (
        <div className="space-y-1">
          <Badge className={getTypeColor(subject.type)}>
            {subject.type.charAt(0).toUpperCase() + subject.type.slice(1)}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {subject.credits} {subject.credits === 1 ? 'credit' : 'credits'}
          </div>
        </div>
      )
    },
    {
      key: 'marks',
      title: 'Marks Configuration',
      render: (_, subject) => (
        <div className="text-sm">
          <div className="font-medium">Total: {subject.totalMarks}</div>
          <div className="text-muted-foreground">
            Pass: {subject.passingMarks} ({Math.round((subject.passingMarks / subject.totalMarks) * 100)}%)
          </div>
        </div>
      )
    },
    {
      key: 'teachers',
      title: 'Teachers',
      render: (_, subject) => (
        <div className="text-sm">
          <div className="font-medium">{subject.teacherIds.length} assigned</div>
          <div className="text-muted-foreground truncate max-w-[200px]">
            {getTeacherNames(subject.teacherIds)}
          </div>
        </div>
      )
    },
    {
      key: 'classes',
      title: 'Classes',
      render: (_, subject) => (
        <div className="text-sm">
          <div className="font-medium">{subject.classIds.length} classes</div>
          <div className="text-muted-foreground truncate max-w-[150px]">
            {getClassNames(subject.classIds)}
          </div>
        </div>
      )
    }
  ];

  // Filter options for the data table
  const filterOptions = [
    {
      label: 'Grade',
      value: 'grade',
      options: [
        { label: 'Pre-KG', value: 'pre-kg' },
        { label: 'LKG', value: 'lkg' },
        { label: 'UKG', value: 'ukg' },
        { label: 'Grade 1', value: 'grade-1' },
        { label: 'Grade 2', value: 'grade-2' },
        { label: 'Grade 3', value: 'grade-3' },
        { label: 'Grade 4', value: 'grade-4' },
        { label: 'Grade 5', value: 'grade-5' },
        { label: 'Grade 6', value: 'grade-6' },
        { label: 'Grade 7', value: 'grade-7' },
        { label: 'Grade 8', value: 'grade-8' },
        { label: 'Grade 9', value: 'grade-9' },
        { label: 'Grade 10', value: 'grade-10' },
        { label: 'Grade 11', value: 'grade-11' },
        { label: 'Grade 12', value: 'grade-12' }
      ]
    },
    {
      label: 'Subject Type',
      value: 'type',
      options: [
        { label: 'Core Subject', value: 'core' },
        { label: 'Elective Subject', value: 'elective' },
        { label: 'Language', value: 'language' },
        { label: 'Practical/Lab', value: 'practical' }
      ]
    },
    {
      label: 'Credits',
      value: 'credits',
      options: [
        { label: '1 Credit', value: '1' },
        { label: '2 Credits', value: '2' },
        { label: '3 Credits', value: '3' },
        { label: '4 Credits', value: '4' },
        { label: '5+ Credits', value: '5+' }
      ]
    }
  ];

  // Handle form submission
  const handleFormSubmit = async (subjectData: Partial<Subject>): Promise<boolean> => {
    try {
      if (selectedSubject) {
        // Update existing subject
        await updateSubject(selectedSubject.id, subjectData);
        toast({
          title: "Success",
          description: "Subject updated successfully",
        });
      } else {
        // Add new subject
        await addSubject(subjectData as Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Success", 
          description: "Subject added successfully",
        });
      }
      return true;
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: "Error",
        description: "Failed to save subject. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle subject deletion
  const handleDelete = async (subject: Subject) => {
    if (!confirm(`Are you sure you want to delete ${subject.name} (${subject.code})? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteSubject(subject.id);
      toast({
        title: "Success",
        description: "Subject deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle add new subject
  const handleAddNew = () => {
    setSelectedSubject(null);
    setIsFormOpen(true);
  };

  // Handle edit subject
  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsFormOpen(true);
  };

  // Handle view subject (placeholder for future implementation)
  const handleView = (subject: Subject) => {
    toast({
      title: "View Subject",
      description: `Viewing ${subject.name} (${subject.code}) - Feature coming soon!`,
    });
  };

  // Action buttons for each row
  const renderActions = (subject: Subject) => (
    <div className="flex gap-1">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleView(subject)}
      >
        View
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleEdit(subject)}
      >
        Edit
      </Button>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={() => handleDelete(subject)}
      >
        Delete
      </Button>
    </div>
  );

  // Handle export (placeholder for future implementation)
  const handleExport = () => {
    toast({
      title: "Export Subjects",
      description: "Export functionality coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Subjects Management</h1>
        <p className="text-muted-foreground">
          Manage curriculum subjects, credits, and teacher assignments
        </p>
      </div>

      {/* Subjects Data Table */}
      <DataTable
        data={state.subjects}
        columns={columns}
        title="Subjects List"
        description="Complete list of all curriculum subjects with grading configuration and assignments"
        searchPlaceholder="Search subjects by name, code, or teacher..."
        filters={filterOptions}
        actions={renderActions}
        loading={state.loading.subjects}
        onAdd={handleAddNew}
        addButtonText="Add Subject"
        onExport={handleExport}
        exportButtonText="Export Subjects"
      />

      {/* Subject Form Dialog */}
      <SubjectFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        subject={selectedSubject}
        existingSubjects={state.subjects}
        teachers={state.teachers}
        classes={state.classes}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}