import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  Trash2,
  Info,
  Calendar,
  IndianRupee,
  AlertCircle,
  FileCheck2,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  RotateCcw,
  Sparkles,
  Download,
  Filter,
  Search,
  ExternalLink,
  ChevronDown,
  Check,
  X,
  Sliders,
  DollarSign,
  Receipt,
  FileText,
  Percent,
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useMarketplaceStore } from '../../../store/useMarketplaceStore';
import { FinancialService } from '../../../services/financialService';
import {
  DateFilterRange,
  FinancialTransaction,
  FinancialTransactionType,
  FinancialTransactionStatus,
  PayoutStatus,
  RefundStatus,
  SubscriptionStatus,
  BillingFrequency,
} from '../../../types';
import { mockAvailableSubscriptionPlans } from '../../../data/mockFinancialData';
import { formatINR, formatDate } from '../../../utils';

export const AccountBankSection: React.FC = () => {
  const { currentUser, accountType } = useAuthStore();
  const {
    customerBilling,
    updateCustomerBilling,
    financialTransactions,
    commissionRules,
    payouts,
    subscriptions,
    subscriptionInvoices,
    refunds,
    vendorBankAccount,
    requestPayout,
    updateCommissionRule,
    updateVendorBankAccount,
    processRefund,
    upgradeSubscription,
  } = useMarketplaceStore();

  const isCustomer = accountType === 'customer';

  // Sub-Navigation Tabs for Professional Financial Management
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ledger' | 'payouts' | 'commission' | 'subscriptions' | 'refunds' | 'bank'
  >('overview');

  // Date Range Filter
  const [dateFilter, setDateFilter] = useState<DateFilterRange>('this_year');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  // Transaction Ledger Filters
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [ledgerCategoryFilter, setLedgerCategoryFilter] = useState<string>('all');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<string>('all');
  const [ledgerSortOrder, setLedgerSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Interactive Modals
  const [selectedTxnForDrawer, setSelectedTxnForDrawer] = useState<FinancialTransaction | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmountInput, setPayoutAmountInput] = useState<string>('');
  const [payoutFormError, setPayoutFormError] = useState<string | null>(null);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // Upgrade Plan Modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlanFreq, setSelectedPlanFreq] = useState<BillingFrequency>('monthly');

  // Invoice Preview Modal
  const [previewInvoice, setPreviewInvoice] = useState<any | null>(null);

  // Commission Edit Modal
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editCommissionRate, setEditCommissionRate] = useState<number>(5);

  // Bank Info Edit Modal
  const [showBankEditModal, setShowBankEditModal] = useState(false);
  const [bankEditForm, setBankEditForm] = useState({
    accountHolderName: vendorBankAccount.accountHolderName,
    bankName: vendorBankAccount.bankName,
    maskedAccountNumber: vendorBankAccount.maskedAccountNumber,
    ifscCode: vendorBankAccount.ifscCode,
    upiId: vendorBankAccount.upiId,
    payoutPreference: vendorBankAccount.payoutPreference || 'weekly',
  });

  // Customer Add Payment Method Form
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardLast4, setNewCardLast4] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');

  // Centralized Financial Summary Calculation
  const financialSummary = useMemo(() => {
    return FinancialService.calculateFinancialSummary(
      financialTransactions,
      payouts,
      refunds,
      dateFilter,
      customStart,
      customEnd
    );
  }, [financialTransactions, payouts, refunds, dateFilter, customStart, customEnd]);

  // Filtered Ledger Transactions
  const filteredLedger = useMemo(() => {
    let result = financialTransactions.filter((txn) => {
      // Date filter
      if (!FinancialService.isWithinDateRange(txn.createdAt, dateFilter, customStart, customEnd)) {
        return false;
      }
      // Category filter
      if (ledgerCategoryFilter !== 'all' && txn.transactionType !== ledgerCategoryFilter) {
        return false;
      }
      // Status filter
      if (ledgerStatusFilter !== 'all' && txn.status !== ledgerStatusFilter) {
        return false;
      }
      // Search filter
      if (ledgerSearch.trim()) {
        const q = ledgerSearch.toLowerCase();
        const refMatch = txn.referenceId?.toLowerCase().includes(q);
        const descMatch = txn.description?.toLowerCase().includes(q);
        const idMatch = txn.id.toLowerCase().includes(q);
        const custMatch = txn.metadata?.customerName?.toLowerCase().includes(q);
        return refMatch || descMatch || idMatch || custMatch;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return ledgerSortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

    return result;
  }, [
    financialTransactions,
    dateFilter,
    customStart,
    customEnd,
    ledgerCategoryFilter,
    ledgerStatusFilter,
    ledgerSearch,
    ledgerSortOrder,
  ]);

  // Active Subscription
  const activeSubscription = subscriptions[0] || {
    id: 'sub-active-1',
    planName: 'Pro Vendor Growth Tier',
    amount: 2999,
    billingFrequency: 'monthly',
    startDate: '2026-04-01T00:00:00Z',
    nextBillingDate: '2026-11-01T00:00:00Z',
    status: 'ACTIVE' as SubscriptionStatus,
  };

  // Payout Handlers
  const handleOpenPayout = () => {
    setPayoutAmountInput('');
    setPayoutFormError(null);
    setShowPayoutModal(true);
  };

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutFormError(null);
    const amt = parseFloat(payoutAmountInput);

    const res = requestPayout(amt, vendorBankAccount.id);
    if (!res.success) {
      setPayoutFormError(res.message);
      return;
    }

    setPayoutSuccessMsg(res.message);
    setShowPayoutModal(false);
    setTimeout(() => setPayoutSuccessMsg(null), 5000);
  };

  // Commission Rule Edit
  const handleSaveCommissionRule = (ruleId: string) => {
    updateCommissionRule(ruleId, editCommissionRate);
    setEditingRuleId(null);
  };

  // Bank Edit Save
  const handleSaveBankEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVendorBankAccount(bankEditForm);
    setShowBankEditModal(false);
  };

  // Process Refund Handler
  const handleProcessRefund = (refundId: string) => {
    const res = processRefund(refundId);
    if (res.success) {
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  // Customer Card Actions
  const handleAddCustomerCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardLast4.length === 4) {
      const newCard = {
        id: 'card-' + Date.now(),
        cardType: 'visa' as const,
        last4: newCardLast4,
        expiry: newCardExpiry || '12/29',
        isDefault: false,
      };
      updateCustomerBilling({
        savedCards: [...customerBilling.savedCards, newCard],
      });
      setShowAddCard(false);
      setNewCardLast4('');
      setNewCardExpiry('');
    }
  };

  const handleRemoveCustomerCard = (cardId: string) => {
    updateCustomerBilling({
      savedCards: customerBilling.savedCards.filter((c) => c.id !== cardId),
    });
  };

  // Helper badge for transaction types
  const getTransactionTypeBadge = (type: FinancialTransactionType) => {
    switch (type) {
      case 'BOOKING_PAYMENT':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-wine-soft text-wine border border-wine/20">
            Booking Service
          </span>
        );
      case 'PRODUCT_SALE':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-success-light text-success border border-success/30">
            Product Sale
          </span>
        );
      case 'RENTAL_PAYMENT':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sand text-charcoal border border-sand-dark">
            Equipment Rental
          </span>
        );
      case 'PAYOUT':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface-muted text-charcoal border border-border">
            Bank Payout
          </span>
        );
      case 'SUBSCRIPTION_PAYMENT':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-charcoal/10 text-charcoal border border-charcoal/20">
            Platform Subscription
          </span>
        );
      case 'CUSTOMER_REFUND':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-error-light text-error border border-error/30">
            Customer Refund
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-surface text-charcoal-muted border border-border">
            {type.replace(/_/g, ' ')}
          </span>
        );
    }
  };

  // =========================================================================
  // CUSTOMER BILLING VIEW (When accountType === 'customer')
  // =========================================================================
  if (isCustomer) {
    return (
      <div className="space-y-6 animate-in fade-in duration-150">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Account and Payment Preferences</h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Manage saved payment methods, UPI identifiers, and your personal billing transaction history.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-sand/40 border border-sand-dark flex items-start gap-2.5 text-xs text-charcoal">
          <Info className="w-4 h-4 text-wine shrink-0 mt-0.5" />
          <p className="text-[11px] text-charcoal-muted leading-relaxed">
            <strong className="text-charcoal font-semibold">Security Note:</strong> Subakarya uses bank-grade 256-bit AES tokenization. Real card credentials or account numbers are never stored in plaintext. Fictional demo placeholders are demonstrated below.
          </p>
        </div>

        {/* Customer Saved Cards & History */}
        <div className="space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-charcoal">Saved Payment Methods</h3>
                <p className="text-xs text-charcoal-muted">Quick checkout for service booking deposits and equipment rentals</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCard(!showAddCard)}
                className="px-3 py-1.5 rounded-xl bg-sand hover:bg-sand-dark text-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Mock Card</span>
              </button>
            </div>

            {showAddCard && (
              <form onSubmit={handleAddCustomerCard} className="p-3.5 rounded-xl bg-surface border border-border space-y-3 animate-in fade-in duration-150">
                <p className="text-xs font-bold text-charcoal">Simulate Adding a Card</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="Last 4 Digits (e.g. 5612)"
                    value={newCardLast4}
                    onChange={(e) => setNewCardLast4(e.target.value.replace(/\D/g, ''))}
                    className="px-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                    required
                  />
                  <input
                    type="text"
                    placeholder="MM/YY (e.g. 08/29)"
                    value={newCardExpiry}
                    onChange={(e) => setNewCardExpiry(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold text-charcoal-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-lg bg-wine text-white text-xs font-bold shadow-xs"
                  >
                    Save Card
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {customerBilling.savedCards.map((card) => (
                <div
                  key={card.id}
                  className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sand/60 text-wine flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal uppercase tracking-wider">
                        {card.cardType} •••• {card.last4}
                      </p>
                      <p className="text-[10px] text-charcoal-muted">Expires {card.expiry}</p>
                    </div>
                  </div>
                  {card.isDefault ? (
                    <span className="text-[10px] font-bold text-wine bg-sand/60 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRemoveCustomerCard(card.id)}
                      className="p-1 text-charcoal-muted hover:text-error transition-colors"
                      title="Remove Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {customerBilling.savedUpi.map((upi) => (
                <div
                  key={upi.id}
                  className="p-3.5 rounded-xl border border-border bg-surface flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-success-light text-success flex items-center justify-center shrink-0 font-bold text-xs">
                      UPI
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal truncate max-w-[160px]">
                        {upi.upiId}
                      </p>
                      <p className="text-[10px] text-success font-medium">Instant Verification Active</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-charcoal-muted bg-sand/40 px-2 py-0.5 rounded-full">
                    Linked
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment & Refund History */}
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <h3 className="font-bold text-sm text-charcoal">Recent Transaction History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                    <th className="pb-2.5">Date</th>
                    <th className="pb-2.5">Description</th>
                    <th className="pb-2.5">Reference</th>
                    <th className="pb-2.5">Amount</th>
                    <th className="pb-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {customerBilling.paymentHistory.map((txn) => (
                    <tr key={txn.id} className="hover:bg-sand/15 transition-colors">
                      <td className="py-2.5 text-charcoal-muted whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-2.5 font-medium text-charcoal">{txn.description}</td>
                      <td className="py-2.5 text-charcoal-muted font-mono text-[10px]">
                        {txn.reference}
                      </td>
                      <td className="py-2.5 font-bold text-charcoal">{formatINR(txn.amount)}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-light text-success">
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {customerBilling.refundHistory.map((ref) => (
                    <tr key={ref.id} className="hover:bg-sand/15 transition-colors">
                      <td className="py-2.5 text-charcoal-muted whitespace-nowrap">
                        {formatDate(ref.date)}
                      </td>
                      <td className="py-2.5 font-medium text-charcoal">{ref.description}</td>
                      <td className="py-2.5 text-charcoal-muted font-mono text-[10px]">
                        {ref.reference}
                      </td>
                      <td className="py-2.5 font-bold text-wine">+{formatINR(ref.amount)}</td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sand text-wine">
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // COMPLETE PROFESSIONAL FINANCIAL MANAGEMENT DASHBOARD (Parts C, D, E, F)
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header & Date Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-wine bg-sand/60 px-2.5 py-0.5 rounded-full border border-sand-dark">
            Vendor Financial Console
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal mt-1">
            Account & Bank Financial Dashboard
          </h2>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Transparent revenue tracking, platform commission breakdown, settlement payouts, and unified ledger.
          </p>
        </div>

        {/* Date Filter & Request Payout CTA */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 bg-surface-card p-1 rounded-xl border border-border shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-charcoal-muted ml-2 shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilterRange)}
              className="text-xs font-semibold bg-transparent text-charcoal outline-none pr-3 py-1 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="this_year">This Year (2026)</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {dateFilter === 'custom' && (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2 py-1 text-xs rounded-xl border border-border bg-surface text-charcoal"
              />
              <span className="text-xs text-charcoal-muted">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2 py-1 text-xs rounded-xl border border-border bg-surface text-charcoal"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenPayout}
            className="px-4 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Request Payout</span>
          </button>
        </div>
      </div>

      {/* Payout Success Alert */}
      {payoutSuccessMsg && (
        <div className="p-4 rounded-2xl bg-success-light border border-success/30 text-xs font-semibold text-success flex items-start gap-3 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-success" />
          <div className="flex-1">
            <p className="font-bold text-sm text-success">Payout Initiated</p>
            <p className="text-[11px] text-charcoal-muted mt-0.5">{payoutSuccessMsg}</p>
          </div>
          <button onClick={() => setPayoutSuccessMsg(null)}>
            <X className="w-4 h-4 text-success" />
          </button>
        </div>
      )}

      {/* 8. Six Responsive Financial Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Gross Revenue */}
        <div className="bg-surface-card p-4 rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-1.5">
            <span className="text-[11px] font-semibold">Total Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-charcoal-muted" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-charcoal">
            {formatINR(financialSummary.grossRevenue)}
          </p>
          <span className="text-[10px] text-charcoal-muted mt-0.5 block">Before commission</span>
        </div>

        {/* Platform Commission */}
        <div className="bg-surface-card p-4 rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-1.5">
            <span className="text-[11px] font-semibold">Platform Commission</span>
            <Percent className="w-4 h-4 text-wine" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-wine">
            {formatINR(financialSummary.platformCommission)}
          </p>
          <span className="text-[10px] text-wine font-medium mt-0.5 block">Configured demo rates</span>
        </div>

        {/* Net Earnings */}
        <div className="bg-surface-card p-4 rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-1.5">
            <span className="text-[11px] font-semibold">Net Earnings</span>
            <ArrowDownLeft className="w-4 h-4 text-success" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-success">
            {formatINR(financialSummary.netEarnings)}
          </p>
          <span className="text-[10px] text-charcoal-muted mt-0.5 block">Gross minus charges</span>
        </div>

        {/* Available Balance */}
        <div className="bg-sand/40 p-4 rounded-2xl border border-sand-dark shadow-xs hover:border-wine/40 transition-all">
          <div className="flex items-center justify-between text-charcoal mb-1.5">
            <span className="text-[11px] font-bold">Available Balance</span>
            <DollarSign className="w-4 h-4 text-wine" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-charcoal">
            {formatINR(financialSummary.availableBalance)}
          </p>
          <span className="text-[10px] text-wine font-semibold mt-0.5 block">Eligible for payout</span>
        </div>

        {/* Pending Balance */}
        <div className="bg-surface-card p-4 rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-1.5">
            <span className="text-[11px] font-semibold">Pending Balance</span>
            <Clock className="w-4 h-4 text-charcoal-muted" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-charcoal">
            {formatINR(financialSummary.pendingBalance)}
          </p>
          <span className="text-[10px] text-charcoal-muted mt-0.5 block">Awaiting settlement</span>
        </div>

        {/* Total Paid Out */}
        <div className="bg-surface-card p-4 rounded-2xl border border-border shadow-xs hover:border-wine/30 transition-all">
          <div className="flex items-center justify-between text-charcoal-muted mb-1.5">
            <span className="text-[11px] font-semibold">Total Paid Out</span>
            <CheckCircle2 className="w-4 h-4 text-charcoal-muted" />
          </div>
          <p className="text-lg sm:text-xl font-bold text-charcoal">
            {formatINR(financialSummary.totalPaidOut)}
          </p>
          <span className="text-[10px] text-charcoal-muted mt-0.5 block">Disbursed to bank</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-border pb-1">
        {[
          { id: 'overview', label: 'Financial Overview', count: undefined },
          { id: 'ledger', label: 'Unified Ledger', count: filteredLedger.length },
          { id: 'payouts', label: 'Payouts & Settlement', count: payouts.length },
          { id: 'commission', label: 'Platform Commission & Rules', count: commissionRules.length },
          { id: 'subscriptions', label: 'Subscription Billing', count: subscriptionInvoices.length },
          { id: 'refunds', label: 'Refunds & Adjustments', count: refunds.length },
          { id: 'bank', label: 'Bank & Settlement Details', count: undefined },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-wine text-white shadow-xs'
                : 'text-charcoal-muted hover:text-charcoal hover:bg-sand/30'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-sand text-charcoal'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: FINANCIAL OVERVIEW & EARNINGS BREAKDOWN                         */}
      {/* ===================================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Insights Banner */}
          <div className="bg-sand/30 rounded-2xl border border-sand-dark p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-charcoal flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-wine" />
                <span>Financial Health Status: Excellent</span>
              </h3>
              <p className="text-xs text-charcoal-muted">
                Available payout balance is{' '}
                <strong className="text-charcoal">{formatINR(financialSummary.availableBalance)}</strong>. You have{' '}
                {refunds.filter((r) => r.status === 'UNDER_REVIEW').length} pending refund review requests.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('ledger')}
                className="px-3.5 py-1.5 rounded-xl border border-border bg-surface text-charcoal text-xs font-semibold hover:bg-sand/30 transition-colors"
              >
                View Ledger
              </button>
              <button
                onClick={handleOpenPayout}
                className="px-4 py-1.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold shadow-xs transition-colors"
              >
                Withdraw Funds
              </button>
            </div>
          </div>

          {/* 2-Column Overview Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left: Net Earnings vs Deductions Breakdown */}
            <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
              <h3 className="font-bold text-sm text-charcoal">Revenue Breakdown & Deductions</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-border/70">
                  <span className="text-charcoal-muted">Gross Order & Booking Volume</span>
                  <span className="font-bold text-charcoal font-mono">
                    {formatINR(financialSummary.grossRevenue)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/70">
                  <div className="flex items-center gap-1.5">
                    <span className="text-charcoal-muted">Platform Commission Deducted</span>
                    <span className="text-[10px] text-wine font-semibold bg-sand/60 px-1.5 py-0.2 rounded">
                      Transparent
                    </span>
                  </div>
                  <span className="font-bold text-wine font-mono">
                    -{formatINR(financialSummary.platformCommission)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/70">
                  <span className="text-charcoal-muted">Customer Refunds & Reversals</span>
                  <span className="font-bold text-charcoal font-mono">
                    -{formatINR(financialSummary.totalRefunds)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/70">
                  <span className="text-charcoal-muted">Platform Subscription Fees</span>
                  <span className="font-bold text-charcoal font-mono">
                    -{formatINR(financialSummary.totalSubscriptions)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-sm font-bold">
                  <span className="text-charcoal">Net Realized Vendor Earnings</span>
                  <span className="text-success font-mono">
                    {formatINR(financialSummary.netEarnings)}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Active Commission Rates Snapshot */}
            <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-charcoal">Current Platform Commission Rates</h3>
                <button
                  onClick={() => setActiveTab('commission')}
                  className="text-xs text-wine font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Configure Rules</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {commissionRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-charcoal">{rule.category}</p>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-sand/60 text-charcoal">
                          {rule.businessMode}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-muted mt-0.5">{rule.description}</p>
                    </div>
                    <span className="text-base font-bold text-wine bg-wine-soft/60 px-3 py-1 rounded-xl">
                      {rule.commissionPercentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: UNIFIED FINANCIAL TRANSACTION HISTORY (LEDGER) (Section 14)    */}
      {/* ===================================================================== */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Ledger Search & Filters */}
          <div className="bg-surface-card rounded-2xl border border-border p-4 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search by Transaction ID, Reference, or Customer..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Category Filter */}
              <select
                value={ledgerCategoryFilter}
                onChange={(e) => setLedgerCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-border bg-surface text-charcoal font-medium outline-none"
              >
                <option value="all">All Categories</option>
                <option value="BOOKING_PAYMENT">Booking Payments</option>
                <option value="PRODUCT_SALE">Product Sales</option>
                <option value="RENTAL_PAYMENT">Gear Rentals</option>
                <option value="SUBSCRIPTION_PAYMENT">Subscriptions</option>
                <option value="CUSTOMER_REFUND">Refunds</option>
                <option value="PAYOUT">Disbursed Payouts</option>
              </select>

              {/* Status Filter */}
              <select
                value={ledgerStatusFilter}
                onChange={(e) => setLedgerStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-border bg-surface text-charcoal font-medium outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="REVERSED">Reversed</option>
              </select>

              {/* Sort Order */}
              <button
                type="button"
                onClick={() => setLedgerSortOrder(ledgerSortOrder === 'newest' ? 'oldest' : 'newest')}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface text-charcoal font-semibold hover:bg-sand/30 transition-colors"
              >
                Sort: {ledgerSortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-surface-card rounded-2xl border border-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[720px]">
                <thead className="bg-surface-muted text-charcoal-muted font-bold uppercase tracking-wider text-[10px] border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Transaction / Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Reference</th>
                    <th className="py-3 px-4 text-right">Gross Amount</th>
                    <th className="py-3 px-4 text-right">Platform Comm.</th>
                    <th className="py-3 px-4 text-right">Net Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-charcoal-muted">
                        No transactions found for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((txn) => {
                      const isCredit = txn.netAmount > 0;
                      return (
                        <tr
                          key={txn.id}
                          className="hover:bg-sand/15 transition-colors cursor-pointer"
                          onClick={() => setSelectedTxnForDrawer(txn)}
                        >
                          <td className="py-3 px-4">
                            <p className="font-bold text-charcoal truncate max-w-[220px]">
                              {txn.description || txn.id}
                            </p>
                            <span className="text-[10px] text-charcoal-muted">
                              {formatDate(txn.createdAt)} • ID: {txn.id}
                            </span>
                          </td>

                          <td className="py-3 px-4">{getTransactionTypeBadge(txn.transactionType)}</td>

                          <td className="py-3 px-4 font-mono text-[11px] text-charcoal">
                            {txn.referenceId}
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold text-charcoal">
                            {formatINR(txn.grossAmount)}
                          </td>

                          <td className="py-3 px-4 text-right font-mono text-wine font-medium">
                            {txn.commissionAmount > 0 ? `-${formatINR(txn.commissionAmount)}` : '₹0'}
                          </td>

                          <td className="py-3 px-4 text-right font-mono font-bold">
                            <span className={isCredit ? 'text-success' : 'text-charcoal'}>
                              {isCredit ? '+' : ''}
                              {formatINR(txn.netAmount)}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                txn.status === 'COMPLETED'
                                  ? 'bg-success-light text-success'
                                  : txn.status === 'PENDING'
                                  ? 'bg-sand text-charcoal'
                                  : 'bg-error-light text-error'
                              }`}
                            >
                              {txn.status}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTxnForDrawer(txn);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-sand/60 hover:bg-sand text-[11px] font-semibold text-charcoal transition-colors"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: EARNINGS AND PAYOUTS (Section 10)                              */}
      {/* ===================================================================== */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Payout Hero Card */}
          <div className="bg-sand/40 rounded-2xl border border-sand-dark p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                Withdrawable Funds
              </span>
              <p className="text-3xl font-bold text-charcoal mt-1">
                {formatINR(financialSummary.availableBalance)}
              </p>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Settled to verified bank: <strong className="text-charcoal">{vendorBankAccount.bankName}</strong> ({vendorBankAccount.maskedAccountNumber})
              </p>
            </div>

            <button
              onClick={handleOpenPayout}
              className="px-6 py-2.5 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Request Payout</span>
            </button>
          </div>

          {/* Payout History Table */}
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <h3 className="font-bold text-sm text-charcoal">Payout History & Disbursal Records</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                    <th className="pb-3">Payout ID</th>
                    <th className="pb-3">Requested Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Destination Account</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Cleared / UTR Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {payouts.map((payo) => (
                    <tr key={payo.id} className="hover:bg-sand/15 transition-colors">
                      <td className="py-3 font-mono font-bold text-charcoal">{payo.id}</td>
                      <td className="py-3 text-charcoal-muted">{formatDate(payo.requestedAt)}</td>
                      <td className="py-3 font-bold font-mono text-charcoal">
                        {formatINR(payo.amount)}
                      </td>
                      <td className="py-3 text-charcoal">
                        <span className="font-semibold block">{payo.bankName || 'Settlement Bank'}</span>
                        <span className="text-[10px] text-charcoal-muted font-mono">{payo.maskedAccount}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            payo.status === 'PAID'
                              ? 'bg-success-light text-success'
                              : payo.status === 'PROCESSING'
                              ? 'bg-sand text-charcoal'
                              : 'bg-error-light text-error'
                          }`}
                        >
                          {payo.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[10px] text-charcoal font-semibold">
                        {payo.utrReference || 'Processing...'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: PLATFORM COMMISSION & CHARGES (Section 9)                      */}
      {/* ===================================================================== */}
      {activeTab === 'commission' && (
        <div className="space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-sm text-charcoal">Configurable Commission Rules</h3>
                <p className="text-xs text-charcoal-muted">
                  The platform applies transparent tier percentages. Demonstration rates can be adjusted below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {commissionRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 rounded-2xl bg-surface border border-border space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sand/60 text-charcoal">
                      {rule.businessMode}
                    </span>
                    <span className="text-xl font-bold text-wine">
                      {rule.commissionPercentage}%
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-charcoal">{rule.category}</h4>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      {rule.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                    <span className="text-[11px] text-charcoal-muted">Calculation: {rule.calculationType}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRuleId(rule.id);
                        setEditCommissionRate(rule.commissionPercentage);
                      }}
                      className="text-wine font-semibold hover:underline text-xs"
                    >
                      Adjust Demo Rate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparent Simulation Calculator */}
          <div className="bg-sand/35 rounded-2xl border border-sand-dark p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-wine" />
              <h3 className="font-bold text-sm text-charcoal">Commission Calculation Demo Example</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Transaction Example</span>
                <p className="font-bold text-charcoal mt-1">₹10,000 Order</p>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Applicable Rate (Product)</span>
                <p className="font-bold text-wine mt-1">
                  {commissionRules.find((r) => r.category.includes('Sales'))?.commissionPercentage || 5}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Platform Fee Deducted</span>
                <p className="font-bold text-wine mt-1">
                  ₹{Math.round((10000 * (commissionRules.find((r) => r.category.includes('Sales'))?.commissionPercentage || 5)) / 100)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border">
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Vendor Net Payout</span>
                <p className="font-bold text-success mt-1">
                  ₹{10000 - Math.round((10000 * (commissionRules.find((r) => r.category.includes('Sales'))?.commissionPercentage || 5)) / 100)}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-charcoal-muted">
              Note: Commission is only charged once on successful transactions. Cancelled transactions never generate platform commission, and full refunds reverse platform fees according to policy.
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: SUBSCRIPTION MANAGEMENT (Part D, Sections 11 & 12)             */}
      {/* ===================================================================== */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-6">
          {/* Current Subscription Card */}
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sand text-wine flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-charcoal">
                      {activeSubscription.planName}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success-light text-success border border-success/30">
                      {activeSubscription.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted">
                    Billing: {formatINR(activeSubscription.amount)} / {activeSubscription.billingFrequency} • Next charge on {formatDate(activeSubscription.nextBillingDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-4 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Plan Details & Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal pt-1">
              {(activeSubscription.features || [
                'Unlimited event service packages & quotations',
                'Advanced availability calendar & slot locking',
                'Unified inventory, rental & product order tracking',
                'Verified Gold Vendor badge & search boost',
              ]).map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wine shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Payment History Table */}
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <h3 className="font-bold text-sm text-charcoal">Subscription Payment History & Invoices</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[620px]">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                    <th className="pb-3">Invoice #</th>
                    <th className="pb-3">Plan Name</th>
                    <th className="pb-3">Billing Period</th>
                    <th className="pb-3">Payment Date</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Invoice Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {subscriptionInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-sand/15 transition-colors">
                      <td className="py-3 font-mono font-bold text-charcoal">{inv.invoiceNumber}</td>
                      <td className="py-3 font-semibold text-charcoal">{inv.planName}</td>
                      <td className="py-3 text-charcoal-muted">{inv.billingPeriod}</td>
                      <td className="py-3 text-charcoal-muted">{formatDate(inv.paymentDate)}</td>
                      <td className="py-3 font-mono font-bold text-charcoal">{formatINR(inv.amount)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-light text-success">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setPreviewInvoice(inv)}
                          className="px-2.5 py-1 rounded-lg bg-sand/60 hover:bg-sand text-xs font-semibold text-wine flex items-center gap-1 ml-auto"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Preview Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: REFUND MANAGEMENT (Part E, Section 13)                         */}
      {/* ===================================================================== */}
      {activeTab === 'refunds' && (
        <div className="space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <div>
              <h3 className="font-bold text-sm text-charcoal">Customer Refund Records & Status</h3>
              <p className="text-xs text-charcoal-muted">
                Transparent accounting for order cancellations, equipment returns, and booking reversals.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[720px]">
                <thead>
                  <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                    <th className="pb-3">Refund ID</th>
                    <th className="pb-3">Related Order / Booking</th>
                    <th className="pb-3">Reason</th>
                    <th className="pb-3">Customer Refund</th>
                    <th className="pb-3">Commission Reversal</th>
                    <th className="pb-3">Vendor Adjustment</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {refunds.map((ref) => (
                    <tr key={ref.id} className="hover:bg-sand/15 transition-colors">
                      <td className="py-3 font-mono font-bold text-charcoal">{ref.id}</td>
                      <td className="py-3">
                        <span className="font-mono font-semibold text-charcoal block">{ref.referenceId}</span>
                        <span className="text-[10px] text-charcoal-muted">{ref.customerName}</span>
                      </td>
                      <td className="py-3 text-charcoal-muted max-w-[200px] truncate">{ref.reason}</td>
                      <td className="py-3 font-mono font-bold text-charcoal">
                        {formatINR(ref.refundAmount)}
                      </td>
                      <td className="py-3 font-mono text-wine font-medium">
                        +{formatINR(ref.commissionAdjustment)}
                      </td>
                      <td className="py-3 font-mono font-bold text-error">
                        -{formatINR(ref.netAdjustment)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ref.status === 'COMPLETED'
                              ? 'bg-success-light text-success'
                              : ref.status === 'UNDER_REVIEW'
                              ? 'bg-sand text-charcoal'
                              : 'bg-error-light text-error'
                          }`}
                        >
                          {ref.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {ref.status !== 'COMPLETED' ? (
                          <button
                            type="button"
                            onClick={() => handleProcessRefund(ref.id)}
                            className="px-3 py-1 rounded-lg bg-wine hover:bg-wine-dark text-white text-[11px] font-bold shadow-xs transition-colors"
                          >
                            Process Refund
                          </button>
                        ) : (
                          <span className="text-[11px] text-charcoal-muted font-semibold">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 7: BANK ACCOUNT MANAGEMENT (Part F, Section 15)                   */}
      {/* ===================================================================== */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          <div className="bg-surface-card rounded-2xl border border-border p-5 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sand text-wine flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-charcoal">{vendorBankAccount.bankName}</h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-success bg-success-light px-2 py-0.5 rounded-full border border-success/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{vendorBankAccount.verificationStatus}</span>
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted">
                    Beneficiary: {vendorBankAccount.accountHolderName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setBankEditForm({
                    accountHolderName: vendorBankAccount.accountHolderName,
                    bankName: vendorBankAccount.bankName,
                    maskedAccountNumber: vendorBankAccount.maskedAccountNumber,
                    ifscCode: vendorBankAccount.ifscCode,
                    upiId: vendorBankAccount.upiId,
                    payoutPreference: vendorBankAccount.payoutPreference || 'weekly',
                  });
                  setShowBankEditModal(true);
                }}
                className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-sand/30 text-charcoal text-xs font-semibold transition-colors"
              >
                Edit Bank Details
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Settlement Account
                </span>
                <p className="font-mono font-bold text-charcoal">
                  {vendorBankAccount.maskedAccountNumber}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  IFSC Clearing Code
                </span>
                <p className="font-mono font-bold text-charcoal">{vendorBankAccount.ifscCode}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">
                  Business UPI VPA
                </span>
                <p className="font-semibold text-charcoal">{vendorBankAccount.upiId}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: REQUEST PAYOUT MODAL                                         */}
      {/* ===================================================================== */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl border border-border shadow-elevated w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-charcoal">Request Settlement Payout</h3>
              <button onClick={() => setShowPayoutModal(false)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayout} className="space-y-4 text-xs">
              <div className="p-3.5 bg-sand/30 rounded-xl border border-sand-dark flex justify-between items-center">
                <span className="text-charcoal-muted">Available for Withdrawal:</span>
                <span className="font-bold text-sm text-charcoal font-mono">
                  {formatINR(financialSummary.availableBalance)}
                </span>
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">
                  Payout Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-charcoal-muted font-bold">₹</span>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    required
                    value={payoutAmountInput}
                    onChange={(e) => setPayoutAmountInput(e.target.value)}
                    placeholder="Enter amount (min ₹500)"
                    className="w-full pl-7 pr-3 py-2 text-sm rounded-xl border border-border bg-surface text-charcoal font-bold outline-none focus:border-wine"
                  />
                </div>
                <div className="mt-1 flex gap-2">
                  {[1000, 5000, 10000, financialSummary.availableBalance].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPayoutAmountInput(preset.toString())}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sand hover:bg-sand-dark text-charcoal"
                    >
                      {preset === financialSummary.availableBalance ? 'Max All' : formatINR(preset)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border space-y-1">
                <span className="text-[10px] uppercase font-bold text-charcoal-muted block">
                  Disbursal Account
                </span>
                <p className="font-bold text-charcoal">{vendorBankAccount.bankName}</p>
                <p className="font-mono text-charcoal-muted text-[11px]">
                  {vendorBankAccount.maskedAccountNumber} • IFSC {vendorBankAccount.ifscCode}
                </p>
              </div>

              {payoutFormError && (
                <div className="p-3 rounded-xl bg-error-light border border-error/30 text-error text-xs font-semibold">
                  {payoutFormError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-charcoal font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white font-bold shadow-xs active:scale-95 transition-all"
                >
                  Confirm & Disburse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: TRANSACTION DETAIL DRAWER (Section 14)                       */}
      {/* ===================================================================== */}
      {selectedTxnForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl border border-border shadow-elevated w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-charcoal">Transaction Breakdown</h3>
                <p className="text-xs text-charcoal-muted font-mono">{selectedTxnForDrawer.id}</p>
              </div>
              <button onClick={() => setSelectedTxnForDrawer(null)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-sand/30 border border-sand-dark flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-charcoal-muted">Net Realized</span>
                  <p className="text-2xl font-bold font-mono text-charcoal">
                    {formatINR(selectedTxnForDrawer.netAmount)}
                  </p>
                </div>
                {getTransactionTypeBadge(selectedTxnForDrawer.transactionType)}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between py-1.5 border-b border-border/70">
                  <span className="text-charcoal-muted">Gross Transaction Value</span>
                  <span className="font-bold font-mono text-charcoal">
                    {formatINR(selectedTxnForDrawer.grossAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/70">
                  <span className="text-charcoal-muted">
                    Platform Commission (
                    {selectedTxnForDrawer.metadata?.commissionRate || 5}%)
                  </span>
                  <span className="font-bold font-mono text-wine">
                    -{formatINR(selectedTxnForDrawer.commissionAmount)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/70">
                  <span className="text-charcoal-muted">Reference / Order ID</span>
                  <span className="font-mono font-semibold text-charcoal">
                    {selectedTxnForDrawer.referenceId}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/70">
                  <span className="text-charcoal-muted">Customer / Payer</span>
                  <span className="font-semibold text-charcoal">
                    {selectedTxnForDrawer.metadata?.customerName || 'Direct Platform Settlement'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border/70">
                  <span className="text-charcoal-muted">Recorded Timestamp</span>
                  <span className="text-charcoal">
                    {formatDate(selectedTxnForDrawer.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-charcoal-muted">Payment Clearing Status</span>
                  <span className="font-bold text-success">
                    {selectedTxnForDrawer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedTxnForDrawer(null)}
                className="px-4 py-2 rounded-xl bg-sand hover:bg-sand-dark text-charcoal text-xs font-bold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: INVOICE PREVIEW MODAL (Section 12)                           */}
      {/* ===================================================================== */}
      {previewInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl border border-border shadow-elevated w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-wine" />
                <h3 className="font-bold text-base text-charcoal">Tax Invoice Preview</h3>
              </div>
              <button onClick={() => setPreviewInvoice(null)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border space-y-4 text-xs font-sans">
              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div>
                  <h4 className="font-bold text-sm text-charcoal">Subakarya Technologies Pvt Ltd</h4>
                  <p className="text-[11px] text-charcoal-muted">GSTIN: 33AAACD9921M1Z5</p>
                  <p className="text-[11px] text-charcoal-muted">Tower B, OMR Tech Park, Chennai, India</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">
                    Invoice Number
                  </span>
                  <p className="font-mono font-bold text-wine">{previewInvoice.invoiceNumber}</p>
                  <p className="text-[10px] text-charcoal-muted">{formatDate(previewInvoice.paymentDate)}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted block">Billed To:</span>
                <p className="font-bold text-charcoal">{vendorBankAccount.accountHolderName}</p>
                <p className="text-[11px] text-charcoal-muted">Verified Vendor Partner ID: pro-1</p>
              </div>

              <div className="py-2 border-y border-border">
                <div className="flex justify-between font-bold text-charcoal mb-1">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-charcoal-muted">
                  <span>{previewInvoice.planName} ({previewInvoice.billingPeriod})</span>
                  <span className="font-mono font-bold text-charcoal">{formatINR(previewInvoice.amount)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-sm text-charcoal pt-1">
                <span>Total Paid</span>
                <span className="text-wine font-mono">{formatINR(previewInvoice.amount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Mock PDF invoice downloaded to downloads folder.');
                  setPreviewInvoice(null);
                }}
                className="px-4 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: UPGRADE SUBSCRIPTION MODAL                                   */}
      {/* ===================================================================== */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl border border-border shadow-elevated w-full max-w-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-charcoal">Choose Subscription Plan</h3>
                <p className="text-xs text-charcoal-muted">Upgrade or modify your professional tier</p>
              </div>
              <button onClick={() => setShowUpgradeModal(false)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <div className="flex justify-center gap-2 p-1 bg-surface-muted rounded-xl w-fit mx-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedPlanFreq('monthly')}
                className={`px-4 py-1.5 rounded-lg transition-colors ${
                  selectedPlanFreq === 'monthly' ? 'bg-wine text-white shadow-xs' : 'text-charcoal-muted'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanFreq('annual')}
                className={`px-4 py-1.5 rounded-lg transition-colors ${
                  selectedPlanFreq === 'annual' ? 'bg-wine text-white shadow-xs' : 'text-charcoal-muted'
                }`}
              >
                Annual (Save 15%)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {mockAvailableSubscriptionPlans.map((plan) => {
                const price =
                  selectedPlanFreq === 'annual' ? Math.round(plan.price * 10) : plan.price;
                return (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-2xl border-2 flex flex-col justify-between text-xs transition-all ${
                      plan.isPopular ? 'border-wine bg-sand/20 shadow-card' : 'border-border bg-surface'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-charcoal">{plan.name}</h4>
                        {plan.isPopular && (
                          <span className="text-[10px] font-bold text-white bg-wine px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold font-mono text-charcoal mt-2">
                        {formatINR(price)}
                        <span className="text-[10px] font-normal text-charcoal-muted">
                          /{selectedPlanFreq === 'annual' ? 'yr' : 'mo'}
                        </span>
                      </p>
                      <p className="text-[11px] text-charcoal-muted mt-1">{plan.description}</p>
                      <ul className="space-y-1.5 mt-3 pt-3 border-t border-border">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px] text-charcoal">
                            <Check className="w-3 h-3 text-wine shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        upgradeSubscription(plan.id, selectedPlanFreq);
                        setShowUpgradeModal(false);
                      }}
                      className="mt-4 w-full py-2 rounded-xl bg-wine hover:bg-wine-dark text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      Select Plan
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: COMMISSION RATE EDIT MODAL                                   */}
      {/* ===================================================================== */}
      {editingRuleId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl border border-border shadow-elevated w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-charcoal">Adjust Demo Commission Rate</h3>
              <button onClick={() => setEditingRuleId(null)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-charcoal-muted">
                Change the mock commission percentage to test ledger recalculations.
              </p>
              <div>
                <label className="font-bold text-charcoal block mb-1">Percentage Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editCommissionRate}
                  onChange={(e) => setEditCommissionRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-charcoal font-bold outline-none focus:border-wine"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingRuleId(null)}
                className="px-4 py-2 rounded-xl border border-border text-charcoal font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveCommissionRule(editingRuleId)}
                className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white font-bold text-xs"
              >
                Save Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 6: EDIT MOCK BANK INFORMATION MODAL                             */}
      {/* ===================================================================== */}
      {showBankEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-card rounded-3xl border border-border shadow-elevated w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-charcoal">Edit Settlement Bank Details</h3>
              <button onClick={() => setShowBankEditModal(false)}>
                <X className="w-5 h-5 text-charcoal-muted" />
              </button>
            </div>

            <form onSubmit={handleSaveBankEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-charcoal block mb-1">Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={bankEditForm.accountHolderName}
                  onChange={(e) =>
                    setBankEditForm({ ...bankEditForm, accountHolderName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">Bank Name & Branch</label>
                <input
                  type="text"
                  required
                  value={bankEditForm.bankName}
                  onChange={(e) =>
                    setBankEditForm({ ...bankEditForm, bankName: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-charcoal block mb-1">Masked Account #</label>
                  <input
                    type="text"
                    required
                    value={bankEditForm.maskedAccountNumber}
                    onChange={(e) =>
                      setBankEditForm({ ...bankEditForm, maskedAccountNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal font-mono outline-none focus:border-wine"
                  />
                </div>
                <div>
                  <label className="font-bold text-charcoal block mb-1">IFSC Code</label>
                  <input
                    type="text"
                    required
                    value={bankEditForm.ifscCode}
                    onChange={(e) =>
                      setBankEditForm({ ...bankEditForm, ifscCode: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal font-mono outline-none focus:border-wine"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-charcoal block mb-1">UPI VPA</label>
                <input
                  type="text"
                  required
                  value={bankEditForm.upiId}
                  onChange={(e) =>
                    setBankEditForm({ ...bankEditForm, upiId: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-border bg-surface text-charcoal outline-none focus:border-wine"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBankEditModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-charcoal font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-wine hover:bg-wine-dark text-white font-bold"
                >
                  Save Bank Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
