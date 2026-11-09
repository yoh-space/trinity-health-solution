"use client";

import { useAction, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useState } from "react";
import {
  ShieldCheck,
  Send,
  MessageSquare,
  Activity,
  Droplets,
  Baby,
  HeartPulse,
  RotateCcw,
} from "lucide-react";
import {
  getOpalErrorMessage,
  type OpalSource,
  type OpalStructuredAnswer,
} from "@/lib/opalChat";
import { OpalMessageRenderer } from "@/components/education/OpalMessageRenderer";
import { OpalConsentModal } from "@/components/education/OpalConsentModal";
import { OpalQuickTools } from "@/components/education/OpalQuickTools";
import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

interface PromptItem {
  en: string;
  am: string;
  icon: typeof Droplets;
}

const PROMPT_SUGGESTIONS: PromptItem[] = [
  {
    en: "How do I make drinking water safe for my family?",
    am: "በቤት ውስጥ የመጠጥ ውሃን እንዴት አስተማማኝ ማድረግ ይቻላል?",
    icon: Droplets,
  },
  {
    en: "What nutritious foods should I choose during pregnancy?",
    am: "በእርግዝና ወቅት ምን አይነት አልሚ ምግቦችን መመገብ አለብኝ?",
    icon: HeartPulse,
  },
  {
    en: "What should I feed my 6-month-old infant?",
    am: "ለ 6 ወር ህጻን ምን አይነት ተጨማሪ ምግብ መስጠት አለብኝ?",
    icon: Baby,
  },
  {
    en: "How can I keep food preparation clean at home?",
    am: "የምግብ ማዘጋጃ ቦታን እንዴት በንጽህና መያዝ እችላለሁ?",
    icon: Activity,
  },
];

export function OpalChat() {
  const askOpal = useAction(anyApi.opal.ask);
  const hasSavedProfile = useQuery(anyApi.onboarding.hasProfile);
  const { language, setLanguage } = useMarketingLanguage();
  const am = language === "am";

  // Active view tab on mobile screens
  const [mobileTab, setMobileTab] = useState<"chat" | "tools">("chat");

  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Consent & Session State
  const [hasConsented, setHasConsented] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  // Optional profile context
  const [profileContext, setProfileContext] = useState<{
    includeProfileContext: boolean;
    audience?: "myself" | "child" | "caregiver";
    ageBand?: "under5" | "age5to17" | "age18to39" | "age40to59" | "age60plus";
    goals: Array<"healthyEating" | "familyMeals">;
  }>({
    includeProfileContext: false,
    goals: [],
  });

  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "opal";
      text: string;
      sources?: OpalSource[];
      redFlag?: "none" | "clinical" | "urgent";
      structured?: OpalStructuredAnswer;
    }>
  >([]);

  // Initiates question sending with Just-In-Time consent modal check
  const handleInitiateAsk = (questionText: string) => {
    const text = questionText.trim();
    if (!text || isSending) return;

    if (!hasConsented) {
      setPendingQuestion(text);
      setConsentModalOpen(true);
      return;
    }

    void executeAsk(text, profileContext);
  };

  const handleConsentConfirmed = (options: {
    includeProfileContext: boolean;
    audience?: "myself" | "child" | "caregiver";
    ageBand?: "under5" | "age5to17" | "age18to39" | "age40to59" | "age60plus";
    goals: Array<"healthyEating" | "familyMeals">;
  }) => {
    setHasConsented(true);
    setProfileContext(options);
    setConsentModalOpen(false);

    const questionToSend = pendingQuestion || draft.trim();
    if (questionToSend) {
      setPendingQuestion(null);
      void executeAsk(questionToSend, options);
    }
  };

  const executeAsk = async (
    text: string,
    context: {
      includeProfileContext: boolean;
      audience?: "myself" | "child" | "caregiver";
      ageBand?: "under5" | "age5to17" | "age18to39" | "age40to59" | "age60plus";
      goals: Array<"healthyEating" | "familyMeals">;
    }
  ) => {
    setError("");
    setIsSending(true);
    setMessages((curr) => [...curr, { role: "user", text }]);
    setDraft("");

    try {
      const response = await askOpal({
        consented: true,
        language,
        question: text,
        ...(context.includeProfileContext
          ? {
              includeProfileContext: true,
              profileConsented: true,
              ...(hasSavedProfile === true
                ? {}
                : {
                    guestProfileContext: {
                      ...(context.audience ? { audience: context.audience } : {}),
                      ...(context.ageBand ? { ageBand: context.ageBand } : {}),
                      goals: context.goals,
                    },
                  }),
            }
          : {}),
      });

      setMessages((curr) => [
        ...curr,
        {
          role: "opal",
          text: response.answer,
          sources: response.sources,
          redFlag: response.redFlag,
          structured: response.structured,
        },
      ]);
    } catch (reqError) {
      setError(getOpalErrorMessage(reqError, language));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="py-6 sm:py-10">
      {/* Top Header Section */}
      <section className="border-b border-[#e2eae1] pb-6 sm:pb-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#163826] sm:text-4xl">
                {am ? "ኦፓል የጤና መመሪያ" : "Ask Opal Health Guidance"}
              </h1>
              <p className="mt-1.5 text-xs text-[#5a6e60] sm:text-sm max-w-2xl leading-relaxed">
                {am
                  ? "በትሪኒቲ በተረጋገጡ የጤናና የአመጋገብ ትምህርቶች ላይ የተመሰረተ ፈጣንና አስተማማኝ መረጃ።"
                  : "Evidence-backed family health education and instant clinical reference tools."}
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex rounded-full border border-[#cbd8cb] bg-white p-0.5 text-xs font-bold shadow-2xs self-start sm:self-auto">
              {(["en", "am"] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setLanguage(val)}
                  className={`rounded-full px-3.5 py-1.5 transition ${
                    language === val
                      ? "bg-[#1c573e] text-white shadow-2xs"
                      : "text-[#5e7564] hover:text-[#183b2d]"
                  }`}
                >
                  {val === "en" ? "English" : "አማርኛ"}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="mt-6 flex rounded-2xl border border-[#d2ddd0] bg-white p-1 text-xs font-bold lg:hidden">
            <button
              type="button"
              onClick={() => setMobileTab("chat")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition ${
                mobileTab === "chat"
                  ? "bg-[#1c573e] text-white shadow-xs"
                  : "text-[#556e5d]"
              }`}
            >
              <MessageSquare size={14} />
              <span>{am ? "የኦፓል ውይይት" : "Message Opal"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("tools")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 transition ${
                mobileTab === "tools"
                  ? "bg-[#1c573e] text-white shadow-xs"
                  : "text-[#556e5d]"
              }`}
            >
              <Activity size={14} />
              <span>{am ? "የጤና ስሌቶችና መሳሪያዎች" : "Health Tools"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Two-Column Workspace */}
      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN: Health Tools & Calculators */}
          <div
            className={`lg:col-span-5 xl:col-span-4 ${
              mobileTab === "tools" ? "block" : "hidden lg:block"
            }`}
          >
            <OpalQuickTools
              language={language}
              onSelectPrompt={(text) => handleInitiateAsk(text)}
            />
          </div>

          {/* RIGHT COLUMN: Conversational Opal Chat Stream */}
          <div
            className={`lg:col-span-7 xl:col-span-8 ${
              mobileTab === "chat" ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex flex-col rounded-3xl border border-[#d8e3d6] bg-white shadow-xs min-h-[580px]">
              {/* Chat Sub-Header */}
              <div className="flex items-center justify-between border-b border-[#edf3ec] px-5 py-3.5 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-[#eaf4eb] text-[#1c573e]">
                    <MessageSquare size={15} />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#163826]">
                      {am ? "የኦፓል የጤና ውይይት" : "Curated Health Dialogue"}
                    </h2>
                    <p className="text-[10px] text-[#698270]">
                      {am
                        ? "በGoogle Gemini እና በትሪኒቲ ትምህርቶች የተደገፈ"
                        : "Verified against Trinity curriculum"}
                    </p>
                  </div>
                </div>

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMessages([])}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#668270] hover:text-[#183b2d]"
                  >
                    <RotateCcw size={12} />
                    <span>{am ? "አዲስ ውይይት" : "Reset chat"}</span>
                  </button>
                )}
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[600px]">
                {/* Empty State Welcome Card */}
                {messages.length === 0 && (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-[#e2ece0] bg-[#f8faf7] p-5 text-xs sm:text-sm leading-relaxed text-[#3a5241]">
                      <div className="flex items-start gap-3">
                        <ShieldCheck size={20} className="text-[#1c573e] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#163826] text-sm mb-1">
                            {am ? "እንኳን ወደ ኦፓል በደህና መጡ" : "Welcome to Opal Health Guide"}
                          </p>
                          <p>
                            {am
                              ? "ስለ ህፃናት አመጋገብ፣ የእርግዝና እንክብካቤ፣ አስተማማኝ ውሃ እና የምግብ ንጽህና ጥያቄ ይጠይቁ።"
                              : "Ask about infant feeding, maternal nutrition, water safety, and household health. Inquiries are formulated against Trinity's verified community health curriculum."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Inquiry Chips */}
                    <div>
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#526a58] mb-2.5">
                        {am ? "የተለመዱ ጥያቄዎች (በ 1-ክሊክ ይጠይቁ)" : "Common Inquiries (1-Click Ask)"}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {PROMPT_SUGGESTIONS.map((item, idx) => {
                          const Icon = item.icon;
                          const text = am ? item.am : item.en;
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleInitiateAsk(text)}
                              disabled={isSending}
                              className="group flex items-start gap-2.5 rounded-2xl border border-[#d2ded2] bg-white p-3 text-left text-xs font-semibold text-[#274431] shadow-2xs hover:border-[#1c573e] hover:bg-[#f6faf5] transition active:scale-98"
                            >
                              <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#eaf4eb] text-[#1c573e] mt-0.5 group-hover:bg-[#1c573e] group-hover:text-white transition">
                                <Icon size={13} />
                              </div>
                              <span className="leading-snug">{text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Message Bubbles */}
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`${
                      message.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl bg-[#1c573e] p-4 text-white shadow-xs text-xs sm:text-sm leading-relaxed"
                        : "max-w-full rounded-2xl border border-[#dce8de] bg-[#fbfdfb] p-4 sm:p-5 text-[#22392c] shadow-2xs"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="whitespace-pre-line">{message.text}</p>
                    ) : (
                      <OpalMessageRenderer
                        text={message.text}
                        structured={message.structured}
                        language={language}
                        sources={message.sources}
                        redFlag={message.redFlag}
                      />
                    )}
                  </div>
                ))}

                {isSending && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#547963] p-2">
                    <div className="size-2 rounded-full bg-[#1c573e] animate-ping" />
                    <span>{am ? "ኦፓል መልስ እያዘጋጀ ነው..." : "Opal is preparing guidance..."}</span>
                  </div>
                )}

                {error && (
                  <p role="alert" className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
                    {error}
                  </p>
                )}
              </div>

              {/* Chat Input Dock */}
              <div className="border-t border-[#edf3ec] p-4 sm:p-5 bg-[#fafcf9] rounded-b-3xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleInitiateAsk(draft);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={1000}
                    disabled={isSending}
                    placeholder={
                      am
                        ? "ስለ ውሃ ንጽህና፣ ህፃናት አመጋገብ ወይም እርግዝና ይጠይቁ..."
                        : "Ask about infant feeding, water safety, nutrition..."
                    }
                    className="min-w-0 flex-1 rounded-2xl border border-[#cbd8cb] bg-white px-4 py-3 text-xs sm:text-sm text-[#183b2d] placeholder:text-[#889e8f] outline-hidden focus:border-[#1c573e] focus:ring-1 focus:ring-[#1c573e]"
                  />

                  <button
                    type="submit"
                    disabled={!draft.trim() || isSending}
                    aria-label={am ? "ላክ" : "Send question"}
                    className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#1c573e] text-white shadow-xs hover:bg-[#154631] transition disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                  >
                    <Send size={15} />
                  </button>
                </form>

                <p className="mt-2 text-center text-[10px] text-[#718778]">
                  {am
                    ? "ኦፓል አጠቃላይ የትምህርት መረጃ ብቻ ይሰጣል፤ ለግል የህክምና ምርመራ ወይም መድኃኒት ማዘዣ ብቁ የጤና ባለሙያ ያማክሩ።"
                    : "Educational guidance only, not individual medical diagnosis or therapy."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Just-In-Time Data Sharing Consent Modal */}
      <OpalConsentModal
        isOpen={consentModalOpen}
        onClose={() => setConsentModalOpen(false)}
        onConfirm={handleConsentConfirmed}
        language={language}
        hasSavedProfile={hasSavedProfile === true}
      />
    </div>
  );
}
