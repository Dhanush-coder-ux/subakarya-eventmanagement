import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Film,
  Grid,
  Heart,
  Trash2,
  Play,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';

export const SavedContentSection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { posts, reels, toggleSavePost, toggleSaveReel } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');

  const savedPosts = posts.filter((p) => p.isSaved);
  const savedReels = reels.filter((r) => r.isSaved);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold text-charcoal">Saved Posts & Reels</h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          Your personal inspiration moodboard for mandap decor, cinematography, bridal artistry and banquet styles.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-surface-muted rounded-xl border border-border w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'posts'
              ? 'bg-wine text-white shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Saved Posts ({savedPosts.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'reels'
              ? 'bg-wine text-white shadow-xs'
              : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Saved Reels ({savedReels.length})</span>
        </button>
      </div>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        <div>
          {savedPosts.length === 0 ? (
            <div className="bg-surface-card rounded-2xl border border-border p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand text-wine flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-charcoal">No Saved Posts</h4>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Bookmark posts from the home discovery feed to build your wedding vision board.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-charcoal border border-border cursor-pointer shadow-card"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavePost(post.id, currentUser.id);
                        }}
                        className="p-1.5 rounded-full bg-charcoal/80 hover:bg-error transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold truncate">{post.professionalName}</p>
                      <p className="text-[11px] line-clamp-2 text-white/90">{post.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reels Grid */}
      {activeTab === 'reels' && (
        <div>
          {savedReels.length === 0 ? (
            <div className="bg-surface-card rounded-2xl border border-border p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-sand text-wine flex items-center justify-center mx-auto">
                <Film className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-charcoal">No Saved Reels</h4>
              <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
                Tap the bookmark button while watching reels to save trending wedding moments.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {savedReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => navigate('/reels')}
                  className="group relative aspect-[9/14] rounded-xl overflow-hidden bg-charcoal border border-border cursor-pointer shadow-card"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
                    <div className="flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveReel(reel.id, currentUser.id);
                        }}
                        className="p-1.5 rounded-full bg-charcoal/80 hover:bg-error transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span className="text-xs font-bold truncate">{reel.professionalName}</span>
                      </div>
                      <p className="text-[11px] line-clamp-2 text-white/90">{reel.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

