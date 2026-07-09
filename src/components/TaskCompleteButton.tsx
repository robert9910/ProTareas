"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PackageCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnSuccess } from "@/lib/ui";

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
    <button onClick={handleComplete} disabled={loading} className={btnSuccess}>
      <PackageCheck className="size-4" />
      {loading ? "Marcando..." : "Marcar como entregada"}
    </button>
  );
}
