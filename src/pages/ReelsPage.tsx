import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  Music,
  MapPin,
  MessageCircle,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { useAuthStore } from '../store/useAuthStore';

export const ReelsPage: React.FC = () => {
  const navigate = useNavigate();
  const { reels, toggleLikeReel, toggleSaveReel, initiateBookingChat } = useMarketplaceStore();
  const { currentUser } = useAuthStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  // Touch swipe handling for mobile
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const currentReel = reels[currentIndex] || reels[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 < reels.length ? prev + 1 : 0));
    setIsCaptionExpanded(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : reels.length - 1));
    setIsCaptionExpanded(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diff = touchStartY.current - touchEndY.current;
    if (diff > 50) {
      // Swiped up -> next reel
      handleNext();
    } else if (diff < -50) {
      // Swiped down -> previous reel
      handlePrev();
    }
  };

  // Keyboard navigation for reels (ArrowUp, ArrowDown, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reels.length]);

  const handleDoubleTap = () => {
    if (!currentReel) return;
    if (!currentReel.isLiked) {
      toggleLikeReel(currentReel.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleBookNow = () => {
    if (!currentReel) return;
    initiateBookingChat(currentReel.professionalId, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  const handleHashtagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = tag.replace(/^#/, '');
    navigate(`/search?tag=${encodeURIComponent(clean)}`);
  };

  if (!currentReel) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-charcoal-muted">
        No reels available.
      </div>
    );
  }

  return (
    <div
      className="w-full flex items-center justify-center py-1 sm:py-4 px-0 sm:px-4 min-h-[calc(100dvh-7.5rem)] sm:min-h-[calc(100vh-5rem)] select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative flex items-center justify-center w-full max-w-[430px] sm:max-w-none">
        {/* Instagram Reels Frame */}
        <div
          className="relative w-full max-w-full sm:max-w-[400px] md:max-w-[420px] aspect-[9/16] h-[calc(100dvh-7.5rem)] sm:h-[82vh] max-h-[820px] bg-charcoal sm:rounded-3xl overflow-hidden shadow-elevated border-y sm:border border-border/80 flex flex-col justify-between"
        >
          {/* Background Visual Media / Simulated Video Player */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            onDoubleClick={handleDoubleTap}
            className="absolute inset-0 bg-charcoal cursor-pointer group"
          >
            <img
              src={currentReel.videoUrl || currentReel.thumbnailUrl}
              alt={currentReel.caption}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isPlaying ? 'opacity-95 scale-[1.01]' : 'opacity-70 scale-100'
              }`}
            />

            {/* Cinematic Gradient Overlays (Instagram style top and bottom shading) */}
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/95 pointer-events-none" />

            {/* Big Heart Popup on Double Tap */}
            {showHeartAnim && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out-50 duration-500 z-30">
                <Heart className="w-24 h-24 fill-white text-white drop-shadow-elevated opacity-90" />
              </div>
            )}

            {/* Play/Pause Overlay Indicator when paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-16 h-16 rounded-full bg-charcoal/70 backdrop-blur-md text-sand flex items-center justify-center shadow-elevated border border-white/20">
                  <Play className="w-7 h-7 fill-sand ml-1 text-sand" />
                </div>
              </div>
            )}
          </div>

          {/* Top Bar: Category Pill & Audio Mute Button */}
          <div className="relative z-20 p-3 sm:p-4 flex items-center justify-between text-white pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-sand tracking-wide">
                {currentReel.category}
              </span>
              <span className="text-[10px] text-white/80 flex items-center gap-1 bg-charcoal/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                <MapPin className="w-2.5 h-2.5 text-sand" />
                <span className="truncate max-w-[110px]">{currentReel.location}</span>
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-white hover:text-sand transition-colors active:scale-90"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Area: Instagram Profile, Caption & Action Column */}
          <div className="relative z-20 p-3 sm:p-4 pb-4 flex items-end justify-between gap-3 text-white pointer-events-auto">
            {/* Left Column: Creator info, caption, audio */}
            <div className="flex-1 min-w-0 pr-1 space-y-2">
              {/* Profile Bar */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/profile/${currentReel.professionalId}`}
                  className="flex items-center gap-2 group shrink-0"
                >
                  <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-sand-dark via-wine to-sand">
                    <img
                      src={currentReel.professionalAvatar}
                      alt={currentReel.professionalName}
                      className="w-9 h-9 rounded-full object-cover ring-1 ring-charcoal"
                    />
                  </div>
                  <div className="flex items-center gap-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-sand transition-colors truncate max-w-[150px] sm:max-w-[180px]">
                      {currentReel.professionalName}
                    </h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-wine fill-sand shrink-0" />
                  </div>
                </Link>
              </div>

              {/* Caption */}
              <div className="text-xs text-white/95 leading-relaxed">
                <p className={isCaptionExpanded ? '' : 'line-clamp-2'}>
                  {currentReel.caption}
                </p>
                {currentReel.caption.length > 80 && (
                  <button
                    onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                    className="text-[11px] text-sand/90 font-semibold hover:underline mt-0.5 inline-block"
                  >
                    {isCaptionExpanded ? 'less' : '...more'}
                  </button>
                )}
              </div>

              {/* Hashtags */}
              {currentReel.hashtags && currentReel.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {currentReel.hashtags.map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => handleHashtagClick(tag, e)}
                      className="font-medium text-sand hover:underline"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Audio Track Marquee Pill */}
              <div className="flex items-center gap-1.5 text-[10px] text-white/85 bg-charcoal/50 backdrop-blur-xs px-2.5 py-1 rounded-full w-fit max-w-[220px]">
                <Music className="w-3 h-3 text-sand shrink-0 animate-pulse" />
                <span className="truncate">{currentReel.audioTrack}</span>
              </div>
            </div>

            {/* Right Action Buttons Column (Instagram Style) */}
            <div className="flex flex-col items-center space-y-3.5 shrink-0 pb-1">
              {/* Primary CTA: Book Now */}
              <button
                onClick={handleBookNow}
                className="w-11 h-11 rounded-2xl bg-wine hover:bg-wine-dark text-white flex flex-col items-center justify-center gap-0.5 shadow-elevated border border-white/20 active:scale-90 transition-transform"
                title="Book Vendor"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-[8px] font-bold tracking-tight uppercase">Book</span>
              </button>

              {/* Like Button */}
              <button
                onClick={() => toggleLikeReel(currentReel.id)}
                className="flex flex-col items-center group active:scale-125 transition-transform"
                aria-label="Like reel"
              >
                <div className="w-9 h-9 rounded-full bg-charcoal/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-wine/60">
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      currentReel.isLiked ? 'fill-wine text-wine' : 'text-white'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">
                  {currentReel.likesCount}
                </span>
              </button>

              {/* Message / Chat Button */}
              <button
                onClick={handleBookNow}
                className="flex flex-col items-center group active:scale-110 transition-transform"
                title="Message Vendor"
              >
                <div className="w-9 h-9 rounded-full bg-charcoal/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">Chat</span>
              </button>

              {/* Bookmark / Save Button */}
              <button
                onClick={() => toggleSaveReel(currentReel.id, currentUser.id)}
                className="flex flex-col items-center group active:scale-125 transition-transform"
                aria-label="Save reel"
              >
                <div className="w-9 h-9 rounded-full bg-charcoal/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-wine/60">
                  <Bookmark
                    className={`w-5 h-5 transition-colors ${
                      currentReel.isSaved ? 'fill-sand text-sand' : 'text-white'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">
                  {currentReel.savesCount}
                </span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: currentReel.professionalName,
                        text: currentReel.caption,
                        url: window.location.href,
                      })
                      .catch(() => {});
                  }
                }}
                className="flex flex-col items-center group active:scale-110 transition-transform"
                title="Share Reel"
              >
                <div className="w-9 h-9 rounded-full bg-charcoal/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Vertical Next / Prev Reel Controllers */}
        <div className="hidden sm:flex flex-col items-center gap-3 ml-4">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-surface-card border border-border shadow-card hover:bg-sand/60 text-charcoal hover:text-wine transition-all active:scale-90"
            title="Previous Reel (Up Arrow)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <span className="text-center text-xs font-mono font-bold text-charcoal-muted">
            {currentIndex + 1} / {reels.length}
          </span>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-surface-card border border-border shadow-card hover:bg-sand/60 text-charcoal hover:text-wine transition-all active:scale-90"
            title="Next Reel (Down Arrow)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
