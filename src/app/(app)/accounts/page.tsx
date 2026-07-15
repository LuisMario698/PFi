import { createClient } from '@/lib/supabase/server'
import { createAccount, deleteAccount } from '../actions'
import { ArrowLeft, Trash2, Plus, Wallet, CreditCard, Banknote } from 'lucide-react'
import Link from 'next/link'

export default async function AccountsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true })

  const typeLabels: Record<string, string> = { bank: 'Banco', cash: 'Efectivo', credit: 'Crédito' }
  const typeIcons: Record<string, React.ReactNode> = {
    bank: <Banknote size={20} />,
    cash: <Wallet size={20} />,
    credit: <CreditCard size={20} />,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)' }}><ArrowLeft size={20} /></Link>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Cuentas</h2>
      </header>

      {/* List */}
      {accounts && accounts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {accounts.map(account => (
            <div key={account.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: 'var(--primary)' }}>{typeIcons[account.type]}</div>
                <div>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{account.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{typeLabels[account.type]}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <form action={deleteAccount}>
                  <input type="hidden" name="id" value={account.id} />
                  <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Nueva Cuenta
        </h3>
        <form action={createAccount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            name="name"
            type="text"
            required
            placeholder="Nombre (ej: Banco BBVA, Efectivo)"
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          />
          <select
            name="type"
            required
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          >
            <option value="bank" style={{ background: '#18181b' }}>Banco</option>
            <option value="cash" style={{ background: '#18181b' }}>Efectivo</option>
            <option value="credit" style={{ background: '#18181b' }}>Crédito</option>
          </select>
          <input
            name="balance"
            type="number"
            step="0.01"
            defaultValue="0"
            placeholder="Balance inicial"
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          />
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Agregar Cuenta</button>
        </form>
      </div>
    </div>
  )
}
