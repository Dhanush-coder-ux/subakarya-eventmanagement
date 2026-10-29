import React from 'react';
import { Route } from 'react-router-dom';
import { BookingsPage } from '../../../pages/BookingsPage';
import { CustomerBookingPage } from '../../../pages/CustomerBookingPage';

export const bookingsRoutes = [
  <Route key="bookings-list" path="/bookings" element={<BookingsPage />} />,
  <Route
    key="customer-booking"
    path="/professionals/:professionalId/book"
    element={<CustomerBookingPage />}
  />,
];
