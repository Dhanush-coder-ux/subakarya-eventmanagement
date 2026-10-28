import { create } from 'zustand';
import {
  Post,
  Reel,
  WorkSample,
  ServiceItem,
  InventoryItem,
  Booking,
  Conversation,
  ChatMessage,
  Quotation,
  BookingRequestData,
  BookingStatus,
  Role,
} from '../types';
import { mockPosts } from '../data/mockPosts';
import { mockReels } from '../data/mockReels';
import { mockWorks } from '../data/mockWorks';
import { mockServices } from '../data/mockServices';
import { mockInventory } from '../data/mockInventory';
import { mockBookings } from '../data/mockBookings';
import { mockConversations, mockMessages, mockQuotations } from '../data/mockMessages';
import { mockProfessionals } from '../data/mockUsers';

const MARKETPLACE_STORAGE_KEY = 'soiree_marketplace_data_v1';

interface MarketplaceState {
  posts: Post[];
  reels: Reel[];
  works: WorkSample[];
  services: ServiceItem[];
  inventory: InventoryItem[];
  bookings: Booking[];
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  quotations: Quotation[];
  activeConversationId: string | null;
  pendingBookingContext: {
    professionalId: string;
    preselectedServiceId?: string;
  } | null;

  // Actions
  setActiveConversation: (id: string | null) => void;
  setPendingBookingContext: (ctx: { professionalId: string; preselectedServiceId?: string } | null) => void;

  // Discovery interactions
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string, customerId?: string) => void;
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string, customerId?: string) => void;
  toggleFollowProfessional: (professionalId: string) => void;

  // Posts & Reels Management
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'savesCount'>) => void;
  deletePost: (postId: string) => void;
  createReel: (reel: Omit<Reel, 'id' | 'createdAt' | 'likesCount' | 'savesCount'>) => void;
  deleteReel: (reelId: string) => void;

  // Works / Portfolio Management
  createWork: (work: Omit<WorkSample, 'id' | 'createdAt'>) => void;
  updateWork: (work: WorkSample) => void;
  deleteWork: (workId: string) => void;

  // Services Management
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (service: ServiceItem) => void;
  deleteService: (serviceId: string) => void;
  toggleServiceActive: (serviceId: string) => void;

  // Inventory Management
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (itemId: string) => void;
  adjustInventoryStock: (itemId: string, availableDelta: number, damagedDelta?: number) => boolean;

  // Structured Booking & Chat Actions
  initiateBookingChat: (
    professionalId: string,
    customer: { id: string; name: string; avatar: string; phone?: string },
    preselectedServiceId?: string
  ) => string;

  sendBookingRequest: (
    conversationId: string,
    requestData: BookingRequestData,
    sender: { id: string; name: string; avatar: string; role: Role }
  ) => void;

  sendQuotation: (
    conversationId: string,
    quotation: Quotation,
    sender: { id: string; name: string; avatar: string }
  ) => void;

  acceptQuotation: (
    quotationId: string,
    conversationId: string,
    customerName: string
  ) => void;

  declineQuotation: (
    quotationId: string,
    conversationId: string,
    customerName: string
  ) => void;

  sendChatMessage: (
    conversationId: string,
    content: string,
    sender: { id: string; name: string; avatar: string; role: Role }
  ) => void;

  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;

  resetMarketplaceData: () => void;
}

const getInitialData = () => {
  try {
    const saved = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        posts: parsed.posts || mockPosts,
        reels: parsed.reels || mockReels,
        works: parsed.works || mockWorks,
        services: parsed.services || mockServices,
        inventory: parsed.inventory || mockInventory,
        bookings: parsed.bookings || mockBookings,
        conversations: parsed.conversations || mockConversations,
        messages: parsed.messages || { 'conv-1': mockMessages },
        quotations: parsed.quotations || mockQuotations,
      };
    }
  } catch {
    // fallback
  }

  return {
    posts: mockPosts,
    reels: mockReels,
    works: mockWorks,
    services: mockServices,
    inventory: mockInventory,
    bookings: mockBookings,
    conversations: mockConversations,
    messages: { 'conv-1': mockMessages },
    quotations: mockQuotations,
  };
};

const initialData = getInitialData();

export const useMarketplaceStore = create<MarketplaceState>((set, get) => ({
  posts: initialData.posts,
  reels: initialData.reels,
  works: initialData.works,
  services: initialData.services,
  inventory: initialData.inventory,
  bookings: initialData.bookings,
  conversations: initialData.conversations,
  messages: initialData.messages,
  quotations: initialData.quotations,
  activeConversationId: initialData.conversations[0]?.id || null,
  pendingBookingContext: null,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setPendingBookingContext: (ctx) => set({ pendingBookingContext: ctx }),

  toggleLikePost: (postId) => {
    set((state) => {
      const posts = state.posts.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      });
      const newState = { ...state, posts };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { posts };
    });
  },

  toggleSavePost: (postId) => {
    set((state) => {
      const posts = state.posts.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.isSaved;
          return {
            ...p,
            isSaved,
            savesCount: isSaved ? p.savesCount + 1 : Math.max(0, p.savesCount - 1),
          };
        }
        return p;
      });
      const newState = { ...state, posts };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { posts };
    });
  },

  toggleLikeReel: (reelId) => {
    set((state) => {
      const reels = state.reels.map((r) => {
        if (r.id === reelId) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : Math.max(0, r.likesCount - 1),
          };
        }
        return r;
      });
      const newState = { ...state, reels };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { reels };
    });
  },

  toggleSaveReel: (reelId) => {
    set((state) => {
      const reels = state.reels.map((r) => {
        if (r.id === reelId) {
          const isSaved = !r.isSaved;
          return {
            ...r,
            isSaved,
            savesCount: isSaved ? r.savesCount + 1 : Math.max(0, r.savesCount - 1),
          };
        }
        return r;
      });
      const newState = { ...state, reels };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { reels };
    });
  },

  toggleFollowProfessional: (_professionalId) => {
    // In a multi-user context, we update followers
  },

  createPost: (postData) => {
    set((state) => {
      const newPost: Post = {
        ...postData,
        id: `post-${Date.now()}`,
        likesCount: 0,
        savesCount: 0,
        createdAt: new Date().toISOString(),
      };
      const posts = [newPost, ...state.posts];
      const newState = { ...state, posts };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { posts };
    });
  },

  deletePost: (postId) => {
    set((state) => {
      const posts = state.posts.filter((p) => p.id !== postId);
      const newState = { ...state, posts };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { posts };
    });
  },

  createReel: (reelData) => {
    set((state) => {
      const newReel: Reel = {
        ...reelData,
        id: `reel-${Date.now()}`,
        likesCount: 0,
        savesCount: 0,
        createdAt: new Date().toISOString(),
      };
      const reels = [newReel, ...state.reels];
      const newState = { ...state, reels };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { reels };
    });
  },

  deleteReel: (reelId) => {
    set((state) => {
      const reels = state.reels.filter((r) => r.id !== reelId);
      const newState = { ...state, reels };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { reels };
    });
  },

  createWork: (workData) => {
    set((state) => {
      const newWork: WorkSample = {
        ...workData,
        id: `wrk-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const works = [newWork, ...state.works];
      const newState = { ...state, works };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { works };
    });
  },

  updateWork: (updatedWork) => {
    set((state) => {
      const works = state.works.map((w) => (w.id === updatedWork.id ? updatedWork : w));
      const newState = { ...state, works };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { works };
    });
  },

  deleteWork: (workId) => {
    set((state) => {
      const works = state.works.filter((w) => w.id !== workId);
      const newState = { ...state, works };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { works };
    });
  },

  addService: (serviceData) => {
    set((state) => {
      const newService: ServiceItem = {
        ...serviceData,
        id: `srv-${Date.now()}`,
      };
      const services = [...state.services, newService];
      const newState = { ...state, services };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { services };
    });
  },

  updateService: (updatedService) => {
    set((state) => {
      const services = state.services.map((s) => (s.id === updatedService.id ? updatedService : s));
      const newState = { ...state, services };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { services };
    });
  },

  deleteService: (serviceId) => {
    set((state) => {
      const services = state.services.filter((s) => s.id !== serviceId);
      const newState = { ...state, services };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { services };
    });
  },

  toggleServiceActive: (serviceId) => {
    set((state) => {
      const services = state.services.map((s) => (s.id === serviceId ? { ...s, isActive: !s.isActive } : s));
      const newState = { ...state, services };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { services };
    });
  },

  addInventoryItem: (itemData) => {
    set((state) => {
      const newItem: InventoryItem = {
        ...itemData,
        id: `inv-${Date.now()}`,
      };
      const inventory = [...state.inventory, newItem];
      const newState = { ...state, inventory };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { inventory };
    });
  },

  updateInventoryItem: (updatedItem) => {
    set((state) => {
      const inventory = state.inventory.map((i) => (i.id === updatedItem.id ? updatedItem : i));
      const newState = { ...state, inventory };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { inventory };
    });
  },

  deleteInventoryItem: (itemId) => {
    set((state) => {
      const inventory = state.inventory.filter((i) => i.id !== itemId);
      const newState = { ...state, inventory };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { inventory };
    });
  },

  adjustInventoryStock: (itemId, availableDelta, damagedDelta = 0) => {
    const { inventory } = get();
    const item = inventory.find((i) => i.id === itemId);
    if (!item) return false;

    const newAvailable = item.availableQuantity + availableDelta;
    if (newAvailable < 0) return false; // Prevent negative stock

    const newDamaged = Math.max(0, item.damagedQuantity + damagedDelta);
    const newAllocated = item.totalQuantity - newAvailable - newDamaged;

    const updatedItem: InventoryItem = {
      ...item,
      availableQuantity: newAvailable,
      allocatedQuantity: Math.max(0, newAllocated),
      damagedQuantity: newDamaged,
    };

    set((state) => {
      const updatedList = state.inventory.map((i) => (i.id === itemId ? updatedItem : i));
      const newState = { ...state, inventory: updatedList };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { inventory: updatedList };
    });

    return true;
  },

  /**
   * Opens or creates a structured booking conversation between customer & professional
   */
  initiateBookingChat: (professionalId, customer, preselectedServiceId) => {
    const { conversations, messages, bookings } = get();
    const pro = mockProfessionals.find((p) => p.id === professionalId) || mockProfessionals[0];

    // Check if an existing conversation exists between customer and professional
    const existing = conversations.find(
      (c) => c.customerId === customer.id && c.professionalId === professionalId
    );

    if (existing) {
      set({
        activeConversationId: existing.id,
        pendingBookingContext: { professionalId, preselectedServiceId },
      });
      return existing.id;
    }

    // Otherwise create a fresh conversation
    const newConvId = `conv-${Date.now()}`;
    const newBookingId = `book-${Date.now()}`;

    const newBooking: Booking = {
      id: newBookingId,
      customerId: customer.id,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      customerPhone: customer.phone || '+91 98450 00000',
      professionalId: pro.id,
      professionalName: pro.businessName,
      professionalAvatar: pro.avatar,
      professionalCategory: pro.category,
      eventType: 'Event Enquiry',
      eventDate: new Date(Date.now() + 86400000 * 20).toISOString().split('T')[0],
      location: pro.location,
      status: 'pending',
      selectedServiceIds: preselectedServiceId ? [preselectedServiceId] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newConversation: Conversation = {
      id: newConvId,
      customerId: customer.id,
      customerName: customer.name,
      customerAvatar: customer.avatar,
      professionalId: pro.id,
      professionalName: pro.businessName,
      professionalAvatar: pro.avatar,
      professionalCategory: pro.category,
      lastMessage: 'Booking enquiry initiated',
      lastMessageAt: new Date().toISOString(),
      bookingId: newBookingId,
      unreadCustomerCount: 0,
      unreadProfessionalCount: 1,
    };

    const initialSystemMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: newConvId,
      senderId: 'system',
      senderName: 'System',
      senderAvatar: '',
      senderRole: 'customer',
      type: 'system',
      content: `Booking chat initiated with ${pro.businessName}. Please complete the booking request form below.`,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedConversations = [newConversation, ...state.conversations];
      const updatedBookings = [newBooking, ...state.bookings];
      const updatedMessages = {
        ...state.messages,
        [newConvId]: [initialSystemMessage],
      };

      const newState = {
        ...state,
        conversations: updatedConversations,
        bookings: updatedBookings,
        messages: updatedMessages,
        activeConversationId: newConvId,
        pendingBookingContext: { professionalId, preselectedServiceId },
      };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });

    return newConvId;
  },

  sendBookingRequest: (conversationId, requestData, sender) => {
    const newMsgId = `msg-${Date.now()}`;
    const newReqMessage: ChatMessage = {
      id: newMsgId,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: sender.role,
      type: 'booking_request',
      content: `Submitted booking request for ${requestData.eventType} on ${requestData.eventDate}`,
      bookingRequest: requestData,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const currentMsgs = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...currentMsgs, newReqMessage],
      };

      // Update the associated booking
      const conv = state.conversations.find((c) => c.id === conversationId);
      const updatedBookings = state.bookings.map((b) => {
        if (conv && b.id === conv.bookingId) {
          return {
            ...b,
            eventType: requestData.eventType,
            eventDate: requestData.eventDate,
            location: requestData.eventLocation,
            guestCount: requestData.guestCount,
            selectedServiceIds: requestData.selectedServiceIds,
            status: 'pending' as BookingStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });

      const updatedConversations = state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: `Booking Request: ${requestData.eventType}`,
            lastMessageAt: new Date().toISOString(),
          };
        }
        return c;
      });

      const newState = {
        ...state,
        messages: updatedMessages,
        bookings: updatedBookings,
        conversations: updatedConversations,
        pendingBookingContext: null, // Clear pending form after submission
      };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  sendQuotation: (conversationId, quotation, sender) => {
    const newMsgId = `msg-${Date.now()}`;
    const newQuoteMessage: ChatMessage = {
      id: newMsgId,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: 'professional',
      type: 'quotation',
      content: `Official quotation for ${quotation.totalAmount ? `₹${quotation.totalAmount.toLocaleString('en-IN')}` : 'your event'}.`,
      quotation,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const currentMsgs = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...currentMsgs, newQuoteMessage],
      };

      const updatedQuotations = [...state.quotations.filter((q) => q.id !== quotation.id), quotation];

      const conv = state.conversations.find((c) => c.id === conversationId);
      const updatedBookings = state.bookings.map((b) => {
        if (conv && b.id === conv.bookingId) {
          return {
            ...b,
            status: 'quote_received' as BookingStatus,
            totalAmount: quotation.totalAmount,
            quotationId: quotation.id,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });

      const updatedConversations = state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: `Quotation sent: ₹${quotation.totalAmount.toLocaleString('en-IN')}`,
            lastMessageAt: new Date().toISOString(),
          };
        }
        return c;
      });

      const newState = {
        ...state,
        messages: updatedMessages,
        quotations: updatedQuotations,
        bookings: updatedBookings,
        conversations: updatedConversations,
      };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  acceptQuotation: (quotationId, conversationId, customerName) => {
    set((state) => {
      const updatedQuotes = state.quotations.map((q) =>
        q.id === quotationId ? { ...q, status: 'accepted' as const } : q
      );

      const conv = state.conversations.find((c) => c.id === conversationId);
      const updatedBookings = state.bookings.map((b) => {
        if (conv && (b.id === conv.bookingId || b.quotationId === quotationId)) {
          return {
            ...b,
            status: 'confirmed' as BookingStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      });

      const statusMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '',
        senderRole: 'customer',
        type: 'status_update',
        content: `Quotation accepted by ${customerName}. Booking status updated to Confirmed!`,
        statusUpdate: {
          previousStatus: 'quote_received',
          newStatus: 'confirmed',
          note: 'Deposit and dates locked in event schedule.',
        },
        createdAt: new Date().toISOString(),
      };

      const currentMsgs = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...currentMsgs, statusMsg],
      };

      const updatedConversations = state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: 'Quotation Accepted • Booking Confirmed',
            lastMessageAt: new Date().toISOString(),
          };
        }
        return c;
      });

      const newState = {
        ...state,
        quotations: updatedQuotes,
        bookings: updatedBookings,
        messages: updatedMessages,
        conversations: updatedConversations,
      };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  declineQuotation: (quotationId, conversationId, customerName) => {
    set((state) => {
      const updatedQuotes = state.quotations.map((q) =>
        q.id === quotationId ? { ...q, status: 'declined' as const } : q
      );

      const statusMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: 'system',
        senderName: 'System',
        senderAvatar: '',
        senderRole: 'customer',
        type: 'status_update',
        content: `Quotation declined by ${customerName}. You may revise the proposal or discuss adjustments.`,
        statusUpdate: {
          previousStatus: 'quote_received',
          newStatus: 'cancelled',
          note: 'Customer requested revisions or declined proposal.',
        },
        createdAt: new Date().toISOString(),
      };

      const currentMsgs = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...currentMsgs, statusMsg],
      };

      const newState = {
        ...state,
        quotations: updatedQuotes,
        messages: updatedMessages,
      };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  sendChatMessage: (conversationId, content, sender) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: sender.role,
      type: 'text',
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const currentMsgs = state.messages[conversationId] || [];
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...currentMsgs, newMsg],
      };

      const updatedConversations = state.conversations.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: content,
            lastMessageAt: new Date().toISOString(),
          };
        }
        return c;
      });

      const newState = {
        ...state,
        messages: updatedMessages,
        conversations: updatedConversations,
      };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  updateBookingStatus: (bookingId, status) => {
    set((state) => {
      const updatedBookings = state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b
      );
      const newState = { ...state, bookings: updatedBookings };
      localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(newState));
      return { bookings: updatedBookings };
    });
  },

  resetMarketplaceData: () => {
    localStorage.removeItem(MARKETPLACE_STORAGE_KEY);
    const resetState = {
      posts: mockPosts,
      reels: mockReels,
      works: mockWorks,
      services: mockServices,
      inventory: mockInventory,
      bookings: mockBookings,
      conversations: mockConversations,
      messages: { 'conv-1': mockMessages },
      quotations: mockQuotations,
      activeConversationId: mockConversations[0].id,
      pendingBookingContext: null,
    };
    set(resetState);
    localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(resetState));
  },
}));
