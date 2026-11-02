"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  MessageCircle,
  X,
  Send,
  ExternalLink,
  BookOpen,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import {
  fallbackEducation,
  matchEducation,
  displayContent,
  displayTitle,
  type EducationItem,
} from "@/lib/education";
import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

interface ChatMessage {
  id: string;
  role: "user" | "opal";
  text: string;
  sourceItem?: EducationItem;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    en: "How do I make drinking water safe for my family?",
    am: "በቤት ውስጥ የመጠጥ ውሃን እንዴት አስተማማኝ ማድረግ ይቻላል?",
    labelEn: "Safe Drinking Water",
    labelAm: "አስተማማኝ የመጠጥ ውሃ",
    icon: "💧",
  },
  {
    en: "What should I feed my 6-month-old infant?",
    am: "ለ 6 ወር ህጻን ምን አይነት ተጨማሪ ምግብ መስጠት አለብኝ?",
    labelEn: "Infant Feeding (6 mo)",
    labelAm: "የህፃናት ተጨማሪ ምግብ",
    icon: "👶",
  },
  {
    en: "What nutritious foods should I choose during pregnancy?",
    am: "በእርግዝና ወቅት ምን አይነት አልሚ ምግቦችን መመገብ አለብኝ?",
    labelEn: "Pregnancy Nutrition",
    labelAm: "የእርግዝና አመጋገብ",
    icon: "🤰",
  },
  {
    en: "How can I keep food preparation clean at home?",
    am: "የምግብ ማዘጋጃ ቦታን እንዴት በንጽህና መያዝ እችላለሁ?",
    labelEn: "Clean Food Prep",
    labelAm: "የምግብ ንጽህና",
    icon: "🥗",
  },
];

function generateOpalResponse(
  question: string,
  language: "en" | "am",
  items: EducationItem[],
): { text: string; matchedItem?: EducationItem } {
  const lower = question.toLocaleLowerCase();

  if (/emergency|urgent|can't breathe|heavy bleeding|አስቸኳይ/.test(lower)) {
    return {
      text:
        language === "am"
          ? "ይህ አስቸኳይ ሊሆን የሚችል ጥያቄ ነው። ኦፓል አስቸኳይ ሁኔታን ሊገመግም አይችልም። እባክዎ ወዲያውኑ የአካባቢዎን የአስቸኳይ አገልግሎት ወይም ጤና ጣቢያ ያነጋግሩ።"
          : "This may be urgent. Opal cannot assess emergencies. Please contact your local emergency service or a qualified health facility immediately.",
    };
  }

  if (/diagnos|medicine|dose|treatment|symptom|pain|fever|መድሃኒት|ህመም/.test(lower)) {
    return {
      text:
        language === "am"
          ? "ኦፓል ምርመራ፣ የመድሃኒት ምክር ወይም የግል ሕክምና ሊሰጥ አይችልም። ከብቁ የጤና ባለሙያ ጋር በአካል ይነጋገሩ።"
          : "Opal cannot diagnose, recommend medicine, or provide individual medical treatment. Please speak with a qualified health professional.",
    };
  }

  const matched = matchEducation(question, items);
  if (!matched) {
    return {
      text:
        language === "am"
          ? "በተረጋገጡ አጠቃላይ የጤና ትምህርቶቻችን ብቻ ልረዳ እችላለሁ። ስለ ንጹህ ውሃ፣ የእናቶች አመጋገብ፣ የህፃናት ምግብ፣ ወይም የምግብ አያያዝ ይጠይቁ።"
          : "I can help with verified curriculum topics regarding clean water, maternal nutrition, infant feeding, and safe food storage. Try asking about one of those topics.",
    };
  }

  const mainContent = displayContent(matched, language);
  return {
    text: mainContent,
    matchedItem: matched,
  };
}

export function FloatingOpalChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { language, setLanguage, t } = useMarketingLanguage();

  const remote = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const items = remote?.length ? remote : fallbackEducation;

  // Don't render floating chat button if user is already on the dedicated /ask-opal page
  const isDedicatedPage = pathname === "/ask-opal";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (isDedicatedPage) {
    return null;
  }

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const { text: responseText, matchedItem } = generateOpalResponse(
      query,
      language,
      items
    );

    const opalMsg: ChatMessage = {
      id: `opal-${Date.now() + 1}`,
      role: "opal",
      text: responseText,
      sourceItem: matchedItem,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, opalMsg]);
    setInput("");
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close Opal Chat" : "Ask Opal Health Assistant"}
          className={`group flex items-center gap-2.5 rounded-full border border-[#164933]/50 bg-[#1c573e] px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:bg-[#14442f] hover:shadow-[0_12px_28px_rgba(20,68,47,0.35)] active:scale-95 ${
            isOpen ? "ring-2 ring-[#f4e6c3] ring-offset-2 ring-offset-white" : ""
          }`}
        >
          <div className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-[#276e4c] text-[#f4e6c3]">
            {isOpen ? (
              <X size={16} className="transition-transform group-hover:rotate-90" />
            ) : (
              <MessageCircle size={16} />
            )}
            {/* Live pulsing dot */}
            {!isOpen && (
              <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#a3e635] opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#84cc16]" />
              </span>
            )}
          </div>

          <div className="text-left">
            <span className="block text-xs font-bold leading-none tracking-wide text-white">
              {isOpen ? t("Close", "ዝጋ") : t("Ask Opal", "ኦፓልን ጠይቁ")}
            </span>
            <span className="block text-[10px] font-medium leading-none text-[#b3d4be] mt-0.5">
              {isOpen ? t("Assistant", "ረዳት") : t("Family Health", "የቤተሰብ ጤና")}
            </span>
          </div>
        </button>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ask Opal Health Guidance Chat"
          className="fixed bottom-22 right-4 sm:right-6 z-50 flex h-[580px] max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] sm:w-[410px] flex-col overflow-hidden rounded-3xl border border-[#d6dfd2] bg-white shadow-2xl shadow-[#163a2a]/20 animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e5ece4] bg-[#1c573e] px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-[#f4e6c3]">
                <MessageCircle size={17} />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#1c573e] bg-[#84cc16]" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight text-white flex items-center gap-1.5">
                  {t("Ask Opal", "ኦፓል የጤና ረዳት")}
                </h3>
                <p className="text-[11px] text-[#b8d6c2] leading-tight">
                  {t("Verified Family Health Guidance", "የተረጋገጠ የቤተሰብ ጤና መረጃ")}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1.5">
              {/* Language Switcher */}
              <button
                type="button"
                onClick={() => setLanguage(language === "en" ? "am" : "en")}
                className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[11px] font-bold text-white transition hover:bg-white/20"
                title={language === "en" ? "Switch to Amharic" : "ወደ እንግሊዝኛ ቀይር"}
              >
                {language === "en" ? "አማ" : "EN"}
              </button>

              {/* Dedicated Page Link */}
              <Link
                href="/ask-opal"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[#c7ded0] transition hover:bg-white/10 hover:text-white"
                title={t("Open full screen chat", "ሙሉ ገጽ ክፈት")}
              >
                <ExternalLink size={15} />
              </Link>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[#c7ded0] transition hover:bg-white/10 hover:text-white"
                title={t("Close chat", "ዝጋ")}
              >
                <ChevronDown size={17} />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#fafcf9] text-sm">
            {/* Disclaimer pill */}
            <div className="rounded-xl border border-[#e2ece3] bg-[#f2f7f2] px-3 py-2 text-center text-[11px] text-[#4d6b59]">
              <span className="font-semibold">{t("Educational guidance only.", "ለትምህርታዊ ዓላማ ብቻ።")}</span>{" "}
              {t("For acute emergencies, visit your local clinic.", "ለአስቸኳይ ህመም ጤና ጣቢያ ያነጋግሩ።")}
            </div>

            {/* Welcome message */}
            <div className="flex items-start gap-2.5">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1c573e] text-[#f4e6c3] text-xs font-bold">
                O
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-xs border border-[#e2ece3] bg-white p-3 shadow-2xs text-[#1c3e2e]">
                <p className="text-xs leading-relaxed">
                  {language === "am"
                    ? "ሰላም! እኔ ኦፓል ነኝ። ስለ መጠጥ ውሃ ንፅህና፣ የእናቶችና የህፃናት አመጋገብ፣ ወይም የምግብ አያያዝ ማንኛውንም ጥያቄ ይጠይቁኝ።"
                    : "Hello! I am Opal, your family health guidance companion. Ask any question about clean water, nutrition, infant feeding, or safe food preparation."}
                </p>
              </div>
            </div>

            {/* Quick interactive prompts (when no user questions yet) */}
            {messages.length === 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#698875] px-1 mb-2">
                  {t("Suggested Topics", "የተመረጡ የጤና ርዕሶች")}
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSend(language === "am" ? prompt.am : prompt.en)}
                      className="group flex items-center justify-between rounded-xl border border-[#dde7df] bg-white px-3 py-2 text-left text-xs text-[#204933] shadow-2xs transition hover:border-[#287343] hover:bg-[#f3f9f4]"
                    >
                      <span className="flex items-center gap-2">
                        <span>{prompt.icon}</span>
                        <span className="font-medium group-hover:text-[#16442c]">
                          {language === "am" ? prompt.labelAm : prompt.labelEn}
                        </span>
                      </span>
                      <span className="text-[11px] text-[#71937e] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Flow */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-tr-xs bg-[#1c573e] px-3.5 py-2.5 text-white shadow-xs">
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span className="block mt-1 text-[9px] text-[#b3d4be] text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 max-w-[90%]">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1c573e] text-[#f4e6c3] text-[10px] font-bold mt-1">
                      O
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="rounded-2xl rounded-tl-xs border border-[#e2ece3] bg-white p-3 shadow-2xs text-[#1c3e2e]">
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span className="block mt-1 text-[9px] text-[#71937e]">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Attached curriculum lesson citation */}
                      {msg.sourceItem && (
                        <div className="rounded-xl border border-[#d6e5d8] bg-[#f0f6f1] p-2.5 text-xs text-[#1e4832]">
                          <div className="flex items-center gap-1.5 font-semibold text-[11px] text-[#1a442c]">
                            <BookOpen size={13} className="text-[#287343]" />
                            <span>{t("Verified Trinity Lesson", "የተረጋገጠ የትሪኒቲ ትምህርት")}</span>
                          </div>
                          <p className="mt-1 text-[11px] font-medium text-[#2d583e] line-clamp-1">
                            {displayTitle(msg.sourceItem, language)}
                          </p>
                          <Link
                            href="/learn"
                            onClick={() => setIsOpen(false)}
                            className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-[#1b5030] hover:underline"
                          >
                            <span>{t("Explore in Library", "በትምህርት ማዕከሉ አንብብ")}</span>
                            <span>→</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="border-t border-[#e5ece4] bg-white p-3">
            {messages.length > 0 && (
              <div className="flex items-center justify-between pb-2 px-1">
                <span className="text-[10px] text-[#789684]">
                  {messages.length / 2} {t("exchanges", "ጥያቄዎች")}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#668872] hover:text-[#18452e]"
                >
                  <RotateCcw size={11} />
                  <span>{t("Clear history", "አጽዳ")}</span>
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  language === "am"
                    ? "የጤና ጥያቄዎን እዚህ ይጻፉ..."
                    : "Ask about water, nutrition, food safety..."
                }
                className="flex-1 rounded-full border border-[#cbd8ce] bg-[#f9fbf8] px-4 py-2 text-xs text-[#163a28] placeholder-[#7d9987] focus:border-[#1c573e] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#1c573e]"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message to Opal"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1c573e] text-white shadow-xs transition hover:bg-[#14442f] disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
