import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, normalizeUserRole, getRoleDashboardPath, AccountStatus } from '../types';
import { DataStore, initialUsers } from '../services/dataStore';
import { auth, db, isConfigured, googleProvider } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { FirestoreService } from '../services/firestoreService';

export interface LoginResult {
  success: boolean;
  user?: UserProfile;
  role?: UserRole;
  redirectPath?: string;
  error?: string;
}

export interface RegisterResult {
  success: boolean;
  user?: UserProfile;
  role?: UserRole;
  redirectPath?: string;
  verificationPending?: boolean;
  message?: string;
  error?: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<LoginResult>;
  loginWithGoogle: () => Promise<LoginResult>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole, specificUserId?: string) => void;
  register: (userData: Partial<UserProfile>, password?: string) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  updateCurrentUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const savedUserId = localStorage.getItem('oou_active_user_id');
    if (savedUserId) {
      const user = DataStore.getUserById(savedUserId);
      if (user) return user;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync Firebase Auth with Firestore
  useEffect(() => {
    if (auth && isConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Check Firestore first
            let userProfile = await FirestoreService.getUserProfile(firebaseUser.uid);
            
            if (!userProfile) {
              userProfile = await FirestoreService.getUserByEmail(firebaseUser.email || '');
            }

            if (!userProfile) {
              const localUser = DataStore.getUsers().find(u => u.email.toLowerCase() === (firebaseUser.email || '').toLowerCase());
              if (localUser) {
                userProfile = { ...localUser, id: firebaseUser.uid };
                await FirestoreService.saveUserProfile(userProfile);
              }
            }

            // Check if root superadmin
            const isSuperAdminEmail = (firebaseUser.email || '').toLowerCase() === 'ipesolasulaiman@gmail.com';
            if (userProfile) {
              if (isSuperAdminEmail && userProfile.role !== 'SUPER_ADMIN' && userProfile.role !== 'ADMIN' && userProfile.role !== 'admin') {
                userProfile.role = 'SUPER_ADMIN';
                await FirestoreService.saveUserProfile(userProfile);
              }
              setCurrentUser(userProfile);
              localStorage.setItem('oou_active_user_id', userProfile.id);
            }
          } catch (e) {
            console.warn("Auth state sync notice:", e);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const login = async (email: string, pass: string): Promise<LoginResult> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      if (auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, pass);
          const uid = userCredential.user.uid;
          
          let profile = await FirestoreService.getUserProfile(uid);
          if (!profile) {
            profile = await FirestoreService.getUserByEmail(cleanEmail);
          }
          if (!profile) {
            profile = DataStore.getUsers().find(u => u.email.toLowerCase() === cleanEmail) || null;
            if (profile) {
              profile = { ...profile, id: uid };
              await FirestoreService.saveUserProfile(profile);
            }
          }

          if (profile) {
            const statusUpper = (profile.accountStatus || profile.status || 'ACTIVE').toUpperCase();
            if (statusUpper === 'SUSPENDED' || statusUpper === 'DEACTIVATED' || statusUpper === 'REJECTED') {
              setIsLoading(false);
              return { 
                success: false, 
                error: `Your account is currently ${statusUpper.toLowerCase()}. Please contact StudentCircle administrator support.` 
              };
            }

            if (cleanEmail === 'ipesolasulaiman@gmail.com') {
              profile.role = 'SUPER_ADMIN';
            }

            const targetRole = normalizeUserRole(profile.role);
            const redirectPath = getRoleDashboardPath(targetRole, profile);

            setCurrentUser(profile);
            localStorage.setItem('oou_active_user_id', profile.id);
            setIsLoading(false);
            return { 
              success: true, 
              user: profile, 
              role: targetRole,
              redirectPath 
            };
          }
        } catch (firebaseErr: any) {
          console.warn("Firebase Auth sign in notice, checking local database:", firebaseErr.message);
        }
      }

      // Check local data store fallback
      const users = DataStore.getUsers();
      const matched = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (matched) {
        const statusUpper = (matched.accountStatus || matched.status || 'ACTIVE').toUpperCase();
        if (statusUpper === 'SUSPENDED' || statusUpper === 'DEACTIVATED') {
          setIsLoading(false);
          return { 
            success: false, 
            error: `Your account is currently ${statusUpper.toLowerCase()}. Please contact StudentCircle support.` 
          };
        }
        
        if (cleanEmail === 'ipesolasulaiman@gmail.com') {
          matched.role = 'SUPER_ADMIN';
        }

        const targetRole = normalizeUserRole(matched.role);
        const redirectPath = getRoleDashboardPath(targetRole, matched);

        setCurrentUser(matched);
        localStorage.setItem('oou_active_user_id', matched.id);
        setIsLoading(false);
        return { 
          success: true, 
          user: matched, 
          role: targetRole,
          redirectPath 
        };
      } else {
        setIsLoading(false);
        return { 
          success: false, 
          error: 'No account found with this email and password combination. Please check your credentials or create an account.' 
        };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: err.message || 'Login failed. Please check your credentials and try again.' 
      };
    }
  };

  const loginWithGoogle = async (): Promise<LoginResult> => {
    if (!auth) {
      return { success: false, error: 'Authentication service is initializing. Please try again in a moment.' };
    }
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const cleanEmail = (user.email || '').toLowerCase();
      
      let profile = await FirestoreService.getUserProfile(user.uid);
      if (!profile) {
        profile = await FirestoreService.getUserByEmail(cleanEmail);
      }

      if (!profile) {
        const isSuper = cleanEmail === 'ipesolasulaiman@gmail.com';
        profile = {
          id: user.uid,
          email: cleanEmail,
          fullName: user.displayName || 'OOU Student',
          role: isSuper ? 'SUPER_ADMIN' : 'STUDENT',
          phoneNumber: user.phoneNumber || '',
          profilePhoto: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
          location: 'Ago-Iwoye Main Campus',
          status: 'active',
          accountStatus: 'ACTIVE',
          isVerified: false,
          verificationStatus: 'unverified',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          faculty: 'Faculty of Science',
          department: 'Computer Science',
          level: '100L',
          rating: 5.0,
          reviewsCount: 0,
          completedJobsCount: 0,
          totalEarnings: 0,
          availableForWork: true
        };
        await FirestoreService.saveUserProfile(profile);
        DataStore.saveUser(profile);
      }

      const targetRole = normalizeUserRole(profile.role);
      const redirectPath = getRoleDashboardPath(targetRole, profile);

      setCurrentUser(profile);
      localStorage.setItem('oou_active_user_id', profile.id);
      setIsLoading(false);
      return { 
        success: true, 
        user: profile, 
        role: targetRole,
        redirectPath 
      };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Google sign-in could not be completed.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) return { success: false, error: 'Authentication service is not ready.' };
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Could not send password reset email.' };
    }
  };

  const loginAsDemo = (role: UserRole, specificUserId?: string) => {
    const users = DataStore.getUsers();
    let target: UserProfile | undefined;
    if (specificUserId) {
      target = users.find(u => u.id === specificUserId);
    } else {
      const norm = normalizeUserRole(role);
      target = users.find(u => normalizeUserRole(u.role) === norm);
    }

    if (target) {
      setCurrentUser(target);
      localStorage.setItem('oou_active_user_id', target.id);
    }
  };

  const register = async (userData: Partial<UserProfile>, password?: string): Promise<RegisterResult> => {
    setIsLoading(true);
    try {
      const cleanEmail = (userData.email || '').trim().toLowerCase();
      const cleanPhone = (userData.phoneNumber || '').trim();

      // 1. Duplicate Account Backend Validation
      const duplicateCheck = await FirestoreService.checkDuplicateAccount({
        email: cleanEmail,
        phoneNumber: cleanPhone,
        matricNumber: userData.matricNumber,
        jambRegNumber: userData.jambRegNumber,
        shopCode: userData.shopCode
      });

      if (duplicateCheck.isDuplicate) {
        setIsLoading(false);
        return {
          success: false,
          error: duplicateCheck.message || 'An account with these details already exists in the system.'
        };
      }

      // Also verify locally
      const localUsers = DataStore.getUsers();
      if (cleanEmail && localUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
        setIsLoading(false);
        return {
          success: false,
          error: 'An account with this email address already exists. Please log in instead.'
        };
      }

      // 2. Firebase Auth Account Creation
      let uid = `${(userData.role || 'student').toLowerCase()}-${Date.now()}`;
      if (auth && cleanEmail && password) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
          uid = userCredential.user.uid;
        } catch (e: any) {
          if (e.code === 'auth/email-already-in-use') {
            setIsLoading(false);
            return {
              success: false,
              error: 'This email address is already registered in Firebase Authentication. Please log in.'
            };
          }
          console.warn("Firebase register notice:", e.message);
        }
      }

      const rawRole = userData.role || 'STUDENT';
      const targetRole = normalizeUserRole(rawRole);
      
      // Determine verification status
      const isShopOwner = targetRole === 'CAMPUS_SHOP_OWNER';
      const accountStatus: AccountStatus = isShopOwner ? 'PENDING_VERIFICATION' : 'ACTIVE';
      const verificationStatus = isShopOwner ? 'pending' : (userData.verificationStatus || 'unverified');

      const newUser: UserProfile = {
        id: uid,
        email: cleanEmail,
        role: targetRole,
        fullName: (userData.fullName || '').trim(),
        phoneNumber: cleanPhone,
        profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        location: userData.location || 'Ago-Iwoye Main Campus',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: isShopOwner ? 'pending' : 'active',
        accountStatus,
        isVerified: false,
        verificationStatus,
        
        // Student props
        faculty: userData.faculty || 'Faculty of Science',
        department: userData.department || 'General Studies',
        level: userData.level || '100L',
        matricNumber: userData.matricNumber ? userData.matricNumber.trim().toUpperCase() : undefined,
        skills: userData.skills || [],
        interests: userData.interests || [],
        shortBio: userData.shortBio || '',
        rating: 5.0,
        reviewsCount: 0,
        completedJobsCount: 0,
        totalEarnings: 0,
        availableForWork: true,
        portfolio: userData.portfolio || [],

        // Aspirant props
        userType: targetRole === 'ASPIRANT' ? 'aspirant' : undefined,
        isAspirant: targetRole === 'ASPIRANT',
        jambRegNumber: userData.jambRegNumber ? userData.jambRegNumber.trim().toUpperCase() : undefined,
        intendedCourse: userData.intendedCourse,
        preferredCampus: userData.preferredCampus,
        entrySession: userData.entrySession || '2024/2025',

        // Client props
        businessName: userData.businessName,
        clientType: userData.clientType || 'business',
        businessCategory: userData.businessCategory,
        businessDescription: userData.businessDescription,
        jobsPostedCount: 0,
        totalSpent: 0,

        // Campus Shop Owner props
        ownerName: userData.ownerName || userData.fullName,
        shopName: userData.shopName,
        shopCode: userData.shopCode ? userData.shopCode.trim().toUpperCase() : undefined,
        shopCategory: userData.shopCategory,
        servicesOffered: userData.servicesOffered || [],
        openingInfo: userData.openingInfo || 'Monday - Saturday (8:00 AM - 6:00 PM)',
        shopDescription: userData.shopDescription,
        shopPhotos: userData.shopPhotos || [],
        shopContactPhone: userData.shopContactPhone || cleanPhone,
        shopWhatsapp: userData.shopWhatsapp || cleanPhone,
        shopAddress: userData.shopAddress || userData.location,
        shopVerificationStatus: 'pending',

        // Student Market Vendor props
        storeName: userData.storeName,
        storeDescription: userData.storeDescription,
        productCategories: userData.productCategories || [],
        vendorBusinessInfo: userData.vendorBusinessInfo,
        vendorPhone: userData.vendorPhone || cleanPhone,
        vendorWhatsapp: userData.vendorWhatsapp || cleanPhone,

        // Student Service Provider props
        providerTitle: userData.providerTitle,
        services: userData.services || [],
        portfolioImages: userData.portfolioImages || [],
        pricingInfo: userData.pricingInfo || 'Flexible rates with student discounts',
        availability: userData.availability || 'Available Now',
        serviceCategories: userData.serviceCategories || []
      };

      // Save to local DataStore and persistent Firestore
      DataStore.saveUser(newUser);
      await FirestoreService.saveUserProfile(newUser);

      const redirectPath = getRoleDashboardPath(targetRole, newUser);

      setCurrentUser(newUser);
      localStorage.setItem('oou_active_user_id', newUser.id);
      setIsLoading(false);

      return { 
        success: true, 
        user: newUser, 
        role: targetRole,
        redirectPath,
        verificationPending: isShopOwner,
        message: isShopOwner 
          ? 'Your campus shop account has been created. Verification is pending approval by campus moderators.' 
          : 'Your StudentCircle account is ready!'
      };
    } catch (err: any) {
      setIsLoading(false);
      return { 
        success: false, 
        error: err.message || 'Registration failed. Please review your details and try again.' 
      };
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn("Sign out notice:", e);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('oou_active_user_id');
  };

  const updateCurrentUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      ...data,
      updatedAt: new Date().toISOString()
    };
    setCurrentUser(updated);
    DataStore.saveUser(updated);
    await FirestoreService.saveUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role,
        isAuthenticated: !!currentUser,
        isLoading,
        isFirebaseConfigured: isConfigured,
        login,
        loginWithGoogle,
        resetPassword,
        loginAsDemo,
        register,
        logout,
        updateCurrentUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
