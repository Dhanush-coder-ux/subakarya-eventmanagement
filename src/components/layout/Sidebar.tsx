import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Film,
  Send,
  Heart,
  PlusSquare,
  CalendarCheck,
  Calendar,
  Clock,
  User,
  LayoutDashboard,
  Package,
  Menu,
  Tag,
  RotateCcw,
  Repeat2,
  ClipboardList,
  Bell,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

interface SidebarProps {
  onOpenCreate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, accountType } = useAuthStore();
  const { conversations, repostRequests, orders, bookings, businessMode } = useMarketplaceStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        const target = e.target as HTMLElement | null;
        if (target?.closest('[data-notifications-trigger="true"]')) {
          return;
        }
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showNotifications]);

  const isCustomer = accountType === 'customer';
  const isOrderBased = businessMode === 'ORDER_BASED';
  const isChatRoute =
    location.pathname.startsWith('/chat') ||
    location.pathname.startsWith('/messages');
  const isSettingsRoute = location.pathname.startsWith('/settings');
  const isCollapsed = isChatRoute || isSettingsRoute;

  const pendingRepostCount = repostRequests.filter(
    (r) => r.professionalId === currentUser.id && r.status === 'PENDING'
  ).length;

  const pendingOrdersCount = orders.filter(
    (o) => o.professionalId === currentUser.id && (o.orderStatus === 'confirmed' || o.orderStatus === 'processing')
  ).length;

  const pendingBookingsCount = bookings.filter(
    (b) => b.professionalId === currentUser.id && b.status === 'pending'
  ).length;

  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  // Primary navigation for customers
  const customerNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  // Essential primary items for vendor dynamically tailored to business mode
  const bookingPrimaryNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Services', path: '/services', icon: Tag },
    { label: 'Availability', path: '/professional/availability', icon: Clock },
    { label: 'Calendar', path: '/professional/calendar', icon: Calendar },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck, badge: pendingBookingsCount },
    { label: 'Customers', path: '/chat', icon: Send, badge: unreadCount },
    { label: 'Reposts', path: '/professional/repost-requests', icon: Repeat2, badge: pendingRepostCount },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  const orderPrimaryNavItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/inventory', icon: Package },
    { label: 'Orders', path: '/settings/orders', icon: ClipboardList, badge: pendingOrdersCount },
    { label: 'Customers', path: '/chat', icon: Send, badge: unreadCount },
    { label: 'Returns', path: '/settings/account-bank', icon: RotateCcw },
    { label: 'Reposts', path: '/professional/repost-requests', icon: Repeat2, badge: pendingRepostCount },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  const professionalPrimaryNavItems = isOrderBased ? orderPrimaryNavItems : bookingPrimaryNavItems;
  const navItems = isCustomer ? customerNavItems : professionalPrimaryNavItems;

  return (
    <>
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-surface border-r border-border ${
          isCollapsed ? 'w-[72px] px-2 py-5' : 'w-[72px] lg:w-[245px] px-3 py-5'
        } justify-between transition-all duration-200 select-none`}
      >
        {/* Top Logo & Primary Nav */}
        <div className="space-y-6">
          <Link
            to={isCustomer ? '/' : '/dashboard'}
            className="flex items-center px-1.5 py-1 text-charcoal group"
          >
            {/* When sidebar is collapsed (icon-only e.g. md screen, chat, or settings route) */}
            <div className={isCollapsed ? 'block' : 'lg:hidden'}>
              <img
                src="/crimson-ribbon-s-logo.png"
                alt="Subakarya"
                className="w-9 h-9 object-contain flex-shrink-0 group-hover:scale-105 transition-transform drop-shadow-sm mx-auto"
              />
            </div>

            {/* When sidebar is expanded on large desktop */}
            {!isCollapsed && (
              <div className="hidden lg:block w-full">
                <img
                  src="/subakarya-ribbon-tagline.png"
                  alt="Subakarya"
                  className="h-11 w-auto max-w-[215px] object-contain group-hover:scale-[1.02] transition-transform drop-shadow-sm"
                />
              </div>
            )}
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`group flex items-center gap-4 px-3 py-3 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? 'font-bold text-wine bg-sand/50 shadow-xs'
                      : 'text-charcoal hover:bg-sand/30 font-medium'
                  }`}
                  title={item.label}
                >
                  <div className="relative flex-shrink-0 flex items-center justify-center">
                    {item.isAvatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className={`w-6 h-6 rounded-full object-cover ring-2 transition-transform group-hover:scale-105 ${
                          isActive ? 'ring-wine' : 'ring-border'
                        }`}
                      />
                    ) : (
                      <Icon
                        className={`w-6 h-6 icon-hover-base group-icon-scale ${
                          isActive ? 'stroke-[2.5px] text-wine' : 'stroke-[1.8px] text-charcoal'
                        }`}
                      />
                    )}
                    {Boolean(item.badge) && (
                      <span className="absolute -top-1 -right-2 px-1.5 py-0.2 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-wine text-white ring-2 ring-surface">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {!isCollapsed && <span className="hidden lg:inline truncate">{item.label}</span>}
                </Link>
              );
            })}

            {/* Create Action Button (Explore / Showcase) */}
            <button
              onClick={() => {
                if (accountType === 'professional') {
                  navigate('/portfolio');
                } else {
                  navigate('/search');
                }
              }}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/30 transition-all text-left group"
              title="Create Content / Explore"
            >
              <PlusSquare className="w-6 h-6 stroke-[1.8px] text-charcoal flex-shrink-0 icon-hover-base group-icon-sparkle" />
              {!isCollapsed && (
                <span className="hidden lg:inline">
                  {accountType === 'professional' ? 'Create' : 'Explore'}
                </span>
              )}
            </button>

            {/* Notifications Item */}
            <button
              data-notifications-trigger="true"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/30 transition-all text-left relative group"
              title="Notifications"
            >
              <div className="relative flex-shrink-0 flex items-center justify-center">
                <Heart className="w-6 h-6 stroke-[1.8px] text-charcoal icon-hover-base group-icon-heart" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-wine ring-2 ring-surface"></span>
              </div>
              {!isCollapsed && <span className="hidden lg:inline">Notifications</span>}
            </button>
          </nav>
        </div>

        {/* Clean Bottom Navigation Item - More (Settings & Preferences) */}
        <div className="pt-2 border-t border-border/60">
          <Link
            to="/settings"
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-colors text-left group ${
              location.pathname.startsWith('/settings')
                ? 'font-bold text-wine bg-sand/50 shadow-xs'
                : 'text-charcoal hover:bg-sand/30 font-medium'
            }`}
            title="More"
          >
            <Menu className="w-6 h-6 stroke-[1.8px] text-charcoal flex-shrink-0 icon-hover-base group-hover:scale-105 transition-transform" />
            {!isCollapsed && <span className="hidden lg:inline truncate">More</span>}
          </Link>
        </div>
      </aside>

      {/* Notifications Slideover/Drawer */}
      {showNotifications && (
        <div
          ref={notificationsRef}
          className={`hidden md:flex flex-col fixed top-0 bottom-0 ${
            isCollapsed ? 'left-[72px]' : 'left-[72px] lg:left-[245px]'
          } w-80 bg-surface-card border-r border-border shadow-elevated z-50 animate-in slide-in-from-left duration-200 overflow-hidden`}
        >
          {/* Header - Aligned with desktop navbar height */}
          <div className="h-14 px-4 border-b border-border bg-surface flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-wine" />
              <h3 className="font-bold text-sm text-charcoal">Notifications</h3>
              <span className="w-2 h-2 rounded-full bg-wine animate-pulse" />
            </div>
            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-charcoal-muted hover:text-charcoal hover:bg-sand/50 transition-colors"
              title="Close Notifications"
            >
              <span>Close</span>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Notifications Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            <div
              onClick={() => {
                setShowNotifications(false);
                navigate('/chat');
              }}
              className="p-3 rounded-xl bg-sand/30 hover:bg-sand/50 text-xs flex items-start gap-2.5 cursor-pointer transition-all active:scale-98 border border-border"
            >
              <Send className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Quotation Request Received</p>
                <p className="text-[11px] text-charcoal-muted">
                  Lumière Cinematic Studios issued an itemized quote for Nov 15.
                </p>
                <span className="text-[10px] text-charcoal-light mt-1 block">25m ago • Tap to view booking</span>
              </div>
            </div>

            <div
              onClick={() => {
                setShowNotifications(false);
                navigate('/bookings');
              }}
              className="p-3 rounded-xl bg-sand/20 hover:bg-sand/40 text-xs flex items-start gap-2.5 cursor-pointer transition-all active:scale-98 border border-border"
            >
              <CalendarCheck className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Booking Confirmed</p>
                <p className="text-[11px] text-charcoal-muted">
                  Your event slot has been officially confirmed by vendor.
                </p>
                <span className="text-[10px] text-charcoal-light mt-1 block">2h ago • Tap to view status</span>
              </div>
            </div>

            <div
              onClick={() => {
                setShowNotifications(false);
                navigate('/reels');
              }}
              className="p-3 rounded-xl bg-surface-muted hover:bg-sand/30 text-xs flex items-start gap-2.5 cursor-pointer transition-all active:scale-98 border border-border"
            >
              <Heart className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Post Saved & Liked</p>
                <p className="text-[11px] text-charcoal-muted">
                  Rohan Mehta saved your traditional mandap post.
                </p>
                <span className="text-[10px] text-charcoal-light mt-1 block">5h ago • Tap to view media</span>
              </div>
            </div>

            <div
              onClick={() => {
                setShowNotifications(false);
                navigate('/chat');
              }}
              className="p-3 rounded-xl bg-surface-muted hover:bg-sand/30 text-xs flex items-start gap-2.5 cursor-pointer transition-all active:scale-98 border border-border"
            >
              <Send className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">New Message</p>
                <p className="text-[11px] text-charcoal-muted">
                  Priya Sharma sent you a message regarding ceremony timeline.
                </p>
                <span className="text-[10px] text-charcoal-light mt-1 block">12h ago • Tap to chat</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
