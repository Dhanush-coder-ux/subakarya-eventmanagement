import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Film,
  CalendarCheck,
  User,
  LayoutDashboard,
  Calendar,
  Send,
  Menu,
  Package,
  ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { currentUser, accountType, toggleMobileMenu } = useAuthStore();
  const { businessMode } = useMarketplaceStore();
  const isCustomer = accountType === 'customer';
  const isOrderBased = businessMode === 'ORDER_BASED';
  const isReels = location.pathname === '/reels';

  const customerLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  const bookingProfessionalLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', path: '/professional/calendar', icon: Calendar },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Messages', path: '/chat', icon: Send },
    { label: 'Menu', path: '#menu', icon: Menu, isToggle: true },
  ];

  const orderProfessionalLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/inventory', icon: Package },
    { label: 'Orders', path: '/settings/orders', icon: ClipboardList },
    { label: 'Messages', path: '/chat', icon: Send },
    { label: 'Menu', path: '#menu', icon: Menu, isToggle: true },
  ];

  const professionalLinks = isOrderBased ? orderProfessionalLinks : bookingProfessionalLinks;

  const links = isCustomer ? customerLinks : professionalLinks;

  return (
    <nav
      className={`md:hidden fixed bottom-3 left-4 right-4 z-40 max-w-sm mx-auto shadow-elevated rounded-full px-3 py-1.5 select-none transition-all duration-200 ${
        isReels
          ? 'bg-charcoal/80 backdrop-blur-md border border-white/20 text-white'
          : 'bg-sand border border-sand-dark/90 text-charcoal'
      }`}
    >
      <div className="flex items-center justify-between">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;

          if ('isToggle' in link && link.isToggle) {
            return (
              <button
                key={link.path}
                type="button"
                onClick={() => toggleMobileMenu(true)}
                className={`p-2 rounded-full flex flex-col items-center justify-center transition-all active:scale-90 ${
                  isReels
                    ? 'text-white/80 hover:text-white'
                    : 'text-charcoal hover:text-wine'
                }`}
                title={link.label}
              >
                <Icon className="w-5 h-5 stroke-[1.8px] icon-hover-base icon-hover-scale" />
              </button>
            );
          }

          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-2.5 py-1.5 rounded-full flex flex-col items-center justify-center transition-all duration-200 active:scale-90 ${
                isActive
                  ? isReels
                    ? 'bg-wine text-white shadow-xs'
                    : 'bg-wine-soft/90 text-wine shadow-xs'
                  : isReels
                  ? 'text-white/75 hover:text-white'
                  : 'text-charcoal/80 hover:text-wine'
              }`}
              title={link.label}
            >
              {'isAvatar' in link && link.isAvatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={`w-6 h-6 rounded-full object-cover ring-2 transition-all ${
                    isActive
                      ? isReels
                        ? 'ring-sand shadow-xs'
                        : 'ring-wine shadow-xs'
                      : isReels
                      ? 'ring-white/40'
                      : 'ring-sand-dark'
                  }`}
                />
              ) : (
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive
                      ? `stroke-[2.5px] scale-105 ${isReels ? 'text-white' : 'text-wine'}`
                      : `stroke-[1.8px] ${isReels ? 'text-white/75' : 'text-charcoal/80'}`
                  }`}
                />
              )}
              {/* Sleek active dot indicator */}
              {isActive && (
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 animate-in zoom-in duration-150 ${
                    isReels ? 'bg-sand' : 'bg-wine'
                  }`}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
