export type OpalSafetyIntent = "safe" | "clinical" | "urgent";

export type OpalLanguage = "am" | "en";

// Patterns that indicate an active, acute medical emergency right now
const activeUrgentCrisisPatterns = [
  /\b(?:i am having an? emergency|this is an? emergency|it(?:'s| is) an? emergency|medical emergency right now|call an? ambulance|call 911)\b/i,
  /\b(?:can't breathe|cannot breathe|difficulty breathing|stopped breathing|choking)\b/i,
  /\b(?:heavy bleeding|bleeding heavily|hemorrhag\w*)\b/i,
  /\b(?:unconscious|not waking(?: up)?|passed out|unresponsive)\b/i,
  /\b(?:having a seizure|convulsing)\b/i,
  /\b(?:severe (?:chest )?pain|chest pain|heart attack|stroke)\b/i,
  /\b(?:self[- ]?harm|commit(?:ting)? suicide|kill(?:ing)? myself)\b/i,
  /\b(?:rush to (?:the )?hospital|call emergency services)\b/i,
  /አስቸኳይ እርዳታ እፈልጋለሁ/,
  /መተንፈስ አልቻልኩም/,
  /ከባድ ደም መፍሰስ/,
  /ራሴን ልጎዳ/,
];

// If a question is educational, informational, or asks about guidelines/practices/preparedness,
// it should NOT be flagged as an active personal emergency, even if the word "emergency" appears.
const educationalIntentPatterns = [
  /\b(?:practices?|recommendations?|guidelines?|tips?|how to|what (?:is|are|should)|can i|advice on|best way)\b/i,
  /\b(?:in an? emergency|during an? emergency|emergency preparedness|emergency kit|emergency supplies|emergency contraception|emergency situation)\b/i,
  /\b(?:breastfeeding in emergencies|child feeding in emergencies)\b/i,
  /እንዴት|ምን አይነት|ምክረ ሀሳብ|መመሪያ|ዝግጅት|በአስቸኳይ ጊዜ/,
];

// Explicit requests for personal clinical diagnosis, personal prescriptions, or individualized calorie targets
const personalClinicalPatterns = [
  /\b(?:diagnose (?:me|this rash|my condition)|what disease do i have|what is wrong with me|what do i have|tell me my diagnosis)\b/i,
  /\b(?:what (?:medicine|medication|drug|dose|dosage|pills?) should i take|prescribe me|how many tablets should i (?:take|drink))\b/i,
  /\b(?:should i stop taking (?:my )?medication)\b/i,
  /\b(?:calculate (?:my )?(?:calories|bmr|tdee|macros)|my calorie target|prescribe (?:a )?diet)\b/i,
  /በሽታዬን መርምርልኝ|ምን በሽታ አለብኝ/,
  /ምን አይነት መድኃኒት መውሰድ አለብኝ|ምን መድሃኒት ልውሰድ|የመድሃኒት መጠን አዝዝልኝ/,
  /የካሎሪ መጠን አስላልኝ|የግል የአመጋገብ ማዘዣ/,
];

export function classifyOpalQuestion(question: string): OpalSafetyIntent {
  const normalized = question.trim();

  // If question is educational/guideline-seeking, do not flag as urgent crisis
  const isEducational = educationalIntentPatterns.some((pattern) => pattern.test(normalized));

  // Check personal clinical requests first
  if (personalClinicalPatterns.some((pattern) => pattern.test(normalized))) {
    return "clinical";
  }

  // Check active acute emergency
  if (activeUrgentCrisisPatterns.some((pattern) => pattern.test(normalized))) {
    // If it's a general question like "What are recommendations for... in an emergency", it's safe
    if (!isEducational) {
      return "urgent";
    }
  }

  return "safe";
}

const likelyPersonalDetailPatterns = [
  /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i,
  /\+?\d[\d\s().-]{7,}\d/,
  /\b(?:my name is|call me|i am called)\s+[\p{L}'-]+(?:\s+[\p{L}'-]+){0,2}/iu,
  /\b(?:my age is|i am)\s+\d{1,3}\s*years? old\b/i,
  /\b(?:my (?:weight|height|bmi)|i weigh)\s*(?:is|about|of)?\s*\d/i,
  /\b(?:my (?:address|email|phone|telephone|date of birth|dob)|i live at \d+)\b/i,
  /\b(?:i am|i'm|i have|i've)\b[\s\S]{0,60}\b(?:diagnosed with|suffering from)\b[\s\S]{0,60}\b(?:diabetes|cancer|hiv|asthma|tuberculosis|epilepsy)\b/i,
  /\b(?:i was diagnosed with|my diagnosis is)\s+\w+/i,
  /\b(?:i am pregnant and have diabetes|i am pregnant and have high blood pressure)\b/i,
  /(?:ስሜ|ዕድሜዬ|እድሜዬ|ክብደቴ|ቁመቴ|አድራሻዬ|ስልኬ|ኢሜይሌ)\s*(?:ነው|ይባላል)/,
  /የእኔ.*(?:ስም|አድራሻ|ስልክ)\s*(?:ነው|፡)/,
  /እርጉዝ ነኝ እና ደም ግፊት አለብኝ/,
];

export function containsLikelyPersonalDetails(question: string): boolean {
  return likelyPersonalDetailPatterns.some((pattern) => pattern.test(question));
}

export function getOpalPrivacyResponse(language: OpalLanguage): string {
  return language === "am"
    ? "ይህን መልዕክት ለግላዊነትዎ ወደ Gemini አልላክነውም። እባክዎ ስም፣ ዕድሜ፣ የመገናኛ ወይም የግል የጤና ዝርዝሮችን አስወግደው እንደ አጠቃላይ ጥያቄ ይጻፉ።"
    : "I didn’t send this message to Gemini to protect your privacy. Remove names, ages, contact details, and personal health information, then ask it as a general question.";
}

export function getOpalSafetyResponse(
  intent: Exclude<OpalSafetyIntent, "safe">,
  language: OpalLanguage,
): string {
  if (intent === "urgent") {
    return language === "am"
      ? "ይህ ጥያቄ አስቸኳይ ሊሆን የሚችል ምልክትን ይጠቁማል። ኦፓል አስቸኳይ ሁኔታን ሊገመግም አይችልም። እባክዎ በአካባቢዎ ያለውን የአስቸኳይ አገልግሎት ወይም ብቁ የጤና ባለሙያን ወዲያውኑ ያነጋግሩ።"
      : "This question may describe an urgent concern. Opal cannot assess emergencies. Please contact your local emergency service or a qualified health professional now.";
  }
  return language === "am"
    ? "ኦፓል ምርመራ፣ የመድኃኒት ምክር፣ የግል የካሎሪ/ንጥረ-ነገር ማዘዣ ወይም የግል ሕክምና ሊሰጥ አይችልም። ከብቁ የጤና ባለሙያ ጋር ይነጋገሩ። ኦፓል ከተዘጋጁ አጠቃላይ የጤና ትምህርቶች ጋር ብቻ ሊረዳ ይችላል።"
    : "Opal cannot diagnose, recommend medicine, provide individual clinical treatment, or calculate personal calorie/macronutrient prescriptions. Please speak with a qualified health professional. Opal can only help with prepared general learning topics.";
}
