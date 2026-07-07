import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold">Asesores Académicos</h1>
      <p className="text-gray-600">
        Conecta estudiantes con asesores académicos para resolver tareas y
        proyectos.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}
