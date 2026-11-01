import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Repeat2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  ShieldCheck,
  Send,
  CalendarCheck,
  ArrowRight,
  Eye,
  Film,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { RepostRequest, RepostRequestStatus } from '../types';
import { RepostStatusBadge } from '../components/reposts/RepostStatusBadge';
import { RepostRequestDetailModal } from '../components/reposts/RepostRequestDetailModal';
import { formatDate } from '../utils';

export const ProfessionalRepostRequestsPage: React.FC = () => {
  const { requestId } = useParams<{ requestId?: string }>();
  const navigate = useNavigate();
  const { currentUser, accountType } = useAuthStore();
  const { repostRequests, conversations } = useMarketplaceStore();

  const [activeFilter, setActiveFilter] = useState<'ALL' | RepostRequestStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RepostRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Unread messages count for the Inbox switcher tabs
  const unreadCount = conversations.reduce((acc, conv) => {
    return acc + (accountType === 'customer' ? conv.unreadCustomerCount : conv.unreadProfessionalCount);
  }, 0);

  // Professional's requests
  const myRequests = repostRequests.filter(
    (r) => r.professionalId === currentUser.id
  );

  const pendingCount = myRequests.filter((r) => r.status === 'PENDING').length;
  const approvedCount = myRequests.filter((r) => r.status === 'APPROVED').length;
  const rejectedCount = myRequests.filter((r) => r.status === 'REJECTED').length;
  const revokedCount = myRequests.filter((r) => r.status === 'REVOKED').length;

  // Handle URL requestId param
  useEffect(() => {
    if (requestId) {
      const match = myRequests.find((r) => r.id === requestId);
      if (match) {
        setSelectedRequest(match);
        setIsDetailOpen(true);
      }
    }
  }, [requestId, myRequests]);

  // Filter requests
  const filteredRequests = myRequests.filter((r) => {
    if (activeFilter !== 'ALL' && r.status !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        r.customerName.toLowerCase().includes(query) ||
        r.experienceText.toLowerCase().includes(query) ||
        r.originalReelCaption.toLowerCase().includes(query) ||
        (r.bookingReference && r.bookingReference.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleOpenDetail = (req: RepostRequest) => {
    setSelectedRequest(req);
    setIsDetailOpen(true);
    navigate(`/professional/repost-requests/${req.id}`, { replace: true });
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedRequest(null);
    navigate('/professional/repost-requests', { replace: true });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5">
      {/* 1. SEPARATE PROFESSIONAL INBOX HEADER WITH 3 DISTINCT AREAS */}
      <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
              Vendor Communication & Permission Inbox
            </span>
            <h1 className="font-bold text-xl sm:text-2xl text-charcoal mt-1">
              Client Repost & Experience Requests
            </h1>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Review customer testimonials and grant approval to syndicate your reels onto their personal profiles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sand text-wine text-xs font-bold border border-sand-dark flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingCount} Pending Approval</span>
            </span>
          </div>
        </div>

        {/* 3 Distinct Inbox Sections Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-surface-muted rounded-xl border border-border/80">
          <Link
            to="/chat"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-charcoal hover:bg-sand/40 transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-charcoal-muted" />
            <span className="truncate">Chats & Quotations</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-wine text-white">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            to="/bookings"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-charcoal hover:bg-sand/40 transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-charcoal-muted" />
            <span className="truncate">Booking Orders</span>
          </Link>

          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold bg-white text-wine shadow-xs border border-border">
            <Repeat2 className="w-3.5 h-3.5 text-wine" />
            <span className="truncate">Repost Requests</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-wine text-white">
                {pendingCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3.5 rounded-xl bg-surface-card border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Pending Review</span>
          <p className="text-xl font-bold text-wine mt-0.5">{pendingCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-card border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Approved & Published</span>
          <p className="text-xl font-bold text-success mt-0.5">{approvedCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-card border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Declined Requests</span>
          <p className="text-xl font-bold text-error mt-0.5">{rejectedCount}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-surface-card border border-border shadow-xs">
          <span className="text-[11px] font-semibold text-charcoal-muted block">Revoked Permissions</span>
          <p className="text-xl font-bold text-charcoal-muted mt-0.5">{revokedCount}</p>
        </div>
      </div>

      {/* 3. Filters & Search Controls */}
      <div className="bg-surface-card rounded-2xl border border-border p-3 sm:p-4 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'ALL'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
            }`}
          >
            All ({myRequests.length})
          </button>
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeFilter === 'PENDING'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-sand-dark" />
            )}
          </button>
          <button
            onClick={() => setActiveFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'APPROVED'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setActiveFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'REJECTED'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
            }`}
          >
            Declined ({rejectedCount})
          </button>
          <button
            onClick={() => setActiveFilter('REVOKED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === 'REVOKED'
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
            }`}
          >
            Revoked ({revokedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client or reel caption..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine transition-colors"
          />
        </div>
      </div>

      {/* 4. Requests List / Inbox Grid */}
      {filteredRequests.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-border p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-full bg-sand text-wine flex items-center justify-center mx-auto">
            <Repeat2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-charcoal">No Repost Requests Found</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              {activeFilter !== 'ALL'
                ? `There are currently no requests with "${activeFilter}" status.`
                : 'When customers request permission to feature your reels along with their experience, they will appear in this dedicated inbox.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => handleOpenDetail(req)}
              className="bg-surface-card rounded-2xl border border-border p-4 shadow-card hover:shadow-elevated hover:border-wine/40 transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div className="space-y-3">
                {/* Header: Customer Profile & Status */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={req.customerAvatar}
                      alt={req.customerName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-border shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-charcoal truncate group-hover:text-wine transition-colors">
                        {req.customerName}
                      </h4>
                      <p className="text-[11px] text-charcoal-muted truncate">
                        @{req.customerUsername || 'customer'}
                      </p>
                    </div>
                  </div>

                  <RepostStatusBadge status={req.status} size="sm" />
                </div>

                {/* Body: Reel Thumbnail + Experience Snippet */}
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-surface-muted/60 border border-border/80">
                  <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-charcoal shrink-0 border border-border">
                    <img
                      src={req.originalReelThumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center">
                      <Film className="w-3.5 h-3.5 text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    {req.rating && (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= (req.rating || 5) ? 'fill-wine text-wine' : 'text-border'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-charcoal font-medium line-clamp-2 italic leading-relaxed">
                      &quot;{req.experienceText}&quot;
                    </p>
                    <div className="pt-0.5 flex items-center gap-1.5 flex-wrap">
                      {req.isVerifiedBooking ? (
                        <span className="text-[10px] font-bold text-success bg-success-light px-1.5 py-0.2 rounded border border-success/30 flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Verified {req.bookingReference}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-charcoal-muted bg-sand/60 px-1.5 py-0.2 rounded border border-sand-dark">
                          General Experience
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Date & Action Link */}
              <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[11px] text-charcoal-muted">
                <span>Received {formatDate(req.createdAt)}</span>
                <span className="font-semibold text-wine group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>{req.status === 'PENDING' ? 'Review & Decide' : 'View Details'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Detail Modal */}
      <RepostRequestDetailModal
        request={selectedRequest}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

