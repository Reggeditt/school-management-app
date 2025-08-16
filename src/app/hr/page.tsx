'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface HRMetrics {
  totalStaff: number;
  activeStaff: number;
  newHires: number;
  pendingAppraisals: number;
  leaveRequests: number;
  openPositions: number;
  trainingPrograms: number;
  staffTurnover: number;
}

interface StaffMember {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: Date;
  status: 'active' | 'inactive' | 'on_leave' | 'probation';
  email: string;
  phone: string;
  nextAppraisal?: Date;
}

interface RecentActivity {
  id: string;
  type: 'hire' | 'resignation' | 'promotion' | 'appraisal' | 'training' | 'leave';
  description: string;
  date: Date;
  staffName: string;
  status: 'completed' | 'pending' | 'in_progress';
}

interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  leaveType: 'annual' | 'sick' | 'maternity' | 'emergency' | 'study';
  startDate: Date;
  endDate: Date;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

interface DepartmentStats {
  department: string;
  totalStaff: number;
  averageYears: number;
  openPositions: number;
  recentHires: number;
  turnoverRate: number;
}

export default function HRDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<HRMetrics | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHRData();
  }, []);

  const loadHRData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockMetrics: HRMetrics = {
        totalStaff: 48,
        activeStaff: 45,
        newHires: 3,
        pendingAppraisals: 8,
        leaveRequests: 5,
        openPositions: 2,
        trainingPrograms: 4,
        staffTurnover: 8.5
      };

      const mockStaff: StaffMember[] = [
        {
          id: '1',
          name: 'John Mensah',
          employeeId: 'EMP001',
          position: 'Mathematics Teacher',
          department: 'Academic',
          hireDate: new Date('2020-01-15'),
          status: 'active',
          email: 'john.mensah@school.edu',
          phone: '+233 20 123 4567',
          nextAppraisal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          name: 'Mary Asante',
          employeeId: 'EMP002',
          position: 'English Teacher',
          department: 'Academic',
          hireDate: new Date('2019-09-01'),
          status: 'active',
          email: 'mary.asante@school.edu',
          phone: '+233 20 234 5678',
          nextAppraisal: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
        },
        {
          id: '3',
          name: 'Daniel Osei',
          employeeId: 'EMP003',
          position: 'School Administrator',
          department: 'Administration',
          hireDate: new Date('2018-03-10'),
          status: 'active',
          email: 'daniel.osei@school.edu',
          phone: '+233 20 345 6789'
        },
        {
          id: '4',
          name: 'Grace Adjei',
          employeeId: 'EMP004',
          position: 'Science Teacher',
          department: 'Academic',
          hireDate: new Date('2021-08-01'),
          status: 'on_leave',
          email: 'grace.adjei@school.edu',
          phone: '+233 20 456 7890',
          nextAppraisal: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        },
        {
          id: '5',
          name: 'Samuel Boateng',
          employeeId: 'EMP005',
          position: 'Security Officer',
          department: 'Support',
          hireDate: new Date('2024-01-15'),
          status: 'probation',
          email: 'samuel.boateng@school.edu',
          phone: '+233 20 567 8901',
          nextAppraisal: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        }
      ];

      const mockRecentActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'hire',
          description: 'New hire: Mathematics Teacher',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          staffName: 'Michael Owusu',
          status: 'completed'
        },
        {
          id: '2',
          type: 'appraisal',
          description: 'Performance review completed',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          staffName: 'John Mensah',
          status: 'completed'
        },
        {
          id: '3',
          type: 'promotion',
          description: 'Promoted to Senior Teacher',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          staffName: 'Mary Asante',
          status: 'completed'
        },
        {
          id: '4',
          type: 'training',
          description: 'Enrolled in Digital Teaching Course',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          staffName: 'Grace Adjei',
          status: 'in_progress'
        },
        {
          id: '5',
          type: 'leave',
          description: 'Annual leave approved',
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          staffName: 'Daniel Osei',
          status: 'completed'
        }
      ];

      const mockLeaveRequests: LeaveRequest[] = [
        {
          id: '1',
          staffId: 'EMP006',
          staffName: 'Elizabeth Kwame',
          position: 'Biology Teacher',
          leaveType: 'annual',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          days: 7,
          status: 'pending',
          reason: 'Family vacation'
        },
        {
          id: '2',
          staffId: 'EMP007',
          staffName: 'Peter Agyei',
          position: 'Physics Teacher',
          leaveType: 'sick',
          startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          days: 3,
          status: 'pending',
          reason: 'Medical treatment'
        },
        {
          id: '3',
          staffId: 'EMP008',
          staffName: 'Rose Antwi',
          position: 'Librarian',
          leaveType: 'study',
          startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 37 * 24 * 60 * 60 * 1000),
          days: 7,
          status: 'approved',
          reason: 'Professional development course'
        }
      ];

      const mockDepartmentStats: DepartmentStats[] = [
        {
          department: 'Academic',
          totalStaff: 28,
          averageYears: 4.2,
          openPositions: 1,
          recentHires: 2,
          turnoverRate: 7.1
        },
        {
          department: 'Administration',
          totalStaff: 12,
          averageYears: 6.8,
          openPositions: 1,
          recentHires: 1,
          turnoverRate: 8.3
        },
        {
          department: 'Support',
          totalStaff: 8,
          averageYears: 3.5,
          openPositions: 0,
          recentHires: 0,
          turnoverRate: 12.5
        }
      ];

      setMetrics(mockMetrics);
      setStaff(mockStaff);
      setRecentActivities(mockRecentActivities);
      setLeaveRequests(mockLeaveRequests);
      setDepartmentStats(mockDepartmentStats);
    } catch (error) {
      console.error("Error loading HR data:", error);
      toast({
        title: "Error",
        description: "Failed to load HR dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      case 'probation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'hire': return '🆕';
      case 'resignation': return '👋';
      case 'promotion': return '📈';
      case 'appraisal': return '⭐';
      case 'training': return '🎓';
      case 'leave': return '📅';
      default: return '📋';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'sick': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'maternity': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100';
      case 'emergency': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'study': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
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
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <p className="text-muted-foreground">
            Human resources management and staff analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            📊 HR Report
          </Button>
          <Button>
            👥 Add Staff
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <div className="text-2xl">👥</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                {metrics.activeStaff} active, {metrics.totalStaff - metrics.activeStaff} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Hires</CardTitle>
              <div className="text-2xl">🆕</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.newHires}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Appraisals</CardTitle>
              <div className="text-2xl">⭐</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.pendingAppraisals}</div>
              <p className="text-xs text-muted-foreground">
                Due this quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Turnover</CardTitle>
              <div className="text-2xl">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.staffTurnover}%</div>
              <p className="text-xs text-muted-foreground">
                Annual turnover rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent HR Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent HR Activities</CardTitle>
            <CardDescription>
              Latest staff-related activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.staffName}</span>
                        <Badge className={getStatusColor(activity.status)} size="sm">
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>
              Staff distribution and metrics by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{dept.department}</span>
                    <span className="text-muted-foreground">
                      {dept.totalStaff} staff
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-medium">{dept.averageYears}y</div>
                      <div className="text-muted-foreground">Avg. Tenure</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-medium">{dept.openPositions}</div>
                      <div className="text-muted-foreground">Open Roles</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <div className="font-medium">{dept.turnoverRate}%</div>
                      <div className="text-muted-foreground">Turnover</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="staff" className="space-y-4">
        <TabsList>
          <TabsTrigger value="staff">Staff Overview</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="analytics">HR Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>
                Overview of all staff members and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Appraisal</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{member.position}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>{formatDate(member.hireDate)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {member.nextAppraisal ? formatDate(member.nextAppraisal) : 'Not scheduled'}
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

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>
                Pending and recent leave requests from staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.staffName}</div>
                          <div className="text-sm text-muted-foreground">{request.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLeaveTypeColor(request.leaveType)}>
                          {request.leaveType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(request.startDate)}</TableCell>
                      <TableCell>{formatDate(request.endDate)}</TableCell>
                      <TableCell>{request.days} days</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {request.status === 'pending' && (
                            <>
                              <Button size="sm" variant="outline">
                                ✅ Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                ❌ Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            View
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

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>HR Analytics Summary</CardTitle>
                <CardDescription>
                  Key human resources metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Employee Satisfaction:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={87} className="w-20 h-2" />
                      <span className="text-sm font-medium">87%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Training Completion:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={92} className="w-20 h-2" />
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Appraisal Completion:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-20 h-2" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Retention Rate:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={91} className="w-20 h-2" />
                      <span className="text-sm font-medium">91.5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common HR management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    👥 Add New Employee
                  </Button>
                  <Button variant="outline" className="justify-start">
                    📝 Schedule Appraisal
                  </Button>
                  <Button variant="outline" className="justify-start">
                    🎯 Post Job Opening
                  </Button>
                  <Button variant="outline" className="justify-start">
                    🎓 Create Training Program
                  </Button>
                  <Button variant="outline" className="justify-start">
                    📊 Generate HR Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    📋 Update Policies
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
