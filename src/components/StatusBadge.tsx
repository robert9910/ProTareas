import { TASK_STATUS, PROPOSAL_STATUS } from "@/lib/status";

export function TaskStatusBadge({ status }: { status: string }) {
  const info = TASK_STATUS[status] ?? { label: status, badge: "bg-slate-100 text-slate-600 ring-slate-500/20" };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${info.badge}`}>
      {info.label}
    </span>
  );
}

export function ProposalStatusBadge({ status }: { status: string }) {
  const info = PROPOSAL_STATUS[status] ?? { label: status, badge: "bg-slate-100 text-slate-600 ring-slate-500/20" };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${info.badge}`}>
      {info.label}
    </span>
  );
}
