// OOU StudentCircle - Campus Services Hub Types

export type CampusUserType = 'student' | 'aspirant' | 'client' | 'guest' | 'shop_owner';

export type ShopVerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'suspended';

export type ShopLiveStatus = 'open' | 'closed' | 'busy' | 'temporarily_unavailable';

export type CampusOrderStatus = 
  | 'request_submitted' 
  | 'shop_reviewing' 
  | 'price_confirmed' 
  | 'awaiting_payment' 
  | 'payment_confirmed' 
  | 'processing' 
  | 'ready_for_pickup' 
  | 'collected' 
  | 'completed' 
  | 'cancelled' 
  | 'disputed';

export type ServicePricingType = 
  | 'fixed' 
  | 'per_page' 
  | 'per_copy' 
  | 'per_document' 
  | 'per_item' 
  | 'quote_required';

export type CampusLocationStatus = 'Active' | 'Inactive' | 'Coming Soon';

export interface CampusLocation {
  id: string;
  name: string;
  slug: string;
  location?: string; // e.g. 'Ago-Iwoye', 'Ayetoro', 'Ibogun', 'Sagamu'
  subTitle?: string; // e.g. 'Permanent Site', 'Ago-Iwoye'
  description: string;
  campusType: string; // e.g. 'Main Campus', 'Mini Campus', 'College of Engineering', 'College of Agricultural Sciences', 'College of Health Sciences'
  status: CampusLocationStatus;
  image?: string;
  latitude?: number;
  longitude?: number;
  campusId?: string;
  campusName?: string;
  code?: string;
  landmark?: string;
  serviceAreas?: string[];
  popularServices?: string[];
  shopCount?: number;
  activeProvidersCount?: number;
  displayOrder?: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CampusShop {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  whatsappNumber: string;
  name: string;
  shopCode: string;
  campusId: string;
  campusName: string;
  locationId: string;
  locationName: string;
  specificArea: string;
  locationDescription: string;
  description: string;
  servicesOffered: string[];
  openingHours: string; // e.g. "08:00"
  closingHours: string; // e.g. "18:30"
  workingDays: string[];
  manualStatusOverride?: 'open' | 'closed' | 'busy' | 'auto';
  pickupInstructions: string;
  photos: string[];
  coverPhoto?: string;
  verificationStatus: ShopVerificationStatus;
  verificationNotes?: string;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  totalOrdersCount: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampusService {
  id: string;
  shopId: string;
  shopName: string;
  shopCode: string;
  locationName: string;
  title: string;
  category: string;
  description: string;
  pricingType: ServicePricingType;
  unitPrice: number;
  priceDescription?: string;
  requiresDocumentUpload: boolean;
  requiresAdminModeration?: boolean;
  status: 'active' | 'pending_moderation' | 'paused' | 'rejected';
  estimatedTurnaround: string;
  options?: {
    colorOptions?: string[];
    paperSizes?: string[];
    bindingTypes?: string[];
    copiesAllowed?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UploadedServiceDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface CampusOrder {
  id: string;
  referenceNumber: string; // e.g. SC-MG-E6-48291
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerType: 'student' | 'aspirant' | 'guest';
  customerMatricOrJamb?: string; // Private
  shopId: string;
  shopName: string;
  shopCode: string;
  locationName: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  uploadedFiles: UploadedServiceDoc[];
  specifications: {
    copies: number;
    colorMode?: 'black_white' | 'color' | 'mixed';
    paperSize?: string;
    bindingType?: string;
    customNotes?: string;
    preferredPickupDate?: string;
    preferredPickupTime?: string;
  };
  pricing: {
    pricingType: ServicePricingType;
    subtotal: number;
    platformCommission: number;
    processingFee: number;
    netShopEarnings: number;
    totalAmount: number;
    isQuoteAccepted?: boolean;
  };
  quote?: {
    quoteId: string;
    amount: number;
    notes: string;
    estimatedReadyTime: string;
    expiresAt: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
  };
  payment: {
    status: 'pending' | 'paid' | 'waived' | 'failed' | 'refunded';
    paymentMethod?: 'paystack' | 'wallet' | 'card' | 'transfer';
    reference?: string;
    paidAt?: string;
  };
  status: CampusOrderStatus;
  pickupVerification: {
    pickupCode: string;
    collectedAt?: string;
    verifiedBy?: string;
  };
  statusHistory: Array<{
    status: CampusOrderStatus;
    note: string;
    timestamp: string;
    updatedBy: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CampusReview {
  id: string;
  shopId: string;
  orderId: string;
  referenceNumber: string;
  customerId: string;
  customerName: string;
  customerType: string;
  rating: number;
  comment: string;
  serviceName: string;
  createdAt: string;
}

export interface CampusMessage {
  id: string;
  orderId?: string;
  shopId: string;
  customerId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'shop_owner' | 'admin';
  text: string;
  createdAt: string;
  read: boolean;
}

export interface CampusPromotion {
  id: string;
  shopId: string;
  shopName: string;
  type: 'featured_shop' | 'featured_service' | 'sponsored_listing' | 'homepage_banner';
  startDate: string;
  endDate: string;
  amount: number;
  paymentStatus: 'pending' | 'paid';
  active: boolean;
  createdAt: string;
}

export interface CampusReport {
  id: string;
  shopId: string;
  orderId?: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

// Utility to calculate dynamic availability
export function calculateShopAvailability(shop: CampusShop): { status: ShopLiveStatus; label: string; isOpen: boolean } {
  if (shop.manualStatusOverride === 'closed') {
    return { status: 'closed', label: 'CLOSED', isOpen: false };
  }
  if (shop.manualStatusOverride === 'busy') {
    return { status: 'busy', label: 'BUSY', isOpen: true };
  }
  if (shop.manualStatusOverride === 'open') {
    return { status: 'open', label: 'OPEN NOW', isOpen: true };
  }
  if (shop.verificationStatus !== 'verified') {
    return { status: 'temporarily_unavailable', label: 'UNVERIFIED', isOpen: false };
  }

  const now = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = dayNames[now.getDay()];

  if (shop.workingDays && !shop.workingDays.includes(currentDay)) {
    return { status: 'closed', label: 'CLOSED TODAY', isOpen: false };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1] || '0', 10);
  };

  const openMinutes = parseTimeToMinutes(shop.openingHours || '08:00');
  const closeMinutes = parseTimeToMinutes(shop.closingHours || '18:00');

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    return { status: 'open', label: 'OPEN NOW', isOpen: true };
  }

  return { status: 'closed', label: 'CLOSED', isOpen: false };
}
