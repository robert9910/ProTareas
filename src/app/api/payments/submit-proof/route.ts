import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { proposalId, proofPath } = await request.json();

  if (!proposalId || !proofPath) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // El comprobante debe estar en la carpeta del propio usuario.
  if (!proofPath.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Ruta de comprobante invalida" }, { status: 403 });
  }

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, task_id, advisor_id, price, status")
    .eq("id", proposalId)
    .single();

  if (!proposal || proposal.status !== "pending") {
    return NextResponse.json({ error: "Propuesta no valida" }, { status: 404 });
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("id, status, student_id")
    .eq("id", proposal.task_id)
    .single();

  if (!task || task.student_id !== user.id || task.status !== "open") {
    return NextResponse.json({ error: "Tarea no valida" }, { status: 404 });
  }

  // Las escrituras en payments las hace la service role: el estado
  // solo lo debe tocar el admin al revisar, no la sesion del estudiante.
  const admin = createAdminClient();

  const { data: existingPayment } = await admin
    .from("payments")
    .select("id, status")
    .eq("proposal_id", proposal.id)
    .maybeSingle();

  if (existingPayment?.status === "approved") {
    return NextResponse.json({ error: "Esta propuesta ya fue pagada." }, { status: 409 });
  }

  const { error: paymentError } = existingPayment
    ? await admin
        .from("payments")
        .update({ amount: proposal.price, status: "pending_review", proof_image_path: proofPath })
        .eq("id", existingPayment.id)
    : await admin.from("payments").insert({
        task_id: task.id,
        proposal_id: proposal.id,
        student_id: user.id,
        advisor_id: proposal.advisor_id,
        amount: proposal.price,
        status: "pending_review",
        proof_image_path: proofPath,
      });

  if (paymentError) {
    return NextResponse.json({ error: paymentError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
