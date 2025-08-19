'use client';

import { useState } from 'react';
import { Teacher } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Clock, Users, Target } from 'lucide-react';

interface SubjectsTabProps {
  teacher: Teacher;
}

export function SubjectsTab({ teacher }: SubjectsTabProps) {
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [subjectGrade, setSubjectGrade] = useState('');

  const subjectDetails = [
    {
      name: 'Advanced Mathematics',
      grade: '12',
      weeklyHours: 6,
      studentsCount: 28,
      difficulty: 'Advanced',
      description: 'Calculus, Statistics, and Advanced Algebra'
    },
    {
      name: 'Algebra II',
      grade: '11',
      weeklyHours: 5,
      studentsCount: 32,
      difficulty: 'Intermediate',
      description: 'Quadratic equations, polynomials, and rational functions'
    },
    {
      name: 'Geometry',
      grade: '10',
      weeklyHours: 5,
      studentsCount: 30,
      difficulty: 'Intermediate',
      description: 'Shapes, proofs, and spatial reasoning'
    },
    {
      name: 'Pre-Algebra',
      grade: '9',
      weeklyHours: 4,
      studentsCount: 26,
      difficulty: 'Beginner',
      description: 'Foundation mathematics and basic algebraic concepts'
    }
  ];

  const handleAddSubject = () => {
    if (newSubject && subjectGrade) {
      // Logic to add subject would go heresetIsAddSubjectOpen(false);
      setNewSubject('');
      setSubjectGrade('');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Advanced': return 'destructive';
      case 'Intermediate': return 'default';
      case 'Beginner': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Subject Management</h3>
        <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
          <DialogTrigger asChild>
            <Button>Add Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Assign a new subject to {teacher.firstName} {teacher.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input
                  id="subject-name"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Enter subject name"
                />
              </div>
              <div>
                <Label htmlFor="subject-grade">Grade Level</Label>
                <Select value={subjectGrade} onValueChange={setSubjectGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddSubjectOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddSubject}
                  disabled={!newSubject || !subjectGrade}
                >
                  Add Subject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjectDetails.map((subject, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <Badge variant={getDifficultyColor(subject.difficulty)}>
                  {subject.difficulty}
                </Badge>
              </div>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Grade</p>
                      <p className="font-medium">{subject.grade}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Weekly Hours</p>
                      <p className="font-medium">{subject.weeklyHours}h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">{subject.studentsCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Workload</p>
                      <p className="font-medium">
                        {subject.weeklyHours * subject.studentsCount > 150 ? 'High' : 
                         subject.weeklyHours * subject.studentsCount > 100 ? 'Medium' : 'Light'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    View Curriculum
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching Load Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{subjectDetails.length}</p>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {subjectDetails.reduce((sum, subject) => sum + subject.weeklyHours, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Weekly Hours</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {subjectDetails.reduce((sum, subject) => sum + subject.studentsCount, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">4</p>
              <p className="text-sm text-muted-foreground">Grade Levels</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
