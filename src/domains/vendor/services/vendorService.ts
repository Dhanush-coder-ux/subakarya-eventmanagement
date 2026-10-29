import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  ServiceItem,
  InventoryItem,
  WorkSample,
  Post,
  Reel,
  Booking,
  ProfessionalProfile,
} from '../../../types';

export const vendorService = {
  getCurrentVendor(): ProfessionalProfile | null {
    const user = useAuthStore.getState().currentUser;
    return user.role === 'professional' ? (user as ProfessionalProfile) : null;
  },

  getVendorServices(vendorId?: string): ServiceItem[] {
    const proId = vendorId || useAuthStore.getState().currentUser.id;
    return useMarketplaceStore.getState().services.filter((s) => s.professionalId === proId);
  },

  getVendorInventory(vendorId?: string): InventoryItem[] {
    const proId = vendorId || useAuthStore.getState().currentUser.id;
    return useMarketplaceStore.getState().inventory.filter((i) => i.professionalId === proId);
  },

  getVendorPosts(vendorId?: string): Post[] {
    const proId = vendorId || useAuthStore.getState().currentUser.id;
    return useMarketplaceStore.getState().posts.filter((p) => p.professionalId === proId);
  },

  getVendorReels(vendorId?: string): Reel[] {
    const proId = vendorId || useAuthStore.getState().currentUser.id;
    return useMarketplaceStore.getState().reels.filter((r) => r.professionalId === proId);
  },

  getVendorWorks(vendorId?: string): WorkSample[] {
    const proId = vendorId || useAuthStore.getState().currentUser.id;
    return useMarketplaceStore.getState().works.filter((w) => w.professionalId === proId);
  },

  getVendorBookings(vendorId?: string): Booking[] {
    const proId = vendorId || useAuthStore.getState().currentUser.id;
    return useMarketplaceStore.getState().bookings.filter((b) => b.professionalId === proId);
  },

  // Service mutations
  addService(service: Omit<ServiceItem, 'id'>): void {
    useMarketplaceStore.getState().addService(service);
  },

  updateService(service: ServiceItem): void {
    useMarketplaceStore.getState().updateService(service);
  },

  deleteService(serviceId: string): void {
    useMarketplaceStore.getState().deleteService(serviceId);
  },

  toggleServiceActive(serviceId: string): void {
    useMarketplaceStore.getState().toggleServiceActive(serviceId);
  },

  // Inventory mutations
  addInventoryItem(item: Omit<InventoryItem, 'id'>): void {
    useMarketplaceStore.getState().addInventoryItem(item);
  },

  updateInventoryItem(item: InventoryItem): void {
    useMarketplaceStore.getState().updateInventoryItem(item);
  },

  deleteInventoryItem(itemId: string): void {
    useMarketplaceStore.getState().deleteInventoryItem(itemId);
  },

  adjustStock(itemId: string, newTotalQuantity: number): void {
    useMarketplaceStore.getState().adjustInventoryStock(itemId, newTotalQuantity);
  },
};

