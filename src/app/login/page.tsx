"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputClass, card } from "@/lib/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 bg-surface-alt px-4">
      <div className="flex items-center gap-2">
        <GraduationCap className="size-7 text-brand-dark" />
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Iniciar sesión</h1>
      </div>

      <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${card}`}>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-semibold text-ink">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-semibold text-ink">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}

        <button type="submit" disabled={loading} className={btnPrimary}>
          <LogIn className="size-4" />
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-brand-dark hover:underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
