export type Role = 'customer' | 'professional';

export type AccountExperience = 'PERSONAL' | 'PROFESSIONAL';

export type KYCStatus = 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ProfessionalCategory =
  | 'Event Organizer'
  | 'Photographer'
  | 'Videographer'
  | 'Makeup Artist'
  | 'Caterer'
  | 'Wedding Decorator'
  | 'Event Hall'
  | 'DJ and Entertainment'
  | 'Event Equipment Supplier'
  | 'Furniture and Rental Supplier'
  | 'Other';

export type ServiceCategory =
  | 'Event Planner'
  | 'Photographer & Videographer'
  | 'Caterer'
  | 'Wedding & Party Hall'
  | 'Makeup Artist & Hairstylist'
  | 'Decorator & Florist'
  | 'DJ, Sound & Lighting'
  | 'Equipment Rental'
  | ProfessionalCategory
  | (string & {});

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

export interface PersonalProfile {
  id?: string;
  fullName: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
  followersCount?: number;
  followingCount?: number;
  followingIds?: string[];
  savedPostIds?: string[];
  savedReelIds?: string[];
  approvedRepostIds?: string[];
}

export interface CustomerProfile extends BaseUser {
  role: 'customer';
  username?: string;
  bio?: string;
  website?: string;
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

export interface BankAccountDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  upiId?: string;
}

export interface ProfessionalProfile extends BaseUser {
  role: 'professional';
  professionalId?: string;
  businessName: string;
  username?: string;
  businessType: string;
  category: ServiceCategory | string;
  description: string;
  location: string;
  contact?: string;
  businessEmail?: string;
  portfolioImages?: string[];
  coverageArea: string;
  experienceYears: number;
  isVerified: boolean;
  minBookingAmount?: number;
  verificationInfo: VerificationInfo;
  kycStatus?: KYCStatus;
  panNumber?: string;
  panHolderName?: string;
  legalBusinessName?: string;
  gstin?: string;
  identityDocumentUrl?: string;
  verificationStatus?: 'VERIFIED' | 'UNVERIFIED' | 'PENDING' | 'REJECTED';
  businessMode?: 'BOOKING_BASED' | 'ORDER_BASED';
  profileCompletion?: number;
  isActive?: boolean;
  bankDetails?: BankAccountDetails;
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

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  personalProfile: PersonalProfile;
  professionalProfile?: ProfessionalProfile;
  activeExperience: AccountExperience;
  createdAt: string;
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
export type ProductClassification = 'sale' | 'rental' | 'both';
export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Color", "Model"
  options: string[]; // e.g. ["Large", "Gold", "Mk II"]
  sku?: string;
  priceModifier?: number;
}

export interface InventoryItem {
  id: string;
  professionalId: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  image: string;
  images?: string[];
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  damagedQuantity: number;
  rentalRate: number; // rental price per unit
  sellingPrice?: number; // selling price for regular products
  purchasePrice?: number; // optional cost price
  unit: string; // e.g. "units", "sets", "kg", "meters"
  inventoryType: InventoryType;
  classification?: ProductClassification; // 'sale' | 'rental' | 'both'
  productStatus?: ProductStatus;
  variants?: ProductVariant[];
  rentalDuration?: string; // e.g. "1 day", "3 days", "1 week"
  returnDate?: string;
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
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  createdAt: string;
}

export interface ReelComment {
  id: string;
  reelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string;
  replyToUserName?: string;
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
  commentsCount?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
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

// ==========================================
// REPOST EXPERIENCE & SETTINGS DATA MODELS
// ==========================================

export type RepostRequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVOKED'
  | 'REMOVED_BY_CUSTOMER';

export interface RepostRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  customerUsername?: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  originalReelId: string;
  originalReelThumbnail: string;
  originalReelCaption: string;
  bookingId?: string;
  bookingReference?: string;
  isVerifiedBooking?: boolean;
  experienceText: string;
  rating?: number; // 1 to 5
  additionalMedia?: string[];
  consentAccepted: boolean;
  status: RepostRequestStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Repost {
  id: string;
  requestId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  customerUsername?: string;
  professionalId: string;
  professionalName: string;
  professionalAvatar: string;
  originalReelId: string;
  experienceText: string;
  rating?: number;
  additionalMedia?: string[];
  publishedAt: string;
  status: 'PUBLISHED' | 'REVOKED' | 'REMOVED';
}

export type ActivityType = 'like' | 'comment' | 'saved' | 'repost' | 'viewed';

export interface UserActivity {
  id: string;
  userId: string;
  activityType: ActivityType;
  referenceId: string;
  referenceType: 'post' | 'reel' | 'repost';
  title: string;
  thumbnailUrl?: string;
  professionalId?: string;
  professionalName?: string;
  createdAt: string;
  commentText?: string;
}

export type OrderStatus = 'processing' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled' | 'returned';
export type DeliveryStatus = 'pending' | 'shipped' | 'out_for_delivery' | 'delivered' | 'returned';

export interface ProductOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  customerPhone?: string;
  professionalId: string;
  professionalName: string;
  productId: string;
  productName: string;
  productSku?: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  deliveryAddress: string;
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

export interface SavedPaymentMethod {
  id: string;
  cardType: 'visa' | 'mastercard' | 'rupay';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface SavedUpiMethod {
  id: string;
  upiId: string;
  isDefault: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'successful' | 'refunded' | 'pending';
  reference: string;
}

export interface CustomerBillingDetails {
  savedCards: SavedPaymentMethod[];
  savedUpi: SavedUpiMethod[];
  billingAddress: string;
  paymentHistory: PaymentHistoryItem[];
  refundHistory: PaymentHistoryItem[];
}

export interface PayoutRecord {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'failed';
  reference: string;
  account: string;
}

export interface ProfessionalBankDetails {
  accountHolderName: string;
  bankName: string;
  maskedAccountNumber: string;
  ifscCode: string;
  upiId: string;
  payoutPreference: 'daily' | 'weekly' | 'instant';
  verificationStatus: 'verified' | 'pending' | 'unverified';
  payoutHistory: PayoutRecord[];
}

export interface NotificationCategoryPreferences {
  bookingRequests: boolean;
  quotations: boolean;
  bookingConfirmations: boolean;
  bookingCancellations: boolean;
  directMessages: boolean;
  repostRequests: boolean;
  repostApprovals: boolean;
  repostRejections: boolean;
  newFollowers: boolean;
  inventoryAlerts: boolean;
}

// ==========================================
// VENDOR BUSINESS MODES & SETTINGS
// ==========================================

export type VendorBusinessMode = 'BOOKING_BASED' | 'ORDER_BASED';

export interface VendorBusinessSettings {
  userId: string;
  businessMode: VendorBusinessMode;
  active: boolean;
  updatedAt: string;
}

// ==========================================
// FINANCIAL DASHBOARD DATA MODELS
// ==========================================

export type CommissionCalculationType = 'percentage' | 'fixed_plus_percentage';

export interface CommissionRule {
  id: string;
  businessMode: VendorBusinessMode | 'ALL';
  category: string; // 'Product Sales' | 'Product Rentals' | 'Event Service Bookings' | string
  commissionPercentage: number;
  calculationType: CommissionCalculationType;
  active: boolean;
  description?: string;
}

export type FinancialTransactionType =
  | 'PRODUCT_SALE'
  | 'RENTAL_PAYMENT'
  | 'BOOKING_PAYMENT'
  | 'PLATFORM_COMMISSION'
  | 'SUBSCRIPTION_PAYMENT'
  | 'CUSTOMER_REFUND'
  | 'COMMISSION_REVERSAL'
  | 'PAYOUT'
  | 'PAYOUT_REVERSAL'
  | 'OTHER_ADJUSTMENT';

export type FinancialTransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';

export interface FinancialTransaction {
  id: string;
  vendorId: string;
  transactionType: FinancialTransactionType;
  referenceId: string; // orderId, bookingId, subscriptionId, payoutId, refundId
  description?: string;
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  currency: string;
  status: FinancialTransactionStatus;
  createdAt: string;
  completedAt?: string;
  metadata?: {
    category?: string;
    commissionRate?: number;
    customerName?: string;
    itemName?: string;
    paymentMethod?: string;
    invoiceNumber?: string;
    taxAmount?: number;
  };
}

export type PayoutStatus = 'REQUESTED' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface VendorPayout {
  id: string;
  vendorId: string;
  amount: number;
  bankAccountId: string;
  bankName?: string;
  maskedAccount?: string;
  status: PayoutStatus;
  requestedAt: string;
  completedAt?: string;
  utrReference?: string;
  notes?: string;
}

export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'CANCELLED' | 'PAYMENT_FAILED';
export type BillingFrequency = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  vendorId: string;
  planId: string;
  planName: string;
  amount: number;
  billingFrequency: BillingFrequency;
  startDate: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
  paymentMethodPlaceholder?: string;
  features?: string[];
}

export interface SubscriptionPaymentRecord {
  id: string;
  subscriptionId: string;
  planName: string;
  billingPeriod: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  invoiceNumber: string;
  downloadUrl?: string;
}

export type RefundStatus =
  | 'REQUESTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REJECTED';

export interface Refund {
  id: string;
  vendorId: string;
  originalTransactionId: string;
  referenceId: string; // related order or booking ID
  referenceType?: 'order' | 'booking' | 'rental' | 'subscription';
  reason: string;
  refundAmount: number;
  commissionAdjustment: number;
  netAdjustment: number;
  status: RefundStatus;
  customerName?: string;
  createdAt: string;
  completedAt?: string;
}

export type BankVerificationStatus =
  | 'NOT_SUBMITTED'
  | 'PENDING_VERIFICATION'
  | 'VERIFIED'
  | 'REJECTED';

export interface VendorBankAccount {
  id: string;
  vendorId: string;
  accountHolderName: string;
  bankName: string;
  maskedAccountNumber: string;
  ifscCode: string;
  upiId: string;
  verificationStatus: BankVerificationStatus;
  isDefault: boolean;
  payoutPreference?: 'daily' | 'weekly' | 'instant';
}

export type DateFilterRange =
  | 'today'
  | 'this_week'
  | 'this_month'
  | 'last_3_months'
  | 'this_year'
  | 'custom';

export interface FinancialSummary {
  grossRevenue: number;
  platformCommission: number;
  netEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  totalPaidOut: number;
  totalSubscriptions: number;
  totalRefunds: number;
  periodTransactionCount: number;
}


