import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
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

  return (
    <div
      className={`bg-surface flex flex-col selection:bg-wine selection:text-white ${
        isSpecificChatConversation
          ? 'fixed inset-0 h-[100dvh] h-screen overflow-hidden'
          : isChatRoute
          ? 'fixed inset-0 h-[100dvh] h-screen overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* Mobile Top Header (hidden only when inside an active conversation thread or full chat) */}
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

      {/* Mobile Bottom Navigation: visible on chat thread list in mobile, hidden only inside an active chat thread */}
      {(!isSpecificChatConversation) && <BottomNav />}

      {/* Global Responsive Mobile Drawer for Menus & Quick Role Actions */}
      <MobileDrawer />
    </div>
  );
};
