'use client';

import { useState } from 'react';
import { Student, Class, GuardianInfo } from '@/lib/database-services';
import { generateStudentId } from '@/lib/form-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
  classes: Class[];
  existingStudents: Student[];
  onSubmit: (data: Partial<Student>) => Promise<boolean>;
}

// Guardian Form Component
interface GuardianFormProps {
  guardian: GuardianInfo;
  index: number;
  onUpdate: (index: number, guardian: GuardianInfo) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

function GuardianForm({ guardian, index, onUpdate, onRemove, canRemove }: GuardianFormProps) {
  const relationshipOptions = [
    { value: 'father', label: 'Father' },
    { value: 'mother', label: 'Mother' },
    { value: 'guardian', label: 'Guardian' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'uncle', label: 'Uncle' },
    { value: 'aunt', label: 'Aunt' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'other', label: 'Other' },
  ];

  const updateField = (field: keyof GuardianInfo, value: any) => {
    onUpdate(index, { ...guardian, [field]: value });
  };

  return (
    <Card className="p-4 space-y-4">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-4 w-4" />
          Guardian {index + 1}
        </CardTitle>
        {canRemove && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-0">
        <div className="space-y-2">
          <Label htmlFor={`guardian-${index}-name`}>Name *</Label>
          <Input
            id={`guardian-${index}-name`}
            value={guardian.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Enter guardian name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`guardian-${index}-relationship`}>Relationship *</Label>
          <Select value={guardian.relationship} onValueChange={(value) => updateField('relationship', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationshipOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`guardian-${index}-phone`}>Phone *</Label>
          <Input
            id={`guardian-${index}-phone`}
            type="tel"
            value={guardian.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`guardian-${index}-email`}>Email</Label>
          <Input
            id={`guardian-${index}-email`}
            type="email"
            value={guardian.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`guardian-${index}-occupation`}>Occupation</Label>
          <Input
            id={`guardian-${index}-occupation`}
            value={guardian.occupation || ''}
            onChange={(e) => updateField('occupation', e.target.value)}
            placeholder="Enter occupation"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`guardian-${index}-workplace`}>Workplace</Label>
          <Input
            id={`guardian-${index}-workplace`}
            value={guardian.workplace || ''}
            onChange={(e) => updateField('workplace', e.target.value)}
            placeholder="Enter workplace"
          />
        </div>

        <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`guardian-${index}-primary`}
              checked={guardian.isPrimary}
              onCheckedChange={(checked) => updateField('isPrimary', checked)}
            />
            <Label htmlFor={`guardian-${index}-primary`} className="text-sm">
              Primary Guardian
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`guardian-${index}-emergency`}
              checked={guardian.isEmergencyContact}
              onCheckedChange={(checked) => updateField('isEmergencyContact', checked)}
            />
            <Label htmlFor={`guardian-${index}-emergency`} className="text-sm">
              Emergency Contact
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`guardian-${index}-pickup`}
              checked={guardian.canPickup}
              onCheckedChange={(checked) => updateField('canPickup', checked)}
            />
            <Label htmlFor={`guardian-${index}-pickup`} className="text-sm">
              Can Pickup
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id={`guardian-${index}-financial`}
              checked={guardian.hasFinancialResponsibility}
              onCheckedChange={(checked) => updateField('hasFinancialResponsibility', checked)}
            />
            <Label htmlFor={`guardian-${index}-financial`} className="text-sm">
              Financial Responsibility
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentFormDialog({ 
  open, 
  onClose, 
  student, 
  classes, 
  existingStudents,
  onSubmit 
}: StudentFormDialogProps) {
  const isEditing = !!student;
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    phone: student?.phone || '',
    dateOfBirth: student?.dateOfBirth?.toISOString().split('T')[0] || '',
    gender: student?.gender || '',
    address: student?.address || '',
    classId: student?.classId || '',
    grade: student?.grade || '',
    section: student?.section || '',
    bloodGroup: student?.bloodGroup || '',
    religion: student?.religion || '',
    nationality: student?.nationality || '',
    previousSchool: student?.previousSchool || ''
  });

  const [guardians, setGuardians] = useState<GuardianInfo[]>(() => {
    // Initialize guardians from existing student or create default guardian
    if (student?.guardians && student.guardians.length > 0) {
      return student.guardians;
    }
    return [{
      name: '',
      relationship: 'father',
      phone: '',
      email: '',
      isPrimary: true,
      isEmergencyContact: true,
      canPickup: true,
      hasFinancialResponsibility: true,
    }];
  });

  const addGuardian = () => {
    setGuardians([...guardians, {
      name: '',
      relationship: 'mother',
      phone: '',
      email: '',
      isPrimary: false,
      isEmergencyContact: true,
      canPickup: true,
      hasFinancialResponsibility: false,
    }]);
  };

  const updateGuardian = (index: number, guardian: GuardianInfo) => {
    const newGuardians = [...guardians];
    newGuardians[index] = guardian;
    
    // Ensure only one primary guardian
    if (guardian.isPrimary) {
      newGuardians.forEach((g, i) => {
        if (i !== index) {
          g.isPrimary = false;
        }
      });
    }
    
    setGuardians(newGuardians);
  };

  const removeGuardian = (index: number) => {
    if (guardians.length > 1) {
      const newGuardians = guardians.filter((_, i) => i !== index);
      
      // If we removed the primary guardian, make the first one primary
      if (guardians[index].isPrimary && newGuardians.length > 0) {
        newGuardians[0].isPrimary = true;
      }
      
      setGuardians(newGuardians);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate guardians
      if (guardians.length === 0) {
        throw new Error('At least one guardian is required');
      }

      // Ensure at least one guardian has required fields
      const hasValidGuardian = guardians.some(g => g.name.trim() && g.phone.trim() && g.relationship);
      if (!hasValidGuardian) {
        throw new Error('At least one guardian must have name, phone, and relationship');
      }

      // Ensure at least one primary guardian
      const hasPrimaryGuardian = guardians.some(g => g.isPrimary);
      if (!hasPrimaryGuardian) {
        guardians[0].isPrimary = true;
      }

      // Prepare student data
      const studentData: Partial<Student> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender as 'male' | 'female' | 'other',
        address: formData.address,
        classId: formData.classId,
        grade: formData.grade,
        section: formData.section,
        bloodGroup: formData.bloodGroup,
        religion: formData.religion,
        nationality: formData.nationality,
        previousSchool: formData.previousSchool,
        guardians: guardians,
        dateOfBirth: new Date(formData.dateOfBirth),
        admissionDate: student?.admissionDate || new Date(),
        studentId: student?.studentId || generateStudentId(existingStudents),
        rollNumber: student?.rollNumber || existingStudents.length + 1,
        status: student?.status || 'active',
        feesPaid: student?.feesPaid || false,
        hostelResident: student?.hostelResident || false,
        transportRequired: student?.transportRequired || false,
        academicYear: '2024-2025'
      };

      const success = await onSubmit(studentData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update student information' : 'Enter student details to create a new record'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder="Enter home address"
                rows={3}
              />
            </div>
          </div>

          {/* Guardian Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Guardian Information</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGuardian}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Guardian
              </Button>
            </div>
            
            <div className="space-y-4">
              {guardians.map((guardian, index) => (
                <GuardianForm
                  key={index}
                  guardian={guardian}
                  index={index}
                  onUpdate={updateGuardian}
                  onRemove={removeGuardian}
                  canRemove={guardians.length > 1}
                />
              ))}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classId">Class *</Label>
                <Select value={formData.classId} onValueChange={(value) => updateFormData('classId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade *</Label>
                <Select value={formData.grade} onValueChange={(value) => updateFormData('grade', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Grade 7</SelectItem>
                    <SelectItem value="8">Grade 8</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section *</Label>
                <Select value={formData.section} onValueChange={(value) => updateFormData('section', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                    <SelectItem value="D">Section D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={formData.bloodGroup} onValueChange={(value) => updateFormData('bloodGroup', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => updateFormData('religion', e.target.value)}
                  placeholder="Enter religion"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => updateFormData('nationality', e.target.value)}
                  placeholder="Enter nationality"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => updateFormData('previousSchool', e.target.value)}
                  placeholder="Enter previous school name"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Student' : 'Add Student')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
