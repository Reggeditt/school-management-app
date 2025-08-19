'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Student } from '@/lib/database-services';
import { StudentDetailView } from '@/components/students/student-detail-view';
import { Button } from '@/components/ui/button';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, loadStudents, loadClasses, updateStudent, deleteStudent } = useStore();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const studentId = params.id as string;

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load students and classes if not already loaded
        if (state.students.length === 0) {
          await loadStudents();
        }
        if (state.classes.length === 0) {
          await loadClasses();
        }
        
        // Find the specific student
        const foundStudent = state.students.find(s => s.id === studentId);
        
        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          toast({
            title: "Error",
            description: "Student not found",
            variant: "destructive"
          });
          router.push('/admin/students');
        }
      } catch (error) {
        console.error('Error loading student:', error);
        toast({
          title: "Error",
          description: "Failed to load student details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [studentId, state.students, state.classes, loadStudents, loadClasses, toast, router]);

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    router.push(`/admin/students/${studentId}/edit`);
  };

  const handleDelete = async () => {
    if (!student) return;
    
    if (!confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteStudent(student.id);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
      router.push('/admin/students');
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    router.push('/admin/students');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading student details...</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">{getNavigationIcon('alert-circle')}</div>
          <h1 className="text-2xl font-bold">Student Not Found</h1>
          <p className="text-muted-foreground">The student you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/students')}>
            {getNavigationIcon('arrow-left')}
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  return (
    <StudentDetailView
      student={student}
      classes={state.classes}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onClose={handleClose}
    />
  );
}
