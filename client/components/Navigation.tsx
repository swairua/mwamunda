import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import ContactModal from "./ContactModal";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/careers", label: "Careers" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-100"
          : "bg-gradient-to-b from-white/40 to-transparent"
      }`}
    >
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group hover:opacity-85 transition-opacity flex-shrink-0"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F675a5c01881345b88968fcdd971866d7%2F7e6019eab478401686a679312028d4e8?format=webp&width=800"
              alt="Mwamunda Investment Limited"
              className="h-12 sm:h-14 md:h-20 w-auto drop-shadow-sm"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-3 py-2 text-base lg:text-lg font-medium rounded-lg transition-all duration-300 relative group hover:bg-primary/10 text-foreground"
              >
                {link.label}
                <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:right-3 group-hover:left-auto transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:block flex-shrink-0">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="px-5 lg:px-7 py-2.5 lg:py-3 text-sm lg:text-base rounded-lg bg-gradient-to-r from-primary via-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${
              isScrolled
                ? "hover:bg-gray-200 text-foreground"
                : "hover:bg-white/20 text-white"
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 sm:pb-6 space-y-1 animate-slide-in-down bg-white/98 backdrop-blur-lg border-t border-gray-100">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 sm:px-6 py-3 rounded-lg text-base font-medium text-foreground hover:bg-primary/5 transition-all duration-200 transform hover:translate-x-1"
                onClick={() => setIsOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 sm:px-6 pt-2">
              <button
                onClick={() => {
                  setIsContactModalOpen(true);
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      <ContactModal
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </nav>
  );
}
