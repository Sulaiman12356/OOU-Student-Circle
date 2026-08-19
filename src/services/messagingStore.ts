import { 
  Conversation, 
  ChatMessage, 
  AppNotification, 
  NotificationType, 
  ConversationType, 
  ConversationContext, 
  MessageAttachment,
  UserRole
} from '../types';
import founderImage from '../assets/images/founder_sulaiman.jpg';

const STORAGE_PREFIX = 'oou_studentcircle_';

// Initial Demo Seed Conversations covering all requested scenarios:
// 1. Student Connect (Student to Student)
// 2. Freelance Service (Client to Provider)
// 3. Marketplace (Student/Customer to Campus Vendor)
// 4. Campus Service (Aspirant to Print Shop / Campus Provider)
// 5. Job & Escrow Opportunity (Client to Hired Talent)
export const initialDemoConversations: Conversation[] = [
  {
    id: 'conv-connect-1',
    type: 'student_connect',
    title: 'Study Collab: React & Algorithmic Foundations',
    participants: ['student-1', 'student-3'],
    participantDetails: {
      'student-1': {
        name: 'Onifade Sulaiman',
        photo: founderImage,
        role: 'student',
        departmentOrCompany: 'Computer Science (400L)',
        isVerified: true,
        matricNumber: 'CSC/2021/0482'
      },
      'student-3': {
        name: 'Maryam Adeola',
        photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
        role: 'student',
        departmentOrCompany: 'Mass Communication (300L)',
        isVerified: true,
        matricNumber: 'MAC/2022/0304'
      }
    },
    context: {
      type: 'student_connect',
      initialTopic: 'Faculty of Science & Arts Joint ICT Workshop'
    },
    lastMessage: 'I have attached the lecture slides and our joint presentation summary!',
    lastMessageTimestamp: '2025-05-16T14:20:00Z',
    lastMessageSenderId: 'student-3',
    unreadCounts: { 'student-1': 1, 'student-3': 0 },
    isPinned: true,
    createdAt: '2025-05-10T10:00:00Z',
    updatedAt: '2025-05-16T14:20:00Z'
  },
  {
    id: 'conv-service-1',
    type: 'service',
    title: 'Service: Modern Minimalist Logo & Brand Package',
    participants: ['client-1', 'student-2'],
    participantDetails: {
      'client-1': {
        name: 'Johnson Peter',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        role: 'client',
        departmentOrCompany: 'Apex Brand Studio & Tech Hub',
        isVerified: true
      },
      'student-2': {
        name: 'Adebayo Samuel',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        role: 'student',
        departmentOrCompany: 'Fine and Applied Arts (300L)',
        isVerified: true,
        matricNumber: 'FAA/2022/0119'
      }
    },
    context: {
      type: 'service',
      serviceId: 'srv-1',
      serviceTitle: 'Modern Minimalist Logo & Complete Brand Identity Design',
      servicePrice: 5000,
      serviceCategory: 'Graphic Design',
      serviceCoverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
      requestId: 'sreq-2',
      quoteId: 'squote-2',
      orderId: 'sord-1',
      orderStatus: 'completed',
      escrowStatus: 'released'
    },
    lastMessage: 'Awesome! All vector source files (AI, SVG, PNG, PDF) and 3D mockups have been delivered.',
    lastMessageTimestamp: '2025-05-15T18:45:00Z',
    lastMessageSenderId: 'student-2',
    unreadCounts: { 'client-1': 0, 'student-2': 0 },
    isPinned: false,
    createdAt: '2025-05-08T09:00:00Z',
    updatedAt: '2025-05-15T18:45:00Z'
  },
  {
    id: 'conv-market-1',
    type: 'marketplace',
    title: 'Marketplace: Original Apple 67W USB-C Power Adapter',
    participants: ['student-1', 'client-1'],
    participantDetails: {
      'student-1': {
        name: 'Onifade Sulaiman',
        photo: founderImage,
        role: 'student',
        departmentOrCompany: 'Computer Science (400L)',
        isVerified: true
      },
      'client-1': {
        name: 'Johnson Peter',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        role: 'client',
        departmentOrCompany: 'Apex Brand Studio',
        isVerified: true
      }
    },
    context: {
      type: 'marketplace',
      productId: 'prod-mac-charger',
      productTitle: 'Original Apple 67W USB-C Fast Power Adapter (UK Pin)',
      productPrice: 18500,
      productImage: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80',
      productCategory: 'Electronics & Gadgets',
      productCondition: 'Like New (Tested)',
      orderId: 'ORD-8823',
      orderStatus: 'escrow_funded',
      orderAmount: 18500,
      escrowStatus: 'funds_locked'
    },
    lastMessage: 'Escrow payment confirmed! I will bring it to the Main Campus ICT Center gate around 2 PM.',
    lastMessageTimestamp: '2025-05-16T11:15:00Z',
    lastMessageSenderId: 'student-1',
    unreadCounts: { 'client-1': 1, 'student-1': 0 },
    isPinned: true,
    createdAt: '2025-05-14T16:00:00Z',
    updatedAt: '2025-05-16T11:15:00Z'
  },
  {
    id: 'conv-campus-1',
    type: 'campus_service',
    title: 'Campus Hub: Ago-Iwoye Print & Tech Clearance Hub',
    participants: ['student-4', 'student-1'],
    participantDetails: {
      'student-4': {
        name: 'Praise Daniel',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        role: 'student',
        departmentOrCompany: 'Biochemistry (300L)',
        isVerified: false
      },
      'student-1': {
        name: 'Onifade Sulaiman (Print Hub Manager)',
        photo: founderImage,
        role: 'student',
        departmentOrCompany: 'Campus Tech Hub Lead',
        isVerified: true
      }
    },
    context: {
      type: 'campus_service',
      shopId: 'shop-print-hub',
      shopName: 'Ago-Iwoye Main Gate Tech & Fast Print Center',
      serviceTitle: 'Post-UTME & Course Registration Color Print Bundle',
      servicePrice: 3500
    },
    lastMessage: 'Your 20-page color-printed spiral bound documents are ready for pickup at Mini Campus kiosk!',
    lastMessageTimestamp: '2025-05-16T09:30:00Z',
    lastMessageSenderId: 'student-1',
    unreadCounts: { 'student-4': 1, 'student-1': 0 },
    isPinned: false,
    createdAt: '2025-05-15T08:00:00Z',
    updatedAt: '2025-05-16T09:30:00Z'
  },
  {
    id: 'conv-job-1',
    type: 'job',
    title: 'Job: Campus Utility Web App Frontend Developer',
    participants: ['client-1', 'student-1'],
    participantDetails: {
      'client-1': {
        name: 'Johnson Peter',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
        role: 'client',
        departmentOrCompany: 'Apex Brand Studio',
        isVerified: true
      },
      'student-1': {
        name: 'Onifade Sulaiman',
        photo: founderImage,
        role: 'student',
        departmentOrCompany: 'Computer Science (400L)',
        isVerified: true
      }
    },
    context: {
      type: 'job',
      jobId: 'job-4',
      jobTitle: 'Web Developer to build landing page for student event',
      jobBudget: 25000,
      jobType: 'Fixed Milestone',
      orderId: 'sord-2',
      escrowStatus: 'completed'
    },
    lastMessage: 'Great work Sulaiman! The landing page is working perfectly on all devices. Escrow released!',
    lastMessageTimestamp: '2025-05-12T14:30:00Z',
    lastMessageSenderId: 'client-1',
    unreadCounts: { 'client-1': 0, 'student-1': 0 },
    isPinned: false,
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-05-12T14:30:00Z'
  }
];

export const initialDemoMessages: Record<string, ChatMessage[]> = {
  'conv-connect-1': [
    {
      id: 'msg-c1-1',
      conversationId: 'conv-connect-1',
      senderId: 'student-1',
      senderName: 'Onifade Sulaiman',
      senderPhoto: founderImage,
      senderRole: 'student',
      text: 'Hi Maryam! Are you still participating in the upcoming OOU Student Innovation Hackathon?',
      timestamp: '2025-05-16T10:00:00Z',
      read: true
    },
    {
      id: 'msg-c1-2',
      conversationId: 'conv-connect-1',
      senderId: 'student-3',
      senderName: 'Maryam Adeola',
      senderPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
      senderRole: 'student',
      text: 'Yes Sulaiman! I am preparing the pitch deck and social storytelling strategy for our team.',
      timestamp: '2025-05-16T10:15:00Z',
      read: true
    },
    {
      id: 'msg-c1-3',
      conversationId: 'conv-connect-1',
      senderId: 'student-3',
      senderName: 'Maryam Adeola',
      senderPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
      senderRole: 'student',
      text: 'I have attached the lecture slides and our joint presentation summary!',
      timestamp: '2025-05-16T14:20:00Z',
      read: false,
      attachments: [
        {
          id: 'att-1',
          name: 'OOU_Hackathon_Pitch_Outline.pdf',
          url: '#attachment-hackathon-pitch',
          size: '2.4 MB',
          type: 'pdf'
        },
        {
          id: 'att-2',
          name: 'Campus_Brand_Guidelines.zip',
          url: '#attachment-brand-guidelines',
          size: '6.8 MB',
          type: 'archive'
        }
      ]
    }
  ],
  'conv-service-1': [
    {
      id: 'msg-s1-1',
      conversationId: 'conv-service-1',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      senderRole: 'client',
      text: 'Hello Adebayo, we need a high-contrast vector logo with yellow and navy accents for Apex Studio.',
      timestamp: '2025-05-08T09:00:00Z',
      read: true
    },
    {
      id: 'msg-s1-2',
      conversationId: 'conv-service-1',
      senderId: 'student-2',
      senderName: 'Adebayo Samuel',
      senderRole: 'student',
      text: 'Hi Mr. Johnson! I would love to work on this. Here is the formal quote breakdown for the logo & identity suite:',
      timestamp: '2025-05-08T09:30:00Z',
      read: true,
      quoteData: {
        quoteId: 'squote-2',
        title: 'Minimalist Vector Logo + 3D Mockups + Brand Guide',
        amount: 5000,
        deliveryTime: '2 Days',
        status: 'accepted'
      }
    },
    {
      id: 'msg-s1-3',
      conversationId: 'conv-service-1',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      senderRole: 'client',
      text: 'Quote accepted and ₦5,000 funded into StudentCircle Escrow. Looking forward to initial concepts!',
      timestamp: '2025-05-08T11:00:00Z',
      read: true,
      orderData: {
        orderId: 'sord-1',
        amount: 5000,
        status: 'in_progress'
      }
    },
    {
      id: 'msg-s1-4',
      conversationId: 'conv-service-1',
      senderId: 'student-2',
      senderName: 'Adebayo Samuel',
      senderRole: 'student',
      text: 'Awesome! All vector source files (AI, SVG, PNG, PDF) and 3D mockups have been delivered.',
      timestamp: '2025-05-15T18:45:00Z',
      read: true,
      images: [
        'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
      ],
      attachments: [
        {
          id: 'att-3',
          name: 'Apex_Brand_Vector_Pack.ai',
          url: '#attachment-brand-vector',
          size: '14.2 MB',
          type: 'doc'
        }
      ]
    }
  ],
  'conv-market-1': [
    {
      id: 'msg-m1-1',
      conversationId: 'conv-market-1',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      senderRole: 'client',
      text: 'Hello Sulaiman, is this original 67W Apple charger still available for sale?',
      timestamp: '2025-05-14T16:00:00Z',
      read: true
    },
    {
      id: 'msg-m1-2',
      conversationId: 'conv-market-1',
      senderId: 'student-1',
      senderName: 'Onifade Sulaiman',
      senderPhoto: founderImage,
      senderRole: 'student',
      text: 'Yes Mr. Johnson! It is tested, genuine Apple 67W Type-C adapter with fast charging protocol. You can inspect it physically before escrow release.',
      timestamp: '2025-05-14T16:15:00Z',
      read: true,
      images: [
        'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'
      ]
    },
    {
      id: 'msg-m1-3',
      conversationId: 'conv-market-1',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      senderRole: 'client',
      text: 'Great, I have created order #ORD-8823 and deposited ₦18,500 into escrow.',
      timestamp: '2025-05-16T10:00:00Z',
      read: true,
      orderData: {
        orderId: 'ORD-8823',
        amount: 18500,
        status: 'escrow_funded'
      }
    },
    {
      id: 'msg-m1-4',
      conversationId: 'conv-market-1',
      senderId: 'student-1',
      senderName: 'Onifade Sulaiman',
      senderPhoto: founderImage,
      senderRole: 'student',
      text: 'Escrow payment confirmed! I will bring it to the Main Campus ICT Center gate around 2 PM.',
      timestamp: '2025-05-16T11:15:00Z',
      read: false
    }
  ],
  'conv-campus-1': [
    {
      id: 'msg-p1-1',
      conversationId: 'conv-campus-1',
      senderId: 'student-4',
      senderName: 'Praise Daniel',
      senderRole: 'student',
      text: 'Good day! I submitted a PDF document for final year seminar binding. What is the turnaround time?',
      timestamp: '2025-05-15T08:00:00Z',
      read: true
    },
    {
      id: 'msg-p1-2',
      conversationId: 'conv-campus-1',
      senderId: 'student-1',
      senderName: 'Onifade Sulaiman',
      senderPhoto: founderImage,
      senderRole: 'student',
      text: 'Your 20-page color-printed spiral bound documents are ready for pickup at Mini Campus kiosk!',
      timestamp: '2025-05-16T09:30:00Z',
      read: false
    }
  ],
  'conv-job-1': [
    {
      id: 'msg-j1-1',
      conversationId: 'conv-job-1',
      senderId: 'client-1',
      senderName: 'Johnson Peter',
      senderRole: 'client',
      text: 'Great work Sulaiman! The landing page is working perfectly on all devices. Escrow released!',
      timestamp: '2025-05-12T14:30:00Z',
      read: true
    }
  ]
};

// Initial Demo Seed Notifications covering all 15 types
export const initialDemoNotifications: AppNotification[] = [
  {
    id: 'notif-demo-1',
    userId: 'student-1',
    actorId: 'student-3',
    actorName: 'Maryam Adeola',
    actorPhoto: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
    title: 'Student Connection Accepted! 🤝',
    message: 'Maryam Adeola accepted your peer connection request. You can now collaborate and message directly.',
    type: 'connection_accepted',
    category: 'social_campus',
    link: '/student/messages',
    read: false,
    createdAt: '2025-05-16T14:25:00Z'
  },
  {
    id: 'notif-demo-2',
    userId: 'student-1',
    actorId: 'client-1',
    actorName: 'Johnson Peter',
    actorPhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    title: 'Payment Confirmed & Secured in Escrow 🔒',
    message: '₦18,500 has been secured in StudentCircle Escrow for Order #ORD-8823 (Apple 67W Charger). Deliver safely to receive funds.',
    type: 'payment_confirmed',
    category: 'orders_escrow',
    link: '/student/orders',
    read: false,
    createdAt: '2025-05-16T10:05:00Z'
  },
  {
    id: 'notif-demo-3',
    userId: 'student-1',
    actorId: 'student-3',
    actorName: 'Maryam Adeola',
    title: 'New Message Received 💬',
    message: 'Maryam Adeola sent: "I have attached the lecture slides and our joint presentation summary!"',
    type: 'new_message',
    category: 'messages',
    link: '/student/messages',
    read: false,
    createdAt: '2025-05-16T14:20:00Z'
  },
  {
    id: 'notif-demo-4',
    userId: 'student-1',
    actorId: 'client-1',
    actorName: 'Johnson Peter',
    title: 'New Service Request: Seminar Portal 🎯',
    message: 'Johnson Peter requested a custom quote for "Department Seminar Registration & Ticket Portal".',
    type: 'new_service_request',
    category: 'jobs_proposals',
    link: '/student/services?tab=requests',
    read: true,
    createdAt: '2025-05-14T10:00:00Z'
  },
  {
    id: 'notif-demo-5',
    userId: 'client-1',
    actorId: 'student-2',
    actorName: 'Adebayo Samuel',
    title: 'New Service Quote Received 💼',
    message: 'Adebayo Samuel sent you a quote of ₦5,000 for "Modern Minimalist Logo & Brand Identity".',
    type: 'new_quote',
    category: 'jobs_proposals',
    link: '/client/messages',
    read: false,
    createdAt: '2025-05-08T09:30:00Z'
  },
  {
    id: 'notif-demo-6',
    userId: 'student-2',
    actorId: 'client-1',
    actorName: 'Johnson Peter',
    title: 'Quote Accepted & Order Created! 🚀',
    message: 'Johnson Peter accepted your ₦5,000 quote for "Modern Minimalist Logo". Start working on the deliverables.',
    type: 'quote_accepted',
    category: 'orders_escrow',
    link: '/student/orders',
    read: true,
    createdAt: '2025-05-08T11:00:00Z'
  },
  {
    id: 'notif-demo-7',
    userId: 'student-1',
    actorId: 'client-1',
    actorName: 'Johnson Peter',
    title: '5-Star Verified Review Received! ⭐⭐⭐⭐⭐',
    message: 'Johnson Peter left a 5-star review: "Sulaiman is a gifted software engineer! He delivered our complete platform with pristine code..."',
    type: 'review',
    category: 'social_campus',
    link: '/student/reviews',
    read: true,
    createdAt: '2025-05-12T15:00:00Z'
  },
  {
    id: 'notif-demo-8',
    userId: 'student-1',
    title: 'Student ID Verification Approved ✅',
    message: 'Your OOU Student ID (Matric No: CSC/2021/0482) has been officially verified by Campus Administrators.',
    type: 'verification',
    category: 'system_security',
    link: '/student/profile',
    read: true,
    createdAt: '2025-01-15T12:00:00Z'
  },
  {
    id: 'notif-demo-9',
    userId: 'client-1',
    actorId: 'student-1',
    actorName: 'Onifade Sulaiman',
    title: 'New Job Application Submitted 📄',
    message: 'Onifade Sulaiman submitted a proposal for your open job "Web Developer for Student Event".',
    type: 'job_application',
    category: 'jobs_proposals',
    link: '/client/proposals',
    read: true,
    createdAt: '2025-05-02T10:00:00Z'
  },
  {
    id: 'notif-demo-10',
    userId: 'student-1',
    actorId: 'admin-1',
    title: 'Platform Notice: Security & Escrow Protection 🛡️',
    message: 'Always transact via StudentCircle Escrow. Never send funds directly outside the verified payment channel.',
    type: 'admin_action',
    category: 'system_security',
    link: '/how-it-works',
    read: true,
    createdAt: '2025-05-01T00:00:00Z'
  }
];

// Event Listener Callback type
type Listener<T> = (data: T) => void;

class MessagingService {
  private conversationsListeners: Set<Listener<Conversation[]>> = new Set();
  private messagesListeners: Map<string, Set<Listener<ChatMessage[]>>> = new Map();
  private notificationsListeners: Set<Listener<AppNotification[]>> = new Set();
  private unreadBadgeListeners: Set<Listener<{ messages: number; notifications: number }>> = new Set();

  private getStorage<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(STORAGE_PREFIX + key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  }

  // ==========================================
  // CONVERSATIONS
  // ==========================================

  public getConversations(): Conversation[] {
    return this.getStorage<Conversation[]>('conversations_v2', initialDemoConversations);
  }

  public getConversationsForUser(userId: string): Conversation[] {
    const all = this.getConversations();
    return all.filter(c => c.participants.includes(userId));
  }

  /**
   * Secure access checker: Asserts that only participants (or admin) can access
   */
  public canUserAccessConversation(userId: string, conversationId: string): { allowed: boolean; reason?: string } {
    const conv = this.getConversations().find(c => c.id === conversationId);
    if (!conv) {
      return { allowed: false, reason: 'Conversation not found' };
    }
    // Admins have oversight for dispute/moderation; regular users must be explicit participants
    if (userId === 'admin-1' || conv.participants.includes(userId)) {
      return { allowed: true };
    }
    return { 
      allowed: false, 
      reason: '403 Forbidden: You are not a verified participant of this private conversation. End-to-end security active.' 
    };
  }

  public getConversationById(convId: string, userId: string): Conversation | null {
    const auth = this.canUserAccessConversation(userId, convId);
    if (!auth.allowed) {
      return null;
    }
    const all = this.getConversations();
    return all.find(c => c.id === convId) || null;
  }

  public getOrCreateConversation(
    userAId: string, 
    userBId: string, 
    type: ConversationType = 'direct',
    context?: ConversationContext,
    userADetails?: { name: string; role: UserRole; photo?: string; departmentOrCompany?: string },
    userBDetails?: { name: string; role: UserRole; photo?: string; departmentOrCompany?: string }
  ): Conversation {
    const all = this.getConversations();
    
    // Check if an active conversation with matching participants & matching context exists
    let existing = all.find(c => 
      c.participants.includes(userAId) && 
      c.participants.includes(userBId) &&
      (!context?.serviceId || c.context?.serviceId === context.serviceId) &&
      (!context?.productId || c.context?.productId === context.productId) &&
      (!context?.orderId || c.context?.orderId === context.orderId)
    );

    if (existing) {
      // Update context if new context passed
      if (context && !existing.context) {
        existing.context = context;
        this.saveConversations(all);
      }
      return existing;
    }

    // Create a new conversation
    const newConv: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      title: context?.serviceTitle ? `Service: ${context.serviceTitle}` : 
             context?.productTitle ? `Item: ${context.productTitle}` : 
             context?.jobTitle ? `Job: ${context.jobTitle}` : 
             'Direct StudentCircle Conversation',
      participants: [userAId, userBId],
      participantDetails: {
        [userAId]: {
          name: userADetails?.name || 'StudentCircle Member',
          role: userADetails?.role || 'student',
          photo: userADetails?.photo,
          departmentOrCompany: userADetails?.departmentOrCompany,
          isVerified: true
        },
        [userBId]: {
          name: userBDetails?.name || 'StudentCircle Member',
          role: userBDetails?.role || 'client',
          photo: userBDetails?.photo,
          departmentOrCompany: userBDetails?.departmentOrCompany,
          isVerified: true
        }
      },
      context,
      lastMessage: 'Conversation initiated. Say hello! 👋',
      lastMessageTimestamp: new Date().toISOString(),
      lastMessageSenderId: userAId,
      unreadCounts: { [userAId]: 0, [userBId]: 0 },
      isPinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.unshift(newConv);
    this.saveConversations(all);

    // Initial greeting system message
    this.appendMessage(newConv.id, {
      id: `msg-init-${Date.now()}`,
      conversationId: newConv.id,
      senderId: userAId,
      senderName: userADetails?.name || 'User',
      senderRole: userADetails?.role || 'student',
      senderPhoto: userADetails?.photo,
      text: context?.initialTopic ? `Hi! Connecting regarding ${context.initialTopic}.` : 
            context?.serviceTitle ? `Hi! I would like to inquire about your service: "${context.serviceTitle}".` :
            context?.productTitle ? `Hi! Is your marketplace item "${context.productTitle}" still available?` :
            'Hello! Connected on OOU StudentCircle.',
      timestamp: new Date().toISOString(),
      read: false
    });

    return newConv;
  }

  public saveConversations(conversations: Conversation[]): void {
    this.setStorage('conversations_v2', conversations);
    this.notifyConversationsListeners();
    this.notifyUnreadBadges();
  }

  // ==========================================
  // MESSAGES
  // ==========================================

  public getAllMessages(): Record<string, ChatMessage[]> {
    return this.getStorage<Record<string, ChatMessage[]>>('messages_v2', initialDemoMessages);
  }

  public getMessages(convId: string, userId: string): ChatMessage[] {
    const auth = this.canUserAccessConversation(userId, convId);
    if (!auth.allowed) {
      console.warn(`Unauthorized access attempt by ${userId} to conversation ${convId}`);
      return [];
    }
    const all = this.getAllMessages();
    return all[convId] || [];
  }

  public sendMessage(params: {
    conversationId: string;
    senderId: string;
    senderName: string;
    senderRole?: UserRole;
    senderPhoto?: string;
    text: string;
    images?: string[];
    attachments?: MessageAttachment[];
    quoteData?: ChatMessage['quoteData'];
    orderData?: ChatMessage['orderData'];
  }): ChatMessage {
    const auth = this.canUserAccessConversation(params.senderId, params.conversationId);
    if (!auth.allowed) {
      throw new Error(auth.reason || 'Unauthorized to post in this conversation');
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: params.conversationId,
      senderId: params.senderId,
      senderName: params.senderName,
      senderRole: params.senderRole || 'student',
      senderPhoto: params.senderPhoto,
      text: params.text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
      images: params.images && params.images.length > 0 ? params.images : undefined,
      attachments: params.attachments && params.attachments.length > 0 ? params.attachments : undefined,
      quoteData: params.quoteData,
      orderData: params.orderData
    };

    this.appendMessage(params.conversationId, newMessage);

    // Update conversation metadata & unread counters for recipients
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === params.conversationId);
    if (conv) {
      conv.lastMessage = params.text.trim() || (params.images ? 'Sent an image' : 'Sent an attachment');
      conv.lastMessageTimestamp = newMessage.timestamp;
      conv.lastMessageSenderId = params.senderId;
      conv.updatedAt = newMessage.timestamp;

      // Increment unread count for other participants
      conv.participants.forEach(pId => {
        if (pId !== params.senderId) {
          conv.unreadCounts[pId] = (conv.unreadCounts[pId] || 0) + 1;

          // Dispatch notification to recipient
          this.addNotification({
            userId: pId,
            actorId: params.senderId,
            actorName: params.senderName,
            actorPhoto: params.senderPhoto,
            title: `New Message from ${params.senderName} 💬`,
            message: params.text.length > 80 ? `${params.text.substring(0, 80)}...` : params.text,
            type: 'new_message',
            category: 'messages',
            link: `/student/messages?conv=${params.conversationId}`
          });
        }
      });

      this.saveConversations(convs);
    }

    return newMessage;
  }

  private appendMessage(convId: string, msg: ChatMessage): void {
    const all = this.getAllMessages();
    if (!all[convId]) {
      all[convId] = [];
    }
    all[convId].push(msg);
    this.setStorage('messages_v2', all);
    this.notifyMessageListeners(convId);
    this.notifyUnreadBadges();
  }

  public markConversationAsRead(convId: string, userId: string): void {
    const convs = this.getConversations();
    const conv = convs.find(c => c.id === convId);
    if (conv && conv.unreadCounts?.[userId]) {
      conv.unreadCounts[userId] = 0;
      this.saveConversations(convs);
    }

    // Mark messages as read
    const allMessages = this.getAllMessages();
    if (allMessages[convId]) {
      let changed = false;
      allMessages[convId].forEach(m => {
        if (m.senderId !== userId && !m.read) {
          m.read = true;
          changed = true;
        }
      });
      if (changed) {
        this.setStorage('messages_v2', allMessages);
        this.notifyMessageListeners(convId);
      }
    }
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  public getNotifications(userId: string): AppNotification[] {
    const all = this.getStorage<AppNotification[]>('notifications_v2', initialDemoNotifications);
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(notification: {
    userId: string;
    actorId?: string;
    actorName?: string;
    actorPhoto?: string;
    title: string;
    message: string;
    type: NotificationType;
    category?: AppNotification['category'];
    link?: string;
    metadata?: Record<string, any>;
  }): AppNotification {
    const all = this.getStorage<AppNotification[]>('notifications_v2', initialDemoNotifications);
    
    // Determine category automatically if not provided
    let category = notification.category;
    if (!category) {
      if (notification.type.includes('order') || notification.type.includes('payment') || notification.type.includes('escrow')) {
        category = 'orders_escrow';
      } else if (notification.type.includes('message')) {
        category = 'messages';
      } else if (notification.type.includes('job') || notification.type.includes('proposal') || notification.type.includes('quote')) {
        category = 'jobs_proposals';
      } else if (notification.type.includes('connection') || notification.type.includes('review') || notification.type.includes('shop')) {
        category = 'social_campus';
      } else {
        category = 'system_security';
      }
    }

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: notification.userId,
      actorId: notification.actorId,
      actorName: notification.actorName,
      actorPhoto: notification.actorPhoto,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      category,
      link: notification.link,
      read: false,
      createdAt: new Date().toISOString(),
      metadata: notification.metadata
    };

    all.unshift(newNotif);
    this.setStorage('notifications_v2', all);
    this.notifyNotificationsListeners();
    this.notifyUnreadBadges();
    return newNotif;
  }

  public markNotificationAsRead(notifId: string, userId: string): void {
    const all = this.getStorage<AppNotification[]>('notifications_v2', initialDemoNotifications);
    const target = all.find(n => n.id === notifId && n.userId === userId);
    if (target) {
      target.read = true;
      this.setStorage('notifications_v2', all);
      this.notifyNotificationsListeners();
      this.notifyUnreadBadges();
    }
  }

  public markAllNotificationsAsRead(userId: string): void {
    const all = this.getStorage<AppNotification[]>('notifications_v2', initialDemoNotifications);
    all.forEach(n => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
    this.setStorage('notifications_v2', all);
    this.notifyNotificationsListeners();
    this.notifyUnreadBadges();
  }

  public deleteNotification(notifId: string, userId: string): void {
    let all = this.getStorage<AppNotification[]>('notifications_v2', initialDemoNotifications);
    all = all.filter(n => !(n.id === notifId && n.userId === userId));
    this.setStorage('notifications_v2', all);
    this.notifyNotificationsListeners();
    this.notifyUnreadBadges();
  }

  public getUnreadCounts(userId: string): { messages: number; notifications: number } {
    const convs = this.getConversationsForUser(userId);
    const unreadMessages = convs.reduce((sum, c) => sum + (c.unreadCounts?.[userId] || 0), 0);
    const unreadNotifs = this.getNotifications(userId).filter(n => !n.read).length;
    return { messages: unreadMessages, notifications: unreadNotifs };
  }

  // ==========================================
  // SUBSCRIPTIONS / REACTIVE LISTENERS
  // ==========================================

  public subscribeConversations(listener: Listener<Conversation[]>): () => void {
    this.conversationsListeners.add(listener);
    listener(this.getConversations());
    return () => this.conversationsListeners.delete(listener);
  }

  public subscribeMessages(convId: string, listener: Listener<ChatMessage[]>): () => void {
    if (!this.messagesListeners.has(convId)) {
      this.messagesListeners.set(convId, new Set());
    }
    const set = this.messagesListeners.get(convId)!;
    set.add(listener);
    const allMessages = this.getAllMessages();
    listener(allMessages[convId] || []);

    return () => {
      set.delete(listener);
      if (set.size === 0) {
        this.messagesListeners.delete(convId);
      }
    };
  }

  public subscribeNotifications(listener: Listener<AppNotification[]>): () => void {
    this.notificationsListeners.add(listener);
    return () => this.notificationsListeners.delete(listener);
  }

  public subscribeUnreadBadges(
    arg1: string | Listener<{ messages: number; notifications: number }>, 
    arg2?: string | Listener<{ messages: number; notifications: number }>
  ): () => void {
    let userId = typeof arg1 === 'string' ? arg1 : (typeof arg2 === 'string' ? arg2 : '');
    let listener: Listener<{ messages: number; notifications: number }> = 
      typeof arg1 === 'function' ? arg1 : (typeof arg2 === 'function' ? arg2 : () => {});

    this.unreadBadgeListeners.add(listener);
    if (userId) {
      listener(this.getUnreadCounts(userId));
    }
    return () => this.unreadBadgeListeners.delete(listener);
  }

  private notifyConversationsListeners(): void {
    const convs = this.getConversations();
    this.conversationsListeners.forEach(l => l(convs));
  }

  private notifyMessageListeners(convId: string): void {
    const set = this.messagesListeners.get(convId);
    if (set) {
      const msgs = this.getAllMessages()[convId] || [];
      set.forEach(l => l(msgs));
    }
  }

  private notifyNotificationsListeners(): void {
    this.notificationsListeners.forEach(l => l(this.getStorage<AppNotification[]>('notifications_v2', initialDemoNotifications)));
  }

  private notifyUnreadBadges(): void {
    // Note: unreadBadgeListeners will receive notification upon query or trigger
  }

  // ==========================================
  // SAMPLE NOTIFICATION DISPATCHER (FOR TESTING & DEMO)
  // ==========================================
  public dispatchSampleNotification(userId: string, type: NotificationType): AppNotification {
    const samples: Record<NotificationType, { title: string; message: string; category: AppNotification['category']; link: string }> = {
      connection_request: {
        title: 'New Student Connection Request 🤝',
        message: 'Akinola Damilola (Biochemistry 300L) wants to connect on StudentCircle.',
        category: 'social_campus',
        link: '/student-connect?tab=requests'
      },
      connection_accepted: {
        title: 'Connection Request Accepted 🎉',
        message: 'Maryam Adeola accepted your connect invitation. You are now campus peers!',
        category: 'social_campus',
        link: '/student/messages'
      },
      new_message: {
        title: 'New Message from Campus Tech Hub 💬',
        message: 'Sulaiman: "Your order package has been sealed and is ready for pickup."',
        category: 'messages',
        link: '/student/messages'
      },
      new_service_request: {
        title: 'New Service Request Received 🎯',
        message: 'Johnson Peter submitted a request for "Responsive React Landing Page".',
        category: 'jobs_proposals',
        link: '/student/services?tab=requests'
      },
      new_quote: {
        title: 'New Price Quote Received 💼',
        message: 'Adebayo Samuel sent a custom quote of ₦7,500 with 2-day delivery.',
        category: 'jobs_proposals',
        link: '/client/messages'
      },
      quote_accepted: {
        title: 'Quote Accepted! Escrow Funded 💰',
        message: 'Your ₦35,000 quote was accepted. Work safely knowing escrow funds are locked.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      quote_declined: {
        title: 'Quote Status Update',
        message: 'The quote for "Social Media Management" was declined by client.',
        category: 'jobs_proposals',
        link: '/student/services'
      },
      order_created: {
        title: 'New Unified Order Created 📦',
        message: 'Order #ORD-9912 has been created for "MacBook Air Protective Case".',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      payment_confirmed: {
        title: 'Payment Confirmed & Secured in Escrow 🔒',
        message: '₦25,000 payment was confirmed by StudentCircle Escrow. Order #ORD-9912 is active.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      order_status: {
        title: 'Order Status Update 🚚',
        message: 'Order #ORD-8823 has been marked as "Delivered" by provider. Please inspect & confirm.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      review: {
        title: 'New 5-Star Verified Review! ⭐',
        message: 'You received 5.0 rating: "Exceptional speed and spotless delivery on campus!"',
        category: 'social_campus',
        link: '/student/reviews'
      },
      review_received: {
        title: 'Client Left You a Review ⭐',
        message: 'Check out the new feedback added to your student public profile.',
        category: 'social_campus',
        link: '/student/reviews'
      },
      job_application: {
        title: 'New Job Application Submitted 📄',
        message: 'Praise Daniel submitted a proposal for your open video editing gig.',
        category: 'jobs_proposals',
        link: '/client/proposals'
      },
      job_shortlist: {
        title: 'You have been Shortlisted! 🌟',
        message: 'Apex Brand Studio shortlisted your profile for the UI/UX Lead project.',
        category: 'jobs_proposals',
        link: '/student/jobs'
      },
      shop_request: {
        title: 'Campus Print Shop Alert 🖨️',
        message: 'Ago-Iwoye Print Center received your course material color-printing task.',
        category: 'social_campus',
        link: '/campus/shop/dashboard'
      },
      admin_action: {
        title: 'Campus Platform Notice 🛡️',
        message: 'OOU StudentCircle Security: Zero tolerance for off-platform payment solicitations.',
        category: 'system_security',
        link: '/terms'
      },
      verification: {
        title: 'Verification Status Approved ✅',
        message: 'Your Student ID card and Matriculation credentials have been fully verified.',
        category: 'system_security',
        link: '/student/profile'
      },
      // Fallback handlers
      message: {
        title: 'New Message',
        message: 'You have received a new chat message.',
        category: 'messages',
        link: '/student/messages'
      },
      proposal: {
        title: 'Proposal Update',
        message: 'There is an update on your job proposal.',
        category: 'jobs_proposals',
        link: '/student/proposals'
      },
      proposal_received: {
        title: 'New Proposal Received',
        message: 'A candidate submitted a proposal for your project.',
        category: 'jobs_proposals',
        link: '/client/proposals'
      },
      proposal_accepted: {
        title: 'Proposal Accepted',
        message: 'Congratulations! Your proposal was accepted by the client.',
        category: 'jobs_proposals',
        link: '/student/proposals'
      },
      proposal_rejected: {
        title: 'Proposal Status',
        message: 'Your proposal was not selected for this project.',
        category: 'jobs_proposals',
        link: '/student/proposals'
      },
      job_match: {
        title: 'New Matching Job Opportunity',
        message: 'A new campus gig matches your skill tags.',
        category: 'jobs_proposals',
        link: '/student/jobs'
      },
      job_hired: {
        title: 'You were Hired for a Job! 🚀',
        message: 'The client hired you. Work with peace of mind with escrow protection.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      job_completed: {
        title: 'Job Completed & Rated',
        message: 'The job milestone was completed successfully.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      escrow_release: {
        title: 'Escrow Funds Released to Wallet 💵',
        message: 'Payment has been released and credited to your available balance.',
        category: 'orders_escrow',
        link: '/student/earnings'
      },
      system: {
        title: 'System Notification',
        message: 'Welcome to the updated OOU StudentCircle platform.',
        category: 'system_security',
        link: '/settings'
      }
    };

    const sample = samples[type] || samples.system;
    return this.addNotification({
      userId,
      title: sample.title,
      message: sample.message,
      type,
      category: sample.category,
      link: sample.link
    });
  }
}

export const MessagingStore = new MessagingService();
