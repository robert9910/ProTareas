import { Star } from "lucide-react";

export function ReviewDisplay({
  rating,
  comment,
}: {
  rating: number;
  comment: string | null;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-medium text-slate-900">Calificación</h2>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`size-5 ${
              value <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
            }`}
          />
        ))}
      </div>
      {comment && <p className="text-sm text-slate-700">{comment}</p>}
    </div>
  );
}
