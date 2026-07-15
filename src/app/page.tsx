import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', gap: '2rem' }}>
      <div>
        <h1>PFi</h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '340px', margin: '0 auto' }}>
          Tu app de finanzas personales. Simple, clara y sin complicaciones.
        </p>
      </div>
      <Link href="/login" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        Comenzar <ArrowRight size={18} />
      </Link>
    </div>
  )
}
