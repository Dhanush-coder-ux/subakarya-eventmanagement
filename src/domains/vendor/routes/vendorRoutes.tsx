import React from 'react';
import { Route } from 'react-router-dom';
import { ProfessionalDashboardPage } from '../../../pages/ProfessionalDashboardPage';
import { ProfessionalOnboardingPage } from '../../../pages/ProfessionalOnboardingPage';
import { ServicesPage } from '../../../pages/ServicesPage';
import { InventoryPage } from '../../../pages/InventoryPage';
import { PortfolioPage } from '../../../pages/PortfolioPage';

export const vendorRoutes = [
  <Route key="vendor-onboarding" path="/onboarding/professional" element={<ProfessionalOnboardingPage />} />,
  <Route key="vendor-dashboard" path="/dashboard" element={<ProfessionalDashboardPage />} />,
  <Route key="vendor-services" path="/services" element={<ServicesPage />} />,
  <Route key="vendor-inventory" path="/inventory" element={<InventoryPage />} />,
  <Route key="vendor-portfolio" path="/portfolio" element={<PortfolioPage />} />,
];
