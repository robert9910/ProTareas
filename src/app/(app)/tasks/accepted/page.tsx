import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { TaskStatusBadge } from "@/components/StatusBadge";
import { TaskCompleteButton } from "@/components/TaskCompleteButton";

type AcceptedTask = {
  id: string;
  subject: string;
  description: string;
  budget: number | null;
  status: string;
  due_date: string | null;
};

export default async function AcceptedTasksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: proposals } = await supabase
    .from("proposals")
    .select("price, tasks(id, subject, description, budget, status, due_date)")
    .eq("advisor_id", user.id)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  const tasks = (proposals ?? []).map((p) => {
    const task = p.tasks as unknown as AcceptedTask;
    return { ...task, price: p.price };
  });

  const pending = tasks.filter((t) => t.status === "assigned");
  const delivered = tasks.filter((t) => t.status === "completed");

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-slate-900">Por entregar</h1>

        {!pending.length && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 py-12 text-center">
            <PackageCheck className="size-8 text-slate-400" />
            <p className="text-sm text-slate-500">
              No tienes tareas pendientes de entrega por ahora.
            </p>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {pending.map((task) => (
            <li
              key={task.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm"
            >
              <Link href={`/tasks/${task.id}`} className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">{task.subject}</span>
                  <TaskStatusBadge status={task.status} />
                </div>
                <p className="line-clamp-2 text-sm text-slate-600">{task.description}</p>
                <span className="text-sm text-slate-500">Acordado: ${task.price}</span>
              </Link>
              <div>
                <TaskCompleteButton taskId={task.id} />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {delivered.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-medium text-slate-900">Entregadas</h2>
          <ul className="flex flex-col gap-3">
            {delivered.map((task) => (
              <li key={task.id}>
                <Link
                  href={`/tasks/${task.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm hover:border-sky-300 hover:shadow"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">{task.subject}</span>
                    <TaskStatusBadge status={task.status} />
                  </div>
                  <span className="text-sm text-slate-500">Acordado: ${task.price}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
