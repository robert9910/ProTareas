import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalActions } from "@/components/ProposalActions";

const STATUS_LABEL: Record<string, string> = {
  open: "abierta",
  assigned: "asignada",
  completed: "completada",
  cancelled: "cancelada",
};

const PROPOSAL_STATUS_LABEL: Record<string, string> = {
  pending: "pendiente",
  accepted: "aceptada",
  rejected: "rechazada",
};

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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-12">
      <Link href="/tasks" className="text-sm text-blue-600 underline">
        ← Volver a tareas
      </Link>

      <div className="flex flex-col gap-2 rounded-md border border-gray-300 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{task.subject}</h1>
          <span className="text-xs text-gray-500">
            {STATUS_LABEL[task.status] ?? task.status}
          </span>
        </div>
        <p className="text-sm text-gray-700">{task.description}</p>
        {task.budget && (
          <span className="text-sm text-gray-500">Presupuesto: ${task.budget}</span>
        )}
        {task.due_date && (
          <span className="text-sm text-gray-500">
            Fecha límite: {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
        {fileUrl && (
          <a href={fileUrl} target="_blank" className="text-sm text-blue-600 underline">
            Ver archivo adjunto
          </a>
        )}
      </div>

      {isAdvisor && !isOwner && (
        <>
          {myProposal ? (
            <div className="rounded-md border border-gray-300 p-4 text-sm">
              Ya enviaste una propuesta de ${myProposal.price} — estado:{" "}
              {PROPOSAL_STATUS_LABEL[myProposal.status] ?? myProposal.status}
            </div>
          ) : (
            <ProposalForm taskId={task.id} />
          )}
        </>
      )}

      {isOwner && (
        <div className="flex flex-col gap-3">
          <h2 className="font-medium">Propuestas ({proposals?.length ?? 0})</h2>
          {!proposals?.length && (
            <p className="text-sm text-gray-600">Aún no has recibido propuestas.</p>
          )}
          {proposals?.map((proposal) => (
            <div
              key={proposal.id}
              className="flex flex-col gap-2 rounded-md border border-gray-300 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">${proposal.price}</span>
                <span className="text-xs text-gray-500">
                  {PROPOSAL_STATUS_LABEL[proposal.status] ?? proposal.status}
                </span>
              </div>
              {proposal.message && (
                <p className="text-sm text-gray-700">{proposal.message}</p>
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
