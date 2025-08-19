'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { DemoAccountsList } from './demo-accounts-list';

export function DemoSeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [lastSeedResult, setLastSeedResult] = useState<{
    success: boolean;
    schoolId?: string;
    data?: any;
  } | null>(null);
  const { toast } = useToast();

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    
    try {
      const response = await fetch('/api/seed-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLastSeedResult(result);
        toast({
          title: '🎉 Demo Data Seeded Successfully!',
          description: `Created ${result.data.school} with ${result.data.students} students, ${result.data.teachers} teachers, and ${result.data.classes} classes.`,
          duration: 6000,
        });
      } else {
        throw new Error(result.message || 'Failed to seed demo data');
      }
    } catch (error: any) {
      toast({
        title: '❌ Seeding Failed',
        description: error.message || 'An error occurred while seeding demo data',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <Button
        onClick={handleSeedDemo}
        disabled={isSeeding}
        variant="secondary"
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 text-lg py-6 px-8"
      >
        {isSeeding ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Seeding Demo Data...
          </>
        ) : (
          <>
            🌱 Seed Demo Data
          </>
        )}
      </Button>
      
      {lastSeedResult?.success && (
        <>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              School ID: {lastSeedResult.schoolId?.substring(0, 8)}...
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {lastSeedResult.data?.students} Students
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
              {lastSeedResult.data?.teachers} Teachers
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
              {lastSeedResult.data?.classes} Classes
            </Badge>
          </div>
          <DemoAccountsList />
        </>
      )}
    </div>
  );
}
