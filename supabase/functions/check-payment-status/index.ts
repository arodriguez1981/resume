// Follow Deno deploy conventions
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
// @ts-ignore
import Stripe from 'https://esm.sh/stripe@12.18.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || '';

    // Initialize Supabase client with service role key for admin access
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Initialize Supabase client with the user's JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with the user's JWT
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get the user's ID from the JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Check if the session belongs to the current user
    const { data: paymentData, error: paymentError } = await supabaseAdmin
      .from('user_payments')
      .select('*')
      .eq('stripe_session_id', sessionId)
      .eq('user_id', user.id)
      .single();
      
    if (paymentError || !paymentData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment record not found or does not belong to the current user' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if payment is already completed
    if (paymentData.status === 'completed') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment already verified and completed',
          payment: {
            id: paymentData.id,
            plan: paymentData.plan,
            amount: paymentData.amount,
            status: paymentData.status,
            created_at: paymentData.created_at
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the session payment status is successful
    if (session.payment_status === 'paid') {
      // Update the payment status in the database
      const { error: updateError } = await supabaseAdmin
        .from('user_payments')
        .update({
          status: 'completed',
          stripe_payment_intent: session.payment_intent as string,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentData.id);

      if (updateError) {
        console.error('Error updating payment status:', updateError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Error updating payment status' 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // If this is a subscription, update subscription details
      if (session.subscription && paymentData.plan === 'pro') {
        try {
          // Get subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          // Update subscription details in the database
          await supabaseAdmin
            .from('user_payments')
            .update({
              stripe_subscription_id: subscription.id,
              next_billing_date: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', paymentData.id);
        } catch (subError) {
          console.error('Error updating subscription details:', subError);
          // Continue anyway since the payment was successful
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment verified and completed successfully',
          payment: {
            id: paymentData.id,
            plan: paymentData.plan,
            amount: paymentData.amount,
            status: 'completed',
            created_at: paymentData.created_at
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Payment not completed. Status: ${session.payment_status}` 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'An error occurred while checking payment status'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});