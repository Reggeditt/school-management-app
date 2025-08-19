'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useNavigation, PortalType } from '@/hooks/use-navigation';
import { getNavigationIcon } from './navigation-icons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AppLayoutProps {
  children: ReactNode;
  portalType: PortalType;
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onSignOut?: () => void;
}

export function AppLayout({ children, portalType, userInfo, onSignOut }: AppLayoutProps) {
  const { state, actions, helpers } = useNavigation(portalType);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className={cn(
        "flex flex-col bg-card border-r transition-all duration-300 ease-in-out",
        state.sidebarCollapsed ? "w-16" : "w-64",
        "hidden md:flex" // Hidden on mobile, shown on desktop
      )}>
        <SidebarHeader 
          collapsed={state.sidebarCollapsed}
          portalTitle={helpers.getPortalTitle()}
          onToggle={actions.toggleSidebar}
        />
        <SidebarNavigation 
          items={state.navigationItems}
          collapsed={state.sidebarCollapsed}
          isActiveRoute={helpers.isActiveRoute}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {state.mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={actions.toggleMobileMenu}
          />
          <div className="fixed left-0 top-0 h-full w-64 bg-card border-r">
            <SidebarHeader 
              collapsed={false}
              portalTitle={helpers.getPortalTitle()}
              onToggle={actions.toggleMobileMenu}
              showCloseButton
            />
            <SidebarNavigation 
              items={state.navigationItems}
              collapsed={false}
              isActiveRoute={helpers.isActiveRoute}
              onItemClick={actions.closeAllMenus}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNavigation 
          portalTitle={helpers.getPortalTitle()}
          activeItem={helpers.getActiveNavigationItem()}
          userInfo={userInfo}
          userMenuOpen={state.userMenuOpen}
          onMobileMenuToggle={actions.toggleMobileMenu}
          onUserMenuToggle={actions.toggleUserMenu}
          onSignOut={onSignOut}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

// Sidebar Header Component
interface SidebarHeaderProps {
  collapsed: boolean;
  portalTitle: string;
  onToggle: () => void;
  showCloseButton?: boolean;
}

function SidebarHeader({ collapsed, portalTitle, onToggle, showCloseButton }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      {!collapsed && (
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">SchoolSync</h1>
          <p className="text-sm text-muted-foreground">{portalTitle}</p>
        </div>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="ml-auto"
      >
        {showCloseButton ? getNavigationIcon('x') : 
         collapsed ? getNavigationIcon('chevron-right') : getNavigationIcon('chevron-left')}
      </Button>
    </div>
  );
}

// Sidebar Navigation Component
interface SidebarNavigationProps {
  items: any[];
  collapsed: boolean;
  isActiveRoute: (href: string) => boolean;
  onItemClick?: () => void;
}

function SidebarNavigation({ items, collapsed, isActiveRoute, onItemClick }: SidebarNavigationProps) {
  return (
    <nav className="flex-1 p-2 overflow-y-auto">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActiveRoute(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">
                {getNavigationIcon(item.icon)}
              </span>
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Top Navigation Component
interface TopNavigationProps {
  portalTitle: string;
  activeItem?: any;
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  userMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onUserMenuToggle: () => void;
  onSignOut?: () => void;
}

function TopNavigation({ 
  portalTitle, 
  activeItem, 
  userInfo, 
  userMenuOpen, 
  onMobileMenuToggle, 
  onUserMenuToggle,
  onSignOut 
}: TopNavigationProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-card border-b">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMobileMenuToggle}
          className="md:hidden"
        >
          {getNavigationIcon('menu')}
        </Button>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{portalTitle}</span>
          {activeItem && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium text-foreground">{activeItem.label}</span>
            </>
          )}
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* User Menu */}
        {userInfo && (
          <div className="relative">
            <Button
              variant="ghost"
              onClick={onUserMenuToggle}
              className="flex items-center gap-2 h-8"
            >
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                {userInfo.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline text-sm">{userInfo.name}</span>
              {getNavigationIcon('chevron-down')}
            </Button>

            {/* User Dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="font-medium text-sm">{userInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userInfo.role}</p>
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    onClick={onSignOut}
                    className="w-full justify-start text-sm"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
