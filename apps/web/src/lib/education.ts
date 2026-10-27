export type EducationItem = {
  _id: string;
  category: string;
  readMinutes: number;
  title: string;
  titleAm: string;
  summary: string;
  summaryAm: string;
  content: string;
  contentAm: string;
  sections?: Array<{
    title: string;
    titleAm: string;
    body: string;
    bodyAm: string;
  }>;
};

export type EducationLanguage = "en" | "am";

export const fallbackEducation: EducationItem[] = [
  {
    _id: "food-safety",
    category: "Food safety",
    readMinutes: 3,
    title: "Small habits. Safer family meals.",
    titleAm: "ጤናማ ምግብ፣ ከትንሽ ልምዶች ይጀምራል።",
    summary:
      "Clean hands, thoroughly cooked food, and covered dishes are useful everyday habits.",
    summaryAm: "ንጹህ እጅ፣ በደንብ የበሰለ ምግብ እና የተከደነ ዕቃ ጠቃሚ የዕለት ተዕለት ልምዶች ናቸው።",
    content:
      "Small, consistent habits around food preparation can help families reduce common food-safety risks.",
    contentAm:
      "በምግብ ዝግጅት ዙሪያ ያሉ ቀላልና ተከታታይ ልምዶች ቤተሰቦች የተለመዱ የምግብ ደህንነት አደጋዎችን እንዲቀንሱ ይረዳሉ።",
    sections: [
      {
        title: "Wash hands and utensils",
        titleAm: "እጅን እና የማብሰያ ዕቃዎችን ማጽዳት",
        body: "Wash hands with soap and clean water before preparing food and before feeding children.",
        bodyAm: "ምግብ ከማዘጋጀትዎ እና ህፃናትን ከመመገብዎ በፊት እጅዎን በሳሙና እና በንጹህ ውሃ ይታጠቡ።",
      },
      {
        title: "Cook food thoroughly",
        titleAm: "ምግብን በደንብ ማብሰል",
        body: "Cook meals thoroughly and reheat leftovers until steaming hot.",
        bodyAm: "ምግቦችን በደንብ እስኪበስሉ ድረስ ያብስሉ። የተረፈ ምግብን በደንብ እስኪሞቅ ድረስ ያሙቁት።",
      },
      {
        title: "Cover prepared food",
        titleAm: "የበሰለ ምግብን ከድኖ ማስቀመጥ",
        body: "Cover prepared food with a clean lid to protect it from dust and insects.",
        bodyAm: "የበሰለ ምግብን ከዝንቦች እና ከአቧራ ለመከላከል በንጹህ ክዳን ይክደኑ።",
      },
    ],
  },
  {
    _id: "pregnancy",
    category: "Pregnancy nutrition",
    readMinutes: 4,
    title: "Building a varied plate during pregnancy",
    titleAm: "በእርግዝና ጊዜ የተለያዩ ምግቦችን መመገብ",
    summary:
      "Build variety from familiar foods and follow advice from your care team.",
    summaryAm: "ከምታውቋቸው ምግቦች ልዩነትን ይፍጠሩ፣ ከጤና ባለሙያዎ ምክርንም ይከተሉ።",
    content:
      "Food choices during pregnancy can reflect what is available, affordable, and familiar. Personal advice should come from a qualified health professional.",
    contentAm:
      "በእርግዝና ጊዜ የምግብ ምርጫ በአካባቢ የሚገኙ፣ ተመጣጣኝ እና የምናውቃቸው ምግቦችን ሊያካትት ይችላል። ለግል ምክር ብቁ የጤና ባለሙያን ያነጋግሩ።",
    sections: [
      {
        title: "Choose variety when you can",
        titleAm: "በሚቻልበት ጊዜ የተለያዩ ምግቦችን ይምረጡ",
        body: "Use familiar staples alongside vegetables, beans, lentils, eggs, or other foods available to your household.",
        bodyAm:
          "የምታውቋቸውን ዋና ምግቦች ከአትክልት፣ ባቄላ፣ ምስር፣ እንቁላል ወይም በቤትዎ ከሚገኙ ሌሎች ምግቦች ጋር ያዘጋጁ።",
      },
    ],
  },
  {
    _id: "child-nutrition",
    category: "Child nutrition",
    readMinutes: 3,
    title: "Soft, nourishing foods for young children",
    titleAm: "ለታዳጊ ህፃናት ለስላሳ እና ገንቢ ምግብ",
    summary:
      "Offer age-appropriate textures and follow local child-feeding guidance.",
    summaryAm: "ለዕድሜው የሚስማማ ለስላሳነትን ይስጡ፣ የአካባቢውን መመሪያ ይከተሉ።",
    content:
      "Children grow at different rates. Follow guidance from a qualified health worker for feeding, texture, and portion size.",
    contentAm:
      "ህፃናት በተለያየ ፍጥነት ያድጋሉ። ስለ አመጋገብ፣ ለስላሳነት እና መጠን ከብቁ የጤና ባለሙያ መመሪያ ይውሰዱ።",
    sections: [
      {
        title: "Match texture to the child",
        titleAm: "ለህፃኑ የሚስማማ ለስላሳነት ይምረጡ",
        body: "Offer foods prepared in a texture the child can manage, and supervise them while eating.",
        bodyAm: "ህፃኑ ሊበላው በሚችል ለስላሳነት የተዘጋጀ ምግብ ይስጡ፣ ሲመገብም ይከታተሉት።",
      },
    ],
  },
  {
    _id: "safe-water",
    category: "Clean water & hygiene",
    readMinutes: 2,
    title: "Preparing and storing drinking water safely",
    titleAm: "የመጠጥ ውሃን በንጽህና ማዘጋጀት እና ማስቀመጥ",
    summary: "Follow local guidance and use a clean, covered container.",
    summaryAm: "የአካባቢ ምክርን ይከተሉ፣ ንጹህና ክዳን ያለው ዕቃ ይጠቀሙ።",
    content:
      "Safe water practices depend on local water conditions. Follow guidance from local public-health authorities.",
    contentAm:
      "የውሃ ደህንነት ልምዶች በአካባቢው የውሃ ሁኔታ ላይ ይመሰረታሉ። የአካባቢውን የህዝብ ጤና ባለሙያዎች መመሪያ ይከተሉ።",
    sections: [
      {
        title: "Use a clean container",
        titleAm: "ንጹህ ዕቃ ይጠቀሙ",
        body: "Store drinking water in a clean container with a cover, away from dirt and household chemicals.",
        bodyAm: "የመጠጥ ውሃን ከቆሻሻና ከቤት ውስጥ ኬሚካሎች ርቆ በንጹህና ክዳን ባለው ዕቃ ያስቀምጡ።",
      },
    ],
  },
];

export function displayTitle(item: EducationItem, language: EducationLanguage) {
  return language === "am" ? item.titleAm : item.title;
}

export function displaySummary(
  item: EducationItem,
  language: EducationLanguage,
) {
  return language === "am" ? item.summaryAm : item.summary;
}

export function displayContent(
  item: EducationItem,
  language: EducationLanguage,
) {
  return language === "am" ? item.contentAm : item.content;
}

export function matchEducation(question: string, items: EducationItem[]) {
  const text = question.toLocaleLowerCase();
  const terms: Record<string, string[]> = {
    "food-safety": [
      "food",
      "clean",
      "hand",
      "wash",
      "hygiene",
      "ምግብ",
      "እጅ",
      "ንጽህና",
    ],
    pregnancy: ["pregnan", "pregnancy", "eat", "food", "እርግዝና"],
    "child-nutrition": ["child", "baby", "texture", "feed", "ህፃን", "ልጅ"],
    "safe-water": ["water", "drink", "safe", "ውሃ", "መጠጥ"],
  };
  return items
    .map((item) => ({
      item,
      score: (terms[item._id] ?? []).filter((term) => text.includes(term))
        .length,
    }))
    .sort((a, b) => b.score - a.score)[0]?.item;
}
