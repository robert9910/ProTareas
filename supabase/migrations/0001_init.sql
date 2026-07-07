-- Fase 1: esquema inicial (users, advisor_profiles, tasks, proposals, messages)

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────
-- users (perfil público, 1:1 con auth.users)
-- ─────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null check (role in ('student', 'advisor')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Crea automáticamente la fila en public.users cuando alguien se
-- registra en auth.users. El rol viene de las opciones de signUp:
-- supabase.auth.signUp({ options: { data: { role: 'student' | 'advisor' } } })
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- advisor_profiles
-- ─────────────────────────────────────────────
create table if not exists public.advisor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  subjects text[] not null default '{}',
  bio text,
  hourly_rate numeric(10, 2),
  availability jsonb,
  rating_avg numeric(3, 2) not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists advisor_profiles_user_id_idx on public.advisor_profiles (user_id);

alter table public.advisor_profiles enable row level security;

create policy "Advisor profiles are viewable by authenticated users"
  on public.advisor_profiles for select
  to authenticated
  using (true);

create policy "Advisors can insert own profile"
  on public.advisor_profiles for insert
  with check (auth.uid() = user_id);

create policy "Advisors can update own profile"
  on public.advisor_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- tasks
-- ─────────────────────────────────────────────
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.users (id) on delete cascade,
  subject text not null,
  description text not null,
  file_url text,
  due_date timestamptz,
  budget numeric(10, 2),
  status text not null default 'open' check (status in ('open', 'assigned', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists tasks_student_id_idx on public.tasks (student_id);

alter table public.tasks enable row level security;

create policy "Tasks are viewable by authenticated users"
  on public.tasks for select
  to authenticated
  using (true);

create policy "Students can insert own tasks"
  on public.tasks for insert
  with check (auth.uid() = student_id);

create policy "Students can update own tasks"
  on public.tasks for update
  using (auth.uid() = student_id)
  with check (auth.uid() = student_id);

create policy "Students can delete own tasks"
  on public.tasks for delete
  using (auth.uid() = student_id);

-- ─────────────────────────────────────────────
-- proposals
-- ─────────────────────────────────────────────
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  advisor_id uuid not null references public.users (id) on delete cascade,
  price numeric(10, 2) not null,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (task_id, advisor_id)
);

create index if not exists proposals_task_id_idx on public.proposals (task_id);
create index if not exists proposals_advisor_id_idx on public.proposals (advisor_id);

alter table public.proposals enable row level security;

create policy "Task owner or proposing advisor can view proposals"
  on public.proposals for select
  using (
    auth.uid() = advisor_id
    or auth.uid() = (select student_id from public.tasks where id = task_id)
  );

create policy "Advisors can insert own proposals"
  on public.proposals for insert
  with check (auth.uid() = advisor_id);

create policy "Advisor or task owner can update proposal"
  on public.proposals for update
  using (
    auth.uid() = advisor_id
    or auth.uid() = (select student_id from public.tasks where id = task_id)
  )
  with check (
    auth.uid() = advisor_id
    or auth.uid() = (select student_id from public.tasks where id = task_id)
  );

-- ─────────────────────────────────────────────
-- messages
-- ─────────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  sender_id uuid not null references public.users (id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_task_id_idx on public.messages (task_id);

alter table public.messages enable row level security;

-- Participante = dueño de la tarea (estudiante) o asesor con una
-- propuesta registrada en esa tarea.
create or replace function public.is_task_participant(p_task_id uuid)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.tasks
    where id = p_task_id and student_id = auth.uid()
  ) or exists (
    select 1 from public.proposals
    where task_id = p_task_id and advisor_id = auth.uid()
  );
$$;

create policy "Task participants can view messages"
  on public.messages for select
  using (public.is_task_participant(task_id));

create policy "Task participants can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id and public.is_task_participant(task_id));
