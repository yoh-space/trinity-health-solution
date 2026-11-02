"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  Send,
  BookOpen,
} from "lucide-react";
import {
  fallbackEducation,
  matchEducation,
  displayContent,
  displayTitle,
  type EducationItem,
} from "@/lib/education";
import { useMarketingLanguage } from "@/components/marketing/MarketingLanguageContext";

interface PromptItem {
  en: string;
  am: string;
}

const PROMPT_SUGGESTIONS: PromptItem[] = [
  {
    en: "How can I keep food preparation clean at home?",
    am: "የምግብ ማዘጋጃ ቦታን እንዴት በንጽህና መያዝ እችላለሁ?",
  },
  {
    en: "How do I make drinking water safe for my family?",
    am: "በቤት ውስጥ የመጠጥ ውሃን እንዴት አስተማማኝ ማድረግ ይቻላል?",
  },
  {
    en: "What nutritious foods should I choose during pregnancy?",
    am: "በእርግዝና ወቅት ምን አይነት አልሚ ምግቦችን መመገብ አለብኝ?",
  },
  {
    en: "What should I feed my 6-month-old infant?",
    am: "ለ 6 ወር ህጻን ምን አይነት ተጨማሪ ምግብ መስጠት አለብኝ?",
  },
];

function responseFor(
  question: string,
  language: "en" | "am",
  items: EducationItem[],
) {
  const lower = question.toLocaleLowerCase();
  if (/emergency|urgent|can't breathe|heavy bleeding|አስቸኳይ/.test(lower))
    return language === "am"
      ? "ይህ አስቸኳይ ሊሆን የሚችል ጥያቄ ነው። ኦፓል አስቸኳይ ሁኔታን ሊገመግም አይችልም። እባክዎ ወዲያውኑ የአካባቢዎን የአስቸኳይ አገልግሎት ወይም ጤና ጣቢያ ያነጋግሩ።"
      : "This may be urgent. Opal cannot assess emergencies. Please contact your local emergency service or a qualified health facility now.";
  if (
    /diagnos|medicine|dose|treatment|symptom|pain|fever|መድሃኒት|ህመም/.test(lower)
  )
    return language === "am"
      ? "ኦፓል ምርመራ፣ የመድሃኒት ምክር ወይም የግል ሕክምና ሊሰጥ አይችልም። ከብቁ የጤና ባለሙያ ጋር በአካል ይነጋገሩ።"
      : "Opal cannot diagnose, recommend medicine, or provide individual medical treatment. Please speak with a qualified health professional.";
  const item = matchEducation(question, items);
  if (!item)
    return language === "am"
      ? "በተዘጋጁ አጠቃላይ የጤና ትምህርቶች ብቻ ልረዳ እችላለሁ። የምግብ ንጽህና፣ አስተማማኝ ውሃ፣ ወይም የቤተሰብ አመጋገብ ጥያቄ ይሞክሩ።"
      : "I can help with verified curriculum topics regarding clean water, maternal nutrition, infant feeding, and safe food storage. Try asking about one of those topics.";
  return `${displayContent(item, language)}\n\n${displayTitle(item, language)}`;
}

export function OpalChat() {
  const remote = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const items = remote?.length ? remote : fallbackEducation;
  const { language, setLanguage } = useMarketingLanguage();
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "opal"; text: string; source?: string }>
  >([]);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    const item = matchEducation(text, items);
    setMessages((current) => [
      ...current,
      { role: "user", text },
      {
        role: "opal",
        text: responseFor(text, language, items),
        source: item?._id,
      },
    ]);
    setDraft("");
  };

  return (
    <div className="py-8 sm:py-12">
      {/* Editorial Header Section */}
      <section className="border-b border-[#e2eae1] pb-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#1c573e]">
                  COMMUNITY HEALTH GUIDANCE
                </span>
                <span className="text-[#cbd6cc]">•</span>
                <span className="text-xs font-semibold text-[#667e6e]">
                  Curated Curriculum Answers
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-5xl">
                {language === "am" ? "ኦፓል የጤና መመሪያ" : "Ask Opal Health Guide"}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[#5a6e60] sm:text-base">
                {language === "am"
                  ? "በትሪኒቲ የተረጋገጡ የጤና እና የአመጋገብ ትምህርቶች ላይ የተመሰረተ ፈጣን እና አስተማማኝ መመሪያ።"
                  : "Carefully curated health learning for women, girls, and families, retrieved from Trinity’s community health curriculum."}
              </p>
            </div>

            {/* Language Selection */}
            <div className="flex rounded-full border border-[#cbd8cb] bg-white p-0.5 text-xs font-bold shadow-2xs self-start md:self-end">
              {(["en", "am"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLanguage(value)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    language === value
                      ? "bg-[#1c573e] text-white shadow-2xs"
                      : "text-[#5e7564] hover:text-[#183b2d]"
                  }`}
                >
                  {value === "en" ? "English" : "አማርኛ"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Dialogue Workspace */}
      <section className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        {/* Clinical Scope Notice Banner */}
        <div className="rounded-2xl border border-[#d2ded2] bg-[#f4f7f4] p-4 text-xs leading-relaxed text-[#3a5442] flex items-start gap-3 shadow-2xs mb-8">
          <ShieldCheck className="w-5 h-5 text-[#1c573e] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#1c573e] mb-0.5">
              {language === "am"
                ? "የህክምና ወሰን ማስታወቂያ"
                : "Clinical Scope Notice"}
            </p>
            <p>
              {language === "am"
                ? "ኦፓል ከተዘጋጁ አጠቃላይ የጤና ትምህርቶች መረጃ ይሰጣል፤ የግል ምርመራ፣ መድኃኒት ማዘዝ ወይም የግል ሕክምና መስጠት አይችልም። ለአስቸኳይ ምልክቶች ወዲያውኑ በአቅራቢያዎ ወደሚገኝ ጤና ጣቢያ ያምሩ።"
                : "Opal provides general health education from Trinity's reviewed public health curriculum. It does not diagnose, prescribe medications, formulate individual dietary therapy, or replace direct clinical care. In emergencies or urgent symptoms, contact your local health facility immediately."}
            </p>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={14} className="text-[#1c573e]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#546b5a]">
              {language === "am"
                ? "የተለመዱ ጥያቄዎች (ይምረጡ)"
                : "Common Inquiries (Click to Ask)"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PROMPT_SUGGESTIONS.map((item, idx) => {
              const text = language === "am" ? item.am : item.en;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => ask(text)}
                  className="rounded-full border border-[#d0ded0] bg-white px-3.5 py-2 text-left text-xs font-semibold text-[#2f4d38] shadow-2xs hover:border-[#1c573e] hover:bg-[#f1f7f1] transition active:scale-98"
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Dialogue Card */}
        <div className="rounded-3xl border border-[#dce8de] bg-white p-5 shadow-xs sm:p-7">
          {/* Welcome Message */}
          <div className="rounded-2xl border border-[#e4ede3] bg-[#f8faf7] p-4 text-xs sm:text-sm leading-relaxed text-[#3b5443] mb-6 flex items-start gap-3">
            <MessageSquare size={16} className="text-[#1c573e] shrink-0 mt-0.5" />
            <p>
              {language === "am"
                ? "ሰላም! ስለ ምግብ ንጽህና፣ አስተማማኝ ውሃ፣ እርግዝና እና የህፃናት አመጋገብ የተዘጋጁ መመሪያዎችን እዚህ ማግኘት ይችላሉ። ጥያቄዎን ከላይ ካሉት ይምረጡ ወይም ከታች ይጻፉ።"
                : "Welcome. Opal provides general educational information from Trinity's reviewed curriculum on maternal health, infant nutrition, clean water, and safe food preparation. Select a prompt above or type your question below."}
            </p>
          </div>

          {/* Messages List */}
          {messages.length > 0 && (
            <div className="space-y-4 mb-6">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[88%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    message.role === "user"
                      ? "ml-auto bg-[#1c573e] text-white shadow-xs"
                      : "border border-[#dce8de] bg-[#fbfdfb] text-[#22392c] shadow-2xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  {message.source && (
                    <div className="mt-3 pt-2.5 border-t border-[#e6eee5]">
                      <Link
                        href={`/learn/${message.source}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
                      >
                        <BookOpen size={13} aria-hidden="true" />
                        <span>
                          {language === "am"
                            ? "ሙሉውን የትምህርት ማስታወሻ ያንብቡ"
                            : "Read the full reviewed lesson note"}
                        </span>
                        <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Input field */}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && ask(draft)}
              placeholder={
                language === "am"
                  ? "ስለ ምግብ፣ ውሃ ወይም የእርግዝና አመጋገብ ይጠይቁ..."
                  : "Ask about safe water, child feeding, maternal health..."
              }
              className="min-w-0 flex-1 rounded-xl border border-[#cfe0d2] px-4 py-3 text-sm text-[#183b2d] placeholder:text-[#8d9e92] outline-none focus:border-[#1c573e] focus:ring-2 focus:ring-[#1c573e]/20"
            />
            <button
              type="button"
              onClick={() => ask(draft)}
              className="rounded-xl bg-[#1c573e] px-5 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#154631] transition shrink-0 flex items-center gap-1.5"
            >
              <span>{language === "am" ? "ላክ" : "Send"}</span>
              <Send size={14} />
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] leading-4 text-[#788a7d]">
            {language === "am"
              ? "እባክዎ የግል መረጃዎችን (ስም፣ ስልክ) አያጋሩ። ኦፓል አጠቃላይ የትምህርት መረጃ ብቻ ይሰጣል።"
              : "Please do not share personal identifiers or medical records. Opal provides general educational guidance."}
          </p>
        </div>
      </section>
    </div>
  );
}
