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
  sanitizeSageText,
} from "@/lib/sage";

type WidgetState = "closed-idle" | "closed-with-greeting" | "open";

/**
 * Sage Mascot Character SVG Illustration
 */
export function SageMascotIllustration({
  className = "w-8 h-8",
  isSpeaking = false,
}: {
  className?: string;
  isSpeaking?: boolean;
}) {
  return (
    <div className="relative inline-flex items-center justify-center">
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

        {/* Warm Smile or Speaking Mouth */}
        {isSpeaking ? (
          <ellipse cx="50" cy="62" rx="4.5" ry="3" fill="#047857" className="animate-pulse" />
        ) : (
          <path d="M44 62C46.5 65 53.5 65 56 62" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Soft Rosy Cheeks */}
        <ellipse cx="34" cy="58" rx="2.5" ry="1.5" fill="#FCA5A5" opacity="0.8" />
        <ellipse cx="66" cy="58" rx="2.5" ry="1.5" fill="#FCA5A5" opacity="0.8" />

        {/* Assistant Bowtie / Badge */}
        <path d="M46 88L50 84L54 88L50 92L46 88Z" fill="#10B981" />
        <circle cx="50" cy="88" r="2" fill="#FBBF24" />
      </svg>

      {/* Subtle speaking waves if voice is active */}
      {isSpeaking && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
      )}
    </div>
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
 * Microphone SVG Icon
 */
function MicrophoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

/**
 * Speaker Wave (Voice ON) SVG Icon
 */
function SpeakerWaveIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

/**
 * Speaker Mute (Voice OFF) SVG Icon
 */
function SpeakerMuteIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="22" x2="16" y1="9" y2="15" />
      <line x1="16" x2="22" y1="9" y2="15" />
    </svg>
  );
}

/**
 * FloatingChatWidget Component
 * Persistent floating AI laundry assistant with natural messaging, voice dictation, speech output, and dual WhatsApp dispatch.
 */
export default function FloatingChatWidget() {
  const [widgetState, setWidgetState] = useState<WidgetState>("closed-idle");
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(SAGE_INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Voice Interaction State
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const shouldReduceMotion = useReducedMotion();
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (widgetState === "open") {
      scrollToBottom();
    }
  }, [messages, isTyping, widgetState]);

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputValue(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Text-To-Speech Speech Synthesis function for Sage
  const speakText = useCallback(
    (text: string) => {
      if (!isVoiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
        return;
      }

      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      // Clean text for audio synthesis (remove bullet characters and ticket markers)
      const cleanVoiceText = text
        .replace(/•/g, "")
        .replace(/\n+/g, " ")
        .replace(/#OG-\d+/g, "ticket")
        .replace(/\+234/g, "plus 2 3 4")
        .trim();

      if (!cleanVoiceText) return;

      const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Female") ||
            v.name.includes("Karen"))
      ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isVoiceEnabled]
  );

  // Stop speaking helper
  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle microphone dictation
  const handleToggleListening = () => {
    stopSpeaking();
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Handle message sending
  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const rawText = textToSend || inputValue;
      const text = rawText.trim();
      if (!text || isTyping) return;

      stopSpeaking();
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: sanitizeSageText(text),
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      try {
        const sageResponse = await getSageResponse(text);
        setMessages((prev) => [...prev, sageResponse]);
        speakText(sageResponse.text);
      } catch (err) {
        const errorMsg = "I had a brief connection hitch, but our team is ready to book your laundry.";
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "sage",
            text: errorMsg,
            timestamp: "Just now",
          },
        ]);
        speakText(errorMsg);
      } finally {
        setIsTyping(false);
      }
    },
    [inputValue, isTyping, isListening, speakText]
  );

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
        stopSpeaking();
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
    stopSpeaking();
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
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
    stopSpeaking();
    resetLeadState();
    const freshMessage: ChatMessage = {
      id: `init-${Date.now()}`,
      sender: "sage",
      text: "Let us start a fresh order! What service do you need today? (Wash & Fold, Dry Cleaning, or Same-Day Express)",
      timestamp: "Just now",
    };
    setMessages([freshMessage]);
    speakText(freshMessage.text);
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
            className="fixed inset-3 sm:inset-auto sm:bottom-0 sm:right-0 sm:w-[420px] sm:h-[590px] max-h-[92vh] flex flex-col rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Sage"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-emerald-600 text-white shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center p-0.5 shadow-inner">
                  <SageMascotIllustration className="w-full h-full" isSpeaking={isSpeaking} />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-600" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-white leading-tight">Sage</h2>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-700/80 text-[10px] font-utility text-emerald-100 uppercase font-semibold">
                      Voice & WhatsApp Ready
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90">
                    {isSpeaking ? "Speaking response..." : "Instant order booking & dispatch"}
                  </p>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Voice Readout Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    }
                    setIsVoiceEnabled(!isVoiceEnabled);
                  }}
                  className={`p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isVoiceEnabled
                      ? "bg-emerald-700 text-white hover:bg-emerald-800"
                      : "text-emerald-200 hover:text-white hover:bg-emerald-700"
                  }`}
                  title={isVoiceEnabled ? "Voice output enabled (Click to mute)" : "Voice output muted (Click to enable)"}
                  aria-label={isVoiceEnabled ? "Mute voice assistant" : "Unmute voice assistant"}
                >
                  {isVoiceEnabled ? <SpeakerWaveIcon className="w-4 h-4" /> : <SpeakerMuteIcon className="w-4 h-4" />}
                </button>

                {/* New Order Button */}
                <button
                  onClick={handleStartNewOrder}
                  className="px-2 py-1 rounded-lg text-[10px] font-utility font-semibold bg-emerald-700/80 text-emerald-100 hover:text-white hover:bg-emerald-800 transition-colors"
                  title="Start a new order"
                >
                  New Order
                </button>

                {/* Close Button */}
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
                        FINAL VERIFIED ORDER TICKET WITH DUAL WHATSAPP ACTIONS
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

                        {/* Dual WhatsApp Dispatch Action Buttons */}
                        {(msg.ticket.ownerWhatsappUrl || msg.ticket.whatsappUrl || msg.ticket.customerWhatsappUrl) && (
                          <div className="mt-3 pt-2.5 border-t border-emerald-200 flex flex-col gap-2">
                            {/* Button 1: Send to Business Owner */}
                            <a
                              href={msg.ticket.ownerWhatsappUrl || msg.ticket.whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
                            >
                              <WhatsAppIcon className="w-4 h-4" />
                              <span>Send to Ogawash Dispatch</span>
                            </a>
                            <p className="text-[10px] text-center text-emerald-800/80 font-utility -mt-1">
                              Direct to Dispatch Desk ({OWNER_WHATSAPP_NUMBER})
                            </p>

                            {/* Button 2: Send Copy to Customer's WhatsApp */}
                            {msg.ticket.customerWhatsappUrl && (
                              <div className="pt-1">
                                <a
                                  href={msg.ticket.customerWhatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full py-2 px-3 rounded-xl bg-white border border-emerald-400 hover:bg-emerald-50 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all duration-200"
                                >
                                  <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Send Copy to My WhatsApp</span>
                                </a>
                                {msg.ticket.customerPhone && (
                                  <p className="text-[9px] text-center text-slate-500 font-utility mt-0.5">
                                    Customer copy for: {msg.ticket.customerPhone}
                                  </p>
                                )}
                              </div>
                            )}
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

            {/* Listening Indicator Bar if Microphone is active */}
            {isListening && (
              <div className="px-3 py-1.5 bg-rose-50 border-t border-rose-200 flex items-center justify-between text-xs text-rose-700 font-medium animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Listening... Speak your message</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className="text-[10px] underline hover:text-rose-900 cursor-pointer"
                >
                  Stop Recording
                </button>
              </div>
            )}

            {/* Input Row with Voice Microphone and Send */}
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
                placeholder={isListening ? "Listening to your voice..." : "Type or click mic to speak..."}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                disabled={isTyping}
              />

              {/* Microphone Voice Input Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={handleToggleListening}
                  disabled={isTyping}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isListening
                      ? "bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300"
                      : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-200"
                  }`}
                  title={isListening ? "Stop listening" : "Click to speak with voice"}
                  aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
                >
                  <MicrophoneIcon className="w-4 h-4" />
                </button>
              )}

              {/* Send Button */}
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
                  Hey there! Ready to book a pickup? I can close your order, speak with voice, and send it to WhatsApp right now!
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
