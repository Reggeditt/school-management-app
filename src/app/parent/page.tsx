'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface Child {
  id: string;
  name: string;
  grade: string;
  section: string;
  class: string;
  studentId: string;
  photo?: string;
}

interface ChildPerformance {
  childId: string;
  overallGrade: string;
  attendanceRate: number;
  upcomingAssignments: number;
  recentGrades: Array<{
    subject: string;
    grade: string;
    assignment: string;
    date: Date;
  }>;
}

interface SchoolEvent {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'event' | 'holiday' | 'exam';
  description: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  color: string;
}

export default function ParentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [children, setChildren] = useState<Child[]>([]);
  const [performance, setPerformance] = useState<ChildPerformance[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockChildren: Child[] = [
        {
          id: '1',
          name: 'Emma Johnson',
          grade: 'Grade 9',
          section: 'A',
          class: 'Grade 9A',
          studentId: 'STU001',
        },
        {
          id: '2',
          name: 'Michael Johnson',
          grade: 'Grade 6',
          section: 'B',
          class: 'Grade 6B',
          studentId: 'STU002',
        }
      ];

      const mockPerformance: ChildPerformance[] = [
        {
          childId: '1',
          overallGrade: 'A-',
          attendanceRate: 94,
          upcomingAssignments: 3,
          recentGrades: [
            {
              subject: 'Mathematics',
              grade: 'A',
              assignment: 'Algebra Test',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
              subject: 'Science',
              grade: 'B+',
              assignment: 'Lab Report',
              date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
            },
            {
              subject: 'English',
              grade: 'A-',
              assignment: 'Essay',
              date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          childId: '2',
          overallGrade: 'B+',
          attendanceRate: 98,
          upcomingAssignments: 2,
          recentGrades: [
            {
              subject: 'Mathematics',
              grade: 'B',
              assignment: 'Fractions Quiz',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
              subject: 'Science',
              grade: 'A',
              assignment: 'Plants Project',
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            }
          ]
        }
      ];

      const mockEvents: SchoolEvent[] = [
        {
          id: '1',
          title: 'Parent-Teacher Conference',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          type: 'meeting',
          description: 'Individual meetings with teachers to discuss student progress'
        },
        {
          id: '2',
          title: 'Science Fair',
          date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
          type: 'event',
          description: 'Annual science fair showcasing student projects'
        },
        {
          id: '3',
          title: 'Mid-term Examinations',
          date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          type: 'exam',
          description: 'Mid-term exams for all grades'
        }
      ];

      setChildren(mockChildren);
      setPerformance(mockPerformance);
      setEvents(mockEvents);
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

  const getGradeColor = (grade: string) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
    if (['B+', 'B', 'B-'].includes(grade)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
    if (['C+', 'C', 'C-'].includes(grade)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'event': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      case 'holiday': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return '🤝';
      case 'event': return '🎉';
      case 'exam': return '📝';
      case 'holiday': return '🏖️';
      default: return '📅';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate quick stats
  const quickStats: QuickStat[] = [
    {
      label: 'Children',
      value: children.length,
      icon: '👨‍👩‍👧‍👦',
      color: 'text-blue-600'
    },
    {
      label: 'Average Grade',
      value: performance.length > 0 
        ? (performance.reduce((sum, p) => sum + (p.overallGrade.includes('A') ? 4 : p.overallGrade.includes('B') ? 3 : 2), 0) / performance.length).toFixed(1)
        : '0',
      icon: '📊',
      color: 'text-green-600'
    },
    {
      label: 'Attendance Rate',
      value: performance.length > 0 
        ? `${Math.round(performance.reduce((sum, p) => sum + p.attendanceRate, 0) / performance.length)}%`
        : '0%',
      icon: '📋',
      color: 'text-purple-600'
    },
    {
      label: 'Upcoming Events',
      value: events.filter(e => e.date > new Date()).length,
      icon: '📅',
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </CardContent>
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
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your children's education.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <div className="text-2xl">{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Children Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {children.map((child) => {
          const childPerf = performance.find(p => p.childId === child.id);
          
          return (
            <Card key={child.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {child.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                    <CardDescription>{child.class} • ID: {child.studentId}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {childPerf && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Grade</span>
                      <Badge className={getGradeColor(childPerf.overallGrade)}>
                        {childPerf.overallGrade}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Attendance</span>
                      <span className="text-sm font-semibold">{childPerf.attendanceRate}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${childPerf.attendanceRate}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending Assignments</span>
                      <span className="text-sm font-semibold text-orange-600">
                        {childPerf.upcomingAssignments}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Grades</h4>
                      {childPerf.recentGrades.slice(0, 3).map((grade, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{grade.subject}</span>
                          <Badge variant="outline" className={getGradeColor(grade.grade)}>
                            {grade.grade}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="flex gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/parent/children/${child.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/parent/academics?child=${child.id}`}>
                      Academics
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📅</span>
            Upcoming School Events
          </CardTitle>
          <CardDescription>
            Important dates and events to remember
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.filter(event => event.date > new Date()).slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="text-2xl">{getEventIcon(event.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(event.date)}
                  </p>
                </div>
              </div>
            ))}
            
            {events.filter(event => event.date > new Date()).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">📅</div>
                <p>No upcoming events scheduled</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and frequently accessed features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/parent/academics">
                <span className="text-2xl">📚</span>
                <span className="text-sm">View Grades</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/parent/attendance">
                <span className="text-2xl">📋</span>
                <span className="text-sm">Check Attendance</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/parent/messages">
                <span className="text-2xl">💬</span>
                <span className="text-sm">Messages</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
              <Link href="/parent/reports">
                <span className="text-2xl">📊</span>
                <span className="text-sm">Progress Reports</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
