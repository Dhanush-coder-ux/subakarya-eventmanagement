import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
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
    <div
      className={`bg-surface flex flex-col selection:bg-wine selection:text-white ${
        isChatRoute
          ? 'fixed inset-0 h-[100dvh] h-screen overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* Mobile Top Header (hidden on chat for true Instagram DM full-screen experience) */}
      {!isChatRoute && <MobileHeader />}

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col min-h-0 min-w-0 ${
          isChatRoute
            ? 'md:ml-[72px] h-full overflow-hidden'
            : 'md:ml-[72px] lg:ml-[245px] pb-16 md:pb-6'
        } transition-all duration-200`}
      >
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (hidden on chat so the message input bar stays pinned) */}
      {!isChatRoute && <BottomNav />}

      {/* Global Responsive Mobile Drawer for Menus & Quick Role Actions */}
      <MobileDrawer />
    </div>
  );
};
