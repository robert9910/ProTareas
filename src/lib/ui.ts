// Recetas de botones reutilizables sobre los tokens de marca
// (ver @theme en globals.css). Un solo lugar para la jerarquia
// visual: cambiar aqui actualiza toda la app.

export const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-50 disabled:pointer-events-none";

export const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-ink/15 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-surface-alt disabled:opacity-50 disabled:pointer-events-none";

export const btnDanger =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-status-rejected/30 bg-white px-4 py-2 text-sm font-semibold text-status-rejected transition hover:bg-status-rejected/5 disabled:opacity-50 disabled:pointer-events-none";

export const btnSuccess =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-status-completed px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-50 disabled:pointer-events-none";

export const inputClass =
  "rounded-lg border-2 border-ink/10 px-3 py-2 text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export const card =
  "rounded-xl border border-ink/10 bg-white p-5 shadow-md shadow-ink/5";
