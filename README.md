App web para conectar asesores académicos con estudiantes. Next.js (App Router) + Supabase + Mercado Pago.

## Setup

1. Copia `.env.example` a `.env.local` y completa las variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=

   MERCADOPAGO_ACCESS_TOKEN=
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=

   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API en Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: misma pantalla, sección "service_role secret". **Nunca la expongas al cliente ni la subas a git** — solo la usan las rutas de servidor (webhook de pagos).
   - `MERCADOPAGO_ACCESS_TOKEN` / `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`: Mercado Pago → Tus integraciones → tu app → Credenciales de prueba (o de producción cuando lances).
   - `NEXT_PUBLIC_SITE_URL`: la URL pública donde corre la app. En local es `http://localhost:3000`, pero **el webhook de Mercado Pago no puede llegar a localhost** — para probar pagos de punta a punta necesitas una URL pública (ver abajo) o desplegar la app.

2. Aplica el esquema de base de datos en el SQL Editor de Supabase, en orden:

   ```
   supabase/migrations/0001_init.sql
   supabase/migrations/0002_task_files_storage.sql
   supabase/migrations/0003_messaging_and_completion.sql
   supabase/migrations/0004_payments.sql
   ```

3. Instala dependencias y levanta el servidor:

   ```bash
   npm install
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Probar pagos en local

El webhook (`/api/payments/webhook`) lo llama Mercado Pago desde internet, así que `localhost` no le sirve. Opciones:

- Exponer tu `localhost:3000` con una herramienta como `ngrok` (`ngrok http 3000`) y usar esa URL como `NEXT_PUBLIC_SITE_URL` mientras pruebas.
- Desplegar la app (Vercel, etc.) y usar la URL real.

Usa el usuario de prueba **comprador** que creaste en Mercado Pago (Cuentas de prueba) para pagar en el checkout — no tu cuenta real.

## Estructura

- `src/app` — rutas (App Router): `/`, `/login`, `/register`, `/dashboard`, `/tasks`, `/profile`.
- `src/app/api/payments` — rutas de servidor: crear preferencia de pago y webhook de confirmación.
- `src/lib/supabase` — clientes de Supabase (browser, server, proxy, admin/service-role).
- `src/lib/mercadopago.ts` — cliente de Mercado Pago.
- `supabase/migrations` — esquema SQL versionado.
