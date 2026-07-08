"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "rounded-md border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500";

export function AdvisorProfileForm({
  userId,
  initialSubjects,
  initialBio,
  initialHourlyRate,
}: {
  userId: string;
  initialSubjects: string;
  initialBio: string;
  initialHourlyRate: string;
}) {
  const router = useRouter();
  const [subjects, setSubjects] = useState(initialSubjects);
  const [bio, setBio] = useState(initialBio);
  const [hourlyRate, setHourlyRate] = useState(initialHourlyRate);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setLoading(true);

    const supabase = createClient();
    const { error: upsertError } = await supabase.from("advisor_profiles").upsert(
      {
        user_id: userId,
        subjects: subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        bio,
        hourly_rate: hourlyRate ? Number(hourlyRate) : null,
      },
      { onConflict: "user_id" }
    );

    setLoading(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="subjects" className="text-sm font-medium text-slate-700">
          Materias (separadas por coma)
        </label>
        <input
          id="subjects"
          type="text"
          placeholder="Cálculo, Física, Programación"
          value={subjects}
          onChange={(e) => setSubjects(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="bio" className="text-sm font-medium text-slate-700">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="hourlyRate" className="text-sm font-medium text-slate-700">
          Tarifa por hora
        </label>
        <input
          id="hourlyRate"
          type="number"
          min="0"
          step="0.01"
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">Perfil guardado.</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-1.5 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
      >
        <Save className="size-4" />
        {loading ? "Guardando..." : "Guardar perfil"}
      </button>
    </form>
  );
}
