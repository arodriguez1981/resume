import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import Stripe from 'https://esm.sh/stripe@13.11.0';
serve(async (req)=>{
  try {
    // Get the stripe signature from headers
    const signature = req.headers.get('stripe-signature');
    if (!signature) throw new Error('No stripe signature found');
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16'
    });
    // Get the raw body
    const body = await req.text();
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, Deno.env.get('STRIPE_WEBHOOK_SECRET') || '');
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) throw new Error('Missing Supabase credentials');
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Handle different event types
    switch(event.type){
      case 'checkout.session.completed':
        {
          const session = event.data.object;
          const { userId, plan } = session.metadata;
          // Update user payments
          await supabase.from('user_payments').insert({
            user_id: userId,
            plan,
            amount: session.amount_total,
            status: 'completed',
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent
          });
          break;
        }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        {
          const subscription = event.data.object;
          // Get user from stripe customer
          const { data: customer } = await supabase.from('stripe_customers').select('user_id').eq('stripe_customer_id', subscription.customer).single();
          if (!customer) break;
          // Update subscription status
          if (subscription.status === 'active') {
            await supabase.from('user_payments').update({
              status: 'completed'
            }).eq('user_id', customer.user_id).eq('plan', 'pro');
          } else {
            await supabase.from('user_payments').update({
              status: 'cancelled'
            }).eq('user_id', customer.user_id).eq('plan', 'pro');
          }
          break;
        }
    }
    return new Response(JSON.stringify({
      received: true
    }), {
      headers: {
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
        'Content-Type': 'application/json'
      }
    });
  }
});
