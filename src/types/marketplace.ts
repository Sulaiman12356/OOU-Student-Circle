export type VendorVerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type ProductStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'published' 
  | 'out_of_stock' 
  | 'paused' 
  | 'rejected' 
  | 'archived';

export type ProductCondition = 
  | 'brand_new' 
  | 'handmade' 
  | 'like_new' 
  | 'refurbished' 
  | 'used_good';

export type DeliveryOption = 'campus_pickup' | 'vendor_delivery' | 'both';

export type OrderStatus = 
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded'
  | 'disputed';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PromotionType = 'featured' | 'homepage' | 'category' | 'search_boost';

export type PromotionStatus = 'pending_payment' | 'active' | 'expired' | 'cancelled';

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'cancelled';

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export type ReportReason = 
  | 'fraud'
  | 'misleading'
  | 'prohibited'
  | 'counterfeit'
  | 'pricing'
  | 'inappropriate'
  | 'other';

export interface MarketplaceCategory {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  description: string;
  productCount?: number;
  featured?: boolean;
}

export interface VendorProfile {
  id: string; // matches student userId
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentMatric?: string;
  studentDepartment?: string;
  studentLevel?: string;
  storeName: string;
  profileImage: string;
  bannerImage?: string;
  businessDescription: string;
  category: string;
  location: string;
  whatsappNumber?: string;
  contactPreferences: {
    whatsapp: boolean;
    inAppChat: boolean;
    phone: boolean;
    email: boolean;
  };
  verificationStatus: VendorVerificationStatus;
  rating: number;
  reviewsCount: number;
  totalSales: number;
  totalProducts?: number;
  adminNotes?: string;
  isDemo?: boolean;
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductItem {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorStoreName: string;
  vendorPhoto?: string;
  isVendorVerified?: boolean;
  title: string;
  name?: string; // alias
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  quantity: number; // Available inventory
  sku?: string;
  images: string[];
  mainImage: string;
  condition: ProductCondition;
  campus?: string;
  location: string;
  deliveryOptions: DeliveryOption;
  pickupAvailable: boolean;
  pickupLocationDescription?: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  estimatedDeliveryTime: string;
  status: ProductStatus;
  views: number;
  ordersCount: number;
  salesCount: number;
  rating: number;
  reviewsCount: number;
  isPromoted?: boolean;
  promotionType?: PromotionType;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  vendorId: string;
  vendorStoreName: string;
  title: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
  maxAvailable: number;
  deliveryFee: number;
  pickupAvailable: boolean;
  selectedDeliveryMethod: 'pickup' | 'delivery';
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: ProductItem;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  image: string;
  sku?: string;
  vendorId: string;
  vendorStoreName: string;
}

export interface VendorOrder {
  id: string; // e.g. "VO-12345"
  parentOrderId: string;
  vendorId: string;
  vendorStoreName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  platformCommission: number; // calculated e.g. 10%
  netVendorEarnings: number; // subtotal - platformCommission
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress: string;
  location: string;
  customerNotes?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  trackingUpdates: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface MasterOrder {
  id: string; // e.g. "ORD-12345"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  location: string;
  deliveryMethod: 'pickup' | 'delivery' | 'mixed';
  customerNotes?: string;
  vendorOrderIds: string[];
  itemsCount: number;
  subtotal: number;
  totalDeliveryFee: number;
  platformFee: number;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentChannel?: 'paystack_test' | 'paystack_live' | 'campus_pay' | 'cash_on_delivery';
  overallStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  productTitle: string;
  vendorId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhoto?: string;
  rating: number; // 1-5
  reviewTitle?: string;
  comment: string;
  imageUrl?: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface VendorReview {
  id: string;
  vendorId: string;
  orderId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface PromotionPackage {
  id: string;
  name: string;
  type: PromotionType;
  durationDays: number;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface ProductPromotion {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  vendorId: string;
  vendorStoreName: string;
  packageId: string;
  packageName: string;
  type: PromotionType;
  durationDays: number;
  cost: number;
  paymentStatus: 'pending' | 'paid';
  status: PromotionStatus;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  vendorId: string;
  vendorStoreName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: PayoutStatus;
  requestedAt: string;
  processedAt?: string;
  adminNotes?: string;
  reference?: string;
}

export interface MarketplaceTransaction {
  id: string;
  orderId: string;
  vendorOrderId?: string;
  type: 'order_payment' | 'commission_deduction' | 'payout_withdrawal' | 'promotion_fee' | 'refund';
  amount: number;
  platformFee: number;
  vendorNetAmount: number;
  vendorId?: string;
  customerId?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  reference: string;
  notes?: string;
  createdAt: string;
}

export interface ProductReport {
  id: string;
  productId: string;
  productTitle: string;
  vendorId: string;
  vendorStoreName: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface MarketplaceSettings {
  commissionPercent: number;
  paymentProcessingPercent: number;
  paymentProcessingFixedFee: number;
  minPayoutAmount: number;
  testPaymentMode: boolean;
  prohibitedProductPolicy: string;
  categories: MarketplaceCategory[];
  promotionPackages: PromotionPackage[];
}
