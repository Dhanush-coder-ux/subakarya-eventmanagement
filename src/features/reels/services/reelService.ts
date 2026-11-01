import { Reel } from '../types/reel.types';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

/**
 * Service handling reel queries and engagement actions.
 * Wraps local storage / state management with simulated asynchronous promises
 * to keep business logic modular and prepared for future backend API connections.
 */
export const reelService = {
  async getReels(): Promise<Reel[]> {
    // Simulate brief asynchronous tick
    await new Promise((resolve) => setTimeout(resolve, 30));
    return useMarketplaceStore.getState().reels;
  },

  async getReelById(reelId: string): Promise<Reel | null> {
    const reels = useMarketplaceStore.getState().reels;
    return reels.find((r) => r.id === reelId) || null;
  },

  async toggleLike(reelId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    useMarketplaceStore.getState().toggleLikeReel(reelId);
    const updated = useMarketplaceStore.getState().reels.find((r) => r.id === reelId);
    return {
      isLiked: updated?.isLiked ?? false,
      likesCount: updated?.likesCount ?? 0,
    };
  },

  async toggleSave(reelId: string, customerId?: string): Promise<{ isSaved: boolean; savesCount: number }> {
    useMarketplaceStore.getState().toggleSaveReel(reelId, customerId);
    const updated = useMarketplaceStore.getState().reels.find((r) => r.id === reelId);
    return {
      isSaved: updated?.isSaved ?? false,
      savesCount: updated?.savesCount ?? 0,
    };
  },

  async toggleFollow(professionalId: string): Promise<{ isFollowing: boolean }> {
    useMarketplaceStore.getState().toggleFollowProfessional(professionalId);
    const updated = useMarketplaceStore.getState().reels.find((r) => r.professionalId === professionalId);
    return {
      isFollowing: updated?.isFollowing ?? false,
    };
  },
};

