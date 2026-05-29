import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const PRO_PRICES = new Set([
  Deno.env.get('STRIPE_PRO_MONTHLY_PRICE_ID'),
  Deno.env.get('STRIPE_PRO_ANNUAL_PRICE_ID'),
]);
const MAX_PRICES = new Set([
  Deno.env.get('STRIPE_MAX_MONTHLY_PRICE_ID'),
  Deno.env.get('STRIPE_MAX_ANNUAL_PRICE_ID'),
]);

function tierForPrice(priceId: string): string {
  if (MAX_PRICES.has(priceId)) return 'max';
  if (PRO_PRICES.has(priceId)) return 'pro';
  return 'free';
}

Deno.serve(async (req) => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response('Bad signature', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') break;

      const userId = session.subscription_data?.metadata?.supabase_user_id
        ?? session.metadata?.supabase_user_id;
      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0]?.price.id ?? '';
      const tier = tierForPrice(priceId);

      await supabase.from('profiles').update({ tier }).eq('id', userId);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      const priceId = subscription.items.data[0]?.price.id ?? '';
      const isActive = ['active', 'trialing'].includes(subscription.status);
      const tier = isActive ? tierForPrice(priceId) : 'free';

      await supabase.from('profiles').update({ tier }).eq('id', userId);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      await supabase.from('profiles').update({ tier: 'free' }).eq('id', userId);
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
