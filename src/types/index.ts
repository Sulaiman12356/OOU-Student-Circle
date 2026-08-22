export type UserRole = 'student' | 'client' | 'admin';

export type StudentLevel = '100L' | '200L' | '300L' | '400L' | '500L' | 'Postgraduate' | 'Alumni';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'resubmission_requested';

export type ServiceStatus = 'published' | 'draft' | 'under_review' | 'rejected' | 'active' | 'paused';

export type ServiceCategory = 
  | 'Graphics & Design'
  | 'Graphic Design'
  | 'Tech & Development'
  | 'Web Development'
  | 'Digital Marketing'
  | 'Video & Animation'
  | 'Video Editing'
  | 'Photography'
  | 'Photography & Media'
  | 'Tutoring'
  | 'Tutoring & Academics'
  | 'Writing'
  | 'Writing & Translation'
  | 'Data Analysis'
  | 'Programming'
  | 'Social Media Management'
  | 'Printing assistance'
  | 'Business & Admin'
  | 'Other legitimate services'
  | string;

export type JobStatus = 
  | 'open'
  | 'proposals_received'
  | 'hired'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export type TransactionStatus = 'held_in_escrow' | 'released' | 'refunded' | 'pending' | 'completed';

export type NotificationType = 
  | 'connection_request'
  | 'connection_accepted'
  | 'new_message'
  | 'new_service_request'
  | 'new_quote'
  | 'quote_accepted'
  | 'quote_declined'
  | 'order_created'
  | 'payment_confirmed'
  | 'order_status'
  | 'review'
  | 'review_received'
  | 'job_application'
  | 'job_shortlist'
  | 'shop_request'
  | 'admin_action'
  | 'verification'
  // Legacy support
  | 'message'
  | 'proposal'
  | 'proposal_received'
  | 'proposal_accepted'
  | 'proposal_rejected'
  | 'job_match'
  | 'job_hired'
  | 'job_completed'
  | 'escrow_release'
  | 'system';

export type ConversationType = 
  | 'student_connect' 
  | 'service' 
  | 'marketplace' 
  | 'campus_service' 
  | 'job' 
  | 'direct';

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: 'image' | 'pdf' | 'doc' | 'archive' | 'audio' | 'link';
  thumbnail?: string;
}

export interface ConversationContext {
  type: ConversationType;
  // Associated entities
  serviceId?: string;
  serviceTitle?: string;
  servicePrice?: number;
  serviceCategory?: string;
  serviceCoverImage?: string;
  
  productId?: string;
  productTitle?: string;
  productPrice?: number;
  productImage?: string;
  productCategory?: string;
  productCondition?: string;
  
  orderId?: string;
  orderStatus?: string;
  orderAmount?: number;
  escrowStatus?: string;
  
  jobId?: string;
  jobTitle?: string;
  jobBudget?: number;
  jobType?: string;
  
  requestId?: string;
  quoteId?: string;
  shopId?: string;
  shopName?: string;
  
  initialTopic?: string;
}

export interface PortfolioLink {
  title: string;
  url: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images?: string[];
  imageUrl?: string;
  projectUrl?: string;
  category?: string;
  date?: string;
  orderIndex?: number;
}

export interface StudentAchievement {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  year?: string;
  description?: string;
  link?: string;
}

export interface StudentEducation {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startYear?: string;
  endYear?: string;
  isCurrent?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  phoneNumber: string;
  profilePhoto?: string;
  coverPhoto?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'suspended' | 'pending';
  isVerified: boolean;
  
  // Student Specific
  faculty?: string;
  department?: string;
  level?: StudentLevel;
  matricNumber?: string;
  skills?: string[];
  interests?: string[];
  shortBio?: string;
  portfolio?: PortfolioItem[];
  achievements?: StudentAchievement[];
  education?: StudentEducation[];
  rating?: number;
  reviewsCount?: number;
  completedJobsCount?: number;
  totalEarnings?: number;
  availableForWork?: boolean;
  verificationStatus?: VerificationStatus;
  verificationIdUrl?: string;
  verificationNotes?: string;

  // Aspirant Specific
  userType?: 'student' | 'aspirant' | 'client' | 'guest' | 'shop_owner';
  isAspirant?: boolean;
  jambRegNumber?: string;
  intendedCourse?: string;
  entrySession?: string;

  // Client Specific
  businessName?: string;
  businessCategory?: string;
  businessDescription?: string;
  jobsPostedCount?: number;
  totalSpent?: number;
}

export type User = UserProfile;

export type PricingType = 'Fixed Price' | 'Starting From' | 'Per Unit' | 'Custom Quote';

export type ServiceAvailability = 
  | 'Available Now' 
  | 'Weekdays (8am - 6pm)' 
  | 'Weekends Only' 
  | 'By Appointment / Booking' 
  | '24/7 Support'
  | 'Immediate' 
  | 'Within 24 Hours' 
  | 'Custom Schedule'
  | string;

export type ServiceRequestStatus = 'pending' | 'accepted' | 'declined' | 'quoted' | 'cancelled';
export type ServiceQuoteStatus = 'pending' | 'accepted' | 'declined' | 'expired';
export type ServiceOrderStatus = 'active' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';

export interface ServiceTier {
  name: string;
  description: string;
  price: number;
  deliveryDays?: number;
  features?: string[];
}

export interface ServiceItem {
  id: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  studentDepartment?: string;
  studentLevel?: string;
  studentFaculty?: string;
  isStudentVerified?: boolean;
  title: string;
  category: ServiceCategory;
  description: string;
  skills?: string[];
  tags?: string[];
  startingPrice?: number;
  price?: number;
  pricingType?: PricingType;
  deliveryTime?: string;
  deliveryDays?: number;
  campus?: string;
  serviceArea?: string;
  location?: string;
  isDigital?: boolean;
  portfolioImages?: string[];
  coverImage?: string;
  coverPhoto?: string;
  portfolioLinks?: { title: string; url: string }[];
  availability?: ServiceAvailability;
  viewsCount?: number;
  status: ServiceStatus;
  rating: number;
  reviewsCount: number;
  completedOrders?: number;
  ordersCompleted?: number;
  createdAt: string;
  updatedAt: string;
  pricing?: {
    startingAt: number;
    currency: string;
    tiers: {
      basic: ServiceTier;
      standard?: ServiceTier;
      premium?: ServiceTier;
    };
  };
}

export type Service = ServiceItem;

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory?: string;
  serviceCoverImage?: string;
  providerId: string;
  providerName: string;
  providerPhoto?: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerPhoto?: string;
  customerDepartment?: string;
  customerLevel?: string;
  customerRole?: string;
  title: string;
  description?: string;
  requirements?: string;
  requestedPrice?: number;
  budget?: number;
  pricingType?: PricingType;
  deadline?: string;
  deliveryTime?: string;
  serviceArea?: string;
  campus?: string;
  attachments?: string[];
  status: ServiceRequestStatus;
  quoteId?: string;
  orderId?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceQuote {
  id: string;
  requestId: string;
  serviceId: string;
  serviceTitle: string;
  serviceCoverImage?: string;
  providerId: string;
  providerName: string;
  providerPhoto?: string;
  providerDepartment?: string;
  customerId: string;
  customerName: string;
  price: number;
  deliveryTime: string;
  deliveryDays?: number;
  message: string;
  scopeBreakdown?: string[];
  validUntil?: string;
  status: ServiceQuoteStatus;
  orderId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory?: string;
  serviceCoverImage?: string;
  requestId?: string;
  quoteId?: string;
  providerId: string;
  providerName: string;
  providerPhoto?: string;
  providerDepartment?: string;
  customerId: string;
  customerName: string;
  customerPhoto?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerDepartment?: string;
  amount: number;
  pricingType?: PricingType;
  deliveryTime?: string;
  deliveryDays?: number;
  deadline?: string;
  requirements?: string;
  status: ServiceOrderStatus;
  deliveryNotes?: string;
  deliveryFiles?: string[];
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  hasReview?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  serviceTitle: string;
  orderId: string; // Guaranteed 1 review per completed order!
  providerId: string;
  providerName: string;
  customerId: string;
  customerName: string;
  customerPhoto?: string;
  customerDepartment?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  tags?: string[];
  isVerifiedTransaction: boolean;
  createdAt: string;
}

export interface JobBudget {
  min: number;
  max: number;
  currency?: string;
}

export function getServicePrice(service?: ServiceItem | null): number {
  if (!service) return 0;
  if (service.price !== undefined && service.price > 0) return service.price;
  if (service.startingPrice !== undefined) return service.startingPrice;
  if (service.pricing?.startingAt !== undefined) return service.pricing.startingAt;
  return 0;
}

export function getServiceTags(service?: ServiceItem | null): string[] {
  if (!service) return [];
  if (service.tags && Array.isArray(service.tags) && service.tags.length > 0) {
    return service.tags;
  }
  if (service.skills && Array.isArray(service.skills)) {
    return service.skills;
  }
  return [];
}

export function getServiceDeliveryDays(service?: ServiceItem | null): number {
  if (!service) return 1;
  if (service.deliveryDays !== undefined) return service.deliveryDays;
  if (service.pricing?.tiers?.basic?.deliveryDays !== undefined) {
    return service.pricing.tiers.basic.deliveryDays;
  }
  if (service.deliveryTime) {
    const num = parseInt(service.deliveryTime, 10);
    if (!isNaN(num)) return num;
  }
  return 2;
}

export function formatBudget(budget?: number | JobBudget | null): string {
  if (budget === undefined || budget === null) return 'Negotiable';
  if (typeof budget === 'number') return `₦${(budget || 0).toLocaleString()}`;
  if (budget.min !== undefined && budget.max !== undefined) {
    return `₦${(budget.min || 0).toLocaleString()} – ₦${(budget.max || 0).toLocaleString()}`;
  }
  if (budget.min !== undefined) {
    return `₦${(budget.min || 0).toLocaleString()}+`;
  }
  return 'Negotiable';
}

export function getBudgetMin(budget?: number | JobBudget | null): number {
  if (!budget) return 0;
  if (typeof budget === 'number') return budget;
  return budget.min ?? 0;
}

export function getBudgetMax(budget?: number | JobBudget | null): number {
  if (!budget) return 0;
  if (typeof budget === 'number') return budget;
  return budget.max ?? budget.min ?? 0;
}

export interface JobPost {
  id: string;
  clientId: string;
  clientName: string;
  clientPhoto?: string;
  clientCompany?: string;
  clientBusinessName?: string;
  title: string;
  category: ServiceCategory;
  description: string;
  budget: number | JobBudget;
  deadline: string;
  location: string;
  isDigital?: boolean;
  requiredSkills?: string[];
  skillsRequired?: string[];
  status: JobStatus;
  proposalsCount: number;
  hiredStudentId?: string;
  hiredStudentName?: string;
  hiredProposalId?: string;
  createdAt: string;
  updatedAt: string;
}

export type Job = JobPost;

export interface JobProposal {
  id: string;
  jobId: string;
  jobTitle?: string;
  studentId: string;
  studentName: string;
  studentPhoto?: string;
  studentDepartment?: string;
  studentLevel?: string;
  studentRating?: number;
  coverMessage?: string;
  coverLetter?: string;
  price?: number;
  proposedPrice?: number;
  deliveryTime?: string;
  estimatedDays?: number;
  attachments?: string[];
  status: ProposalStatus;
  createdAt: string;
}

export type Proposal = JobProposal;

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderPhoto?: string;
  senderRole?: UserRole;
  text: string;
  timestamp: string;
  read?: boolean;
  images?: string[];
  attachments?: MessageAttachment[];
  quoteData?: {
    quoteId: string;
    amount: number;
    title: string;
    deliveryTime: string;
    status?: string;
  };
  orderData?: {
    orderId: string;
    amount: number;
    status: string;
  };
  systemAction?: string;
}

export interface Conversation {
  id: string;
  type?: ConversationType;
  title?: string;
  participants: string[];
  participantDetails: {
    [userId: string]: {
      name: string;
      photo?: string;
      role: UserRole;
      departmentOrCompany?: string;
      isVerified?: boolean;
      matricNumber?: string;
      phoneNumber?: string;
    };
  };
  context?: ConversationContext;
  lastMessage: string;
  lastMessageTimestamp: string;
  lastMessageSenderId?: string;
  unreadCounts: { [userId: string]: number };
  relatedJobId?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewItem {
  id: string;
  jobId: string;
  jobTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerPhoto?: string;
  reviewerRole?: UserRole;
  recipientId: string;
  recipientName: string;
  rating: number; // 1 to 5
  feedback?: string;
  comment?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  actorId?: string;
  actorName?: string;
  actorPhoto?: string;
  title: string;
  message: string;
  type: NotificationType;
  category?: 'orders_escrow' | 'messages' | 'jobs_proposals' | 'social_campus' | 'system_security';
  link?: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface WalletTransaction {
  id: string;
  jobId?: string;
  jobTitle?: string;
  payerId?: string;
  payerName?: string;
  recipientId?: string;
  recipientName?: string;
  amount: number;
  platformFee?: number;
  netAmount?: number;
  status: TransactionStatus;
  type: 'payment' | 'withdrawal' | 'escrow_hold' | 'refund' | 'credit' | 'debit';
  createdAt: string;
  date?: string;
  reference?: string;
  title?: string;
}

export interface VerificationRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  matricNumber: string;
  faculty: string;
  department: string;
  level: string;
  idCardImage: string;
  status: VerificationStatus;
  adminNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface PlatformReport {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'user' | 'service' | 'job' | 'review';
  targetId: string;
  targetTitle: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export interface PlatformSettings {
  platformName: string;
  platformFeePercent: number;
  platformFeePercentage?: number;
  minEscrowAmount?: number;
  maintenanceMode: boolean;
  supportEmail: string;
  supportPhone: string;
  primaryCampus: string;
  allowedFaculties: string[];
  requireStudentVerification?: boolean;
  autoApproveServices?: boolean;
  allowNotifications?: boolean;
  allowEmailNotifications?: boolean;
  allowInstantPayouts?: boolean;
}

export * from './marketplace';
export * from './campus';
export * from './opportunities';
export * from './transaction';
export * from './trustSafety';
export * from './admin';

