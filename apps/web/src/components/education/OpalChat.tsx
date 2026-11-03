"use client";

import { useAction, useQuery } from "convex/react";
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
import { getOpalErrorMessage, type OpalSource } from "@/lib/opalChat";
import { OpalNutritionCalculator } from "@/components/education/OpalNutritionCalculator";
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
  {
    en: "Can Opal calculate or diagnose diabetes for me?",
    am: "ኦፓል የስኳር በሽታን ሊያሰላ ወይም ሊመረምርልኝ ይችላል?",
  },
];

export function OpalChat() {
  const askOpal = useAction(anyApi.opal.ask);
  const hasSavedProfile = useQuery(anyApi.onboarding.hasProfile);
  const { language, setLanguage } = useMarketingLanguage();
  const [draft, setDraft] = useState("");
  const [consented, setConsented] = useState(false);
  const [profileConsented, setProfileConsented] = useState(false);
  const [audience, setAudience] = useState<
    "myself" | "child" | "caregiver" | ""
  >("");
  const [ageBand, setAgeBand] = useState<
    "under5" | "age5to17" | "age18to39" | "age40to59" | "age60plus" | ""
  >("");
  const [goals, setGoals] = useState<Array<"healthyEating" | "familyMeals">>(
    [],
  );
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<
    Array<{
      role: "user" | "opal";
      text: string;
      sources?: OpalSource[];
      redFlag?: "none" | "clinical" | "urgent";
    }>
  >([]);

  const ask = async (question: string) => {
    const text = question.trim();
    if (!text || !consented || isSending) return;
    if (
      profileConsented &&
      hasSavedProfile !== true &&
      !audience &&
      !ageBand &&
      goals.length === 0
    ) {
      setError(
        language === "am"
          ? "ቢያንስ አንድ አጠቃላይ የመገለጫ ምርጫ ይምረጡ ወይም የመገለጫ መጋራትን ያጥፉ።"
          : "Choose at least one general profile option or turn off profile sharing.",
      );
      return;
    }

    setError("");
    setIsSending(true);
    setMessages((current) => [...current, { role: "user", text }]);
    setDraft("");
    try {
      const response = await askOpal({
        consented: true,
        language,
        question: text,
        ...(profileConsented
          ? {
              includeProfileContext: true,
              profileConsented: true,
              ...(hasSavedProfile === true
                ? {}
                : {
                    guestProfileContext: {
                      ...(audience ? { audience } : {}),
                      ...(ageBand ? { ageBand } : {}),
                      goals,
                    },
                  }),
            }
          : {}),
      });
      setMessages((current) => [
        ...current,
        {
          role: "opal",
          text: response.answer,
          sources: response.sources,
          redFlag: response.redFlag,
        },
      ]);
    } catch (requestError) {
      const code =
        requestError instanceof Error ? requestError.message : "";
      setError(
        code.includes("OPAL_PROFILE_CONTEXT_REQUIRED")
          ? language === "am"
            ? "የመገለጫ መረጃዎን ለGemini ከመላክዎ በፊት የአጠቃላይ ምርጫዎችን ይሙሉ።"
            : "Complete at least one general profile option before sharing it with Gemini."
          : getOpalErrorMessage(requestError, language),
      );
    } finally {
      setIsSending(false);
    }
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

        <OpalNutritionCalculator
          language={language}
          hasSavedProfile={hasSavedProfile === true}
        />

        <label className="mb-5 flex items-start gap-2 text-xs leading-5 text-[#52685a]">
          <input
            type="checkbox"
            checked={consented}
            onChange={(event) => setConsented(event.target.checked)}
            className="mt-1 accent-[#1c573e]"
          />
          <span>
            {language === "am"
              ? "ጥያቄዬን እና ከእሱ ጋር የተያያዙ የታተሙ ትምህርቶችን መልስ ለማዘጋጀት ወደ Google Gemini እንዲላኩ እስማማለሁ። ስም፣ የጤና መረጃ ወይም ሌላ የግል መረጃ አያካትቱ።"
              : "I agree to send my question and relevant published lesson text to Google Gemini to generate an answer. Do not include names or personal health details."}
          </span>
        </label>

        <div className="mb-6 rounded-2xl border border-[#dce8de] bg-[#f8faf7] p-4">
          <label className="flex items-start gap-2 text-xs leading-5 text-[#52685a]">
            <input
              type="checkbox"
              checked={profileConsented}
              onChange={(event) =>
                setProfileConsented(event.target.checked)
              }
              className="mt-1 accent-[#1c573e]"
            />
            <span>
              {language === "am"
                ? "አጠቃላይ የመገለጫ መረጃዬን ከጥያቄዬ ጋር ለGemini እንዲላክ በተለየ ፈቃድ እስማማለሁ። የሚላኩት የተመረጠ ተመልካች፣ የዕድሜ ክልልና አጠቃላይ የመማር ግቦች ብቻ ናቸው። ስም፣ የጤና ሁኔታ፣ እርግዝና፣ አለርጂ፣ መለኪያዎች፣ የመገናኛ መረጃ ወይም ነፃ ጽሑፍ አይላክም።"
                : "I separately agree to send minimal general profile context to Gemini with my question. Only audience, age band, and general learning goals are shared. Names, health conditions, pregnancy, allergies, measurements, contact details, and free-text profile answers are excluded."}
            </span>
          </label>

          {profileConsented && hasSavedProfile === true && (
            <p className="mt-3 rounded-xl border border-[#dce8de] bg-white px-3 py-2 text-xs leading-5 text-[#496551]">
              {language === "am"
                ? "የተቀመጠው የመጀመሪያ መገለጫዎ ይጠቀማል፤ ከላይ የተጠቀሱት የተፈቀዱ መረጃዎች ብቻ ይካተታሉ።"
                : "Your saved onboarding profile will be used, but only the allowed fields listed above are included."}
            </p>
          )}

          {profileConsented && hasSavedProfile !== true && (
            <div className="mt-4 space-y-4">
              <p className="text-xs leading-5 text-[#68796d]">
                {language === "am"
                  ? "ከታች የሚመርጡት በዚህ ክፍለ ጊዜ ብቻ ይቆያል፤ ወደ መለያዎ አይቀመጥም።"
                  : "These optional choices stay in this page session and are not saved to your account."}
              </p>
              <ProfileChoiceGroup
                label={language === "am" ? "ይህ ለማን ነው?" : "Who is this for?"}
                value={audience}
                options={[
                  { value: "myself", en: "Myself", am: "ለራሴ" },
                  { value: "child", en: "My child", am: "ለልጄ" },
                  { value: "caregiver", en: "Someone I care for", am: "ለምከባከበው ሰው" },
                ]}
                language={language}
                onChange={(value) => setAudience(value as "myself" | "child" | "caregiver")}
              />
              <ProfileChoiceGroup
                label={language === "am" ? "የዕድሜ ክልል (አማራጭ)" : "Age band (optional)"}
                value={ageBand}
                options={[
                  { value: "under5", en: "Under 5", am: "ከ5 በታች" },
                  { value: "age5to17", en: "5–17", am: "5–17" },
                  { value: "age18to39", en: "18–39", am: "18–39" },
                  { value: "age40to59", en: "40–59", am: "40–59" },
                  { value: "age60plus", en: "60+", am: "60+" },
                ]}
                language={language}
                onChange={(value) =>
                  setAgeBand(
                    value as
                      | "under5"
                      | "age5to17"
                      | "age18to39"
                      | "age40to59"
                      | "age60plus",
                  )
                }
              />
              <div>
                <p className="mb-2 text-xs font-semibold text-[#405647]">
                  {language === "am"
                    ? "አጠቃላይ ግቦች (አማራጭ)"
                    : "General goals (optional)"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      value: "healthyEating" as const,
                      en: "Learn healthy eating",
                      am: "ጤናማ አመጋገብን መማር",
                    },
                    {
                      value: "familyMeals" as const,
                      en: "Plan family meals",
                      am: "የቤተሰብ ምግብ ማቀድ",
                    },
                  ].map((goal) => {
                    const selected = goals.includes(goal.value);
                    return (
                      <button
                        key={goal.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() =>
                          setGoals((current) =>
                            selected
                              ? current.filter((value) => value !== goal.value)
                              : [...current, goal.value],
                          )
                        }
                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                          selected
                            ? "border-[#1c573e] bg-[#eaf2e9] text-[#1c573e]"
                            : "border-[#d0ded0] bg-white text-[#52685a] hover:border-[#1c573e]"
                        }`}
                      >
                        {language === "am" ? goal.am : goal.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
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
                  onClick={() => void ask(text)}
                  disabled={!consented || isSending}
                  className="rounded-full border border-[#d0ded0] bg-white px-3.5 py-2 text-left text-xs font-semibold text-[#2f4d38] shadow-2xs hover:border-[#1c573e] hover:bg-[#f1f7f1] transition active:scale-98 disabled:cursor-not-allowed disabled:opacity-50"
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
                  {message.sources?.map((source) => (
                    <div key={source.id} className="mt-3 pt-2.5 border-t border-[#e6eee5]">
                      <Link
                        href={`/learn/${source.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
                      >
                        <BookOpen size={13} aria-hidden="true" />
                        <span>
                          {language === "am"
                            ? `የትምህርት ማስታወሻውን ያንብቡ፦ ${source.titleAm}`
                            : `Read the reviewed lesson: ${source.title}`}
                        </span>
                        <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    </div>
                  ))}
                  {message.role === "opal" &&
                    message.redFlag === "clinical" && (
                      <div className="mt-3 border-t border-[#e6eee5] pt-3">
                                <div className="flex flex-wrap gap-2">
                                  <Link
                                    href="/portal/consultations/new"
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1c573e] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#154631]"
                                  >
                                    <ShieldCheck size={14} aria-hidden="true" />
                                    <span>
                                      {language === "am"
                                        ? "ከጤና ባለሙያ ጋር ይነጋገሩ"
                                        : "Request care-team support"}
                                    </span>
                                    <ArrowRight size={13} aria-hidden="true" />
                                  </Link>
                                  <a
                                    href="tel:+251988720194"
                                    className="inline-flex items-center rounded-full border border-[#cbd8cb] px-3.5 py-2 text-xs font-bold text-[#1c573e] hover:bg-[#f4f8f3]"
                                  >
                                    +251 98 872 0194
                                  </a>
                                </div>
                                <p className="mt-2 text-[11px] leading-4 text-[#718276]">
                                  {language === "am"
                                    ? "እርስዎ ካልደወሉ ወይም የእገዛ ጥያቄ ካላስገቡ በስተቀር የውይይትዎ ወይም የመገለጫዎ መረጃ አይላክም። አስቸኳይ ከሆነ የአካባቢዎን አስቸኳይ አገልግሎት ያነጋግሩ።"
                                    : "Your chat and profile aren’t shared unless you call or submit a care request. For emergencies, contact local emergency services immediately."}
                                </p>
                              </div>
                            )}
                </div>
              ))}
            </div>
          )}

          {isSending && (
            <p role="status" className="mb-3 text-sm text-[#668872]">
              {language === "am" ? "ኦፓል መልስ እያዘጋጀ ነው..." : "Opal is preparing a response..."}
            </p>
          )}
          {error && (
            <p role="alert" className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          {/* Input field */}
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && void ask(draft)}
              maxLength={1000}
              disabled={isSending}
              placeholder={
                language === "am"
                  ? "ስለ ምግብ፣ ውሃ ወይም የእርግዝና አመጋገብ ይጠይቁ..."
                  : "Ask about safe water, child feeding, maternal health..."
              }
              className="min-w-0 flex-1 rounded-xl border border-[#cfe0d2] px-4 py-3 text-sm text-[#183b2d] placeholder:text-[#8d9e92] outline-none focus:border-[#1c573e] focus:ring-2 focus:ring-[#1c573e]/20"
            />
            <button
              type="button"
              onClick={() => void ask(draft)}
              disabled={!draft.trim() || !consented || isSending}
              className="rounded-xl bg-[#1c573e] px-5 py-3 text-sm font-bold text-white shadow-xs hover:bg-[#154631] transition shrink-0 flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>
                {isSending
                  ? language === "am"
                    ? "በመላክ ላይ..."
                    : "Thinking..."
                  : language === "am"
                    ? "ላክ"
                    : "Send"}
              </span>
              <Send size={14} />
            </button>
          </div>

          <p className="mt-3 text-center text-[11px] leading-4 text-[#788a7d]">
            {language === "am"
              ? "ኦፓል አጠቃላይ የትምህርት መረጃ ብቻ ይሰጣል። ለግል የሕክምና ምክር ብቁ የጤና ባለሙያን ያነጋግሩ።"
              : "Opal provides general educational guidance only, not personal medical advice."}
          </p>
        </div>
      </section>
    </div>
  );
}

function ProfileChoiceGroup<T extends string>({
  label,
  value,
  options,
  language,
  onChange,
}: {
  label: string;
  value: T | "";
  options: Array<{ value: T; en: string; am: string }>;
  language: "en" | "am";
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-[#405647]">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                selected
                  ? "border-[#1c573e] bg-[#eaf2e9] text-[#1c573e]"
                  : "border-[#d0ded0] bg-white text-[#52685a] hover:border-[#1c573e]"
              }`}
            >
              {language === "am" ? option.am : option.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
