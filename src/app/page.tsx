import Link from "next/link";
import { GraduationCap, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-6 bg-slate-50 px-4 text-center">
      <GraduationCap className="size-12 text-indigo-600" />
      <h1 className="text-3xl font-semibold text-slate-900">ProTareas</h1>
      <p className="text-slate-600">
        Conecta estudiantes con asesores académicos para resolver tareas y
        proyectos.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogIn className="size-4" />
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <UserPlus className="size-4" />
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}
