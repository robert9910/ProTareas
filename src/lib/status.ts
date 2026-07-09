export const TASK_STATUS: Record<
  string,
  { label: string; badge: string; border: string }
> = {
  open: {
    label: "Abierta",
    badge: "bg-status-open/10 text-status-open ring-status-open/30",
    border: "border-l-status-open",
  },
  assigned: {
    label: "Asignada",
    badge: "bg-status-pending/10 text-status-pending ring-status-pending/30",
    border: "border-l-status-pending",
  },
  completed: {
    label: "Completada",
    badge: "bg-status-completed/10 text-status-completed ring-status-completed/30",
    border: "border-l-status-completed",
  },
  cancelled: {
    label: "Cancelada",
    badge: "bg-status-rejected/10 text-status-rejected ring-status-rejected/30",
    border: "border-l-status-rejected",
  },
};

export const PROPOSAL_STATUS: Record<
  string,
  { label: string; badge: string; border: string }
> = {
  pending: {
    label: "Pendiente",
    badge: "bg-status-pending/10 text-status-pending ring-status-pending/30",
    border: "border-l-status-pending",
  },
  accepted: {
    label: "Aceptada",
    badge: "bg-status-completed/10 text-status-completed ring-status-completed/30",
    border: "border-l-status-completed",
  },
  rejected: {
    label: "Rechazada",
    badge: "bg-status-rejected/10 text-status-rejected ring-status-rejected/30",
    border: "border-l-status-rejected",
  },
};
