'use client';

import { Student } from '@/lib/database-services';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, calculateAge, getStatusColor } from '@/lib/form-utils';

interface StudentRowProps {
  student: Student;
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentTableRow({ student, onView, onEdit, onDelete }: StudentRowProps) {
  return (
    <>
      {/* Student Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={student.profilePicture} alt={`${student.firstName} ${student.lastName}`} />
            <AvatarFallback>
              {student.firstName[0]}{student.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {student.firstName} {student.lastName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {student.studentId} • Roll: {student.rollNumber}
            </div>
          </div>
        </div>
      </td>

      {/* Grade & Class */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <div className="font-medium">Grade {student.grade}{student.section}</div>
          <div className="text-gray-500 dark:text-gray-400">
            Admitted: {formatDate(student.admissionDate)}
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <div>{student.email}</div>
          <div className="text-gray-500 dark:text-gray-400">{student.phone}</div>
        </div>
      </td>

      {/* Parent Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <div className="font-medium">{student.guardians?.[0]?.name || 'No guardian'}</div>
          <div className="text-gray-500 dark:text-gray-400">{student.guardians?.[0]?.phone || ''}</div>
        </div>
      </td>

      {/* Age & Gender */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <div className="font-medium">{calculateAge(student.dateOfBirth)} years</div>
          <div className="text-gray-500 dark:text-gray-400 capitalize">{student.gender}</div>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge className={getStatusColor(student.status)}>
          {student.status.replace('_', ' ')}
        </Badge>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onView(student)}
          >
            View
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onEdit(student)}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => onDelete(student)}
          >
            Delete
          </Button>
        </div>
      </td>
    </>
  );
}
