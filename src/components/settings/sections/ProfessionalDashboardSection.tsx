import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Eye,
  Heart,
  Briefcase,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Repeat2,
  Package,
  Calendar,
  ArrowRight,
  ExternalLink,
  Store,
  ClipboardList,
  Boxes,
  Truck,
  RotateCcw,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { formatINR } from '../../../utils';

export const ProfessionalDashboardSection: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const { posts, reels, works, inventory, bookings, orders, repostRequests, businessMode } = useMarketplaceStore();

  const pro = currentUser.role === 'professional' ? currentUser : null;

  if (!pro) {
    return (
      <div className="p-8 text-center text-charcoal-muted">
        The Professional Dashboard is exclusively available for vendor accounts.
      </div>
    );
  }

  const isOrderBased = businessMode === 'ORDER_BASED';

  const myPosts = posts.filter((p) => p.professionalId === currentUser.id);
  const myReels = reels.filter((r) => r.professionalId === currentUser.id);
  const myWorks = works.filter((w) => w.professionalId === currentUser.id);
  const myInventory = inventory.filter((i) => i.professionalId === currentUser.id);
  const myBookings = bookings.filter((b) => b.professionalId === currentUser.id);
  const myOrders = orders.filter((o) => o.professionalId === currentUser.id);
  const myReposts = repostRequests.filter((r) => r.professionalId === currentUser.id);

  const totalFollowers = pro.followersCount || 1240;
  const profileViews = 8420;
  const totalEngagement =
    myPosts.reduce((acc, p) => acc + p.likesCount, 0) +
    myReels.reduce((acc, r) => acc + r.likesCount, 0);

  // Booking stats
  const completedBookings = myBookings.filter((b) => b.status === 'completed').length;
  const confirmedBookings = myBookings.filter((b) => b.status === 'confirmed').length;
  const pendingEnquiries = myBookings.filter((b) => b.status === 'pending').length;
  const conversionRate = myBookings.length > 0 ? Math.round(((confirmedBookings + completedBookings) / myBookings.length) * 100) : 68;

  // Order stats
  const totalSalesRevenue = myOrders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredOrders = myOrders.filter((o) => o.orderStatus === 'delivered').length;
  const activeOrders = myOrders.filter((o) => o.orderStatus === 'confirmed' || o.orderStatus === 'processing').length;
  const cancelledOrders = myOrders.filter((o) => o.orderStatus === 'cancelled' || o.orderStatus === 'returned').length;

  const approvedReposts = myReposts.filter((r) => r.status === 'APPROVED').length;
  const pendingReposts = myReposts.filter((r) => r.status === 'PENDING').length;

  const lowStockItems = myInventory.filter((i) => i.availableQuantity <= i.lowStockThreshold);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-charcoal">
              {isOrderBased ? 'Seller & Product Analytics' : 'Professional Vendor Analytics'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand text-wine border border-sand-dark">
              {isOrderBased ? 'Order Mode' : 'Booking Mode'}
            </span>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            {isOrderBased
              ? 'Key sales metrics, order dispatch velocity, inventory health, and customer purchases.'
              : 'Key operational metrics, client conversion, calendar bookings, and syndicated repost performance.'}
          </p>
        </div>

        <Link
          to="/dashboard"
          className="px-3.5 py-1.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Open Full Dashboard</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Profile Completion Bar */}
      <div className="p-4 rounded-2xl bg-sand/35 border border-sand-dark space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-charcoal flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-wine" />
            <span>Profile Readiness Score</span>
          </span>
          <span className="font-bold text-wine">{pro.profileCompleteness || 95}% Complete</span>
        </div>
        <div className="w-full h-2 rounded-full bg-sand-dark overflow-hidden">
          <div
            className="h-full bg-wine rounded-full transition-all duration-500"
            style={{ width: `${pro.profileCompleteness || 95}%` }}
          />
        </div>
        <p className="text-[11px] text-charcoal-muted">
          Your profile ranks higher in search results when catalog packages, verified inventory, and reels are maintained.
        </p>
      </div>

      {/* Grid of 9 Key Metrics Linked to Modules */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Metric 1: Mode Specific Primary Revenue */}
        <Link
          to="/settings/account-bank"
          className="bg-surface-card p-4 rounded-2xl border border-border hover:border-wine/40 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold">
              {isOrderBased ? 'Gross Product Sales' : 'Confirmed Booking Revenue'}
            </span>
            <TrendingUp className="w-4 h-4 text-wine group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-wine font-mono">
            {formatINR(isOrderBased ? totalSalesRevenue : 85000)}
          </p>
          <span className="text-[10px] text-success font-medium flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> Verified Ledger Earnings
          </span>
        </Link>

        {/* Metric 2: Orders vs Bookings */}
        <Link
          to={isOrderBased ? '/settings/orders' : '/bookings'}
          className="bg-surface-card p-4 rounded-2xl border border-border hover:border-wine/40 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold">{isOrderBased ? 'Customer Orders' : 'Event Bookings'}</span>
            {isOrderBased ? (
              <ClipboardList className="w-4 h-4 text-wine group-hover:scale-110 transition-transform" />
            ) : (
              <Calendar className="w-4 h-4 text-wine group-hover:scale-110 transition-transform" />
            )}
          </div>
          <p className="text-2xl font-bold text-charcoal">{isOrderBased ? myOrders.length : myBookings.length}</p>
          <span className="text-[10px] text-charcoal-muted mt-1 block">
            {isOrderBased ? `${activeOrders} active dispatches` : `${pendingEnquiries} pending review`}
          </span>
        </Link>

        {/* Metric 3: Total Followers */}
        <Link
          to={`/profile/${currentUser.id}`}
          className="bg-surface-card p-4 rounded-2xl border border-border hover:border-wine/40 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold">Total Followers</span>
            <Users className="w-4 h-4 text-wine group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{totalFollowers.toLocaleString()}</p>
          <span className="text-[10px] text-success font-medium flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-2.5 h-2.5" /> +12% this month
          </span>
        </Link>

        {/* Metric 4: Profile Views */}
        <div className="bg-surface-card p-4 rounded-2xl border border-border hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold">Profile Views</span>
            <Eye className="w-4 h-4 text-wine" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{profileViews.toLocaleString()}</p>
          <span className="text-[10px] text-charcoal-muted mt-1 block">Past 30 days reach</span>
        </div>

        {/* Metric 5: Customer Inquiries */}
        <Link
          to="/chat"
          className="bg-surface-card p-4 rounded-2xl border border-border hover:border-wine/40 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold">Customer Chats</span>
            <MessageSquare className="w-4 h-4 text-wine group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-charcoal">
            {isOrderBased ? myOrders.length : pendingEnquiries}
          </p>
          <span className="text-[10px] text-charcoal-muted mt-1 block">Direct client inquiries</span>
        </Link>

        {/* Metric 6: Inventory or Past Works */}
        <Link
          to="/inventory"
          className="bg-surface-card p-4 rounded-2xl border border-border hover:border-wine/40 hover:shadow-card transition-all group"
        >
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-xs font-semibold">
              {isOrderBased ? 'Inventory Products' : 'Tracked Gear Units'}
            </span>
            <Package className="w-4 h-4 text-wine group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl font-bold text-charcoal">{myInventory.length} SKUs</p>
          <span className="text-[10px] text-error font-medium mt-1 block">
            {lowStockItems.length > 0 ? `${lowStockItems.length} low in stock` : 'Healthy stock levels'}
          </span>
        </Link>
      </div>

      {/* Mode Switch Card Shortcut */}
      <div className="p-4 rounded-2xl bg-surface-card border border-border flex items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sand/60 text-wine flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-charcoal">
              Operating Mode: {isOrderBased ? 'Order-Based Seller Mode' : 'Booking-Based Service Mode'}
            </h4>
            <p className="text-xs text-charcoal-muted">
              Configure tailored navigation and view management preferences
            </p>
          </div>
        </div>
        <Link
          to="/settings/business-mode"
          className="px-3.5 py-1.5 rounded-xl border border-border hover:bg-sand/30 text-xs font-semibold text-charcoal flex items-center gap-1 shrink-0"
        >
          <span>Switch Mode</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
