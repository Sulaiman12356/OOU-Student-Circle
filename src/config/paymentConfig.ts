// Payment Provider Configuration for OOU StudentCircle
// Keep payment provider configuration separate from frontend code.

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  description: string;
  isLive: boolean;
  testMode: boolean;
  publicKey?: string;
  currency: string;
  supportedMethods: ('card' | 'bank_transfer' | 'ussd' | 'escrow_vault')[];
  escrowProtected: boolean;
  webhookEndpoint?: string;
}

export interface PlatformFeeRule {
  transactionType: 'service' | 'product' | 'campus_service' | 'job';
  commissionPercent: number;
  fixedProcessingFee: number;
  minAmount: number;
  maxAmount: number;
  escrowHoldPeriodDays: number;
}

export const PAYMENT_CONFIG = {
  activeEnvironment: 'test', // 'test' | 'live'
  currency: 'NGN',
  currencySymbol: '₦',
  escrowName: 'OOU StudentCircle Escrow Vault',
  escrowAccountNumber: '08051780169',
  escrowBankName: 'Wema Bank / ALAT (StudentCircle Vault)',
  escrowAccountName: 'OOU StudentCircle Marketplace Vault',
  
  // Gateways
  gateways: {
    escrow_vault: {
      id: 'escrow_vault',
      name: 'StudentCircle Escrow Vault (Recommended)',
      description: 'Zero-risk campus escrow. Payment is safely held by OOU StudentCircle until you confirm full satisfactory delivery.',
      isLive: true,
      testMode: false,
      currency: 'NGN',
      supportedMethods: ['escrow_vault', 'card', 'bank_transfer'],
      escrowProtected: true,
    } as PaymentGatewayConfig,
    
    paystack: {
      id: 'paystack',
      name: 'Paystack Secure Checkout',
      description: 'Pay via Debit Card (Mastercard, Visa, Verve), Direct Bank Transfer, or USSD.',
      isLive: false,
      testMode: true,
      publicKey: 'pk_test_oou_studentcircle_secure_mock_key_99812',
      currency: 'NGN',
      supportedMethods: ['card', 'bank_transfer', 'ussd'],
      escrowProtected: true,
      webhookEndpoint: '/api/webhooks/paystack'
    } as PaymentGatewayConfig,

    flutterwave: {
      id: 'flutterwave',
      name: 'Flutterwave Barter & Card',
      description: 'Instant card payment with 3D-Secure 2.0 and mobile banking.',
      isLive: false,
      testMode: true,
      publicKey: 'flw_test_oou_studentcircle_99214',
      currency: 'NGN',
      supportedMethods: ['card', 'bank_transfer'],
      escrowProtected: true,
      webhookEndpoint: '/api/webhooks/flutterwave'
    } as PaymentGatewayConfig,

    bank_transfer: {
      id: 'bank_transfer',
      name: 'Direct Campus Bank Transfer',
      description: 'Transfer directly to StudentCircle Escrow Account with instant reference verification.',
      isLive: true,
      testMode: false,
      currency: 'NGN',
      supportedMethods: ['bank_transfer'],
      escrowProtected: true,
    } as PaymentGatewayConfig
  },

  // Fee Rules by Transaction Type
  feeRules: {
    service: {
      transactionType: 'service',
      commissionPercent: 10, // 10% platform commission on student freelance services
      fixedProcessingFee: 100,
      minAmount: 1000,
      maxAmount: 1000000,
      escrowHoldPeriodDays: 3
    } as PlatformFeeRule,

    product: {
      transactionType: 'product',
      commissionPercent: 8, // 8% commission on physical marketplace student goods
      fixedProcessingFee: 50,
      minAmount: 500,
      maxAmount: 500000,
      escrowHoldPeriodDays: 2
    } as PlatformFeeRule,

    campus_service: {
      transactionType: 'campus_service',
      commissionPercent: 5, // 5% commission on campus shop services (printing, laundry, repair)
      fixedProcessingFee: 50,
      minAmount: 300,
      maxAmount: 200000,
      escrowHoldPeriodDays: 1
    } as PlatformFeeRule,

    job: {
      transactionType: 'job',
      commissionPercent: 10, // 10% commission on contracted job milestones
      fixedProcessingFee: 150,
      minAmount: 2000,
      maxAmount: 2500000,
      escrowHoldPeriodDays: 5
    } as PlatformFeeRule
  },

  // Cancellation Rules
  cancellationPolicy: {
    allowedBeforeStatus: ['Pending', 'Paid', 'Confirmed'],
    buyerPenaltyPercentAfterConfirmed: 0, // No penalty for students within 1 hour
    autoRefundOnCancellation: true,
    disputeCooldownHours: 24
  },

  // Dispute Rules
  disputePolicy: {
    allowedReasons: [
      { id: 'non_delivery', label: 'Item/Service Never Delivered' },
      { id: 'late_delivery', label: 'Unreasonable Delay Past Agreed Deadline' },
      { id: 'scope_mismatch', label: 'Deliverable Does Not Match Quote/Requirements' },
      { id: 'poor_quality', label: 'Substandard / Defective Work' },
      { id: 'unresponsive_provider', label: 'Provider Stopped Responding' },
      { id: 'damaged_goods', label: 'Physical Product Arrived Broken / Damaged' },
      { id: 'incorrect_item', label: 'Received Wrong Item or Specification' },
      { id: 'other', label: 'Other Legitimate Grievance' }
    ],
    maxAdminResponseDays: 2,
    arbitrationEmail: 'support@ooustudentcircle.com'
  }
};

/**
 * Calculate fee breakdown for any transaction type
 */
export function calculateTransactionFee(
  amount: number, 
  type: 'service' | 'product' | 'campus_service' | 'job' = 'service'
) {
  const rule = PAYMENT_CONFIG.feeRules[type] || PAYMENT_CONFIG.feeRules.service;
  const platformFee = Math.round((amount * rule.commissionPercent) / 100);
  const netSellerAmount = Math.max(0, amount - platformFee);
  
  return {
    grossAmount: amount,
    commissionPercent: rule.commissionPercent,
    platformFee,
    netSellerAmount,
    escrowHoldPeriodDays: rule.escrowHoldPeriodDays
  };
}

/**
 * Format currency with NGN ₦ symbol and commas
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₦0';
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}
