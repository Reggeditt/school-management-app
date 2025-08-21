'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BarChart3, Plus } from 'lucide-react';

export default function TeacherGradesPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load teacher's grades data
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Grades & Assessments</h1>
          <p className="text-muted-foreground">
            Manage student grades and assessments for your classes
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Assessment
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Graded</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5%</div>
            <p className="text-xs text-muted-foreground">Class average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Need grading</p>
          </CardContent>
        </Card>
      </div>

      {/* Classes with Grades */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder class cards */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Class 10A - Mathematics</CardTitle>
              <Badge variant="outline">25 Students</Badge>
            </div>
            <CardDescription>
              Recent Assessment: Unit Test 3
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Class Average:</span>
                <span className="font-medium">82.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Highest Score:</span>
                <span className="font-medium">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lowest Score:</span>
                <span className="font-medium">58%</span>
              </div>
              <Button className="w-full mt-4" size="sm">
                View Gradebook
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Class 9B - Mathematics</CardTitle>
              <Badge variant="outline">23 Students</Badge>
            </div>
            <CardDescription>
              Recent Assessment: Quiz 5
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Class Average:</span>
                <span className="font-medium">74.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Highest Score:</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lowest Score:</span>
                <span className="font-medium">45%</span>
              </div>
              <Button className="w-full mt-4" size="sm">
                View Gradebook
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add more placeholder cards as needed */}
      </div>

      {/* Empty State */}
      {grades.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assessments yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start creating assessments and recording grades for your students.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Assessment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}