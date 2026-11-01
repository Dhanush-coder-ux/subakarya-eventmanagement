import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Repeat2,
  Eye,
  Trash2,
  ExternalLink,
  Film,
  Grid,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { ActivityType, UserActivity } from '../../../types';
import { formatDate } from '../../../utils';

export const YourActivitySection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, accountType } = useAuthStore();
  const {
    activities,
    posts,
    reels,
    reposts,
    removeActivity,
    toggleLikePost,
    toggleLikeReel,
    toggleSavePost,
    toggleSaveReel,
    removeRepostByCustomer,
  } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<ActivityType>('like');

  // Filter activities for this user
  const userActivities = activities.filter((a) => a.userId === currentUser.id);

  const likesList = userActivities.filter((a) => a.activityType === 'like');
  const commentsList = userActivities.filter((a) => a.activityType === 'comment');
  const savedList = userActivities.filter((a) => a.activityType === 'saved');
  const repostsList = userActivities.filter((a) => a.activityType === 'repost');
  const viewedList = userActivities.filter((a) => a.activityType === 'viewed');

  const currentTabItems = userActivities.filter((a) => a.activityType === activeTab);

  const handleUnlike = (item: UserActivity) => {
    if (item.referenceType === 'post') {
      toggleLikePost(item.referenceId);
    } else if (item.referenceType === 'reel') {
      toggleLikeReel(item.referenceId);
    }
    removeActivity(item.id);
  };

  const handleRemoveSaved = (item: UserActivity) => {
    if (item.referenceType === 'post') {
      toggleSavePost(item.referenceId);
    } else if (item.referenceType === 'reel') {
      toggleSaveReel(item.referenceId);
    }
    removeActivity(item.id);
  };

  const handleOpenItem = (item: UserActivity) => {
    if (item.referenceType === 'reel') {
      navigate('/reels');
    } else if (item.referenceType === 'repost') {
      navigate(`/profile/${currentUser.id}`);
    } else {
      navigate('/search');
    }
  };

  const tabs: { type: ActivityType; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    { type: 'like', label: 'Likes', icon: Heart, count: likesList.length },
    { type: 'comment', label: 'Comments', icon: MessageSquare, count: commentsList.length },
    { type: 'saved', label: 'Saved', icon: Bookmark, count: savedList.length },
    { type: 'repost', label: 'Reposts', icon: Repeat2, count: repostsList.length },
    { type: 'viewed', label: 'Recently Viewed', icon: Eye, count: viewedList.length },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-charcoal">Your Activity</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Review and manage your interactions, saved event ideas, client comments, and published reposts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-xl border border-border overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.type;
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() => setActiveTab(tab.type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-sand text-charcoal'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content list */}
      {currentTabItems.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-border p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sand text-wine flex items-center justify-center mx-auto">
            {activeTab === 'like' && <Heart className="w-6 h-6" />}
            {activeTab === 'comment' && <MessageSquare className="w-6 h-6" />}
            {activeTab === 'saved' && <Bookmark className="w-6 h-6" />}
            {activeTab === 'repost' && <Repeat2 className="w-6 h-6" />}
            {activeTab === 'viewed' && <Eye className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-charcoal">No {activeTab} activity yet</h4>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              {activeTab === 'like' && 'When you like posts and reels across the marketplace, they appear here.'}
              {activeTab === 'comment' && 'Your questions and inquiries on vendor content will be tracked here.'}
              {activeTab === 'saved' && 'Save reels and decor inspiration for quick access anytime.'}
              {activeTab === 'repost' && 'Approved reels that you share on your personal profile will be listed here.'}
              {activeTab === 'viewed' && 'Posts and reels you browse will appear in this history stream.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-surface-card">
          {currentTabItems.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between gap-3 hover:bg-sand/15 transition-colors group"
            >
              {/* Media Thumbnail & Meta */}
              <div
                onClick={() => handleOpenItem(item)}
                className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-charcoal overflow-hidden border border-border shrink-0">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sand">
                      <Film className="w-5 h-5" />
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 text-[9px] uppercase px-1 py-0.2 rounded bg-charcoal/80 text-sand font-bold">
                    {item.referenceType}
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <h5 className="font-bold text-xs sm:text-sm text-charcoal truncate group-hover:text-wine transition-colors">
                    {item.title}
                  </h5>

                  {item.professionalName && (
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
                      <span>By</span>
                      <Link
                        to={`/profile/${item.professionalId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-charcoal hover:text-wine hover:underline truncate"
                      >
                        {item.professionalName}
                      </Link>
                    </div>
                  )}

                  {item.commentText && (
                    <p className="text-xs text-charcoal bg-sand/30 p-2 rounded-lg italic line-clamp-1 border border-sand-dark">
                      &quot;{item.commentText}&quot;
                    </p>
                  )}

                  <p className="text-[10px] text-charcoal-muted flex items-center gap-1">
                    <Clock className="w-3 h-3 text-wine" />
                    <span>{formatDate(item.createdAt)}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {activeTab === 'like' && (
                  <button
                    onClick={() => handleUnlike(item)}
                    className="p-2 rounded-lg border border-border hover:bg-error-light hover:text-error text-xs font-semibold text-charcoal transition-colors flex items-center gap-1"
                    title="Unlike"
                  >
                    <Heart className="w-4 h-4 fill-error text-error" />
                    <span className="hidden sm:inline">Unlike</span>
                  </button>
                )}

                {activeTab === 'saved' && (
                  <button
                    onClick={() => handleRemoveSaved(item)}
                    className="p-2 rounded-lg border border-border hover:bg-error-light hover:text-error text-xs font-semibold text-charcoal transition-colors flex items-center gap-1"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                )}

                {activeTab === 'repost' && (
                  <button
                    onClick={() => navigate(`/profile/${currentUser.id}`)}
                    className="p-2 rounded-lg border border-border hover:bg-sand/40 text-xs font-semibold text-charcoal transition-colors flex items-center gap-1"
                    title="View on profile"
                  >
                    <ExternalLink className="w-4 h-4 text-wine" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                )}

                <button
                  onClick={() => handleOpenItem(item)}
                  className="p-2 rounded-lg hover:bg-sand/30 text-charcoal-muted hover:text-charcoal transition-colors"
                  title="Open details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

