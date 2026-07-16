-- Fase de seguridad: cierra huecos encontrados en auditoria de RLS.

-- ─────────────────────────────────────────────
-- 1. CRITICO: un asesor podia poner su propia propuesta en 'accepted'
-- directo (la policy no restringia el campo status), lo que ademas
-- activaba la policy de tasks para asignarse/completar la tarea sin
-- pasar por la revision de pago del admin.
-- Ahora el asesor solo puede tocar/editar su propuesta mientras siga
-- 'pending', y no puede cambiarle el status via esta policy (el paso
-- a 'accepted' solo lo hace el admin con la service role key).
-- ─────────────────────────────────────────────
drop policy if exists "Advisor can update own proposal" on public.proposals;

create policy "Advisor can edit own pending proposal"
  on public.proposals for update
  using (auth.uid() = advisor_id and status = 'pending')
  with check (auth.uid() = advisor_id and status = 'pending');

-- El estudiante solo puede rechazar una propuesta que siga pendiente,
-- no una ya aceptada (y pagada) por el admin.
drop policy if exists "Task owner can reject proposal" on public.proposals;

create policy "Task owner can reject pending proposal"
  on public.proposals for update
  using (
    status = 'pending'
    and auth.uid() = (select student_id from public.tasks where id = task_id)
  )
  with check (
    status = 'rejected'
    and auth.uid() = (select student_id from public.tasks where id = task_id)
  );

-- ─────────────────────────────────────────────
-- 2. ALTO: nada impedia que un usuario se propusiera a si mismo en su
-- propia tarea (advisor_id = student_id de la tarea).
-- ─────────────────────────────────────────────
drop policy if exists "Advisors can insert own proposals" on public.proposals;

create policy "Advisors can insert own proposals"
  on public.proposals for insert
  with check (
    auth.uid() = advisor_id
    and auth.uid() <> (select student_id from public.tasks where id = task_id)
  );

-- ─────────────────────────────────────────────
-- 3. Defensa en profundidad: aunque el punto 1 ya cierra el camino,
-- esta policy tampoco deberia permitir saltar directo a 'assigned' o
-- forzar el estado sin que la tarea ya estuviera 'assigned'. Solo
-- permite marcar como 'completed' una tarea que ya estaba asignada.
-- ─────────────────────────────────────────────
drop policy if exists "Accepted advisor can complete task" on public.tasks;

create policy "Accepted advisor can complete assigned task"
  on public.tasks for update
  using (
    status = 'assigned'
    and exists (
      select 1 from public.proposals
      where task_id = tasks.id
        and advisor_id = auth.uid()
        and status = 'accepted'
    )
  )
  with check (status = 'completed');

-- ─────────────────────────────────────────────
-- 4. MEDIO: un estudiante podia borrar una tarea ya asignada o
-- completada, borrando en cascada sus pagos/mensajes/reseñas. Solo
-- se puede borrar mientras siga 'open' (sin trabajo ni pago de por
-- medio).
-- ─────────────────────────────────────────────
drop policy if exists "Students can delete own tasks" on public.tasks;

create policy "Students can delete own open tasks"
  on public.tasks for delete
  using (auth.uid() = student_id and status = 'open');

-- ─────────────────────────────────────────────
-- 5. BAJO: limites de tamaño y tipo de archivo en los buckets, antes
-- no habia ninguno (el accept="image/*" del input es solo del lado
-- del cliente).
-- ─────────────────────────────────────────────
update storage.buckets
set file_size_limit = 15728640, -- 15 MB
    allowed_mime_types = array[
      'image/png', 'image/jpeg', 'image/webp', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
where id = 'task-files';

update storage.buckets
set file_size_limit = 10485760, -- 10 MB
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
where id = 'payment-proofs';
