"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, Target, User, LayoutGrid } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <Link href="/dashboard" className={`nav-item ${pathname === "/dashboard" ? "active" : ""}`}>
        <Home size={22} />
        <span>Inicio</span>
      </Link>

      <Link href="/categories" className={`nav-item ${pathname === "/categories" ? "active" : ""}`}>
        <LayoutGrid size={22} />
        <span>Categorías</span>
      </Link>

      <Link href="/add" className="nav-item">
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

      <Link href="/goals" className={`nav-item ${pathname === "/goals" ? "active" : ""}`}>
        <Target size={22} />
        <span>Metas</span>
      </Link>

      <Link href="/profile" className={`nav-item ${pathname === "/profile" ? "active" : ""}`}>
        <User size={22} />
        <span>Perfil</span>
      </Link>
    </nav>
  );
}
