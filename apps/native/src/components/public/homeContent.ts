export type PublicLanguage = "am" | "en";

export const homeCopy = {
  am: {
    eyebrow: "ለዕለት ተዕለት እንክብካቤ",
    welcome: "ሰላም፣ እንኳን ደህና መጡ።",
    subtitle: "ትንሽ እውቀት፣ ብዙ እንክብካቤ።",
    todaysLesson: "የዛሬ ትንሽ ትምህርት",
    lessonNumber: "01 / 05",
    foodSafety: "የምግብ ደህንነት",
    lessonTitle: "ጤናማ ምግብ፣ ከትንሽ ልምዶች ይጀምራል።",
    lessonSummary: "ንጹህ እጅ፣ በደንብ የበሰለ ምግብ፣ የተከደነ ዕቃ። አንድ ላይ እንማር።",
    learnTogether: "አብረን እንማር",
    minutes: "3 ደቂቃ",
    recipeAction: "ምን እናብስል?",
    recipeSub: "ቀላል የምግብ ሀሳቦች",
    notesAction: "የእኔ ማስታወሻዎች",
    notesSub: "ለሌላ ጊዜ ያስቀምጡ",
    growTitle: "አንድ ላይ እናድግ",
    seeAll: "ሁሉንም እይ",
    pregnancy: "የእርግዝና አመጋገብ",
    pregnancyTitle: "በእርግዝና ጊዜ የተለያዩ የቤት ውስጥ ምግቦችን መመገብ",
    childNutrition: "የህፃናት አመጋገብ",
    childNutritionTitle: "ለታዳጊ ህፃናት ለስላሳ እና የተሟላ ተጨማሪ ምግብ",
    readTime: (minutes: number) => `${minutes} ደቂቃ ንባብ`,
    askOpal: "ጥያቄ አለዎት? ኦፓልን ይጠይቁ።",
    askOpalSub: "ከአካባቢ ማስታወሻዎች አብረን እንማር።",
    footer: "በእንክብካቤ የተሰራ፣ ለቤተሰብ።",
    settingsTitle: "ቋንቋ",
    english: "English",
    amharic: "አማርኛ",
    cancel: "ዝጋ",
    opalTitle: "ኦፓልን ጠይቅ",
    opalMessage: "የተዘጋጁ መልሶችን በትምህርት ገጹ ውስጥ ያግኙ። ይህ ስሪት ገና የቀጥታ ውይይት አያቀርብም።",
    openLearn: "ትምህርቶችን ክፈት",
  },
  en: {
    eyebrow: "CARE FOR EVERY DAY",
    welcome: "Hello, welcome.",
    subtitle: "A little learning. A lot of care.",
    todaysLesson: "A LITTLE LEARNING FOR TODAY",
    lessonNumber: "01 / 05",
    foodSafety: "FOOD SAFETY",
    lessonTitle: "Healthy food starts with small habits.",
    lessonSummary:
      "Clean hands, food cooked well, and covered dishes. Let’s learn together.",
    learnTogether: "Let’s learn together",
    minutes: "3 min",
    recipeAction: "What should we cook?",
    recipeSub: "Simple meal ideas",
    notesAction: "My notes",
    notesSub: "Save for later",
    growTitle: "Let’s grow together",
    seeAll: "See all",
    pregnancy: "PREGNANCY NUTRITION",
    pregnancyTitle: "Enjoying a variety of familiar foods during pregnancy",
    childNutrition: "CHILD NUTRITION",
    childNutritionTitle:
      "Soft, nourishing complementary foods for young children",
    readTime: (minutes: number) => `${minutes} min read`,
    askOpal: "Have a question? Ask Opal.",
    askOpalSub: "Learn together with community notes.",
    footer: "Made with care, for families.",
    settingsTitle: "Choose a language",
    english: "English",
    amharic: "አማርኛ",
    cancel: "Cancel",
    opalTitle: "Ask Opal",
    opalMessage:
      "Find prepared answers in the Learn section. Live chat is not available in this version.",
    openLearn: "Open learning",
  },
} satisfies Record<
  PublicLanguage,
  {
    eyebrow: string;
    welcome: string;
    subtitle: string;
    todaysLesson: string;
    lessonNumber: string;
    foodSafety: string;
    lessonTitle: string;
    lessonSummary: string;
    learnTogether: string;
    minutes: string;
    recipeAction: string;
    recipeSub: string;
    notesAction: string;
    notesSub: string;
    growTitle: string;
    seeAll: string;
    pregnancy: string;
    pregnancyTitle: string;
    childNutrition: string;
    childNutritionTitle: string;
    readTime: (minutes: number) => string;
    askOpal: string;
    askOpalSub: string;
    footer: string;
    settingsTitle: string;
    english: string;
    amharic: string;
    cancel: string;
    opalTitle: string;
    opalMessage: string;
    openLearn: string;
  }
>;
