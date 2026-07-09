import { TASK_STATUS, PROPOSAL_STATUS } from "@/lib/status";

const FALLBACK = {
  label: "",
  badge: "bg-ink/5 text-ink/70 ring-ink/15",
  border: "border-l-ink/20",
};

export function TaskStatusBadge({ status }: { status: string }) {
  const info = TASK_STATUS[status] ?? { ...FALLBACK, label: status };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${info.badge}`}
    >
      {info.label}
    </span>
  );
}

export function ProposalStatusBadge({ status }: { status: string }) {
  const info = PROPOSAL_STATUS[status] ?? { ...FALLBACK, label: status };
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${info.badge}`}
    >
      {info.label}
    </span>
  );
}

export function taskBorderClass(status: string): string {
  return TASK_STATUS[status]?.border ?? FALLBACK.border;
}

export function proposalBorderClass(status: string): string {
  return PROPOSAL_STATUS[status]?.border ?? FALLBACK.border;
}
