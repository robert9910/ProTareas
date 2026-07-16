App web para conectar asesores académicos con estudiantes. Next.js (App Router) + Supabase.

## Setup

1. Copia `.env.example` a `.env.local` y completa las variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=

   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API en Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: misma pantalla, sección "service_role secret". **Nunca la expongas al cliente ni la subas a git** — solo la usan las rutas de servidor (revisión de pagos).
   - `NEXT_PUBLIC_SITE_URL`: la URL pública donde corre la app. En local es `http://localhost:3000`.

2. Aplica el esquema de base de datos en el SQL Editor de Supabase, en orden:

   ```
   supabase/migrations/0001_init.sql
   supabase/migrations/0002_task_files_storage.sql
   supabase/migrations/0003_messaging_and_completion.sql
   supabase/migrations/0004_payments.sql
   supabase/migrations/0005_reviews.sql
   supabase/migrations/0006_manual_payments.sql
   supabase/migrations/0007_security_hardening.sql
   ```

3. Instala dependencias y levanta el servidor:

   ```bash
   npm install
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Cómo funciona el pago

No se usa una pasarela de pago: el estudiante deposita o transfiere manualmente a la cuenta del negocio y sube una foto del comprobante desde la página de la tarea. Ese pago queda en estado `pending_review` hasta que el administrador (la cuenta configurada en `ADMIN_EMAIL`, ver `src/lib/admin.ts`) lo revisa en `/admin/payments` y lo aprueba o rechaza:

- **Aprobar**: la propuesta pasa a `accepted`, la tarea a `assigned`, y las demás propuestas pendientes de esa tarea se rechazan automáticamente.
- **Rechazar**: el estudiante puede subir un nuevo comprobante para la misma propuesta.

Los datos de la cuenta para depositar están hardcodeados en `src/components/ProposalActions.tsx` (`BANK_ACCOUNT` / `BANK_HOLDER`) — actualízalos ahí si cambian.

## Seguridad

- Las reglas de acceso a la base de datos (RLS) son la barrera real: la app habla directo con Supabase desde el navegador con la clave pública (anon key), así que cualquier permiso que falte ahí es explotable saltándose la UI. `0007_security_hardening.sql` cerró varios huecos (un asesor podía auto-aprobarse su propia propuesta sin pago, proponerse a su propia tarea, un estudiante podía borrar una tarea ya pagada). Si agregas una tabla o política nueva, pregúntate siempre "¿qué puede hacer alguien llamando esto directo desde la consola del navegador?", no solo "qué permite la UI".
- `SUPABASE_SERVICE_ROLE_KEY` ignora RLS por completo — solo se usa en código de servidor (`src/lib/supabase/admin.ts`) para el webhook/revisión de pagos. Nunca debe tener el prefijo `NEXT_PUBLIC_` ni llegar al cliente.
- Los buckets de Storage (`task-files`, `payment-proofs`) tienen límite de tamaño y tipo de archivo configurado en `0007_security_hardening.sql`. Si agregas otro bucket, configúrale límites ahí también.
- Headers de seguridad (CSP, `X-Frame-Options`, etc.) están en `next.config.ts`. El `script-src` incluye `'unsafe-inline'` porque Next.js App Router necesita ejecutar scripts inline para hidratar — las demás directivas (`connect-src`, `img-src`, `frame-ancestors`, `object-src`, `form-action`) sí están restringidas a este dominio y Supabase, así que aunque se inyectara un script no podría exfiltrar datos a otro origen ni la página podría incrustarse en un iframe ajeno.
- En el dashboard de Supabase (Authentication → Policies/Providers), revisa manualmente: longitud mínima de contraseña (la app ya pide 8, pero el proyecto de Supabase puede tener su propio mínimo más bajo) y "leaked password protection" si tu plan lo incluye — esto no se puede configurar desde una migración.

## Checklist antes de lanzar a producción

- [ ] Revisa `/terms` y `/privacy` con un abogado y completa los datos marcados como `[...]` (fecha, correo de contacto, política de cancelaciones/reembolsos).
- [ ] Decide y documenta tu política de reembolsos — hoy la app no tiene un flujo de cancelación/reembolso una vez que se acepta y paga una propuesta.
- [ ] Consigue un dominio propio y conéctalo en Vercel (Settings → Domains), para que `NEXT_PUBLIC_SITE_URL` no dependa de una URL de preview que cambia.
- [ ] Confirma que `ADMIN_EMAIL` en `src/lib/admin.ts` es la cuenta correcta antes de lanzar — es quien aprueba pagos.
- [ ] Revisa la configuración de contraseñas en Supabase Auth (ver sección "Seguridad" arriba).

## Estructura

- `src/app` — rutas (App Router): `/`, `/login`, `/register`, `/dashboard`, `/tasks`, `/profile`, `/admin/payments`.
- `src/app/api/payments` — rutas de servidor: `submit-proof` (estudiante sube comprobante) y `[id]/review` (admin aprueba/rechaza).
- `src/lib/supabase` — clientes de Supabase (browser, server, proxy, admin/service-role).
- `src/lib/admin.ts` — correo de la cuenta administradora que revisa pagos.
- `supabase/migrations` — esquema SQL versionado.
