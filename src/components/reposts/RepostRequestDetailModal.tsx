import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  XCircle,
  Repeat2,
  Star,
  Calendar,
  User,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  RotateCcw,
  Film,
} from 'lucide-react';
import { RepostRequest, Reel } from '../../types';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { RepostStatusBadge } from './RepostStatusBadge';
import { formatDate } from '../../utils';

interface RepostRequestDetailModalProps {
  request: RepostRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChanged?: () => void;
}

export const RepostRequestDetailModal: React.FC<RepostRequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  onStatusChanged,
}) => {
  const navigate = useNavigate();
  const {
    reels,
    approveRepostRequest,
    rejectRepostRequest,
    revokeRepostPermission,
  } = useMarketplaceStore();

  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  if (!isOpen || !request) return null;

  const originalReel: Reel | undefined = reels.find((r) => r.id === request.originalReelId);

  const handleApprove = () => {
    approveRepostRequest(request.id);
    setActionSuccess('Repost request approved! The reel has been published to the customer’s profile.');
    setTimeout(() => {
      setActionSuccess(null);
      onStatusChanged?.();
      onClose();
    }, 1400);
  };

  const handleReject = () => {
    rejectRepostRequest(request.id, rejectionReason.trim() || undefined);
    setIsRejecting(false);
    setActionSuccess('Request has been respectfully declined.');
    setTimeout(() => {
      setActionSuccess(null);
      onStatusChanged?.();
      onClose();
    }, 1400);
  };

  const handleRevoke = () => {
    if (window.confirm('Are you sure you want to revoke repost permission? This will remove the reel from the customer’s public profile.')) {
      revokeRepostPermission(request.id);
      setActionSuccess('Repost permission revoked. Content removed from public view.');
      setTimeout(() => {
        setActionSuccess(null);
        onStatusChanged?.();
        onClose();
      }, 1400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl border border-border shadow-elevated z-10 max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-border bg-surface-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sand text-wine flex items-center justify-center shrink-0">
              <Repeat2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-charcoal">
                  Repost Permission Request
                </h3>
                <RepostStatusBadge status={request.status} size="sm" />
              </div>
              <p className="text-[11px] text-charcoal-muted">
                Received on {formatDate(request.createdAt)} • ID #{request.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-sand/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {actionSuccess && (
            <div className="p-3.5 rounded-xl bg-success-light border border-success/30 text-xs font-semibold text-success flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Customer Info Card */}
          <div className="p-4 rounded-xl bg-surface-card border border-border space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={request.customerAvatar}
                  alt={request.customerName}
                  className="w-12 h-12 rounded-full object-cover ring-1 ring-border"
                />
                <div>
                  <h4 className="font-bold text-sm text-charcoal">{request.customerName}</h4>
                  <p className="text-xs text-charcoal-muted">
                    @{request.customerUsername || 'client'}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {request.isVerifiedBooking ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success-light px-2 py-0.5 rounded-full border border-success/30">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified Event Client ({request.bookingReference})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-charcoal-muted bg-sand/60 px-2 py-0.5 rounded-full border border-sand-dark">
                        <span>General Experience Submission</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                to={`/profile/${request.customerId}`}
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal transition-colors flex items-center gap-1 shrink-0"
              >
                <span>View Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Customer rating & review */}
            <div className="pt-2 border-t border-border/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Submitted Customer Experience:
                </span>
                {request.rating && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= (request.rating || 5) ? 'fill-wine text-wine' : 'text-border'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-wine ml-1">{request.rating}/5</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-sand/20 border border-sand-dark/60 text-xs text-charcoal leading-relaxed italic">
                &quot;{request.experienceText}&quot;
              </div>

              {/* Extra photos if attached */}
              {request.additionalMedia && request.additionalMedia.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase">
                    Additional Photos Shared by Client:
                  </span>
                  <div className="flex items-center gap-2">
                    {request.additionalMedia.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group"
                      >
                        <img src={url} alt="Event" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Original Reel Showcase Card */}
          <div className="p-4 rounded-xl bg-surface-card border border-border space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
              <Film className="w-4 h-4 text-wine" />
              <span>Referenced Original Reel</span>
            </span>

            <div className="flex items-start gap-3.5">
              <div className="relative w-20 h-32 rounded-xl bg-charcoal overflow-hidden shrink-0 border border-border">
                <img
                  src={request.originalReelThumbnail}
                  alt={request.originalReelCaption}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">
                    {request.professionalName}
                  </span>
                  <span className="text-[10px] text-charcoal-muted">
                    • ID #{request.originalReelId}
                  </span>
                </div>
                <p className="text-xs text-charcoal leading-relaxed line-clamp-3">
                  {request.originalReelCaption}
                </p>
                {originalReel?.category && (
                  <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sand text-charcoal border border-sand-dark">
                    {originalReel.category}
                  </span>
                )}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/reels');
                    }}
                    className="text-xs text-wine hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Watch Full Reel in Reels Feed</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* If already rejected, show reason */}
          {request.status === 'REJECTED' && (
            <div className="p-3.5 rounded-xl bg-error-light/50 border border-error/20 text-xs text-error space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Rejection Reason Given:</span>
              </p>
              <p className="text-charcoal-muted">
                {request.rejectionReason || 'No specific reason entered.'}
              </p>
            </div>
          )}

          {/* Rejection input prompt */}
          {isRejecting && (
            <div className="p-4 rounded-xl bg-error-light/30 border border-error/30 space-y-3 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h5 className="text-xs font-bold text-charcoal">
                  Optional Reason for Declining
                </h5>
                <p className="text-[11px] text-charcoal-muted">
                  The client will receive a respectful status update with this explanation.
                </p>
              </div>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Thank you for sharing! We only feature verified brides/grooms who booked cinema packages through our portal."
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-error"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-charcoal hover:bg-sand/30"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-1.5 rounded-lg bg-error hover:bg-error-dark text-white text-xs font-bold shadow-xs"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 border-t border-border bg-surface-card flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-charcoal-muted">
            {request.status === 'PENDING' && 'Action required from vendor'}
            {request.status === 'APPROVED' && 'Live on customer’s profile'}
            {request.status === 'REJECTED' && 'Request closed'}
            {request.status === 'REVOKED' && 'Permission currently revoked'}
          </div>

          <div className="flex items-center gap-2.5">
            {request.status === 'PENDING' && !isRejecting && (
              <>
                <button
                  type="button"
                  onClick={() => setIsRejecting(true)}
                  className="px-3.5 py-2 rounded-xl border border-border hover:bg-error-light hover:text-error text-xs font-semibold text-charcoal transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Repost</span>
                </button>
              </>
            )}

            {request.status === 'APPROVED' && (
              <button
                type="button"
                onClick={handleRevoke}
                className="px-3.5 py-2 rounded-xl border border-border hover:bg-error-light hover:text-error text-xs font-semibold text-charcoal transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revoke Permission</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

