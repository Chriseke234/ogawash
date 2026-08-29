"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating: number;
  quote: string;
  tag: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "review-1",
    name: "Amara Okonjo",
    role: "Lekki, Lagos • Weekly Family Plan",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    rating: 5,
    tag: "Verified Customer",
    quote: "With three kids, laundry was taking my entire Saturday. Booking on chat with Sage takes ten seconds, and the clothes return crisply folded, fresh, and color-separated. It has completely changed our weekly routine.",
  },
  {
    id: "review-2",
    name: "Tunde Adebayo",
    role: "Victoria Island • Dry Cleaning Client",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    rating: 5,
    tag: "Verified Customer",
    quote: "My tailored business suits and linen shirts require delicate hand pressing. Ogawash delivers top-tier dry cleaning with breathable garment shields and door-to-door courier tracking.",
  },
  {
    id: "review-3",
    name: "Dr. Chioma Nnadi",
    role: "Ikoyi, Lagos • Express Regular",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    rating: 5,
    tag: "Verified Customer",
    quote: "The same-day express service saved me right before an international medical conference. Handed my scrub sets and dresses over in the morning, and they arrived perfectly steamed by 5:30 PM.",
  },
];

/**
 * Testimonials Component
 * Matches the reference "Fresh Laundry, Happy Customers" section with real portraits,
 * 5-star SVG rating badges, and customer stories.
 */
export default function Testimonials() {
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
      id="testimonials"
      aria-label="Customer Reviews"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-emerald-900 text-white overflow-hidden relative"
    >
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-800/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-700/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-800 text-emerald-200 font-sans text-xs font-semibold uppercase tracking-wider mb-3">
            Customer Stories
          </span>
          <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
            Fresh Laundry, Happy Customers.
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/80">
            Over 10,000+ happy households and professionals trust Ogawash for their weekly wardrobe care.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="p-6 sm:p-7 rounded-2xl bg-emerald-800/60 border border-emerald-700/60 backdrop-blur-sm flex flex-col justify-between hover:bg-emerald-800/80 transition-colors shadow-lg"
            >
              <div>
                {/* 5-Star SVG Rating Row */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs font-utility font-semibold text-emerald-200">
                    5.0
                  </span>
                </div>

                {/* Quote Text */}
                <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed mb-6 italic">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* Author Row with Real Photo & Verified Tag */}
              <div className="flex items-center gap-3 pt-4 border-t border-emerald-700/50">
                <img
                  src={review.avatarUrl}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
                  loading="lazy"
                />
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-bold text-white leading-tight">
                    {review.name}
                  </span>
                  <span className="text-[11px] text-emerald-200/90 leading-tight mt-0.5">
                    {review.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
