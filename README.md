# PFi - Aplicación de Finanzas Personales

## Contexto del Proyecto
PFi es una aplicación Progressive Web App (PWA) de finanzas personales, alojada en Vercel y conectada a Supabase. Se caracteriza por un diseño hiper-premium, moderno (con *glassmorphism*, micro-animaciones, colores oscuros/vibrantes) y un enfoque didáctico para asegurar que sea completamente entendible por cualquier usuario.

### Stack Tecnológico
- **Frontend:** Next.js (App Router), React 19.
- **Estilos:** Vanilla CSS (para máximo control sobre la estética y animaciones premium).
- **Backend & Auth:** Supabase (Autenticación y Base de Datos).
- **PWA:** Capacidades de instalación nativa a través de `manifest.ts` y Service Workers.
- **Despliegue:** Vercel.

## Decisiones Técnicas y Estado (Sprint Actual)
- **Sprint 2 (Base de Datos):** Hemos estructurado exitosamente el modelo de base de datos en Supabase.
  - Tablas Core: `profiles`, `accounts`, `categories`, `transactions` y `goals`.
  - Seguridad Habilitada: Se han añadido políticas de **Row Level Security (RLS)** que protegen cada tabla vinculándola con `auth.uid()`. Se ha configurado un trigger para la generación automática de los `profiles` tras cada nuevo registro en `auth.users`.
  - Tipado Estricto: Los tipos de TypeScript han sido autogenerados directamente desde Supabase en `src/types/database.types.ts` y vinculados a los clientes de navegador y servidor de `@supabase/ssr`.
- **Estética:** Glassmorphism con un modo oscuro por defecto (Vanilla CSS).
- **ORM:** Nos conectaremos mediante el cliente `@supabase/supabase-js` para mantener un proyecto ligero y reactivo, maximizando el uso de las APIs tipo REST generadas por Supabase.

## Guía de Verificación y Comandos
Para levantar el entorno local:
```bash
pnpm install
pnpm dev
```
Para verificar la compilación:
```bash
pnpm build
pnpm lint
```

*Este archivo README es un documento vivo y se actualizará a lo largo del desarrollo para reflejar los cambios, estructura de datos y próximos pasos.*
