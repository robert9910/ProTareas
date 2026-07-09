import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { decision } = await request.json();

  if (decision !== "approve" && decision !== "reject") {
    return NextResponse.json({ error: "Decision invalida" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: payment } = await admin
    .from("payments")
    .select("id, task_id, proposal_id, status")
    .eq("id", id)
    .single();

  if (!payment || payment.status !== "pending_review") {
    return NextResponse.json({ error: "Pago no valido" }, { status: 404 });
  }

  if (decision === "reject") {
    await admin.from("payments").update({ status: "rejected" }).eq("id", payment.id);
    return NextResponse.json({ ok: true });
  }

  await admin.from("payments").update({ status: "approved" }).eq("id", payment.id);

  await admin.from("proposals").update({ status: "accepted" }).eq("id", payment.proposal_id);

  await admin.from("tasks").update({ status: "assigned" }).eq("id", payment.task_id);

  // Las demas propuestas pendientes de esta tarea ya no aplican.
  await admin
    .from("proposals")
    .update({ status: "rejected" })
    .eq("task_id", payment.task_id)
    .eq("status", "pending");

  return NextResponse.json({ ok: true });
}
