import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import { getMercadoPagoClient } from "@/lib/mercadopago";

export async function POST(request: Request) {
  const { proposalId } = await request.json();

  if (!proposalId) {
    return NextResponse.json({ error: "Falta proposalId" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
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
    .select("id, subject, status, student_id")
    .eq("id", proposal.task_id)
    .single();

  if (!task || task.student_id !== user.id || task.status !== "open") {
    return NextResponse.json({ error: "Tarea no valida" }, { status: 404 });
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      task_id: task.id,
      proposal_id: proposal.id,
      student_id: user.id,
      advisor_id: proposal.advisor_id,
      amount: proposal.price,
    })
    .select("id")
    .single();

  if (paymentError || !payment) {
    return NextResponse.json(
      { error: paymentError?.message ?? "No se pudo crear el pago" },
      { status: 500 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const preference = await new Preference(getMercadoPagoClient()).create({
    body: {
      items: [
        {
          id: proposal.id,
          title: task.subject,
          quantity: 1,
          unit_price: Number(proposal.price),
          currency_id: "MXN",
        },
      ],
      external_reference: payment.id,
      notification_url: `${siteUrl}/api/payments/webhook`,
      back_urls: {
        success: `${siteUrl}/tasks/${task.id}?payment=success`,
        failure: `${siteUrl}/tasks/${task.id}?payment=failure`,
        pending: `${siteUrl}/tasks/${task.id}?payment=pending`,
      },
      auto_return: "approved",
    },
  });

  await supabase
    .from("payments")
    .update({ mp_preference_id: preference.id })
    .eq("id", payment.id);

  const checkoutUrl = preference.sandbox_init_point ?? preference.init_point;

  return NextResponse.json({ checkoutUrl });
}
