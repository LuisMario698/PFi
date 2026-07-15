import { createClient } from '@/lib/supabase/server'
import { createCategory, deleteCategory } from '../actions'
import { ArrowLeft, Trash2, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', user!.id)
    .order('type', { ascending: true })
    .order('name', { ascending: true })

  const expenseCategories = (categories || []).filter(c => c.type === 'expense')
  const incomeCategories = (categories || []).filter(c => c.type === 'income')

  const colorOptions = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#6b7280'
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)' }}><ArrowLeft size={20} /></Link>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Categorías</h2>
      </header>

      {/* Expense Categories */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#f87171' }}>Gastos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {expenseCategories.map(cat => (
            <div key={cat.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: cat.color || '#6b7280' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{cat.name}</p>
              </div>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={cat.id} />
                <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>
                  <Trash2 size={14} />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Income Categories */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px', color: '#4ade80' }}>Ingresos</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {incomeCategories.map(cat => (
            <div key={cat.id} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: cat.color || '#6b7280' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{cat.name}</p>
              </div>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={cat.id} />
                <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: '4px' }}>
                  <Trash2 size={14} />
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>

      {/* Create form */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Nueva Categoría
        </h3>
        <form action={createCategory} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            name="name"
            type="text"
            required
            placeholder="Nombre de la categoría"
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
            <option value="expense" style={{ background: '#18181b' }}>Gasto</option>
            <option value="income" style={{ background: '#18181b' }}>Ingreso</option>
          </select>

          {/* Color picker */}
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '8px' }}>Color</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {colorOptions.map((color, i) => (
                <label key={color} style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    defaultChecked={i === 0}
                    style={{ display: 'none' }}
                  />
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px', background: color,
                    border: '2px solid transparent',
                  }} />
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Agregar Categoría</button>
        </form>
      </div>
    </div>
  )
}
