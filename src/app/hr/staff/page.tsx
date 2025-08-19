'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  contractType: 'permanent' | 'contract' | 'probation' | 'part_time';
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  salary: number;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  qualifications: string[];
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  avatar?: string;
}

interface Department {
  id: string;
  name: string;
  head: string;
  staffCount: number;
}

interface Position {
  id: string;
  title: string;
  department: string;
  level: string;
  description: string;
}

export default function StaffRecords() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all-staff");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // New staff dialog state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: "",
    contractType: "permanent" as const,
    hireDate: "",
    address: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    dateOfBirth: "",
    gender: "male" as const,
    maritalStatus: "single" as const
  });

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStaff: StaffMember[] = [
        {
          id: '1',
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Mensah',
          fullName: 'John Mensah',
          email: 'john.mensah@school.edu',
          phone: '+233 20 123 4567',
          position: 'Mathematics Teacher',
          department: 'Academic',
          hireDate: new Date('2020-01-15'),
          contractType: 'permanent',
          status: 'active',
          salary: 3500,
          address: '123 Accra Street, Kumasi',
          emergencyContact: {
            name: 'Mary Mensah',
            relationship: 'Spouse',
            phone: '+233 20 123 4568'
          },
          qualifications: ['B.Sc Mathematics', 'Dip. Education'],
          dateOfBirth: new Date('1985-05-12'),
          gender: 'male',
          maritalStatus: 'married'
        },
        {
          id: '2',
          employeeId: 'EMP002',
          firstName: 'Mary',
          lastName: 'Asante',
          fullName: 'Mary Asante',
          email: 'mary.asante@school.edu',
          phone: '+233 20 234 5678',
          position: 'English Teacher',
          department: 'Academic',
          hireDate: new Date('2019-09-01'),
          contractType: 'permanent',
          status: 'active',
          salary: 3200,
          address: '456 Tema Avenue, Accra',
          emergencyContact: {
            name: 'James Asante',
            relationship: 'Brother',
            phone: '+233 20 234 5679'
          },
          qualifications: ['B.A English Literature', 'M.Ed Curriculum'],
          dateOfBirth: new Date('1988-03-22'),
          gender: 'female',
          maritalStatus: 'single'
        },
        {
          id: '3',
          employeeId: 'EMP003',
          firstName: 'Daniel',
          lastName: 'Osei',
          fullName: 'Daniel Osei',
          email: 'daniel.osei@school.edu',
          phone: '+233 20 345 6789',
          position: 'School Administrator',
          department: 'Administration',
          hireDate: new Date('2018-03-10'),
          contractType: 'permanent',
          status: 'active',
          salary: 4000,
          address: '789 Cape Coast Road, Takoradi',
          emergencyContact: {
            name: 'Grace Osei',
            relationship: 'Wife',
            phone: '+233 20 345 6780'
          },
          qualifications: ['B.A Administration', 'MBA'],
          dateOfBirth: new Date('1982-11-08'),
          gender: 'male',
          maritalStatus: 'married'
        },
        {
          id: '4',
          employeeId: 'EMP004',
          firstName: 'Grace',
          lastName: 'Adjei',
          fullName: 'Grace Adjei',
          email: 'grace.adjei@school.edu',
          phone: '+233 20 456 7890',
          position: 'Science Teacher',
          department: 'Academic',
          hireDate: new Date('2021-08-01'),
          contractType: 'contract',
          status: 'on_leave',
          salary: 3300,
          address: '321 Ho Street, Volta Region',
          emergencyContact: {
            name: 'Samuel Adjei',
            relationship: 'Father',
            phone: '+233 20 456 7891'
          },
          qualifications: ['B.Sc Biology', 'Dip. Education'],
          dateOfBirth: new Date('1990-07-15'),
          gender: 'female',
          maritalStatus: 'single'
        },
        {
          id: '5',
          employeeId: 'EMP005',
          firstName: 'Samuel',
          lastName: 'Boateng',
          fullName: 'Samuel Boateng',
          email: 'samuel.boateng@school.edu',
          phone: '+233 20 567 8901',
          position: 'Security Officer',
          department: 'Support',
          hireDate: new Date('2024-01-15'),
          contractType: 'probation',
          status: 'active',
          salary: 1800,
          address: '654 Tamale Road, Northern Region',
          emergencyContact: {
            name: 'Akosua Boateng',
            relationship: 'Sister',
            phone: '+233 20 567 8902'
          },
          qualifications: ['Senior High School Certificate'],
          dateOfBirth: new Date('1992-12-03'),
          gender: 'male',
          maritalStatus: 'single'
        }
      ];

      const mockDepartments: Department[] = [
        {
          id: '1',
          name: 'Academic',
          head: 'John Mensah',
          staffCount: 28
        },
        {
          id: '2',
          name: 'Administration',
          head: 'Daniel Osei',
          staffCount: 12
        },
        {
          id: '3',
          name: 'Support',
          head: 'Samuel Boateng',
          staffCount: 8
        }
      ];

      const mockPositions: Position[] = [
        {
          id: '1',
          title: 'Mathematics Teacher',
          department: 'Academic',
          level: 'Senior',
          description: 'Teach mathematics to secondary school students'
        },
        {
          id: '2',
          title: 'English Teacher',
          department: 'Academic',
          level: 'Senior',
          description: 'Teach English language and literature'
        },
        {
          id: '3',
          title: 'School Administrator',
          department: 'Administration',
          level: 'Management',
          description: 'Manage school administrative functions'
        },
        {
          id: '4',
          title: 'Security Officer',
          department: 'Support',
          level: 'Junior',
          description: 'Provide security services for the school'
        }
      ];

      setStaff(mockStaff);
      setDepartments(mockDepartments);
      setPositions(mockPositions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load staff data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    try {
      // Validate required fields
      if (!newStaff.firstName || !newStaff.lastName || !newStaff.email || !newStaff.phone || !newStaff.position || !newStaff.department) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Create new staff member
      const staffMember: StaffMember = {
        id: `staff-${Date.now()}`,
        employeeId: `EMP${String(staff.length + 1).padStart(3, '0')}`,
        firstName: newStaff.firstName,
        lastName: newStaff.lastName,
        fullName: `${newStaff.firstName} ${newStaff.lastName}`,
        email: newStaff.email,
        phone: newStaff.phone,
        position: newStaff.position,
        department: newStaff.department,
        hireDate: new Date(newStaff.hireDate || Date.now()),
        contractType: newStaff.contractType,
        status: 'active',
        salary: parseFloat(newStaff.salary) || 0,
        address: newStaff.address,
        emergencyContact: {
          name: newStaff.emergencyContactName,
          relationship: newStaff.emergencyContactRelationship,
          phone: newStaff.emergencyContactPhone
        },
        qualifications: [],
        dateOfBirth: new Date(newStaff.dateOfBirth || '1990-01-01'),
        gender: newStaff.gender,
        maritalStatus: newStaff.maritalStatus
      };

      setStaff([...staff, staffMember]);

      toast({
        title: "Success",
        description: "Staff member added successfully",
      });

      // Reset form
      setNewStaff({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        salary: "",
        contractType: "permanent",
        hireDate: "",
        address: "",
        emergencyContactName: "",
        emergencyContactRelationship: "",
        emergencyContactPhone: "",
        dateOfBirth: "",
        gender: "male",
        maritalStatus: "single"
      });
      setIsAddStaffOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'terminated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'contract': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'probation': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'part_time': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || member.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Staff Records</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Records</h1>
          <p className="text-muted-foreground">
            Manage employee profiles and records
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            📊 Staff Report
          </Button>
          <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
            <DialogTrigger asChild>
              <Button>👥 Add Staff</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Add a new employee to the staff records
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newStaff.firstName}
                      onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newStaff.lastName}
                      onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={newStaff.phone}
                      onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department *</Label>
                    <Select value={newStaff.department} onValueChange={(value) => setNewStaff({ ...newStaff, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position *</Label>
                    <Select value={newStaff.position} onValueChange={(value) => setNewStaff({ ...newStaff, position: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.title}>{pos.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salary">Salary (GHS)</Label>
                    <Input
                      id="salary"
                      type="number"
                      value={newStaff.salary}
                      onChange={(e) => setNewStaff({ ...newStaff, salary: e.target.value })}
                      placeholder="Enter salary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractType">Contract Type</Label>
                    <Select value={newStaff.contractType} onValueChange={(value: any) => setNewStaff({ ...newStaff, contractType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="probation">Probation</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="hireDate">Hire Date</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={newStaff.hireDate}
                      onChange={(e) => setNewStaff({ ...newStaff, hireDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newStaff.address}
                    onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                    placeholder="Enter home address"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={newStaff.emergencyContactName}
                      onChange={(e) => setNewStaff({ ...newStaff, emergencyContactName: e.target.value })}
                      placeholder="Contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      value={newStaff.emergencyContactRelationship}
                      onChange={(e) => setNewStaff({ ...newStaff, emergencyContactRelationship: e.target.value })}
                      placeholder="Relationship"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      value={newStaff.emergencyContactPhone}
                      onChange={(e) => setNewStaff({ ...newStaff, emergencyContactPhone: e.target.value })}
                      placeholder="Emergency phone"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddStaff} className="flex-1">
                    Add Staff Member
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddStaffOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <div className="text-2xl">👥</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground">
              {staff.filter(s => s.status === 'active').length} active staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <div className="text-2xl">🏢</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              Active departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <div className="text-2xl">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(staff.reduce((sum, s) => sum + s.salary, 0) / staff.length || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly average
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all-staff">All Staff</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="all-staff" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on_leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Staff Table */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>
                Complete list of all staff members and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contract</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.fullName} />
                            <AvatarFallback>
                              {member.firstName[0]}{member.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.fullName}</div>
                            <div className="text-sm text-muted-foreground">{member.employeeId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <Badge className={getContractTypeColor(member.contractType)}>
                          {member.contractType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(member.hireDate)}</TableCell>
                      <TableCell>{formatCurrency(member.salary)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Overview of all school departments and their staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Department Head</TableHead>
                    <TableHead>Staff Count</TableHead>
                    <TableHead>Active Staff</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => {
                    const deptStaff = staff.filter(s => s.department === dept.name);
                    const activeStaff = deptStaff.filter(s => s.status === 'active').length;
                    
                    return (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium">{dept.name}</TableCell>
                        <TableCell>{dept.head}</TableCell>
                        <TableCell>{deptStaff.length}</TableCell>
                        <TableCell>{activeStaff}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              View Staff
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Positions</CardTitle>
              <CardDescription>
                Available positions and their requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Current Staff</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((position) => {
                    const currentStaff = staff.filter(s => s.position === position.title && s.status === 'active').length;
                    
                    return (
                      <TableRow key={position.id}>
                        <TableCell className="font-medium">{position.title}</TableCell>
                        <TableCell>{position.department}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{position.level}</Badge>
                        </TableCell>
                        <TableCell>{currentStaff}</TableCell>
                        <TableCell className="max-w-xs truncate">{position.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
