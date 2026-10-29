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
  Layers,
  Package,
  Settings,
  Menu,
  Tag,
  LogOut,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
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
  const menuRef = useRef<HTMLDivElement>(null);

  const isCustomer = accountType === 'customer';
  const isChatRoute =
    location.pathname.startsWith('/chat') ||
    location.pathname.startsWith('/messages');

  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  // Close flyout menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMoreMenu]);

  const handleRoleToggle = (newRole: 'customer' | 'professional') => {
    setAccountType(newRole);
    setShowMoreMenu(false);
    if (newRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  // Primary curated menu items for the main sidebar navigation
  const customerNavItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  // Essential primary items for vendor: Dashboard, Calendar, Bookings, Messages, Profile
  const professionalPrimaryNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', path: '/professional/calendar', icon: Calendar },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Messages', path: '/chat', icon: Send, badge: unreadCount },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  // Secondary tools housed cleanly inside the "More / Management" popover
  const professionalMoreTools = [
    { label: 'Services & Packages', path: '/services', icon: Tag, desc: 'Manage event rates & inclusions' },
    { label: 'Inventory & Gear', path: '/inventory', icon: Package, desc: 'Track equipment & stock levels' },
    { label: 'Availability Rules', path: '/professional/availability', icon: Clock, desc: 'Set working hours & blocked dates' },
    { label: 'Portfolio Content', path: '/portfolio', icon: Layers, desc: 'Manage showcase posts & reels' },
    { label: 'Home Feed', path: '/', icon: Home, desc: 'Explore the live client feed' },
    { label: 'Reels Showcase', path: '/reels', icon: Film, desc: 'Watch trending event inspiration' },
  ];

  const navItems = isCustomer ? customerNavItems : professionalPrimaryNavItems;

  return (
    <>
      <aside
        className={`hidden md:flex flex-col fixed top-0 bottom-0 left-0 z-40 bg-surface border-r border-border ${
          isChatRoute ? 'w-[72px] px-2 py-5' : 'w-[72px] lg:w-[245px] px-3 py-5'
        } justify-between transition-all duration-200 select-none`}
      >
        {/* Top Logo & Primary Nav */}
        <div className="space-y-6">
          <Link
            to={isCustomer ? '/' : '/dashboard'}
            className="flex items-center px-1.5 py-1 text-charcoal group"
          >
            {/* When sidebar is collapsed (icon-only e.g. md screen or chat route) */}
            <div className={isChatRoute ? 'block' : 'lg:hidden'}>
              <img
                src="/crimson-ribbon-s-logo.png"
                alt="Subakarya"
                className="w-9 h-9 object-contain flex-shrink-0 group-hover:scale-105 transition-transform drop-shadow-sm mx-auto"
              />
            </div>

            {/* When sidebar is expanded on large desktop */}
            {!isChatRoute && (
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
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/30 transition-all text-left group"
              title="Create Content / Explore"
            >
              <PlusSquare className="w-6 h-6 stroke-[1.8px] text-charcoal flex-shrink-0 icon-hover-base group-icon-sparkle" />
              {!isChatRoute && (
                <span className="hidden lg:inline">
                  {accountType === 'professional' ? 'Create' : 'Explore'}
                </span>
              )}
            </button>

            {/* Notifications Item */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-sand/30 transition-all text-left relative group"
              title="Notifications"
            >
              <div className="relative flex-shrink-0 flex items-center justify-center">
                <Heart className="w-6 h-6 stroke-[1.8px] text-charcoal icon-hover-base group-icon-heart" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-wine ring-2 ring-surface"></span>
              </div>
              {!isChatRoute && <span className="hidden lg:inline">Notifications</span>}
            </button>
          </nav>
        </div>

        {/* Bottom Menu / More Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-medium transition-colors text-left group ${
              showMoreMenu ? 'bg-sand/60 font-bold text-wine' : 'text-charcoal hover:bg-sand/40'
            }`}
            title="More Options & Menu"
          >
            <Menu className="w-6 h-6 stroke-[2px] flex-shrink-0 icon-hover-base group-hover:scale-110 transition-transform" />
            {!isChatRoute && (
              <div className="hidden lg:flex items-center justify-between flex-1 min-w-0">
                <span className="font-semibold">More</span>
                <ChevronDown className={`w-4 h-4 text-charcoal-muted transition-transform duration-200 ${
                  showMoreMenu ? 'rotate-180 text-wine' : ''
                }`} />
              </div>
            )}
          </button>

          {/* More Flyout Popover Menu - Positioned cleanly above the button */}
          {showMoreMenu && (
            <div className="absolute bottom-14 left-0 w-72 bg-surface-card rounded-2xl shadow-dropdown border border-border p-2.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 max-h-[85vh] overflow-y-auto">
              {/* User Identity Header */}
              <div className="p-2.5 border-b border-border/80">
                <div className="flex items-center gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-border shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-charcoal truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-charcoal-muted truncate">
                      {'businessName' in currentUser ? currentUser.businessName : currentUser.email}
                    </p>
                  </div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sand/60 text-charcoal border border-sand-dark">
                  <span className="w-1.5 h-1.5 rounded-full bg-wine"></span>
                  <span>{isCustomer ? 'Customer Account' : 'Vendor Portal Active'}</span>
                </div>
              </div>

              {/* Vendor Management Tools Section (When in vendor mode) */}
              {!isCustomer && (
                <div className="py-2 px-1 border-b border-border/80">
                  <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-charcoal-light mb-1.5">
                    Vendor Business Tools
                  </p>
                  <div className="space-y-0.5">
                    {professionalMoreTools.map((tool) => {
                      const ToolIcon = tool.icon;
                      const isToolActive = location.pathname === tool.path;
                      return (
                        <Link
                          key={tool.label}
                          to={tool.path}
                          onClick={() => setShowMoreMenu(false)}
                          className={`flex items-start gap-3 p-2 rounded-xl text-xs transition-colors group ${
                            isToolActive
                              ? 'bg-sand/70 font-bold text-wine'
                              : 'text-charcoal hover:bg-sand/35'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-sand/60 text-wine flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                            <ToolIcon className="w-4 h-4 icon-hover-base" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-charcoal leading-tight truncate">{tool.label}</p>
                            <p className="text-[10px] text-charcoal-muted truncate mt-0.5">{tool.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

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
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-sand/70 font-bold text-charcoal'
                          : 'text-charcoal-muted hover:bg-sand/30 hover:text-charcoal'
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
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-charcoal hover:bg-sand/40 rounded-lg group"
                >
                  <Settings className="w-4 h-4 text-charcoal-muted group-icon-gear icon-hover-base" />
                  <span>Settings & Reset</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-error hover:bg-error-light rounded-lg transition-colors group"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-1 icon-hover-base transition-transform" />
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
          } w-80 bg-surface-card border-r border-border shadow-dropdown p-4 z-30 animate-in slide-in-from-left duration-200 overflow-y-auto`}
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
          <div className="mt-3 space-y-2.5">
            <div
              onClick={() => {
                setShowNotifications(false);
                navigate('/bookings');
              }}
              className="p-3 rounded-xl bg-sand/30 hover:bg-sand/50 text-xs flex items-start gap-2.5 cursor-pointer transition-all active:scale-98 border border-sand-dark/40"
            >
              <CheckCircle2 className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-charcoal">Quotation Received</p>
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
