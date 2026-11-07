"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  HeartHandshake,
  Stethoscope,
  Globe,
  ArrowRight,
  Mail,
  PhoneCall,
  CheckCircle2,
  Send,
} from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

export function PartnerSection() {
  const { language, t } = useMarketingLanguage();
  const [inquirySent, setInquirySent] = useState(false);
  const [partnerType, setPartnerType] = useState("clinic");
  const [contactName, setContactName] = useState("");
  const [organization, setOrganization] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !emailOrPhone) return;

    // Build mailto link for direct partner communication
    const subject = encodeURIComponent(
      `Partnership Inquiry (${partnerType}): ${organization || contactName}`
    );
    const body = encodeURIComponent(
      `Partner Type: ${partnerType}\nName: ${contactName}\nOrganization: ${organization}\nContact: ${emailOrPhone}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:partnerships@trinityhealth.et?subject=${subject}&body=${body}`;
    setInquirySent(true);
  };

  const partnerTracks = [
    {
      id: "clinics",
      icon: Stethoscope,
      titleEn: "Maternity Clinics & Health Centers",
      titleAm: "የእናቶች ክሊኒኮችና የጤና ጣቢያዎች",
      descriptionEn:
        "Empower your patients with verified post-discharge lactation and infant feeding guides. Reduce preventable complications through continuous education.",
      descriptionAm:
        "ከወሊድ በኋላ የሚሰጡ የጡት ማጥባትና የህፃናት አመጋገብ መመሪያዎችን ለተገልጋዮችዎ ያቅርቡ። ቀጣይነት ባለው ትምህርት ችግሮችን አስቀድመው ይከላከሉ።",
      benefitsEn: [
        "Curated post-delivery maternal guidance cards",
        "Streamlined patient triage & follow-up queues",
        "Decreased emergency re-admissions",
      ],
      benefitsAm: [
        "ለአራስ እናቶች የተዘጋጁ ደረጃቸውን የጠበቁ የማስተማሪያ ካርዶች",
        "የተገልጋዮች ክትትልና የምክክር ቅደም ተከተል ስርዓት",
        "ተደጋጋሚ የወሊድ ተያያዥ ድንገተኛ ችግሮችን መቀነስ",
      ],
    },
    {
      id: "ngos",
      icon: Building2,
      titleEn: "NGOs, UNICEF & Public Health Agencies",
      titleAm: "የልማት ድርጅቶችና የህዝብ ጤና ተቋማት",
      descriptionEn:
        "Scale maternal and infant feeding in emergency protocols across conflict or drought-affected regions with verified Amharic & English digital dissemination.",
      descriptionAm:
        "በአስቸጋሪ ሁኔታዎች ውስጥ ያሉ እናቶችና ህፃናት የተመጣጠነ ምግብ እንዲያገኙ በኢትዮጵያ ብሄራዊ መመሪያዎች የተረጋገጡ ዲጂታል ፕሮግራሞችን በስፋት ተደራሽ ያድርጉ።",
      benefitsEn: [
        "Offline-capable mobile app for field health workers",
        "Alignment with Ethiopian National Health Guidelines",
        "Transparent population reach and engagement insights",
      ],
      benefitsAm: [
        "ኢንተርኔት በሌለበት የሚሰራ የመስክ ሰራተኞች የአንድሮይድ መተግበሪያ",
        "ከኢትዮጵያ ጤና ጥበቃ መመሪያዎች ጋር የተጣጣመ ይዘት",
        "ግልጽ የማህበረሰብ ተደራሽነትና የተጠቃሚዎች መረጃ",
      ],
    },
    {
      id: "diaspora",
      icon: Globe,
      titleEn: "Diaspora Networks & Healthcare Innovators",
      titleAm: "የዲያስፖራ ማህበራት እና አጋሮች",
      descriptionEn:
        "Invest directly in maternal healthcare access. Sponsor community outreach in your home woreda and collaborate on localized medical AI advancement.",
      descriptionAm:
        "በሀገር ውስጥ የእናቶች ጤና ተደራሽነት ላይ በቀጥታ አሻራዎን ያሳርፉ። በተወለዱበት አካባቢ ለሚገኙ እናቶችና ህፃናት ነጻ የትምህርትና የምክር አገልግሎት ይደግፉ።",
      benefitsEn: [
        "Sponsor local language curriculum translation",
        "Support frontline community health worker kits",
        "Co-develop ethical, localized maternal AI tools",
      ],
      benefitsAm: [
        "የአካባቢ ቋንቋዎችን ትምህርታዊ ይዘት በጋራ ማዘጋጀት",
        "የማህበረሰብ ጤና ሰራተኞች የመስክ ስራዎችን መደገፍ",
        "የእናቶች ጤና ቴክኖሎጂንና የAI ጥናቶችን ማሳደግ",
      ],
    },
  ];

  return (
    <section id="partners" className="scroll-mt-20 bg-[#f4f7f2] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd8c6] bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1c573e] shadow-2xs">
            <HeartHandshake size={14} className="text-[#b45d34]" />
            <span>{t("Strategic Collaboration", "ስልታዊ አጋርነት")}</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl lg:text-5xl">
            {t(
              "Partner With Us to Transform Maternal Care Across Ethiopia",
              "በኢትዮጵያ የእናቶችና ህፃናት ጤናን በጋራ ለመለወጥ አጋራችን ይሁኑ"
            )}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#596d60] sm:text-base sm:leading-7">
            {t(
              "Like leading African maternal initiatives, Trinity Health Solution thrives on collaboration. We partner with healthcare centers, pharmacies, humanitarian agencies, and diaspora champions to expand lifesaving maternal health access.",
              "ትሪኒቲ ሄልዝ ሶሉሽን ከጤና ተቋማት፣ ፋርማሲዎች፣ ዓለም አቀፍ የልማት ድርጅቶች እና የዲያስፖራ ማህበራት ጋር በጋራ በመስራት የእናቶችና ህፃናትን የጤና አገልግሎት ተደራሽነት ያሰፋል።"
            )}
          </p>
        </div>

        {/* 3 Partner Tracks */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {partnerTracks.map((track) => {
            const Icon = track.icon;
            const benefits =
              language === "am" ? track.benefitsAm : track.benefitsEn;

            return (
              <div
                key={track.id}
                className="flex flex-col justify-between rounded-3xl border border-[#d8e3d6] bg-white p-7 shadow-xs transition duration-300 hover:-translate-y-1 hover:border-[#bfd2bd] hover:shadow-md sm:p-8"
              >
                <div>
                  <div className="grid size-12 place-items-center rounded-2xl bg-[#edf4ee] text-[#1c573e]">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-[#163826]">
                    {language === "am" ? track.titleAm : track.titleEn}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[#596d60] sm:text-sm">
                    {language === "am"
                      ? track.descriptionAm
                      : track.descriptionEn}
                  </p>

                  <div className="mt-6 border-t border-[#edf2ea] pt-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#798e7e] mb-3">
                      {language === "am" ? "የአጋርነት ጥቅሞች" : "Collaboration Impact"}
                    </p>
                    <ul className="space-y-2.5">
                      {benefits.map((b, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-[#2c4737]"
                        >
                          <CheckCircle2
                            size={14}
                            className="shrink-0 mt-0.5 text-[#1c573e]"
                          />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Partner Inquiry Card */}
        <div className="mt-14 overflow-hidden rounded-[2.5rem] border border-[#cedece] bg-gradient-to-br from-[#1c573e] to-[#123e2b] p-8 text-white shadow-xl sm:p-12 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left: Copy & Contact Methods */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#f4e6c3]">
                <HeartHandshake size={14} />
                <span>{t("Join Our Network", "አብረውን ይስሩ")}</span>
              </div>

              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl leading-tight">
                {t(
                  "Ready to explore an institutional partnership or pilot program?",
                  "የጋራ ስራ ለመጀመር ወይም በአካባቢዎ የሙከራ ፕሮጀክት ለማስጀመር ዝግጁ ነዎት?"
                )}
              </h3>

              <p className="text-xs leading-relaxed text-[#d4e5d8] sm:text-sm sm:leading-6">
                {t(
                  "We welcome formal partnerships with maternity clinics, humanitarian response teams, and health ministries. Contact our partnership desk directly or send us an inquiry.",
                  "ከሆስፒታሎች፣ ከእናቶች ጤና ማዕከላት እና ከተራድኦ ድርጅቶች ጋር ለሚደረግ ማንኛውም አይነት የጋራ ስራ በደስታ እንቀበላለን።"
                )}
              </p>

              <div className="flex flex-col gap-3 pt-2 text-xs sm:text-sm">
                <a
                  href="mailto:partnerships@trinityhealth.et"
                  className="inline-flex items-center gap-2.5 text-[#f4e6c3] hover:underline"
                >
                  <Mail size={16} />
                  <span>partnerships@trinityhealth.et</span>
                </a>
                <a
                  href="tel:+251988720194"
                  className="inline-flex items-center gap-2.5 text-[#f4e6c3] hover:underline"
                >
                  <PhoneCall size={16} />
                  <span>+251 98 872 0194 (Partnership Desk)</span>
                </a>
              </div>
            </div>

            {/* Right: Quick Inquiry Form */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-6 sm:p-8 backdrop-blur-md">
              <h4 className="text-base font-bold text-white mb-4">
                {t("Become a Partner — Fast Inquiry", "የአጋርነት ጥያቄ ማቅረቢያ")}
              </h4>

              {inquirySent ? (
                <div className="rounded-xl border border-white/30 bg-white/20 p-5 text-center space-y-2">
                  <CheckCircle2 size={28} className="mx-auto text-[#f4e6c3]" />
                  <p className="text-sm font-bold text-white">
                    {language === "am"
                      ? "የኢሜይል መላኪያ ተከፍቷል! እናመሰግናለን።"
                      : "Email client launched! Thank you."}
                  </p>
                  <p className="text-xs text-[#d2e4d6]">
                    {language === "am"
                      ? "መልዕክትዎ በቅርቡ በጤና አጋርነት ቡድናችን ይታያል።"
                      : "Our partnership desk will respond within 24–48 hours."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[#d0e4d4] font-medium mb-1">
                      {language === "am" ? "የአጋርነት አይነት" : "Partner Category"}
                    </label>
                    <select
                      value={partnerType}
                      onChange={(e) => setPartnerType(e.target.value)}
                      className="w-full rounded-xl border border-white/30 bg-white/20 px-3.5 py-2 text-white focus:outline-hidden focus:ring-2 focus:ring-[#f4e6c3]"
                    >
                      <option value="clinic" className="text-gray-900">
                        {language === "am" ? "የጤና ተቋም / ክሊኒክ" : "Health Clinic / Hospital"}
                      </option>
                      <option value="ngo" className="text-gray-900">
                        {language === "am" ? "የልማት ድርጅት / NGO" : "NGO / Humanitarian Agency"}
                      </option>
                      <option value="pharmacy" className="text-gray-900">
                        {language === "am" ? "ፋርማሲ / የጤና ምርት አከፋፋይ" : "Pharmacy / Health Distributor"}
                      </option>
                      <option value="diaspora" className="text-gray-900">
                        {language === "am" ? "የዲያስፖራ ድጋፍ / ኢንቨስተር" : "Diaspora Foundation / Donor"}
                      </option>
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-[#d0e4d4] font-medium mb-1">
                        {language === "am" ? "የእርስዎ ስም *" : "Contact Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Dr. Sara / Ato Abebe"
                        className="w-full rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-hidden focus:ring-2 focus:ring-[#f4e6c3]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#d0e4d4] font-medium mb-1">
                        {language === "am" ? "የተቋሙ ስም" : "Organization"}
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Care Center"
                        className="w-full rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-hidden focus:ring-2 focus:ring-[#f4e6c3]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#d0e4d4] font-medium mb-1">
                      {language === "am" ? "ኢሜይል ወይም ስልክ ቁጥር *" : "Email or Phone *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="email@organization.org or +251..."
                      className="w-full rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-hidden focus:ring-2 focus:ring-[#f4e6c3]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#d0e4d4] font-medium mb-1">
                      {language === "am" ? "አጭር መልዕክት" : "Brief Message / Focus Area"}
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your interest in partnering with Trinity..."
                      className="w-full rounded-xl border border-white/30 bg-white/20 px-3 py-2 text-white placeholder-white/50 focus:outline-hidden focus:ring-2 focus:ring-[#f4e6c3]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#f4e6c3] px-5 py-2.5 font-bold text-xs text-[#1c573e] shadow-md transition hover:bg-white active:scale-98"
                  >
                    <span>{t("Submit Partnership Inquiry", "የአጋርነት ጥያቄውን ላክ")}</span>
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
