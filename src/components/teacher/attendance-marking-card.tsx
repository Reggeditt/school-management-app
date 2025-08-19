import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Save } from 'lucide-react';
import { Student } from '@/lib/database-services';

interface AttendanceRecord {
  studentId: string;
  status: 'present' | 'absent' | 'late';
  note?: string;
}

interface AttendanceMarkingCardProps {
  student: Student;
  attendanceRecord: AttendanceRecord;
  onStatusChange: (studentId: string, status: 'present' | 'absent' | 'late') => void;
  onNoteChange?: (studentId: string, note: string) => void;
  className?: string;
}

export function AttendanceMarkingCard({
  student,
  attendanceRecord,
  onStatusChange,
  onNoteChange,
  className = ""
}: AttendanceMarkingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-50 border-green-200';
      case 'absent': return 'text-red-600 bg-red-50 border-red-200';
      case 'late': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <CheckCircle className="h-4 w-4" />;
      case 'absent': return <XCircle className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`transition-all hover:shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {student.firstName} {student.lastName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              ID: {student.studentId}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={getStatusColor(attendanceRecord.status)}
          >
            <span className="flex items-center space-x-1">
              {getStatusIcon(attendanceRecord.status)}
              <span className="capitalize">{attendanceRecord.status}</span>
            </span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Status Buttons */}
        <div className="flex space-x-2">
          <Button
            variant={attendanceRecord.status === 'present' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(student.id, 'present')}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Present
          </Button>
          
          <Button
            variant={attendanceRecord.status === 'absent' ? 'destructive' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(student.id, 'absent')}
            className="flex-1"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Absent
          </Button>
          
          <Button
            variant={attendanceRecord.status === 'late' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => onStatusChange(student.id, 'late')}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-1" />
            Late
          </Button>
        </div>

        {/* Note Input (if provided) */}
        {onNoteChange && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Note (Optional)</label>
            <textarea
              placeholder="Add a note about this student's attendance..."
              value={attendanceRecord.note || ''}
              onChange={(e) => onNoteChange(student.id, e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none"
              rows={2}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
