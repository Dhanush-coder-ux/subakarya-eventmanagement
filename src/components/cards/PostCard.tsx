import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Post } from '../../types';
import { useMarketplaceStore } from '../../store/useMarketplaceStore';
import { useAuthStore } from '../../store/useAuthStore';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { toggleLikePost, toggleSavePost, initiateBookingChat } = useMarketplaceStore();
  const { currentUser } = useAuthStore();
  const [showHeartAnim, setShowHeartAnim] = useState(false);

  const handleBookNow = () => {
    initiateBookingChat(post.professionalId, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      toggleLikePost(post.id);
    }
    setShowHeartAnim(true);
    setTimeout(() => setShowHeartAnim(false), 800);
  };

  const handleHashtagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanTag = tag.replace(/^#/, '');
    navigate(`/search?tag=${encodeURIComponent(cleanTag)}`);
  };

  return (
    <article className="bg-surface-card border-b sm:border border-border sm:rounded-2xl shadow-subtle overflow-hidden max-w-[480px] sm:max-w-[500px] mx-auto mb-4 transition-all">
      {/* 1. Header: Avatar + Username + Location + More */}
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <Link
            to={`/profile/${post.professionalId}`}
            className="p-[1.5px] rounded-full bg-gradient-to-tr from-sand-dark via-wine to-wine-dark"
          >
            <img
              src={post.professionalAvatar}
              alt={post.professionalName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-surface"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/profile/${post.professionalId}`}
                className="text-xs font-bold text-charcoal hover:underline leading-none"
              >
                {post.professionalName}
              </Link>
              <span className="text-[11px] text-charcoal-muted font-normal">• 1d</span>
            </div>
            <span className="text-[11px] text-charcoal-muted leading-tight mt-0.5 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-wine" />
              <span>{post.location}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookNow}
            className="px-3 py-1 rounded-full bg-wine hover:bg-wine-dark text-white text-[11px] font-bold tracking-tight shadow-xs active:scale-95 transition-all"
          >
            Book Now
          </button>
          <button
            onClick={handleBookNow}
            className="text-charcoal-muted hover:text-charcoal p-1"
            title="Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Media: Square / 4:5 Photo with Double-Tap Heart */}
      <div
        onDoubleClick={handleDoubleTap}
        className="relative aspect-square sm:aspect-[4/3] bg-sand/30 overflow-hidden cursor-pointer select-none"
      >
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Floating Heart Animation on Double Tap */}
        {showHeartAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out-50 duration-500">
            <Heart className="w-24 h-24 fill-white text-white drop-shadow-elevated opacity-90" />
          </div>
        )}

        <div className="absolute top-2.5 right-2.5 bg-charcoal/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-semibold text-white tracking-wide">
          {post.category}
        </div>
      </div>

      {/* 3. Instagram Action Buttons Bar */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLikePost(post.id)}
              className="text-charcoal hover:opacity-70 transition-transform active:scale-125"
              aria-label="Like post"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  post.isLiked ? 'fill-wine text-wine' : 'stroke-[1.8px] text-charcoal'
                }`}
              />
            </button>

            <button
              onClick={handleBookNow}
              className="text-charcoal hover:opacity-70 transition-transform active:scale-110"
              title="Message / Enquire"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.8px]" />
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.professionalName,
                    text: post.caption,
                    url: window.location.href,
                  }).catch(() => {});
                }
              }}
              className="text-charcoal hover:opacity-70 transition-transform active:scale-110"
              title="Share post"
            >
              <Send className="w-6 h-6 stroke-[1.8px]" />
            </button>
          </div>

          <button
            onClick={() => toggleSavePost(post.id, currentUser.id)}
            className="text-charcoal hover:opacity-70 transition-transform active:scale-125"
            aria-label="Save post"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                post.isSaved ? 'fill-charcoal text-charcoal' : 'stroke-[1.8px] text-charcoal'
              }`}
            />
          </button>
        </div>

        {/* 4. Likes Count */}
        <div className="mt-2.5">
          <p className="text-xs font-bold text-charcoal">
            {post.likesCount.toLocaleString()} likes
          </p>
        </div>

        {/* 5. Caption with Bold Username */}
        <div className="mt-1 text-xs text-charcoal leading-relaxed">
          <Link
            to={`/profile/${post.professionalId}`}
            className="font-bold mr-1.5 hover:underline"
          >
            {post.professionalName}
          </Link>
          <span>{post.caption}</span>
        </div>

        {/* 6. Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {post.hashtags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleHashtagClick(tag, e)}
                className="text-[11px] font-medium text-wine hover:underline"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </button>
            ))}
          </div>
        )}

        {/* 7. Action CTA Button (Instagram Business Bar) */}
        <button
          onClick={handleBookNow}
          className="mt-3 w-full py-2 px-3 rounded-xl bg-sand/50 hover:bg-sand border border-sand-dark text-xs font-bold text-charcoal flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-wine" />
            <span>Enquire or Request Custom Quote</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-wine" />
        </button>

        {/* 8. Timestamp */}
        <div className="mt-2">
          <span className="text-[10px] uppercase font-semibold text-charcoal-light tracking-wider">
            Verified Event Service
          </span>
        </div>
      </div>
    </article>
  );
};
