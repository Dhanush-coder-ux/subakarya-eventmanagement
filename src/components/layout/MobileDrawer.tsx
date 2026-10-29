import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  X,
  Home,
  Search,
  Film,
  Send,
  Heart,
  CalendarCheck,
  Calendar,
  Clock,
  User,
  LayoutDashboard,
  Layers,
  Package,
  Settings,
  Tag,
  LogOut,
  PlusSquare,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

export const MobileDrawer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    accountType,
    setAccountType,
    isMobileMenuOpen,
    toggleMobileMenu,
    switchActiveUser,
    allCustomers,
    allProfessionals,
    logout,
  } = useAuthStore();
  const { conversations } = useMarketplaceStore();

  if (!isMobileMenuOpen) return null;

  const isCustomer = accountType === 'customer';
  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  const navItems = isCustomer
    ? [
        { label: 'Home Feed', path: '/', icon: Home },
        { label: 'Explore & Search', path: '/search', icon: Search },
        { label: 'Reels Showcase', path: '/reels', icon: Film },
        { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
        { label: 'My Bookings', path: '/bookings', icon: CalendarCheck },
        { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User },
        { label: 'Account Settings', path: '/settings', icon: Settings },
      ]
    : [
        { label: 'Vendor Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Client Calendar', path: '/professional/calendar', icon: Calendar },
        { label: 'Availability Slots', path: '/professional/availability', icon: Clock },
        { label: 'Booking Requests', path: '/bookings', icon: CalendarCheck },
        { label: 'Services Catalog', path: '/services', icon: Tag },
        { label: 'Inventory Assets', path: '/inventory', icon: Package },
        { label: 'Portfolio Works', path: '/portfolio', icon: Layers },
        { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
        { label: 'Public Profile', path: `/profile/${currentUser.id}`, icon: User },
        { label: 'Settings', path: '/settings', icon: Settings },
      ];

  const handleRoleToggle = (newRole: 'customer' | 'professional') => {
    setAccountType(newRole);
    toggleMobileMenu(false);
    if (newRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLinkClick = (path: string) => {
    toggleMobileMenu(false);
    navigate(path);
  };

  return (
    <div className="md:hidden fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={() => toggleMobileMenu(false)}
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative w-4/5 max-w-xs bg-surface h-full shadow-2xl flex flex-col justify-between z-10 border-r border-border overflow-hidden animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border bg-surface-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <img
              src="/subakarya-logo.png"
              alt="Subakarya"
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="font-bold text-base tracking-wider text-charcoal leading-none block">
                SUBAKARYA
              </span>
              <span className="text-[10px] text-wine font-semibold uppercase tracking-widest mt-0.5 block">
                {isCustomer ? 'Customer Portal' : 'Vendor Suite'}
              </span>
            </div>
          </div>
          <button
            onClick={() => toggleMobileMenu(false)}
            className="p-1.5 rounded-lg text-charcoal hover:bg-sand/40 transition-colors"
            title="Close Menu"
          >
            <X className="w-5 h-5 icon-hover-base hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Current User Quick Summary */}
        <div className="p-4 bg-sand/30 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-wine"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-charcoal truncate">{currentUser.name}</p>
              <p className="text-[11px] text-charcoal-muted truncate">{currentUser.email}</p>
            </div>
          </div>

          {/* Role Switcher Pill in Drawer */}
          <div className="mt-3 grid grid-cols-2 gap-1 p-1 bg-surface rounded-xl border border-border">
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

        {/* Navigation Links Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => handleLinkClick(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-wine text-white font-bold shadow-xs'
                    : 'text-charcoal hover:bg-sand/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {Boolean(item.badge) && (
                  <span className="px-1.5 py-0.2 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-sand text-wine">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-3 border-t border-border bg-surface-card space-y-2 shrink-0">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-charcoal-muted px-2">Switch Persona</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(isCustomer ? allCustomers : allProfessionals).slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchActiveUser(u.id);
                    toggleMobileMenu(false);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[11px] whitespace-nowrap shrink-0 ${
                    currentUser.id === u.id
                      ? 'border-wine bg-wine/10 font-bold text-wine'
                      : 'border-border bg-surface text-charcoal'
                  }`}
                >
                  <img src={u.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                  <span className="max-w-[70px] truncate">
                    {'businessName' in u ? u.businessName : u.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              toggleMobileMenu(false);
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-error/30 text-error hover:bg-error-light text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

