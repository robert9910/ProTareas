import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/admin";
import { getMercadoPagoClient } from "@/lib/mercadopago";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({}));

  const type = url.searchParams.get("topic") ?? body.type;
  const paymentId = url.searchParams.get("id") ?? body.data?.id;

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ received: true });
  }

  const mpPayment = await new Payment(getMercadoPagoClient()).get({ id: paymentId });

  const paymentRecordId = mpPayment.external_reference;
  if (!paymentRecordId) {
    return NextResponse.json({ received: true });
  }

  const statusMap: Record<string, "approved" | "rejected" | "cancelled" | "pending"> = {
    approved: "approved",
    rejected: "rejected",
    cancelled: "cancelled",
  };
  const status = statusMap[mpPayment.status ?? ""] ?? "pending";

  const supabase = createAdminClient();

  const { data: payment } = await supabase
    .from("payments")
    .update({ status, mp_payment_id: String(paymentId) })
    .eq("id", paymentRecordId)
    .select("id, task_id, proposal_id")
    .single();

  if (payment && status === "approved") {
    await supabase
      .from("proposals")
      .update({ status: "accepted" })
      .eq("id", payment.proposal_id);

    await supabase.from("tasks").update({ status: "assigned" }).eq("id", payment.task_id);
  }

  return NextResponse.json({ received: true });
}
