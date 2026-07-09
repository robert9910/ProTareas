"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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
  {
    name: "Karla Sanchez",
    quote: "Siempre puntual y confiable, 10/10.",
  },
  {
    name: "Andrea Villagomez",
    quote: "Excelente servicio y muy puntual, lo recomiendo totalmente, 100% confiable.",
  },
];

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth ?? 280;
    el.scrollBy({ left: direction === "next" ? cardWidth + 16 : -(cardWidth + 16), behavior: "smooth" });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-ink">Lo que dicen nuestros estudiantes</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll("prev")}
            aria-label="Anterior"
            className="flex size-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/60 shadow-sm transition hover:bg-brand/10 hover:text-brand-dark"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("next")}
            aria-label="Siguiente"
            className="flex size-8 items-center justify-center rounded-full border border-ink/10 bg-white text-ink/60 shadow-sm transition hover:bg-brand/10 hover:text-brand-dark"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className={`flex w-64 shrink-0 snap-start flex-col gap-3 sm:w-72 ${card}`}
          >
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
