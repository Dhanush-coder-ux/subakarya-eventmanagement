import React, { useState } from 'react';
import {
  X,
  Star,
  Repeat2,
  CheckCircle2,
  Info,
  Calendar,
  Image as ImageIcon,
  ShieldAlert,
  ArrowRight,
  Eye,
  Film,
} from 'lucide-react';
import { Reel } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';

interface RepostRequestDialogProps {
  reel: Reel;
  isOpen: boolean;
  onClose: () => void;
}

export const RepostRequestDialog: React.FC<RepostRequestDialogProps> = ({
  reel,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuthStore();
  const { bookings, repostRequests, createRepostRequest } = useMarketplaceStore();

  const [experienceText, setExperienceText] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [selectedBookingId, setSelectedBookingId] = useState<string>('unverified');
  const [additionalPhotoInput, setAdditionalPhotoInput] = useState('');
  const [additionalPhotos, setAdditionalPhotos] = useState<string[]>([]);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  if (!isOpen) return null;

  // Find customer's bookings with this professional
  const customerBookingsWithPro = bookings.filter(
    (b) => b.customerId === currentUser.id && b.professionalId === reel.professionalId
  );

  // Check if customer already has a pending or approved request for this reel
  const existingActiveRequest = repostRequests.find(
    (r) =>
      r.customerId === currentUser.id &&
      r.originalReelId === reel.id &&
      (r.status === 'PENDING' || r.status === 'APPROVED')
  );

  const handleAddPhoto = () => {
    if (additionalPhotoInput.trim() && additionalPhotos.length < 3) {
      setAdditionalPhotos([...additionalPhotos, additionalPhotoInput.trim()]);
      setAdditionalPhotoInput('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setAdditionalPhotos(additionalPhotos.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!experienceText.trim()) {
      setValidationError('Please share a few words describing your experience.');
      return;
    }

    if (experienceText.trim().length < 15) {
      setValidationError('Please provide a slightly more descriptive experience (minimum 15 characters).');
      return;
    }

    if (!consentAccepted) {
      setValidationError('Please accept the permission and approval terms before submitting.');
      return;
    }

    const linkedBooking = customerBookingsWithPro.find((b) => b.id === selectedBookingId);

    createRepostRequest({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatar,
      customerUsername: ('email' in currentUser ? currentUser.email.split('@')[0] : 'client'),
      professionalId: reel.professionalId,
      professionalName: reel.professionalName,
      professionalAvatar: reel.professionalAvatar,
      originalReelId: reel.id,
      originalReelThumbnail: reel.thumbnailUrl || reel.videoUrl,
      originalReelCaption: reel.caption,
      bookingId: linkedBooking?.id,
      bookingReference: linkedBooking ? `BK-${linkedBooking.id.toUpperCase()}` : undefined,
      isVerifiedBooking: Boolean(linkedBooking && (linkedBooking.status === 'confirmed' || linkedBooking.status === 'completed')),
      experienceText: experienceText.trim(),
      rating,
      additionalMedia: additionalPhotos.length > 0 ? additionalPhotos : undefined,
      consentAccepted: true,
    });

    setSubmittedSuccess(true);
  };

  const handleClose = () => {
    setSubmittedSuccess(false);
    setShowPreview(false);
    setValidationError('');
    setExperienceText('');
    setAdditionalPhotos([]);
    setConsentAccepted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal / Bottom Sheet Panel */}
      <div className="relative w-full sm:max-w-xl bg-surface sm:rounded-2xl rounded-t-3xl border-t sm:border border-border shadow-elevated z-10 max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-surface-card flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-sand text-wine flex items-center justify-center shrink-0">
              <Repeat2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-charcoal">Share Your Experience</h3>
              <p className="text-[11px] text-charcoal-muted">
                Request creator permission to feature this reel on your profile
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-sand/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success confirmation state */}
        {submittedSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-sand text-wine flex items-center justify-center mx-auto shadow-subtle border border-sand-dark">
              <CheckCircle2 className="w-8 h-8 text-wine" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h4 className="text-lg font-bold text-charcoal">Request Sent</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Your repost permission request has been sent to the professional.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-sand/40 border border-sand-dark text-left text-xs text-charcoal space-y-1">
              <p className="font-semibold text-wine flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Approval Process</span>
              </p>
              <p className="text-[11px] text-charcoal-muted">
                Once <span className="font-semibold text-charcoal">{reel.professionalName}</span> reviews and approves your submission, this reel with your customer review will automatically publish to the new <span className="font-semibold text-charcoal">Reposts</span> tab on your profile.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs"
            >
              Done
            </button>
          </div>
        ) : existingActiveRequest ? (
          /* Notice when already requested */
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-full bg-sand/60 text-wine flex items-center justify-center mx-auto">
              <Repeat2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h4 className="text-base font-bold text-charcoal">Request Already Active</h4>
              <p className="text-xs text-charcoal-muted">
                You already have a {existingActiveRequest.status.toLowerCase()} repost request for this reel.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-surface-muted border border-border text-xs text-charcoal-muted text-left">
              <p className="font-semibold text-charcoal">Current Status: {existingActiveRequest.status}</p>
              <p className="text-[11px] mt-1">
                {existingActiveRequest.status === 'PENDING'
                  ? 'Awaiting creator review. You will be notified once Lumière approves.'
                  : 'This reel is already published on your profile Reposts tab!'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-charcoal text-white text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Reel summary card */}
            <div className="p-3 rounded-xl bg-surface-card border border-border flex items-center gap-3">
              <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-charcoal shrink-0 border border-border">
                <img
                  src={reel.thumbnailUrl || reel.videoUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/20 flex items-center justify-center">
                  <Film className="w-4 h-4 text-white drop-shadow" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <img
                    src={reel.professionalAvatar}
                    alt={reel.professionalName}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-charcoal truncate">
                    {reel.professionalName}
                  </span>
                </div>
                <p className="text-xs text-charcoal line-clamp-2 mt-1 leading-snug">
                  {reel.caption}
                </p>
                <span className="inline-block text-[10px] text-charcoal-muted mt-1">
                  Original Reel ID: #{reel.id}
                </span>
              </div>
            </div>

            {/* Explanatory banner */}
            <div className="p-3 rounded-xl bg-sand/35 border border-sand-dark flex items-start gap-2.5 text-xs text-charcoal">
              <Info className="w-4 h-4 text-wine shrink-0 mt-0.5" />
              <p className="text-[11px] text-charcoal-muted leading-relaxed">
                Repasting links the creator’s original reel with your genuine experience. The reel will appear on your profile under the <strong className="text-charcoal font-semibold">Reposts</strong> tab once approved by {reel.professionalName}.
              </p>
            </div>

            {/* Linked Booking Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                <span>Associated Event Booking</span>
                <span className="text-[10px] text-charcoal-muted font-normal">
                  {customerBookingsWithPro.length > 0 ? 'Verified booking eligible' : 'Unverified general experience'}
                </span>
              </label>

              {customerBookingsWithPro.length > 0 ? (
                <select
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine transition-colors"
                >
                  <option value="unverified">General Experience (Not linked to a booking)</option>
                  {customerBookingsWithPro.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.eventType} ({b.eventDate}) — Status: {b.status}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2.5 rounded-xl border border-dashed border-border bg-surface-muted text-xs text-charcoal-muted flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-charcoal-muted" />
                    <span>No completed bookings found with this creator</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sand text-charcoal font-semibold border border-sand-dark">
                    Unverified Experience
                  </span>
                </div>
              )}
            </div>

            {/* Rating selector (1-5 stars) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                <span>Your Rating (Optional)</span>
                <span className="text-xs font-semibold text-wine">
                  {rating} of 5 Stars
                </span>
              </label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-surface-card border border-border">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform active:scale-95"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating
                          ? 'fill-wine text-wine'
                          : 'text-border stroke-[1.5px]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Experience text description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal flex items-center justify-between">
                <span>Describe Your Experience *</span>
                <span className="text-[10px] text-charcoal-muted">
                  {experienceText.length}/400
                </span>
              </label>
              <textarea
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value.slice(0, 400))}
                placeholder="Share what made working with this vendor special, how the team performed on your event day, or what you loved about their work..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-border bg-surface text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine transition-all resize-none"
              />
            </div>

            {/* Optional Additional Photos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-charcoal-muted" />
                  <span>Additional Photos from Event (Optional)</span>
                </label>
                <span className="text-[10px] text-charcoal-muted">
                  {additionalPhotos.length}/3
                </span>
              </div>

              {additionalPhotos.length < 3 && (
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={additionalPhotoInput}
                    onChange={(e) => setAdditionalPhotoInput(e.target.value)}
                    placeholder="Paste image URL (e.g. https://...)"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    disabled={!additionalPhotoInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-sand hover:bg-sand-dark text-charcoal text-xs font-semibold disabled:opacity-50 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}

              {/* Sample Quick-Add buttons */}
              {additionalPhotos.length === 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-charcoal-muted">Quick sample photo:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAdditionalPhotos([
                        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80',
                      ])
                    }
                    className="text-[10px] text-wine hover:underline font-medium"
                  >
                    + Royal Corridor Decor
                  </button>
                </div>
              )}

              {additionalPhotos.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {additionalPhotos.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-14 h-14 rounded-lg overflow-hidden border border-border group"
                    >
                      <img src={url} alt="Extra" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-charcoal/70 text-white hover:bg-error transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Repost Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="w-full py-2 px-3 rounded-xl border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-wine" />
                  <span>Preview How Repost Will Appear on Your Profile</span>
                </div>
                <span className="text-[10px] text-charcoal-muted">
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </span>
              </button>

              {showPreview && (
                <div className="mt-2 p-3.5 rounded-2xl bg-sand/30 border border-sand-dark space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px] text-charcoal-muted">
                    <span className="font-semibold text-wine flex items-center gap-1">
                      <Repeat2 className="w-3 h-3" />
                      <span>Reposted from @{reel.professionalName}</span>
                    </span>
                    <span className="text-[10px]">Just now</span>
                  </div>

                  <div className="flex gap-3">
                    <img
                      src={reel.thumbnailUrl || reel.videoUrl}
                      alt=""
                      className="w-16 h-24 rounded-lg object-cover shrink-0 border border-border"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rating ? 'fill-wine text-wine' : 'text-border'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-charcoal font-medium line-clamp-3">
                        &quot;{experienceText.trim() || 'Your customer experience will appear here...'}&quot;
                      </p>
                      <p className="text-[10px] text-charcoal-muted">
                        Shared by @{currentUser.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-charcoal select-none">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-border text-wine focus:ring-wine w-4 h-4"
                />
                <span className="text-[11px] text-charcoal-muted leading-relaxed">
                  I confirm that I have permission to share this experience and understand that{' '}
                  <strong className="text-charcoal">{reel.professionalName}</strong> must approve the repost before it is publicly published.
                </span>
              </label>
            </div>

            {validationError && (
              <div className="p-2.5 rounded-xl bg-error-light border border-error/20 text-xs text-error font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-border flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-[2] py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Submit Repost Request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

