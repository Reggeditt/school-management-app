'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, UserCog, MoreHorizontal, Shield, User, Edit2, Trash2, Lock, Unlock } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/auth-context";
import { User as DatabaseUser } from "@/lib/database-services";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { UserRolePermissions } from "@/components/users/user-role-permissions";

interface ExtendedUser extends DatabaseUser {
  name?: string;
  department?: string;
  lastLoginFormatted?: string;
  statusColor?: string;
}

export default function UsersPage() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, [currentUser?.profile?.schoolId]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
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
      
      // Fetch users from API
      const response = await fetch(`/api/users?schoolId=${schoolId}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        throw new Error(data.message || 'Failed to load users');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => 
        statusFilter === "active" ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;

      // Update user status via API
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !userToUpdate.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state optimistically
        const updatedUsers = users.map(user =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        );
        setUsers(updatedUsers);

        toast({
          title: "Success",
          description: `User ${userToUpdate.isActive ? 'deactivated' : 'activated'} successfully.`,
        });
      } else {
        throw new Error(data.message || 'Failed to update user status');
      }
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const userToDelete = users.find(u => u.id === userId);
      if (!userToDelete) return;

      if (userToDelete.role === 'admin' && users.filter(u => u.role === 'admin' && u.isActive).length <= 1) {
        toast({
          title: "Cannot Delete",
          description: "Cannot delete the last active admin user.",
          variant: "destructive",
        });
        return;
      }

      // Delete user via API
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);

        toast({
          title: "Success",
          description: "User deleted successfully.",
        });
      } else {
        throw new Error(data.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'teacher':
        return <UserCog className="h-4 w-4" />;
      case 'student':
        return <User className="h-4 w-4" />;
      case 'parent':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'teacher':
        return 'default';
      case 'student':
        return 'secondary';
      case 'parent':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
            <p className="text-muted-foreground">Manage app users and their roles</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">
            Manage app users and their roles ({filteredUsers.length} users)
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={permissionsDialogOpen} onOpenChange={setPermissionsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Role Permissions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>User Role Permissions</DialogTitle>
                <DialogDescription>
                  Configure permissions for each user role
                </DialogDescription>
              </DialogHeader>
              <UserRolePermissions />
            </DialogContent>
          </Dialog>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <CreateUserDialog 
                onClose={() => setCreateDialogOpen(false)}
                onUserCreated={(newUser: any) => {
                  setUsers(prev => [...prev, newUser as ExtendedUser]);
                  setCreateDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            List of all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${user.statusColor}`} />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center gap-1 w-fit">
                      {getRoleIcon(user.role)}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLoginFormatted}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {user.permissions.length} permissions
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.isActive ? (
                            <>
                              <Lock className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-destructive"
                          disabled={user.role === 'admin' && users.filter(u => u.role === 'admin' && u.isActive).length <= 1}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No users found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters or search criteria"
                  : "Get started by adding your first user"}
              </p>
              {!searchTerm && roleFilter === "all" && statusFilter === "all" && (
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <EditUserDialog
              user={selectedUser}
              onClose={() => {
                setEditDialogOpen(false);
                setSelectedUser(null);
              }}
              onUserUpdated={(updatedUser: any) => {
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser as ExtendedUser : u));
                setEditDialogOpen(false);
                setSelectedUser(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
