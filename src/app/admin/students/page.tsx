'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Student } from '@/lib/database-services';
import { DataTable } from '@/components/navigation/data-table';
import { StatusBadge } from '@/components/navigation/data-table';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StudentFormDialog } from '@/components/students/student-form-dialog';
import { BulkUploadDialog } from '@/components/bulk-upload/bulk-upload-dialog';
import { ExportDialog } from '@/components/export/export-dialog';

export default function StudentsPage() {
  const router = useRouter();
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
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportStudents, setExportStudents] = useState<Student[]>([]);
  const [exportType, setExportType] = useState<'selected' | 'all'>('selected');

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

  // Handle viewing student details
  const handleView = (student: Student) => {
    router.push(`/admin/students/${student.id}`);
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
      key: 'guardians',
      label: 'Primary Guardian',
      render: (value: any, student: Student) => {
        const primaryGuardian = student.guardians?.find(g => g.isPrimary) || student.guardians?.[0];
        return (
          <div className="text-sm">
            <div className="font-medium">{primaryGuardian?.name || 'No guardian'}</div>
            <div className="text-muted-foreground">{primaryGuardian?.phone || 'No phone'}</div>
          </div>
        );
      }
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
      width: '180px',
      render: (value: any, student: Student) => (
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => handleView(student)}
          >
            View
          </Button>
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
    } catch (error) {toast({
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

  // Handle form submission
  const handleFormSubmit = async (studentData: Partial<Student>) => {
    try {
      if (selectedStudent) {
        // Update existing student
        await updateStudent(selectedStudent.id, studentData);
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        // Add new student - ensure required fields are present
        const completeStudentData = {
          ...studentData,
          address: studentData.address || '',
          email: studentData.email || '',
          phone: studentData.phone || '',
          bloodGroup: studentData.bloodGroup || '',
          religion: studentData.religion || '',
          previousSchool: studentData.previousSchool || '',
        } as Omit<Student, "id" | "createdAt" | "updatedAt">;
        
        await addStudent(completeStudentData);
        toast({
          title: "Success",
          description: "Student added successfully",
        });
      }
      setIsFormOpen(false);
      setSelectedStudent(null);
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: selectedStudent ? "Failed to update student" : "Failed to add student",
        variant: "destructive",
      });
      return false;
    }
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
    } catch (error) {toast({
        title: "Error",
        description: "Failed to delete some students. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = (selectedStudents: Student[]) => {
    setExportStudents(selectedStudents);
    setExportType('selected');
    setIsExportDialogOpen(true);
  };

  const handleExportAll = () => {
    setExportStudents(state.students);
    setExportType('all');
    setIsExportDialogOpen(true);
  };

  // Handle bulk upload
  const handleBulkUpload = () => {
    setIsBulkUploadOpen(true);
  };

  const handleBulkImport = async (students: Partial<Student>[]) => {
    try {
      const response = await fetch('/api/bulk-import-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ students }),
      });

      const result = await response.json();

      if (result.success) {
        await loadStudents(); // Refresh the student list
        toast({
          title: "Success",
          description: `Successfully imported ${result.importedCount} students`,
        });
        setIsBulkUploadOpen(false);
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to import students: ${error}`,
        variant: "destructive",
      });
      return false;
    }
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
        searchKeys={['firstName', 'lastName', 'studentId', 'email', 'phone']}
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
              label: "Bulk Upload",
              onClick: handleBulkUpload
            },
            {
              label: "Export All",
              onClick: handleExportAll
            },
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

      {/* Student Form Dialog */}
      <StudentFormDialog
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        classes={state.classes}
        existingStudents={state.students}
        onSubmit={handleFormSubmit}
      />

      {/* Bulk Upload Dialog */}
      <BulkUploadDialog
        open={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        classes={state.classes}
        existingStudents={state.students}
        onBulkImport={handleBulkImport}
      />

      {/* Export Dialog */}
      <ExportDialog
        open={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        students={state.students}
        selectedStudents={exportStudents}
        classes={state.classes}
        exportType={exportType}
      />
    </div>
  );
}