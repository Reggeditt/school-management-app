'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useAuth, UserRole } from "@/contexts/auth-context";
import { User } from "@/lib/database-services";
import { Loader2, Mail, User as UserIcon, Shield, Building2 } from "lucide-react";

interface CreateUserDialogProps {
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

interface UserFormData {
  email: string;
  name: string;
  role: UserRole;
  department: string;
  isActive: boolean;
  permissions: string[];
  password: string;
  confirmPassword: string;
}

const defaultPermissions = {
  admin: ["manage_users", "manage_school", "view_analytics", "manage_data", "system_settings"],
  teacher: ["view_classes", "manage_attendance", "manage_grades", "view_students", "manage_assignments"],
  student: ["view_grades", "view_attendance", "view_schedule", "submit_assignments", "view_announcements"],
  parent: ["view_child_grades", "view_child_attendance", "view_child_schedule", "communicate_teachers"],
  staff: ["view_basic_data", "manage_resources", "view_schedules"]
};

export function CreateUserDialog({ onClose, onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    name: "",
    role: "student",
    department: "",
    isActive: true,
    permissions: defaultPermissions.student,
    password: "",
    confirmPassword: ""
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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Get the school ID from the current user's profile
      const schoolId = currentUser?.profile?.schoolId;
      
      if (!schoolId) {
        toast({
          title: "Error",
          description: "No school ID found. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      // Create user via API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          name: formData.name,
          department: formData.department,
          permissions: formData.permissions,
          isActive: formData.isActive,
          schoolId: schoolId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onUserCreated(data.user);
        
        toast({
          title: "Success",
          description: "User created successfully.",
        });
      } else {
        throw new Error(data.message || 'Failed to create user');
      }

    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Create New User</DialogTitle>
        <DialogDescription>
          Add a new user to the school management system
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

        {/* Password */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
          </div>
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

        {/* Permissions Preview */}
        <div className="space-y-2">
          <Label>Default Permissions</Label>
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground mb-2">
              The following permissions will be assigned to this {formData.role}:
            </p>
            <div className="flex flex-wrap gap-1">
              {formData.permissions.map((permission) => (
                <span
                  key={permission}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-background border"
                >
                  {permission.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create User
          </Button>
        </div>
      </form>
    </>
  );
}
