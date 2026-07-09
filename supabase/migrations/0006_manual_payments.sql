-- Fase 6: pago manual por transferencia/deposito con comprobante
-- Reemplaza la integracion con Mercado Pago.

-- Filas viejas de intentos con Mercado Pago que quedaron en un status
-- que ya no existe (pending/cancelled): no tienen comprobante, se
-- marcan como rechazadas para poder aplicar la restriccion nueva.
update public.payments
set status = 'rejected'
where status not in ('pending_review', 'approved', 'rejected');

alter table public.payments drop constraint if exists payments_status_check;

alter table public.payments
  add constraint payments_status_check
  check (status in ('pending_review', 'approved', 'rejected'));

alter table public.payments alter column status set default 'pending_review';

drop index if exists payments_mp_preference_id_idx;
alter table public.payments drop column if exists mp_preference_id;
alter table public.payments drop column if exists mp_payment_id;
alter table public.payments add column if not exists proof_image_path text;

-- ─────────────────────────────────────────────
-- Bucket privado para comprobantes de deposito/transferencia.
-- Convencion de ruta: {student_id}/{proposal_id}/{filename}
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

drop policy if exists "Students can upload own payment proofs" on storage.objects;
create policy "Students can upload own payment proofs"
  on storage.objects for insert
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Students can view own payment proofs" on storage.objects;
create policy "Students can view own payment proofs"
  on storage.objects for select
  using (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Las revisiones (aprobar/rechazar) y la lectura de comprobantes
-- ajenos las hace el admin desde codigo de servidor con la service
-- role key, que ignora RLS.
