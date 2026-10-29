import React, { useState } from 'react';
import {
  Plus,
  Image as ImageIcon,
  Film,
  Briefcase,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
  Eye,
  X,
  UploadCloud,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { ServiceCategory, Post, Reel, WorkSample } from '../types';
import { formatDate } from '../utils';

export const PortfolioPage: React.FC = () => {
  const { currentUser } = useAuthStore();
  const {
    posts,
    reels,
    works,
    createPost,
    deletePost,
    createReel,
    deleteReel,
    createWork,
    deleteWork,
  } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'works'>('posts');
  const [modalType, setModalType] = useState<'post' | 'reel' | 'work' | null>(null);

  // Post form state
  const [postCaption, setPostCaption] = useState('');
  const [postHashtags, setPostHashtags] = useState('#WeddingPhotography, #RoyalWedding');
  const [postCategory, setPostCategory] = useState<ServiceCategory>('Photographer & Videographer');
  const [postLocation, setPostLocation] = useState(currentUser.location || 'Madurai, Tamil Nadu');
  const [postMediaUrl, setPostMediaUrl] = useState(
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85'
  );

  // Reel form state
  const [reelCaption, setReelCaption] = useState('');
  const [reelHashtags, setReelHashtags] = useState('#WeddingReel, #CinematicWedding');
  const [reelAudio, setReelAudio] = useState('Original Audio • Live Shehnai');
  const [reelMediaUrl, setReelMediaUrl] = useState(
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=85'
  );

  // Work sample form state
  const [workTitle, setWorkTitle] = useState('');
  const [workEventType, setWorkEventType] = useState('Heritage Palace Wedding');
  const [workDate, setWorkDate] = useState('2026-10-15');
  const [workLocation, setWorkLocation] = useState('Madurai, Tamil Nadu');
  const [workDescription, setWorkDescription] = useState('');
  const [workServices, setWorkServices] = useState('Photography, Drone Cinematography');
  const [workGalleryUrl, setWorkGalleryUrl] = useState(
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
  );

  const proPosts = posts.filter((p) => p.professionalId === currentUser.id);
  const proReels = reels.filter((r) => r.professionalId === currentUser.id);
  const proWorks = works.filter((w) => w.professionalId === currentUser.id);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postCaption.trim()) return;

    createPost({
      professionalId: currentUser.id,
      professionalName: 'businessName' in currentUser ? currentUser.businessName : currentUser.name,
      professionalAvatar: currentUser.avatar,
      category: postCategory,
      location: postLocation,
      mediaUrl: postMediaUrl,
      caption: postCaption,
      hashtags: postHashtags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setModalType(null);
    setPostCaption('');
  };

  const handleCreateReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelCaption.trim()) return;

    createReel({
      professionalId: currentUser.id,
      professionalName: 'businessName' in currentUser ? currentUser.businessName : currentUser.name,
      professionalAvatar: currentUser.avatar,
      category: postCategory,
      location: postLocation,
      videoUrl: reelMediaUrl,
      thumbnailUrl: reelMediaUrl,
      audioTrack: reelAudio,
      caption: reelCaption,
      hashtags: reelHashtags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setModalType(null);
    setReelCaption('');
  };

  const handleCreateWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim()) return;

    createWork({
      professionalId: currentUser.id,
      title: workTitle,
      eventType: workEventType,
      eventDate: workDate,
      location: workLocation,
      description: workDescription,
      galleryUrls: [workGalleryUrl],
      servicesDelivered: workServices.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setModalType(null);
    setWorkTitle('');
    setWorkDescription('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
            Portfolio & Discovery Content
          </span>
          <h1 className="font-bold text-2xl sm:text-3xl font-bold text-charcoal mt-1">
            Media & Work Showcases
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Publish photo posts, cinematic reels, and project case studies that appear on customer discovery feeds
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 shrink-0">
          <button
            onClick={() => setModalType('post')}
            className="px-3.5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Post</span>
          </button>
          <button
            onClick={() => setModalType('reel')}
            className="px-3.5 py-2 rounded-xl border border-border hover:bg-sand/30 text-charcoal text-xs font-bold flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5 text-wine" />
            <span>New Reel</span>
          </button>
          <button
            onClick={() => setModalType('work')}
            className="px-3.5 py-2 rounded-xl border border-border hover:bg-sand/30 text-charcoal text-xs font-bold flex items-center gap-1.5"
          >
            <Briefcase className="w-3.5 h-3.5 text-wine" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-border overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'posts' ? 'border-wine text-wine' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Posts ({proPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'reels' ? 'border-wine text-wine' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({proReels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('works')}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'works' ? 'border-wine text-wine' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Our Works ({proWorks.length})</span>
        </button>
      </div>

      {/* Posts Section */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {proPosts.map((post) => (
            <div key={post.id} className="bg-surface-card rounded-2xl border border-border overflow-hidden shadow-card">
              <div className="aspect-[4/3] bg-sand/30 overflow-hidden">
                <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-charcoal line-clamp-2">{post.caption}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.hashtags.map((tag) => (
                    <span key={tag} className="text-[10px] text-wine font-medium">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-charcoal-muted">
                  <span>{post.likesCount} likes</span>
                  <button onClick={() => deletePost(post.id)} className="text-error hover:underline flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5 icon-hover-base hover:scale-115 hover:rotate-12 text-error transition-transform" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reels Section */}
      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {proReels.map((reel) => (
            <div key={reel.id} className="bg-charcoal rounded-2xl overflow-hidden aspect-[9/16] relative shadow-card group">
              <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                <p className="text-xs line-clamp-2">{reel.caption}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-sand">
                  <span>{reel.likesCount} likes</span>
                  <button onClick={() => deleteReel(reel.id)} className="text-error hover:text-white">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Works Section */}
      {activeTab === 'works' && (
        <div className="space-y-4">
          {proWorks.map((work) => (
            <div key={work.id} className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-wine tracking-wider bg-sand px-2 py-0.5 rounded">
                    {work.eventType}
                  </span>
                  <h3 className="font-bold text-base text-charcoal mt-1">{work.title}</h3>
                  <span className="text-xs text-charcoal-muted">{work.location} • {formatDate(work.eventDate)}</span>
                </div>
                <button onClick={() => deleteWork(work.id)} className="text-charcoal-light hover:text-error p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-charcoal leading-relaxed">{work.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {work.galleryUrls.map((url, i) => (
                  <div key={i} className="aspect-video rounded-lg overflow-hidden bg-sand/30 border border-border">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Creation Modal */}
      {modalType === 'post' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-sm text-charcoal">Publish Discovery Post</h3>
              <button onClick={() => setModalType(null)}><X className="w-4 h-4 text-charcoal-muted" /></button>
            </div>
            <form onSubmit={handleCreatePost} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Image URL</label>
                <input
                  type="text"
                  required
                  value={postMediaUrl}
                  onChange={(e) => setPostMediaUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Caption</label>
                <textarea
                  rows={3}
                  required
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  placeholder="Share details of the decor, lighting, or wedding moments..."
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Hashtags (Comma separated)</label>
                <input
                  type="text"
                  value={postHashtags}
                  onChange={(e) => setPostHashtags(e.target.value)}
                  placeholder="#WeddingPhotography, #MaduraiCatering"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-border text-charcoal">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-wine text-white font-bold hover:bg-wine-dark">Publish Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reel Creation Modal */}
      {modalType === 'reel' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-sm text-charcoal">Publish Vertical Reel</h3>
              <button onClick={() => setModalType(null)}><X className="w-4 h-4 text-charcoal-muted" /></button>
            </div>
            <form onSubmit={handleCreateReel} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Media / Video URL</label>
                <input
                  type="text"
                  required
                  value={reelMediaUrl}
                  onChange={(e) => setReelMediaUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Audio Track Name</label>
                <input
                  type="text"
                  value={reelAudio}
                  onChange={(e) => setReelAudio(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Caption & Hashtags</label>
                <textarea
                  rows={2}
                  required
                  value={reelCaption}
                  onChange={(e) => setReelCaption(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-border text-charcoal">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-wine text-white font-bold hover:bg-wine-dark">Publish Reel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work Sample Modal */}
      {modalType === 'work' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-2xl border border-border shadow-elevated w-full max-w-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-sm text-charcoal">Add Completed Project (Our Works)</h3>
              <button onClick={() => setModalType(null)}><X className="w-4 h-4 text-charcoal-muted" /></button>
            </div>
            <form onSubmit={handleCreateWork} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  placeholder="e.g. The Chettiar Royal Wedding"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Event Type</label>
                  <input
                    type="text"
                    value={workEventType}
                    onChange={(e) => setWorkEventType(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="font-semibold text-charcoal block mb-1">Date</label>
                  <input
                    type="date"
                    value={workDate}
                    onChange={(e) => setWorkDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Gallery Image URL</label>
                <input
                  type="text"
                  value={workGalleryUrl}
                  onChange={(e) => setWorkGalleryUrl(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Services Delivered (Comma separated)</label>
                <input
                  type="text"
                  value={workServices}
                  onChange={(e) => setWorkServices(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div>
                <label className="font-semibold text-charcoal block mb-1">Project Narrative</label>
                <textarea
                  rows={2}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-border text-charcoal">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-wine text-white font-bold hover:bg-wine-dark">Publish Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

