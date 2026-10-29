import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Post, Reel, ProfessionalProfile } from '../../../types';

export const consumerService = {
  getFeedPosts(categoryFilter: string = 'All'): Post[] {
    const posts = useMarketplaceStore.getState().posts;
    if (categoryFilter === 'All') return posts;

    const categoryMap: Record<string, string> = {
      Photographers: 'Photographer & Videographer',
      'Wedding Halls': 'Wedding & Party Hall',
      Caterers: 'Caterer',
      'Bridal Makeup': 'Makeup Artist & Hairstylist',
      Decor: 'Decorator & Florist',
    };

    const targetCategory = categoryMap[categoryFilter];
    if (!targetCategory) return posts;
    return posts.filter((post) => post.category === targetCategory);
  },

  getStoryVendors(): ProfessionalProfile[] {
    return useAuthStore.getState().allProfessionals;
  },

  getSuggestedVendors(limit: number = 5): ProfessionalProfile[] {
    return useAuthStore.getState().allProfessionals.slice(0, limit);
  },

  toggleLikePost(postId: string): void {
    useMarketplaceStore.getState().toggleLikePost(postId);
  },

  toggleSavePost(postId: string, customerId?: string): void {
    useMarketplaceStore.getState().toggleSavePost(postId, customerId);
  },

  toggleLikeReel(reelId: string): void {
    useMarketplaceStore.getState().toggleLikeReel(reelId);
  },

  toggleSaveReel(reelId: string, customerId?: string): void {
    useMarketplaceStore.getState().toggleSaveReel(reelId, customerId);
  },

  toggleFollow(professionalId: string): void {
    useMarketplaceStore.getState().toggleFollowProfessional(professionalId);
  },
};

