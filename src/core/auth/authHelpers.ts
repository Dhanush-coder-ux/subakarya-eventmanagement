import { CustomerProfile, ProfessionalProfile, Role } from '../../types';

export const isCustomerProfile = (
  user: CustomerProfile | ProfessionalProfile
): user is CustomerProfile => {
  return user.role === 'customer';
};

export const isProfessionalProfile = (
  user: CustomerProfile | ProfessionalProfile
): user is ProfessionalProfile => {
  return user.role === 'professional';
};

export const getDisplayName = (user: CustomerProfile | ProfessionalProfile): string => {
  if (isProfessionalProfile(user) && user.businessName) {
    return user.businessName;
  }
  return user.name || 'User';
};

export const getInitials = (name: string): string => {
  if (!name) return 'S';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

