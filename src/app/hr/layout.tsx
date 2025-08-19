'use client';

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";

const hrNavItems = [
  {
    title: "Dashboard",
    href: "/hr",
    icon: "🏠",
    description: "HR overview and metrics"
  },
  {
    title: "Staff Records",
    href: "/hr/staff",
    icon: "👥",
    description: "Employee profiles and records"
  },
  {
    title: "Recruitment",
    href: "/hr/recruitment",
    icon: "🎯",
    description: "Job postings and candidates"
  },
  {
    title: "Appraisals",
    href: "/hr/appraisals",
    icon: "⭐",
    description: "Performance reviews"
  },
  {
    title: "Training",
    href: "/hr/training",
    icon: "🎓",
    description: "Staff development programs"
  },
  {
    title: "Leave Management",
    href: "/hr/leave",
    icon: "📅",
    description: "Leave requests and tracking"
  },
  {
    title: "Policies",
    href: "/hr/policies",
    icon: "📋",
    description: "HR policies and procedures"
  },
  {
    title: "Reports",
    href: "/hr/reports",
    icon: "📈",
    description: "HR analytics and reporting"
  },
  {
    title: "Settings",
    href: "/hr/settings",
    icon: "⚙️",
    description: "HR system configuration"
  }
];

interface HRLayoutProps {
  children: React.ReactNode;
}

export default function HRLayout({ children }: HRLayoutProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // Handle logout error silently
    }
  };

  return (
    <ProtectedRoute requiredRole={["staff", "admin"]}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">HR</span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Human Resources
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Staff Management Portal
                  </p>
                </div>
              </div>
            </div>
            <nav className="mt-8 flex-1 px-2 pb-4 space-y-1">
              {hrNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center flex-shrink-0 px-4 pt-5 pb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">HR</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Human Resources
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Staff Management Portal
                    </p>
                  </div>
                </div>
              </div>
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {hrNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top navigation */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <div className="lg:hidden mr-2">
                  {/* Mobile menu button is handled by Sheet component above */}
                </div>
                <div className="hidden lg:block">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Human Resources Portal
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user?.email || "User"} />
                        <AvatarFallback>
                          {user?.email
                            ? user.email
                                .split("@")[0]
                                .split(".")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)
                            : "HR"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          HR Manager
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          HR Portal Access
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href="/hr/settings" className="w-full">
                        Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/hr" className="w-full">
                        HR Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
