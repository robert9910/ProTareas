"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnSuccess, btnDanger } from "@/lib/ui";

export function ProposalActions({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setError(null);
    setLoading("accept");

    const res = await fetch("/api/payments/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId }),
    });

    const data = await res.json();

    if (!res.ok || !data.checkoutUrl) {
      setError(data.error ?? "No se pudo iniciar el pago.");
      setLoading(null);
      return;
    }

    window.location.href = data.checkoutUrl;
  }

  async function handleReject() {
    setLoading("reject");
    const supabase = createClient();
    await supabase.from("proposals").update({ status: "rejected" }).eq("id", proposalId);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button onClick={handleAccept} disabled={loading !== null} className={btnSuccess}>
          <CreditCard className="size-4" />
          {loading === "accept" ? "Redirigiendo a pago..." : "Aceptar y pagar"}
        </button>
        <button onClick={handleReject} disabled={loading !== null} className={btnDanger}>
          <X className="size-4" />
          {loading === "reject" ? "Rechazando..." : "Rechazar"}
        </button>
      </div>
      {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}
    </div>
  );
}
