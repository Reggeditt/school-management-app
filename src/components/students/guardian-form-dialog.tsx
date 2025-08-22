'use client';

import { useState } from 'react';
import { GuardianInfo } from '@/lib/database-services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';

interface GuardianFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (guardian: GuardianInfo) => Promise<boolean>;
  existingGuardians: GuardianInfo[];
}

export function GuardianFormDialog({ 
  open, 
  onClose, 
  onSubmit,
  existingGuardians
}: GuardianFormDialogProps) {
  const [loading, setLoading] = useState(false);
  
  const [guardianData, setGuardianData] = useState<GuardianInfo>({
    name: '',
    relationship: 'father',
    phone: '',
    email: '',
    occupation: '',
    workplace: '',
    isPrimary: existingGuardians.length === 0, // First guardian is primary by default
    isEmergencyContact: true,
    canPickup: true,
    hasFinancialResponsibility: false,
  });

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
    setGuardianData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!guardianData.name.trim() || !guardianData.phone.trim() || !guardianData.relationship) {
        throw new Error('Please fill in all required fields');
      }

      // Check for duplicate phone numbers
      const duplicatePhone = existingGuardians.some(g => g.phone === guardianData.phone);
      if (duplicatePhone) {
        throw new Error('A guardian with this phone number already exists');
      }

      const success = await onSubmit(guardianData);
      if (success) {
        // Reset form
        setGuardianData({
          name: '',
          relationship: 'father',
          phone: '',
          email: '',
          occupation: '',
          workplace: '',
          isPrimary: false,
          isEmergencyContact: true,
          canPickup: true,
          hasFinancialResponsibility: false,
        });
        onClose();
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add guardian');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Guardian
          </DialogTitle>
          <DialogDescription>
            Add a new guardian/parent to this student's record
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={guardianData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter guardian name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Select value={guardianData.relationship} onValueChange={(value) => updateField('relationship', value)}>
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
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={guardianData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={guardianData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                value={guardianData.occupation || ''}
                onChange={(e) => updateField('occupation', e.target.value)}
                placeholder="Enter occupation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workplace">Workplace</Label>
              <Input
                id="workplace"
                value={guardianData.workplace || ''}
                onChange={(e) => updateField('workplace', e.target.value)}
                placeholder="Enter workplace"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="primary"
                checked={guardianData.isPrimary}
                onCheckedChange={(checked) => updateField('isPrimary', checked)}
              />
              <Label htmlFor="primary" className="text-sm">
                Primary Guardian
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency"
                checked={guardianData.isEmergencyContact}
                onCheckedChange={(checked) => updateField('isEmergencyContact', checked)}
              />
              <Label htmlFor="emergency" className="text-sm">
                Emergency Contact
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="pickup"
                checked={guardianData.canPickup}
                onCheckedChange={(checked) => updateField('canPickup', checked)}
              />
              <Label htmlFor="pickup" className="text-sm">
                Can Pickup
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="financial"
                checked={guardianData.hasFinancialResponsibility}
                onCheckedChange={(checked) => updateField('hasFinancialResponsibility', checked)}
              />
              <Label htmlFor="financial" className="text-sm">
                Financial Responsibility
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Guardian'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
