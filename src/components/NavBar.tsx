import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  ListTodo,
  PlusCircle,
  PackageCheck,
  UserCircle,
  Banknote,
} from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { isAdminEmail } from "@/lib/admin";

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
  const isAdmin = isAdminEmail(email);

  return (
    <header className="border-b border-ink/10 bg-white shadow-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href={isAdmin ? "/admin/payments" : "/dashboard"}
          className="flex items-center gap-2 font-extrabold text-ink"
        >
          <Image src="/logo.png" alt="ProTareas" width={40} height={40} className="size-10" priority />
          ProTareas
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {isAdmin ? (
            <Link href="/admin/payments" className={navLinkClass}>
              <Banknote className="size-4" />
              <span className="hidden sm:inline">Pagos</span>
            </Link>
          ) : (
            <>
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
            </>
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
