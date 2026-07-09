import { Star } from "lucide-react";
import { card } from "@/lib/ui";

const TESTIMONIALS = [
  {
    name: "Coni VC",
    quote:
      "Muy recomendado, me ha ayudado a salir de varios apuros. Los trabajos están muy bien redactados y estructurados.",
  },
  {
    name: "Cynthia Castro",
    quote:
      "Atento, confiable y siempre acorde a las instrucciones. Entrega en tiempo y forma, con un trato excelente.",
  },
  {
    name: "Carlos Cash",
    quote:
      "Personal de confianza y muy profesional con las actividades que realizan. 100% recomendado.",
  },
  {
    name: "Mossy Barquin Sule",
    quote:
      "Súper agradecida, a mi hijo le fue muy bien con el trabajo elaborado. Lo recomiendo ampliamente.",
  },
  {
    name: "Ylot Retuacla",
    quote:
      "Excelente calidad de trabajo, con entrega a tiempo y respetando los criterios solicitados.",
  },
  {
    name: "Sergio Dch",
    quote: "Me ayuda muchísimo y es súper confiable, sus trabajos son garantía.",
  },
];

export function Testimonials() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-ink">Lo que dicen nuestros estudiantes</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className={`flex flex-col gap-3 ${card}`}>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-status-pending text-status-pending" />
              ))}
            </div>
            <blockquote className="text-sm text-ink/70">“{t.quote}”</blockquote>
            <figcaption className="text-sm font-semibold text-ink">{t.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
