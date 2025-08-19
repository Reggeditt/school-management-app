'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/contexts/store-context';
import { useToast } from '@/components/ui/use-toast';
import { Class } from '@/lib/database-services';
import { ClassDetailView } from '@/components/classes/class-detail-view';
import { Button } from '@/components/ui/button';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';

export default function ClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, loadClasses, loadStudents, loadTeachers, loadSubjects, updateClass, deleteClass } = useStore();
  const { toast } = useToast();
  const [classItem, setClassItem] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);

  const classId = params.id as string;

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load all necessary data if not already loaded
        if (state.classes.length === 0) {
          await loadClasses();
        }
        if (state.students.length === 0) {
          await loadStudents();
        }
        if (state.teachers.length === 0) {
          await loadTeachers();
        }
        if (state.subjects.length === 0) {
          await loadSubjects();
        }
        
        // Find the specific class
        const foundClass = state.classes.find(c => c.id === classId);
        
        if (foundClass) {
          setClassItem(foundClass);
        } else {
          toast({
            title: "Error",
            description: "Class not found",
            variant: "destructive"
          });
          router.push('/admin/classes');
        }
      } catch (error) {
        console.error('Error loading class:', error);
        toast({
          title: "Error",
          description: "Failed to load class details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [classId, state.classes, state.students, state.teachers, state.subjects, loadClasses, loadStudents, loadTeachers, loadSubjects, toast, router]);

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    router.push(`/admin/classes/${classId}/edit`);
  };

  const handleDelete = async () => {
    if (!classItem) return;
    
    if (!confirm(`Are you sure you want to delete ${classItem.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteClass(classItem.id);
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
      router.push('/admin/classes');
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    router.push('/admin/classes');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span>Loading class details...</span>
        </div>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">{getNavigationIcon('alert-circle')}</div>
          <h1 className="text-2xl font-bold">Class Not Found</h1>
          <p className="text-muted-foreground">The class you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/admin/classes')}>
            {getNavigationIcon('arrow-left')}
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ClassDetailView
      classItem={classItem}
      students={state.students}
      teachers={state.teachers}
      subjects={state.subjects}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onClose={handleClose}
    />
  );
}
