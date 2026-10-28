import React, { useState } from 'react';
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
  Layers,
  Package,
  Settings,
  Menu,
  Sparkles,
  LogOut,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

interface SidebarProps {
  onOpenCreate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, accountType, setAccountType, switchActiveUser, allCustomers, allProfessionals, logout } = useAuthStore();
  const { conversations } = useMarketplaceStore();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isCustomer = accountType === 'customer';
  const isChatRoute =
    location.pathname.startsWith('/chat') ||
    location.pathname.startsWith('/messages');

  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  const handleRoleToggle = (newRole: 'customer' | 'professional') => {
    setAccountType(newRole);
    setShowMoreMenu(false);
    if (newRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const navItems = isCustomer
    ? [
        { label: 'Home', path: '/', icon: Home },
        { label: 'Search', path: '/search', icon: Search },
        { label: 'Reels', path: '/reels', icon: Film },
        { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
        { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
        { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Home Feed', path: '/', icon: Home },
        { label: 'Reels', path: '/reels', icon: Film },
        { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
        { label: 'Services', path: '/services', icon: Sparkles },
        { label: 'Inventory', path: '/inventory', icon: Package },
        { label: 'Calendar', path: '/professional/calendar', icon: Calendar },
        { label: 'Availability', path: '/professional/availability', icon: Clock },
        { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
        { label: 'Content', path: '/portfolio', icon: Layers },
        { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
      ];

  return (
    <>
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-surface border-r border-border ${
          isChatRoute ? 'w-[72px] px-2 py-5' : 'w-[72px] lg:w-[245px] px-3 py-5'
        } justify-between transition-all duration-200`}
      >
        {/* Top Logo */}
        <div className="space-y-6">
          <Link
            to={isCustomer ? '/' : '/dashboard'}
            className="flex items-center gap-3 px-3 py-2 text-charcoal group"
          >
            <img src="/crimson-ribbon-s-logo.png" alt="Emblem" className="w-9 h-9 object-contain flex-shrink-0 group-hover:scale-105 transition-transform drop-shadow-sm" />
            {!isChatRoute && (
              <div className="hidden lg:flex flex-col">
                <span className="font-bold text-xl tracking-wider text-charcoal leading-none">
                  SUBAKARYA
                </span>
                <span className="text-[10px] text-wine font-semibold uppercase tracking-widest mt-0.5">
                  {isCustomer ? 'Marketplace' : 'Vendor Suite'}
                </span>
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
                  className={`flex items-center gap-4 px-3 py-3 rounded-xl text-sm transition-all duration-150 ${
                    isActive
                      ? 'font-bold text-wine bg-sand/50'
                      : 'text-charcoal hover:bg-sand/30 font-medium'
                  }`}
                  title={item.label}
                >
                  <div className="relative flex-shrink-0">
                    {item.isAvatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className={`w-6 h-6 rounded-full object-cover ring-2 ${
                          isActive ? 'ring-wine' : 'ring-border'
                        }`}
                      />
                    ) : (
                      <Icon
                        className={`w-6 h-6 ${
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
                  {!isChatRoute && <span className="hidden lg:inline truncate">{item.label}</span>}
                </Link>
              );
            })}

            {/* Create Action Button (Instagram style + button) */}
            <button
              onClick={() => {
                if (accountType === 'professional') {
                  navigate('/portfolio');
                } else {
                  navigate('/search');
                }
              }}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/30 transition-all text-left"
              title="Create Content / Explore"
            >
              <PlusSquare className="w-6 h-6 stroke-[1.8px] text-charcoal flex-shrink-0" />
              {!isChatRoute && (
                <span className="hidden lg:inline">
                  {accountType === 'professional' ? 'Create' : 'Explore'}
                </span>
              )}
            </button>

            {/* Notifications Item */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/30 transition-all text-left relative"
              title="Notifications"
            >
              <div className="relative flex-shrink-0">
                <Heart className="w-6 h-6 stroke-[1.8px] text-charcoal" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-wine ring-2 ring-surface"></span>
              </div>
              {!isChatRoute && <span className="hidden lg:inline">Notifications</span>}
            </button>
          </nav>
        </div>

        {/* Bottom Menu / Mode Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/40 transition-colors text-left"
            title="More Options"
          >
            <Menu className="w-6 h-6 stroke-[2px] flex-shrink-0" />
            {!isChatRoute && <span className="hidden lg:inline font-semibold">More</span>}
          </button>

          {/* More Flyout Menu */}
          {showMoreMenu && (
            <div className="absolute bottom-14 left-0 w-64 bg-surface-card rounded-2xl shadow-dropdown border border-border p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="p-2 border-b border-border/80">
                <p className="text-xs font-bold text-charcoal">{currentUser.name}</p>
                <p className="text-[11px] text-charcoal-muted truncate">{currentUser.email}</p>
                <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sand text-charcoal border border-sand-dark">
                  {isCustomer ? 'Customer Account' : 'Vendor Portal'}
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="py-2 px-1 border-b border-border/80">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
                  Switch Experience
                </p>
                <div className="grid grid-cols-2 gap-1 p-1 bg-surface-muted rounded-xl">
                  <button
                    onClick={() => handleRoleToggle('customer')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isCustomer ? 'bg-wine text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => handleRoleToggle('professional')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      !isCustomer ? 'bg-wine text-white shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
                    }`}
                  >
                    Vendor
                  </button>
                </div>
              </div>

              {/* Persona Switcher */}
              <div className="py-2 px-1 border-b border-border/80">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1">
                  Quick Switch Persona
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {(isCustomer ? allCustomers : allProfessionals).slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchActiveUser(u.id);
                        setShowMoreMenu(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left ${
                        currentUser.id === u.id
                          ? 'bg-sand/70 font-bold text-charcoal'
                          : 'text-charcoal-muted hover:bg-sand/30'
                      }`}
                    >
                      <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span className="truncate">{'businessName' in u ? u.businessName : u.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings and Sign Out */}
              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setShowMoreMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-charcoal hover:bg-sand/40 rounded-lg"
                >
                  <Settings className="w-4 h-4 text-charcoal-muted" />
                  <span>Settings & Reset</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-error hover:bg-error-light rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Notifications Slideover/Drawer */}
      {showNotifications && (
        <div
          className={`hidden md:block fixed top-0 bottom-0 ${
            isChatRoute ? 'left-[72px]' : 'left-[72px] lg:left-[245px]'
          } w-80 bg-surface-card border-r border-border shadow-dropdown p-4 z-30 animate-in slide-in-from-left duration-200`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-bold text-sm text-charcoal">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-xs text-wine font-semibold hover:underline"
            >
              Close
            </button>
          </div>
          <div className="mt-3 space-y-3">
            <div className="p-2.5 rounded-xl bg-sand/30 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-wine flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Quotation Sent</p>
                <p className="text-[11px] text-charcoal-muted">
                  Lumière Cinematic Studios issued an itemized quote for Nov 15.
                </p>
                <span className="text-[10px] text-charcoal-light">20m ago</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-muted text-xs flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-wine flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">New Like</p>
                <p className="text-[11px] text-charcoal-muted">
                  Rohan Mehta saved your traditional mandap post.
                </p>
                <span className="text-[10px] text-charcoal-light">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

