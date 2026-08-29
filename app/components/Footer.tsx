import React from "react";

const SERVICES_LINKS = [
  { name: "Wash & Fold", href: "#services" },
  { name: "Dry Cleaning", href: "#services" },
  { name: "Pickup & Delivery", href: "#services" },
  { name: "Express Same-Day", href: "#services" },
];

const COMPANY_LINKS = [
  { name: "About Us", href: "#about" },
  { name: "Care Standards", href: "#care" },
  { name: "Contact", href: "#contact" },
  { name: "Careers", href: "#careers" },
];

/**
 * Footer Component
 * Static, semantic footer with brand wordmark, structured nav links, repeat ghost CTA, and copyright disclosure.
 */
export default function Footer() {
  return (
    <footer
      aria-label="Site Footer"
      className="w-full bg-ink border-t border-border-line/60 pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-body"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Top Grid / Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12">
          
          {/* Brand Block */}
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
            <span className="font-display text-xl font-bold tracking-tight text-ivory mb-2">
              OGAWASH
            </span>
            <p className="text-xs text-muted-text leading-relaxed max-w-xs mb-4">
              Full-service laundry &amp; dry cleaning. Every order, tagged, sorted, and cared for.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface border border-border-line text-[11px] font-utility text-sage">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" aria-hidden="true" />
              <span>Instant Booking Active</span>
            </div>
          </div>

          {/* Services Column */}
          <nav aria-label="Footer Services Navigation">
            <h3 className="font-utility text-xs font-semibold text-ivory uppercase tracking-wider mb-3.5">
              Services
            </h3>
            <ul className="space-y-2 text-xs">
              {SERVICES_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-text hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage rounded"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Column */}
          <nav aria-label="Footer Company Navigation">
            <h3 className="font-utility text-xs font-semibold text-ivory uppercase tracking-wider mb-3.5">
              Company
            </h3>
            <ul className="space-y-2 text-xs">
              {COMPANY_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-text hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage rounded"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Repeat Ghost CTA Column */}
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
            <h3 className="font-utility text-xs font-semibold text-ivory uppercase tracking-wider mb-3.5">
              Need Assistance?
            </h3>
            <p className="text-xs text-muted-text leading-relaxed mb-4">
              Have special garments or need same-day collection?
            </p>
            <a
              href="#talk-to-sage"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-transparent border border-sage/40 text-sage hover:bg-sage-muted hover:border-sage text-xs font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
            >
              <span>Talk to Sage</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3.33334 8H12.6667M12.6667 8L8.66668 4M12.6667 8L8.66668 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Row / Disclosures & Copyright */}
        <div className="pt-8 border-t border-border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-utility text-muted-text">
          <p>© 2026 Ogawash. A demo concept. All rights reserved.</p>
          <p className="text-[11px] text-muted-text/80">
            Chat concierge powered live by Sage.
          </p>
        </div>

      </div>
    </footer>
  );
}
