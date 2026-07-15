import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h1>Dashboard</h1>
        <p>Bienvenido de vuelta, {user.email}</p>
      </header>
      
      <div className="glass-card">
        <h3>Tus Finanzas</h3>
        <p>Aquí construiremos la vista general de tus cuentas y transacciones.</p>
      </div>

      <form action="/auth/signout" method="post">
        <button className="btn-primary" type="submit" style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>
          Cerrar Sesión
        </button>
      </form>
    </div>
  );
}
