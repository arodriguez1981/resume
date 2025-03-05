import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  isPlusUser: boolean;
  isPremiumUser: boolean;
  isProUser: boolean;
}

export async function signOut() {
  try {
    // Clear auth state
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });

    // Force reload to ensure all state is cleared
    window.location.href = '/';
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
}

async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
}

async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw new Error(error.message || 'Failed to sign up');
  }
}

export async function getUserSubscription(userId: string): Promise<{ 
  isPlusUser: boolean; 
  isPremiumUser: boolean; 
  isProUser: boolean 
}> {
  try {
    const { data: payments, error } = await supabase
      .from('user_payments')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['completed', 'canceled_at_period_end'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Check for active subscriptions based on plan and validity period
    const now = new Date();
    
    // Find active plans
    const activePlans = payments?.filter(payment => {
      // If the payment has an end_date (for canceled subscriptions), use that
      if (payment.end_date) {
        const endDate = new Date(payment.end_date);
        return now <= endDate;
      }
      
      // Otherwise calculate based on plan duration
      const createdAt = new Date(payment.created_at);
      let validUntil: Date;
      
      // Calculate validity period based on plan
      if (payment.plan === 'plus') {
        validUntil = new Date(createdAt);
        validUntil.setDate(validUntil.getDate() + 7); // 7 days for Plus
      } else if (payment.plan === 'premium') {
        validUntil = new Date(createdAt);
        validUntil.setDate(validUntil.getDate() + 7); // 7 days for Premium
      } else if (payment.plan === 'pro') {
        // For Pro, if it's a subscription, check if it's active
        if (payment.stripe_subscription_id) {
          // If it has next_billing_date, it's an active subscription
          if (payment.next_billing_date) {
            return true;
          }
          
          // Otherwise use the 3-week period
          validUntil = new Date(createdAt);
          validUntil.setDate(validUntil.getDate() + 21); // 3 weeks for Pro
        } else {
          // Legacy one-time Pro payment
          validUntil = new Date(createdAt);
          validUntil.setDate(validUntil.getDate() + 21); // 3 weeks for Pro
        }
      } else {
        return false; // Unknown plan
      }
      
      return now <= validUntil;
    });

    const isPlusUser = !!activePlans?.find(p => p.plan === 'plus');
    const isPremiumUser = !!activePlans?.find(p => p.plan === 'premium');
    const isProUser = !!activePlans?.find(p => p.plan === 'pro');

    return {
      isPlusUser: isPlusUser || isPremiumUser || isProUser, // Plus features included in Premium and Pro
      isPremiumUser: isPremiumUser || isProUser, // Premium features included in Pro
      isProUser: isProUser
    };
  } catch (error: any) {
    console.error('Error getting user subscription:', error);
    return { isPlusUser: false, isPremiumUser: false, isProUser: false };
  }
}