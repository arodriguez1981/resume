import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthState, getUserSubscription, signOut as authSignOut } from '../lib/auth';

interface AuthContextType extends AuthState {
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isPlusUser, setIsPlusUser] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  
  // Check if free premium features are enabled
  const freePremiumFeatures = import.meta.env.VITE_FREE_PREMIUM_FEATURES === 'true';

  const clearAuthState = () => {
    setUser(null);
    setIsPlusUser(false);
    setIsPremiumUser(false);
    setIsProUser(false);
  };

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        
        // If free premium features are enabled, set all subscription flags to true
        if (freePremiumFeatures) {
          setIsPlusUser(true);
          setIsPremiumUser(true);
          setIsProUser(true);
        } else {
          // Otherwise, get the actual subscription status
          getUserSubscription(session.user.id).then(({ isPlusUser, isPremiumUser, isProUser }) => {
            setIsPlusUser(isPlusUser);
            setIsPremiumUser(isPremiumUser);
            setIsProUser(isProUser);
          });
        }
      } else {
        // If no user is logged in but free premium features are enabled
        if (freePremiumFeatures) {
          setIsPlusUser(true);
          setIsPremiumUser(true);
          setIsProUser(true);
        } else {
          clearAuthState();
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // If free premium features are enabled, keep premium status even when signed out
        if (freePremiumFeatures) {
          setUser(null);
          setIsPlusUser(true);
          setIsPremiumUser(true);
          setIsProUser(true);
        } else {
          clearAuthState();
        }
      } else if (session?.user) {
        setUser(session.user);
        
        // If free premium features are enabled, set all subscription flags to true
        if (freePremiumFeatures) {
          setIsPlusUser(true);
          setIsPremiumUser(true);
          setIsProUser(true);
        } else {
          // Otherwise, get the actual subscription status
          const { isPlusUser, isPremiumUser, isProUser } = await getUserSubscription(session.user.id);
          setIsPlusUser(isPlusUser);
          setIsPremiumUser(isPremiumUser);
          setIsProUser(isProUser);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [freePremiumFeatures]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      
      if (error) throw error;

      if (data.user) {
        // If free premium features are enabled, set all subscription flags to true
        if (freePremiumFeatures) {
          setIsPlusUser(true);
          setIsPremiumUser(true);
          setIsProUser(true);
        } else {
          // Otherwise, get the actual subscription status
          const { isPlusUser, isPremiumUser, isProUser } = await getUserSubscription(data.user.id);
          setIsPlusUser(isPlusUser);
          setIsPremiumUser(isPremiumUser);
          setIsProUser(isProUser);
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/resume/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // First clear local state
      clearAuthState();
      
      // Then sign out from Supabase
      await supabase.auth.signOut();
      
      // If free premium features are enabled, keep premium status even after sign out
      if (freePremiumFeatures) {
        setUser(null);
        setIsPlusUser(true);
        setIsPremiumUser(true);
        setIsProUser(true);
      }
      
      // Navigate to home page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshSubscription = async () => {
    if (freePremiumFeatures) {
      // If free premium features are enabled, set all subscription flags to true
      setIsPlusUser(true);
      setIsPremiumUser(true);
      setIsProUser(true);
      return;
    }
    
    if (user) {
      try {
        const { isPlusUser: newIsPlusUser, isPremiumUser: newIsPremiumUser, isProUser: newIsProUser } = await getUserSubscription(user.id);
        setIsPlusUser(newIsPlusUser);
        setIsPremiumUser(newIsPremiumUser);
        setIsProUser(newIsProUser);
      } catch (error) {
        console.error('Error refreshing subscription:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      loading,
      user,
      isPlusUser,
      isPremiumUser,
      isProUser,
      signIn,
      signUp,
      signOut,
      refreshSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}