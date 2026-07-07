"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "rounded-md border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function NewTaskPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Debes iniciar sesión.");
      setLoading(false);
      return;
    }

    const { data: task, error: insertError } = await supabase
      .from("tasks")
      .insert({
        student_id: user.id,
        subject,
        description,
        budget: budget ? Number(budget) : null,
        due_date: dueDate || null,
      })
      .select("id")
      .single();

    if (insertError || !task) {
      setError(insertError?.message ?? "No se pudo crear la tarea.");
      setLoading(false);
      return;
    }

    if (file) {
      const path = `${user.id}/${task.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("task-files")
        .upload(path, file);

      if (uploadError) {
        setError(`Tarea creada, pero falló la subida del archivo: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      await supabase.from("tasks").update({ file_url: path }).eq("id", task.id);
    }

    setLoading(false);
    router.push(`/tasks/${task.id}`);
    router.refresh();
  }

  return (
    <main className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Publicar tarea</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="subject" className="text-sm font-medium text-slate-700">
            Materia
          </label>
          <input
            id="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-slate-700">
            Descripción
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="budget" className="text-sm font-medium text-slate-700">
            Presupuesto
          </label>
          <input
            id="budget"
            type="number"
            min="0"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
            Fecha límite
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="file" className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <Paperclip className="size-4" />
            Archivo (opcional)
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-sm file:font-medium hover:file:bg-slate-200"
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Publicando..." : "Publicar tarea"}
        </button>
      </form>
    </main>
  );
}
