"use client";

import React from "react";
import Link from "next/link";
import {
  PhoneCall,
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import type {
  OpalLanguage,
  OpalSource,
  OpalStructuredAnswer,
} from "@/lib/opalChat";

interface OpalMessageRendererProps {
  text: string;
  structured?: OpalStructuredAnswer;
  language: OpalLanguage;
  sources?: OpalSource[];
  redFlag?: "none" | "clinical" | "urgent";
}

/**
 * Helper that parses inline bold (**text**) and italic (*text*) into styled React nodes.
 */
function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Split by bold (**bold**)
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-[#143d2b]">
          {boldContent}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Parses raw markdown text into structured blocks (headings, bullet points, paragraphs).
 */
function parseRawMarkdownBlocks(rawText: string) {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim());
  const blocks: Array<
    | { type: "heading"; content: string }
    | { type: "bullet"; content: string }
    | { type: "paragraph"; content: string }
  > = [];

  for (const line of lines) {
    if (!line) continue;
    if (line.startsWith("###")) {
      blocks.push({
        type: "heading",
        content: line.replace(/^###\s*/, ""),
      });
    } else if (line.startsWith("##")) {
      blocks.push({
        type: "heading",
        content: line.replace(/^##\s*/, ""),
      });
    } else if (
      line.startsWith("•") ||
      line.startsWith("-") ||
      line.startsWith("*") ||
      /^\d+\.\s/.test(line)
    ) {
      blocks.push({
        type: "bullet",
        content: line.replace(/^[•\-*\d.]+\s*/, ""),
      });
    } else {
      blocks.push({
        type: "paragraph",
        content: line,
      });
    }
  }

  return blocks;
}

export function OpalMessageRenderer({
  text,
  structured,
  language,
  sources,
  redFlag,
}: OpalMessageRendererProps) {
  const isUrgent = redFlag === "urgent";
  const isClinical = redFlag === "clinical";

  // If structured data is available, render the structured presentation
  if (structured && !isUrgent && !isClinical) {
    return (
      <div className="space-y-4">
        {/* Intro / Summary */}
        {structured.summary && (
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#1b3d2c]">
            {renderInlineMarkdown(structured.summary)}
          </p>
        )}

        {/* Structured Sections with Bold Headings & Bullets */}
        {structured.sections && structured.sections.length > 0 && (
          <div className="space-y-4 pt-1">
            {structured.sections.map((section, sIdx) => (
              <div
                key={sIdx}
                className="rounded-2xl border border-[#e4ede3] bg-[#fafcf9] p-3.5 space-y-2.5 transition hover:border-[#cbdeca]"
              >
                {section.title && (
                  <div className="flex items-center gap-2 border-b border-[#e9efe8] pb-1.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1c573e] text-[10px] font-bold text-white">
                      {sIdx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight text-[#16442f]">
                      {section.title.replace(/^[\d.\s]+/, "")}
                    </h4>
                  </div>
                )}
                {section.points && section.points.length > 0 && (
                  <ul className="space-y-2 pl-0.5">
                    {section.points.map((point, pIdx) => (
                      <li
                        key={pIdx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-[#2c4737]"
                      >
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#257348]" />
                        <span className="flex-1">{renderInlineMarkdown(point)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Practical Action Steps Card */}
        {structured.practicalTips && structured.practicalTips.length > 0 && (
          <div className="rounded-2xl border border-[#cbe1d0] bg-[#f2f8f3] p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1c573e]">
              <Lightbulb size={15} />
              <span>
                {language === "am" ? "ተግባራዊ እርምጃዎች" : "Practical Action Steps"}
              </span>
            </div>
            <ul className="space-y-1.5">
              {structured.practicalTips.map((tip, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs sm:text-sm leading-relaxed text-[#234b35]"
                >
                  <CheckCircle2
                    size={14}
                    className="shrink-0 mt-0.5 text-[#1c573e]"
                  />
                  <span>{renderInlineMarkdown(tip)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warning Signs Alert */}
        {structured.warningSigns && structured.warningSigns.length > 0 && (
          <div className="rounded-2xl border border-[#f3d6c4] bg-[#fffaf5] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b85626]">
              <AlertTriangle size={15} />
              <span>
                {language === "am"
                  ? "አስቸኳይ የጤና ምርመራ የሚያስፈልጋቸው ምልክቶች"
                  : "When to Seek Urgent Clinical Care"}
              </span>
            </div>
            <ul className="space-y-1.5">
              {structured.warningSigns.map((warning, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs leading-relaxed text-[#733515]"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#b85626]" />
                  <span>{renderInlineMarkdown(warning)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Trinity Health Solution Services & Support Card */}
        <div className="rounded-2xl border border-[#d2e2d6] bg-gradient-to-br from-[#f8fbf8] to-[#edf5ef] p-4 space-y-3 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#d8e6dc] pb-2.5">
            <div className="flex items-center gap-2">
              <HeartHandshake size={17} className="text-[#1c573e]" />
              <span className="text-xs font-bold tracking-tight text-[#16442f]">
                {language === "am"
                  ? "የትሪኒቲ ሄልዝ ሶሉሽን የማህበረሰብ አገልግሎቶችና ድጋፍ"
                  : "Trinity Health Solution Services & Support"}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#1c573e] border border-[#cfe0d4]">
              <PhoneCall size={10} />
              {language === "am" ? "የደንበኞች አገልግሎት" : "Customer Support"}
            </span>
          </div>

          {/* Suggested Services */}
          {structured.suggestedServices && (
            <div className="grid gap-2 sm:grid-cols-2">
              {structured.suggestedServices.map((service, sIdx) => (
                <div
                  key={sIdx}
                  className="rounded-xl border border-[#d8e7dc] bg-white p-3 space-y-1.5"
                >
                  <h5 className="text-xs font-bold text-[#1a4731]">
                    {service.title}
                  </h5>
                  <p className="text-[11px] leading-relaxed text-[#516d5b]">
                    {service.description}
                  </p>
                  <div className="pt-1 flex items-center justify-between">
                    <Link
                      href={service.actionUrl}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1c573e] hover:underline"
                    >
                      <span>{service.actionText}</span>
                      <ArrowRight size={11} />
                    </Link>
                    {service.phone && (
                      <a
                        href={`tel:${service.phone}`}
                        className="text-[10px] font-semibold text-[#668872] hover:text-[#1c573e]"
                      >
                        {service.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Direct Support Call & Emergency Helpline */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1.5 border-t border-[#d8e6dc]">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${structured.supportPhone || "+251988720194"}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1c573e] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-[#154631] transition active:scale-98"
              >
                <PhoneCall size={12} />
                <span>
                  {language === "am" ? "ስልክ ይደውሉ፡" : "Call Support:"}{" "}
                  {structured.supportPhone || "+251 98 872 0194"}
                </span>
              </a>
              <Link
                href="/portal/consultations/new"
                className="inline-flex items-center gap-1 rounded-full border border-[#cbdcca] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c573e] hover:bg-[#f3f8f3] transition"
              >
                <ShieldCheck size={13} />
                <span>
                  {language === "am"
                    ? "ከጤና ባለሙያ ጋር ይነጋገሩ"
                    : "Book Consultation"}
                </span>
              </Link>
            </div>
            <div className="text-[11px] font-medium text-[#64806e]">
              <span className="font-semibold">
                {language === "am" ? "ብሔራዊ የስልክ መስመር፡" : "National Helpline:"}
              </span>{" "}
              <span className="rounded bg-[#ffece2] px-1.5 py-0.5 font-bold text-[#a74619]">
                952
              </span>
            </div>
          </div>
        </div>

        {/* Lesson Sources */}
        {sources && sources.length > 0 && (
          <div className="pt-2 border-t border-[#e6eee5] space-y-1.5">
            {sources.map((source) => (
              <Link
                key={source.id}
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
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback markdown parsing for raw text responses
  const blocks = parseRawMarkdownBlocks(text);

  return (
    <div className="space-y-3">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return (
            <h4
              key={idx}
              className="text-xs sm:text-sm font-bold tracking-tight text-[#16442f] pt-1"
            >
              {renderInlineMarkdown(block.content)}
            </h4>
          );
        }
        if (block.type === "bullet") {
          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed text-[#2c4737] pl-1"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#257348]" />
              <span className="flex-1">{renderInlineMarkdown(block.content)}</span>
            </div>
          );
        }
        return (
          <p
            key={idx}
            className="text-xs sm:text-sm leading-relaxed text-[#22392c]"
          >
            {renderInlineMarkdown(block.content)}
          </p>
        );
      })}

      {/* Suggested Services & Customer Support Strip */}
      {!isUrgent && (
        <div className="mt-3.5 rounded-2xl border border-[#d2e2d6] bg-gradient-to-br from-[#f8fbf8] to-[#edf5ef] p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16442f]">
              <HeartHandshake size={15} className="text-[#1c573e]" />
              <span>
                {language === "am"
                  ? "የተጨማሪ ድጋፍ እና የምክር አገልግሎት"
                  : "Trinity Health Consultation & Support"}
              </span>
            </div>
            <div className="text-[11px] text-[#64806e]">
              <span className="font-semibold">
                {language === "am" ? "የድንገተኛ ስልክ፡" : "Emergency:"}
              </span>{" "}
              <span className="rounded bg-[#ffece2] px-1 py-0.5 font-bold text-[#a74619]">
                952
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#d8e6dc]">
            <a
              href="tel:+251988720194"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#1c573e] px-3 py-1 text-xs font-bold text-white hover:bg-[#154631] transition"
            >
              <PhoneCall size={11} />
              <span>+251 98 872 0194</span>
            </a>
            <Link
              href="/portal/consultations/new"
              className="inline-flex items-center gap-1 rounded-full border border-[#cbdcca] bg-white px-2.5 py-1 text-xs font-semibold text-[#1c573e] hover:bg-[#f3f8f3] transition"
            >
              <ShieldCheck size={12} />
              <span>
                {language === "am"
                  ? "ከጤና ባለሙያ ጋር ይነጋገሩ"
                  : "Care Consultation"}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Lesson Sources */}
      {sources && sources.length > 0 && (
        <div className="pt-2 border-t border-[#e6eee5] space-y-1.5">
          {sources.map((source) => (
            <Link
              key={source.id}
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
          ))}
        </div>
      )}
    </div>
  );
}
