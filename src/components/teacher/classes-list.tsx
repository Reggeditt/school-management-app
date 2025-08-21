'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeacherClassInfo } from '@/services/teacher.service';
import Link from "next/link";
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface ClassCardProps {
  classInfo: TeacherClassInfo;
  viewMode?: 'grid' | 'list';
}

export function ClassCard({ classInfo, viewMode = 'grid' }: ClassCardProps) {
  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600 bg-green-50';
    if (rate >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 85) return 'text-green-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (viewMode === 'list') {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{classInfo.name}</h3>
                <p className="text-sm text-gray-500">Grade {classInfo.grade} - Section {classInfo.section}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{classInfo.studentsCount}</div>
                <div className="text-xs text-gray-500">Students</div>
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-medium ${getAttendanceColor(classInfo.recentAttendance).split(' ')[0]}`}>
                  {classInfo.recentAttendance}%
                </div>
                <div className="text-xs text-gray-500">Attendance</div>
              </div>
              
              <div className="text-center">
                <div className={`text-sm font-medium ${getGradeColor(classInfo.avgGrade)}`}>
                  {classInfo.avgGrade}%
                </div>
                <div className="text-xs text-gray-500">Avg Grade</div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teacher/classes/${classInfo.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/teacher/analytics?class=${classInfo.id}`}>
                    <BarChart3 className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-gray-900">{classInfo.name}</CardTitle>
            <CardDescription className="text-sm">
              Grade {classInfo.grade} • Section {classInfo.section}
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/teacher/classes/${classInfo.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/teacher/analytics?class=${classInfo.id}`}>
                <BarChart3 className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Students Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Students</span>
          </div>
          <span className="text-sm font-medium">{classInfo.studentsCount}</span>
        </div>

        {/* Next Class */}
        {classInfo.nextClass && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Next Class</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{classInfo.nextClass.day}</div>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {classInfo.nextClass.time}
              </div>
            </div>
          </div>
        )}

        {/* Room */}
        {classInfo.nextClass && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Room</span>
            </div>
            <span className="text-sm font-medium">{classInfo.nextClass.room}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className={`text-lg font-bold ${getAttendanceColor(classInfo.recentAttendance).split(' ')[0]}`}>
              {classInfo.recentAttendance}%
            </div>
            <div className="text-xs text-gray-500">Attendance</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center">
              {classInfo.pendingAssignments > 0 ? (
                <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span className="text-lg font-bold">{classInfo.pendingAssignments}</span>
            </div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
          
          <div className="text-center">
            <div className={`text-lg font-bold ${getGradeColor(classInfo.avgGrade)}`}>
              {classInfo.avgGrade}%
            </div>
            <div className="text-xs text-gray-500">Avg Grade</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/teacher/attendance?class=${classInfo.id}`}>
              Take Attendance
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/teacher/assignments?class=${classInfo.id}`}>
              Assignments
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ClassesListProps {
  classes: TeacherClassInfo[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  emptyMessage?: string;
}

export function ClassesList({ 
  classes, 
  loading = false, 
  viewMode = 'grid',
  emptyMessage = "No classes assigned yet."
}: ClassesListProps) {
  if (loading) {
    return (
      <div className={viewMode === 'grid' ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Classes Found</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={viewMode === 'grid' ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
      {classes.map((classInfo) => (
        <ClassCard 
          key={classInfo.id} 
          classInfo={classInfo} 
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}
