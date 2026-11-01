import { useState, useRef, useCallback, useEffect } from 'react';

interface UseReelPlaybackOptions {
  onNext: () => void;
  onPrev: () => void;
  onCloseModals?: () => void;
}

export const useReelPlayback = ({ onNext, onPrev, onCloseModals }: UseReelPlaybackOptions) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Default muted initially for reliable browser autoplay compliance
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const triggerDoubleTapLike = useCallback((onLikeCallback: () => void) => {
    onLikeCallback();
    setShowHeartAnim(true);
    setTimeout(() => {
      setShowHeartAnim(false);
    }, 700);
  }, []);

  // Mouse wheel throttling (450ms lockout)
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
          onNext();
        } else {
          onPrev();
        }

        setTimeout(() => {
          isWheelLocked.current = false;
        }, 450);
      }
    },
    [onNext, onPrev]
  );

  // Mobile Touch Swipe Handling
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('.comments-drawer') || target?.closest('[data-scrollable="true"]')) {
        return;
      }
      const diff = touchStartY.current - touchEndY.current;
      if (diff > 50) {
        onNext();
      } else if (diff < -50) {
        onPrev();
      }
    },
    [onNext, onPrev]
  );

  // Keyboard navigation shortcuts
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
        onNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        onPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (onCloseModals) {
          onCloseModals();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onCloseModals]);

  return {
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
  };
};

