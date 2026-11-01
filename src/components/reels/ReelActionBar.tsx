import React from 'react';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share2,
  Bookmark,
  ArrowUpRight,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Reel } from '../../types';

interface ReelActionBarProps {
  reel: Reel;
  commentsCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onLike: () => void;
  onOpenComments: () => void;
  onOpenRepost: () => void;
  onOpenShare: () => void;
  onSave: () => void;
  onBookNow: () => void;
  onChat: () => void;
  isBesideLayout?: boolean;
}

export const ReelActionBar: React.FC<ReelActionBarProps> = ({
  reel,
  commentsCount,
  isMuted,
  onToggleMute,
  onLike,
  onOpenComments,
  onOpenRepost,
  onOpenShare,
  onSave,
  onBookNow,
  onChat,
  isBesideLayout = false,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`flex flex-col items-center gap-3 select-none pointer-events-auto ${
        isBesideLayout
          ? 'py-2 px-1'
          : 'pb-2'
      }`}
    >
      {/* 1. Primary Action: Book Vendor */}
      <button
        type="button"
        onClick={onBookNow}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-wine hover:bg-wine-dark text-white flex flex-col items-center justify-center gap-0.5 shadow-elevated border border-white/20 active:scale-90 transition-transform group"
        title="Book Vendor Consultation / Date"
      >
        <ArrowUpRight className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-[8px] font-bold tracking-tight uppercase">Book</span>
      </button>

      {/* 2. Like Action */}
      <button
        type="button"
        onClick={onLike}
        className="flex flex-col items-center group active:scale-125 transition-transform"
        title={reel.isLiked ? 'Unlike' : 'Like'}
      >
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
            isBesideLayout
              ? 'bg-surface-card border border-border shadow-xs hover:bg-sand/30'
              : 'bg-charcoal/60 backdrop-blur-md border border-white/20 hover:bg-charcoal/80'
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              reel.isLiked
                ? 'fill-wine text-wine stroke-[2.5px] scale-110'
                : isBesideLayout
                ? 'text-charcoal'
                : 'text-white'
            }`}
          />
        </div>
        <span
          className={`text-[10px] font-bold mt-1 ${
            isBesideLayout ? 'text-charcoal' : 'text-white'
          }`}
        >
          {reel.likesCount}
        </span>
      </button>

      {/* 3. Comments Action */}
      <button
        type="button"
        onClick={onOpenComments}
        className="flex flex-col items-center group active:scale-115 transition-transform"
        title="View Comments"
      >
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
            isBesideLayout
              ? 'bg-surface-card border border-border shadow-xs hover:bg-sand/30 text-charcoal'
              : 'bg-charcoal/60 backdrop-blur-md border border-white/20 hover:bg-charcoal/80 text-white'
          }`}
        >
          <MessageCircle className="w-5 h-5" />
        </div>
        <span
          className={`text-[10px] font-bold mt-1 ${
            isBesideLayout ? 'text-charcoal' : 'text-white'
          }`}
        >
          {commentsCount}
        </span>
      </button>

      {/* 4. Repost Experience Action */}
      <button
        type="button"
        onClick={onOpenRepost}
        className="flex flex-col items-center group active:scale-115 transition-transform"
        title="Share Experience / Repost"
      >
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
            isBesideLayout
              ? 'bg-surface-card border border-border shadow-xs hover:bg-sand/30 text-charcoal'
              : 'bg-charcoal/60 backdrop-blur-md border border-white/20 hover:bg-charcoal/80 text-white'
          }`}
        >
          <Repeat2 className="w-5 h-5 text-sand" />
        </div>
        <span
          className={`text-[10px] font-bold mt-1 ${
            isBesideLayout ? 'text-charcoal' : 'text-white'
          }`}
        >
          Repost
        </span>
      </button>

      {/* 5. Save / Bookmark Action */}
      <button
        type="button"
        onClick={onSave}
        className="flex flex-col items-center group active:scale-125 transition-transform"
        title={reel.isSaved ? 'Unsave' : 'Save'}
      >
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
            isBesideLayout
              ? 'bg-surface-card border border-border shadow-xs hover:bg-sand/30'
              : 'bg-charcoal/60 backdrop-blur-md border border-white/20 hover:bg-charcoal/80'
          }`}
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              reel.isSaved
                ? 'fill-sand text-sand stroke-[2px]'
                : isBesideLayout
                ? 'text-charcoal'
                : 'text-white'
            }`}
          />
        </div>
        <span
          className={`text-[10px] font-bold mt-1 ${
            isBesideLayout ? 'text-charcoal' : 'text-white'
          }`}
        >
          {reel.savesCount}
        </span>
      </button>

      {/* 6. Share Action */}
      <button
        type="button"
        onClick={onOpenShare}
        className="flex flex-col items-center group active:scale-115 transition-transform"
        title="Share Reel"
      >
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
            isBesideLayout
              ? 'bg-surface-card border border-border shadow-xs hover:bg-sand/30 text-charcoal'
              : 'bg-charcoal/60 backdrop-blur-md border border-white/20 hover:bg-charcoal/80 text-white'
          }`}
        >
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span
          className={`text-[10px] font-bold mt-1 ${
            isBesideLayout ? 'text-charcoal' : 'text-white'
          }`}
        >
          Share
        </span>
      </button>

      {/* 7. Direct Message / Chat with Vendor */}
      <button
        type="button"
        onClick={onChat}
        className="flex flex-col items-center group active:scale-115 transition-transform"
        title="Chat with Creator"
      >
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
            isBesideLayout
              ? 'bg-surface-card border border-border shadow-xs hover:bg-sand/30 text-charcoal'
              : 'bg-charcoal/60 backdrop-blur-md border border-white/20 hover:bg-charcoal/80 text-white'
          }`}
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <span
          className={`text-[10px] font-bold mt-1 ${
            isBesideLayout ? 'text-charcoal' : 'text-white'
          }`}
        >
          Chat
        </span>
      </button>

      {/* 8. Audio Mute / Unmute Button (Mobile Overlaid Only) */}
      {!isBesideLayout && (
        <button
          type="button"
          onClick={onToggleMute}
          className="w-9 h-9 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-white hover:text-sand flex items-center justify-center transition-all active:scale-90"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-sand" />}
        </button>
      )}
    </div>
  );
};

