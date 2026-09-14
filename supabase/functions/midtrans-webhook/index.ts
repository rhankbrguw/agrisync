import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Midtrans SHA512 Signature verification
async function verifySignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string, signatureKey: string) {
  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const hashBuffer = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex === signatureKey;
}

serve(async (req) => {
  try {
    const body = await req.json();
    const { 
      order_id, 
      status_code, 
      gross_amount, 
      signature_key, 
      transaction_status,
      custom_field1: companyId,
      custom_field2: tier
    } = body;

    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY');
    if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY not configured');

    // Security Check: Verify signature to ensure request came from Midtrans
    const isValid = await verifySignature(order_id, status_code, gross_amount, serverKey, signature_key);
    if (!isValid) {
      console.error('Invalid signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 403 });
    }

    // Process only successful payments
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      // Graceful event filter: Ignore transactions belonging to other projects (e.g. non-AgriSync)
      if (!companyId || tier !== 'PRO_TIER') {
        console.log(`Ignoring non-AgriSync transaction: ${order_id}`);
        return new Response(
          JSON.stringify({ status: 'ignored', message: 'Non-AgriSync transaction ignored gracefully' }),
          { headers: { 'Content-Type': 'application/json' }, status: 200 }
        );
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
      // 🚀 Best Practice: Use Service Role Key to bypass RLS for backend webhook logic
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Upgrade company limits safely
      const { error } = await supabase
        .from('companies')
        .update({ 
          subscription_tier: 'PRO', 
          max_workers: 50 
        })
        .eq('id', companyId);

      if (error) {
        console.error('Failed to provision company:', error);
        throw error;
      }
      
      console.log(`Successfully upgraded company ${companyId} to PRO`);
    }

    return new Response(JSON.stringify({ status: 'ok' }), { headers: { 'Content-Type': 'application/json' }, status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
});
