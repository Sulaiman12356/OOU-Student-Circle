import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AdminProfile, 
  AdminPermission, 
  AdminRole, 
  SUPER_ADMIN_EMAIL 
} from '../types/admin';
import { AdminService } from '../services/adminService';
import { auth, isConfigured } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

interface AdminAuthContextType {
  adminProfile: AdminProfile | null;
  isSuperAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string; role?: string; isSuperAdmin?: boolean }>;
  logoutAdmin: () => Promise<void>;
  bootstrapSuperAdmin: () => Promise<{ success: boolean; error?: string }>;
  refreshAdminSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync auth state directly with Firebase Auth and Firestore backend
  useEffect(() => {
    if (auth && isConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Fetch real admin profile from Firestore
            let profile = await AdminService.getAdminProfile(firebaseUser.uid);
            
            const isSuperEmail = (firebaseUser.email || '').toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

            // First-time bootstrap for verified platform owner
            if (!profile && isSuperEmail) {
              profile = await AdminService.bootstrapSuperAdmin({
                uid: firebaseUser.uid,
                email: firebaseUser.email || SUPER_ADMIN_EMAIL,
                name: firebaseUser.displayName || 'Sulaiman Ipesola'
              });
            }

            if (profile && profile.status === 'active') {
              setAdminProfile(profile);
            } else if (profile && profile.status !== 'active') {
              setAdminProfile(null);
              await firebaseSignOut(auth);
            } else {
              // Standard non-admin user authenticated
              setAdminProfile(null);
            }
          } catch (err) {
            console.error('AdminAuth Firestore sync error:', err);
            setAdminProfile(null);
          }
        } else {
          setAdminProfile(null);
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const isSuperAdmin = !!adminProfile && (
    adminProfile.role === 'SUPER_ADMIN' || 
    adminProfile.role === 'super_admin' || 
    adminProfile.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase()
  );

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!adminProfile || adminProfile.status !== 'active') return false;
    if (isSuperAdmin) return true;
    return adminProfile.permissions.includes(permission);
  };

  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string; role?: string; isSuperAdmin?: boolean }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (!auth) {
        setIsLoading(false);
        return { success: false, error: 'Authentication service not initialized.' };
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const user = userCredential.user;

        // Query Firestore for admin profile
        let profile = await AdminService.getAdminProfile(user.uid);

        const isSuperEmail = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();

        if (!profile && isSuperEmail) {
          profile = await AdminService.bootstrapSuperAdmin({
            uid: user.uid,
            email: cleanEmail,
            name: user.displayName || 'Sulaiman Ipesola'
          });
        }

        if (!profile) {
          // User exists in auth but has no Admin document in Firestore
          await firebaseSignOut(auth);
          setAdminProfile(null);
          
          await AdminService.recordSecurityEvent({
            type: 'unauthorized_route_access',
            severity: 'medium',
            userId: user.uid,
            email: cleanEmail,
            description: `Non-admin user ${cleanEmail} attempted Admin Portal sign-in.`
          });

          setIsLoading(false);
          return {
            success: false,
            error: 'Access Denied: Your account does not have administrator privileges.'
          };
        }

        if (profile.status !== 'active') {
          await firebaseSignOut(auth);
          setAdminProfile(null);
          
          await AdminService.recordSecurityEvent({
            type: 'privilege_escalation_attempt',
            severity: 'high',
            userId: user.uid,
            email: cleanEmail,
            description: `Suspended admin ${cleanEmail} attempted portal login.`
          });

          setIsLoading(false);
          return {
            success: false,
            error: `Your administrator account is currently ${profile.status}. Please contact the Super Administrator.`
          };
        }

        // Successful authentication
        setAdminProfile(profile);

        const superAdminFlag = profile.role === 'SUPER_ADMIN' || profile.role === 'super_admin' || isSuperEmail;

        await AdminService.logActivity({
          adminId: profile.uid,
          adminEmail: profile.email,
          adminName: profile.name,
          action: 'ADMIN_LOGIN_SUCCESS',
          targetType: 'admin',
          targetId: profile.uid,
          description: `Administrator ${profile.name} successfully authenticated.`
        });

        await AdminService.recordSecurityEvent({
          type: 'successful_admin_login',
          severity: 'low',
          userId: profile.uid,
          email: profile.email,
          description: `Admin login confirmed for ${profile.email} (${profile.role})`
        });

        setIsLoading(false);
        return { 
          success: true, 
          role: profile.role, 
          isSuperAdmin: superAdminFlag 
        };

      } catch (firebaseErr: any) {
        console.warn('Admin sign-in authentication notice:', firebaseErr.code);

        await AdminService.recordSecurityEvent({
          type: 'failed_admin_login',
          severity: 'medium',
          email: cleanEmail,
          description: `Failed admin login attempt for ${cleanEmail} (Code: ${firebaseErr.code})`
        });

        setIsLoading(false);

        if (firebaseErr.code === 'auth/too-many-requests') {
          return {
            success: false,
            error: 'Access temporarily locked due to multiple failed attempts. Please wait a moment and try again.'
          };
        }

        // Generic error to prevent email enumeration
        return { 
          success: false, 
          error: 'Invalid email or password.' 
        };
      }

    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Administrator authentication failed.' };
    }
  };

  const logoutAdmin = async () => {
    setIsLoading(true);
    if (adminProfile) {
      await AdminService.logActivity({
        adminId: adminProfile.uid,
        adminEmail: adminProfile.email,
        adminName: adminProfile.name,
        action: 'ADMIN_LOGOUT',
        targetType: 'admin',
        targetId: adminProfile.uid,
        description: `Administrator ${adminProfile.name} logged out.`
      });
    }

    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error('Logout error:', e);
      }
    }

    setAdminProfile(null);
    setIsLoading(false);
  };

  const bootstrapSuperAdmin = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (auth && auth.currentUser) {
        const user = auth.currentUser;
        const profile = await AdminService.bootstrapSuperAdmin({
          uid: user.uid,
          email: user.email || SUPER_ADMIN_EMAIL,
          name: user.displayName || 'Sulaiman Ipesola'
        });
        setAdminProfile(profile);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          error: `Please sign into Firebase Authentication with ${SUPER_ADMIN_EMAIL} to complete platform owner initialization.` 
        };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Failed to bootstrap Super Admin account.' };
    }
  };

  const refreshAdminSession = async () => {
    if (!adminProfile) return;
    const refreshed = await AdminService.getAdminProfile(adminProfile.uid);
    if (refreshed && refreshed.status === 'active') {
      setAdminProfile(refreshed);
    } else {
      await logoutAdmin();
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminProfile,
        isSuperAdmin,
        isAdminAuthenticated: !!adminProfile && adminProfile.status === 'active',
        isLoading,
        hasPermission,
        loginAdmin,
        logoutAdmin,
        bootstrapSuperAdmin,
        refreshAdminSession
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
