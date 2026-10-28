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
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { WorkSample } from '../types';
import { formatDate, formatINR } from '../utils';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentUser, allProfessionals, allCustomers, updateProfessionalProfile } = useAuthStore();
  const { posts, reels, works, services, deletePost, deleteReel, deleteWork, initiateBookingChat } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'works' | 'services'>('posts');
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
  const proServices = services.filter((s) => s.professionalId === targetId);

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* 1. Instagram Profile Header */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-14 pb-4">
        {/* Avatar */}
        <div className="relative group">
          <div className="p-1 rounded-full bg-gradient-to-tr from-sand-dark via-wine to-sand ring-2 ring-transparent">
            <img
              src={professional?.avatar || customer?.avatar || currentUser.avatar}
              alt=""
              className="w-24 h-24 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-surface"
            />
          </div>
        </div>

        {/* Profile Info & Actions */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Top Row: Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <h1 className="text-xl font-bold text-charcoal">
              {professional?.businessName || customer?.name || currentUser.name}
            </h1>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {!isOwner && professional ? (
                <>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isFollowing
                        ? 'bg-sand text-charcoal border border-sand-dark'
                        : 'bg-surface hover:bg-sand/30 text-charcoal border border-border'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button
                    onClick={handleBookNow}
                    className="px-3 sm:px-4 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal transition-colors"
                  >
                    Message
                  </button>

                  <Link
                    to={`/professionals/${professional.id}/availability`}
                    className="px-3.5 sm:px-4 py-1.5 rounded-lg border border-wine text-wine hover:bg-wine/10 text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Check Availability</span>
                  </Link>

                  <Link
                    to={`/professionals/${professional.id}/availability`}
                    className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-wine hover:bg-wine-deep text-white text-xs font-bold shadow-subtle active:scale-95 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Book Now</span>
                  </Link>
                </>
              ) : isOwner ? (
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
                    to="/professional/calendar"
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
                  >
                    Calendar
                  </Link>

                  <Link
                    to="/professional/availability"
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
                  >
                    Availability
                  </Link>

                  <Link
                    to="/settings"
                    className="p-1.5 rounded-lg border border-border hover:bg-sand/30 text-charcoal"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </>
              ) : null}
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

          {/* Bottom Row: Bio & Category */}
          <div className="text-xs space-y-1">
            {professional?.category && (
              <span className="font-semibold text-wine block">{professional.category}</span>
            )}
            <p className="text-charcoal leading-relaxed whitespace-pre-line">
              {professional?.description || customer?.location || 'Event enthusiast on Soirée'}
            </p>
            {professional?.coverageArea && (
              <p className="text-charcoal-muted flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-wine" />
                <span>Serving {professional.coverageArea}</span>
              </p>
            )}

            {/* Profile Completion Bar (For Owner) */}
            {isOwner && professional && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-charcoal">Profile Completeness</span>
                  <span className="font-bold text-wine">{professional.profileCompleteness || 85}%</span>
                </div>
                <div className="h-1.5 w-full bg-sand rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wine rounded-full transition-all duration-300"
                    style={{ width: `${professional.profileCompleteness || 85}%` }}
                  />
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
      <div className="flex items-center justify-center gap-8 sm:gap-12 border-t border-border uppercase text-xs font-bold tracking-widest overflow-x-auto">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
            activeTab === 'posts' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Posts</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
            activeTab === 'reels' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Reels</span>
        </button>

        <button
          onClick={() => setActiveTab('works')}
          className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
            activeTab === 'works' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Our Works</span>
        </button>

        {professional && (
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
              activeTab === 'services' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Packages ({proServices.length})</span>
          </button>
        )}
      </div>

      {/* 4. Instagram 3-Column Square Grid for Posts */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <Grid className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
              <p className="text-sm font-semibold">No posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square bg-sand/30 overflow-hidden cursor-pointer"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
                    <span className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      {post.likesCount}
                    </span>
                    {isOwner && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePost(post.id);
                        }}
                        className="hover:text-error transition-colors"
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
              <Film className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
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
              <Briefcase className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
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

      {/* 7. Services & Packages Tab */}
      {activeTab === 'services' && professional && (
        <div className="space-y-4">
          {proServices.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
              <p className="text-sm font-semibold">No service packages published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-surface-card border border-border rounded-2xl p-5 shadow-card flex flex-col justify-between hover:border-wine/40 transition-all space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-wine bg-sand/60 px-2 py-0.5 rounded">
                          {service.category}
                        </span>
                        <h4 className="font-bold text-base text-charcoal mt-1.5">{service.name}</h4>
                      </div>
                      <span className="text-base font-bold text-wine shrink-0">
                        {formatINR(service.basePrice)}
                      </span>
                    </div>

                    <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    {service.inclusions && service.inclusions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {service.inclusions.slice(0, 3).map((inc, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-sand/40 border border-border/80 px-2 py-0.5 rounded-full text-charcoal"
                          >
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[11px] text-charcoal-muted">
                      Pricing: <strong className="text-charcoal capitalize">{service.unitLabel || service.pricingModel.replace('_', ' ')}</strong>
                    </span>

                    {!isOwner ? (
                      <Link
                        to={`/professionals/${professional.id}/availability?service=${service.id}`}
                        className="px-3.5 py-1.5 rounded-xl bg-wine hover:bg-wine-deep text-white text-xs font-bold shadow-subtle inline-flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Check Availability</span>
                      </Link>
                    ) : (
                      <Link
                        to="/services"
                        className="text-xs font-semibold text-wine hover:underline"
                      >
                        Manage Service →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
