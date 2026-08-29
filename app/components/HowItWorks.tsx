"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Message Sage or Book",
    description: "Start a chat in seconds without complex forms or account signups.",
    icon: (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Select Laundry Service",
    description: "Choose wash & fold, premium dry cleaning, or same-day express.",
    icon: (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="4" rx="2" />
        <rect x="3" y="11" width="18" height="4" rx="2" />
        <rect x="4" y="17" width="16" height="4" rx="2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Book Pickup & Delivery",
    description: "Pick a convenient collection time slot right at your doorstep.",
    icon: (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Relax, We'll Take Care!",
    description: "Your clothes are washed, pressed, and delivered fresh & crisp.",
    icon: (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

/**
 * HowItWorks Component
 * 4-card sequence matching the reference design layout.
 */
export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="how-it-works"
      aria-label="How Ogawash Works"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-sans text-xs font-semibold uppercase tracking-wider mb-3">
            How It Works
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
            Streamlining your doorstep laundry process
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Enjoy clean, folded garments with our seamless 4-step care flow.
          </p>
        </div>

        {/* 4 Step Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-emerald-500/40 hover:bg-white hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Row: Icon + Number Badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                    {step.icon}
                  </div>
                  <span className="font-utility text-xs font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100/60">
                    {step.number}
                  </span>
                </div>

                {/* Step Title */}
                <h3 className="font-sans text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
