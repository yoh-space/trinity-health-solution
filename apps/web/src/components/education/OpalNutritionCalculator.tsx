"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Phone, Calculator, HeartPulse } from "lucide-react";
import {
  ACTIVITY_FACTORS,
  calculateEnergyEstimate,
  type ActivityLevel,
  type FormulaSex,
} from "@/lib/nutrition/energyEstimate";

const TEAM_PHONE = "+251988720194";
type SavedProfile = {
  audience: string;
  age: string;
  ageYears?: number;
  formulaSex?: FormulaSex;
  heightCm?: number;
  weightKg?: number;
  activity: string;
  support: string[];
};
const LEGACY_ACTIVITY_FACTORS: Record<string, ActivityLevel> = {
  seated: "sedentaryConfined",
  sedentaryActivity: "sedentary",
  lightActivity: "light",
  moderateActivity: "moderate",
  moderate: "lightModerate",
  active: "heavy",
};

export function OpalNutritionCalculator({
  language,
  hasSavedProfile,
}: {
  language: "en" | "am";
  hasSavedProfile: boolean;
}) {
  const am = language === "am";
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<FormulaSex | "">("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("sedentaryConfined");
  const [pregnant, setPregnant] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [useSavedProfile, setUseSavedProfile] = useState(false);
  const [result, setResult] =
    useState<ReturnType<typeof calculateEnergyEstimate>>(null);
  const [error, setError] = useState("");
  const savedProfile = useQuery(
    anyApi.onboarding.getProfile,
    useSavedProfile && hasSavedProfile ? {} : "skip",
  ) as SavedProfile | null | undefined;

  const savedActivity =
    savedProfile &&
    (savedProfile.activity in ACTIVITY_FACTORS
      ? (savedProfile.activity as ActivityLevel)
      : LEGACY_ACTIVITY_FACTORS[savedProfile.activity]);
  const savedProfileIsOutOfScope =
    savedProfile &&
    (savedProfile.audience !== "myself" ||
      !["age18to39", "age40to59", "age60plus"].includes(savedProfile.age) ||
      savedProfile.support.some((item) =>
        ["pregnancy", "diabetes", "breastfeeding"].includes(item),
      ));
  const copySavedProfileToManualInputs = () => {
    if (!savedProfile) return;
    setAge(savedProfile.ageYears?.toString() ?? "");
    setSex(savedProfile.formulaSex ?? "");
    setHeightCm(savedProfile.heightCm?.toString() ?? "");
    setWeightKg(savedProfile.weightKg?.toString() ?? "");
    setActivity(savedActivity ?? "sedentaryConfined");
  };
  const switchToManualInputs = () => {
    if (useSavedProfile) copySavedProfileToManualInputs();
    setUseSavedProfile(false);
  };

  const calculate = () => {
    setError("");
    setResult(null);
    if (
      pregnant ||
      diabetes ||
      breastfeeding ||
      (useSavedProfile &&
        (!savedProfile || savedProfileIsOutOfScope || !savedActivity))
    )
      return;
    const inputs =
      useSavedProfile && savedProfile
        ? {
            age: savedProfile.ageYears ?? Number(age),
            sex: savedProfile.formulaSex ?? sex,
            heightCm: savedProfile.heightCm ?? Number(heightCm),
            weightKg: savedProfile.weightKg ?? Number(weightKg),
            activity: savedActivity ?? activity,
          }
        : {
            age: Number(age),
            sex,
            heightCm: Number(heightCm),
            weightKg: Number(weightKg),
            activity,
          };
    if (
      !inputs.sex ||
      !Number.isFinite(inputs.age) ||
      !Number.isFinite(inputs.heightCm) ||
      !Number.isFinite(inputs.weightKg)
    ) {
      setError(am ? "የሚያስፈልጉትን መረጃዎች ይሙሉ።" : "Complete all calculator fields.");
      return;
    }

    const estimate = calculateEnergyEstimate({
      ...inputs,
      sex: inputs.sex,
    });
    if (!estimate) {
      setError(
        am
          ? "ይህ ግምት ለ18–100 ዓመት አዋቂዎች ብቻ ነው። ቁመት 100–250 ሴ.ሜ እና ክብደት 25–300 ኪ.ግ ያስገቡ።"
          : "This estimate is for adults aged 18–100 only. Enter height from 100–250 cm and weight from 25–300 kg.",
      );
      return;
    }
    setResult(estimate);
  };

  const blocked =
    pregnant ||
    diabetes ||
    breastfeeding ||
    Boolean(
      useSavedProfile &&
      (!savedProfile || savedProfileIsOutOfScope || !savedActivity),
    );

  return (
    <section className="mb-6 rounded-2xl border border-[#dce8de] bg-white p-4 shadow-2xs sm:p-5">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf2e9] text-[#1c573e]">
          <Calculator size={19} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-[#1c3c29]">
            {am ? "አጠቃላይ የአዋቂ አመጋገብ ግምት" : "General adult nutrition estimate"}
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#65766a]">
            {am
              ? "በእጅ ያስገቡት መረጃ አይቀመጥም ወይም ወደ Gemini አይላክም። የተቀመጠውን መገለጫ መጠቀም የሚቻለው እርስዎ ከመረጡ ብቻ ነው።"
              : "Manual inputs are not saved or sent to Gemini. Saved onboarding details load only if you opt in below."}
          </p>
        </div>
      </div>

      {hasSavedProfile && (
        <label className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#52685a]">
          <input
            type="checkbox"
            checked={useSavedProfile}
            onChange={(event) => {
              const checked = event.target.checked;
              if (!checked) {
                copySavedProfileToManualInputs();
              }
              setUseSavedProfile(checked);
              setResult(null);
            }}
            className="mt-1 accent-[#1c573e]"
          />
          <span>
            {am
              ? "በዚህ ግምት ውስጥ የተቀመጡትን የእኔን ዕድሜ፣ ቁመት፣ ክብደትና እንቅስቃሴ መረጃ በአካባቢው ይጠቀሙ። ወደ Gemini አይላክም።"
              : "Use my saved age, height, weight, and activity for this estimate. They are used locally and are not sent to Gemini."}
          </span>
        </label>
      )}

      {useSavedProfile && savedProfile === undefined && (
        <p role="status" className="mt-3 text-xs text-[#718276]">
          {am ? "መገለጫው እየተጫነ ነው..." : "Loading saved profile…"}
        </p>
      )}

      {useSavedProfile && savedProfile === null && (
        <p role="alert" className="mt-3 text-xs text-[#9b3b2b]">
          {am
            ? "የተቀመጠው መገለጫ አልተገኘም። የመገለጫ ምርጫውን ያጥፉና መረጃዎን በእጅ ያስገቡ።"
            : "Saved profile not found. Turn off profile use and enter details manually."}
        </p>
      )}

      {useSavedProfile && savedProfile && !savedActivity && (
        <p role="alert" className="mt-3 text-xs text-[#9b3b2b]">
          {am
            ? "የተቀመጠው የእንቅስቃሴ ደረጃ አይታወቅም። የመገለጫ ምርጫውን ያጥፉና ደረጃውን በእጅ ይምረጡ።"
            : "The saved activity level is not recognized. Turn off profile use and choose an activity level manually."}
        </p>
      )}

      {useSavedProfile && savedProfileIsOutOfScope && (
        <div className="mt-4 rounded-xl border border-[#ead4c6] bg-[#fff9f5] p-3 text-xs leading-5 text-[#684536]">
          <p>
            {am
              ? "የተቀመጠው መገለጫ ይህን አጠቃላይ የአዋቂ ግምት ለማድረግ አይመጥንም። ለግል መመሪያ የጤና ባለሙያ ያነጋግሩ።"
              : "Your saved profile is outside the scope of this general adult estimate. Contact a health professional for individual guidance."}
          </p>
          <a
            href={`tel:${TEAM_PHONE}`}
            className="mt-2 inline-flex items-center gap-1.5 font-bold text-[#1c573e] underline"
          >
            <Phone size={13} aria-hidden="true" /> +251 98 872 0194
          </a>
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-semibold text-[#405647]">
          {am ? "ዕድሜ (ዓመት)" : "Age (years)"}
          <input
            type="number"
            min="18"
            max="100"
            value={
              useSavedProfile && savedProfile?.ageYears !== undefined
                ? String(savedProfile.ageYears)
                : age
            }
            onChange={(event) => {
              switchToManualInputs();
              setAge(event.target.value);
            }}
            className="rounded-lg border border-[#cfddd1] px-3 py-2 text-sm font-normal text-[#183b2d]"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-[#405647]">
          {am ? "እንቅስቃሴ" : "Activity level"}
          <select
            value={useSavedProfile ? (savedActivity ?? activity) : activity}
            onChange={(event) => {
              switchToManualInputs();
              setActivity(event.target.value as ActivityLevel);
            }}
            className="rounded-lg border border-[#cfddd1] bg-white px-3 py-2 text-sm font-normal text-[#183b2d]"
          >
            <option value="sedentaryConfined">
              {am ? "ተቀምጦ / ተገድቦ · 1.2" : "Sedentary / confined · 1.2"}
            </option>
            <option value="verySedentary">
              {am ? "እጅግ ተቀምጦ · 1.4" : "Very sedentary · 1.4"}
            </option>
            <option value="sedentary">
              {am ? "ተቀምጦ · 1.5" : "Sedentary · 1.5"}
            </option>
            <option value="light">{am ? "ቀላል · 1.6" : "Light · 1.6"}</option>
            <option value="lightModerate">
              {am ? "ቀላል-መካከለኛ · 1.7" : "Light-moderate · 1.7"}
            </option>
            <option value="moderate">
              {am ? "መካከለኛ · 1.8" : "Moderate · 1.8"}
            </option>
            <option value="heavy">{am ? "ከባድ · 2.0" : "Heavy · 2.0"}</option>
            <option value="veryHeavy">
              {am ? "እጅግ ከባድ · 2.2" : "Very heavy · 2.2"}
            </option>
          </select>
        </label>
        <fieldset className="grid gap-1 text-xs font-semibold text-[#405647]">
          <legend>{am ? "ለቀመሩ የሚመረጠው" : "Equation option"}</legend>
          <div className="flex gap-2">
            {(["female", "male"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={
                  sex === value ||
                  (useSavedProfile && savedProfile?.formulaSex === value)
                }
                onClick={() => {
                  switchToManualInputs();
                  setSex(value);
                }}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                  sex === value ||
                  (useSavedProfile && savedProfile?.formulaSex === value)
                    ? "border-[#1c573e] bg-[#eaf2e9] text-[#1c573e]"
                    : "border-[#cfddd1] bg-white text-[#52685a]"
                }`}
              >
                {value === "female"
                  ? am
                    ? "ሴት"
                    : "Female equation"
                  : am
                    ? "ወንድ"
                    : "Male equation"}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="grid grid-cols-2 gap-2">
          <label className="grid gap-1 text-xs font-semibold text-[#405647]">
            {am ? "ቁመት (ሴ.ሜ)" : "Height (cm)"}
            <input
              type="number"
              min="100"
              max="250"
              value={
                useSavedProfile && savedProfile?.heightCm !== undefined
                  ? String(savedProfile.heightCm)
                  : heightCm
              }
              onChange={(event) => {
                switchToManualInputs();
                setHeightCm(event.target.value);
              }}
              className="rounded-lg border border-[#cfddd1] px-3 py-2 text-sm font-normal text-[#183b2d]"
            />
          </label>
          <label className="grid gap-1 text-xs font-semibold text-[#405647]">
            {am ? "ክብደት (ኪ.ግ)" : "Weight (kg)"}
            <input
              type="number"
              min="25"
              max="300"
              value={
                useSavedProfile && savedProfile?.weightKg !== undefined
                  ? String(savedProfile.weightKg)
                  : weightKg
              }
              onChange={(event) => {
                switchToManualInputs();
                setWeightKg(event.target.value);
              }}
              className="rounded-lg border border-[#cfddd1] px-3 py-2 text-sm font-normal text-[#183b2d]"
            />
          </label>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={pregnant}
          onClick={() => {
            setPregnant((value) => !value);
            setResult(null);
          }}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${pregnant ? "border-[#9b593e] bg-[#fbf0e9] text-[#84442d]" : "border-[#d3dfd4] text-[#52685a]"}`}
        >
          {am ? "እርጉዝ ነኝ" : "Pregnant"}
        </button>
        <button
          type="button"
          aria-pressed={diabetes}
          onClick={() => {
            setDiabetes((value) => !value);
            setResult(null);
          }}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${diabetes ? "border-[#9b593e] bg-[#fbf0e9] text-[#84442d]" : "border-[#d3dfd4] text-[#52685a]"}`}
        >
          {am ? "የስኳር በሽታ አለብኝ" : "I have diabetes"}
        </button>
        <button
          type="button"
          aria-pressed={breastfeeding}
          onClick={() => {
            setBreastfeeding((value) => !value);
            setResult(null);
          }}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${breastfeeding ? "border-[#9b593e] bg-[#fbf0e9] text-[#84442d]" : "border-[#d3dfd4] text-[#52685a]"}`}
        >
          {am ? "ጡት እያጠባሁ ነው" : "Breastfeeding"}
        </button>
        <button
          type="button"
          onClick={calculate}
          disabled={blocked || Boolean(useSavedProfile && !savedProfile)}
          className="inline-flex items-center gap-2 rounded-full bg-[#1c573e] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Calculator size={14} aria-hidden="true" />
          {am ? "ግምት አስላ" : "Calculate estimate"}
        </button>
      </div>

      {blocked && (
        <div className="mt-4 rounded-xl border border-[#ead4c6] bg-[#fff9f5] p-3 text-xs leading-5 text-[#684536]">
          <p className="font-semibold">
            {am
              ? "ይህ አጠቃላይ ቀመር ለእርግዝና፣ ጡት ማጥባት ወይም ለስኳር በሽታ የግል ግቦችን አይሰጥም። የስኳር በሽታን ማስላት ወይም መመርመር አይችልም።"
              : "This general calculator does not set personal targets for pregnancy, breastfeeding, or diabetes. It cannot calculate or diagnose diabetes."}
          </p>
          <p className="mt-1">
            {am
              ? "ለግል መመሪያ የጤና ቡድናችንን ያነጋግሩ።"
              : "Contact our care team for individual guidance."}
          </p>
          <a
            href={`tel:${TEAM_PHONE}`}
            className="mt-2 inline-flex items-center gap-1.5 font-bold text-[#1c573e] underline"
          >
            <Phone size={13} aria-hidden="true" /> +251 98 872 0194
          </a>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-3 text-xs text-[#9b3b2b]">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 grid gap-3 rounded-xl bg-[#f4f8f3] p-3 text-xs text-[#405647] sm:grid-cols-2">
          <p>
            <strong>{am ? "BMR" : "BMR"}:</strong> {result.bmr} kcal/day
          </p>
          <p>
            <strong>{am ? "TDEE ግምት" : "Estimated TDEE"}:</strong> {result.tdee}{" "}
            kcal/day
          </p>
          <p>
            <strong>{am ? "ፕሮቲን" : "Protein"}:</strong> about{" "}
            {result.proteinGrams} g/day (0.8 g/kg)
          </p>
          <p>
            <strong>{am ? "ስብ" : "Fat"}:</strong> {result.fatGrams.min}–
            {result.fatGrams.max} g/day (20–35% energy)
          </p>
          <p className="sm:col-span-2">
            <strong>{am ? "ካርቦሃይድሬት" : "Carbohydrate"}:</strong>{" "}
            {result.carbohydrateGrams.min}–{result.carbohydrateGrams.max} g/day
            (45–65% energy)
          </p>
          <p className="sm:col-span-2 border-t border-[#dce8de] pt-2 leading-5">
            {am
              ? "ይህ ግምት ነው፣ የሕክምና ወይም የግል የአመጋገብ ዕቅድ አይደለም። የካርቦሃይድሬትና የስብ ክልሎች ተለያይተው የተገለጹ አጠቃላይ መመሪያዎች ናቸው።"
              : "These are estimates, not a medical or individualized meal plan. Carbohydrate and fat ranges are broad references shown separately, not a combined prescription."}
          </p>
          <span className="sm:col-span-2 inline-flex items-center gap-1.5 text-[#718276]">
            <HeartPulse size={13} aria-hidden="true" />
            {am
              ? "ለግል ጥያቄዎች የጤና ባለሙያን ያማክሩ።"
              : "Ask a health professional about personal concerns."}
          </span>
        </div>
      )}
    </section>
  );
}
