import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import Stripe from 'https://esm.sh/stripe@13.11.0';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // Get request data
    const { plan, userId } = await req.json();
    if (!plan || ![
      'premium',
      'pro'
    ].includes(plan)) {
      throw new Error('Invalid plan specified');
    }
    if (!userId) {
      throw new Error('Missing user ID');
    }
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) {
      throw new Error('Invalid user');
    }
    // Verify user ID matches authenticated user
    if (user.id !== userId) {
      throw new Error('User ID mismatch');
    }
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error('Missing Stripe secret key');
    }
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    });
    // Get or create Stripe customer
    const { data: customers, error: customerError } = await supabase.from('stripe_customers').select('stripe_customer_id').eq('user_id', user.id).single();
    if (customerError && customerError.code !== 'PGRST116') {
      throw customerError;
    }
    let stripeCustomerId = customers?.stripe_customer_id;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabaseUserId: user.id
        }
      });
      stripeCustomerId = customer.id;
      await supabase.from('stripe_customers').insert({
        user_id: user.id,
        stripe_customer_id: stripeCustomerId
      });
    }
    // Set price based on plan
    const priceId = plan === 'premium' ? Deno.env.get('STRIPE_PREMIUM_PRICE_ID') : Deno.env.get('STRIPE_PRO_PRICE_ID');
    if (!priceId) {
      throw new Error('Price ID not configured');
    }
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: [
        'card'
      ],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: plan === 'premium' ? 'payment' : 'subscription',
      success_url: `${Deno.env.get('PUBLIC_URL')}/editor?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${Deno.env.get('PUBLIC_URL')}/editor`,
      metadata: {
        userId: user.id,
        plan
      }
    });
    return new Response(JSON.stringify({
      sessionId: session.id
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
