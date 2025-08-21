'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Teacher } from '@/lib/database-services';
import { TeacherAccountService, CreateTeacherAccountData } from '@/lib/services/teacher-account-service';
import { DataTable, Column } from '@/components/ui/data-table';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TeacherFormDialog } from '@/components/teachers/teacher-form-dialog';
import { formatDate, getStatusColor } from '@/lib/form-utils';

export default function TeachersPage() {
  const router = useRouter();
  const { 
    state, 
    loadTeachers,
    addTeacher, 
    updateTeacher, 
    deleteTeacher 
  } = useStore();
  const { toast } = useToast();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  // Table columns configuration
  const columns: Column<Teacher>[] = [
    {
      key: 'teacher',
      title: 'Teacher',
      render: (_, teacher) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={teacher.profilePicture} alt={`${teacher.firstName} ${teacher.lastName}`} />
            <AvatarFallback>
              {teacher.firstName[0]}{teacher.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{teacher.firstName} {teacher.lastName}</div>
            <div className="text-sm text-muted-foreground">
              {teacher.teacherId} • {teacher.designation}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'department',
      title: 'Department & Experience',
      render: (_, teacher) => (
        <div>
          <div className="font-medium">{teacher.department}</div>
          <div className="text-sm text-muted-foreground">
            {teacher.experience} years experience
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      title: 'Contact',
      render: (_, teacher) => (
        <div className="text-sm">
          <div>{teacher.email}</div>
          <div className="text-muted-foreground">{teacher.phone}</div>
        </div>
      )
    },
    {
      key: 'qualification',
      title: 'Qualification',
      render: (_, teacher) => (
        <div className="text-sm">
          <div className="font-medium">{teacher.qualification}</div>
          <div className="text-muted-foreground">
            Joined: {formatDate(teacher.joiningDate)}
          </div>
        </div>
      )
    },
    {
      key: 'subjects',
      title: 'Subjects & Classes',
      render: (_, teacher) => (
        <div className="text-sm">
          <div className="font-medium">{teacher.subjects.length} subjects</div>
          <div className="text-muted-foreground">{teacher.classes.length} classes</div>
        </div>
      )
    },
    {
      key: 'salary',
      title: 'Salary',
      render: (_, teacher) => (
        <div className="text-sm font-medium">
          ₹{teacher.salary.toLocaleString()}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (_, teacher) => (
        <Badge className={getStatusColor(teacher.status)}>
          {teacher.status}
        </Badge>
      )
    }
  ];

  // Filter options for the data table
  const filterOptions = [
    {
      label: 'Department',
      value: 'department',
      options: [
        { label: 'Mathematics', value: 'Mathematics' },
        { label: 'Science', value: 'Science' },
        { label: 'English', value: 'English' },
        { label: 'Social Studies', value: 'Social Studies' },
        { label: 'Computer Science', value: 'Computer Science' },
        { label: 'Arts', value: 'Arts' },
        { label: 'Physical Education', value: 'Physical Education' },
        { label: 'Languages', value: 'Languages' }
      ]
    },
    {
      label: 'Designation',
      value: 'designation',
      options: [
        { label: 'Head Teacher', value: 'Head Teacher' },
        { label: 'Senior Teacher', value: 'Senior Teacher' },
        { label: 'Subject Teacher', value: 'Subject Teacher' },
        { label: 'Assistant Teacher', value: 'Assistant Teacher' },
        { label: 'Substitute Teacher', value: 'Substitute Teacher' }
      ]
    },
    {
      label: 'Status',
      value: 'status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Resigned', value: 'resigned' }
      ]
    },
    {
      label: 'Gender',
      value: 'gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
      ]
    }
  ];

  // Handle form submission
  const handleFormSubmit = async (teacherData: Partial<Teacher> & { email?: string; password?: string }): Promise<boolean> => {
    try {
      if (selectedTeacher) {
        // Update existing teacher (no auth changes allowed)
        const { email, password, ...updateData } = teacherData;
        await updateTeacher(selectedTeacher.id, updateData);
        toast({
          title: "Success",
          description: "Teacher updated successfully",
        });
      } else {
        // Add new teacher with authentication
        if (!teacherData.email || !teacherData.password) {
          toast({
            title: "Error",
            description: "Email and password are required for new teachers",
            variant: "destructive",
          });
          return false;
        }

        // Use TeacherAccountService to create complete teacher account
        const { email, password, ...teacherInfo } = teacherData;
        const accountData = {
          email,
          password,
          ...teacherInfo
        } as CreateTeacherAccountData;
        
        await TeacherAccountService.createTeacherAccount(accountData);
        
        // Reload teachers to show the new one
        await loadTeachers();
        
        toast({
          title: "Success", 
          description: "Teacher account created successfully with login credentials",
        });
      }
      return true;
    } catch (error) {
      console.error('Error saving teacher:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save teacher. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle teacher deletion
  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTeacher(teacher.id);
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle add new teacher
  const handleAddNew = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  // Handle edit teacher
  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsFormOpen(true);
  };

  // Handle view teacher
  const handleView = (teacher: Teacher) => {
    router.push(`/admin/teachers/${teacher.id}`);
  };

  // Action buttons for each row
  const renderActions = (teacher: Teacher) => (
    <div className="flex gap-1">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleView(teacher)}
      >
        View
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => handleEdit(teacher)}
      >
        Edit
      </Button>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={() => handleDelete(teacher)}
      >
        Delete
      </Button>
    </div>
  );

  // Handle export (placeholder for future implementation)
  const handleExport = () => {
    toast({
      title: "Export Teachers",
      description: "Export functionality coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Teachers Management</h1>
        <p className="text-muted-foreground">
          Manage teaching staff, qualifications, and assignments
        </p>
      </div>

      {/* Teachers Data Table */}
      <DataTable
        data={state.teachers}
        columns={columns}
        title="Teachers List"
        description="Complete list of all teaching staff with their qualifications and assignments"
        searchPlaceholder="Search teachers by name, ID, email, or department..."
        filters={filterOptions}
        actions={renderActions}
        loading={state.loading.teachers}
        onAdd={handleAddNew}
        addButtonText="Add Teacher"
        onExport={handleExport}
        exportButtonText="Export Teachers"
      />

      {/* Teacher Form Dialog */}
      <TeacherFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        teacher={selectedTeacher}
        existingTeachers={state.teachers}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}