import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Booking, BookingStatus } from '../../../types';

export const bookingService = {
  getRelevantBookings(): Booking[] {
    const { currentUser, accountType } = useAuthStore.getState();
    const { bookings } = useMarketplaceStore.getState();
    const isCustomer = accountType === 'customer';
    return bookings.filter((b) =>
      isCustomer ? b.customerId === currentUser.id : b.professionalId === currentUser.id
    );
  },

  updateStatus(bookingId: string, status: BookingStatus): void {
    useMarketplaceStore.getState().updateBookingStatus(bookingId, status);
  },

  findBookingById(bookingId: string): Booking | undefined {
    return useMarketplaceStore.getState().bookings.find((b) => b.id === bookingId);
  },
};

