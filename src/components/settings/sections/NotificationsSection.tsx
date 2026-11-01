import React from 'react';
import {
  Bell,
  CalendarCheck,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Repeat2,
  Users,
  Package,
  ShieldCheck,
} from 'lucide-react';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { NotificationCategoryPreferences } from '../../../types';

export const NotificationsSection: React.FC = () => {
  const { notificationPreferences, toggleNotificationPreference } = useMarketplaceStore();

  const categories: {
    key: keyof NotificationCategoryPreferences;
    title: string;
    description: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      key: 'bookingRequests',
      title: 'New Booking Requests',
      description: 'Receive real-time alerts when a client selects event dates or requests slots',
      icon: CalendarCheck,
    },
    {
      key: 'quotations',
      title: 'New Formal Quotations',
      description: 'Alerts when itemized quotes, package costs, or estimates are issued',
      icon: FileText,
    },
    {
      key: 'bookingConfirmations',
      title: 'Booking Confirmations',
      description: 'Notifications when advances are settled and dates are officially locked',
      icon: CheckCircle2,
    },
    {
      key: 'bookingCancellations',
      title: 'Booking Cancellations',
      description: 'Immediate alert if a client or venue date is cancelled or rescheduled',
      icon: XCircle,
    },
    {
      key: 'directMessages',
      title: 'New Direct Messages',
      description: 'Chat communications, event logistics, and bride/groom inquiries',
      icon: MessageSquare,
    },
    {
      key: 'repostRequests',
      title: 'Reel Repost Requests',
      description: 'Notify when a customer asks permission to syndicate your reel with their review',
      icon: Repeat2,
    },
    {
      key: 'repostApprovals',
      title: 'Repost Approvals',
      description: 'Notify customer when a creator approves their experience submission',
      icon: CheckCircle2,
    },
    {
      key: 'repostRejections',
      title: 'Repost Status Updates & Declines',
      description: 'Inform client with respectful feedback if an experience cannot be approved',
      icon: XCircle,
    },
    {
      key: 'newFollowers',
      title: 'New Profile Followers',
      description: 'Updates when event organizers or customers follow your creative studio',
      icon: Users,
    },
    {
      key: 'inventoryAlerts',
      title: 'Inventory & Low Stock Alerts',
      description: 'Automated warnings when camera gear or rental assets fall below safety thresholds',
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-charcoal">Notification Preferences</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Choose which marketplace alerts, booking notifications, and repost permission updates you receive.
        </p>
      </div>

      <div className="bg-surface-card rounded-2xl border border-border divide-y divide-border/70 overflow-hidden shadow-card">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isEnabled = notificationPreferences[cat.key];

          return (
            <div
              key={cat.key}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-sand/15 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sand/50 text-wine flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-charcoal">{cat.title}</h4>
                  <p className="text-[11px] text-charcoal-muted leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleNotificationPreference(cat.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isEnabled ? 'bg-wine' : 'bg-border'
                }`}
                title={isEnabled ? 'Disable notification' : 'Enable notification'}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

