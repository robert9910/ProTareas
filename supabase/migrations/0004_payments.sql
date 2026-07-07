-- Fase 4: pagos con Mercado Pago (Checkout Pro)

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  proposal_id uuid not null references public.proposals (id) on delete cascade,
  student_id uuid not null references public.users (id) on delete cascade,
  advisor_id uuid not null references public.users (id) on delete cascade,
  amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  mp_preference_id text,
  mp_payment_id text,
  created_at timestamptz not null default now(),
  unique (proposal_id)
);

create index if not exists payments_task_id_idx on public.payments (task_id);
create index if not exists payments_mp_preference_id_idx on public.payments (mp_preference_id);

alter table public.payments enable row level security;

create policy "Student or advisor can view own payments"
  on public.payments for select
  using (auth.uid() = student_id or auth.uid() = advisor_id);

-- Solo el dueno de la tarea puede iniciar un pago, y solo sobre su
-- propia tarea/propuesta.
create policy "Task owner can create payment"
  on public.payments for insert
  with check (
    auth.uid() = student_id
    and auth.uid() = (select student_id from public.tasks where id = task_id)
  );

-- Las actualizaciones de estado (tras confirmar con Mercado Pago) las
-- hace el webhook con la service role key, que ignora RLS.

-- ─────────────────────────────────────────────
-- Aceptar una propuesta ahora requiere pago confirmado.
-- Se reemplaza la politica de update de proposals: el estudiante ya
-- no puede poner status='accepted' directo desde el cliente, solo
-- 'rejected'. El paso a 'accepted' lo hace el webhook (service role).
-- ─────────────────────────────────────────────
drop policy if exists "Advisor or task owner can update proposal" on public.proposals;

create policy "Advisor can update own proposal"
  on public.proposals for update
  using (auth.uid() = advisor_id)
  with check (auth.uid() = advisor_id);

create policy "Task owner can reject proposal"
  on public.proposals for update
  using (auth.uid() = (select student_id from public.tasks where id = task_id))
  with check (
    auth.uid() = (select student_id from public.tasks where id = task_id)
    and status = 'rejected'
  );

-- Mismo motivo: el estudiante ya no puede poner su propia tarea en
-- 'assigned' directo desde el cliente (eso lo hace el webhook al
-- confirmar el pago). Puede seguir abriendola/cancelandola y editando
-- otros campos (p.ej. file_url) mientras siga 'open'.
drop policy if exists "Students can update own tasks" on public.tasks;

create policy "Students can update own open tasks"
  on public.tasks for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id and status in ('open', 'cancelled'));
