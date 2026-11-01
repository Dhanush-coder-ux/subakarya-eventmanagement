import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Repeat2,
  Star,
  Play,
  Trash2,
  ExternalLink,
  MessageCircle,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';
import { Repost, Reel } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { formatDate } from '../../utils';

interface RepostCardProps {
  repost: Repost;
  isOwner?: boolean;
}

export const RepostCard: React.FC<RepostCardProps> = ({ repost, isOwner = false }) => {
  const navigate = useNavigate();
  const { reels, removeRepostByCustomer } = useMarketplaceStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Retrieve original referenced reel
  const originalReel: Reel | undefined = reels.find((r) => r.id === repost.originalReelId);

  const handleOpenReel = () => {
    navigate('/reels');
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this reposted reel from your profile?')) {
      setIsRemoving(true);
      removeRepostByCustomer(repost.id);
    }
  };

  if (isRemoving || repost.status !== 'PUBLISHED') {
    return null;
  }

  const mediaThumbnail = originalReel?.thumbnailUrl || originalReel?.videoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85';

  return (
    <div className="bg-surface-card rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group">
      {/* Media Aspect Banner with Overlay Attribution */}
      <div
        onClick={handleOpenReel}
        className="relative aspect-[9/14] bg-charcoal cursor-pointer overflow-hidden group/media"
      >
        <img
          src={mediaThumbnail}
          alt={originalReel?.caption || 'Original reel'}
          className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300"
        />

        {/* Gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-charcoal/60 pointer-events-none" />

        {/* Top Repost Attribution Pill */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <Link
            to={`/profile/${repost.professionalId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-charcoal/70 backdrop-blur-md text-white border border-white/20 hover:bg-wine/80 transition-colors text-xs font-semibold max-w-[85%]"
          >
            <Repeat2 className="w-3.5 h-3.5 text-sand shrink-0" />
            <span className="truncate">@{repost.professionalName}</span>
          </Link>

          {isOwner && (
            <button
              onClick={handleRemove}
              className="p-1.5 rounded-full bg-charcoal/70 backdrop-blur-md text-white/80 hover:text-error hover:bg-charcoal transition-colors"
              title="Remove from profile"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center Play Indicator */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 group-hover/media:opacity-100 transition-opacity">
          <div className="w-11 h-11 rounded-full bg-charcoal/60 backdrop-blur-md text-sand flex items-center justify-center border border-white/20 shadow-elevated">
            <Play className="w-5 h-5 fill-sand ml-0.5" />
          </div>
        </div>

        {/* Bottom Original Creator Attribution */}
        <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
          <p className="text-[10px] uppercase font-bold tracking-wider text-sand/90">
            Original Creator
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <img
              src={repost.professionalAvatar}
              alt={repost.professionalName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white/50"
            />
            <span className="text-xs font-bold text-white truncate drop-shadow">
              {repost.professionalName}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Review & Experience Details */}
      <div className="p-4 space-y-2.5 bg-surface-card flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Header Tagline & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider uppercase text-wine bg-sand/60 px-2 py-0.5 rounded-md">
              Verified Experience
            </span>

            {repost.rating && (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${
                      s <= (repost.rating || 5) ? 'fill-wine text-wine' : 'text-border'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Customer Quote */}
          <p className="text-xs text-charcoal leading-relaxed line-clamp-3 italic">
            &quot;{repost.experienceText}&quot;
          </p>

          {/* Additional Photos from Customer */}
          {repost.additionalMedia && repost.additionalMedia.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {repost.additionalMedia.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Customer event photo"
                  className="w-9 h-9 rounded-lg object-cover border border-border"
                />
              ))}
              <span className="text-[10px] text-charcoal-muted">Event Photos</span>
            </div>
          )}
        </div>

        {/* Footer attribution: Experience shared by @customer */}
        <div className="pt-2 border-t border-border/80 flex items-center justify-between text-[11px] text-charcoal-muted">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={repost.customerAvatar}
              alt={repost.customerName}
              className="w-4 h-4 rounded-full object-cover shrink-0"
            />
            <span className="truncate">
              Shared by <strong className="text-charcoal font-semibold">{repost.customerName}</strong>
            </span>
          </div>
          <span className="text-[10px] shrink-0">
            {formatDate(repost.publishedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

