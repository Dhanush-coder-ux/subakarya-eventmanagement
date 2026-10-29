import { Role } from '../../types';

export type AppFeature =
  | 'discovery'
  | 'reels'
  | 'search'
  | 'chat'
  | 'bookings'
  | 'vendorDashboard'
  | 'serviceManagement'
  | 'inventoryManagement'
  | 'calendarManagement'
  | 'availabilityManagement'
  | 'portfolioManagement'
  | 'publicProfile';

export const profileFeatureConfig: Record<Role, Record<AppFeature, boolean>> = {
  customer: {
    discovery: true,
    reels: true,
    search: true,
    chat: true,
    bookings: true,
    vendorDashboard: false,
    serviceManagement: false,
    inventoryManagement: false,
    calendarManagement: false,
    availabilityManagement: false,
    portfolioManagement: false,
    publicProfile: true,
  },
  professional: {
    discovery: true,
    reels: true,
    search: true,
    chat: true,
    bookings: true,
    vendorDashboard: true,
    serviceManagement: true,
    inventoryManagement: true,
    calendarManagement: true,
    availabilityManagement: true,
    portfolioManagement: true,
    publicProfile: true,
  },
};
