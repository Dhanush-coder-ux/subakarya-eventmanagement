export type Role = 'customer' | 'professional';

export type ServiceCategory =
  | 'Event Planner'
  | 'Photographer & Videographer'
  | 'Caterer'
  | 'Wedding & Party Hall'
  | 'Makeup Artist & Hairstylist'
  | 'Decorator & Florist'
  | 'DJ, Sound & Lighting'
  | 'Equipment Rental';

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  location: string;
  createdAt: string;
}

export interface CustomerProfile extends BaseUser {
  role: 'customer';
  savedPostIds: string[];
  savedReelIds: string[];
  followingIds: string[];
}

export interface VerificationInfo {
  panNumber?: string;
  documentType: 'PAN Card' | 'GST Certificate' | 'Business License' | 'Trade Certificate' | 'Not Submitted';
  verificationStatus: 'verified' | 'pending' | 'unverified';
  businessRegNumber?: string;
}

export interface ProfessionalProfile extends BaseUser {
  role: 'professional';
  businessName: string;
  businessType: string;
  category: ServiceCategory;
  description: string;
  coverageArea: string;
  experienceYears: number;
  isVerified: boolean;
  minBookingAmount?: number;
  verificationInfo: VerificationInfo;
  followersCount: number;
  followingIds: string[];
  // Dynamic profile completion flags
  profileCompleteness: number; // dynamically computed
  hasPersonalDone: boolean;
  hasBusinessDone: boolean;
  hasServicesDone: boolean;
  hasVerificationDone: boolean;
  hasPortfolioDone: boolean;
  hasAvailabilityDone: boolean;
}

export type PricingModel =
  | 'fixed'
  | 'per_person'
  | 'per_hour'
  | 'per_day'
  | 'per_item'
  | 'custom';

export interface ServiceItem {
  id: string;
  professionalId: string;
  name: string;
  category: ServiceCategory;
  description: string;
  pricingModel: PricingModel;
  basePrice: number;
  unitLabel?: string; // e.g. "per person", "per day", "per hour"
  inclusions: string[];
  isActive: boolean;
  minGuests?: number;
  maxGuests?: number;
}

export type InventoryType = 'asset' | 'consumable';

export interface InventoryItem {
  id: string;
  professionalId: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image: string;
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  damagedQuantity: number;
  rentalRate: number;
  unit: string; // e.g. "units", "sets", "kg", "meters"
  inventoryType: InventoryType;
  lowStockThreshold: number;
  allocationDates?: {
    startDate: string;
    endDate: string;
    eventId: string;
    quantity: number;
  }[];
}

export interface Post {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  category: ServiceCategory;
  location: string;
  mediaUrl: string;
  caption: string;
  hashtags: string[];
  likesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface Reel {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  category: ServiceCategory;
  location: string;
  videoUrl: string;
  thumbnailUrl: string;
  audioTrack: string;
  caption: string;
  hashtags: string[];
  likesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string;
}

export interface WorkSample {
  id: string;
  professionalId: string;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  description: string;
  galleryUrls: string[];
  servicesDelivered: string[];
  createdAt: string;
}

export type BookingStatus =
  | 'pending'
  | 'quote_received'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export interface BookingRequestData {
  customerId: string;
  customerName: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  guestCount?: number;
  selectedServiceIds: string[];
  selectedInventoryItems?: {
    itemId: string;
    quantity: number;
  }[];
  preferredTime?: string;
  budgetRange?: string;
  additionalRequirements?: string;
}

export interface QuoteItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  pricingModel: PricingModel;
  totalPrice: number;
}

export interface Quotation {
  id: string;
  bookingId: string;
  professionalId: string;
  professionalName: string;
  customerId: string;
  customerName: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  validUntil: string;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  customerPhone: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  professionalCategory: ServiceCategory;
  eventType: string;
  eventDate: string;
  location: string;
  guestCount?: number;
  status: BookingStatus;
  selectedServiceIds: string[];
  totalAmount?: number;
  quotationId?: string;
  createdAt: string;
  updatedAt: string;
}

export type MessageType =
  | 'text'
  | 'booking_request'
  | 'quotation'
  | 'status_update'
  | 'system';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: Role;
  type: MessageType;
  content: string;
  bookingRequest?: BookingRequestData;
  quotation?: Quotation;
  statusUpdate?: {
    previousStatus: BookingStatus;
    newStatus: BookingStatus;
    note: string;
  };
  createdAt: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  professionalCategory: ServiceCategory;
  lastMessage: string;
  lastMessageAt: string;
  bookingId?: string;
  unreadCustomerCount: number;
  unreadProfessionalCount: number;
}
