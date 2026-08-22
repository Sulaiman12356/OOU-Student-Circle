import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  AdminProfile, 
  AdminRole, 
  AdminStatus, 
  AdminPermission, 
  AdminActivityLog, 
  ALL_ADMIN_PERMISSIONS, 
  SUPER_ADMIN_EMAIL 
} from '../types/admin';
import { DataStore } from './dataStore';
import { MarketplaceStore } from './marketplaceStore';
import { CampusStore } from './campusStore';
import { OpportunityStore } from './opportunityStore';
import { TransactionEngineStore } from './transactionEngineStore';
import { TrustSafetyStore } from './trustSafetyStore';

export interface PlatformLiveStats {
  totalUsers: number;
  activeUsers: number;
  studentProfessionals: number;
  vendors: number;
  campusShops: number;
  services: number;
  products: number;
  jobs: number;
  orders: number;
  completedTransactions: number;
  pendingVerification: number;
  reports: number;
  disputes: number;
}

export class AdminService {
  // 1. GET ADMIN PROFILE
  static async getAdminProfile(uid: string): Promise<AdminProfile | null> {
    if (!db) {
      // Fallback local memory for offline/demo if DB unavailable
      const stored = localStorage.getItem(`oou_admin_profile_${uid}`);
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const docRef = doc(db, 'admins', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as AdminProfile;
        localStorage.setItem(`oou_admin_profile_${uid}`, JSON.stringify(data));
        return data;
      }
      return null;
    } catch (err) {
      console.warn('AdminService.getAdminProfile notice:', err);
      const stored = localStorage.getItem(`oou_admin_profile_${uid}`);
      return stored ? JSON.parse(stored) : null;
    }
  }

  // 2. BOOTSTRAP SUPER ADMIN
  static async bootstrapSuperAdmin(user: { uid: string; email: string; name?: string }): Promise<AdminProfile> {
    const isSuperAdminEmail = user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    const allPerms: AdminPermission[] = ALL_ADMIN_PERMISSIONS.map(p => p.key);

    const adminProfile: AdminProfile = {
      uid: user.uid,
      name: user.name || (isSuperAdminEmail ? 'Sulaiman Ipesola (Super Admin)' : 'OOU Administrator'),
      email: user.email.toLowerCase(),
      role: isSuperAdminEmail ? 'super_admin' : 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      createdBy: 'system_bootstrap',
      permissions: allPerms,
      lastActivityAt: new Date().toISOString(),
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      department: 'Platform Governance'
    };

    if (db) {
      try {
        const docRef = doc(db, 'admins', user.uid);
        await setDoc(docRef, adminProfile, { merge: true });
        
        // Also update users collection role
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { role: 'admin', updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn('AdminService.bootstrapSuperAdmin write notice:', err);
      }
    }

    // Save locally
    localStorage.setItem(`oou_admin_profile_${user.uid}`, JSON.stringify(adminProfile));

    // Record audit log
    await this.logActivity({
      adminId: user.uid,
      adminEmail: user.email,
      action: 'SYSTEM_BOOTSTRAP_SUPER_ADMIN',
      targetType: 'admin',
      targetId: user.uid,
      description: `Super Administrator initialized via secure bootstrap for ${user.email}`
    });

    return adminProfile;
  }

  // 3. CREATE NEW ADMINISTRATOR (Super Admin only)
  static async createAdministrator(
    creatorAdmin: AdminProfile,
    data: {
      uid: string;
      name: string;
      email: string;
      role: AdminRole;
      permissions: AdminPermission[];
      department?: string;
    }
  ): Promise<AdminProfile> {
    if (creatorAdmin.role !== 'super_admin') {
      throw new Error('Only the Super Administrator can provision new administrator accounts.');
    }

    const newAdmin: AdminProfile = {
      uid: data.uid,
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Never',
      createdBy: creatorAdmin.uid,
      permissions: data.permissions,
      lastActivityAt: new Date().toISOString(),
      department: data.department || 'Campus Moderation'
    };

    if (db) {
      try {
        const docRef = doc(db, 'admins', newAdmin.uid);
        await setDoc(docRef, newAdmin);

        // Ensure users collection reflects admin role
        const userDocRef = doc(db, 'users', newAdmin.uid);
        await setDoc(userDocRef, {
          id: newAdmin.uid,
          email: newAdmin.email,
          fullName: newAdmin.name,
          role: 'admin',
          status: 'active',
          isVerified: true,
          verificationStatus: 'verified',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('AdminService.createAdministrator write notice:', err);
      }
    }

    localStorage.setItem(`oou_admin_profile_${newAdmin.uid}`, JSON.stringify(newAdmin));

    // Audit log
    await this.logActivity({
      adminId: creatorAdmin.uid,
      adminEmail: creatorAdmin.email,
      action: 'CREATE_ADMINISTRATOR',
      targetType: 'admin',
      targetId: newAdmin.uid,
      description: `Created administrator ${newAdmin.name} (${newAdmin.email}) with ${newAdmin.permissions.length} permissions.`
    });

    return newAdmin;
  }

  // 4. LIST ALL ADMINISTRATORS
  static async listAdministrators(): Promise<AdminProfile[]> {
    if (db) {
      try {
        const colRef = collection(db, 'admins');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as AdminProfile);
        }
      } catch (err) {
        console.warn('AdminService.listAdministrators notice:', err);
      }
    }

    // Default return super admin if local
    const fallback: AdminProfile[] = [
      {
        uid: 'super-admin-1',
        name: 'Sulaiman Ipesola (Super Admin)',
        email: SUPER_ADMIN_EMAIL,
        role: 'super_admin',
        status: 'active',
        createdAt: '2026-08-01T00:00:00Z',
        lastLoginAt: new Date().toISOString(),
        createdBy: 'system_bootstrap',
        permissions: ALL_ADMIN_PERMISSIONS.map(p => p.key),
        department: 'Platform Governance & Safety'
      }
    ];
    return fallback;
  }

  // 5. UPDATE ADMINISTRATOR (Status or Permissions)
  static async updateAdministrator(
    editorAdmin: AdminProfile,
    targetUid: string,
    updates: Partial<Pick<AdminProfile, 'status' | 'permissions' | 'role' | 'name'>>
  ): Promise<void> {
    if (editorAdmin.role !== 'super_admin') {
      throw new Error('Only Super Administrators can modify administrator privileges or status.');
    }

    if (db) {
      try {
        const docRef = doc(db, 'admins', targetUid);
        await updateDoc(docRef, {
          ...updates,
          lastActivityAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('AdminService.updateAdministrator write notice:', err);
      }
    }

    // Audit log
    await this.logActivity({
      adminId: editorAdmin.uid,
      adminEmail: editorAdmin.email,
      action: 'UPDATE_ADMINISTRATOR',
      targetType: 'admin',
      targetId: targetUid,
      description: `Updated admin ${targetUid}: ${JSON.stringify(updates)}`
    });
  }

  // 6. RECORD AUDIT LOG (Append-only)
  static async logActivity(log: {
    adminId: string;
    adminEmail: string;
    action: string;
    targetType: AdminActivityLog['targetType'];
    targetId: string;
    description: string;
    details?: Record<string, any>;
  }): Promise<void> {
    const entry: AdminActivityLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      adminId: log.adminId,
      adminEmail: log.adminEmail,
      action: log.action,
      targetType: log.targetType,
      targetId: log.targetId,
      description: log.description,
      details: log.details || {},
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Server'
    };

    if (db) {
      try {
        const docRef = doc(db, 'adminLogs', entry.id);
        await setDoc(docRef, entry);
      } catch (err) {
        console.warn('AdminService.logActivity Firestore write notice:', err);
      }
    }

    // Also persist in local store for fallback auditing
    DataStore.logAdminAction(log.action, log.targetType, log.targetId, log.description);
  }

  // 7. GET AUDIT LOGS
  static async getAuditLogs(maxCount: number = 100): Promise<AdminActivityLog[]> {
    if (db) {
      try {
        const colRef = collection(db, 'adminLogs');
        const q = query(colRef, orderBy('timestamp', 'desc'), limit(maxCount));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as AdminActivityLog);
        }
      } catch (err) {
        console.warn('AdminService.getAuditLogs notice:', err);
      }
    }

    // Fallback from DataStore
    const localLogs = DataStore.getAdminLogs();
    return localLogs.map(l => ({
      id: l.id,
      adminId: l.adminId,
      adminEmail: l.adminEmail,
      action: l.action,
      targetType: l.targetType as AdminActivityLog['targetType'] || 'system',
      targetId: l.targetId,
      description: l.details,
      timestamp: l.timestamp
    }));
  }

  // 8. REAL CALCULATED PLATFORM STATS (Firestore Live Aggregation)
  static async getLivePlatformStats(): Promise<PlatformLiveStats> {
    let usersCount = 0;
    let activeUsersCount = 0;
    let studentProfCount = 0;
    let servicesCount = 0;
    let jobsCount = 0;
    let ordersCount = 0;
    let completedTxCount = 0;
    let pendingVerificationCount = 0;
    let reportsCount = 0;
    let disputesCount = 0;

    if (db) {
      try {
        // Query real collections from Firestore
        const [
          usersSnap,
          servicesSnap,
          jobsSnap,
          ordersSnap,
          txSnap,
          verifSnap,
          reportsSnap,
          disputesSnap
        ] = await Promise.all([
          getDocs(collection(db, 'users')).catch(() => null),
          getDocs(collection(db, 'services')).catch(() => null),
          getDocs(collection(db, 'jobs')).catch(() => null),
          getDocs(collection(db, 'unifiedOrders')).catch(() => null),
          getDocs(collection(db, 'transactions')).catch(() => null),
          getDocs(collection(db, 'verificationRequests')).catch(() => null),
          getDocs(collection(db, 'reports')).catch(() => null),
          getDocs(collection(db, 'orderDisputes')).catch(() => null),
        ]);

        if (usersSnap && !usersSnap.empty) {
          const usersList = usersSnap.docs.map(d => d.data());
          usersCount = usersList.length;
          activeUsersCount = usersList.filter(u => u.status !== 'suspended').length;
          studentProfCount = usersList.filter(u => u.role === 'student' || u.skills?.length > 0).length;
        }

        if (servicesSnap) servicesCount = servicesSnap.size;
        if (jobsSnap) jobsCount = jobsSnap.size;
        if (ordersSnap) ordersCount = ordersSnap.size;
        if (txSnap && !txSnap.empty) {
          completedTxCount = txSnap.docs.filter(d => d.data().status === 'completed' || d.data().status === 'released').length;
        }
        if (verifSnap && !verifSnap.empty) {
          pendingVerificationCount = verifSnap.docs.filter(d => d.data().status === 'pending').length;
        }
        if (reportsSnap) reportsCount = reportsSnap.size;
        if (disputesSnap) disputesCount = disputesSnap.size;

      } catch (err) {
        console.warn('AdminService.getLivePlatformStats Firestore query notice:', err);
      }
    }

    // Blend with DataStore / Marketplace stores if live Firestore returned 0 or initial state
    const allLocalUsers = DataStore.getUsers();
    const finalUsers = Math.max(usersCount, allLocalUsers.length);
    const finalActive = Math.max(activeUsersCount, allLocalUsers.filter(u => u.status === 'active').length);
    const finalStudents = Math.max(studentProfCount, allLocalUsers.filter(u => u.role === 'student').length);

    const vendorsCount = MarketplaceStore.getAllVendors().length;
    const campusShopsCount = CampusStore.getShops().length;
    const productsCount = MarketplaceStore.getAllProducts().length;
    const finalServices = Math.max(servicesCount, DataStore.getServices().length);
    const finalJobs = Math.max(jobsCount, OpportunityStore.getOpportunities().length);
    
    const localOrders = CampusStore.getOrders().length + TransactionEngineStore.getOrders().length;
    const finalOrders = Math.max(ordersCount, localOrders);

    const localTx = DataStore.getTransactions().filter(t => t.status === 'completed' || t.status === 'released').length;
    const finalCompletedTx = Math.max(completedTxCount, localTx);

    const localVerif = TrustSafetyStore.getVerificationRequests().filter(r => r.status === 'pending').length;
    const finalPendingVerif = Math.max(pendingVerificationCount, localVerif);

    const localReports = TrustSafetyStore.getReports().length + MarketplaceStore.getAllReports().length;
    const finalReports = Math.max(reportsCount, localReports);

    const localDisputes = TransactionEngineStore.getDisputes().length;
    const finalDisputes = Math.max(disputesCount, localDisputes);

    return {
      totalUsers: finalUsers,
      activeUsers: finalActive,
      studentProfessionals: finalStudents,
      vendors: vendorsCount,
      campusShops: campusShopsCount,
      services: finalServices,
      products: productsCount,
      jobs: finalJobs,
      orders: finalOrders,
      completedTransactions: finalCompletedTx,
      pendingVerification: finalPendingVerif,
      reports: finalReports,
      disputes: finalDisputes
    };
  }
}
