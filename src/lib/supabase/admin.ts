import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Usa la service role key: ignora RLS. Solo para codigo de servidor
// de confianza (webhooks), nunca exponer al cliente.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
