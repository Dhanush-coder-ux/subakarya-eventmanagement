import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Grid,
  Film,
  Briefcase,
  UserCheck,
  UserPlus,
  MessageCircle,
  Share2,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Heart,
  Play,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { WorkSample } from '../types';
import { formatDate, formatINR } from '../utils';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentUser, allProfessionals, allCustomers, updateProfessionalProfile } = useAuthStore();
  const { posts, reels, works, deletePost, deleteReel, deleteWork, initiateBookingChat } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'works'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Resolve user
  const targetId = id || currentUser.id;
  const professional = allProfessionals.find((p) => p.id === targetId);
  const customer = allCustomers.find((c) => c.id === targetId);
  const isOwner = currentUser.id === targetId;

  // Filter content
  const userPosts = posts.filter((p) => p.professionalId === targetId);
  const userReels = reels.filter((r) => r.professionalId === targetId);
  const userWorks = works.filter((w) => w.professionalId === targetId);

  const followersCount = (professional?.followersCount || 120) + (isFollowing ? 1 : 0);
  const postsCount = userPosts.length;
  const worksCount = userWorks.length;

  const [editBio, setEditBio] = useState(professional?.description || '');
  const [editCoverage, setEditCoverage] = useState(professional?.coverageArea || '');

  // Instagram Story Highlights Mock
  const storyHighlights = [
    { title: 'Weddings', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80' },
    { title: 'Films', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80' },
    { title: 'Mandap', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80' },
    { title: 'Albums', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80' },
    { title: 'Reviews', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  ];

  const handleBookNow = () => {
    if (!professional) return;
    initiateBookingChat(professional.id, {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar,
      phone: currentUser.phone,
    });
    navigate('/chat');
  };

  const handleSaveProfile = () => {
    if (professional) {
      updateProfessionalProfile({
        description: editBio,
        coverageArea: editCoverage,
      });
      setShowEditModal(false);
    }
  };

  return (
    <div className="max-w-[935px] mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* 1. Instagram Profile Header */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-16 pb-4 sm:pb-8 border-b border-border">
        {/* Left Circular Avatar with Gradient Ring */}
        <div className="flex-shrink-0">
          <div className="p-1 rounded-full bg-gradient-to-tr from-sand-dark via-wine to-wine-dark">
            <img
              src={professional?.avatar || customer?.avatar}
              alt={professional?.businessName || customer?.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-surface"
            />
          </div>
        </div>

        {/* Right Info Section */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Top Row: Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            <h1 className="text-xl sm:text-2xl font-bold text-charcoal flex items-center justify-center sm:justify-start gap-2">
              <span>{professional ? professional.businessName : customer?.name}</span>
              {professional?.isVerified && (
                <span title="Verified Professional"><CheckCircle2 className="w-5 h-5 text-wine fill-sand flex-shrink-0" /></span>
              )}
            </h1>

            <div className="flex items-center justify-center gap-2">
              {!isOwner ? (
                <>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isFollowing
                        ? 'bg-sand text-charcoal border border-sand-dark'
                        : 'bg-wine hover:bg-wine-dark text-white'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={handleBookNow}
                    className="px-4 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
                  >
                    Message
                  </button>

                  <button
                    onClick={handleBookNow}
                    className="px-4 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-bold shadow-xs active:scale-95"
                  >
                    Book Now
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
                  >
                    Edit Profile
                  </button>

                  <Link
                    to="/services"
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
                  >
                    Services
                  </Link>

                  <Link
                    to="/settings"
                    className="p-1.5 rounded-lg border border-border hover:bg-sand/30 text-charcoal"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Middle Row: Instagram Stats (Posts, Followers, Works) */}
          <div className="flex items-center justify-center sm:justify-start gap-8 text-sm">
            <div>
              <span className="font-bold text-charcoal">{postsCount} </span>
              <span className="text-charcoal-muted">posts</span>
            </div>
            <div>
              <span className="font-bold text-charcoal">{followersCount.toLocaleString()} </span>
              <span className="text-charcoal-muted">followers</span>
            </div>
            <div>
              <span className="font-bold text-wine">{worksCount} </span>
              <span className="text-charcoal-muted">works</span>
            </div>
          </div>

          {/* Bottom Row: Name, Category, Bio, Location */}
          <div className="text-xs sm:text-sm space-y-1">
            <span className="font-bold text-charcoal block">
              {professional ? professional.name : customer?.name}
            </span>
            {professional && (
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-sand text-charcoal border border-sand-dark">
                {professional.category}
              </span>
            )}
            <p className="text-xs text-charcoal leading-relaxed max-w-lg mt-1">
              {professional ? professional.description : 'Event Enthusiast & Host'}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-charcoal-muted pt-1">
              <MapPin className="w-3.5 h-3.5 text-wine" />
              <span>{professional ? professional.location : customer?.location}</span>
            </div>

            {/* Profile Completeness for Owner only */}
            {isOwner && professional && (
              <div className="pt-2">
                <div className="p-2.5 bg-sand/30 rounded-xl border border-sand-dark/60 text-xs flex items-center justify-between">
                  <span className="font-bold text-wine">
                    Profile Completeness: {professional.profileCompleteness}%
                  </span>
                  <Link to="/onboarding/professional" className="text-wine font-semibold hover:underline">
                    Complete Sections
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Instagram Story Highlights Circles */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
        {storyHighlights.map((hl) => (
          <div key={hl.title} className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
            <div className="p-1 rounded-full border border-border group-hover:border-wine transition-colors">
              <img
                src={hl.img}
                alt={hl.title}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-surface"
              />
            </div>
            <span className="text-xs font-medium text-charcoal mt-1.5">{hl.title}</span>
          </div>
        ))}
      </div>

      {/* 3. Instagram Profile Tabs Navigation */}
      <div className="flex items-center justify-center gap-12 border-t border-border uppercase text-xs font-bold tracking-widest">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all ${
            activeTab === 'posts' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Posts</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all ${
            activeTab === 'reels' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Reels</span>
        </button>

        <button
          onClick={() => setActiveTab('works')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all ${
            activeTab === 'works' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Our Works</span>
        </button>
      </div>

      {/* 4. Instagram 3-Column Square Grid for Posts */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <p className="text-sm font-semibold">No posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-7">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square bg-sand/30 overflow-hidden cursor-pointer"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                  {/* Instagram Hover Overlay */}
                  <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white text-sm font-bold">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-5 h-5 fill-white text-white" />
                      <span>{post.likesCount}</span>
                    </span>
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(post.id);
                        }}
                        className="hover:text-error"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Reels Grid */}
      {activeTab === 'reels' && (
        <div>
          {userReels.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <p className="text-sm font-semibold">No reels uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-4">
              {userReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => navigate('/reels')}
                  className="group relative aspect-[9/16] bg-charcoal overflow-hidden cursor-pointer"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-white flex items-center gap-1 text-xs font-bold drop-shadow">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{reel.likesCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Our Works Grid & Projects */}
      {activeTab === 'works' && (
        <div className="space-y-6">
          {userWorks.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <p className="text-sm font-semibold">No completed projects added yet.</p>
            </div>
          ) : (
            userWorks.map((work) => (
              <div
                key={work.id}
                className="bg-surface-card border border-border rounded-2xl p-5 shadow-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand px-2 py-0.5 rounded">
                      {work.eventType}
                    </span>
                    <h3 className="font-bold text-base text-charcoal mt-1">{work.title}</h3>
                    <p className="text-xs text-charcoal-muted">{work.location} • {formatDate(work.eventDate)}</p>
                  </div>
                  {isOwner && (
                    <button onClick={() => deleteWork(work.id)} className="text-charcoal-muted hover:text-error">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-charcoal leading-relaxed">{work.description}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {work.galleryUrls.map((url, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-sand/30">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-surface-card rounded-2xl border border-border p-6 max-w-md w-full shadow-elevated space-y-4">
            <h3 className="font-bold text-base text-charcoal">Edit Profile</h3>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">Bio</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">Coverage Area</label>
              <input
                type="text"
                value={editCoverage}
                onChange={(e) => setEditCoverage(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg bg-wine text-white text-xs font-bold hover:bg-wine-dark"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
