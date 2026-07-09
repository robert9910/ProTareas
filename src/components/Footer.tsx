import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61554467570327&locale=es_LA";
const WHATSAPP_URL = "https://wa.me/526462587803";
const EMAIL = "robertoab1022@gmail.com";

const linkClass =
  "flex items-center gap-2 text-sm font-medium text-ink/60 transition hover:text-brand-dark";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink/10 bg-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-extrabold text-ink">ProTareas</p>
          <p className="text-sm text-ink/50">Asesoría académica confiable.</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className={linkClass}>
            <FacebookIcon />
            Facebook
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={linkClass}>
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <a href={`mailto:${EMAIL}`} className={linkClass}>
            <Mail className="size-4" />
            {EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-ink/10 px-4 py-3 text-center text-xs text-ink/40">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 sm:flex-row">
          <span>© {new Date().getFullYear()} ProTareas. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-ink/70">
              Términos de Servicio
            </Link>
            <Link href="/privacy" className="hover:text-ink/70">
              Aviso de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
