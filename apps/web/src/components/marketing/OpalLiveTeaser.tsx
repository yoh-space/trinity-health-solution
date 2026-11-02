"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare, BookOpen, Send, ShieldCheck, HelpCircle } from "lucide-react";
import { opalSampleQuestions } from "./marketingContent";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function OpalLiveTeaser() {
  const { language, t } = useMarketingLanguage();
  const [selectedQuestionId, setSelectedQuestionId] = useState(
    opalSampleQuestions[0].id
  );

  const activeQuestion =
    opalSampleQuestions.find((q) => q.id === selectedQuestionId) ??
    opalSampleQuestions[0];

  return (
    <section className="bg-gradient-to-b from-[#edf2e8] to-[#fbfaf6] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* Left Column: Context & Explanations */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd8c6] bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2d563d] shadow-2xs">
              <ShieldCheck size={14} className="text-[#1c573e]" />
              {t("Evidence-Grounded Health Reference", "በህክምና ባለሙያዎች የተረጋገጠ የጤና መመሪያ")}
            </div>

            <h2 className="mt-4 text-3xl font-medium leading-[1.08] tracking-tight text-[#193b2d] sm:text-5xl">
              {t("Ask Opal anything.", "ኦፓልን ማንኛውንም የጤና ጥያቄ ይጠይቁ።")}
            </h2>

            <p className="mt-4 text-base leading-7 text-[#5e7063]">
              {t(
                "Opal is Trinity's conversational health assistant. Built on Gemini and strictly grounded in reviewed lessons, Opal gives calm, verified answers to common family health questions in both Amharic and English.",
                "ኦፓል (Opal) የትሪኒቲ የጤና ረዳት ነው። በህክምና ባለሙያዎች በተረጋገጡ ትምህርቶች ላይ ተመስርቶ ለቤተሰብ ጤና፣ አመጋገብና ንፅህና ጥያቄዎች ግልጽና አስተማማኝ ምላሾችን በአማርኛ እና በእንግሊዝኛ ይሰጣል።"
              )}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#79887d]">
                {t("Click a sample question to test Opal:", "ለመሞከር ከታች ካሉት ጥያቄዎች አንዱን ይምረጡ፡")}
              </p>

              <div className="flex flex-col gap-2.5">
                {opalSampleQuestions.map((q) => {
                  const isSelected = q.id === selectedQuestionId;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionId(q.id)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left text-xs font-semibold transition ${
                        isSelected
                          ? "border-[#1c573e] bg-white text-[#1c573e] shadow-sm"
                          : "border-[#d8e0d4] bg-white/50 text-[#4c5f52] hover:bg-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <MessageSquare
                          size={15}
                          className={isSelected ? "text-[#1c573e]" : "text-[#88998d]"}
                        />
                        <span>{language === "am" ? q.questionAm : q.questionEn}</span>
                      </span>
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#8b9b8f]">
                        {language === "am" ? q.categoryAm : q.categoryEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/ask-opal"
                className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-6 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-[#14442f]"
              >
                {t("Open Full Opal Assistant", "ሙሉውን ኦፓል ረዳት ይክፈቱ")}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Interactive Chat Mockup */}
          <div className="relative rounded-[2rem] border border-[#d6dfd2] bg-white p-5 shadow-[0_25px_60px_-15px_rgba(28,60,40,0.12)] sm:p-7">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-[#eef2ea] pb-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#1c573e] text-white">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1a3828]">
                    Opal Health Assistant
                  </h3>
                  <p className="text-[11px] text-[#718276]">
                    {t("Online · Grounded in verified notes", "ዝግጁ · በተረጋገጡ ትምህርቶች የተመሰረተ")}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#e8f1e5] px-2.5 py-1 text-[10px] font-bold text-[#2d5c3f]">
                {t("Curated Health Knowledge", "የተረጋገጠ የጤና እውቀት")}
              </span>
            </div>

            {/* Chat Body */}
            <div className="my-6 flex flex-col gap-4">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-[1.25rem] rounded-tr-xs bg-[#1c573e] p-4 text-xs leading-relaxed text-white shadow-xs">
                  {language === "am"
                    ? activeQuestion.questionAm
                    : activeQuestion.questionEn}
                </div>
              </div>

              {/* Opal Response */}
              <div className="flex items-start gap-3">
                <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#e5eddf] text-[#1c573e]">
                  <BookOpen size={13} />
                </div>
                <div className="max-w-[90%] rounded-[1.25rem] rounded-tl-xs border border-[#e2e8dc] bg-[#f8fbf6] p-4 text-xs leading-relaxed text-[#2a4535] shadow-xs">
                  <p>
                    {language === "am"
                      ? activeQuestion.answerAm
                      : activeQuestion.answerEn}
                  </p>

                  {/* Grounded Source Citation */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#e2e9dd] pt-2.5 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium text-[#567360]">
                      <BookOpen size={12} />
                      {language === "am"
                        ? activeQuestion.sourceLessonTitleAm
                        : activeQuestion.sourceLessonTitleEn}
                    </span>
                    <Link
                      href={`/learn/${activeQuestion.sourceLessonSlug}`}
                      className="font-bold text-[#1c573e] hover:underline"
                    >
                      {t("Read Note →", "ትምህርቱን አንብብ →")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Chat Input */}
            <div className="flex items-center gap-2 rounded-full border border-[#d6dfd2] bg-[#fbfaf6] px-4 py-2 text-xs text-[#758679]">
              <span className="flex-1">
                {t(
                  "Ask about nutrition, water, or child health...",
                  "ስለ አመጋገብ፣ ውሃ ወይም የህፃናት ጤና ይጠይቁ..."
                )}
              </span>
              <Link
                href="/ask-opal"
                className="grid size-8 place-items-center rounded-full bg-[#1c573e] text-white hover:bg-[#154631]"
              >
                <Send size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
