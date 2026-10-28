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
  MessageSquare,
  ArrowUpRight,
  Share2,
  Edit3,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { WorkSample } from '../types';
import { formatDate } from '../utils';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { currentUser, allProfessionals, allCustomers, updateProfessionalProfile } = useAuthStore();
  const { posts, reels, works, deletePost, deleteReel, deleteWork, initiateBookingChat } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'works'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Resolve user to display
  const targetId = id || currentUser.id;
  const professional = allProfessionals.find((p) => p.id === targetId);
  const customer = allCustomers.find((c) => c.id === targetId);

  // If customer is viewing their own profile or another customer
  const isOwner = currentUser.id === targetId;

  // Edit form state
  const [editBio, setEditBio] = useState(professional?.description || '');
  const [editCoverage, setEditCoverage] = useState(professional?.coverageArea || '');

  if (!professional && !customer) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-charcoal-muted">
        User profile not found.
      </div>
    );
  }

  // Filter content belonging to this professional
  const userPosts = posts.filter((p) => p.professionalId === targetId);
  const userReels = reels.filter((r) => r.professionalId === targetId);
  const userWorks = works.filter((w) => w.professionalId === targetId);

  const followersCount = (professional?.followersCount || 120) + (isFollowing ? 1 : 0);
  const postsCount = userPosts.length;
  const worksCount = userWorks.length;

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

  const handleSendMessage = () => {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-surface-card rounded-3xl border border-border p-6 sm:p-8 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={professional?.avatar || customer?.avatar}
              alt={professional?.businessName || customer?.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-sand-dark shadow-sm"
            />
            {professional?.isVerified && (
              <div
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-wine text-white flex items-center justify-center ring-2 ring-surface shadow-xs"
                title="Verified Professional"
              >
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Details & Statistics */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-charcoal">
                  {professional ? professional.businessName : customer?.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sand/70 border border-sand-dark text-charcoal font-semibold">
                  {professional ? professional.category : 'Verified Customer'}
                </span>
              </div>
              <p className="text-xs text-charcoal-muted mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-wine" />
                <span>
                  {professional ? `${professional.location} • Coverage: ${professional.coverageArea}` : customer?.location}
                </span>
              </p>
            </div>

            {/* Statistics (Followers, Posts, Works) */}
            <div className="flex items-center gap-6 py-2 border-y border-border/60 text-xs">
              <div>
                <span className="font-bold text-base text-charcoal block">
                  {followersCount.toLocaleString()}
                </span>
                <span className="text-charcoal-muted uppercase text-[10px] tracking-wider font-semibold">
                  Followers
                </span>
              </div>
              <div>
                <span className="font-bold text-base text-charcoal block">{postsCount}</span>
                <span className="text-charcoal-muted uppercase text-[10px] tracking-wider font-semibold">
                  Posts
                </span>
              </div>
              <div>
                <span className="font-bold text-base text-wine block">{worksCount}</span>
                <span className="text-charcoal-muted uppercase text-[10px] tracking-wider font-semibold">
                  Works
                </span>
              </div>
            </div>

            {/* Bio Description */}
            <p className="text-xs sm:text-sm text-charcoal leading-relaxed max-w-2xl">
              {professional ? professional.description : 'Active event organizer & host.'}
            </p>

            {/* Profile Completeness for OWNER ONLY */}
            {isOwner && professional && (
              <div className="p-3 bg-sand/30 rounded-xl border border-sand-dark/60 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-semibold text-charcoal">
                  <span className="text-[11px] uppercase tracking-wider text-wine">
                    Profile Completeness (Owner View)
                  </span>
                  <span className="text-wine">{professional.profileCompleteness}%</span>
                </div>
                <div className="w-full bg-sand-dark/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-wine h-full rounded-full transition-all duration-300"
                    style={{ width: `${professional.profileCompleteness}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {!isOwner ? (
                <>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isFollowing
                        ? 'bg-sand text-charcoal border border-sand-dark'
                        : 'bg-wine text-white hover:bg-wine-dark shadow-xs'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </button>

                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-sand/30 text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={handleBookNow}
                    className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <span>Book Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-sand/30 text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>

                  <Link
                    to="/services"
                    className="px-4 py-2 rounded-xl border border-border hover:bg-sand/30 text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Manage Services</span>
                  </Link>

                  <Link
                    to="/portfolio"
                    className="px-4 py-2 rounded-xl border border-border hover:bg-sand/30 text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Manage Portfolio</span>
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: professional?.businessName || customer?.name,
                      url: window.location.href,
                    }).catch(() => {});
                  }
                }}
                className="p-2 rounded-xl border border-border hover:bg-sand/30 text-charcoal-muted hover:text-charcoal transition-colors ml-auto"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'posts'
              ? 'border-wine text-wine'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({postsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'reels'
              ? 'border-wine text-wine'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({userReels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('works')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'works'
              ? 'border-wine text-wine'
              : 'border-transparent text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Our Works ({worksCount})</span>
        </button>
      </div>

      {/* Tab 1: Posts Grid */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="p-12 text-center text-charcoal-muted bg-surface-card rounded-2xl border border-border">
              <p className="text-sm font-semibold">No posts published yet.</p>
              {isOwner && (
                <Link
                  to="/portfolio"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-wine text-white text-xs font-semibold"
                >
                  Create First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-sand/30 border border-border shadow-xs cursor-pointer"
                >
                  <img
                    src={post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                    <p className="text-xs line-clamp-2 leading-snug">{post.caption}</p>
                    <div className="flex items-center justify-between text-[11px] text-sand mt-2 pt-2 border-t border-white/20">
                      <span>{post.likesCount} likes</span>
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePost(post.id);
                          }}
                          className="text-white hover:text-error p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Reels Grid */}
      {activeTab === 'reels' && (
        <div>
          {userReels.length === 0 ? (
            <div className="p-12 text-center text-charcoal-muted bg-surface-card rounded-2xl border border-border">
              <p className="text-sm font-semibold">No reels uploaded yet.</p>
              {isOwner && (
                <Link
                  to="/portfolio"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-wine text-white text-xs font-semibold"
                >
                  Upload First Reel
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {userReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => navigate('/reels')}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-charcoal cursor-pointer shadow-card ring-1 ring-border"
                >
                  <img
                    src={reel.thumbnailUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                    <p className="text-xs font-medium line-clamp-1">{reel.caption}</p>
                    <div className="flex items-center justify-between text-[10px] text-sand mt-1">
                      <span>{reel.likesCount} likes</span>
                      {isOwner && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReel(reel.id);
                          }}
                          className="text-white hover:text-error"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Our Works (Completed Projects) */}
      {activeTab === 'works' && (
        <div className="space-y-6">
          {userWorks.length === 0 ? (
            <div className="p-12 text-center text-charcoal-muted bg-surface-card rounded-2xl border border-border">
              <p className="text-sm font-semibold">No portfolio projects published yet.</p>
              {isOwner && (
                <Link
                  to="/portfolio"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-wine text-white text-xs font-semibold"
                >
                  Add Completed Project
                </Link>
              )}
            </div>
          ) : (
            userWorks.map((work) => (
              <div
                key={work.id}
                className="bg-surface-card rounded-3xl border border-border p-6 shadow-card space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-wine tracking-wider bg-sand/60 px-2 py-0.5 rounded">
                      {work.eventType}
                    </span>
                    <h3 className="font-serif-display text-xl font-bold text-charcoal mt-1">
                      {work.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-charcoal-muted mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-wine" />
                        {formatDate(work.eventDate)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-wine" />
                        {work.location}
                      </span>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => deleteWork(work.id)}
                      className="p-1.5 text-charcoal-light hover:text-error transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-charcoal leading-relaxed">{work.description}</p>

                {/* Services Delivered Pills */}
                {work.servicesDelivered && work.servicesDelivered.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase text-charcoal-muted">
                      Delivered:
                    </span>
                    {work.servicesDelivered.map((srv, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-surface-muted text-charcoal text-xs font-medium border border-border"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                )}

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {work.galleryUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="aspect-video rounded-xl overflow-hidden bg-sand/30 border border-border"
                    >
                      <img
                        src={url}
                        alt={`${work.title} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
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
            <h3 className="font-bold text-base text-charcoal">Edit Public Profile Details</h3>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">Bio / Story</label>
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
                className="px-4 py-2 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg bg-wine text-white text-xs font-bold hover:bg-wine-dark"
              >
                Save Updates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
