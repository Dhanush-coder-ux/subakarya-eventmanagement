import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Post, Reel, ServiceItem, ProfessionalProfile } from '../../../types';

export const discoveryService = {
  searchVendors(cleanTerm: string, category: string = 'All', location: string = 'All', maxPrice: number = 300000): ProfessionalProfile[] {
    const { allProfessionals } = useAuthStore.getState();
    return allProfessionals.filter((pro) => {
      if (category !== 'All' && pro.category !== category) return false;
      if (location !== 'All' && !pro.location.includes(location)) return false;
      if (pro.minBookingAmount && pro.minBookingAmount > maxPrice) return false;
      if (!cleanTerm) return true;

      return (
        pro.name.toLowerCase().includes(cleanTerm) ||
        pro.businessName.toLowerCase().includes(cleanTerm) ||
        pro.category.toLowerCase().includes(cleanTerm) ||
        pro.location.toLowerCase().includes(cleanTerm) ||
        pro.description.toLowerCase().includes(cleanTerm)
      );
    });
  },

  searchPosts(cleanTerm: string, category: string = 'All', location: string = 'All'): Post[] {
    const { posts } = useMarketplaceStore.getState();
    return posts.filter((post) => {
      if (category !== 'All' && post.category !== category) return false;
      if (location !== 'All' && !post.location.includes(location)) return false;
      if (!cleanTerm) return true;

      const matchesHashtag = post.hashtags.some((h) =>
        h.toLowerCase().replace('#', '').includes(cleanTerm)
      );
      const matchesCaption = post.caption.toLowerCase().includes(cleanTerm);
      const matchesPro = post.professionalName.toLowerCase().includes(cleanTerm);
      const matchesLocation = post.location.toLowerCase().includes(cleanTerm);

      return matchesHashtag || matchesCaption || matchesPro || matchesLocation;
    });
  },

  searchReels(cleanTerm: string): Reel[] {
    const { reels } = useMarketplaceStore.getState();
    return reels.filter((reel) => {
      if (!cleanTerm) return true;
      const matchesHashtag = reel.hashtags.some((h) =>
        h.toLowerCase().replace('#', '').includes(cleanTerm)
      );
      const matchesCaption = reel.caption.toLowerCase().includes(cleanTerm);
      const matchesPro = reel.professionalName.toLowerCase().includes(cleanTerm);
      return matchesHashtag || matchesCaption || matchesPro;
    });
  },

  searchServices(cleanTerm: string, category: string = 'All', maxPrice: number = 300000): ServiceItem[] {
    const { services } = useMarketplaceStore.getState();
    return services.filter((srv) => {
      if (category !== 'All' && srv.category !== category) return false;
      if (srv.basePrice > maxPrice) return false;
      if (!cleanTerm) return true;

      return (
        srv.name.toLowerCase().includes(cleanTerm) ||
        srv.category.toLowerCase().includes(cleanTerm) ||
        srv.description.toLowerCase().includes(cleanTerm)
      );
    });
  },
};
