import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ReelNavigationProps {
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalReels: number;
}

export const ReelNavigation: React.FC<ReelNavigationProps> = ({
  onNext,
  onPrev,
  currentIndex,
  totalReels,
}) => {
  return (
    <div className="hidden sm:flex flex-col items-center gap-2 select-none shrink-0 py-2">
      {/* Previous Reel Button */}
      <button
        type="button"
        onClick={onPrev}
        className="w-10 h-10 rounded-full bg-surface-card border border-border shadow-xs hover:bg-sand/60 text-charcoal hover:text-wine flex items-center justify-center transition-all active:scale-90"
        title="Previous Reel (Up Arrow / k)"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Reel Index Indicator */}
      <div className="px-2.5 py-1 rounded-full bg-surface-card border border-border text-[11px] font-mono font-bold text-charcoal-muted shadow-2xs">
        {currentIndex + 1} / {totalReels}
      </div>

      {/* Next Reel Button */}
      <button
        type="button"
        onClick={onNext}
        className="w-10 h-10 rounded-full bg-surface-card border border-border shadow-xs hover:bg-sand/60 text-charcoal hover:text-wine flex items-center justify-center transition-all active:scale-90"
        title="Next Reel (Down Arrow / j)"
      >
        <ChevronDown className="w-5 h-5" />
      </button>
    </div>
  );
};
