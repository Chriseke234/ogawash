"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface ServiceItem {
  id: string;
  title: string;
  priceHint: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
}

const SERVICES: ServiceItem[] = [
  {
    id: "wash-fold",
    title: "Wash & Fold",
    priceHint: "From $2.25/lb",
    description: "Everyday clothing, sheets, and towels washed with care, crisply folded, and sorted by garment type.",
    features: ["Custom temperature & detergent", "Folded & packaged in shields", "24h standard turnaround"],
    icon: (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="4" rx="2" />
        <rect x="3" y="11" width="18" height="4" rx="2" />
        <rect x="4" y="17" width="16" height="4" rx="2" />
      </svg>
    ),
  },
  {
    id: "dry-cleaning",
    title: "Dry Cleaning",
    priceHint: "From $7.50/item",
    description: "Suits, silk dresses, coats, and delicate fabrics handled with gentle eco-friendly solvent cleaning.",
    features: ["Colorfastness pre-inspection", "Delicate hand steam pressing", "Breathable hanger protection"],
    icon: (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
      </svg>
    ),
  },
  {
    id: "pickup-delivery",
    title: "Doorstep Pickup & Delivery",
    priceHint: "Free on orders over $35",
    description: "Our dedicated couriers collect from your doorstep and return clean laundry on your selected schedule.",
    features: ["Live SMS / Chat dispatch updates", "Flexible 2-hour collection windows", "Contactless handoff option"],
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
    id: "express",
    title: "Same-Day Express",
    priceHint: "In by 10 AM, Back by 6 PM",
    description: "Emergency rush service prioritized directly for rapid washing, dry cleaning, and finishing.",
    features: ["Dedicated express wash cycle", "Rapid thermal press finish", "Guaranteed evening delivery"],
    icon: (
      <svg className="w-6 h-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

/**
 * Services Component
 * 4-card service lane grid with light theme styling.
 */
export default function Services() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="services"
      aria-label="Ogawash Services"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-sans text-xs font-semibold uppercase tracking-wider mb-3">
            Our Services
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
            Whatever the load, we have a lane for it
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Professional garment care tailored to everyday wardrobes, delicate couture, and household linens.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/50 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Icon & Price Hint */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {service.icon}
                  </div>
                  <span className="font-utility text-[11px] font-semibold text-emerald-700 px-2 py-0.5 rounded bg-emerald-50">
                    {service.priceHint}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-sans text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Feature Bullet List */}
                <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <svg className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book Button */}
              <a
                href="#talk-to-sage"
                className="w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-emerald-600 text-slate-700 group-hover:text-white text-xs font-semibold text-center transition-colors shadow-xs"
              >
                Book {service.title}
              </a>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
