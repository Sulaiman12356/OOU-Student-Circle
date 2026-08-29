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
  serverTimestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { db, auth } from './firebase';
import { 
  AdminProfile, 
  AdminRole, 
  AdminStatus, 
  AdminPermission, 
  AdminActivityLog, 
  SecurityEvent,
  ALL_ADMIN_PERMISSIONS, 
  SUPER_ADMIN_PERMISSIONS,
  DEFAULT_ADMIN_PERMISSIONS
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
  // 0. CHECK IF ACTIVE SUPER ADMIN ALREADY EXISTS IN FIRESTORE
  static async checkSuperAdminExists(): Promise<{ exists: boolean; email?: string; name?: string }> {
    if (!db) return { exists: false };

    try {
      const colRef = collection(db, 'admins');
      const q = query(colRef, where('role', 'in', ['SUPER_ADMIN', 'super_admin']));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const superAdmins = snap.docs.map(d => d.data() as AdminProfile);
        const active = superAdmins.find(a => a.status === 'active');
        if (active) {
          return { exists: true, email: active.email, name: active.name };
        }
      }

      // Check root super admin doc
      const rootDoc = await getDoc(doc(db, 'admins', 'superadmin'));
      if (rootDoc.exists() && rootDoc.data()?.status === 'active') {
        return { exists: true, email: rootDoc.data()?.email, name: rootDoc.data()?.name };
      }

      return { exists: false };
    } catch (err) {
      console.warn('AdminService.checkSuperAdminExists notice:', err);
      return { exists: false };
    }
  }

  // 1. GET ADMIN PROFILE FROM FIRESTORE
  static async getAdminProfile(uid: string): Promise<AdminProfile | null> {
    if (!db) {
      console.warn('Firestore db not initialized in getAdminProfile');
      return null;
    }

    try {
      const docRef = doc(db, 'admins', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as AdminProfile;
        return data;
      }
      return null;
    } catch (err) {
      console.error('AdminService.getAdminProfile error:', err);
      return null;
    }
  }

  // 2. BOOTSTRAP / FIRST-TIME SUPER ADMIN SETUP
  static async setupFirstSuperAdmin(params: {
    fullName: string;
    email: string;
    password: string;
    profilePhoto?: string;
    verificationCode?: string;
  }): Promise<{ success: boolean; profile?: AdminProfile; error?: string }> {
    const cleanEmail = params.email.trim().toLowerCase();
    
    // Check if another SuperAdmin is already initialized
    const existingCheck = await this.checkSuperAdminExists();
    if (existingCheck.exists && existingCheck.email?.toLowerCase() !== cleanEmail) {
      return {
        success: false,
        error: `Setup is locked: A Super Administrator (${existingCheck.email}) is already configured. Only an existing SuperAdmin can create additional administrators.`
      };
    }

    if (!auth) {
      return { success: false, error: 'Authentication service is not initialized.' };
    }

    try {
      let uid = '';
      
      // Attempt real Firebase Auth registration
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, params.password);
        uid = cred.user.uid;
        await updateProfile(cred.user, {
          displayName: params.fullName.trim(),
          photoURL: params.profilePhoto || undefined
        });
      } catch (authErr: any) {
        if (authErr.code === 'auth/email-already-in-use') {
          // If auth account exists, attempt sign in with provided password
          const cred = await signInWithEmailAndPassword(auth, cleanEmail, params.password);
          uid = cred.user.uid;
        } else {
          throw authErr;
        }
      }

      const adminProfile: AdminProfile = {
        uid,
        name: params.fullName.trim(),
        email: cleanEmail,
        role: 'SUPER_ADMIN',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        createdBy: 'bootstrap_setup',
        permissions: SUPER_ADMIN_PERMISSIONS,
        lastActivityAt: new Date().toISOString(),
        profilePhoto: params.profilePhoto || '',
        department: 'Platform Governance & Executive Direction'
      };

      if (db) {
        const docRef = doc(db, 'admins', uid);
        await setDoc(docRef, adminProfile, { merge: true });

        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
          id: uid,
          email: cleanEmail,
          fullName: adminProfile.name,
          role: 'SUPER_ADMIN',
          status: 'active',
          isVerified: true,
          verificationStatus: 'verified',
          profilePhoto: adminProfile.profilePhoto,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      await this.recordSecurityEvent({
        type: 'superadmin_bootstrap',
        severity: 'high',
        userId: uid,
        email: cleanEmail,
        description: `Primary Super Administrator (${cleanEmail}) account created and initialized.`
      });

      await this.logActivity({
        adminId: uid,
        adminEmail: cleanEmail,
        adminName: adminProfile.name,
        action: 'BOOTSTRAP_SUPERADMIN_ACCOUNT',
        targetType: 'admin',
        targetId: uid,
        description: `Super Administrator created via initial setup for ${cleanEmail}`
      });

      return { success: true, profile: adminProfile };
    } catch (err: any) {
      console.error('AdminService.setupFirstSuperAdmin error:', err);
      return { success: false, error: err.message || 'Failed to initialize Super Administrator.' };
    }
  }

  // 2b. BOOTSTRAP SUPER ADMIN ACCOUNT IN FIRESTORE FOR AUTHENTICATED USER
  static async bootstrapSuperAdmin(user: { uid: string; email: string; name?: string }): Promise<AdminProfile> {
    const cleanEmail = user.email.toLowerCase().trim();

    const adminProfile: AdminProfile = {
      uid: user.uid,
      name: user.name || 'Platform Administrator',
      email: cleanEmail,
      role: 'SUPER_ADMIN',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      createdBy: 'system_bootstrap',
      permissions: SUPER_ADMIN_PERMISSIONS,
      lastActivityAt: new Date().toISOString(),
      profilePhoto: '',
      department: 'Platform Governance & Executive Direction'
    };

    if (db) {
      try {
        const docRef = doc(db, 'admins', user.uid);
        await setDoc(docRef, adminProfile, { merge: true });
        
        // Also update users collection for role synchronization
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          id: user.uid,
          email: cleanEmail,
          fullName: adminProfile.name,
          role: 'SUPER_ADMIN',
          status: 'active',
          isVerified: true,
          verificationStatus: 'verified',
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Record security audit
        await this.recordSecurityEvent({
          type: 'superadmin_bootstrap',
          severity: 'high',
          userId: user.uid,
          email: cleanEmail,
          description: `Super Administrator bootstrap verified for ${cleanEmail}`
        });

      } catch (err) {
        console.error('AdminService.bootstrapSuperAdmin error:', err);
      }
    }

    // Record immutable audit log
    await this.logActivity({
      adminId: user.uid,
      adminEmail: cleanEmail,
      adminName: adminProfile.name,
      action: 'BOOTSTRAP_SUPERADMIN_ACCOUNT',
      targetType: 'admin',
      targetId: user.uid,
      description: `Super Administrator account bootstrapped for ${cleanEmail}`
    });

    return adminProfile;
  }

  // 3. CREATE NEW ADMINISTRATOR (SuperAdmin Only)
  static async createAdministrator(
    creatorAdmin: AdminProfile,
    data: {
      uid?: string;
      name: string;
      email: string;
      phoneNumber?: string;
      password?: string;
      profilePhoto?: string;
      role: 'SUPER_ADMIN' | 'ADMIN' | 'super_admin' | 'admin';
      status?: AdminStatus;
      permissions: AdminPermission[];
      department?: string;
      sendInvitation?: boolean;
    }
  ): Promise<AdminProfile> {
    const isSuper = creatorAdmin.role === 'SUPER_ADMIN' || creatorAdmin.role === 'super_admin';
    if (!isSuper) {
      throw new Error('Access Denied: SuperAdmin permission required.');
    }

    const cleanEmail = data.email.toLowerCase().trim();
    const normalizedRole = (data.role === 'SUPER_ADMIN' || data.role === 'super_admin') ? 'SUPER_ADMIN' : 'ADMIN';
    const adminUid = data.uid || `admin-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const adminStatus: AdminStatus = data.status || (data.sendInvitation ? 'invited' : 'active');

    const newAdmin: AdminProfile = {
      uid: adminUid,
      name: data.name.trim(),
      email: cleanEmail,
      phoneNumber: data.phoneNumber?.trim() || '',
      role: normalizedRole,
      status: adminStatus,
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Never logged in',
      createdBy: creatorAdmin.uid,
      permissions: normalizedRole === 'SUPER_ADMIN' ? SUPER_ADMIN_PERMISSIONS : data.permissions,
      lastActivityAt: new Date().toISOString(),
      profilePhoto: data.profilePhoto || '',
      department: data.department || 'Campus Operations & Moderation'
    };

    if (db) {
      const docRef = doc(db, 'admins', newAdmin.uid);
      await setDoc(docRef, newAdmin);

      // Sync role in users collection
      const userDocRef = doc(db, 'users', newAdmin.uid);
      await setDoc(userDocRef, {
        id: newAdmin.uid,
        email: cleanEmail,
        fullName: newAdmin.name,
        phoneNumber: newAdmin.phoneNumber,
        role: normalizedRole,
        status: adminStatus === 'active' ? 'active' : 'pending',
        isVerified: true,
        verificationStatus: 'verified',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    // Send invitation / password reset email if requested or available
    if (data.sendInvitation && auth) {
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
      } catch (inviteErr) {
        console.warn('Admin invitation email trigger notice:', inviteErr);
      }
    }

    // Audit log: SuperAdmin created an Admin account
    await this.logActivity({
      adminId: creatorAdmin.uid,
      adminEmail: creatorAdmin.email,
      adminName: creatorAdmin.name,
      action: 'CREATE_ADMIN_ACCOUNT',
      targetType: 'admin',
      targetId: newAdmin.uid,
      description: `SuperAdmin ${creatorAdmin.name} created an Admin account for ${newAdmin.name} (${newAdmin.email}) with ${newAdmin.permissions.length} permissions.`,
      details: {
        createdBy: creatorAdmin.email,
        adminId: newAdmin.uid,
        adminName: newAdmin.name,
        timestamp: new Date().toISOString(),
        permissions: newAdmin.permissions
      }
    });

    await this.recordSecurityEvent({
      type: 'admin_status_change',
      severity: 'medium',
      userId: newAdmin.uid,
      email: cleanEmail,
      description: `Administrator account provisioned for ${cleanEmail} (${normalizedRole}) by ${creatorAdmin.email}`
    });

    return newAdmin;
  }

  // 4. LIST ALL ADMINISTRATORS FROM FIRESTORE
  static async listAdministrators(): Promise<AdminProfile[]> {
    if (db) {
      try {
        const colRef = collection(db, 'admins');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as AdminProfile);
        }
      } catch (err) {
        console.error('AdminService.listAdministrators error:', err);
      }
    }
    return [];
  }

  // 5. UPDATE ADMINISTRATOR (SuperAdmin Only)
  static async updateAdministrator(
    editorAdmin: AdminProfile,
    targetUid: string,
    updates: Partial<Pick<AdminProfile, 'status' | 'permissions' | 'role' | 'name' | 'department' | 'phoneNumber' | 'profilePhoto'>>
  ): Promise<void> {
    const isSuper = editorAdmin.role === 'SUPER_ADMIN' || editorAdmin.role === 'super_admin';
    if (!isSuper) {
      throw new Error('Access denied. SuperAdmin permission required.');
    }

    if (db) {
      const docRef = doc(db, 'admins', targetUid);
      await updateDoc(docRef, {
        ...updates,
        lastActivityAt: new Date().toISOString()
      });

      if (updates.role || updates.status || updates.name) {
        const userDocRef = doc(db, 'users', targetUid);
        const userUpdates: Record<string, any> = { updatedAt: new Date().toISOString() };
        if (updates.role) userUpdates.role = updates.role;
        if (updates.status) userUpdates.status = updates.status;
        if (updates.name) userUpdates.fullName = updates.name;
        await updateDoc(userDocRef, userUpdates).catch(() => null);
      }
    }

    // Audit log
    await this.logActivity({
      adminId: editorAdmin.uid,
      adminEmail: editorAdmin.email,
      adminName: editorAdmin.name,
      action: 'UPDATE_ADMIN_ACCOUNT',
      targetType: 'admin',
      targetId: targetUid,
      description: `SuperAdmin ${editorAdmin.name} updated admin ${targetUid}: ${JSON.stringify(updates)}`
    });
  }

  // 6. DEACTIVATE ADMINISTRATOR
  static async deactivateAdministrator(editorAdmin: AdminProfile, targetUid: string, targetEmail: string): Promise<void> {
    if (targetUid === editorAdmin.uid) {
      throw new Error('You cannot deactivate your own administrative account.');
    }
    await this.updateAdministrator(editorAdmin, targetUid, { status: 'deactivated' });
    await this.recordSecurityEvent({
      type: 'admin_status_change',
      severity: 'high',
      userId: targetUid,
      email: targetEmail,
      description: `Admin ${targetEmail} deactivated by SuperAdmin ${editorAdmin.email}`
    });
  }

  // 7. REACTIVATE ADMINISTRATOR
  static async reactivateAdministrator(editorAdmin: AdminProfile, targetUid: string, targetEmail: string): Promise<void> {
    await this.updateAdministrator(editorAdmin, targetUid, { status: 'active' });
    await this.recordSecurityEvent({
      type: 'admin_status_change',
      severity: 'medium',
      userId: targetUid,
      email: targetEmail,
      description: `Admin ${targetEmail} reactivated by SuperAdmin ${editorAdmin.email}`
    });
  }

  // 8. CHANGE ADMIN PERMISSIONS
  static async updateAdminPermissions(
    editorAdmin: AdminProfile,
    targetUid: string,
    targetName: string,
    newPermissions: AdminPermission[]
  ): Promise<void> {
    await this.updateAdministrator(editorAdmin, targetUid, { permissions: newPermissions });
    await this.logActivity({
      adminId: editorAdmin.uid,
      adminEmail: editorAdmin.email,
      adminName: editorAdmin.name,
      action: 'CHANGE_ADMIN_PERMISSIONS',
      targetType: 'admin',
      targetId: targetUid,
      description: `Updated permissions for ${targetName} to [${newPermissions.join(', ')}]`
    });
  }

  // 8b. RESET ADMIN ACCESS (Send Password Reset Email)
  static async sendPasswordResetForAdmin(editorAdmin: AdminProfile, targetEmail: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const isSuper = editorAdmin.role === 'SUPER_ADMIN' || editorAdmin.role === 'super_admin';
    if (!isSuper) {
      return { success: false, error: 'Access denied. SuperAdmin permission required.' };
    }

    if (!auth) {
      return { success: false, error: 'Authentication provider is not available.' };
    }

    try {
      await sendPasswordResetEmail(auth, targetEmail.trim());
      await this.logActivity({
        adminId: editorAdmin.uid,
        adminEmail: editorAdmin.email,
        adminName: editorAdmin.name,
        action: 'SEND_ADMIN_PASSWORD_RESET',
        targetType: 'admin',
        targetId: targetEmail,
        description: `Sent password reset / invitation link to ${targetEmail}`
      });
      return { success: true, message: `Password reset / access link sent to ${targetEmail}` };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send reset link.' };
    }
  }

  // 8c. SAFE DELETE / REMOVE ADMINISTRATOR
  static async removeAdministrator(editorAdmin: AdminProfile, targetUid: string, targetEmail: string): Promise<{ success: boolean; error?: string }> {
    const isSuper = editorAdmin.role === 'SUPER_ADMIN' || editorAdmin.role === 'super_admin';
    if (!isSuper) {
      return { success: false, error: 'Access denied. SuperAdmin permission required.' };
    }

    if (targetUid === editorAdmin.uid) {
      return { success: false, error: 'You cannot remove your own administrator account.' };
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'admins', targetUid));
        // Update user status
        await updateDoc(doc(db, 'users', targetUid), {
          role: 'STUDENT',
          updatedAt: new Date().toISOString()
        }).catch(() => null);

        await this.logActivity({
          adminId: editorAdmin.uid,
          adminEmail: editorAdmin.email,
          adminName: editorAdmin.name,
          action: 'REMOVE_ADMIN_ACCOUNT',
          targetType: 'admin',
          targetId: targetUid,
          description: `SuperAdmin ${editorAdmin.name} removed admin record for ${targetEmail}`
        });

        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message || 'Failed to remove admin document.' };
      }
    }
    return { success: false, error: 'Database not initialized.' };
  }

  // 9. RECORD IMMUTABLE AUDIT LOG IN FIRESTORE
  static async logActivity(log: {
    adminId: string;
    adminEmail: string;
    adminName?: string;
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
      adminName: log.adminName || log.adminEmail,
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
        console.error('AdminService.logActivity error:', err);
      }
    }

    // Sync in DataStore for UI responsiveness
    DataStore.logAdminAction(log.action, log.targetType, log.targetId, log.description);
  }

  // 10. GET AUDIT LOGS FROM FIRESTORE
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
        console.error('AdminService.getAuditLogs error:', err);
      }
    }
    return [];
  }

  // 11. RECORD SECURITY EVENT
  static async recordSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const entry: SecurityEvent = {
      ...event,
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString()
    };

    if (db) {
      try {
        const docRef = doc(db, 'securityEvents', entry.id);
        await setDoc(docRef, entry);
      } catch (err) {
        console.error('AdminService.recordSecurityEvent error:', err);
      }
    }
  }

  // 12. GET SECURITY EVENTS
  static async getSecurityEvents(maxCount: number = 50): Promise<SecurityEvent[]> {
    if (db) {
      try {
        const colRef = collection(db, 'securityEvents');
        const q = query(colRef, orderBy('timestamp', 'desc'), limit(maxCount));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map(d => d.data() as SecurityEvent);
        }
      } catch (err) {
        console.error('AdminService.getSecurityEvents error:', err);
      }
    }
    return [];
  }

  // 13. LIVE AGGREGATED PLATFORM STATS FROM ACTUAL FIRESTORE COLLECTIONS
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
          activeUsersCount = usersList.filter(u => u.status !== 'suspended' && u.status !== 'deactivated').length;
          studentProfCount = usersList.filter(u => u.role === 'student' || u.role === 'STUDENT' || (u.skills && u.skills.length > 0)).length;
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
        console.error('AdminService.getLivePlatformStats error:', err);
      }
    }

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

