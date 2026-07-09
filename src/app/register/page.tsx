"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { btnPrimary, inputClass, card } from "@/lib/ui";

type Role = "student" | "advisor";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!acceptedTerms) {
      setError("Debes aceptar los Términos de Servicio y el Aviso de Privacidad.");
      return;
    }

    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setConfirmEmailSent(true);
    }
  }

  if (confirmEmailSent) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 bg-surface-alt px-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/10">
          <Mail className="size-9 text-brand-dark" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Revisa tu correo</h1>
        <p className="text-sm text-ink/60">
          Te enviamos un enlace de confirmación a <strong className="text-ink">{email}</strong>.
          Confírmalo para poder iniciar sesión.
        </p>
        <Link href="/login" className="text-sm font-semibold text-brand-dark hover:underline">
          Ir a iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 bg-surface-alt px-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="ProTareas" width={28} height={28} className="size-7" />
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Crear cuenta</h1>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-semibold text-ink">Soy...</legend>
          <div className="flex gap-3">
            <label
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                role === "student"
                  ? "border-brand bg-brand/10 text-brand-dark"
                  : "border-ink/10 text-ink/60 hover:border-ink/20"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="sr-only"
              />
              Estudiante
            </label>
            <label
              className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                role === "advisor"
                  ? "border-brand bg-brand/10 text-brand-dark"
                  : "border-ink/10 text-ink/60 hover:border-ink/20"
              }`}
            >
              <input
                type="radio"
                name="role"
                value="advisor"
                checked={role === "advisor"}
                onChange={() => setRole("advisor")}
                className="sr-only"
              />
              Asesor
            </label>
          </div>
        </fieldset>

        <label className="flex items-start gap-2 text-sm text-ink/60">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 accent-brand"
          />
          Acepto los{" "}
          <Link href="/terms" target="_blank" className="font-medium text-brand-dark hover:underline">
            Términos de Servicio
          </Link>{" "}
          y el{" "}
          <Link href="/privacy" target="_blank" className="font-medium text-brand-dark hover:underline">
            Aviso de Privacidad
          </Link>
        </label>

        {error && <p className="text-sm font-medium text-status-rejected">{error}</p>}

        <button type="submit" disabled={loading} className={btnPrimary}>
          <UserPlus className="size-4" />
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center text-sm text-ink/60">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-brand-dark hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
