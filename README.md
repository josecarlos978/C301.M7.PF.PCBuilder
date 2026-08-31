# CyM — Configurador de PCs + CRM

Proyecto final de curso: tienda pública con configurador de PCs (compatibilidad de piezas validada automáticamente) y panel administrativo (CRM) para **CyM Computadoras e Ingeniería**. Construido con Next.js y Prisma/PostgreSQL sobre la base de la plantilla [NextAdmin](https://nextadmin.co/).

Para el detalle de tecnologías, el problema que resuelve y una demostración del flujo de la aplicación, ver **[PRESENTACION.md](./PRESENTACION.md)**.

## Requisitos

- Node.js 20.9 o superior
- Una base de datos PostgreSQL (el proyecto usa [Neon](https://neon.tech/), pero cualquier Postgres sirve)

## Configuración

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz con estas variables:

   | Variable | Para qué sirve |
   |---|---|
   | `DATABASE_URL` | Cadena de conexión a PostgreSQL |
   | `NEXT_PUBLIC_WHATSAPP_ADMIN` | Número de WhatsApp del administrador (formato internacional, sin `+`), donde llegan las cotizaciones |
   | `ADMIN_USER` | Usuario para iniciar sesión en el panel admin |
   | `ADMIN_PASSWORD` | Contraseña del panel admin |
   | `SESSION_SECRET` | Clave para firmar la cookie de sesión del admin — generarla con `openssl rand -base64 32` |

3. Aplicar las migraciones de la base de datos:

   ```bash
   npx prisma migrate deploy
   ```

4. (Opcional) Cargar el catálogo de ejemplo. **Atención:** este comando borra y recrea productos, clientes y cotizaciones — no correrlo sobre una base de datos con datos reales:

   ```bash
   npm run seed
   ```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) — es la tienda pública. El panel admin está en `/admin` (pide login).

## Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (Turbopack) |
| `npm run build` | Compila la app para producción |
| `npm run start` | Sirve la build de producción |
| `npm run lint` | Corre ESLint |
| `npm run seed` | Resetea y carga el catálogo de productos de ejemplo |

## Estructura del proyecto

```
src/
  app/
    (tienda)/          # tienda pública: home, catálogo, configurador
    (with-layouts)/     # panel admin: dashboard, productos, clientes, cotizaciones, reportes
    login/               # login del admin
    api/                 # route handlers (REST interno)
  components/
    tailgrids/core/      # design system (Button, Card, Dialog, Sheet, ...)
    common/               # header, sidebar del admin
    tienda/               # componentes de la tienda pública
    crm/                  # componentes compartidos del CRM
  services/
    api/                  # un folder por feature (productos, clientes, cotizaciones, reportes, auth)
    pcbuilder/            # reglas de compatibilidad del configurador
  lib/                    # sesión de admin, cliente de Prisma
prisma/
  schema.prisma           # modelo de datos
  migrations/              # historial de migraciones
  seed.ts                  # catálogo de ejemplo
  scripts/                 # scripts puntuales de mantenimiento de datos
```

Convenciones de código y reglas para agentes de IA en [`AGENTS.md`](./AGENTS.md).

## Documentación adicional

Todo lo demás (especificaciones, guía de seed, credenciales, documentos de UX/UI, deuda técnica conocida) está en [`documentos/`](./documentos).

## Créditos

Basado en la plantilla open-source [NextAdmin](https://github.com/NextAdminHQ/nextjs-admin-dashboard), personalizada para CyM Computadoras e Ingeniería.
