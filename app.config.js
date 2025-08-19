/**
 * SchoolSync Application Configuration
 * Centralized configuration for pricing, features, and app settings
 */

const appConfig = {
  // Application Information
  app: {
    name: "SchoolSync",
    tagline: "Empowering African schools with modern technology",
    description: "Complete school management system designed for Ghana's educational institutions",
    version: "1.0.0",
    currency: "GH₵",
    academicStructure: {
      termsPerYear: 3,
      termDuration: "3-4 months"
    }
  },

  // Pricing Configuration
  pricing: {
    billingCycle: "term", // "month" | "term" | "year"
    currency: "GH₵",
    
    // Pricing Plans
    plans: [
      {
        id: "basic",
        name: "Basic",
        price: 10,
        period: "/student/term",
        studentRange: "1-50 students",
        description: "Perfect for very small schools and daycare centers",
        priceNote: "Minimum GH₵ 100/term",
        minAmount: 100,
        popular: false,
        features: [
          "Student Management",
          "Basic Attendance",
          "Simple Grade Records",
          "Parent SMS Notifications",
          "Mobile App Access",
          "Email Support"
        ]
      },
      {
        id: "starter",
        name: "Starter",
        price: 25,
        period: "/student/term",
        studentRange: "51-150 students",
        description: "Great for small to medium schools",
        priceNote: "Most popular for primary schools",
        minAmount: null,
        popular: false,
        features: [
          "Everything in Basic",
          "Staff Management",
          "Advanced Attendance",
          "Grade Management",
          "Parent Communication Portal",
          "WhatsApp Integration",
          "Basic Reports",
          "Fee Tracking"
        ]
      },
      {
        id: "growth",
        name: "Growth",
        price: 20,
        period: "/student/term",
        studentRange: "151-500 students",
        description: "Ideal for growing schools with advanced needs",
        priceNote: "Best value for secondary schools",
        minAmount: null,
        popular: true,
        features: [
          "Everything in Starter",
          "Advanced Analytics",
          "Financial Management",
          "Exam Management",
          "Timetable Management",
          "SMS Notifications",
          "Fee Collection System",
          "Priority Support",
          "API Access",
          "Custom Reports"
        ]
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 15,
        period: "/student/term",
        studentRange: "500+ students",
        description: "For large institutions and multi-campus schools",
        priceNote: "Best value for scale",
        minAmount: null,
        popular: false,
        features: [
          "Everything in Growth",
          "AI-Powered Insights",
          "Multi-Campus Management",
          "Advanced Reporting Suite",
          "Custom Integrations",
          "Dedicated Account Manager",
          "Training & Onboarding",
          "99.9% SLA Guarantee",
          "Data Migration Support",
          "Priority Feature Requests"
        ]
      }
    ],

    // Pricing Examples for Marketing
    examples: [
      {
        title: "Small School: 30 Students",
        plan: "basic",
        students: 30,
        calculation: "GH₵ 10 × 30 students",
        total: "GH₵ 300/term",
        note: "Perfect for nursery & primary schools"
      },
      {
        title: "Example: 100 Students",
        plan: "starter",
        students: 100,
        calculation: "GH₵ 25 × 100 students",
        total: "GH₵ 2,500/term",
        note: "Covers entire 3-4 month term period"
      }
    ],

    // What's always included
    includedFeatures: [
      "Unlimited staff/teacher accounts",
      "Unlimited parent accounts",
      "All features in your plan",
      "Mobile app access for all users"
    ]
  },

  // Contact Information
  contact: {
    email: "hello@schoolsync.edu.gh",
    phone: "+233 XX XXX XXXX",
    address: "Accra, Ghana",
    supportEmail: "support@schoolsync.edu.gh",
    salesEmail: "sales@schoolsync.edu.gh"
  },

  // Social Media Links
  social: {
    twitter: "#",
    facebook: "#",
    linkedin: "#",
    instagram: "#"
  },

  // Feature Toggles
  features: {
    demoMode: true,
    betaFeatures: false,
    analytics: true,
    supportChat: true
  }
};

// Helper functions for pricing calculations
const pricingHelpers = {
  /**
   * Calculate total cost for a plan
   * @param {string} planId - The plan ID
   * @param {number} studentCount - Number of students
   * @returns {object} Calculation details
   */
  calculateCost: (planId, studentCount) => {
    const plan = appConfig.pricing.plans.find(p => p.id === planId);
    if (!plan) return null;

    const totalCost = plan.price * studentCount;
    const minCost = plan.minAmount || 0;
    const finalCost = Math.max(totalCost, minCost);

    return {
      plan: plan.name,
      pricePerStudent: plan.price,
      studentCount,
      subtotal: totalCost,
      minimumCharge: minCost,
      finalCost,
      currency: appConfig.pricing.currency,
      period: plan.period
    };
  },

  /**
   * Get formatted price string
   * @param {number} amount - Price amount
   * @returns {string} Formatted price
   */
  formatPrice: (amount) => {
    return `${appConfig.pricing.currency} ${amount.toLocaleString()}`;
  },

  /**
   * Get plan by student count
   * @param {number} studentCount - Number of students
   * @returns {object} Recommended plan
   */
  getRecommendedPlan: (studentCount) => {
    if (studentCount <= 50) return appConfig.pricing.plans.find(p => p.id === 'basic');
    if (studentCount <= 150) return appConfig.pricing.plans.find(p => p.id === 'starter');
    if (studentCount <= 500) return appConfig.pricing.plans.find(p => p.id === 'growth');
    return appConfig.pricing.plans.find(p => p.id === 'enterprise');
  }
};

module.exports = {
  appConfig,
  pricingHelpers
};
