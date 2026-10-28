import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Camera,
  UtensilsCrossed,
  Castle,
  Palette,
  Flower2,
  Music,
  Tv,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { useAuthStore } from '../store/useAuthStore';
import { PostCard } from '../components/cards/PostCard';
import { ProfessionalCard } from '../components/cards/ProfessionalCard';
import { ServiceCategory } from '../types';

export const ConsumerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { posts, reels } = useMarketplaceStore();
  const { allProfessionals, currentUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: { label: string; value: string; icon: any }[] = [
    { label: 'All Categories', value: 'All', icon: Sparkles },
    { label: 'Photographers', value: 'Photographer & Videographer', icon: Camera },
    { label: 'Wedding Halls', value: 'Wedding & Party Hall', icon: Castle },
    { label: 'Catering', value: 'Caterer', icon: UtensilsCrossed },
    { label: 'Bridal Makeup', value: 'Makeup Artist & Hairstylist', icon: Palette },
    { label: 'Floral Decor', value: 'Decorator & Florist', icon: Flower2 },
    { label: 'DJ & Sound', value: 'DJ, Sound & Lighting', icon: Music },
    { label: 'Equipment Rental', value: 'Equipment Rental', icon: Tv },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const featuredPros = allProfessionals.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-sand/60 border border-border p-6 sm:p-10 lg:p-12 shadow-card">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-wine border border-border text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Event Services Marketplace</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
            Celebrate In Unrivaled Elegance.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Connect with verified wedding planners, royal palace venues, master caterers, and cinematic storytellers across South India.
          </p>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex items-center bg-surface-card rounded-2xl border border-border shadow-dropdown p-1.5 focus-within:border-wine focus-within:ring-2 focus-within:ring-wine/20 transition-all max-w-lg"
          >
            <div className="pl-3.5 text-charcoal-muted">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search '#WeddingPhotography', 'Madurai Catering', 'Bridal MUA'..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent text-charcoal outline-none placeholder:text-charcoal-light"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold tracking-wider transition-all duration-150 shadow-xs flex items-center gap-1.5 active:scale-95"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Trending Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-charcoal-muted">
            <span className="font-semibold text-charcoal flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-wine" />
              Trending:
            </span>
            {['#WeddingPhotography', '#MaduraiCatering', '#BridalMakeup', '#GrandBallroom'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/search?tag=${encodeURIComponent(tag.replace('#', ''))}`)}
                className="hover:text-wine hover:underline transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-wine/5 blur-3xl pointer-events-none" />
      </section>

      {/* Category Shortcuts Bar */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-bold text-charcoal tracking-wide uppercase">
            Browse Event Services
          </h2>
          <Link
            to="/search"
            className="text-xs font-semibold text-wine hover:text-wine-dark hover:underline flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 border ${
                  isSelected
                    ? 'bg-wine text-white border-wine shadow-sm'
                    : 'bg-surface-card text-charcoal border-border hover:bg-sand/40 hover:border-sand-dark'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sand' : 'text-wine'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Event Professionals */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-charcoal font-serif-display">
              Recommended Event Professionals
            </h2>
            <p className="text-xs text-charcoal-muted">
              Top-rated and verified vendors in your region
            </p>
          </div>
          <Link
            to="/search?tab=professionals"
            className="text-xs font-semibold text-wine hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPros.map((pro) => (
            <ProfessionalCard key={pro.id} professional={pro} />
          ))}
        </div>
      </section>

      {/* Reels Discovery Preview Ribbon */}
      <section className="bg-charcoal text-white rounded-3xl p-6 sm:p-8 shadow-card overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-wine flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl font-bold">Trending Event Reels</h3>
              <p className="text-xs text-charcoal-light">Short-form cinematic previews of recent celebrations</p>
            </div>
          </div>
          <Link
            to="/reels"
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-sand transition-colors flex items-center gap-1.5"
          >
            <span>Watch Full Reels</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {reels.slice(0, 4).map((reel) => (
            <div
              key={reel.id}
              onClick={() => navigate('/reels')}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer bg-charcoal/80 ring-1 ring-white/10 hover:ring-wine transition-all"
            >
              <img
                src={reel.thumbnailUrl}
                alt={reel.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-90" />

              <div className="absolute bottom-3 left-3 right-3 text-left">
                <span className="text-[10px] uppercase font-bold text-sand/90 tracking-wider block truncate">
                  {reel.category}
                </span>
                <p className="text-xs font-semibold text-white line-clamp-1 mt-0.5">
                  {reel.professionalName}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-charcoal-light">
                  <span>{reel.likesCount} likes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Posts & Portfolios Discovery Feed */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif-display text-charcoal">
              Latest Work Samples & Posts
            </h2>
            <p className="text-xs text-charcoal-muted">
              Recent ceremonies, stage scenography, and bridal moments from verified professionals
            </p>
          </div>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs font-semibold text-wine hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-surface-card rounded-2xl border border-border p-12 text-center">
            <Sparkles className="w-8 h-8 text-charcoal-light mx-auto mb-2" />
            <p className="text-sm font-semibold text-charcoal">No posts found in this category.</p>
            <p className="text-xs text-charcoal-muted mt-1">Try switching to All Categories or use search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
