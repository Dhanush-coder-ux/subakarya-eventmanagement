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
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { currentUser, accountType, toggleMobileMenu } = useAuthStore();
  const isCustomer = accountType === 'customer';

  const customerLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User, isAvatar: true },
  ];

  const professionalLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Calendar', path: '/professional/calendar', icon: Calendar },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Messages', path: '/chat', icon: Send },
    { label: 'Menu', path: '#menu', icon: Menu, isToggle: true },
  ];

  const links = isCustomer ? customerLinks : professionalLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sand border-t border-sand-dark shadow-elevated px-4 py-2">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            'isToggle' in link && link.isToggle ? (
              <button
                key={link.path}
                type="button"
                onClick={() => toggleMobileMenu(true)}
                className="p-1.5 flex items-center justify-center transition-transform active:scale-90 text-charcoal hover:text-wine"
                title={link.label}
              >
                <Icon className="w-6 h-6 stroke-[1.8px] icon-hover-base icon-hover-scale" />
              </button>
            ) : (
            <Link
              key={link.path}
              to={link.path}
              className="p-1.5 flex items-center justify-center transition-transform active:scale-90"
              title={link.label}
            >
              {'isAvatar' in link && link.isAvatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className={`w-7 h-7 rounded-full object-cover ring-2 transition-all ${
                    isActive ? 'ring-wine shadow-xs' : 'ring-sand-dark'
                  }`}
                />
              ) : (
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? 'stroke-[2.5px] text-wine' : 'stroke-[1.8px] text-charcoal'
                  }`}
                />
              )}
            </Link>
          ));
        })}
      </div>
    </nav>
  );
};
