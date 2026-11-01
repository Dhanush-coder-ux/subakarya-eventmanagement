import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useReels } from '../hooks/useReels';
import { useReelPlayback } from '../hooks/useReelPlayback';
import { ReelItem } from './ReelItem';
import { ReelActionBar } from './ReelActionBar';
import { ReelNavigation } from './ReelNavigation';
import { CommentsDrawer } from './CommentsDrawer';
import { ShareDialog } from './ShareDialog';
import { RepostDialog } from './RepostDialog';

export const ReelFeed: React.FC = () => {
  const navigate = useNavigate();
  const {
    reels,
    activeReel,
    currentIndex,
    commentsCount,
    goToNext,
    goToPrev,
    toggleLike,
    toggleSave,
    initiateBookingChat,
    currentUser,
  } = useReels();

  // Dialog and Drawer States
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isRepostOpen, setIsRepostOpen] = useState(false);

  // Playback & Gesture management hook
  const {
    isPlaying,
    isMuted,
    showHeartAnim,
    togglePlay,
    toggleMute,
    triggerDoubleTapLike,
    handleWheel,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useReelPlayback({
    onNext: goToNext,
    onPrev: goToPrev,
    onCloseModals: () => {
      setIsCommentsOpen(false);
      setIsShareOpen(false);
      setIsRepostOpen(false);
    },
  });

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

  const handleDoubleTap = () => {
    if (!activeReel) return;
    triggerDoubleTapLike(() => {
      if (!activeReel.isLiked) {
        toggleLike();
      }
    });
  };

  const handleLikeClick = () => {
    if (!activeReel) return;
    if (!activeReel.isLiked) {
      triggerDoubleTapLike(toggleLike);
    } else {
      toggleLike();
    }
  };

  const handleBookNow = () => {
    if (!activeReel) return;
    initiateBookingChat(activeReel.professionalId, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  const handleChat = () => {
    if (!activeReel) return;
    initiateBookingChat(activeReel.professionalId, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  if (!activeReel) {
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
          {/* 1. Main 9:16 Video Player Card */}
          <ReelItem
            reel={activeReel}
            isActive={true}
            isMuted={isMuted}
            isPlaying={isPlaying}
            commentsCount={commentsCount}
            onToggleMute={toggleMute}
            onTogglePlay={togglePlay}
            onLike={handleLikeClick}
            onDoubleTap={handleDoubleTap}
            onOpenComments={() => setIsCommentsOpen((prev) => !prev)}
            onOpenRepost={() => setIsRepostOpen(true)}
            onOpenShare={() => setIsShareOpen(true)}
            onSave={toggleSave}
            onBookNow={handleBookNow}
            onChat={handleChat}
            showHeartAnim={showHeartAnim}
          />

          {/* 2. Desktop Interaction Action Bar (Beside Video) */}
          <div className="hidden sm:flex flex-col items-center shrink-0">
            <ReelActionBar
              reel={activeReel}
              commentsCount={commentsCount}
              isMuted={isMuted}
              onToggleMute={toggleMute}
              onLike={handleLikeClick}
              onOpenComments={() => setIsCommentsOpen((prev) => !prev)}
              onOpenRepost={() => setIsRepostOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
              onSave={toggleSave}
              onBookNow={handleBookNow}
              onChat={handleChat}
              isBesideLayout={true}
            />
          </div>

          {/* 3. Desktop Next / Previous Navigation Controls */}
          <div className="hidden sm:flex flex-col items-center shrink-0">
            <ReelNavigation
              onNext={goToNext}
              onPrev={goToPrev}
              currentIndex={currentIndex}
              totalReels={reels.length}
            />
          </div>

          {/* 4. Desktop Docked Comments Drawer (Instagram Web Style) */}
          {isCommentsOpen && isDesktop && (
            <div className="shrink-0 hidden lg:block">
              <CommentsDrawer
                isOpen={isCommentsOpen}
                onClose={() => setIsCommentsOpen(false)}
                reelId={activeReel.id}
                reelCaption={activeReel.caption}
                professionalName={activeReel.professionalName}
                professionalAvatar={activeReel.professionalAvatar}
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
          reelId={activeReel.id}
          reelCaption={activeReel.caption}
          professionalName={activeReel.professionalName}
          professionalAvatar={activeReel.professionalAvatar}
          isDesktopDrawer={false}
        />
      )}

      {/* Share Dialog */}
      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        reel={activeReel}
      />

      {/* Repost Experience Dialog */}
      <RepostDialog
        reel={activeReel}
        isOpen={isRepostOpen}
        onClose={() => setIsRepostOpen(false)}
      />
    </div>
  );
};

