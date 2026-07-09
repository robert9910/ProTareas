"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { btnSuccess, btnDanger } from "@/lib/ui";

export function PaymentReviewActions({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function review(decision: "approve" | "reject") {
    setError(null);
    setLoading(decision);

    const res = await fetch(`/api/payments/${paymentId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo procesar la revisión.");
      setLoading(null);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button
          onClick={() => review("approve")}
          disabled={loading !== null}
          className={btnSuccess}
        >
          <Check className="size-4" />
          {loading === "approve" ? "Aprobando..." : "Aprobar"}
        </button>
        <button
          onClick={() => review("reject")}
          disabled={loading !== null}
          className={btnDanger}
        >
          <X className="size-4" />
          {loading === "reject" ? "Rechazando..." : "Rechazar"}
        </button>
      </div>
      {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}
    </div>
  );
}
