import Image from "next/image";
import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";

const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=61554467570327&locale=es_LA";
const WHATSAPP_URL = "https://wa.me/526462587803";
const EMAIL = "robertoab1022@gmail.com";

const iconLinkClass =
  "flex size-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white/40 hover:text-white";

const columnLinkClass = "text-sm text-white/70 transition hover:text-white";

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
      <div className="mx-auto grid max-w-4xl gap-8 px-4 py-12 sm:grid-cols-[1.3fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
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
          <div className="flex gap-2 pt-1">
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook" className={iconLinkClass}>
              <FacebookIcon />
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp" className={iconLinkClass}>
              <MessageCircle className="size-4" />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Correo" className={iconLinkClass}>
              <Mail className="size-4" />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Nosotros
          </h3>
          <Link href="/about" className={columnLinkClass}>
            Sobre nosotros
          </Link>
          <a href={`mailto:${EMAIL}`} className={columnLinkClass}>
            Contacto
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Legal
          </h3>
          <Link href="/terms" className={columnLinkClass}>
            Condiciones de uso
          </Link>
          <Link href="/privacy" className={columnLinkClass}>
            Privacidad
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} ProTareas. Todos los derechos reservados.
      </div>
    </footer>
  );
}
