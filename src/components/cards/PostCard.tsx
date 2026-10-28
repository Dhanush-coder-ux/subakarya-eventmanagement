import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Bookmark, Share2, MapPin, Calendar, ArrowUpRight } from 'lucide-react';
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

  const handleBookNow = () => {
    initiateBookingChat(post.professionalId, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  const handleHashtagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanTag = tag.replace(/^#/, '');
    navigate(`/search?tag=${encodeURIComponent(cleanTag)}`);
  };

  return (
    <article className="bg-surface-card rounded-2xl border border-border shadow-card overflow-hidden transition-all duration-200 hover:border-wine/30">
      {/* Header: Professional Details */}
      <div className="p-4 flex items-center justify-between">
        <Link
          to={`/profile/${post.professionalId}`}
          className="flex items-center gap-3 group"
        >
          <img
            src={post.professionalAvatar}
            alt={post.professionalName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-wine/60 transition-all"
          />
          <div>
            <h4 className="text-sm font-semibold text-charcoal group-hover:text-wine transition-colors flex items-center gap-1.5">
              {post.professionalName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-charcoal-muted">
              <span>{post.category}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-wine" />
                {post.location}
              </span>
            </div>
          </div>
        </Link>

        {/* Top Book Now Action */}
        <button
          onClick={handleBookNow}
          className="px-3.5 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold tracking-wide transition-all duration-150 shadow-xs flex items-center gap-1.5 active:scale-95"
        >
          <span>Book Now</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Media Image */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-sand/30 overflow-hidden">
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-charcoal/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1">
          <Calendar className="w-3 h-3 text-sand" />
          <span>Verified Work</span>
        </div>
      </div>

      {/* Interactive Actions & Counters */}
      <div className="p-4 pt-3.5">
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLikePost(post.id)}
              className="flex items-center gap-1.5 text-xs font-medium text-charcoal hover:text-wine transition-colors active:scale-125"
              aria-label="Like post"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  post.isLiked
                    ? 'fill-wine text-wine'
                    : 'text-charcoal-muted hover:text-wine'
                }`}
              />
              <span className="font-semibold">{post.likesCount}</span>
            </button>

            <button
              onClick={() => toggleSavePost(post.id, currentUser.id)}
              className="flex items-center gap-1.5 text-xs font-medium text-charcoal hover:text-wine transition-colors active:scale-125"
              aria-label="Save post"
            >
              <Bookmark
                className={`w-5 h-5 transition-colors ${
                  post.isSaved
                    ? 'fill-wine text-wine'
                    : 'text-charcoal-muted hover:text-wine'
                }`}
              />
              <span className="font-semibold">{post.savesCount}</span>
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
              className="text-charcoal-muted hover:text-charcoal transition-colors"
              title="Share post"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <Link
            to={`/profile/${post.professionalId}`}
            className="text-xs font-medium text-wine hover:text-wine-dark hover:underline flex items-center gap-1"
          >
            <span>View Profile & Rates</span>
          </Link>
        </div>

        {/* Caption */}
        <p className="mt-3 text-xs sm:text-sm text-charcoal leading-relaxed">
          <Link
            to={`/profile/${post.professionalId}`}
            className="font-bold mr-1.5 hover:text-wine"
          >
            {post.professionalName}
          </Link>
          {post.caption}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {post.hashtags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => handleHashtagClick(tag, e)}
                className="text-[11px] font-medium text-wine/80 hover:text-wine hover:underline transition-colors"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
