import Link from "next/link";
import { GraduationCap, LogIn, Star, UserPlus } from "lucide-react";
import { btnPrimary, btnSecondary, card } from "@/lib/ui";

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

export default function Home() {
  return (
    <main className="flex flex-col bg-surface-alt">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-brand/10">
          <GraduationCap className="size-11 text-brand-dark" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">ProTareas</h1>
        <p className="text-base text-ink/60">
          Conecta estudiantes con asesores académicos para resolver tareas y
          proyectos.
        </p>
        <div className="flex gap-3">
          <Link href="/login" className={btnSecondary}>
            <LogIn className="size-4" />
            Iniciar sesión
          </Link>
          <Link href="/register" className={btnPrimary}>
            <UserPlus className="size-4" />
            Crear cuenta
          </Link>
        </div>

        <div className="flex gap-4 text-xs text-ink/40">
          <Link href="/terms" className="hover:text-ink/70">
            Términos de Servicio
          </Link>
          <Link href="/privacy" className="hover:text-ink/70">
            Aviso de Privacidad
          </Link>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-16">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-ink">
          Lo que dicen nuestros estudiantes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className={`flex flex-col gap-3 ${card}`}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-status-pending text-status-pending"
                  />
                ))}
              </div>
              <blockquote className="text-sm text-ink/70">“{t.quote}”</blockquote>
              <figcaption className="text-sm font-semibold text-ink">
                {t.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
