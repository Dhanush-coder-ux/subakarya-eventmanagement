import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Music, Plus, Check } from 'lucide-react';
import { Reel } from '../types/reel.types';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

interface ReelInformationProps {
  reel: Reel;
}

export const ReelInformation: React.FC<ReelInformationProps> = ({ reel }) => {
  const navigate = useNavigate();
  const { toggleFollowProfessional } = useMarketplaceStore();
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowProfessional(reel.professionalId);
  };

  const handleHashtagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = tag.replace(/^#/, '');
    navigate(`/search?tag=${encodeURIComponent(clean)}`);
  };

  return (
    <div className="space-y-2 text-white pointer-events-auto">
      {/* 1. Creator Profile & Follow Button */}
      <div className="flex items-center gap-2.5">
        <Link
          to={`/profile/${reel.professionalId}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-2 group shrink-0"
        >
          <div className="p-[1.5px] rounded-full bg-gradient-to-tr from-sand-dark via-wine to-sand group-hover:scale-105 transition-transform">
            <img
              src={reel.professionalAvatar}
              alt={reel.professionalName}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-charcoal"
            />
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-sand transition-colors truncate max-w-[140px] sm:max-w-[170px]">
              {reel.professionalName}
            </h4>
            <CheckCircle2 className="w-3.5 h-3.5 text-wine fill-sand shrink-0" />
          </div>
        </Link>

        {/* Follow / Following Button */}
        <button
          type="button"
          onClick={handleFollowClick}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 active:scale-95 ${
            reel.isFollowing
              ? 'bg-charcoal/60 backdrop-blur-md text-white/90 border border-white/30 hover:bg-charcoal/80'
              : 'bg-white hover:bg-sand text-charcoal border border-white/40 shadow-xs'
          }`}
        >
          {reel.isFollowing ? (
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-sand" />
              <span>Following</span>
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Plus className="w-3 h-3 text-charcoal" />
              <span>Follow</span>
            </span>
          )}
        </button>
      </div>

      {/* 2. Reel Caption */}
      <div className="text-xs text-white/95 leading-relaxed">
        <p className={isCaptionExpanded ? '' : 'line-clamp-2'}>
          {reel.caption}
        </p>
        {reel.caption.length > 70 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsCaptionExpanded(!isCaptionExpanded);
            }}
            className="text-[11px] text-sand font-semibold hover:underline mt-0.5 inline-block"
          >
            {isCaptionExpanded ? 'less' : '...more'}
          </button>
        )}
      </div>

      {/* 3. Hashtags */}
      {reel.hashtags && reel.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1 text-[11px]">
          {reel.hashtags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => handleHashtagClick(tag, e)}
              className="font-medium text-sand/90 hover:text-white hover:underline transition-colors"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </button>
          ))}
        </div>
      )}

      {/* 4. Audio Track Marquee Pill */}
      {reel.audioTrack && (
        <div className="flex items-center gap-1.5 text-[10px] text-white/85 bg-charcoal/50 backdrop-blur-xs px-2.5 py-1 rounded-full w-fit max-w-[240px] border border-white/10">
          <Music className="w-3 h-3 text-sand shrink-0 animate-pulse" />
          <span className="truncate">{reel.audioTrack}</span>
        </div>
      )}
    </div>
  );
};

