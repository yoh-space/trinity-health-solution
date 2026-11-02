/**
 * Educational Nutrition Reference & Calculation Standards
 *
 * Implements deterministic educational references for adult energy equations (Mifflin–St Jeor)
 * and macronutrient distributions as specified by standard public health education guidelines.
 *
 * SAFETY POLICY:
 * 1. Strictly educational reference only. Not an individualized clinical prescription or dietary therapy.
 * 2. Strictly gated: NOT eligible for minors (<18), pregnant individuals, lactating individuals,
 *    or clinical conditions. These populations must be referred to qualified healthcare providers.
 * 3. Never infer exact age from age bands or activity levels from qualitative categories. Exact validated
 *    inputs are mandatory when running educational calculations.
 */

export type BiologicalSex = "female" | "male";

export type PhysicalActivityLevel =
  | "sedentary" // 1.2
  | "light" // 1.375
  | "moderate" // 1.55
  | "very_active" // 1.725
  | "extra_active"; // 1.9

export interface NutritionEducationInput {
  ageYears: number;
  weightKg: number;
  heightCm: number;
  sex: BiologicalSex;
  activityLevel: PhysicalActivityLevel;
  isPregnant?: boolean;
  isLactating?: boolean;
  hasClinicalCondition?: boolean;
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
  reasonAm?: string;
}

export interface MacroDistribution {
  grams: number;
  calories: number;
  percentageOfEnergy: number;
}

export interface NutritionEducationEstimate {
  bmrKcal: number;
  palFactor: number;
  tdeeKcal: number;
  proteinReference: {
    baselineGrams: number; // 0.8 g/kg
    activeRangeGrams: [number, number]; // 1.0 - 1.2 g/kg
  };
  sampleMacroDistribution: {
    carbohydrates: MacroDistribution; // 50%
    protein: MacroDistribution; // 20%
    fat: MacroDistribution; // 30%
  };
  disclaimerEn: string;
  disclaimerAm: string;
}

export const PAL_FACTORS: Record<PhysicalActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

/**
 * Validates eligibility for general adult educational equations.
 */
export function checkEducationalEligibility(
  input: NutritionEducationInput,
): EligibilityResult {
  if (input.ageYears < 18) {
    return {
      eligible: false,
      reason:
        "Standard adult Mifflin-St Jeor equations do not apply to minors (<18). Children and adolescents have unique developmental and growth needs and should be guided by a pediatrician or clinical nutritionist.",
      reasonAm:
        "የአዋቂዎች የካሎሪ ስሌት ቀመሮች ከ18 ዓመት በታች ላሉ ታዳጊዎችና ህፃናት አይሰሩም። ለህፃናትና ወጣቶች እድገት ተገቢውን አመጋገብ ከህፃናት ሐኪም ወይም የጤና ባለሙያ ያግኙ።",
    };
  }

  if (input.isPregnant) {
    return {
      eligible: false,
      reason:
        "Pregnancy requires individualized maternal nutrition and clinical monitoring. General adult BMR formulas do not account for gestational development. Please consult your antenatal care provider.",
      reasonAm:
        "እርግዝና የተለየ የእናቶች እንክብካቤና የባለሙያ ክትትል ይፈልጋል። መደበኛ የአዋቂ ቀመሮች ለእርግዝና ተስማሚ አይደሉም። እባክዎ የቅድመ ወሊድ ክትትል የሚያደርጉለትን የጤና ባለሙያ ያማክሩ።",
    };
  }

  if (input.isLactating) {
    return {
      eligible: false,
      reason:
        "Lactation requires additional energy and fluid support tailored to breastfeeding stages. General adult formulas are not suitable. Please consult your maternal-child healthcare team.",
      reasonAm:
        "ጡት ማጥባት እንደ ደረጃው ተጨማሪ ጉልበትና ፈሳሽ ይፈልጋል። መደበኛ የአዋቂ ስሌቶች ለጡት አጥቢ እናቶች አይመከሩም። እባክዎ የጤና ባለሙያ ያማክሩ።",
    };
  }

  if (input.hasClinicalCondition) {
    return {
      eligible: false,
      reason:
        "Chronic or acute clinical health conditions require specialized medical nutrition therapy. Please consult a qualified clinical dietitian or physician.",
      reasonAm:
        "የጤና እክል ወይም ህመም ካለብዎት ልዩ የህክምና አመጋገብ ክትትል ያስፈልጋል። እባክዎ ብቁ የህክምና ወይም የአመጋገብ ባለሙያ ያማክሩ።",
    };
  }

  if (
    input.weightKg < 30 ||
    input.weightKg > 250 ||
    input.heightCm < 100 ||
    input.heightCm > 240
  ) {
    return {
      eligible: false,
      reason:
        "Provided height or weight is outside the physiological validation boundary for this educational reference.",
      reasonAm:
        "የቀረበው ቁመት ወይም ክብደት ለዚህ ትምህርታዊ ማመሳከሪያ ከተፈቀደው ወሰን ውጭ ነው።",
    };
  }

  return { eligible: true };
}

/**
 * Calculates Mifflin-St Jeor adult BMR:
 * - Male: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
 * - Female: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
 */
export function calculateAdultBmr(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  sex: BiologicalSex,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  const bmr = sex === "male" ? base + 5 : base - 161;
  return Math.round(bmr);
}

/**
 * Computes deterministic adult educational estimate.
 * Throws if the input is not eligible according to safety policy.
 */
export function calculateAdultNutritionReference(
  input: NutritionEducationInput,
): NutritionEducationEstimate {
  const eligibility = checkEducationalEligibility(input);
  if (!eligibility.eligible) {
    throw new Error(eligibility.reason || "Ineligible for educational nutrition calculation");
  }

  const bmrKcal = calculateAdultBmr(
    input.weightKg,
    input.heightCm,
    input.ageYears,
    input.sex,
  );

  const palFactor = PAL_FACTORS[input.activityLevel];
  const tdeeKcal = Math.round(bmrKcal * palFactor);

  // Baseline protein: 0.8 g/kg
  const baselineGrams = Math.round(input.weightKg * 0.8 * 10) / 10;
  // Active range: 1.0 - 1.2 g/kg
  const activeRangeGrams: [number, number] = [
    Math.round(input.weightKg * 1.0 * 10) / 10,
    Math.round(input.weightKg * 1.2 * 10) / 10,
  ];

  // Sample illustrative distribution: 50% Carbs (4 kcal/g), 20% Protein (4 kcal/g), 30% Fat (9 kcal/g)
  const carbCalories = Math.round(tdeeKcal * 0.5);
  const carbGrams = Math.round(carbCalories / 4);

  const proteinCalories = Math.round(tdeeKcal * 0.2);
  const proteinGrams = Math.round(proteinCalories / 4);

  const fatCalories = Math.round(tdeeKcal * 0.3);
  const fatGrams = Math.round(fatCalories / 9);

  return {
    bmrKcal,
    palFactor,
    tdeeKcal,
    proteinReference: {
      baselineGrams,
      activeRangeGrams,
    },
    sampleMacroDistribution: {
      carbohydrates: {
        calories: carbCalories,
        grams: carbGrams,
        percentageOfEnergy: 50,
      },
      protein: {
        calories: proteinCalories,
        grams: proteinGrams,
        percentageOfEnergy: 20,
      },
      fat: {
        calories: fatCalories,
        grams: fatGrams,
        percentageOfEnergy: 30,
      },
    },
    disclaimerEn:
      "This is an educational reference estimate based on public health population formulas (Mifflin–St Jeor), not an individualized prescription or dietary plan. Actual metabolic requirements vary with genetics, health status, and goals. Speak with a qualified nutritionist or healthcare provider for personal guidance.",
    disclaimerAm:
      "ይህ መረጃ በትምህርታዊ የህዝብ ጤና ቀመሮች (Mifflin-St Jeor) ላይ የተመሰረተ ግምታዊ ማመሳከሪያ ብቻ እንጂ የግል የአመጋገብ ማዘዣ ወይም የህክምና እቅድ አይደለም። ትክክለኛ የሰውነት ፍላጎት በጤና ሁኔታና በልዩ ልዩ ምክንያቶች ይለያያል። ለግል ምክር ብቁ የአመጋገብ ወይም የጤና ባለሙያ ያማክሩ።",
  };
}
