import { create } from 'zustand';
import {
  CustomerProfile,
  ProfessionalProfile,
  Role,
  AccountExperience,
  KYCStatus,
  UserAccount,
  PersonalProfile,
  ServiceCategory,
} from '../types';
import { mockCustomers, mockProfessionals } from '../data/mockUsers';

const AUTH_STORAGE_KEY = 'subakarya_auth_single_account_v2';

interface AuthState {
  userAccount: UserAccount;
  activeExperience: AccountExperience;
  currentUser: CustomerProfile | ProfessionalProfile;
  accountType: Role;
  isLoggedIn: boolean;
  allCustomers: CustomerProfile[];
  allProfessionals: ProfessionalProfile[];
  isMobileMenuOpen: boolean;

  // Actions
  login: (email?: string, role?: Role, specificUserId?: string) => void;
  logout: () => void;
  registerPersonalUser: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password?: string;
  }) => void;
  activateProfessionalProfile: (data: Partial<ProfessionalProfile>) => void;
  switchExperience: (experience: AccountExperience) => void;
  updatePersonalProfile: (data: Partial<PersonalProfile> & { fullName?: string; phone?: string }) => void;
  updateProfessionalProfile: (data: Partial<ProfessionalProfile>) => void;
  updateProfessionalKYC: (kycData: {
    panNumber?: string;
    panHolderName?: string;
    businessType?: string;
    legalBusinessName?: string;
    gstin?: string;
    status?: KYCStatus;
  }) => void;
  // Backwards compatibility actions
  setAccountType: (type: Role) => void;
  switchActiveUser: (userId: string) => void;
  updateCustomerProfile: (data: Partial<CustomerProfile>) => void;
  resetAuthData: () => void;
  toggleMobileMenu: (open?: boolean) => void;
}

// Default personal user account
const DEFAULT_USER_ACCOUNT: UserAccount = {
  id: 'user-priya-1',
  fullName: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+91 98450 12345',
  createdAt: '2026-01-15T10:00:00Z',
  activeExperience: 'PERSONAL',
  personalProfile: {
    id: 'user-priya-1',
    fullName: 'Priya Sharma',
    username: 'priya_events',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Curator & aesthetic event planner in Tamil Nadu ✨ Planning memorable celebrations and finding top wedding artists.',
    location: 'Madurai, Tamil Nadu',
    website: 'https://subakarya.com/@priya_events',
    followersCount: 342,
    followingCount: 188,
    followingIds: ['pro-1', 'pro-2'],
    savedPostIds: ['post-1', 'post-3'],
    savedReelIds: ['reel-1'],
    approvedRepostIds: ['repost-1'],
  },
  // Optional professional profile initially unactivated or ready to configure
  professionalProfile: undefined,
};

// Map UserAccount + activeExperience to currentUser (CustomerProfile | ProfessionalProfile)
export function deriveCurrentUser(account: UserAccount): CustomerProfile | ProfessionalProfile {
  if (account.activeExperience === 'PROFESSIONAL' && account.professionalProfile) {
    const pro = account.professionalProfile;
    const isVerified = pro.kycStatus === 'VERIFIED';
    return {
      id: pro.professionalId || account.id,
      name: account.fullName,
      email: pro.businessEmail || account.email,
      phone: pro.contact || account.phone || '+91 94432 87654',
      avatar: pro.avatar || account.personalProfile.avatar,
      role: 'professional',
      location: pro.location || account.personalProfile.location,
      createdAt: account.createdAt,
      businessName: pro.businessName || `${account.fullName} Events`,
      businessType: pro.businessType || 'Sole Proprietorship',
      category: (pro.category as ServiceCategory) || 'Photographer & Videographer',
      description: pro.description || 'Professional event and celebration services',
      coverageArea: pro.coverageArea || pro.location || account.personalProfile.location,
      experienceYears: pro.experienceYears || 5,
      isVerified,
      minBookingAmount: pro.minBookingAmount || 20000,
      verificationInfo: pro.verificationInfo || {
        panNumber: pro.panNumber || 'AAAPL1234K',
        documentType: 'PAN Card',
        verificationStatus: isVerified ? 'verified' : 'pending',
        businessRegNumber: pro.legalBusinessName ? `REG-${account.id.slice(0, 6)}` : undefined,
      },
      kycStatus: pro.kycStatus || 'NOT_SUBMITTED',
      panNumber: pro.panNumber,
      panHolderName: pro.panHolderName,
      legalBusinessName: pro.legalBusinessName,
      gstin: pro.gstin,
      verificationStatus: isVerified ? 'VERIFIED' : pro.verificationStatus || 'PENDING',
      businessMode: pro.businessMode || 'BOOKING_BASED',
      profileCompletion: pro.profileCompletion || 80,
      isActive: true,
      followersCount: pro.followersCount || 1240,
      followingIds: pro.followingIds || ['pro-2', 'pro-4'],
      profileCompleteness: pro.profileCompletion || 80,
      hasPersonalDone: true,
      hasBusinessDone: true,
      hasServicesDone: true,
      hasVerificationDone: Boolean(pro.panNumber),
      hasPortfolioDone: true,
      hasAvailabilityDone: true,
    } as ProfessionalProfile;
  }

  // Personal Customer Profile
  return {
    id: account.id,
    name: account.fullName,
    email: account.email,
    phone: account.phone || '',
    avatar: account.personalProfile.avatar,
    role: 'customer',
    location: account.personalProfile.location,
    createdAt: account.createdAt,
    username: account.personalProfile.username,
    bio: account.personalProfile.bio,
    website: account.personalProfile.website,
    savedPostIds: account.personalProfile.savedPostIds || [],
    savedReelIds: account.personalProfile.savedReelIds || [],
    followingIds: account.personalProfile.followingIds || [],
  } as CustomerProfile;
}

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const userAccount = parsed.userAccount || DEFAULT_USER_ACCOUNT;
      const activeExperience: AccountExperience = userAccount.activeExperience || 'PERSONAL';
      const currentUser = deriveCurrentUser(userAccount);
      return {
        userAccount,
        activeExperience,
        currentUser,
        accountType: (activeExperience === 'PROFESSIONAL' ? 'professional' : 'customer') as Role,
        isLoggedIn: parsed.isLoggedIn ?? true,
        allCustomers: parsed.allCustomers || mockCustomers,
        allProfessionals: parsed.allProfessionals || mockProfessionals,
      };
    }
  } catch {
    // fallback
  }

  const defaultUser = DEFAULT_USER_ACCOUNT;
  return {
    userAccount: defaultUser,
    activeExperience: 'PERSONAL' as AccountExperience,
    currentUser: deriveCurrentUser(defaultUser),
    accountType: 'customer' as Role,
    isLoggedIn: true,
    allCustomers: mockCustomers,
    allProfessionals: mockProfessionals,
  };
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  userAccount: initialState.userAccount,
  activeExperience: initialState.activeExperience,
  currentUser: initialState.currentUser,
  accountType: initialState.accountType,
  isLoggedIn: initialState.isLoggedIn,
  allCustomers: initialState.allCustomers,
  allProfessionals: initialState.allProfessionals,
  isMobileMenuOpen: false,

  toggleMobileMenu: (open?: boolean) => {
    set((state) => ({
      isMobileMenuOpen: open !== undefined ? open : !state.isMobileMenuOpen,
    }));
  },

  // Normal login: Logs user into personal account without asking for role
  login: (_email?: string, role?: Role, specificUserId?: string) => {
    const { allCustomers, allProfessionals } = get();

    if (specificUserId) {
      const found = [...allCustomers, ...allProfessionals].find((u) => u.id === specificUserId);
      if (found) {
        if (found.role === 'professional') {
          const proFound = found as ProfessionalProfile;
          const userAccount: UserAccount = {
            id: proFound.id,
            fullName: proFound.name,
            email: proFound.email,
            phone: proFound.phone,
            createdAt: proFound.createdAt,
            activeExperience: 'PROFESSIONAL',
            personalProfile: {
              fullName: proFound.name,
              username: proFound.name.toLowerCase().replace(/\s+/g, '_'),
              avatar: proFound.avatar,
              bio: `Professional: ${proFound.businessName}`,
              location: proFound.location,
            },
            professionalProfile: proFound,
          };
          set({
            userAccount,
            activeExperience: 'PROFESSIONAL',
            currentUser: deriveCurrentUser(userAccount),
            accountType: 'professional',
            isLoggedIn: true,
          });
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
          return;
        }
      }
    }

    // Default: Log in directly to normal personal account
    const exp: AccountExperience = role === 'professional' ? 'PROFESSIONAL' : 'PERSONAL';
    const currentAcc = get().userAccount;
    const updatedAcc: UserAccount = {
      ...currentAcc,
      activeExperience: exp,
    };

    set({
      userAccount: updatedAcc,
      activeExperience: exp,
      currentUser: deriveCurrentUser(updatedAcc),
      accountType: exp === 'PROFESSIONAL' ? 'professional' : 'customer',
      isLoggedIn: true,
    });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  logout: () => {
    set({ isLoggedIn: false });
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  // Step 1 of Instagram-style auth: Register personal account ONLY (no role / no KYC)
  registerPersonalUser: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password?: string;
  }) => {
    const newId = `user-${Date.now()}`;
    const username = data.fullName.toLowerCase().replace(/[^a-z0-9_]/g, '') || `user_${Date.now().toString().slice(-4)}`;

    const newPersonalProfile: PersonalProfile = {
      id: newId,
      fullName: data.fullName,
      username,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: `Hello! I'm ${data.fullName} on Subakarya.`,
      location: 'India',
      email: data.email,
      phone: data.phone,
      followersCount: 0,
      followingCount: 0,
      followingIds: [],
      savedPostIds: [],
      savedReelIds: [],
    };

    const newAccount: UserAccount = {
      id: newId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      activeExperience: 'PERSONAL',
      personalProfile: newPersonalProfile,
      professionalProfile: undefined, // Opt-in later via "Become a Professional"
    };

    set({
      userAccount: newAccount,
      activeExperience: 'PERSONAL',
      currentUser: deriveCurrentUser(newAccount),
      accountType: 'customer',
      isLoggedIn: true,
    });

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  // Activate / upgrade to professional mode without creating duplicate accounts
  activateProfessionalProfile: (data: Partial<ProfessionalProfile>) => {
    const { userAccount, allProfessionals } = get();

    const proId = data.professionalId || `pro-${userAccount.id}`;
    const updatedProProfile: ProfessionalProfile = {
      id: proId,
      professionalId: proId,
      name: userAccount.fullName,
      email: data.businessEmail || userAccount.email,
      phone: data.contact || userAccount.phone || '',
      avatar: data.avatar || userAccount.personalProfile.avatar,
      role: 'professional',
      businessName: data.businessName || `${userAccount.fullName} Events`,
      businessType: data.businessType || 'Sole Proprietorship',
      category: data.category || 'Photographer & Videographer',
      description: data.description || 'Premium event services and experiences',
      location: data.location || userAccount.personalProfile.location,
      coverageArea: data.coverageArea || data.location || userAccount.personalProfile.location,
      experienceYears: data.experienceYears || 3,
      isVerified: data.kycStatus === 'VERIFIED',
      minBookingAmount: data.minBookingAmount || 15000,
      verificationInfo: data.verificationInfo || {
        panNumber: data.panNumber,
        documentType: 'PAN Card',
        verificationStatus: data.kycStatus === 'VERIFIED' ? 'verified' : 'pending',
      },
      kycStatus: data.kycStatus || 'PENDING',
      panNumber: data.panNumber,
      panHolderName: data.panHolderName,
      legalBusinessName: data.legalBusinessName,
      gstin: data.gstin,
      verificationStatus: data.kycStatus === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
      businessMode: data.businessMode || 'BOOKING_BASED',
      profileCompletion: data.profileCompletion || 85,
      isActive: true,
      followersCount: userAccount.personalProfile.followersCount || 150,
      followingIds: userAccount.personalProfile.followingIds || [],
      profileCompleteness: data.profileCompletion || 85,
      hasPersonalDone: true,
      hasBusinessDone: true,
      hasServicesDone: true,
      hasVerificationDone: Boolean(data.panNumber),
      hasPortfolioDone: true,
      hasAvailabilityDone: true,
      createdAt: userAccount.createdAt,
    };

    const updatedAccount: UserAccount = {
      ...userAccount,
      professionalProfile: updatedProProfile,
      activeExperience: 'PROFESSIONAL',
    };

    // Keep allProfessionals in sync for directory discovery
    const existingIndex = allProfessionals.findIndex((p) => p.id === proId);
    let newProfessionals = [...allProfessionals];
    if (existingIndex >= 0) {
      newProfessionals[existingIndex] = updatedProProfile;
    } else {
      newProfessionals = [updatedProProfile, ...newProfessionals];
    }

    set({
      userAccount: updatedAccount,
      activeExperience: 'PROFESSIONAL',
      currentUser: deriveCurrentUser(updatedAccount),
      accountType: 'professional',
      allProfessionals: newProfessionals,
    });

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  // Seamlessly switch experience preserving all data
  switchExperience: (experience: AccountExperience) => {
    const { userAccount } = get();

    // If switching to professional but no profile exists yet, create default draft
    let updatedPro = userAccount.professionalProfile;
    if (experience === 'PROFESSIONAL' && !updatedPro) {
      updatedPro = {
        id: `pro-${userAccount.id}`,
        professionalId: `pro-${userAccount.id}`,
        name: userAccount.fullName,
        email: userAccount.email,
        phone: userAccount.phone || '',
        avatar: userAccount.personalProfile.avatar,
        role: 'professional',
        businessName: `${userAccount.fullName} Events`,
        businessType: 'Sole Proprietorship',
        category: 'Event Organizer',
        description: 'Bespoke event planning and celebration management',
        location: userAccount.personalProfile.location,
        coverageArea: userAccount.personalProfile.location,
        experienceYears: 4,
        isVerified: false,
        minBookingAmount: 15000,
        verificationInfo: {
          documentType: 'Not Submitted',
          verificationStatus: 'unverified',
        },
        kycStatus: 'NOT_SUBMITTED',
        verificationStatus: 'UNVERIFIED',
        businessMode: 'BOOKING_BASED',
        profileCompletion: 70,
        isActive: true,
        followersCount: userAccount.personalProfile.followersCount || 100,
        followingIds: userAccount.personalProfile.followingIds || [],
        profileCompleteness: 70,
        hasPersonalDone: true,
        hasBusinessDone: true,
        hasServicesDone: true,
        hasVerificationDone: false,
        hasPortfolioDone: false,
        hasAvailabilityDone: true,
        createdAt: userAccount.createdAt,
      };
    }

    const updatedAccount: UserAccount = {
      ...userAccount,
      professionalProfile: updatedPro,
      activeExperience: experience,
    };

    set({
      userAccount: updatedAccount,
      activeExperience: experience,
      currentUser: deriveCurrentUser(updatedAccount),
      accountType: experience === 'PROFESSIONAL' ? 'professional' : 'customer',
    });

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  updatePersonalProfile: (data: Partial<PersonalProfile> & { fullName?: string; phone?: string }) => {
    const { userAccount } = get();

    const updatedPersonal: PersonalProfile = {
      ...userAccount.personalProfile,
      ...data,
      fullName: data.fullName || userAccount.personalProfile.fullName,
      phone: data.phone || userAccount.personalProfile.phone,
    };

    const updatedAccount: UserAccount = {
      ...userAccount,
      fullName: data.fullName || userAccount.fullName,
      phone: data.phone || userAccount.phone,
      personalProfile: updatedPersonal,
    };

    set({
      userAccount: updatedAccount,
      currentUser: deriveCurrentUser(updatedAccount),
    });

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  updateProfessionalProfile: (data: Partial<ProfessionalProfile>) => {
    const { userAccount, allProfessionals } = get();
    if (!userAccount.professionalProfile) return;

    const updatedPro: ProfessionalProfile = {
      ...userAccount.professionalProfile,
      ...data,
    };

    const updatedAccount: UserAccount = {
      ...userAccount,
      professionalProfile: updatedPro,
    };

    const updatedPros = allProfessionals.map((p) =>
      p.id === updatedPro.id ? updatedPro : p
    );

    set({
      userAccount: updatedAccount,
      currentUser: deriveCurrentUser(updatedAccount),
      allProfessionals: updatedPros,
    });

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
  },

  updateProfessionalKYC: (kycData) => {
    const { userAccount } = get();
    if (!userAccount.professionalProfile) return;

    const status: KYCStatus = kycData.status || (kycData.panNumber ? 'PENDING' : 'NOT_SUBMITTED');

    get().updateProfessionalProfile({
      kycStatus: status,
      panNumber: kycData.panNumber || userAccount.professionalProfile.panNumber,
      panHolderName: kycData.panHolderName || userAccount.professionalProfile.panHolderName,
      businessType: kycData.businessType || userAccount.professionalProfile.businessType,
      legalBusinessName: kycData.legalBusinessName || userAccount.professionalProfile.legalBusinessName,
      gstin: kycData.gstin || userAccount.professionalProfile.gstin,
      verificationStatus: status === 'VERIFIED' ? 'VERIFIED' : 'PENDING',
    });
  },

  // Backwards compatibility for existing components
  setAccountType: (type: Role) => {
    get().switchExperience(type === 'professional' ? 'PROFESSIONAL' : 'PERSONAL');
  },

  switchActiveUser: (userId: string) => {
    const { allCustomers, allProfessionals } = get();
    const foundPro = allProfessionals.find((p) => p.id === userId);
    if (foundPro) {
      const userAccount: UserAccount = {
        id: foundPro.id,
        fullName: foundPro.name,
        email: foundPro.email,
        phone: foundPro.phone,
        createdAt: foundPro.createdAt,
        activeExperience: 'PROFESSIONAL',
        personalProfile: {
          fullName: foundPro.name,
          username: foundPro.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: foundPro.avatar,
          bio: `Professional Profile for ${foundPro.businessName}`,
          location: foundPro.location,
        },
        professionalProfile: foundPro,
      };
      set({
        userAccount,
        activeExperience: 'PROFESSIONAL',
        currentUser: deriveCurrentUser(userAccount),
        accountType: 'professional',
        isLoggedIn: true,
      });
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
      return;
    }

    const foundCust = allCustomers.find((c) => c.id === userId);
    if (foundCust) {
      const userAccount: UserAccount = {
        id: foundCust.id,
        fullName: foundCust.name,
        email: foundCust.email,
        phone: foundCust.phone,
        createdAt: foundCust.createdAt,
        activeExperience: 'PERSONAL',
        personalProfile: {
          fullName: foundCust.name,
          username: foundCust.name.toLowerCase().replace(/\s+/g, '_'),
          avatar: foundCust.avatar,
          bio: foundCust.location,
          location: foundCust.location,
          savedPostIds: foundCust.savedPostIds,
          savedReelIds: foundCust.savedReelIds,
          followingIds: foundCust.followingIds,
        },
        professionalProfile: undefined,
      };
      set({
        userAccount,
        activeExperience: 'PERSONAL',
        currentUser: deriveCurrentUser(userAccount),
        accountType: 'customer',
        isLoggedIn: true,
      });
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(get()));
    }
  },

  updateCustomerProfile: (data: Partial<CustomerProfile>) => {
    get().updatePersonalProfile({
      fullName: data.name,
      avatar: data.avatar,
      location: data.location,
      phone: data.phone,
    });
  },

  resetAuthData: () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    const defaultAcc = DEFAULT_USER_ACCOUNT;
    set({
      userAccount: defaultAcc,
      activeExperience: 'PERSONAL',
      currentUser: deriveCurrentUser(defaultAcc),
      accountType: 'customer',
      isLoggedIn: true,
      allCustomers: mockCustomers,
      allProfessionals: mockProfessionals,
    });
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        userAccount: defaultAcc,
        activeExperience: 'PERSONAL',
        currentUser: deriveCurrentUser(defaultAcc),
        accountType: 'customer',
        isLoggedIn: true,
        allCustomers: mockCustomers,
        allProfessionals: mockProfessionals,
      })
    );
  },
}));
