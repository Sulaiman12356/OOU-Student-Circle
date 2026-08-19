import { 
  TrustVerificationRequest, 
  VerificationTier, 
  VerificationStatus,
  UniversalReport, 
  ReportTargetType, 
  ReportReasonCode, 
  REPORT_REASONS,
  BlockedUserEntry, 
  VerifiedTransactionReview,
  ModerationActionPayload,
  VERIFICATION_TIERS 
} from '../types/trustSafety';
import { DataStore } from './dataStore';
import { MessagingStore } from './messagingStore';
import founderImage from '../assets/images/founder_sulaiman.jpg';

const STORAGE_PREFIX = 'oou_trust_safety_';

// Initial Seed Verification Requests
export const initialVerificationRequests: TrustVerificationRequest[] = [
  {
    id: 'tvr-1',
    userId: 'student-1',
    userName: 'Onifade Sulaiman',
    userEmail: 'clarityofficial85@gmail.com',
    userRole: 'student',
    userPhoto: founderImage,
    tier: 'student',
    status: 'verified',
    privateMatricNumber: 'CSC/2021/0482', // PRIVATE: Kept private & only for admin accreditation
    faculty: 'Faculty of Science',
    department: 'Computer Science',
    level: '400L',
    studentIdCardUrl: '#doc-oou-student-id-sulaiman',
    submittedAt: '2024-01-16T10:00:00Z',
    reviewedAt: '2024-01-16T12:30:00Z',
    reviewedBy: 'Admin ICT Directorate',
    adminNotes: 'Accredited against OOU Main Campus portal records. Valid 400L student.'
  },
  {
    id: 'tvr-2',
    userId: 'student-1',
    userName: 'Onifade Sulaiman',
    userEmail: 'clarityofficial85@gmail.com',
    userRole: 'student',
    userPhoto: founderImage,
    tier: 'service_provider',
    status: 'verified',
    providerSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'System Architecture'],
    providerPortfolioUrl: 'https://github.com/ipesola',
    verifiedPhone: '+234 805 178 0169',
    submittedAt: '2024-01-20T14:00:00Z',
    reviewedAt: '2024-01-20T16:00:00Z',
    reviewedBy: 'Admin Quality Team',
    adminNotes: 'Verified GitHub portfolio and validated WhatsApp contact.'
  },
  {
    id: 'tvr-3',
    userId: 'student-4',
    userName: 'Praise Daniel',
    userEmail: 'praise.daniel@gmail.com',
    userRole: 'student',
    userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    tier: 'student',
    status: 'pending',
    privateMatricNumber: 'BCH/2022/0088',
    faculty: 'Faculty of Basic Medical Sciences',
    department: 'Biochemistry',
    level: '300L',
    studentIdCardUrl: '#doc-praise-student-id',
    submittedAt: '2024-05-14T08:00:00Z'
  },
  {
    id: 'tvr-4',
    userId: 'shop-vendor-1',
    userName: 'Alhaja Biz Venture (Motion Ground)',
    userEmail: 'print.motion@oou.edu.ng',
    userRole: 'student',
    tier: 'campus_shop',
    status: 'verified',
    shopId: 'shop-motion-print',
    shopName: 'Alhaja Biz Venture & Print Central',
    shopPhysicalLocation: 'Shop E6, Motion Ground Commercial Centre, Ago-Iwoye Main Campus',
    shopPermitUrl: '#doc-motion-ground-permit',
    submittedAt: '2024-02-10T11:00:00Z',
    reviewedAt: '2024-02-10T15:00:00Z',
    reviewedBy: 'Campus Commerce Registry',
    adminNotes: 'Physical kiosk inspection confirmed at Shop E6 Motion Ground.'
  },
  {
    id: 'tvr-5',
    userId: 'client-1',
    userName: 'Johnson Peter',
    userEmail: 'johnson@apexbrands.ng',
    userRole: 'client',
    userPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    tier: 'business',
    status: 'verified',
    businessName: 'Apex Brand Studio & Tech Hub',
    cacRegistrationNumber: 'RC-1849204',
    businessDocUrl: '#doc-cac-certificate-apex',
    officialRepName: 'Johnson Peter (Managing Director)',
    submittedAt: '2024-03-01T09:00:00Z',
    reviewedAt: '2024-03-01T12:00:00Z',
    reviewedBy: 'Corporate Compliance Desk',
    adminNotes: 'CAC certificate verified on public registry.'
  }
];

// Initial Seed Universal Reports
export const initialUniversalReports: UniversalReport[] = [
  {
    id: 'rep-mod-1',
    reporterId: 'client-1',
    reporterName: 'Johnson Peter',
    reporterEmail: 'johnson@apexbrands.ng',
    targetType: 'service',
    targetId: 'srv-flagged-09',
    targetTitle: 'Suspicious 30-Minute Guaranteed Grade Fixer',
    targetOwnerId: 'student-bad-actor',
    targetOwnerName: 'Unknown Suspicious User',
    reason: 'prohibited',
    reasonLabel: 'Prohibited Content / Academic Dishonesty',
    description: 'User claiming to alter examination scores for Faculty of Law students. This violates OOU academic policy.',
    evidenceAttachments: [
      { name: 'chat_screenshot_academic_malpractice.png', url: '#doc-evidence-1', type: 'image' }
    ],
    status: 'pending',
    createdAt: '2024-05-18T10:15:00Z'
  },
  {
    id: 'rep-mod-2',
    reporterId: 'student-1',
    reporterName: 'Onifade Sulaiman',
    reporterEmail: 'clarityofficial85@gmail.com',
    targetType: 'message',
    targetId: 'msg-flagged-88',
    targetTitle: 'Off-Platform Direct Transfer Request in Chat',
    targetOwnerId: 'client-scam-attempt',
    targetOwnerName: 'Fake Hostel Agent',
    reason: 'fraud',
    reasonLabel: 'Fraud / Scam / Escrow Bypass',
    description: 'User sent message asking to bypass StudentCircle escrow and transfer ₦45,000 directly to an OPay account before inspection.',
    status: 'investigating',
    adminNotes: 'Reviewing conversation logs. Account temporarily flagged for review.',
    createdAt: '2024-05-17T16:40:00Z'
  }
];

// Initial Seed Blocked Users
export const initialBlockedUsers: BlockedUserEntry[] = [
  {
    id: 'blk-1',
    blockerId: 'student-1',
    blockedUserId: 'spammer-99',
    blockedUserName: 'Spam Crypto Bot',
    blockedUserDepartment: 'Unknown',
    reason: 'Sending unwanted automated trading messages in chat.',
    createdAt: '2024-04-10T12:00:00Z'
  }
];

// Initial Seed Verified Reviews (Guaranteed 1 per completed transaction)
export const initialVerifiedReviews: VerifiedTransactionReview[] = [
  {
    id: 'vrev-1',
    orderId: 'sord-1',
    transactionType: 'service',
    targetItemId: 'srv-1',
    targetItemTitle: 'Modern Minimalist Logo & Brand Identity Design',
    reviewerId: 'client-1',
    reviewerName: 'Johnson Peter',
    reviewerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    reviewerRole: 'client',
    targetUserId: 'student-2',
    targetUserName: 'Adebayo Samuel',
    rating: 5,
    criteria: {
      quality: 5,
      communication: 5,
      timeliness: 5
    },
    writtenReview: 'Adebayo delivered top-tier branding graphics for our campus launch ahead of schedule! He provided all vector formats, PNGs, and beautiful presentation mockups.',
    proofImages: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'
    ],
    isVerifiedTransaction: true,
    createdAt: '2024-05-15T19:00:00Z'
  },
  {
    id: 'vrev-2',
    orderId: 'tx-1001',
    transactionType: 'job',
    targetItemId: 'job-4',
    targetItemTitle: 'Web Developer to build landing page for student event',
    reviewerId: 'client-1',
    reviewerName: 'Johnson Peter',
    reviewerPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    reviewerRole: 'client',
    targetUserId: 'student-1',
    targetUserName: 'Onifade Sulaiman',
    rating: 5,
    criteria: {
      quality: 5,
      communication: 5,
      timeliness: 5
    },
    writtenReview: 'Sulaiman is exceptional! He built our landing page ahead of schedule with spotless TypeScript code and smooth responsive layout. Highly recommended campus talent.',
    isVerifiedTransaction: true,
    createdAt: '2024-05-10T19:00:00Z'
  }
];

class TrustSafetyService {
  private getStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('TrustSafety storage write error:', e);
    }
  }

  // =========================================================================
  // 1. VERIFICATION ENGINE
  // =========================================================================

  public getVerificationRequests(): TrustVerificationRequest[] {
    return this.getStorage<TrustVerificationRequest[]>('verification_requests', initialVerificationRequests);
  }

  public getVerificationRequestById(id: string): TrustVerificationRequest | undefined {
    return this.getVerificationRequests().find(r => r.id === id);
  }

  public getVerificationRequestsByUser(userId: string): TrustVerificationRequest[] {
    return this.getVerificationRequests().filter(r => r.userId === userId);
  }

  public getUserVerificationStatus(userId: string, tier: VerificationTier = 'student'): VerificationStatus {
    // Check if user is already marked verified in DataStore
    const user = DataStore.getUserById(userId);
    if (user?.isVerified && tier === 'student') return 'verified';

    const requests = this.getVerificationRequestsByUser(userId);
    const tierReq = requests.find(r => r.tier === tier);
    if (tierReq) return tierReq.status;

    return 'unverified';
  }

  public getUserActiveTiers(userId: string): VerificationTier[] {
    const user = DataStore.getUserById(userId);
    const activeTiers: VerificationTier[] = [];

    const requests = this.getVerificationRequestsByUser(userId).filter(r => r.status === 'verified');
    requests.forEach(r => {
      if (!activeTiers.includes(r.tier)) {
        activeTiers.push(r.tier);
      }
    });

    if (user?.isVerified && !activeTiers.includes('student')) {
      activeTiers.push('student');
    }

    return activeTiers;
  }

  public isUserTierVerified(userId: string, tier: VerificationTier): boolean {
    return this.getUserActiveTiers(userId).includes(tier);
  }

  public submitVerificationRequest(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'student' | 'client' | 'admin';
    userPhoto?: string;
    tier: VerificationTier;
    privateMatricNumber?: string;
    privateJambNumber?: string;
    faculty?: string;
    department?: string;
    level?: string;
    studentIdCardUrl?: string;
    admissionLetterUrl?: string;
    providerSkills?: string[];
    providerPortfolioUrl?: string;
    verifiedPhone?: string;
    shopId?: string;
    shopName?: string;
    shopPhysicalLocation?: string;
    shopPermitUrl?: string;
    businessName?: string;
    cacRegistrationNumber?: string;
    businessDocUrl?: string;
    officialRepName?: string;
  }): TrustVerificationRequest {
    const requests = this.getVerificationRequests();
    
    // Check for existing pending request for this tier
    const existingIndex = requests.findIndex(r => r.userId === data.userId && r.tier === data.tier);

    const newRequest: TrustVerificationRequest = {
      id: existingIndex >= 0 ? requests[existingIndex].id : `tvr-${Date.now()}`,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userRole: data.userRole,
      userPhoto: data.userPhoto,
      tier: data.tier,
      status: 'pending',
      privateMatricNumber: data.privateMatricNumber,
      privateJambNumber: data.privateJambNumber,
      faculty: data.faculty,
      department: data.department,
      level: data.level,
      studentIdCardUrl: data.studentIdCardUrl || '#doc-student-id-scan',
      admissionLetterUrl: data.admissionLetterUrl,
      providerSkills: data.providerSkills,
      providerPortfolioUrl: data.providerPortfolioUrl,
      verifiedPhone: data.verifiedPhone,
      shopId: data.shopId,
      shopName: data.shopName,
      shopPhysicalLocation: data.shopPhysicalLocation,
      shopPermitUrl: data.shopPermitUrl,
      businessName: data.businessName,
      cacRegistrationNumber: data.cacRegistrationNumber,
      businessDocUrl: data.businessDocUrl,
      officialRepName: data.officialRepName,
      submittedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      requests[existingIndex] = newRequest;
    } else {
      requests.unshift(newRequest);
    }

    this.setStorage('verification_requests', requests);

    // Also update legacy DataStore verification request for backward compatibility
    if (data.tier === 'student') {
      DataStore.saveVerificationRequest({
        id: newRequest.id,
        studentId: data.userId,
        studentName: data.userName,
        studentEmail: data.userEmail,
        matricNumber: data.privateMatricNumber || 'Provided in Accreditation',
        faculty: data.faculty || 'Faculty of Science',
        department: data.department || 'Computer Science',
        level: data.level || '400L',
        idCardImage: data.studentIdCardUrl || '#doc-id-scan',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    }

    // Add notification
    MessagingStore.addNotification({
      userId: data.userId,
      title: `${VERIFICATION_TIERS[data.tier].badgeLabel} Under Review 🛡️`,
      message: `Your verification submission for ${VERIFICATION_TIERS[data.tier].label} has been received and is being processed by the Accreditation Team.`,
      type: 'verification',
      category: 'system_security'
    });

    return newRequest;
  }

  public reviewVerificationRequest(
    requestId: string, 
    status: VerificationStatus, 
    adminNotes?: string, 
    adminId = 'admin-1'
  ): void {
    const requests = this.getVerificationRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    req.status = status;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = adminId;
    if (adminNotes) req.adminNotes = adminNotes;

    this.setStorage('verification_requests', requests);

    // If student tier and approved, update user in DataStore
    if (req.tier === 'student') {
      const user = DataStore.getUserById(req.userId);
      if (user) {
        user.isVerified = status === 'verified';
        user.verificationStatus = status;
        user.verificationNotes = adminNotes;
        if (req.faculty) user.faculty = req.faculty;
        if (req.department) user.department = req.department;
        if (req.level) user.level = req.level as any;
        DataStore.saveUser(user);
      }
    }

    // Audit log
    DataStore.logAdminAction(
      status === 'verified' ? 'VERIFICATION_APPROVED' : 'VERIFICATION_REJECTED',
      'user_verification',
      req.userId,
      `Accreditation ${status.toUpperCase()} for ${req.userName} (${req.tier}). Notes: ${adminNotes || 'None'}`
    );

    // Send notification to user
    MessagingStore.addNotification({
      userId: req.userId,
      title: status === 'verified' 
        ? `${VERIFICATION_TIERS[req.tier].badgeLabel} Approved! ✅` 
        : `${VERIFICATION_TIERS[req.tier].badgeLabel} Update ⚠️`,
      message: status === 'verified'
        ? `Congratulations! Your account has received the official "${VERIFICATION_TIERS[req.tier].badgeLabel}" badge.`
        : `Your verification application was ${status}. Notes: ${adminNotes || 'Please re-verify your credentials.'}`,
      type: 'verification',
      category: 'system_security'
    });
  }

  public revokeVerificationBadge(userId: string, tier: VerificationTier, reason: string): void {
    const requests = this.getVerificationRequests();
    const req = requests.find(r => r.userId === userId && r.tier === tier);
    if (req) {
      req.status = 'rejected';
      req.rejectionReason = reason;
      req.reviewedAt = new Date().toISOString();
      this.setStorage('verification_requests', requests);
    }

    if (tier === 'student') {
      DataStore.verifyUser(userId, false);
    }

    DataStore.logAdminAction(
      'VERIFICATION_REVOKED',
      'user_verification',
      userId,
      `Badge ${tier} revoked. Reason: ${reason}`
    );

    MessagingStore.addNotification({
      userId,
      title: 'Verification Badge Revoked ⚠️',
      message: `Your ${VERIFICATION_TIERS[tier].badgeLabel} has been revoked by platform moderation: ${reason}`,
      type: 'admin_action',
      category: 'system_security'
    });
  }

  // =========================================================================
  // 2. UNIVERSAL REPORTING SYSTEM
  // =========================================================================

  public getReports(): UniversalReport[] {
    return this.getStorage<UniversalReport[]>('universal_reports', initialUniversalReports);
  }

  public getReportById(id: string): UniversalReport | undefined {
    return this.getReports().find(r => r.id === id);
  }

  public submitReport(data: {
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
    description: string;
    evidenceAttachments?: Array<{ name: string; url: string; type: string }>;
  }): UniversalReport {
    const reports = this.getReports();
    const reasonInfo = REPORT_REASONS[data.reason] || REPORT_REASONS.other;

    const newReport: UniversalReport = {
      id: `rep-${Date.now()}`,
      reporterId: data.reporterId,
      reporterName: data.reporterName,
      reporterEmail: data.reporterEmail,
      reporterPhoto: data.reporterPhoto,
      targetType: data.targetType,
      targetId: data.targetId,
      targetTitle: data.targetTitle,
      targetOwnerId: data.targetOwnerId,
      targetOwnerName: data.targetOwnerName,
      reason: data.reason,
      reasonLabel: reasonInfo.label,
      description: data.description,
      evidenceAttachments: data.evidenceAttachments || [],
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    reports.unshift(newReport);
    this.setStorage('universal_reports', reports);

    // Also register in legacy DataStore reports for compatibility
    DataStore.saveReport({
      id: newReport.id,
      reporterId: data.reporterId,
      reporterName: data.reporterName,
      targetType: data.targetType as any,
      targetId: data.targetId,
      targetTitle: data.targetTitle,
      reason: reasonInfo.label,
      description: data.description,
      status: 'open',
      createdAt: new Date().toISOString()
    });

    // Notify user that report is being handled
    MessagingStore.addNotification({
      userId: data.reporterId,
      title: 'Report Received by Trust & Safety 🛡️',
      message: `Thank you for protecting OOU StudentCircle. We have received your report regarding "${data.targetTitle}" and are investigating.`,
      type: 'admin_action',
      category: 'system_security'
    });

    return newReport;
  }

  public updateReportStatus(
    reportId: string,
    status: UniversalReport['status'],
    actionTaken: UniversalReport['actionTaken'] = 'none',
    adminNotes?: string,
    adminId = 'admin-1'
  ): void {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (!rep) return;

    rep.status = status;
    rep.actionTaken = actionTaken;
    rep.resolvedAt = new Date().toISOString();
    rep.assignedAdminId = adminId;
    if (adminNotes) rep.adminNotes = adminNotes;

    this.setStorage('universal_reports', reports);

    DataStore.logAdminAction(
      'REPORT_RESOLVED',
      rep.targetType,
      rep.targetId,
      `Report status: ${status}. Action: ${actionTaken}. Notes: ${adminNotes || 'None'}`
    );
  }

  // =========================================================================
  // 3. USER BLOCKING SYSTEM
  // =========================================================================

  public getBlockedUsers(userId: string): BlockedUserEntry[] {
    const all = this.getStorage<BlockedUserEntry[]>('blocked_users', initialBlockedUsers);
    return all.filter(b => b.blockerId === userId);
  }

  public isUserBlocked(userAId: string, userBId: string): boolean {
    if (!userAId || !userBId) return false;
    const all = this.getStorage<BlockedUserEntry[]>('blocked_users', initialBlockedUsers);
    return all.some(
      b => (b.blockerId === userAId && b.blockedUserId === userBId) ||
           (b.blockerId === userBId && b.blockedUserId === userAId)
    );
  }

  public blockUser(
    blockerId: string, 
    blockedUserId: string, 
    reason?: string
  ): { success: boolean; message: string } {
    if (blockerId === blockedUserId) {
      return { success: false, message: 'You cannot block yourself.' };
    }

    const all = this.getStorage<BlockedUserEntry[]>('blocked_users', initialBlockedUsers);
    const existing = all.find(b => b.blockerId === blockerId && b.blockedUserId === blockedUserId);
    if (existing) {
      return { success: true, message: 'User is already blocked.' };
    }

    const targetUser = DataStore.getUserById(blockedUserId);

    const newEntry: BlockedUserEntry = {
      id: `blk-${Date.now()}`,
      blockerId,
      blockedUserId,
      blockedUserName: targetUser?.fullName || 'Campus User',
      blockedUserPhoto: targetUser?.profilePhoto,
      blockedUserDepartment: targetUser?.department || targetUser?.businessName,
      blockedUserRole: targetUser?.role,
      reason: reason || 'Direct user safety action',
      createdAt: new Date().toISOString()
    };

    all.unshift(newEntry);
    this.setStorage('blocked_users', all);

    return { 
      success: true, 
      message: `${targetUser?.fullName || 'User'} has been blocked. They can no longer message or interact with you.` 
    };
  }

  public unblockUser(
    blockerId: string, 
    blockedUserId: string
  ): { success: boolean; message: string } {
    let all = this.getStorage<BlockedUserEntry[]>('blocked_users', initialBlockedUsers);
    const initialLen = all.length;
    all = all.filter(b => !(b.blockerId === blockerId && b.blockedUserId === blockedUserId));
    this.setStorage('blocked_users', all);

    return { 
      success: all.length < initialLen, 
      message: 'User unblocked successfully.' 
    };
  }

  // =========================================================================
  // 4. VERIFIED TRANSACTION REVIEWS (ANTI-ABUSE)
  // =========================================================================

  public getVerifiedReviews(): VerifiedTransactionReview[] {
    return this.getStorage<VerifiedTransactionReview[]>('verified_reviews', initialVerifiedReviews);
  }

  public getReviewsForUser(targetUserId: string): VerifiedTransactionReview[] {
    return this.getVerifiedReviews().filter(r => r.targetUserId === targetUserId);
  }

  public getReviewsForTarget(targetType: string, targetId: string): VerifiedTransactionReview[] {
    return this.getVerifiedReviews().filter(r => r.transactionType === targetType && r.targetItemId === targetId);
  }

  public canUserReview(
    reviewerId: string,
    targetUserId: string,
    orderId: string
  ): { canReview: boolean; reason?: string; order?: any } {
    if (!reviewerId) {
      return { canReview: false, reason: 'You must be logged in to leave a review.' };
    }

    // Check Self Review
    if (reviewerId === targetUserId) {
      return { canReview: false, reason: 'Self reviews are strictly prohibited on OOU StudentCircle.' };
    }

    // Check Completed Transaction
    if (!orderId) {
      return { canReview: false, reason: 'Reviews must be connected to a verified completed transaction/order ID.' };
    }

    // Check Duplicate Review for Order ID
    const existing = this.getVerifiedReviews().find(r => r.orderId === orderId);
    if (existing) {
      return { canReview: false, reason: 'A verified review has already been submitted for this transaction (1 review per completed order).' };
    }

    // Check Service Order in DataStore
    const serviceOrder = DataStore.getServiceOrderById(orderId);
    if (serviceOrder) {
      if (serviceOrder.customerId !== reviewerId) {
        return { canReview: false, reason: 'You can only review orders where you are the verified customer/buyer.' };
      }
      if (serviceOrder.status !== 'completed') {
        return { canReview: false, reason: 'Reviews can only be submitted once the order status is marked as Completed.' };
      }
      return { canReview: true, order: serviceOrder };
    }

    return { canReview: true };
  }

  public submitVerifiedReview(data: {
    orderId: string;
    transactionType: 'service' | 'marketplace' | 'job' | 'campus_shop';
    targetItemId: string;
    targetItemTitle: string;
    reviewerId: string;
    reviewerName: string;
    reviewerPhoto?: string;
    reviewerRole: string;
    targetUserId: string;
    targetUserName: string;
    rating: number;
    criteria?: { quality: number; communication: number; timeliness: number };
    writtenReview: string;
    proofImages?: string[];
  }): { success: boolean; review?: VerifiedTransactionReview; error?: string } {
    const check = this.canUserReview(data.reviewerId, data.targetUserId, data.orderId);
    if (!check.canReview) {
      return { success: false, error: check.reason };
    }

    const reviews = this.getVerifiedReviews();
    const newReview: VerifiedTransactionReview = {
      id: `vrev-${Date.now()}`,
      orderId: data.orderId,
      transactionType: data.transactionType,
      targetItemId: data.targetItemId,
      targetItemTitle: data.targetItemTitle,
      reviewerId: data.reviewerId,
      reviewerName: data.reviewerName,
      reviewerPhoto: data.reviewerPhoto,
      reviewerRole: data.reviewerRole,
      targetUserId: data.targetUserId,
      targetUserName: data.targetUserName,
      rating: Math.max(1, Math.min(5, data.rating)),
      criteria: data.criteria || { quality: data.rating, communication: data.rating, timeliness: data.rating },
      writtenReview: data.writtenReview.trim(),
      proofImages: data.proofImages || [],
      isVerifiedTransaction: true,
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    this.setStorage('verified_reviews', reviews);

    // Synchronize with DataStore's service reviews
    DataStore.saveReview({
      id: newReview.id,
      jobId: data.orderId,
      jobTitle: data.targetItemTitle,
      reviewerId: data.reviewerId,
      reviewerName: data.reviewerName,
      reviewerPhoto: data.reviewerPhoto,
      reviewerRole: data.reviewerRole as any,
      recipientId: data.targetUserId,
      recipientName: data.targetUserName,
      rating: data.rating,
      comment: data.writtenReview,
      createdAt: new Date().toISOString()
    });

    return { success: true, review: newReview };
  }

  // =========================================================================
  // 5. MODERATION ACTIONS (ADMIN CONTROL)
  // =========================================================================

  public executeModerationAction(payload: ModerationActionPayload): { success: boolean; message: string } {
    const { action, targetType, targetId, reason, notes, adminId, adminName } = payload;

    switch (action) {
      case 'approve_verification':
        this.reviewVerificationRequest(targetId, 'verified', notes, adminId);
        return { success: true, message: 'Verification approved and badge granted.' };

      case 'reject_verification':
        this.reviewVerificationRequest(targetId, 'rejected', notes, adminId);
        return { success: true, message: 'Verification request rejected.' };

      case 'dismiss_report':
        this.updateReportStatus(targetId, 'dismissed', 'dismissed', notes, adminId);
        return { success: true, message: 'Report dismissed.' };

      case 'issue_warning':
        this.updateReportStatus(targetId, 'actioned', 'warning_issued', notes, adminId);
        MessagingStore.addNotification({
          userId: targetId,
          title: 'Official Moderation Warning ⚠️',
          message: `Your account received a moderation notice regarding policy compliance: ${reason}`,
          type: 'admin_action',
          category: 'system_security'
        });
        return { success: true, message: 'Official warning issued to user.' };

      case 'remove_content':
        this.removeContent(targetType as ReportTargetType, targetId, reason);
        this.updateReportStatus(targetId, 'actioned', 'content_removed', notes, adminId);
        return { success: true, message: `Content item (${targetType}) has been unpublished and removed.` };

      case 'suspend_user':
        this.suspendUser(targetId, reason);
        return { success: true, message: 'User account has been suspended from the platform.' };

      case 'revoke_badge':
        this.revokeVerificationBadge(targetId, 'student', reason);
        return { success: true, message: 'Verification credentials revoked.' };

      default:
        return { success: false, message: 'Unknown moderation action.' };
    }
  }

  public suspendUser(userId: string, reason: string): void {
    const user = DataStore.getUserById(userId);
    if (user) {
      user.status = 'suspended';
      DataStore.saveUser(user);
    }

    DataStore.logAdminAction(
      'USER_SUSPENDED',
      'user',
      userId,
      `User account suspended. Reason: ${reason}`
    );

    MessagingStore.addNotification({
      userId,
      title: 'Account Suspended 🛑',
      message: `Your account has been suspended due to trust & safety policy violations: ${reason}. Contact support to appeal.`,
      type: 'admin_action',
      category: 'system_security'
    });
  }

  public unsuspendUser(userId: string): void {
    const user = DataStore.getUserById(userId);
    if (user) {
      user.status = 'active';
      DataStore.saveUser(user);
    }

    DataStore.logAdminAction('USER_REINSTATED', 'user', userId, 'Account restored to active status');
  }

  public removeContent(contentType: ReportTargetType, contentId: string, reason: string): void {
    if (contentType === 'service') {
      const services = DataStore.getServices();
      const srv = services.find(s => s.id === contentId);
      if (srv) {
        srv.status = 'rejected';
        DataStore.saveService(srv);
      }
    } else if (contentType === 'job') {
      DataStore.updateJobStatus(contentId, 'cancelled');
    }

    DataStore.logAdminAction(
      'CONTENT_REMOVED',
      contentType,
      contentId,
      `Content removed by moderation. Reason: ${reason}`
    );
  }

  // =========================================================================
  // 6. REAL-TIME SAFETY & OFF-PLATFORM PAYMENT KEYWORD DETECTOR
  // =========================================================================

  public detectOffPlatformPaymentKeywords(text: string): { 
    isSuspicious: boolean; 
    detectedKeywords: string[]; 
    warningMessage: string 
  } {
    if (!text) return { isSuspicious: false, detectedKeywords: [], warningMessage: '' };

    const lower = text.toLowerCase();
    const suspiciousPatterns = [
      { pattern: /opay/i, keyword: 'OPay' },
      { pattern: /palmpay/i, keyword: 'PalmPay' },
      { pattern: /kuda/i, keyword: 'Kuda Bank' },
      { pattern: /send to my account/i, keyword: 'Direct Account Transfer' },
      { pattern: /transfer directly/i, keyword: 'Direct Transfer' },
      { pattern: /pay to my bank/i, keyword: 'Off-Platform Bank Payment' },
      { pattern: /bypass escrow/i, keyword: 'Escrow Bypass' },
      { pattern: /pay outside/i, keyword: 'Pay Outside Platform' },
      { pattern: /whatsapp me for payment/i, keyword: 'External Payment Channel' },
      { pattern: /\b\d{10}\b/i, keyword: '10-digit NUBAN Account Number' }
    ];

    const detected: string[] = [];
    suspiciousPatterns.forEach(item => {
      if (item.pattern.test(lower)) {
        detected.push(item.keyword);
      }
    });

    if (detected.length > 0) {
      return {
        isSuspicious: true,
        detectedKeywords: detected,
        warningMessage: '⚠️ SAFETY ALERT: Potential off-platform payment request detected. Never transfer money directly or share OTPs. Keep all payments inside StudentCircle Escrow to guarantee your funds and delivery.'
      };
    }

    return { isSuspicious: false, detectedKeywords: [], warningMessage: '' };
  }
}

export const TrustSafetyStore = new TrustSafetyService();
