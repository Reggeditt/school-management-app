'use client';

import { Student } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { getStudentSiblings, getStudentEmergencyContacts } from '../data/student-mock-data';

interface FamilyTabProps {
  student: Student;
  classes: any[];
}

export function FamilyTab({ student, classes }: FamilyTabProps) {
  const siblings = getStudentSiblings();
  const emergencyContacts = getStudentEmergencyContacts(student);
  
  const getStudentClass = () => {
    return classes.find(c => c.students.includes(student.id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent/Guardian Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('users')}
              Parent/Guardian Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-muted-foreground">Name</span>
                <p className="text-lg">{student.parentName}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-muted-foreground">Phone</span>
                  <p>{student.parentPhone}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Email</span>
                  <p>{student.parentEmail || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Address</span>
                <p>{student.address}</p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                {getNavigationIcon('phone')}
                Call
              </Button>
              <Button size="sm" variant="outline">
                {getNavigationIcon('mail')}
                Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNavigationIcon('phone')}
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{contact.name}</p>
                        {contact.isPrimary && (
                          <Badge variant="default" className="text-xs">Primary</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      <p className="text-sm">{contact.phone}</p>
                      {contact.email && (
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        {getNavigationIcon('phone')}
                      </Button>
                      {contact.email && (
                        <Button size="sm" variant="ghost">
                          {getNavigationIcon('mail')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Siblings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('users')}
            Siblings at School
          </CardTitle>
        </CardHeader>
        <CardContent>
          {siblings.length > 0 ? (
            <div className="space-y-3">
              {siblings.map((sibling, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {sibling.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sibling.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Grade {sibling.grade}{sibling.section} • {sibling.relationship}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <div className="text-4xl mb-2">{getNavigationIcon('users')}</div>
              <p>No siblings found at this school</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Class Teacher Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getNavigationIcon('graduation-cap')}
            Current Class Teacher
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getStudentClass() ? (
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
              <Avatar className="h-12 w-12">
                <AvatarFallback>CT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">Mrs. Emily Rodriguez</p>
                <p className="text-sm text-muted-foreground">
                  Class Teacher - Grade {getStudentClass()?.grade}{getStudentClass()?.section}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline">
                    {getNavigationIcon('mail')}
                    Contact
                  </Button>
                  <Button size="sm" variant="outline">
                    {getNavigationIcon('calendar')}
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <div className="text-4xl mb-2">{getNavigationIcon('user-x')}</div>
              <p>No class teacher assigned</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
