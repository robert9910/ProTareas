import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TaskStatusBadge } from "@/components/StatusBadge";

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
        <h1 className="text-2xl font-semibold text-slate-900">
          {isStudent ? "Mis tareas" : "Tareas abiertas"}
        </h1>
        {isStudent && (
          <Link
            href="/tasks/new"
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <PlusCircle className="size-4" />
            Publicar tarea
          </Link>
        )}
      </div>

      {!tasks?.length && (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 py-12 text-center">
          <BookOpen className="size-8 text-slate-400" />
          <p className="text-sm text-slate-500">
            {isStudent
              ? "Aún no has publicado ninguna tarea."
              : "No hay tareas abiertas por ahora."}
          </p>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {tasks?.map((task) => (
          <li key={task.id}>
            <Link
              href={`/tasks/${task.id}`}
              className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-indigo-300 hover:shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-900">{task.subject}</span>
                <TaskStatusBadge status={task.status} />
              </div>
              <p className="line-clamp-2 text-sm text-slate-600">{task.description}</p>
              {task.budget && (
                <span className="text-sm text-slate-500">Presupuesto: ${task.budget}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
