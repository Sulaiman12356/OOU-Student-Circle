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
import { FirestoreService } from './firestoreService';
import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

type Listener<T> = (data: T) => void;

class MessagingService {
  private conversationsCache: Map<string, Conversation> = new Map();
  private messagesCache: Map<string, ChatMessage[]> = new Map();
  private notificationsCache: Map<string, AppNotification[]> = new Map();

  private conversationsListeners: Set<Listener<Conversation[]>> = new Set();
  private messagesListeners: Map<string, Set<Listener<ChatMessage[]>>> = new Map();
  private notificationsListeners: Set<Listener<AppNotification[]>> = new Set();
  private unreadBadgeListeners: Set<Listener<{ messages: number; notifications: number }>> = new Set();

  private activeUnsubscribers: Map<string, () => void> = new Map();

  constructor() {
    // Service initialized for real-time Firestore synchronization
  }

  // ==========================================
  // REAL-TIME FIRESTORE SUBSCRIPTIONS
  // ==========================================

  public initializeUserSync(userId: string): () => void {
    if (!userId) return () => {};

    // 1. Subscribe to User's Conversations
    const convUnsub = FirestoreService.subscribeToConversations(userId, (convos) => {
      convos.forEach(c => this.conversationsCache.set(c.id, c));
      this.notifyConversationsListeners();
      this.notifyUnreadBadges(userId);
    });

    // 2. Subscribe to User's Notifications
    const notifUnsub = FirestoreService.subscribeToNotifications(userId, (notifs) => {
      this.notificationsCache.set(userId, notifs);
      this.notifyNotificationsListeners(userId);
      this.notifyUnreadBadges(userId);
    });

    return () => {
      convUnsub();
      notifUnsub();
    };
  }

  // ==========================================
  // CONVERSATIONS
  // ==========================================

  public getConversations(): Conversation[] {
    return Array.from(this.conversationsCache.values()).sort(
      (a, b) => new Date(b.lastMessageTimestamp || b.updatedAt || 0).getTime() - new Date(a.lastMessageTimestamp || a.updatedAt || 0).getTime()
    );
  }

  public getConversationsForUser(userId: string): Conversation[] {
    return this.getConversations().filter(c => c.participants.includes(userId));
  }

  public getConversationById(convId: string, userId: string): Conversation | null {
    const conv = this.conversationsCache.get(convId);
    if (!conv) return null;
    if (!conv.participants.includes(userId)) return null;
    return conv;
  }

  public async getOrCreateConversation(
    currentUserId: string,
    partnerId: string,
    type: ConversationType = 'student_connect',
    context?: ConversationContext,
    currentUserDetails?: { name: string; photo?: string; role: UserRole; departmentOrCompany?: string; isVerified?: boolean; matricNumber?: string },
    partnerDetails?: { name: string; photo?: string; role: UserRole; departmentOrCompany?: string; isVerified?: boolean; matricNumber?: string }
  ): Promise<Conversation> {
    const participants = [currentUserId, partnerId].sort();
    
    // Check local memory first
    const existing = Array.from(this.conversationsCache.values()).find(c => {
      const isSamePair = c.participants.length === 2 && 
        c.participants.includes(currentUserId) && 
        c.participants.includes(partnerId);
      if (!isSamePair) return false;

      // If specific context provided (e.g. orderId or serviceId or productId), match context
      if (context?.orderId && c.context?.orderId !== context.orderId) return false;
      if (context?.serviceId && c.context?.serviceId !== context.serviceId) return false;
      if (context?.productId && c.context?.productId !== context.productId) return false;
      return true;
    });

    if (existing) {
      return existing;
    }

    // Check Firestore directly if not in cache
    if (db) {
      try {
        const colRef = collection(db, 'conversations');
        const q = query(colRef, where('participants', 'array-contains', currentUserId));
        const snap = await getDocs(q);
        for (const docSnap of snap.docs) {
          const c = { id: docSnap.id, ...docSnap.data() } as Conversation;
          this.conversationsCache.set(c.id, c);
          if (c.participants.includes(partnerId)) {
            if (context?.orderId && c.context?.orderId !== context.orderId) continue;
            if (context?.serviceId && c.context?.serviceId !== context.serviceId) continue;
            if (context?.productId && c.context?.productId !== context.productId) continue;
            return c;
          }
        }
      } catch (err) {
        console.warn('getOrCreateConversation query notice:', err);
      }
    }

    // Create new real Conversation document in Firestore
    const convId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newConversation: Conversation = {
      id: convId,
      type,
      title: context?.initialTopic || `${partnerDetails?.name || 'Peer'} & ${currentUserDetails?.name || 'You'}`,
      participants: [currentUserId, partnerId],
      participantDetails: {
        [currentUserId]: {
          name: currentUserDetails?.name || 'Current User',
          photo: currentUserDetails?.photo,
          role: currentUserDetails?.role || 'student',
          departmentOrCompany: currentUserDetails?.departmentOrCompany,
          isVerified: currentUserDetails?.isVerified,
          matricNumber: currentUserDetails?.matricNumber
        },
        [partnerId]: {
          name: partnerDetails?.name || 'StudentCircle Peer',
          photo: partnerDetails?.photo,
          role: partnerDetails?.role || 'student',
          departmentOrCompany: partnerDetails?.departmentOrCompany,
          isVerified: partnerDetails?.isVerified,
          matricNumber: partnerDetails?.matricNumber
        }
      },
      context: context || { type },
      lastMessage: 'Conversation opened. Say hello!',
      lastMessageTimestamp: now,
      lastMessageSenderId: currentUserId,
      unreadCounts: {
        [currentUserId]: 0,
        [partnerId]: 1
      },
      createdAt: now,
      updatedAt: now
    };

    this.conversationsCache.set(convId, newConversation);
    this.notifyConversationsListeners();

    if (db) {
      try {
        await FirestoreService.saveConversation(newConversation);
      } catch (err) {
        console.warn('saveConversation to Firestore notice:', err);
      }
    }

    return newConversation;
  }

  // ==========================================
  // MESSAGES
  // ==========================================

  public async sendMessage(params: {
    conversationId: string;
    senderId: string;
    senderName?: string;
    senderPhoto?: string;
    senderRole?: UserRole;
    text: string;
    images?: string[];
    attachments?: MessageAttachment[];
    quoteData?: ChatMessage['quoteData'];
    orderData?: ChatMessage['orderData'];
    systemAction?: string;
  }): Promise<ChatMessage> {
    const { conversationId, senderId, senderName, senderPhoto, senderRole, text, images, attachments, quoteData, orderData, systemAction } = params;
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newMessage: ChatMessage = {
      id: msgId,
      conversationId,
      senderId,
      senderName,
      senderPhoto,
      senderRole,
      text,
      timestamp: now,
      read: false,
      images,
      attachments,
      quoteData,
      orderData,
      systemAction
    };

    // Update local cache
    const currentMsgs = this.messagesCache.get(conversationId) || [];
    this.messagesCache.set(conversationId, [...currentMsgs, newMessage]);
    this.notifyMessageListeners(conversationId);

    // Update conversation metadata
    const conv = this.conversationsCache.get(conversationId);
    let otherParticipantIds: string[] = [];
    if (conv) {
      conv.lastMessage = text || (images?.length ? 'Sent an image' : (quoteData ? 'Sent a quote' : 'Sent an attachment'));
      conv.lastMessageTimestamp = now;
      conv.lastMessageSenderId = senderId;
      conv.updatedAt = now;
      otherParticipantIds = conv.participants.filter(p => p !== senderId);
      otherParticipantIds.forEach(pId => {
        conv.unreadCounts[pId] = (conv.unreadCounts[pId] || 0) + 1;
      });
      this.notifyConversationsListeners();
    }

    // Persist to real Firestore
    if (db) {
      try {
        await FirestoreService.sendMessage(conversationId, newMessage, otherParticipantIds);
      } catch (err) {
        console.warn('Firestore sendMessage notice:', err);
      }

      // Create live real notifications for recipients
      if (otherParticipantIds.length > 0) {
        for (const recipientId of otherParticipantIds) {
          try {
            await this.addNotification({
              userId: recipientId,
              actorId: senderId,
              actorName: senderName || 'A StudentCircle User',
              actorPhoto: senderPhoto,
              title: quoteData ? 'New Custom Quote 💼' : `New message from ${senderName || 'Peer'} 💬`,
              message: text || (images?.length ? 'Sent you an image' : 'Sent you a file attachment'),
              type: quoteData ? 'new_quote' : 'new_message',
              category: quoteData ? 'jobs_proposals' : 'messages',
              link: '/student/messages'
            });
          } catch (err) {
            console.warn('Recipient notification notice:', err);
          }
        }
      }
    }

    return newMessage;
  }

  public async markConversationAsRead(convId: string, userId: string): Promise<void> {
    const conv = this.conversationsCache.get(convId);
    if (conv && conv.unreadCounts?.[userId]) {
      conv.unreadCounts[userId] = 0;
      this.notifyConversationsListeners();
      this.notifyUnreadBadges(userId);
    }

    // Update local messages
    const msgs = this.messagesCache.get(convId);
    if (msgs) {
      let changed = false;
      msgs.forEach(m => {
        if (m.senderId !== userId && !m.read) {
          m.read = true;
          changed = true;
        }
      });
      if (changed) {
        this.notifyMessageListeners(convId);
      }
    }

    // Persist read status to Firestore
    if (db) {
      try {
        await FirestoreService.markConversationAsRead(convId, userId);
      } catch (err) {
        console.warn('Firestore markConversationAsRead notice:', err);
      }
    }
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================

  public getNotifications(userId: string): AppNotification[] {
    const userNotifs = this.notificationsCache.get(userId) || [];
    return userNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async addNotification(notification: {
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
  }): Promise<AppNotification> {
    // Auto category mapping
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
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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

    // Update cache
    const current = this.notificationsCache.get(notification.userId) || [];
    this.notificationsCache.set(notification.userId, [newNotif, ...current]);
    this.notifyNotificationsListeners(notification.userId);
    this.notifyUnreadBadges(notification.userId);

    // Persist to real Firestore
    if (db) {
      try {
        await FirestoreService.saveNotification(newNotif);
      } catch (err) {
        console.warn('Firestore saveNotification notice:', err);
      }
    }

    return newNotif;
  }

  public async markNotificationAsRead(notifId: string, userId: string): Promise<void> {
    const list = this.notificationsCache.get(userId) || [];
    const target = list.find(n => n.id === notifId);
    if (target) {
      target.read = true;
      this.notifyNotificationsListeners(userId);
      this.notifyUnreadBadges(userId);
    }

    if (db) {
      try {
        await FirestoreService.markNotificationAsRead(notifId);
      } catch (err) {
        console.warn('Firestore markNotificationAsRead notice:', err);
      }
    }
  }

  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    const list = this.notificationsCache.get(userId) || [];
    list.forEach(n => { n.read = true; });
    this.notifyNotificationsListeners(userId);
    this.notifyUnreadBadges(userId);

    if (db) {
      try {
        await FirestoreService.markAllNotificationsAsRead(userId);
      } catch (err) {
        console.warn('Firestore markAllNotificationsAsRead notice:', err);
      }
    }
  }

  public async deleteNotification(notifId: string, userId: string): Promise<void> {
    const list = this.notificationsCache.get(userId) || [];
    const filtered = list.filter(n => n.id !== notifId);
    this.notificationsCache.set(userId, filtered);
    this.notifyNotificationsListeners(userId);
    this.notifyUnreadBadges(userId);

    if (db) {
      try {
        await FirestoreService.deleteNotification(notifId);
      } catch (err) {
        console.warn('Firestore deleteNotification notice:', err);
      }
    }
  }

  public getUnreadCounts(userId: string): { messages: number; notifications: number } {
    const convs = this.getConversationsForUser(userId);
    const unreadMessages = convs.reduce((sum, c) => sum + (c.unreadCounts?.[userId] || 0), 0);
    const unreadNotifs = (this.notificationsCache.get(userId) || []).filter(n => !n.read).length;
    return { messages: unreadMessages, notifications: unreadNotifs };
  }

  // ==========================================
  // SUBSCRIPTIONS & OBSERVERS
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
    
    // Provide initial cached messages
    listener(this.messagesCache.get(convId) || []);

    // Set up direct Firestore subcollection listener if db is active
    let unsubFirestore: (() => void) | null = null;
    if (db) {
      unsubFirestore = FirestoreService.subscribeToMessages(convId, (firestoreMsgs) => {
        this.messagesCache.set(convId, firestoreMsgs);
        this.notifyMessageListeners(convId);
      });
    }

    return () => {
      set.delete(listener);
      if (set.size === 0) {
        this.messagesListeners.delete(convId);
      }
      if (unsubFirestore) {
        unsubFirestore();
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
    const userId = typeof arg1 === 'string' ? arg1 : (typeof arg2 === 'string' ? arg2 : '');
    const listener: Listener<{ messages: number; notifications: number }> = 
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
      const msgs = this.messagesCache.get(convId) || [];
      set.forEach(l => l(msgs));
    }
  }

  private notifyNotificationsListeners(userId?: string): void {
    this.notificationsListeners.forEach(l => {
      if (userId) {
        l(this.getNotifications(userId));
      }
    });
  }

  private notifyUnreadBadges(userId?: string): void {
    if (userId) {
      const counts = this.getUnreadCounts(userId);
      this.unreadBadgeListeners.forEach(l => l(counts));
    }
  }

  // Real transactional notification generator for actual user events (e.g. testing or workflow dispatch)
  public async dispatchSampleNotification(userId: string, type: NotificationType): Promise<AppNotification> {
    const templates: Record<NotificationType, { title: string; message: string; category: AppNotification['category']; link: string }> = {
      connection_request: {
        title: 'New Student Connection Request 🤝',
        message: 'A campus peer sent you a connection request on StudentCircle.',
        category: 'social_campus',
        link: '/student-connect'
      },
      connection_accepted: {
        title: 'Connection Request Accepted 🎉',
        message: 'Your connection invitation was accepted. You are now campus peers!',
        category: 'social_campus',
        link: '/student/messages'
      },
      new_message: {
        title: 'New Chat Message 💬',
        message: 'You have received a new message in your StudentCircle inbox.',
        category: 'messages',
        link: '/student/messages'
      },
      new_service_request: {
        title: 'New Service Request Received 🎯',
        message: 'A client submitted a customized service request for your gig.',
        category: 'jobs_proposals',
        link: '/student/services'
      },
      new_quote: {
        title: 'New Price Quote Received 💼',
        message: 'A provider sent you an itemized custom service quote.',
        category: 'jobs_proposals',
        link: '/client/messages'
      },
      quote_accepted: {
        title: 'Quote Accepted! Escrow Funded 💰',
        message: 'Your quote was accepted. Work safely knowing escrow funds are locked.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      quote_declined: {
        title: 'Quote Status Update',
        message: 'Your custom quote was declined by the counterparty.',
        category: 'jobs_proposals',
        link: '/student/services'
      },
      order_created: {
        title: 'New Unified Order Created 📦',
        message: 'A new order has been initiated with StudentCircle Escrow protection.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      payment_confirmed: {
        title: 'Payment Confirmed & Secured in Escrow 🔒',
        message: 'Escrow payment has been verified. Order is now active.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      order_status: {
        title: 'Order Status Update 🚚',
        message: 'Your order status has been updated. Please check the order details.',
        category: 'orders_escrow',
        link: '/student/orders'
      },
      review: {
        title: 'New Verified Review! ⭐',
        message: 'A counterparty has left feedback and a star rating on your profile.',
        category: 'social_campus',
        link: '/student/reviews'
      },
      review_received: {
        title: 'Review Added to Your Profile ⭐',
        message: 'Check out the new feedback added to your student public profile.',
        category: 'social_campus',
        link: '/student/reviews'
      },
      job_application: {
        title: 'New Job Application Submitted 📄',
        message: 'A candidate submitted a proposal for your open job posting.',
        category: 'jobs_proposals',
        link: '/client/proposals'
      },
      job_shortlist: {
        title: 'You have been Shortlisted! 🌟',
        message: 'A hiring client shortlisted your profile for their campus project.',
        category: 'jobs_proposals',
        link: '/student/jobs'
      },
      shop_request: {
        title: 'Campus Shop Order Notice 🖨️',
        message: 'A campus shop received an order request.',
        category: 'social_campus',
        link: '/campus'
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

    const template = templates[type] || templates.system;
    return this.addNotification({
      userId,
      title: template.title,
      message: template.message,
      type,
      category: template.category,
      link: template.link
    });
  }
}

export const MessagingStore = new MessagingService();
