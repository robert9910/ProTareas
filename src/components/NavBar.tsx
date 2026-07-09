import Link from "next/link";
import {
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  PackageCheck,
  UserCircle,
} from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";

const navLinkClass =
  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-ink/60 transition hover:bg-brand/10 hover:text-brand-dark";

export function NavBar({
  role,
  email,
}: {
  role: string | null;
  email: string;
}) {
  const isStudent = role === "student";
  const isAdvisor = role === "advisor";

  return (
    <header className="border-b border-ink/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 font-extrabold text-ink">
          {/* TODO: swap for the real logo once public/logo.png exists */}
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10">
            <GraduationCap className="size-5 text-brand-dark" />
          </span>
          ProTareas
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          <Link href="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="size-4" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
          <Link href="/tasks" className={navLinkClass}>
            <ListTodo className="size-4" />
            <span className="hidden sm:inline">
              {isStudent ? "Mis tareas" : "Tareas abiertas"}
            </span>
          </Link>
          {isStudent && (
            <Link href="/tasks/new" className={navLinkClass}>
              <PlusCircle className="size-4" />
              <span className="hidden sm:inline">Publicar</span>
            </Link>
          )}
          {isAdvisor && (
            <Link href="/tasks/accepted" className={navLinkClass}>
              <PackageCheck className="size-4" />
              <span className="hidden sm:inline">Por entregar</span>
            </Link>
          )}
          {isAdvisor && (
            <Link href="/profile" className={navLinkClass}>
              <UserCircle className="size-4" />
              <span className="hidden sm:inline">Mi perfil</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-ink/50 md:inline">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
