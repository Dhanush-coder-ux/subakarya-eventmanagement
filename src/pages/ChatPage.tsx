import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const [showMobileList, setShowMobileList] = useState(!activeConversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isCustomer = accountType === 'customer';

  // Active conversation
  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Associated booking for this conversation
  const associatedBooking = bookings.find((b) => b.id === activeConversation?.bookingId);

  // Professional's services & inventory for the active conversation
  const proServices = services.filter(
    (s) => s.professionalId === activeConversation?.professionalId
  );
  const proInventory = inventory.filter(
    (i) => i.professionalId === activeConversation?.professionalId
  );

  // Find latest booking request in current conversation
  const latestBookingRequestMessage = [...currentMessages]
    .reverse()
    .find((m) => m.type === 'booking_request');
  const latestRequestData = latestBookingRequestMessage?.bookingRequest;

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, activeConversationId]);

  // Handle mobile screen back
  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    setShowMobileList(false);
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

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const query = searchTerm.toLowerCase();
    return (
      c.customerName.toLowerCase().includes(query) ||
      c.professionalName.toLowerCase().includes(query) ||
      c.lastMessage.toLowerCase().includes(query)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 h-[calc(100vh-5.5rem)]">
      <div className="bg-surface-card rounded-2xl border border-border shadow-card h-full flex overflow-hidden">
        {/* Left Panel: Conversation List */}
        <aside
          className={`${
            showMobileList ? 'flex' : 'hidden'
          } md:flex flex-col w-full md:w-80 lg:w-96 border-r border-border bg-surface-card h-full`}
        >
          {/* Header & Search */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-display text-lg font-bold text-charcoal">
                Event Messages & Bookings
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark">
                {conversations.length} Active
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-charcoal-muted">
                No active conversations found.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversationId;
                const otherPartyName = isCustomer ? conv.professionalName : conv.customerName;
                const otherPartyAvatar = isCustomer ? conv.professionalAvatar : conv.customerAvatar;
                const otherPartyCategory = isCustomer ? conv.professionalCategory : 'Customer';

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-sand/50 border-l-4 border-wine'
                        : 'hover:bg-sand/20'
                    }`}
                  >
                    <img
                      src={otherPartyAvatar}
                      alt={otherPartyName}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-charcoal truncate">
                          {otherPartyName}
                        </h4>
                        <span className="text-[10px] text-charcoal-light flex-shrink-0">
                          {formatTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-wine font-medium truncate mb-1">
                        {otherPartyCategory}
                      </p>
                      <p className="text-xs text-charcoal-muted line-clamp-1 leading-snug">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Panel: Active Conversation View */}
        <section
          className={`${
            showMobileList ? 'hidden' : 'flex'
          } md:flex flex-col flex-1 h-full bg-surface relative`}
        >
          {activeConversation ? (
            <>
              {/* Top Chat Header */}
              <div className="p-3.5 sm:p-4 border-b border-border bg-surface-card flex items-center justify-between shadow-subtle z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="md:hidden p-1.5 rounded-lg border border-border text-charcoal hover:bg-sand/30"
                  >
                    <ChevronLeft className="w-4 h-4" />
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
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-wine/30"
                  />

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-charcoal leading-tight">
                      {isCustomer
                        ? activeConversation.professionalName
                        : activeConversation.customerName}
                    </h3>
                    <p className="text-[11px] text-charcoal-muted flex items-center gap-1.5">
                      <span>
                        {isCustomer ? activeConversation.professionalCategory : 'Customer'}
                      </span>
                      {associatedBooking && (
                        <>
                          <span>•</span>
                          <span
                            className={`font-semibold capitalize ${
                              associatedBooking.status === 'confirmed'
                                ? 'text-success'
                                : 'text-wine'
                            }`}
                          >
                            Status: {associatedBooking.status.replace('_', ' ')}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Professional Actions (Create Quotation / Manage Booking) */}
                <div className="flex items-center gap-2">
                  {!isCustomer ? (
                    <button
                      onClick={() => setShowQuoteModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create Quotation</span>
                    </button>
                  ) : (
                    <Link
                      to={`/profile/${activeConversation.professionalId}`}
                      className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
                    >
                      View Profile
                    </Link>
                  )}
                </div>
              </div>

              {/* Messages Timeline */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Notice for Customer if they just clicked Book Now & have a pending booking form */}
                {isCustomer && pendingBookingContext && (
                  <BookingRequestCard
                    isFormMode={true}
                    defaultCustomerId={currentUser.id}
                    defaultCustomerName={currentUser.name}
                    defaultCustomerPhone={currentUser.phone}
                    preselectedServiceId={pendingBookingContext.preselectedServiceId}
                    professionalServices={proServices}
                    professionalInventory={proInventory}
                    onSubmit={handleBookingRequestSubmit}
                  />
                )}

                {/* Messages Loop */}
                {currentMessages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;

                  // Render System Message
                  if (msg.type === 'system') {
                    return (
                      <div key={msg.id} className="text-center my-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-sand/60 border border-sand-dark text-[11px] text-charcoal font-medium">
                          {msg.content}
                        </span>
                      </div>
                    );
                  }

                  // Render Booking Request Card Message
                  if (msg.type === 'booking_request' && msg.bookingRequest) {
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-charcoal-muted mb-1 px-1">
                          {msg.senderName} • {formatTime(msg.createdAt)}
                        </div>
                        <BookingRequestCard
                          isFormMode={false}
                          data={msg.bookingRequest}
                          defaultCustomerId={msg.bookingRequest.customerId}
                          defaultCustomerName={msg.bookingRequest.customerName}
                          defaultCustomerPhone={msg.bookingRequest.customerPhone}
                          professionalServices={proServices}
                        />
                      </div>
                    );
                  }

                  // Render Official Quotation Card Message
                  if (msg.type === 'quotation' && msg.quotation) {
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                      >
                        <div className="text-[10px] text-charcoal-muted mb-1 px-1">
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

                  // Render Status Update Message
                  if (msg.type === 'status_update') {
                    return (
                      <div key={msg.id} className="text-center my-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-success-light border border-success/30 text-xs font-semibold text-success shadow-xs">
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                          <span>{msg.content}</span>
                        </div>
                      </div>
                    );
                  }

                  // Standard Text Message
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-[10px] text-charcoal-light mb-0.5 px-1">
                        {isMine ? 'You' : msg.senderName} • {formatTime(msg.createdAt)}
                      </div>
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isMine
                            ? 'bg-wine text-white rounded-br-none'
                            : 'bg-surface-card border border-border text-charcoal rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 sm:p-4 border-t border-border bg-surface-card flex items-center gap-2"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type an enquiry message or question..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine focus:ring-1 focus:ring-wine/20 transition-all placeholder:text-charcoal-light"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-wine hover:bg-wine-dark disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-charcoal-muted">
              <FileText className="w-12 h-12 text-charcoal-light mb-3" />
              <h3 className="font-bold text-charcoal text-base">Select or Start an Enquiry</h3>
              <p className="text-xs max-w-sm mt-1">
                Choose a conversation from the left, or browse event professionals and click "Book Now" to initiate a structured enquiry.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Professional Create Quotation Modal */}
      {showQuoteModal && activeConversation && (
        <CreateQuoteModal
          isOpen={showQuoteModal}
          onClose={() => setShowQuoteModal(false)}
          onSendQuote={handleSendQuote}
          professionalId={activeConversation.professionalId}
          professionalName={activeConversation.professionalName}
          customerId={activeConversation.customerId}
          customerName={activeConversation.customerName}
          bookingId={activeConversation.bookingId || `book-${Date.now()}`}
          services={proServices}
          inventory={proInventory}
          bookingRequest={latestRequestData}
        />
      )}
    </div>
  );
};
