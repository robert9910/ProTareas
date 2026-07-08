import Link from "next/link";
import { redirect } from "next/navigation";
import { ListTodo, PlusCircle, PackageCheck } from "lucide-react";
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
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Bienvenido, eres {roleLabel}
        </h1>
        <p className="text-sm text-slate-500">{user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/tasks"
          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-sky-300 hover:shadow"
        >
          <ListTodo className="size-6 text-sky-600" />
          <div>
            <p className="font-medium text-slate-900">
              {isStudent ? "Mis tareas" : "Tareas abiertas"}
            </p>
            <p className="text-sm text-slate-500">
              {isStudent ? "Revisa el estado de tus tareas" : "Explora tareas para proponer"}
            </p>
          </div>
        </Link>

        {isStudent ? (
          <Link
            href="/tasks/new"
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-sky-300 hover:shadow"
          >
            <PlusCircle className="size-6 text-sky-600" />
            <div>
              <p className="font-medium text-slate-900">Publicar tarea</p>
              <p className="text-sm text-slate-500">Pide ayuda a un asesor</p>
            </div>
          </Link>
        ) : (
          <Link
            href="/tasks/accepted"
            className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-sky-300 hover:shadow"
          >
            <PackageCheck className="size-6 text-sky-600" />
            <div>
              <p className="font-medium text-slate-900">Por entregar</p>
              <p className="text-sm text-slate-500">Tareas que aceptaste</p>
            </div>
          </Link>
        )}
      </div>
    </main>
  );
}
