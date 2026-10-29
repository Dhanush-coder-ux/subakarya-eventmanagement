import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { useAuthStore } from '../store/useAuthStore';
import { PostCard } from '../components/cards/PostCard';
import { formatINR } from '../utils';

export const ConsumerHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { posts } = useMarketplaceStore();
  const { allProfessionals, currentUser, setAccountType, switchActiveUser } = useAuthStore();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const storyVendors = allProfessionals;
  const suggestedVendors = allProfessionals.slice(0, 5);

  const tags = ['All', 'Photographers', 'Wedding Halls', 'Caterers', 'Bridal Makeup', 'Decor'];

  const filteredPosts = posts.filter((post) => {
    if (selectedTag === 'All') return true;
    if (selectedTag === 'Photographers') return post.category === 'Photographer & Videographer';
    if (selectedTag === 'Wedding Halls') return post.category === 'Wedding & Party Hall';
    if (selectedTag === 'Caterers') return post.category === 'Caterer';
    if (selectedTag === 'Bridal Makeup') return post.category === 'Makeup Artist & Hairstylist';
    if (selectedTag === 'Decor') return post.category === 'Decorator & Florist';
    return true;
  });

  return (
    <div className="w-full max-w-[1000px] mx-auto px-0 sm:px-4 py-2 sm:py-6 flex justify-center gap-6 lg:gap-10">
      {/* Center Feed Column (Instagram Main Stream) */}
      <div className="w-full max-w-full sm:max-w-[500px] min-w-0 flex-1">
        {/* 1. Instagram Stories Bar (Verified Event Professionals) */}
        <div className="bg-surface-card border-b sm:border border-border sm:rounded-2xl p-3.5 mb-4 shadow-subtle overflow-hidden">
          <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar pb-1">
            {storyVendors.map((pro) => (
              <Link
                key={pro.id}
                to={`/profile/${pro.id}`}
                className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
                title={pro.businessName}
              >
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-sand-dark via-wine to-wine-dark group-hover:scale-105 transition-transform">
                  <img
                    src={pro.avatar}
                    alt={pro.businessName}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-surface"
                  />
                </div>
                <span className="text-[11px] text-charcoal font-medium truncate max-w-[64px] text-center mt-1">
                  {pro.businessName.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 2. Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 sm:px-0 mb-4">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-wine text-white shadow-xs'
                  : 'bg-surface-card text-charcoal border border-border hover:bg-sand/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* 3. Feed of Instagram Post Cards */}
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Desktop Suggestions Sidebar (Instagram Web style) */}
      <aside className="hidden lg:block w-[320px] flex-shrink-0 space-y-5 pt-2">
        {/* Active User Header Widget */}
        <div className="flex items-center justify-between">
          <Link to={`/profile/${currentUser.id}`} className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full object-cover ring-1 ring-border"
            />
            <div className="leading-tight">
              <span className="text-xs font-bold text-charcoal block hover:underline">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-charcoal-muted">
                {'businessName' in currentUser ? currentUser.businessName : currentUser.location}
              </span>
            </div>
          </Link>

          <button
            onClick={() => {
              const nextRole = currentUser.role === 'customer' ? 'professional' : 'customer';
              setAccountType(nextRole);
              if (nextRole === 'customer') navigate('/');
              else navigate('/dashboard');
            }}
            className="text-xs font-bold text-wine hover:underline"
          >
            Switch
          </button>
        </div>

        {/* Suggested For You */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-charcoal-muted uppercase text-[11px] tracking-wider">
              Suggested Event Pros
            </span>
            <Link to="/search" className="font-bold text-charcoal hover:text-wine text-[11px]">
              See All
            </Link>
          </div>

          <div className="space-y-2.5">
            {suggestedVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between gap-3 text-xs">
                <Link
                  to={`/profile/${vendor.id}`}
                  className="flex items-center gap-2.5 flex-1 min-w-0"
                >
                  <img
                    src={vendor.avatar}
                    alt={vendor.businessName}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-border flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-charcoal truncate block hover:underline">
                        {vendor.businessName}
                      </span>
                      {vendor.isVerified && (
                        <CheckCircle2 className="w-3 h-3 text-wine fill-sand flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-charcoal-muted truncate block">
                      {vendor.category}
                    </span>
                  </div>
                </Link>

                <Link
                  to={`/profile/${vendor.id}`}
                  className="text-xs font-bold text-wine hover:underline flex-shrink-0"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links & Copyright */}
        <div className="text-[11px] text-charcoal-light leading-relaxed pt-3 border-t border-border/60">
          <p className="flex flex-wrap gap-x-2 gap-y-1 text-charcoal-muted font-medium">
            <Link to="/search" className="hover:underline">Explore</Link>
            <span>•</span>
            <Link to="/reels" className="hover:underline">Reels</Link>
            <span>•</span>
            <Link to="/settings" className="hover:underline">Settings</Link>
            <span>•</span>
            <Link to="/chat" className="hover:underline">Direct</Link>
          </p>
          <p className="mt-3 uppercase tracking-wider text-[10px]">
            © 2026 SUBAKARYA • INSTAGRAM ARCHITECTURE
          </p>
        </div>
      </aside>
    </div>
  );
};
