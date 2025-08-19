'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Teacher } from '@/lib/database-services';
import { TeacherDetailView } from '@/components/teachers/teacher-detail-view';
import { Button } from '@/components/ui/button';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, loadTeachers, loadClasses, updateTeacher, deleteTeacher } = useStore();
  const { toast } = useToast();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);

  const teacherId = params.id as string;

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load teachers and classes if not already loaded
        if (state.teachers.length === 0) {
          await loadTeachers();
        }
        if (state.classes.length === 0) {
          await loadClasses();
        }
        
        // Find the specific teacher
        const foundTeacher = state.teachers.find(t => t.id === teacherId);
        
        if (foundTeacher) {
          setTeacher(foundTeacher);
        } else {
          toast({
            title: "Error",
            description: "Teacher not found",
            variant: "destructive"
          });
          router.push('/admin/teachers');
        }
      } catch (error) {toast({
          title: "Error",
          description: "Failed to load teacher details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [teacherId, state.teachers, state.classes, loadTeachers, loadClasses, toast, router]);

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    router.push(`/admin/teachers/${teacherId}/edit`);
  };

  const handleDelete = async () => {
    if (!teacher) return;
    
    if (!confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteTeacher(teacher.id);
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
      router.push('/admin/teachers');
    } catch (error) {toast({
        title: "Error",
        description: "Failed to delete teacher",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    router.push('/admin/teachers');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading teacher details...</span>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">{getNavigationIcon('alert-circle')}</div>
          <h1 className="text-2xl font-bold">Teacher Not Found</h1>
          <p className="text-muted-foreground">The teacher you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/teachers')}>
            {getNavigationIcon('arrow-left')}
            Back to Teachers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <TeacherDetailView
      teacher={teacher}
      classes={state.classes}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onClose={handleClose}
    />
  );
}
