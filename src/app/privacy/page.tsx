import Link from "next/link";

export const metadata = {
  title: "Aviso de Privacidad — ProTareas",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-10 text-sm text-ink/80">
      <Link href="/" className="text-sm font-medium text-brand-dark hover:underline">
        ← ProTareas
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight text-ink">Aviso de Privacidad</h1>
      <p className="text-ink/50">Última actualización: [fecha]</p>

      <div className="rounded-lg bg-status-pending/10 p-4 text-amber-900 ring-1 ring-status-pending/30">
        Este es un borrador de referencia. Antes de lanzar, revísalo con un abogado —
        en México aplica la Ley Federal de Protección de Datos Personales en Posesión de
        los Particulares (LFPDPPP), que exige un aviso de privacidad con requisitos
        específicos.
      </div>

      <h2 className="mt-2 font-bold text-ink">1. Datos que recopilamos</h2>
      <ul className="list-disc pl-5">
        <li>Correo electrónico y contraseña (gestionados por Supabase Auth).</li>
        <li>Rol (estudiante o asesor), materias, bio y tarifa (si eres asesor).</li>
        <li>Contenido de tareas, propuestas y mensajes que publiques.</li>
        <li>Archivos que subas como adjuntos a tus tareas.</li>
        <li>
          Datos de pago: ProTareas no almacena números de tarjeta. Mercado Pago procesa
          los pagos y nos comparte el estado de la transacción (aprobado, rechazado,
          pendiente) y un identificador de pago.
        </li>
      </ul>

      <h2 className="mt-2 font-bold text-ink">2. Para qué usamos tus datos</h2>
      <p>
        Para operar la plataforma: mostrar tareas y propuestas a las partes relevantes,
        procesar pagos, permitir mensajería entre estudiante y asesor, y calcular
        calificaciones.
      </p>

      <h2 className="mt-2 font-bold text-ink">3. Con quién compartimos datos</h2>
      <p>
        Con Supabase (hosting de base de datos y autenticación) y Mercado Pago
        (procesamiento de pagos). No vendemos tus datos a terceros.
      </p>

      <h2 className="mt-2 font-bold text-ink">4. Tus derechos (ARCO)</h2>
      <p>
        Puedes solicitar acceso, rectificación, cancelación u oposición sobre tus datos
        personales escribiendo a [correo de contacto].
      </p>

      <h2 className="mt-2 font-bold text-ink">5. Contacto</h2>
      <p>[correo de contacto / soporte]</p>
    </main>
  );
}
