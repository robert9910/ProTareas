import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TaskStatusBadge, taskBorderClass } from "@/components/StatusBadge";
import { btnPrimary } from "@/lib/ui";

export default async function TasksPage() {
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

  const query = supabase
    .from("tasks")
    .select("id, subject, description, budget, status, due_date")
    .order("created_at", { ascending: false });

  const { data: tasks } = isStudent
    ? await query.eq("student_id", user.id)
    : await query.eq("status", "open");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          {isStudent ? "Mis tareas" : "Tareas abiertas"}
        </h1>
        {isStudent && (
          <Link href="/tasks/new" className={btnPrimary}>
            <PlusCircle className="size-4" />
            Publicar tarea
          </Link>
        )}
      </div>

      {!tasks?.length && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-ink/15 bg-surface-alt py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-brand/10">
            <BookOpen className="size-7 text-brand-dark" />
          </span>
          <p className="max-w-xs text-sm text-ink/50">
            {isStudent
              ? "Aún no has publicado ninguna tarea. Crea la primera para recibir propuestas de asesores."
              : "No hay tareas abiertas por ahora. Vuelve pronto."}
          </p>
          {isStudent && (
            <Link href="/tasks/new" className={`${btnPrimary} mt-2`}>
              <PlusCircle className="size-4" />
              Publicar mi primera tarea
            </Link>
          )}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {tasks?.map((task) => (
          <li key={task.id}>
            <Link
              href={`/tasks/${task.id}`}
              className={`flex flex-col gap-1 rounded-xl border border-ink/10 border-l-4 bg-white px-4 py-3 shadow-md shadow-ink/5 transition hover:-translate-y-0.5 hover:shadow-lg ${taskBorderClass(task.status)}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-ink">{task.subject}</span>
                <TaskStatusBadge status={task.status} />
              </div>
              <p className="line-clamp-2 text-sm text-ink/60">{task.description}</p>
              {task.budget && (
                <span className="text-sm font-semibold text-ink/70">
                  Presupuesto: ${task.budget}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
