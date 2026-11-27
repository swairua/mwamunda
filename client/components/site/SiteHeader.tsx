import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APPLY_HREF, logo, navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import WhatsAppIcon from "./WhatsAppIcon";

export default function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          to="/"
          className="flex shrink-0 items-center rounded-md"
          aria-label={`${site.name} — home`}
        >
          <img
            src={logo.src}
            alt={site.name}
            width={641}
            height={389}
            className="h-12 w-auto mix-blend-multiply md:h-16"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-foreground/80 hover:bg-accent hover:text-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="lg" className="px-4">
            <a href={site.whatsapp.href} target="_blank" rel="noreferrer">
              <WhatsAppIcon />
              WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" className="px-5 font-semibold">
            <Link to={APPLY_HREF}>Apply for a loan</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-accent lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-white shadow-lg lg:hidden"
        >
          <nav aria-label="Mobile" className="container-site py-3">
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-12 items-center rounded-md px-3 text-base font-medium",
                        isActive
                          ? "bg-accent text-primary"
                          : "text-foreground hover:bg-accent",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-2 border-t border-border pt-4">
              <Button asChild size="xl">
                <Link to={APPLY_HREF}>Apply for a loan</Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a href={site.whatsapp.href} target="_blank" rel="noreferrer">
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
