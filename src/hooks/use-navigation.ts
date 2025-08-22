import { useReducer, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Types for navigation system
export type PortalType = 'admin' | 'teacher' | 'student' | 'parent' | 'accountant' | 'hr';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description?: string;
  badge?: string | number;
  permissions?: string[];
}

export interface NavigationState {
  portalType: PortalType;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  activeRoute: string;
  navigationItems: NavigationItem[];
  userMenuOpen: boolean;
}

export type NavigationAction =
  | { type: 'SET_PORTAL_TYPE'; payload: PortalType }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'TOGGLE_USER_MENU' }
  | { type: 'SET_ACTIVE_ROUTE'; payload: string }
  | { type: 'CLOSE_ALL_MENUS' };

// Navigation configurations for each portal
const navigationConfigs: Record<PortalType, NavigationItem[]> = {
  admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: 'dashboard',
      description: 'Overview and analytics'
    },
    {
      id: 'students',
      label: 'Students',
      href: '/admin/students',
      icon: 'users',
      description: 'Manage student records'
    },
    {
      id: 'teachers',
      label: 'Teachers',
      href: '/admin/teachers',
      icon: 'user-check',
      description: 'Manage teaching staff'
    },
    {
      id: 'users',
      label: 'Users',
      href: '/admin/users',
      icon: 'user-cog',
      description: 'Manage app users and roles'
    },
    {
      id: 'classes',
      label: 'Classes',
      href: '/admin/classes',
      icon: 'school',
      description: 'Manage class sections'
    },
    {
      id: 'subjects',
      label: 'Subjects',
      href: '/admin/subjects',
      icon: 'book-open',
      description: 'Manage curriculum subjects'
    },
    {
      id: 'timetable',
      label: 'Timetable',
      href: '/admin/timetable',
      icon: 'calendar',
      description: 'Create and manage academic timetables'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      href: '/admin/attendance',
      icon: 'calendar-check',
      description: 'Track student attendance'
    },
    {
      id: 'exams',
      label: 'Exams',
      href: '/admin/exams',
      icon: 'file-text',
      description: 'Manage examinations'
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/admin/settings',
      icon: 'settings',
      description: 'System configuration'
    }
  ],
  teacher: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/teacher',
      icon: 'home',
      description: 'Teaching overview'
    },
    {
      id: 'classes',
      label: 'My Classes',
      href: '/teacher/classes',
      icon: 'users',
      description: 'Assigned classes'
    },
    {
      id: 'students',
      label: 'Students',
      href: '/teacher/students',
      icon: 'user-check',
      description: 'Class students'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      href: '/teacher/attendance',
      icon: 'calendar-check',
      description: 'Mark attendance'
    },
    {
      id: 'assignments',
      label: 'Assignments',
      href: '/teacher/assignments',
      icon: 'file-text',
      description: 'Create and grade'
    },
    {
      id: 'grades',
      label: 'Gradebook',
      href: '/teacher/grades',
      icon: 'award',
      description: 'Grade management'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      href: '/teacher/schedule',
      icon: 'calendar',
      description: 'Class timetable'
    },
    {
      id: 'resources',
      label: 'Resources',
      href: '/teacher/resources',
      icon: 'book-open',
      description: 'Teaching materials'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/teacher/analytics',
      icon: 'bar-chart-3',
      description: 'Performance insights'
    },
    {
      id: 'messages',
      label: 'Messages',
      href: '/teacher/messages',
      icon: 'message-square',
      description: 'Communications'
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/teacher/settings',
      icon: 'settings',
      description: 'Account preferences'
    }
  ],
  student: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/student/dashboard',
      icon: 'dashboard',
      description: 'Student overview'
    },
    {
      id: 'assignments',
      label: 'Assignments',
      href: '/student/assignments',
      icon: 'file-text',
      description: 'View assignments'
    },
    {
      id: 'grades',
      label: 'Grades',
      href: '/student/grades',
      icon: 'award',
      description: 'Academic results'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      href: '/student/attendance',
      icon: 'calendar-check',
      description: 'Attendance record'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      href: '/student/schedule',
      icon: 'calendar',
      description: 'Class timetable'
    },
    {
      id: 'subjects',
      label: 'Subjects',
      href: '/student/subjects',
      icon: 'book-open',
      description: 'Enrolled subjects'
    },
    {
      id: 'profile',
      label: 'Profile',
      href: '/student/profile',
      icon: 'user',
      description: 'Personal information'
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/student/settings',
      icon: 'settings',
      description: 'Account settings'
    }
  ],
  parent: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/parent/dashboard',
      icon: 'dashboard',
      description: 'Children overview'
    },
    {
      id: 'children',
      label: 'Children',
      href: '/parent/children',
      icon: 'users',
      description: 'Manage children'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      href: '/parent/attendance',
      icon: 'calendar-check',
      description: 'Attendance tracking'
    },
    {
      id: 'grades',
      label: 'Grades',
      href: '/parent/grades',
      icon: 'award',
      description: 'Academic progress'
    },
    {
      id: 'schedule',
      label: 'Schedule',
      href: '/parent/schedule',
      icon: 'calendar',
      description: 'School events'
    },
    {
      id: 'reports',
      label: 'Reports',
      href: '/parent/reports',
      icon: 'file-text',
      description: 'Progress reports'
    },
    {
      id: 'messages',
      label: 'Messages',
      href: '/parent/messages',
      icon: 'mail',
      description: 'School communications'
    }
  ],
  accountant: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/accountant/dashboard',
      icon: 'dashboard',
      description: 'Financial overview and analytics'
    },
    {
      id: 'fees',
      label: 'Fee Management',
      href: '/accountant/fees',
      icon: 'file-text',
      description: 'Student fees and payments'
    },
    {
      id: 'payroll',
      label: 'Payroll',
      href: '/accountant/payroll',
      icon: 'users',
      description: 'Staff salary management'
    },
    {
      id: 'budget',
      label: 'Budget & Planning',
      href: '/accountant/budget',
      icon: 'bar-chart-3',
      description: 'Budget planning and tracking'
    },
    {
      id: 'expenses',
      label: 'Expenses',
      href: '/accountant/expenses',
      icon: 'file-text',
      description: 'Track school expenses'
    },
    {
      id: 'reports',
      label: 'Financial Reports',
      href: '/accountant/reports',
      icon: 'file-text',
      description: 'Generate financial reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/accountant/settings',
      icon: 'settings',
      description: 'Account preferences'
    }
  ],
  hr: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/hr/dashboard',
      icon: 'dashboard',
      description: 'HR overview and metrics'
    },
    {
      id: 'staff',
      label: 'Staff Records',
      href: '/hr/staff',
      icon: 'users',
      description: 'Employee profiles and records'
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      href: '/hr/recruitment',
      icon: 'user-check',
      description: 'Job postings and candidates'
    },
    {
      id: 'appraisals',
      label: 'Appraisals',
      href: '/hr/appraisals',
      icon: 'award',
      description: 'Performance reviews'
    },
    {
      id: 'training',
      label: 'Training',
      href: '/hr/training',
      icon: 'book-open',
      description: 'Staff development programs'
    },
    {
      id: 'attendance',
      label: 'Staff Attendance',
      href: '/hr/attendance',
      icon: 'calendar-check',
      description: 'Track staff attendance'
    },
    {
      id: 'policies',
      label: 'Policies',
      href: '/hr/policies',
      icon: 'file-text',
      description: 'HR policies and procedures'
    },
    {
      id: 'settings',
      label: 'Settings',
      href: '/hr/settings',
      icon: 'settings',
      description: 'HR preferences'
    }
  ]
};

// Initial state
const initialState: NavigationState = {
  portalType: 'admin',
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  activeRoute: '',
  navigationItems: navigationConfigs.admin,
  userMenuOpen: false
};

// Reducer function
function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'SET_PORTAL_TYPE':
      return {
        ...state,
        portalType: action.payload,
        navigationItems: navigationConfigs[action.payload],
        sidebarCollapsed: false,
        mobileMenuOpen: false,
        userMenuOpen: false
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      };
    
    case 'TOGGLE_MOBILE_MENU':
      return {
        ...state,
        mobileMenuOpen: !state.mobileMenuOpen,
        userMenuOpen: false
      };
    
    case 'TOGGLE_USER_MENU':
      return {
        ...state,
        userMenuOpen: !state.userMenuOpen,
        mobileMenuOpen: false
      };
    
    case 'SET_ACTIVE_ROUTE':
      return {
        ...state,
        activeRoute: action.payload
      };
    
    case 'CLOSE_ALL_MENUS':
      return {
        ...state,
        mobileMenuOpen: false,
        userMenuOpen: false
      };
    
    default:
      return state;
  }
}

// Custom hook
export function useNavigation(initialPortalType?: PortalType) {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(navigationReducer, {
    ...initialState,
    portalType: initialPortalType || 'admin',
    navigationItems: navigationConfigs[initialPortalType || 'admin']
  });

  // Update active route when pathname changes
  useEffect(() => {
    dispatch({ type: 'SET_ACTIVE_ROUTE', payload: pathname });
  }, [pathname]);

  // Auto-close menus on route change
  useEffect(() => {
    dispatch({ type: 'CLOSE_ALL_MENUS' });
  }, [pathname]);

  // Responsive behavior - close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && state.mobileMenuOpen) {
        dispatch({ type: 'TOGGLE_MOBILE_MENU' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state.mobileMenuOpen]);

  // Actions
  const actions = {
    setPortalType: (portalType: PortalType) => 
      dispatch({ type: 'SET_PORTAL_TYPE', payload: portalType }),
    
    toggleSidebar: () => 
      dispatch({ type: 'TOGGLE_SIDEBAR' }),
    
    toggleMobileMenu: () => 
      dispatch({ type: 'TOGGLE_MOBILE_MENU' }),
    
    toggleUserMenu: () => 
      dispatch({ type: 'TOGGLE_USER_MENU' }),
    
    closeAllMenus: () => 
      dispatch({ type: 'CLOSE_ALL_MENUS' })
  };

  // Helper functions
  const isActiveRoute = (href: string): boolean => {
    if (href === `/${state.portalType}`) {
      return pathname === href || pathname === `/${state.portalType}/dashboard`;
    }
    return pathname.startsWith(href);
  };

  const getActiveNavigationItem = (): NavigationItem | undefined => {
    return state.navigationItems.find(item => isActiveRoute(item.href));
  };

  const getPortalTitle = (): string => {
    const titles = {
      admin: 'Admin Portal',
      teacher: 'Teacher Portal',
      student: 'Student Portal',
      parent: 'Parent Portal',
      accountant: 'Accountant Portal',
      hr: 'HR Portal'
    };
    return titles[state.portalType];
  };

  return {
    state,
    actions,
    helpers: {
      isActiveRoute,
      getActiveNavigationItem,
      getPortalTitle
    }
  };
}

// Export navigation configs for external use
export { navigationConfigs };
