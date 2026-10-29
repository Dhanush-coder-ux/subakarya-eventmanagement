import React, { createContext, useContext, useMemo } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { CustomerProfile, ProfessionalProfile, Role } from '../../types';
import { permissionService } from '../../core/permissions/permissionService';
import { AppFeature } from '../../core/permissions/permissionConfig';

export interface AuthContextValue {
  currentUser: CustomerProfile | ProfessionalProfile;
  accountType: Role;
  isLoggedIn: boolean;
  isCustomer: boolean;
  isProfessional: boolean;
  hasFeature: (feature: AppFeature) => boolean;
  login: (email?: string, role?: Role, specificUserId?: string) => void;
  logout: () => void;
  setAccountType: (type: Role) => void;
  switchActiveUser: (userId: string) => void;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => void;
  updateProfessionalProfile: (data: Partial<ProfessionalProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    accountType,
    isLoggedIn,
    login,
    logout,
    setAccountType,
    switchActiveUser,
    updateCustomerProfile,
    updateProfessionalProfile,
  } = useAuthStore();

  const isCustomer = accountType === 'customer';
  const isProfessional = accountType === 'professional';

  const value = useMemo<AuthContextValue>(() => {
    return {
      currentUser,
      accountType,
      isLoggedIn,
      isCustomer,
      isProfessional,
      hasFeature: (feature: AppFeature) => permissionService.canAccessFeature(accountType, feature),
      login,
      logout,
      setAccountType,
      switchActiveUser,
      updateCustomerProfile,
      updateProfessionalProfile,
    };
  }, [
    currentUser,
    accountType,
    isLoggedIn,
    isCustomer,
    isProfessional,
    login,
    logout,
    setAccountType,
    switchActiveUser,
    updateCustomerProfile,
    updateProfessionalProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

