import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { useAuthStore } from '../../store/useAuthStore';

export const Layout: React.FC = () => {
  const { isLoggedIn, accountType } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const isChatRoute =
    location.pathname.startsWith('/chat') ||
    location.pathname.startsWith('/messages');

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-wine selection:text-white">
      {/* Mobile Top Header (hidden on chat for true Instagram DM full-screen experience) */}
      {!isChatRoute && <MobileHeader />}

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 ${
          accountType === 'customer' ? 'md:ml-[72px] lg:ml-[245px]' : 'md:ml-64'
        } ${isChatRoute ? 'pb-0 h-[100dvh] overflow-hidden' : 'pb-16 md:pb-6'} transition-all duration-200`}
      >
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (hidden on chat so the message input bar stays pinned) */}
      {!isChatRoute && <BottomNav />}
    </div>
  );
};
