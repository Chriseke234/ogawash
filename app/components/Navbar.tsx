"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface NavLink {
  name: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { name: "How It Works", href: "#how-it-works" },
  { name: "Services", href: "#services" },
  { name: "Live Orders", href: "#dashboard" },
  { name: "Reviews", href: "#testimonials" },
];

/**
 * Navbar Component
 * Floating glassmorphic header with responsive mobile slide-over drawer and instant booking CTA.
 */
export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect scroll to adjust glassmorphism elevation slightly
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  return (
    <>
      {/* Floating Glassmorphic Header Bar */}
      <header
        aria-label="Main Navigation"
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-5xl z-40 transition-all duration-300 ${
          hasScrolled ? "top-3" : "top-4"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl bg-surface/85 backdrop-blur-md border border-border-line/80 shadow-card-subtle">
          
          {/* Brand Logo & Live Badge */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage rounded-lg p-1"
            aria-label="Ogawash Home"
          >
            {/* Logo Mark SVG */}
            <div className="w-8 h-8 rounded-xl bg-ink border border-sage/40 flex items-center justify-center shadow-inner group-hover:border-sage transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="14" width="56" height="56" rx="16" fill="#1E2124" stroke="#7FA98A" strokeWidth="4" />
                <circle cx="34" cy="37" r="3.5" fill="#7FA98A" />
                <circle cx="46" cy="37" r="3.5" fill="#7FA98A" />
                <path d="M37 43C38.5 45 41.5 45 43 43" stroke="#7FA98A" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="58" cy="22" r="5" fill="#C6A75C" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight text-ivory leading-none">
                OGAWASH
              </span>
              <span className="font-utility text-[9px] text-sage tracking-wider uppercase font-semibold">
                Laundry &amp; Dry Cleaning
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Desktop Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="font-body text-xs lg:text-sm text-muted-text hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage rounded px-1.5 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Stack */}
          <div className="flex items-center gap-3">
            {/* Talk to Sage Quick CTA */}
            <a
              href="#talk-to-sage"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage text-ink font-body font-semibold text-xs sm:text-sm hover:bg-sage-dark hover:text-ivory transition-all duration-200 shadow-sage-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <span>Book on Chat</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2L7 9M14 2L9.5 14L7 9M14 2L2 6.5L7 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-xl text-muted-text hover:text-ivory bg-ink border border-border-line transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Slide-Over Drawer Navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-40 md:hidden"
              aria-hidden="true"
            />

            {/* Drawer Container */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-[94%] max-w-md p-5 rounded-2xl bg-surface border border-border-line shadow-2xl z-50 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-line/60">
                  <span className="font-utility text-xs font-semibold text-sage uppercase tracking-wider">
                    Menu Navigation
                  </span>
                  <span className="w-2 h-2 rounded-full bg-sage" />
                </div>

                <nav className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="px-3 py-2.5 rounded-xl font-body text-sm font-medium text-ivory hover:bg-ink/80 hover:text-sage transition-colors flex items-center justify-between"
                    >
                      <span>{link.name}</span>
                      <svg className="w-4 h-4 text-muted-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </nav>

                <div className="pt-3 border-t border-border-line/60 flex flex-col gap-2">
                  <a
                    href="#talk-to-sage"
                    onClick={() => setIsMobileOpen(false)}
                    className="w-full py-3 rounded-xl bg-sage text-ink font-body font-semibold text-sm text-center shadow-sage-glow hover:bg-sage-dark hover:text-ivory transition-colors"
                  >
                    Chat with Sage to Book
                  </a>
                  <p className="text-[11px] text-muted-text text-center font-utility">
                    No forms or account needed • Instant booking
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
