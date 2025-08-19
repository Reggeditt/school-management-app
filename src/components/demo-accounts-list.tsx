'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

const DEMO_ACCOUNTS = [
  {
    email: 'admin@stmarysschool.edu.ng',
    password: 'Admin123!',
    role: 'admin',
    name: 'Dr. Adebola Johnson',
    description: 'Principal - Full administrative access',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  },
  {
    email: 'headteacher@stmarysschool.edu.ng',
    password: 'Teacher123!',
    role: 'admin',
    name: 'Mrs. Grace Okafor',
    description: 'Head Teacher - Administrative access',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
  },
  {
    email: 'j.adebayo@stmarysschool.edu.ng',
    password: 'Teacher123!',
    role: 'teacher',
    name: 'John Adebayo',
    description: 'Mathematics Teacher',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  },
  {
    email: 's.okonkwo@stmarysschool.edu.ng',
    password: 'Teacher123!',
    role: 'teacher',
    name: 'Sarah Okonkwo',
    description: 'English Teacher',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  },
  {
    email: 'student@stmarysschool.edu.ng',
    password: 'Student123!',
    role: 'student',
    name: 'Chioma Okwu',
    description: 'Student Account',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
  },
  {
    email: 'parent1@gmail.com',
    password: 'Parent123!',
    role: 'parent',
    name: 'Mr. Emmanuel Adebayo',
    description: 'Parent Account',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
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
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          🔐 Demo User Accounts
        </h3>
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
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={account.color}>
                  {account.role.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-sm">{account.name}</CardTitle>
              <CardDescription className="text-xs">
                {account.description}
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
