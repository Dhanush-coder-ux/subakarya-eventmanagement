import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  Square,
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
  const [userOrientationOverride, setUserOrientationOverride] = useState<
    'auto' | 'portrait' | 'landscape' | 'square'
  >('auto');

  const currentReel = reels[currentIndex] || reels[0];

  // Detect orientation: from reel data or user override
  const effectiveOrientation =
    userOrientationOverride === 'auto'
      ? currentReel?.aspectRatio || 'portrait'
      : userOrientationOverride;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1 < reels.length ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : reels.length - 1));
  };

  // Keyboard navigation for reels
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

  const handleHashtagClick = (tag: string) => {
    const clean = tag.replace('#', '');
    navigate(`/search?tag=${encodeURIComponent(clean)}`);
  };

  if (!currentReel) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-charcoal-muted">
        No reels available.
      </div>
    );
  }

  // Dynamic sizing based on portrait vs landscape vs square
  const getContainerSizeClasses = () => {
    switch (effectiveOrientation) {
      case 'landscape':
        // Landscape / 16:9 cinematic widescreen presentation
        return 'w-full max-w-[960px] aspect-[16/9] max-h-[82vh]';
      case 'square':
        // Square 1:1 post format
        return 'w-full max-w-[560px] aspect-square max-h-[82vh]';
      case 'portrait':
      default:
        // Standard 9:16 vertical full-height format
        return 'w-full max-w-[420px] aspect-[9/16] max-h-[84vh]';
    }
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-4 py-3 sm:py-6 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
      {/* Top Aspect Ratio Controls & Indicator Bar */}
      <div className="mb-3.5 flex items-center justify-between w-full max-w-[960px] px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider hidden sm:inline">
            Video View:
          </span>
          <div className="inline-flex items-center bg-surface-card border border-border rounded-xl p-1 shadow-subtle gap-1">
            <button
              onClick={() => setUserOrientationOverride('auto')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                userOrientationOverride === 'auto'
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
              }`}
              title="Auto adapt size to video media"
            >
              Auto
            </button>
            <button
              onClick={() => setUserOrientationOverride('portrait')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                userOrientationOverride === 'portrait'
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
              }`}
              title="Portrait 9:16 Vertical"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portrait</span>
            </button>
            <button
              onClick={() => setUserOrientationOverride('landscape')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                userOrientationOverride === 'landscape'
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
              }`}
              title="Landscape 16:9 Widescreen"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landscape</span>
            </button>
            <button
              onClick={() => setUserOrientationOverride('square')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                userOrientationOverride === 'square'
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
              }`}
              title="Square 1:1"
            >
              <Square className="w-3 h-3" />
              <span className="hidden sm:inline">Square</span>
            </button>
          </div>
        </div>

        {/* Current Orientation Pill & Index */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-sand/60 border border-sand-dark text-[11px] font-semibold text-wine capitalize">
            {effectiveOrientation} view
          </span>
          <span className="text-xs font-mono font-bold text-charcoal-muted">
            {currentIndex + 1} / {reels.length}
          </span>
        </div>
      </div>

      {/* Main Reels Viewport with Side Navigation Controls */}
      <div className="relative flex items-center justify-center w-full max-w-[1100px]">
        {/* Dynamic Reel Card Container */}
        <div
          className={`relative ${getContainerSizeClasses()} bg-charcoal rounded-3xl overflow-hidden shadow-elevated border border-border/80 flex flex-col justify-between transition-all duration-300 ease-out`}
        >
          {/* Background Visual Media / Video Mock */}
          <div
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute inset-0 bg-charcoal cursor-pointer group"
          >
            <img
              src={currentReel.videoUrl || currentReel.thumbnailUrl}
              alt={currentReel.caption}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isPlaying ? 'opacity-95' : 'opacity-70'
              }`}
            />
            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-charcoal/90" />

            {/* Center Play/Pause Indicator if paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-charcoal/60 backdrop-blur-md text-sand flex items-center justify-center shadow-elevated">
                  <Play className="w-7 h-7 fill-sand ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Top Header: Category and Audio & Mute Controls */}
          <div className="relative z-20 p-4 sm:p-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-sand tracking-wide">
                {currentReel.category}
              </span>
              <span className="text-[11px] text-white/80 flex items-center gap-1 bg-charcoal/40 px-2 py-0.5 rounded-full">
                <MapPin className="w-3 h-3 text-sand" />
                <span>{currentReel.location}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-2 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/20 text-white hover:text-sand transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Area: Metadata & Action Column */}
          <div className="relative z-20 p-4 sm:p-6 flex items-end justify-between gap-4 text-white">
            {/* Left Column: Profile, Caption, Hashtags, Audio */}
            <div className="flex-1 min-w-0 pr-2 space-y-3">
              {/* Professional Info */}
              <div className="flex items-center gap-2.5">
                <Link
                  to={`/profile/${currentReel.professionalId}`}
                  className="flex items-center gap-2.5 group"
                >
                  <img
                    src={currentReel.professionalAvatar}
                    alt={currentReel.professionalName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-sand group-hover:ring-wine transition-all"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sand transition-colors leading-tight truncate">
                      {currentReel.professionalName}
                    </h4>
                    <span className="text-[10px] text-sand/80 font-medium">Verified Partner</span>
                  </div>
                </Link>
              </div>

              {/* Caption */}
              <p
                className={`text-xs sm:text-sm text-white/95 leading-relaxed ${
                  effectiveOrientation === 'landscape' ? 'line-clamp-2 max-w-2xl' : 'line-clamp-3'
                }`}
              >
                {currentReel.caption}
              </p>

              {/* Hashtags */}
              {currentReel.hashtags && currentReel.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {currentReel.hashtags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleHashtagClick(tag)}
                      className="font-medium text-sand hover:underline"
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Audio Track */}
              <div className="flex items-center gap-2 text-[10px] text-white/80 bg-charcoal/50 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit max-w-full">
                <Music className="w-3 h-3 text-sand flex-shrink-0 animate-pulse" />
                <span className="truncate">{currentReel.audioTrack}</span>
              </div>
            </div>

            {/* Right Action Buttons Column */}
            <div className="flex flex-col items-center space-y-3.5 flex-shrink-0">
              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-12 h-12 rounded-2xl bg-wine hover:bg-wine-dark text-white flex flex-col items-center justify-center gap-0.5 shadow-elevated border border-white/20 active:scale-95 transition-all"
                title="Book Professional"
              >
                <ArrowUpRight className="w-5 h-5" />
                <span className="text-[9px] font-bold tracking-tight">Book</span>
              </button>

              {/* Like */}
              <button
                onClick={() => toggleLikeReel(currentReel.id)}
                className="flex flex-col items-center group active:scale-125 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-charcoal/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-wine/60">
                  <Heart
                    className={`w-5 h-5 ${
                      currentReel.isLiked ? 'fill-wine text-wine' : 'text-white'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">
                  {currentReel.likesCount}
                </span>
              </button>

              {/* Save */}
              <button
                onClick={() => toggleSaveReel(currentReel.id, currentUser.id)}
                className="flex flex-col items-center group active:scale-125 transition-transform"
              >
                <div className="w-10 h-10 rounded-full bg-charcoal/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-wine/60">
                  <Bookmark
                    className={`w-5 h-5 ${
                      currentReel.isSaved ? 'fill-sand text-sand' : 'text-white'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">
                  {currentReel.savesCount}
                </span>
              </button>

              {/* Share */}
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
                className="flex flex-col items-center group"
              >
                <div className="w-10 h-10 rounded-full bg-charcoal/60 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-[10px] font-bold mt-1 text-white">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Vertical Next / Prev Reel Controllers for Desktop */}
        <div className="hidden sm:flex flex-col gap-3 ml-4">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-surface-card border border-border shadow-card hover:bg-sand/50 text-charcoal hover:text-wine transition-all"
            title="Previous Reel (Up Arrow)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <span className="text-center text-xs font-mono font-bold text-charcoal-muted">
            {currentIndex + 1}
          </span>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-surface-card border border-border shadow-card hover:bg-sand/50 text-charcoal hover:text-wine transition-all"
            title="Next Reel (Down Arrow)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
