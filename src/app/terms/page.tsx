import Link from "next/link";

export const metadata = {
  title: "Términos de Servicio — ProTareas",
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10 text-sm text-slate-700">
      <Link href="/" className="text-sm font-medium text-sky-600 hover:text-sky-700">
        ← ProTareas
      </Link>

      <h1 className="text-2xl font-semibold text-slate-900">Términos de Servicio</h1>
      <p className="text-slate-500">Última actualización: [fecha]</p>

      <div className="rounded-lg bg-amber-50 p-4 text-amber-800 ring-1 ring-amber-600/20">
        Este es un borrador de referencia, no un documento legal validado. Antes de
        lanzar la app, hazlo revisar por un abogado en tu jurisdicción — especialmente
        las secciones de pagos, cancelaciones y responsabilidad.
      </div>

      <h2 className="mt-2 font-semibold text-slate-900">1. Qué es ProTareas</h2>
      <p>
        ProTareas es una plataforma que conecta estudiantes con asesores académicos
        independientes para la realización de tareas y proyectos académicos. ProTareas
        no es parte de la relación de servicio entre estudiante y asesor: actúa
        únicamente como intermediario tecnológico y de cobro.
      </p>

      <h2 className="mt-2 font-semibold text-slate-900">2. Cuentas y roles</h2>
      <p>
        Al registrarte eliges un rol (estudiante o asesor). Eres responsable de la
        veracidad de la información que proporciones y de mantener la confidencialidad
        de tu contraseña.
      </p>

      <h2 className="mt-2 font-semibold text-slate-900">3. Publicación de tareas y propuestas</h2>
      <p>
        Los estudiantes publican tareas con una descripción y, opcionalmente, un
        presupuesto y archivos adjuntos. Los asesores pueden enviar propuestas con un
        precio y mensaje. El estudiante decide libremente qué propuesta aceptar.
      </p>

      <h2 className="mt-2 font-semibold text-slate-900">4. Pagos</h2>
      <p>
        Los pagos se procesan a través de Mercado Pago. Al aceptar una propuesta, el
        estudiante autoriza el cargo por el monto acordado. ProTareas no almacena datos
        de tarjetas — esa información la maneja Mercado Pago directamente.
      </p>
      <p>
        [Definir aquí: política de cancelación, reembolsos parciales/totales, qué pasa
        si el asesor no entrega, plazos para disputas.]
      </p>

      <h2 className="mt-2 font-semibold text-slate-900">5. Conducta esperada</h2>
      <p>
        Está prohibido el uso de la plataforma para plagio, fraude académico o cualquier
        actividad ilegal. ProTareas se reserva el derecho de suspender cuentas que
        incumplan estos términos.
      </p>

      <h2 className="mt-2 font-semibold text-slate-900">6. Limitación de responsabilidad</h2>
      <p>
        ProTareas no garantiza la calidad del trabajo entregado por los asesores ni es
        responsable de disputas entre estudiante y asesor fuera de lo gestionado por la
        plataforma. El uso del servicio es bajo tu propio riesgo.
      </p>

      <h2 className="mt-2 font-semibold text-slate-900">7. Contacto</h2>
      <p>[correo de contacto / soporte]</p>
    </main>
  );
}
