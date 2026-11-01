import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { Reel } from '../../types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reel: Reel;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  reel,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reelUrl = window.location.href;
  const shareText = `Check out this reel by ${reel.professionalName} on Subakarya: "${reel.caption}"`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reelUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Reel by ${reel.professionalName}`,
          text: shareText,
          url: reelUrl,
        })
        .catch(() => {});
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + reelUrl)}`,
      '_blank'
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(reelUrl)}`,
      '_blank'
    );
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(reelUrl)}`,
      '_blank'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl border-t sm:border border-border shadow-elevated z-10 p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-wine" />
            <h3 className="font-bold text-sm text-charcoal">Share Reel</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-charcoal-muted hover:text-charcoal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reel Summary Card */}
        <div className="p-3 rounded-xl bg-surface-card border border-border flex items-center gap-3">
          <img
            src={reel.thumbnailUrl || reel.videoUrl}
            alt={reel.caption}
            className="w-12 h-16 rounded-lg object-cover shrink-0 border border-border"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-charcoal truncate">{reel.professionalName}</p>
            <p className="text-[11px] text-charcoal-muted line-clamp-2 mt-0.5 leading-snug">
              {reel.caption}
            </p>
          </div>
        </div>

        {/* Copy Link Row */}
        <div className="flex items-center gap-2 p-1.5 bg-surface-card rounded-xl border border-border">
          <input
            type="text"
            readOnly
            value={reelUrl}
            className="flex-1 px-2.5 text-xs bg-transparent text-charcoal truncate outline-none select-all"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs active:scale-95 shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-sand" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Share Targets */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1 text-center">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="p-3 rounded-xl bg-sand/30 hover:bg-sand/60 text-charcoal flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-success text-white flex items-center justify-center font-bold text-xs shadow-xs">
              WA
            </div>
            <span className="text-[11px]">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleTwitter}
            className="p-3 rounded-xl bg-sand/30 hover:bg-sand/60 text-charcoal flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs shadow-xs">
              𝕏
            </div>
            <span className="text-[11px]">X (Twitter)</span>
          </button>

          <button
            type="button"
            onClick={handleFacebook}
            className="p-3 rounded-xl bg-sand/30 hover:bg-sand/60 text-charcoal flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              FB
            </div>
            <span className="text-[11px]">Facebook</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="p-3 rounded-xl bg-sand/30 hover:bg-sand/60 text-charcoal flex flex-col items-center justify-center gap-1.5 text-xs font-medium transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-wine text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-[11px]">More</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

