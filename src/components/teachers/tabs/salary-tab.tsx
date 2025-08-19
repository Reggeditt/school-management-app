'use client';

import { Teacher } from '@/lib/database-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { getSalaryData } from '../data/mock-data';
import { formatCurrency } from '../hooks/utils';
import { DollarSign, TrendingUp, Calendar, FileText, Download, Eye } from 'lucide-react';

interface SalaryTabProps {
  teacher: Teacher;
}

export function SalaryTab({ teacher }: SalaryTabProps) {
  const salaryData = getSalaryData();

  return (
    <div className="space-y-6">
      {/* Salary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gross Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(salaryData.current.grossSalary)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Allowances</p>
                <p className="text-2xl font-bold">{formatCurrency(salaryData.current.totalAllowances)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <p className="text-2xl font-bold">{formatCurrency(salaryData.current.totalDeductions)}</p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(salaryData.current.netSalary)}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Allowances</CardTitle>
            <CardDescription>Additional compensation details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salaryData.breakdown.allowances.map((allowance, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{allowance.name}</p>
                    <p className="text-sm text-muted-foreground">{allowance.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(allowance.amount)}</p>
                    <p className="text-sm text-muted-foreground">{allowance.percentage}%</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total Allowances:</span>
                  <span>{formatCurrency(salaryData.current.totalAllowances)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deductions</CardTitle>
            <CardDescription>Tax and benefit deductions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salaryData.breakdown.deductions.map((deduction, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{deduction.name}</p>
                    <p className="text-sm text-muted-foreground">{deduction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">-{formatCurrency(deduction.amount)}</p>
                    <p className="text-sm text-muted-foreground">{deduction.percentage}%</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total Deductions:</span>
                  <span>-{formatCurrency(salaryData.current.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary History */}
      <Card>
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
          <CardDescription>Monthly salary payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {salaryData.payHistory.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{payment.month} {payment.year}</p>
                    <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                  <p className="font-medium">{formatCurrency(payment.netAmount)}</p>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Pay Stub
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              View Tax Documents
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Payment Schedule
            </Button>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Salary Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
