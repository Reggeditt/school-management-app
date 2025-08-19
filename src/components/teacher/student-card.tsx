import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Student } from '@/lib/database-services';
import { Mail, Phone, Eye, Calendar, Award } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  showActions?: boolean;
  showDetails?: boolean;
  className?: string;
  additionalInfo?: React.ReactNode;
  onViewDetails?: (student: Student) => void;
  onEditStudent?: (student: Student) => void;
}

export function StudentCard({ 
  student, 
  showActions = true, 
  showDetails = true,
  className = "",
  additionalInfo,
  onViewDetails,
  onEditStudent
}: StudentCardProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`transition-shadow hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {student.firstName} {student.lastName}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <span>ID: {student.studentId}</span>
              <Badge variant="outline">{student.grade || 'N/A'}</Badge>
            </CardDescription>
          </div>
          {showActions && (
            <div className="flex space-x-2">
              {onViewDetails && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onViewDetails(student)}
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
            {student.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{student.email}</span>
              </div>
            )}
            
            {student.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{student.phone}</span>
              </div>
            )}
            
            {student.dateOfBirth && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(student.dateOfBirth)}</span>
              </div>
            )}
            
            {student.emergencyContact && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">Emergency: {student.emergencyContact}</span>
              </div>
            )}
          </div>
          
          {additionalInfo && (
            <div className="pt-2 border-t">
              {additionalInfo}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
