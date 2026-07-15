import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Bienvenido a PFi</h2>
        
        {resolvedParams?.error && (
          <div style={{ 
            padding: '12px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}>
            {resolvedParams.error}
          </div>
        )}

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)' }}>
              Correo Electrónico
            </label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              placeholder="tu@correo.com"
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--card-border)',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--muted)' }}>
              Contraseña
            </label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              required 
              placeholder="••••••••"
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--card-border)',
                color: 'white',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <button formAction={login} className="btn-primary" style={{ width: '100%' }}>
              Iniciar Sesión
            </button>
            <button formAction={signup} className="btn-primary" style={{ width: '100%', background: 'transparent', border: '1px solid var(--card-border)' }}>
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
