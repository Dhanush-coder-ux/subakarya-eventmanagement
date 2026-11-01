import { ReelComment } from '../types/reel.types';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

/**
 * Service managing comments, replies, and comment interactions.
 * Persists demo interactions across page refreshes via the centralized state & localStorage.
 */
export const commentService = {
  async getComments(reelId: string): Promise<ReelComment[]> {
    await new Promise((resolve) => setTimeout(resolve, 30));
    return useMarketplaceStore.getState().reelComments.filter((c) => c.reelId === reelId);
  },

  async addComment(
    reelId: string,
    text: string,
    user: { id: string; name: string; avatar: string },
    parentId?: string,
    replyToUserName?: string
  ): Promise<ReelComment> {
    useMarketplaceStore.getState().addReelComment(reelId, text, user, parentId, replyToUserName);
    const comments = useMarketplaceStore.getState().reelComments;
    return comments[0];
  },

  async toggleLikeComment(commentId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    useMarketplaceStore.getState().toggleLikeReelComment(commentId);
    const comment = useMarketplaceStore.getState().reelComments.find((c) => c.id === commentId);
    return {
      isLiked: comment?.isLiked ?? false,
      likesCount: comment?.likesCount ?? 0,
    };
  },

  async deleteComment(commentId: string): Promise<boolean> {
    useMarketplaceStore.getState().deleteReelComment(commentId);
    return true;
  },
};

