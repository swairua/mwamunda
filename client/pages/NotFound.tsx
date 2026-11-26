import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productLinks } from "@/lib/site";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <section className="bg-surface">
      <div className="container-site py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow mb-4">Error 404</p>
          <h1 className="h-page">We can't find that page</h1>
          <p className="lead mt-5">
            The page may have moved or the link may be out of date. Here are
            some places to go instead.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link to="/">
                Back to home
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>

          <ul className="mt-12 divide-y divide-border border-y border-border">
            {productLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="flex min-h-14 items-center justify-between gap-4 font-semibold text-foreground hover:text-primary"
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
