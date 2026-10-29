import { useAuthStore } from '../../store/useAuthStore';
import { CustomerProfile, ProfessionalProfile, Role } from '../../types';
import { sessionService } from './sessionService';

export const authService = {
  getCurrentUser(): CustomerProfile | ProfessionalProfile {
    return useAuthStore.getState().currentUser;
  },

  getCurrentRole(): Role {
    return useAuthStore.getState().accountType;
  },

  isAuthenticated(): boolean {
    return useAuthStore.getState().isLoggedIn;
  },

  login(email?: string, role: Role = 'customer', specificUserId?: string): void {
    useAuthStore.getState().login(email, role, specificUserId);
  },

  logout(): void {
    sessionService.clearAuthToken();
    useAuthStore.getState().logout();
  },

  setRole(role: Role): void {
    useAuthStore.getState().setAccountType(role);
  },

  switchPersona(userId: string): void {
    useAuthStore.getState().switchActiveUser(userId);
  },

  updateProfile(data: Partial<CustomerProfile | ProfessionalProfile>): void {
    const role = useAuthStore.getState().accountType;
    if (role === 'customer') {
      useAuthStore.getState().updateCustomerProfile(data as Partial<CustomerProfile>);
    } else {
      useAuthStore.getState().updateProfessionalProfile(data as Partial<ProfessionalProfile>);
    }
  },

  resetAllData(): void {
    useAuthStore.getState().resetAuthData();
  },
};
