import { useMemo } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { ProfessionalProfile } from '../../../types';
import { calculateProfileCompleteness } from '../../../core/profile/profileHelpers';

export const useVendorDashboard = () => {
  const { currentUser } = useAuthStore();
  const { posts, reels, bookings, services, inventory, works } = useMarketplaceStore();

  const pro = currentUser.role === 'professional' ? (currentUser as ProfessionalProfile) : null;
  const proId = currentUser.id;

  const myPosts = useMemo(() => posts.filter((p) => p.professionalId === proId), [posts, proId]);
  const myReels = useMemo(() => reels.filter((r) => r.professionalId === proId), [reels, proId]);
  const myBookings = useMemo(() => bookings.filter((b) => b.professionalId === proId), [bookings, proId]);
  const myServices = useMemo(() => services.filter((s) => s.professionalId === proId), [services, proId]);
  const myInventory = useMemo(() => inventory.filter((i) => i.professionalId === proId), [inventory, proId]);
  const myWorks = useMemo(() => works.filter((w) => w.professionalId === proId), [works, proId]);

  const pendingEnquiries = useMemo(
    () => myBookings.filter((b) => b.status === 'pending' || b.status === 'quote_received'),
    [myBookings]
  );
  const confirmedBookings = useMemo(
    () => myBookings.filter((b) => b.status === 'confirmed'),
    [myBookings]
  );

  const completeness = useMemo(() => {
    return pro ? calculateProfileCompleteness(pro) : 100;
  }, [pro]);

  return {
    pro,
    completeness,
    myPosts,
    myReels,
    myBookings,
    myServices,
    myInventory,
    myWorks,
    pendingEnquiries,
    confirmedBookings,
  };
};
