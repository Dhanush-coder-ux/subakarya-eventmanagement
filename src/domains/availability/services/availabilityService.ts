import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { AvailabilitySlot, AvailabilityBlock, AvailabilityRule } from '../../../types';

export const availabilityService = {
  getSlots(proId: string): AvailabilitySlot[] {
    return useMarketplaceStore.getState().availabilitySlots.filter((s) => s.professionalId === proId);
  },

  getBlocks(proId: string): AvailabilityBlock[] {
    return useMarketplaceStore.getState().availabilityBlocks.filter((b) => b.professionalId === proId);
  },

  getWorkingHours(): AvailabilityRule[] {
    return useMarketplaceStore.getState().workingHours;
  },

  addSlot(slot: Omit<AvailabilitySlot, 'id' | 'createdAt'>): void {
    useMarketplaceStore.getState().addAvailabilitySlot(slot);
  },

  deleteSlot(slotId: string): void {
    useMarketplaceStore.getState().deleteAvailabilitySlot(slotId);
  },

  addBlock(block: Omit<AvailabilityBlock, 'id' | 'createdAt'>): void {
    useMarketplaceStore.getState().addAvailabilityBlock(block);
  },

  deleteBlock(blockId: string): void {
    useMarketplaceStore.getState().deleteAvailabilityBlock(blockId);
  },

  updateWorkingHours(professionalId: string, rules: AvailabilityRule[]): void {
    useMarketplaceStore.getState().updateWorkingHours(professionalId, rules);
  },
};
