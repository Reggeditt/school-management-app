'use client';

import { Student } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { getStudentActivityLog } from '../data/student-mock-data';
import { formatDate, formatTime } from '../utils/student-utils';

interface ActivityTabProps {
  student: Student;
}

export function ActivityTab({ student }: ActivityTabProps) {
  const activityLog = getStudentActivityLog();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return getNavigationIcon('file');
      case 'attendance':
        return getNavigationIcon('calendar');
      case 'grade':
        return getNavigationIcon('star');
      case 'activity':
        return getNavigationIcon('trophy');
      case 'exam':
        return getNavigationIcon('clipboard');
      case 'project':
        return getNavigationIcon('folder');
      case 'achievement':
        return getNavigationIcon('award');
      case 'ceremony':
        return getNavigationIcon('graduation-cap');
      case 'meeting':
        return getNavigationIcon('users');
      case 'library':
        return getNavigationIcon('book');
      default:
        return getNavigationIcon('activity');
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-100 text-blue-800';
      case 'attendance':
        return 'bg-green-100 text-green-800';
      case 'grade':
        return 'bg-yellow-100 text-yellow-800';
      case 'activity':
        return 'bg-purple-100 text-purple-800';
      case 'exam':
        return 'bg-red-100 text-red-800';
      case 'project':
        return 'bg-indigo-100 text-indigo-800';
      case 'achievement':
        return 'bg-emerald-100 text-emerald-800';
      case 'ceremony':
        return 'bg-orange-100 text-orange-800';
      case 'meeting':
        return 'bg-pink-100 text-pink-800';
      case 'library':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('activity')}
            Recent Activity
          </CardTitle>
          <CardDescription>Timeline of student activities and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLog.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.activity}</p>
                      {activity.details && (
                        <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.date)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 capitalize ${getActivityColor(activity.type)}`}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activityLog.filter(a => a.type === 'assignment').length}
            </div>
            <p className="text-sm text-muted-foreground">Assignments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {activityLog.filter(a => a.type === 'grade').length}
            </div>
            <p className="text-sm text-muted-foreground">Grades Received</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {activityLog.filter(a => a.type === 'activity').length}
            </div>
            <p className="text-sm text-muted-foreground">Activities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {activityLog.filter(a => a.type === 'achievement').length}
            </div>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
