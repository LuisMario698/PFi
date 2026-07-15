"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Target, User, PieChart } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <Link href="/dashboard" prefetch={true} className={`nav-item ${pathname === "/dashboard" ? "active" : ""}`}>
        <Home size={22} />
        <span>Inicio</span>
      </Link>

      <Link href="/analytics" prefetch={true} className={`nav-item ${pathname === "/analytics" ? "active" : ""}`}>
        <PieChart size={22} />
        <span>Reportes</span>
      </Link>

      <Link href="/add" prefetch={true} className="nav-item">
        <div style={{
          background: "linear-gradient(135deg, var(--primary), #60a5fa)",
          borderRadius: "50%",
          padding: "12px",
          color: "white",
          transform: "translateY(-12px)",
          boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)"
        }}>
          <PlusCircle size={26} />
        </div>
      </Link>

      <Link href="/goals" prefetch={true} className={`nav-item ${pathname === "/goals" ? "active" : ""}`}>
        <Target size={22} />
        <span>Metas</span>
      </Link>

      <Link href="/profile" prefetch={true} className={`nav-item ${pathname === "/profile" ? "active" : ""}`}>
        <User size={22} />
        <span>Perfil</span>
      </Link>
    </nav>
  );
}
