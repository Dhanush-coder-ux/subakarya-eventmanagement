import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Heart,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { formatTime } from '../../utils';

export interface NotificationItem {
  id: string;
  type: 'quotation' | 'booking' | 'like' | 'chat' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  targetUrl: string;
  avatar?: string;
}

export const sampleNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'quotation',
    title: 'New Quotation Received',
    message: 'Lumière Cinematic Studios issued an itemized quote of ₹45,000 for Nov 15.',
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isRead: false,
    targetUrl: '/bookings',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
  {
    id: 'notif-2',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your Heritage Wedding photography date has been confirmed and locked.',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    isRead: false,
    targetUrl: '/bookings',
  },
  {
    id: 'notif-3',
    type: 'like',
    title: 'New Post Like',
    message: 'Rohan Mehta liked and saved your traditional Chettinad mandap post.',
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    isRead: true,
    targetUrl: '/reels',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'notif-4',
    type: 'chat',
    title: 'Direct Client Message',
    message: 'Priya Sharma: "Can we adjust the evening session start time to 5:30 PM?"',
    timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    isRead: true,
    targetUrl: '/chat',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
];

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (targetUrl: string) => {
    onClose();
    navigate(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-surface h-full shadow-2xl flex flex-col justify-between z-10 border-l border-border overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sand/60 text-wine flex items-center justify-center">
              <Heart className="w-4 h-4 fill-wine/20" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-charcoal">Activity & Notifications</h3>
              <p className="text-[11px] text-charcoal-muted">Bookings, quotations, and engagement</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sand/40 text-charcoal-muted hover:text-charcoal transition-colors active:scale-95"
            title="Close"
          >
            <X className="w-5 h-5 icon-hover-base hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 no-scrollbar divide-y divide-border/40">
          {sampleNotifications.map((notif) => {
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif.targetUrl)}
                className={`pt-2.5 first:pt-0 p-2.5 rounded-xl transition-all cursor-pointer flex items-start gap-3 select-none active:scale-98 ${
                  notif.isRead
                    ? 'hover:bg-sand/20 bg-surface'
                    : 'bg-sand/30 hover:bg-sand/40 border border-sand-dark/50'
                }`}
              >
                {/* Icon or Avatar */}
                <div className="relative shrink-0">
                  {notif.avatar ? (
                    <img
                      src={notif.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-wine-soft/60 text-wine flex items-center justify-center">
                      {notif.type === 'quotation' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : notif.type === 'booking' ? (
                        <Calendar className="w-5 h-5" />
                      ) : notif.type === 'chat' ? (
                        <MessageSquare className="w-5 h-5" />
                      ) : (
                        <Heart className="w-5 h-5" />
                      )}
                    </div>
                  )}

                  {!notif.isRead && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-wine ring-2 ring-surface" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h4 className="text-xs font-bold text-charcoal truncate">{notif.title}</h4>
                    <span className="text-[10px] text-charcoal-muted shrink-0">
                      {formatTime(notif.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border bg-surface-card text-center shrink-0">
          <p className="text-[11px] text-charcoal-muted">
            Tap any notification to view relevant bookings or details
          </p>
        </div>
      </div>
    </div>
  );
};

