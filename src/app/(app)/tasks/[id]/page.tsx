import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calendar, DollarSign, Paperclip, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalActions } from "@/components/ProposalActions";
import { TaskStatusBadge, ProposalStatusBadge, taskBorderClass } from "@/components/StatusBadge";
import { TaskCompleteButton } from "@/components/TaskCompleteButton";
import { MessageThread } from "@/components/MessageThread";
import { ReviewForm } from "@/components/ReviewForm";
import { ReviewDisplay } from "@/components/ReviewDisplay";
import { card } from "@/lib/ui";

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

  const advisorIds = proposals?.map((p) => p.advisor_id) ?? [];
  const { data: advisorProfiles } = advisorIds.length
    ? await supabase
        .from("advisor_profiles")
        .select("user_id, subjects, bio, rating_avg")
        .in("user_id", advisorIds)
    : { data: [] };

  const profileByAdvisor = new Map(advisorProfiles?.map((p) => [p.user_id, p]));

  const { data: payments } = isOwner
    ? await supabase
        .from("payments")
        .select("id, proposal_id, status")
        .eq("task_id", id)
    : { data: [] };

  const paymentByProposal = new Map(payments?.map((p) => [p.proposal_id, p]));

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
  const acceptedProposal = proposals?.find((p) => p.status === "accepted");

  const { data: review } = await supabase
    .from("reviews")
    .select("rating, comment")
    .eq("task_id", id)
    .maybeSingle();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10">
      <Link
        href="/tasks"
        className="flex items-center gap-1 text-sm font-semibold text-brand-dark hover:underline"
      >
        <ArrowLeft className="size-4" />
        Volver a tareas
      </Link>

      <div className={`flex flex-col gap-2 border-l-4 ${taskBorderClass(task.status)} ${card}`}>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">{task.subject}</h1>
          <TaskStatusBadge status={task.status} />
        </div>
        <p className="text-sm text-ink/70">{task.description}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 pt-1 text-sm text-ink/50">
          {task.budget && (
            <span className="flex items-center gap-1 font-semibold text-ink/70">
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
              className="flex items-center gap-1 font-medium text-brand-dark hover:underline"
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

      {task.status === "completed" && (
        <>
          {review ? (
            <ReviewDisplay rating={review.rating} comment={review.comment} />
          ) : (
            isOwner &&
            acceptedProposal && (
              <ReviewForm
                taskId={task.id}
                studentId={user.id}
                advisorId={acceptedProposal.advisor_id}
              />
            )
          )}
        </>
      )}

      {isAdvisor && !isOwner && (
        <>
          {myProposal ? (
            <div className={`flex items-center justify-between text-sm ${card}`}>
              <span className="text-ink/70">
                Ya enviaste una propuesta de{" "}
                <strong className="text-ink">${myProposal.price}</strong>
              </span>
              <ProposalStatusBadge status={myProposal.status} />
            </div>
          ) : (
            <ProposalForm taskId={task.id} />
          )}
        </>
      )}

      {isOwner && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-ink">
            Propuestas ({proposals?.length ?? 0})
          </h2>
          {!proposals?.length && (
            <div className="rounded-2xl border-2 border-dashed border-ink/15 bg-surface-alt px-4 py-8 text-center text-sm text-ink/50">
              Aún no has recibido propuestas.
            </div>
          )}
          {proposals?.map((proposal) => {
            const advisorProfile = profileByAdvisor.get(proposal.advisor_id);
            return (
              <div
                key={proposal.id}
                className={`flex flex-col gap-2 border-l-4 ${taskBorderClass(
                  proposal.status === "accepted"
                    ? "completed"
                    : proposal.status === "rejected"
                      ? "cancelled"
                      : "assigned"
                )} ${card}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-lg font-bold text-ink">${proposal.price}</span>
                  <ProposalStatusBadge status={proposal.status} />
                </div>
                {advisorProfile && (
                  <div className="flex flex-col gap-1 rounded-lg bg-surface-alt p-3 text-sm text-ink/60">
                    {advisorProfile.subjects?.length > 0 && (
                      <span>
                        <span className="font-semibold text-ink/80">Materias:</span>{" "}
                        {advisorProfile.subjects.join(", ")}
                      </span>
                    )}
                    {advisorProfile.bio && <span>{advisorProfile.bio}</span>}
                    {advisorProfile.rating_avg > 0 && (
                      <span className="flex items-center gap-1 font-semibold text-ink/80">
                        <Star className="size-3.5 fill-status-pending text-status-pending" />
                        {advisorProfile.rating_avg}
                      </span>
                    )}
                  </div>
                )}
                {proposal.message && (
                  <p className="text-sm text-ink/70">{proposal.message}</p>
                )}
                {proposal.status === "pending" && (
                  <ProposalActions
                    proposalId={proposal.id}
                    studentId={user.id}
                    payment={paymentByProposal.get(proposal.id) ?? null}
                  />
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
