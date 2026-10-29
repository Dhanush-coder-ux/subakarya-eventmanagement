import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { Conversation, ChatMessage, Quotation, BookingRequestData, Role } from '../../../types';

export const messagingService = {
  getConversations(): Conversation[] {
    return useMarketplaceStore.getState().conversations;
  },

  getMessages(conversationId: string): ChatMessage[] {
    return useMarketplaceStore.getState().messages[conversationId] || [];
  },

  sendMessage(
    conversationId: string,
    content: string,
    sender: { id: string; name: string; avatar: string; role: Role }
  ): void {
    useMarketplaceStore.getState().sendChatMessage(conversationId, content, sender);
  },

  sendQuotation(
    conversationId: string,
    quotation: Quotation,
    sender: { id: string; name: string; avatar: string }
  ): void {
    useMarketplaceStore.getState().sendQuotation(conversationId, quotation, sender);
  },

  sendBookingRequest(
    conversationId: string,
    requestData: BookingRequestData,
    sender: { id: string; name: string; avatar: string; role: Role }
  ): void {
    useMarketplaceStore.getState().sendBookingRequest(conversationId, requestData, sender);
  },

  acceptQuotation(quotationId: string, conversationId: string, customerName: string): void {
    useMarketplaceStore.getState().acceptQuotation(quotationId, conversationId, customerName);
  },

  declineQuotation(quotationId: string, conversationId: string, customerName: string): void {
    useMarketplaceStore.getState().declineQuotation(quotationId, conversationId, customerName);
  },
};
