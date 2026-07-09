import Link from "next/link";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";
import { btnPrimary, btnSecondary } from "@/lib/ui";
import { Testimonials } from "@/components/Testimonials";

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

      <div className="mx-auto w-full max-w-4xl px-4 pb-16">
        <Testimonials />
      </div>
    </main>
  );
}
