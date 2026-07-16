import type { NextConfig } from "next";

// Nota: 'unsafe-inline' en script-src es necesario porque Next.js App
// Router inyecta scripts inline para hidratar (payload de RSC) y esta
// version no aplico automaticamente un nonce por request via
// middleware (se probo y los scripts internos de Next igual quedaban
// bloqueados). El resto de directivas compensan: nada puede cargarse
// desde un host externo (default-src/connect-src/img-src a 'self' +
// dominio de Supabase), no se puede incrustar en un iframe ajeno
// (frame-ancestors), y no hay <object>/<base>/formularios hacia otro
// origen.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://*.supabase.co",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
