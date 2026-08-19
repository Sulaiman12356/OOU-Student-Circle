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
    if (!db) return () => {};
    try {
      const colRef = collection(db, 'conversations');
      const q = query(colRef, where('participants', 'array-contains', userId));
      return onSnapshot(q, (snapshot) => {
        const convos = snapshot.docs.map(d => d.data() as Conversation);
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
    if (!db) return () => {};
    try {
      const colRef = collection(db, `conversations/${conversationId}/messages`);
      const q = query(colRef, orderBy('timestamp', 'asc'));
      return onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(d => d.data() as ChatMessage);
        callback(msgs);
      }, (err) => {
        console.warn('Messages subscription notice:', err);
      });
    } catch (err) {
      console.warn('subscribeToMessages error:', err);
      return () => {};
    }
  }

  static async sendMessage(conversationId: string, message: ChatMessage): Promise<void> {
    if (!db) return;
    try {
      const msgDocRef = doc(db, `conversations/${conversationId}/messages`, message.id);
      await setDoc(msgDocRef, message);
      
      const convoDocRef = doc(db, 'conversations', conversationId);
      await updateDoc(convoDocRef, {
        lastMessage: message.text,
        lastMessageTimestamp: message.timestamp
      });
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

  // REVIEWS
  static async getReviews(): Promise<ReviewItem[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'reviews');
      const snap = await getDocs(colRef);
      return snap.docs.map(d => d.data() as ReviewItem);
    } catch (err) {
      console.warn('getReviews notice:', err);
      return [];
    }
  }

  static async saveReview(review: ReviewItem): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'reviews', review.id);
      await setDoc(docRef, review);
    } catch (err) {
      console.warn('saveReview notice:', err);
    }
  }

  // NOTIFICATIONS
  static async getNotifications(userId: string): Promise<AppNotification[]> {
    if (!db) return [];
    try {
      const colRef = collection(db, 'notifications');
      const q = query(colRef, where('userId', '==', userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => d.data() as AppNotification);
    } catch (err) {
      console.warn('getNotifications notice:', err);
      return [];
    }
  }

  static async saveNotification(notification: AppNotification): Promise<void> {
    if (!db) return;
    try {
      const docRef = doc(db, 'notifications', notification.id);
      await setDoc(docRef, notification);
    } catch (err) {
      console.warn('saveNotification notice:', err);
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
