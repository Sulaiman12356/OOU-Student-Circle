import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { 
  UserProfile, 
  ServiceItem, 
  JobPost, 
  JobProposal, 
  ChatMessage, 
  Conversation, 
  ReviewItem, 
  AppNotification, 
  WalletTransaction, 
  VerificationRequest, 
  PlatformReport, 
  AdminLog, 
  PlatformSettings 
} from '../types';

export class FirestoreService {
  // USER PROFILES
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, 'users', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.warn('Firestore getUserProfile notice:', err);
      return null;
    }
  }

  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    if (!db || !email) return null;
    try {
      const cleanEmail = email.trim().toLowerCase();
      const colRef = collection(db, 'users');
      const q = query(colRef, where('email', '==', cleanEmail), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as UserProfile;
      }
      return null;
    } catch (err) {
      console.warn('Firestore getUserByEmail notice:', err);
      return null;
    }
  }

  /**
   * Comprehensive duplicate account check across Firestore
   */
  static async checkDuplicateAccount(params: {
    email?: string;
    phoneNumber?: string;
    matricNumber?: string;
    jambRegNumber?: string;
    shopCode?: string;
    excludeUserId?: string;
  }): Promise<{ isDuplicate: boolean; field?: string; message?: string }> {
    if (!db) return { isDuplicate: false };

    try {
      const colRef = collection(db, 'users');

      // 1. Email check
      if (params.email) {
        const cleanEmail = params.email.trim().toLowerCase();
        const qEmail = query(colRef, where('email', '==', cleanEmail), limit(2));
        const snapEmail = await getDocs(qEmail);
        const dupEmail = snapEmail.docs.find(d => d.id !== params.excludeUserId);
        if (dupEmail) {
          return {
            isDuplicate: true,
            field: 'email',
            message: 'An account with this email address already exists. Please log in instead.'
          };
        }
      }

      // 2. Phone number check
      if (params.phoneNumber) {
        const cleanPhone = params.phoneNumber.trim().replace(/[^0-9+]/g, '');
        if (cleanPhone.length >= 10) {
          const qPhone = query(colRef, where('phoneNumber', '==', cleanPhone), limit(2));
          const snapPhone = await getDocs(qPhone);
          const dupPhone = snapPhone.docs.find(d => d.id !== params.excludeUserId);
          if (dupPhone) {
            return {
              isDuplicate: true,
              field: 'phoneNumber',
              message: 'This phone number is already associated with an existing account.'
            };
          }
        }
      }

      // 3. Matric Number check (for students)
      if (params.matricNumber) {
        const cleanMatric = params.matricNumber.trim().toUpperCase();
        if (cleanMatric.length >= 4) {
          const qMatric = query(colRef, where('matricNumber', '==', cleanMatric), limit(2));
          const snapMatric = await getDocs(qMatric);
          const dupMatric = snapMatric.docs.find(d => d.id !== params.excludeUserId);
          if (dupMatric) {
            return {
              isDuplicate: true,
              field: 'matricNumber',
              message: `Matriculation number ${cleanMatric} is already registered on StudentCircle.`
            };
          }
        }
      }

      // 4. JAMB Registration Number check (for aspirants)
      if (params.jambRegNumber) {
        const cleanJamb = params.jambRegNumber.trim().toUpperCase();
        if (cleanJamb.length >= 6) {
          const qJamb = query(colRef, where('jambRegNumber', '==', cleanJamb), limit(2));
          const snapJamb = await getDocs(qJamb);
          const dupJamb = snapJamb.docs.find(d => d.id !== params.excludeUserId);
          if (dupJamb) {
            return {
              isDuplicate: true,
              field: 'jambRegNumber',
              message: `JAMB Registration number ${cleanJamb} is already linked to an existing aspirant account.`
            };
          }
        }
      }

      // 5. Shop Code check (for campus shop owners)
      if (params.shopCode) {
        const cleanShopCode = params.shopCode.trim().toUpperCase();
        if (cleanShopCode.length >= 2) {
          const qShop = query(colRef, where('shopCode', '==', cleanShopCode), limit(2));
          const snapShop = await getDocs(qShop);
          const dupShop = snapShop.docs.find(d => d.id !== params.excludeUserId);
          if (dupShop) {
            return {
              isDuplicate: true,
              field: 'shopCode',
              message: `Shop Code ${cleanShopCode} is already registered to another campus shop.`
            };
          }
        }
      }

      return { isDuplicate: false };
    } catch (err: any) {
      console.warn('Duplicate check warning:', err.message);
      return { isDuplicate: false };
    }
  }

  static async saveUserProfile(user: UserProfile): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'users', user.id);
      await setDoc(docRef, {
        ...user,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore saveUserProfile notice:', err);
    }
  }

  static async getAllUsers(): Promise<UserProfile[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'users');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as UserProfile);
    } catch (err) {
      console.warn('Firestore getAllUsers notice:', err);
      return [];
    }
  }

  // SERVICES
  static async getServices(): Promise<ServiceItem[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'services');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as ServiceItem);
    } catch (err) {
      console.warn('Firestore getServices notice:', err);
      return [];
    }
  }

  static async saveService(service: ServiceItem): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'services', service.id);
      await setDoc(docRef, service, { merge: true });
    } catch (err) {
      console.warn('Firestore saveService notice:', err);
    }
  }

  static async deleteService(serviceId: string): Promise<void> {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'services', serviceId));
    } catch (err) {
      console.warn('Firestore deleteService notice:', err);
    }
  }

  // JOBS
  static async getJobs(): Promise<JobPost[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'jobs');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as JobPost);
    } catch (err) {
      console.warn('Firestore getJobs notice:', err);
      return [];
    }
  }

  static async saveJob(job: JobPost): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'jobs', job.id);
      await setDoc(docRef, job, { merge: true });
    } catch (err) {
      console.warn('Firestore saveJob notice:', err);
    }
  }

  static async deleteJob(jobId: string): Promise<void> {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
    } catch (err) {
      console.warn('Firestore deleteJob notice:', err);
    }
  }

  // PROPOSALS
  static async getProposals(): Promise<JobProposal[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'proposals');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as JobProposal);
    } catch (err) {
      console.warn('Firestore getProposals notice:', err);
      return [];
    }
  }

  static async saveProposal(proposal: JobProposal): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'proposals', proposal.id);
      await setDoc(docRef, proposal, { merge: true });
    } catch (err) {
      console.warn('Firestore saveProposal notice:', err);
    }
  }

  // CONVERSATIONS & MESSAGES
  static subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void) {
    if (!db || !userId) return () => {};
    try {
      const colRef = collection(db, 'conversations');
      const q = query(colRef, where('participants', 'array-contains', userId));
      return onSnapshot(q, (snapshot) => {
        const convos = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as Conversation));
        // Sort in memory by lastMessageTimestamp descending
        convos.sort((a, b) => new Date(b.lastMessageTimestamp || b.updatedAt || 0).getTime() - new Date(a.lastMessageTimestamp || a.updatedAt || 0).getTime());
        callback(convos);
      }, (err) => {
        console.warn('Conversations subscription notice:', err);
      });
    } catch (err) {
      console.warn('subscribeToConversations error:', err);
      return () => {};
    }
  }

  static subscribeToMessages(conversationId: string, callback: (messages: ChatMessage[]) => void) {
    if (!db || !conversationId) return () => {};
    try {
      const colRef = collection(db, `conversations/${conversationId}/messages`);
      const q = query(colRef, orderBy('timestamp', 'asc'));
      return onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as ChatMessage));
        callback(msgs);
      }, (err) => {
        console.warn('Messages subscription notice:', err);
      });
    } catch (err) {
      console.warn('subscribeToMessages error:', err);
      return () => {};
    }
  }

  static async sendMessage(conversationId: string, message: ChatMessage, otherParticipantIds: string[] = []): Promise<void> {
    if (!db) return;
    try {
      const msgDocRef = doc(db, `conversations/${conversationId}/messages`, message.id);
      await setDoc(msgDocRef, message);
      
      const convoDocRef = doc(db, 'conversations', conversationId);
      const updatePayload: Record<string, any> = {
        lastMessage: message.text || (message.images?.length ? 'Sent an image' : 'Sent an attachment'),
        lastMessageTimestamp: message.timestamp,
        lastMessageSenderId: message.senderId,
        updatedAt: message.timestamp
      };

      // Increment unread count for other participants
      otherParticipantIds.forEach(pId => {
        if (pId !== message.senderId) {
          updatePayload[`unreadCounts.${pId}`] = (updatePayload[`unreadCounts.${pId}`] || 0) + 1;
        }
      });

      await setDoc(convoDocRef, updatePayload, { merge: true });
    } catch (err) {
      console.warn('sendMessage notice:', err);
    }
  }

  static async saveConversation(convo: Conversation): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'conversations', convo.id);
      await setDoc(docRef, convo, { merge: true });
    } catch (err) {
      console.warn('saveConversation notice:', err);
    }
  }

  static async markConversationAsRead(conversationId: string, userId: string): Promise<void> {
    if (!db || !conversationId || !userId) return;
    try {
      const convoDocRef = doc(db, 'conversations', conversationId);
      await setDoc(convoDocRef, {
        unreadCounts: {
          [userId]: 0
        }
      }, { merge: true });

      // Mark unread messages in subcollection
      const colRef = collection(db, `conversations/${conversationId}/messages`);
      const q = query(colRef, where('read', '==', false));
      const snap = await getDocs(q);
      const updates = snap.docs
        .filter(d => d.data().senderId !== userId)
        .map(d => updateDoc(doc(db, `conversations/${conversationId}/messages`, d.id), { read: true }));
      await Promise.all(updates);
    } catch (err) {
      console.warn('markConversationAsRead notice:', err);
    }
  }

  // NOTIFICATIONS
  static subscribeToNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
    if (!db || !userId) return () => {};
    try {
      const colRef = collection(db, 'notifications');
      const q = query(colRef, where('userId', '==', userId));
      return onSnapshot(q, (snapshot) => {
        const notifs = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        } as AppNotification));
        notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(notifs);
      }, (err) => {
        console.warn('Notifications subscription notice:', err);
      });
    } catch (err) {
      console.warn('subscribeToNotifications error:', err);
      return () => {};
    }
  }

  static async getNotifications(userId: string): Promise<AppNotification[]> {
    if (!db || !userId) return [];
    try {
      const colRef = collection(db, 'notifications');
      const q = query(colRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      const notifs = snap.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as AppNotification));
      notifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return notifs;
    } catch (err) {
      console.warn('getNotifications notice:', err);
      return [];
    }
  }

  static async saveNotification(notification: AppNotification): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'notifications', notification.id);
      await setDoc(docRef, notification, { merge: true });
    } catch (err) {
      console.warn('saveNotification notice:', err);
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    if (!db || !notificationId) return;
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { read: true });
    } catch (err) {
      console.warn('markNotificationAsRead notice:', err);
    }
  }

  static async markAllNotificationsAsRead(userId: string): Promise<void> {
    if (!db || !userId) return;
    try {
      const colRef = collection(db, 'notifications');
      const q = query(colRef, where('userId', '==', userId), where('read', '==', false));
      const snap = await getDocs(q);
      const updates = snap.docs.map(d => updateDoc(doc(db, 'notifications', d.id), { read: true }));
      await Promise.all(updates);
    } catch (err) {
      console.warn('markAllNotificationsAsRead notice:', err);
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    if (!db || !notificationId) return;
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (err) {
      console.warn('deleteNotification notice:', err);
    }
  }

  // VERIFICATION REQUESTS
  static async getVerificationRequests(): Promise<VerificationRequest[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'verificationRequests');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as VerificationRequest);
    } catch (err) {
      console.warn('getVerificationRequests notice:', err);
      return [];
    }
  }

  static async saveVerificationRequest(req: VerificationRequest): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'verificationRequests', req.id);
      await setDoc(docRef, req, { merge: true });
    } catch (err) {
      console.warn('saveVerificationRequest notice:', err);
    }
  }

  // TRANSACTIONS
  static async getTransactions(): Promise<WalletTransaction[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'transactions');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as WalletTransaction);
    } catch (err) {
      console.warn('getTransactions notice:', err);
      return [];
    }
  }

  static async saveTransaction(tx: WalletTransaction): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'transactions', tx.id);
      await setDoc(docRef, tx, { merge: true });
    } catch (err) {
      console.warn('saveTransaction notice:', err);
    }
  }

  // PLATFORM SETTINGS & ADMIN LOGS
  static async getPlatformSettings(): Promise<PlatformSettings | null> {
    if (!db) return null;
    try {
      const docRef = doc(db, 'platformSettings', 'global');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return snap.data() as PlatformSettings;
      }
      return null;
    } catch (err) {
      console.warn('getPlatformSettings notice:', err);
      return null;
    }
  }

  static async savePlatformSettings(settings: PlatformSettings): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'platformSettings', 'global');
      await setDoc(docRef, settings, { merge: true });
    } catch (err) {
      console.warn('savePlatformSettings notice:', err);
    }
  }

  static async logAdminAction(log: AdminLog): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'adminLogs', log.id);
      await setDoc(docRef, log);
    } catch (err) {
      console.warn('logAdminAction notice:', err);
    }
  }

  static async getAdminLogs(): Promise<AdminLog[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'adminLogs');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as AdminLog);
    } catch (err) {
      console.warn('getAdminLogs notice:', err);
      return [];
    }
  }
}
