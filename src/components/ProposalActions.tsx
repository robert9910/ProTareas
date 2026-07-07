"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ProposalActions({
  proposalId,
  taskId,
}: {
  proposalId: string;
  taskId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null);

  async function handle(action: "accept" | "reject") {
    setLoading(action);
    const supabase = createClient();

    await supabase
      .from("proposals")
      .update({ status: action === "accept" ? "accepted" : "rejected" })
      .eq("id", proposalId);

    if (action === "accept") {
      await supabase.from("tasks").update({ status: "assigned" }).eq("id", taskId);
    }

    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handle("accept")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        <Check className="size-4" />
        {loading === "accept" ? "Aceptando..." : "Aceptar"}
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        <X className="size-4" />
        {loading === "reject" ? "Rechazando..." : "Rechazar"}
      </button>
    </div>
  );
}
