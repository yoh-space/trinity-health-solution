"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import Link from "next/link";
import { useState } from "react";
import {
  fallbackEducation,
  matchEducation,
  displayContent,
  displayTitle,
  type EducationItem,
  type EducationLanguage,
} from "@/lib/education";

const prompts = [
  "How can I keep food preparation clean?",
  "How do I make drinking water safe?",
  "What foods can I choose during pregnancy?",
];

function responseFor(
  question: string,
  language: EducationLanguage,
  items: EducationItem[],
) {
  const lower = question.toLocaleLowerCase();
  if (/emergency|urgent|can't breathe|heavy bleeding|አስቸኳይ/.test(lower))
    return language === "am"
      ? "ይህ አስቸኳይ ሊሆን የሚችል ጥያቄ ነው። ኦፓል አስቸኳይ ሁኔታን ሊገመግም አይችልም። እባክዎ ወዲያውኑ የአካባቢዎን የአስቸኳይ አገልግሎት ያነጋግሩ።"
      : "This may be urgent. Opal cannot assess emergencies. Please contact your local emergency service or a qualified health professional now.";
  if (
    /diagnos|medicine|dose|treatment|symptom|pain|fever|መድሃኒት|ህመም/.test(lower)
  )
    return language === "am"
      ? "ኦፓል ምርመራ፣ የመድሃኒት ምክር ወይም የግል ሕክምና ሊሰጥ አይችልም። ከብቁ የጤና ባለሙያ ጋር ይነጋገሩ።"
      : "Opal cannot diagnose, recommend medicine, or provide individual treatment. Please speak with a qualified health professional.";
  const item = matchEducation(question, items);
  if (!item)
    return language === "am"
      ? "በተዘጋጁ አጠቃላይ ትምህርቶች ብቻ ልረዳ እችላለሁ። የምግብ፣ ውሃ ወይም የቤተሰብ አመጋገብ ጥያቄ ይሞክሩ።"
      : "I can help with prepared general notes about food, water, pregnancy, and family nutrition. Try one of those topics.";
  return `${displayContent(item, language)}\n\n${displayTitle(item, language)}`;
}

export function OpalChat() {
  const remote = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const items = remote?.length ? remote : fallbackEducation;
  const [language, setLanguage] = useState<EducationLanguage>("en");
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
    <main className="min-h-screen bg-[#f7faf6] text-[#183b2d]">
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link href="/learn" className="text-sm font-bold text-[#438451]">
          ← Back to learning
        </Link>
        <div className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#438451]">
            A LITTLE GUIDANCE
          </p>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="mt-3 text-5xl font-semibold tracking-tight">
                Ask Opal
              </h1>
              <p className="mt-3 text-sm leading-7 text-[#6d7e72]">
                Answers matched from Trinity’s prepared learning notes.
              </p>
            </div>
            <div className="flex rounded-full border border-[#bcd4bf] bg-white p-1 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-3 py-1.5 ${language === "en" ? "bg-[#287343] text-white" : "text-[#5e7564]"}`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("am")}
                className={`rounded-full px-3 py-1.5 ${language === "am" ? "bg-[#287343] text-white" : "text-[#5e7564]"}`}
              >
                አማርኛ
              </button>
            </div>
          </div>
        </div>
        <div className="mt-10 rounded-3xl border border-[#dce8de] bg-white p-6 shadow-sm sm:p-8">
          <div className="rounded-2xl bg-[#eaf4eb] p-5 text-sm leading-7 text-[#46624d]">
            {language === "am"
              ? "ሰላም! ከታች ያለውን ጥያቄ ይምረጡ ወይም የራስዎን ይጻፉ።"
              : "Selam! Choose a prompt below or ask your own general learning question."}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => ask(prompt)}
                className="rounded-full border border-[#cfe0d2] bg-[#fbfdfb] px-3 py-2 text-left text-xs font-semibold text-[#4b6751] hover:bg-[#eef7ef]"
              >
                {prompt}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === "user" ? "ml-auto bg-[#347346] text-white" : "border border-[#dce8de] bg-[#fbfdfb] text-[#4d6251]"}`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                {message.source && (
                  <Link
                    href={`/learn/${message.source}`}
                    className="mt-3 inline-block text-xs font-bold text-[#287343]"
                  >
                    Read the source note →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && ask(draft)}
              placeholder="Ask about food, water, or hygiene..."
              className="min-w-0 flex-1 rounded-full border border-[#cfe0d2] px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#87b791]"
            />
            <button
              type="button"
              onClick={() => ask(draft)}
              className="rounded-full bg-[#287343] px-5 py-3 text-sm font-bold text-white"
            >
              Send
            </button>
          </div>
          <p className="mt-4 text-center text-xs leading-5 text-[#829086]">
            Please do not share names, phone numbers, or health details. Opal is
            general education, not medical care.
          </p>
        </div>
      </div>
    </main>
  );
}
