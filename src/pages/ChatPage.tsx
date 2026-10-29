import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Search,
  ChevronLeft,
  Calendar,
  MapPin,
  FileText,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  PlusCircle,
  AlertCircle,
  MessageCircle,
  SquarePen,
  MoreVertical,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { BookingRequestCard } from '../components/chat/BookingRequestCard';
import { QuotationCard } from '../components/chat/QuotationCard';
import { CreateQuoteModal } from '../components/chat/CreateQuoteModal';
import { formatINR, formatTime } from '../utils';
import { Quotation, BookingRequestData } from '../types';

export const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { currentUser, accountType } = useAuthStore();
  const {
    conversations,
    messages,
    services,
    inventory,
    bookings,
    activeConversationId,
    pendingBookingContext,
    setActiveConversation,
    sendChatMessage,
    sendBookingRequest,
    sendQuotation,
    acceptQuotation,
    declineQuotation,
    updateBookingStatus,
  } = useMarketplaceStore();

  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  // On mobile view, show list of chats first unless a specific conversationId param is present
  const [showMobileList, setShowMobileList] = useState(!conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCustomer = accountType === 'customer';

  // Sync conversationId from URL parameter if provided
  useEffect(() => {
    if (conversationId) {
      const exists = conversations.some((c) => c.id === conversationId);
      if (exists) {
        setActiveConversation(conversationId);
        setShowMobileList(false);
      }
    } else {
      // In mobile view without URL conversationId, default to showing the list of chats
      if (window.innerWidth < 768) {
        setShowMobileList(true);
      } else if (!activeConversationId && conversations.length > 0) {
        setActiveConversation(conversations[0].id);
      }
    }
  }, [conversationId, conversations, setActiveConversation]);

  // Scroll to latest message
  useEffect(() => {
    if (!showMobileList) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeConversationId, showMobileList]);

  // Active conversation
  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Associated booking for this conversation
  const associatedBooking = bookings.find((b) => b.id === activeConversation?.bookingId);

  // Professional's services & inventory for the active conversation
  const activeProId = isCustomer
    ? activeConversation?.professionalId || pendingBookingContext?.professionalId
    : currentUser.id;

  const proServices = services.filter((s) => s.professionalId === activeProId);
  const proInventory = inventory.filter((i) => i.professionalId === activeProId);

  // Actions
  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowMobileList(false);
    navigate(`/chat/${id}`);
  };

  const handleBackToList = () => {
    setShowMobileList(true);
    navigate('/chat');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversationId) return;

    sendChatMessage(activeConversationId, messageInput.trim(), {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      role: accountType,
    });
    setMessageInput('');
  };

  const handleBookingRequestSubmit = (requestData: BookingRequestData) => {
    if (!activeConversationId) return;
    sendBookingRequest(activeConversationId, requestData, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      role: 'customer',
    });
  };

  const handleSendQuote = (quotation: Quotation) => {
    if (!activeConversationId) return;
    sendQuotation(activeConversationId, quotation, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
    });
  };

  const handleAcceptQuote = (quoteId: string) => {
    if (!activeConversationId) return;
    acceptQuotation(quoteId, activeConversationId, currentUser.name);
  };

  const handleDeclineQuote = (quoteId: string) => {
    if (!activeConversationId) return;
    declineQuotation(quoteId, activeConversationId, currentUser.name);
  };

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((c) => {
    const query = searchTerm.toLowerCase();
    return (
      c.customerName.toLowerCase().includes(query) ||
      c.professionalName.toLowerCase().includes(query) ||
      c.lastMessage.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full h-full flex flex-row min-h-0 min-w-0 overflow-hidden bg-surface text-charcoal">
      {/* ============================================================ */}
      {/* 1. LEFT SIDEBAR: FIXED-WIDTH CONVERSATION LIST (Instagram DM) */}
      {/* ============================================================ */}
      <aside
        className={`${
          showMobileList ? 'flex' : 'hidden'
        } md:flex flex-col w-full md:w-80 lg:w-[350px] shrink-0 border-r border-border bg-surface h-full min-h-0 overflow-hidden z-20 pb-16 md:pb-0`}
      >
        {/* User Handle & Header */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Back button on mobile to return to Dashboard or Home */}
            <button
              onClick={() => navigate(isCustomer ? '/' : '/dashboard')}
              className="md:hidden p-1.5 -ml-1 rounded-full text-charcoal hover:bg-sand/40 transition-colors shrink-0 active:scale-95"
              title="Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="font-bold text-base text-charcoal tracking-tight truncate max-w-[160px] sm:max-w-[200px]">
              {currentUser.name}
            </h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sand text-wine border border-sand-dark shrink-0">
              {isCustomer ? 'Customer' : 'Vendor'}
            </span>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="p-1.5 rounded-full hover:bg-sand/40 text-charcoal transition-colors active:scale-95 shrink-0"
            title="Explore professionals"
          >
            <SquarePen className="w-4 h-4 text-charcoal-muted hover:text-wine" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-border/70 bg-surface shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-sand/25 text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine/50 focus:bg-surface transition-all"
            />
          </div>
        </div>

        {/* Scrollable Conversation Threads */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y divide-border/40 no-scrollbar">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-charcoal-muted space-y-2">
              <p>No active conversations found.</p>
              <Link
                to="/search"
                className="text-wine font-semibold hover:underline block text-xs"
              >
                Browse event professionals
              </Link>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversationId && !showMobileList;
              const otherPartyName = isCustomer ? conv.professionalName : conv.customerName;
              const otherPartyAvatar = isCustomer ? conv.professionalAvatar : conv.customerAvatar;
              const otherPartyCategory = isCustomer ? conv.professionalCategory : 'Customer';
              const unread = isCustomer ? conv.unreadCustomerCount : conv.unreadProfessionalCount;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className={`px-4 py-3 cursor-pointer transition-all flex items-center gap-3 select-none active:bg-sand/30 ${
                    isSelected
                      ? 'bg-sand/40 border-l-4 border-wine'
                      : 'hover:bg-sand/20'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={otherPartyAvatar}
                      alt={otherPartyName}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-border"
                    />
                    {unread > 0 && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-wine border-2 border-surface rounded-full" />
                    )}
                  </div>

                  {/* Thread info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-charcoal truncate">
                        {otherPartyName}
                      </h4>
                      <span className="text-[10px] text-charcoal-muted shrink-0 ml-1">
                        {formatTime(conv.lastMessageAt)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs text-charcoal-muted line-clamp-1 leading-snug truncate">
                        {conv.lastMessage}
                      </p>
                      {unread > 0 && (
                        <span className="w-2 h-2 rounded-full bg-wine shrink-0" />
                      )}
                    </div>

                    <span className="text-[10px] font-medium text-wine block truncate mt-0.5">
                      {otherPartyCategory}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. RIGHT-SIDE ACTIVE CHAT: OCCUPIES ENTIRE REMAINING WIDTH  */}
      {/* ============================================================ */}
      <section
        className={`${
          showMobileList ? 'hidden' : 'flex'
        } md:flex flex-col flex-1 min-w-0 h-full min-h-0 bg-surface overflow-hidden relative`}
      >
        {activeConversation ? (
          <>
            {/* Active Chat Top Header */}
            <div className="h-16 px-3.5 sm:px-6 border-b border-border bg-surface flex items-center justify-between shrink-0 z-10 gap-2">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {/* Mobile Back Button to conversation list */}
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="md:hidden p-1.5 -ml-1 rounded-full text-charcoal hover:bg-sand/40 transition-colors shrink-0 active:scale-95"
                  title="Back to conversations"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <img
                  src={
                    isCustomer
                      ? activeConversation.professionalAvatar
                      : activeConversation.customerAvatar
                  }
                  alt={
                    isCustomer
                      ? activeConversation.professionalName
                      : activeConversation.customerName
                  }
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-border shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-charcoal truncate leading-tight">
                      {isCustomer
                        ? activeConversation.professionalName
                        : activeConversation.customerName}
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-charcoal-muted flex items-center gap-1.5 mt-0.5 truncate">
                    <span>
                      {isCustomer ? activeConversation.professionalCategory : 'Customer Enquiry'}
                    </span>
                    {associatedBooking && (
                      <>
                        <span>•</span>
                        <span
                          className={`font-semibold capitalize text-[10px] px-1.5 py-0.2 rounded ${
                            associatedBooking.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sand text-wine'
                          }`}
                        >
                          {associatedBooking.status.replace('_', ' ')}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header */}
              <div className="flex items-center gap-2 shrink-0">
                {!isCustomer ? (
                  /* Compact Quotation trigger on desktop header */
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-wine hover:bg-wine-deep text-white text-xs font-semibold shadow-xs transition-all active:scale-95 shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Quote</span>
                  </button>
                ) : (
                  <>
                    <Link
                      to={`/professionals/${activeConversation.professionalId}/availability`}
                      className="px-2.5 sm:px-3 py-1.5 rounded-full border border-wine text-wine hover:bg-wine/10 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 active:scale-95"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Check Slots</span>
                    </Link>

                    <Link
                      to={`/profile/${activeConversation.professionalId}`}
                      className="p-2 rounded-full border border-border hover:bg-sand/30 text-charcoal transition-colors shrink-0"
                      title="View Profile"
                    >
                      <User className="w-4 h-4 text-charcoal-muted hover:text-charcoal" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Vendor Mobile Quick Action Subheader: Simple, Compact Create Quotation Button Under Header */}
            {!isCustomer && (
              <div className="sm:hidden px-3.5 py-2 bg-sand/30 border-b border-border/80 flex items-center justify-between shrink-0">
                <span className="text-[11px] font-medium text-charcoal-muted">
                  Client Enquiry: <strong className="text-charcoal">{activeConversation.customerName}</strong>
                </span>
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-wine text-white text-[11px] font-bold shadow-xs active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Quote</span>
                </button>
              </div>
            )}

            {/* Scrollable Conversation Stream */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-8 py-3.5 sm:py-4 space-y-3.5">
              {/* Draft Booking Request Card (when customer arrives with pending slot selection) */}
              {isCustomer && pendingBookingContext && (
                <div className="flex flex-col items-start animate-in fade-in duration-200">
                  <BookingRequestCard
                    isFormMode={true}
                    professionalName={pendingBookingContext.professionalName}
                    professionalId={pendingBookingContext.professionalId}
                    defaultCustomerId={currentUser.id}
                    defaultCustomerName={currentUser.name}
                    defaultCustomerPhone={currentUser.phone}
                    preselectedServiceId={pendingBookingContext.preselectedServiceId}
                    preselectedDate={pendingBookingContext.preselectedDate}
                    preselectedSlotId={pendingBookingContext.preselectedSlotId}
                    preselectedStartTime={pendingBookingContext.startTime}
                    preselectedEndTime={pendingBookingContext.endTime}
                    preselectedPrice={pendingBookingContext.packagePrice}
                    preselectedEventType={pendingBookingContext.eventType}
                    preselectedLocation={pendingBookingContext.location}
                    preselectedGuestCount={pendingBookingContext.guestCount}
                    preselectedNotes={pendingBookingContext.notes}
                    isCustomAvailabilityRequest={pendingBookingContext.isCustomAvailabilityRequest}
                    professionalServices={proServices}
                    professionalInventory={proInventory}
                    onSubmit={handleBookingRequestSubmit}
                    onChangeSlot={() =>
                      navigate(
                        `/professionals/${pendingBookingContext.professionalId}/availability${
                          pendingBookingContext.preselectedServiceId
                            ? `?service=${pendingBookingContext.preselectedServiceId}`
                            : ''
                        }`
                      )
                    }
                  />
                </div>
              )}

              {/* Messages Stream */}
              {currentMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;

                // 1. System Notification Message
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="text-center my-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-sand/60 border border-border text-[11px] text-charcoal-muted font-medium">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                // 2. Structured Booking Request Card Message
                if (msg.type === 'booking_request' && msg.bookingRequest) {
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-charcoal-muted mb-0.5 px-1">
                        {isMine ? 'You' : msg.senderName} • {formatTime(msg.createdAt)}
                      </div>
                      <BookingRequestCard
                        isFormMode={false}
                        data={msg.bookingRequest}
                        defaultCustomerId={msg.bookingRequest.customerId}
                        defaultCustomerName={msg.bookingRequest.customerName}
                        defaultCustomerPhone={msg.bookingRequest.customerPhone}
                        professionalServices={proServices}
                        isProfessionalView={!isCustomer}
                        onOpenQuotationModal={() => setShowQuoteModal(true)}
                      />
                    </div>
                  );
                }

                // 3. Official Quotation Card Message
                if (msg.type === 'quotation' && msg.quotation) {
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-charcoal-muted mb-0.5 px-1">
                        {msg.senderName} • {formatTime(msg.createdAt)}
                      </div>
                      <QuotationCard
                        quotation={msg.quotation}
                        userRole={accountType}
                        onAccept={handleAcceptQuote}
                        onDecline={handleDeclineQuote}
                      />
                    </div>
                  );
                }

                // 4. Status Update Message
                if (msg.type === 'status_update') {
                  return (
                    <div key={msg.id} className="text-center my-3">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{msg.content}</span>
                      </div>
                    </div>
                  );
                }

                // 5. Standard Text Message (Instagram DM Bubble Style)
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-subtle transition-all break-words ${
                        isMine
                          ? 'bg-wine text-white rounded-br-sm'
                          : 'bg-surface-card border border-border text-charcoal rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-charcoal-muted mt-0.5 px-1">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Fixed Message Input at Bottom (Instagram Pill Style) */}
            <div className="p-2.5 sm:p-4 border-t border-border bg-surface shrink-0 z-10">
              <form
                onSubmit={handleSendMessage}
                className="max-w-4xl mx-auto flex items-center gap-2.5"
              >
                <div className="flex-1 flex items-center bg-sand/20 hover:bg-sand/30 focus-within:bg-surface focus-within:border-wine/50 border border-border rounded-full px-4 py-2 transition-all">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Message..."
                    className="flex-1 bg-transparent text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/70 outline-none"
                  />
                  <Sparkles className="w-4 h-4 text-wine/60 shrink-0 ml-2" />
                </div>

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="w-9 h-9 rounded-full bg-wine hover:bg-wine-deep disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-subtle shrink-0 active:scale-95"
                  title="Send Message"
                >
                  <Send className="w-4 h-4 icon-hover-base icon-hover-send" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Empty State when no thread is selected (Instagram DM Style) */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-charcoal-muted">
            <div className="w-20 h-20 rounded-full border-2 border-wine/20 bg-sand/30 flex items-center justify-center mb-4 text-wine">
              <MessageCircle className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-lg text-charcoal">Your Direct Messages</h3>
            <p className="text-xs text-charcoal-muted max-w-xs mx-auto mt-1 leading-relaxed">
              Send quotations, discuss custom timelines, and confirm booking deposits with clients and vendors.
            </p>
          </div>
        )}
      </section>

      {/* Create Official Quotation Modal */}
      {showQuoteModal && activeConversation && (
        <CreateQuoteModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          onSendQuote={handleSendQuote}
          professionalId={activeConversation.professionalId}
          professionalName={activeConversation.professionalName}
          customerId={activeConversation.customerId}
          customerName={activeConversation.customerName}
          bookingId={activeConversation.bookingId || `booking-${Date.now()}`}
          services={proServices}
          inventory={proInventory}
        />
      )}
    </div>
  );
};
