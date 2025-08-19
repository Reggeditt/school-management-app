'use client';

import { useState } from 'react';
import { Teacher, Class } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { getTeacherClasses } from '../data/mock-data';

interface ClassesTabProps {
  teacher: Teacher;
  classes: Class[];
}

export function ClassesTab({ teacher, classes }: ClassesTabProps) {
  const [isAssignClassesOpen, setIsAssignClassesOpen] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  
  const teacherClasses = getTeacherClasses();
  const availableClasses = classes.filter(cls => !teacher.classes.includes(cls.id));

  const handleClassSelection = (classId: string, checked: boolean) => {
    if (checked) {
      setSelectedClasses([...selectedClasses, classId]);
    } else {
      setSelectedClasses(selectedClasses.filter(id => id !== classId));
    }
  };

  const handleAssignClasses = () => {
    // Logic to assign classes would go heresetIsAssignClassesOpen(false);
    setSelectedClasses([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Class Management</h3>
        <Dialog open={isAssignClassesOpen} onOpenChange={setIsAssignClassesOpen}>
          <DialogTrigger asChild>
            <Button>Assign Classes</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Classes</DialogTitle>
              <DialogDescription>
                Select classes to assign to {teacher.firstName} {teacher.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {availableClasses.length > 0 ? (
                <div className="space-y-2">
                  {availableClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={cls.id}
                        checked={selectedClasses.includes(cls.id)}
                        onCheckedChange={(checked) => handleClassSelection(cls.id, checked as boolean)}
                      />
                      <label
                        htmlFor={cls.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {cls.name} - Grade {cls.grade}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No available classes to assign</p>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAssignClassesOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAssignClasses}
                  disabled={selectedClasses.length === 0}
                >
                  Assign Classes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teacherClasses.map((cls) => (
          <Card key={cls.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{cls.name}</CardTitle>
                <Badge variant="secondary">Grade {cls.grade}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium">{cls.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="font-medium">{cls.subject}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Room</span>
                  <span className="font-medium">{cls.room}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Schedule</span>
                  <span className="font-medium">{cls.schedule}</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teacherClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No classes assigned to this teacher</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
