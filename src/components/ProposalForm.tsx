"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputClass, card } from "@/lib/ui";

export function ProposalForm({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Debes iniciar sesión.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("proposals").insert({
      task_id: taskId,
      advisor_id: user.id,
      price: Number(price),
      message,
    });

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${card}`}>
      <h2 className="text-lg font-bold text-ink">Enviar propuesta</h2>

      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-sm font-semibold text-ink">
          Precio
        </label>
        <input
          id="price"
          type="number"
          min="0"
          step="0.01"
          required
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-sm font-semibold text-ink">
          Mensaje
        </label>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}

      <button type="submit" disabled={loading} className={btnPrimary}>
        <Send className="size-4" />
        {loading ? "Enviando..." : "Enviar propuesta"}
      </button>
    </form>
  );
}
