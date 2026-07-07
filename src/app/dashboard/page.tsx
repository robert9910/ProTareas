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
      <LogoutButton />
    </main>
  );
}
