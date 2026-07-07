import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Paperclip } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalActions } from "@/components/ProposalActions";
import { TaskStatusBadge, ProposalStatusBadge } from "@/components/StatusBadge";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("id, subject, description, budget, due_date, status, student_id, file_url")
    .eq("id", id)
    .single();

  if (!task) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isOwner = user.id === task.student_id;
  const isAdvisor = profile?.role === "advisor";

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, advisor_id, price, message, status, created_at")
    .eq("task_id", id)
    .order("created_at", { ascending: true });

  let fileUrl: string | null = null;
  if (task.file_url) {
    const { data: signed } = await supabase.storage
      .from("task-files")
      .createSignedUrl(task.file_url, 60 * 60);
    fileUrl = signed?.signedUrl ?? null;
  }

  const myProposal = proposals?.find((p) => p.advisor_id === user.id);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <Link
        href="/tasks"
        className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="size-4" />
        Volver a tareas
      </Link>

      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{task.subject}</h1>
          <TaskStatusBadge status={task.status} />
        </div>
        <p className="text-sm text-slate-700">{task.description}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-sm text-slate-500">
          {task.budget && (
            <span className="flex items-center gap-1">
              <DollarSign className="size-4" />
              Presupuesto: ${task.budget}
            </span>
          )}
          {task.due_date && (
            <span className="flex items-center gap-1">
              <Calendar className="size-4" />
              {new Date(task.due_date).toLocaleDateString()}
            </span>
          )}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
            >
              <Paperclip className="size-4" />
              Ver archivo adjunto
            </a>
          )}
        </div>
      </div>

      {isAdvisor && !isOwner && (
        <>
          {myProposal ? (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm">
              <span>Ya enviaste una propuesta de ${myProposal.price}</span>
              <ProposalStatusBadge status={myProposal.status} />
            </div>
          ) : (
            <ProposalForm taskId={task.id} />
          )}
        </>
      )}

      {isOwner && (
        <div className="flex flex-col gap-3">
          <h2 className="font-medium text-slate-900">
            Propuestas ({proposals?.length ?? 0})
          </h2>
          {!proposals?.length && (
            <p className="text-sm text-slate-500">Aún no has recibido propuestas.</p>
          )}
          {proposals?.map((proposal) => (
            <div
              key={proposal.id}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-slate-900">${proposal.price}</span>
                <ProposalStatusBadge status={proposal.status} />
              </div>
              {proposal.message && (
                <p className="text-sm text-slate-700">{proposal.message}</p>
              )}
              {proposal.status === "pending" && (
                <ProposalActions proposalId={proposal.id} taskId={task.id} />
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
