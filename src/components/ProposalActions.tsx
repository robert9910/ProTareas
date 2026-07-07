"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading === "accept" ? "Aceptando..." : "Aceptar"}
      </button>
      <button
        onClick={() => handle("reject")}
        disabled={loading !== null}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      >
        {loading === "reject" ? "Rechazando..." : "Rechazar"}
      </button>
    </div>
  );
}
