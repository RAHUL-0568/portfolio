import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Header({ metadata }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "about", label: "About" },
    { id: "projects", label: "Work" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = [
        "hero",
        "about",
        "capabilities",
        "projects",
        "philosophy",
        "contact",
      ];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (id) => {
    setMobileMenuOpen(false);
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-700 select-none ${
          isScrolled
            ? "bg-background/85 backdrop-blur-lg border-b border-black/[0.04] dark:border-white/[0.03]"
            : "bg-transparent border-b border-transparent"
        }`}
        style={{
          paddingLeft: "var(--space-page-x)",
          paddingRight: "var(--space-page-x)",
          paddingTop: "1.375rem",
          paddingBottom: "1.375rem",
        }}
      >
        <div className="flex items-center justify-between">
          {/* Brand wordmark */}
          <button
            onClick={() => handleNavigate("hero")}
            className="text-[0.85rem] uppercase tracking-[0.25em] font-semibold text-text-main hover:text-accent-primary transition-colors duration-300"
          >
            {metadata?.name || "Rahul"}{" "}
            <span
              className="font-serif-italic font-normal text-accent-primary normal-case tracking-normal"
              style={{ fontSize: "0.8rem" }}
            >
              / studio
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive =
                (link.id === "projects"
                  ? ["projects", "capabilities"].includes(activeSection)
                  : activeSection === link.id);

              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`relative py-1 text-[0.75rem] uppercase tracking-[0.2em] font-medium transition-all duration-300 focus:outline-none ${
                    isActive
                      ? "text-text-main"
                      : "text-muted/80 hover:text-text-main"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-line"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-primary"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center gap-8">
            <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-accent-primary/70 hidden lg:block cursor-default select-none">
              Available For Opportunities
            </span>
            <ThemeToggle />
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-5">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-muted hover:text-text-main transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/97 backdrop-blur-xl flex flex-col items-center justify-center gap-10 select-none">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavigate(link.id)}
              className="text-text-main font-sans font-bold tracking-tight hover:text-accent-primary transition-colors"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {link.label}
            </button>
          ))}

        </div>
      )}
    </>
  );
}

export default Header;
