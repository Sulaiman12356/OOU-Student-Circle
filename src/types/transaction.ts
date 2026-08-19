// Unified Transaction Engine Types for OOU StudentCircle
export type TransactionType = 'service' | 'product' | 'campus_service' | 'job';

export type UnifiedRequestStatus = 'pending' | 'quoted' | 'accepted' | 'declined' | 'cancelled';

export type UnifiedQuoteStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export type UnifiedOrderStatus = 
  | 'Pending'
  | 'Paid'
  | 'Confirmed'
  | 'Processing'
  | 'Ready'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled'
  | 'Disputed'
  | 'Refunded';

export type UnifiedPaymentStatus = 'unpaid' | 'paid' | 'refunded';

export type DisputeStatus = 'Open' | 'Under Review' | 'Resolved' | 'Rejected';

export type DisputeReason = 
  | 'non_delivery'
  | 'late_delivery'
  | 'scope_mismatch'
  | 'poor_quality'
  | 'unresponsive_provider'
  | 'damaged_goods'
  | 'incorrect_item'
  | 'other';

export type DisputeResolutionAction = 
  | 'refund_buyer'
  | 'release_to_seller'
  | 'split_settlement'
  | 'dismissed';

export interface PartyInfo {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  photo?: string;
  role: 'student' | 'client' | 'admin' | 'vendor' | 'shop_owner';
  departmentOrCompany?: string;
  faculty?: string;
  level?: string;
  location?: string;
  deliveryAddress?: string;
}

export interface TransactionRequest {
  id: string;
  requestId: string;
  buyerId: string;
  buyer: PartyInfo;
  sellerId: string;
  seller: PartyInfo;
  type: TransactionType;
  targetItemId?: string; // serviceId, productId, shopId, jobId
  targetItemTitle: string;
  targetItemImage?: string;
  targetItemCategory?: string;
  title: string;
  description: string;
  attachments?: string[];
  budget?: number;
  expectedDeliveryDays?: number;
  deliveryLocation?: string;
  status: UnifiedRequestStatus;
  quoteId?: string;
  orderId?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionQuote {
  id: string;
  quoteId: string;
  requestId: string;
  requestTitle: string;
  type: TransactionType;
  targetItemId?: string;
  sellerId: string;
  seller: PartyInfo;
  buyerId: string;
  buyer: PartyInfo;
  amount: number; // NGN ₦
  deliveryTime: string; // e.g. "2 Days" or "Within 24 Hours"
  deliveryDays?: number;
  message: string;
  scopeBreakdown?: string[];
  validUntil: string; // ISO string expiry
  status: UnifiedQuoteStatus;
  orderId?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnifiedOrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  specifications?: string;
  unitPrice?: number;
}

export interface CancellationRecord {
  cancelledBy: PartyInfo;
  reason: string;
  timestamp: string;
  refundStatus?: 'not_applicable' | 'pending' | 'refunded';
  refundAmount?: number;
  refundReference?: string;
}

export interface OrderTrackingUpdate {
  status: UnifiedOrderStatus;
  timestamp: string;
  note: string;
  actorName?: string;
  actorRole?: string;
}

export interface PaymentDetails {
  reference: string;
  channel: 'escrow_vault' | 'paystack' | 'flutterwave' | 'bank_transfer' | 'ussd';
  paidAt?: string;
  amountPaid: number;
  currency: string;
  isEscrowSecured: boolean;
  gatewayTransactionId?: string;
  verificationCode?: string;
  authorizationUrl?: string;
}

export interface UnifiedOrder {
  id: string;
  orderId: string;
  requestId?: string;
  quoteId?: string;
  type: TransactionType;
  targetItemId?: string;
  targetItemTitle: string;
  buyerId: string;
  buyer: PartyInfo;
  sellerId: string;
  seller: PartyInfo;
  items: UnifiedOrderItem[];
  amount: number; // Gross amount
  subtotal: number;
  deliveryFee?: number;
  platformFee: number; // Commission held by StudentCircle
  netSellerAmount: number; // Amount receivable by student/seller
  status: UnifiedOrderStatus;
  paymentStatus: UnifiedPaymentStatus;
  paymentDetails?: PaymentDetails;
  deliveryMethod?: 'pickup' | 'delivery' | 'digital_download' | 'online_service';
  deliveryAddress?: string;
  deliveryLocation?: string;
  deliveryDeadline?: string;
  deliveryTime?: string;
  deliveryNotes?: string;
  deliveryFiles?: string[];
  deliveredAt?: string;
  completedAt?: string;
  cancellation?: CancellationRecord;
  disputeId?: string;
  disputeStatus?: DisputeStatus;
  hasReview: boolean;
  reviewId?: string;
  trackingUpdates: OrderTrackingUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderDispute {
  id: string;
  disputeId: string;
  orderId: string;
  orderTitle: string;
  orderType: TransactionType;
  orderAmount: number;
  openedById: string;
  openedBy: PartyInfo;
  againstId: string;
  against: PartyInfo;
  reason: DisputeReason;
  reasonLabel: string;
  description: string;
  evidenceAttachments?: string[];
  status: DisputeStatus;
  adminNotes?: string;
  resolutionAction?: DisputeResolutionAction;
  refundAmount?: number;
  resolvedAt?: string;
  resolvedById?: string;
  resolvedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnifiedReview {
  id: string;
  reviewId: string;
  orderId: string; // Strictly enforced 1 review per completed order!
  transactionType: TransactionType;
  targetItemId?: string;
  targetItemTitle: string;
  reviewerId: string;
  reviewer: PartyInfo;
  recipientId: string;
  recipient: PartyInfo;
  rating: number; // 1 to 5 stars
  title?: string;
  comment: string;
  tags?: string[];
  isVerifiedTransaction: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFeeConfig {
  serviceCommissionPercent: number; // e.g. 10%
  productCommissionPercent: number; // e.g. 8%
  campusShopCommissionPercent: number; // e.g. 5%
  jobCommissionPercent: number; // e.g. 10%
  escrowProtectionFeeFixed: number; // e.g. ₦100
  minimumOrderAmount: number; // e.g. ₦500
}
