import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { useAuthStore } from '../store/useAuthStore';
import { ReelItem } from '../components/reels/ReelItem';
import { ReelActionBar } from '../components/reels/ReelActionBar';
import { ReelNavigation } from '../components/reels/ReelNavigation';
import { CommentsDrawer } from '../components/reels/CommentsDrawer';
import { ShareDialog } from '../components/reels/ShareDialog';
import { RepostRequestDialog } from '../components/reposts/RepostRequestDialog';

export const ReelsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    reels,
    reelComments,
    toggleLikeReel,
    toggleSaveReel,
    initiateBookingChat,
  } = useMarketplaceStore();
  const { currentUser } = useAuthStore();

  // Active Reel & Media Playback States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default muted to ensure initial autoplay succeeds across all browsers
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  // Dialog and Drawer States
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRepostOpen, setIsRepostOpen] = useState(false);

  // Responsive state for docked desktop comments drawer vs mobile bottom sheet
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Safe reference to the current active reel
  const currentReel = reels[currentIndex] || reels[0];

  // Calculate live comments count for active reel
  const currentComments = reelComments.filter(
    (c) => currentReel && c.reelId === currentReel.id
  );
  const commentsCount = currentReel
    ? Math.max(currentComments.length, currentReel.commentsCount || 0)
    : 0;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  }, [reels.length]);

  const handlePrev = useCallback(() => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  }, [reels.length]);

  // Touch Swipe Handling for Mobile
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('.comments-drawer') || isCommentsOpen) {
      return;
    }
    const diff = touchStartY.current - touchEndY.current;
    if (diff > 50) {
      // Swiped up -> Next Reel
      handleNext();
    } else if (diff < -50) {
      // Swiped down -> Previous Reel
      handlePrev();
    }
  };

  // Mouse Wheel / Trackpad Scroll Navigation (Throttled)
  const isWheelLocked = useRef(false);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('.comments-drawer') ||
        target?.closest('[data-scrollable="true"]') ||
        target?.closest('form')
      ) {
        return;
      }

      if (isWheelLocked.current) return;

      if (Math.abs(e.deltaY) > 35) {
        isWheelLocked.current = true;
        if (e.deltaY > 0) {
          handleNext();
        } else {
          handlePrev();
        }

        setTimeout(() => {
          isWheelLocked.current = false;
        }, 450);
      }
    },
    [handleNext, handlePrev]
  );

  // Global Keyboard Shortcuts (ArrowUp, ArrowDown, j, k, Space, m, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommentsOpen(false);
        setIsShareOpen(false);
        setIsRepostOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Social Interaction Handlers
  const handleLike = () => {
    if (!currentReel) return;
    toggleLikeReel(currentReel.id);
    if (!currentReel.isLiked) {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 700);
    }
  };

  const handleDoubleTap = () => {
    if (!currentReel) return;
    if (!currentReel.isLiked) {
      toggleLikeReel(currentReel.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 700);
  };

  const handleSave = () => {
    if (!currentReel) return;
    toggleSaveReel(currentReel.id, currentUser.id);
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

  const handleChat = () => {
    if (!currentReel) return;
    initiateBookingChat(currentReel.professionalId, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  if (!currentReel) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-charcoal-muted gap-3 p-4">
        <div className="w-16 h-16 rounded-full bg-sand/60 text-wine flex items-center justify-center">
          <Film className="w-8 h-8" />
        </div>
        <p className="font-bold text-sm text-charcoal">No Reels Available</p>
        <p className="text-xs text-charcoal-muted text-center max-w-sm">
          There are currently no reels published. Check back later or explore our event services!
        </p>
      </div>
    );
  }

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-charcoal sm:bg-surface"
    >
      {/* Centered Desktop Layout Container */}
      <div className="relative flex items-center justify-center w-full h-full px-0 sm:px-4">
        <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-5 max-w-full">
          {/* 1. Main 9:16 Reel Video Player Card */}
          <ReelItem
            reel={currentReel}
            isActive={true}
            isMuted={isMuted}
            isPlaying={isPlaying}
            commentsCount={commentsCount}
            onToggleMute={() => setIsMuted((prev) => !prev)}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
            onLike={handleLike}
            onDoubleTap={handleDoubleTap}
            onOpenComments={() => setIsCommentsOpen((prev) => !prev)}
            onOpenRepost={() => setIsRepostOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
            onSave={handleSave}
            onBookNow={handleBookNow}
            onChat={handleChat}
            showHeartAnim={showHeartAnim}
          />

          {/* 2. Desktop Interaction Action Bar (Beside Video) */}
          <div className="hidden sm:flex flex-col items-center shrink-0">
            <ReelActionBar
              reel={currentReel}
              commentsCount={commentsCount}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((prev) => !prev)}
              onLike={handleLike}
              onOpenComments={() => setIsCommentsOpen((prev) => !prev)}
              onOpenRepost={() => setIsRepostOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
              onSave={handleSave}
              onBookNow={handleBookNow}
              onChat={handleChat}
              isBesideLayout={true}
            />
          </div>

          {/* 3. Desktop Next / Previous Navigation Controls */}
          <div className="hidden sm:flex flex-col items-center shrink-0">
            <ReelNavigation
              onNext={handleNext}
              onPrev={handlePrev}
              currentIndex={currentIndex}
              totalReels={reels.length}
            />
          </div>

          {/* 4. Desktop Docked Comments Drawer (Instagram Web Style: alongside reel without resizing video) */}
          {isCommentsOpen && isDesktop && (
            <div className="shrink-0 hidden lg:block">
              <CommentsDrawer
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                reelId={currentReel.id}
                reelCaption={currentReel.caption}
                professionalName={currentReel.professionalName}
                professionalAvatar={currentReel.professionalAvatar}
                isDesktopDrawer={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile or Tablet Comments Bottom Sheet / Modal */}
      {isCommentsOpen && !isDesktop && (
        <CommentsDrawer
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          reelId={currentReel.id}
          reelCaption={currentReel.caption}
          professionalName={currentReel.professionalName}
          professionalAvatar={currentReel.professionalAvatar}
          isDesktopDrawer={false}
        />
      )}

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        reel={currentReel}
      />

      {/* Repost Experience Dialog */}
      <RepostRequestDialog
        reel={currentReel}
        isOpen={isRepostOpen}
        onClose={() => setIsRepostOpen(false)}
      />
    </div>
  );
};
