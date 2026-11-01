import React from 'react';
import { Heart } from 'lucide-react';

interface DoubleTapLikeAnimationProps {
  show: boolean;
}

export const DoubleTapLikeAnimation: React.FC<DoubleTapLikeAnimationProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
      <div className="relative animate-in zoom-in-50 fade-out-50 duration-700 ease-out">
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-full bg-wine/20 blur-xl scale-150 pointer-events-none" />
        
        {/* Animated Heart */}
        <Heart className="w-24 h-24 sm:w-28 sm:h-28 fill-white text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform active:scale-95 transition-transform" />
      </div>
    </div>
  );
};

