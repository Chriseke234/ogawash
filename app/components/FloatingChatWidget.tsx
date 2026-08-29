"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChatMessage,
  SAGE_INITIAL_MESSAGES,
  SAGE_QUICK_PROMPTS,
  getSageResponse,
} from "@/lib/sage";

type WidgetState = "closed-idle" | "closed-with-greeting" | "open";

/**
 * FloatingChatWidget Component
 * Persistent floating concierge widget with 3 states:
 * - closed-idle
 * - closed-with-greeting (~2.5s delayed eye-catching bounce + speech tooltip)
 * - open (full responsive chat panel with live Sage concierge engine)
 */
export default function FloatingChatWidget() {
  const [widgetState, setWidgetState] = useState<WidgetState>("closed-idle");
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SAGE_INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (widgetState === "open") {
      scrollToBottom();
    }
  }, [messages, isTyping, widgetState]);

  // Handle ~2.5s delayed greeting sequence (fires once per session)
  useEffect(() => {
    if (greetingDismissed) return;

    const timer = setTimeout(() => {
      setWidgetState((current) => {
        if (current === "closed-idle" && !greetingDismissed) {
          return "closed-with-greeting";
        }
        return current;
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, [greetingDismissed]);

  // Handle auto-dismiss of greeting tooltip after ~8s
  useEffect(() => {
    if (widgetState !== "closed-with-greeting") return;

    const autoDismissTimer = setTimeout(() => {
      setWidgetState("closed-idle");
      setGreetingDismissed(true);
    }, 8000);

    return () => clearTimeout(autoDismissTimer);
  }, [widgetState]);

  // Handle outside click & Escape key to dismiss greeting or close chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (widgetState === "closed-with-greeting") {
          setWidgetState("closed-idle");
          setGreetingDismissed(true);
        } else if (widgetState === "open") {
          setWidgetState("closed-idle");
          triggerButtonRef.current?.focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        widgetContainerRef.current &&
        !widgetContainerRef.current.contains(e.target as Node)
      ) {
        if (widgetState === "closed-with-greeting") {
          setWidgetState("closed-idle");
          setGreetingDismissed(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [widgetState]);

  // Focus management on open/close
  const handleOpenChat = () => {
    setWidgetState("open");
    setGreetingDismissed(true);
    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 150);
  };

  const handleCloseChat = () => {
    setWidgetState("closed-idle");
    setTimeout(() => {
      triggerButtonRef.current?.focus();
    }, 100);
  };

  const handleDismissGreeting = (e: React.MouseEvent) => {
    e.stopPropagation();
    setWidgetState("closed-idle");
    setGreetingDismissed(true);
  };

  // Message submission
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const sageResponse = await getSageResponse(text);
      setMessages((prev) => [...prev, sageResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "sage",
          text: "I'm having a brief connection hitch, but our team is standing by to take your order.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div
      ref={widgetContainerRef}
      className="fixed z-50 bottom-5 right-5 sm:bottom-6 sm:right-6 font-body"
      aria-label="Sage AI Concierge Floating Widget"
    >
      {/* ─────────────────────────────────────────────────────────────
          STATE 3: OPEN CHAT PANEL
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {widgetState === "open" && (
          <motion.div
            key="chat-panel"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-3 sm:inset-auto sm:bottom-0 sm:right-0 sm:w-[380px] sm:h-[520px] max-h-[92vh] flex flex-col rounded-2xl bg-surface border border-border-line shadow-2xl overflow-hidden z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Sage"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-ink/90 border-b border-border-line">
              <div className="flex items-center gap-2.5">
                {/* Sage Avatar SVG */}
                <div className="relative w-8 h-8 rounded-lg bg-surface border border-sage/40 flex items-center justify-center shadow-inner">
                  <svg className="w-5 h-5" viewBox="0 0 80 80" fill="none">
                    <rect x="12" y="14" width="56" height="56" rx="16" fill="#1E2124" stroke="#7FA98A" strokeWidth="4" />
                    <rect x="24" y="26" width="32" height="22" rx="8" fill="#15171A" stroke="#33373C" strokeWidth="2" />
                    <circle cx="34" cy="37" r="3" fill="#7FA98A" />
                    <circle cx="46" cy="37" r="3" fill="#7FA98A" />
                    <path d="M37 42C38 43.5 42 43.5 43 42" stroke="#7FA98A" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="58" cy="22" r="5" fill="#C6A75C" />
                  </svg>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sage ring-2 ring-ink" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-semibold text-ivory leading-tight">Sage</h2>
                    <span className="px-1.5 py-0.2 rounded bg-sage-muted text-[10px] font-utility text-sage uppercase font-medium">
                      AI Assistant
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-text">Replies instantly • Book pickup &amp; dry cleaning</p>
                </div>
              </div>

              {/* Close/Minimize Button */}
              <button
                onClick={handleCloseChat}
                className="p-1.5 rounded-lg text-muted-text hover:text-ivory hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Message Thread */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-[13px] bg-ink/40"
              aria-live="polite"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-sage text-ink font-medium rounded-tr-sm"
                        : "bg-surface border border-border-line text-ivory rounded-tl-sm"
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Rendered Order Ticket Card if attached */}
                    {msg.ticket && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-ink border border-brass/40 shadow-brass-glow/10 text-left">
                        <div className="flex items-center justify-between text-[11px] font-utility font-semibold text-brass mb-1">
                          <span>{msg.ticket.id}</span>
                          <span>DRAFT TICKET</span>
                        </div>
                        <div className="text-xs font-bold text-ivory mb-0.5">{msg.ticket.service}</div>
                        <div className="text-[11px] text-muted-text mb-0.5">{msg.ticket.timing}</div>
                        <div className="text-[11px] text-sage font-medium">{msg.ticket.items}</div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-text mt-1 px-1 font-utility">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing Indicator Bubble */}
              {isTyping && (
                <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-surface border border-border-line w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Carousel/Pills */}
            <div className="px-3 py-2 bg-ink/60 border-t border-border-line/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {SAGE_QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full bg-surface border border-border-line text-[11px] text-muted-text hover:text-ivory hover:border-sage/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Row */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-ink border-t border-border-line flex items-center gap-2"
            >
              <input
                ref={chatInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask Sage or request an order..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface border border-border-line text-ivory text-xs sm:text-sm placeholder:text-muted-text focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 rounded-xl bg-sage text-ink hover:bg-sage-dark hover:text-ivory transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2L7 9M14 2L9.5 14L7 9M14 2L2 6.5L7 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          STATE 1 & 2: FLOATING TRIGGER BUTTON & GREETING SPEECH BUBBLE
         ───────────────────────────────────────────────────────────── */}
      {widgetState !== "open" && (
        <div className="relative flex items-center justify-end">
          
          {/* Greeting Tooltip Card (State 2) */}
          <AnimatePresence>
            {widgetState === "closed-with-greeting" && (
              <motion.div
                key="greeting-bubble"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={handleOpenChat}
                className="absolute right-16 sm:right-18 bottom-1 max-w-[240px] sm:max-w-[260px] p-3 rounded-2xl bg-surface border border-border-line shadow-2xl cursor-pointer hover:border-sage/50 transition-colors group"
                role="region"
                aria-live="polite"
                aria-label="Sage Greeting"
              >
                {/* Speech Bubble Arrow */}
                <div
                  className="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-surface"
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage" />
                    <span className="font-utility text-[10px] font-semibold text-sage uppercase tracking-wider">
                      Sage Assistant
                    </span>
                  </div>
                  <button
                    onClick={handleDismissGreeting}
                    className="text-muted-text hover:text-ivory p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sage"
                    aria-label="Dismiss greeting"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-xs text-ivory leading-relaxed font-body">
                  Hey there — I&apos;m Sage. Need a quick doorstep laundry pickup or price check?
                </p>
                <div className="mt-2 text-[10px] font-utility text-sage group-hover:underline flex items-center gap-1">
                  <span>Chat now</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Bubble Button */}
          <motion.button
            ref={triggerButtonRef}
            onClick={handleOpenChat}
            animate={
              widgetState === "closed-with-greeting" && !shouldReduceMotion
                ? {
                    scale: [1, 1.18, 0.95, 1.08, 1],
                    transition: { duration: 0.6, ease: "easeOut" },
                  }
                : {}
            }
            className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-sage hover:bg-sage-dark text-ink shadow-sage-glow flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-ink transform hover:-translate-y-0.5 active:translate-y-0"
            aria-label="Open chat with Sage"
          >
            {/* Mascot Mini SVG Icon */}
            <svg className="w-7 h-7" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="12" y="14" width="56" height="56" rx="16" fill="#15171A" stroke="#15171A" strokeWidth="2" />
              <rect x="24" y="26" width="32" height="22" rx="8" fill="#1E2124" stroke="#7FA98A" strokeWidth="2" />
              <circle cx="34" cy="37" r="3" fill="#7FA98A" />
              <circle cx="46" cy="37" r="3" fill="#7FA98A" />
              <path d="M37 42C38 43.5 42 43.5 43 42" stroke="#7FA98A" strokeWidth="2" strokeLinecap="round" />
              <circle cx="58" cy="22" r="5" fill="#C6A75C" />
            </svg>

            {/* Subtle Pulse Ring */}
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-brass ring-2 ring-ink" />
          </motion.button>

        </div>
      )}
    </div>
  );
}
