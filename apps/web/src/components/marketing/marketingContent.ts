import {
  BookOpen,
  Heart,
  Leaf,
  ShieldCheck,
  Smartphone,
  Users,
  CheckCircle2,
  Stethoscope,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type MarketingLanguage = "en" | "am";

export interface LearningTopic {
  number: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  slug: string;
  icon: LucideIcon;
  tint: string;
}

export interface ApproachStep {
  number: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
}

export interface Commitment {
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  icon: LucideIcon;
}

export interface OpalSampleQuestion {
  id: string;
  questionEn: string;
  questionAm: string;
  categoryEn: string;
  categoryAm: string;
  answerEn: string;
  answerAm: string;
  sourceLessonSlug: string;
  sourceLessonTitleEn: string;
  sourceLessonTitleAm: string;
}

export interface PantryIngredient {
  id: string;
  nameAm: string;
  nameEn: string;
  category: "staple" | "protein" | "vegetable";
}

export interface PantryRecipe {
  id: string;
  titleAm: string;
  titleEn: string;
  requiredIngredients: string[];
  descriptionAm: string;
  descriptionEn: string;
  nutritionTipAm: string;
  nutritionTipEn: string;
  badgeAm: string;
  badgeEn: string;
}

export interface AudiencePathway {
  id: string;
  badgeEn: string;
  badgeAm: string;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  pointsEn: string[];
  pointsAm: string[];
  ctaLabelEn: string;
  ctaLabelAm: string;
  ctaHref: string;
  icon: LucideIcon;
  tint: string;
}

export const learningTopics: LearningTopic[] = [
  {
    number: "01",
    titleEn: "Food Safety & Clean Habits",
    titleAm: "የምግብ ደህንነት እና ንፅህና",
    descriptionEn:
      "Essential daily practices: handwashing, safe food storage, and protecting family water sources.",
    descriptionAm:
      "በቤት ውስጥ የሚዘጋጅ ምግብን ደህንነት መጠበቅ፣ እጅን በደንብ መታጠብ እና የንጹህ ውሃ አያያዝ።",
    slug: "home-food-safety",
    icon: Leaf,
    tint: "bg-[#e5eddf] text-[#496742]",
  },
  {
    number: "02",
    titleEn: "Pregnancy & Maternal Nutrition",
    titleAm: "የእርግዝና እና የእናትነት አመጋገብ",
    descriptionEn:
      "Culturally familiar foods that supply iron, folate, and sustained energy during pregnancy and postpartum.",
    descriptionAm:
      "በእርግዝና ወቅት የተለያዩ የቤት ውስጥ ምግቦችን መመገብ፣ የደም ማነስን መከላከል እና ጠቃሚ ንጥረነገሮች።",
    slug: "pregnancy-nutrition-variety",
    icon: Heart,
    tint: "bg-[#f8e8df] text-[#9b593e]",
  },
  {
    number: "03",
    titleEn: "Child & Infant Feeding",
    titleAm: "የህፃናት እና ጨቅላዎች አመጋገብ",
    descriptionEn:
      "Soft, nutrient-dense complementary foods from 6 months onward using easily accessible household staples.",
    descriptionAm:
      "ለታዳጊ ህፃናት ለስላሳ እና የተሟላ ተጨማሪ ምግብ፣ የጡት ማጥባት ልምዶች እና ጤናማ እድገት።",
    slug: "child-complementary-feeding",
    icon: BookOpen,
    tint: "bg-[#e5edf0] text-[#476776]",
  },
];

export const approachSteps: ApproachStep[] = [
  {
    number: "01",
    titleEn: "Made for real life",
    titleAm: "ለዕለት ተዕለት ኑሮ የተዘጋጀ",
    descriptionEn:
      "Short, approachable 3-minute lessons designed to fit effortlessly into busy Ethiopian household routines.",
    descriptionAm:
      "አጫጭርና ግልጽ የሆኑ የ3 ደቂቃ ትምህርቶች፣ በቀላሉ ሊተገበሩ የሚችሉ ተግባራዊ ምክሮች።",
  },
  {
    number: "02",
    titleEn: "Culturally rooted & bilingual",
    titleAm: "ባህላዊ እሴቶችን ያከበረና በቋንቋዎ",
    descriptionEn:
      "First in Amharic, grounded in familiar ingredients like Teff, Shiro, and local cooking traditions.",
    descriptionAm:
      "በአማርኛ እና እንግሊዝኛ የተዘጋጀ፣ በአካባቢያችን በሚገኙ እንደ ጤፍ፣ ሽሮና አትክልቶች ላይ ያተኮረ።",
  },
  {
    number: "03",
    titleEn: "Prepared with care",
    titleAm: "በጥንቃቄ የተዘጋጀ",
    descriptionEn:
      "Prepared in collaboration with health educators and aligned with public health nutrition guidance.",
    descriptionAm:
      "ከጤና አስተማሪዎች ጋር በመተባበር የተዘጋጀ እና ከህዝብ ጤና የአመጋገብ መመሪያዎች ጋር የተጣጣመ።",
  },
];

export const commitments: Commitment[] = [
  {
    titleEn: "Amharic-First Learning",
    titleAm: "የአማርኛ ቀዳሚ ትምህርት",
    descriptionEn: "Clear, respectful language that resonates with families.",
    descriptionAm: "ለቤተሰብ ግልጽና አክብሮት የተሞላበት የአማርኛ ትምህርት።",
    icon: BookOpen,
  },
  {
    titleEn: "Offline-Accessible Notes",
    titleAm: "ያለ ኢንተርኔት የሚነበቡ ማስታወሻዎች",
    descriptionEn: "Read downloaded core health lessons without active mobile data.",
    descriptionAm: "ዋና የጤና ትምህርቶችን ያለ ሞባይል ዳታ በየትኛውም ቦታ ያንብቡ።",
    icon: Smartphone,
  },
  {
    titleEn: "Health Learning Materials",
    titleAm: "የጤና ትምህርታዊ ይዘት",
    descriptionEn: "Educational notes developed with health educators and referenced standards.",
    descriptionAm: "የጤና መመሪያዎችን ያካተተ ትምህርታዊ ይዘት።",
    icon: BookOpen,
  },
  {
    titleEn: "Women & Community Centered",
    titleAm: "ማህበረሰብ አቀፍ እንክብካቤ",
    descriptionEn: "Supporting mothers, adolescent girls, and community health counselors.",
    descriptionAm: "እናቶችን፣ ወጣት ልጃገረዶችንና የማህበረሰብ ጤና አማካሪዎችን ያግዛል።",
    icon: Users,
  },
];

export const opalSampleQuestions: OpalSampleQuestion[] = [
  {
    id: "water",
    categoryEn: "Water & Hygiene",
    categoryAm: "ውሃና ንፅህና",
    questionEn: "How do I ensure drinking water is safe for my family at home?",
    questionAm: "በቤት ውስጥ የመጠጥ ውሃን ለቤተሰቤ እንዴት ደህንነቱ የተጠበቀ ማድረግ እችላለሁ?",
    answerEn:
      "Boiling water briskly for at least 1 minute is the most reliable way to kill germs. Store boiled water in a clean, covered container with a narrow neck, and use a clean ladle rather than dipping hands.",
    answerAm:
      "ውሃን ቢያንስ ለ1 ደቂቃ በደንብ ማፍላት ጀርሞችን ለማጥፋት ዋነኛው መንገድ ነው። የፈሰሰውን ወይም የፈላውን ውሃ ንጹህና ክዳን ባለው እቃ ውስጥ ያስቀምጡ፣ እጅ እንዳይነካውም በንጹህ ጭልፋ ይጠቀሙ።",
    sourceLessonSlug: "home-food-safety",
    sourceLessonTitleEn: "Safe Food and Clean Kitchen Habits",
    sourceLessonTitleAm: "በቤት ውስጥ የምግብ ደህንነት እና ንፅህና",
  },
  {
    id: "pregnancy",
    categoryEn: "Maternal Health",
    categoryAm: "የእናትነት ጤና",
    questionEn: "What local affordable Ethiopian foods help prevent anemia during pregnancy?",
    questionAm: "በእርግዝና ወቅት የደም ማነስን ለመከላከል የሚረዱ በአካባቢ የሚገኙ ምግቦች የትኞቹ ናቸው?",
    answerEn:
      "Teff Injera combined with legumes like lentils (Misir) and dark greens (Gomen/Qosta) provide plant iron. Pair them with vitamin C (tomatoes, oranges, or lemon) to maximize iron absorption, and avoid drinking tea right after meals.",
    answerAm:
      "የጤፍ እንጀራ ከምስር ወጥ እና ከጎመን/ቆስጣ ጋር መመገብ ከፍተኛ የብረት (Iron) ንጥረ ነገር ይሰጣል። የብረት ንጥረ ነገሩ በደንብ እንዲዋሃድ ከቲማቲም ወይም ሎሚ ጋር አብሮ መመገብ እና ከምግብ በኋላ ወዲያው ሻይ አለመጠጣት ይመረጣል።",
    sourceLessonSlug: "pregnancy-nutrition-variety",
    sourceLessonTitleEn: "Building a Varied Plate During Pregnancy",
    sourceLessonTitleAm: "በእርግዝና ወቅት የተለያዩ የቤት ውስጥ ምግቦችን መመገብ",
  },
  {
    id: "baby",
    categoryEn: "Child Nutrition",
    categoryAm: "የህፃናት አመጋገብ",
    questionEn: "When and how should I start feeding solid food to my 6-month-old baby?",
    questionAm: "ለ6 ወር ህፃን ተጨማሪ ምግብ መቼና እንዴት መጀመር አለብኝ?",
    answerEn:
      "At 6 months, breastmilk remains essential, but babies need mashed, soft foods. Start with pureed porridge made from roasted cereals (Beso or mixed grain porridge), mashed sweet potato, or well-cooked egg yolk, giving 2-3 small spoonfuls twice a day.",
    answerAm:
      "በ6 ወር የጡት ወተት ዋነኛ ሆኖ ሳለ፣ ተጨማሪ ለስላሳ ምግቦችን ይጀምሩ። ከተፈጨና ከተቀቀለ እህል (በሶ ወይም አጥሚት)፣ ድንች ወይም ከእንቁላል አስኳል በትንሽ ማንኪያ በቀን 2-3 ጊዜ ይጀምሩ።",
    sourceLessonSlug: "child-complementary-feeding",
    sourceLessonTitleEn: "Soft, Mashed Meals for Growing Young Children",
    sourceLessonTitleAm: "ለታዳጊ ህፃናት ለስላሳ እና የተሟላ ተጨማሪ ምግብ",
  },
];

export const pantryIngredients: PantryIngredient[] = [
  { id: "teff", nameAm: "ጤፍ", nameEn: "Teff", category: "staple" },
  { id: "misir", nameAm: "ምስር", nameEn: "Lentils", category: "protein" },
  { id: "shiro", nameAm: "ሽሮ", nameEn: "Chickpea Shiro", category: "protein" },
  { id: "egg", nameAm: "እንቁላል", nameEn: "Eggs", category: "protein" },
  { id: "gomen", nameAm: "ጎመን / ቆስጣ", nameEn: "Greens (Gomen)", category: "vegetable" },
  { id: "potato", nameAm: "ድንች", nameEn: "Potatoes", category: "staple" },
  { id: "carrot", nameAm: "ካሮት", nameEn: "Carrots", category: "vegetable" },
];

export const pantryRecipes: PantryRecipe[] = [
  {
    id: "misir-gomen",
    titleAm: "የምስርና ጎመን አልጫ ከጤፍ እንጀራ ጋር",
    titleEn: "Nutrient-Dense Lentil & Greens Stew with Teff Injera",
    requiredIngredients: ["misir", "gomen", "teff"],
    descriptionAm:
      "በብረት (Iron) እና ፋይበር የበለፀገ የተሟላ ምግብ። ቆስጣውን በመጨረሻው ሰዓት በመጨመር ቫይታሚኑ እንዳይጠፋ ያድርጉ።",
    descriptionEn:
      "A powerhouse of plant iron, protein, and dietary fiber. Lightly steam the greens at the end to preserve heat-sensitive nutrients.",
    nutritionTipAm: "ምግቡን በትንሽ የሎሚ ጭማቂ አጅበው ይመገቡ፤ የብረት ንጥረ ነገር በቀላሉ እንዲዋሃድ ይረዳል።",
    nutritionTipEn: "Add a squeeze of fresh lemon to double non-heme iron absorption.",
    badgeAm: "ለነፍሰጡር እና ለቤተሰብ",
    badgeEn: "For Pregnancy & Family",
  },
  {
    id: "egg-potato-mash",
    titleAm: "የድንች፣ ካሮት እና እንቁላል ለስላሳ ውህድ",
    titleEn: "Nourishing Mashed Egg & Vegetable Medley",
    requiredIngredients: ["egg", "potato", "carrot"],
    descriptionAm:
      "ለታዳጊ ህፃናት (ከ6 ወር በላይ) ተስማሚ የሆነ ለስላሳ፣ በቫይታሚን ኤ እና ፕሮቲን የተሞላ ቀላል ምግብ።",
    descriptionEn:
      "Gentle on young stomachs, high in Vitamin A from carrots and quality protein/choline from egg yolk.",
    nutritionTipAm: "ለህፃናት ሲዘጋጅ ቅመም ሳያበዙ በደንብ እስኪለሰልስ ድረስ በእጅ ወይም በማንኪያ ያደቁት።",
    nutritionTipEn: "Mash thoroughly with a fork or clean spoon to achieve a smooth texture for babies.",
    badgeAm: "ለህፃናት ተጨማሪ ምግብ",
    badgeEn: "Infant Complementary Feeding",
  },
  {
    id: "shiro-fitfit",
    titleAm: "የሽሮና አትክልት ፍትፍት",
    titleEn: "Wholesome Shiro & Vegetable Plate",
    requiredIngredients: ["shiro", "teff", "gomen"],
    descriptionAm:
      "በቀላሉ የሚዘጋጅ የፕሮቲን ምንጭ። ከጎመንና ቲማቲም ጋር ሲጣመር ሚዛናዊ የዕለት ተዕለት ምግብ ይሆናል።",
    descriptionEn:
      "Traditional chickpea flour rich in energy and protein, paired with greens for essential micronutrients.",
    nutritionTipAm: "በቂ ውሃ በመጠጣት እና አትክልቶችን በማካተት የተመጣጠነ ያድርጉት።",
    nutritionTipEn: "Always pair shiro with fresh vegetables for a complete nutritional profile.",
    badgeAm: "ቀላል የዕለት ተዕለት ምግብ",
    badgeEn: "Quick Family Staple",
  },
];

export const audiencePathways: AudiencePathway[] = [
  {
    id: "families",
    badgeEn: "Everyday Community",
    badgeAm: "ለእያንዳንዱ ቤተሰብ",
    titleEn: "For Mothers & Families",
    titleAm: "ለእናቶችና ለቤተሰቦች",
    descriptionEn:
      "Free health knowledge right in your pocket. No confusing medical jargon—just bite-sized, culturally tailored guidance.",
    descriptionAm:
      "ያለ ክፍያ በቀላሉ የሚገኝ የጤና እውቀት በእጅዎ ስልክ። የተወሳሰበ የህክምና ቋንቋ የሌለው፣ ለዕለት ተዕለት ተግባራዊ የሚሆን።",
    pointsEn: [
      "Bilingual in Amharic & English",
      "Offline-accessible reading for core lessons",
      "Ask Opal AI assistant for guidance anytime",
    ],
    pointsAm: [
      "በአማርኛ እና በእንግሊዝኛ የተዘጋጀ",
      "ዋና ትምህርቶችን ያለ ኢንተርኔት ማንበብ የሚያስችል",
      "በየትኛውም ሰዓት ኦፓልን (Opal AI) ይጠይቁ",
    ],
    ctaLabelEn: "Explore Free Lessons",
    ctaLabelAm: "ትምህርቶችን ይጀምሩ",
    ctaHref: "/learn",
    icon: Users,
    tint: "bg-[#e5eddf] text-[#1c573e]",
  },
  {
    id: "health-workers",
    badgeEn: "Care Providers",
    badgeAm: "ለጤና ባለሙያዎች",
    titleEn: "For Health Workers & Counselors",
    titleAm: "ለጤና ባለሙያዎችና አማካሪዎች",
    descriptionEn:
      "Equip your outreach team with structured educational materials and manage family consultation queues effortlessly.",
    descriptionAm:
      "የማህበረሰብ ጤና አማካሪዎችን በተረጋገጡ ትምህርታዊ ቁሳቁሶች ይደግፉ፣ የደንበኞች የምክክር ጥያቄዎችን በቅደም ተከተል ያስተዳድሩ።",
    pointsEn: [
      "Staff triage queue & consultation tracker",
      "Standardized community health education cards",
      "Secure client follow-up management",
    ],
    pointsAm: [
      "የደንበኞች ጥያቄ ማስተናገጃና ክትትል (Staff Queue)",
      "ደረጃቸውን የጠበቁ የማስተማሪያ ካርዶች",
      "ደህንነቱ የተጠበቀ የምክክር አስተዳደር",
    ],
    ctaLabelEn: "Access Staff Portal",
    ctaLabelAm: "የሰራተኞች ፖርታል",
    ctaHref: "/staff",
    icon: Stethoscope,
    tint: "bg-[#f8e8df] text-[#c78157]",
  },
  {
    id: "partners",
    badgeEn: "Public Health Focus",
    badgeAm: "ለአጋር ድርጅቶችና የጤና ተቋማት",
    titleEn: "For Community & Public Health Partners",
    titleAm: "ለአጋር ድርጅቶችና የህዝብ ጤና አስተማሪዎች",
    descriptionEn:
      "Scale high-impact maternal, newborn, and child health interventions through bilingual digital distribution.",
    descriptionAm:
      "የእናቶች፣ አራስ እና ህፃናት ጤና እና የአመጋገብ ፕሮግራሞችን በዘመናዊ ዲጂታል ቴክኖሎጂ ተደራሽ ያድርጉ።",
    pointsEn: [
      "Health communication resources",
      "Content publishing & curriculum management",
      "Privacy-first population health reach",
    ],
    pointsAm: [
      "የጤና ትምህርትና መረጃ ማስተላለፊያ",
      "የትምህርት ይዘቶችን የማሳተምና የማስተዳደር ስርዓት",
      "የማህበረሰብ ሚስጥርን የጠበቀ ዘመናዊ መድረክ",
    ],
    ctaLabelEn: "Publisher Portal",
    ctaLabelAm: "የአሳታሚዎች ፖርታል",
    ctaHref: "/admin",
    icon: Building2,
    tint: "bg-[#e5edf0] text-[#3d5a73]",
  },
];
