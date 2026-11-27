import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { logo, navLinks, productLinks, site } from "@/lib/site";
import WhatsAppIcon from "./WhatsAppIcon";

const linkClass =
  "inline-flex min-h-11 items-center text-white/75 transition-colors hover:text-white";

export default function SiteFooter() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container-site py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              to="/"
              className="inline-block rounded-xl bg-white p-3"
              aria-label={`${site.name} — home`}
            >
              <img
                src={logo.src}
                alt={site.name}
                width={641}
                height={389}
                loading="lazy"
                className="h-16 w-auto mix-blend-multiply"
              />
            </Link>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-white/75">
              Fair lending, debt advice and financial training for chamas and
              small businesses since {site.foundedYear}.
            </p>
          </div>

          <nav aria-label="Products">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Products
            </h2>
            <ul className="mt-4 text-[0.9375rem]">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h2>
            <ul className="mt-4 text-[0.9375rem]">
              {navLinks
                .filter((link) => link.to !== "/")
                .map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Talk to us
            </h2>
            <ul className="mt-4 space-y-1 text-[0.9375rem]">
              {site.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href} className={`${linkClass} gap-3`}>
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {phone.display}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.whatsapp.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${linkClass} gap-3`}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp {site.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className={`${linkClass} gap-3`}
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.customerCareEmail}`}
                  className={`${linkClass} gap-3`}
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {site.customerCareEmail}
                </a>
              </li>
              <li className="flex gap-3 pt-2 text-white/75">
                <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                <address className="not-italic leading-relaxed">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-6 text-sm text-white/65 sm:flex-row sm:items-center sm:justify-between sm:pr-20">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Designed and developed by{" "}
            <a
              href={site.credit.href}
              target="_blank"
              rel="noopener"
              className="font-semibold text-white underline-offset-4 hover:underline"
            >
              {site.credit.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
