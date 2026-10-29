import { useState, useMemo } from 'react';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { consumerService } from '../services/consumerService';

export const useConsumerFeed = () => {
  const { posts } = useMarketplaceStore();
  const { allProfessionals, currentUser } = useAuthStore();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredPosts = useMemo(() => {
    return consumerService.getFeedPosts(selectedTag);
  }, [posts, selectedTag]);

  const storyVendors = useMemo(() => {
    return consumerService.getStoryVendors();
  }, [allProfessionals]);

  const suggestedVendors = useMemo(() => {
    return consumerService.getSuggestedVendors(5);
  }, [allProfessionals]);

  return {
    posts: filteredPosts,
    storyVendors,
    suggestedVendors,
    selectedTag,
    setSelectedTag,
    currentUser,
    toggleLikePost: consumerService.toggleLikePost,
    toggleSavePost: consumerService.toggleSavePost,
  };
};

