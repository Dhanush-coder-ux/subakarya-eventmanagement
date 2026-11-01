import { useState, useCallback, useMemo } from 'react';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { RepostSubmissionPayload } from '../types/reel.types';
import { repostService } from '../services/repostService';

export const useReels = () => {
  const {
    reels,
    reelComments,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollowProfessional,
    addReelComment,
    deleteReelComment,
    toggleLikeReelComment,
    initiateBookingChat,
  } = useMarketplaceStore();

  const { currentUser } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeReel = reels[currentIndex] || reels[0];

  const comments = useMemo(() => {
    return activeReel ? reelComments.filter((c) => c.reelId === activeReel.id) : [];
  }, [activeReel, reelComments]);

  const commentsCount = useMemo(() => {
    if (!activeReel) return 0;
    return Math.max(comments.length, activeReel.commentsCount || 0);
  }, [activeReel, comments.length]);

  const goToNext = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  }, [reels.length]);

  const goToPrev = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  }, [reels.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleLike = useCallback(() => {
    if (activeReel) {
      toggleLikeReel(activeReel.id);
    }
  }, [activeReel, toggleLikeReel]);

  const toggleSave = useCallback(() => {
    if (activeReel) {
      toggleSaveReel(activeReel.id, currentUser.id);
    }
  }, [activeReel, currentUser.id, toggleSaveReel]);

  const toggleFollow = useCallback(() => {
    if (activeReel) {
      toggleFollowProfessional(activeReel.professionalId);
    }
  }, [activeReel, toggleFollowProfessional]);

  const handleAddComment = useCallback(
    (text: string, parentId?: string, replyToUserName?: string) => {
      if (!activeReel) return;
      addReelComment(
        activeReel.id,
        text,
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        parentId,
        replyToUserName
      );
    },
    [activeReel, currentUser, addReelComment]
  );

  const handleLikeComment = useCallback(
    (commentId: string) => {
      toggleLikeReelComment(commentId);
    },
    [toggleLikeReelComment]
  );

  const handleDeleteComment = useCallback(
    (commentId: string) => {
      deleteReelComment(commentId);
    },
    [deleteReelComment]
  );

  const submitRepostRequest = useCallback(
    async (payload: RepostSubmissionPayload) => {
      return repostService.createRepostRequest(payload);
    },
    []
  );

  return {
    reels,
    activeReel,
    currentIndex,
    comments,
    commentsCount,
    goToNext,
    goToPrev,
    goToIndex,
    toggleLike,
    toggleSave,
    toggleFollow,
    addComment: handleAddComment,
    likeComment: handleLikeComment,
    deleteComment: handleDeleteComment,
    submitRepostRequest,
    initiateBookingChat,
    currentUser,
  };
};
