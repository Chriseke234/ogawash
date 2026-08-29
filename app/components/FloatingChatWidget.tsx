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
  isListening = false,
}: {
  className?: string;
  isSpeaking?: boolean;
  isListening?: boolean;
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
        ) : isListening ? (
          <ellipse cx="50" cy="62" rx="3" ry="3" fill="#E11D48" className="animate-bounce" />
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

      {/* Dynamic Status Ring indicator */}
      {isSpeaking ? (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 ring-2 ring-white" />
        </span>
      ) : isListening ? (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 ring-2 ring-white" />
        </span>
      ) : null}
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
 * Equalizer / Soundwave animated bars for Audio toggle
 */
function SoundwaveEqualizer({ isPlaying = false }: { isPlaying?: boolean }) {
  return (
    <div className="flex items-center gap-[2px] h-3.5 px-0.5">
      <span
        className={`w-[2.5px] rounded-full bg-emerald-200 transition-all ${
          isPlaying ? "h-3.5 animate-pulse" : "h-1.5"
        }`}
        style={{ animationDuration: "0.6s" }}
      />
      <span
        className={`w-[2.5px] rounded-full bg-emerald-100 transition-all ${
          isPlaying ? "h-2.5 animate-pulse" : "h-2.5"
        }`}
        style={{ animationDuration: "0.4s", animationDelay: "0.15s" }}
      />
      <span
        className={`w-[2.5px] rounded-full bg-white transition-all ${
          isPlaying ? "h-4 animate-pulse" : "h-3"
        }`}
        style={{ animationDuration: "0.8s", animationDelay: "0.3s" }}
      />
      <span
        className={`w-[2.5px] rounded-full bg-emerald-200 transition-all ${
          isPlaying ? "h-2 animate-pulse" : "h-1.5"
        }`}
        style={{ animationDuration: "0.5s", animationDelay: "0.2s" }}
      />
    </div>
  );
}

/**
 * Audio Muted SVG Icon
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
 * Multi-bar Audio Waveform Visualizer
 */
function LiveAudioWaveformBar({
  mode,
  onStop,
}: {
  mode: "listening" | "speaking";
  onStop: () => void;
}) {
  const isListening = mode === "listening";

  return (
    <div
      className={`px-3.5 py-2 border-t flex items-center justify-between transition-colors ${
        isListening
          ? "bg-rose-50/90 border-rose-200 text-rose-800"
          : "bg-emerald-50/90 border-emerald-200 text-emerald-800"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            isListening ? "bg-rose-500 animate-ping" : "bg-emerald-500 animate-pulse"
          }`}
        />
        <div className="flex items-center gap-1 h-4">
          {[40, 70, 100, 60, 90, 50, 80].map((height, i) => (
            <span
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                isListening ? "bg-rose-500" : "bg-emerald-600"
              }`}
              style={{
                height: `${height}%`,
                animation: "pulse 0.6s infinite ease-in-out alternate",
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
        <span className="text-xs font-semibold">
          {isListening ? "Listening to your voice..." : "Sage is speaking response..."}
        </span>
      </div>

      <button
        type="button"
        onClick={onStop}
        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
          isListening
            ? "border-rose-300 bg-white text-rose-700 hover:bg-rose-100"
            : "border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        Stop
      </button>
    </div>
  );
}

/**
 * FloatingChatWidget Component
 * Redesigned luxury glassmorphic AI laundry concierge with real-time voice, natural messaging, and dual WhatsApp dispatch.
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

      window.speechSynthesis.cancel();

      // Clean text for audio readout
      const cleanVoiceText = text
        .replace(/•/g, "")
        .replace(/\n+/g, " ")
        .replace(/#OG-\d+/g, "order ticket")
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

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

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
      className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 font-sans"
      aria-label="Sage AI Laundry Assistant Widget"
    >
      {/* ─────────────────────────────────────────────────────────────
          STATE 3: REDESIGNED OPEN CHAT PANEL (Glass-card / Sheet)
         ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {widgetState === "open" && (
          <motion.div
            key="chat-panel"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-2 sm:inset-auto sm:bottom-0 sm:right-0 sm:w-[420px] sm:h-[610px] max-h-[94vh] flex flex-col rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl overflow-hidden z-50 ring-1 ring-black/5"
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Sage AI Concierge"
          >
            {/* Luxury Glassmorphic Header */}
            <div className="relative flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md border-b border-emerald-700/50">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-white flex items-center justify-center p-1 shadow-sm ring-1 ring-white/20">
                  <SageMascotIllustration
                    className="w-full h-full"
                    isSpeaking={isSpeaking}
                    isListening={isListening}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white tracking-tight">Sage</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-700/70 border border-emerald-500/40 text-[10px] font-utility font-semibold text-emerald-100 uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                      Live Concierge
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90 font-medium">
                    {isSpeaking
                      ? "Speaking aloud..."
                      : isListening
                      ? "Listening to your voice..."
                      : "Instant Doorstep Booking • Dual WhatsApp"}
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1.5">
                {/* Voice Readout Toggle with Equalizer */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopSpeaking();
                    }
                    setIsVoiceEnabled(!isVoiceEnabled);
                  }}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer ${
                    isVoiceEnabled
                      ? "bg-emerald-700/90 text-white border border-emerald-500/40 hover:bg-emerald-600 shadow-xs"
                      : "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-800/50 hover:text-white"
                  }`}
                  title={isVoiceEnabled ? "Voice readout active (Click to mute)" : "Voice readout muted (Click to unmute)"}
                  aria-label={isVoiceEnabled ? "Mute voice assistant" : "Unmute voice assistant"}
                >
                  {isVoiceEnabled ? (
                    <>
                      <SoundwaveEqualizer isPlaying={isSpeaking} />
                      <span className="text-[10px] font-utility uppercase">Voice ON</span>
                    </>
                  ) : (
                    <>
                      <SpeakerMuteIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-utility uppercase">Muted</span>
                    </>
                  )}
                </button>

                {/* New Order Reset Button */}
                <button
                  type="button"
                  onClick={handleStartNewOrder}
                  className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  title="Start a new order"
                  aria-label="Start a new order"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                    <path d="M8 16H3v5" />
                  </svg>
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCloseChat}
                  className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
                  aria-label="Close chat"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Conversation Stream */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-[13px] bg-gradient-to-b from-slate-50/90 via-white to-slate-50/70"
              aria-live="polite"
            >
              {messages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-xs transition-all ${
                        isUser
                          ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-medium rounded-tr-xs shadow-emerald-700/10"
                          : "bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-slate-200/40"
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* ─────────────────────────────────────────────────────────────
                          ELEVATED ORDER TICKET CARD WITH DUAL WHATSAPP ACTIONS
                         ───────────────────────────────────────────────────────────── */}
                      {msg.ticket && (
                        <div className="mt-3.5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200 text-left shadow-xs">
                          {/* Ticket Header Ribbon */}
                          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-emerald-200/80">
                            <span className="flex items-center gap-1.5 font-utility text-[11px] font-bold text-emerald-900 tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                              {msg.ticket.id}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-utility text-[10px] font-bold tracking-wider uppercase shadow-2xs">
                              {msg.ticket.isFinalized ? "Dispatch Ready" : "In Progress"}
                            </span>
                          </div>

                          {/* Order Details List */}
                          <div className="space-y-2 text-xs">
                            {/* Live Tracking 4-Segment Progress Bar */}
                            {msg.ticket.trackingStatus && (
                              <div className="mb-3 p-2.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900 mb-1.5">
                                  <span>Status: {msg.ticket.trackingStatus}</span>
                                  <span className="text-[10px] text-emerald-600 font-utility">Stage 3 of 4</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                                  <div className="h-1.5 rounded-full bg-emerald-500" />
                                  <div className="h-1.5 rounded-full bg-emerald-500" />
                                  <div className="h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <div className="h-1.5 rounded-full bg-slate-200" />
                                </div>
                                <div className="flex justify-between text-[9px] text-slate-500 font-utility font-semibold">
                                  <span>Intake</span>
                                  <span>Wash</span>
                                  <span className="text-emerald-700 font-bold">Press</span>
                                  <span>Delivery</span>
                                </div>
                              </div>
                            )}

                            {/* Details Row: Service */}
                            <div className="flex items-start gap-2">
                              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-2.5 h-2.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-slate-500 text-[11px]">Service: </span>
                                <span className="font-bold text-slate-900">{msg.ticket.service}</span>
                              </div>
                            </div>

                            {/* Customer Name */}
                            {msg.ticket.customerName && (
                              <div className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                  <svg className="w-2.5 h-2.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[11px]">Customer: </span>
                                  <span className="font-semibold text-slate-900">{msg.ticket.customerName}</span>
                                </div>
                              </div>
                            )}

                            {/* Phone */}
                            {msg.ticket.customerPhone && (
                              <div className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                  <svg className="w-2.5 h-2.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[11px]">Phone: </span>
                                  <span className="font-semibold text-slate-900">{msg.ticket.customerPhone}</span>
                                </div>
                              </div>
                            )}

                            {/* Address */}
                            {msg.ticket.customerAddress && (
                              <div className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                  <svg className="w-2.5 h-2.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[11px]">Address: </span>
                                  <span className="font-semibold text-slate-900">{msg.ticket.customerAddress}</span>
                                </div>
                              </div>
                            )}

                            {/* Schedule Window */}
                            {msg.ticket.timing && (
                              <div className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                  <svg className="w-2.5 h-2.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="text-slate-500 text-[11px]">Schedule: </span>
                                  <span className="font-bold text-emerald-800">{msg.ticket.timing}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Dual WhatsApp Action Buttons */}
                          {(msg.ticket.ownerWhatsappUrl || msg.ticket.whatsappUrl || msg.ticket.customerWhatsappUrl) && (
                            <div className="mt-3.5 pt-3 border-t border-emerald-200/80 flex flex-col gap-2">
                              {/* Primary Button: Send to Owner / Ogawash Dispatch */}
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

                              {/* Secondary Button: Send Copy to Customer's WhatsApp */}
                              {msg.ticket.customerWhatsappUrl && (
                                <div className="pt-0.5">
                                  <a
                                    href={msg.ticket.customerWhatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2 px-3 rounded-xl bg-white border border-emerald-400 hover:bg-emerald-50 text-emerald-900 font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs transition-all duration-200"
                                  >
                                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Send Copy to My WhatsApp</span>
                                  </a>
                                  {msg.ticket.customerPhone && (
                                    <p className="text-[9px] text-center text-slate-500 font-utility mt-0.5">
                                      Customer receipt copy for: {msg.ticket.customerPhone}
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
                );
              })}

              {/* Typing Dot Bounces */}
              {isTyping && (
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white border border-slate-200 w-fit shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips Bar */}
            <div className="px-3.5 py-2 bg-slate-50/80 border-t border-slate-200/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {SAGE_QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-white text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200/80 shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Live Audio Waveform Visualizer Bar */}
            {isListening ? (
              <LiveAudioWaveformBar mode="listening" onStop={handleToggleListening} />
            ) : isSpeaking ? (
              <LiveAudioWaveformBar mode="speaking" onStop={stopSpeaking} />
            ) : null}

            {/* Integrated Floating Input Dock */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isListening
                      ? "Listening... speak now"
                      : "Ask about services or book a pickup..."
                  }
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  disabled={isTyping}
                />

                {/* Embedded Microphone Button */}
                {speechSupported && (
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    disabled={isTyping}
                    className={`absolute right-1.5 p-1.5 rounded-xl transition-all cursor-pointer focus-visible:outline-none ${
                      isListening
                        ? "bg-rose-500 text-white animate-pulse shadow-xs"
                        : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                    }`}
                    title={isListening ? "Stop listening" : "Click to speak with voice"}
                    aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
                  >
                    <MicrophoneIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer shrink-0"
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
          STATE 1 & 2: FLOATING TRIGGER BUTTON & PROACTIVE GREETING
         ───────────────────────────────────────────────────────────── */}
      {widgetState !== "open" && (
        <div className="relative flex items-center justify-end">
          
          {/* Greeting Tooltip Bubble */}
          <AnimatePresence>
            {widgetState === "closed-with-greeting" && (
              <motion.div
                key="greeting-bubble"
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                onClick={handleOpenChat}
                className="absolute right-16 sm:right-18 bottom-1 max-w-[260px] sm:max-w-[280px] p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl cursor-pointer hover:border-emerald-400 transition-all group ring-1 ring-black/5"
                role="region"
                aria-live="polite"
                aria-label="Sage Greeting"
              >
                {/* Arrow */}
                <div
                  className="absolute -right-2 bottom-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white"
                  aria-hidden="true"
                />

                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-utility text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      Sage Assistant
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDismissGreeting}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                    aria-label="Dismiss greeting"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-sans font-medium">
                  Hello! Ready to schedule laundry? I can explain services, take voice inputs, and dispatch your order directly to WhatsApp!
                </p>
                <div className="mt-2.5 text-[10px] font-utility font-bold text-emerald-700 group-hover:text-emerald-800 flex items-center gap-1">
                  <span>Start WhatsApp Order</span>
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
                    scale: [1, 1.12, 0.96, 1.04, 1],
                    transition: { duration: 0.6, ease: "easeOut" },
                  }
                : {}
            }
            className="group relative w-14 h-14 rounded-2xl bg-white border-2 border-emerald-500 shadow-xl shadow-emerald-500/20 flex items-center justify-center p-1 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transform hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 cursor-pointer"
            aria-label="Open chat with Sage"
          >
            <SageMascotIllustration className="w-full h-full" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </motion.button>

        </div>
      )}
    </div>
  );
}
