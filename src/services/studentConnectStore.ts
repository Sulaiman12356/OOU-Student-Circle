import { 
  PublicStudentProfile, 
  ConnectionRequest, 
  StudentConnection, 
  StudentPrivacySettings, 
  StudentConnectFilter, 
  SmartRecommendations 
} from '../types/studentConnect';
import { UserProfile, ServiceItem } from '../types';
import { initialUsers, DataStore } from './dataStore';
import { CampusStore } from './campusStore';
import { db, isConfigured } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

const STORAGE_PREFIX = 'oou_student_connect_';

// Default privacy settings
export const defaultPrivacySettings: StudentPrivacySettings = {
  profileVisibility: 'public',
  showServices: true,
  allowConnectionRequests: true,
  allowDirectMessages: 'everyone',
  showEmail: false,
  showPhone: false,
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

// Rich Initial Seed Student Data for Discovery
export const extendedSeedStudents: PublicStudentProfile[] = [
  {
    id: 'student-1',
    fullName: 'Onifade Sulaiman',
    profilePhoto: initialUsers[0]?.profilePhoto,
    department: 'Computer Science',
    faculty: 'Faculty of Science',
    level: '400L',
    location: 'Main Campus (Permanent Site)',
    campusSlug: 'main-campus',
    shortBio: 'Computer Science student and full-stack web developer passionate about building digital products that empower students and solve real community problems.',
    skills: ['Web Development', 'React', 'TypeScript', 'Tailwind CSS', 'UI/UX Design', 'Node.js'],
    interests: ['Artificial Intelligence', 'Web & Mobile Development', 'Campus Entrepreneurship', 'Fintech & Cryptocurrency'],
    isVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewsCount: 28,
    completedJobsCount: 28,
    availableForWork: true,
    createdAt: '2024-01-15T10:00:00Z',
    achievements: [
      { id: 'ach-1', title: 'NACOSS OOU Tech Lead & Hackathon Winner', year: '2023', issuer: 'NACOSS OOU Chapter', description: 'Awarded 1st place in campus product development hackathon.' },
      { id: 'ach-2', title: 'Dean\'s Honours List for Academic Excellence', year: '2023', issuer: 'Faculty of Science' }
    ],
    portfolio: [
      {
        id: 'p-1',
        title: 'OOU Campus Marketplace',
        description: 'Modern student portal and service directory built with React.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
        projectUrl: 'https://github.com/ipesola/oou-studentcircle'
      }
    ],
    privacySettings: { ...defaultPrivacySettings }
  },
  {
    id: 'student-2',
    fullName: 'Adebayo Samuel',
    profilePhoto: initialUsers[1]?.profilePhoto,
    department: 'Fine and Applied Arts',
    faculty: 'Faculty of Arts',
    level: '300L',
    location: 'Mini Campus',
    campusSlug: 'mini-campus',
    shortBio: 'Graphic designer specialized in minimalist logos, professional business branding, social media fliers and print design.',
    skills: ['Logo Design', 'Brand Identity', 'Flyer Design', 'Photoshop', 'Illustrator'],
    interests: ['Graphic Design & 3D Art', 'Content Creation & Media', 'Campus Entrepreneurship'],
    isVerified: true,
    verificationStatus: 'verified',
    rating: 4.8,
    reviewsCount: 19,
    completedJobsCount: 19,
    availableForWork: true,
    createdAt: '2024-02-01T08:00:00Z',
    achievements: [
      { id: 'ach-3', title: 'Best Visual Artist Award', year: '2023', issuer: 'OOU Arts & Cultural Exhibition' }
    ],
    privacySettings: { ...defaultPrivacySettings }
  },
  {
    id: 'student-3',
    fullName: 'Maryam Adeola',
    profilePhoto: initialUsers[2]?.profilePhoto,
    department: 'Mass Communication',
    faculty: 'Faculty of Social and Management Sciences',
    level: '300L',
    location: 'Main Campus (Permanent Site)',
    campusSlug: 'main-campus',
    shortBio: 'Mass Communication student, creative writer, and social media strategist helping small businesses tell compelling brand stories.',
    skills: ['Content Writing', 'Copywriting', 'Social Media Management', 'Proofreading', 'SEO Writing'],
    interests: ['Content Creation & Media', 'Digital Marketing & Sales', 'Public Speaking & Debate'],
    isVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewsCount: 14,
    completedJobsCount: 14,
    availableForWork: true,
    createdAt: '2024-02-15T09:00:00Z',
    achievements: [
      { id: 'ach-4', title: 'OOU Press Club Editor-in-Chief', year: '2024', issuer: 'Union of Campus Journalists' }
    ],
    privacySettings: { ...defaultPrivacySettings }
  },
  {
    id: 'student-4',
    fullName: 'Praise Daniel',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    department: 'Biochemistry',
    faculty: 'Faculty of Basic Medical Sciences',
    level: '300L',
    location: 'Sagamu Campus',
    campusSlug: 'sagamu-campus',
    shortBio: 'Campus event photographer & short-form video editor producing visual content for student brands and university events.',
    skills: ['Photography', 'Video Editing', 'Premiere Pro', 'Event Coverage', 'Reels Creation'],
    interests: ['Photography & Video Production', 'Health & Fitness', 'Music & Entertainment'],
    isVerified: false,
    verificationStatus: 'pending',
    rating: 4.7,
    reviewsCount: 8,
    completedJobsCount: 8,
    availableForWork: true,
    createdAt: '2024-03-01T12:00:00Z',
    privacySettings: { ...defaultPrivacySettings }
  },
  {
    id: 'student-5',
    fullName: 'Fatima Balogun',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    department: 'Agricultural Economics',
    faculty: 'College of Agricultural Sciences',
    level: '400L',
    location: 'Ayetoro Campus',
    campusSlug: 'ayetoro-campus',
    shortBio: 'Agritech researcher, agribusiness planner, and campus tutor helping farm cooperatives and student startups structure viable farm proposals.',
    skills: ['Agribusiness Planning', 'Data Analysis', 'Excel & SPSS', 'Market Research', 'Project Management'],
    interests: ['Academic Research & Study', 'Campus Entrepreneurship', 'Leadership & Governance'],
    isVerified: true,
    verificationStatus: 'verified',
    rating: 5.0,
    reviewsCount: 11,
    completedJobsCount: 11,
    availableForWork: true,
    createdAt: '2024-03-10T14:00:00Z',
    achievements: [
      { id: 'ach-5', title: 'Ogun Agribusiness Innovation Fellow', year: '2023', issuer: 'Ogun State Agri-Hub' }
    ],
    privacySettings: { ...defaultPrivacySettings }
  },
  {
    id: 'student-6',
    fullName: 'Kolawole Emmanuel',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    department: 'Mechanical Engineering',
    faculty: 'College of Engineering and Environmental Studies',
    level: '500L',
    location: 'Ibogun Campus',
    campusSlug: 'ibogun-campus',
    shortBio: 'Engineering student specializing in CAD modeling, 3D printing preparation, technical documentation, and drone electronics.',
    skills: ['AutoCAD', 'SolidWorks', '3D Modeling', 'Robotics', 'MATLAB', 'Technical Writing'],
    interests: ['Artificial Intelligence', 'Academic Research & Study', 'Web & Mobile Development'],
    isVerified: true,
    verificationStatus: 'verified',
    rating: 4.9,
    reviewsCount: 16,
    completedJobsCount: 16,
    availableForWork: true,
    createdAt: '2024-01-28T16:00:00Z',
    achievements: [
      { id: 'ach-6', title: 'OOU Engineering Design Expo Silver Medal', year: '2023', issuer: 'Faculty of Engineering' }
    ],
    privacySettings: { ...defaultPrivacySettings }
  },
  {
    id: 'student-7',
    fullName: 'Chidinma Okafor',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    department: 'Law',
    faculty: 'Faculty of Law',
    level: '400L',
    location: 'Main Campus (Permanent Site)',
    campusSlug: 'main-campus',
    shortBio: 'Law student, university debater, and student legal advisor passionate about corporate law, contracts review, and startup IP advisory.',
    skills: ['Legal Drafting', 'Contract Review', 'Debating', 'Public Speaking', 'Research'],
    interests: ['Public Speaking & Debate', 'Leadership & Governance', 'Campus Entrepreneurship'],
    isVerified: true,
    verificationStatus: 'verified',
    rating: 5.0,
    reviewsCount: 7,
    completedJobsCount: 7,
    availableForWork: true,
    createdAt: '2024-02-20T10:00:00Z',
    achievements: [
      { id: 'ach-7', title: 'All-Nigeria Universities Debating Champion', year: '2023', issuer: 'ANUDC' }
    ],
    privacySettings: { ...defaultPrivacySettings }
  },
  {
    id: 'student-8',
    fullName: 'David Olawale',
    profilePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    department: 'Accounting',
    faculty: 'Faculty of Social and Management Sciences',
    level: '200L',
    location: 'Main Campus (Permanent Site)',
    campusSlug: 'main-campus',
    shortBio: 'Accounting enthusiast, bookkeeping consultant for campus student vendors, and financial modeling learner.',
    skills: ['Bookkeeping', 'Financial Analysis', 'QuickBooks', 'Excel Modeling', 'Tax Fundamentals'],
    interests: ['Fintech & Cryptocurrency', 'Campus Entrepreneurship', 'Academic Research & Study'],
    isVerified: false,
    verificationStatus: 'unverified',
    rating: 4.6,
    reviewsCount: 3,
    completedJobsCount: 3,
    availableForWork: true,
    createdAt: '2024-04-05T11:00:00Z',
    privacySettings: { ...defaultPrivacySettings }
  }
];

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

  private static setStored<T>(key: string, val: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
    } catch {
      // ignore
    }
  }

  /**
   * Sanitizes a student profile to ensure no private data is publicly exposed.
   * Matric number, JAMB number, and private phone/email are strictly removed.
   */
  public static sanitizeProfile(user: UserProfile, privacy?: StudentPrivacySettings): PublicStudentProfile {
    const priv = privacy || this.getPrivacySettingsSync(user.id);
    
    return {
      id: user.id,
      fullName: user.fullName,
      profilePhoto: user.profilePhoto,
      department: user.department,
      faculty: user.faculty,
      level: user.level,
      location: user.location || 'Main Campus (Permanent Site)',
      shortBio: user.shortBio,
      skills: user.skills || [],
      interests: (user as any).interests || [],
      achievements: (user as any).achievements || [],
      portfolio: user.portfolio || [],
      isVerified: user.isVerified || user.verificationStatus === 'verified',
      verificationStatus: user.verificationStatus,
      rating: user.rating || 5.0,
      reviewsCount: user.reviewsCount || 0,
      completedJobsCount: user.completedJobsCount || 0,
      availableForWork: user.availableForWork ?? true,
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
        const q = query(usersRef, where('role', '==', 'student'));
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

    // 2. Merge with extended seed students for comprehensive search experience
    const localUsers = DataStore.getUsers().filter(u => u.role === 'student');
    const mergedMap = new Map<string, PublicStudentProfile>();

    // Add extended seed students first
    extendedSeedStudents.forEach(s => mergedMap.set(s.id, s));

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
        result = result.filter(s => s.faculty?.toLowerCase() === filter.faculty.toLowerCase());
      }

      if (filter.department && filter.department !== 'all') {
        result = result.filter(s => s.department?.toLowerCase().includes(filter.department.toLowerCase()));
      }

      if (filter.level && filter.level !== 'all') {
        result = result.filter(s => s.level === filter.level);
      }

      if (filter.skill && filter.skill !== 'all') {
        result = result.filter(s => s.skills?.some(sk => sk.toLowerCase() === filter.skill.toLowerCase()));
      }

      if (filter.interest && filter.interest !== 'all') {
        result = result.filter(s => s.interests?.some(it => it.toLowerCase() === filter.interest.toLowerCase()));
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
      senderName: sender.fullName,
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
        message: `${sender.fullName} from ${sender.department || 'OOU'} wants to connect with you.`,
        link: '/student-connect/requests',
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

    const userCampus = currentUser.location?.toLowerCase() || '';
    const userDept = currentUser.department?.toLowerCase() || '';
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
    const initialReqs: ConnectionRequest[] = [
      {
        id: 'req_seed_1',
        senderId: 'student-2',
        senderName: 'Adebayo Samuel',
        senderPhoto: initialUsers[1]?.profilePhoto,
        senderDepartment: 'Fine and Applied Arts',
        senderLevel: '300L',
        senderCampus: 'Mini Campus',
        receiverId: 'student-1',
        status: 'pending',
        createdAt: '2024-05-16T10:00:00Z',
        updatedAt: '2024-05-16T10:00:00Z',
        note: 'Hey Sulaiman! Loved your campus marketplace project. Would love to collaborate on UI/brand designs.'
      }
    ];
    return this.getStored<ConnectionRequest[]>('requests', initialReqs);
  }

  private static getAllConnections(): StudentConnection[] {
    const initialConns: StudentConnection[] = [
      {
        id: 'conn_seed_1',
        user1Id: 'student-1',
        user2Id: 'student-3',
        users: ['student-1', 'student-3'],
        connectedAt: '2024-05-01T12:00:00Z'
      }
    ];
    return this.getStored<StudentConnection[]>('connections', initialConns);
  }
}
