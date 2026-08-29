"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChatMessage,
  SAGE_INITIAL_MESSAGES,
  SAGE_QUICK_PROMPTS,
  getSageResponse,
  resetLeadState,
  OWNER_WHATSAPP_NUMBER,
} from "@/lib/sage";

type WidgetState = "closed-idle" | "closed-with-greeting" | "open";

/**
 * Sage Mascot Character SVG Illustration
 */
export function SageMascotIllustration({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Soft Assistant Cap / Visor */}
      <path d="M28 32C28 20 72 20 72 32H28Z" fill="#047857" />
      <rect x="22" y="30" width="56" height="6" rx="3" fill="#10B981" />
      <circle cx="50" cy="22" r="3.5" fill="#FBBF24" />

      {/* Main Friendly Body */}
      <rect x="20" y="34" width="60" height="54" rx="22" fill="#FFFFFF" stroke="#059669" strokeWidth="4" />

      {/* Screen Face Area */}
      <rect x="28" y="42" width="44" height="28" rx="12" fill="#F0FDF4" stroke="#A7F3D0" strokeWidth="2" />

      {/* Friendly Expressive Eyes */}
      <circle cx="40" cy="54" r="3.8" fill="#047857" />
      <circle cx="41.5" cy="52.5" r="1.3" fill="#FFFFFF" />
      
      <circle cx="60" cy="54" r="3.8" fill="#047857" />
      <circle cx="61.5" cy="52.5" r="1.3" fill="#FFFFFF" />

      {/* Warm Smile */}
      <path d="M44 62C46.5 65 53.5 65 56 62" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />

      {/* Soft Rosy Cheeks */}
      <ellipse cx="34" cy="58" rx="2.5" ry="1.5" fill="#FCA5A5" opacity="0.8" />
      <ellipse cx="66" cy="58" rx="2.5" ry="1.5" fill="#FCA5A5" opacity="0.8" />

      {/* Assistant Bowtie / Badge */}
      <path d="M46 88L50 84L54 88L50 92L46 88Z" fill="#10B981" />
      <circle cx="50" cy="88" r="2" fill="#FBBF24" />
    </svg>
  );
}

/**
 * WhatsApp SVG Icon
 */
function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.585 1.761.88 2.79.88 3.183 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.766-5.768-5.766zm9.969 5.766c-.002 5.518-4.484 9.998-10 9.998-1.766 0-3.414-.46-4.851-1.267l-5.149 1.331 1.37-4.997c-.908-1.498-1.37-3.23-1.37-5.065.003-5.519 4.485-10 10-10 5.516 0 10 4.481 10 10zm-5.467 4.195c-.247-.123-1.464-.722-1.691-.804-.227-.083-.393-.123-.559.123-.166.246-.641.804-.785.968-.144.164-.288.184-.535.061-.247-.123-1.043-.385-1.986-1.226-.734-.655-1.23-1.465-1.374-1.711-.144-.247-.015-.38.109-.502.111-.11.247-.287.371-.431.124-.144.165-.246.247-.411.082-.164.041-.308-.021-.431-.062-.123-.559-1.347-.765-1.844-.201-.484-.405-.418-.558-.426-.144-.007-.309-.009-.474-.009s-.433.062-.66.308c-.227.247-.866.847-.866 2.064s.887 2.391 1.01 2.556c.124.164 1.745 2.664 4.228 3.737.591.256 1.052.409 1.411.523.593.189 1.134.162 1.561.099.476-.071 1.464-.598 1.67-1.176.206-.578.206-1.073.144-1.176-.061-.103-.226-.164-.473-.287z" />
    </svg>
  );
}

/**
 * FloatingChatWidget Component
 * Persistent floating AI laundry assistant with automatic lead closing and direct WhatsApp dispatch.
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (widgetState === "open") {
      scrollToBottom();
    }
  }, [messages, isTyping, widgetState]);

  // Handle message sending
  const handleSendMessage = useCallback(async (textToSend?: string) => {
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
          text: "I'm having a brief connection hitch, but our team is ready to book your laundry.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping]);

  // Listen to global open-sage-chat events
  useEffect(() => {
    const handleGlobalOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ initialPrompt?: string }>;
      setWidgetState("open");
      setGreetingDismissed(true);

      if (customEvent.detail?.initialPrompt) {
        handleSendMessage(customEvent.detail.initialPrompt);
      }

      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 200);
    };

    window.addEventListener("open-sage-chat", handleGlobalOpen);
    return () => window.removeEventListener("open-sage-chat", handleGlobalOpen);
  }, [handleSendMessage]);

  // Delayed greeting trigger (~2.5s post-load)
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

  // Auto-dismiss greeting after ~8s
  useEffect(() => {
    if (widgetState !== "closed-with-greeting") return;

    const autoDismissTimer = setTimeout(() => {
      setWidgetState("closed-idle");
      setGreetingDismissed(true);
    }, 8000);

    return () => clearTimeout(autoDismissTimer);
  }, [widgetState]);

  // Handle outside click & Escape key
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

  const handleStartNewOrder = () => {
    resetLeadState();
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: "sage",
        text: "Let's start a fresh order! What service do you need today? (Wash & Fold, Dry Cleaning, or Same-Day Express)",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div
      ref={widgetContainerRef}
      className="fixed z-50 bottom-5 right-5 sm:bottom-6 sm:right-6 font-sans"
      aria-label="Sage AI Laundry Assistant Widget"
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
            className="fixed inset-3 sm:inset-auto sm:bottom-0 sm:right-0 sm:w-[400px] sm:h-[560px] max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Sage"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 text-white shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center p-0.5 shadow-inner">
                  <SageMascotIllustration className="w-full h-full" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-600" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-white leading-tight">Sage</h2>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-700/80 text-[10px] font-utility text-emerald-100 uppercase font-semibold">
                      WhatsApp Dispatch Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90">Instant lead booking • Direct to Owner</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={handleStartNewOrder}
                  className="px-2 py-1 rounded-lg text-[10px] font-utility font-semibold bg-emerald-700/80 text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
                  title="Start a new order"
                >
                  New Order
                </button>
                <button
                  onClick={handleCloseChat}
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close chat"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Message Thread */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-[13px] bg-slate-50/70"
              aria-live="polite"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white font-medium rounded-tr-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* ─────────────────────────────────────────────────────────────
                        FINAL VERIFIED ORDER TICKET WITH ONE-TAP WHATSAPP DISPATCH
                       ───────────────────────────────────────────────────────────── */}
                    {msg.ticket && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-left shadow-sm">
                        {/* Ticket Header */}
                        <div className="flex items-center justify-between text-[11px] font-utility font-bold text-emerald-800 pb-2 mb-2 border-b border-emerald-200">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            {msg.ticket.id}
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-200/80 rounded-full text-emerald-900 text-[10px]">
                            {msg.ticket.isFinalized ? "DISPATCH READY" : "IN PROGRESS"}
                          </span>
                        </div>

                        {/* Order Details List */}
                        {/* Order Details List */}
                        <div className="space-y-1.5 text-xs">
                          {/* Live Tracking Progress Bar if Tracking */}
                          {msg.ticket.trackingStatus && (
                            <div className="mb-2.5 p-2 rounded-xl bg-white border border-emerald-200 shadow-xs">
                              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800 mb-1.5">
                                <span>Status: {msg.ticket.trackingStatus}</span>
                                <span className="text-[10px] text-emerald-600 font-utility">Stage 3 of 4</span>
                              </div>
                              {/* 4-Segment Progress Indicator */}
                              <div className="grid grid-cols-4 gap-1 mb-1.5">
                                <div className="h-1.5 rounded-full bg-emerald-500" />
                                <div className="h-1.5 rounded-full bg-emerald-500" />
                                <div className="h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <div className="h-1.5 rounded-full bg-slate-200" />
                              </div>
                              <div className="flex justify-between text-[9px] text-slate-500 font-utility">
                                <span>Intake</span>
                                <span>Wash</span>
                                <span className="text-emerald-700 font-bold">Press</span>
                                <span>Delivery</span>
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="text-slate-500 text-[11px]">Service: </span>
                            <span className="font-bold text-slate-900">{msg.ticket.service}</span>
                          </div>

                          {msg.ticket.items && (
                            <div>
                              <span className="text-slate-500 text-[11px]">Garments: </span>
                              <span className="font-semibold text-slate-900">{msg.ticket.items}</span>
                            </div>
                          )}

                          {msg.ticket.customerName && (
                            <div>
                              <span className="text-slate-500 text-[11px]">Customer: </span>
                              <span className="font-semibold text-slate-900">{msg.ticket.customerName}</span>
                            </div>
                          )}

                          {msg.ticket.customerPhone && (
                            <div>
                              <span className="text-slate-500 text-[11px]">Phone: </span>
                              <span className="font-semibold text-slate-900">{msg.ticket.customerPhone}</span>
                            </div>
                          )}

                          {msg.ticket.customerAddress && (
                            <div>
                              <span className="text-slate-500 text-[11px]">Address: </span>
                              <span className="font-semibold text-slate-900">{msg.ticket.customerAddress}</span>
                            </div>
                          )}

                          {msg.ticket.timing && (
                            <div>
                              <span className="text-slate-500 text-[11px]">Schedule: </span>
                              <span className="font-semibold text-emerald-800">{msg.ticket.timing}</span>
                            </div>
                          )}
                        </div>

                        {/* Direct One-Tap WhatsApp Dispatch Button */}
                        {msg.ticket.whatsappUrl && (
                          <div className="mt-3 pt-2.5 border-t border-emerald-200 flex flex-col gap-1.5">
                            <a
                              href={msg.ticket.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <WhatsAppIcon className="w-4 h-4" />
                              <span>Send Order to WhatsApp</span>
                            </a>
                            <p className="text-[10px] text-center text-emerald-800/80 font-utility">
                              Direct to Owner ({OWNER_WHATSAPP_NUMBER})
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-utility">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 w-fit shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Service Chips */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {SAGE_QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-transparent transition-colors cursor-pointer"
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
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                ref={chatInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your response or details..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
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
          STATE 1 & 2: FLOATING BUTTON & GREETING BUBBLE
         ───────────────────────────────────────────────────────────── */}
      {widgetState !== "open" && (
        <div className="relative flex items-center justify-end">
          
          {/* Greeting Tooltip */}
          <AnimatePresence>
            {widgetState === "closed-with-greeting" && (
              <motion.div
                key="greeting-bubble"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={handleOpenChat}
                className="absolute right-16 sm:right-18 bottom-1 max-w-[250px] sm:max-w-[270px] p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xl cursor-pointer hover:border-emerald-400 transition-colors group"
                role="region"
                aria-live="polite"
                aria-label="Sage Greeting"
              >
                {/* Arrow */}
                <div
                  className="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white"
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-utility text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      Sage Assistant
                    </span>
                  </div>
                  <button
                    onClick={handleDismissGreeting}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
                    aria-label="Dismiss greeting"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-sans">
                  Hey there! Ready to book a pickup? I can close your order and send it to WhatsApp right now!
                </p>
                <div className="mt-2 text-[10px] font-utility font-semibold text-emerald-600 group-hover:underline flex items-center gap-1">
                  <span>Start WhatsApp Order</span>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Trigger Button with Mascot Icon */}
          <motion.button
            ref={triggerButtonRef}
            onClick={handleOpenChat}
            animate={
              widgetState === "closed-with-greeting" && !shouldReduceMotion
                ? {
                    scale: [1, 1.15, 0.95, 1.05, 1],
                    transition: { duration: 0.6, ease: "easeOut" },
                  }
                : {}
            }
            className="group relative w-14 h-14 rounded-full bg-white border-2 border-emerald-500 shadow-emerald-glow shadow-xl flex items-center justify-center p-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            aria-label="Open chat with Sage"
          >
            <SageMascotIllustration className="w-full h-full" />
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </motion.button>

        </div>
      )}
    </div>
  );
}
