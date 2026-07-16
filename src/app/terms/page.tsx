import Link from "next/link";

export const metadata = {
  title: "Términos de Servicio — ProTareas",
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10 text-sm text-ink/80">
      <Link href="/" className="text-sm font-medium text-brand-dark hover:underline">
        ← ProTareas
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Términos de Servicio</h1>
      <p className="text-ink/50">Última actualización: 16 de julio de 2026</p>

      <div className="rounded-lg bg-status-pending/10 p-3 text-xs text-amber-900 ring-1 ring-status-pending/30">
        Documento de referencia redactado para el funcionamiento actual de ProTareas.
        No sustituye asesoría legal profesional; si tu operación crece o cambias de
        país, conviene que un abogado lo revise.
      </div>

      <h2 className="mt-2 font-bold text-ink">1. Qué es ProTareas</h2>
      <p>
        ProTareas es una plataforma que conecta estudiantes con asesores académicos
        independientes para la realización de tareas y proyectos académicos. ProTareas
        no es parte de la relación de servicio entre estudiante y asesor: actúa
        únicamente como intermediario tecnológico y de cobro.
      </p>

      <h2 className="mt-2 font-bold text-ink">2. Cuentas y roles</h2>
      <p>
        Al registrarte eliges un rol (estudiante o asesor). Eres responsable de la
        veracidad de la información que proporciones y de mantener la confidencialidad
        de tu contraseña.
      </p>

      <h2 className="mt-2 font-bold text-ink">3. Publicación de tareas y propuestas</h2>
      <p>
        Los estudiantes publican tareas con una descripción y, opcionalmente, un
        presupuesto y archivos adjuntos. Los asesores pueden enviar propuestas con un
        precio y mensaje. El estudiante decide libremente qué propuesta aceptar.
      </p>

      <h2 className="mt-2 font-bold text-ink">4. Pagos</h2>
      <p>
        Los pagos se realizan por depósito o transferencia bancaria directa a la cuenta
        del negocio. Al aceptar una propuesta, el estudiante debe realizar el depósito y
        subir una foto o captura del comprobante dentro de la plataforma. La propuesta
        queda confirmada y la tarea asignada al asesor una vez que el equipo de
        ProTareas verifica manualmente ese comprobante.
      </p>
      <p>
        Antes de que un pago sea verificado, el estudiante puede cancelar su tarea
        libremente (mientras siga en estado &quot;abierta&quot;) sin ningún cargo. Una
        vez que el pago fue verificado y la tarea asignada, no hay reembolsos
        automáticos ni garantizados. Si el asesor no entrega, hay un problema con el
        trabajo o cualquier otra inconformidad, el estudiante debe contactar a ProTareas
        por los medios listados en la sección 7; cada caso se revisa individualmente y
        la resolución (reembolso total, parcial o reasignación a otro asesor) queda a
        discreción de ProTareas según las circunstancias.
      </p>

      <h2 className="mt-2 font-bold text-ink">5. Conducta esperada</h2>
      <p>
        Está prohibido el uso de la plataforma para plagio, fraude académico o cualquier
        actividad ilegal. ProTareas se reserva el derecho de suspender cuentas que
        incumplan estos términos.
      </p>

      <h2 className="mt-2 font-bold text-ink">6. Limitación de responsabilidad</h2>
      <p>
        ProTareas no garantiza la calidad del trabajo entregado por los asesores ni es
        responsable de disputas entre estudiante y asesor fuera de lo gestionado por la
        plataforma. El uso del servicio es bajo tu propio riesgo.
      </p>

      <h2 className="mt-2 font-bold text-ink">7. Contacto</h2>
      <p>
        Para dudas, soporte o disputas sobre un pago, escríbenos a{" "}
        <a href="mailto:robertoab1022@gmail.com" className="font-medium text-brand-dark hover:underline">
          robertoab1022@gmail.com
        </a>{" "}
        o por WhatsApp al{" "}
        <a href="https://wa.me/526462587803" target="_blank" rel="noreferrer" className="font-medium text-brand-dark hover:underline">
          646 258 7803
        </a>
        .
      </p>
    </main>
  );
}
