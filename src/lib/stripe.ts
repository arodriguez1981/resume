import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export async function createCheckoutSession(plan: 'plus' | 'premium' | 'pro') {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create Stripe checkout session through Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { 
        plan, 
        userId: user.id,
        isSubscription: plan === 'pro', // Only Pro plan is a subscription
        returnUrl: window.location.origin + '/profile' // Redirect to profile page after payment
      }
    });

    if (error) {
      console.error('Supabase request failed', error);
      throw error;
    }

    if (!data?.sessionId) {
      throw new Error('No session ID returned');
    }

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (stripeError) {
      console.error('Stripe redirect error:', stripeError);
      throw stripeError;
    }

  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    throw new Error(error.message || 'Failed to start checkout process');
  }
}

export async function cancelSubscription(subscriptionId: string, reason?: string) {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { 
        subscriptionId,
        reason
      }
    });

    if (error) {
      console.error('Cancellation request failed', error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Subscription cancellation error:', error);
    throw new Error(error.message || 'Failed to cancel subscription');
  }
}

export async function checkPaymentStatus(sessionId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('check-payment-status', {
      body: { 
        sessionId
      }
    });

    if (error) {
      console.error('Payment status check failed', error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Payment status check error:', error);
    throw new Error(error.message || 'Failed to check payment status');
  }
}