import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../providers/AuthProvider';
import { ProtectedRoute, RoleRouteGuard } from './routeGuards';

// Pages
import { LoginPage } from '../../pages/LoginPage';
import { AccountTypePage } from '../../pages/AccountTypePage';
import { ConsumerOnboardingPage } from '../../pages/ConsumerOnboardingPage';
import { ProfessionalOnboardingPage } from '../../pages/ProfessionalOnboardingPage';
import { ConsumerHomePage } from '../../pages/ConsumerHomePage';
import { ReelsPage } from '../../pages/ReelsPage';
import { SearchPage } from '../../pages/SearchPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { ChatPage } from '../../pages/ChatPage';
import { ProfessionalDashboardPage } from '../../pages/ProfessionalDashboardPage';
import { ServicesPage } from '../../pages/ServicesPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { PortfolioPage } from '../../pages/PortfolioPage';
import { BookingsPage } from '../../pages/BookingsPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { CustomerBookingPage } from '../../pages/CustomerBookingPage';
import { ProfessionalAvailabilityPage } from '../../pages/ProfessionalAvailabilityPage';
import { ProfessionalCalendarPage } from '../../pages/ProfessionalCalendarPage';

// Main Home Switcher component based on active role
const HomeRouteSwitcher: React.FC = () => {
  const { accountType, isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return accountType === 'professional' ? <ProfessionalDashboardPage /> : <ConsumerHomePage />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Auth & Onboarding Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account-type" element={<AccountTypePage />} />
      <Route path="/onboarding/customer" element={<ConsumerOnboardingPage />} />
      <Route path="/onboarding/professional" element={<ProfessionalOnboardingPage />} />

      {/* Main App Layout */}
      <Route element={<Layout />}>
        {/* Dynamic Role Home */}
        <Route path="/" element={<HomeRouteSwitcher />} />

        {/* Discovery & Shared Media */}
        <Route path="/reels" element={<ReelsPage />} />
        <Route path="/search" element={<SearchPage />} />

        {/* Messaging & Chat */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/messages/:conversationId" element={<ChatPage />} />

        {/* Profile & Settings */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Customer Booking & Availability Exploration */}
        <Route
          path="/professionals/:professionalId/book"
          element={<CustomerBookingPage />}
        />
        <Route
          path="/professionals/:professionalId/availability"
          element={<CustomerBookingPage />}
        />

        {/* Professional / Vendor Specific Management Routes (Guarded for Vendor role) */}
        <Route
          path="/dashboard"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <ProfessionalDashboardPage />
            </RoleRouteGuard>
          }
        />
        <Route
          path="/services"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <ServicesPage />
            </RoleRouteGuard>
          }
        />
        <Route
          path="/inventory"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <InventoryPage />
            </RoleRouteGuard>
          }
        />
        <Route
          path="/portfolio"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <PortfolioPage />
            </RoleRouteGuard>
          }
        />
        <Route
          path="/availability"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <ProfessionalAvailabilityPage />
            </RoleRouteGuard>
          }
        />
        <Route
          path="/professional/availability"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <ProfessionalAvailabilityPage />
            </RoleRouteGuard>
          }
        />
        <Route
          path="/calendar"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <ProfessionalCalendarPage />
            </RoleRouteGuard>
          }
        />
        <Route
          path="/professional/calendar"
          element={
            <RoleRouteGuard allowedRoles={['professional']} fallbackRedirect="/">
              <ProfessionalCalendarPage />
            </RoleRouteGuard>
          }
        />
        <Route path="/professional/bookings" element={<BookingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
