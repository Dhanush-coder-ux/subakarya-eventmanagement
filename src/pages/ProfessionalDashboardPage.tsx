import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  PlusCircle,
  Tag,
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
  Store,
  RefreshCw,
  ShoppingBag,
  Truck,
  RotateCcw,
  CreditCard,
  DollarSign,
  Boxes,
  ClipboardList,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import { formatINR, formatDate } from '../utils';

export const ProfessionalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();
  const {
    posts,
    reels,
    works,
    services,
    inventory,
    bookings,
    orders,
    conversations,
    businessMode,
    setBusinessMode,
    updateOrderStatus,
  } = useMarketplaceStore();

  const pro = currentUser.role === 'professional' ? currentUser : null;
  const isOrderBased = businessMode === 'ORDER_BASED';

  // Current professional items
  const myPosts = posts.filter((p) => p.professionalId === currentUser.id);
  const myReels = reels.filter((r) => r.professionalId === currentUser.id);
  const myWorks = works.filter((w) => w.professionalId === currentUser.id);
  const myServices = services.filter((s) => s.professionalId === currentUser.id);
  const myInventory = inventory.filter((i) => i.professionalId === currentUser.id);
  const myBookings = bookings.filter((b) => b.professionalId === currentUser.id);
  const myOrders = orders.filter((o) => o.professionalId === currentUser.id);

  // Booking mode stats
  const pendingEnquiries = myBookings.filter((b) => b.status === 'pending');
  const quoteReceived = myBookings.filter((b) => b.status === 'quote_received');
  const confirmedBookings = myBookings.filter((b) => b.status === 'confirmed');
  const completedBookings = myBookings.filter((b) => b.status === 'completed');
  const cancelledBookings = myBookings.filter((b) => b.status === 'cancelled' || b.status === 'rejected');
  const totalServiceRevenue = myBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // Order mode stats
  const totalSalesRevenue = myOrders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = myOrders.filter((o) => o.orderStatus === 'processing');
  const processingOrders = myOrders.filter((o) => o.orderStatus === 'confirmed');
  const completedOrders = myOrders.filter((o) => o.orderStatus === 'delivered');
  const cancelledOrders = myOrders.filter((o) => o.orderStatus === 'cancelled' || o.orderStatus === 'returned');

  // Low stock inventory items
  const lowStockItems = myInventory.filter(
    (item) => item.availableQuantity <= item.lowStockThreshold
  );

  const totalUnitsInStock = myInventory.reduce((acc, i) => acc + i.totalQuantity, 0);
  const totalAllocated = myInventory.reduce((acc, i) => acc + i.allocatedQuantity, 0);

  const completeness = pro?.profileCompleteness || 90;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 animate-in fade-in duration-150">
      {/* 1. Operating Mode Banner & Quick Toggle */}
      <div className="bg-sand/40 border border-sand-dark rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-wine text-white flex items-center justify-center shrink-0 shadow-xs">
            {isOrderBased ? <Store className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xs sm:text-sm text-charcoal">
                {isOrderBased ? 'Order-Based Business Mode Active' : 'Booking-Based Business Mode Active'}
              </h2>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-sand text-wine border border-sand-dark">
                {isOrderBased ? 'Seller Console' : 'Service Console'}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-muted mt-0.5">
              {isOrderBased
                ? 'Your dashboard is optimized for products, rentals, inventory tracking, and order fulfillment.'
                : 'Your dashboard is optimized for customer appointments, booking quotes, and availability schedules.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <Link
            to="/settings/business-mode"
            className="px-3.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-sand/40 text-xs font-semibold text-charcoal flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-wine" />
            <span>Switch Business Mode</span>
          </Link>
        </div>
      </div>

      {/* 2. Welcome Profile Card */}
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
                {isOrderBased ? 'Seller Mode' : 'Booking Mode'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
          <Link
            to={isOrderBased ? '/inventory' : '/portfolio'}
            className="group w-full sm:w-auto px-5 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 text-center"
          >
            <PlusCircle className="w-4 h-4 shrink-0 icon-hover-base group-hover:scale-110 transition-transform" />
            <span>{isOrderBased ? 'Add New Product' : 'Create Post / Reel'}</span>
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

      {/* ========================================================================= */}
      {/* MODE 1: BOOKING MANAGEMENT MODE DASHBOARD (Section 5)                     */}
      {/* ========================================================================= */}
      {!isOrderBased && (
        <div className="space-y-6">
          {/* Booking Overview KPI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
              <span className="text-[11px] text-charcoal-muted">Total Bookings</span>
              <p className="text-xl sm:text-2xl font-bold text-charcoal mt-1">{myBookings.length}</p>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">All client enquiries</span>
            </div>

            <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
              <span className="text-[11px] text-charcoal-muted">Pending Requests</span>
              <p className="text-xl sm:text-2xl font-bold text-wine mt-1">{pendingEnquiries.length}</p>
              <span className="text-[10px] text-wine font-semibold mt-0.5 block">Needs response</span>
            </div>

            <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
              <span className="text-[11px] text-charcoal-muted">Confirmed Bookings</span>
              <p className="text-xl sm:text-2xl font-bold text-success mt-1">{confirmedBookings.length}</p>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">Locked in calendar</span>
            </div>

            <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
              <span className="text-[11px] text-charcoal-muted">Completed Events</span>
              <p className="text-xl sm:text-2xl font-bold text-charcoal mt-1">{completedBookings.length}</p>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">Delivered jobs</span>
            </div>

            <div className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
              <span className="text-[11px] text-charcoal-muted">Cancelled Bookings</span>
              <p className="text-xl sm:text-2xl font-bold text-error mt-1">{cancelledBookings.length}</p>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">Slots released</span>
            </div>

            <div className="p-4 bg-sand/40 rounded-2xl border border-sand-dark shadow-xs hover:border-wine/40 transition-all">
              <span className="text-[11px] text-charcoal font-bold">Total Service Revenue</span>
              <p className="text-xl sm:text-2xl font-bold text-wine mt-1">
                {formatINR(totalServiceRevenue || 85000)}
              </p>
              <span className="text-[10px] text-charcoal-muted mt-0.5 block">Confirmed jobs value</span>
            </div>
          </div>

          {/* 2-Column Booking Mode Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Recent Booking Requests & Quotation Pipeline */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card">
                <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                  <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-wine" />
                    <span>Recent Client Booking Requests</span>
                  </h3>
                  <Link to="/bookings" className="text-xs font-semibold text-wine hover:underline">
                    View All ({myBookings.length})
                  </Link>
                </div>

                <div className="divide-y divide-border/60">
                  {myBookings.length === 0 ? (
                    <div className="py-8 text-center text-xs text-charcoal-muted">
                      No client bookings received yet.
                    </div>
                  ) : (
                    myBookings.slice(0, 4).map((book) => (
                      <div
                        key={book.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={book.customerAvatar}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-border shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-charcoal">{book.customerName}</h4>
                            <p className="text-[11px] text-charcoal-muted">
                              {book.eventType} • {book.eventDate}
                            </p>
                            <span className="text-[10px] text-charcoal-muted">{book.location}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              book.status === 'confirmed'
                                ? 'bg-success-light text-success'
                                : book.status === 'quote_received'
                                ? 'bg-sand text-charcoal'
                                : 'bg-wine-soft text-wine'
                            }`}
                          >
                            {book.status.replace('_', ' ')}
                          </span>
                          <span className="font-bold text-charcoal">
                            {book.totalAmount ? formatINR(book.totalAmount) : 'Pending Quote'}
                          </span>
                          <Link to="/chat" className="text-[11px] text-wine hover:underline font-semibold">
                            Open Chat & Proposal
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Service Performance & Availability Shortcuts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/services"
                  className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 transition-all group"
                >
                  <Tag className="w-5 h-5 text-wine mb-2" />
                  <h4 className="font-bold text-sm text-charcoal">Service Packages & Pricing</h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {myServices.length} active service packages configured with inclusions and rates.
                  </p>
                </Link>

                <Link
                  to="/settings/account-bank"
                  className="p-4 bg-surface-card rounded-2xl border border-border shadow-xs hover:border-wine/40 transition-all group"
                >
                  <CreditCard className="w-5 h-5 text-wine mb-2" />
                  <h4 className="font-bold text-sm text-charcoal">Earnings & Commission Console</h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Track platform fees, view payouts, and inspect itemized transaction breakdowns.
                  </p>
                </Link>
              </div>
            </div>

            {/* Right: Upcoming Event Calendar Widget */}
            <div className="space-y-4">
              <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-wine" />
                    <span>Upcoming Calendar</span>
                  </h3>
                  <Link to="/professional/calendar" className="text-xs font-semibold text-wine hover:underline">
                    Full Calendar
                  </Link>
                </div>

                <div className="space-y-2.5 text-xs">
                  {confirmedBookings.length === 0 ? (
                    <p className="text-charcoal-muted text-xs py-4 text-center">
                      No confirmed calendar dates locked.
                    </p>
                  ) : (
                    confirmedBookings.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-sand/30 border border-sand-dark flex items-start gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-wine text-white flex flex-col items-center justify-center shrink-0">
                          <span className="text-[9px] uppercase font-bold">Nov</span>
                          <span className="text-xs font-bold leading-none">15</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-charcoal truncate">{b.eventType}</p>
                          <p className="text-[11px] text-charcoal-muted truncate">Client: {b.customerName}</p>
                          <span className="text-[10px] text-wine font-semibold block">{b.location}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-2 border-t border-border">
                  <Link
                    to="/professional/availability"
                    className="w-full py-2 rounded-xl bg-sand hover:bg-sand-dark text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-wine" />
                    <span>Configure Slot Availability</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: ORDER MANAGEMENT MODE DASHBOARD (Section 6)                       */}
      {/* ========================================================================= */}
      {isOrderBased && (
        <div className="space-y-6">
          {/* Seller Overview KPI Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <div className="p-3.5 bg-sand/40 rounded-2xl border border-sand-dark shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Total Sales</span>
              <p className="text-lg font-bold text-wine mt-1 font-mono">
                {formatINR(totalSalesRevenue)}
              </p>
              <span className="text-[10px] text-charcoal-muted">All orders</span>
            </div>

            <div className="p-3.5 bg-surface-card rounded-2xl border border-border shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Total Orders</span>
              <p className="text-lg font-bold text-charcoal mt-1">{myOrders.length}</p>
              <span className="text-[10px] text-charcoal-muted">Lifetime count</span>
            </div>

            <div className="p-3.5 bg-surface-card rounded-2xl border border-border shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Pending</span>
              <p className="text-lg font-bold text-charcoal mt-1">{pendingOrders.length}</p>
              <span className="text-[10px] text-charcoal-muted">Awaiting dispatch</span>
            </div>

            <div className="p-3.5 bg-surface-card rounded-2xl border border-border shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Processing</span>
              <p className="text-lg font-bold text-wine mt-1">{processingOrders.length}</p>
              <span className="text-[10px] text-charcoal-muted">Confirmed</span>
            </div>

            <div className="p-3.5 bg-surface-card rounded-2xl border border-border shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Completed</span>
              <p className="text-lg font-bold text-success mt-1">{completedOrders.length}</p>
              <span className="text-[10px] text-success font-medium">Delivered</span>
            </div>

            <div className="p-3.5 bg-surface-card rounded-2xl border border-border shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Cancelled</span>
              <p className="text-lg font-bold text-error mt-1">{cancelledOrders.length}</p>
              <span className="text-[10px] text-charcoal-muted">Returned/void</span>
            </div>

            <div className="p-3.5 bg-surface-card rounded-2xl border border-border shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Products</span>
              <p className="text-lg font-bold text-charcoal mt-1">{myInventory.length}</p>
              <span className="text-[10px] text-charcoal-muted">Active SKUs</span>
            </div>

            <div className="p-3.5 bg-surface-card rounded-2xl border border-border shadow-xs">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block">Low Stock</span>
              <p className={`text-lg font-bold mt-1 ${lowStockItems.length > 0 ? 'text-error' : 'text-charcoal'}`}>
                {lowStockItems.length}
              </p>
              <span className="text-[10px] text-charcoal-muted">Threshold alert</span>
            </div>
          </div>

          {/* 2-Column Seller Mode Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column: Recent Orders & Sales Chart Overview */}
            <div className="lg:col-span-2 space-y-5">
              {/* Recent Customer Orders */}
              <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-wine" />
                    <span>Recent Customer Orders</span>
                  </h3>
                  <Link to="/settings/orders" className="text-xs font-semibold text-wine hover:underline">
                    Manage Orders ({myOrders.length})
                  </Link>
                </div>

                <div className="space-y-3">
                  {myOrders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-charcoal-muted">
                      No customer orders received yet.
                    </div>
                  ) : (
                    myOrders.slice(0, 4).map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <img
                            src={ord.productImage}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-charcoal truncate">{ord.productName}</p>
                            <p className="text-[11px] text-charcoal-muted">
                              Order #{ord.orderNumber} • Client: {ord.customerName}
                            </p>
                            <span className="text-[10px] text-charcoal-muted block truncate">
                              Address: {ord.deliveryAddress}
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
                          <span className="font-bold font-mono text-wine text-sm">
                            {formatINR(ord.totalAmount)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.orderStatus === 'delivered'
                                ? 'bg-success-light text-success'
                                : ord.orderStatus === 'confirmed'
                                ? 'bg-sand text-charcoal'
                                : 'bg-surface-muted text-charcoal-muted'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                          {ord.orderStatus === 'confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(ord.id, 'dispatched', 'shipped')}
                              className="text-[10px] font-bold text-wine hover:underline"
                            >
                              Dispatch Order
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Best Selling Products & Inventory Summary */}
              <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
                    <Package className="w-4 h-4 text-wine" />
                    <span>Featured Catalog Products & Best Sellers</span>
                  </h3>
                  <Link to="/inventory" className="text-xs font-semibold text-wine hover:underline">
                    View Inventory
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {myInventory.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-surface border border-border flex items-center gap-3"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-charcoal truncate">{item.name}</p>
                        <p className="text-[11px] text-charcoal-muted font-mono">{item.sku}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-wine">
                            {formatINR(item.rentalRate || 2500)}
                          </span>
                          <span className="text-[10px] text-charcoal-muted">
                            {item.availableQuantity} of {item.totalQuantity} in stock
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Low Stock Alerts & Sales Performance */}
            <div className="space-y-5">
              {/* Low Stock Alerts */}
              <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-wine shrink-0" />
                    <span>Low Stock Alerts</span>
                  </h3>
                  <Link to="/inventory" className="text-xs font-semibold text-wine hover:underline">
                    Manage
                  </Link>
                </div>

                {lowStockItems.length === 0 ? (
                  <div className="p-4 rounded-xl bg-success-light text-success text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>All catalog items have healthy stock levels.</span>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-error-light/60 border border-error/20 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-charcoal truncate">{item.name}</p>
                          <p className="text-[11px] text-error font-medium">
                            Only {item.availableQuantity} {item.unit} available!
                          </p>
                        </div>
                        <Link
                          to="/inventory"
                          className="px-2.5 py-1 rounded-lg bg-surface border border-border font-semibold text-[11px] text-charcoal shrink-0"
                        >
                          Restock
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Inventory Asset Summary */}
              <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-3">
                <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-wine shrink-0" />
                  <span>Inventory Distribution</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between pb-1.5 border-b border-border/70">
                    <span className="text-charcoal-muted">Total Units Tracked</span>
                    <span className="font-bold font-mono text-charcoal">{totalUnitsInStock}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-border/70">
                    <span className="text-charcoal-muted">Currently Allocated to Events</span>
                    <span className="font-bold font-mono text-wine">{totalAllocated}</span>
                  </div>
                  <div className="flex justify-between pb-1.5 border-b border-border/70">
                    <span className="text-charcoal-muted">Reusable Equipment Assets</span>
                    <span className="font-bold font-mono text-charcoal">
                      {myInventory.filter((i) => i.inventoryType === 'asset').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-muted">Consumables & Packaging</span>
                    <span className="font-bold font-mono text-charcoal">
                      {myInventory.filter((i) => i.inventoryType === 'consumable').length}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <Link
                    to="/inventory"
                    className="w-full py-2 rounded-xl bg-sand hover:bg-sand-dark text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-wine" />
                    <span>Open Inventory Studio</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
