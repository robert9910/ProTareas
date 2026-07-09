"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { card } from "@/lib/ui";

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export function MessageThread({
  taskId,
  currentUserId,
}: {
  taskId: string;
  currentUserId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase
      .from("messages")
      .select("id, sender_id, content, created_at")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data ?? []));

    const channel = supabase
      .channel(`messages:${taskId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `task_id=eq.${taskId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);

    const supabase = createClient();
    await supabase.from("messages").insert({
      task_id: taskId,
      sender_id: currentUserId,
      content: content.trim(),
    });

    setContent("");
    setSending(false);
  }

  return (
    <div className={`flex flex-col gap-3 ${card}`}>
      <h2 className="flex items-center gap-1.5 text-lg font-bold text-ink">
        <MessageCircle className="size-4" />
        Mensajes
      </h2>

      <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {!messages.length && (
          <p className="text-sm text-ink/50">Aún no hay mensajes. Escribe el primero.</p>
        )}
        {messages.map((m) => {
          const isMine = m.sender_id === currentUserId;
          return (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                isMine
                  ? "self-end bg-brand text-white"
                  : "self-start bg-surface-alt text-ink"
              }`}
            >
              {m.content}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-lg border-2 border-ink/10 px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="flex items-center justify-center rounded-lg bg-brand px-3 py-2 text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}
