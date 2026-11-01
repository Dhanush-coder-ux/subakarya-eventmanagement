import React from 'react';
import { Heart } from 'lucide-react';

interface DoubleTapLikeProps {
  show: boolean;
}

export const DoubleTapLike: React.FC<DoubleTapLikeProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 select-none">
      <div className="animate-in zoom-in-50 fade-out-50 duration-700 ease-out">
        <Heart className="w-24 h-24 fill-white text-white drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] opacity-95 animate-pulse" />
      </div>
    </div>
  );
};

