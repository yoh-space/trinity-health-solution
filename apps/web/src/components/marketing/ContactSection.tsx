"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PhoneCall,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  Send,
  CheckCircle2,
  ExternalLink,
  Heart,
} from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function ContactSection() {
  const { language, t } = useMarketingLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [topic, setTopic] = useState("general");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    const subject = encodeURIComponent(`Trinity Health Contact: ${topic} - ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nContact: ${contact}\nTopic: ${topic}\n\nNote:\n${note}`);
    window.location.href = `mailto:support@trinityhealth.et?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const contactChannels = [
    {
      id: "hotline",
      icon: PhoneCall,
      titleEn: "Customer Support & Lactation Line",
      titleAm: "የደንበኞች ድጋፍ እና የጡት ማጥባት ስልክ መስመር",
      value: "+251 98 872 0194",
      actionTextEn: "Call Direct Now",
      actionTextAm: "አሁን ይደውሉ",
      actionHref: "tel:+251988720194",
      noteEn: "Mon – Sat, 8:00 AM – 7:00 PM (EAT) · Amharic & English",
      noteAm: "ከሰኞ – ቅዳሜ፣ ከጠዋቱ 2፡00 – ምሽቱ 1፡00 · በአማርኛ እና በእንግሊዝኛ",
      tint: "bg-[#eaf4ec] text-[#1c573e]",
      border: "border-[#d0e5d4]",
    },
    {
      id: "emergency",
      icon: ShieldAlert,
      titleEn: "National Health & Emergency Hotline",
      titleAm: "ብሔራዊ የጤና እና የድንገተኛ አደጋ ስልክ",
      value: "Dial 952",
      actionTextEn: "Call 952 (Toll-Free)",
      actionTextAm: "952 ይደውሉ (ነፃ)",
      actionHref: "tel:952",
      noteEn: "Official 24/7 Ethiopian Government Health Hotline",
      noteAm: "በኢትዮጵያ መንግስት የተዘጋጀ ነፃ የ24 ሰዓት የጤና መረጃ መስመር",
      tint: "bg-[#fef2eb] text-[#b45d34]",
      border: "border-[#f8decb]",
    },
    {
      id: "telegram",
      icon: MessageSquare,
      titleEn: "Telegram Mothers & Caregivers Community",
      titleAm: "የቴሌግራም የእናቶችና ተንከባካቢዎች ማህበረሰብ",
      value: "@Trinity_health_solution",
      actionTextEn: "Join Telegram Channel",
      actionTextAm: "ቴሌግራም ቻናሉን ይቀላቀሉ",
      actionHref: "https://t.me/Trinity_health_solution",
      noteEn: "Daily maternal tips, Q&As, & peer community support",
      noteAm: "ዕለታዊ የእናቶች ጤና ምክሮች፣ ጥያቄና መልሶች እና ልምድ ልውውጥ",
      tint: "bg-[#eaf2f8] text-[#246392]",
      border: "border-[#d2e4f2]",
    },
    {
      id: "consultation",
      icon: Heart,
      titleEn: "Online Care Consultation Portal",
      titleAm: "የኦንላይን የጤና ቡድን ምክክር ፖርታል",
      value: "Trinity Client Portal",
      actionTextEn: "Book Consultation",
      actionTextAm: "ቀጠሮ ይያዙ",
      actionHref: "/portal/consultations/new",
      noteEn: "Request personalized maternal & child health follow-up",
      noteAm: "የተመቻቸ የእናቶችና የህፃናት ጤና ክትትል ጥያቄ ያቅርቡ",
      tint: "bg-[#f4eef8] text-[#69397f]",
      border: "border-[#e5d4ec]",
    },
  ];

  return (
    <section id="contact" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd8c6] bg-[#f4f7f2] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1c573e]">
            <PhoneCall size={14} className="text-[#1c573e]" />
            <span>{t("Contact & Care Access", "አግኙን እና ድጋፍ")}</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl lg:text-5xl">
            {t(
              "We Are Here for Every Mother, Child, and Family",
              "ለእያንዳንዱ እናት፣ ህፃን እና ቤተሰብ ሁሌም ቅርብ ነን"
            )}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#596d60] sm:text-base sm:leading-7">
            {t(
              "Have questions about breastfeeding, child nutrition, or our digital health tools? Reach our support desk directly, join thousands in our Telegram community, or request a consultation.",
              "ስለ ጡት ማጥባት፣ ስለ ህፃናት አመጋገብ ወይም ስለ ጤና መተግበሪያዎቻችን ማንኛውም ጥያቄ ካለዎት በቀጥታ ይደውሉልን፣ የቴሌግራም ማህበረሰባችንን ይቀላቀሉ ወይም የባለሙያ ምክክር ይጠይቁ።"
            )}
          </p>
        </div>

        {/* 4 Contact Channels Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.id}
                className={`flex flex-col justify-between rounded-3xl border ${channel.border} bg-[#fafcf9] p-6 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-md`}
              >
                <div>
                  <div
                    className={`grid size-11 place-items-center rounded-2xl ${channel.tint}`}
                  >
                    <Icon size={20} strokeWidth={2} />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#163826]">
                    {language === "am" ? channel.titleAm : channel.titleEn}
                  </h3>

                  <p className="mt-2 text-sm font-extrabold text-[#1c573e]">
                    {channel.value}
                  </p>

                  <p className="mt-2 text-xs leading-relaxed text-[#627768]">
                    {language === "am" ? channel.noteAm : channel.noteEn}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#e8efe8]">
                  {channel.actionHref.startsWith("http") ? (
                    <a
                      href={channel.actionHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
                    >
                      <span>
                        {language === "am"
                          ? channel.actionTextAm
                          : channel.actionTextEn}
                      </span>
                      <ExternalLink size={12} />
                    </a>
                  ) : channel.actionHref.startsWith("tel:") ? (
                    <a
                      href={channel.actionHref}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
                    >
                      <span>
                        {language === "am"
                          ? channel.actionTextAm
                          : channel.actionTextEn}
                      </span>
                      <PhoneCall size={12} />
                    </a>
                  ) : (
                    <Link
                      href={channel.actionHref}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
                    >
                      <span>
                        {language === "am"
                          ? channel.actionTextAm
                          : channel.actionTextEn}
                      </span>
                      <ExternalLink size={12} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Office & Direct Message Card */}
        <div className="mt-12 grid gap-8 rounded-3xl border border-[#d8e4d8] bg-[#f7f9f6] p-7 sm:p-10 lg:grid-cols-2">
          {/* Location & Details */}
          <div className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                {t("Headquarters & Operation", "ዋና መሥሪያ ቤትና ማዕከል")}
              </span>
              <h3 className="mt-2 text-2xl font-bold text-[#163826]">
                {t(
                  "Trinity Health Solution — Addis Ababa, Ethiopia",
                  "ትሪኒቲ ሄልዝ ሶሉሽን — አዲስ አበባ፣ ኢትዮጵያ"
                )}
              </h3>
            </div>

            <p className="text-xs leading-relaxed text-[#596d60] sm:text-sm">
              {t(
                "Dedicated to expanding maternal, child, and public health education across Ethiopian communities. Serving families, care centers, and humanitarian teams nationwide.",
                "የእናቶች፣ ህፃናትና የህዝብ ጤና ትምህርትን ለመላው ኢትዮጵያውያን ተደራሽ የማድረግ ተልዕኮ። በመላ ሀገሪቱ ለሚገኙ እናቶች፣ ህፃናት እና የጤና ሰራተኞች አገልግሎት እንሰጣለን።"
              )}
            </p>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#465e4f]">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#1c573e] shrink-0" />
                <span>Addis Ababa, Ethiopia (አዲስ አበባ፣ ኢትዮጵያ)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#1c573e] shrink-0" />
                <a
                  href="mailto:support@trinityhealth.et"
                  className="hover:underline"
                >
                  support@trinityhealth.et
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-[#1c573e] shrink-0" />
                <span>Monday – Saturday: 8:00 AM – 7:00 PM (EAT)</span>
              </div>
            </div>
          </div>

          {/* Quick Message Box */}
          <div className="rounded-2xl border border-[#d6e2d6] bg-white p-6 shadow-xs">
            <h4 className="text-base font-bold text-[#163826] mb-3">
              {t("Send a Direct Inquiry", "ቀጥተኛ መልዕክት ይላኩልን")}
            </h4>

            {submitted ? (
              <div className="rounded-xl border border-[#cfe1d2] bg-[#f0f7f1] p-5 text-center space-y-2">
                <CheckCircle2 size={26} className="mx-auto text-[#1c573e]" />
                <p className="text-sm font-bold text-[#1c573e]">
                  {language === "am"
                    ? "መልዕክትዎ ተልኳል! በቅርቡ ምላሽ እንሰጣለን።"
                    : "Message client opened! Thank you."}
                </p>
                <p className="text-xs text-[#556e5c]">
                  {language === "am"
                    ? "ለአስቸኳይ ጉዳይ እባክዎ በስልክ መስመራችን +251 98 872 0194 ይደውሉ።"
                    : "For urgent inquiries, call our direct line +251 98 872 0194."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#475d4f] font-medium mb-1">
                    {language === "am" ? "ሙሉ ስም *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3 py-2 text-[#1c3a27] placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1c573e]"
                  />
                </div>

                <div>
                  <label className="block text-[#475d4f] font-medium mb-1">
                    {language === "am" ? "ስልክ ቁጥር ወይም ኢሜይል *" : "Phone or Email *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="+251... or email@domain.com"
                    className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3 py-2 text-[#1c3a27] placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1c573e]"
                  />
                </div>

                <div>
                  <label className="block text-[#475d4f] font-medium mb-1">
                    {language === "am" ? "የጥያቄው ርዕስ" : "Inquiry Topic"}
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3 py-2 text-[#1c3a27] focus:outline-hidden focus:ring-2 focus:ring-[#1c573e]"
                  >
                    <option value="lactation">
                      {language === "am" ? "የጡት ማጥባት ወይም የእናቶች ጤና ጥያቄ" : "Lactation or Maternal Care"}
                    </option>
                    <option value="nutrition">
                      {language === "am" ? "የህፃናት አመጋገብ ወይም የጓዳ አዘገጃጀት" : "Child Nutrition or Pantry Recipes"}
                    </option>
                    <option value="opal">
                      {language === "am" ? "ኦፓል (Ask Opal AI) አስተያየት" : "Ask Opal AI Support / Feedback"}
                    </option>
                    <option value="general">
                      {language === "am" ? "አጠቃላይ ጥያቄ" : "General Inquiry"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#475d4f] font-medium mb-1">
                    {language === "am" ? "መልዕክትዎ" : "Message / Question"}
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="How can we assist you?"
                    className="w-full rounded-xl border border-[#cbd8cb] bg-white px-3 py-2 text-[#1c3a27] placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1c573e]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1c573e] px-4 py-2.5 font-bold text-xs text-white shadow-xs transition hover:bg-[#14422f] active:scale-98"
                >
                  <span>{t("Send Message", "መልዕክት ላክ")}</span>
                  <Send size={13} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
