import { ProfessionalProfile, PricingModel, ServiceItem } from '../types';

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export interface ProfessionalCompletenessItem {
  id: string;
  section: string;
  weight: number;
  completed: boolean;
  isMandatory: boolean;
  description: string;
}

export interface ProfessionalCompletenessResult {
  percentage: number;
  isReadyForActivation: boolean;
  breakdown: ProfessionalCompletenessItem[];
  missingMandatory: string[];
}

/**
 * Dynamic calculation of Professional Profile Completion:
 * - Business information (10%) [Mandatory]
 * - Profile picture (10%) [Mandatory]
 * - Business description (10%) [Mandatory]
 * - Contact information (10%) [Mandatory]
 * - Portfolio (15%)
 * - Services or products (15%) [Mandatory]
 * - Pricing (10%) [Mandatory]
 * - Availability (booking mode) / Inventory (order mode) (10%)
 * - Bank information (10%)
 * 
 * Rules:
 * - Updates dynamically based on completed fields.
 * - Does not display 100% until all mandatory sections are complete.
 */
export function calculateDetailedProfessionalCompleteness(params: {
  businessName?: string;
  category?: string;
  location?: string;
  avatar?: string;
  description?: string;
  contact?: string;
  businessEmail?: string;
  portfolioCount?: number;
  portfolioImages?: string[];
  servicesCount?: number;
  productsCount?: number;
  pricingConfigured?: boolean;
  businessMode?: 'BOOKING_BASED' | 'ORDER_BASED';
  hasAvailabilitySlots?: boolean;
  hasInventoryItems?: boolean;
  bankAccountConfigured?: boolean;
}): ProfessionalCompletenessResult {
  const isOrder = params.businessMode === 'ORDER_BASED';

  const hasBusinessInfo = Boolean(
    params.businessName && params.businessName.trim().length >= 3 &&
    params.category &&
    params.location && params.location.trim().length >= 3
  );

  const hasProfilePicture = Boolean(params.avatar && params.avatar.trim().length > 5);

  const hasDescription = Boolean(
    params.description && params.description.trim().length >= 15
  );

  const hasContact = Boolean(
    (params.contact && params.contact.trim().length >= 8) ||
    (params.businessEmail && params.businessEmail.includes('@'))
  );

  const portfolioTotal = (params.portfolioCount || 0) + (params.portfolioImages?.length || 0);
  const hasPortfolio = portfolioTotal > 0;

  const itemsCount = isOrder ? (params.productsCount || 0) : (params.servicesCount || 0);
  const hasItems = itemsCount > 0;

  const hasPricing = Boolean(params.pricingConfigured);

  const hasOps = isOrder
    ? Boolean(params.hasInventoryItems || itemsCount > 0)
    : Boolean(params.hasAvailabilitySlots);

  const hasBank = Boolean(params.bankAccountConfigured);

  const breakdown: ProfessionalCompletenessItem[] = [
    {
      id: 'business_info',
      section: 'Business Information',
      weight: 10,
      completed: hasBusinessInfo,
      isMandatory: true,
      description: 'Business name, category, and primary service location',
    },
    {
      id: 'profile_pic',
      section: 'Profile Picture / Brand Logo',
      weight: 10,
      completed: hasProfilePicture,
      isMandatory: true,
      description: 'High-resolution professional photo or business insignia',
    },
    {
      id: 'description',
      section: 'Business Description',
      weight: 10,
      completed: hasDescription,
      isMandatory: true,
      description: 'Detailed introduction of services, heritage and capabilities',
    },
    {
      id: 'contact',
      section: 'Contact Information',
      weight: 10,
      completed: hasContact,
      isMandatory: true,
      description: 'Direct phone number and verified business email',
    },
    {
      id: 'portfolio',
      section: 'Portfolio Gallery',
      weight: 15,
      completed: hasPortfolio,
      isMandatory: false,
      description: 'Sample photographs, event footage, or catalogue media',
    },
    {
      id: 'items',
      section: isOrder ? 'Products & Inventory Catalog' : 'Services & Packages',
      weight: 15,
      completed: hasItems,
      isMandatory: true,
      description: isOrder ? 'Active product lines ready for order or rental' : 'At least one bookable event package or service',
    },
    {
      id: 'pricing',
      section: 'Pricing Structure',
      weight: 10,
      completed: hasPricing,
      isMandatory: true,
      description: 'Transparent base prices, hourly/daily units, or fixed tiers',
    },
    {
      id: 'operations',
      section: isOrder ? 'Inventory Stocks & Warehouse' : 'Availability Calendar',
      weight: 10,
      completed: hasOps,
      isMandatory: false,
      description: isOrder ? 'Stock levels and fulfillment buffer' : 'Available booking dates and operating hours',
    },
    {
      id: 'bank',
      section: 'Bank & Payout Information',
      weight: 10,
      completed: hasBank,
      isMandatory: false,
      description: 'Direct deposit bank details or UPI ID for payout settlement',
    },
  ];

  const totalSum = breakdown.reduce((sum, item) => sum + (item.completed ? item.weight : 0), 0);
  const mandatoryItems = breakdown.filter(i => i.isMandatory);
  const missingMandatory = mandatoryItems.filter(i => !i.completed).map(i => i.section);

  // Do not display 100% until all mandatory sections are complete
  let finalPercentage = totalSum;
  if (missingMandatory.length > 0 && finalPercentage >= 100) {
    finalPercentage = 90;
  }

  return {
    percentage: Math.min(100, Math.max(0, finalPercentage)),
    isReadyForActivation: missingMandatory.length === 0,
    breakdown,
    missingMandatory,
  };
}
export function calculateProfileCompleteness(
  profile: Partial<ProfessionalProfile>,
  serviceCount: number = 0,
  workCount: number = 0
): { percentage: number; breakdown: { section: string; weight: number; completed: boolean }[] } {
  const breakdown = [
    {
      section: 'Personal Information',
      weight: 15,
      completed: Boolean(profile.name && profile.email && profile.phone && profile.avatar),
    },
    {
      section: 'Business Information',
      weight: 20,
      completed: Boolean(
        profile.businessName &&
        profile.category &&
        profile.description &&
        profile.coverageArea &&
        (profile.experienceYears !== undefined && profile.experienceYears > 0)
      ),
    },
    {
      section: 'Services & Pricing',
      weight: 20,
      completed: serviceCount > 0,
    },
    {
      section: 'Business Verification (KYC)',
      weight: 15,
      completed: Boolean(
        profile.verificationInfo?.panNumber &&
        profile.verificationInfo?.documentType &&
        profile.verificationInfo?.documentType !== 'Not Submitted'
      ),
    },
    {
      section: 'Portfolio & Works',
      weight: 20,
      completed: workCount > 0,
    },
    {
      section: 'Availability & Location',
      weight: 10,
      completed: Boolean(profile.location && profile.coverageArea),
    },
  ];

  const percentage = breakdown.reduce(
    (total, item) => total + (item.completed ? item.weight : 0),
    0
  );

  return { percentage, breakdown };
}

/**
 * Calculates quotation line total based on pricing model and booking factors
 */
export function calculateServiceCost(
  service: ServiceItem,
  quantity: number = 1,
  guestCount: number = 1
): number {
  switch (service.pricingModel) {
    case 'per_person':
      return service.basePrice * (guestCount || 1);
    case 'per_day':
    case 'per_hour':
    case 'per_item':
      return service.basePrice * (quantity || 1);
    case 'fixed':
    case 'custom':
    default:
      return service.basePrice;
  }
}

/**
 * Get pricing model display text
 */
export function getPricingModelLabel(model: PricingModel, unit?: string): string {
  switch (model) {
    case 'per_person':
      return 'per person';
    case 'per_day':
      return 'per day';
    case 'per_hour':
      return 'per hour';
    case 'per_item':
      return unit ? `per ${unit}` : 'per item';
    case 'fixed':
      return 'fixed package';
    case 'custom':
      return 'custom quotation';
    default:
      return '';
  }
}
