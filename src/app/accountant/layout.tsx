'use client';

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

const accountantNavItems = [
  {
    title: "Dashboard",
    href: "/accountant",
    icon: "🏠",
    description: "Financial overview and analytics"
  },
  {
    title: "Fee Management",
    href: "/accountant/fees",
    icon: "💰",
    description: "Student fees and payments"
  },
  {
    title: "Payroll",
    href: "/accountant/payroll",
    icon: "💼",
    description: "Staff salary management"
  },
  {
    title: "Budget & Planning",
    href: "/accountant/budget",
    icon: "📊",
    description: "Budget planning and tracking"
  },
  {
    title: "Expenses",
    href: "/accountant/expenses",
    icon: "🧾",
    description: "Track school expenses"
  },
  {
    title: "Income",
    href: "/accountant/income",
    icon: "📈",
    description: "Revenue and income streams"
  },
  {
    title: "Financial Reports",
    href: "/accountant/reports",
    icon: "📋",
    description: "Financial statements and reports"
  },
  {
    title: "Invoicing",
    href: "/accountant/invoicing",
    icon: "📄",
    description: "Create and manage invoices"
  },
  {
    title: "Assets",
    href: "/accountant/assets",
    icon: "🏢",
    description: "Asset management and tracking"
  },
  {
    title: "Settings",
    href: "/accountant/settings",
    icon: "⚙️",
    description: "Financial settings and preferences"
  }
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              A
            </div>
            <div>
              <h2 className="text-lg font-semibold">Accountant Portal</h2>
              <p className="text-xs text-muted-foreground">Financial Management</p>
            </div>
          </div>
          <div className="space-y-1">
            {accountantNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
                  pathname === item.href 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-accent-foreground"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <span className="text-lg">☰</span>
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <div>
            <h2 className="text-lg font-semibold">Accountant Portal</h2>
            <p className="text-xs text-muted-foreground">Financial Management</p>
          </div>
        </div>
        <nav className="grid gap-2 text-lg font-medium">
          {accountantNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
                pathname === item.href 
                  ? "bg-accent text-accent-foreground" 
                  : "text-muted-foreground hover:text-accent-foreground"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function UserNav() {
  const { user, signOut } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/accountant.png" alt="Accountant" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.profile?.name || "Accountant User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              accountant@school.edu
            </p>
            <Badge variant="secondary" className="w-fit text-xs">
              Accountant
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/accountant/settings">
            ⚙️ Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/accountant/profile">
            👤 Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          🚪 Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AccountantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requiredRole="staff">
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Sidebar />
          </div>
        </div>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileNav />
            <div className="w-full flex-1">
              <h1 className="text-lg font-semibold md:text-2xl">Accountant Portal</h1>
            </div>
            <UserNav />
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
