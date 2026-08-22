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
  getIdTokenResult
} from 'firebase/auth';

interface AdminAuthContextType {
  adminProfile: AdminProfile | null;
  isSuperAdmin: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  hasPermission: (permission: AdminPermission) => boolean;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  bootstrapSuperAdmin: () => Promise<{ success: boolean; error?: string }>;
  refreshAdminSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(() => {
    const saved = localStorage.getItem('oou_active_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync auth state with Firebase and Firestore
  useEffect(() => {
    if (auth && isConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Check if user is an authorized admin in Firestore
            let profile = await AdminService.getAdminProfile(firebaseUser.uid);
            
            // Check if Super Admin email
            const isSuperEmail = (firebaseUser.email || '').toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

            if (!profile && isSuperEmail) {
              // Auto-bootstrap Super Admin record for platform owner
              profile = await AdminService.bootstrapSuperAdmin({
                uid: firebaseUser.uid,
                email: firebaseUser.email || SUPER_ADMIN_EMAIL,
                name: firebaseUser.displayName || 'Sulaiman Ipesola'
              });
            }

            if (profile && profile.status === 'active') {
              // Refresh token if needed
              try {
                await firebaseUser.getIdToken(true);
              } catch (tokenErr) {
                console.warn('ID token refresh notice:', tokenErr);
              }

              setAdminProfile(profile);
              localStorage.setItem('oou_active_admin_session', JSON.stringify(profile));
            } else if (profile && profile.status !== 'active') {
              // Suspended or deactivated admin
              setAdminProfile(null);
              localStorage.removeItem('oou_active_admin_session');
              await firebaseSignOut(auth);
            } else {
              // Authenticated user is not an admin
              setAdminProfile(null);
              localStorage.removeItem('oou_active_admin_session');
            }
          } catch (err) {
            console.warn('AdminAuth sync error:', err);
          }
        } else {
          setAdminProfile(null);
          localStorage.removeItem('oou_active_admin_session');
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!adminProfile || adminProfile.status !== 'active') return false;
    if (adminProfile.role === 'super_admin') return true;
    return adminProfile.permissions.includes(permission);
  };

  const loginAdmin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
          const user = userCredential.user;

          // Check if admin document exists
          let profile = await AdminService.getAdminProfile(user.uid);

          const isSuperEmail = cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase();

          if (!profile && isSuperEmail) {
            // First time bootstrap for platform owner
            profile = await AdminService.bootstrapSuperAdmin({
              uid: user.uid,
              email: cleanEmail,
              name: user.displayName || 'Sulaiman Ipesola'
            });
          }

          if (!profile) {
            // User signed in but is NOT an administrator!
            await firebaseSignOut(auth);
            setIsLoading(false);
            return {
              success: false,
              error: 'Access Denied: Your account does not have administrator privileges on OOU StudentCircle.'
            };
          }

          if (profile.status !== 'active') {
            await firebaseSignOut(auth);
            setIsLoading(false);
            return {
              success: false,
              error: `Your administrator account is currently ${profile.status}. Please contact the Super Administrator.`
            };
          }

          // Successful admin login
          setAdminProfile(profile);
          localStorage.setItem('oou_active_admin_session', JSON.stringify(profile));

          await AdminService.logActivity({
            adminId: profile.uid,
            adminEmail: profile.email,
            action: 'ADMIN_LOGIN_SUCCESS',
            targetType: 'admin',
            targetId: profile.uid,
            description: `Administrator ${profile.name} successfully signed into Admin Console.`
          });

          setIsLoading(false);
          return { success: true };

        } catch (firebaseErr: any) {
          console.warn('Firebase admin sign-in attempt notice:', firebaseErr.message);
          
          // Provide friendly user errors for common Firebase auth failures
          let friendlyMsg = firebaseErr.message;
          if (firebaseErr.code === 'auth/invalid-credential' || firebaseErr.code === 'auth/wrong-password' || firebaseErr.code === 'auth/user-not-found') {
            friendlyMsg = 'Invalid administrator email or password.';
          } else if (firebaseErr.code === 'auth/too-many-requests') {
            friendlyMsg = 'Access temporarily locked due to multiple failed login attempts. Please try again in a few moments.';
          }

          setIsLoading(false);
          return { success: false, error: friendlyMsg };
        }
      }

      setIsLoading(false);
      return { success: false, error: 'Authentication service not initialized.' };

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
        action: 'ADMIN_LOGOUT',
        targetType: 'admin',
        targetId: adminProfile.uid,
        description: `Administrator ${adminProfile.name} signed out.`
      });
    }

    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Admin logout notice:', e);
      }
    }

    setAdminProfile(null);
    localStorage.removeItem('oou_active_admin_session');
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
        localStorage.setItem('oou_active_admin_session', JSON.stringify(profile));
        setIsLoading(false);
        return { success: true };
      } else {
        // Fallback for initial workspace provisioning
        const profile = await AdminService.bootstrapSuperAdmin({
          uid: 'super-admin-root',
          email: SUPER_ADMIN_EMAIL,
          name: 'Sulaiman Ipesola (Super Admin)'
        });
        setAdminProfile(profile);
        localStorage.setItem('oou_active_admin_session', JSON.stringify(profile));
        setIsLoading(false);
        return { success: true };
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
      localStorage.setItem('oou_active_admin_session', JSON.stringify(refreshed));
    } else {
      await logoutAdmin();
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminProfile,
        isSuperAdmin: adminProfile?.role === 'super_admin',
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
