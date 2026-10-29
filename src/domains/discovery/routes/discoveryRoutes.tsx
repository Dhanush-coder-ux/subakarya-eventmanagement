import React from 'react';
import { Route } from 'react-router-dom';
import { SearchPage } from '../../../pages/SearchPage';
import { ReelsPage } from '../../../pages/ReelsPage';

export const discoveryRoutes = [
  <Route key="discovery-search" path="/search" element={<SearchPage />} />,
  <Route key="discovery-reels" path="/reels" element={<ReelsPage />} />,
];

