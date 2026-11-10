export type FormulaSex = "male" | "female";

export type ActivityLevel =
  | "sedentaryConfined"
  | "verySedentary"
  | "sedentary"
  | "light"
  | "lightModerate"
  | "moderate"
  | "heavy"
  | "veryHeavy";

export type EnergyEstimateInput = {
  age: number;
  sex: FormulaSex;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
};

export type EnergyEstimate = {
  bmr: number;
  tdee: number;
  proteinGrams: number;
  fatGrams: { min: number; max: number };
  carbohydrateGrams: { min: number; max: number };
};

export const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentaryConfined: 1.2,
  verySedentary: 1.4,
  sedentary: 1.5,
  light: 1.6,
  lightModerate: 1.7,
  moderate: 1.8,
  heavy: 2,
  veryHeavy: 2.2,
};

export function calculateEnergyEstimate(
  input: EnergyEstimateInput,
): EnergyEstimate | null {
  const { age, sex, heightCm, weightKg, activity } = input;
  if (
    !Number.isInteger(age) ||
    age < 18 ||
    age > 100 ||
    !Object.hasOwn(ACTIVITY_FACTORS, activity) ||
    !Number.isFinite(heightCm) ||
    heightCm < 100 ||
    heightCm > 250 ||
    !Number.isFinite(weightKg) ||
    weightKg < 25 ||
    weightKg > 300
  ) {
    return null;
  }

  const bmr =
    10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
  const tdee = bmr * ACTIVITY_FACTORS[activity];

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    proteinGrams: Math.round(weightKg * 0.8),
    fatGrams: {
      min: Math.round((tdee * 0.2 * 10) / 9) / 10,
      max: Math.round((tdee * 0.35 * 10) / 9) / 10,
    },
    carbohydrateGrams: {
      min: Math.round((tdee * 0.45) / 4),
      max: Math.round((tdee * 0.65) / 4),
    },
  };
}
