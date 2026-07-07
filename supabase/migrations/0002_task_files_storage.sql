-- Fase 2: bucket de Storage para archivos adjuntos a tareas

insert into storage.buckets (id, name, public)
values ('task-files', 'task-files', false)
on conflict (id) do nothing;

-- Convención de ruta: {student_id}/{task_id}/{filename}
-- El dueño (primer segmento de la ruta) puede subir/editar/borrar sus archivos.
create policy "Task owners can upload files"
  on storage.objects for insert
  with check (
    bucket_id = 'task-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Task owners can update own files"
  on storage.objects for update
  using (
    bucket_id = 'task-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Task owners can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'task-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Igual que la tabla tasks, los archivos son visibles para cualquier
-- usuario autenticado (los asesores necesitan verlos para hacer propuestas).
create policy "Authenticated users can read task files"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'task-files');
