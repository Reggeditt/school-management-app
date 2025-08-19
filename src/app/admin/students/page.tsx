'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Student } from '@/lib/database-services';
import { DataTable } from '@/components/navigation/data-table';
import { StatusBadge } from '@/components/navigation/data-table';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function StudentsPage() {
  const { 
    state, 
    loadStudents, 
    loadClasses,
    addStudent, 
    updateStudent, 
    deleteStudent 
  } = useStore();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadStudents();
    loadClasses();
  }, [loadStudents, loadClasses]);

  // Helper functions
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: Date | string) => {
    const birth = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Table columns configuration
  const columns = [
    {
      key: 'student',
      label: 'Student',
      minWidth: '200px',
      render: (value: any, student: Student) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.profilePicture} alt={`${student.firstName} ${student.lastName}`} />
            <AvatarFallback>
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.firstName} {student.lastName}</div>
            <div className="text-sm text-muted-foreground">
              {student.studentId} • Roll: {student.rollNumber}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'grade',
      label: 'Grade & Section',
      render: (value: any, student: Student) => (
        <div>
          <div className="font-medium">Grade {student.grade}{student.section}</div>
          <div className="text-sm text-muted-foreground">
            Admitted: {formatDate(student.admissionDate)}
          </div>
        </div>
      )
    },
    {
      key: 'email',
      label: 'Contact',
      render: (value: any, student: Student) => (
        <div className="text-sm">
          <div>{student.email || 'No email'}</div>
          <div className="text-muted-foreground">{student.phone || 'No phone'}</div>
        </div>
      )
    },
    {
      key: 'parentName',
      label: 'Parent/Guardian',
      render: (value: any, student: Student) => (
        <div className="text-sm">
          <div className="font-medium">{student.parentName}</div>
          <div className="text-muted-foreground">{student.parentPhone}</div>
        </div>
      )
    },
    {
      key: 'dateOfBirth',
      label: 'Age',
      render: (value: any, student: Student) => (
        <div className="text-sm">
          <div className="font-medium">{calculateAge(student.dateOfBirth)} years</div>
          <div className="text-muted-foreground capitalize">{student.gender}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any, student: Student) => (
        <StatusBadge 
          status={student.status} 
          variant={student.status === 'active' ? 'default' : 'secondary'}
        />
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      width: '120px',
      render: (value: any, student: Student) => (
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleEdit(student)}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => handleDelete(student)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  // Handle student deletion
  const handleDelete = async (student: Student) => {
    if (!confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteStudent(student.id);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle add new student
  const handleAddNew = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  // Handle edit student
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  // Handle bulk actions
  const handleBulkDelete = async (selectedStudents: Student[]) => {
    if (!confirm(`Are you sure you want to delete ${selectedStudents.length} students? This action cannot be undone.`)) {
      return;
    }

    try {
      await Promise.all(selectedStudents.map(student => deleteStudent(student.id)));
      toast({
        title: "Success",
        description: `${selectedStudents.length} students deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting students:', error);
      toast({
        title: "Error",
        description: "Failed to delete some students. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = (selectedStudents: Student[]) => {
    toast({
      title: "Export Students",
      description: `Exporting ${selectedStudents.length} students - Feature coming soon!`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Students Management</h1>
        <p className="text-muted-foreground">
          Manage student records, admissions, and academic information
        </p>
      </div>

      {/* Students Data Table */}
      <DataTable
        data={state.students}
        columns={columns}
        searchable={true}
        searchPlaceholder="Search students by name, ID, email, or phone..."
        searchKeys={['firstName', 'lastName', 'studentId', 'email', 'phone', 'parentName']}
        loading={state.loading.students}
        emptyStateMessage="No students found. Add your first student to get started."
        selectable={true}
        actions={{
          create: {
            label: "Add Student",
            onClick: handleAddNew
          },
          bulk: [
            {
              label: "Delete Selected",
              onClick: handleBulkDelete
            },
            {
              label: "Export Selected", 
              onClick: handleBulkExport
            }
          ]
        }}
      />
    </div>
  );
}