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

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashFlow: number;
  outstandingFees: number;
  totalAssets: number;
  monthlyGrowth: number;
}

interface RecentTransaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  date: Date;
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

interface BudgetItem {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
}

interface PayrollSummary {
  totalStaff: number;
  totalSalaries: number;
  pendingPayments: number;
  nextPayrollDate: Date;
}

export default function AccountantDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockFinancialSummary: FinancialSummary = {
        totalRevenue: 2850000,
        totalExpenses: 2100000,
        netProfit: 750000,
        cashFlow: 450000,
        outstandingFees: 320000,
        totalAssets: 5200000,
        monthlyGrowth: 12.5
      };

      const mockRecentTransactions: RecentTransaction[] = [
        {
          id: '1',
          type: 'income',
          description: 'School Fees - Grade 9A',
          amount: 45000,
          date: new Date(Date.now() - 2 * 60 * 60 * 1000),
          category: 'Tuition',
          status: 'completed'
        },
        {
          id: '2',
          type: 'expense',
          description: 'Office Supplies Purchase',
          amount: 12500,
          date: new Date(Date.now() - 5 * 60 * 60 * 1000),
          category: 'Supplies',
          status: 'completed'
        },
        {
          id: '3',
          type: 'income',
          description: 'Book Sales Revenue',
          amount: 8750,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          category: 'Books',
          status: 'completed'
        },
        {
          id: '4',
          type: 'expense',
          description: 'Utility Bills - Electricity',
          amount: 35000,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          category: 'Utilities',
          status: 'pending'
        },
        {
          id: '5',
          type: 'income',
          description: 'Government Grant',
          amount: 150000,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          category: 'Grants',
          status: 'completed'
        }
      ];

      const mockBudgetItems: BudgetItem[] = [
        {
          category: 'Staff Salaries',
          budgeted: 800000,
          spent: 750000,
          remaining: 50000,
          percentage: 93.75
        },
        {
          category: 'Utilities',
          budgeted: 150000,
          spent: 125000,
          remaining: 25000,
          percentage: 83.33
        },
        {
          category: 'Supplies',
          budgeted: 100000,
          spent: 65000,
          remaining: 35000,
          percentage: 65
        },
        {
          category: 'Maintenance',
          budgeted: 80000,
          spent: 45000,
          remaining: 35000,
          percentage: 56.25
        },
        {
          category: 'Marketing',
          budgeted: 50000,
          spent: 32000,
          remaining: 18000,
          percentage: 64
        }
      ];

      const mockPayrollSummary: PayrollSummary = {
        totalStaff: 45,
        totalSalaries: 750000,
        pendingPayments: 3,
        nextPayrollDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      };

      setFinancialSummary(mockFinancialSummary);
      setRecentTransactions(mockRecentTransactions);
      setBudgetItems(mockBudgetItems);
      setPayrollSummary(mockPayrollSummary);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
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
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of school finances and accounting metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            📊 Generate Report
          </Button>
          <Button>
            💰 Record Transaction
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      {financialSummary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="text-2xl">📈</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                +{financialSummary.monthlyGrowth}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <div className="text-2xl">📉</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">
                Operating costs this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              <div className="text-2xl">💰</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialSummary.netProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                Revenue minus expenses
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
                {formatCurrency(financialSummary.outstandingFees)}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending payments from students
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest financial activities and transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '📈' : '📉'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{transaction.category}</span>
                        <Badge className={getStatusColor(transaction.status)} size="sm">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>
              Current month budget utilization by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(item.spent)} / {formatCurrency(item.budgeted)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={item.percentage} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.percentage.toFixed(1)}% used</span>
                      <span>{formatCurrency(item.remaining)} remaining</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Summary</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Assets Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Assets Summary</CardTitle>
                <CardDescription>
                  Total school assets and their current values
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Assets</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(financialSummary?.totalAssets || 0)}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cash & Bank</span>
                      <span>{formatCurrency(2100000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equipment</span>
                      <span>{formatCurrency(1800000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Buildings</span>
                      <span>{formatCurrency(1200000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Other Assets</span>
                      <span>{formatCurrency(100000)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common financial tasks and operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    📄 Create Invoice
                  </Button>
                  <Button variant="outline" className="justify-start">
                    💼 Process Payroll
                  </Button>
                  <Button variant="outline" className="justify-start">
                    🧾 Record Expense
                  </Button>
                  <Button variant="outline" className="justify-start">
                    📊 Generate Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    💰 Fee Collection
                  </Button>
                  <Button variant="outline" className="justify-start">
                    📈 Budget Planning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
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
                    Active employees
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Salaries</CardTitle>
                  <div className="text-2xl">💼</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(payrollSummary.totalSalaries)}</div>
                  <p className="text-xs text-muted-foreground">
                    Total monthly payroll
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
                    Awaiting processing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Payroll</CardTitle>
                  <div className="text-2xl">📅</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {payrollSummary.nextPayrollDate.getDate()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {payrollSummary.nextPayrollDate.toLocaleDateString('en-US', { month: 'long' })}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>
                Monthly cash inflow and outflow analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16 text-muted-foreground">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">Cash Flow Charts Coming Soon</h3>
                <p>Interactive cash flow visualization and analytics will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
