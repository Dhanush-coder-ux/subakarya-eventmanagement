import React from 'react';
import {
  Activity,
  User,
  CreditCard,
  Package,
  CalendarCheck,
  Repeat2,
  Bookmark,
  Shield,
  Bell,
  HelpCircle,
  RefreshCw,
  LogOut,
  LayoutDashboard,
  Building2,
  Tag,
  Clock,
  Store,
  Sparkles,
} from 'lucide-react';
import { Role } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { SettingsMenuItem, SettingsItemConfig } from './SettingsMenuItem';

interface SettingsSidebarProps {
  accountType: Role;
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
  pendingRepostsCount?: number;
  unreadOrdersCount?: number;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  accountType,
  activeSection,
  onSelectSection,
  pendingRepostsCount = 0,
  unreadOrdersCount = 0,
}) => {
  const isCustomer = accountType === 'customer';
  const { userAccount } = useAuthStore();
  const { businessMode } = useMarketplaceStore();
  const isOrderBased = businessMode === 'ORDER_BASED';

  const hasProfessionalProfile = Boolean(userAccount.professionalProfile);

  // Grouped Navigation for Personal / Customer
  const customerSections: { category: string; items: SettingsItemConfig[] }[] = [
    {
      category: 'Interaction',
      items: [
        {
          id: 'activity',
          label: 'Your Activity',
          icon: Activity,
          description: 'Likes, comments, saves & reposts',
        },
        {
          id: 'saved',
          label: 'Saved Content',
          icon: Bookmark,
          description: 'Personal moodboard & bookmarks',
        },
        {
          id: 'reposts',
          label: 'Repost Activity',
          icon: Repeat2,
          description: 'Experience submissions & statuses',
        },
      ],
    },
    {
      category: 'Orders & Bookings',
      items: [
        {
          id: 'bookings',
          label: 'My Bookings',
          icon: CalendarCheck,
          description: 'Event requests & reservations',
        },
        {
          id: 'orders',
          label: 'My Orders',
          icon: Package,
          description: 'Product & gear rental orders',
        },
        {
          id: 'account-bank',
          label: 'Payment Preferences',
          icon: CreditCard,
          description: 'Cards, UPI & billing history',
        },
      ],
    },
    {
      category: 'Account & Security',
      items: [
        {
          id: 'account',
          label: 'Account Information',
          icon: User,
          description: 'Personal details & credentials',
        },
        {
          id: 'privacy',
          label: 'Privacy & Security',
          icon: Shield,
          description: 'Password, blocked & visibility',
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          description: 'Push & alert preferences',
        },
      ],
    },
    {
      category: 'Professional Upgrade',
      items: hasProfessionalProfile
        ? [
            {
              id: 'switch-pro',
              label: 'Switch to Professional',
              icon: Store,
              badge: 'Active',
              badgeVariant: 'wine',
              description: 'Open your business workspace',
            },
          ]
        : [
            {
              id: 'become-pro',
              label: 'Become a Professional',
              icon: Sparkles,
              badge: 'Upgrade',
              badgeVariant: 'wine',
              description: 'Monetize event services & gear',
            },
          ],
    },
    {
      category: 'Preferences',
      items: [
        {
          id: 'help',
          label: 'Help and Support',
          icon: HelpCircle,
          description: 'FAQs & dispute assistance',
        },
        {
          id: 'switch',
          label: 'Switch Account & Sandbox',
          icon: RefreshCw,
          description: 'Test personas & reset state',
        },
        {
          id: 'logout',
          label: 'Log Out',
          icon: LogOut,
          description: 'Sign out of this session',
        },
      ],
    },
  ];

  // Grouped Navigation for Professional
  const professionalSections: { category: string; items: SettingsItemConfig[] }[] = [
    {
      category: 'Workspace',
      items: [
        {
          id: 'dashboard',
          label: isOrderBased ? 'Seller Dashboard' : 'Professional Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'business-mode',
          label: 'Business Operating Mode',
          icon: Store,
          badge: isOrderBased ? 'Seller' : 'Booking',
          badgeVariant: 'wine',
        },
        {
          id: 'activity',
          label: 'Your Activity',
          icon: Activity,
        },
        {
          id: 'repost-requests',
          label: 'Repost Requests',
          icon: Repeat2,
          badge: pendingRepostsCount > 0 ? pendingRepostsCount : undefined,
          badgeVariant: 'wine',
        },
      ],
    },
    {
      category: isOrderBased ? 'Seller Operations' : 'Service Operations',
      items: isOrderBased
        ? [
            {
              id: 'business-profile',
              label: 'Business Profile',
              icon: Building2,
            },
            {
              id: 'orders',
              label: 'Orders Management',
              icon: Package,
              badge: unreadOrdersCount > 0 ? unreadOrdersCount : undefined,
              badgeVariant: 'sand',
            },
            {
              id: 'inventory',
              label: 'Products & Inventory',
              icon: Package,
            },
            {
              id: 'account-bank',
              label: 'Account and Bank Details',
              icon: CreditCard,
            },
          ]
        : [
            {
              id: 'business-profile',
              label: 'Business Profile',
              icon: Building2,
            },
            {
              id: 'bookings',
              label: 'Booking Management',
              icon: CalendarCheck,
            },
            {
              id: 'services',
              label: 'Services and Pricing',
              icon: Tag,
            },
            {
              id: 'availability',
              label: 'Availability and Calendar',
              icon: Clock,
            },
            {
              id: 'account-bank',
              label: 'Account and Bank Details',
              icon: CreditCard,
            },
          ],
    },
    {
      category: 'Experience Switching',
      items: [
        {
          id: 'switch-personal',
          label: 'Switch to Personal Experience',
          icon: User,
          description: 'Browse marketplace without losing business data',
        },
      ],
    },
    {
      category: 'Account & Security',
      items: [
        {
          id: 'account',
          label: 'Account Information',
          icon: User,
        },
        {
          id: 'privacy',
          label: 'Privacy and Security',
          icon: Shield,
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
        },
      ],
    },
    {
      category: 'Preferences',
      items: [
        {
          id: 'help',
          label: 'Help and Support',
          icon: HelpCircle,
        },
        {
          id: 'switch',
          label: 'Switch Persona & Sandbox',
          icon: RefreshCw,
        },
        {
          id: 'logout',
          label: 'Log Out',
          icon: LogOut,
        },
      ],
    },
  ];

  const categories = isCustomer ? customerSections : professionalSections;

  return (
    <nav className="space-y-5" aria-label="Settings navigation">
      {categories.map((group) => (
        <div key={group.category} className="space-y-1">
          <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">
            {group.category}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <SettingsMenuItem
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                onClick={() => onSelectSection(item.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
};
