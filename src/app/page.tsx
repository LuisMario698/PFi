import { Wallet, TrendingUp, PieChart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      <header style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Domina tus Finanzas</h1>
        <p style={{ fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
          PFi es la forma más intuitiva, didáctica y moderna de llevar el control de tus ingresos, 
          gastos y metas. Toma el control de tu futuro hoy mismo.
        </p>
        <div style={{ marginTop: "2rem" }}>
          <Link href="/login" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            Comenzar Ahora <ArrowRight size={18} />
          </Link>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "10px", color: "var(--primary)" }}>
              <Wallet size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Control de Gastos</h3>
          </div>
          <p>
            Registra tus gastos diarios con una interfaz extremadamente simple y didáctica. 
            Categoriza y descubre a dónde va tu dinero.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", background: "rgba(34, 211, 238, 0.1)", borderRadius: "10px", color: "var(--accent)" }}>
              <TrendingUp size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Crecimiento</h3>
          </div>
          <p>
            Establece metas financieras claras y visualiza tu progreso en tiempo real con 
            micro-animaciones gratificantes que te mantendrán motivado.
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ padding: "10px", background: "rgba(161, 161, 170, 0.1)", borderRadius: "10px", color: "var(--foreground)" }}>
              <PieChart size={24} />
            </div>
            <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Análisis Profundo</h3>
          </div>
          <p>
            Obtén reportes detallados y fáciles de digerir. Aprende de tus hábitos financieros 
            a través de insights generados para ti.
          </p>
        </div>
      </section>
    </div>
  );
}
