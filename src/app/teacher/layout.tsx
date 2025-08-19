'use client';

import { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandMenu } from "@/components/command-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Home,
  GraduationCap,
  ClipboardList,
  MessageSquare,
  LogOut,
  User
} from "lucide-react";

interface TeacherLayoutProps {
  children: ReactNode;
}

const navigation = [
  {
    name: "Dashboard",
    href: "/teacher",
    icon: Home,
  },
  {
    name: "My Classes",
    href: "/teacher/classes",
    icon: Users,
  },
  {
    name: "Attendance",
    href: "/teacher/attendance",
    icon: ClipboardList,
  },
  {
    name: "Assignments",
    href: "/teacher/assignments", 
    icon: FileText,
  },
  {
    name: "Gradebook",
    href: "/teacher/grades",
    icon: GraduationCap,
  },
  {
    name: "Schedule",
    href: "/teacher/schedule",
    icon: Calendar,
  },
  {
    name: "Resources",
    href: "/teacher/resources",
    icon: BookOpen,
  },
  {
    name: "Analytics",
    href: "/teacher/analytics",
    icon: BarChart3,
  },
  {
    name: "Messages",
    href: "/teacher/messages",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/teacher/settings",
    icon: Settings,
  },
];

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      // Handle logout error silently
    }
  };

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center px-4">
            <div className="mr-4 hidden md:flex">
              <Link href="/teacher" className="mr-6 flex items-center space-x-2">
                <GraduationCap className="h-6 w-6" />
                <span className="hidden font-bold sm:inline-block">
                  SMS Teacher
                </span>
              </Link>
            </div>
            
            <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
              <div className="w-full flex-1 md:w-auto md:flex-none">
                <CommandMenu />
              </div>
              <nav className="flex items-center space-x-2">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.profile?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'T'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.profile?.name || user?.email?.split('@')[0] || 'Teacher'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/teacher/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/teacher/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
            <div className="flex h-full flex-col">
              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
