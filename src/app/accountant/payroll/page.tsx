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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Staff {
  id: string;
  name: string;
  employeeId: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  hireDate: Date;
  basicSalary: number;
  allowances: {
    housing: number;
    transport: number;
    meal: number;
    professional: number;
  };
  deductions: {
    tax: number;
    ssnit: number;
    insurance: number;
    loan: number;
  };
  netSalary: number;
}

interface PayrollRecord {
  id: string;
  staffId: string;
  staffName: string;
  position: string;
  month: string;
  year: number;
  basicSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  paymentStatus: 'pending' | 'paid' | 'processing';
  paymentDate?: Date;
  paymentMethod: 'bank_transfer' | 'cash' | 'mobile_money';
}

interface PayrollSummary {
  totalStaff: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  pendingPayments: number;
  completedPayments: number;
  payrollPeriod: string;
}

interface Attendance {
  staffId: string;
  daysWorked: number;
  totalDays: number;
  overtimeHours: number;
  leaveDays: number;
}

export default function PayrollManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [staff, setStaff] = useState<Staff[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Process payroll dialog state
  const [isProcessPayrollOpen, setIsProcessPayrollOpen] = useState(false);
  const [processingPayroll, setProcessingPayroll] = useState(false);

  useEffect(() => {
    loadPayrollData();
  }, [selectedMonth, selectedYear]);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStaff: Staff[] = [
        {
          id: '1',
          name: 'John Mensah',
          employeeId: 'EMP001',
          position: 'Mathematics Teacher',
          department: 'Academic',
          email: 'john.mensah@school.edu',
          phone: '+233 20 123 4567',
          hireDate: new Date('2020-01-15'),
          basicSalary: 3500,
          allowances: {
            housing: 800,
            transport: 300,
            meal: 200,
            professional: 150
          },
          deductions: {
            tax: 520,
            ssnit: 315,
            insurance: 100,
            loan: 0
          },
          netSalary: 3915
        },
        {
          id: '2',
          name: 'Mary Asante',
          employeeId: 'EMP002',
          position: 'English Teacher',
          department: 'Academic',
          email: 'mary.asante@school.edu',
          phone: '+233 20 234 5678',
          hireDate: new Date('2019-09-01'),
          basicSalary: 3200,
          allowances: {
            housing: 700,
            transport: 300,
            meal: 200,
            professional: 150
          },
          deductions: {
            tax: 456,
            ssnit: 288,
            insurance: 100,
            loan: 200
          },
          netSalary: 3506
        },
        {
          id: '3',
          name: 'Daniel Osei',
          employeeId: 'EMP003',
          position: 'School Administrator',
          department: 'Administration',
          email: 'daniel.osei@school.edu',
          phone: '+233 20 345 6789',
          hireDate: new Date('2018-03-10'),
          basicSalary: 4000,
          allowances: {
            housing: 900,
            transport: 400,
            meal: 250,
            professional: 200
          },
          deductions: {
            tax: 675,
            ssnit: 405,
            insurance: 120,
            loan: 300
          },
          netSalary: 4250
        },
        {
          id: '4',
          name: 'Grace Adjei',
          employeeId: 'EMP004',
          position: 'Science Teacher',
          department: 'Academic',
          email: 'grace.adjei@school.edu',
          phone: '+233 20 456 7890',
          hireDate: new Date('2021-08-01'),
          basicSalary: 3300,
          allowances: {
            housing: 750,
            transport: 300,
            meal: 200,
            professional: 150
          },
          deductions: {
            tax: 475,
            ssnit: 297,
            insurance: 100,
            loan: 0
          },
          netSalary: 3628
        },
        {
          id: '5',
          name: 'Samuel Boateng',
          employeeId: 'EMP005',
          position: 'Security Officer',
          department: 'Support',
          email: 'samuel.boateng@school.edu',
          phone: '+233 20 567 8901',
          hireDate: new Date('2022-01-15'),
          basicSalary: 1800,
          allowances: {
            housing: 400,
            transport: 200,
            meal: 150,
            professional: 0
          },
          deductions: {
            tax: 180,
            ssnit: 162,
            insurance: 50,
            loan: 0
          },
          netSalary: 2158
        }
      ];

      const currentMonth = parseInt(selectedMonth);
      const currentYear = parseInt(selectedYear);
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December'];

      const mockPayrollRecords: PayrollRecord[] = mockStaff.map((employee, index) => ({
        id: `payroll-${employee.id}-${currentYear}-${currentMonth}`,
        staffId: employee.id,
        staffName: employee.name,
        position: employee.position,
        month: monthNames[currentMonth],
        year: currentYear,
        basicSalary: employee.basicSalary,
        totalAllowances: Object.values(employee.allowances).reduce((sum, val) => sum + val, 0),
        totalDeductions: Object.values(employee.deductions).reduce((sum, val) => sum + val, 0),
        grossSalary: employee.basicSalary + Object.values(employee.allowances).reduce((sum, val) => sum + val, 0),
        netSalary: employee.netSalary,
        paymentStatus: index < 3 ? 'paid' : 'pending',
        paymentDate: index < 3 ? new Date(currentYear, currentMonth, 28) : undefined,
        paymentMethod: 'bank_transfer'
      }));

      const mockAttendance: Attendance[] = mockStaff.map(employee => ({
        staffId: employee.id,
        daysWorked: Math.floor(Math.random() * 3) + 20, // 20-22 days
        totalDays: 22,
        overtimeHours: Math.floor(Math.random() * 10),
        leaveDays: Math.floor(Math.random() * 3)
      }));

      const summary: PayrollSummary = {
        totalStaff: mockStaff.length,
        totalGrossPay: mockPayrollRecords.reduce((sum, record) => sum + record.grossSalary, 0),
        totalDeductions: mockPayrollRecords.reduce((sum, record) => sum + record.totalDeductions, 0),
        totalNetPay: mockPayrollRecords.reduce((sum, record) => sum + record.netSalary, 0),
        pendingPayments: mockPayrollRecords.filter(record => record.paymentStatus === 'pending').length,
        completedPayments: mockPayrollRecords.filter(record => record.paymentStatus === 'paid').length,
        payrollPeriod: `${monthNames[currentMonth]} ${currentYear}`
      };

      setStaff(mockStaff);
      setPayrollRecords(mockPayrollRecords);
      setPayrollSummary(summary);
      setAttendanceData(mockAttendance);
    } catch (error) {
      console.error("Error loading payroll data:", error);
      toast({
        title: "Error",
        description: "Failed to load payroll data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async () => {
    try {
      setProcessingPayroll(true);
      
      // Simulate payroll processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update payroll records to mark as processing/paid
      setPayrollRecords(prevRecords => 
        prevRecords.map(record => ({
          ...record,
          paymentStatus: 'paid',
          paymentDate: new Date()
        }))
      );

      // Update summary
      if (payrollSummary) {
        setPayrollSummary({
          ...payrollSummary,
          pendingPayments: 0,
          completedPayments: payrollSummary.totalStaff
        });
      }

      toast({
        title: "Success",
        description: "Payroll processed successfully for all staff",
      });

      setIsProcessPayrollOpen(false);
    } catch (error) {
      console.error("Error processing payroll:", error);
      toast({
        title: "Error",
        description: "Failed to process payroll",
        variant: "destructive",
      });
    } finally {
      setProcessingPayroll(false);
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
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const filteredPayrollRecords = payrollRecords.filter(record => {
    const staff_member = staff.find(s => s.id === record.staffId);
    const matchesSearch = record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff_member?.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || staff_member?.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || record.paymentStatus === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Payroll Management</h1>
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
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">
            Manage staff salaries, benefits, and payroll processing
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                <SelectItem key={index} value={index.toString()}>{month}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2023, 2022].map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            📊 Payroll Report
          </Button>
          <Dialog open={isProcessPayrollOpen} onOpenChange={setIsProcessPayrollOpen}>
            <DialogTrigger asChild>
              <Button>💼 Process Payroll</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Monthly Payroll</DialogTitle>
                <DialogDescription>
                  Process payroll for all staff for {payrollSummary?.payrollPeriod}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Staff:</span>
                    <span className="font-medium">{payrollSummary?.totalStaff}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Gross Pay:</span>
                    <span className="font-medium">{formatCurrency(payrollSummary?.totalGrossPay || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Deductions:</span>
                    <span className="font-medium">{formatCurrency(payrollSummary?.totalDeductions || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Net Pay:</span>
                    <span>{formatCurrency(payrollSummary?.totalNetPay || 0)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleProcessPayroll} 
                    className="flex-1"
                    disabled={processingPayroll}
                  >
                    {processingPayroll ? 'Processing...' : 'Process Payroll'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsProcessPayrollOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      {payrollSummary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <div className="text-2xl">👥</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payrollSummary.totalStaff}</div>
              <p className="text-xs text-muted-foreground">
                Active employees on payroll
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
              <div className="text-2xl">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(payrollSummary.totalNetPay)}</div>
              <p className="text-xs text-muted-foreground">
                For {payrollSummary.payrollPeriod}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <div className="text-2xl">⏳</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{payrollSummary.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                Staff awaiting payment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing Rate</CardTitle>
              <div className="text-2xl">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((payrollSummary.completedPayments / payrollSummary.totalStaff) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Payroll completion rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Payroll Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff Salaries</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
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
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payroll Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payroll Records - {payrollSummary?.payrollPeriod}</CardTitle>
              <CardDescription>
                Monthly payroll breakdown for all staff members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayrollRecords.map((record) => {
                    const staff_member = staff.find(s => s.id === record.staffId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.staffName}</div>
                            <div className="text-sm text-muted-foreground">{staff_member?.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{record.position}</TableCell>
                        <TableCell>{formatCurrency(record.basicSalary)}</TableCell>
                        <TableCell>{formatCurrency(record.totalAllowances)}</TableCell>
                        <TableCell>{formatCurrency(record.totalDeductions)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(record.netSalary)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.paymentStatus)}>
                            {record.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            {record.paymentStatus === 'pending' && (
                              <Button size="sm">
                                Pay
                              </Button>
                            )}
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

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Salary Details</CardTitle>
              <CardDescription>
                Detailed salary breakdown for all staff members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Housing</TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>SSNIT</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.employeeId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{formatCurrency(employee.basicSalary)}</TableCell>
                      <TableCell>{formatCurrency(employee.allowances.housing)}</TableCell>
                      <TableCell>{formatCurrency(employee.allowances.transport)}</TableCell>
                      <TableCell>{formatCurrency(employee.deductions.tax)}</TableCell>
                      <TableCell>{formatCurrency(employee.deductions.ssnit)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(employee.netSalary)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Attendance Summary</CardTitle>
              <CardDescription>
                Monthly attendance records for payroll calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Days Worked</TableHead>
                    <TableHead>Total Days</TableHead>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Overtime Hours</TableHead>
                    <TableHead>Leave Days</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((attendance) => {
                    const employee = staff.find(s => s.id === attendance.staffId);
                    const attendancePercentage = (attendance.daysWorked / attendance.totalDays) * 100;
                    
                    return (
                      <TableRow key={attendance.staffId}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee?.name}</div>
                            <div className="text-sm text-muted-foreground">{employee?.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{employee?.department}</TableCell>
                        <TableCell>{attendance.daysWorked}</TableCell>
                        <TableCell>{attendance.totalDays}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={attendancePercentage} className="w-16 h-2" />
                            <span className="text-sm">{attendancePercentage.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{attendance.overtimeHours}h</TableCell>
                        <TableCell>{attendance.leaveDays}</TableCell>
                        <TableCell>
                          <Badge className={
                            attendancePercentage >= 95 ? getStatusColor('paid') :
                            attendancePercentage >= 80 ? getStatusColor('pending') :
                            getStatusColor('processing')
                          }>
                            {attendancePercentage >= 95 ? 'Excellent' :
                             attendancePercentage >= 80 ? 'Good' : 'Poor'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Summary Report</CardTitle>
                <CardDescription>
                  Monthly payroll totals and breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Basic Salaries:</span>
                    <span className="font-medium">
                      {formatCurrency(staff.reduce((sum, emp) => sum + emp.basicSalary, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Allowances:</span>
                    <span className="font-medium">
                      {formatCurrency(staff.reduce((sum, emp) => 
                        sum + Object.values(emp.allowances).reduce((a, b) => a + b, 0), 0
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Deductions:</span>
                    <span className="font-medium">
                      {formatCurrency(staff.reduce((sum, emp) => 
                        sum + Object.values(emp.deductions).reduce((a, b) => a + b, 0), 0
                      ))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                    <span>Total Net Pay:</span>
                    <span>{formatCurrency(staff.reduce((sum, emp) => sum + emp.netSalary, 0))}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common payroll management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    📊 Generate Payslips
                  </Button>
                  <Button variant="outline" className="justify-start">
                    🏦 Export Bank Transfer File
                  </Button>
                  <Button variant="outline" className="justify-start">
                    📄 Tax Deduction Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    🧾 SSNIT Contribution Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    📈 Payroll Analytics
                  </Button>
                  <Button variant="outline" className="justify-start">
                    ⚙️ Salary Structure Setup
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
