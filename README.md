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
- **Sprint Inicial:** Configuración del esqueleto PWA, integración de Supabase client y base del sistema de diseño (tokens de Vanilla CSS).
- **Estética:** Glassmorphism con un modo oscuro por defecto.
- **ORM:** Por el momento conectaremos mediante el cliente `@supabase/supabase-js`.

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
