import React, { useState } from 'react';
import {
  Check,
  ShieldCheck,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { BUSINESS_MODE_CONFIG } from '../../../core/config/businessModeConfig';
import { VendorBusinessMode } from '../../../types';

export const BusinessManagementSection: React.FC = () => {
  const { businessMode, setBusinessMode } = useMarketplaceStore();
  const [selectedPendingMode, setSelectedPendingMode] = useState<VendorBusinessMode>(businessMode);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [switchSuccessMessage, setSwitchSuccessMessage] = useState<string | null>(null);

  const activeConfig = BUSINESS_MODE_CONFIG[businessMode];
  const pendingConfig = BUSINESS_MODE_CONFIG[selectedPendingMode];

  const handleSelectMode = (mode: VendorBusinessMode) => {
    setSelectedPendingMode(mode);
  };

  const handleInitiateSwitch = () => {
    if (selectedPendingMode === businessMode) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSwitch = () => {
    setBusinessMode(selectedPendingMode);
    setShowConfirmModal(false);
    setSwitchSuccessMessage(
      `Successfully switched to ${BUSINESS_MODE_CONFIG[selectedPendingMode].title}. Your navigation and dashboard have updated.`
    );
    setTimeout(() => {
      setSwitchSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-xl font-bold text-charcoal tracking-tight">
          Business Operating Mode
        </h2>
        <p className="text-xs text-charcoal-muted mt-1 max-w-3xl">
          Configure how your professional vendor account operates. Switch between service bookings and product order management at any time. Your existing bookings, services, inventory, and financial balances remain safely preserved.
        </p>
      </div>

      {/* Success Notification */}
      {switchSuccessMessage && (
        <div className="p-3.5 rounded-lg bg-success-light border border-success/30 text-xs font-medium text-success flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-success" />
            <span>{switchSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSwitchSuccessMessage(null)}
            className="text-success hover:text-success-dark"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Native Mode Selector Box */}
      <div className="border border-border rounded-xl bg-surface divide-y divide-border">
        {/* Mode 1: Booking-Based Business */}
        <div
          onClick={() => handleSelectMode('BOOKING_BASED')}
          className={`p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer transition-colors ${
            selectedPendingMode === 'BOOKING_BASED'
              ? 'bg-sand/30'
              : 'hover:bg-sand/10'
          }`}
        >
          {/* Radio Indicator */}
          <div className="mt-0.5 shrink-0">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                selectedPendingMode === 'BOOKING_BASED'
                  ? 'border-wine'
                  : 'border-border bg-surface'
              }`}
            >
              {selectedPendingMode === 'BOOKING_BASED' && (
                <div className="w-2 h-2 rounded-full bg-wine" />
              )}
            </div>
          </div>

          {/* Mode Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-charcoal">
                Booking-Based Business
              </h3>
              {businessMode === 'BOOKING_BASED' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sand text-wine border border-sand-dark">
                  Active Mode
                </span>
              )}
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed mb-3">
              For professionals who provide event services and manage customer bookings (event organizers, wedding photographers, makeup artists, caterers, decorators, event halls, DJs, and planners).
            </p>

            <div className="flex flex-wrap gap-1.5">
              {[
                'Service Management',
                'Availability Calendar',
                'Slot Management',
                'Booking Requests',
                'Quotations',
                'Event Scheduling',
                'Customer Reviews',
                'Repost Management',
              ].map((feat) => (
                <span
                  key={feat}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-sand/50 text-charcoal border border-sand-dark/60"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mode 2: Order-Based Business */}
        <div
          onClick={() => handleSelectMode('ORDER_BASED')}
          className={`p-4 sm:p-5 flex items-start gap-3.5 cursor-pointer transition-colors ${
            selectedPendingMode === 'ORDER_BASED'
              ? 'bg-sand/30'
              : 'hover:bg-sand/10'
          }`}
        >
          {/* Radio Indicator */}
          <div className="mt-0.5 shrink-0">
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                selectedPendingMode === 'ORDER_BASED'
                  ? 'border-wine'
                  : 'border-border bg-surface'
              }`}
            >
              {selectedPendingMode === 'ORDER_BASED' && (
                <div className="w-2 h-2 rounded-full bg-wine" />
              )}
            </div>
          </div>

          {/* Mode Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-charcoal">
                Order-Based Business
              </h3>
              {businessMode === 'ORDER_BASED' && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sand text-wine border border-sand-dark">
                  Active Mode
                </span>
              )}
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed mb-3">
              For vendors who sell or rent products and manage customer orders (decoration sellers, equipment suppliers, furniture sellers, lighting & sound equipment, wedding accessories, and costume rentals).
            </p>

            <div className="flex flex-wrap gap-1.5">
              {[
                'Product Management',
                'Product Categories',
                'Inventory & Variants',
                'Stock Management',
                'Customer Orders',
                'Delivery & Collection',
                'Returns & Refunds',
                'Sales Analytics',
              ].map((feat) => (
                <span
                  key={feat}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-sand/50 text-charcoal border border-sand-dark/60"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="px-4 py-3.5 sm:px-5 bg-surface-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-charcoal-muted">
            {selectedPendingMode === businessMode ? (
              <span>
                <strong className="text-charcoal font-semibold">{activeConfig.title}</strong> is currently your active workspace mode.
              </span>
            ) : (
              <span>
                Selected: <strong className="text-charcoal font-semibold">{pendingConfig.title}</strong>. Click "Switch Business Mode" to update workspace views.
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={selectedPendingMode === businessMode}
            onClick={handleInitiateSwitch}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              selectedPendingMode !== businessMode
                ? 'bg-wine hover:bg-wine-dark text-white cursor-pointer'
                : 'bg-sand/60 text-charcoal-muted cursor-not-allowed opacity-60'
            }`}
          >
            Switch Business Mode
          </button>
        </div>
      </div>

      {/* Data Integrity Notice */}
      <div className="p-4 rounded-xl border border-border bg-sand/30 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-wine shrink-0 mt-0.5" />
        <div className="text-xs text-charcoal space-y-0.5">
          <p className="font-semibold text-charcoal">Data Integrity & Account Persistence</p>
          <p className="text-charcoal-muted leading-relaxed">
            Switching business modes changes your active navigation and operational dashboards. Your existing services, bookings, product inventory, order histories, customers, and financial balances remain permanently saved.
          </p>
        </div>
      </div>

      {/* Explicit Confirmation Dialog Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-xs">
          <div className="bg-surface rounded-xl border border-border shadow-elevated w-full max-w-md p-5 space-y-4">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sand text-wine flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-charcoal">
                    Confirm Business Mode Switch
                  </h3>
                  <p className="text-[11px] text-charcoal-muted">Vendor workspace reconfiguration</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-charcoal-muted hover:text-charcoal p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-charcoal">
              <p className="leading-relaxed">
                Switching to <strong className="text-wine font-semibold">{pendingConfig.title}</strong> will change your professional workspace to a {selectedPendingMode === 'ORDER_BASED' ? 'seller dashboard with product catalog and order fulfillment tools' : 'service provider dashboard with calendar bookings, slot availability, and quotations'}.
              </p>

              <div className="p-3 rounded-lg bg-sand/30 border border-sand-dark text-[11px] text-charcoal font-medium">
                "Your existing bookings, services, products, inventory and transaction history will remain saved."
              </div>

              <div className="space-y-1.5 text-[11px] text-charcoal-muted pt-1">
                <div className="flex items-center gap-2 text-charcoal">
                  <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>No data will be deleted or overwritten.</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal">
                  <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>Your vendor login and public profile remain unchanged.</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal">
                  <Check className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>Financial earnings and bank details remain accessible.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-border hover:bg-sand/30 text-xs font-medium text-charcoal transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSwitch}
                className="px-4 py-1.5 rounded-lg bg-wine hover:bg-wine-dark text-white text-xs font-semibold transition-colors"
              >
                Confirm Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
