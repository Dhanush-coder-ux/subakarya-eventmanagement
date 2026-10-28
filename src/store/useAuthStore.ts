import { create } from 'zustand';
import { CustomerProfile, ProfessionalProfile, Role } from '../types';
import { mockCustomers, mockProfessionals } from '../data/mockUsers';

const AUTH_STORAGE_KEY = 'soiree_auth_state_v1';

interface AuthState {
  currentUser: CustomerProfile | ProfessionalProfile;
  accountType: Role;
  isLoggedIn: boolean;
  allCustomers: CustomerProfile[];
  allProfessionals: ProfessionalProfile[];

  // Actions
  login: (email?: string, role?: Role, specificUserId?: string) => void;
  logout: () => void;
  setAccountType: (type: Role) => void;
  switchActiveUser: (userId: string) => void;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => void;
  updateProfessionalProfile: (data: Partial<ProfessionalProfile>) => void;
  resetAuthData: () => void;
}

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        currentUser: parsed.currentUser || mockCustomers[0],
        accountType: parsed.accountType || 'customer',
        isLoggedIn: parsed.isLoggedIn ?? true,
        allCustomers: parsed.allCustomers || mockCustomers,
        allProfessionals: parsed.allProfessionals || mockProfessionals,
      };
    }
  } catch {
    // fallback
  }

  return {
    currentUser: mockCustomers[0],
    accountType: 'customer' as Role,
    isLoggedIn: false,
    allCustomers: mockCustomers,
    allProfessionals: mockProfessionals,
  };
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: initialState.currentUser,
  accountType: initialState.accountType,
  isLoggedIn: initialState.isLoggedIn,
  allCustomers: initialState.allCustomers,
  allProfessionals: initialState.allProfessionals,

  login: (_email?: string, role: Role = 'customer', specificUserId?: string) => {
    const { allCustomers, allProfessionals } = get();
    let targetUser: CustomerProfile | ProfessionalProfile;

    if (specificUserId) {
      const found = [...allCustomers, ...allProfessionals].find(u => u.id === specificUserId);
      if (found) {
        targetUser = found;
        set({
          currentUser: targetUser,
          accountType: targetUser.role,
          isLoggedIn: true,
        });
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
        return;
      }
    }

    if (role === 'professional') {
      targetUser = allProfessionals[0];
    } else {
      targetUser = allCustomers[0];
    }

    set({
      currentUser: targetUser,
      accountType: role,
      isLoggedIn: true,
    });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  logout: () => {
    set({ isLoggedIn: false });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  setAccountType: (type: Role) => {
    const { allCustomers, allProfessionals } = get();
    const newUser = type === 'professional' ? allProfessionals[0] : allCustomers[0];
    set({
      accountType: type,
      currentUser: newUser,
      isLoggedIn: true,
    });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  switchActiveUser: (userId: string) => {
    const { allCustomers, allProfessionals } = get();
    const user = [...allCustomers, ...allProfessionals].find(u => u.id === userId);
    if (user) {
      set({
        currentUser: user,
        accountType: user.role,
        isLoggedIn: true,
      });
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
    }
  },

  updateCustomerProfile: (data: Partial<CustomerProfile>) => {
    const { currentUser, allCustomers } = get();
    if (currentUser.role !== 'customer') return;

    const updatedUser = { ...currentUser, ...data } as CustomerProfile;
    const updatedCustomers = allCustomers.map(c => (c.id === updatedUser.id ? updatedUser : c));

    set({
      currentUser: updatedUser,
      allCustomers: updatedCustomers,
    });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  updateProfessionalProfile: (data: Partial<ProfessionalProfile>) => {
    const { currentUser, allProfessionals } = get();
    if (currentUser.role !== 'professional') return;

    const updatedUser = { ...currentUser, ...data } as ProfessionalProfile;
    const updatedPros = allProfessionals.map(p => (p.id === updatedUser.id ? updatedUser : p));

    set({
      currentUser: updatedUser,
      allProfessionals: updatedPros,
    });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  resetAuthData: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    set({
      currentUser: mockCustomers[0],
      accountType: 'customer',
      isLoggedIn: true,
      allCustomers: mockCustomers,
      allProfessionals: mockProfessionals,
    });
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        currentUser: mockCustomers[0],
        accountType: 'customer',
        isLoggedIn: true,
        allCustomers: mockCustomers,
        allProfessionals: mockProfessionals,
      })
    );
  },
}));
