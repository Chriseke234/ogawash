"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";

interface FeaturePill {
  id: string;
  label: string;
  title: string;
  description: string;
  imageUrl: string;
  badge: string;
}

const FEATURES: FeaturePill[] = [
  {
    id: "pricing",
    label: "Affordable Pricing",
    title: "Premium fabric care that fits your weekly budget.",
    description: "Transparent per-pound rates for wash & fold and fixed piece rates for dry cleaning with zero hidden service fees.",
    imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1000&q=80",
    badge: "Transparent Pricing",
  },
  {
    id: "custom",
    label: "Customized Care",
    title: "Tailored detergent, water temperature, and folding styles.",
    description: "Whether you prefer fragrance-free hypoallergenic wash, hang dry for delicates, or starch on shirt collars, we execute every preference.",
    imageUrl: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=1000&q=80",
    badge: "100% Customized",
  },
  {
    id: "support",
    label: "24/7 Booking Service",
    title: "Instant scheduling with Sage anytime day or night.",
    description: "Message Sage on chat whenever you remember your laundry — at midnight or early morning — and have a courier scheduled instantly.",
    imageUrl: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?auto=format&fit=crop&w=1000&q=80",
    badge: "24/7 Support",
  },
  {
    id: "quality",
    label: "Top Quality Cleaners",
    title: "Master cleaners overseeing every wash & press cycle.",
    description: "Every item is inspected for stain removal, fabric integrity, and colorfastness before undergoing delicate steam finish.",
    imageUrl: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=1000&q=80",
    badge: "Master Cleaners",
  },
  {
    id: "express",
    label: "Fastest Express Turnaround",
    title: "Same-day express return when you are in a rush.",
    description: "In before 10:00 AM, delivered back clean, crisp, and fresh to your doorstep by 6:00 PM the exact same day.",
    imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=1000&q=80",
    badge: "Same-Day Rush",
  },
];

/**
 * WhyChooseUs Component
 * Interactive filter pill gallery with real high-resolution Unsplash photos.
 */
export default function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState<string>("pricing");
  const shouldReduceMotion = useReducedMotion();

  const currentFeature = FEATURES.find((f) => f.id === activeTab) || FEATURES[0];

  return (
    <section
      id="why-us"
      aria-label="Why Choose Ogawash"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-100"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-100/70 text-emerald-800 font-sans text-xs font-semibold uppercase tracking-wider mb-3">
            Why Choose Us?
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight mb-3">
            Laundry care beyond expectations
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From busy professionals to growing families, we deliver fresh clothes with unmatched reliability.
          </p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10 sm:mb-14">
          {FEATURES.map((feature) => {
            const isActive = feature.id === activeTab;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-sans text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-emerald-glow/40 shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {feature.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Feature Showcase Card */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-card-soft overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12"
            >
              {/* Left Content Column */}
              <div className="lg:col-span-6 flex flex-col items-start justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold font-utility uppercase tracking-wider mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  {currentFeature.badge}
                </span>

                <h3 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 leading-snug mb-4">
                  {currentFeature.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
                  {currentFeature.description}
                </p>

                <a
                  href="#talk-to-sage"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md transition-colors"
                >
                  <span>Experience OgaWash</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Right Image Column (Real Unsplash Photo) */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-md border border-slate-100">
                  <img
                    src={currentFeature.imageUrl}
                    alt={currentFeature.title}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
