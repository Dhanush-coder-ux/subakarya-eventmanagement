import { Role } from '../../types';

export interface AppRouteDefinition {
  path: string;
  label?: string;
  requiresAuth: boolean;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export const routes = {
  // Public / Onboarding
  login: '/login',
  accountType: '/account-type',
  consumerOnboarding: '/onboarding/customer',
  professionalOnboarding: '/onboarding/professional',

  // Shared
  home: '/',
  reels: '/reels',
  search: '/search',
  chat: '/chat',
  chatConversation: '/chat/:conversationId',
  messagesConversation: '/messages/:conversationId',
  profile: '/profile',
  profileWithId: '/profile/:id',
  bookings: '/bookings',
  settings: '/settings',

  // Consumer Booking & Availability
  bookProfessional: '/professionals/:professionalId/book',
  professionalAvailabilityView: '/professionals/:professionalId/availability',

  // Vendor Management
  vendorDashboard: '/dashboard',
  vendorServices: '/services',
  vendorInventory: '/inventory',
  vendorPortfolio: '/portfolio',
  vendorAvailability: '/availability',
  vendorAvailabilityAlt: '/professional/availability',
  vendorCalendar: '/calendar',
  vendorCalendarAlt: '/professional/calendar',
  vendorBookings: '/professional/bookings',
} as const;

