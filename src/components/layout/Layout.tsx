import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { DesktopNavbar } from './DesktopNavbar';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { MobileDrawer } from './MobileDrawer';
import { useAuthStore } from '../../store/useAuthStore';

export const Layout: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Active chat thread route (when an actual conversationId is selected in URL)
  const isSpecificChatConversation =
    (location.pathname.startsWith('/chat/') && location.pathname !== '/chat') ||
    location.pathname.startsWith('/messages/');

  const isChatRoute =
    location.pathname.startsWith('/chat') ||
    location.pathname.startsWith('/messages');

  const isSettingsRoute = location.pathname.startsWith('/settings');
  const isReelsRoute = location.pathname === '/reels';

  const isSpecificSettingsSection =
    location.pathname.startsWith('/settings/') && location.pathname !== '/settings';

  const isFullHeightNoScroll =
    isChatRoute || isSpecificChatConversation || isSettingsRoute || isReelsRoute;

  const isCollapsedSidebar = isChatRoute || isSettingsRoute;

  return (
    <div
      className={`bg-surface flex flex-col selection:bg-wine selection:text-white ${
        isFullHeightNoScroll
          ? 'fixed inset-0 h-[100dvh] h-screen overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* Mobile Top Header (hidden when inside chat, settings, or reels routes) */}
      {!isChatRoute && !isSettingsRoute && !isReelsRoute && <MobileHeader />}

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col min-h-0 min-w-0 ${
          isReelsRoute
            ? 'md:ml-[72px] lg:ml-[245px] h-full overflow-hidden'
            : isCollapsedSidebar
            ? 'md:ml-[72px] h-full overflow-hidden'
            : 'md:ml-[72px] lg:ml-[245px] pb-20 md:pb-6'
        } transition-all duration-200`}
      >
        {/* Desktop Top Navbar with Search, Settings, and Profile Account Switcher */}
        <DesktopNavbar />

        {/* Page Content Container */}
        <div className={`flex-1 flex flex-col min-h-0 ${isFullHeightNoScroll ? 'h-full overflow-hidden' : ''}`}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation: hidden in active chat thread or specific settings section */}
      {!isSpecificChatConversation && !isSpecificSettingsSection && <BottomNav />}

      {/* Global Responsive Mobile Drawer for Menus & Quick Role Actions */}
      <MobileDrawer />
    </div>
  );
};
