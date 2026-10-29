import React from 'react';
import { Route } from 'react-router-dom';
import { ConsumerHomePage } from '../../../pages/ConsumerHomePage';
import { ConsumerOnboardingPage } from '../../../pages/ConsumerOnboardingPage';

export const consumerRoutes = [
  <Route key="consumer-onboarding" path="/onboarding/customer" element={<ConsumerOnboardingPage />} />,
  <Route key="consumer-home" path="/consumer/home" element={<ConsumerHomePage />} />,
];
