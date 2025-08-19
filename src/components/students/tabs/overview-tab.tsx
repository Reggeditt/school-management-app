'use client';

import { Student } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { formatDate, calculateAge } from '../utils/student-utils';

interface OverviewTabProps {
  student: Student;
}

export function OverviewTab({ student }: OverviewTabProps) {
  const age = calculateAge(student.dateOfBirth);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('user')}
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Full Name</span>
                <p>{student.firstName} {student.lastName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Date of Birth</span>
                <p>{formatDate(student.dateOfBirth)}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Age</span>
                <p>{age} years old</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Gender</span>
                <p className="capitalize">{student.gender}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Blood Group</span>
                <p>{student.bloodGroup || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Religion</span>
                <p>{student.religion || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Nationality</span>
                <p>{student.nationality || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Student ID</span>
                <p>{student.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('phone')}
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Email</span>
                <p>{student.email || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phone</span>
                <p>{student.phone || 'Not provided'}</p>
              </div>
              <Separator />
              <div>
                <span className="font-medium text-muted-foreground">Address</span>
                <p>{student.address || 'Not provided'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent/Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('users')}
              Parent/Guardian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Name</span>
                <p>{student.parentName}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phone</span>
                <p>{student.parentPhone}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Email</span>
                <p>{student.parentEmail || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Occupation</span>
                <p>Not specified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('alert-circle')}
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Name</span>
                <p>{student.emergencyContact || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phone</span>
                <p>{student.emergencyPhone || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Relationship</span>
                <p>Not specified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
