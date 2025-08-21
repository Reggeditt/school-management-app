'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Calendar, Users } from 'lucide-react';

export default function TeacherAssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load teacher's assignments
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-muted-foreground">
            Create and manage assignments for your classes
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Math Assignment #1</CardTitle>
              <Badge variant="outline">Active</Badge>
            </div>
            <CardDescription>
              Class 10A • Due: Dec 15, 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="mr-2 h-4 w-4" />
                Algebra Problems
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                25 students assigned
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                5 submissions received
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add more placeholder cards or real data */}
      </div>

      {/* Empty State */}
      {assignments.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assignments yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first assignment for your classes.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Assignment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}