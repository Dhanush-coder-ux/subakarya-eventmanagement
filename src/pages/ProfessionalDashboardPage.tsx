import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Grid,
  Briefcase,
  CalendarCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { formatINR } from '../utils';

export const ProfessionalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { posts, reels, works, services, inventory, bookings, conversations } = useMarketplaceStore();

  const pro = currentUser.role === 'professional' ? currentUser : null;

  // Compute live statistics for current professional
  const myPosts = posts.filter((p) => p.professionalId === currentUser.id);
  const myReels = reels.filter((r) => r.professionalId === currentUser.id);
  const myWorks = works.filter((w) => w.professionalId === currentUser.id);
  const myServices = services.filter((s) => s.professionalId === currentUser.id);
  const myInventory = inventory.filter((i) => i.professionalId === currentUser.id);
  const myBookings = bookings.filter((b) => b.professionalId === currentUser.id);

  const pendingEnquiries = myBookings.filter((b) => b.status === 'pending');
  const quoteReceived = myBookings.filter((b) => b.status === 'quote_received');
  const confirmedBookings = myBookings.filter((b) => b.status === 'confirmed');

  // Low stock inventory items
  const lowStockItems = myInventory.filter(
    (item) => item.availableQuantity <= item.lowStockThreshold
  );

  const completeness = pro?.profileCompleteness || 90;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-sand/60 rounded-3xl border border-border p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-wine shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-2xl sm:text-3xl font-bold text-charcoal">
                {pro?.businessName || currentUser.name}
              </h1>
              {pro?.isVerified && (
                <span title="Verified Vendor">
                  <CheckCircle2 className="w-5 h-5 text-wine fill-sand" />
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              {pro?.category || 'Professional Services'} • {currentUser.location}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface text-charcoal border border-border">
                {pro?.experienceYears || 5} Years Experience
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-wine text-white">
                Vendor Mode Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link
            to="/portfolio"
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create Post / Reel</span>
          </Link>
          <Link
            to={`/profile/${currentUser.id}`}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl border border-border hover:bg-sand/40 text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Public Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Dynamic Completeness Progress Card */}
      <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card">
        <div className="flex items-center justify-between pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Profile Completeness
            </span>
            <span className="text-xs font-bold text-wine">({completeness}%)</span>
          </div>
          <Link
            to="/onboarding/professional"
            className="text-xs font-semibold text-wine hover:underline flex items-center gap-1"
          >
            <span>Complete Missing Sections</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="w-full bg-sand/60 h-2.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-wine h-full rounded-full transition-all duration-300"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-charcoal-muted">
          <span className="flex items-center gap-1 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine" /> Personal Info (15%)
          </span>
          <span className="flex items-center gap-1 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine" /> Business Identity (20%)
          </span>
          <span className="flex items-center gap-1 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine" /> Services & Pricing (20%)
          </span>
          <span className="flex items-center gap-1 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine" /> Verification (15%)
          </span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2">
            <Users className="w-4 h-4 text-wine" />
          </div>
          <span className="text-xs text-charcoal-muted">Followers</span>
          <p className="text-xl font-bold font-bold text-charcoal">
            {(pro?.followersCount || 1240).toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2">
            <Grid className="w-4 h-4 text-wine" />
          </div>
          <span className="text-xs text-charcoal-muted">Posts & Reels</span>
          <p className="text-xl font-bold font-bold text-charcoal">
            {myPosts.length + myReels.length}
          </p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2">
            <Briefcase className="w-4 h-4 text-wine" />
          </div>
          <span className="text-xs text-charcoal-muted">Our Works</span>
          <p className="text-xl font-bold font-bold text-wine">
            {myWorks.length}
          </p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2">
            <MessageSquare className="w-4 h-4 text-wine" />
          </div>
          <span className="text-xs text-charcoal-muted">New Enquiries</span>
          <p className="text-xl font-bold font-bold text-charcoal">
            {pendingEnquiries.length}
          </p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2">
            <FileText className="w-4 h-4 text-wine" />
          </div>
          <span className="text-xs text-charcoal-muted">Pending Quotes</span>
          <p className="text-xl font-bold font-bold text-charcoal">
            {quoteReceived.length}
          </p>
        </div>

        <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2">
            <CalendarCheck className="w-4 h-4 text-wine" />
          </div>
          <span className="text-xs text-charcoal-muted">Confirmed Events</span>
          <p className="text-xl font-bold font-bold text-success">
            {confirmedBookings.length}
          </p>
        </div>
      </div>

      {/* Main 2-Column Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Bookings & Quotation Pipeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-wine" />
                <span>Recent Event Bookings & Enquiries</span>
              </h2>
              <Link
                to="/bookings"
                className="text-xs font-semibold text-wine hover:underline flex items-center gap-1"
              >
                <span>View All ({myBookings.length})</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              {myBookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-charcoal-muted">
                  No event bookings received yet.
                </div>
              ) : (
                myBookings.slice(0, 4).map((book) => (
                  <div key={book.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={book.customerAvatar}
                        alt={book.customerName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-border"
                      />
                      <div>
                        <h4 className="font-semibold text-charcoal text-sm">{book.customerName}</h4>
                        <p className="text-charcoal-muted text-[11px]">{book.eventType} • {book.eventDate}</p>
                        <span className="text-[10px] text-charcoal-light">{book.location}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          book.status === 'confirmed'
                            ? 'bg-success-light text-success'
                            : book.status === 'quote_received'
                            ? 'bg-sand text-charcoal'
                            : 'bg-wine-soft text-wine'
                        }`}
                      >
                        {book.status.replace('_', ' ')}
                      </span>
                      {book.totalAmount && (
                        <p className="font-bold text-wine text-xs">{formatINR(book.totalAmount)}</p>
                      )}
                      <Link
                        to="/chat"
                        className="text-[11px] text-wine hover:underline font-medium block mt-0.5"
                      >
                        Open Chat
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/services"
              className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-wine" />
              </div>
              <h3 className="font-bold text-charcoal text-xs sm:text-sm">Manage Pricing</h3>
              <p className="text-[11px] text-charcoal-muted mt-1">
                {myServices.length} Active Packages Configured
              </p>
            </Link>

            <Link
              to="/inventory"
              className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4 text-wine" />
              </div>
              <h3 className="font-bold text-charcoal text-xs sm:text-sm">Manage Inventory</h3>
              <p className="text-[11px] text-charcoal-muted mt-1">
                {myInventory.length} Equipment & Consumable Items
              </p>
            </Link>

            <Link
              to="/portfolio"
              className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4 text-wine" />
              </div>
              <h3 className="font-bold text-charcoal text-xs sm:text-sm">Content & Works</h3>
              <p className="text-[11px] text-charcoal-muted mt-1">
                {myPosts.length} Posts • {myReels.length} Reels
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column: Inventory Alerts & Operational Activity */}
        <div className="space-y-6">
          {/* Inventory Alerts Card */}
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-wine" />
                <span>Inventory Alerts</span>
              </h3>
              <Link to="/inventory" className="text-[11px] text-wine hover:underline font-semibold">
                Manage
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-charcoal-muted py-3">All equipment and consumables adequately stocked.</p>
            ) : (
              <div className="space-y-2.5">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-error-light/50 border border-error/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-charcoal">{item.name}</p>
                      <span className="text-[10px] text-error font-medium">
                        Only {item.availableQuantity} {item.unit} available
                      </span>
                    </div>
                    <Link
                      to="/inventory"
                      className="px-2 py-1 rounded-md bg-surface text-charcoal border border-border text-[10px] font-bold"
                    >
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Operational Tips */}
          <div className="p-4 rounded-2xl bg-sand/30 border border-sand-dark text-xs space-y-2">
            <span className="font-bold text-charcoal uppercase tracking-wider text-[10px] block">
              Pro Vendor Tip
            </span>
            <p className="text-charcoal-muted leading-relaxed">
              When customers submit a booking enquiry, create a formal quotation within 2 hours. Configured services automatically calculate line item totals and guest counts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
