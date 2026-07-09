"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-lg border-2 border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink transition hover:bg-surface-alt"
    >
      <LogOut className="size-4" />
      <span className="hidden sm:inline">Cerrar sesión</span>
    </button>
  );
}
