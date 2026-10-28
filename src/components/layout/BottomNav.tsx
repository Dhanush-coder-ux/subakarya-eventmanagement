import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  Film,
  Search,
  MessageSquare,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { currentUser, accountType } = useAuthStore();
  const { conversations } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';

  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  const customerLinks = [
    { label: 'Discover', path: '/', icon: Sparkles },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Messages', path: '/chat', icon: MessageSquare, badge: unreadCount },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User },
  ];

  const professionalLinks = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Reels', path: '/reels', icon: Film },
    { label: 'Services', path: '/services', icon: Sparkles },
    { label: 'Messages', path: '/chat', icon: MessageSquare, badge: unreadCount },
    { label: 'Profile', path: `/profile/${currentUser.id}`, icon: User },
  ];

  const links = isCustomer ? customerLinks : professionalLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/98 backdrop-blur-lg border-t border-border shadow-dropdown px-2 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-wine font-semibold'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3px] text-wine' : 'stroke-[1.8px]'}`} />
                {Boolean(link.badge) && (
                  <span className="absolute -top-1 -right-2 px-1.2 py-0.2 min-w-[14px] h-[14px] flex items-center justify-center text-[9px] font-bold rounded-full bg-wine text-white ring-1 ring-surface">
                    {link.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 tracking-tight">{link.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-wine mt-0.5"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
