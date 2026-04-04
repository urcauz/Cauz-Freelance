"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "lib/analytics";

const navItems = [
  { href: "/", label: "Home", hint: "Positioning, services, and proof" },
  { href: "/work", label: "Work", hint: "Case studies and results" },
  { href: "/playground", label: "Lab", hint: "Interactive concept playground" },
  { href: "/about", label: "About", hint: "Process, principles, and stack" },
  { href: "/contact", label: "Book", hint: "Project inquiry and call booking" }
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export default function SiteFrame({ children }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState("dark");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 16, enabled: false });

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("cauz-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("cauz-theme", theme);
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
    setPaletteOpen(false);
  }, [pathname]);

  useEffect(() => {
    trackEvent("page_view", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const full = document.documentElement.scrollHeight - window.innerHeight;
      const next = full <= 0 ? 0 : Math.min(100, Math.max(0, (window.scrollY / full) * 100));
      setProgress(next);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    if (!pointerFine) {
      setCursor((prev) => ({ ...prev, enabled: false }));
      return;
    }

    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setCursor({ x, y, enabled: true });
    };

    const onLeave = () => {
      setCursor((prev) => ({ ...prev, enabled: false }));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll(
        ".section-block, .hero-stage, .hero-command, .command-shell, .bento-card, .rail-step, .showcase-card, .lattice-card, .ribbon-card, .case-card, .quote-grid article, .panel-card, .admin-card"
      )
    );

    if (!targets.length) return;

    targets.forEach((node) => node.classList.add("reveal-target"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    targets.forEach((node, index) => {
      node.style.setProperty("--reveal-delay", `${Math.min(index * 40, 280)}ms`);
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
        return;
      }

      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        setPaletteOpen(true);
        return;
      }

      if (event.key === "Escape") {
        setPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = paletteOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen]);

  const routeIndex = useMemo(
    () => navItems.findIndex((item) => isActive(pathname, item.href)),
    [pathname]
  );

  const routeLabel = useMemo(() => {
    return navItems[routeIndex]?.label || "Cauz";
  }, [routeIndex]);

  const prevItem = useMemo(() => {
    if (routeIndex < 0) return navItems[0];
    return navItems[(routeIndex - 1 + navItems.length) % navItems.length];
  }, [routeIndex]);

  const nextItem = useMemo(() => {
    if (routeIndex < 0) return navItems[1];
    return navItems[(routeIndex + 1) % navItems.length];
  }, [routeIndex]);

  return (
    <div
      className={`site-shell ${theme}`}
      style={{
        "--cursor-x": `${cursor.x}%`,
        "--cursor-y": `${cursor.y}%`,
        "--cursor-opacity": cursor.enabled ? 1 : 0
      }}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="pointer-glow" aria-hidden />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <div className="ambient ambient-c" />
      <div className="grid-fx" />
      <div className="noise-fx" />

      <div className="scroll-meter" style={{ width: `${progress}%` }} />

      <header className="topbar">
        <Link href="/" className="brandmark">
          CAUZ
          <span>PRODUCT STUDIO</span>
        </Link>

        <nav className={`site-nav ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(pathname, item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="toolbar">
          <button
            type="button"
            className="quick-jump"
            onClick={() => setPaletteOpen(true)}
            aria-label="Open quick navigation"
          >
            Quick Nav
          </button>
          <button
            type="button"
            className="mode-switch"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <Link href="/contact" className="book-link">
            Book Project
          </Link>
          <button
            type="button"
            className="menu-switch"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="route-strip" aria-label="Page navigation helpers">
        <Link href={prevItem.href} className="route-pill">
          Prev: {prevItem.label}
        </Link>
        <span className="route-current">Now: {routeLabel}</span>
        <Link href={nextItem.href} className="route-pill">
          Next: {nextItem.label}
        </Link>
      </div>

      {paletteOpen ? (
        <div className="command-overlay" role="dialog" aria-modal="true" aria-label="Quick navigation">
          <button
            type="button"
            className="command-backdrop"
            onClick={() => setPaletteOpen(false)}
            aria-label="Close quick navigation"
          />
          <div className="command-panel">
            <p>Quick Jump</p>
            <h3>Navigate the site (Ctrl/Cmd + K)</h3>
            <div className="command-list">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(pathname, item.href) ? "command-item active" : "command-item"}
                >
                  <strong>{item.label}</strong>
                  <span>{item.hint}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      {progress > 18 ? (
        <button
          type="button"
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          Top
        </button>
      ) : null}

      <footer className="site-footer">
        <p>Designed and developed in Next.js with a conversion-focused product approach.</p>
        <p>
          <strong>{routeLabel}</strong> | Cauz Product Studio
        </p>
      </footer>
    </div>
  );
}
