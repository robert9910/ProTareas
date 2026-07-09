import { redirect } from "next/navigation";
import { Banknote } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";
import { PaymentReviewActions } from "@/components/PaymentReviewActions";
import { card } from "@/lib/ui";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  const admin = createAdminClient();

  const { data: payments } = await admin
    .from("payments")
    .select("id, task_id, student_id, advisor_id, amount, proof_image_path, created_at")
    .eq("status", "pending_review")
    .order("created_at", { ascending: true });

  const taskIds = [...new Set(payments?.map((p) => p.task_id) ?? [])];
  const userIds = [
    ...new Set(payments?.flatMap((p) => [p.student_id, p.advisor_id]) ?? []),
  ];

  const { data: tasks } = taskIds.length
    ? await admin.from("tasks").select("id, subject").in("id", taskIds)
    : { data: [] };
  const { data: users } = userIds.length
    ? await admin.from("users").select("id, email").in("id", userIds)
    : { data: [] };

  const taskById = new Map(tasks?.map((t) => [t.id, t]));
  const userById = new Map(users?.map((u) => [u.id, u]));

  const rows = await Promise.all(
    (payments ?? []).map(async (payment) => {
      let proofUrl: string | null = null;
      if (payment.proof_image_path) {
        const { data: signed } = await admin.storage
          .from("payment-proofs")
          .createSignedUrl(payment.proof_image_path, 60 * 30);
        proofUrl = signed?.signedUrl ?? null;
      }
      return { ...payment, proofUrl };
    })
  );

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">
        Comprobantes por revisar
      </h1>

      {!rows.length && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-surface-alt py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-status-pending/10">
            <Banknote className="size-7 text-status-pending" />
          </span>
          <p className="max-w-xs text-sm text-ink/50">
            No hay comprobantes pendientes de revisión.
          </p>
        </div>
      )}

      <ul className="flex flex-col gap-4">
        {rows.map((payment) => {
          const task = taskById.get(payment.task_id);
          const student = userById.get(payment.student_id);
          const advisor = userById.get(payment.advisor_id);
          return (
            <li key={payment.id} className={`flex flex-col gap-3 ${card}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-ink">{task?.subject ?? "Tarea"}</span>
                <span className="text-lg font-bold text-ink">${payment.amount}</span>
              </div>
              <div className="flex flex-col gap-0.5 text-sm text-ink/60">
                <span>Estudiante: {student?.email}</span>
                <span>Asesor: {advisor?.email}</span>
              </div>
              {payment.proofUrl && (
                <a href={payment.proofUrl} target="_blank" rel="noreferrer">
                  <img
                    src={payment.proofUrl}
                    alt="Comprobante de pago"
                    className="max-h-80 w-auto rounded-lg border border-ink/10 object-contain"
                  />
                </a>
              )}
              <PaymentReviewActions paymentId={payment.id} />
            </li>
          );
        })}
      </ul>
    </main>
  );
}
