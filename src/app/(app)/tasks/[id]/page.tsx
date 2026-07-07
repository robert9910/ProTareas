import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Paperclip, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalActions } from "@/components/ProposalActions";
import { TaskStatusBadge, ProposalStatusBadge } from "@/components/StatusBadge";
import { TaskCompleteButton } from "@/components/TaskCompleteButton";
import { MessageThread } from "@/components/MessageThread";

const PAYMENT_BANNER: Record<string, { text: string; className: string }> = {
  success: {
    text: "¡Pago aprobado! Estamos confirmando la propuesta, puede tardar unos segundos.",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  },
  pending: {
    text: "Tu pago quedó pendiente de confirmación.",
    className: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20",
  },
  failure: {
    text: "El pago no se completó. Puedes intentarlo de nuevo.",
    className: "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20",
  },
};

export default async function TaskDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { id } = await params;
  const { payment } = await searchParams;
  const paymentBanner = payment ? PAYMENT_BANNER[payment] : null;
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

  const advisorIds = proposals?.map((p) => p.advisor_id) ?? [];
  const { data: advisorProfiles } = advisorIds.length
    ? await supabase
        .from("advisor_profiles")
        .select("user_id, subjects, bio, rating_avg")
        .in("user_id", advisorIds)
    : { data: [] };

  const profileByAdvisor = new Map(advisorProfiles?.map((p) => [p.user_id, p]));

  let fileUrl: string | null = null;
  if (task.file_url) {
    const { data: signed } = await supabase.storage
      .from("task-files")
      .createSignedUrl(task.file_url, 60 * 60);
    fileUrl = signed?.signedUrl ?? null;
  }

  const myProposal = proposals?.find((p) => p.advisor_id === user.id);
  const isParticipant = isOwner || Boolean(myProposal);
  const isAcceptedAdvisor = myProposal?.status === "accepted";

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <Link
        href="/tasks"
        className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        <ArrowLeft className="size-4" />
        Volver a tareas
      </Link>

      {paymentBanner && (
        <div className={`rounded-lg px-4 py-3 text-sm ${paymentBanner.className}`}>
          {paymentBanner.text}
        </div>
      )}

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

        {isAcceptedAdvisor && task.status === "assigned" && (
          <div className="pt-2">
            <TaskCompleteButton taskId={task.id} />
          </div>
        )}
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
          {proposals?.map((proposal) => {
            const advisorProfile = profileByAdvisor.get(proposal.advisor_id);
            return (
              <div
                key={proposal.id}
                className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">${proposal.price}</span>
                  <ProposalStatusBadge status={proposal.status} />
                </div>
                {advisorProfile && (
                  <div className="flex flex-col gap-1 rounded-md bg-slate-50 p-2 text-sm text-slate-600">
                    {advisorProfile.subjects?.length > 0 && (
                      <span>Materias: {advisorProfile.subjects.join(", ")}</span>
                    )}
                    {advisorProfile.bio && <span>{advisorProfile.bio}</span>}
                    {advisorProfile.rating_avg > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {advisorProfile.rating_avg}
                      </span>
                    )}
                  </div>
                )}
                {proposal.message && (
                  <p className="text-sm text-slate-700">{proposal.message}</p>
                )}
                {proposal.status === "pending" && (
                  <ProposalActions proposalId={proposal.id} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {isParticipant && <MessageThread taskId={task.id} currentUserId={user.id} />}
    </main>
  );
}
