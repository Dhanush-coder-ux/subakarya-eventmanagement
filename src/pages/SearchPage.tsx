import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  X,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  Film,
  Camera,
  UtensilsCrossed,
  Castle,
  IndianRupee,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { useAuthStore } from '../store/useAuthStore';
import { PostCard } from '../components/cards/PostCard';
import { ProfessionalCard } from '../components/cards/ProfessionalCard';
import { formatINR } from '../utils';

type SearchTab = 'all' | 'professionals' | 'posts' | 'reels' | 'services';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { posts, reels, services, initiateBookingChat } = useMarketplaceStore();
  const { allProfessionals, currentUser } = useAuthStore();

  const queryParam = searchParams.get('q') || '';
  const tagParam = searchParams.get('tag') || '';
  const initialTab = (searchParams.get('tab') as SearchTab) || 'all';

  const [searchTerm, setSearchTerm] = useState(tagParam ? `#${tagParam}` : queryParam);
  const [activeTab, setActiveTab] = useState<SearchTab>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'experience'>('recommended');
  const [showFilters, setShowFilters] = useState(false);

  // Sync state if url parameters change
  useEffect(() => {
    if (tagParam) {
      setSearchTerm(`#${tagParam}`);
    } else if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [tagParam, queryParam]);

  const handleClear = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const handleApplyTag = (tag: string) => {
    setSearchTerm(tag);
    setSearchParams({ tag: tag.replace('#', '') });
  };

  const cleanTerm = searchTerm.trim().toLowerCase().replace(/^#/, '');

  // Filter Professionals
  const matchedProfessionals = allProfessionals.filter((pro) => {
    if (selectedCategory !== 'All' && pro.category !== selectedCategory) return false;
    if (selectedLocation !== 'All' && !pro.location.includes(selectedLocation)) return false;
    if (pro.minBookingAmount && pro.minBookingAmount > maxPrice) return false;

    if (!cleanTerm) return true;

    return (
      pro.name.toLowerCase().includes(cleanTerm) ||
      pro.businessName.toLowerCase().includes(cleanTerm) ||
      pro.category.toLowerCase().includes(cleanTerm) ||
      pro.location.toLowerCase().includes(cleanTerm) ||
      pro.description.toLowerCase().includes(cleanTerm)
    );
  });

  // Filter Posts (including case-insensitive hashtag matching)
  const matchedPosts = posts.filter((post) => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
    if (selectedLocation !== 'All' && !post.location.includes(selectedLocation)) return false;

    if (!cleanTerm) return true;

    const matchesHashtag = post.hashtags.some((h) =>
      h.toLowerCase().replace('#', '').includes(cleanTerm)
    );
    const matchesCaption = post.caption.toLowerCase().includes(cleanTerm);
    const matchesPro = post.professionalName.toLowerCase().includes(cleanTerm);
    const matchesLocation = post.location.toLowerCase().includes(cleanTerm);

    return matchesHashtag || matchesCaption || matchesPro || matchesLocation;
  });

  // Filter Reels
  const matchedReels = reels.filter((reel) => {
    if (!cleanTerm) return true;

    const matchesHashtag = reel.hashtags.some((h) =>
      h.toLowerCase().replace('#', '').includes(cleanTerm)
    );
    const matchesCaption = reel.caption.toLowerCase().includes(cleanTerm);
    const matchesPro = reel.professionalName.toLowerCase().includes(cleanTerm);

    return matchesHashtag || matchesCaption || matchesPro;
  });

  // Filter Services
  const matchedServices = services.filter((srv) => {
    if (selectedCategory !== 'All' && srv.category !== selectedCategory) return false;
    if (srv.basePrice > maxPrice) return false;

    if (!cleanTerm) return true;

    return (
      srv.name.toLowerCase().includes(cleanTerm) ||
      srv.category.toLowerCase().includes(cleanTerm) ||
      srv.description.toLowerCase().includes(cleanTerm)
    );
  });

  const totalResults =
    matchedProfessionals.length +
    matchedPosts.length +
    matchedReels.length +
    matchedServices.length;

  const handleBookService = (service: any) => {
    initiateBookingChat(
      service.professionalId,
      {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        phone: currentUser.phone,
      },
      service.id
    );
    navigate('/chat');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Search Header Bar */}
      <div className="bg-surface-card rounded-2xl border border-border p-3.5 sm:p-5 shadow-card">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          {/* Input field */}
          <div className="relative flex-1 w-full min-w-0">
            <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-3 icon-hover-base icon-hover-tilt" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by vendor, service, city, or #tag..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine focus:ring-1 focus:ring-wine/20 placeholder:text-charcoal-light truncate"
            />
            {searchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-3.5 top-3 text-charcoal-light hover:text-charcoal p-0.5"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 ${
              showFilters
                ? 'bg-wine text-white border-wine shadow-xs'
                : 'border-border bg-surface hover:bg-sand/30 text-charcoal'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Trending & Quick Keywords */}
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-charcoal-muted font-medium flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-wine" />
              Popular:
            </span>
            {[
              '#WeddingPhotography',
              '#MaduraiCatering',
              '#BridalMakeup',
              '#BirthdayDecoration',
              'Wedding hall',
              'DJ Sound',
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => handleApplyTag(tag)}
                className="px-2.5 py-1 rounded-lg bg-sand/40 hover:bg-sand text-[11px] font-medium text-charcoal transition-colors border border-sand-dark/40 shrink-0 whitespace-nowrap active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Filters Tray */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs animate-in fade-in duration-200">
            <div>
              <label className="font-semibold text-charcoal block mb-1">Service Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              >
                <option value="All">All Categories</option>
                <option value="Photographer & Videographer">Photographer & Videographer</option>
                <option value="Wedding & Party Hall">Wedding & Party Hall</option>
                <option value="Caterer">Caterer</option>
                <option value="Makeup Artist & Hairstylist">Makeup Artist & Hairstylist</option>
                <option value="Decorator & Florist">Decorator & Florist</option>
                <option value="DJ, Sound & Lighting">DJ, Sound & Lighting</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-border bg-surface text-charcoal outline-none focus:border-wine"
              >
                <option value="All">All Locations</option>
                <option value="Madurai">Madurai</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-charcoal block mb-1">
                Max Price: {formatINR(maxPrice)}
              </label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-wine mt-1.5"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLocation('All');
                  setMaxPrice(100000);
                }}
                className="w-full py-2 rounded-lg border border-border hover:bg-sand/40 text-charcoal font-semibold text-xs transition-colors active:scale-98"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'all', label: `All (${totalResults})` },
          { id: 'professionals', label: `Pros (${matchedProfessionals.length})` },
          { id: 'posts', label: `Posts (${matchedPosts.length})` },
          { id: 'reels', label: `Reels (${matchedReels.length})` },
          { id: 'services', label: `Packages (${matchedServices.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SearchTab)}
            className={`px-3.5 py-2 text-xs font-semibold whitespace-nowrap rounded-t-lg transition-all border-b-2 shrink-0 ${
              activeTab === tab.id
                ? 'border-wine text-wine bg-wine-soft/30 font-bold'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results View */}
      {totalResults === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-surface-card rounded-2xl border border-border">
          <Search className="w-10 h-10 text-charcoal-light mx-auto mb-3" />
          <h3 className="font-bold text-charcoal text-base">No Matching Results Found</h3>
          <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search terms, removing filters, or browsing suggested tags like #WeddingPhotography or #MaduraiCatering.
          </p>
          <button
            onClick={handleClear}
            className="mt-4 px-4 py-2 rounded-xl bg-wine text-white text-xs font-semibold active:scale-95 shadow-xs"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* All or Professionals Tab */}
          {(activeTab === 'all' || activeTab === 'professionals') &&
            matchedProfessionals.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal mb-3 sm:mb-4 flex items-center justify-between">
                  <span>Verified Professionals</span>
                  <span className="text-[11px] text-charcoal-muted lowercase font-normal">
                    {matchedProfessionals.length} match(es)
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                  {matchedProfessionals.map((pro) => (
                    <ProfessionalCard key={pro.id} professional={pro} />
                  ))}
                </div>
              </div>
            )}

          {/* All or Services Tab */}
          {(activeTab === 'all' || activeTab === 'services') && matchedServices.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal mb-3 sm:mb-4 flex items-center justify-between">
                <span>Packages & Services</span>
                <span className="text-[11px] text-charcoal-muted lowercase font-normal">
                  {matchedServices.length} service(s)
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {matchedServices.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-4 bg-surface-card rounded-2xl border border-border shadow-card flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="text-[10px] uppercase font-bold text-wine tracking-wider bg-sand/60 px-2 py-0.5 rounded-md truncate max-w-[65%]">
                          {srv.category}
                        </span>
                        <span className="text-sm font-bold text-wine shrink-0">
                          {formatINR(srv.basePrice)}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-charcoal">{srv.name}</h4>
                      <p className="text-xs text-charcoal-muted mt-1 leading-relaxed line-clamp-2">
                        {srv.description}
                      </p>
                      <div className="mt-2 text-[11px] text-charcoal-light">
                        Model: {srv.pricingModel} {srv.unitLabel ? `(${srv.unitLabel})` : ''}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                      <Link
                        to={`/profile/${srv.professionalId}`}
                        className="flex-1 py-2 text-center rounded-lg border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal transition-colors truncate"
                      >
                        View Vendor
                      </Link>
                      <button
                        onClick={() => handleBookService(srv)}
                        className="flex-1 py-2 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold flex items-center justify-center gap-1 active:scale-95 shadow-xs truncate"
                      >
                        <span>Book Package</span>
                        <ArrowRight className="w-3 h-3 shrink-0" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All or Posts Tab */}
          {(activeTab === 'all' || activeTab === 'posts') && matchedPosts.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal mb-3 sm:mb-4 flex items-center justify-between">
                <span>Posts & Works</span>
                <span className="text-[11px] text-charcoal-muted lowercase font-normal">
                  {matchedPosts.length} post(s)
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {matchedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* All or Reels Tab */}
          {(activeTab === 'all' || activeTab === 'reels') && matchedReels.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal mb-3 sm:mb-4 flex items-center justify-between">
                <span>Reels & Video Clips</span>
                <span className="text-[11px] text-charcoal-muted lowercase font-normal">
                  {matchedReels.length} reel(s)
                </span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {matchedReels.map((reel) => (
                  <div
                    key={reel.id}
                    onClick={() => navigate('/reels')}
                    className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer bg-charcoal group ring-1 ring-border hover:ring-wine transition-all"
                  >
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-left">
                      <p className="text-xs font-bold truncate">{reel.professionalName}</p>
                      <p className="text-[10px] text-sand truncate">{reel.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
