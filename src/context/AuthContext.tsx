import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
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

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole, specificUserId?: string) => void;
  register: (userData: Partial<UserProfile>, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateCurrentUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    // Read saved user session or default to the student-1 demo
    const savedUserId = localStorage.getItem('oou_active_user_id');
    if (savedUserId) {
      const user = DataStore.getUserById(savedUserId);
      if (user) return user;
    }
    return DataStore.getUserById('student-1') || initialUsers[0];
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
              // Check local data store
              const localUser = DataStore.getUsers().find(u => u.email.toLowerCase() === (firebaseUser.email || '').toLowerCase());
              if (localUser) {
                userProfile = { ...localUser, id: firebaseUser.uid };
                await FirestoreService.saveUserProfile(userProfile);
              }
            }

            // Check if designated admin
            const isAdminEmail = (firebaseUser.email || '').toLowerCase() === 'ipesolasulaiman@gmail.com';
            if (userProfile) {
              if (isAdminEmail && userProfile.role !== 'admin') {
                userProfile.role = 'admin';
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

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
          const uid = userCredential.user.uid;
          
          let profile = await FirestoreService.getUserProfile(uid);
          if (!profile) {
            profile = DataStore.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
            if (profile) {
              profile = { ...profile, id: uid };
              await FirestoreService.saveUserProfile(profile);
            }
          }

          if (profile) {
            if (profile.status === 'suspended') {
              setIsLoading(false);
              return { success: false, error: 'Your account has been suspended. Please contact StudentCircle support.' };
            }
            if (email.toLowerCase() === 'ipesolasulaiman@gmail.com') {
              profile.role = 'admin';
            }
            setCurrentUser(profile);
            localStorage.setItem('oou_active_user_id', profile.id);
            setIsLoading(false);
            return { success: true };
          }
        } catch (firebaseErr: any) {
          console.warn("Firebase Auth sign in notice, checking local database:", firebaseErr.message);
        }
      }

      // Check local store
      const users = DataStore.getUsers();
      const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (matched) {
        if (matched.status === 'suspended') {
          setIsLoading(false);
          return { success: false, error: 'Your account has been suspended. Please contact StudentCircle support.' };
        }
        setCurrentUser(matched);
        localStorage.setItem('oou_active_user_id', matched.id);
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: 'No account found with this email. Please check your credentials or register.' };
      }
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: 'Authentication service is initializing.' };
    }
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      let profile = await FirestoreService.getUserProfile(user.uid);
      if (!profile) {
        const isAdmin = (user.email || '').toLowerCase() === 'ipesolasulaiman@gmail.com';
        profile = {
          id: user.uid,
          email: user.email || '',
          fullName: user.displayName || 'OOU Student',
          role: isAdmin ? 'admin' : 'student',
          phoneNumber: user.phoneNumber || '',
          profilePhoto: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
          location: 'Ago-Iwoye Main Campus',
          status: 'active',
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
          totalEarnings: 0
        };
        await FirestoreService.saveUserProfile(profile);
        DataStore.saveUser(profile);
      }

      setCurrentUser(profile);
      localStorage.setItem('oou_active_user_id', profile.id);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Google sign in failed.' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) return { success: false, error: 'Authentication service not ready.' };
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
      target = users.find(u => u.role === role);
    }

    if (target) {
      setCurrentUser(target);
      localStorage.setItem('oou_active_user_id', target.id);
    }
  };

  const register = async (userData: Partial<UserProfile>, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      let uid = `${userData.role || 'student'}-${Date.now()}`;

      if (auth && userData.email && password) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, userData.email.trim(), password);
          uid = userCredential.user.uid;
        } catch (e: any) {
          console.warn("Firebase register notice:", e.message);
        }
      }

      // Ensure never registering as admin directly from public UI
      const safeRole: UserRole = userData.role === 'client' ? 'client' : 'student';

      const newUser: UserProfile = {
        id: uid,
        email: userData.email || '',
        role: safeRole,
        fullName: userData.fullName || '',
        phoneNumber: userData.phoneNumber || '',
        profilePhoto: userData.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        location: userData.location || 'Ago-Iwoye Main Campus',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        isVerified: false,
        verificationStatus: 'unverified',
        
        // Student props
        faculty: userData.faculty || 'Faculty of Science',
        department: userData.department || 'Computer Science',
        level: userData.level || '100L',
        matricNumber: userData.matricNumber || '',
        skills: userData.skills || [],
        shortBio: userData.shortBio || '',
        rating: 5.0,
        reviewsCount: 0,
        completedJobsCount: 0,
        totalEarnings: 0,
        availableForWork: true,
        portfolio: [],

        // Client props
        businessName: userData.businessName || '',
        businessCategory: userData.businessCategory || '',
        businessDescription: userData.businessDescription || '',
        jobsPostedCount: 0,
        totalSpent: 0
      };

      // Save to local and Firestore
      DataStore.saveUser(newUser);
      await FirestoreService.saveUserProfile(newUser);

      setCurrentUser(newUser);
      localStorage.setItem('oou_active_user_id', newUser.id);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Registration failed.' };
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
