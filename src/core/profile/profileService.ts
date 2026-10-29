import { useAuthStore } from '../../store/useAuthStore';
import { CustomerProfile, ProfessionalProfile } from '../../types';
import { isProfileComplete, calculateProfileCompleteness } from './profileHelpers';

export const profileService = {
  getCurrentProfile(): CustomerProfile | ProfessionalProfile {
    return useAuthStore.getState().currentUser;
  },

  getAllCustomers(): CustomerProfile[] {
    return useAuthStore.getState().allCustomers;
  },

  getAllProfessionals(): ProfessionalProfile[] {
    return useAuthStore.getState().allProfessionals;
  },

  findProfileById(id: string): CustomerProfile | ProfessionalProfile | undefined {
    const { allCustomers, allProfessionals } = useAuthStore.getState();
    return (
      allCustomers.find((c) => c.id === id) ||
      allProfessionals.find((p) => p.id === id)
    );
  },

  isComplete(profile?: CustomerProfile | ProfessionalProfile): boolean {
    const p = profile || this.getCurrentProfile();
    return isProfileComplete(p);
  },

  getCompletenessScore(profile?: ProfessionalProfile): number {
    const p = (profile || this.getCurrentProfile()) as ProfessionalProfile;
    if (p.role !== 'professional') return 100;
    return calculateProfileCompleteness(p);
  },
};

