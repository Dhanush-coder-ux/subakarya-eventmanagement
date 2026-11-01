import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';

interface ReelVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  isActive: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  caption: string;
  onTogglePlay: () => void;
  onDoubleTap: () => void;
}

export const ReelVideoPlayer: React.FC<ReelVideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  isActive,
  isPlaying,
  isMuted,
  caption,
  onTogglePlay,
  onDoubleTap,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showPlayStateFlash, setShowPlayStateFlash] = useState(false);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize playback with active state, isPlaying, and isMuted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    if (isActive && isPlaying && !hasError) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser prevented unmuted autoplay; ensure muted and retry
          video.muted = true;
          video.play().catch(() => {
            // Autoplay completely blocked or offline
          });
        });
      }
    } else {
      video.pause();
    }
  }, [isActive, isPlaying, isMuted, hasError]);

  // Handle double tap vs single tap on video
  const handleClick = useCallback(() => {
    if (tapTimeoutRef.current) {
      // Double tap detected!
      clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = null;
      onDoubleTap();
    } else {
      // Single tap candidate
      tapTimeoutRef.current = setTimeout(() => {
        tapTimeoutRef.current = null;
        onTogglePlay();
        setShowPlayStateFlash(true);
        setTimeout(() => setShowPlayStateFlash(false), 500);
      }, 250);
    }
  }, [onTogglePlay, onDoubleTap]);

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-full bg-charcoal overflow-hidden cursor-pointer select-none group"
    >
      {/* Video Element */}
      {!hasError ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          playsInline
          loop
          muted={isMuted}
          preload={isActive ? 'auto' : 'metadata'}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onCanPlay={() => setIsBuffering(false)}
          onError={() => {
            setHasError(true);
            setIsBuffering(false);
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        /* Graceful Fallback: High-resolution media poster */
        <div className="relative w-full h-full">
          <img
            src={thumbnailUrl || videoUrl}
            alt={caption}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 z-10 px-2 py-0.5 rounded-md bg-charcoal/70 backdrop-blur-md text-[10px] text-white/80 border border-white/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sand" />
            <span>HD Preview Mode</span>
          </div>
        </div>
      )}

      {/* Cinematic Vignette Overlay (Instagram gradient) */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent via-40% to-charcoal/95 pointer-events-none" />

      {/* Buffering Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="p-3 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-white">
            <Loader2 className="w-8 h-8 animate-spin text-sand" />
          </div>
        </div>
      )}

      {/* Play / Pause Flash Indicator */}
      {showPlayStateFlash && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25 animate-in zoom-in-75 fade-out-50 duration-300">
          <div className="w-16 h-16 rounded-full bg-charcoal/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-elevated">
            {isPlaying ? (
              <Play className="w-7 h-7 fill-white text-white ml-1" />
            ) : (
              <Pause className="w-7 h-7 fill-white text-white" />
            )}
          </div>
        </div>
      )}

      {/* Persistent Paused Watermark when paused and not buffering */}
      {!isPlaying && !isBuffering && !showPlayStateFlash && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
          <div className="w-16 h-16 rounded-full bg-charcoal/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-elevated">
            <Play className="w-7 h-7 fill-white text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

