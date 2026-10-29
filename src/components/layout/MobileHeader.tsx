import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  UserCheck,
  Heart,
  Send,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { NotificationsDrawer } from './NotificationsDrawer';

export const MobileHeader: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, accountType, setAccountType, toggleMobileMenu } = useAuthStore();
  const { conversations } = useMarketplaceStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const isCustomer = accountType === 'customer';

  // Unread messages count
  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  const toggleRole = () => {
    const nextRole = isCustomer ? 'professional' : 'customer';
    setAccountType(nextRole);
    if (nextRole === 'customer') {
      navigate('/');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border px-4 py-2.5 flex items-center justify-between">
        {/* Brand Logo & Mode Tag */}
        <div className="flex items-center gap-2">
          <Link to={isCustomer ? '/' : '/dashboard'} className="flex items-center">
            <img src="/subakarya-logo.png" alt="Subakarya" className="w-8 h-8 object-contain" />
          </Link>
          <button
            onClick={toggleRole}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark flex items-center gap-1 active:scale-95"
            title="Tap to switch mode"
          >
            {isCustomer ? <UserCheck className="w-2.5 h-2.5 text-wine" /> : <Building2 className="w-2.5 h-2.5 text-wine" />}
            <span>{isCustomer ? 'Customer' : 'Vendor'}</span>
          </button>
        </div>

        {/* Right Icons: Notifications, Chat, and Customer Menu Drawer */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNotifications(true)}
            className="relative text-charcoal p-1 hover:text-wine active:scale-90 transition-transform"
            title="Notifications"
          >
            <Heart className="w-5 h-5 stroke-[1.8px] icon-hover-base icon-hover-heart" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-wine ring-2 ring-surface"></span>
          </button>

          <button
            onClick={() => navigate('/chat')}
            className="relative text-charcoal p-1 hover:text-wine active:scale-90 transition-transform"
            title="Messages"
          >
            <Send className="w-5 h-5 stroke-[1.8px] icon-hover-base icon-hover-send" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-1 px-1.5 py-0.2 min-w-[16px] h-4 flex items-center justify-center text-[10px] font-bold rounded-full bg-wine text-white ring-2 ring-surface">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Show top Menu button only for Customer mode; on Vendor side, the Menu button is in the Bottom App Bar */}
          {isCustomer && (
            <button
              onClick={() => toggleMobileMenu(true)}
              className="p-1 rounded-lg text-charcoal hover:text-wine active:scale-90 transition-transform"
              title="Open Menu"
            >
              <Menu className="w-6 h-6 stroke-[2px]" />
            </button>
          )}
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
