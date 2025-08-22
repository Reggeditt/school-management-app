import { School } from './database-services';

// 🎯 Subscription Plans Configuration
export interface SubscriptionPlan {
  id: 'free' | 'basic' | 'standard' | 'premium' | 'enterprise';
  name: string;
  description: string;
  price: {
    perStudentPerTerm: number;
    minimumCharge: number; // Minimum monthly charge regardless of student count
    currency: string;
  };
  limits: {
    maxStudents: number;
    maxTeachers: number;
    maxClasses: number;
    maxStorage: number; // in MB
    maxActiveUsers: number;
  };
  features: string[];
  trial: {
    enabled: boolean;
    duration: number; // in days
  };
}

// 📋 Available Subscription Plans
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free Trial',
    description: 'Perfect for small schools to get started',
    price: { perStudentPerTerm: 0, minimumCharge: 0, currency: 'GHS' },
    limits: {
      maxStudents: 50,
      maxTeachers: 5,
      maxClasses: 5,
      maxStorage: 100,
      maxActiveUsers: 10
    },
    features: [
      'student_management',
      'basic_attendance',
      'simple_grading',
      'parent_communication',
      'basic_reports'
    ],
    trial: { enabled: true, duration: 30 }
  },
  
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    description: 'For small to medium schools',
    price: { perStudentPerTerm: 15, minimumCharge: 200, currency: 'GHS' },
    limits: {
      maxStudents: 200,
      maxTeachers: 20,
      maxClasses: 15,
      maxStorage: 500,
      maxActiveUsers: 50
    },
    features: [
      'student_management',
      'teacher_management',
      'attendance_tracking',
      'grade_management',
      'parent_portal',
      'basic_analytics',
      'homework_assignments',
      'email_notifications'
    ],
    trial: { enabled: true, duration: 14 }
  },

  standard: {
    id: 'standard',
    name: 'Standard Plan',
    description: 'For growing schools with advanced needs',
    price: { perStudentPerTerm: 25, minimumCharge: 400, currency: 'GHS' },
    limits: {
      maxStudents: 500,
      maxTeachers: 50,
      maxClasses: 30,
      maxStorage: 2000,
      maxActiveUsers: 150
    },
    features: [
      'student_management',
      'teacher_management',
      'class_management',
      'attendance_tracking',
      'grade_management',
      'exam_management',
      'parent_portal',
      'student_portal',
      'advanced_analytics',
      'custom_reports',
      'bulk_operations',
      'sms_notifications',
      'email_notifications',
      'timetable_management',
      'financial_tracking'
    ],
    trial: { enabled: true, duration: 14 }
  },

  premium: {
    id: 'premium',
    name: 'Premium Plan',
    description: 'For large schools with comprehensive requirements',
    price: { perStudentPerTerm: 35, minimumCharge: 800, currency: 'GHS' },
    limits: {
      maxStudents: 1000,
      maxTeachers: 100,
      maxClasses: 50,
      maxStorage: 5000,
      maxActiveUsers: 300
    },
    features: [
      'all_standard_features',
      'hr_management',
      'payroll_system',
      'advanced_reporting',
      'api_access',
      'custom_integrations',
      'multi_campus_support',
      'advanced_security',
      'data_export',
      'white_labeling',
      'priority_support'
    ],
    trial: { enabled: true, duration: 14 }
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    description: 'For large institutions with custom needs',
    price: { perStudentPerTerm: 0, minimumCharge: 0, currency: 'GHS' }, // Custom pricing
    limits: {
      maxStudents: -1, // Unlimited
      maxTeachers: -1,
      maxClasses: -1,
      maxStorage: -1,
      maxActiveUsers: -1
    },
    features: [
      'all_premium_features',
      'unlimited_everything',
      'custom_development',
      'dedicated_support',
      'on_premise_deployment',
      'advanced_customization',
      'enterprise_security',
      'audit_logs',
      'compliance_reporting'
    ],
    trial: { enabled: false, duration: 0 }
  }
};

// � Pricing Calculation Utilities
export class PricingCalculator {
  
  /**
   * Calculate the total cost for a school based on student count and plan
   */
  static calculateTermCost(plan: SubscriptionPlan, studentCount: number): {
    baseCharge: number;
    perStudentCharge: number;
    totalCost: number;
    breakdown: string;
  } {
    const perStudentCharge = studentCount * plan.price.perStudentPerTerm;
    const baseCharge = Math.max(plan.price.minimumCharge, perStudentCharge);
    const totalCost = baseCharge;

    let breakdown: string;
    if (perStudentCharge >= plan.price.minimumCharge) {
      breakdown = `${studentCount} students × ${plan.price.currency} ${plan.price.perStudentPerTerm} = ${plan.price.currency} ${totalCost}`;
    } else {
      breakdown = `Minimum charge: ${plan.price.currency} ${plan.price.minimumCharge} (covers up to ${Math.floor(plan.price.minimumCharge / plan.price.perStudentPerTerm)} students)`;
    }

    return {
      baseCharge: plan.price.minimumCharge,
      perStudentCharge,
      totalCost,
      breakdown
    };
  }

  /**
   * Get cost per term for display purposes
   */
  static getDisplayPrice(plan: SubscriptionPlan, studentCount?: number): string {
    if (plan.price.perStudentPerTerm === 0) {
      return 'Free';
    }

    if (studentCount) {
      const cost = this.calculateTermCost(plan, studentCount);
      return `${plan.price.currency} ${cost.totalCost}/term`;
    }

    return `${plan.price.currency} ${plan.price.perStudentPerTerm}/student/term (min. ${plan.price.currency} ${plan.price.minimumCharge})`;
  }

  /**
   * Calculate annual cost estimate
   */
  static calculateAnnualCost(plan: SubscriptionPlan, studentCount: number, termsPerYear: number = 3): number {
    const termCost = this.calculateTermCost(plan, studentCount);
    return termCost.totalCost * termsPerYear;
  }
}

// �🔐 Access Control Service
export class AccessControlService {
  
  /**
   * Check if a school has access to a specific feature
   */
  static hasFeatureAccess(school: School, feature: string): boolean {
    // Check if school subscription is active or in grace period
    if (!this.hasActiveSubscription(school)) {
      return this.isReadOnlyFeature(feature);
    }
    
    const plan = SUBSCRIPTION_PLANS[school.subscription.plan];
    return plan.features.includes(feature) || plan.features.includes('all_premium_features') || plan.features.includes('all_standard_features');
  }

  /**
   * Check if school has active subscription (paid or grace period)
   */
  static hasActiveSubscription(school: School): boolean {
    return school.subscription.status === 'active' || school.subscription.status === 'grace_period';
  }

  /**
   * Check if school is in restricted mode (read-only)
   */
  static isRestricted(school: School): boolean {
    return school.subscription.status === 'restricted';
  }

  /**
   * Check if a feature is read-only (allowed even in restricted mode)
   */
  static isReadOnlyFeature(feature: string): boolean {
    const readOnlyFeatures = [
      'view_students',
      'view_teachers',
      'view_classes',
      'view_grades',
      'view_attendance',
      'view_reports',
      'basic_analytics',
      'export_data'
    ];
    return readOnlyFeatures.includes(feature);
  }

  /**
   * Get available actions for a school based on subscription status
   */
  static getAvailableActions(school: School): {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canExport: boolean;
    canImport: boolean;
  } {
    const hasAccess = this.hasActiveSubscription(school);
    
    return {
      canCreate: hasAccess,
      canEdit: hasAccess,
      canDelete: hasAccess,
      canExport: true, // Always allow export
      canImport: hasAccess
    };
  }

  /**
   * Check if school exceeds usage limits
   */
  static checkUsageLimits(school: School): {
    withinLimits: boolean;
    exceeded: string[];
    warnings: string[];
  } {
    const plan = SUBSCRIPTION_PLANS[school.subscription.plan];
    const exceeded: string[] = [];
    const warnings: string[] = [];

    // Check each limit (-1 means unlimited)
    if (plan.limits.maxStudents !== -1 && school.usage.currentStudents > plan.limits.maxStudents) {
      exceeded.push(`Students: ${school.usage.currentStudents}/${plan.limits.maxStudents}`);
    } else if (plan.limits.maxStudents !== -1 && school.usage.currentStudents > plan.limits.maxStudents * 0.9) {
      warnings.push(`Students: ${school.usage.currentStudents}/${plan.limits.maxStudents} (90% limit)`);
    }

    if (plan.limits.maxTeachers !== -1 && school.usage.currentTeachers > plan.limits.maxTeachers) {
      exceeded.push(`Teachers: ${school.usage.currentTeachers}/${plan.limits.maxTeachers}`);
    }

    if (plan.limits.maxClasses !== -1 && school.usage.currentClasses > plan.limits.maxClasses) {
      exceeded.push(`Classes: ${school.usage.currentClasses}/${plan.limits.maxClasses}`);
    }

    if (plan.limits.maxStorage !== -1 && school.usage.storageUsed > plan.limits.maxStorage) {
      exceeded.push(`Storage: ${school.usage.storageUsed}MB/${plan.limits.maxStorage}MB`);
    }

    return {
      withinLimits: exceeded.length === 0,
      exceeded,
      warnings
    };
  }

  /**
   * Update school subscription status based on payment and grace period
   */
  static updateSubscriptionStatus(school: School): School['subscription']['status'] {
    const now = new Date();
    const termEnd = new Date(school.subscription.currentTermEnd);
    const gracePeriodEnd = school.subscription.gracePeriodEnd ? new Date(school.subscription.gracePeriodEnd) : null;

    // If we're within the paid term
    if (now <= termEnd) {
      return 'active';
    }

    // If we're past the term but within grace period
    if (gracePeriodEnd && now <= gracePeriodEnd) {
      return 'grace_period';
    }

    // If we're past both term and grace period
    return 'restricted';
  }

  /**
   * Calculate grace period end date (10 days after term end)
   */
  static calculateGracePeriodEnd(termEnd: Date): Date {
    const gracePeriodEnd = new Date(termEnd);
    gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 10);
    return gracePeriodEnd;
  }

  /**
   * Get days remaining in subscription or grace period
   */
  static getDaysRemaining(school: School): {
    type: 'active' | 'grace' | 'expired';
    days: number;
    message: string;
  } {
    const now = new Date();
    const termEnd = new Date(school.subscription.currentTermEnd);
    const gracePeriodEnd = school.subscription.gracePeriodEnd ? new Date(school.subscription.gracePeriodEnd) : null;

    if (now <= termEnd) {
      const daysLeft = Math.ceil((termEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        type: 'active',
        days: daysLeft,
        message: `${daysLeft} days remaining in current term (${school.subscription.currentTerm.name})`
      };
    }

    if (gracePeriodEnd && now <= gracePeriodEnd) {
      const daysLeft = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        type: 'grace',
        days: daysLeft,
        message: `${daysLeft} days remaining in grace period. Please pay for next term.`
      };
    }

    const daysOverdue = Math.ceil((now.getTime() - (gracePeriodEnd || termEnd).getTime()) / (1000 * 60 * 60 * 24));
    return {
      type: 'expired',
      days: daysOverdue,
      message: `Account restricted. ${daysOverdue} days overdue. Please contact billing.`
    };
  }
}

// 🎨 Subscription Status Utilities
export const getSubscriptionStatusColor = (status: School['subscription']['status']): string => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'grace_period': return 'text-yellow-600 bg-yellow-100';
    case 'restricted': return 'text-red-600 bg-red-100';
    case 'suspended': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getSubscriptionStatusText = (status: School['subscription']['status']): string => {
  switch (status) {
    case 'active': return 'Active';
    case 'grace_period': return 'Grace Period';
    case 'restricted': return 'Restricted Access';
    case 'suspended': return 'Suspended';
    default: return 'Unknown';
  }
};
