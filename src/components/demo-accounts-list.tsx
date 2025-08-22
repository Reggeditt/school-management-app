'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const DEMO_ACCOUNTS = [
  // Ghana National School (Active Subscription)
  {
    email: 'admin@gnss.edu.gh',
    password: 'Admin123!',
    role: 'admin',
    name: 'Dr. Kwame Nkrumah',
    description: 'Principal - Ghana National School (Active)',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    school: 'Ghana National School',
    status: 'Active Subscription'
  },
  {
    email: 'teacher@gnss.edu.gh',
    password: 'Teacher123!',
    role: 'teacher',
    name: 'Mrs. Ama Serwaa',
    description: 'Mathematics Teacher - Ghana National',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    school: 'Ghana National School',
    status: 'Active'
  },
  
  // Ashanti Academy (Grace Period)
  {
    email: 'admin@ashantiacademy.edu.gh',
    password: 'Admin123!',
    role: 'admin',
    name: 'Mrs. Yaa Asantewaa',
    description: 'Principal - Ashanti Academy (Grace Period)',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    school: 'Ashanti Academy',
    status: 'Grace Period'
  },
  {
    email: 'teacher@ashantiacademy.edu.gh',
    password: 'Teacher123!',
    role: 'teacher',
    name: 'Mr. Kwaku Ananse',
    description: 'Science Teacher - Ashanti Academy',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
    school: 'Ashanti Academy',
    status: 'Grace Period'
  },
  
  // Volta College (Restricted Access)
  {
    email: 'admin@voltacollege.edu.gh',
    password: 'Admin123!',
    role: 'admin',
    name: 'Mr. Edem Agbodza',
    description: 'Principal - Volta College (Restricted)',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    school: 'Volta College',
    status: 'Subscription Expired'
  },
  
  // Sample Parent and Student Accounts
  {
    email: 'parent@gnss.edu.gh',
    password: 'Parent123!',
    role: 'parent',
    name: 'Mr. Kwame Asante',
    description: 'Parent - Ghana National School',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    school: 'Ghana National School',
    status: 'Parent Portal'
  },
  {
    email: 'accountant@gnss.edu.gh',
    password: 'Account123!',
    role: 'accountant',
    name: 'Mrs. Efua Osei',
    description: 'School Accountant - Ghana National',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    school: 'Ghana National School',
    status: 'Financial Access'
  },
];

export function DemoAccountsList() {
  const [showPasswords, setShowPasswords] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '📋 Copied!',
      description: `${type} copied to clipboard`,
      duration: 2000,
    });
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            🔐 Demo User Accounts
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Test different user roles across 3 Ghanaian schools with varying subscription statuses
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPasswords(!showPasswords)}
          className="flex items-center gap-2"
        >
          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPasswords ? 'Hide' : 'Show'} Passwords
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_ACCOUNTS.map((account, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="secondary" className={account.color}>
                  {account.role.toUpperCase()}
                </Badge>
                {account.status && (
                  <Badge variant="outline" className="text-xs">
                    {account.status}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-sm">{account.name}</CardTitle>
              <CardDescription className="text-xs space-y-1">
                <div>{account.description}</div>
                {account.school && (
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    📍 {account.school}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">
                    Email:
                  </span>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                    {account.email}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(account.email, 'Email')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-12">
                    Pass:
                  </span>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1">
                    {showPasswords ? account.password : '••••••••'}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(account.password, 'Password')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Tip:</strong> Use these accounts to test different user roles and permissions. 
          Admin accounts have full access, teachers can manage their classes, and parents can view their children&apos;s information.
        </p>
      </div>
    </div>
  );
}
