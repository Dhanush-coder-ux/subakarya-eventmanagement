import {
  CommissionRule,
  FinancialTransaction,
  VendorPayout,
  Refund,
  FinancialSummary,
  DateFilterRange,
} from '../types';

export class FinancialService {
  /**
   * Filter items by date range filter
   */
  public static isWithinDateRange(
    dateString: string,
    range: DateFilterRange,
    customStart?: string,
    customEnd?: string
  ): boolean {
    if (!dateString) return false;
    const itemDate = new Date(dateString);
    const now = new Date();

    switch (range) {
      case 'today': {
        return (
          itemDate.getDate() === now.getDate() &&
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }
      case 'this_week': {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= oneWeekAgo && itemDate <= now;
      }
      case 'this_month': {
        return (
          itemDate.getMonth() === now.getMonth() &&
          itemDate.getFullYear() === now.getFullYear()
        );
      }
      case 'last_3_months': {
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return itemDate >= threeMonthsAgo && itemDate <= now;
      }
      case 'this_year': {
        return itemDate.getFullYear() === now.getFullYear();
      }
      case 'custom': {
        if (!customStart && !customEnd) return true;
        const start = customStart ? new Date(customStart) : new Date(0);
        const end = customEnd ? new Date(`${customEnd}T23:59:59Z`) : now;
        return itemDate >= start && itemDate <= end;
      }
      default:
        return true;
    }
  }

  /**
   * Calculate platform commission based on active rules
   */
  public static calculateCommission(
    amount: number,
    category: string,
    rules: CommissionRule[]
  ): {
    rate: number;
    commissionAmount: number;
    netAmount: number;
    rule: CommissionRule | undefined;
  } {
    // Find matching active commission rule
    const rule = rules.find(
      (r) => r.active && r.category.toLowerCase() === category.toLowerCase()
    ) || rules[0];

    const rate = rule ? rule.commissionPercentage : 5;
    const commissionAmount = Math.round((amount * rate) / 100);
    const netAmount = amount - commissionAmount;

    return {
      rate,
      commissionAmount,
      netAmount,
      rule,
    };
  }

  /**
   * Compute comprehensive financial summary for vendor
   */
  public static calculateFinancialSummary(
    transactions: FinancialTransaction[],
    payouts: VendorPayout[],
    refunds: Refund[],
    dateRange: DateFilterRange = 'this_year',
    customStart?: string,
    customEnd?: string
  ): FinancialSummary {
    // Filter transactions by requested period
    const periodTransactions = transactions.filter((t) =>
      this.isWithinDateRange(t.createdAt, dateRange, customStart, customEnd)
    );

    let grossRevenue = 0;
    let platformCommission = 0;
    let netEarnings = 0;
    let pendingBalance = 0;
    let totalSubscriptions = 0;
    let totalRefunds = 0;

    // Process period transactions
    for (const txn of periodTransactions) {
      if (txn.status === 'COMPLETED') {
        if (
          txn.transactionType === 'PRODUCT_SALE' ||
          txn.transactionType === 'RENTAL_PAYMENT' ||
          txn.transactionType === 'BOOKING_PAYMENT'
        ) {
          grossRevenue += txn.grossAmount;
          platformCommission += txn.commissionAmount;
          netEarnings += txn.netAmount;
        } else if (txn.transactionType === 'SUBSCRIPTION_PAYMENT') {
          totalSubscriptions += txn.grossAmount;
        } else if (txn.transactionType === 'CUSTOMER_REFUND') {
          totalRefunds += txn.grossAmount;
          // Refund adjusts commission and vendor net earnings
          platformCommission -= txn.commissionAmount;
          netEarnings -= Math.abs(txn.netAmount);
        }
      } else if (txn.status === 'PENDING') {
        if (
          txn.transactionType === 'PRODUCT_SALE' ||
          txn.transactionType === 'RENTAL_PAYMENT' ||
          txn.transactionType === 'BOOKING_PAYMENT'
        ) {
          pendingBalance += txn.netAmount;
        }
      }
    }

    // Cumulative paid out from all completed payouts
    const totalPaidOut = payouts
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0);

    // Available balance is all-time completed net revenue minus total paid out minus subscriptions
    // Let's compute all-time completed net
    const allTimeCompletedNet = transactions
      .filter((t) => t.status === 'COMPLETED')
      .reduce((sum, t) => {
        if (
          t.transactionType === 'PRODUCT_SALE' ||
          t.transactionType === 'RENTAL_PAYMENT' ||
          t.transactionType === 'BOOKING_PAYMENT'
        ) {
          return sum + t.netAmount;
        }
        if (t.transactionType === 'CUSTOMER_REFUND') {
          return sum - Math.abs(t.netAmount);
        }
        if (t.transactionType === 'SUBSCRIPTION_PAYMENT') {
          return sum - Math.abs(t.grossAmount);
        }
        return sum;
      }, 0);

    const availableBalance = Math.max(0, allTimeCompletedNet - totalPaidOut);

    return {
      grossRevenue,
      platformCommission,
      netEarnings,
      availableBalance,
      pendingBalance,
      totalPaidOut,
      totalSubscriptions,
      totalRefunds,
      periodTransactionCount: periodTransactions.length,
    };
  }

  /**
   * Validate payout request
   */
  public static validatePayoutRequest(
    amount: number,
    availableBalance: number
  ): { valid: boolean; error?: string } {
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, error: 'Please enter a valid payout amount greater than zero.' };
    }
    if (amount < 500) {
      return { valid: false, error: 'Minimum payout withdrawal threshold is ₹500.' };
    }
    if (amount > availableBalance) {
      return {
        valid: false,
        error: `Insufficient available funds. You can withdraw up to ₹${availableBalance.toLocaleString('en-IN')}.`,
      };
    }
    return { valid: true };
  }

  /**
   * Calculate transparent refund breakdown
   */
  public static calculateRefundBreakdown(
    originalGross: number,
    commissionPercentage: number
  ): {
    customerRefund: number;
    commissionReversal: number;
    vendorAdjustment: number;
  } {
    const customerRefund = originalGross;
    const commissionReversal = Math.round((originalGross * commissionPercentage) / 100);
    const vendorAdjustment = customerRefund - commissionReversal;

    return {
      customerRefund,
      commissionReversal,
      vendorAdjustment,
    };
  }
}

