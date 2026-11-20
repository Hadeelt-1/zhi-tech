import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** False until both public values are set (in .env.local and on Vercel). */
export const supabaseConfigured = Boolean(url && key && key.startsWith("sb_publishable_"));

let client: SupabaseClient | null = null;

/**
 * Browser-only Supabase client. The session is kept in cookies by @supabase/ssr.
 * Call it inside effects or event handlers, never during render (pages are prerendered).
 * Security comes from Row Level Security in the database, not from hiding this key.
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured || typeof window === "undefined") return null;
  if (!client) client = createBrowserClient(url!, key!);
  return client;
}
