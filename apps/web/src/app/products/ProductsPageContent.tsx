"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Baby,
  Droplets,
  BookOpen,
  ShoppingBag,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Building2,
  ArrowRight,
} from "lucide-react";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import {
  MarketingLanguageProvider,
  useMarketingLanguage,
} from "@/components/marketing/MarketingLanguageContext";
import { BackToTopButton } from "@/components/common/BackToTopButton";
import { FloatingOpalChat } from "@/components/chat/FloatingOpalChat";

interface Product {
  id: string;
  category: "lactation" | "weaning" | "wash" | "learning";
  badgeEn: string;
  badgeAm: string;
  titleEn: string;
  titleAm: string;
  subtitleEn: string;
  subtitleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  highlightsEn: string[];
  highlightsAm: string[];
  idealForEn: string;
  idealForAm: string;
  formatEn: string;
  formatAm: string;
}

const PRODUCTS: Product[] = [
  {
    id: "lactation-tea",
    category: "lactation",
    badgeEn: "Lactation Essential",
    badgeAm: "የጡት ወተት ማሳደጊያ",
    titleEn: "Trinity Mama Natural Lactation Tea",
    titleAm: "ትሪኒቲ ማማ የተፈጥሮ የጡት ወተት ሻይ",
    subtitleEn: "Herbal Galactagogue Blend",
    subtitleAm: "የተፈጥሮ እፅዋት ቅልቅል",
    descriptionEn:
      "A soothing blend of fenugreek (አብሽ), moringa, fennel seeds, and anise designed to naturally stimulate prolactin production and maintain healthy, consistent milk supply for nursing mothers.",
    descriptionAm:
      "የጡት ወተት መጠንን በተፈጥሮ መንገድ ለማሳደግ የሚረዳ ከአብሽ፣ ሞሪንጋ፣ ከሙን እና አኒስ ዘሮች የተቀመመ ተፈጥሯዊ የሻይ ቅልቅል ለአጥቢ እናቶች።",
    highlightsEn: [
      "100% natural, caffeine-free & sugar-free",
      "Stimulates healthy milk flow and hydration",
      "Soothes postpartum digestion and colic in infants",
      "Laboratory tested for maternal & infant safety",
    ],
    highlightsAm: [
      "100% ተፈጥሯዊ፣ ካፌይን እና ስኳር የሌለው",
      "የወተት ፍሰትን እና የእናትየዋን ፈሳሽ መጠን ያሳድጋል",
      "ከወሊድ በኋላ የምግብ መፈጨትን እና የሆድ መነፋትን ያስታግሳል",
      "ለእናቶችና ህፃናት ደህንነት የተመረመረ",
    ],
    idealForEn: "Nursing mothers seeking to boost or maintain breast milk volume.",
    idealForAm: "የጡት ወተት መጠናቸው እንዲጨምር ለሚፈልጉ አጥቢ እናቶች።",
    formatEn: "Pack of 30 biodegradable tea sachets",
    formatAm: "የ30 ቀን መጠጫ ከረጢቶች",
  },
  {
    id: "postpartum-nutri-porridge",
    category: "lactation",
    badgeEn: "Maternal Recovery",
    badgeAm: "የአራስ እናቶች ማገገሚያ",
    titleEn: "Postpartum Nutri-Recovery Blend",
    titleAm: "የአራስ እናቶች የተመጣጠነ ገንፎ ዱቄት",
    subtitleEn: "Iron-Rich Whole Grains & Seeds",
    subtitleAm: "በአይረን የበለጸገ የጥራጥሬ ቅልቅል",
    descriptionEn:
      "Nutrient-dense flour milled from roasted barley, red teff, flaxseed, pumpkin seed, and sesame. Formulated to replenish maternal iron stores, accelerate tissue repair, and provide sustained energy.",
    descriptionAm:
      "ከተቆላ ገብስ፣ ቀይ ጤፍ፣ የተልባ ፍሬ፣ የዱባ ፍሬ እና ሰሊጥ የተቀመመ የተመጣጠነ የገንፎ ዱቄት። በወሊድ የጠፋውን ደም ለመተካት እና ጉልበት ለመስጠት የተዘጋጀ።",
    highlightsEn: [
      "High natural iron & zinc content for anemia recovery",
      "Omega-3 fatty acids for maternal brain and hormonal health",
      "Easily digestible for sensitive postpartum digestion",
      "Quick 5-minute boiling preparation",
    ],
    highlightsAm: [
      "የደም ማነስን ለመከላከል ከፍተኛ የተፈጥሮ አይረን እና ዚንክ",
      "ለአዕምሮ እና ለሆርሞን ሚዛን የሚረዱ ኦሜጋ-3 ቅባቶች",
      "ከወሊድ በኋላ በቀላሉ የሚፈጭ እና ሆድ የማይከብድ",
      "በ5 ደቂቃ ውስጥ ተፈልቶ የሚደርስ",
    ],
    idealForEn: "Mothers in the first 6 months postpartum and recovering from delivery.",
    idealForAm: "ከወሊድ በኋላ ባሉት የመጀመሪያ 6 ወራት ውስጥ ላሉ አራስ እናቶች።",
    formatEn: "1 kg sealed protective pouch",
    formatAm: "1 ኪ.ግ የታሸገ ከረጢት",
  },
  {
    id: "first-bite-weaning-cereal",
    category: "weaning",
    badgeEn: "Infant Nutrition",
    badgeAm: "የህፃናት ተጨማሪ ምግብ",
    titleEn: "First-Bite Multigrain Weaning Blend",
    titleAm: "የመጀመሪያ ቅምሻ የህፃናት ሙልቲግራይን ዱቄት",
    subtitleEn: "Fortified Infant Porridge (6+ Months)",
    subtitleAm: "ከ6 ወር በላይ ላሉ ህፃናት ተጨማሪ ምግብ",
    descriptionEn:
      "A gentle, easily digestible complementary cereal crafted from pre-cooked roasted teff, chickpeas, and oats, enriched with essential vitamins to support healthy brain and physical growth from 6 months onwards.",
    descriptionAm:
      "ለስላሳ እና በቀላሉ የሚፈጭ ከተቆላ ጤፍ፣ ሽምብራ እና አጃ የተዘጋጀ ተጨማሪ ምግብ። ከ6 ወር በላይ ላሉ ህፃናት የአዕምሮ እና የአካል እድገትን ለማፋጠን ቫይታሚኖች የተጨመሩበት።",
    highlightsEn: [
      "Optimal texture transition from liquid to semi-solid",
      "Zero added salt, refined sugar, or artificial preservatives",
      "Micro-milled to prevent infant choking hazards",
      "Meets WHO complementary feeding calorie density guidelines",
    ],
    highlightsAm: [
      "ከፈሳሽ ወደ ወፍራም ምግብ ለመሸጋገር ተስማሚ የሆነ ልስላሴ",
      "ምንም አይነት ጨው፣ ስኳር ወይም ኬሚካል ያልተጨመረበት",
      "ህፃናት እንዳይታነቁ በደቃቁ የተፈጨ",
      "የዓለም ጤና ድርጅት የህፃናት ተጨማሪ ምግብ መስፈርትን ያሟላ",
    ],
    idealForEn: "Infants aged 6 to 24 months transitioning into complementary feeding.",
    idealForAm: "ከ6 ወር እስከ 24 ወር የእድሜ ክልል ውስጥ ላሉ ህፃናት።",
    formatEn: "500g resealable freshness pack",
    formatAm: "500 ግራም እንደገና የሚታሸግ ከረጢት",
  },
  {
    id: "feeding-measuring-set",
    category: "weaning",
    badgeEn: "Care Tool",
    badgeAm: "የእንክብካቤ እቃ",
    titleEn: "Calibrated Safe Feeding Bowl & Spoon Set",
    titleAm: "የተስተካከለ ልኬት ያለው የህፃናት ሳህንና ማንኪያ",
    subtitleEn: "BPA-Free Infant Feeding Hardware",
    subtitleAm: "ከኬሚካል ነፃ የሆነ የህፃናት መመገቢያ",
    descriptionEn:
      "A pediatric-designed silicone bowl with clear volumetric portion markers (50ml, 100ml, 150ml) and a heat-sensitive soft spoon that turns white if the food is too hot for infant consumption.",
    descriptionAm:
      "የምግብ መጠንን በትክክል ለመለካት የሚያስችሉ ምልክቶች (50ml, 100ml, 150ml) ያሉት የህፃናት ሳህን እና ምግቡ ሲግል ቀለሙን የሚቀይር ለስላሳ ማንኪያ።",
    highlightsEn: [
      "100% Food-Grade silicone, free from BPA, phthalates & lead",
      "Heat-sensor spoon prevents mouth burns",
      "Suction base prevents accidental spills and table tipping",
      "Dishwasher and boiling-water sterilizer safe",
    ],
    highlightsAm: [
      "100% ለምግብ የተረጋገጠ ሲሊኮን፣ ከቢፒኤ እና መርዛማ ኬሚካሎች የጸዳ",
      "የምግብ ሙቀትን የሚያሳይ ማንኪያ የህፃናትን አፍ እንዳይቃጠል ይጠብቃል",
      "ከጠረጴዛ ጋር የሚጣበቅ መሰረት ምግቡ እንዳይደፋ ይከላከላል",
      "በፈላ ውሃ በቀላሉ የሚጸዳ",
    ],
    idealForEn: "Families starting solid food exploration with peace of mind.",
    idealForAm: "ልጃቸውን ተጨማሪ ምግብ መመገብ ለሚጀምሩ ቤተሰቦች።",
    formatEn: "1 Suction Bowl + 1 Heat-Sensor Soft Spoon",
    formatAm: "1 ሳህን + 1 የሙቀት ዳሳሽ ማንኪያ",
  },
  {
    id: "safedrop-water-kit",
    category: "wash",
    badgeEn: "Safe Water / WASH",
    badgeAm: "አስተማማኝ የመጠጥ ውሃ",
    titleEn: "SafeDrop Household Water Purification Kit",
    titleAm: "ሴፍድሮፕ የቤት ውስጥ ውሃ ማጣሪያ ኪት",
    subtitleEn: "Chlorine Treatment & Rapid Safety Strips",
    subtitleAm: "የውሃ ማከሚያ ኪኒኖች እና መመርመሪያ",
    descriptionEn:
      "A compact household kit containing 60 rapid-dissolving water purification tablets (treating up to 1,200 liters of water) plus test strips to protect infants from waterborne cholera, typhoid, and diarrheal illness.",
    descriptionAm:
      "እስከ 1,200 ሊትር ውሃ ማከም የሚችሉ 60 ኪኒኖችን እና የውሃ ንጽህና መመርመሪያዎችን የያዘ ኪት። ህፃናትን ከተቅማጥ እና ውሃ ወለድ ተላላፊ በሽታዎች ለመጠበቅ።",
    highlightsEn: [
      "Destroys 99.99% of bacteria, viruses, and waterborne cysts",
      "Each tablet purifies a standard 20-liter jerrican in 30 minutes",
      "No electricity or boiling fuel required",
      "Essential for emergency displacement or seasonal water shortages",
    ],
    highlightsAm: [
      "99.99% ባክቴሪያዎችን እና ቫይረሶችን ያጠፋል",
      "አንድ ኪኒን 20 ሊትር ጀሪካን ውሃ በ30 ደቂቃ ውስጥ ያጠራል",
      "ማገዶ ወይም ኤሌክትሪክ አያስፈልገውም",
      "ውሃ በሚቋረጥበት ወይም ድንገተኛ አደጋ ባለበት ወቅት አስፈላጊ",
    ],
    idealForEn: "Households relying on untreated water sources or emergency supplies.",
    idealForAm: "ንጹህ የቧንቧ ውሃ ለማያገኙ ወይም ለድንገተኛ ጊዜ ቤተሰቦች።",
    formatEn: "60 Tablets (Treats 1,200 Liters) + 10 Test Strips",
    formatAm: "60 ኪኒኖች (1,200 ሊትር ያጠራል) + 10 መመርመሪያዎች",
  },
  {
    id: "visual-nutrition-cards",
    category: "learning",
    badgeEn: "Educational Toolkit",
    badgeAm: "የትምህርት መገልገያ",
    titleEn: "Visual Infant Nutrition Flipcard Deck",
    titleAm: "የህፃናት አመጋገብ ምስላዊ መመሪያ ካርዶች",
    subtitleEn: "Amharic & English Illustrated Guides",
    subtitleAm: "በአማርኛ እና በእንግሊዝኛ የተዘጋጀ ምስላዊ መመሪያ",
    descriptionEn:
      "A durable, spill-resistant flip deck with vibrant illustrations guiding caregivers through feeding frequencies, proper food consistency, and locally available four-star food groups without requiring literacy.",
    descriptionAm:
      "ውሃ የማይበላሸው በምስሎች የተደገፈ የመመሪያ ካርድ። በእያንዳንዱ እድሜ የሚሰጡ የምግብ አይነቶችን፣ ልስላሴንና የ4ቱን የምግብ ምድቦች በቀላሉ በምስል ያሳያል።",
    highlightsEn: [
      "Waterproof laminated pages for messy kitchen use",
      "Bilingual Amharic and English with easy pictorial guides",
      "Covers 6–8 months, 9–11 months, and 12–23 months feeding stages",
      "Ideal for mothers, fathers, grandparents, and caregivers",
    ],
    highlightsAm: [
      "ውሃ የማይበላሸው እና በወጥ ቤት ውስጥ የማይቆሽሽ",
      "በአማርኛ እና በእንግሊዝኛ በምስል የተብራራ",
      "ከ6-8፣ ከ9-11 እና ከ12-23 ወራት ያሉትን ደረጃዎች ያካትታል",
      "ለእናቶች፣ ለአባቶች፣ ለአያቶች እና ለተንከባካቢዎች ተስማሚ",
    ],
    idealForEn: "Caregivers and community workers seeking intuitive feeding guides.",
    idealForAm: "ቀላል እና ግልጽ የህፃናት አመጋገብ መመሪያ ለሚፈልጉ ወላጆች።",
    formatEn: "24 Laminated Double-Sided Cards on Binder Ring",
    formatAm: "24 ባለሁለት ገጽ ምስላዊ ካርዶች",
  },
];

function ProductsInner() {
  const { language, t } = useMarketingLanguage();
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "lactation" | "weaning" | "wash" | "learning"
  >("all");

  const filteredProducts =
    selectedCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#183b2d]">
      <MarketingHeader />

      <main className="overflow-x-clip">
        {/* Hero Section */}
        <section className="relative border-b border-[#183b2d]/10 bg-linear-to-b from-[#f2f7ef] to-[#fbfaf6] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#cbe1d3] bg-[#eef7f1] px-3.5 py-1 text-xs font-bold text-[#1c573e]">
                <Sparkles size={14} />
                {t(
                  "Curated Maternal & Child Health Solutions",
                  "የተመረጡ የእናቶችና ህፃናት ጤና እና የተመጣጠነ ምግብ ምርቶች"
                )}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#16382b] sm:text-5xl sm:leading-tight">
                {t(
                  "Wholesome Essentials for Motherhood and Early Childhood",
                  "ለእናትነት እና ለህፃናት ጤናማ እድገት የተዘጋጁ ተፈጥሯዊ ምርቶች"
                )}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#4a5f51] sm:text-lg">
                {t(
                  "Designed by maternal health experts for Ethiopian families. From certified herbal lactation support to complementary infant feeding packs, safe water defense, and educational toolkits.",
                  "በእናቶች ጤና ባለሙያዎች ለኢትዮጵያውያን ቤተሰቦች የተዘጋጀ። የተፈጥሮ የጡት ወተት ማሳደጊያዎችን፣ የህፃናት ተጨማሪ ምግቦችን፣ የንጹህ ውሃ ማጣሪያዎችን እና የትምህርት መገልገያዎችን በአንድ ላይ ያግኙ።"
                )}
              </p>

              {/* Order channels strip */}
              <div className="mt-8 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <a
                  href="https://t.me/Trinity_health_solution"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-5 py-2.5 font-bold text-white shadow-xs transition hover:bg-[#154631] active:scale-95"
                >
                  <MessageSquare size={15} />
                  <span>{t("Order via Telegram Desk", "በቴሌግራም ይዘዙ")}</span>
                </a>
                <a
                  href="tel:+251988720194"
                  className="inline-flex items-center gap-2 rounded-full border border-[#cbd8cb] bg-white px-4 py-2.5 font-bold text-[#1c573e] shadow-xs transition hover:bg-[#f6faf6] active:scale-95"
                >
                  <PhoneCall size={14} />
                  <span>+251 98 872 0194</span>
                </a>
                <span className="text-xs text-[#627768]">
                  {t(
                    "Home Delivery in Addis Ababa • Regional Courier Available",
                    "በአዲስ አበባ የቤት ለቤት አቅርቦት • በክልሎች በፖስታ ይደርሳል"
                  )}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="sticky top-[64px] z-30 border-b border-[#183b2d]/10 bg-[#fbfaf6]/95 backdrop-blur-md py-4">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold no-scrollbar">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`shrink-0 rounded-full px-4 py-2 transition ${
                  selectedCategory === "all"
                    ? "bg-[#1c573e] text-white shadow-xs"
                    : "bg-white text-[#455c4d] hover:bg-[#eaf1e6] border border-[#d2ddd1]"
                }`}
              >
                {t("All Products (6)", "ሁሉም ምርቶች (6)")}
              </button>
              <button
                onClick={() => setSelectedCategory("lactation")}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 transition ${
                  selectedCategory === "lactation"
                    ? "bg-[#1c573e] text-white shadow-xs"
                    : "bg-white text-[#455c4d] hover:bg-[#eaf1e6] border border-[#d2ddd1]"
                }`}
              >
                <Heart size={13} />
                <span>{t("Lactation & Recovery", "የጡት ማጥባትና አራስ")}</span>
              </button>
              <button
                onClick={() => setSelectedCategory("weaning")}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 transition ${
                  selectedCategory === "weaning"
                    ? "bg-[#1c573e] text-white shadow-xs"
                    : "bg-white text-[#455c4d] hover:bg-[#eaf1e6] border border-[#d2ddd1]"
                }`}
              >
                <Baby size={13} />
                <span>{t("Infant Complementary Feeding", "የህፃናት ተጨማሪ ምግብ")}</span>
              </button>
              <button
                onClick={() => setSelectedCategory("wash")}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 transition ${
                  selectedCategory === "wash"
                    ? "bg-[#1c573e] text-white shadow-xs"
                    : "bg-white text-[#455c4d] hover:bg-[#eaf1e6] border border-[#d2ddd1]"
                }`}
              >
                <Droplets size={13} />
                <span>{t("Clean Water & WASH", "ንጹህ ውሃና ንጽህና")}</span>
              </button>
              <button
                onClick={() => setSelectedCategory("learning")}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 transition ${
                  selectedCategory === "learning"
                    ? "bg-[#1c573e] text-white shadow-xs"
                    : "bg-white text-[#455c4d] hover:bg-[#eaf1e6] border border-[#d2ddd1]"
                }`}
              >
                <BookOpen size={13} />
                <span>{t("Learning Toolkits", "የትምህርት መገልገያዎች")}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between rounded-3xl border border-[#183b2d]/10 bg-white p-7 shadow-xs transition hover:shadow-md"
                >
                  <div>
                    {/* Badge & Format */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-[#eef6f0] px-3 py-1 text-[11px] font-bold text-[#1c573e]">
                        {language === "am" ? product.badgeAm : product.badgeEn}
                      </span>
                      <span className="text-[11px] font-medium text-[#728577]">
                        {language === "am" ? product.formatAm : product.formatEn}
                      </span>
                    </div>

                    {/* Titles */}
                    <h3 className="mt-4 text-xl font-bold text-[#16382b]">
                      {language === "am" ? product.titleAm : product.titleEn}
                    </h3>
                    <p className="text-xs font-semibold text-[#86593a]">
                      {language === "am" ? product.subtitleAm : product.subtitleEn}
                    </p>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-[#516456]">
                      {language === "am"
                        ? product.descriptionAm
                        : product.descriptionEn}
                    </p>

                    {/* Feature Highlights */}
                    <div className="mt-5 border-t border-[#183b2d]/[0.08] pt-4">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#35513f]">
                        {t("Key Benefits:", "ዋና ዋና ጥቅሞች፡")}
                      </h4>
                      <ul className="mt-2.5 space-y-1.5 text-xs text-[#435a4c]">
                        {(language === "am"
                          ? product.highlightsAm
                          : product.highlightsEn
                        ).map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2
                              size={14}
                              className="mt-0.5 shrink-0 text-[#1c573e]"
                            />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ideal For */}
                    <div className="mt-4 rounded-xl bg-[#f8faf5] p-3 text-xs text-[#526658]">
                      <span className="font-bold text-[#1c573e]">
                        {t("Ideal For: ", "የሚመከረው ለ፡ ")}
                      </span>
                      <span>
                        {language === "am"
                          ? product.idealForAm
                          : product.idealForEn}
                      </span>
                    </div>
                  </div>

                  {/* Order Call to Action */}
                  <div className="mt-7 flex flex-col gap-2 border-t border-[#183b2d]/[0.06] pt-4">
                    <a
                      href="https://t.me/Trinity_health_solution"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c573e] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#154631] active:scale-95"
                    >
                      <ShoppingBag size={14} />
                      <span>{t("Inquire / Order via Telegram", "በቴሌግራም ያዙ")}</span>
                    </a>
                    <a
                      href="tel:+251988720194"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#cbd5c9] bg-white px-4 py-2 text-xs font-bold text-[#274f3b] transition hover:bg-[#f6f9f5]"
                    >
                      <PhoneCall size={13} />
                      <span>{t("Call Support Desk", "በስልክ ደውለው ያዙ")}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diaspora Care Gifting & Institutional Programs */}
        <section className="border-t border-[#183b2d]/10 bg-[#f4f7ee] py-18 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Diaspora Care Track */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#183b2d]/10 bg-white p-8 shadow-xs">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#fdf3e7] text-[#b45d34]">
                    <Gift size={24} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#16382b] sm:text-2xl">
                    {t(
                      "For Ethiopian Diaspora: Send Maternal Care Packages Home",
                      "በውጭ ሀገር ለሚኖሩ፡ ለቤተሰብዎ የእናቶችና ህፃናት እንክብካቤ ፓኬጅ ይላኩ"
                    )}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#516456]">
                    {t(
                      "Living abroad and want to support an expecting sister, daughter, or relative in Ethiopia? Sponsor a full 3-month postpartum recovery and infant nutrition care kit delivered directly to their doorstep in Addis Ababa or regional towns.",
                      "በውጭ ሀገር ሆነው በኢትዮጵያ ላሉ ወላጅ እህት፣ ልጅ ወይም ቤተሰብ የተመጣጠነ ምግብና እንክብካቤ ማድረስ ይፈልጋሉ? የተሟላ የ3 ወር የአራስ እና የህፃናት እንክብካቤ ፓኬጅ በስማቸው በቤት ለቤት አድራሻ እናደርሳለን።"
                    )}
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-[#43594b]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#1c573e]" />
                      <span>{t("Secure online diaspora payment options", "በኦንላይን የዲያስፖራ ክፍያ")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#1c573e]" />
                      <span>{t("Direct door-to-door delivery with personalized greeting note", "ከግል መልእክት ጋር በቤት ለቤት የሚደርስ")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#1c573e]" />
                      <span>{t("Includes access to Trinity Care Telemedicine consultations", "የትሪኒቲ የባለሙያ ምክክርን ያካተተ")}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-[#183b2d]/[0.06]">
                  <a
                    href="https://t.me/Trinity_health_solution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1c573e] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#154631]"
                  >
                    <span>{t("Inquire for Diaspora Gifting", "የዲያስፖራ እንክብካቤ ፓኬጅ ያዙ")}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Institutional & NGO Procurement Track */}
              <div className="flex flex-col justify-between rounded-3xl border border-[#183b2d]/10 bg-white p-8 shadow-xs">
                <div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eef6f0] text-[#1c573e]">
                    <Building2 size={24} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#16382b] sm:text-2xl">
                    {t(
                      "Institutional & Humanitarian Distribution",
                      "ለተቋማት፣ ለጤና ጣቢያዎች እና ለረድኤት ድርጅቶች በጅምላ ማቅረብ"
                    )}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#516456]">
                    {t(
                      "We partner with health centers, regional health bureaus, NGOs, and humanitarian agencies to supply certified safe water kits, visual nutrition flipcharts, and infant complementary porridge mixes at subsidized institutional volumes.",
                      "ከጤና ጣቢያዎች፣ ከክልል ጤና ቢሮዎች እና ከረድኤት ድርጅቶች ጋር በመተባበር የውሃ ማጣሪያ ኪቶችን፣ ምስላዊ የትምህርት ካርዶችን እና የህፃናት ምግቦችን በጅምላ እናቀርባለን።"
                    )}
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-[#43594b]">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#1c573e]" />
                      <span>{t("Verified MoH & WHO guideline formulation compliance", "የጤና ጥበቃና የዓለም ጤና ድርጅት መስፈርቶችን ያሟላ")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#1c573e]" />
                      <span>{t("Customized labeling in Amharic, Afan Oromo, Tigrigna, Somali", "በተለያዩ የሀገር ውስጥ ቋንቋዎች የተዘጋጀ")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#1c573e]" />
                      <span>{t("Rapid emergency dispatch for displaced populations", "ለተፈናቀሉ ወገኖች በፍጥነት የሚደርስ ድጋፍ")}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-[#183b2d]/[0.06]">
                  <Link
                    href="/#partners"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#1c573e] px-5 py-3 text-xs font-bold text-[#1c573e] transition hover:bg-[#eef6f0]"
                  >
                    <span>{t("Partner & Institutional Inquiries", "የተቋማት አጋርነት ይጠይቁ")}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Help Strip */}
        <section className="bg-linear-to-r from-[#173a2b] via-[#1c573e] to-[#254f38] py-14 text-white">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <h2 className="text-xl font-extrabold sm:text-3xl">
              {t(
                "Need Help Selecting the Right Essentials?",
                "የትኛው ምርት ለልጅዎ ወይም ለቤተሰብዎ እንደሚስማማ እርዳታ ይፈልጋሉ?"
              )}
            </h2>
            <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm text-[#d4e8dd]">
              {t(
                "Ask Opal AI for immediate guidance or call our maternal support team directly at +251 98 872 0194.",
                "ኦፓል AIን በመጠየቅ ፈጣን መመሪያ ያግኙ ወይም በስልክ ቁጥር +251 98 872 0194 ደውለው ያማክሩን።"
              )}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/ask-opal"
                className="inline-flex items-center gap-2 rounded-full bg-[#f2e7c9] px-6 py-2.5 text-xs font-bold text-[#173b2c] shadow-xs hover:bg-[#ede0be]"
              >
                <Sparkles size={14} />
                <span>{t("Ask Opal AI Assistant", "ኦፓልን AI ይጠይቁ")}</span>
              </Link>
              <a
                href="tel:+251988720194"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20"
              >
                <PhoneCall size={13} />
                <span>+251 98 872 0194</span>
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

export function ProductsPageContent() {
  return (
    <MarketingLanguageProvider>
      <ProductsInner />
    </MarketingLanguageProvider>
  );
}
