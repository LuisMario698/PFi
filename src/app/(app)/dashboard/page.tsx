import { createClient } from '@/lib/supabase/server'
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch real accounts
  const { data: accounts } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: true })

  // Fetch transactions for current month
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name, color)')
    .eq('user_id', user!.id)
    .gte('date', startOfMonth)
    .lte('date', endOfMonth)
    .order('date', { ascending: false })

  // Calculate totals
  const totalBalance = (accounts || []).reduce((sum, a) => sum + a.balance, 0)
  const monthIncome = (transactions || []).filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const monthExpense = (transactions || []).filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '2px' }}>Hola,</p>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{displayName}</h2>
        </div>
      </header>

      {/* Balance Card */}
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(34, 211, 238, 0.08) 100%)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '4px' }}>Balance Total</p>
        <h1 style={{ fontSize: '2rem', margin: 0, background: 'none', WebkitTextFillColor: 'white' }}>
          ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </h1>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', background: 'rgba(34, 197, 94, 0.2)', borderRadius: '10px', color: '#4ade80' }}>
              <ArrowUpRight size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Ingresos</p>
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>${monthIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px', color: '#f87171' }}>
              <ArrowDownRight size={18} />
            </div>
            <div>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Gastos</p>
              <p style={{ fontWeight: 600, fontSize: '0.85rem' }}>${monthExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Cuentas</h3>
          <Link href="/accounts" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Ver todas</Link>
        </div>
        {(!accounts || accounts.length === 0) ? (
          <Link href="/accounts" className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '14px', textDecoration: 'none' }}>
            <Wallet size={20} color="var(--muted)" />
            <p style={{ fontSize: '0.875rem' }}>Agrega tu primera cuenta →</p>
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {accounts.map(account => (
              <div key={account.id} className="glass-panel" style={{ minWidth: '130px', padding: '14px', borderRadius: '14px', flexShrink: 0 }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px' }}>{account.name}</p>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>Movimientos del mes</h3>
        {(!transactions || transactions.length === 0) ? (
          <Link href="/add" className="glass-panel" style={{ display: 'block', padding: '16px', borderRadius: '14px', textAlign: 'center', textDecoration: 'none' }}>
            <p style={{ fontSize: '0.875rem' }}>No hay movimientos aún. Agrega uno →</p>
          </Link>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {transactions.slice(0, 10).map(tx => {
              const cat = tx.categories as { name: string; color: string } | null
              return (
                <div key={tx.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat?.color || 'var(--muted)' }} />
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--foreground)' }}>{cat?.name || 'Sin categoría'}</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                        {tx.notes || new Date(tx.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <p style={{
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    color: tx.type === 'income' ? '#4ade80' : '#f87171'
                  }}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
