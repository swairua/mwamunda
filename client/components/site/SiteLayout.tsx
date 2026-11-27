import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { applySeo, seoForPath } from "@/lib/seo";
import { site } from "@/lib/site";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import WhatsAppIcon from "./WhatsAppIcon";

/** Shell for every public page: skip link, header, main landmark, footer. */
export default function SiteLayout() {
  const { pathname } = useLocation();

  // Title, description, canonical and structured data follow the route.
  useEffect(() => {
    applySeo(seoForPath(pathname));
  }, [pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />

      <a
        href={site.whatsapp.href}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#128C4B] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 focus-visible:outline-offset-4"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </div>
  );
}
