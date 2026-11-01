import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { ProductOrder, OrderStatus, DeliveryStatus } from '../../../types';
import { formatINR, formatDate } from '../../../utils';

export const OrdersManagementSection: React.FC = () => {
  const { currentUser, accountType } = useAuthStore();
  const { orders, updateOrderStatus } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter orders for active user role
  const relevantOrders = orders.filter((o) =>
    isCustomer ? o.customerId === currentUser.id : o.professionalId === currentUser.id
  );

  const filteredOrders = relevantOrders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.productName.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        (isCustomer ? o.professionalName.toLowerCase().includes(q) : o.customerName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'processing':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sand text-charcoal border border-sand-dark">Processing</span>;
      case 'confirmed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-wine-soft text-wine border border-wine/20">Confirmed</span>;
      case 'dispatched':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sand text-wine border border-sand-dark">Dispatched</span>;
      case 'delivered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-light text-success border border-success/30">Delivered</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-error-light text-error border border-error/30">Cancelled</span>;
      case 'returned':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-muted text-charcoal-muted border border-border">Returned</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div>
        <h2 className="text-xl font-bold text-charcoal">
          {isCustomer ? 'My Orders' : 'Orders Management'}
        </h2>
        <p className="text-xs text-charcoal-muted mt-0.5">
          {isCustomer
            ? 'Track product deliveries, equipment rentals, dispatch progress and returns'
            : 'Fulfill client equipment hire orders, manage dispatch statuses, and monitor returns'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-card rounded-2xl border border-border p-3 sm:p-4 shadow-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'processing', 'confirmed', 'dispatched', 'delivered', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-wine text-white shadow-xs'
                  : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-charcoal-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal placeholder:text-charcoal-muted/70 outline-none focus:border-wine"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-surface-card rounded-2xl border border-border p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-sand text-wine flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-charcoal">No Orders Found</h4>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              {isCustomer
                ? 'You have not placed any gear rentals or product orders yet.'
                : 'No client orders match the selected filter criteria.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-surface-card rounded-2xl border border-border p-4 sm:p-5 shadow-card space-y-3.5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-charcoal">
                      {ord.orderNumber}
                    </span>
                    {getStatusBadge(ord.orderStatus)}
                  </div>
                  <p className="text-[11px] text-charcoal-muted">
                    Placed on {formatDate(ord.orderDate)} • {isCustomer ? `Vendor: ${ord.professionalName}` : `Customer: ${ord.customerName}`}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted block">Total Order</span>
                  <p className="text-sm font-bold text-wine">{formatINR(ord.totalAmount)}</p>
                </div>
              </div>

              {/* Product Info & Quantity */}
              <div className="flex items-start gap-3.5">
                <img
                  src={ord.productImage}
                  alt={ord.productName}
                  className="w-16 h-16 rounded-xl object-cover border border-border shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <h5 className="font-bold text-xs sm:text-sm text-charcoal truncate">
                    {ord.productName}
                  </h5>
                  <p className="text-xs text-charcoal-muted">
                    Quantity: <span className="font-semibold text-charcoal">{ord.quantity} unit(s)</span> • Rate: {formatINR(ord.unitPrice)}/unit
                  </p>
                  <p className="text-[11px] text-charcoal-muted truncate">
                    Dispatch Address: {ord.deliveryAddress}
                  </p>
                  {ord.trackingNumber && (
                    <p className="text-[10px] text-wine font-semibold flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>Tracking: {ord.trackingNumber} ({ord.deliveryStatus})</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-border/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="text-[11px] text-charcoal-muted">
                  Delivery Status: <strong className="text-charcoal capitalize">{ord.deliveryStatus.replace(/_/g, ' ')}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {!isCustomer && ord.orderStatus === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'dispatched', 'shipped')}
                      className="px-3 py-1.5 rounded-lg bg-sand hover:bg-sand-dark text-charcoal font-semibold text-xs transition-colors"
                    >
                      Mark Dispatched
                    </button>
                  )}

                  {!isCustomer && ord.orderStatus === 'dispatched' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'delivered', 'delivered')}
                      className="px-3 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white font-semibold text-xs shadow-xs transition-colors"
                    >
                      Mark Delivered
                    </button>
                  )}

                  {isCustomer && (ord.orderStatus === 'processing' || ord.orderStatus === 'confirmed') && (
                    <button
                      onClick={() => {
                        if (window.confirm('Cancel this equipment order?')) {
                          updateOrderStatus(ord.id, 'cancelled');
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-border hover:bg-error-light hover:text-error text-charcoal-muted text-xs font-semibold transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

