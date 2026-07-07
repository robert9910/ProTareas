"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Publicar tarea</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="subject" className="text-sm font-medium">
            Materia
          </label>
          <input
            id="subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="budget" className="text-sm font-medium">
            Presupuesto
          </label>
          <input
            id="budget"
            type="number"
            min="0"
            step="0.01"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Fecha límite
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="file" className="text-sm font-medium">
            Archivo (opcional)
          </label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Publicando..." : "Publicar tarea"}
        </button>
      </form>
    </main>
  );
}
