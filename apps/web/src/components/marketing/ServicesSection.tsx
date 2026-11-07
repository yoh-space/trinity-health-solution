"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  ArrowRight,
  Heart,
  Baby,
  Sparkles,
  Stethoscope,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Droplets,
} from "lucide-react";
import { useMarketingLanguage } from "./MarketingLanguageContext";

function getServiceIcon(iconName?: string) {
  switch (iconName) {
    case "Heart":
      return Heart;
    case "Droplets":
      return Droplets;
    case "Baby":
      return Baby;
    case "Sparkles":
      return Sparkles;
    default:
      return Stethoscope;
  }
}

export function ServicesSection() {
  const { language, t } = useMarketingLanguage();
  const liveServices = useQuery(anyApi.services.listPublished);

  const staticServices = [
    {
      id: "lactation-support",
      badgeEn: "Maternal Health",
      badgeAm: "የእናቶች ጤና",
      titleEn: "Lactation & Postpartum Recovery Support",
      titleAm: "የጡት ማጥባት እና የአራስ እናቶች እንክብካቤ",
      descriptionEn:
        "Practical guidance for new and expecting mothers: mastering latching, sustaining milk supply, maternal hydration, and emergency infant feeding practices when water or privacy is limited.",
      descriptionAm:
        "ለአዲስ እናቶች የተዘጋጀ ተግባራዊ ድጋፍ፡ የጡት ማጥባት አያያዝ፣ የወተት መጠንን ማሳደግ፣ የእናቶች ፈሳሽና አመጋገብ፣ እንዲሁም በአስቸጋሪ ሁኔታዎች ውስጥ ደህንነቱ የተጠበቀ የጡት ማጥባት መመሪያ።",
      featuresEn: [
        "Breastfeeding in emergencies & limited-water settings",
        "Overcoming sore nipples, engorgement, & latching difficulties",
        "Maternal nutrition & fluid balance during lactation",
        "Clinical warning signs for postpartum care",
      ],
      featuresAm: [
        "በአስቸኳይ ጊዜ እና ውሃ በሌለበት አካባቢ ደህንነቱ የተጠበቀ ጡት ማጥባት",
        "የጡት መቁሰል፣ ማበጥ እና ትክክለኛ የህፃን አያያዝ ዘዴዎች",
        "የሚያጠቡ እናቶች የተመጣጠነ ምግብና ፈሳሽ አወሳሰድ",
        "አስቸኳይ ህክምና የሚያስፈልጋቸው የአራስ እናት ምልክቶች",
      ],
      ctaLabelEn: "Explore Maternal Guidance",
      ctaLabelAm: "የእናቶች መመሪያዎችን ያንብቡ",
      ctaHref: "/learn",
      icon: Heart,
      tint: "bg-[#eef6f0] text-[#1c573e]",
      border: "border-[#d8e7dc]",
    },
    {
      id: "infant-nutrition",
      badgeEn: "Child Nutrition",
      badgeAm: "የህፃናት አመጋገብ",
      titleEn: "Infant Feeding & Local Pantry Explorer",
      titleAm: "የህፃናት ተጨማሪ ምግብ እና የጓዳ አዘገጃጀት",
      descriptionEn:
        "Culturally rooted complementary feeding plans using affordable Ethiopian pantry staples (teff, barley, lentils, egg). Step-by-step guidance on age-appropriate textures and safe food preparation.",
      descriptionAm:
        "በቀላሉ በጓዳ በሚገኙ የሀገር ውስጥ ምግቦች (ጤፍ፣ ገብስ፣ ምስር፣ እንቁላል) የተዘጋጁ የህፃናት ተጨማሪ ምግቦች። እንደ እድሜያቸው የሚመጥን የምግብ ልስላሴ እና የንጽህና አጠባበቅ መመሪያ።",
      featuresEn: [
        "Complementary feeding milestones (6 to 24+ months)",
        "Recipe generator matching what's currently in your kitchen",
        "Micronutrient diversification & anemia prevention",
        "Clean drinking water household disinfection",
      ],
      featuresAm: [
        "ለእያንዳንዱ እድሜ (ከ6 እስከ 24+ ወራት) የሚመጥን ምግብ",
        "በቤትዎ ባሉ ጥሬ እቃዎች የሚዘጋጅ የምግብ አሰራር መምረጫ",
        "የደም ማነስንና የተመጣጠነ ምግብ እጥረትን መከላከያ",
        "በቤት ውስጥ የመጠጥ ውሃን አስተማማኝ የማድረጊያ ዘዴዎች",
      ],
      ctaLabelEn: "Explore Pantry Recipes",
      ctaLabelAm: "የምግብ አሰራሮችን ይመልከቱ",
      ctaHref: "/#pantry",
      icon: Baby,
      tint: "bg-[#f9f1e8] text-[#b45d34]",
      border: "border-[#eedece]",
    },
    {
      id: "opal-assistant",
      badgeEn: "24/7 AI Companion",
      badgeAm: "የ24/7 AI ረዳት",
      titleEn: "Ask Opal: Maternal & Child AI Guide",
      titleAm: "ኦፓል (Ask Opal)፡ የእናቶችና ህፃናት AI ረዳት",
      descriptionEn:
        "Grounded in Ethiopian National Antenatal Care, Preconception, and Infant Feeding in Emergencies Guidelines. Gives structured, warm, and evidence-backed answers in Amharic and English.",
      descriptionAm:
        "በኢትዮጵያ ብሄራዊ የቅድመ ወሊድ፣ የቅድመ እርግዝና እና የድንገተኛ ህፃናት አመጋገብ መመሪያዎች ላይ የተመሰረተ። በማንኛውም ሰዓት በአማርኛ እና በእንግሊዝኛ አስተማማኝ ትምህርታዊ ምላሾችን ይሰጣል።",
      featuresEn: [
        "Instant answers with bold titles, bullets, & practical steps",
        "Red-flag detection with emergency referral safety",
        "Personalized maternal & child profile context option",
        "Direct connection to care-team consultations",
      ],
      featuresAm: [
        "በአርዕስትና በነጥቦች የተደራጁ ግልጽ እና ተግባራዊ ምላሾች",
        "አስቸኳይ ምልክቶችን ለይቶ ወደ ህክምና ባለሙያ የማመልከት ጥበቃ",
        "የግል መረጃን በምስጢር የጠበቀ የእናቶችና ህፃናት መገለጫ",
        "ከጤና ባለሙያዎች የምክክር አገልግሎት ጋር የቀጥታ ትስስር",
      ],
      ctaLabelEn: "Ask Opal Now",
      ctaLabelAm: "ኦፓልን አሁን ይጠይቁ",
      ctaHref: "/ask-opal",
      icon: Sparkles,
      tint: "bg-[#edf3f8] text-[#2c5878]",
      border: "border-[#d8e4ef]",
    },
    {
      id: "care-consultations",
      badgeEn: "Clinical & Community",
      badgeAm: "የባለሙያ ድጋፍ",
      titleEn: "Care Consultations & Outreach Support",
      titleAm: "የጤና ባለሙያ የምክክር አገልግሎትና ክትትል",
      descriptionEn:
        "Direct access to Trinity's maternal care team and community health counselors. Submit consultation inquiries, schedule triage follow-ups, or reach our direct phone support line.",
      descriptionAm:
        "ከትሪኒቲ የእናቶች ጤና ቡድን እና ከማህበረሰብ ጤና አማካሪዎች ጋር የቀጥታ ግንኙነት። የምክክር ጥያቄዎችን ያስገቡ፣ የክትትል ቀጠሮ ይያዙ ወይም በስልክ መስመራችን በቀጥታ ይደውሉ።",
      featuresEn: [
        "Dedicated customer support line (+251 98 872 0194)",
        "Secure client consultation portal with privacy safeguards",
        "Community Health Worker outreach and mobile APK tool",
        "Ethiopian National Health Helpline (952) emergency integration",
      ],
      featuresAm: [
        "የቀጥታ የደንበኞች ድጋፍ የስልክ መስመር (+251 98 872 0194)",
        "የግል መረጃ ሚስጥርን የጠበቀ የደንበኞች ፖርታል እና የቀጠሮ ስርዓት",
        "የማህበረሰብ ጤና ሰራተኞች የመስክ መሳሪያ (Offline Android APK)",
        "የብሔራዊ ጤና ድንገተኛ የስልክ መስመር (952) ቅንጅት",
      ],
      ctaLabelEn: "Book Consultation",
      ctaLabelAm: "የባለሙያ ቀጠሮ ይያዙ",
      ctaHref: "/portal/consultations/new",
      icon: Stethoscope,
      tint: "bg-[#f2eff8] text-[#5e3d7e]",
      border: "border-[#e0d8ee]",
    },
  ];

  const displayServices =
    liveServices && liveServices.length > 0
      ? liveServices.slice(0, 4).map((s: any) => ({
          id: s.slug || s._id,
          badgeEn: s.badgeEn,
          badgeAm: s.badgeAm,
          titleEn: s.categoryEn,
          titleAm: s.categoryAm,
          descriptionEn: s.taglineEn,
          descriptionAm: s.taglineAm,
          featuresEn: s.deliverablesEn,
          featuresAm: s.deliverablesAm,
          ctaLabelEn: s.primaryCtaLabelEn,
          ctaLabelAm: s.primaryCtaLabelAm,
          ctaHref: s.primaryCtaHref,
          icon: getServiceIcon(s.icon),
          tint: s.accent?.split(" border-")[0] || "bg-[#eef6f0] text-[#1c573e]",
          border: s.accent?.includes("border-") ? "border-" + s.accent.split("border-")[1] : "border-[#d8e7dc]",
        }))
      : staticServices;

  return (
    <section id="services" className="scroll-mt-20 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd8c6] bg-[#f4f7f2] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1c573e]">
            <ShieldCheck size={14} className="text-[#1c573e]" />
            <span>{t("What We Provide", "አገልግሎቶቻችን")}</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#163826] sm:text-4xl lg:text-5xl">
            {t(
              "Comprehensive Maternal & Child Health Care Solutions",
              "የተሟላ የእናቶች እና የህፃናት ጤና እንክብካቤ መፍትሄዎች"
            )}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[#596d60] sm:text-base sm:leading-7">
            {t(
              "Inspired by holistic lactation and maternal platforms like Kuri, Trinity combines digital education, evidence-grounded AI guidance, local nutrition, and clinical consultations into one unified ecosystem for Ethiopian families.",
              "እንደ ኩሪ (Kuri) ካሉ ዘመናዊ የእናቶች ጤና መድረኮች ልምድ በመነሳት፤ ትሪኒቲ ዲጂታል የጤና ትምህርትን፣ የAI ረዳትን፣ የሀገር በቀል የተመጣጠነ ምግብ አዘገጃጀትን እና የባለሙያ ምክክርን በአንድ አጠቃሎ ለኢትዮጵያውያን ቤተሰቦች ያቀርባል።"
            )}
          </p>

          <div className="mt-5">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1c573e] hover:underline underline-offset-4"
            >
              <span>{t("Explore Detailed Clinical Services & Guidelines →", "ዝርዝር ክሊኒካል አገልግሎቶችንና መመሪያዎችን ይመልከቱ →")}</span>
            </Link>
          </div>
        </div>

        {/* 4 Core Services Grid */}
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {displayServices.map((service: any) => {
            const Icon = service.icon;
            const features =
              language === "am" ? service.featuresAm : service.featuresEn;

            return (
              <div
                key={service.id}
                className={`group flex flex-col justify-between rounded-3xl border ${service.border} bg-[#fafcf9] p-7 shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-9`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`grid size-12 place-items-center rounded-2xl ${service.tint}`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <span className="rounded-full border border-[#d6e2d8] bg-white px-3 py-1 text-[11px] font-bold text-[#355742]">
                      {language === "am" ? service.badgeAm : service.badgeEn}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-[#163826] sm:text-2xl">
                    {language === "am" ? service.titleAm : service.titleEn}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-[#53685a] sm:text-sm">
                    {language === "am"
                      ? service.descriptionAm
                      : service.descriptionEn}
                  </p>

                  {/* Bullet points */}
                  <div className="mt-6 border-t border-[#e6eee6] pt-5">
                    <ul className="space-y-2.5">
                      {features.map((feature: string, fIdx: number) => (
                        <li
                          key={fIdx}
                          className="flex items-start gap-2.5 text-xs text-[#2c4737] sm:text-sm"
                        >
                          <CheckCircle2
                            size={16}
                            className="shrink-0 mt-0.5 text-[#1c573e]"
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 border-t border-[#e6eee6] pt-5">
                  <Link
                    href={service.ctaHref}
                    className="inline-flex items-center gap-2 font-bold text-xs text-[#1c573e] hover:text-[#123e2b] transition group-hover:translate-x-1"
                  >
                    <span>
                      {language === "am"
                        ? service.ctaLabelAm
                        : service.ctaLabelEn}
                    </span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Hotline Banner */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#cfe0d2] bg-gradient-to-r from-[#edf5ee] via-[#f5faf5] to-[#edf5ee] p-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-[#1c573e] text-white">
              <PhoneCall size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#163826]">
                {t(
                  "Need Direct Care Support or Lactation Consultation?",
                  "የቀጥታ የጤና ወይም የጡት ማጥባት ምክር ይፈልጋሉ?"
                )}
              </h4>
              <p className="text-xs text-[#526a5a]">
                {t(
                  "Speak directly with Trinity's maternal health care coordinators.",
                  "ከትሪኒቲ የእናቶች ጤና አስተባባሪዎች ጋር በቀጥታ በስልክ ይነጋገሩ።"
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+251988720194"
              className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#14422f]"
            >
              <PhoneCall size={13} />
              <span>+251 98 872 0194</span>
            </a>
            <Link
              href="/portal/consultations/new"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd9cb] bg-white px-4 py-2 text-xs font-bold text-[#1c573e] transition hover:bg-[#f3f8f3]"
            >
              <span>{t("Book Online Consultation", "የኦንላይን ቀጠሮ ይያዙ")}</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
