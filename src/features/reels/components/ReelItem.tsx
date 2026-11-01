import React from 'react';
import { Tag, MapPin, Volume2, VolumeX } from 'lucide-react';
import { Reel } from '../types/reel.types';
import { ReelVideoPlayer } from './ReelVideoPlayer';
import { ReelInformation } from './ReelInformation';
import { ReelActionBar } from './ReelActionBar';
import { DoubleTapLike } from './DoubleTapLike';

interface ReelItemProps {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  commentsCount: number;
  onToggleMute: () => void;
  onTogglePlay: () => void;
  onLike: () => void;
  onDoubleTap: () => void;
  onOpenComments: () => void;
  onOpenRepost: () => void;
  onOpenShare: () => void;
  onSave: () => void;
  onBookNow: () => void;
  onChat: () => void;
  showHeartAnim: boolean;
}

export const ReelItem: React.FC<ReelItemProps> = ({
  reel,
  isActive,
  isMuted,
  isPlaying,
  commentsCount,
  onToggleMute,
  onTogglePlay,
  onLike,
  onDoubleTap,
  onOpenComments,
  onOpenRepost,
  onOpenShare,
  onSave,
  onBookNow,
  onChat,
  showHeartAnim,
}) => {
  return (
    <div className="relative w-full sm:w-[380px] md:w-[410px] lg:w-[430px] aspect-[9/16] h-[100dvh] sm:h-[84vh] max-h-[860px] bg-charcoal sm:rounded-3xl overflow-hidden shadow-elevated border-0 sm:border border-border/60 flex flex-col justify-between shrink-0 select-none">
      {/* 1. Actual HTML5 Video Player with Fallback & Double-Tap Handling */}
      <div className="absolute inset-0">
        <ReelVideoPlayer
          videoUrl={reel.videoUrl}
          thumbnailUrl={reel.thumbnailUrl}
          isActive={isActive}
          isPlaying={isPlaying}
          isMuted={isMuted}
          caption={reel.caption}
          onTogglePlay={onTogglePlay}
          onDoubleTap={onDoubleTap}
        />
      </div>

      {/* 2. Double-Tap Heart Animation */}
      <DoubleTapLike show={showHeartAnim} />

      {/* 3. Top Bar: Category & Location on left, Audio Mute on right */}
      <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between text-white pointer-events-auto bg-gradient-to-b from-charcoal/80 via-charcoal/30 to-transparent">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-sand tracking-wide flex items-center gap-1 shadow-xs">
            <Tag className="w-3 h-3 text-sand" />
            <span>{reel.category}</span>
          </span>
          {reel.location && (
            <span className="text-[10px] text-white/85 flex items-center gap-1 bg-charcoal/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
              <MapPin className="w-2.5 h-2.5 text-sand" />
              <span className="truncate max-w-[120px]">{reel.location}</span>
            </span>
          )}
        </div>

        {/* Audio Mute/Unmute Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMute();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-white hover:text-sand flex items-center justify-center transition-all active:scale-90"
          title={isMuted ? 'Unmute Audio (m)' : 'Mute Audio (m)'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-sand" />}
        </button>
      </div>

      {/* 4. Bottom Area: Creator info on left, overlaid action bar on mobile */}
      <div className="relative z-20 p-3.5 sm:p-4 pb-20 sm:pb-4 flex items-end justify-between gap-3 text-white pointer-events-auto bg-gradient-to-t from-charcoal/95 via-charcoal/75 to-transparent pt-16">
        {/* Creator Information & Caption */}
        <div className="flex-1 min-w-0 pr-1">
          <ReelInformation reel={reel} />
        </div>

        {/* Action Bar (overlaid on mobile only) */}
        <div className="sm:hidden shrink-0">
          <ReelActionBar
            reel={reel}
            commentsCount={commentsCount}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onLike={onLike}
            onOpenComments={onOpenComments}
            onOpenRepost={onOpenRepost}
            onOpenShare={onOpenShare}
            onSave={onSave}
            onBookNow={onBookNow}
            onChat={onChat}
            isBesideLayout={false}
          />
        </div>
      </div>
    </div>
  );
};

