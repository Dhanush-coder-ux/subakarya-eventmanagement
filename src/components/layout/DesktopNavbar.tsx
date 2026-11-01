import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Settings,
  User,
  ChevronDown,
  LogOut,
  RefreshCw,
  LayoutDashboard,
  Package,
  Calendar,
  CalendarCheck,
  Tag,
  Clock,
  Film,
  Send,
  CreditCard,
  Repeat2,
  Shield,
  Bell,
  Check,
  X,
  Store,
  Layers,
  ClipboardList,
  Building2,
  Home,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

interface SearchablePage {
  title: string;
  path: string;
  category: 'Workspace' | 'Operations' | 'Settings' | 'Discovery';
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  description: string;
  role?: 'all' | 'customer' | 'professional';
}

const SEARCHABLE_PAGES: SearchablePage[] = [
  // Workspace & Discovery
  {
    title: 'Dashboard Overview',
    path: '/dashboard',
    category: 'Workspace',
    icon: LayoutDashboard,
    keywords: ['dashboard', 'overview', 'analytics', 'home', 'metrics', 'stats', 'revenue'],
    description: 'Professional dashboard, sales stats, and business reach',
    role: 'professional',
  },
  {
    title: 'Home Feed',
    path: '/',
    category: 'Discovery',
    icon: Home,
    keywords: ['home', 'feed', 'marketplace', 'explore', 'start'],
    description: 'Event marketplace, featured services, and inspiration',
    role: 'customer',
  },
  {
    title: 'Explore & Search',
    path: '/search',
    category: 'Discovery',
    icon: Search,
    keywords: ['search', 'explore', 'find', 'vendors', 'photographers', 'caterers', 'decorators', 'venues'],
    description: 'Discover event professionals, services, and creative posts',
    role: 'all',
  },
  {
    title: 'Reels & Videos',
    path: '/reels',
    category: 'Discovery',
    icon: Film,
    keywords: ['reels', 'videos', 'inspiration', 'clips', 'showcase'],
    description: 'Watch event highlights, cinematic wedding reels, and decor videos',
    role: 'all',
  },
  {
    title: 'Messages & Inquiries',
    path: '/chat',
    category: 'Workspace',
    icon: Send,
    keywords: ['messages', 'chat', 'inbox', 'conversations', 'clients', 'talk'],
    description: 'Direct customer and vendor messaging channel',
    role: 'all',
  },
  {
    title: 'Bookings Management',
    path: '/bookings',
    category: 'Workspace',
    icon: CalendarCheck,
    keywords: ['bookings', 'appointments', 'events', 'schedule', 'reservations'],
    description: 'View booking requests, confirmed dates, and status updates',
    role: 'all',
  },
  {
    title: 'Portfolio & Showcase',
    path: '/portfolio',
    category: 'Workspace',
    icon: Layers,
    keywords: ['portfolio', 'posts', 'work', 'gallery', 'photos', 'creations'],
    description: 'Showcase photos, reels, and past event projects',
    role: 'professional',
  },
  {
    title: 'Repost Requests',
    path: '/professional/repost-requests',
    category: 'Workspace',
    icon: Repeat2,
    keywords: ['reposts', 'permission', 'customer reels', 'social', 'reviews'],
    description: 'Review and approve customer reel submission requests',
    role: 'professional',
  },

  // Operations
  {
    title: 'Services & Pricing',
    path: '/services',
    category: 'Operations',
    icon: Tag,
    keywords: ['services', 'pricing', 'packages', 'rates', 'fees', 'offerings'],
    description: 'Manage event service packages, rates, and inclusions',
    role: 'professional',
  },
  {
    title: 'Products & Inventory',
    path: '/inventory',
    category: 'Operations',
    icon: Package,
    keywords: ['products', 'inventory', 'stock', 'rentals', 'gear', 'equipment', 'variants', 'sku'],
    description: 'Manage physical decor items, rental equipment, and stock levels',
    role: 'professional',
  },
  {
    title: 'Orders Management',
    path: '/settings/orders',
    category: 'Operations',
    icon: ClipboardList,
    keywords: ['orders', 'fulfill', 'dispatch', 'sales', 'deliveries', 'rentals'],
    description: 'Fulfill customer merchandise and rental equipment orders',
    role: 'all',
  },
  {
    title: 'Availability & Working Hours',
    path: '/professional/availability',
    category: 'Operations',
    icon: Clock,
    keywords: ['availability', 'hours', 'working hours', 'slots', 'blocked dates'],
    description: 'Configure working hours, blocked dates, and booking slots',
    role: 'professional',
  },
  {
    title: 'Event Calendar',
    path: '/professional/calendar',
    category: 'Operations',
    icon: Calendar,
    keywords: ['calendar', 'schedule', 'month', 'week', 'timeline'],
    description: 'Interactive calendar schedule of booked events and shoots',
    role: 'professional',
  },

  // Settings
  {
    title: 'Settings Console',
    path: '/settings',
    category: 'Settings',
    icon: Settings,
    keywords: ['settings', 'preferences', 'configuration', 'setup', 'options'],
    description: 'Account settings, workspace preferences, and security',
    role: 'all',
  },
  {
    title: 'Business Operating Mode',
    path: '/settings/business-mode',
    category: 'Settings',
    icon: Store,
    keywords: ['business mode', 'mode', 'switch mode', 'booking mode', 'seller mode', 'operating mode'],
    description: 'Switch between Booking-Based and Order-Based business models',
    role: 'professional',
  },
  {
    title: 'Account & Bank (Financials)',
    path: '/settings/account-bank',
    category: 'Settings',
    icon: CreditCard,
    keywords: ['account bank', 'financials', 'payouts', 'commission', 'revenue', 'earnings', 'ledger', 'bank'],
    description: 'Platform commission breakdown, vendor earnings, and payout settlements',
    role: 'all',
  },
  {
    title: 'Business Profile',
    path: '/settings/business-profile',
    category: 'Settings',
    icon: Building2,
    keywords: ['business profile', 'profile', 'bio', 'location', 'company', 'commercial'],
    description: 'Commercial business entity, coverage areas, and public bio',
    role: 'professional',
  },
  {
    title: 'Account Information',
    path: '/settings/account',
    category: 'Settings',
    icon: User,
    keywords: ['account', 'profile info', 'email', 'phone', 'credentials'],
    description: 'Personal details, email verification, and contact information',
    role: 'all',
  },
  {
    title: 'Privacy & Security',
    path: '/settings/privacy',
    category: 'Settings',
    icon: Shield,
    keywords: ['privacy', 'security', 'password', 'two factor', 'blocked accounts'],
    description: 'Password management, security credentials, and visibility rules',
    role: 'all',
  },
  {
    title: 'Notification Preferences',
    path: '/settings/notifications',
    category: 'Settings',
    icon: Bell,
    keywords: ['notifications', 'alerts', 'push', 'emails', 'reminders'],
    description: 'Configure push alerts, booking notifications, and order updates',
    role: 'all',
  },
  {
    title: 'Switch Account Type',
    path: '/settings/switch',
    category: 'Settings',
    icon: RefreshCw,
    keywords: ['switch account', 'role', 'customer', 'vendor', 'professional'],
    description: 'Switch between Customer browsing and Vendor management',
    role: 'all',
  },
];

export const DesktopNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    userAccount,
    activeExperience,
    switchExperience,
    accountType,
    switchActiveUser,
    allCustomers,
    allProfessionals,
    logout,
  } = useAuthStore();
  const { businessMode, setBusinessMode } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';
  const isOrderBased = businessMode === 'ORDER_BASED';
  const hasProProfile = Boolean(userAccount.professionalProfile);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Profile dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileContainerRef = useRef<HTMLDivElement>(null);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        profileContainerRef.current &&
        !profileContainerRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter searchable pages
  const filteredPages = SEARCHABLE_PAGES.filter((page) => {
    // Role matching
    if (page.role && page.role !== 'all') {
      if (page.role === 'customer' && !isCustomer) return false;
      if (page.role === 'professional' && isCustomer) return false;
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      page.title.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q) ||
      page.category.toLowerCase().includes(q) ||
      page.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 8); // Top 8 results

  const handleSelectPage = (path: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleExperienceSwitch = (exp: 'PERSONAL' | 'PROFESSIONAL') => {
    setIsProfileOpen(false);
    if (exp === 'PROFESSIONAL' && !hasProProfile) {
      navigate('/onboarding/professional');
      return;
    }
    switchExperience(exp);
    if (exp === 'PERSONAL') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/login');
  };

  // Determine current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/settings')) return 'Settings';
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/') return isCustomer ? 'Home' : 'Dashboard';
    if (path.startsWith('/search')) return 'Search & Explore';
    if (path.startsWith('/reels')) return 'Reels';
    if (path.startsWith('/chat') || path.startsWith('/messages')) return 'Messages';
    if (path.startsWith('/bookings')) return 'Bookings';
    if (path.startsWith('/services')) return 'Services & Pricing';
    if (path.startsWith('/inventory')) return 'Products & Inventory';
    if (path.startsWith('/portfolio')) return 'Portfolio';
    if (path.startsWith('/profile')) return 'Profile';
    return 'Subakarya';
  };

  return (
    <header className="hidden md:flex sticky top-0 z-30 h-14 bg-surface/95 backdrop-blur-md border-b border-border px-6 items-center justify-between shrink-0 select-none">
      {/* 1. Left: Page Indicator & Workspace Context */}
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-sm font-bold text-charcoal tracking-tight truncate">
          {getPageTitle()}
        </h2>

        <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-sand/60 text-charcoal border border-sand-dark">
          <span className="w-1.5 h-1.5 rounded-full bg-wine" />
          <span>
            {isCustomer
              ? 'Customer Account'
              : isOrderBased
              ? 'Order-Based Mode'
              : 'Booking-Based Mode'}
          </span>
        </div>
      </div>

      {/* 2. Center: Global Search Bar ("search the all pages in that feild") */}
      <div className="relative w-80 lg:w-96" ref={searchContainerRef}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            placeholder="Search pages, tools, settings... (Ctrl+K)"
            className="w-full pl-9 pr-14 py-1.5 text-xs rounded-lg border border-border bg-surface-card hover:bg-surface text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine focus:bg-surface focus:ring-1 focus:ring-wine/20 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-0.5 text-charcoal-muted hover:text-charcoal"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono text-charcoal-muted bg-surface border border-border rounded">
              ⌘K
            </kbd>
          </div>
        </form>

        {/* Global Search Results Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface rounded-xl border border-border shadow-elevated overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2 border-b border-border bg-surface-card flex items-center justify-between text-[11px] text-charcoal-muted">
              <span>Quick Navigation</span>
              <span>{filteredPages.length} pages found</span>
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-border/40 p-1">
              {filteredPages.length === 0 ? (
                <div className="p-4 text-center text-xs text-charcoal-muted">
                  <p>No matching pages found for "{searchQuery}"</p>
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="mt-2 text-wine font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>Search marketplace for "{searchQuery}"</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                filteredPages.map((page) => {
                  const PageIcon = page.icon;
                  return (
                    <button
                      key={page.path}
                      type="button"
                      onClick={() => handleSelectPage(page.path)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-sand/40 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-md bg-sand/60 text-wine flex items-center justify-center shrink-0 border border-sand-dark group-hover:bg-wine group-hover:text-white transition-colors">
                        <PageIcon className="w-3.5 h-3.5 stroke-[2px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-charcoal truncate">
                            {page.title}
                          </p>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-sand/60 text-charcoal-muted border border-sand-dark">
                            {page.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-charcoal-muted truncate">
                          {page.description}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {searchQuery && filteredPages.length > 0 && (
              <div className="p-2 border-t border-border bg-surface-card text-right">
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="text-xs font-semibold text-wine hover:underline inline-flex items-center gap-1"
                >
                  <span>Search marketplace for "{searchQuery}"</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Right: Profile Account Switcher */}
      <div className="flex items-center gap-2">
        {/* Profile Button with Dropdown (Switch Accounts & Logout) */}
        <div className="relative" ref={profileContainerRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border transition-all ${
              isProfileOpen
                ? 'bg-sand/60 border-sand-dark text-wine'
                : 'border-border bg-surface hover:bg-sand/30 text-charcoal'
            }`}
            title="Account & Profile Menu"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-border"
            />
            <span className="text-xs font-semibold truncate max-w-[110px]">
              {currentUser.name}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-charcoal-muted transition-transform duration-150 ${
                isProfileOpen ? 'rotate-180 text-wine' : ''
              }`}
            />
          </button>

          {/* Profile Dropdown Popover */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-surface rounded-xl border border-border shadow-elevated p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
              {/* User Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-border shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-charcoal truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-charcoal-muted truncate">
                    {'businessName' in currentUser
                      ? currentUser.businessName
                      : currentUser.email}
                  </p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold rounded bg-sand/70 text-wine border border-sand-dark">
                    {isCustomer
                      ? 'Personal Account'
                      : isOrderBased
                      ? 'Professional • Seller Mode'
                      : 'Professional • Booking Mode'}
                  </span>
                </div>
              </div>

              {/* Switch Role Experience (Personal ↔ Professional) */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Switch Experience
                </p>
                <div className="grid grid-cols-2 gap-1 p-1 bg-surface-card rounded-lg border border-border/60">
                  <button
                    type="button"
                    onClick={() => handleExperienceSwitch('PERSONAL')}
                    className={`py-1.5 text-xs font-semibold rounded transition-colors ${
                      isCustomer
                        ? 'bg-wine text-white shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExperienceSwitch('PROFESSIONAL')}
                    className={`py-1.5 text-xs font-semibold rounded transition-colors ${
                      !isCustomer
                        ? 'bg-wine text-white shadow-xs'
                        : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
                    }`}
                  >
                    Professional
                  </button>
                </div>

                {!hasProProfile && isCustomer && (
                  <Link
                    to="/onboarding/professional"
                    onClick={() => setIsProfileOpen(false)}
                    className="mt-1 flex items-center justify-between p-2 rounded-lg bg-sand/60 border border-sand-dark text-wine hover:bg-sand text-[11px] font-bold transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-wine" />
                      <span>Become a Professional</span>
                    </span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Vendor Business Mode Quick Switcher (When Vendor) */}
              {!isCustomer && (
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                      Business Operating Mode
                    </p>
                    <Link
                      to="/settings/business-mode"
                      onClick={() => setIsProfileOpen(false)}
                      className="text-[10px] font-semibold text-wine hover:underline"
                    >
                      Settings
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-surface-card rounded-lg border border-border/60">
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessMode('BOOKING_BASED');
                        setIsProfileOpen(false);
                      }}
                      className={`py-1 text-xs font-semibold rounded transition-colors ${
                        !isOrderBased
                          ? 'bg-sand text-wine font-bold border border-sand-dark'
                          : 'text-charcoal-muted hover:text-charcoal'
                      }`}
                    >
                      Booking Mode
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessMode('ORDER_BASED');
                        setIsProfileOpen(false);
                      }}
                      className={`py-1 text-xs font-semibold rounded transition-colors ${
                        isOrderBased
                          ? 'bg-sand text-wine font-bold border border-sand-dark'
                          : 'text-charcoal-muted hover:text-charcoal'
                      }`}
                    >
                      Seller Mode
                    </button>
                  </div>
                </div>
              )}

              {/* Switch Persona (Demo Accounts) */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <p className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Switch Persona
                </p>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {(isCustomer ? allCustomers : allProfessionals).slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchActiveUser(u.id);
                        setIsProfileOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-colors ${
                        currentUser.id === u.id
                          ? 'bg-sand/70 text-wine font-semibold border border-sand-dark'
                          : 'hover:bg-sand/30 text-charcoal'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={u.avatar}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="text-xs truncate">
                          {'businessName' in u ? u.businessName : u.name}
                        </span>
                      </div>
                      {currentUser.id === u.id && (
                        <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Profile & Settings Navigation */}
              <div className="space-y-1 pt-2 border-t border-border">
                <Link
                  to={`/profile/${currentUser.id}`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-charcoal hover:bg-sand/30 transition-colors"
                >
                  <User className="w-4 h-4 text-charcoal-muted" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-charcoal hover:bg-sand/30 transition-colors"
                >
                  <Settings className="w-4 h-4 text-charcoal-muted" />
                  <span>Settings & Preferences</span>
                </Link>
              </div>

              {/* Sign Out Action */}
              <div className="pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-error hover:bg-error-light/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

