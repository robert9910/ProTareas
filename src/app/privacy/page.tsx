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
      <p className="text-ink/50">Última actualización: 16 de julio de 2026</p>

      <div className="rounded-lg bg-status-pending/10 p-3 text-xs text-amber-900 ring-1 ring-status-pending/30">
        Documento de referencia redactado para el funcionamiento actual de ProTareas.
        No sustituye asesoría legal profesional; en México aplica la Ley Federal de
        Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), así
        que si tu operación crece conviene que un abogado lo revise a detalle.
      </div>

      <h2 className="mt-2 font-bold text-ink">1. Datos que recopilamos</h2>
      <ul className="list-disc pl-5">
        <li>Correo electrónico y contraseña (gestionados por Supabase Auth).</li>
        <li>Rol (estudiante o asesor), materias, bio y tarifa (si eres asesor).</li>
        <li>Contenido de tareas, propuestas y mensajes que publiques.</li>
        <li>Archivos que subas como adjuntos a tus tareas.</li>
        <li>
          Datos de pago: ProTareas no almacena números de tarjeta ni cuentas bancarias.
          Guardamos la foto o captura del comprobante de depósito/transferencia que subas
          para verificar tu pago, y el estado de esa verificación (pendiente, aprobado,
          rechazado).
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
        Con Supabase (hosting de base de datos, autenticación y almacenamiento de
        archivos/comprobantes). No vendemos tus datos a terceros.
      </p>

      <h2 className="mt-2 font-bold text-ink">4. Tus derechos (ARCO)</h2>
      <p>
        Puedes solicitar acceso, rectificación, cancelación u oposición sobre tus datos
        personales escribiendo a{" "}
        <a href="mailto:robertoab1022@gmail.com" className="font-medium text-brand-dark hover:underline">
          robertoab1022@gmail.com
        </a>
        . Responderemos tu solicitud en un plazo razonable.
      </p>

      <h2 className="mt-2 font-bold text-ink">5. Contacto</h2>
      <p>
        <a href="mailto:robertoab1022@gmail.com" className="font-medium text-brand-dark hover:underline">
          robertoab1022@gmail.com
        </a>{" "}
        · WhatsApp:{" "}
        <a href="https://wa.me/526462587803" target="_blank" rel="noreferrer" className="font-medium text-brand-dark hover:underline">
          646 258 7803
        </a>
      </p>
    </main>
  );
}
