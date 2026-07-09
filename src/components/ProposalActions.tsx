"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnSuccess, btnSecondary, btnDanger, inputClass } from "@/lib/ui";

const BANK_ACCOUNT = "4152 3146 2608 0215";
const BANK_HOLDER = "Roberto Aguilar";

export function ProposalActions({
  proposalId,
  studentId,
  payment,
}: {
  proposalId: string;
  studentId: string;
  payment: { id: string; status: string } | null;
}) {
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(payment?.status === "rejected");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<"upload" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleReject() {
    setLoading("reject");
    const supabase = createClient();
    await supabase.from("proposals").update({ status: "rejected" }).eq("id", proposalId);
    setLoading(null);
    router.refresh();
  }

  async function handleUpload() {
    if (!file) return;
    setError(null);
    setLoading("upload");

    const supabase = createClient();
    const path = `${studentId}/${proposalId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file);

    if (uploadError) {
      setError("No se pudo subir el comprobante. Intenta de nuevo.");
      setLoading(null);
      return;
    }

    const res = await fetch("/api/payments/submit-proof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, proofPath: path }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "No se pudo enviar el comprobante.");
      setLoading(null);
      return;
    }

    setLoading(null);
    router.refresh();
  }

  if (payment?.status === "pending_review") {
    return (
      <div className="rounded-lg bg-status-pending/10 px-3 py-2 text-sm font-medium text-status-pending">
        Comprobante enviado. En revisión, te avisaremos cuando se confirme.
      </div>
    );
  }

  if (!showUpload) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button onClick={() => setShowUpload(true)} className={btnSuccess}>
            <Banknote className="size-4" />
            Aceptar
          </button>
          <button onClick={handleReject} disabled={loading !== null} className={btnDanger}>
            <X className="size-4" />
            {loading === "reject" ? "Rechazando..." : "Rechazar"}
          </button>
        </div>
        {payment?.status === "rejected" && (
          <p className="text-sm font-medium text-status-rejected">
            Tu comprobante anterior fue rechazado. Puedes subir uno nuevo.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface-alt p-3">
      <p className="text-sm text-ink/70">
        Realiza tu depósito o transferencia a nombre de{" "}
        <strong className="text-ink">{BANK_HOLDER}</strong>, cuenta{" "}
        <strong className="text-ink">{BANK_ACCOUNT}</strong>, y sube la foto de tu comprobante
        para continuar.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className={inputClass}
      />
      <div className="flex gap-2">
        <button
          onClick={handleUpload}
          disabled={!file || loading !== null}
          className={btnSuccess}
        >
          <Upload className="size-4" />
          {loading === "upload" ? "Enviando..." : "Enviar comprobante"}
        </button>
        <button
          onClick={() => setShowUpload(false)}
          disabled={loading !== null}
          className={btnSecondary}
        >
          Cancelar
        </button>
      </div>
      {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}
    </div>
  );
}
