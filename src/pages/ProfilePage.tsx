import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  Calendar,
  Grid,
  Film,
  Briefcase,
  Bookmark,
  Repeat2,
  MessageCircle,
  Share2,
  Edit3,
  Trash2,
  ExternalLink,
  Tag,
  PackageSearch,
  Heart,
  Play,
  Settings,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Globe,
  User,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { formatDate, formatINR } from '../utils';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    userAccount,
    activeExperience,
    currentUser,
    allProfessionals,
    allCustomers,
    switchExperience,
    updatePersonalProfile,
    updateProfessionalProfile,
  } = useAuthStore();

  const {
    posts,
    reels,
    works,
    services,
    inventory,
    reposts,
    businessMode,
    deletePost,
    deleteReel,
    deleteWork,
    initiateBookingChat,
  } = useMarketplaceStore();

  // Resolve user
  const targetId = id || currentUser.id;
  const isOwner = currentUser.id === targetId || userAccount.id === targetId || userAccount.professionalProfile?.id === targetId;

  const isPersonalExperience = isOwner ? activeExperience === 'PERSONAL' : !allProfessionals.some(p => p.id === targetId);

  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'works' | 'services' | 'saved' | 'reposts'>(
    isPersonalExperience ? 'posts' : 'posts'
  );
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Profiles data
  const professional = allProfessionals.find((p) => p.id === targetId) || (isOwner ? userAccount.professionalProfile : undefined);
  const customer = allCustomers.find((c) => c.id === targetId);

  // Filter content
  const userPosts = posts.filter((p) => p.professionalId === targetId || (isOwner && p.professionalId === userAccount.id));
  const userReels = reels.filter((r) => r.professionalId === targetId || (isOwner && r.professionalId === userAccount.id));
  const userWorks = works.filter((w) => w.professionalId === targetId || (isOwner && w.professionalId === userAccount.id));
  const proServices = services.filter((s) => s.professionalId === targetId || (isOwner && s.professionalId === userAccount.id));
  const proProducts = inventory.filter((item) => item.professionalId === targetId || (isOwner && item.professionalId === userAccount.id));
  const approvedReposts = reposts.filter((r) => (r.customerId === targetId || isOwner) && r.status === 'PUBLISHED');
  const savedPosts = posts.filter((p) => userAccount.personalProfile.savedPostIds?.includes(p.id));

  const followersCount = isPersonalExperience
    ? userAccount.personalProfile.followersCount || 342
    : (professional?.followersCount || 1240) + (isFollowing ? 1 : 0);

  const followingCount = userAccount.personalProfile.followingCount || 188;
  const postsCount = userPosts.length > 0 ? userPosts.length : 3;

  // Edit form state
  const [editName, setEditName] = useState(isPersonalExperience ? userAccount.fullName : professional?.businessName || '');
  const [editBio, setEditBio] = useState(isPersonalExperience ? userAccount.personalProfile.bio : professional?.description || '');
  const [editLocation, setEditLocation] = useState(isPersonalExperience ? userAccount.personalProfile.location : professional?.location || '');
  const [editWebsite, setEditWebsite] = useState(isPersonalExperience ? userAccount.personalProfile.website || '' : '');

  // Instagram Story Highlights Mock
  const storyHighlights = [
    { title: 'Weddings', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80' },
    { title: 'Films', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80' },
    { title: 'Decor', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=300&q=80' },
    { title: 'Albums', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80' },
    { title: 'Moments', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
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
    if (isPersonalExperience) {
      updatePersonalProfile({
        fullName: editName,
        bio: editBio,
        location: editLocation,
        website: editWebsite,
      });
    } else if (professional) {
      updateProfessionalProfile({
        businessName: editName,
        description: editBio,
        location: editLocation,
      });
    }
    setShowEditModal(false);
  };

  const hasProfessionalProfile = Boolean(userAccount.professionalProfile);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Profile Header */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-10 pb-2">
        {/* Avatar */}
        <div className="relative group">
          <div className="p-1 rounded-full bg-gradient-to-tr from-sand-dark via-wine to-sand ring-2 ring-transparent">
            <img
              src={isPersonalExperience ? userAccount.personalProfile.avatar : professional?.avatar || currentUser.avatar}
              alt=""
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-surface shadow-sm"
            />
          </div>
        </div>

        {/* Profile Info & Actions */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          {/* Top Row: Username & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-charcoal">
                {isPersonalExperience
                  ? `@${userAccount.personalProfile.username}`
                  : professional?.businessName || currentUser.name}
              </h1>
              {!isPersonalExperience && professional?.kycStatus === 'VERIFIED' && (
                <span title="Verified Professional">
                  <ShieldCheck className="w-4 h-4 text-wine fill-wine/20" />
                </span>
              )}
            </div>

            {/* Action Buttons Row */}
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
                    className="px-3.5 sm:px-4 py-1.5 rounded-lg bg-wine hover:bg-wine-deep text-white text-xs font-bold shadow-subtle active:scale-95 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Book Now</span>
                  </Link>
                </>
              ) : isOwner ? (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal transition-colors"
                  >
                    Edit Profile
                  </button>

                  {/* Personal Experience: "Become a Professional" or "Switch to Professional" */}
                  {isPersonalExperience ? (
                    hasProfessionalProfile ? (
                      <button
                        onClick={() => switchExperience('PROFESSIONAL')}
                        className="px-3 py-1.5 rounded-lg bg-surface border border-wine text-wine hover:bg-wine-soft/40 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        title="Switch to your active business workspace"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Switch to Professional</span>
                      </button>
                    ) : (
                      <Link
                        to="/onboarding/professional"
                        className="px-3 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sand" />
                        <span>Become a Professional</span>
                      </Link>
                    )
                  ) : (
                    /* Professional Experience: Switch back to Personal Experience */
                    <>
                      <button
                        onClick={() => switchExperience('PERSONAL')}
                        className="px-3 py-1.5 rounded-lg bg-surface border border-wine text-wine hover:bg-wine-soft/40 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        title="Switch back to personal browsing without losing business data"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>Switch to Personal</span>
                      </button>

                      <Link
                        to={businessMode === 'ORDER_BASED' ? '/inventory' : '/services'}
                        className="px-3 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal"
                      >
                        {businessMode === 'ORDER_BASED' ? 'Inventory' : 'Services'}
                      </Link>
                    </>
                  )}

                  <Link
                    to="/settings"
                    className="p-1.5 rounded-lg border border-border hover:bg-sand/30 text-charcoal transition-colors"
                    title="Settings & Preferences"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* Middle Row: Stats */}
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
              <span className="font-bold text-charcoal">
                {isPersonalExperience ? followingCount : userWorks.length + proServices.length}{' '}
              </span>
              <span className="text-charcoal-muted">
                {isPersonalExperience ? 'following' : 'works & listings'}
              </span>
            </div>
          </div>

          {/* Bottom Row: Name, Bio, Location & Website */}
          <div className="text-xs space-y-1">
            <p className="font-bold text-charcoal text-sm">
              {isPersonalExperience ? userAccount.fullName : professional?.businessName}
            </p>

            {!isPersonalExperience && professional?.category && (
              <span className="font-semibold text-wine block">{professional.category}</span>
            )}

            <p className="text-charcoal leading-relaxed whitespace-pre-line">
              {isPersonalExperience ? userAccount.personalProfile.bio : professional?.description}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap pt-0.5 text-charcoal-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-wine" />
                <span>
                  {isPersonalExperience
                    ? userAccount.personalProfile.location
                    : professional?.coverageArea || professional?.location}
                </span>
              </span>

              {isPersonalExperience && userAccount.personalProfile.website && (
                <a
                  href={userAccount.personalProfile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-wine hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{userAccount.personalProfile.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>

            {/* Profile Completeness Bar (for professional mode) */}
            {isOwner && !isPersonalExperience && professional && (
              <div className="pt-2 max-w-xs">
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

      {/* 2. Story Highlights Circles */}
      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 border-t border-border/50">
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

      {/* 3. Profile Tabs Navigation: Distinct for Personal vs Professional */}
      <div className="flex items-center justify-center gap-6 sm:gap-10 border-t border-border uppercase text-xs font-bold tracking-widest overflow-x-auto">
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

        {isPersonalExperience ? (
          <>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
                activeTab === 'saved' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved</span>
            </button>

            <button
              onClick={() => setActiveTab('reposts')}
              className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
                activeTab === 'reposts' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Repeat2 className="w-3.5 h-3.5" />
              <span>Reposts ({approvedReposts.length})</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('works')}
              className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
                activeTab === 'works' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Works</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 py-3 border-t-2 -mt-[2px] transition-all shrink-0 ${
                activeTab === 'services' ? 'border-charcoal text-charcoal' : 'border-transparent text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>
                {businessMode === 'ORDER_BASED'
                  ? `Products (${proProducts.length})`
                  : `Packages (${proServices.length})`}
              </span>
            </button>
          </>
        )}
      </div>

      {/* 4. Tab Content: Posts Grid */}
      {activeTab === 'posts' && (
        <div>
          {userPosts.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <Grid className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
              <p className="text-sm font-semibold">No posts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-4">
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

      {/* 5. Tab Content: Reels Grid */}
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
                  <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover" />
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

      {/* 6. Tab Content: Saved Content (Personal Profile) */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <p className="text-xs text-charcoal-muted">Only you can view items you have saved</p>
            <span className="text-xs font-bold text-wine">{savedPosts.length} saved</span>
          </div>

          {savedPosts.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
              <p className="text-sm font-semibold">No saved content yet.</p>
              <p className="text-xs text-charcoal-muted mt-1">Bookmark posts and reels to build your celebration moodboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-3 md:gap-4">
              {savedPosts.map((post) => (
                <div key={post.id} className="relative aspect-square bg-sand/30 overflow-hidden cursor-pointer group">
                  <img src={post.mediaUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute bottom-2 right-2 p-1 rounded bg-black/60 text-white">
                    <Bookmark className="w-3.5 h-3.5 fill-white text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. Tab Content: Approved Reposts (Personal Profile) */}
      {activeTab === 'reposts' && (
        <div className="space-y-4">
          {approvedReposts.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <Repeat2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
              <p className="text-sm font-semibold">No approved reposts yet.</p>
              <p className="text-xs text-charcoal-muted mt-1">Submit your celebration photos to vendors to earn verified customer badges.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {approvedReposts.map((rp) => (
                <div key={rp.id} className="p-4 bg-surface-card border border-border rounded-2xl shadow-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-wine bg-sand px-2 py-0.5 rounded">
                      Approved by Vendor
                    </span>
                    <span className="text-[11px] text-charcoal-muted">{formatDate(rp.publishedAt)}</span>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed">{rp.experienceText}</p>
                  {rp.additionalMedia && rp.additionalMedia.length > 0 && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-sand/30">
                      <img src={rp.additionalMedia[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. Tab Content: Works / Portfolio (Professional Profile) */}
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

      {/* 9. Tab Content: Services / Products Tab (Professional Profile) */}
      {activeTab === 'services' && professional && (
        <div className="space-y-4">
          {proServices.length === 0 && proProducts.length === 0 ? (
            <div className="py-16 text-center text-charcoal-muted">
              <PackageSearch className="w-10 h-10 mx-auto mb-2 opacity-40 text-wine" />
              <p className="text-sm font-semibold">No packages or catalog products published yet.</p>
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
                      <Link to="/services" className="text-xs font-semibold text-wine hover:underline">
                        Manage Services →
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
            <h3 className="font-bold text-base text-charcoal">
              Edit {isPersonalExperience ? 'Personal Profile' : 'Business Profile'}
            </h3>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                {isPersonalExperience ? 'Full Name' : 'Business Name'}
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">
                {isPersonalExperience ? 'Bio' : 'Business Description'}
              </label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal block mb-1">Location</label>
              <input
                type="text"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>

            {isPersonalExperience && (
              <div>
                <label className="text-xs font-semibold text-charcoal block mb-1">Website URL</label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>
            )}

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
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
