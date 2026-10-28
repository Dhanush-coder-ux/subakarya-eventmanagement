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

/**
 * Dynamic profile completeness calculation
 * Personal information: 15%
 * Business information: 20%
 * Services and pricing: 20%
 * Verification information: 15%
 * Portfolio: 20%
 * Availability and contact information: 10%
 */
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
