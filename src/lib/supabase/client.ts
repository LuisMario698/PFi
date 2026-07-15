import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Las variables de entorno estarán en .env.local
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
