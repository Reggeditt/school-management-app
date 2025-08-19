import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Class } from '@/lib/database-services';
import { Users, Calendar, Clock, BookOpen, BarChart3, Eye } from 'lucide-react';

interface ClassCardProps {
  classItem: Class;
  showActions?: boolean;
  showDetails?: boolean;
  className?: string;
  additionalInfo?: React.ReactNode;
  studentCount?: number;
  onViewDetails?: (classItem: Class) => void;
  onManageClass?: (classItem: Class) => void;
}

export function ClassCard({ 
  classItem, 
  showActions = true, 
  showDetails = true,
  className = "",
  additionalInfo,
  studentCount,
  onViewDetails,
  onManageClass
}: ClassCardProps) {
  const actualStudentCount = studentCount ?? classItem.students?.length ?? 0;

  return (
    <Card className={`transition-shadow hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {classItem.name}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <span>Class ID: {classItem.id}</span>
              <Badge variant="outline">
                {classItem.grade || 'All Grades'}
              </Badge>
            </CardDescription>
          </div>
          {showActions && (
            <div className="flex space-x-2">
              {onViewDetails && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewDetails(classItem)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      
      {showDetails && (
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{actualStudentCount} students</span>
            </div>
            
            {classItem.subjects && classItem.subjects.length > 0 && (
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">
                  {classItem.subjects.slice(0, 2).join(', ')}
                  {classItem.subjects.length > 2 && ` +${classItem.subjects.length - 2}`}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">Schedule Available</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Academic Year 2024</span>
            </div>
          </div>
          
          {additionalInfo && (
            <div className="pt-2 border-t">
              {additionalInfo}
            </div>
          )}
          
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onManageClass?.(classItem)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
