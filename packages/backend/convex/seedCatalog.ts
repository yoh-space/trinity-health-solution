import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const defaultServices = [
  {
    slug: "antenatal-care",
    order: 1,
    badgeEn: "Clinical Pillar 1",
    badgeAm: "ክሊኒካል ምሰሶ 1",
    categoryEn: "Preconception & Antenatal Care (ANC)",
    categoryAm: "የቅድመ እርግዝና እና የቅድመ ወሊድ ክትትል (ANC)",
    taglineEn:
      "Comprehensive trimester-by-trimester monitoring and early risk screening aligned with the Ethiopian MoH 2022 ANC Guideline.",
    taglineAm:
      "በኢትዮጵያ ጤና ጥበቃ 2022 ANC መመሪያ መሰረት የተዘጋጀ የሦስትዮሽ ክትትል እና የቅድመ ስጋት ምርመራ።",
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
    icon: "Stethoscope",
    accent: "bg-[#eef6f0] text-[#1c573e] border-[#d8e7dc]",
    primaryCtaLabelEn: "Schedule ANC Consultation",
    primaryCtaLabelAm: "የቅድመ ወሊድ ቀጠሮ ይያዙ",
    primaryCtaHref: "/portal/consultations/new",
  },
  {
    slug: "lactation-infant-feeding",
    order: 2,
    badgeEn: "Clinical Pillar 2",
    badgeAm: "ክሊኒካል ምሰሶ 2",
    categoryEn: "Lactation Specialty & Infant Feeding in Emergencies",
    categoryAm: "የጡት ማጥባት ባለሙያ እና የአስቸኳይ ጊዜ ህፃናት አመጋገብ",
    taglineEn:
      "Certified lactation support covering latching mechanics, low supply, safe relactation, and emergency infant feeding where water and privacy are limited.",
    taglineAm:
      "የጡት ማጥባት አያያዝ፣ የወተት እጥረት፣ እንዲሁም ንጹህ ውሃ በሌለበት አስቸኳይ ጊዜ ህፃናትን ደህንነቱ በተጠበቀ መንገድ የመመገብ ድጋፍ።",
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
    icon: "Heart",
    accent: "bg-[#fcf4ec] text-[#b45d34] border-[#f0dfd0]",
    primaryCtaLabelEn: "Book Lactation Session",
    primaryCtaLabelAm: "የጡት ማጥባት ቀጠሮ ይያዙ",
    primaryCtaHref: "/portal/consultations/new",
  },
  {
    slug: "wash-infection-prevention",
    order: 3,
    badgeEn: "Clinical Pillar 3",
    badgeAm: "ክሊኒካል ምሰሶ 3",
    categoryEn: "Household WASH & Child Infection Defense",
    categoryAm: "የቤት ውስጥ ንጽህና (WASH) እና የህፃናት ኢንፌክሽን መከላከያ",
    taglineEn:
      "Protecting infants and mothers from waterborne diarrheal disease and environmental enteropathy through actionable, low-cost household water safety.",
    taglineAm:
      "ህፃናትን ከተቅማጥ እና ከውሃ ወለድ በሽታዎች ለመጠበቅ የሚረዱ ዝቅተኛ ወጪ ያላቸው አስተማማኝ የቤት ውስጥ የውሃ ማከሚያ ዘዴዎች።",
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
    icon: "Droplets",
    accent: "bg-[#edf6f9] text-[#1c647b] border-[#d4e7ee]",
    primaryCtaLabelEn: "Consult Hygiene Guidance",
    primaryCtaLabelAm: "የንጽህና መመሪያዎችን ይጠይቁ",
    primaryCtaHref: "/ask-opal",
  },
  {
    slug: "postnatal-maternal-wellness",
    order: 4,
    badgeEn: "Clinical Pillar 4",
    badgeAm: "ክሊኒካል ምሰሶ 4",
    categoryEn: "Postnatal Recovery & Maternal Mental Wellness",
    categoryAm: "የአራስ እናቶች ማገገሚያ እና አዕምሯዊ ደህንነት",
    taglineEn:
      "Targeted support during the critical fourth trimester: postpartum recovery, pelvic floor wellness, emotional health, and spacing consultations.",
    taglineAm:
      "ከወሊድ በኋላ ባሉት ወሳኝ ሳምንታት ውስጥ የሚሰጥ የአራስ እናት አካላዊ ማገገሚያ፣ ስነ-ልቦናዊ ድጋፍ እና የወሊድ መከላከያ ምክክር።",
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
    icon: "Baby",
    accent: "bg-[#f5eff9] text-[#643c82] border-[#e4d8ee]",
    primaryCtaLabelEn: "Book Postnatal Review",
    primaryCtaLabelAm: "የአራስ ክትትል ቀጠሮ ይያዙ",
    primaryCtaHref: "/portal/consultations/new",
  },
];

export const defaultProducts = [
  {
    slug: "lactation-tea",
    order: 1,
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
    orderUrl: "https://t.me/Trinity_health_solution",
    phoneContact: "+251988720194",
    inStock: true,
  },
  {
    slug: "postpartum-nutri-porridge",
    order: 2,
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
    orderUrl: "https://t.me/Trinity_health_solution",
    phoneContact: "+251988720194",
    inStock: true,
  },
  {
    slug: "first-bite-weaning-cereal",
    order: 3,
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
    orderUrl: "https://t.me/Trinity_health_solution",
    phoneContact: "+251988720194",
    inStock: true,
  },
  {
    slug: "feeding-measuring-set",
    order: 4,
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
    orderUrl: "https://t.me/Trinity_health_solution",
    phoneContact: "+251988720194",
    inStock: true,
  },
  {
    slug: "safedrop-water-kit",
    order: 5,
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
    orderUrl: "https://t.me/Trinity_health_solution",
    phoneContact: "+251988720194",
    inStock: true,
  },
  {
    slug: "visual-nutrition-cards",
    order: 6,
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
    orderUrl: "https://t.me/Trinity_health_solution",
    phoneContact: "+251988720194",
    inStock: true,
  },
];

const seedAuthorToken = "system:trinity-catalog-seed:v1";

export const seedCatalogInternal = internalMutation({
  args: {},
  handler: async (ctx) => {
    let servicesInserted = 0;
    let productsInserted = 0;
    const now = Date.now();

    // Seed Services
    for (const service of defaultServices) {
      const existing = await ctx.db
        .query("servicesContent")
        .withIndex("by_slug", (q) => q.eq("slug", service.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("servicesContent", {
          ...service,
          status: "published",
          publishedAt: now,
          authorTokenIdentifier: seedAuthorToken,
          updatedAt: now,
        });
        servicesInserted++;
      }
    }

    // Seed Products
    for (const product of defaultProducts) {
      const existing = await ctx.db
        .query("productsContent")
        .withIndex("by_slug", (q) => q.eq("slug", product.slug))
        .first();

      if (!existing) {
        await ctx.db.insert("productsContent", {
          ...product,
          status: "published",
          publishedAt: now,
          authorTokenIdentifier: seedAuthorToken,
          updatedAt: now,
        });
        productsInserted++;
      }
    }

    return { servicesInserted, productsInserted };
  },
});
