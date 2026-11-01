import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Repeat2,
  Film,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { RepostRequest, RepostRequestStatus } from '../../../types';
import { RepostStatusBadge } from '../../reposts/RepostStatusBadge';
import { RepostRequestDetailModal } from '../../reposts/RepostRequestDetailModal';
import { formatDate } from '../../../utils';

export const RepostActivitySection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, accountType } = useAuthStore();
  const {
    repostRequests,
    reposts,
    reels,
    removeRepostByCustomer,
    revokeRepostPermission,
  } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';
  const [activeFilter, setActiveFilter] = useState<'ALL' | RepostRequestStatus>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<RepostRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filter requests for customer vs professional
  const relevantRequests = repostRequests.filter((r) =>
    isCustomer ? r.customerId === currentUser.id : r.professionalId === currentUser.id
  );

  const filteredRequests = relevantRequests.filter((r) => {
    if (activeFilter !== 'ALL' && r.status !== activeFilter) return false;
    return true;
  });

  const handleOpenDetail = (req: RepostRequest) => {
    setSelectedRequest(req);
    setIsDetailOpen(true);
  };

  const handleRemovePublishedRepost = (req: RepostRequest) => {
    const matched = reposts.find((rp) => rp.requestId === req.id || (rp.originalReelId === req.originalReelId && rp.customerId === req.customerId));
    if (matched) {
      if (window.confirm('Remove this repost from your public profile?')) {
        removeRepostByCustomer(matched.id);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-charcoal">
            {isCustomer ? 'Repost Activity & Experience History' : 'Repost Requests & Client Permissions'}
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {isCustomer
              ? 'Track the status of your requests to feature vendor reels on your profile along with your reviews'
              : 'Audit client requests to republish your creative reels with their wedding/event testimonials'}
          </p>
        </div>

        {!isCustomer && (
          <Link
            to="/professional/repost-requests"
            className="px-3.5 py-1.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open Dedicated Inbox</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-xl border border-border overflow-x-auto no-scrollbar">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'REVOKED', 'REMOVED_BY_CUSTOMER'] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
            }`}
          >
            {filter === 'ALL'
              ? `All (${relevantRequests.length})`
              : filter === 'REMOVED_BY_CUSTOMER'
              ? 'Removed'
              : filter}
          </button>
        ))}
      </div>

      {/* Request Cards */}
      {filteredRequests.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-border p-12 text-center space-y-3 shadow-card">
          <div className="w-12 h-12 rounded-full bg-sand text-wine flex items-center justify-center mx-auto">
            <Repeat2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-charcoal">No Repost Requests Found</h4>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              {isCustomer
                ? 'When watching reels from photographers, venues or caterers, tap "Repost" to request permission to share them on your profile.'
                : 'No client repost requests currently match this filter.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card space-y-3.5 hover:border-wine/30 transition-all"
            >
              {/* Header: Partner Name & Status Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <img
                    src={isCustomer ? req.professionalAvatar : req.customerAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                  />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-charcoal">
                      {isCustomer ? req.professionalName : req.customerName}
                    </h4>
                    <p className="text-[11px] text-charcoal-muted">
                      Request ID #{req.id} • {formatDate(req.createdAt)}
                    </p>
                  </div>
                </div>

                <RepostStatusBadge status={req.status} />
              </div>

              {/* Body: Original Reel preview + Customer Experience */}
              <div className="flex flex-col sm:flex-row items-start gap-3.5 p-3 rounded-xl bg-surface-muted/60 border border-border/80">
                <div
                  onClick={() => navigate('/reels')}
                  className="relative w-20 h-28 sm:w-20 sm:h-32 rounded-lg overflow-hidden bg-charcoal shrink-0 border border-border cursor-pointer group"
                >
                  <img
                    src={req.originalReelThumbnail}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center">
                    <Film className="w-4 h-4 text-white drop-shadow" />
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-charcoal">
                      Shared Experience & Review
                    </span>
                    {req.rating && (
                      <div className="flex items-center gap-1">
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
                  </div>

                  <p className="text-xs text-charcoal italic leading-relaxed">
                    &quot;{req.experienceText}&quot;
                  </p>

                  <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px]">
                    {req.isVerifiedBooking ? (
                      <span className="font-semibold text-success flex items-center gap-1 bg-success-light px-2 py-0.5 rounded-full border border-success/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Event Booking ({req.bookingReference})</span>
                      </span>
                    ) : (
                      <span className="text-charcoal-muted bg-sand/60 px-2 py-0.5 rounded-full border border-sand-dark">
                        General Experience
                      </span>
                    )}

                    <span className="text-charcoal-muted truncate max-w-[240px]">
                      Caption: {req.originalReelCaption}
                    </span>
                  </div>

                  {req.rejectionReason && (
                    <div className="mt-2 p-2 rounded-lg bg-error-light/50 border border-error/20 text-xs text-error">
                      <strong>Decline Note:</strong> {req.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-border/70 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <span className="text-[11px] text-charcoal-muted">
                  Updated: {formatDate(req.updatedAt)}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(req)}
                    className="px-3 py-1.5 rounded-xl border border-border hover:bg-sand/30 font-semibold text-charcoal transition-colors"
                  >
                    View Request Details
                  </button>

                  {isCustomer && req.status === 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => handleRemovePublishedRepost(req)}
                      className="px-3 py-1.5 rounded-xl border border-border hover:bg-error-light hover:text-error font-semibold text-charcoal-muted transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove from Profile</span>
                    </button>
                  )}

                  {isCustomer && req.status === 'APPROVED' && (
                    <Link
                      to={`/profile/${currentUser.id}`}
                      className="px-3 py-1.5 rounded-xl bg-wine hover:bg-wine-dark text-white font-bold shadow-xs transition-colors"
                    >
                      View on Profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <RepostRequestDetailModal
        request={selectedRequest}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
};

