import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { useAuthStore } from '../../store/useAuthStore';

export const Layout: React.FC = () => {
  const { isLoggedIn, accountType } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-wine selection:text-white">
      {/* Mobile Top Header */}
      <MobileHeader />

      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className={`flex-1 ${accountType === "customer" ? "md:ml-[72px] lg:ml-[245px]" : "md:ml-64"} pb-16 md:pb-6 transition-all duration-200`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
