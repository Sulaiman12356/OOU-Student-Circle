export type VerificationTier = 'student' | 'service_provider' | 'campus_shop' | 'business';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'resubmission_requested';

export interface VerificationTierInfo {
  tier: VerificationTier;
  label: string;
  badgeLabel: string;
  iconName: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
  requirements: string[];
}

export const VERIFICATION_TIERS: Record<VerificationTier, VerificationTierInfo> = {
  student: {
    tier: 'student',
    label: 'OOU Student Verification',
    badgeLabel: 'Student Verified',
    iconName: 'GraduationCap',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    description: 'Accredited matriculated student of Olabisi Onabanjo University.',
    requirements: [
      'Valid OOU Matriculation Number / JAMB Reg Number (Kept Strictly Private)',
      'Official Student Identity Card or Admission Letter Scan',
      'Faculty, Department & Current Academic Level Confirmation'
    ]
  },
  service_provider: {
    tier: 'service_provider',
    label: 'Verified Service Provider',
    badgeLabel: 'Service Provider Verified',
    iconName: 'Sparkles',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#061A4F]',
    badgeBorder: 'border-blue-200',
    description: 'Vetted freelancer with proven skill portfolio and verified mobile contact.',
    requirements: [
      'Live portfolio artifacts / GitHub or project links',
      'Verified WhatsApp & Phone Contact',
      'At least one published, policy-compliant service listing'
    ]
  },
  campus_shop: {
    tier: 'campus_shop',
    label: 'Campus Physical Shop / Kiosk',
    badgeLabel: 'Campus Shop Verified',
    iconName: 'Store',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-200',
    description: 'Physical merchant or service center located on an official OOU campus.',
    requirements: [
      'Designated physical stall location (e.g. Motion Ground Shop E6, Mini Campus Quad)',
      'Campus trader permit or photo of physical shop front',
      'Active campus physical service / retail registration'
    ]
  },
  business: {
    tier: 'business',
    label: 'Registered Business & Corporate Client',
    badgeLabel: 'Business Verified',
    iconName: 'Building2',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-200',
    description: 'Registered corporate entity, hiring agency, or registered commercial brand.',
    requirements: [
      'Corporate Affairs Commission (CAC) Registration / RC Number',
      'Authorized company representative credentials & official email',
      'Business address and verifiable business profile'
    ]
  }
};

export interface TrustVerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'student' | 'client' | 'admin';
  userPhoto?: string;
  tier: VerificationTier;
  status: VerificationStatus;
  
  // PRIVACY MANDATE: Matric number, JAMB number, and raw national IDs are strictly private!
  // Never displayed publicly in user cards, search queries, or public profile endpoints.
  privateMatricNumber?: string;
  privateJambNumber?: string;
  faculty?: string;
  department?: string;
  level?: string;
  studentIdCardUrl?: string;
  admissionLetterUrl?: string;
  
  // Service Provider Tier
  providerSkills?: string[];
  providerPortfolioUrl?: string;
  verifiedPhone?: string;
  
  // Campus Shop Tier
  shopId?: string;
  shopName?: string;
  shopPhysicalLocation?: string; // e.g., "Shop E6, Motion Ground Commercial Centre, Main Campus"
  shopPermitUrl?: string;
  
  // Business Tier
  businessName?: string;
  cacRegistrationNumber?: string;
  businessDocUrl?: string;
  officialRepName?: string;
  
  // Audit Trail
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
  rejectionReason?: string;
}

export type ReportTargetType = 
  | 'profile' 
  | 'product' 
  | 'service' 
  | 'job' 
  | 'shop' 
  | 'review' 
  | 'message';

export type ReportReasonCode = 
  | 'fraud'
  | 'misleading'
  | 'harassment'
  | 'prohibited'
  | 'copyright'
  | 'other';

export interface ReportReasonOption {
  code: ReportReasonCode;
  label: string;
  description: string;
  severity: 'high' | 'medium' | 'critical';
}

export const REPORT_REASONS: Record<ReportReasonCode, ReportReasonOption> = {
  fraud: {
    code: 'fraud',
    label: 'Fraud / Scam / Escrow Bypass',
    description: 'Asking for direct payment outside StudentCircle (OPay/Kuda), failing to deliver after payment, or financial deception.',
    severity: 'critical'
  },
  misleading: {
    code: 'misleading',
    label: 'Misleading Information / Impersonation',
    description: 'Fake profile details, stolen student identity, false academic level, or deceptive service specs.',
    severity: 'high'
  },
  harassment: {
    code: 'harassment',
    label: 'Harassment / Abusive Behavior',
    description: 'Threats, offensive language, cyber-bullying, discrimination, or abusive communication.',
    severity: 'high'
  },
  prohibited: {
    code: 'prohibited',
    label: 'Prohibited Content / Academic Dishonesty',
    description: 'Selling contraband, illicit items, offering to write exams/test halls, or academic malpractices.',
    severity: 'critical'
  },
  copyright: {
    code: 'copyright',
    label: 'Copyright Concern / Stolen Work',
    description: 'Using another designer/developer/student\'s portfolio or copyrighted materials without permission.',
    severity: 'medium'
  },
  other: {
    code: 'other',
    label: 'Other Policy Violation',
    description: 'Any other action that contradicts OOU StudentCircle Community Safety Guidelines.',
    severity: 'medium'
  }
};

export interface UniversalReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail?: string;
  reporterPhoto?: string;
  
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
  targetOwnerId?: string;
  targetOwnerName?: string;
  
  reason: ReportReasonCode;
  reasonLabel: string;
  description: string;
  evidenceAttachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  
  status: 'pending' | 'investigating' | 'actioned' | 'dismissed';
  actionTaken?: 'warning_issued' | 'content_removed' | 'user_suspended' | 'badge_revoked' | 'dismissed' | 'none';
  adminNotes?: string;
  assignedAdminId?: string;
  
  createdAt: string;
  resolvedAt?: string;
}

export interface BlockedUserEntry {
  id: string;
  blockerId: string;
  blockedUserId: string;
  blockedUserName: string;
  blockedUserPhoto?: string;
  blockedUserDepartment?: string;
  blockedUserRole?: string;
  reason?: string;
  createdAt: string;
}

export interface VerifiedTransactionReview {
  id: string;
  orderId: string; // Strictly enforced: must match a real completed order!
  transactionType: 'service' | 'marketplace' | 'job' | 'campus_shop';
  targetItemId: string;
  targetItemTitle: string;
  
  reviewerId: string;
  reviewerName: string;
  reviewerPhoto?: string;
  reviewerRole: string;
  
  targetUserId: string;
  targetUserName: string;
  
  rating: number; // 1 to 5
  criteria?: {
    quality: number;
    communication: number;
    timeliness: number;
  };
  writtenReview: string;
  proofImages?: string[];
  isVerifiedTransaction: boolean;
  
  createdAt: string;
}

export interface ModerationActionPayload {
  adminId: string;
  adminName: string;
  action: 'approve_verification' | 'reject_verification' | 'dismiss_report' | 'issue_warning' | 'remove_content' | 'suspend_user' | 'revoke_badge' | 'resolve_dispute';
  targetType: string;
  targetId: string;
  reason: string;
  notes?: string;
}
