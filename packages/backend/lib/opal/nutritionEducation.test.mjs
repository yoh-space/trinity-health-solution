import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateAdultBmr,
  calculateAdultNutritionReference,
  checkEducationalEligibility,
  PAL_FACTORS,
} from "./nutritionEducation.ts";

test("calculateAdultBmr computes male and female Mifflin-St Jeor correctly", () => {
  // Male: 10 * 70 + 6.25 * 175 - 5 * 30 + 5 = 700 + 1093.75 - 150 + 5 = 1648.75 -> 1649
  const bmrMale = calculateAdultBmr(70, 175, 30, "male");
  assert.equal(bmrMale, 1649);

  // Female: 10 * 60 + 6.25 * 165 - 5 * 25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 -> 1345
  const bmrFemale = calculateAdultBmr(60, 165, 25, "female");
  assert.equal(bmrFemale, 1345);
});

test("checkEducationalEligibility rejects minors (<18)", () => {
  const result = checkEducationalEligibility({
    ageYears: 16,
    weightKg: 55,
    heightCm: 160,
    sex: "female",
    activityLevel: "moderate",
  });
  assert.equal(result.eligible, false);
  assert.match(result.reason || "", /minors/i);
});

test("checkEducationalEligibility rejects pregnancy", () => {
  const result = checkEducationalEligibility({
    ageYears: 28,
    weightKg: 65,
    heightCm: 162,
    sex: "female",
    activityLevel: "light",
    isPregnant: true,
  });
  assert.equal(result.eligible, false);
  assert.match(result.reason || "", /pregnancy/i);
});

test("checkEducationalEligibility rejects lactation", () => {
  const result = checkEducationalEligibility({
    ageYears: 26,
    weightKg: 60,
    heightCm: 160,
    sex: "female",
    activityLevel: "moderate",
    isLactating: true,
  });
  assert.equal(result.eligible, false);
  assert.match(result.reason || "", /lactation/i);
});

test("checkEducationalEligibility rejects clinical conditions", () => {
  const result = checkEducationalEligibility({
    ageYears: 35,
    weightKg: 70,
    heightCm: 170,
    sex: "male",
    activityLevel: "sedentary",
    hasClinicalCondition: true,
  });
  assert.equal(result.eligible, false);
  assert.match(result.reason || "", /clinical/i);
});

test("calculateAdultNutritionReference calculates deterministic values for eligible adult", () => {
  const estimate = calculateAdultNutritionReference({
    ageYears: 30,
    weightKg: 70,
    heightCm: 175,
    sex: "male",
    activityLevel: "moderate", // 1.55
  });

  // BMR = 1649, PAL = 1.55 => TDEE = round(1649 * 1.55) = 2556
  assert.equal(estimate.bmrKcal, 1649);
  assert.equal(estimate.palFactor, 1.55);
  assert.equal(estimate.tdeeKcal, 2556);

  // Baseline protein: 70 * 0.8 = 56 g
  assert.equal(estimate.proteinReference.baselineGrams, 56);
  assert.deepEqual(estimate.proteinReference.activeRangeGrams, [70, 84]);

  // Macronutrients: 50% carbs, 20% protein, 30% fat
  assert.equal(estimate.sampleMacroDistribution.carbohydrates.percentageOfEnergy, 50);
  assert.equal(estimate.sampleMacroDistribution.protein.percentageOfEnergy, 20);
  assert.equal(estimate.sampleMacroDistribution.fat.percentageOfEnergy, 30);
  assert.ok(estimate.disclaimerEn.length > 20);
  assert.ok(estimate.disclaimerAm.length > 20);
});
