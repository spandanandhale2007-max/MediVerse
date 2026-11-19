import { createClient } from '@supabase/supabase-js'

// Supabase client. The publishable key is public by design — it ships in the
// browser bundle and grants nothing on its own. Real access control lives in
// Row Level Security policies in Postgres (supabase/schema.sql): the DB decides
// what each request sees from the login JWT, so a user can't read another's
// health record even by crafting their own API call.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Checked at runtime: without a .env.local the app must still run, falling back
// to the existing localStorage behaviour rather than crashing on import.
export const isSupabaseConfigured = Boolean(url && key)

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

// Have the tables been created yet? Lets setup checks tell "not configured"
// apart from "configured but schema.sql hasn't been run" — different fixes.
export async function checkSchema() {
  if (!supabase) return { ok: false, reason: 'not-configured' }
  const { error } = await supabase.from('hospitals').select('id', { count: 'exact', head: true })
  if (!error) return { ok: true }
  // PGRST205 = table missing, i.e. schema.sql not run.
  if (error.code === 'PGRST205' || /does not exist/i.test(error.message)) {
    return { ok: false, reason: 'no-schema', error }
  }
  return { ok: false, reason: 'error', error }
}
