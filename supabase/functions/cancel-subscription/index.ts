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
    const { subscriptionId, reason } = await req.json();
    
    if (!subscriptionId) {
      return new Response(
        JSON.stringify({ error: 'Subscription ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
      cancellation_details: {
        comment: reason || 'Canceled by user',
      },
    });

    // Get the current end date of the subscription
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    // Update the subscription status in the database
    const { error: updateError } = await supabaseAdmin
      .from('user_payments')
      .update({
        cancellation_date: new Date().toISOString(),
        cancellation_reason: reason || 'No reason provided',
        end_date: currentPeriodEnd.toISOString(),
        status: 'canceled_at_period_end'
      })
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating subscription in database:', updateError);
      // Continue anyway since the Stripe cancellation was successful
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Subscription will be canceled at the end of the billing period',
        endDate: currentPeriodEnd.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error canceling subscription:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while canceling the subscription'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});