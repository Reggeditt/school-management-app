'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole } from "@/contexts/auth-context";
import { User } from "@/lib/database-services";
import { Loader2, Mail, User as UserIcon, Shield, Building2, Settings } from "lucide-react";

interface EditUserDialogProps {
  user: User & { name?: string; department?: string };
  onClose: () => void;
  onUserUpdated: (user: User) => void;
}

interface EditFormData {
  email: string;
  name: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  permissions: string[];
}

const allPermissions = {
  manage_users: "Manage Users",
  manage_school: "Manage School Settings",
  view_analytics: "View Analytics",
  manage_data: "Manage Data",
  system_settings: "System Settings",
  view_classes: "View Classes",
  manage_attendance: "Manage Attendance",
  manage_grades: "Manage Grades",
  view_students: "View Students",
  manage_assignments: "Manage Assignments",
  view_grades: "View Grades",
  view_attendance: "View Attendance",
  view_schedule: "View Schedule",
  submit_assignments: "Submit Assignments",
  view_announcements: "View Announcements",
  view_child_grades: "View Child Grades",
  view_child_attendance: "View Child Attendance",
  view_child_schedule: "View Child Schedule",
  communicate_teachers: "Communicate with Teachers",
  view_basic_data: "View Basic Data",
  manage_resources: "Manage Resources",
  view_schedules: "View Schedules"
};

const defaultPermissions = {
  admin: ["manage_users", "manage_school", "view_analytics", "manage_data", "system_settings"],
  teacher: ["view_classes", "manage_attendance", "manage_grades", "view_students", "manage_assignments"],
  student: ["view_grades", "view_attendance", "view_schedule", "submit_assignments", "view_announcements"],
  parent: ["view_child_grades", "view_child_attendance", "view_child_schedule", "communicate_teachers"],
  staff: ["view_basic_data", "manage_resources", "view_schedules"],
  accountant: ["view_basic_data", "manage_fees", "view_financial_reports", "manage_billing", "view_students"],
  hr: ["view_basic_data", "manage_staff", "view_staff", "manage_recruitment", "manage_payroll"]
};

export function EditUserDialog({ user, onClose, onUserUpdated }: EditUserDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    email: user.email,
    name: user.name || "",
    role: user.role as UserRole,
    department: user.department || "",
    isActive: user.isActive,
    permissions: user.permissions || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: defaultPermissions[role] || []
    }));
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Update user via API
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive,
          permissions: formData.permissions,
          profile: {
            name: formData.name,
            department: formData.department,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser: User = {
          ...user,
          email: formData.email,
          role: formData.role as "admin" | "teacher" | "student" | "parent",
          isActive: formData.isActive,
          permissions: formData.permissions,
          updatedAt: new Date()
        };

        onUserUpdated(updatedUser);
        
        toast({
          title: "Success",
          description: "User updated successfully.",
        });
      } else {
        throw new Error(data.message || 'Failed to update user');
      }

    } catch (error) {toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRelevantPermissions = () => {
    const relevantPerms = defaultPermissions[formData.role] || [];
    return Object.entries(allPermissions).filter(([key]) => 
      relevantPerms.includes(key) || formData.permissions.includes(key)
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit User</DialogTitle>
        <DialogDescription>
          Update user information and permissions
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="user@school.edu"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </div>
              </SelectItem>
              <SelectItem value="teacher">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Teacher
                </div>
              </SelectItem>
              <SelectItem value="student">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Student
                </div>
              </SelectItem>
              <SelectItem value="parent">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Parent
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="department"
              placeholder="Mathematics, Grade 10-A, Administration, etc."
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className={`pl-10 ${errors.department ? 'border-destructive' : ''}`}
            />
          </div>
          {errors.department && <p className="text-sm text-destructive">{errors.department}</p>}
        </div>

        {/* Active Status */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <Label>Active Status</Label>
            <p className="text-sm text-muted-foreground">
              Active users can log in and access the system
            </p>
          </div>
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
        </div>

        {/* Permissions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <Label>Permissions</Label>
          </div>
          <div className="p-4 border rounded-lg space-y-3 max-h-48 overflow-y-auto">
            {getRelevantPermissions().map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={formData.permissions.includes(key)}
                  onCheckedChange={(checked) => handlePermissionChange(key, checked as boolean)}
                />
                <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {formData.permissions.length} permissions selected
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update User
          </Button>
        </div>
      </form>
    </>
  );
}
