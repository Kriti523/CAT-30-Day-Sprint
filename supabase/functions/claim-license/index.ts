// Supabase Edge Function: checks a Gumroad license key and unlocks the full app for the signed-in account.
// Deploy:  supabase functions deploy claim-license
// Secrets: supabase secrets set GUMROAD_PRODUCT_ID=<your product id>   (SUPABASE_URL and the service key are provided)
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { claimLicense, type Verification } from './claim.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Use POST.' });

  const productId = Deno.env.get('GUMROAD_PRODUCT_ID');
  if (!productId) return json(500, { ok: false, error: 'Purchases are not set up yet (GUMROAD_PRODUCT_ID is missing).' });
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return json(401, { ok: false, error: 'Sign in first, then enter your license key.' });

  const body = await req.json().catch(() => ({}));
  const result = await claimLicense(user.id, body?.licenseKey, {
    verify: async (licenseKey) => {
      const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
        method: 'POST',
        body: new URLSearchParams({ product_id: productId, license_key: licenseKey, increment_uses_count: 'false' }),
      });
      return (await res.json().catch(() => ({ success: false }))) as Verification;
    },
    ownerOf: async (licenseKey) => {
      const { data } = await admin.from('entitlements').select('user_id').eq('license_key', licenseKey).maybeSingle();
      return data?.user_id ?? null;
    },
    grant: async (userId, licenseKey, email) => {
      const { error } = await admin.from('entitlements')
        .upsert({ user_id: userId, license_key: licenseKey, purchase_email: email, verified_at: new Date().toISOString() }, { onConflict: 'user_id' });
      if (error) throw error;
    },
  });
  return json(result.ok ? 200 : 400, result);
});
