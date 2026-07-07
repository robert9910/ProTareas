"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function TaskCompleteButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("tasks").update({ status: "completed" }).eq("id", taskId);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
    >
      <PackageCheck className="size-4" />
      {loading ? "Marcando..." : "Marcar como entregada"}
    </button>
  );
}
