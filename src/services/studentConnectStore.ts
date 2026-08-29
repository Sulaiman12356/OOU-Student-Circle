import { db, isConfigured } from './firebase';
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { UserProfile, StudentLevel } from '../types';
import { 
  PublicStudentProfile, 
  StudentPrivacySettings, 
  ConnectionRequest, 
  StudentConnection, 
  StudentConnectFilter 
} from '../types/studentConnect';
import { DataStore } from './dataStore';

const STORAGE_PREFIX = 'oou_student_connect_';

export type { PublicStudentProfile, ConnectionRequest, StudentConnection, StudentConnectFilter };

export interface SmartRecommendations {
  nearCampus: PublicStudentProfile[];
  similarSkills: PublicStudentProfile[];
  inDepartment: PublicStudentProfile[];
  youMayKnow: PublicStudentProfile[];
}

export const defaultPrivacySettings: StudentPrivacySettings = {
  profileVisibility: 'public',
  showEmail: false,
  showPhone: false,
  showServices: true,
  allowConnectionRequests: true,
  allowDirectMessages: 'everyone'
};

// Initial student interests for OOU students
export const popularStudentInterests = [
  'Artificial Intelligence',
  'Web & Mobile Development',
  'Graphic Design & 3D Art',
  'UI/UX Design',
  'Campus Entrepreneurship',
  'Digital Marketing & Sales',
  'Content Creation & Media',
  'Academic Research & Study',
  'Public Speaking & Debate',
  'Fintech & Cryptocurrency',
  'Photography & Video Production',
  'Music & Entertainment',
  'Health & Fitness',
  'Leadership & Governance'
];

// Public Student Profiles - Empty by default, populated strictly from real registered accounts
export const extendedSeedStudents: PublicStudentProfile[] = [];

export class StudentConnectStore {
  // Local storage helpers
  private static getStored<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(STORAGE_PREFIX + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private static setStored<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  }

  /**
   * Helper to format UserProfile to PublicStudentProfile while respecting privacy
   */
  public static sanitizeProfile(user: UserProfile): PublicStudentProfile {
    const priv: StudentPrivacySettings = this.getPrivacySettingsSync(user.id);
    
    // Map campus string to slug if needed
    let campusSlug = 'main-campus';
    const loc = (user.location || 'Main Campus').toLowerCase();
    if (loc.includes('mini')) campusSlug = 'mini-campus';
    else if (loc.includes('sagamu')) campusSlug = 'sagamu-campus';
    else if (loc.includes('ayetoro')) campusSlug = 'ayetoro-campus';
    else if (loc.includes('ibogun')) campusSlug = 'ibogun-campus';

    return {
      id: user.id,
      fullName: user.fullName || 'Student',
      profilePhoto: user.profilePhoto,
      coverPhoto: user.coverPhoto,
      department: user.department,
      faculty: user.faculty,
      level: user.level as StudentLevel,
      location: user.location || 'Main Campus (Permanent Site)',
      campusSlug,
      shortBio: user.shortBio,
      skills: user.skills || [],
      interests: user.interests || [],
      isVerified: user.isVerified || false,
      verificationStatus: user.verificationStatus || (user.isVerified ? 'verified' : 'unverified'),
      rating: user.rating || 0,
      reviewsCount: user.reviewsCount || 0,
      completedJobsCount: user.completedJobsCount || 0,
      availableForWork: user.availableForWork ?? true,
      achievements: user.achievements || [],
      portfolio: user.portfolio || [],
      createdAt: user.createdAt || new Date().toISOString(),
      privacySettings: priv,
      // Only include contact if explicitly made public by user
      publicEmail: priv.showEmail ? user.email : undefined,
      publicPhone: priv.showPhone ? user.phoneNumber : undefined
    };
  }

  /**
   * Get all public student profiles with flexible search & filtering
   */
  public static async getStudents(filter?: Partial<StudentConnectFilter>): Promise<PublicStudentProfile[]> {
    let students: PublicStudentProfile[] = [];

    // 1. Fetch from Firestore users collection
    if (db && isConfigured) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', 'in', ['student', 'STUDENT']));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const dbStudents = snap.docs.map(doc => {
            const data = doc.data() as UserProfile;
            return this.sanitizeProfile({ ...data, id: doc.id });
          });
          students = dbStudents;
        }
      } catch (err) {
        console.warn('Firestore getStudents query notice (using local directory):', err);
      }
    }

    // 2. Merge with real local users from DataStore
    const localUsers = DataStore.getUsers().filter(u => u.role === 'student' || u.role === 'STUDENT');
    const mergedMap = new Map<string, PublicStudentProfile>();

    // Add/overwrite from DataStore
    localUsers.forEach(u => {
      const sanitized = this.sanitizeProfile(u);
      mergedMap.set(u.id, sanitized);
    });

    // Add/overwrite from Firestore results
    students.forEach(s => mergedMap.set(s.id, s));

    let result = Array.from(mergedMap.values());

    // 3. Filter out students who set visibility to 'hidden'
    result = result.filter(s => s.privacySettings?.profileVisibility !== 'hidden');

    // 4. Apply Filters
    if (filter) {
      if (filter.search && filter.search.trim()) {
        const queryStr = filter.search.toLowerCase().trim();
        result = result.filter(s => {
          const nameMatch = s.fullName.toLowerCase().includes(queryStr);
          const deptMatch = s.department?.toLowerCase().includes(queryStr);
          const facultyMatch = s.faculty?.toLowerCase().includes(queryStr);
          const bioMatch = s.shortBio?.toLowerCase().includes(queryStr);
          const campusMatch = s.location?.toLowerCase().includes(queryStr);
          const skillMatch = s.skills?.some(sk => sk.toLowerCase().includes(queryStr));
          const interestMatch = s.interests?.some(it => it.toLowerCase().includes(queryStr));
          return nameMatch || deptMatch || facultyMatch || bioMatch || campusMatch || skillMatch || interestMatch;
        });
      }

      if (filter.campus && filter.campus !== 'all') {
        const cLower = filter.campus.toLowerCase();
        result = result.filter(s => {
          const loc = s.location.toLowerCase();
          return loc.includes(cLower) || (s.campusSlug && s.campusSlug.includes(cLower));
        });
      }

      if (filter.faculty && filter.faculty !== 'all') {
        result = result.filter(s => s.faculty?.toLowerCase() === filter.faculty!.toLowerCase());
      }

      if (filter.department && filter.department !== 'all') {
        result = result.filter(s => s.department?.toLowerCase().includes(filter.department!.toLowerCase()));
      }

      if (filter.level && filter.level !== 'all') {
        result = result.filter(s => s.level === filter.level);
      }

      if (filter.skill && filter.skill !== 'all') {
        result = result.filter(s => s.skills?.some(sk => sk.toLowerCase() === filter.skill!.toLowerCase()));
      }

      if (filter.interest && filter.interest !== 'all') {
        result = result.filter(s => s.interests?.some(it => it.toLowerCase() === filter.interest!.toLowerCase()));
      }

      if (filter.onlyVerified) {
        result = result.filter(s => s.isVerified);
      }

      if (filter.availableForWork) {
        result = result.filter(s => s.availableForWork);
      }
    }

    return result;
  }

  /**
   * Get single student profile by ID with full public fields and linked services
   */
  public static async getStudentById(studentId: string): Promise<PublicStudentProfile | null> {
    const all = await this.getStudents();
    const student = all.find(s => s.id === studentId);
    if (!student) return null;

    // Load services offered by this student if privacy allows
    if (student.privacySettings?.showServices !== false) {
      const allServices = DataStore.getServices();
      student.services = allServices.filter(srv => srv.studentId === studentId && srv.status === 'published');
    }

    return student;
  }

  /**
   * Check connection status between current user and target student
   */
  public static async getConnectionStatus(
    currentUserId: string,
    targetUserId: string
  ): Promise<'self' | 'connected' | 'pending_sent' | 'pending_received' | 'not_connected'> {
    if (!currentUserId || !targetUserId) return 'not_connected';
    if (currentUserId === targetUserId) return 'self';

    // 1. Check active accepted connections
    const connections = this.getAllConnections();
    const isConnected = connections.some(c => 
      (c.user1Id === currentUserId && c.user2Id === targetUserId) ||
      (c.user1Id === targetUserId && c.user2Id === currentUserId) ||
      (c.users && c.users.includes(currentUserId) && c.users.includes(targetUserId))
    );
    if (isConnected) return 'connected';

    // 2. Check pending requests
    const requests = this.getAllRequests();
    const sentReq = requests.find(r => r.senderId === currentUserId && r.receiverId === targetUserId && r.status === 'pending');
    if (sentReq) return 'pending_sent';

    const receivedReq = requests.find(r => r.senderId === targetUserId && r.receiverId === currentUserId && r.status === 'pending');
    if (receivedReq) return 'pending_received';

    return 'not_connected';
  }

  /**
   * Send a new Connection Request
   */
  public static async sendConnectionRequest(
    sender: UserProfile,
    targetUserId: string,
    note?: string
  ): Promise<{ success: boolean; message: string; requestId?: string }> {
    if (!sender?.id || !targetUserId) {
      return { success: false, message: 'Invalid sender or receiver identification.' };
    }

    if (sender.id === targetUserId) {
      return { success: false, message: 'You cannot send a connection request to yourself.' };
    }

    // Check target's privacy settings
    const targetPrivacy = await this.getPrivacySettings(targetUserId);
    if (!targetPrivacy.allowConnectionRequests) {
      return { success: false, message: 'This student is not currently accepting new connection requests.' };
    }

    // Check existing connection
    const currentStatus = await this.getConnectionStatus(sender.id, targetUserId);
    if (currentStatus === 'connected') {
      return { success: false, message: 'You are already connected with this student.' };
    }
    if (currentStatus === 'pending_sent') {
      return { success: false, message: 'Connection request is already pending.' };
    }
    if (currentStatus === 'pending_received') {
      // Auto-accept if recipient was already sending
      const requests = this.getAllRequests();
      const existing = requests.find(r => r.senderId === targetUserId && r.receiverId === sender.id && r.status === 'pending');
      if (existing) {
        return this.respondToRequest(existing.id, sender.id, 'accept');
      }
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newRequest: ConnectionRequest = {
      id: requestId,
      senderId: sender.id,
      senderName: sender.fullName || 'Student',
      senderPhoto: sender.profilePhoto,
      senderDepartment: sender.department || 'Student',
      senderLevel: sender.level || '',
      senderCampus: sender.location || 'Main Campus',
      receiverId: targetUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      note: note?.trim() || undefined
    };

    // Save in LocalStore
    const requests = this.getAllRequests();
    requests.push(newRequest);
    this.setStored('requests', requests);

    // Save in Firestore if connected
    if (db && isConfigured) {
      try {
        await setDoc(doc(db, 'connectionRequests', requestId), newRequest);
      } catch (err) {
        console.warn('Firestore request save notice:', err);
      }
    }

    // Create In-App Notification for target student
    try {
      DataStore.addNotification({
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId: targetUserId,
        type: 'system',
        title: 'New Connection Request',
        message: `${sender.fullName || 'A student'} from ${sender.department || 'OOU'} wants to connect with you.`,
        link: '/student-connect?tab=requests',
        read: false,
        createdAt: new Date().toISOString()
      });
    } catch {
      // non-blocking
    }

    return { success: true, message: 'Connection request sent successfully.', requestId };
  }

  /**
   * Accept or decline a connection request
   */
  public static async respondToRequest(
    requestId: string,
    currentUserId: string,
    action: 'accept' | 'decline'
  ): Promise<{ success: boolean; message: string }> {
    const requests = this.getAllRequests();
    const reqIndex = requests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) {
      return { success: false, message: 'Connection request not found.' };
    }

    const targetReq = requests[reqIndex];
    if (targetReq.receiverId !== currentUserId) {
      return { success: false, message: 'You are not authorized to respond to this request.' };
    }

    targetReq.status = action === 'accept' ? 'accepted' : 'declined';
    targetReq.updatedAt = new Date().toISOString();
    requests[reqIndex] = targetReq;
    this.setStored('requests', requests);

    // Update in Firestore
    if (db && isConfigured) {
      try {
        await updateDoc(doc(db, 'connectionRequests', requestId), {
          status: targetReq.status,
          updatedAt: targetReq.updatedAt
        });
      } catch (err) {
        console.warn('Firestore update request notice:', err);
      }
    }

    if (action === 'accept') {
      // Create established connection
      const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newConnection: StudentConnection = {
        id: connectionId,
        user1Id: targetReq.senderId,
        user2Id: currentUserId,
        users: [targetReq.senderId, currentUserId],
        connectedAt: new Date().toISOString()
      };

      const connections = this.getAllConnections();
      connections.push(newConnection);
      this.setStored('connections', connections);

      if (db && isConfigured) {
        try {
          await setDoc(doc(db, 'studentConnections', connectionId), newConnection);
        } catch (err) {
          console.warn('Firestore connection save notice:', err);
        }
      }

      // Notify the original sender
      try {
        const currentUserProfile = DataStore.getUserById(currentUserId);
        DataStore.addNotification({
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: targetReq.senderId,
          type: 'system',
          title: 'Connection Accepted! 🎉',
          message: `${currentUserProfile?.fullName || 'A student'} accepted your connection request. You can now collaborate and message.`,
          link: `/student-connect`,
          read: false,
          createdAt: new Date().toISOString()
        });
      } catch {
        // non-blocking
      }

      return { success: true, message: 'Connection request accepted. You are now connected!' };
    }

    return { success: true, message: 'Connection request declined.' };
  }

  /**
   * Cancel an outgoing pending request
   */
  public static async cancelRequest(requestId: string, currentUserId: string): Promise<{ success: boolean; message: string }> {
    const requests = this.getAllRequests();
    const req = requests.find(r => r.id === requestId);
    if (!req || req.senderId !== currentUserId) {
      return { success: false, message: 'Request not found or unauthorized.' };
    }

    const updated = requests.filter(r => r.id !== requestId);
    this.setStored('requests', updated);

    if (db && isConfigured) {
      try {
        await deleteDoc(doc(db, 'connectionRequests', requestId));
      } catch (err) {
        console.warn('Firestore delete request notice:', err);
      }
    }

    return { success: true, message: 'Connection request cancelled.' };
  }

  /**
   * Remove an existing connection
   */
  public static async removeConnection(
    currentUserId: string,
    targetUserId: string
  ): Promise<{ success: boolean; message: string }> {
    const connections = this.getAllConnections();
    const conn = connections.find(c => 
      (c.user1Id === currentUserId && c.user2Id === targetUserId) ||
      (c.user1Id === targetUserId && c.user2Id === currentUserId) ||
      (c.users && c.users.includes(currentUserId) && c.users.includes(targetUserId))
    );

    if (!conn) {
      return { success: false, message: 'Connection not found.' };
    }

    const remaining = connections.filter(c => c.id !== conn.id);
    this.setStored('connections', remaining);

    if (db && isConfigured) {
      try {
        await deleteDoc(doc(db, 'studentConnections', conn.id));
      } catch (err) {
        console.warn('Firestore remove connection notice:', err);
      }
    }

    return { success: true, message: 'Connection removed.' };
  }

  /**
   * Get all incoming and outgoing requests for a user
   */
  public static async getUserRequests(userId: string): Promise<{ incoming: ConnectionRequest[]; outgoing: ConnectionRequest[] }> {
    const requests = this.getAllRequests();
    const incoming = requests.filter(r => r.receiverId === userId && r.status === 'pending');
    const outgoing = requests.filter(r => r.senderId === userId && r.status === 'pending');
    return { incoming, outgoing };
  }

  /**
   * Get accepted connections for a user
   */
  public static async getMyConnections(userId: string): Promise<PublicStudentProfile[]> {
    if (!userId) return [];
    const connections = this.getAllConnections();
    const myConns = connections.filter(c => 
      c.user1Id === userId || c.user2Id === userId || (c.users && c.users.includes(userId))
    );

    const partnerIds = myConns.map(c => c.user1Id === userId ? c.user2Id : c.user1Id);
    const allStudents = await this.getStudents();
    
    return allStudents.filter(s => partnerIds.includes(s.id));
  }

  /**
   * Smart Recommendations Algorithm (non-sensitive grouping)
   */
  public static async getSmartRecommendations(currentUser: UserProfile | null): Promise<SmartRecommendations> {
    const allStudents = await this.getStudents();
    
    // Filter out self
    const candidates = currentUser 
      ? allStudents.filter(s => s.id !== currentUser.id)
      : allStudents;

    // Filter out already connected
    const existingConnections = currentUser ? await this.getMyConnections(currentUser.id) : [];
    const connectedIds = new Set(existingConnections.map(c => c.id));
    const unconstrained = candidates.filter(s => !connectedIds.has(s.id));

    if (!currentUser) {
      return {
        nearCampus: unconstrained.slice(0, 4),
        similarSkills: unconstrained.slice(2, 6),
        inDepartment: unconstrained.slice(1, 5),
        youMayKnow: unconstrained.slice(0, 6)
      };
    }

    const userCampus = (currentUser.location || '').toLowerCase();
    const userDept = (currentUser.department || '').toLowerCase();
    const userSkills = new Set((currentUser.skills || []).map(s => s.toLowerCase()));

    // 1. Same/Near Campus
    const nearCampus = unconstrained.filter(s => {
      const sLoc = s.location?.toLowerCase() || '';
      return userCampus && (sLoc.includes(userCampus) || userCampus.includes(sLoc));
    }).slice(0, 6);

    // 2. Same Department
    const inDepartment = unconstrained.filter(s => {
      const sDept = s.department?.toLowerCase() || '';
      return userDept && sDept === userDept;
    }).slice(0, 6);

    // 3. Similar Skills
    const similarSkills = unconstrained.filter(s => {
      if (!s.skills || s.skills.length === 0 || userSkills.size === 0) return false;
      return s.skills.some(sk => userSkills.has(sk.toLowerCase()));
    }).slice(0, 6);

    // 4. People You May Know (Weighted score: department + campus + skills + faculty)
    const scored = unconstrained.map(s => {
      let score = 0;
      if (userDept && s.department?.toLowerCase() === userDept) score += 3;
      if (userCampus && s.location?.toLowerCase().includes(userCampus)) score += 2;
      if (currentUser.level && s.level === currentUser.level) score += 1.5;
      if (currentUser.faculty && s.faculty?.toLowerCase() === currentUser.faculty.toLowerCase()) score += 1;
      if (s.skills && s.skills.some(sk => userSkills.has(sk.toLowerCase()))) score += 2;
      return { student: s, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const youMayKnow = scored.map(item => item.student).slice(0, 8);

    return {
      nearCampus,
      similarSkills,
      inDepartment,
      youMayKnow
    };
  }

  /**
   * Get User Privacy Settings
   */
  public static async getPrivacySettings(userId: string): Promise<StudentPrivacySettings> {
    return this.getPrivacySettingsSync(userId);
  }

  public static getPrivacySettingsSync(userId: string): StudentPrivacySettings {
    const all = this.getStored<Record<string, StudentPrivacySettings>>('privacy_settings', {});
    return all[userId] || { ...defaultPrivacySettings };
  }

  public static async updatePrivacySettings(userId: string, settings: Partial<StudentPrivacySettings>): Promise<void> {
    const all = this.getStored<Record<string, StudentPrivacySettings>>('privacy_settings', {});
    const current = all[userId] || { ...defaultPrivacySettings };
    all[userId] = { ...current, ...settings };
    this.setStored('privacy_settings', all);

    if (db && isConfigured) {
      try {
        await setDoc(doc(db, 'userPrivacySettings', userId), all[userId], { merge: true });
      } catch (err) {
        console.warn('Firestore update privacy notice:', err);
      }
    }
  }

  // Internal storage helpers
  private static getAllRequests(): ConnectionRequest[] {
    return this.getStored<ConnectionRequest[]>('requests', []);
  }

  private static getAllConnections(): StudentConnection[] {
    return this.getStored<StudentConnection[]>('connections', []);
  }
}
