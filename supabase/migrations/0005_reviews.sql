-- Fase 5: calificaciones de asesores

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  student_id uuid not null references public.users (id) on delete cascade,
  advisor_id uuid not null references public.users (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (task_id)
);

create index if not exists reviews_advisor_id_idx on public.reviews (advisor_id);

alter table public.reviews enable row level security;

create policy "Reviews are viewable by authenticated users"
  on public.reviews for select
  to authenticated
  using (true);

create policy "Student can review own completed task"
  on public.reviews for insert
  with check (
    auth.uid() = student_id
    and exists (
      select 1 from public.tasks
      where id = task_id and student_id = auth.uid() and status = 'completed'
    )
  );

-- Recalcula el promedio de calificaciones del asesor cada vez que
-- se agrega una review nueva.
create or replace function public.update_advisor_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  avg_rating numeric;
begin
  select round(avg(rating)::numeric, 2) into avg_rating
  from public.reviews
  where advisor_id = new.advisor_id;

  insert into public.advisor_profiles (user_id, rating_avg)
  values (new.advisor_id, avg_rating)
  on conflict (user_id) do update set rating_avg = avg_rating;

  return new;
end;
$$;

drop trigger if exists on_review_created on public.reviews;
create trigger on_review_created
  after insert on public.reviews
  for each row execute function public.update_advisor_rating();
