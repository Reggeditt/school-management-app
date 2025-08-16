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
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  studentId: string;
  class: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  email: string;
}

interface FeeStructure {
  id: string;
  grade: string;
  tuitionFee: number;
  examFee: number;
  sportsFee: number;
  transportFee: number;
  lunchFee: number;
  bookFee: number;
  uniformFee: number;
  totalFee: number;
}

interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'mobile_money' | 'cheque';
  status: 'completed' | 'pending' | 'failed' | 'partial';
  date: Date;
  term: string;
  academicYear: string;
  receiptNumber: string;
  remainingBalance: number;
}

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  totalFees: number;
  paidAmount: number;
  remainingBalance: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  dueDate: Date;
  lastPaymentDate?: Date;
}

export default function FeeManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // New payment dialog state
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'mobile_money' | 'cheque'>('cash');

  useEffect(() => {
    loadFeeData();
  }, []);

  const loadFeeData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockFeeStructures: FeeStructure[] = [
        {
          id: '1',
          grade: 'Grade 7',
          tuitionFee: 800,
          examFee: 100,
          sportsFee: 50,
          transportFee: 200,
          lunchFee: 150,
          bookFee: 120,
          uniformFee: 80,
          totalFee: 1500
        },
        {
          id: '2',
          grade: 'Grade 8',
          tuitionFee: 850,
          examFee: 100,
          sportsFee: 50,
          transportFee: 200,
          lunchFee: 150,
          bookFee: 130,
          uniformFee: 80,
          totalFee: 1560
        },
        {
          id: '3',
          grade: 'Grade 9',
          tuitionFee: 900,
          examFee: 120,
          sportsFee: 50,
          transportFee: 200,
          lunchFee: 150,
          bookFee: 140,
          uniformFee: 80,
          totalFee: 1640
        }
      ];

      const mockFeeRecords: FeeRecord[] = [
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          grade: 'Grade 9',
          totalFees: 1640,
          paidAmount: 1640,
          remainingBalance: 0,
          status: 'paid',
          dueDate: new Date('2024-03-15'),
          lastPaymentDate: new Date('2024-02-28')
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          grade: 'Grade 8',
          totalFees: 1560,
          paidAmount: 1000,
          remainingBalance: 560,
          status: 'partial',
          dueDate: new Date('2024-03-15'),
          lastPaymentDate: new Date('2024-02-15')
        },
        {
          id: '3',
          studentId: 'STU003',
          studentName: 'Mike Johnson',
          grade: 'Grade 7',
          totalFees: 1500,
          paidAmount: 0,
          remainingBalance: 1500,
          status: 'unpaid',
          dueDate: new Date('2024-03-15')
        },
        {
          id: '4',
          studentId: 'STU004',
          studentName: 'Sarah Williams',
          grade: 'Grade 9',
          totalFees: 1640,
          paidAmount: 800,
          remainingBalance: 840,
          status: 'overdue',
          dueDate: new Date('2024-02-15'),
          lastPaymentDate: new Date('2024-01-20')
        }
      ];

      const mockPayments: Payment[] = [
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Doe',
          amount: 1640,
          paymentMethod: 'bank_transfer',
          status: 'completed',
          date: new Date('2024-02-28'),
          term: 'Term 2',
          academicYear: '2023/2024',
          receiptNumber: 'RCP-001-2024',
          remainingBalance: 0
        },
        {
          id: '2',
          studentId: 'STU002',
          studentName: 'Jane Smith',
          amount: 1000,
          paymentMethod: 'mobile_money',
          status: 'completed',
          date: new Date('2024-02-15'),
          term: 'Term 2',
          academicYear: '2023/2024',
          receiptNumber: 'RCP-002-2024',
          remainingBalance: 560
        },
        {
          id: '3',
          studentId: 'STU004',
          studentName: 'Sarah Williams',
          amount: 800,
          paymentMethod: 'cash',
          status: 'completed',
          date: new Date('2024-01-20'),
          term: 'Term 2',
          academicYear: '2023/2024',
          receiptNumber: 'RCP-003-2024',
          remainingBalance: 840
        }
      ];

      const mockStudents: Student[] = [
        {
          id: 'STU001',
          name: 'John Doe',
          studentId: 'STU001',
          class: '9A',
          grade: 'Grade 9',
          parentName: 'Robert Doe',
          parentPhone: '+233 20 123 4567',
          email: 'robert.doe@email.com'
        },
        {
          id: 'STU002',
          name: 'Jane Smith',
          studentId: 'STU002',
          class: '8B',
          grade: 'Grade 8',
          parentName: 'Mary Smith',
          parentPhone: '+233 20 234 5678',
          email: 'mary.smith@email.com'
        },
        {
          id: 'STU003',
          name: 'Mike Johnson',
          studentId: 'STU003',
          class: '7A',
          grade: 'Grade 7',
          parentName: 'David Johnson',
          parentPhone: '+233 20 345 6789',
          email: 'david.johnson@email.com'
        },
        {
          id: 'STU004',
          name: 'Sarah Williams',
          studentId: 'STU004',
          class: '9B',
          grade: 'Grade 9',
          parentName: 'Lisa Williams',
          parentPhone: '+233 20 456 7890',
          email: 'lisa.williams@email.com'
        }
      ];

      setFeeStructures(mockFeeStructures);
      setFeeRecords(mockFeeRecords);
      setPayments(mockPayments);
      setStudents(mockStudents);
    } catch (error) {
      console.error("Error loading fee data:", error);
      toast({
        title: "Error",
        description: "Failed to load fee management data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedStudent || !paymentAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Here you would typically make an API call to record the payment
      const newPayment: Payment = {
        id: `payment-${Date.now()}`,
        studentId: selectedStudent,
        studentName: students.find(s => s.id === selectedStudent)?.name || '',
        amount: parseFloat(paymentAmount),
        paymentMethod,
        status: 'completed',
        date: new Date(),
        term: 'Term 2',
        academicYear: '2023/2024',
        receiptNumber: `RCP-${String(payments.length + 1).padStart(3, '0')}-2024`,
        remainingBalance: 0 // Calculate based on fee record
      };

      setPayments([newPayment, ...payments]);
      
      // Update fee record
      setFeeRecords(prevRecords => 
        prevRecords.map(record => 
          record.studentId === selectedStudent 
            ? {
                ...record,
                paidAmount: record.paidAmount + parseFloat(paymentAmount),
                remainingBalance: Math.max(0, record.remainingBalance - parseFloat(paymentAmount)),
                status: record.remainingBalance - parseFloat(paymentAmount) <= 0 ? 'paid' : 'partial',
                lastPaymentDate: new Date()
              }
            : record
        )
      );

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });

      // Reset form
      setSelectedStudent("");
      setPaymentAmount("");
      setPaymentMethod('cash');
      setIsPaymentDialogOpen(false);
    } catch (error) {
      console.error("Error recording payment:", error);
      toast({
        title: "Error",
        description: "Failed to record payment",
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
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'partial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'unpaid': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const filteredFeeRecords = feeRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = filterGrade === "all" || record.grade === filterGrade;
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const totalCollected = payments.reduce((sum, payment) => 
    payment.status === 'completed' ? sum + payment.amount : sum, 0
  );
  const totalOutstanding = feeRecords.reduce((sum, record) => sum + record.remainingBalance, 0);
  const totalExpected = feeRecords.reduce((sum, record) => sum + record.totalFees, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fee Management</h1>
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
          <h1 className="text-3xl font-bold">Fee Management</h1>
          <p className="text-muted-foreground">
            Manage student fees, payments, and fee structures
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            📊 Fee Report
          </Button>
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button>💰 Record Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>
                  Record a new fee payment for a student
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - {student.studentId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount (GHS)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter payment amount"
                  />
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRecordPayment} className="flex-1">
                    Record Payment
                  </Button>
                  <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
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
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <div className="text-2xl">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCollected)}
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalCollected / totalExpected) * 100).toFixed(1)}% of expected fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
            <div className="text-2xl">⏰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totalOutstanding)}
            </div>
            <p className="text-xs text-muted-foreground">
              {feeRecords.filter(r => r.status !== 'paid').length} students pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <div className="text-2xl">📈</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalCollected / totalExpected) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Fee collection efficiency
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Fee Overview</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="defaulters">Defaulters</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="Grade 7">Grade 7</SelectItem>
                <SelectItem value="Grade 8">Grade 8</SelectItem>
                <SelectItem value="Grade 9">Grade 9</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fee Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Fee Records</CardTitle>
              <CardDescription>
                Overview of all student fee payments and outstanding balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Total Fees</TableHead>
                    <TableHead>Paid Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeeRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{record.studentName}</div>
                          <div className="text-sm text-muted-foreground">{record.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{record.grade}</TableCell>
                      <TableCell>{formatCurrency(record.totalFees)}</TableCell>
                      <TableCell>{formatCurrency(record.paidAmount)}</TableCell>
                      <TableCell className={record.remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}>
                        {formatCurrency(record.remainingBalance)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(record.dueDate)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          {record.remainingBalance > 0 && (
                            <Button size="sm">
                              Pay
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
              <CardDescription>
                History of all fee payments received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt #</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-sm text-muted-foreground">{payment.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell className="capitalize">{payment.paymentMethod.replace('_', ' ')}</TableCell>
                      <TableCell>{formatDate(payment.date)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            📄 Receipt
                          </Button>
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

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
              <CardDescription>
                Current fee structure for all grades and terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Grade</TableHead>
                    <TableHead>Tuition</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Sports</TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead>Lunch</TableHead>
                    <TableHead>Books</TableHead>
                    <TableHead>Uniform</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructures.map((structure) => (
                    <TableRow key={structure.id}>
                      <TableCell className="font-medium">{structure.grade}</TableCell>
                      <TableCell>{formatCurrency(structure.tuitionFee)}</TableCell>
                      <TableCell>{formatCurrency(structure.examFee)}</TableCell>
                      <TableCell>{formatCurrency(structure.sportsFee)}</TableCell>
                      <TableCell>{formatCurrency(structure.transportFee)}</TableCell>
                      <TableCell>{formatCurrency(structure.lunchFee)}</TableCell>
                      <TableCell>{formatCurrency(structure.bookFee)}</TableCell>
                      <TableCell>{formatCurrency(structure.uniformFee)}</TableCell>
                      <TableCell className="font-bold">{formatCurrency(structure.totalFee)}</TableCell>
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

        <TabsContent value="defaulters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Defaulters</CardTitle>
              <CardDescription>
                Students with overdue or outstanding fee payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead>Parent Contact</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeRecords.filter(record => record.status === 'overdue' || record.remainingBalance > 0).map((record) => {
                    const daysOverdue = record.status === 'overdue' 
                      ? Math.floor((new Date().getTime() - record.dueDate.getTime()) / (1000 * 60 * 60 * 24))
                      : 0;
                    const student = students.find(s => s.id === record.studentId);
                    
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{record.studentName}</div>
                            <div className="text-sm text-muted-foreground">{record.studentId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{record.grade}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          {formatCurrency(record.remainingBalance)}
                        </TableCell>
                        <TableCell>
                          {daysOverdue > 0 ? (
                            <Badge variant="destructive">{daysOverdue} days</Badge>
                          ) : (
                            <Badge variant="secondary">Not overdue</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{student?.parentName}</div>
                            <div className="text-muted-foreground">{student?.parentPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              📞 Call
                            </Button>
                            <Button size="sm" variant="outline">
                              📧 Email
                            </Button>
                            <Button size="sm">
                              💰 Pay
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
