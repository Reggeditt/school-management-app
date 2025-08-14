'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'staff';

export interface AppUser extends User {
  role: UserRole;
  profile?: {
    name: string;
    schoolId?: string;
    department?: string;
    grade?: string;
    section?: string;
  };
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  createAccount: (email: string, password: string, role: UserRole, profile: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          console.log('🔍 Auth state changed for user:', firebaseUser.email);
          
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          console.log('📄 User document exists:', userDoc.exists());
          console.log('📊 User data from Firestore:', userData);
          
          if (userData) {
            const appUser = {
              ...firebaseUser,
              role: userData.role as UserRole,
              profile: userData.profile
            } as AppUser;
            
            setUser(appUser);
            
            console.log('🍪 Setting cookies with role:', userData.role);
            
            // Set auth cookies for middleware
            document.cookie = `auth-token=${await firebaseUser.getIdToken()}; path=/; max-age=3600`;
            document.cookie = `user-role=${userData.role}; path=/; max-age=3600`;
          } else {
            console.log('⚠️ No user document found, creating default profile');
            console.log('📧 User email:', firebaseUser.email);
            
            // For demo accounts, try to determine role from email
            let defaultRole: UserRole = 'student';
            
            if (firebaseUser.email) {
              if (firebaseUser.email.includes('admin') || firebaseUser.email.includes('principal') || firebaseUser.email.includes('headteacher')) {
                defaultRole = 'admin';
              } else if (firebaseUser.email.includes('teacher')) {
                defaultRole = 'teacher';
              } else if (firebaseUser.email.includes('parent')) {
                defaultRole = 'parent';
              } else if (firebaseUser.email === 'student@stmarysschool.edu.ng') {
                defaultRole = 'student';
              }
            }
            
            console.log('🎭 Determined default role:', defaultRole);
            
            // Create default profile if doesn't exist
            const defaultProfile = {
              role: defaultRole,
              profile: {
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                createdAt: new Date()
              }
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile);
            const appUser = {
              ...firebaseUser,
              ...defaultProfile
            } as AppUser;
            
            setUser(appUser);
            
            console.log('🍪 Setting cookies with default role:', defaultProfile.role);
            
            // Set auth cookies for middleware
            document.cookie = `auth-token=${await firebaseUser.getIdToken()}; path=/; max-age=3600`;
            document.cookie = `user-role=${defaultProfile.role}; path=/; max-age=3600`;
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(null);
          // Clear cookies on error
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        }
      } else {
        setUser(null);
        // Clear cookies when signed out
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clear cookies before signing out
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const createAccount = async (email: string, password: string, role: UserRole, profile: any) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // Create user profile in Firestore
      const userProfile = {
        role,
        profile: {
          ...profile,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      await setDoc(doc(db, 'users', newUser.uid), userProfile);
    } catch (error) {
      console.error('Account creation error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    createAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
