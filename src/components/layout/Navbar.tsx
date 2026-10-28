import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Film,
  MessageSquare,
  CalendarCheck,
  User,
  LayoutDashboard,
  Layers,
  Package,
  Settings,
  ChevronDown,
  LogOut,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, accountType, setAccountType, switchActiveUser, allCustomers, allProfessionals, logout } = useAuthStore();
  const { conversations } = useMarketplaceStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Unread messages calculation
  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (accountType === 'customer' ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  const isCustomer = accountType === 'customer';

  const customerNavLinks = [
    { label: 'Discover', path: '/', icon: Sparkles },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Messages', path: '/chat', icon: MessageSquare, badge: unreadCount },
    { label: 'My Bookings', path: '/bookings', icon: CalendarCheck },
  ];

  const professionalNavLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Portfolio', path: '/portfolio', icon: Layers },
    { label: 'Services', path: '/services', icon: Sparkles },
    { label: 'Inventory', path: '/inventory', icon: Package },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Messages', path: '/chat', icon: MessageSquare, badge: unreadCount },
  ];

  const currentNavLinks = isCustomer ? customerNavLinks : professionalNavLinks;

  const handleRoleToggle = (newRole: 'customer' | 'professional') => {
    setAccountType(newRole);
    setShowUserMenu(false);
    if (newRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <div className="flex items-center space-x-3">
            <Link to={isCustomer ? '/' : '/dashboard'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-wine flex items-center justify-center text-sand font-bold text-xl font-bold tracking-wider shadow-sm transition-transform duration-200 group-hover:scale-105">
                S
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl font-bold tracking-widest text-charcoal leading-none">
                  SOIRÉE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-wine font-medium">
                  Event Concierge
                </span>
              </div>
            </Link>

            {/* Role Badge */}
            <span
              className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isCustomer
                  ? 'bg-sand/60 text-charcoal border-sand-dark'
                  : 'bg-wine-soft text-wine border-wine/20'
              }`}
            >
              {isCustomer ? 'Customer View' : 'Vendor Portal'}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {currentNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-wine text-white shadow-sm'
                      : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {Boolean(link.badge) && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                        isActive ? 'bg-sand text-charcoal' : 'bg-wine text-white'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Profile Menu */}
          <div className="flex items-center space-x-3">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-sand/40 relative focus:outline-none"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-wine ring-2 ring-surface"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-card rounded-xl shadow-dropdown border border-border p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                      Notifications
                    </span>
                    <span className="text-[11px] text-wine font-medium">Mark all read</span>
                  </div>
                  <div className="divide-y divide-border/60 max-h-64 overflow-y-auto">
                    <div className="py-2.5 text-xs">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-charcoal">Quotation updated</p>
                          <p className="text-charcoal-muted">
                            Lumière Cinematic Studios submitted pricing for Nov 15.
                          </p>
                          <span className="text-[10px] text-charcoal-light">25 mins ago</span>
                        </div>
                      </div>
                    </div>
                    <div className="py-2.5 text-xs">
                      <div className="flex items-start gap-2">
                        <CalendarCheck className="w-4 h-4 text-wine mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-charcoal">Booking confirmed</p>
                          <p className="text-charcoal-muted">
                            Aria Grand Ballroom reservation finalized.
                          </p>
                          <span className="text-[10px] text-charcoal-light">Yesterday</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-border bg-surface hover:bg-sand/30 transition-colors focus:outline-none"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-wine/30"
                />
                <span className="text-xs font-medium text-charcoal max-w-[100px] truncate hidden sm:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-muted" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-card rounded-xl shadow-dropdown border border-border p-2 z-50">
                  {/* Current User Info */}
                  <div className="px-3 py-2.5 border-b border-border/80">
                    <p className="text-sm font-semibold text-charcoal truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-charcoal-muted truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-sand/60 text-charcoal border border-sand-dark">
                      {isCustomer ? 'Customer Account' : 'Professional Business'}
                    </div>
                  </div>

                  {/* Mode Switching */}
                  <div className="py-2 px-1 border-b border-border/80">
                    <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-light mb-1">
                      Switch Demo View
                    </p>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-surface-muted rounded-lg">
                      <button
                        onClick={() => handleRoleToggle('customer')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                          isCustomer
                            ? 'bg-wine text-white shadow-xs'
                            : 'text-charcoal-muted hover:text-charcoal'
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() => handleRoleToggle('professional')}
                        className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                          !isCustomer
                            ? 'bg-wine text-white shadow-xs'
                            : 'text-charcoal-muted hover:text-charcoal'
                        }`}
                      >
                        Professional
                      </button>
                    </div>
                  </div>

                  {/* Quick Profile Switcher */}
                  <div className="py-2 px-1 border-b border-border/80">
                    <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-light mb-1">
                      {isCustomer ? 'Sample Customers' : 'Sample Vendors'}
                    </p>
                    <div className="space-y-1">
                      {(isCustomer ? allCustomers : allProfessionals).slice(0, 3).map((u) => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchActiveUser(u.id);
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-left transition-colors ${
                            currentUser.id === u.id
                              ? 'bg-sand/70 font-semibold text-charcoal'
                              : 'text-charcoal-muted hover:bg-sand/30 hover:text-charcoal'
                          }`}
                        >
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="truncate">
                            {'businessName' in u ? u.businessName : u.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="py-1">
                    <Link
                      to={isCustomer ? `/profile/${currentUser.id}` : `/profile/${currentUser.id}`}
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal hover:bg-sand/40 rounded-md"
                    >
                      <User className="w-4 h-4 text-charcoal-muted" />
                      <span>Public Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-charcoal hover:bg-sand/40 rounded-md"
                    >
                      <Settings className="w-4 h-4 text-charcoal-muted" />
                      <span>Settings & Reset</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-error hover:bg-error-light rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
