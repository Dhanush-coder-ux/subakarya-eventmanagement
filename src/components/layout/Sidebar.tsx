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
  X,
  Briefcase,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

interface SidebarProps {
  onOpenCreate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    accountType,
    setAccountType,
    switchActiveUser,
    allCustomers,
    allProfessionals,
    logout,
    isMobileMenuOpen,
    toggleMobileMenu,
  } = useAuthStore();

  const { conversations, bookings } = useMarketplaceStore();

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isCustomer = accountType === 'customer';

  // Live badge counts
  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  const pendingBookingsCount = bookings.filter(
    (b) => b.professionalId === currentUser.id && b.status === 'pending'
  ).length;

  const handleRoleToggle = (newRole: 'customer' | 'professional') => {
    setAccountType(newRole);
    setShowMoreMenu(false);
    toggleMobileMenu(false);
    if (newRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  // Customer navigation items
  const customerNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  // Professional Navigation Groups
  const professionalNavGroups = [
    {
      group: 'Operations',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Calendar', path: '/professional/calendar', icon: Calendar },
        { label: 'Availability', path: '/professional/availability', icon: Clock },
        {
          label: 'Bookings',
          path: '/bookings',
          icon: CalendarCheck,
          badge: pendingBookingsCount,
        },
      ],
    },
    {
      group: 'Catalog & Store',
      items: [
        { label: 'Services', path: '/services', icon: Sparkles },
        { label: 'Inventory', path: '/inventory', icon: Package },
        { label: 'Portfolio', path: '/portfolio', icon: Layers },
      ],
    },
    {
      group: 'Communication & Feed',
      items: [
        { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
        { label: 'Marketplace Feed', path: '/', icon: Home },
        { label: 'Reels', path: '/reels', icon: Film },
      ],
    },
  ];

  // Render navigation link
  const renderNavLink = (
    item: {
      label: string;
      path: string;
      icon: any;
      badge?: number;
      isAvatar?: boolean;
    },
    isCompactOnMd: boolean = false
  ) => {
    const Icon = item.icon;
    const isActive =
      location.pathname === item.path ||
      (item.path !== '/' && location.pathname.startsWith(item.path));

    return (
      <Link
        key={item.label + item.path}
        to={item.path}
        onClick={() => toggleMobileMenu(false)}
        className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative ${
          isActive
            ? 'bg-wine text-white shadow-xs font-bold'
            : 'text-charcoal hover:bg-sand/40 hover:text-wine'
        }`}
        title={item.label}
      >
        <div className="relative flex-shrink-0">
          {item.isAvatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className={`w-5 h-5 rounded-full object-cover ring-2 ${
                isActive ? 'ring-white' : 'ring-border'
              }`}
            />
          ) : (
            <Icon
              className={`w-4 h-4 ${
                isActive ? 'text-white stroke-[2.2px]' : 'text-charcoal stroke-[1.8px]'
              }`}
            />
          )}
          {Boolean(item.badge && item.badge > 0) && (
            <span
              className={`absolute -top-1 -right-2 px-1.5 py-0.2 min-w-[15px] h-3.5 flex items-center justify-center text-[9px] font-bold rounded-full ${
                isActive ? 'bg-sand text-charcoal' : 'bg-wine text-white'
              }`}
            >
              {item.badge}
            </span>
          )}
        </div>
        <span className={isCompactOnMd ? 'hidden lg:inline truncate' : 'truncate'}>
          {item.label}
        </span>
      </Link>
    );
  };

  // Render Customer Sidebar Content
  const renderCustomerSidebar = () => (
    <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-surface border-r border-border w-[72px] lg:w-[245px] px-3 py-5 justify-between transition-all duration-200">
      {/* Top Logo */}
      <div className="space-y-6">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 text-charcoal group">
          <div className="w-8 h-8 rounded-lg bg-wine flex items-center justify-center text-white font-bold text-base shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="font-bold text-xl tracking-wider text-charcoal leading-none">
              SOIRÉE
            </span>
            <span className="text-[10px] text-wine font-semibold uppercase tracking-widest mt-0.5">
              Marketplace
            </span>
          </div>
        </Link>

        {/* Customer Nav Links */}
        <nav className="space-y-1">
          {customerNavItems.map((item) => renderNavLink(item, true))}

          {/* Explore / Search Action */}
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-charcoal hover:bg-sand/30 hover:text-wine transition-all text-left"
            title="Explore Categories"
          >
            <PlusSquare className="w-4 h-4 stroke-[1.8px] text-charcoal flex-shrink-0" />
            <span className="hidden lg:inline">Explore</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-charcoal hover:bg-sand/30 hover:text-wine transition-all text-left relative"
            title="Notifications"
          >
            <div className="relative flex-shrink-0">
              <Heart className="w-4 h-4 stroke-[1.8px] text-charcoal" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-wine ring-2 ring-surface"></span>
            </div>
            <span className="hidden lg:inline">Notifications</span>
          </button>
        </nav>
      </div>

      {/* Bottom Menu / Mode Switcher */}
      {renderBottomMenu()}
    </aside>
  );

  // Render Dedicated Professional Sidebar (Full width w-64, structured, scrollable)
  const renderProfessionalSidebar = () => (
    <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-surface border-r border-border w-64 px-4 py-5 justify-between shadow-subtle transition-all duration-200">
      {/* Top Header & Business Badge */}
      <div className="space-y-4 pb-3 border-b border-border/80 flex-shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3 px-1 text-charcoal group">
          <div className="w-8 h-8 rounded-lg bg-wine flex items-center justify-center text-white font-bold text-base shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider text-charcoal leading-none">
              SOIRÉE
            </span>
            <span className="text-[10px] text-wine font-bold uppercase tracking-widest mt-0.5">
              Vendor Suite
            </span>
          </div>
        </Link>

        {/* Business Profile Snapshot Card */}
        <div className="bg-sand/30 border border-border/70 rounded-xl p-2.5 flex items-center gap-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-lg object-cover border border-border flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-bold text-charcoal truncate">
                {'businessName' in currentUser ? currentUser.businessName : currentUser.name}
              </h4>
              <CheckCircle2 className="w-3 h-3 text-wine fill-sand flex-shrink-0" />
            </div>
            <p className="text-[10px] text-charcoal-muted truncate">
              {'category' in currentUser ? currentUser.category : 'Event Professional'}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Scrollable Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 space-y-5 pr-1 -mr-1">
        {professionalNavGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted mb-1.5">
              {group.group}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => renderNavLink(item, false))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Menu & Role Switcher */}
      <div className="pt-3 border-t border-border/80 flex-shrink-0">
        {renderBottomMenu()}
      </div>
    </aside>
  );

  // Common Bottom Menu & Role Switcher
  function renderBottomMenu() {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-charcoal hover:bg-sand/40 transition-colors text-left border border-transparent hover:border-border"
          title="Account Menu"
        >
          <div className="flex items-center gap-3">
            <Menu className="w-4 h-4 stroke-[2px] flex-shrink-0" />
            <span className={isCustomer ? 'hidden lg:inline' : 'inline'}>More Options</span>
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sand text-charcoal uppercase">
            {accountType === 'professional' ? 'Vendor' : 'Client'}
          </span>
        </button>

        {/* More Flyout Menu */}
        {showMoreMenu && (
          <div className="absolute bottom-12 left-0 w-64 bg-surface-card rounded-2xl shadow-elevated border border-border p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
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
                    isCustomer
                      ? 'bg-wine text-white shadow-xs'
                      : 'text-charcoal-muted hover:text-charcoal'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => handleRoleToggle('professional')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    !isCustomer
                      ? 'bg-wine text-white shadow-xs'
                      : 'text-charcoal-muted hover:text-charcoal'
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
                <span>Settings & Preferences</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-error hover:bg-error-light rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile Slideover Drawer (when opened on mobile screens)
  const renderMobileDrawer = () => {
    if (!isMobileMenuOpen) return null;

    return (
      <div className="md:hidden fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          onClick={() => toggleMobileMenu(false)}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs animate-in fade-in duration-200"
        />

        {/* Slide-out Menu */}
        <div className="relative w-72 max-w-[85vw] bg-surface h-full p-4 flex flex-col justify-between z-10 shadow-elevated border-r border-border animate-in slide-in-from-left duration-200">
          <div className="space-y-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-wine text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-base text-charcoal leading-none">SOIRÉE</h3>
                  <span className="text-[10px] text-wine font-semibold uppercase tracking-wider">
                    {accountType === 'professional' ? 'Vendor Portal' : 'Marketplace'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleMobileMenu(false)}
                className="p-1 rounded-lg border border-border text-charcoal hover:bg-sand/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Snapshot */}
            <div className="bg-sand/30 border border-border/70 rounded-xl p-2.5 flex items-center gap-2.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-border"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-charcoal truncate">{currentUser.name}</h4>
                <p className="text-[10px] text-charcoal-muted truncate">
                  {'category' in currentUser ? currentUser.category : 'Customer Account'}
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="overflow-y-auto max-h-[55vh] space-y-4 pr-1">
              {accountType === 'professional' ? (
                professionalNavGroups.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                      {group.group}
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => renderNavLink(item, false))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-1">
                  {customerNavItems.map((item) => renderNavLink(item, false))}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="pt-3 border-t border-border space-y-2">
            <div className="grid grid-cols-2 gap-1 p-1 bg-surface-muted rounded-xl">
              <button
                onClick={() => handleRoleToggle('customer')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  isCustomer ? 'bg-wine text-white' : 'text-charcoal-muted'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleToggle('professional')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  !isCustomer ? 'bg-wine text-white' : 'text-charcoal-muted'
                }`}
              >
                Vendor
              </button>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-error hover:bg-error-light rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar: Dedicated Vendor Sidebar or Customer Sidebar */}
      {isCustomer ? renderCustomerSidebar() : renderProfessionalSidebar()}

      {/* Mobile Drawer (Accessible from header / bottom nav on mobile) */}
      {renderMobileDrawer()}

      {/* Notifications Slideover */}
      {showNotifications && (
        <div className="hidden md:block fixed top-0 bottom-0 left-[72px] lg:left-[245px] w-80 bg-surface-card border-r border-border shadow-dropdown p-4 z-30 animate-in slide-in-from-left duration-200">
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
                  Lumière Cinematic Studios issued an itemized quote.
                </p>
                <span className="text-[10px] text-charcoal-light">20m ago</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-muted text-xs flex items-start gap-2.5">
              <Heart className="w-4 h-4 text-wine flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">New Bookmark</p>
                <p className="text-[11px] text-charcoal-muted">
                  A client saved your photography portfolio package.
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
