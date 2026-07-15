import { createClient } from '@/lib/supabase/server'
import { createGoal, addToGoal, deleteGoal } from '../actions'
import { ArrowLeft, Plus, Trash2, Target } from 'lucide-react'
import Link from 'next/link'

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)' }}><ArrowLeft size={20} /></Link>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Metas de Ahorro</h2>
      </header>

      {/* Goals List */}
      {goals && goals.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {goals.map(goal => {
            const progress = goal.target_amount > 0
              ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
              : 0

            return (
              <div key={goal.id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={18} color="var(--accent)" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{goal.name}</h3>
                  </div>
                  <form action={deleteGoal}>
                    <input type="hidden" name="id" value={goal.id} />
                    <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>
                      <Trash2 size={14} />
                    </button>
                  </form>
                </div>

                {/* Progress bar */}
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '10px', marginBottom: '8px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: progress >= 100
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : 'linear-gradient(90deg, var(--primary), var(--accent))',
                    borderRadius: '8px',
                    transition: 'width 0.5s ease',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--muted)' }}>${goal.current_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  <span style={{ fontWeight: 600 }}>${goal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>

                {goal.deadline && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '10px' }}>
                    Fecha límite: {new Date(goal.deadline).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}

                {progress < 100 && (
                  <form action={addToGoal} style={{ display: 'flex', gap: '8px' }}>
                    <input type="hidden" name="id" value={goal.id} />
                    <input
                      name="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      placeholder="Monto"
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--card-border)', color: 'white', fontSize: '0.9rem', outline: 'none',
                      }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
                      Agregar
                    </button>
                  </form>
                )}

                {progress >= 100 && (
                  <p style={{ textAlign: 'center', color: '#4ade80', fontWeight: 600, fontSize: '0.9rem' }}>🎉 ¡Meta alcanzada!</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create form */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Nueva Meta
        </h3>
        <form action={createGoal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            name="name"
            type="text"
            required
            placeholder="Nombre (ej: Viaje, iPhone, Fondo de emergencia)"
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          />
          <input
            name="target_amount"
            type="number"
            step="0.01"
            min="1"
            required
            placeholder="Monto objetivo"
            style={{
              padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Fecha límite (opcional)</label>
            <input
              name="deadline"
              type="date"
              style={{
                padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--card-border)', color: 'white', fontSize: '0.95rem', outline: 'none',
                colorScheme: 'dark',
              }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Crear Meta</button>
        </form>
      </div>
    </div>
  )
}
