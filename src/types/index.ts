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
  | 'cancelled'
  | 'rejected'
  | 'expired';

export type AvailabilityModelType = 'appointment' | 'event_day' | 'venue' | 'rental';

export type AvailabilitySlotStatus = 'available' | 'limited' | 'booked' | 'unavailable' | 'pending';

export interface AvailabilityRule {
  id: string;
  professionalId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  dayName: string;
  isOpen: boolean;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  slotDurationMinutes: number;
  bufferMinutes: number;
  applicableServiceIds?: string[];
}

export interface AvailabilitySlot {
  id: string;
  professionalId: string;
  serviceId?: string;
  serviceCategory?: ServiceCategory;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  capacity: number;
  confirmedCount: number;
  pendingHoldCount: number;
  priceOverride?: number;
  bufferMinutes?: number;
  durationMinutes?: number;
  status: AvailabilitySlotStatus;
  notes?: string;
  slotType: AvailabilityModelType;
}

export interface AvailabilityBlock {
  id: string;
  professionalId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  reason: string;
  category: 'Personal Leave' | 'Holiday' | 'Maintenance' | 'External Event' | 'Other';
}

export interface BookingRequestData {
  customerId: string;
  customerName: string;
  customerPhone: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  slotId?: string;
  startTime?: string;
  endTime?: string;
  guestCount?: number;
  selectedServiceIds: string[];
  selectedInventoryItems?: {
    itemId: string;
    quantity: number;
  }[];
  preferredTime?: string;
  budgetRange?: string;
  additionalRequirements?: string;
  isCustomAvailabilityRequest?: boolean;
  estimatedAmount?: number;
}

export interface PendingBookingContext {
  customerId: string;
  customerName: string;
  customerPhone?: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar?: string;
  preselectedServiceId?: string;
  selectedServiceName?: string;
  preselectedDate?: string;
  preselectedSlotId?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  packagePrice?: number;
  bookingType?: string;
  guestCount?: number;
  eventType?: string;
  location?: string;
  notes?: string;
  isCustomAvailabilityRequest?: boolean;
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
  slotId?: string;
  startTime?: string;
  endTime?: string;
  availabilityModel?: AvailabilityModelType;
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
