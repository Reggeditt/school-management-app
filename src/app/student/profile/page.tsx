'use client';

import { useAuth } from '@/contexts/auth-context';
import { useStore } from '@/contexts/store-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
  Heart,
  Edit3,
  Save,
  X
} from 'lucide-react';

export default function StudentProfile() {
  const { user } = useAuth();
  const { state } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<any>({});

  // Find current student data
  const currentStudent = state.students.find(s => s.email === user?.email);
  
  // Get student's class
  const studentClass = state.classes.find(c => 
    currentStudent && c.students.includes(currentStudent.id)
  );

  // Get class teacher
  const classTeacher = studentClass ? state.teachers.find(t => t.id === studentClass.classTeacherId) : null;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({
      phone: currentStudent?.phone || '',
      address: currentStudent?.address || '',
      emergencyContact: currentStudent?.emergencyContact || '',
      emergencyPhone: currentStudent?.emergencyPhone || '',
      bloodGroup: currentStudent?.bloodGroup || '',
    });
  };

  const handleSave = () => {
    // Here you would typically update the student profile
    // For now, just close the edit mode
    setIsEditing(false);
    console.log('Updated profile:', editedProfile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!currentStudent) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Student profile not found. Please contact administration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={currentStudent.profilePicture} alt="Profile" />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-lg">
                    {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold mt-4">
                  {currentStudent.firstName} {currentStudent.lastName}
                </h3>
                <p className="text-gray-500">{currentStudent.email}</p>
                <div className="flex justify-center gap-2 mt-3">
                  <Badge variant="secondary">
                    Student ID: {currentStudent.studentId}
                  </Badge>
                  <Badge variant="outline">
                    Grade {currentStudent.grade}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Class</p>
                    <p className="text-sm text-gray-500">
                      {studentClass ? studentClass.name : 'Not assigned'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Class Teacher</p>
                    <p className="text-sm text-gray-500">
                      {classTeacher ? `${classTeacher.firstName} ${classTeacher.lastName}` : 'Not assigned'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(currentStudent.dateOfBirth)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Blood Group</p>
                    <p className="text-sm text-gray-500">
                      {currentStudent.bloodGroup || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={currentStudent.firstName}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={currentStudent.lastName}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={currentStudent.email || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={isEditing ? editedProfile.phone : (currentStudent.phone || '')}
                    disabled={!isEditing}
                    onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={currentStudent.gender}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={currentStudent.nationality}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={isEditing ? editedProfile.address : (currentStudent.address || '')}
                  disabled={!isEditing}
                  onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parent/Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="parentName">Parent/Guardian Name</Label>
                  <Input
                    id="parentName"
                    value={currentStudent.parentName}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="parentPhone">Parent Phone</Label>
                  <Input
                    id="parentPhone"
                    value={currentStudent.parentPhone}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="parentEmail">Parent Email</Label>
                  <Input
                    id="parentEmail"
                    value={currentStudent.parentEmail || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="parentOccupation">Parent Occupation</Label>
                  <Input
                    id="parentOccupation"
                    value=""
                    disabled
                    placeholder="Not specified"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={isEditing ? editedProfile.emergencyContact : (currentStudent.emergencyContact || '')}
                    disabled={!isEditing}
                    onChange={(e) => setEditedProfile({...editedProfile, emergencyContact: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    value={isEditing ? editedProfile.emergencyPhone : (currentStudent.emergencyPhone || '')}
                    disabled={!isEditing}
                    onChange={(e) => setEditedProfile({...editedProfile, emergencyPhone: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <Input
                    id="rollNumber"
                    value={currentStudent.rollNumber || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={currentStudent.academicYear}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="admissionDate">Admission Date</Label>
                  <Input
                    id="admissionDate"
                    value={formatDate(currentStudent.admissionDate)}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="previousSchool">Previous School</Label>
                  <Input
                    id="previousSchool"
                    value={currentStudent.previousSchool || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Input
                    id="bloodGroup"
                    value={isEditing ? editedProfile.bloodGroup : (currentStudent.bloodGroup || '')}
                    disabled={!isEditing}
                    onChange={(e) => setEditedProfile({...editedProfile, bloodGroup: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Input
                    id="allergies"
                    value=""
                    disabled
                    placeholder="None specified"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Label htmlFor="medicalHistory">Medical Information</Label>
                <Textarea
                  id="medicalHistory"
                  value={currentStudent.medicalInfo || ''}
                  disabled
                  placeholder="No medical information on file"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
