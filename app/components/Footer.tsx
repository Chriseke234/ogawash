import React from "react";

const SERVICES_LINKS = [
  { name: "Wash & Fold", href: "#services" },
  { name: "Dry Cleaning", href: "#services" },
  { name: "Doorstep Pickup", href: "#services" },
  { name: "Same-Day Express", href: "#services" },
];

const COMPANY_LINKS = [
  { name: "How It Works", href: "#how-it-works" },
  { name: "Why Choose Us", href: "#why-us" },
  { name: "Customer Stories", href: "#testimonials" },
  { name: "Contact Support", href: "#talk-to-sage" },
];

/**
 * Footer Component
 * Clean, modern footer matching the new light/emerald design.
 */
export default function Footer() {
  return (
    <footer
      aria-label="Site Footer"
      className="bg-slate-900 text-slate-300 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <span className="font-sans text-xl font-bold tracking-tight text-white">
                Oga<span className="text-emerald-400">wash</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-4">
              Doorstep laundry and premium dry cleaning. Fresh clothes delivered on time, every time.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-[11px] font-utility text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant Chat Booking Active</span>
            </div>
          </div>

          {/* Services Column */}
          <nav aria-label="Footer Services Navigation">
            <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Services
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {SERVICES_LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company Column */}
          <nav aria-label="Footer Company Navigation">
            <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {COMPANY_LINKS.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-emerald-400 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Quick Chat Booking Column */}
          <div className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
            <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider mb-3.5">
              Need Fresh Laundry?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Chat with Sage right now to schedule your collection in seconds.
            </p>
            <a
              href="#talk-to-sage"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wide transition-colors shadow-md"
            >
              <span>Book on Chat</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Ogawash. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            Powered by Sage AI Laundry Assistant.
          </p>
        </div>

      </div>
    </footer>
  );
}
