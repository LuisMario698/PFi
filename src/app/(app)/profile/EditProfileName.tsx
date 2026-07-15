'use client'

import { useState } from 'react'
import { updateProfileName } from '@/app/(app)/actions'
import { Pencil, Check, X } from 'lucide-react'

export function EditProfileName({ initialName }: { initialName: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!name.trim() || name === initialName) {
      setIsEditing(false)
      setName(initialName)
      return
    }

    setLoading(true)
    await updateProfileName(name)
    setLoading(false)
    setIsEditing(false)
  }

  function handleCancel() {
    setIsEditing(false)
    setName(initialName)
  }

  if (isEditing) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
        <input 
          autoFocus
          value={name} 
          onChange={e => setName(e.target.value)}
          disabled={loading}
          style={{ 
            padding: '6px 12px', 
            borderRadius: '8px', 
            border: '1px solid var(--card-border)', 
            background: 'rgba(0,0,0,0.2)', 
            color: 'white',
            fontSize: '1rem',
            width: '160px',
            outline: 'none'
          }}
        />
        <button onClick={handleSave} disabled={loading} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Check size={16} />
        </button>
        <button onClick={handleCancel} disabled={loading} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <p style={{ fontWeight: 600, fontSize: '1rem' }}>{initialName}</p>
      <button 
        onClick={() => setIsEditing(true)} 
        style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
        title="Editar nombre"
      >
        <Pencil size={14} />
      </button>
    </div>
  )
}
