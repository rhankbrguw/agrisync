import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing Authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    if (userError || !user) throw new Error(`Unauthorized: ${userError?.message}`);

    // Get company ID to link the payment
    const { data: profile } = await supabase.from('employees').select('company_id').eq('auth_id', user.id).single();
    if (!profile?.company_id) throw new Error('Company not found');

    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY');
    if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY is not configured');

    const orderId = `PRO-${profile.company_id.substring(0, 8)}-${crypto.randomUUID().substring(0, 8)}`;
    
    // Call Midtrans SNAP API
    const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(serverKey + ':')}`
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: orderId,
          gross_amount: 299000 // Rp 299.000 untuk paket PRO
        },
        credit_card: { secure: true },
        customer_details: {
          first_name: user.email?.split('@')[0],
          email: user.email,
        },
        custom_field1: profile.company_id, // Store company_id for the webhook
        custom_field2: 'PRO_TIER'
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Midtrans API Error: ${data.error_messages?.join(', ') || 'Unknown error'}`);
    }

    return new Response(
      JSON.stringify({ snapToken: data.token }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
