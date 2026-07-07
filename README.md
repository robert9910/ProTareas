App web para conectar asesores académicos con estudiantes. Next.js (App Router) + Supabase.

## Setup

1. Copia `.env.example` a `.env.local` y completa las variables con los datos de tu proyecto Supabase (Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

2. Aplica el esquema de base de datos: abre el SQL Editor de tu proyecto Supabase y ejecuta el contenido de `supabase/migrations/0001_init.sql`.

3. Instala dependencias y levanta el servidor:

   ```bash
   npm install
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/app` — rutas (App Router): `/`, `/login`, `/register`, `/dashboard`.
- `src/lib/supabase` — clientes de Supabase (browser, server, middleware).
- `supabase/migrations` — esquema SQL versionado.
