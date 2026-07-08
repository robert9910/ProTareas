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
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-900">
          <GraduationCap className="size-5 text-sky-600" />
          ProTareas
        </Link>

        <nav className="flex flex-1 items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900"
          >
            <LayoutDashboard className="size-4" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>
          <Link
            href="/tasks"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900"
          >
            <ListTodo className="size-4" />
            <span className="hidden sm:inline">
              {isStudent ? "Mis tareas" : "Tareas abiertas"}
            </span>
          </Link>
          {isStudent && (
            <Link
              href="/tasks/new"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900"
            >
              <PlusCircle className="size-4" />
              <span className="hidden sm:inline">Publicar</span>
            </Link>
          )}
          {isAdvisor && (
            <Link
              href="/tasks/accepted"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900"
            >
              <PackageCheck className="size-4" />
              <span className="hidden sm:inline">Por entregar</span>
            </Link>
          )}
          {isAdvisor && (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900"
            >
              <UserCircle className="size-4" />
              <span className="hidden sm:inline">Mi perfil</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-500 md:inline">{email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
