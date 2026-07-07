import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  open: "abierta",
  assigned: "asignada",
  completed: "completada",
  cancelled: "cancelada",
};

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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {isStudent ? "Mis tareas" : "Tareas abiertas"}
        </h1>
        {isStudent && (
          <Link
            href="/tasks/new"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Publicar tarea
          </Link>
        )}
      </div>

      {!tasks?.length && (
        <p className="text-sm text-gray-600">
          {isStudent
            ? "Aún no has publicado ninguna tarea."
            : "No hay tareas abiertas por ahora."}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {tasks?.map((task) => (
          <li key={task.id}>
            <Link
              href={`/tasks/${task.id}`}
              className="flex flex-col gap-1 rounded-md border border-gray-300 px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{task.subject}</span>
                <span className="text-xs text-gray-500">
                  {STATUS_LABEL[task.status] ?? task.status}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-gray-600">{task.description}</p>
              {task.budget && (
                <span className="text-sm text-gray-500">Presupuesto: ${task.budget}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
