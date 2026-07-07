-- Fase 3: mensajeria en tiempo real y cierre del ciclo de entrega

-- Habilita Realtime (postgres_changes) para la tabla de mensajes.
alter publication supabase_realtime add table public.messages;

-- El asesor con la propuesta aceptada de una tarea puede marcarla
-- como completada (entregada) una vez asignada.
create policy "Accepted advisor can complete task"
  on public.tasks for update
  using (
    exists (
      select 1 from public.proposals
      where task_id = tasks.id
        and advisor_id = auth.uid()
        and status = 'accepted'
    )
  )
  with check (
    status in ('assigned', 'completed')
  );
