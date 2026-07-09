import Link from "next/link";
import { redirect } from "next/navigation";
import { ListTodo, PlusCircle, PackageCheck, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const ROLE_LABEL: Record<string, string> = {
  student: "estudiante",
  advisor: "asesor",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isStudent = profile?.role === "student";
  const roleLabel = profile ? ROLE_LABEL[profile.role] ?? profile.role : "desconocido";

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <div className="rounded-2xl bg-brand px-6 py-8 text-white shadow-md shadow-brand/20 sm:px-10 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
          Bienvenido de vuelta
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Eres {roleLabel}
        </h1>
        <p className="mt-2 text-white/80">{user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/tasks"
          className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5 shadow-md shadow-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10">
            <ListTodo className="size-6 text-brand-dark" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink">
              {isStudent ? "Mis tareas" : "Tareas abiertas"}
            </p>
            <p className="text-sm text-ink/50">
              {isStudent ? "Revisa el estado de tus tareas" : "Explora tareas para proponer"}
            </p>
          </div>
          <ArrowRight className="size-5 text-ink/20 transition group-hover:translate-x-1 group-hover:text-brand-dark" />
        </Link>

        {isStudent ? (
          <Link
            href="/tasks/new"
            className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5 shadow-md shadow-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-status-completed/10">
              <PlusCircle className="size-6 text-status-completed" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-ink">Publicar tarea</p>
              <p className="text-sm text-ink/50">Pide ayuda a un asesor</p>
            </div>
            <ArrowRight className="size-5 text-ink/20 transition group-hover:translate-x-1 group-hover:text-brand-dark" />
          </Link>
        ) : (
          <Link
            href="/tasks/accepted"
            className="group flex items-center gap-4 rounded-xl border border-ink/10 bg-white p-5 shadow-md shadow-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-status-pending/10">
              <PackageCheck className="size-6 text-status-pending" />
            </span>
            <div className="flex-1">
              <p className="font-bold text-ink">Por entregar</p>
              <p className="text-sm text-ink/50">Tareas que aceptaste</p>
            </div>
            <ArrowRight className="size-5 text-ink/20 transition group-hover:translate-x-1 group-hover:text-brand-dark" />
          </Link>
        )}
      </div>
    </main>
  );
}
