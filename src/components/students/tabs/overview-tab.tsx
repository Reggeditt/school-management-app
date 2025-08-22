'use client';

import { Student } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { formatDate, calculateAge } from '../utils/student-utils';
import { findStudentSiblings, getSiblingStats } from '@/lib/sibling-service';
import { useStore } from '@/contexts/store-context';
import { Users } from 'lucide-react';

interface OverviewTabProps {
  student: Student;
}

export function OverviewTab({ student }: OverviewTabProps) {
  const age = calculateAge(student.dateOfBirth);
  const { state } = useStore();
  
  // Find siblings using the sibling service
  const siblings = findStudentSiblings(student, state.students);
  const siblingStats = getSiblingStats(student, state.students);

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
                <p>{student.guardians?.[0]?.name || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phone</span>
                <p>{student.guardians?.[0]?.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Email</span>
                <p>{student.guardians?.[0]?.email || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Occupation</span>
                <p>{student.guardians?.[0]?.occupation || 'Not specified'}</p>
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
                <p>{student.guardians?.find(g => g.isEmergencyContact)?.name || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phone</span>
                <p>{student.guardians?.find(g => g.isEmergencyContact)?.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Relationship</span>
                <p>{student.guardians?.find(g => g.isEmergencyContact)?.relationship || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sibling Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Sibling Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              if (siblings.length === 0) {
                return (
                  <p className="text-muted-foreground italic">No siblings found</p>
                );
              }
              
              return (
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-muted-foreground">Number of Siblings</span>
                    <p>{siblings.length}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Siblings</span>
                    <div className="space-y-1 mt-1">
                      {siblings.map(sibling => (
                        <p key={sibling.id} className="text-sm">
                          {sibling.firstName} {sibling.lastName} (Grade {sibling.grade})
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
