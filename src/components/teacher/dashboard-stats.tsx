'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TeacherDashboardStats } from '@/services/teacher.service';
import Link from "next/link";
import {
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  TrendingUp,
  Calendar,
  Target,
  Award
} from "lucide-react";

interface QuickStat {
  label: string;
  value: string | number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  href?: string;
}

interface DashboardStatsProps {
  stats: TeacherDashboardStats;
  loading?: boolean;
}

export function DashboardStats({ stats, loading = false }: DashboardStatsProps) {
  const quickStats: QuickStat[] = [
    {
      label: "Total Classes",
      value: stats.totalClasses,
      trend: 'stable',
      icon: BookOpen,
      color: "text-blue-600",
      href: "/teacher/classes"
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      trend: 'stable',
      icon: Users,
      color: "text-green-600",
      href: "/teacher/students"
    },
    {
      label: "Pending Assignments",
      value: stats.pendingAssignments,
      trend: 'down',
      icon: ClipboardList,
      color: "text-orange-600",
      href: "/teacher/assignments"
    },
    {
      label: "Average Grade",
      value: `${stats.averageGrade}%`,
      change: 2.1,
      trend: 'up',
      icon: GraduationCap,
      color: "text-purple-600",
      href: "/teacher/grades"
    },
    {
      label: "Attendance Rate",
      value: `${stats.attendanceRate}%`,
      change: 1.8,
      trend: 'up',
      icon: Target,
      color: "text-emerald-600",
      href: "/teacher/attendance"
    },
    {
      label: "Upcoming Classes",
      value: stats.upcomingClasses,
      trend: 'stable',
      icon: Calendar,
      color: "text-indigo-600",
      href: "/teacher/schedule"
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.label}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                {stat.change && (
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    <TrendingUp className={`h-3 w-3 mr-1 ${
                      stat.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    {stat.change}%
                  </div>
                )}
              </div>
              {stat.href && (
                <div className="mt-2">
                  <Button variant="ghost" size="sm" asChild className="h-6 px-2 text-xs">
                    <Link href={stat.href}>View Details</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
