import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Sobre nosotros — ProTareas",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10 text-sm text-ink/80">
      <Link href="/" className="text-sm font-medium text-brand-dark hover:underline">
        ← ProTareas
      </Link>

      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="ProTareas" width={48} height={48} className="size-12" />
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Sobre nosotros</h1>
      </div>

      <p>
        ProTareas nace para resolver un problema simple: encontrar ayuda académica
        confiable no debería ser complicado. Conectamos a estudiantes con asesores
        académicos capacitados para acompañarlos en tareas, proyectos y trabajos de
        cualquier materia.
      </p>

      <h2 className="mt-2 font-bold text-ink">Cómo funciona</h2>
      <ul className="list-disc pl-5">
        <li>Publicas tu tarea con la descripción, el presupuesto y los archivos que necesites.</li>
        <li>Los asesores disponibles te envían propuestas con precio y tiempo de entrega.</li>
        <li>Eliges la propuesta que más te convenga y confirmas el pago.</li>
        <li>Te comunicas directo con tu asesor por el chat de la plataforma hasta recibir tu trabajo.</li>
      </ul>

      <h2 className="mt-2 font-bold text-ink">Nuestro compromiso</h2>
      <p>
        Cuidamos que cada asesor mantenga un buen historial de calificaciones y que cada
        estudiante tenga claridad sobre el estado de su tarea en todo momento. Si algo no
        sale como esperabas, puedes escribirnos directamente por los canales de contacto
        al final de la página.
      </p>

      <p className="mt-2">
        ¿Tienes dudas antes de registrarte?{" "}
        <a href="mailto:robertoab1022@gmail.com" className="font-medium text-brand-dark hover:underline">
          Escríbenos
        </a>
        , con gusto te ayudamos.
      </p>
    </main>
  );
}
