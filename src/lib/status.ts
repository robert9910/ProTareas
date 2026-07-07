export const TASK_STATUS: Record<
  string,
  { label: string; badge: string }
> = {
  open: { label: "Abierta", badge: "bg-blue-50 text-blue-700 ring-blue-600/20" },
  assigned: { label: "Asignada", badge: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  completed: { label: "Completada", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  cancelled: { label: "Cancelada", badge: "bg-slate-100 text-slate-600 ring-slate-500/20" },
};

export const PROPOSAL_STATUS: Record<
  string,
  { label: string; badge: string }
> = {
  pending: { label: "Pendiente", badge: "bg-amber-50 text-amber-700 ring-amber-600/20" },
  accepted: { label: "Aceptada", badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  rejected: { label: "Rechazada", badge: "bg-rose-50 text-rose-700 ring-rose-600/20" },
};
