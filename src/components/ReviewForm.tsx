"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputClass, card } from "@/lib/ui";

export function ReviewForm({
  taskId,
  studentId,
  advisorId,
}: {
  taskId: string;
  studentId: string;
  advisorId: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      setError("Elige una calificación de 1 a 5 estrellas.");
      return;
    }
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("reviews").insert({
      task_id: taskId,
      student_id: studentId,
      advisor_id: advisorId,
      rating,
      comment: comment.trim() || null,
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
      <h2 className="text-lg font-bold text-ink">Califica a tu asesor</h2>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${value} estrellas`}
          >
            <Star
              className={`size-7 ${
                value <= (hoverRating || rating)
                  ? "fill-status-pending text-status-pending"
                  : "text-ink/20"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Comentario (opcional)"
        className={inputClass}
      />

      {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}

      <button type="submit" disabled={loading} className={btnPrimary}>
        {loading ? "Enviando..." : "Enviar calificación"}
      </button>
    </form>
  );
}
