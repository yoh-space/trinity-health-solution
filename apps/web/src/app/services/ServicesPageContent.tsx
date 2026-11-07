"use client";

import Link from "next/link";
import {
  Heart,
  Baby,
  Sparkles,
  Stethoscope,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  ArrowRight,
  Droplets,
  Calendar,
  Clock,
  Video,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import {
  MarketingLanguageProvider,
  useMarketingLanguage,
} from "@/components/marketing/MarketingLanguageContext";
import { BackToTopButton } from "@/components/common/BackToTopButton";
import { FloatingOpalChat } from "@/components/chat/FloatingOpalChat";

function ServicesInner() {
  const { language, t } = useMarketingLanguage();

  const serviceCategories = [
    {
      id: "antenatal-care",
      badgeEn: "Clinical Pillar 1",
      badgeAm: "ክሊኒካል ምሰሶ 1",
      categoryEn: "Preconception & Antenatal Care (ANC)",
      categoryAm: "የቅድመ እርግዝና እና የቅድመ ወሊድ ክትትል (ANC)",
      taglineEn:
        "Comprehensive trimester-by-trimester monitoring and early risk screening aligned with the Ethiopian MoH 2022 ANC Guideline.",
      taglineAm:
        "በኢትዮጵያ ጤና ጥበቃ 2022 ANC መመሪያ መሰረት የተዘጋጀ የሦስትዮሽ ክትትል እና የቅድመ ስጋት ምርመራ።",
      icon: Stethoscope,
      accent: "bg-[#eef6f0] text-[#1c573e] border-[#d8e7dc]",
      deliverablesEn: [
        "Trimester milestones: blood pressure, gestational diabetes & pre-eclampsia screening",
        "Iron, folic acid, and calcium supplementation schedule guidance",
        "Individualized birth preparedness and emergency complication readiness (BPCR)",
        "Preconception screening for maternal nutrition, anemia, and underlying health factors",
      ],
      deliverablesAm: [
        "የእርግዝና ደረጃዎች ክትትል፡ የደም ግፊት፣ የስኳር እና የቅድመ-ኤክላምፕሲያ ምርመራ",
        "የአይረን፣ ፎሊክ አሲድ እና ካልሲየም ማሟያዎችን በትክክል የመውሰድ መመሪያ",
        "የወሊድ ዝግጅት እና ድንገተኛ ችግሮችን አስቀድሞ የማወቅ እቅድ (BPCR)",
        "የቅድመ እርግዝና የተመጣጠነ ምግብና የደም ማነስ ምርመራ",
      ],
      guidelineEn: "Ethiopian National Antenatal Care Guideline 2022 & Preconception Care 2024",
      guidelineAm: "የኢትዮጵያ ብሄራዊ የቅድመ ወሊድ (2022) እና የቅድመ እርግዝና (2024) መመሪያዎች",
      primaryCta: {
        labelEn: "Schedule ANC Consultation",
        labelAm: "የቅድመ ወሊድ ቀጠሮ ይያዙ",
        href: "/portal/consultations/new",
      },
    },
    {
      id: "lactation-infant-feeding",
      badgeEn: "Clinical Pillar 2",
      badgeAm: "ክሊኒካል ምሰሶ 2",
      categoryEn: "Lactation Specialty & Infant Feeding in Emergencies",
      categoryAm: "የጡት ማጥባት ባለሙያ እና የአስቸኳይ ጊዜ ህፃናት አመጋገብ",
      taglineEn:
        "Certified lactation support covering latching mechanics, low supply, safe relactation, and emergency infant feeding where water and privacy are limited.",
      taglineAm:
        "የጡት ማጥባት አያያዝ፣ የወተት እጥረት፣ እንዲሁም ንጹህ ውሃ በሌለበት አስቸኳይ ጊዜ ህፃናትን ደህንነቱ በተጠበቀ መንገድ የመመገብ ድጋፍ።",
      icon: Heart,
      accent: "bg-[#fcf4ec] text-[#b45d34] border-[#f0dfd0]",
      deliverablesEn: [
        "Immediate initiation within 1 hour of birth and exclusive breastfeeding for 6 months",
        "Overcoming latch pain, mastitis, nipple cracks, and milk transfer difficulties",
        "Emergency infant feeding (IYCF-E): Safe cup feeding, relactation, and non-formula protocols",
        "Complementary weaning starting at 6 months with culturally familiar Ethiopian foods",
      ],
      deliverablesAm: [
        "ህፃኑ በተወለደ በአንድ ሰዓት ውስጥ ማጥባት መጀመር እና እስከ 6 ወር ያለ ተጨማሪ ምግብ ማጥባት",
        "የጡት መቁሰል፣ ማበጥ እና ትክክለኛ የህፃን አያያዝ ቴክኒኮች",
        "በአስቸኳይ ጊዜ ደህንነቱ የተጠበቀ የህፃናት አመጋገብ (IYCF-E) እና በጽዋ የመመገብ ዘዴ",
        "ከ6 ወር ጀምሮ በሀገር ውስጥ ምግቦች የሚጀመር ተጨማሪ ምግብ (Weaning)",
      ],
      guidelineEn: "WHO & Ethiopian National Infant and Young Child Feeding (IYCF) Protocols",
      guidelineAm: "የዓለም ጤና ድርጅት እና የኢትዮጵያ ብሔራዊ የህፃናት አመጋገብ (IYCF) ፕሮቶኮል",
      primaryCta: {
        labelEn: "Book Lactation Session",
        labelAm: "የጡት ማጥባት ቀጠሮ ይያዙ",
        href: "/portal/consultations/new",
      },
    },
    {
      id: "wash-infection-prevention",
      badgeEn: "Clinical Pillar 3",
      badgeAm: "ክሊኒካል ምሰሶ 3",
      categoryEn: "Household WASH & Child Infection Defense",
      categoryAm: "የቤት ውስጥ ንጽህና (WASH) እና የህፃናት ኢንፌክሽን መከላከያ",
      taglineEn:
        "Protecting infants and mothers from waterborne diarrheal disease and environmental enteropathy through actionable, low-cost household water safety.",
      taglineAm:
        "ህፃናትን ከተቅማጥ እና ከውሃ ወለድ በሽታዎች ለመጠበቅ የሚረዱ ዝቅተኛ ወጪ ያላቸው አስተማማኝ የቤት ውስጥ የውሃ ማከሚያ ዘዴዎች።",
      icon: Droplets,
      accent: "bg-[#edf6f9] text-[#1c647b] border-[#d4e7ee]",
      deliverablesEn: [
        "Safe household water treatment: Chlorination (Water Guard), boiling, and solar disinfection",
        "Safe narrow-mouth storage practices to prevent recontamination in the home",
        "Newborn cord care, hand hygiene at critical moments, and clean feeding utensil prep",
        "Diarrhea dehydration oral rehydration therapy (ORT) & zinc supplementation protocols",
      ],
      deliverablesAm: [
        "የቤት ውስጥ ውሃን የማከም ዘዴዎች፡ ዋተር ጋርድ (ክሎሪን)፣ ማፍላት እና የጸሀይ ብርሃን ዘዴ",
        "ውሃ በድጋሚ እንዳይበከል በጠባብ አፍ ባላቸው ንጹህ እቃዎች የመያዝ ጥንቃቄ",
        "የእንብርት እንክብካቤ፣ በእጅ መታጠብ የሚደረግ የንጽህና ጥበቃ እና የምግብ እቃዎች ንጽህና",
        "ለተቅማጥ ህመም የሚሰጥ የአፍ ድርቀት መከላከያ (ORT) እና ዚንክ አሰጣጥ",
      ],
      guidelineEn: "UNICEF & MoH Household Water Quality and Child Survival Standards",
      guidelineAm: "የዩኒሴፍ እና የጤና ጥበቃ የቤት ውስጥ ውሃ ንጽህና እና የህፃናት ህልውና መስፈርቶች",
      primaryCta: {
        labelEn: "Consult Hygiene Guidance",
        labelAm: "የንጽህና መመሪያዎችን ይጠይቁ",
        href: "/ask-opal",
      },
    },
    {
      id: "postnatal-maternal-wellness",
      badgeEn: "Clinical Pillar 4",
      badgeAm: "ክሊኒካል ምሰሶ 4",
      categoryEn: "Postnatal Recovery & Maternal Mental Wellness",
      categoryAm: "የአራስ እናቶች ማገገሚያ እና አዕምሯዊ ደህንነት",
      taglineEn:
        "Targeted support during the critical fourth trimester: postpartum recovery, pelvic floor wellness, emotional health, and spacing consultations.",
      taglineAm:
        "ከወሊድ በኋላ ባሉት ወሳኝ ሳምንታት ውስጥ የሚሰጥ የአራስ እናት አካላዊ ማገገሚያ፣ ስነ-ልቦናዊ ድጋፍ እና የወሊድ መከላከያ ምክክር።",
      icon: Baby,
      accent: "bg-[#f5eff9] text-[#643c82] border-[#e4d8ee]",
      deliverablesEn: [
        "Routine 6-week postnatal checkup triage and maternal healing assessments",
        "Postpartum depression and anxiety screening with compassionate counseling",
        "Postpartum family planning (PPFP) and safe spacing guidance",
        "Nutrient replenishment guidance for mothers recovering from blood loss during delivery",
      ],
      deliverablesAm: [
        "የ6ኛ ሳምንት የአራስ እናት የጤና ምርመራ እና የፈውስ ክትትል",
        "የወሊድ ድህረ-ድብርት እና ጭንቀት ቅድመ-ምርመራ ከስነ-ልቦናዊ ድጋፍ ጋር",
        "ከወሊድ በኋላ የሚደረግ የቤተሰብ ምጣኔ (PPFP) እና የእርግዝና ማራራቂያ ዘዴዎች",
        "በወሊድ ጊዜ ደም ለፈሰሳቸው እናቶች የሚደረግ የተመጣጠነ ምግብ ማካካሻ",
      ],
      guidelineEn: "Ethiopian National Guideline for Family Planning Services & Postnatal Protocols",
      guidelineAm: "የኢትዮጵያ ብሄራዊ የቤተሰብ ምጣኔ እና የአራስ እናቶች ክትትል መመሪያ",
      primaryCta: {
        labelEn: "Book Postnatal Review",
        labelAm: "የአራስ ክትትል ቀጠሮ ይያዙ",
        href: "/portal/consultations/new",
      },
    },
  ];

  const deliveryModes = [
    {
      titleEn: "Virtual Telemedicine",
      titleAm: "የኦንላይን የቪዲዮ/ስልክ ምክክር",
      descEn:
        "Direct one-on-one video or audio consultations from home via Trinity Client Portal. Ideal for mothers with young infants.",
      descAm:
        "ከልጅዎ ጋር በቤትዎ ሆነው በቀጥታ በቪዲዮ ወይም በስልክ ከጤና ባለሙያ ጋር የሚደረግ የግል ምክክር።",
      icon: Video,
      badge: "Available Nationally & Diaspora",
    },
    {
      titleEn: "Partner Clinic Network",
      titleAm: "የአጋር ክሊኒኮች አውታረ መረብ",
      descEn:
        "In-person physical examination, ultrasound checkups, and lab screenings through verified partner health facilities.",
      descAm:
        "በአካል ወደ አጋር ጤና ጣቢያዎችና ክሊኒኮች በመሄድ የሚደረግ የአልትራሳውንድ፣ የላብራቶሪ እና የአካል ምርመራ።",
      icon: MapPin,
      badge: "Addis Ababa & Regions",
    },
    {
      titleEn: "Community Health Extension",
      titleAm: "የማህበረሰብ ጤና ኤክስቴንሽን",
      descEn:
        "Field-level visits and offline educational modules carried by trained Community Health Extension Workers (HEWs).",
      descAm:
        "በሰለጠኑ የጤና ኤክስቴንሽን ሰራተኞች የሚደረግ የቤት ለቤት ጉብኝት እና የትምህርት ድጋፍ።",
      icon: Stethoscope,
      badge: "Grassroots Outreach",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
      <MarketingHeader />

      <main className="overflow-x-clip">
        {/* Hero Section */}
        <section className="relative border-b border-[#183b2d]/10 bg-linear-to-b from-[#f2f7ef] to-[#fbfaf6] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbe1d3] bg-[#eef7f1] px-3.5 py-1 text-xs font-bold text-[#1c573e]">
                <ShieldCheck size={14} />
                {t(
                  "Certified Maternal & Infant Health Services",
                  "የተረጋገጡ የእናቶችና ህፃናት ጤና አገልግሎቶች"
                )}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#16382b] sm:text-5xl sm:leading-tight">
                {t(
                  "Compassionate, Evidence-Grounded Healthcare for Mothers and Babies",
                  "ለውድ እናቶችና ህፃናት የተሟላ፣ ሳይንሳዊ እና ተግባራዊ የጤና አገልግሎት"
                )}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#4a5f51] sm:text-lg">
                {t(
                  "From preconception through infant feeding and child survival, Trinity Health Solution bridges clinical expertise with accessible community support. Grounded in Ethiopian Ministry of Health and WHO guidelines.",
                  "ከቅድመ እርግዝና ጀምሮ እስከ ህፃናት አመጋገብ እና ህልውና ድረስ፣ ትሪኒቲ ሄልዝ ሳይንሳዊ የህክምና እውቀትን ከቀላል የማህበረሰብ አገልግሎት ጋር ያቀናጃል። በኢትዮጵያ ጤና ጥበቃና በዓለም ጤና ድርጅት መመሪያዎች ላይ የተመሰረተ።"
                )}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="/portal/consultations/new"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#154631] active:scale-95"
                >
                  <Calendar size={16} />
                  <span>{t("Book a Consultation", "የባለሙያ ቀጠሮ ይያዙ")}</span>
                </Link>
                <Link
                  href="/ask-opal"
                  className="inline-flex items-center gap-2 rounded-full border border-[#cbd8cb] bg-white px-5 py-3 text-sm font-bold text-[#1c573e] shadow-xs transition hover:bg-[#f6faf6] active:scale-95"
                >
                  <Sparkles size={16} className="text-[#1c573e]" />
                  <span>{t("Ask Opal AI Assistant", "ኦፓልን AI ይጠይቁ")}</span>
                </Link>
                <a
                  href="tel:+251988720194"
                  className="inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-3 text-xs font-semibold text-[#3b5444] transition hover:text-[#1c573e]"
                >
                  <PhoneCall size={14} />
                  <span>+251 98 872 0194</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Flagship Pillars Deep Dive */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                {t("Comprehensive Care Spectrum", "የተሟላ የህክምና እና የምክር ሽፋን")}
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-[#16382b] sm:text-4xl">
                {t("Our Clinical & Community Pillars", "ዋና ዋና የክሊኒክ እና የማህበረሰብ አገልግሎቶቻችን")}
              </h2>
              <p className="mt-3 text-sm text-[#506657]">
                {t(
                  "Each service is designed to address key maternal and infant health challenges faced by Ethiopian families.",
                  "እያንዳንዱ አገልግሎት የኢትዮጵያውያን እናቶችንና ህፃናትን ተጨባጭ የጤና ፍላጎቶች ለመመለስ ተዘጋጅቷል።"
                )}
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {serviceCategories.map((service) => {
                const IconComponent = service.icon;
                return (
                  <div
                    key={service.id}
                    className="flex flex-col justify-between rounded-3xl border border-[#183b2d]/10 bg-white p-7 shadow-xs transition hover:shadow-md sm:p-9"
                  >
                    <div>
                      {/* Header Badge */}
                      <div className="flex items-center justify-between gap-4">
                        <span className="rounded-full bg-[#f2f6ee] px-3 py-1 text-xs font-bold text-[#1c573e]">
                          {language === "am" ? service.badgeAm : service.badgeEn}
                        </span>
                        <div
                          className={`flex size-11 items-center justify-center rounded-2xl border ${service.accent}`}
                        >
                          <IconComponent size={22} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mt-5 text-xl font-bold text-[#17382b] sm:text-2xl">
                        {language === "am" ? service.categoryAm : service.categoryEn}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#516456]">
                        {language === "am" ? service.taglineAm : service.taglineEn}
                      </p>

                      {/* Scope Deliverables */}
                      <div className="mt-6 border-t border-[#183b2d]/[0.08] pt-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#344f3d]">
                          {t("What is Included / Scope of Care:", "አገልግሎቱ የሚያካትታቸው ዋና ዋና ነጥቦች፡")}
                        </h4>
                        <ul className="mt-3 space-y-2.5">
                          {(language === "am"
                            ? service.deliverablesAm
                            : service.deliverablesEn
                          ).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-[#43594b] leading-relaxed">
                              <CheckCircle2
                                size={15}
                                className="mt-0.5 shrink-0 text-[#1c573e]"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Reference Guideline */}
                      <div className="mt-6 rounded-xl bg-[#f7f9f4] p-3 text-xs text-[#526859]">
                        <span className="font-bold text-[#1c573e]">
                          {t("Clinical Standard: ", "የህክምና መስፈርት፡ ")}
                        </span>
                        <span>
                          {language === "am"
                            ? service.guidelineAm
                            : service.guidelineEn}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8 pt-4 border-t border-[#183b2d]/[0.06]">
                      <Link
                        href={service.primaryCta.href}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c573e] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#154631] active:scale-95"
                      >
                        <span>
                          {language === "am"
                            ? service.primaryCta.labelAm
                            : service.primaryCta.labelEn}
                        </span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Care Delivery Pathways */}
        <section className="border-t border-[#183b2d]/10 bg-[#f4f7ee] py-18 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-2xl text-center mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1c573e]">
                {t("Flexible Access", "ተደራሽ የአገልግሎት መስጫ መንገዶች")}
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-[#16382b] sm:text-3xl">
                {t("How Care is Delivered to You", "አገልግሎቱን እንዴት ማግኘት ይችላሉ?")}
              </h2>
              <p className="mt-2.5 text-xs text-[#506657] sm:text-sm">
                {t(
                  "Whether you are in Addis Ababa, in a regional town, or overseas supporting family, Trinity provides seamless touchpoints.",
                  "በአዲስ አበባ፣ በክልል ከተሞች ወይም በውጭ ሀገር ሆነው የቤተሰብዎን ጤና ለመከታተል፣ ትሪኒቲ ምቹ መንገዶችን ያቀርባል።"
                )}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {deliveryModes.map((mode, idx) => {
                const ModeIcon = mode.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-[#183b2d]/10 bg-white p-6 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[#eef6f0] text-[#1c573e]">
                          <ModeIcon size={20} />
                        </div>
                        <span className="rounded-full bg-[#e8eee5] px-2.5 py-0.5 text-[10px] font-bold text-[#2e4d3a]">
                          {mode.badge}
                        </span>
                      </div>
                      <h3 className="mt-4 text-base font-bold text-[#16382b]">
                        {language === "am" ? mode.titleAm : mode.titleEn}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#516456]">
                        {language === "am" ? mode.descAm : mode.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom Booking & Hotline CTA Banner */}
        <section className="bg-linear-to-r from-[#173a2b] via-[#1c573e] to-[#254f38] py-16 text-white">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <span className="inline-block rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#9deec2]">
              {t("Direct Clinical Support", "የቀጥታ የጤና ባለሙያ ድጋፍ")}
            </span>
            <h2 className="mt-4 text-2xl font-extrabold sm:text-4xl">
              {t(
                "Need Personalized Guidance for Yourself or Your Child?",
                "ለእርስዎ ወይም ለልጅዎ የጤና ባለሙያ ምክክር ይፈልጋሉ?"
              )}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-[#d4e8dd] leading-relaxed">
              {t(
                "Book an appointment directly in our secure client portal, or call our maternal support desk. For acute medical emergencies, call the national emergency line (952) immediately.",
                "በቀጥታ በፖርታላችን ቀጠሮ ይያዙ ወይም በስልክ መስመራችን ደውለው ያማክሩ። ለአስቸኳይ ድንገተኛ አደጋዎች ወዲያውኑ 952 ይደውሉ።"
              )}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/portal/consultations/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#f2e7c9] px-6 py-3 text-xs font-bold text-[#173b2c] shadow-sm transition hover:bg-[#ede0be] active:scale-95"
              >
                <Calendar size={15} />
                <span>{t("Book a Consultation Now", "አሁን ቀጠሮ ይያዙ")}</span>
              </Link>
              <a
                href="tel:+251988720194"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
              >
                <PhoneCall size={14} />
                <span>+251 98 872 0194</span>
              </a>
              <a
                href="tel:952"
                className="inline-flex items-center gap-2 rounded-full bg-[#d95938] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#c24a2c] active:scale-95"
              >
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-extrabold">952</span>
                <span>{t("National Emergency", "ብሔራዊ ድንገተኛ")}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
      <BackToTopButton />
      <FloatingOpalChat />
    </div>
  );
}

export function ServicesPageContent() {
  return (
    <MarketingLanguageProvider>
      <ServicesInner />
    </MarketingLanguageProvider>
  );
}
