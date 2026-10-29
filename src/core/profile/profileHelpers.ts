import { CustomerProfile, ProfessionalProfile } from '../../types';

export const isProfileComplete = (profile: CustomerProfile | ProfessionalProfile): boolean => {
  if (profile.role === 'customer') {
    return Boolean(profile.name && profile.phone && profile.location);
  }
  const pro = profile as ProfessionalProfile;
  return Boolean(
    pro.businessName &&
    pro.category &&
    pro.location &&
    pro.phone &&
    pro.description
  );
};

export const calculateProfileCompleteness = (profile: ProfessionalProfile): number => {
  let score = 0;
  if (profile.name && profile.phone) score += 15;
  if (profile.businessName && profile.category && profile.location) score += 20;
  if (profile.description && profile.experienceYears) score += 20;
  if (profile.avatar) score += 15;
  if (profile.isVerified) score += 15;
  if (profile.minBookingAmount) score += 15;
  return Math.min(score, 100);
};
