'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Class } from '@/lib/database-services';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ClassFormDialog } from '@/components/classes/class-form-dialog';
import { formatDate } from '@/lib/form-utils';

export default function ClassesPage() {
  const { 
    state, 
    loadClasses,
    loadStudents,
    loadTeachers,
    addClass, 
    updateClass, 
    deleteClass 
  } = useStore();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadClasses();
    loadStudents(); // Need for student assignment
    loadTeachers(); // Need for teacher assignment
  }, [loadClasses, loadStudents, loadTeachers]);

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = state.teachers.find(t => t.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Not Assigned';
  };

  // Calculate capacity percentage
  const getCapacityPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  // Get capacity color based on percentage
  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Table columns configuration
  const columns: Column<Class>[] = [
    {
      key: 'class',
      title: 'Class Details',
      render: (_, classItem) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
              {classItem.grade[0]}{classItem.section}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{classItem.name}</div>
            <div className="text-sm text-muted-foreground">
              Grade {classItem.grade} • Section {classItem.section}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'teacher',
      title: 'Class Teacher',
      render: (_, classItem) => (
        <div className="text-sm">
          <div className="font-medium">{getTeacherName(classItem.classTeacherId)}</div>
          <div className="text-muted-foreground">Room {classItem.roomNumber}</div>
        </div>
      )
    },
    {
      key: 'capacity',
      title: 'Student Capacity',
      render: (_, classItem) => {
        const percentage = getCapacityPercentage(classItem.currentStrength, classItem.maxCapacity);
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={getCapacityColor(percentage)}>
                {classItem.currentStrength}/{classItem.maxCapacity}
              </span>
              <span className="text-muted-foreground">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      }
    },
    {
      key: 'subjects',
      title: 'Subjects',
      render: (_, classItem) => (
        <div className="text-sm">
          <div className="font-medium">{classItem.subjects.length} subjects</div>
          <div className="text-muted-foreground">
            Academic Year {classItem.academicYear}
          </div>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, classItem) => {
        const percentage = getCapacityPercentage(classItem.currentStrength, classItem.maxCapacity);
        const status = percentage >= 90 ? 'Full' : percentage >= 75 ? 'Nearly Full' : 'Available';
        const color = percentage >= 90 ? 'bg-red-100 text-red-800' : percentage >= 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
        
        return (
          <Badge className={color}>
            {status}
          </Badge>
        );
      }
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
      label: 'Section',
      value: 'section',
      options: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'D', value: 'D' },
        { label: 'E', value: 'E' },
        { label: 'F', value: 'F' }
      ]
    },
    {
      label: 'Academic Year',
      value: 'academicYear',
      options: [
        { label: '2023-24', value: '2023' },
        { label: '2024-25', value: '2024' },
        { label: '2025-26', value: '2025' },
        { label: '2026-27', value: '2026' }
      ]
    },
    {
      label: 'Capacity Status',
      value: 'capacity',
      options: [
        { label: 'Available (< 75%)', value: 'available' },
        { label: 'Nearly Full (75-89%)', value: 'nearly-full' },
        { label: 'Full (≥ 90%)', value: 'full' }
      ]
    }
  ];

  // Handle form submission
  const handleFormSubmit = async (classData: Partial<Class>): Promise<boolean> => {
    try {
      if (selectedClass) {
        // Update existing class
        await updateClass(selectedClass.id, classData);
        toast({
          title: "Success",
          description: "Class updated successfully",
        });
      } else {
        // Add new class
        await addClass(classData as Omit<Class, 'id' | 'createdAt' | 'updatedAt'>);
        toast({
          title: "Success", 
          description: "Class added successfully",
        });
      }
      return true;
    } catch (error) {
      console.error('Error saving class:', error);
      toast({
        title: "Error",
        description: "Failed to save class. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle class deletion
  const handleDelete = async (classItem: Class) => {
    if (!confirm(`Are you sure you want to delete ${classItem.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteClass(classItem.id);
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error",
        description: "Failed to delete class. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle add new class
  const handleAddNew = () => {
    setSelectedClass(null);
    setIsFormOpen(true);
  };

  // Handle edit class
  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsFormOpen(true);
  };

  // Handle view class (placeholder for future implementation)
  const handleView = (classItem: Class) => {
    toast({
      title: "View Class",
      description: `Viewing ${classItem.name} - Feature coming soon!`,
    });
  };

  // Action buttons for each row
  const renderActions = (classItem: Class) => (
    <div className="flex gap-1">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleView(classItem)}
      >
        View
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleEdit(classItem)}
      >
        Edit
      </Button>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={() => handleDelete(classItem)}
      >
        Delete
      </Button>
    </div>
  );

  // Handle export (placeholder for future implementation)
  const handleExport = () => {
    toast({
      title: "Export Classes",
      description: "Export functionality coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Classes Management</h1>
        <p className="text-muted-foreground">
          Manage school classes, capacity, and teacher assignments
        </p>
      </div>

      {/* Classes Data Table */}
      <DataTable
        data={state.classes}
        columns={columns}
        title="Classes List"
        description="Complete list of all classes with capacity tracking and teacher assignments"
        searchPlaceholder="Search classes by name, grade, section, or teacher..."
        filters={filterOptions}
        actions={renderActions}
        loading={state.loading.classes}
        onAdd={handleAddNew}
        addButtonText="Add Class"
        onExport={handleExport}
        exportButtonText="Export Classes"
      />

      {/* Class Form Dialog */}
      <ClassFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        class={selectedClass}
        existingClasses={state.classes}
        students={state.students}
        teachers={state.teachers}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}