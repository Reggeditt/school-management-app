'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Shield, UserCog, User, Users, Settings, Save } from "lucide-react";
import { UserRole } from "@/contexts/auth-context";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RoleConfig {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  permissions: string[];
}

const allPermissions: Permission[] = [
  // User Management
  { id: "manage_users", name: "Manage Users", description: "Create, edit, and delete user accounts", category: "User Management" },
  { id: "view_users", name: "View Users", description: "View user lists and profiles", category: "User Management" },
  { id: "manage_roles", name: "Manage Roles", description: "Assign and modify user roles", category: "User Management" },
  
  // School Management
  { id: "manage_school", name: "Manage School", description: "Edit school settings and information", category: "School Management" },
  { id: "view_analytics", name: "View Analytics", description: "Access reports and analytics", category: "School Management" },
  { id: "manage_data", name: "Manage Data", description: "Import/export school data", category: "School Management" },
  { id: "system_settings", name: "System Settings", description: "Configure system-wide settings", category: "School Management" },
  
  // Academic Management
  { id: "manage_classes", name: "Manage Classes", description: "Create and manage class information", category: "Academic" },
  { id: "view_classes", name: "View Classes", description: "View class lists and details", category: "Academic" },
  { id: "manage_subjects", name: "Manage Subjects", description: "Create and edit subjects", category: "Academic" },
  { id: "manage_timetable", name: "Manage Timetable", description: "Create and modify timetables", category: "Academic" },
  
  // Student Management
  { id: "manage_students", name: "Manage Students", description: "Add, edit, and manage student records", category: "Student Management" },
  { id: "view_students", name: "View Students", description: "View student information and lists", category: "Student Management" },
  { id: "manage_attendance", name: "Manage Attendance", description: "Record and edit attendance", category: "Student Management" },
  { id: "view_attendance", name: "View Attendance", description: "View attendance records", category: "Student Management" },
  
  // Assessment
  { id: "manage_grades", name: "Manage Grades", description: "Enter and edit grades", category: "Assessment" },
  { id: "view_grades", name: "View Grades", description: "View grade information", category: "Assessment" },
  { id: "manage_assignments", name: "Manage Assignments", description: "Create and manage assignments", category: "Assessment" },
  { id: "submit_assignments", name: "Submit Assignments", description: "Submit assignments and coursework", category: "Assessment" },
  { id: "manage_exams", name: "Manage Exams", description: "Create and manage exams", category: "Assessment" },
  
  // Communication
  { id: "send_announcements", name: "Send Announcements", description: "Create and send school announcements", category: "Communication" },
  { id: "view_announcements", name: "View Announcements", description: "View school announcements", category: "Communication" },
  { id: "communicate_teachers", name: "Communicate with Teachers", description: "Message teachers directly", category: "Communication" },
  { id: "communicate_parents", name: "Communicate with Parents", description: "Message parents directly", category: "Communication" },
  
  // Schedule & Resources
  { id: "view_schedule", name: "View Schedule", description: "View class schedules and timetables", category: "Schedule" },
  { id: "manage_resources", name: "Manage Resources", description: "Manage school resources and facilities", category: "Schedule" },
  { id: "view_schedules", name: "View Schedules", description: "View various schedules", category: "Schedule" },
  
  // Parent-specific
  { id: "view_child_grades", name: "View Child Grades", description: "View child's academic performance", category: "Parent Portal" },
  { id: "view_child_attendance", name: "View Child Attendance", description: "View child's attendance records", category: "Parent Portal" },
  { id: "view_child_schedule", name: "View Child Schedule", description: "View child's class schedule", category: "Parent Portal" },
  
  // Basic Access
  { id: "view_basic_data", name: "View Basic Data", description: "View basic school information", category: "Basic Access" },
  { id: "access_dashboard", name: "Access Dashboard", description: "Access role-specific dashboard", category: "Basic Access" },
];

const defaultRoleConfigs: Record<UserRole, RoleConfig> = {
  admin: {
    name: "Administrator",
    description: "Full system access with all administrative privileges",
    icon: <Shield className="h-5 w-5" />,
    color: "bg-red-500",
    permissions: [
      "manage_users", "view_users", "manage_roles", "manage_school", "view_analytics", 
      "manage_data", "system_settings", "manage_classes", "view_classes", "manage_subjects",
      "manage_timetable", "manage_students", "view_students", "manage_attendance", 
      "view_attendance", "manage_grades", "view_grades", "manage_assignments", 
      "manage_exams", "send_announcements", "view_announcements", "communicate_teachers",
      "communicate_parents", "view_schedule", "manage_resources", "access_dashboard"
    ]
  },
  teacher: {
    name: "Teacher",
    description: "Academic and student management capabilities",
    icon: <UserCog className="h-5 w-5" />,
    color: "bg-blue-500",
    permissions: [
      "view_classes", "manage_attendance", "view_attendance", "manage_grades", 
      "view_grades", "view_students", "manage_assignments", "view_schedule",
      "view_announcements", "communicate_parents", "access_dashboard"
    ]
  },
  student: {
    name: "Student",
    description: "Access to personal academic information and resources",
    icon: <User className="h-5 w-5" />,
    color: "bg-green-500",
    permissions: [
      "view_grades", "view_attendance", "view_schedule", "submit_assignments", 
      "view_announcements", "access_dashboard"
    ]
  },
  parent: {
    name: "Parent",
    description: "Access to child's academic progress and school information",
    icon: <Users className="h-5 w-5" />,
    color: "bg-orange-500",
    permissions: [
      "view_child_grades", "view_child_attendance", "view_child_schedule", 
      "communicate_teachers", "view_announcements", "access_dashboard"
    ]
  },
  staff: {
    name: "Staff",
    description: "Basic access to school resources and information",
    icon: <Settings className="h-5 w-5" />,
    color: "bg-purple-500",
    permissions: [
      "view_basic_data", "manage_resources", "view_schedules", "view_announcements", 
      "access_dashboard"
    ]
  }
};

export function UserRolePermissions() {
  const { toast } = useToast();
  const [roleConfigs, setRoleConfigs] = useState<Record<UserRole, RoleConfig>>(defaultRoleConfigs);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePermissionToggle = (role: UserRole, permissionId: string) => {
    setRoleConfigs(prev => {
      const currentPermissions = prev[role].permissions;
      const newPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter(p => p !== permissionId)
        : [...currentPermissions, permissionId];
      
      return {
        ...prev,
        [role]: {
          ...prev[role],
          permissions: newPermissions
        }
      };
    });
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Here you would save the role configurations to your backend/database
      // For now, we'll simulate a save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Role permissions updated successfully.",
      });
    } catch (error) {toast({
        title: "Error",
        description: "Failed to save role permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResetRole = (role: UserRole) => {
    setRoleConfigs(prev => ({
      ...prev,
      [role]: defaultRoleConfigs[role]
    }));
    setHasChanges(true);
  };

  const getPermissionsByCategory = () => {
    const categories: Record<string, Permission[]> = {};
    allPermissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const permissionsByCategory = getPermissionsByCategory();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Role Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Configure what each user role can access and modify
          </p>
        </div>
        {hasChanges && (
          <Button onClick={handleSaveChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      {/* Role Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(roleConfigs).map(([role, config]) => (
          <Card key={role}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${config.color} text-white`}>
                  {config.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{config.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {config.permissions.length} permissions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {config.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleResetRole(role as UserRole)}
              >
                Reset to Default
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Permission Configuration */}
      <Tabs defaultValue="admin" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {Object.entries(roleConfigs).map(([role, config]) => (
            <TabsTrigger key={role} value={role} className="flex items-center gap-2">
              {config.icon}
              <span className="hidden sm:inline">{config.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(roleConfigs).map(([role, config]) => (
          <TabsContent key={role} value={role} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-md ${config.color} text-white`}>
                    {config.icon}
                  </div>
                  <div>
                    <CardTitle>{config.name} Permissions</CardTitle>
                    <CardDescription>
                      {config.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Badge variant="outline">{category}</Badge>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`${role}-${permission.id}`}
                            checked={config.permissions.includes(permission.id)}
                            onCheckedChange={() => handlePermissionToggle(role as UserRole, permission.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`${role}-${permission.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
