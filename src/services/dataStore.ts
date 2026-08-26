import { 
  UserProfile, 
  ServiceItem, 
  JobPost, 
  JobProposal, 
  ChatMessage, 
  Conversation, 
  ReviewItem, 
  AppNotification, 
  NotificationType,
  WalletTransaction, 
  VerificationRequest, 
  PlatformReport, 
  AdminLog, 
  PlatformSettings,
  UserRole,
  ServiceRequest,
  ServiceQuote,
  ServiceOrder,
  ServiceReview,
  PricingType
} from '../types';
import founderImage from '../assets/images/founder_sulaiman.jpg';

// Storage keys
const STORAGE_PREFIX = 'oou_studentcircle_';

// Initial Seed Users - Empty by default, populated dynamically via authentication
export const initialUsers: UserProfile[] = [];

// Initial Seed Services - Empty by default, populated dynamically
export const initialServices: ServiceItem[] = [];

// Initial Seed Jobs - Empty by default, populated dynamically
export const initialJobs: JobPost[] = [];

// Initial Seed Proposals - Empty by default
export const initialProposals: JobProposal[] = [];

// Initial Seed Reviews - Empty by default
export const initialReviews: ReviewItem[] = [];

// Initial Seed Service Requests
export const initialServiceRequests: ServiceRequest[] = [];

// Initial Seed Quotes
export const initialServiceQuotes: ServiceQuote[] = [];

// Initial Seed Orders
export const initialServiceOrders: ServiceOrder[] = [];

// Initial Seed Service Reviews
export const initialServiceReviews: ServiceReview[] = [];

// Initial Seed Conversations & Messages
export const initialConversations: Conversation[] = [];

export const initialMessages: Record<string, ChatMessage[]> = {};

// Initial Seed Notifications
export const initialNotifications: AppNotification[] = [];

// Initial Seed Transactions
export const initialTransactions: WalletTransaction[] = [];

// Initial Verification Requests for Admin
export const initialVerificationRequests: VerificationRequest[] = [];

// Initial Reports
export const initialReports: PlatformReport[] = [];

// Initial Admin Audit Logs
export const initialAdminLogs: AdminLog[] = [];

export const initialPlatformSettings: PlatformSettings = {
  platformName: 'OOU StudentCircle',
  platformFeePercent: 10,
  maintenanceMode: false,
  supportEmail: 'hello@ooustudentcircle.com',
  supportPhone: '+234 812 345 6789',
  primaryCampus: 'Olabisi Onabanjo University, Ago-Iwoye, Ogun State',
  allowedFaculties: [
    'Faculty of Science',
    'Faculty of Social and Management Sciences',
    'Faculty of Arts',
    'Faculty of Law',
    'Faculty of Basic Medical Sciences',
    'Faculty of Clinical Sciences',
    'Faculty of Pharmacy',
    'Faculty of Engineering & Environmental Studies',
    'Faculty of Agricultural Sciences',
    'Faculty of Education'
  ]
};

// Data Store Helper Functions with Local Storage Sync
export class DataStore {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // Users
  static getUsers(): UserProfile[] {
    const users = this.getItem<UserProfile[]>('users', initialUsers);
    return users.map(u => {
      if (u.id === 'student-1' && (!u.profilePhoto || u.profilePhoto.includes('unsplash'))) {
        return { ...u, profilePhoto: founderImage };
      }
      return u;
    });
  }

  static getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static saveUser(user: UserProfile): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    this.setItem('users', users);
  }

  static updateUserStatus(userId: string, status: 'active' | 'suspended'): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.status = status;
      this.setItem('users', users);
    }
  }

  // Services
  static getServices(): ServiceItem[] {
    const rawServices = this.getItem<ServiceItem[]>('services', initialServices);
    return rawServices.map(s => {
      const startingPrice = s.price ?? s.startingPrice ?? s.pricing?.startingAt ?? 5000;
      const tags = s.tags && s.tags.length > 0 ? s.tags : (s.skills && s.skills.length > 0 ? s.skills : ['Freelance', 'Student Talent']);
      const skills = s.skills && s.skills.length > 0 ? s.skills : tags;
      const coverPhoto = s.coverPhoto || s.coverImage || s.portfolioImages?.[0] || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80';
      const coverImage = coverPhoto;
      const deliveryDays = s.deliveryDays || (s.deliveryTime ? parseInt(s.deliveryTime, 10) || 2 : 2);
      const deliveryTime = s.deliveryTime || `${deliveryDays} Days`;
      const campus = s.campus || s.location || 'Main Campus (Ago-Iwoye)';
      const serviceArea = s.serviceArea || 'Campus Wide & Online';
      const pricingType: PricingType = s.pricingType || 'Starting From';
      const viewsCount = s.viewsCount ?? 45;
      
      const pricing = s.pricing || {
        startingAt: startingPrice,
        currency: 'NGN',
        tiers: {
          basic: {
            name: 'Basic Package',
            description: 'Essential deliverable with source files and standard revisions.',
            price: startingPrice,
            deliveryDays,
            features: ['Essential deliverable']
          },
          standard: {
            name: 'Standard Package',
            description: 'Full comprehensive deliverable with priority support and all assets.',
            price: Math.round(startingPrice * 1.5),
            deliveryDays: deliveryDays + 1,
            features: ['Full project deliverable', 'Source files', 'Priority revisions']
          },
          premium: {
            name: 'Pro VIP Package',
            description: 'VIP expedited turnaround with unlimited revisions and consultation.',
            price: Math.round(startingPrice * 2.5),
            deliveryDays: deliveryDays + 2,
            features: ['VIP expedited turnaround', 'Unlimited revisions', '1-on-1 consultation']
          }
        }
      };

      return {
        ...s,
        price: startingPrice,
        startingPrice,
        pricingType,
        tags,
        skills,
        coverPhoto,
        coverImage,
        deliveryDays,
        deliveryTime,
        campus,
        serviceArea,
        viewsCount,
        pricing
      };
    });
  }

  static getServiceById(id: string): ServiceItem | undefined {
    return this.getServices().find(s => s.id === id);
  }

  static getServicesByStudentId(studentId: string): ServiceItem[] {
    return this.getServices().filter(s => s.studentId === studentId);
  }

  static getServicesByStudent(studentId: string): ServiceItem[] {
    return this.getServicesByStudentId(studentId);
  }

  static saveService(service: ServiceItem): void {
    const services = this.getServices();
    const index = services.findIndex(s => s.id === service.id);
    if (index >= 0) {
      services[index] = { ...service, updatedAt: new Date().toISOString() };
    } else {
      services.unshift(service);
    }
    this.setItem('services', services);
  }

  static deleteService(serviceId: string): void {
    const services = this.getServices().filter(s => s.id !== serviceId);
    this.setItem('services', services);
  }

  static updateServiceStatus(serviceId: string, status: ServiceItem['status']): void {
    const services = this.getServices();
    const target = services.find(s => s.id === serviceId);
    if (target) {
      target.status = status;
      this.setItem('services', services);
    }
  }

  // Jobs
  static getJobs(): JobPost[] {
    return this.getItem<JobPost[]>('jobs', initialJobs);
  }

  static getJobById(id: string): JobPost | undefined {
    return this.getJobs().find(j => j.id === id);
  }

  static getJobsByClientId(clientId: string): JobPost[] {
    return this.getJobs().filter(j => j.clientId === clientId);
  }

  static getJobsByClient(clientId: string): JobPost[] {
    return this.getJobsByClientId(clientId);
  }

  static deleteJob(jobId: string): void {
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    this.setItem('jobs', jobs);
  }

  static saveJob(job: JobPost): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index >= 0) {
      jobs[index] = { ...job, updatedAt: new Date().toISOString() };
    } else {
      jobs.unshift(job);
    }
    this.setItem('jobs', jobs);
  }

  static updateJobStatus(jobId: string, status: JobPost['status'], hiredStudentId?: string, hiredProposalId?: string): void {
    const jobs = this.getJobs();
    const target = jobs.find(j => j.id === jobId);
    if (target) {
      target.status = status;
      if (hiredStudentId) target.hiredStudentId = hiredStudentId;
      if (hiredProposalId) target.hiredProposalId = hiredProposalId;
      target.updatedAt = new Date().toISOString();
      this.setItem('jobs', jobs);
    }
  }

  // Proposals
  static getProposals(): JobProposal[] {
    return this.getItem<JobProposal[]>('proposals', initialProposals);
  }

  static getProposalsByJobId(jobId: string): JobProposal[] {
    return this.getProposals().filter(p => p.jobId === jobId);
  }

  static getProposalsByStudentId(studentId: string): JobProposal[] {
    return this.getProposals().filter(p => p.studentId === studentId);
  }

  static getProposalsByStudent(studentId: string): JobProposal[] {
    return this.getProposalsByStudentId(studentId);
  }

  static saveProposal(proposal: JobProposal): void {
    const proposals = this.getProposals();
    const index = proposals.findIndex(p => p.id === proposal.id);
    if (index >= 0) {
      proposals[index] = proposal;
    } else {
      proposals.unshift(proposal);
      // Increment proposal count on job
      const jobs = this.getJobs();
      const targetJob = jobs.find(j => j.id === proposal.jobId);
      if (targetJob) {
        targetJob.proposalsCount = (targetJob.proposalsCount || 0) + 1;
        if (targetJob.status === 'open') {
          targetJob.status = 'proposals_received';
        }
        this.setItem('jobs', jobs);
      }
    }
    this.setItem('proposals', proposals);
  }

  static updateProposalStatus(proposalId: string, status: JobProposal['status']): void {
    const proposals = this.getProposals();
    const target = proposals.find(p => p.id === proposalId);
    if (target) {
      target.status = status;
      this.setItem('proposals', proposals);
    }
  }

  // Conversations & Messages
  static getConversations(): Conversation[] {
    return this.getItem<Conversation[]>('conversations', initialConversations);
  }

  static getConversationsForUser(userId: string): Conversation[] {
    return this.getConversations().filter(c => c.participants.includes(userId));
  }

  static getMessages(conversationId: string): ChatMessage[] {
    const allMessages = this.getItem<Record<string, ChatMessage[]>>('messages', initialMessages);
    return allMessages[conversationId] || [];
  }

  static sendMessage(conversationId: string, message: ChatMessage): void {
    const allMessages = this.getItem<Record<string, ChatMessage[]>>('messages', initialMessages);
    if (!allMessages[conversationId]) {
      allMessages[conversationId] = [];
    }
    allMessages[conversationId].push(message);
    this.setItem('messages', allMessages);

    // Update conversation last message
    const conversations = this.getConversations();
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.lastMessage = message.text;
      conv.lastMessageTimestamp = message.timestamp;
      this.setItem('conversations', conversations);
    }
  }

  static getOrCreateConversation(userAId: string, userBId: string, jobId?: string): Conversation {
    const conversations = this.getConversations();
    let conv = conversations.find(c => 
      c.participants.includes(userAId) && c.participants.includes(userBId)
    );

    if (!conv) {
      const userA = this.getUserById(userAId);
      const userB = this.getUserById(userBId);
      
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        participants: [userAId, userBId],
        participantDetails: {
          [userAId]: {
            name: userA?.fullName || 'User',
            role: userA?.role || 'student',
            departmentOrCompany: userA?.department || userA?.businessName || '',
            photo: userA?.profilePhoto
          },
          [userBId]: {
            name: userB?.fullName || 'User',
            role: userB?.role || 'client',
            departmentOrCompany: userB?.department || userB?.businessName || '',
            photo: userB?.profilePhoto
          }
        },
        lastMessage: 'Conversation started',
        lastMessageTimestamp: new Date().toISOString(),
        unreadCounts: { [userAId]: 0, [userBId]: 0 },
        relatedJobId: jobId
      };
      conversations.unshift(newConv);
      this.setItem('conversations', conversations);
      return newConv;
    }
    return conv;
  }

  // Reviews
  static getReviews(): ReviewItem[] {
    return this.getItem<ReviewItem[]>('reviews', initialReviews);
  }

  static getReviewsForRecipient(recipientId: string): ReviewItem[] {
    return this.getReviews().filter(r => r.recipientId === recipientId);
  }

  static getReviewsForUser(userId: string): ReviewItem[] {
    return this.getReviewsForRecipient(userId);
  }

  static verifyUser(userId: string, isVerified: boolean): void {
    const users = this.getUsers();
    const target = users.find(u => u.id === userId);
    if (target) {
      target.isVerified = isVerified;
      target.verificationStatus = isVerified ? 'verified' : 'unverified';
      this.setItem('users', users);
    }
  }

  static saveReview(review: ReviewItem): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.setItem('reviews', reviews);

    // Recalculate recipient rating
    const userReviews = reviews.filter(r => r.recipientId === review.recipientId);
    const avgRating = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
    const recipient = this.getUserById(review.recipientId);
    if (recipient) {
      recipient.rating = Number(avgRating.toFixed(1));
      recipient.reviewsCount = userReviews.length;
      this.saveUser(recipient);
    }
  }

  // Notifications
  static getNotificationsForUser(userId: string): AppNotification[] {
    const notifs = this.getItem<AppNotification[]>('notifications', initialNotifications);
    return notifs.filter(n => n.userId === userId);
  }

  static addNotification(notification: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
    id?: string;
    read?: boolean;
    createdAt?: string;
  }): void {
    const notifs = this.getItem<AppNotification[]>('notifications', initialNotifications);
    const fullNotification: AppNotification = {
      id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      link: notification.link,
      read: notification.read ?? false,
      createdAt: notification.createdAt || new Date().toISOString()
    };
    notifs.unshift(fullNotification);
    this.setItem('notifications', notifs);
  }

  static markAllNotificationsAsRead(userId: string): void {
    const notifs = this.getItem<AppNotification[]>('notifications', initialNotifications);
    notifs.forEach(n => {
      if (n.userId === userId) n.read = true;
    });
    this.setItem('notifications', notifs);
  }

  // Transactions
  static getTransactions(): WalletTransaction[] {
    return this.getItem<WalletTransaction[]>('transactions', initialTransactions);
  }

  static getTransactionsForUser(userId: string): WalletTransaction[] {
    return this.getTransactions().filter(t => t.payerId === userId || t.recipientId === userId);
  }

  static recordTransaction(tx: WalletTransaction): void {
    const txs = this.getTransactions();
    const index = txs.findIndex(t => t.id === tx.id);
    if (index >= 0) {
      txs[index] = tx;
    } else {
      txs.unshift(tx);
    }
    this.setItem('transactions', txs);
  }

  static saveTransaction(tx: WalletTransaction): void {
    this.recordTransaction(tx);
  }

  // Verification Requests
  static getVerificationRequests(): VerificationRequest[] {
    return this.getItem<VerificationRequest[]>('verificationRequests', initialVerificationRequests);
  }

  static saveVerificationRequest(req: VerificationRequest): void {
    const reqs = this.getVerificationRequests();
    const index = reqs.findIndex(r => r.id === req.id);
    if (index >= 0) {
      reqs[index] = req;
    } else {
      reqs.unshift(req);
    }
    this.setItem('verificationRequests', reqs);
  }

  static updateVerificationStatus(requestId: string, status: VerificationRequest['status'], adminNotes?: string): void {
    const reqs = this.getVerificationRequests();
    const target = reqs.find(r => r.id === requestId);
    if (target) {
      target.status = status;
      if (adminNotes) target.adminNotes = adminNotes;
      target.resolvedAt = new Date().toISOString();
      this.setItem('verificationRequests', reqs);

      // Update student profile verification
      const student = this.getUserById(target.studentId);
      if (student) {
        student.isVerified = status === 'verified';
        student.verificationStatus = status;
        student.verificationNotes = adminNotes;
        this.saveUser(student);
      }
    }
  }

  // Reports
  static getReports(): PlatformReport[] {
    return this.getItem<PlatformReport[]>('reports', initialReports);
  }

  static saveReport(report: PlatformReport): void {
    const reports = this.getReports();
    reports.unshift(report);
    this.setItem('reports', reports);
  }

  static updateReportStatus(reportId: string, status: PlatformReport['status'], notes?: string): void {
    const reports = this.getReports();
    const target = reports.find(r => r.id === reportId);
    if (target) {
      target.status = status;
      if (notes) target.resolutionNotes = notes;
      this.setItem('reports', reports);
    }
  }

  // Admin Logs
  static getAdminLogs(): AdminLog[] {
    return this.getItem<AdminLog[]>('adminLogs', initialAdminLogs);
  }

  static logAdminAction(action: string, targetType: string, targetId: string, details: string, adminId = 'admin-1', adminEmail = 'admin@ooustudentcircle.com'): void {
    const logs = this.getAdminLogs();
    logs.unshift({
      id: `log-${Date.now()}`,
      adminId,
      adminEmail,
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toISOString()
    });
    this.setItem('adminLogs', logs);
  }

  // Service Requests (Module 3)
  static getServiceRequests(): ServiceRequest[] {
    return this.getItem<ServiceRequest[]>('serviceRequests', initialServiceRequests);
  }

  static getServiceRequestById(id: string): ServiceRequest | undefined {
    return this.getServiceRequests().find(r => r.id === id);
  }

  static getServiceRequestsByCustomer(customerId: string): ServiceRequest[] {
    return this.getServiceRequests().filter(r => r.customerId === customerId);
  }

  static getServiceRequestsByProvider(providerId: string): ServiceRequest[] {
    return this.getServiceRequests().filter(r => r.providerId === providerId);
  }

  static saveServiceRequest(request: ServiceRequest): void {
    const requests = this.getServiceRequests();
    const index = requests.findIndex(r => r.id === request.id);
    if (index >= 0) {
      requests[index] = { ...request, updatedAt: new Date().toISOString() };
    } else {
      requests.unshift(request);
    }
    this.setItem('serviceRequests', requests);

    // Send notification to provider if it's a new request
    if (index < 0) {
      this.addNotification({
        userId: request.providerId,
        title: 'New Service Request Received! 🎯',
        message: `${request.customerName} sent a request for "${request.serviceTitle}": ${request.title}`,
        type: 'job_match',
        link: '/student/services?tab=requests'
      });
    }
  }

  static updateServiceRequestStatus(id: string, status: ServiceRequest['status'], extra?: { quoteId?: string; orderId?: string }): void {
    const requests = this.getServiceRequests();
    const target = requests.find(r => r.id === id);
    if (target) {
      target.status = status;
      if (extra?.quoteId) target.quoteId = extra.quoteId;
      if (extra?.orderId) target.orderId = extra.orderId;
      target.updatedAt = new Date().toISOString();
      this.setItem('serviceRequests', requests);
    }
  }

  // Service Quotes (Module 3)
  static getServiceQuotes(): ServiceQuote[] {
    return this.getItem<ServiceQuote[]>('serviceQuotes', initialServiceQuotes);
  }

  static getServiceQuoteById(id: string): ServiceQuote | undefined {
    return this.getServiceQuotes().find(q => q.id === id);
  }

  static getServiceQuotesByRequest(requestId: string): ServiceQuote[] {
    return this.getServiceQuotes().filter(q => q.requestId === requestId);
  }

  static getServiceQuotesByProvider(providerId: string): ServiceQuote[] {
    return this.getServiceQuotes().filter(q => q.providerId === providerId);
  }

  static getServiceQuotesByCustomer(customerId: string): ServiceQuote[] {
    return this.getServiceQuotes().filter(q => q.customerId === customerId);
  }

  static saveServiceQuote(quote: ServiceQuote): void {
    const quotes = this.getServiceQuotes();
    const index = quotes.findIndex(q => q.id === quote.id);
    if (index >= 0) {
      quotes[index] = { ...quote, updatedAt: new Date().toISOString() };
    } else {
      quotes.unshift(quote);
    }
    this.setItem('serviceQuotes', quotes);

    // Update associated request status to 'quoted'
    this.updateServiceRequestStatus(quote.requestId, 'quoted', { quoteId: quote.id });

    // Notify customer
    this.addNotification({
      userId: quote.customerId,
      title: 'New Service Quote Received! 💼',
      message: `${quote.providerName} sent you a quote of ₦${quote.price.toLocaleString()} for "${quote.serviceTitle}"`,
      type: 'proposal_received',
      link: '/student/services?tab=quotes'
    });
  }

  static updateServiceQuoteStatus(id: string, status: ServiceQuote['status']): void {
    const quotes = this.getServiceQuotes();
    const target = quotes.find(q => q.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      this.setItem('serviceQuotes', quotes);

      // If declined, update request
      if (status === 'declined') {
        this.updateServiceRequestStatus(target.requestId, 'declined');
        this.addNotification({
          userId: target.providerId,
          title: 'Service Quote Declined',
          message: `${target.customerName} declined the quote for "${target.serviceTitle}"`,
          type: 'proposal_rejected',
          link: '/student/services?tab=quotes'
        });
      }
    }
  }

  // Service Orders (Module 3)
  static getServiceOrders(): ServiceOrder[] {
    return this.getItem<ServiceOrder[]>('serviceOrders', initialServiceOrders);
  }

  static getServiceOrderById(id: string): ServiceOrder | undefined {
    return this.getServiceOrders().find(o => o.id === id);
  }

  static getServiceOrdersByCustomer(customerId: string): ServiceOrder[] {
    return this.getServiceOrders().filter(o => o.customerId === customerId);
  }

  static getServiceOrdersByProvider(providerId: string): ServiceOrder[] {
    return this.getServiceOrders().filter(o => o.providerId === providerId);
  }

  static saveServiceOrder(order: ServiceOrder): void {
    const orders = this.getServiceOrders();
    const index = orders.findIndex(o => o.id === order.id);
    if (index >= 0) {
      orders[index] = { ...order, updatedAt: new Date().toISOString() };
    } else {
      orders.unshift(order);
    }
    this.setItem('serviceOrders', orders);

    if (index < 0) {
      // Notify both parties
      this.addNotification({
        userId: order.providerId,
        title: 'New Service Order Started! 🎉',
        message: `Order for "${order.serviceTitle}" (₦${order.amount.toLocaleString()}) has commenced.`,
        type: 'job_hired',
        link: '/student/services?tab=orders'
      });

      this.addNotification({
        userId: order.customerId,
        title: 'Order Confirmed! 🚀',
        message: `Your order with ${order.providerName} for "${order.serviceTitle}" is now active.`,
        type: 'job_hired',
        link: '/student/services?tab=orders'
      });
    }
  }

  static updateServiceOrderStatus(id: string, status: ServiceOrder['status'], notes?: string, deliveryFiles?: string[]): void {
    const orders = this.getServiceOrders();
    const target = orders.find(o => o.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      if (notes) target.deliveryNotes = notes;
      if (deliveryFiles) target.deliveryFiles = deliveryFiles;

      if (status === 'delivered') {
        target.deliveredAt = new Date().toISOString();
        this.addNotification({
          userId: target.customerId,
          title: 'Service Order Delivered! 📦',
          message: `${target.providerName} has delivered the work for "${target.serviceTitle}". Please review and approve.`,
          type: 'escrow_release',
          link: '/student/services?tab=orders'
        });
      } else if (status === 'completed') {
        target.completedAt = new Date().toISOString();
        
        // Update service completed count
        const services = this.getServices();
        const srv = services.find(s => s.id === target.serviceId);
        if (srv) {
          srv.completedOrders = (srv.completedOrders || 0) + 1;
          srv.ordersCompleted = (srv.ordersCompleted || 0) + 1;
          this.setItem('services', services);
        }

        // Update provider earnings and completed jobs
        const provider = this.getUserById(target.providerId);
        if (provider) {
          provider.completedJobsCount = (provider.completedJobsCount || 0) + 1;
          provider.totalEarnings = (provider.totalEarnings || 0) + target.amount;
          this.saveUser(provider);
        }

        // Notify provider and customer
        this.addNotification({
          userId: target.providerId,
          title: 'Order Completed & Payment Approved! 💰',
          message: `Order for "${target.serviceTitle}" is marked completed. ₦${target.amount.toLocaleString()} added to your records.`,
          type: 'escrow_release',
          link: '/student/services?tab=orders'
        });

        this.addNotification({
          userId: target.customerId,
          title: 'Order Completed! Leave a Review ⭐',
          message: `Your order for "${target.serviceTitle}" is complete. Leave a verified review for ${target.providerName}.`,
          type: 'review_received',
          link: '/student/services?tab=orders'
        });
      } else if (status === 'cancelled') {
        target.cancelledAt = new Date().toISOString();
      }

      this.setItem('serviceOrders', orders);
    }
  }

  // Service Reviews (Module 3 - Enforces 1 Review per Completed Order)
  static getServiceReviews(): ServiceReview[] {
    return this.getItem<ServiceReview[]>('serviceReviews', initialServiceReviews);
  }

  static getServiceReviewsByService(serviceId: string): ServiceReview[] {
    return this.getServiceReviews().filter(r => r.serviceId === serviceId);
  }

  static getServiceReviewsByProvider(providerId: string): ServiceReview[] {
    return this.getServiceReviews().filter(r => r.providerId === providerId);
  }

  static canReviewOrder(orderId: string, customerId: string): { canReview: boolean; reason?: string; order?: ServiceOrder } {
    const order = this.getServiceOrderById(orderId);
    if (!order) {
      return { canReview: false, reason: 'Order not found' };
    }
    if (order.customerId !== customerId) {
      return { canReview: false, reason: 'You can only review services you ordered.' };
    }
    if (order.status !== 'completed') {
      return { canReview: false, reason: 'Reviews can only be submitted after the service order is marked completed.' };
    }
    if (order.hasReview) {
      return { canReview: false, reason: 'A review has already been submitted for this completed transaction.' };
    }
    const existing = this.getServiceReviews().find(r => r.orderId === orderId);
    if (existing) {
      return { canReview: false, reason: 'A review already exists for this order.' };
    }
    return { canReview: true, order };
  }

  static saveServiceReview(review: ServiceReview): { success: boolean; error?: string } {
    const check = this.canReviewOrder(review.orderId, review.customerId);
    if (!check.canReview) {
      return { success: false, error: check.reason };
    }

    const reviews = this.getServiceReviews();
    reviews.unshift({
      ...review,
      isVerifiedTransaction: true,
      createdAt: new Date().toISOString()
    });
    this.setItem('serviceReviews', reviews);

    // Mark order as reviewed
    const orders = this.getServiceOrders();
    const orderIndex = orders.findIndex(o => o.id === review.orderId);
    if (orderIndex >= 0) {
      orders[orderIndex].hasReview = true;
      this.setItem('serviceOrders', orders);
    }

    // Recalculate and update service rating and review count
    const serviceReviews = reviews.filter(r => r.serviceId === review.serviceId);
    const avgRating = serviceReviews.length > 0
      ? Number((serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length).toFixed(1))
      : review.rating;
    
    const services = this.getServices();
    const srvIndex = services.findIndex(s => s.id === review.serviceId);
    if (srvIndex >= 0) {
      services[srvIndex].rating = avgRating;
      services[srvIndex].reviewsCount = serviceReviews.length;
      this.setItem('services', services);
    }

    // Recalculate provider overall profile rating
    const providerReviews = reviews.filter(r => r.providerId === review.providerId);
    const providerAvg = providerReviews.length > 0
      ? Number((providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length).toFixed(1))
      : review.rating;
    
    const provider = this.getUserById(review.providerId);
    if (provider) {
      provider.rating = providerAvg;
      provider.reviewsCount = providerReviews.length;
      this.saveUser(provider);
    }

    // Notify provider
    this.addNotification({
      userId: review.providerId,
      title: 'New Verified 5-Star Review! ⭐',
      message: `${review.customerName} left a ${review.rating}-star review on "${review.serviceTitle}"`,
      type: 'review_received',
      link: '/student/services?tab=reviews'
    });

    return { success: true };
  }

  // Service View Counter
  static incrementServiceViews(serviceId: string): void {
    const services = this.getServices();
    const target = services.find(s => s.id === serviceId);
    if (target) {
      target.viewsCount = (target.viewsCount || 0) + 1;
      this.setItem('services', services);
    }
  }

  // Provider Dynamic Real-Time Statistics (Module 3)
  static getProviderStats(providerId: string) {
    const myServices = this.getServicesByStudentId(providerId);
    const myRequests = this.getServiceRequestsByProvider(providerId);
    const myQuotes = this.getServiceQuotesByProvider(providerId);
    const myOrders = this.getServiceOrdersByProvider(providerId);
    const myReviews = this.getServiceReviewsByProvider(providerId);

    const totalViews = myServices.reduce((sum, s) => sum + (s.viewsCount || 0), 0);
    const totalRequests = myRequests.length;
    const totalQuotes = myQuotes.length;
    const activeOrders = myOrders.filter(o => o.status === 'in_progress' || o.status === 'delivered').length;
    const completedOrders = myOrders.filter(o => o.status === 'completed');
    const completedServices = completedOrders.length;
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const avgRating = myReviews.length > 0
      ? Number((myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1))
      : (myServices.length > 0 ? (myServices[0].rating || 5.0) : 5.0);

    return {
      totalViews,
      totalRequests,
      totalQuotes,
      activeOrders,
      completedServices,
      totalRevenue,
      averageRating: avgRating,
      totalReviews: myReviews.length,
      publishedServicesCount: myServices.filter(s => s.status === 'published').length
    };
  }

  // Platform Settings
  static getPlatformSettings(): PlatformSettings {
    return this.getItem<PlatformSettings>('platformSettings', initialPlatformSettings);
  }

  static savePlatformSettings(settings: PlatformSettings): void {
    this.setItem('platformSettings', settings);
  }
}
