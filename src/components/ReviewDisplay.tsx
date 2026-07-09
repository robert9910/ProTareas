import { Star } from "lucide-react";
import { card } from "@/lib/ui";

export function ReviewDisplay({
  rating,
  comment,
}: {
  rating: number;
  comment: string | null;
}) {
  return (
    <div className={`flex flex-col gap-2 ${card}`}>
      <h2 className="text-lg font-bold text-ink">Calificación</h2>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`size-5 ${
              value <= rating ? "fill-status-pending text-status-pending" : "text-ink/15"
            }`}
          />
        ))}
      </div>
      {comment && <p className="text-sm text-ink/70">{comment}</p>}
    </div>
  );
}
