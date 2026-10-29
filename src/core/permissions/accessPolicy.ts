import { Role } from '../../types';

export interface RoutePolicy {
  path: string;
  allowedRoles: Role[];
  requiresAuth: boolean;
  redirectTo?: string;
}

export const routePolicies: RoutePolicy[] = [
  // Public / Auth routes
  { path: '/login', allowedRoles: ['customer', 'professional'], requiresAuth: false },
  { path: '/account-type', allowedRoles: ['customer', 'professional'], requiresAuth: false },
  { path: '/onboarding/customer', allowedRoles: ['customer'], requiresAuth: false },
  { path: '/onboarding/professional', allowedRoles: ['professional'], requiresAuth: false },

  // Shared authenticated routes
  { path: '/', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/reels', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/search', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/chat', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/chat/:conversationId', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/messages/:conversationId', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/profile', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/profile/:id', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/bookings', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/settings', allowedRoles: ['customer', 'professional'], requiresAuth: true },

  // Consumer Booking exploration
  { path: '/professionals/:professionalId/book', allowedRoles: ['customer', 'professional'], requiresAuth: true },
  { path: '/professionals/:professionalId/availability', allowedRoles: ['customer', 'professional'], requiresAuth: true },

  // Vendor-only routes
  { path: '/dashboard', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/services', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/inventory', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/portfolio', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/availability', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/professional/availability', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/calendar', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/professional/calendar', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/' },
  { path: '/professional/bookings', allowedRoles: ['professional'], requiresAuth: true, redirectTo: '/bookings' },
];

