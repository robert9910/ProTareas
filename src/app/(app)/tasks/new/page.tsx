"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputClass, card } from "@/lib/ui";

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
      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Publicar tarea</h1>

      <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${card}`}>
        <div className="flex flex-col gap-1">
          <label htmlFor="subject" className="text-sm font-semibold text-ink">
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
          <label htmlFor="description" className="text-sm font-semibold text-ink">
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
          <label htmlFor="budget" className="text-sm font-semibold text-ink">
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
          <label htmlFor="dueDate" className="text-sm font-semibold text-ink">
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
          <label htmlFor="file" className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            <Paperclip className="size-4" />
            Archivo (opcional)
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm text-ink/60 file:mr-3 file:rounded-lg file:border-0 file:bg-brand/10 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brand-dark hover:file:bg-brand/20"
          />
        </div>

        {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}

        <button type="submit" disabled={loading} className={btnPrimary}>
          <PlusCircle className="size-4" />
          {loading ? "Publicando..." : "Publicar tarea"}
        </button>
      </form>
    </main>
  );
}
