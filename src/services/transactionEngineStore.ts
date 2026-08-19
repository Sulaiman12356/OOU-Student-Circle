// Unified Transaction Engine Store for OOU StudentCircle
import {
  TransactionType,
  UnifiedRequestStatus,
  UnifiedQuoteStatus,
  UnifiedOrderStatus,
  UnifiedPaymentStatus,
  DisputeStatus,
  DisputeReason,
  DisputeResolutionAction,
  PartyInfo,
  TransactionRequest,
  TransactionQuote,
  UnifiedOrderItem,
  CancellationRecord,
  OrderTrackingUpdate,
  PaymentDetails,
  UnifiedOrder,
  OrderDispute,
  UnifiedReview
} from '../types/transaction';
import { PAYMENT_CONFIG, calculateTransactionFee } from '../config/paymentConfig';
import { DataStore } from './dataStore';
import founderImage from '../assets/images/founder_sulaiman.jpg';
import { db } from './firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

const STORAGE_PREFIX = 'oou_tx_engine_';

// Initial Demo Seed Requests
export const initialTransactionRequests: TransactionRequest[] = [
  {
    id: 'req-101',
    requestId: 'REQ-2024-001',
    buyerId: 'client-1',
    buyer: {
      id: 'client-1',
      name: 'Johnson Peter',
      email: 'johnson.peter@gmail.com',
      phoneNumber: '+234 802 333 4455',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      role: 'client',
      departmentOrCompany: 'Apex Brand Studio',
      location: 'Ago-Iwoye Main Campus'
    },
    sellerId: 'student-1',
    seller: {
      id: 'student-1',
      name: 'Onifade Sulaiman',
      email: 'sulaiman@ooustudentcircle.com',
      phoneNumber: '+234 812 345 6789',
      photo: founderImage,
      role: 'student',
      departmentOrCompany: 'Computer Science (400L)',
      faculty: 'Faculty of Science',
      level: '400L',
      location: 'Ago-Iwoye Main Campus'
    },
    type: 'service',
    targetItemId: 'srv-2',
    targetItemTitle: 'Custom Responsive Full-Stack Web App Development (React & Node)',
    targetItemCategory: 'Web Development',
    title: 'Faculty Conference Interactive Registration Portal',
    description: 'We need an interactive web platform with attendee registration, QR badge generation, paper submission uploads, and speaker schedule for the OOU Faculty of Science 2024 annual conference.',
    attachments: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
    ],
    budget: 35000,
    expectedDeliveryDays: 4,
    deliveryLocation: 'Permanent Site & Cloud Hosted',
    status: 'quoted',
    quoteId: 'quo-201',
    createdAt: '2024-05-14T09:00:00Z',
    updatedAt: '2024-05-14T11:30:00Z'
  },
  {
    id: 'req-102',
    requestId: 'REQ-2024-002',
    buyerId: 'client-1',
    buyer: {
      id: 'client-1',
      name: 'Johnson Peter',
      email: 'johnson.peter@gmail.com',
      phoneNumber: '+234 802 333 4455',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      role: 'client',
      departmentOrCompany: 'Apex Brand Studio',
      location: 'Ago-Iwoye'
    },
    sellerId: 'student-2',
    seller: {
      id: 'student-2',
      name: 'Adebayo Samuel',
      email: 'adebayo.samuel@gmail.com',
      phoneNumber: '+234 803 111 2233',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'student',
      departmentOrCompany: 'Fine and Applied Arts (300L)',
      faculty: 'Faculty of Arts',
      level: '300L',
      location: 'Ago-Iwoye Mini Campus'
    },
    type: 'service',
    targetItemId: 'srv-1',
    targetItemTitle: 'Modern Minimalist Logo & Complete Brand Identity Design',
    targetItemCategory: 'Graphic Design',
    title: 'Creative Studio Rebranding & Vector Assets',
    description: 'Need a modern vector logo with brand style guides, stationery templates, and social media banners for our studio launch.',
    budget: 8000,
    expectedDeliveryDays: 2,
    deliveryLocation: 'Digital Delivery',
    status: 'accepted',
    quoteId: 'quo-202',
    orderId: 'ORD-TX-001',
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-10T14:00:00Z'
  },
  {
    id: 'req-103',
    requestId: 'REQ-2024-003',
    buyerId: 'student-4',
    buyer: {
      id: 'student-4',
      name: 'Praise Daniel',
      email: 'praise.daniel@gmail.com',
      phoneNumber: '+234 809 334 5566',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      role: 'student',
      departmentOrCompany: 'Biochemistry (300L)',
      location: 'Sagamu Medical Campus'
    },
    sellerId: 'student-1',
    seller: {
      id: 'student-1',
      name: 'Onifade Sulaiman',
      email: 'sulaiman@ooustudentcircle.com',
      phoneNumber: '+234 812 345 6789',
      photo: founderImage,
      role: 'student',
      departmentOrCompany: 'Computer Science (400L)',
      location: 'Ago-Iwoye Main Campus'
    },
    type: 'campus_service',
    targetItemId: 'shop-print-1',
    targetItemTitle: 'SpeedPrint Digital Campus Services',
    targetItemCategory: 'Printing & Projects',
    title: 'Final Year Seminar Spiral Binding & 60 Color Pages',
    description: 'Print 60 pages in premium 80gsm color paper, spiral bound with transparent PVC covers, delivery to Medical Library Sagamu.',
    budget: 4500,
    expectedDeliveryDays: 1,
    deliveryLocation: 'Sagamu Medical Library Gate',
    status: 'pending',
    createdAt: '2024-05-15T08:00:00Z',
    updatedAt: '2024-05-15T08:00:00Z'
  }
];

// Initial Demo Seed Quotes
export const initialTransactionQuotes: TransactionQuote[] = [
  {
    id: 'quo-201',
    quoteId: 'QUO-2024-001',
    requestId: 'req-101',
    requestTitle: 'Faculty Conference Interactive Registration Portal',
    type: 'service',
    targetItemId: 'srv-2',
    sellerId: 'student-1',
    seller: {
      id: 'student-1',
      name: 'Onifade Sulaiman',
      phoneNumber: '+234 812 345 6789',
      photo: founderImage,
      role: 'student',
      departmentOrCompany: 'Computer Science (400L)',
      location: 'Ago-Iwoye Main Campus'
    },
    buyerId: 'client-1',
    buyer: {
      id: 'client-1',
      name: 'Johnson Peter',
      role: 'client',
      departmentOrCompany: 'Apex Brand Studio'
    },
    amount: 35000,
    deliveryTime: '3 Days',
    deliveryDays: 3,
    message: 'Hello Mr. Peter! I can develop the complete conference portal using React 18, Tailwind CSS, QR ticket generation, and automated PDF receipt dispatch within 3 days. Includes live staging preview and free hosting setup.',
    scopeBreakdown: [
      'Responsive attendee registration form with form validation',
      'Dynamic QR code badge generator for on-site check-in',
      'Admin export of registered attendees to Excel / CSV',
      'High-speed cloud deployment on Vercel'
    ],
    validUntil: '2026-12-31T23:59:59Z',
    status: 'pending',
    createdAt: '2024-05-14T11:30:00Z',
    updatedAt: '2024-05-14T11:30:00Z'
  },
  {
    id: 'quo-202',
    quoteId: 'QUO-2024-002',
    requestId: 'req-102',
    requestTitle: 'Creative Studio Rebranding & Vector Assets',
    type: 'service',
    targetItemId: 'srv-1',
    sellerId: 'student-2',
    seller: {
      id: 'student-2',
      name: 'Adebayo Samuel',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'student',
      departmentOrCompany: 'Fine and Applied Arts (300L)'
    },
    buyerId: 'client-1',
    buyer: {
      id: 'client-1',
      name: 'Johnson Peter',
      role: 'client'
    },
    amount: 8000,
    deliveryTime: '2 Days',
    deliveryDays: 2,
    message: 'I will craft 3 distinctive logo concepts, provide full vector deliverables (AI, SVG, PDF, PNG), brand color palette, typography recommendations, and 3D mockups.',
    scopeBreakdown: [
      '3 Initial brand logo concepts',
      'Unlimited revisions until 100% satisfied',
      'Print-ready vector assets (AI, SVG, EPS, PDF)',
      'Realistic 3D stationery & signage mockups'
    ],
    validUntil: '2026-12-31T23:59:59Z',
    status: 'accepted',
    orderId: 'ORD-TX-001',
    createdAt: '2024-05-10T12:00:00Z',
    updatedAt: '2024-05-10T14:00:00Z'
  }
];

// Initial Demo Seed Orders
export const initialUnifiedOrders: UnifiedOrder[] = [
  {
    id: 'ORD-TX-001',
    orderId: 'ORD-TX-001',
    requestId: 'req-102',
    quoteId: 'quo-202',
    type: 'service',
    targetItemId: 'srv-1',
    targetItemTitle: 'Modern Minimalist Logo & Complete Brand Identity Design',
    buyerId: 'client-1',
    buyer: {
      id: 'client-1',
      name: 'Johnson Peter',
      email: 'johnson.peter@gmail.com',
      phoneNumber: '+234 802 333 4455',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      role: 'client',
      departmentOrCompany: 'Apex Brand Studio',
      location: 'Ago-Iwoye Main Campus'
    },
    sellerId: 'student-2',
    seller: {
      id: 'student-2',
      name: 'Adebayo Samuel',
      email: 'adebayo.samuel@gmail.com',
      phoneNumber: '+234 803 111 2233',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      role: 'student',
      departmentOrCompany: 'Fine and Applied Arts (300L)',
      faculty: 'Faculty of Arts',
      level: '300L',
      location: 'Ago-Iwoye Mini Campus'
    },
    items: [
      {
        id: 'item-1',
        title: 'Modern Minimalist Logo & Complete Brand Identity Design',
        price: 8000,
        quantity: 1,
        unitPrice: 8000,
        category: 'Graphic Design'
      }
    ],
    amount: 8000,
    subtotal: 8000,
    deliveryFee: 0,
    platformFee: 800, // 10%
    netSellerAmount: 7200,
    status: 'Completed',
    paymentStatus: 'paid',
    paymentDetails: {
      reference: 'SC-PAY-2024-99812-OK',
      channel: 'escrow_vault',
      paidAt: '2024-05-10T14:15:00Z',
      amountPaid: 8000,
      currency: 'NGN',
      isEscrowSecured: true,
      gatewayTransactionId: 'GTX-ESCROW-88192'
    },
    deliveryMethod: 'digital_download',
    deliveryLocation: 'Cloud Download Link',
    deliveryDeadline: 'May 12, 2024',
    deliveryTime: '2 Days',
    deliveryNotes: 'All 3 logo concepts and final approved vector packages (AI, SVG, PDF, PNG) uploaded and approved.',
    deliveryFiles: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'
    ],
    deliveredAt: '2024-05-12T10:00:00Z',
    completedAt: '2024-05-12T12:30:00Z',
    hasReview: true,
    reviewId: 'rev-tx-001',
    trackingUpdates: [
      { status: 'Pending', timestamp: '2024-05-10T14:00:00Z', note: 'Order created from accepted quote.' },
      { status: 'Paid', timestamp: '2024-05-10T14:15:00Z', note: '₦8,000 payment secured in StudentCircle Escrow Vault.' },
      { status: 'Confirmed', timestamp: '2024-05-10T14:30:00Z', note: 'Adebayo Samuel confirmed and scheduled the design project.' },
      { status: 'Processing', timestamp: '2024-05-11T09:00:00Z', note: 'Concept drafting and vector styling in progress.' },
      { status: 'Delivered', timestamp: '2024-05-12T10:00:00Z', note: 'Deliverables submitted with high-res download archive.' },
      { status: 'Completed', timestamp: '2024-05-12T12:30:00Z', note: 'Client approved deliverables. ₦7,200 released from Escrow to Adebayo Samuel.' }
    ],
    createdAt: '2024-05-10T14:00:00Z',
    updatedAt: '2024-05-12T12:30:00Z'
  },
  {
    id: 'ORD-TX-002',
    orderId: 'ORD-TX-002',
    type: 'product',
    targetItemId: 'prod-1',
    targetItemTitle: 'Customized OOU Heavyweight Graphic Hoodie (Navy / XL)',
    buyerId: 'student-4',
    buyer: {
      id: 'student-4',
      name: 'Praise Daniel',
      email: 'praise.daniel@gmail.com',
      phoneNumber: '+234 809 334 5566',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      role: 'student',
      departmentOrCompany: 'Biochemistry (300L)',
      location: 'Sagamu Medical Campus'
    },
    sellerId: 'student-1',
    seller: {
      id: 'student-1',
      name: 'Onifade Sulaiman',
      email: 'sulaiman@ooustudentcircle.com',
      phoneNumber: '+234 812 345 6789',
      photo: founderImage,
      role: 'student',
      departmentOrCompany: 'Clarity Prints & Branding',
      location: 'Ago-Iwoye Main Campus'
    },
    items: [
      {
        id: 'prod-1',
        title: 'Customized OOU Heavyweight Graphic Hoodie',
        price: 10500,
        quantity: 1,
        unitPrice: 10500,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
        category: 'Fashion & Clothing',
        specifications: 'Size: XL | Color: Navy Blue | Custom text: OOU Biochemistry 2024'
      }
    ],
    amount: 11000,
    subtotal: 10500,
    deliveryFee: 500,
    platformFee: 840, // 8%
    netSellerAmount: 10160,
    status: 'Processing',
    paymentStatus: 'paid',
    paymentDetails: {
      reference: 'SC-PAY-2024-HD-1120',
      channel: 'paystack',
      paidAt: '2024-05-14T16:00:00Z',
      amountPaid: 11000,
      currency: 'NGN',
      isEscrowSecured: true,
      gatewayTransactionId: 'PSTK-9901452-OOU'
    },
    deliveryMethod: 'delivery',
    deliveryAddress: 'Hostel Block C, Room 14, Sagamu Medical Campus',
    deliveryLocation: 'Sagamu Medical Campus',
    deliveryDeadline: 'May 17, 2024',
    deliveryTime: '24-48 Hours',
    hasReview: false,
    trackingUpdates: [
      { status: 'Pending', timestamp: '2024-05-14T15:50:00Z', note: 'Checkout initiated.' },
      { status: 'Paid', timestamp: '2024-05-14T16:00:00Z', note: 'Payment of ₦11,000 confirmed via Paystack. Funds secured in Escrow.' },
      { status: 'Confirmed', timestamp: '2024-05-14T16:30:00Z', note: 'Vendor Clarity Prints accepted order for custom heat-press printing.' },
      { status: 'Processing', timestamp: '2024-05-15T09:00:00Z', note: 'Apparel currently in DTF printing and quality check queue.' }
    ],
    createdAt: '2024-05-14T15:50:00Z',
    updatedAt: '2024-05-15T09:00:00Z'
  },
  {
    id: 'ORD-TX-003',
    orderId: 'ORD-TX-003',
    type: 'job',
    targetItemId: 'job-3',
    targetItemTitle: 'Social Media Manager for local food brand in Ago-Iwoye',
    buyerId: 'client-1',
    buyer: {
      id: 'client-1',
      name: 'Johnson Peter',
      email: 'johnson.peter@gmail.com',
      phoneNumber: '+234 802 333 4455',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      role: 'client',
      departmentOrCompany: 'Apex Brand Studio'
    },
    sellerId: 'student-3',
    seller: {
      id: 'student-3',
      name: 'Maryam Adeola',
      email: 'maryam.adeola@gmail.com',
      phoneNumber: '+234 814 998 7766',
      photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80',
      role: 'student',
      departmentOrCompany: 'Mass Communication (300L)',
      faculty: 'Faculty of Social and Management Sciences'
    },
    items: [
      {
        id: 'job-item-3',
        title: 'Social Media Management (14 Days Campaign & Content Schedule)',
        price: 20000,
        quantity: 1,
        unitPrice: 20000,
        category: 'Marketing & Growth'
      }
    ],
    amount: 20000,
    subtotal: 20000,
    deliveryFee: 0,
    platformFee: 2000, // 10%
    netSellerAmount: 18000,
    status: 'Delivered',
    paymentStatus: 'paid',
    paymentDetails: {
      reference: 'SC-ESCROW-JOB-20000',
      channel: 'escrow_vault',
      paidAt: '2024-05-11T10:00:00Z',
      amountPaid: 20000,
      currency: 'NGN',
      isEscrowSecured: true
    },
    deliveryMethod: 'online_service',
    deliveryDeadline: 'May 16, 2024',
    deliveryTime: '14 Days',
    deliveryNotes: '14 custom Instagram carousels, WhatsApp marketing broadcasts, and growth analytics sheet submitted for final review.',
    deliveredAt: '2024-05-15T10:00:00Z',
    hasReview: false,
    trackingUpdates: [
      { status: 'Paid', timestamp: '2024-05-11T10:00:00Z', note: 'Escrow milestone funded: ₦20,000.' },
      { status: 'Confirmed', timestamp: '2024-05-11T10:30:00Z', note: 'Maryam Adeola commenced content production.' },
      { status: 'Processing', timestamp: '2024-05-12T08:00:00Z', note: 'Campaign scheduled & published on Instagram & WhatsApp.' },
      { status: 'Delivered', timestamp: '2024-05-15T10:00:00Z', note: 'All campaign analytics and design files submitted for client sign-off.' }
    ],
    createdAt: '2024-05-11T09:30:00Z',
    updatedAt: '2024-05-15T10:00:00Z'
  }
];

// Initial Demo Seed Reviews
export const initialUnifiedReviews: UnifiedReview[] = [
  {
    id: 'rev-tx-001',
    reviewId: 'REV-2024-001',
    orderId: 'ORD-TX-001',
    transactionType: 'service',
    targetItemId: 'srv-1',
    targetItemTitle: 'Modern Minimalist Logo & Complete Brand Identity Design',
    reviewerId: 'client-1',
    reviewer: {
      id: 'client-1',
      name: 'Johnson Peter',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      role: 'client',
      departmentOrCompany: 'Apex Brand Studio'
    },
    recipientId: 'student-2',
    recipient: {
      id: 'student-2',
      name: 'Adebayo Samuel',
      role: 'student',
      departmentOrCompany: 'Fine & Applied Arts'
    },
    rating: 5,
    title: 'Phenomenal vector branding & fast delivery!',
    comment: 'Adebayo is an outstanding talent at OOU. He delivered 3 top-class concepts within 48 hours, made requested tweaks immediately, and delivered clean vector files. Highly recommended!',
    tags: ['Fast Delivery', 'Creative Quality', 'Great Communication', 'High-Res Vectors'],
    isVerifiedTransaction: true,
    createdAt: '2024-05-12T13:00:00Z',
    updatedAt: '2024-05-12T13:00:00Z'
  }
];

// Initial Demo Seed Disputes
export const initialOrderDisputes: OrderDispute[] = [];

export class TransactionEngineStore {
  private static getItem<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!stored) return fallback;
      return JSON.parse(stored);
    } catch {
      return fallback;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (err) {
      console.warn('TransactionEngineStore storage write notice:', err);
    }
  }

  // ==========================================
  // REQUESTS (Discover -> Request)
  // ==========================================
  static getRequests(): TransactionRequest[] {
    return this.getItem<TransactionRequest[]>('requests', initialTransactionRequests);
  }

  static getRequestById(requestId: string): TransactionRequest | null {
    return this.getRequests().find(r => r.id === requestId || r.requestId === requestId) || null;
  }

  static getRequestsForUser(userId: string, role?: string): TransactionRequest[] {
    const all = this.getRequests();
    if (role === 'admin') return all;
    return all.filter(r => r.buyerId === userId || r.sellerId === userId || r.buyer.id === userId || r.seller.id === userId);
  }

  static createRequest(params: {
    buyer: PartyInfo;
    seller: PartyInfo;
    type: TransactionType;
    targetItemId?: string;
    targetItemTitle: string;
    targetItemImage?: string;
    targetItemCategory?: string;
    title: string;
    description: string;
    attachments?: string[];
    budget?: number;
    expectedDeliveryDays?: number;
    deliveryLocation?: string;
  }): TransactionRequest {
    const requests = this.getRequests();
    const id = `req-${Date.now()}`;
    const requestId = `REQ-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newRequest: TransactionRequest = {
      id,
      requestId,
      buyerId: params.buyer.id,
      buyer: params.buyer,
      sellerId: params.seller.id,
      seller: params.seller,
      type: params.type,
      targetItemId: params.targetItemId,
      targetItemTitle: params.targetItemTitle,
      targetItemImage: params.targetItemImage,
      targetItemCategory: params.targetItemCategory,
      title: params.title,
      description: params.description,
      attachments: params.attachments || [],
      budget: params.budget,
      expectedDeliveryDays: params.expectedDeliveryDays,
      deliveryLocation: params.deliveryLocation,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    requests.unshift(newRequest);
    this.setItem('requests', requests);

    // Notify seller
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: params.seller.id,
      title: 'New Service/Product Request Received!',
      message: `${params.buyer.name} sent a request for "${params.targetItemTitle}". Review details and send a customized quote.`,
      type: 'proposal',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'transactionRequests', newRequest.id), newRequest).catch(console.warn);
    }

    return newRequest;
  }

  static updateRequestStatus(requestId: string, status: UnifiedRequestStatus, declineReason?: string): void {
    const requests = this.getRequests();
    const target = requests.find(r => r.id === requestId || r.requestId === requestId);
    if (target) {
      target.status = status;
      if (declineReason) target.declineReason = declineReason;
      target.updatedAt = new Date().toISOString();
      this.setItem('requests', requests);

      if (db) {
        setDoc(doc(db, 'transactionRequests', target.id), target, { merge: true }).catch(console.warn);
      }
    }
  }

  // ==========================================
  // QUOTES (Request -> Quote -> Accept/Decline)
  // ==========================================
  static getQuotes(): TransactionQuote[] {
    return this.getItem<TransactionQuote[]>('quotes', initialTransactionQuotes);
  }

  static getQuoteById(quoteId: string): TransactionQuote | null {
    return this.getQuotes().find(q => q.id === quoteId || q.quoteId === quoteId) || null;
  }

  static getQuotesForRequest(requestId: string): TransactionQuote[] {
    return this.getQuotes().filter(q => q.requestId === requestId);
  }

  static getQuotesForUser(userId: string, role?: string): TransactionQuote[] {
    const all = this.getQuotes();
    if (role === 'admin') return all;
    return all.filter(q => q.buyerId === userId || q.sellerId === userId || q.buyer.id === userId || q.seller.id === userId);
  }

  static sendQuote(params: {
    requestId: string;
    amount: number;
    deliveryTime: string;
    deliveryDays?: number;
    message: string;
    scopeBreakdown?: string[];
    validUntil?: string;
  }): TransactionQuote | null {
    const req = this.getRequestById(params.requestId);
    if (!req) return null;

    const quotes = this.getQuotes();
    const id = `quo-${Date.now()}`;
    const quoteId = `QUO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    // Default validity: 7 days
    const validUntil = params.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const newQuote: TransactionQuote = {
      id,
      quoteId,
      requestId: req.id,
      requestTitle: req.title,
      type: req.type,
      targetItemId: req.targetItemId,
      sellerId: req.sellerId,
      seller: req.seller,
      buyerId: req.buyerId,
      buyer: req.buyer,
      amount: params.amount,
      deliveryTime: params.deliveryTime,
      deliveryDays: params.deliveryDays,
      message: params.message,
      scopeBreakdown: params.scopeBreakdown || [],
      validUntil,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    quotes.unshift(newQuote);
    this.setItem('quotes', quotes);

    // Update parent request status
    req.status = 'quoted';
    req.quoteId = newQuote.id;
    req.updatedAt = now;
    this.saveRequest(req);

    // Notify buyer
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: req.buyerId,
      title: 'Quote Received for Your Request!',
      message: `${req.seller.name} sent a quote of ₦${params.amount.toLocaleString()} for "${req.title}". Review and accept to proceed with secure Escrow.`,
      type: 'proposal_received',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'transactionQuotes', newQuote.id), newQuote).catch(console.warn);
    }

    return newQuote;
  }

  static declineQuote(quoteId: string, reason?: string): boolean {
    const quotes = this.getQuotes();
    const target = quotes.find(q => q.id === quoteId || q.quoteId === quoteId);
    if (!target) return false;

    target.status = 'declined';
    target.declineReason = reason;
    target.updatedAt = new Date().toISOString();
    this.setItem('quotes', quotes);

    // Update request
    const req = this.getRequestById(target.requestId);
    if (req) {
      req.status = 'declined';
      req.declineReason = reason;
      this.saveRequest(req);
    }

    // Notify seller
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: target.sellerId,
      title: 'Quote Declined',
      message: `${target.buyer.name} declined the quote for "${target.requestTitle}".`,
      type: 'proposal_rejected',
      link: '/orders',
      read: false,
      createdAt: new Date().toISOString()
    });

    if (db) {
      setDoc(doc(db, 'transactionQuotes', target.id), target, { merge: true }).catch(console.warn);
    }

    return true;
  }

  // ==========================================
  // ORDERS (Quote / Instant Buy -> Order -> Payment -> Lifecycle)
  // ==========================================
  static getOrders(): UnifiedOrder[] {
    return this.getItem<UnifiedOrder[]>('orders', initialUnifiedOrders);
  }

  static getOrderById(orderId: string): UnifiedOrder | null {
    return this.getOrders().find(o => o.id === orderId || o.orderId === orderId) || null;
  }

  /**
   * SECURITY ENFORCEMENT:
   * Users must ONLY see orders they are authorized to see.
   */
  static getOrdersForUser(userId: string, role?: string): UnifiedOrder[] {
    const all = this.getOrders();
    if (role === 'admin') return all;
    return all.filter(o => o.buyerId === userId || o.sellerId === userId || o.buyer.id === userId || o.seller.id === userId);
  }

  /**
   * SECURITY CHECK: URL Manipulation Guard
   */
  static isUserAuthorizedForOrder(userId: string, userRole: string | undefined, orderId: string): boolean {
    if (userRole === 'admin') return true;
    const order = this.getOrderById(orderId);
    if (!order) return false;
    return order.buyerId === userId || order.sellerId === userId || order.buyer.id === userId || order.seller.id === userId;
  }

  /**
   * Create an Order from an Accepted Quote
   */
  static acceptQuoteAndCreateOrder(quoteId: string, paymentMethod: 'escrow_vault' | 'paystack' | 'flutterwave' | 'bank_transfer' = 'escrow_vault'): UnifiedOrder | null {
    const quote = this.getQuoteById(quoteId);
    if (!quote) return null;

    const orders = this.getOrders();
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const { platformFee, netSellerAmount } = calculateTransactionFee(quote.amount, quote.type);

    const order: UnifiedOrder = {
      id: orderId,
      orderId,
      requestId: quote.requestId,
      quoteId: quote.id,
      type: quote.type,
      targetItemId: quote.targetItemId,
      targetItemTitle: quote.requestTitle,
      buyerId: quote.buyerId,
      buyer: quote.buyer,
      sellerId: quote.sellerId,
      seller: quote.seller,
      items: [
        {
          id: `item-${Date.now()}`,
          title: quote.requestTitle,
          price: quote.amount,
          quantity: 1,
          unitPrice: quote.amount
        }
      ],
      amount: quote.amount,
      subtotal: quote.amount,
      deliveryFee: 0,
      platformFee,
      netSellerAmount,
      status: 'Pending',
      paymentStatus: 'unpaid',
      deliveryTime: quote.deliveryTime,
      hasReview: false,
      trackingUpdates: [
        {
          status: 'Pending',
          timestamp: now,
          note: `Order generated from accepted quote (${quote.quoteId}). Awaiting payment confirmation.`,
          actorName: quote.buyer.name,
          actorRole: quote.buyer.role
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    orders.unshift(order);
    this.setItem('orders', orders);

    // Update Quote
    quote.status = 'accepted';
    quote.orderId = order.id;
    quote.updatedAt = now;
    this.saveQuote(quote);

    // Update Request
    const req = this.getRequestById(quote.requestId);
    if (req) {
      req.status = 'accepted';
      req.orderId = order.id;
      this.saveRequest(req);
    }

    if (db) {
      setDoc(doc(db, 'unifiedOrders', order.id), order).catch(console.warn);
    }

    return order;
  }

  /**
   * Create a Direct Order (e.g. from Product Card, Campus Shop Item, or Direct Service Booking)
   */
  static createDirectOrder(params: {
    buyer: PartyInfo;
    seller: PartyInfo;
    type: TransactionType;
    targetItemId?: string;
    targetItemTitle: string;
    items: UnifiedOrderItem[];
    amount: number;
    deliveryFee?: number;
    deliveryMethod?: 'pickup' | 'delivery' | 'digital_download' | 'online_service';
    deliveryAddress?: string;
    deliveryLocation?: string;
    deliveryDeadline?: string;
  }): UnifiedOrder {
    const orders = this.getOrders();
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const { platformFee, netSellerAmount } = calculateTransactionFee(params.amount, params.type);

    const order: UnifiedOrder = {
      id: orderId,
      orderId,
      type: params.type,
      targetItemId: params.targetItemId,
      targetItemTitle: params.targetItemTitle,
      buyerId: params.buyer.id,
      buyer: params.buyer,
      sellerId: params.seller.id,
      seller: params.seller,
      items: params.items,
      amount: params.amount + (params.deliveryFee || 0),
      subtotal: params.amount,
      deliveryFee: params.deliveryFee || 0,
      platformFee,
      netSellerAmount,
      status: 'Pending',
      paymentStatus: 'unpaid',
      deliveryMethod: params.deliveryMethod || 'delivery',
      deliveryAddress: params.deliveryAddress,
      deliveryLocation: params.deliveryLocation,
      deliveryDeadline: params.deliveryDeadline,
      hasReview: false,
      trackingUpdates: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Direct order initiated. Awaiting payment confirmation.',
          actorName: params.buyer.name,
          actorRole: params.buyer.role
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    orders.unshift(order);
    this.setItem('orders', orders);

    if (db) {
      setDoc(doc(db, 'unifiedOrders', order.id), order).catch(console.warn);
    }

    return order;
  }

  // ==========================================
  // PAYMENT CONFIRMATION (DO NOT FAKE STATUS!)
  // ==========================================
  /**
   * Only mark payment successful after actual payment confirmation.
   */
  static confirmPayment(
    orderId: string,
    paymentDetails: {
      reference: string;
      channel: 'escrow_vault' | 'paystack' | 'flutterwave' | 'bank_transfer' | 'ussd';
      amountPaid: number;
      currency?: string;
      gatewayTransactionId?: string;
      verificationCode?: string;
    }
  ): { success: boolean; order?: UnifiedOrder; message: string } {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId || o.orderId === orderId);

    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    if (order.paymentStatus === 'paid') {
      return { success: true, order, message: 'Order is already marked as paid.' };
    }

    const now = new Date().toISOString();

    order.paymentStatus = 'paid';
    order.status = 'Paid';
    order.paymentDetails = {
      reference: paymentDetails.reference,
      channel: paymentDetails.channel,
      paidAt: now,
      amountPaid: paymentDetails.amountPaid,
      currency: paymentDetails.currency || 'NGN',
      isEscrowSecured: true,
      gatewayTransactionId: paymentDetails.gatewayTransactionId || `GTX-${Date.now()}`,
      verificationCode: paymentDetails.verificationCode
    };

    order.trackingUpdates.push({
      status: 'Paid',
      timestamp: now,
      note: `Payment of ₦${paymentDetails.amountPaid.toLocaleString()} confirmed via ${paymentDetails.channel.replace('_', ' ').toUpperCase()} (Ref: ${paymentDetails.reference}). Funds secured in OOU StudentCircle Escrow Vault.`,
      actorName: order.buyer.name,
      actorRole: order.buyer.role
    });

    order.updatedAt = now;
    this.setItem('orders', orders);

    // Save transaction in DataStore
    DataStore.saveTransaction({
      id: `tx-escrow-${Date.now()}`,
      jobId: order.targetItemId,
      jobTitle: order.targetItemTitle,
      payerId: order.buyerId,
      payerName: order.buyer.name,
      recipientId: order.sellerId,
      recipientName: order.seller.name,
      amount: order.amount,
      platformFee: order.platformFee,
      netAmount: order.netSellerAmount,
      status: 'held_in_escrow',
      type: 'escrow_hold',
      createdAt: now,
      reference: paymentDetails.reference,
      title: `Escrow Hold for ${order.targetItemTitle}`
    });

    // Notify seller
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: order.sellerId,
      title: 'Payment Secured in Escrow!',
      message: `₦${order.amount.toLocaleString()} is securely held in escrow for "${order.targetItemTitle}". Please accept and commence processing!`,
      type: 'job_hired',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'unifiedOrders', order.id), order, { merge: true }).catch(console.warn);
    }

    return {
      success: true,
      order,
      message: 'Payment confirmed and secured in Escrow Vault successfully!'
    };
  }

  // ==========================================
  // ORDER LIFECYCLE STATE MACHINE
  // ==========================================
  static updateOrderStatus(
    orderId: string,
    newStatus: UnifiedOrderStatus,
    note?: string,
    actor?: { name: string; role: string }
  ): { success: boolean; order?: UnifiedOrder; message: string } {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId || o.orderId === orderId);

    if (!order) {
      return { success: false, message: 'Order not found.' };
    }

    const now = new Date().toISOString();
    order.status = newStatus;
    order.updatedAt = now;

    order.trackingUpdates.push({
      status: newStatus,
      timestamp: now,
      note: note || `Order transitioned to ${newStatus}.`,
      actorName: actor?.name,
      actorRole: actor?.role
    });

    // Handle completed status
    if (newStatus === 'Completed' && !order.completedAt) {
      order.completedAt = now;
      // Release Escrow funds to seller
      this.releaseEscrowToSeller(order);
    }

    this.setItem('orders', orders);

    // Notify relevant party
    const targetUserId = actor?.role === 'student' || actor?.role === 'vendor' ? order.buyerId : order.sellerId;
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title: `Order Status Update: ${newStatus}`,
      message: `Order "${order.targetItemTitle}" is now ${newStatus}. ${note || ''}`,
      type: newStatus === 'Completed' ? 'job_completed' : 'system',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'unifiedOrders', order.id), order, { merge: true }).catch(console.warn);
    }

    return { success: true, order, message: `Order updated to ${newStatus}.` };
  }

  /**
   * Provider delivers work/files
   */
  static deliverOrder(
    orderId: string,
    deliveryNotes: string,
    deliveryFiles: string[],
    seller: PartyInfo
  ): { success: boolean; order?: UnifiedOrder; message: string } {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId || o.orderId === orderId);

    if (!order) return { success: false, message: 'Order not found.' };

    const now = new Date().toISOString();
    order.status = 'Delivered';
    order.deliveryNotes = deliveryNotes;
    order.deliveryFiles = deliveryFiles;
    order.deliveredAt = now;
    order.updatedAt = now;

    order.trackingUpdates.push({
      status: 'Delivered',
      timestamp: now,
      note: `Deliverables submitted by ${seller.name}. Ready for client review and approval.`,
      actorName: seller.name,
      actorRole: seller.role
    });

    this.setItem('orders', orders);

    // Notify buyer
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: order.buyerId,
      title: 'Deliverables Submitted for Approval!',
      message: `${seller.name} has submitted the completed deliverables for "${order.targetItemTitle}". Please review and approve to release funds.`,
      type: 'system',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'unifiedOrders', order.id), order, { merge: true }).catch(console.warn);
    }

    return { success: true, order, message: 'Deliverables submitted successfully!' };
  }

  /**
   * Customer confirms completion and releases escrow funds to seller
   */
  static completeOrder(orderId: string, buyer: PartyInfo): { success: boolean; order?: UnifiedOrder; message: string } {
    return this.updateOrderStatus(
      orderId,
      'Completed',
      `Deliverables approved by ${buyer.name}. Escrow payment released to seller.`,
      { name: buyer.name, role: buyer.role }
    );
  }

  private static releaseEscrowToSeller(order: UnifiedOrder): void {
    // Credit seller totalEarnings
    const sellerUser = DataStore.getUserById(order.sellerId);
    if (sellerUser) {
      sellerUser.totalEarnings = (sellerUser.totalEarnings || 0) + order.netSellerAmount;
      sellerUser.completedJobsCount = (sellerUser.completedJobsCount || 0) + 1;
      DataStore.saveUser(sellerUser);
    }

    // Record wallet transaction
    DataStore.saveTransaction({
      id: `tx-rel-${Date.now()}`,
      jobId: order.targetItemId,
      jobTitle: order.targetItemTitle,
      payerId: order.buyerId,
      payerName: order.buyer.name,
      recipientId: order.sellerId,
      recipientName: order.seller.name,
      amount: order.amount,
      platformFee: order.platformFee,
      netAmount: order.netSellerAmount,
      status: 'released',
      type: 'payment',
      createdAt: new Date().toISOString(),
      reference: `OOU-REL-${order.orderId}`,
      title: `Escrow Payout for ${order.targetItemTitle}`
    });
  }

  // ==========================================
  // CANCELLATIONS
  // ==========================================
  static cancelOrder(
    orderId: string,
    cancelledBy: PartyInfo,
    reason: string
  ): { success: boolean; message: string } {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId || o.orderId === orderId);

    if (!order) return { success: false, message: 'Order not found.' };

    if (order.status === 'Completed') {
      return { success: false, message: 'Completed orders cannot be cancelled.' };
    }

    const now = new Date().toISOString();
    const wasPaid = order.paymentStatus === 'paid';

    order.status = 'Cancelled';
    order.cancellation = {
      cancelledBy,
      reason,
      timestamp: now,
      refundStatus: wasPaid ? 'refunded' : 'not_applicable',
      refundAmount: wasPaid ? order.amount : 0,
      refundReference: wasPaid ? `RFD-${Date.now()}` : undefined
    };

    if (wasPaid) {
      order.paymentStatus = 'refunded';
    }

    order.trackingUpdates.push({
      status: 'Cancelled',
      timestamp: now,
      note: `Order cancelled by ${cancelledBy.name} (${cancelledBy.role}). Reason: "${reason}". ${wasPaid ? `Refund of ₦${order.amount.toLocaleString()} processed back to buyer.` : ''}`,
      actorName: cancelledBy.name,
      actorRole: cancelledBy.role
    });

    order.updatedAt = now;
    this.setItem('orders', orders);

    if (db) {
      setDoc(doc(db, 'unifiedOrders', order.id), order, { merge: true }).catch(console.warn);
    }

    return {
      success: true,
      message: `Order cancelled successfully. ${wasPaid ? 'Funds refunded to buyer.' : ''}`
    };
  }

  // ==========================================
  // DISPUTES (Customer -> Dispute -> Admin Review & Resolve)
  // ==========================================
  static getDisputes(): OrderDispute[] {
    return this.getItem<OrderDispute[]>('disputes', initialOrderDisputes);
  }

  static getDisputeById(disputeId: string): OrderDispute | null {
    return this.getDisputes().find(d => d.id === disputeId || d.disputeId === disputeId) || null;
  }

  static getDisputesForUser(userId: string, role?: string): OrderDispute[] {
    const all = this.getDisputes();
    if (role === 'admin') return all;
    return all.filter(d => d.openedById === userId || d.againstId === userId || d.openedBy.id === userId || d.against.id === userId);
  }

  static openDispute(params: {
    orderId: string;
    openedBy: PartyInfo;
    reason: DisputeReason;
    description: string;
    evidenceAttachments?: string[];
  }): { success: boolean; dispute?: OrderDispute; message: string } {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === params.orderId || o.orderId === params.orderId);

    if (!order) return { success: false, message: 'Order not found.' };

    const disputes = this.getDisputes();
    const id = `disp-${Date.now()}`;
    const disputeId = `DSP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const isBuyer = params.openedBy.id === order.buyerId;
    const against = isBuyer ? order.seller : order.buyer;

    const reasonObj = PAYMENT_CONFIG.disputePolicy.allowedReasons.find(r => r.id === params.reason);
    const reasonLabel = reasonObj ? reasonObj.label : params.reason;

    const dispute: OrderDispute = {
      id,
      disputeId,
      orderId: order.id,
      orderTitle: order.targetItemTitle,
      orderType: order.type,
      orderAmount: order.amount,
      openedById: params.openedBy.id,
      openedBy: params.openedBy,
      againstId: against.id,
      against,
      reason: params.reason,
      reasonLabel,
      description: params.description,
      evidenceAttachments: params.evidenceAttachments || [],
      status: 'Open',
      createdAt: now,
      updatedAt: now
    };

    disputes.unshift(dispute);
    this.setItem('disputes', disputes);

    // Update order status
    order.status = 'Disputed';
    order.disputeId = dispute.id;
    order.disputeStatus = 'Open';
    order.trackingUpdates.push({
      status: 'Disputed',
      timestamp: now,
      note: `Dispute opened by ${params.openedBy.name}. Escrow payout locked pending arbitration.`,
      actorName: params.openedBy.name,
      actorRole: params.openedBy.role
    });
    order.updatedAt = now;
    this.setItem('orders', orders);

    // Notify against party & admin
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: against.id,
      title: 'Dispute Raised on Order',
      message: `${params.openedBy.name} opened a dispute for "${order.targetItemTitle}": ${reasonLabel}. StudentCircle Admin arbitration initiated.`,
      type: 'system',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'orderDisputes', dispute.id), dispute).catch(console.warn);
      setDoc(doc(db, 'unifiedOrders', order.id), order, { merge: true }).catch(console.warn);
    }

    return { success: true, dispute, message: 'Dispute filed successfully. Escrow funds locked pending Admin review.' };
  }

  static updateDisputeStatus(
    disputeId: string,
    status: DisputeStatus,
    adminNotes?: string
  ): boolean {
    const disputes = this.getDisputes();
    const dispute = disputes.find(d => d.id === disputeId || d.disputeId === disputeId);
    if (!dispute) return false;

    dispute.status = status;
    if (adminNotes) dispute.adminNotes = adminNotes;
    dispute.updatedAt = new Date().toISOString();
    this.setItem('disputes', disputes);

    // Update order
    const order = this.getOrderById(dispute.orderId);
    if (order) {
      order.disputeStatus = status;
      this.saveOrder(order);
    }

    if (db) {
      setDoc(doc(db, 'orderDisputes', dispute.id), dispute, { merge: true }).catch(console.warn);
    }

    return true;
  }

  static resolveDispute(params: {
    disputeId: string;
    action: DisputeResolutionAction;
    adminNotes: string;
    refundAmount?: number;
    resolvedByAdmin: { id: string; name: string };
  }): { success: boolean; message: string } {
    const disputes = this.getDisputes();
    const dispute = disputes.find(d => d.id === params.disputeId || d.disputeId === params.disputeId);
    if (!dispute) return { success: false, message: 'Dispute not found.' };

    const order = this.getOrderById(dispute.orderId);
    if (!order) return { success: false, message: 'Parent order not found.' };

    const now = new Date().toISOString();

    dispute.status = 'Resolved';
    dispute.resolutionAction = params.action;
    dispute.adminNotes = params.adminNotes;
    dispute.refundAmount = params.refundAmount;
    dispute.resolvedAt = now;
    dispute.resolvedById = params.resolvedByAdmin.id;
    dispute.resolvedByName = params.resolvedByAdmin.name;
    dispute.updatedAt = now;

    this.setItem('disputes', disputes);

    // Handle Resolution Action
    if (params.action === 'refund_buyer') {
      order.status = 'Refunded';
      order.paymentStatus = 'refunded';
      order.trackingUpdates.push({
        status: 'Refunded',
        timestamp: now,
        note: `Dispute resolved by Admin (${params.resolvedByAdmin.name}). Action: Full Refund to Buyer. Note: ${params.adminNotes}`,
        actorName: params.resolvedByAdmin.name,
        actorRole: 'admin'
      });
    } else if (params.action === 'release_to_seller') {
      order.status = 'Completed';
      order.completedAt = now;
      this.releaseEscrowToSeller(order);
      order.trackingUpdates.push({
        status: 'Completed',
        timestamp: now,
        note: `Dispute resolved by Admin (${params.resolvedByAdmin.name}). Action: Release Escrow Funds to Seller. Note: ${params.adminNotes}`,
        actorName: params.resolvedByAdmin.name,
        actorRole: 'admin'
      });
    } else if (params.action === 'split_settlement') {
      order.status = 'Completed';
      order.completedAt = now;
      order.trackingUpdates.push({
        status: 'Completed',
        timestamp: now,
        note: `Dispute resolved by Admin (${params.resolvedByAdmin.name}). Action: Split Settlement. Refund ₦${(params.refundAmount || 0).toLocaleString()} to buyer. Note: ${params.adminNotes}`,
        actorName: params.resolvedByAdmin.name,
        actorRole: 'admin'
      });
    } else {
      // Dismissed
      order.status = 'Completed';
      order.trackingUpdates.push({
        status: 'Completed',
        timestamp: now,
        note: `Dispute dismissed by Admin (${params.resolvedByAdmin.name}). Note: ${params.adminNotes}`,
        actorName: params.resolvedByAdmin.name,
        actorRole: 'admin'
      });
    }

    order.disputeStatus = 'Resolved';
    order.updatedAt = now;
    this.saveOrder(order);

    // Notifications
    DataStore.addNotification({
      id: `notif-${Date.now()}-1`,
      userId: dispute.openedById,
      title: 'Dispute Case Resolved',
      message: `Admin resolved dispute for "${order.targetItemTitle}". Action: ${params.action.replace('_', ' ').toUpperCase()}. ${params.adminNotes}`,
      type: 'system',
      link: '/orders',
      read: false,
      createdAt: now
    });

    DataStore.addNotification({
      id: `notif-${Date.now()}-2`,
      userId: dispute.againstId,
      title: 'Dispute Case Resolved',
      message: `Admin resolved dispute for "${order.targetItemTitle}". Action: ${params.action.replace('_', ' ').toUpperCase()}. ${params.adminNotes}`,
      type: 'system',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'orderDisputes', dispute.id), dispute, { merge: true }).catch(console.warn);
      setDoc(doc(db, 'unifiedOrders', order.id), order, { merge: true }).catch(console.warn);
    }

    return { success: true, message: 'Dispute resolved and arbitration settlement processed.' };
  }

  // ==========================================
  // REVIEWS (ONLY COMPLETED ORDERS CAN GENERATE REVIEWS)
  // ==========================================
  static getReviews(): UnifiedReview[] {
    return this.getItem<UnifiedReview[]>('reviews', initialUnifiedReviews);
  }

  static getReviewByOrderId(orderId: string): UnifiedReview | null {
    return this.getReviews().find(r => r.orderId === orderId) || null;
  }

  static getReviewsForSeller(sellerId: string): UnifiedReview[] {
    return this.getReviews().filter(r => r.recipientId === sellerId);
  }

  /**
   * CRITICAL BUSINESS RULE:
   * Only completed transactions can generate reviews.
   */
  static canUserReviewOrder(userId: string, orderId: string): { eligible: boolean; order?: UnifiedOrder; reason?: string } {
    const order = this.getOrderById(orderId);
    if (!order) {
      return { eligible: false, reason: 'Order not found.' };
    }

    if (order.buyerId !== userId && order.buyer.id !== userId) {
      return { eligible: false, reason: 'Only the verified customer who placed this order can submit a review.' };
    }

    if (order.status !== 'Completed') {
      return {
        eligible: false,
        reason: `Reviews can only be written after the transaction is fully completed (Current status: ${order.status}).`
      };
    }

    if (order.hasReview) {
      return { eligible: false, reason: 'You have already submitted a verified review for this completed transaction.' };
    }

    return { eligible: true, order };
  }

  static submitReview(params: {
    orderId: string;
    reviewer: PartyInfo;
    rating: number;
    title?: string;
    comment: string;
    tags?: string[];
  }): { success: boolean; review?: UnifiedReview; message: string } {
    const check = this.canUserReviewOrder(params.reviewer.id, params.orderId);
    if (!check.eligible || !check.order) {
      return { success: false, message: check.reason || 'Not eligible to submit review.' };
    }

    const order = check.order;
    const reviews = this.getReviews();
    const id = `rev-tx-${Date.now()}`;
    const reviewId = `REV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newReview: UnifiedReview = {
      id,
      reviewId,
      orderId: order.id,
      transactionType: order.type,
      targetItemId: order.targetItemId,
      targetItemTitle: order.targetItemTitle,
      reviewerId: params.reviewer.id,
      reviewer: params.reviewer,
      recipientId: order.sellerId,
      recipient: order.seller,
      rating: Math.max(1, Math.min(5, params.rating)),
      title: params.title,
      comment: params.comment,
      tags: params.tags || [],
      isVerifiedTransaction: true,
      createdAt: now,
      updatedAt: now
    };

    reviews.unshift(newReview);
    this.setItem('reviews', reviews);

    // Update order
    order.hasReview = true;
    order.reviewId = newReview.id;
    this.saveOrder(order);

    // Update seller profile metrics in DataStore
    const seller = DataStore.getUserById(order.sellerId);
    if (seller) {
      const sellerReviews = reviews.filter(r => r.recipientId === order.sellerId);
      const avg = sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length;
      seller.rating = Math.round(avg * 10) / 10;
      seller.reviewsCount = sellerReviews.length;
      DataStore.saveUser(seller);
    }

    // Notify seller
    DataStore.addNotification({
      id: `notif-${Date.now()}`,
      userId: order.sellerId,
      title: `${newReview.rating}-Star Verified Review Received!`,
      message: `${params.reviewer.name} rated you ${newReview.rating}/5 stars for "${order.targetItemTitle}".`,
      type: 'review_received',
      link: '/orders',
      read: false,
      createdAt: now
    });

    if (db) {
      setDoc(doc(db, 'unifiedReviews', newReview.id), newReview).catch(console.warn);
    }

    return { success: true, review: newReview, message: 'Verified review published successfully!' };
  }

  // ==========================================
  // HELPER SAVE METHODS
  // ==========================================
  private static saveRequest(req: TransactionRequest): void {
    const all = this.getRequests();
    const idx = all.findIndex(r => r.id === req.id);
    if (idx >= 0) all[idx] = req;
    else all.unshift(req);
    this.setItem('requests', all);
    if (db) setDoc(doc(db, 'transactionRequests', req.id), req, { merge: true }).catch(console.warn);
  }

  private static saveQuote(quote: TransactionQuote): void {
    const all = this.getQuotes();
    const idx = all.findIndex(q => q.id === quote.id);
    if (idx >= 0) all[idx] = quote;
    else all.unshift(quote);
    this.setItem('quotes', all);
    if (db) setDoc(doc(db, 'transactionQuotes', quote.id), quote, { merge: true }).catch(console.warn);
  }

  static saveOrder(order: UnifiedOrder): void {
    const all = this.getOrders();
    const idx = all.findIndex(o => o.id === order.id);
    if (idx >= 0) all[idx] = order;
    else all.unshift(order);
    this.setItem('orders', all);
    if (db) setDoc(doc(db, 'unifiedOrders', order.id), order, { merge: true }).catch(console.warn);
  }
}
