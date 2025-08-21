'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  BookOpen
} from 'lucide-react';

export default function TeacherSchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">
          View your teaching schedule and class timetable
        </p>
      </div>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Your teaching schedule for this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Schedule Coming Soon</h3>
            <p className="text-muted-foreground">
              Your teaching schedule will be displayed here once the timetable system is implemented.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Classes */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Classes</CardTitle>
          <CardDescription>
            Your classes scheduled for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sample schedule items - replace with real data */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">9:00 AM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Mathematics - Grade 10A</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Room 101
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      32 students
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline">
                <BookOpen className="h-3 w-3 mr-1" />
                Algebra
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">11:00 AM</span>
                </div>
                <div>
                  <h4 className="font-semibold">Mathematics - Grade 10B</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Room 102
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      28 students
                    </span>
                  </div>
                </div>
              </div>
              <Badge variant="outline">
                <BookOpen className="h-3 w-3 mr-1" />
                Geometry
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}