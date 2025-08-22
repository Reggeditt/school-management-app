'use client';

import { useState } from 'react';
import { Student, GuardianInfo } from '@/lib/database-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { findStudentSiblings, getSiblingStats } from '@/lib/sibling-service';
import { useStore } from '@/contexts/store-context';
import { GuardianFormDialog } from '../guardian-form-dialog';
import { useToast } from '@/components/ui/use-toast';

interface FamilyTabProps {
  student: Student;
  classes: any[];
}

export function FamilyTab({ student, classes }: FamilyTabProps) {
  const { state, updateStudent } = useStore();
  const { toast } = useToast();
  const [isAddGuardianOpen, setIsAddGuardianOpen] = useState(false);
  
  // Find siblings using the sibling service
  const siblings = findStudentSiblings(student, state.students);
  const siblingStats = getSiblingStats(student, state.students);
  
  // Get emergency contacts from guardians
  const emergencyContacts = student.guardians?.filter(g => g.isEmergencyContact) || [];
  
  const getStudentClass = () => {
    return classes.find(c => c.students.includes(student.id));
  };

  const handleAddGuardian = async (newGuardian: GuardianInfo) => {
    try {
      const currentGuardians = student.guardians || [];
      
      // If this is set as primary, remove primary from others
      if (newGuardian.isPrimary) {
        currentGuardians.forEach(g => g.isPrimary = false);
      }
      
      const updatedGuardians = [...currentGuardians, newGuardian];
      
      await updateStudent(student.id, {
        guardians: updatedGuardians
      });
      
      toast({
        title: "Success",
        description: "Guardian added successfully",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add guardian",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <>
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent/Guardian Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getNavigationIcon('users')}
                Guardians Information
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAddGuardianOpen(true)}
                className="flex items-center gap-2"
              >
                {getNavigationIcon('plus')}
                Add Guardian
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {student.guardians && student.guardians.length > 0 ? (
              student.guardians.map((guardian, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Guardian {index + 1}</span>
                    {guardian.isPrimary && (
                      <Badge variant="default" className="text-xs">Primary</Badge>
                    )}
                    {guardian.isEmergencyContact && (
                      <Badge variant="secondary" className="text-xs">Emergency</Badge>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Name</span>
                    <p className="text-lg">{guardian.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Relationship</span>
                    <p className="capitalize">{guardian.relationship}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="font-medium text-muted-foreground">Phone</span>
                      <p>{guardian.phone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Email</span>
                      <p>{guardian.email || 'Not provided'}</p>
                    </div>
                  </div>
                  {guardian.occupation && (
                    <div>
                      <span className="font-medium text-muted-foreground">Occupation</span>
                      <p>{guardian.occupation}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {getNavigationIcon('phone')}
                      Call
                    </Button>
                    {guardian.email && (
                      <Button size="sm" variant="outline">
                        {getNavigationIcon('mail')}
                        Email
                      </Button>
                    )}
                  </div>
                  {index < student.guardians.length - 1 && <Separator />}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No guardian information available</p>
            )}
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
                      <p className="text-sm text-muted-foreground capitalize">{contact.relationship}</p>
                      <p className="text-sm">{contact.phone}</p>
                      {contact.email && (
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      )}
                      {contact.occupation && (
                        <p className="text-xs text-muted-foreground">Occupation: {contact.occupation}</p>
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getNavigationIcon('users')}
              Siblings at School
            </div>
            {siblings.length > 0 && (
              <Badge variant="secondary">{siblings.length} sibling{siblings.length !== 1 ? 's' : ''}</Badge>
            )}
          </CardTitle>
          {siblings.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {siblingStats.brothers > 0 && `${siblingStats.brothers} brother${siblingStats.brothers !== 1 ? 's' : ''}`}
              {siblingStats.brothers > 0 && siblingStats.sisters > 0 && ' • '}
              {siblingStats.sisters > 0 && `${siblingStats.sisters} sister${siblingStats.sisters !== 1 ? 's' : ''}`}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {siblings.length > 0 ? (
            <div className="space-y-3">
              {siblings.map((sibling, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {`${sibling.firstName} ${sibling.lastName}`.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{sibling.firstName} {sibling.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        Grade {sibling.grade} {sibling.section} • {sibling.relationship}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Shared guardians: {sibling.sharedGuardians.join(', ')}
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
    
    <GuardianFormDialog
      open={isAddGuardianOpen}
      onClose={() => setIsAddGuardianOpen(false)}
      onSubmit={handleAddGuardian}
      existingGuardians={student.guardians || []}
    />
  </>
  );
}
