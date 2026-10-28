import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { AccountTypePage } from './pages/AccountTypePage';
import { ConsumerOnboardingPage } from './pages/ConsumerOnboardingPage';
import { ProfessionalOnboardingPage } from './pages/ProfessionalOnboardingPage';
import { ConsumerHomePage } from './pages/ConsumerHomePage';
import { ReelsPage } from './pages/ReelsPage';
import { SearchPage } from './pages/SearchPage';
import { ProfilePage } from './pages/ProfilePage';
import { ChatPage } from './pages/ChatPage';
import { ProfessionalDashboardPage } from './pages/ProfessionalDashboardPage';
import { ServicesPage } from './pages/ServicesPage';
import { InventoryPage } from './pages/InventoryPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BookingsPage } from './pages/BookingsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAuthStore } from './store/useAuthStore';

// Main Home Switcher component based on active role
const HomeRouteSwitcher: React.FC = () => {
  const { accountType, isLoggedIn } = useAuthStore();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return accountType === 'professional' ? <ProfessionalDashboardPage /> : <ConsumerHomePage />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth & Onboarding Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/account-type" element={<AccountTypePage />} />
        <Route path="/onboarding/customer" element={<ConsumerOnboardingPage />} />
        <Route path="/onboarding/professional" element={<ProfessionalOnboardingPage />} />

        {/* Main App Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomeRouteSwitcher />} />
          <Route path="/reels" element={<ReelsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Professional Only Management Routes */}
          <Route path="/dashboard" element={<ProfessionalDashboardPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

