'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createTransaction } from '../actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Account = { id: string; name: string }
type Category = { id: string; name: string; type: string; color: string | null }

export default function AddTransactionPage() {
  const [type, setType] = useState<'expense' | 'income'>('expense')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [accRes, catRes] = await Promise.all([
        supabase.from('accounts').select('id, name').eq('user_id', user.id),
        supabase.from('categories').select('id, name, type, color').eq('user_id', user.id),
      ])
      setAccounts(accRes.data || [])
      setCategories(catRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filteredCategories = categories.filter(c => c.type === type)

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}><p>Cargando...</p></div>
  }

  if (accounts.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: '16px' }}>
        <p>Primero necesitas crear una cuenta.</p>
        <Link href="/accounts" className="btn-primary">Crear Cuenta</Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)' }}><ArrowLeft size={20} /></Link>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Nuevo Movimiento</h2>
      </header>

      {/* Type Toggle */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setType('expense')}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
            background: type === 'expense' ? 'rgba(239, 68, 68, 0.2)' : 'var(--card-bg)',
            color: type === 'expense' ? '#f87171' : 'var(--muted)',
            border: type === 'expense' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--card-border)',
          }}
        >
          Gasto
        </button>
        <button
          onClick={() => setType('income')}
          style={{
            flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem',
            background: type === 'income' ? 'rgba(34, 197, 94, 0.2)' : 'var(--card-bg)',
            color: type === 'income' ? '#4ade80' : 'var(--muted)',
            border: type === 'income' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--card-border)',
          }}
        >
          Ingreso
        </button>
      </div>

      <form action={createTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <input type="hidden" name="type" value={type} />

        {/* Amount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Monto</label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="0.00"
            style={{
              padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '1.5rem',
              fontWeight: 600, textAlign: 'center', outline: 'none',
            }}
          />
        </div>

        {/* Account */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Cuenta</label>
          <select
            name="account_id"
            required
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          >
            {accounts.map(a => (
              <option key={a.id} value={a.id} style={{ background: '#18181b' }}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Categoría</label>
          <select
            name="category_id"
            required
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          >
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#18181b' }}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Nota (opcional)</label>
          <input
            name="notes"
            type="text"
            placeholder="Ej: Almuerzo, Uber, Netflix..."
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          />
        </div>

        {/* Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Fecha</label>
          <input
            name="date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
              colorScheme: 'dark',
            }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
          Guardar
        </button>
      </form>
    </div>
  )
}
