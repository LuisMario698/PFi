import { createClient } from '@/lib/supabase/server'
import { LogOut, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { EditProfileName } from './EditProfileName'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const displayName = user?.user_metadata?.full_name || 'Usuario'
  const email = user?.email || ''
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Perfil</h2>
      </header>

      {/* User info */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.25rem', fontWeight: 700, color: 'white',
        }}>
          {initial}
        </div>
        <div>
          <EditProfileName initialName={displayName} />
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '2px' }}>{email}</p>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link href="/accounts" className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '12px', textDecoration: 'none' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Mis Cuentas</p>
          <ChevronRight size={18} color="var(--muted)" />
        </Link>
        <Link href="/categories" className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '12px', textDecoration: 'none' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Categorías</p>
          <ChevronRight size={18} color="var(--muted)" />
        </Link>
        <Link href="/goals" className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '12px', textDecoration: 'none' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Metas de Ahorro</p>
          <ChevronRight size={18} color="var(--muted)" />
        </Link>
      </div>

      {/* Logout */}
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          style={{
            width: '100%', padding: '14px', borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#f87171', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </form>
    </div>
  )
}
