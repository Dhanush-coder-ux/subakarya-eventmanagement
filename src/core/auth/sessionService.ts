import { CustomerProfile, ProfessionalProfile, Role } from '../../types';
import { appConfig } from '../config/appConfig';

export interface StoredSession {
  currentUser: CustomerProfile | ProfessionalProfile;
  accountType: Role;
  isLoggedIn: boolean;
  token?: string;
}

export const sessionService = {
  getSession(): StoredSession | null {
    try {
      const data = localStorage.getItem(appConfig.storageKeys.auth);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  saveSession(session: StoredSession): void {
    try {
      localStorage.setItem(appConfig.storageKeys.auth, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save auth session:', e);
    }
  },

  clearSession(): void {
    localStorage.removeItem(appConfig.storageKeys.auth);
  },

  getAuthToken(): string | null {
    return localStorage.getItem('subakarya_auth_token');
  },

  setAuthToken(token: string): void {
    localStorage.setItem('subakarya_auth_token', token);
  },

  clearAuthToken(): void {
    localStorage.removeItem('subakarya_auth_token');
  },
};

