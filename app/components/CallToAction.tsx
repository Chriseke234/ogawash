"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { openSageChat } from "@/lib/sage";
import { SageMascotIllustration } from "./FloatingChatWidget";

/**
 * CallToAction Component
 * High-converting, dedicated pre-footer banner with clear value props and a bold "Book Us Now" CTA.
 */
export default function CallToAction() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      aria-label="Ready to Book Ogawash"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-100 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 p-8 sm:p-12 lg:p-16 text-center text-white shadow-2xl overflow-hidden border border-emerald-700/60"
        >
          {/* Background Ambient Glows */}
          <div
            className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-24 -right-24 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Sage Mascot Mini Spotlight */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 p-2 rounded-2xl bg-white shadow-lg border-2 border-emerald-400 mb-6 flex items-center justify-center">
              <SageMascotIllustration className="w-full h-full" />
            </div>

            {/* Pill Tag */}
            <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-700/60 text-emerald-200 font-sans text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/40">
              Instant Doorstep Laundry
            </span>

            {/* Headline */}
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 text-balance">
              Ready for Fresh, Spotless Clothes <br className="hidden sm:inline" />
              Delivered to Your Door?
            </h2>

            {/* Subtext */}
            <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-2xl leading-relaxed mb-8 text-balance">
              Say goodbye to laundry day stress. Schedule a doorstep pickup in under 60 seconds with Sage — no tedious forms or account signups required.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <button
                onClick={() => openSageChat("Hello Sage, I would like to book a laundry pickup with OgaWash now.")}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans text-base font-bold tracking-wide shadow-emerald-glow shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Book Us Now</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Guarantee / Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full pt-8 border-t border-emerald-700/60 text-xs text-emerald-200">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>Doorstep Pickup in 60s</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>24h Rapid Turnaround</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>WhatsApp Order Dispatch</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
