import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Send,
  Repeat2,
  User,
  Package,
  Layers,
  Tag,
  Clock,
  RotateCcw,
  ShoppingBag,
  CreditCard,
  Building2,
  TrendingUp,
  Boxes,
  ClipboardList,
} from 'lucide-react';
import { VendorBusinessMode } from '../../types';

export interface BusinessModeFeatureConfig {
  mode: VendorBusinessMode;
  title: string;
  badgeLabel: string;
  tagline: string;
  description: string;
  examples: string[];
  featuresList: string[];
  features: {
    services: boolean;
    availability: boolean;
    bookings: boolean;
    quotations: boolean;
    products: boolean;
    inventory: boolean;
    orders: boolean;
    returns: boolean;
    salesAnalytics: boolean;
    serviceAnalytics: boolean;
    reposts: boolean;
    financialDashboard: boolean;
    chat: boolean;
    profile: boolean;
  };
  navigation: {
    primary: {
      label: string;
      path: string;
      icon: any;
      badgeKey?: 'unreadMessages' | 'pendingReposts' | 'pendingBookings' | 'pendingOrders';
    }[];
    secondaryTools: {
      label: string;
      path: string;
      icon: any;
      desc: string;
    }[];
    settingsSections: string[];
  };
}

export const BUSINESS_MODE_CONFIG: Record<VendorBusinessMode, BusinessModeFeatureConfig> = {
  BOOKING_BASED: {
    mode: 'BOOKING_BASED',
    title: 'Booking-Based Business',
    badgeLabel: 'Booking Mode',
    tagline: 'Service Provider & Event Planner Experience',
    description: 'For professionals who provide event services and manage customer bookings.',
    examples: [
      'Event organizers',
      'Wedding photographers',
      'Makeup artists',
      'Catering services',
      'Wedding decorators',
      'Event halls',
      'DJs and entertainers',
      'Event planners',
    ],
    featuresList: [
      'Professional dashboard',
      'Service management',
      'Service pricing',
      'Availability calendar',
      'Slot management',
      'Booking requests',
      'Quotations',
      'Booking history',
      'Customer communication',
      'Event scheduling',
      'Customer reviews',
      'Repost management',
    ],
    features: {
      services: true,
      availability: true,
      bookings: true,
      quotations: true,
      products: false,
      inventory: true, // optional equipment tracking
      orders: false,
      returns: false,
      salesAnalytics: false,
      serviceAnalytics: true,
      reposts: true,
      financialDashboard: true,
      chat: true,
      profile: true,
    },
    navigation: {
      primary: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Calendar', path: '/professional/calendar', icon: Calendar },
        { label: 'Bookings', path: '/bookings', icon: CalendarCheck, badgeKey: 'pendingBookings' },
        { label: 'Messages', path: '/chat', icon: Send, badgeKey: 'unreadMessages' },
        { label: 'Reposts', path: '/professional/repost-requests', icon: Repeat2, badgeKey: 'pendingReposts' },
        { label: 'Profile', path: '/profile', icon: User },
      ],
      secondaryTools: [
        { label: 'Repost Requests', path: '/professional/repost-requests', icon: Repeat2, desc: 'Review & approve client reels' },
        { label: 'Services & Pricing', path: '/services', icon: Tag, desc: 'Manage event packages & pricing models' },
        { label: 'Availability Rules', path: '/professional/availability', icon: Clock, desc: 'Set working hours & blocked dates' },
        { label: 'Calendar Schedule', path: '/professional/calendar', icon: Calendar, desc: 'Day, week & month calendar views' },
        { label: 'Financial Dashboard', path: '/settings/account-bank', icon: CreditCard, desc: 'Earnings, payouts & commission breakdown' },
        { label: 'Portfolio Content', path: '/portfolio', icon: Layers, desc: 'Manage showcase posts & reels' },
      ],
      settingsSections: [
        'dashboard',
        'business-mode',
        'business-profile',
        'bookings',
        'services',
        'availability',
        'account-bank',
        'repost-requests',
        'account',
        'privacy',
        'notifications',
        'help',
        'switch',
      ],
    },
  },

  ORDER_BASED: {
    mode: 'ORDER_BASED',
    title: 'Order-Based Business',
    badgeLabel: 'Seller Mode',
    tagline: 'Vendor, Equipment & Inventory Experience',
    description: 'For vendors who sell or rent products and manage customer orders.',
    examples: [
      'Decoration material sellers',
      'Event equipment suppliers',
      'Furniture sellers',
      'Lighting and sound equipment suppliers',
      'Wedding accessories sellers',
      'Costume and dress sellers',
      'Event product rental businesses',
    ],
    featuresList: [
      'Seller dashboard',
      'Product management',
      'Product categories',
      'Product pricing',
      'Inventory management',
      'Product variants',
      'Stock management',
      'Product images',
      'Customer orders',
      'Order processing',
      'Delivery and collection management',
      'Returns and refunds',
      'Customer communication',
      'Sales analytics',
    ],
    features: {
      services: false,
      availability: false,
      bookings: false,
      quotations: false,
      products: true,
      inventory: true,
      orders: true,
      returns: true,
      salesAnalytics: true,
      serviceAnalytics: false,
      reposts: true,
      financialDashboard: true,
      chat: true,
      profile: true,
    },
    navigation: {
      primary: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Products', path: '/inventory', icon: Package },
        { label: 'Orders', path: '/settings/orders', icon: ClipboardList, badgeKey: 'pendingOrders' },
        { label: 'Messages', path: '/chat', icon: Send, badgeKey: 'unreadMessages' },
        { label: 'Reposts', path: '/professional/repost-requests', icon: Repeat2, badgeKey: 'pendingReposts' },
        { label: 'Profile', path: '/profile', icon: User },
      ],
      secondaryTools: [
        { label: 'Orders Management', path: '/settings/orders', icon: ClipboardList, desc: 'Fulfill customer orders & dispatches' },
        { label: 'Product Inventory', path: '/inventory', icon: Package, desc: 'Stock quantities, variants & rentals' },
        { label: 'Returns & Refunds', path: '/settings/account-bank', icon: RotateCcw, desc: 'Manage product returns & reversals' },
        { label: 'Financial Dashboard', path: '/settings/account-bank', icon: CreditCard, desc: 'Sales revenue, commissions & payouts' },
        { label: 'Repost Requests', path: '/professional/repost-requests', icon: Repeat2, desc: 'Review & approve client reels' },
        { label: 'Portfolio Content', path: '/portfolio', icon: Layers, desc: 'Manage showcase posts & reels' },
      ],
      settingsSections: [
        'dashboard',
        'business-mode',
        'business-profile',
        'orders',
        'inventory',
        'account-bank',
        'repost-requests',
        'account',
        'privacy',
        'notifications',
        'help',
        'switch',
      ],
    },
  },
};

