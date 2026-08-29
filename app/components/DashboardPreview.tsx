"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Ticket {
  id: string;
  timing: string;
  service: string;
  items: string;
  note?: string;
  isNew?: boolean;
}

interface Lane {
  id: string;
  name: string;
  count: number;
  isAttention?: boolean;
  tickets: Ticket[];
}

const LANES: Lane[] = [
  {
    id: "pickup-delivery",
    name: "Pickup & Delivery",
    count: 3,
    tickets: [
      {
        id: "#OG-8492",
        timing: "Today, 5:30 PM",
        service: "Wash & Fold + Hang Dry",
        items: "2 Bags (approx. 24 lbs) • Mixed Delicates",
        note: "Door code: #4412 • Leave at front desk",
        isNew: true, // One card with single-shot subtle entrance highlight
      },
      {
        id: "#OG-8488",
        timing: "Tomorrow, 8:00 AM",
        service: "Dry Cleaning & Press",
        items: "3 Two-Piece Suits, 4 Oxford Shirts",
        note: "Light starch on collars",
      },
      {
        id: "#OG-8485",
        timing: "Tomorrow, 11:30 AM",
        service: "Premium Bedding Care",
        items: "King Feather Down Duvet + 4 Shams",
      },
    ],
  },
  {
    id: "express",
    name: "Express Same-Day",
    count: 2,
    tickets: [
      {
        id: "#OG-8490",
        timing: "Ready by 3:00 PM",
        service: "Express Wash & Press",
        items: "6 Button-Down Shirts (Cotton)",
        note: "Flight departure tonight • Rush tag #12",
      },
      {
        id: "#OG-8487",
        timing: "Ready by 5:00 PM",
        service: "Express Garment Steaming",
        items: "1 Evening Gown (Silk Blend)",
      },
    ],
  },
  {
    id: "in-store",
    name: "In-Store Drop-off",
    count: 2,
    tickets: [
      {
        id: "#OG-8489",
        timing: "Thu, 4:00 PM",
        service: "Standard Wash & Fold",
        items: "1 Bag (approx. 14 lbs)",
        note: "Fragrance-free detergent requested",
      },
      {
        id: "#OG-8484",
        timing: "Fri, 10:00 AM",
        service: "Tailoring & Hemming",
        items: "2 Chino Trousers (Take in 1.5\")",
      },
    ],
  },
  {
    id: "needs-human",
    name: "Needs a Human",
    count: 1,
    isAttention: true,
    tickets: [
      {
        id: "#OG-8491",
        timing: "Pending Review",
        service: "Vintage Leather Treatment",
        items: "1 Suede Aviator Jacket",
        note: "Customer asking if vintage dye is safe for restoration",
      },
    ],
  },
];

/**
 * DashboardPreview Component
 * Interactive visual representation of the staff Kanban board.
 */
export default function DashboardPreview() {
  const shouldReduceMotion = useReducedMotion();

  // Container variants for staggered lane entrance
  const boardVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: 0.1,
      },
    },
  };

  // Lane column variants
  const laneVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 18,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.55,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  // Ticket card variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0.01 : 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      aria-label="Staff Dashboard Preview"
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-ink border-t border-border-line/60 overflow-hidden"
    >
      {/* Ambient background glow behind board */}
      <div
        className="absolute right-1/4 top-1/3 w-[500px] h-[300px] bg-sage/5 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12 sm:mb-16">
          {/* Eyebrow */}
          <div className="mb-3.5">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sage-muted border border-sage/30 text-sage font-utility text-xs font-semibold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-sage" aria-hidden="true" />
              STAFF DASHBOARD
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium text-ivory tracking-tight leading-tight mb-4">
            Every ticket Sage writes, sorted for you
          </h2>

          {/* Subheadline */}
          <p className="font-body text-xs sm:text-sm md:text-base text-muted-text leading-relaxed max-w-[480px]">
            Nothing is typed by hand. Tickets automatically land in the designated lane the instant customers finish chatting.
          </p>
        </div>

        {/* Board Top Status Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 mb-4 rounded-xl bg-surface/70 border border-border-line text-xs font-utility text-muted-text">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" aria-hidden="true" />
            <span className="text-ivory font-medium">DISPATCH BOARD • LIVE FEED</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden sm:inline">AUTO-SYNC: ON</span>
            <span className="text-sage font-semibold">8 ACTIVE ORDERS</span>
          </div>
        </div>

        {/* 4-Column Lane Kanban Grid */}
        <motion.div
          variants={boardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {LANES.map((lane) => {
            const isAttention = lane.isAttention;

            return (
              <motion.div
                key={lane.id}
                variants={laneVariants}
                className={`flex flex-col p-3.5 sm:p-4 rounded-2xl bg-surface border transition-colors duration-200 ${
                  isAttention
                    ? "border-brass/30 bg-surface shadow-brass-glow/5"
                    : "border-border-line/80 hover:border-border-line"
                }`}
              >
                {/* Lane Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-line/60">
                  <div className="flex items-center gap-2">
                    {isAttention ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-brass" aria-hidden="true" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-sage" aria-hidden="true" />
                    )}
                    <h3 className="font-body text-xs sm:text-sm font-semibold text-ivory tracking-wide">
                      {lane.name}
                    </h3>
                  </div>

                  {/* Count Badge */}
                  <span
                    className={`px-2 py-0.5 rounded-md font-utility text-xs font-medium ${
                      isAttention
                        ? "bg-brass-muted text-brass border border-brass/30"
                        : "bg-ink border border-border-line text-sage"
                    }`}
                  >
                    {lane.count}
                  </span>
                </div>

                {/* Ticket Cards Stack */}
                <div className="flex flex-col gap-3">
                  {lane.tickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      variants={cardVariants}
                      tabIndex={0}
                      className={`group relative p-3.5 rounded-xl bg-ink/90 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                        ticket.isNew && !shouldReduceMotion
                          ? "border-sage shadow-sage-glow/30 ring-1 ring-sage/30"
                          : isAttention
                          ? "border-brass/40 hover:border-brass/70 focus-visible:ring-brass"
                          : "border-border-line hover:border-sage/40 focus-visible:ring-sage"
                      }`}
                    >
                      {/* Top Row: Ticket ID + Timing */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-utility text-xs font-semibold ${
                            isAttention ? "text-brass" : "text-sage"
                          }`}
                        >
                          {ticket.id}
                        </span>
                        <span className="font-utility text-[11px] text-muted-text">
                          {ticket.timing}
                        </span>
                      </div>

                      {/* Service Name */}
                      <h4 className="font-body text-xs sm:text-sm font-bold text-ivory mb-1 group-hover:text-sage-light transition-colors">
                        {ticket.service}
                      </h4>

                      {/* Item Description */}
                      <p className="font-body text-xs text-muted-text leading-snug mb-2">
                        {ticket.items}
                      </p>

                      {/* Optional Note Tag */}
                      {ticket.note && (
                        <div
                          className={`flex items-start gap-1.5 p-2 rounded-lg text-[11px] font-body leading-tight ${
                            isAttention
                              ? "bg-brass-muted/60 text-brass border border-brass/20"
                              : "bg-surface/80 text-muted-text border border-border-line/60"
                          }`}
                        >
                          <svg
                            className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                            />
                          </svg>
                          <span>{ticket.note}</span>
                        </div>
                      )}

                      {/* New Ticket Indicator Badge if flagged */}
                      {ticket.isNew && (
                        <div className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded bg-sage text-ink font-utility text-[9px] font-bold uppercase tracking-wider shadow-sm">
                          Live
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
