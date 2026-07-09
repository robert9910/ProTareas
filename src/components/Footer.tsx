import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61554467570327&locale=es_LA";
const WHATSAPP_URL = "https://wa.me/526462587803";
const EMAIL = "robertoab1022@gmail.com";

const contactLinkClass =
  "flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto bg-brand-dark text-white">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-10 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="ProTareas"
              width={32}
              height={32}
              className="size-8 rounded-lg bg-white/90 p-0.5"
            />
            <span className="text-lg font-extrabold">ProTareas</span>
          </div>
          <p className="max-w-xs text-sm text-white/70">
            Conectamos estudiantes con asesores académicos de confianza.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className={contactLinkClass}>
            <FacebookIcon />
            Facebook
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={contactLinkClass}>
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
          <a href={`mailto:${EMAIL}`} className={contactLinkClass}>
            <Mail className="size-4" />
            {EMAIL}
          </a>
        </div>
      </div>

      <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/60">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 sm:flex-row">
          <span>© {new Date().getFullYear()} ProTareas. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="transition hover:text-white">
              Términos de Servicio
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Aviso de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
