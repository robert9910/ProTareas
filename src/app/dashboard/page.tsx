import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

const ROLE_LABEL: Record<string, string> = {
  student: "estudiante",
  advisor: "asesor",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const roleLabel = profile ? ROLE_LABEL[profile.role] ?? profile.role : "desconocido";

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Bienvenido, eres {roleLabel}</h1>
      <p className="text-sm text-gray-600">{user.email}</p>

      <div className="flex gap-4">
        <Link
          href="/tasks"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
        >
          {profile?.role === "student" ? "Mis tareas" : "Tareas abiertas"}
        </Link>
        {profile?.role === "student" && (
          <Link
            href="/tasks/new"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Publicar tarea
          </Link>
        )}
      </div>

      <LogoutButton />
    </main>
  );
}
