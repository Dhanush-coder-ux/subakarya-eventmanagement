import { Repost, RepostRequest, RepostSubmissionPayload } from '../types/reel.types';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

/**
 * Service managing customer repost permission requests and professional review workflows.
 * Fully synchronous & persisted through localStorage and shared marketplace store.
 */
export const repostService = {
  async createRepostRequest(
    payload: RepostSubmissionPayload
  ): Promise<RepostRequest> {
    const store = useMarketplaceStore.getState();
    const newRequest = store.createRepostRequest(payload);
    return newRequest;
  },

  async getRepostRequests(professionalId?: string): Promise<RepostRequest[]> {
    const requests = useMarketplaceStore.getState().repostRequests;
    if (professionalId) {
      return requests.filter((r) => r.professionalId === professionalId);
    }
    return requests;
  },

  async approveRepostRequest(requestId: string): Promise<Repost | null> {
    return useMarketplaceStore.getState().approveRepostRequest(requestId);
  },

  async rejectRepostRequest(requestId: string, reason?: string): Promise<boolean> {
    return useMarketplaceStore.getState().rejectRepostRequest(requestId, reason);
  },

  async getUserApprovedReposts(customerId: string): Promise<Repost[]> {
    return useMarketplaceStore
      .getState()
      .reposts.filter((r) => r.customerId === customerId && r.status === 'PUBLISHED');
  },
};
