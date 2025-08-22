'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, AlertCircle, School, Users, BookOpen } from 'lucide-react';
import { DemoAccountsList } from './demo-accounts-list';

interface SeedingResult {
  success: boolean;
  message: string;
  schoolIds?: {
    ghanaSchoolId: string;
    ashantiSchoolId: string;
    voltaSchoolId: string;
  };
  data?: {
    schools: Array<{
      name: string;
      status: string;
      id: string;
    }>;
    totalFamilies: number;
    totalStudents: number;
    subjectsPerSchool: number;
    usersPerSchool: number;
  };
  error?: string;
}

export function DemoSeedButton() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingResult, setSeedingResult] = useState<SeedingResult | null>(null);
  const [showDetailedResult, setShowDetailedResult] = useState(false);
  const { toast } = useToast();

  const handleSeedDemo = async () => {
    setIsSeeding(true);
    setSeedingResult(null);
    setShowDetailedResult(false);

    try {
      const response = await fetch('/api/seed-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result: SeedingResult = await response.json();
      setSeedingResult(result);

      if (result.success) {
        setShowDetailedResult(true);
        toast({
          title: '🎉 Demo Schools Created Successfully!',
          description: `Created 3 Ghanaian schools with ${result.data?.totalStudents} students across ${result.data?.totalFamilies} families.`,
          duration: 8000,
        });
      } else {
        throw new Error(result.message || 'Failed to seed demo data');
      }
    } catch (error: any) {
      setSeedingResult({
        success: false,
        message: 'Failed to connect to server',
        error: error.message || 'Unknown error',
      });
      setShowDetailedResult(true);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active Subscription</Badge>;
      case 'grace_period':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Grace Period</Badge>;
      case 'restricted':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Subscription Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Demo Button */}
      <div className="text-center">
        <Button
          onClick={handleSeedDemo}
          disabled={isSeeding}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 text-lg py-6 px-8 w-full sm:w-auto"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating Demo Schools...
            </>
          ) : (
            <>
              <Database className="mr-2 h-5 w-5" />
              🌱 Initialize Demo Tour
            </>
          )}
        </Button>
        
        {!showDetailedResult && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
            Creates 3 Ghanaian schools with different subscription statuses, family relationships, and comprehensive demo data
          </p>
        )}
      </div>

      {/* Detailed Results */}
      {showDetailedResult && seedingResult && (
        <Card className={`border-2 ${seedingResult.success 
          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${seedingResult.success 
              ? 'text-green-900 dark:text-green-100' 
              : 'text-red-900 dark:text-red-100'
            }`}>
              {seedingResult.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {seedingResult.success ? 'Demo Schools Created Successfully!' : 'Demo Creation Failed'}
            </CardTitle>
            <CardDescription className={seedingResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
              {seedingResult.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {seedingResult.success && seedingResult.data && (
              <>
                {/* Schools Grid */}
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                    <School className="h-4 w-4" />
                    Demo Schools Created:
                  </h4>
                  <div className="grid gap-3">
                    {seedingResult.data.schools.map((school, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                          <School className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{school.name}</span>
                        </div>
                        {getStatusBadge(school.status)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statistics Grid */}
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Demo Data Summary:
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{seedingResult.data.totalFamilies}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Families</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{seedingResult.data.totalStudents}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Students</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{seedingResult.data.subjectsPerSchool}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Subjects/School</div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-green-200 dark:border-green-800 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{seedingResult.data.usersPerSchool}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Users/School</div>
                    </div>
                  </div>
                </div>

                {/* Demo Accounts */}
                <DemoAccountsList />

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.location.href = '/login'}
                  >
                    Start Demo Tour
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-950"
                    onClick={() => setShowDetailedResult(false)}
                  >
                    Close Details
                  </Button>
                </div>
              </>
            )}

            {!seedingResult.success && (
              <div className="space-y-3">
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {seedingResult.error || 'An unknown error occurred during demo creation.'}
                  </AlertDescription>
                </Alert>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDetailedResult(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
