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
  Calendar,
  Clock,
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* 1. Welcome Profile Card: Fully responsive and aligned across mobile and desktop */}
      <div className="bg-sand/60 rounded-2xl sm:rounded-3xl border border-border p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3.5 sm:gap-5 w-full md:w-auto">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-wine shadow-sm shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <h1 className="font-bold text-xl sm:text-2xl lg:text-3xl text-charcoal">
                {pro?.businessName || currentUser.name}
              </h1>
              {pro?.isVerified && (
                <span title="Verified Vendor" className="shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-wine fill-sand shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-muted mt-1">
              {pro?.category || 'Professional Services'} • {currentUser.location}
            </p>
            <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-surface text-charcoal border border-border shrink-0">
                {pro?.experienceYears || 5} Years Experience
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-wine text-white shrink-0">
                Vendor Mode Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
          <Link
            to="/portfolio"
            className="group w-full sm:w-auto px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 text-center"
          >
            <Sparkles className="w-4 h-4 shrink-0 icon-hover-base group-hover:rotate-12 group-hover:scale-110 transition-transform" />
            <span>Create Post / Reel</span>
          </Link>
          <Link
            to={`/profile/${currentUser.id}`}
            className="group w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-surface hover:bg-sand/40 text-charcoal text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95 text-center"
          >
            <span>View Public Profile</span>
            <ArrowRight className="w-4 h-4 shrink-0 icon-hover-base group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 2. Dynamic Completeness Progress Card */}
      <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 pb-2.5 border-b border-border/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Profile Completeness
            </span>
            <span className="text-xs font-bold text-wine">({completeness}%)</span>
          </div>
          <Link
            to="/onboarding/professional"
            className="text-xs font-semibold text-wine hover:underline inline-flex items-center gap-1"
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
          <span className="flex items-center gap-1.5 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" /> Personal Info (15%)
          </span>
          <span className="flex items-center gap-1.5 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" /> Business Identity (20%)
          </span>
          <span className="flex items-center gap-1.5 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" /> Services & Pricing (20%)
          </span>
          <span className="flex items-center gap-1.5 text-charcoal">
            <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" /> Verification (15%)
          </span>
        </div>
      </div>

      {/* 3. Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="group p-3.5 sm:p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 hover:shadow-subtle transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2 icon-box-hover group-hover:bg-sand-tint transition-all">
            <Users className="w-4 h-4 text-wine" />
          </div>
          <span className="text-[11px] text-charcoal-muted">Followers</span>
          <p className="text-lg sm:text-xl font-bold text-charcoal mt-0.5">
            {(pro?.followersCount || 1240).toLocaleString()}
          </p>
        </div>

        <div className="group p-3.5 sm:p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 hover:shadow-subtle transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2 icon-box-hover group-hover:bg-sand-tint transition-all">
            <Grid className="w-4 h-4 text-wine" />
          </div>
          <span className="text-[11px] text-charcoal-muted">Posts & Reels</span>
          <p className="text-lg sm:text-xl font-bold text-charcoal mt-0.5">
            {myPosts.length + myReels.length}
          </p>
        </div>

        <div className="group p-3.5 sm:p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 hover:shadow-subtle transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2 icon-box-hover group-hover:bg-sand-tint transition-all">
            <CalendarCheck className="w-4 h-4 text-wine" />
          </div>
          <span className="text-[11px] text-charcoal-muted">Pending Quotes</span>
          <p className="text-lg sm:text-xl font-bold text-wine mt-0.5">{pendingEnquiries.length}</p>
        </div>

        <div className="group p-3.5 sm:p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 hover:shadow-subtle transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2 icon-box-hover group-hover:bg-sand-tint transition-all">
            <TrendingUp className="w-4 h-4 text-wine" />
          </div>
          <span className="text-[11px] text-charcoal-muted">Confirmed Events</span>
          <p className="text-lg sm:text-xl font-bold text-success mt-0.5">{confirmedBookings.length}</p>
        </div>

        <div className="group p-3.5 sm:p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 hover:shadow-subtle transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2 icon-box-hover group-hover:bg-sand-tint transition-all">
            <Package className="w-4 h-4 text-wine" />
          </div>
          <span className="text-[11px] text-charcoal-muted">Inventory Items</span>
          <p className="text-lg sm:text-xl font-bold text-charcoal mt-0.5">{myInventory.length}</p>
        </div>

        <div className="group p-3.5 sm:p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 hover:shadow-subtle transition-all duration-200">
          <div className="w-8 h-8 rounded-lg bg-sand text-charcoal flex items-center justify-center mb-2 icon-box-hover group-hover:bg-sand-tint transition-all">
            <Briefcase className="w-4 h-4 text-wine" />
          </div>
          <span className="text-[11px] text-charcoal-muted">Past Works</span>
          <p className="text-lg sm:text-xl font-bold text-charcoal mt-0.5">{myWorks.length}</p>
        </div>
      </div>

      {/* 4. Main 2-Column Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column: Recent Bookings & Quotation Pipeline */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card">
            <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3 sm:mb-4 gap-2">
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal flex items-center gap-2 truncate">
                <CalendarCheck className="w-4 h-4 text-wine shrink-0" />
                <span className="truncate">Recent Event Bookings & Enquiries</span>
              </h2>
              <Link
                to="/bookings"
                className="text-xs font-semibold text-wine hover:underline flex items-center gap-1 shrink-0"
              >
                <span>View All ({myBookings.length})</span>
                <ArrowRight className="w-3 h-3 shrink-0" />
              </Link>
            </div>

            <div className="divide-y divide-border/60">
              {myBookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-charcoal-muted">
                  No event bookings received yet.
                </div>
              ) : (
                myBookings.slice(0, 4).map((book) => (
                  <div
                    key={book.id}
                    className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs"
                  >
                    {/* Customer info & event specs */}
                    <div className="flex items-start gap-3 min-w-0">
                      <img
                        src={book.customerAvatar}
                        alt={book.customerName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-border shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-charcoal text-sm truncate">{book.customerName}</h4>
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 sm:hidden ${
                              book.status === 'confirmed'
                                ? 'bg-success-light text-success'
                                : book.status === 'quote_received'
                                ? 'bg-sand text-charcoal'
                                : 'bg-wine-soft text-wine'
                            }`}
                          >
                            {book.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-charcoal-muted text-[11px] mt-0.5 truncate">
                          {book.eventType} • {book.eventDate}
                        </p>
                        <span className="text-[10px] text-charcoal-light truncate block">{book.location}</span>
                      </div>
                    </div>

                    {/* Status & actions (aligned cleanly on mobile) */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40 shrink-0">
                      <span
                        className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                          book.status === 'confirmed'
                            ? 'bg-success-light text-success'
                            : book.status === 'quote_received'
                            ? 'bg-sand text-charcoal'
                            : 'bg-wine-soft text-wine'
                        }`}
                      >
                        {book.status.replace('_', ' ')}
                      </span>
                      {book.totalAmount ? (
                        <p className="font-bold text-wine text-xs sm:text-sm">{formatINR(book.totalAmount)}</p>
                      ) : (
                        <p className="text-[11px] text-charcoal-muted italic">Pending Quote</p>
                      )}
                      <Link
                        to="/chat"
                        className="text-[11px] text-wine hover:underline font-semibold inline-flex items-center gap-1 active:scale-95"
                      >
                        <span>Open Chat</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
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
                {myInventory.length} Equipment & Items
              </p>
            </Link>

            <Link
              to="/portfolio"
              className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-sand flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Layers className="w-4 h-4 text-wine" />
              </div>
              <h3 className="font-bold text-charcoal text-xs sm:text-sm">Media Content</h3>
              <p className="text-[11px] text-charcoal-muted mt-1">
                {myPosts.length + myReels.length} Posts & Video Clips
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column: Inventory Alerts & Availability Calendar Shortcut */}
        <div className="space-y-4 sm:space-y-6">
          {/* Inventory Alerts Card */}
          <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-border/70">
              <h3 className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-wine shrink-0" />
                <span>Inventory & Supply Status</span>
              </h3>
              <Link to="/inventory" className="text-xs font-semibold text-wine hover:underline">
                View All
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="p-4 rounded-xl bg-success-light text-success text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>All equipment items have healthy stock levels.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-error-light/60 border border-error/20 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-charcoal truncate">{item.name}</p>
                      <p className="text-[11px] text-error font-medium">
                        Only {item.availableQuantity} of {item.totalQuantity} units left!
                      </p>
                    </div>
                    <Link
                      to="/inventory"
                      className="px-2.5 py-1 rounded-lg bg-surface border border-border hover:bg-sand/30 font-semibold text-[11px] text-charcoal shrink-0"
                    >
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability & Calendar Quick Access */}
          <div className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2">
              <Clock className="w-4 h-4 text-wine shrink-0" />
              <span>Availability & Calendar</span>
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Configure morning & evening slots or block unavailable dates to prevent client scheduling conflicts.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                to="/professional/calendar"
                className="flex-1 py-2 rounded-xl bg-sand border border-sand-dark text-charcoal text-xs font-semibold text-center hover:bg-sand/70 transition-colors"
              >
                Open Calendar
              </Link>
              <Link
                to="/professional/availability"
                className="flex-1 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold text-center transition-colors shadow-xs"
              >
                Slot Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
