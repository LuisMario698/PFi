# PFi - Aplicación de Finanzas Personales

## Contexto del Proyecto
PFi es una Progressive Web App (PWA) de finanzas personales mobile-first, alojada en Vercel y conectada a Supabase. Diseñada para ser completamente funcional, sin complicaciones y fácil de usar.

### Stack Tecnológico
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Estilos:** Vanilla CSS (glassmorphism, dark mode, mobile-first 480px max)
- **Backend & Auth:** Supabase (Auth + PostgreSQL + RLS)
- **PWA:** `@ducanh2912/next-pwa` + `manifest.ts`
- **Despliegue:** Vercel

## Estructura de Rutas
```
/                → Landing (redirige a /dashboard si hay sesión)
/login           → Login / Registro (toggle entre ambos modos)
/dashboard       → Balance total, ingresos/gastos del mes, últimas transacciones
/add             → Agregar ingreso o gasto (seleccionar cuenta, categoría, monto)
/accounts        → CRUD de cuentas financieras (banco, efectivo, crédito)
/categories      → CRUD de categorías de ingresos y gastos
/goals           → Metas de ahorro con barras de progreso
/profile         → Info del usuario + cerrar sesión
```

## Base de Datos (Supabase)
### Tablas
- `profiles` — Extende `auth.users` (trigger automático al registrarse)
- `accounts` — Cuentas financieras (bank, cash, credit) con balance
- `categories` — Categorías de ingreso/gasto (seed automático al registrarse)
- `transactions` — Movimientos vinculados a cuenta + categoría
- `goals` — Metas de ahorro con monto objetivo y progreso

### Seguridad
- **RLS habilitado** en todas las tablas
- Políticas: cada usuario solo puede ver/editar sus propios datos (`auth.uid() = user_id`)
- Trigger `handle_new_user` → crea perfil automáticamente
- Trigger `seed_default_categories` → crea 11 categorías predefinidas

## Arquitectura
- **Middleware** (`src/middleware.ts`) — Refresca tokens de auth en cada request
- **Server Actions** (`src/app/(app)/actions.ts`) — CRUD centralizado para accounts, categories, transactions, goals
- **Route Group `(app)`** — Layout autenticado con guard + BottomNav
- **Tipos generados** (`src/types/database.types.ts`) — Autocompletado 100% estricto

## Comandos
```bash
pnpm install
pnpm dev          # Desarrollo local
pnpm build        # Build de producción
pnpm lint         # Linting
```

*Este archivo se actualiza conforme avanza el desarrollo.*
