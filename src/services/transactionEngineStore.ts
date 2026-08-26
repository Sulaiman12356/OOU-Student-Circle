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
// Initial Transaction Requests - Empty by default
export const initialTransactionRequests: TransactionRequest[] = [];

// Initial Transaction Quotes - Empty by default
export const initialTransactionQuotes: TransactionQuote[] = [];

// Initial Unified Orders - Empty by default
export const initialUnifiedOrders: UnifiedOrder[] = [];

// Initial Unified Reviews - Empty by default
export const initialUnifiedReviews: UnifiedReview[] = [];

// Initial Order Disputes - Empty by default
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
