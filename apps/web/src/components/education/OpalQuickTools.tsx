"use client";

import { useState } from "react";
import {
  Activity,
  Droplets,
  Baby,
  Calculator,
  ChevronDown,
  PhoneCall,
  HeartPulse,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  ACTIVITY_FACTORS,
  calculateEnergyEstimate,
  type ActivityLevel,
  type FormulaSex,
} from "@/lib/nutrition/energyEstimate";

interface OpalQuickToolsProps {
  language: "en" | "am";
  onSelectPrompt?: (text: string) => void;
}

export function OpalQuickTools({ language, onSelectPrompt }: OpalQuickToolsProps) {
  const am = language === "am";

  // Calculator Form State
  const [calcOpen, setCalcOpen] = useState(true);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<FormulaSex | "">("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("sedentaryConfined");
  const [pregnant, setPregnant] = useState(false);
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [diabetes, setDiabetes] = useState(false);
  const [calcResult, setCalcResult] = useState<ReturnType<typeof calculateEnergyEstimate>>(null);
  const [calcError, setCalcError] = useState("");

  // Accordion tabs
  const [infantOpen, setInfantOpen] = useState(false);
  const [waterOpen, setWaterOpen] = useState(false);

  const blocked = pregnant || breastfeeding || diabetes;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalcError("");
    setCalcResult(null);

    if (blocked) return;

    const numAge = Number(age);
    const numHeight = Number(heightCm);
    const numWeight = Number(weightKg);

    if (!age || isNaN(numAge) || numAge < 18 || numAge > 120) {
      setCalcError(am ? "እባክዎ ዕድሜዎን (18-120) በትክክል ያስገቡ።" : "Enter a valid adult age (18–120).");
      return;
    }
    if (!sex) {
      setCalcError(am ? "እባክዎ ጾታ ይምረጡ።" : "Select sex for the biological formula.");
      return;
    }
    if (!heightCm || isNaN(numHeight) || numHeight < 100 || numHeight > 250) {
      setCalcError(am ? "እባክዎ ቁመትዎን በሴንቲሜትር ያስገቡ።" : "Enter height in cm (100–250).");
      return;
    }
    if (!weightKg || isNaN(numWeight) || numWeight < 30 || numWeight > 300) {
      setCalcError(am ? "እባክዎ ክብደትዎን በኪሎግራም ያስገቡ።" : "Enter weight in kg (30–300).");
      return;
    }

    try {
      const res = calculateEnergyEstimate({
        age: numAge,
        sex,
        heightCm: numHeight,
        weightKg: numWeight,
        activity,
      });
      setCalcResult(res);
    } catch {
      setCalcError(am ? "ስሌቱን ማጠናቀቅ አልተቻለም።" : "Could not complete estimate.");
    }
  };

  const handleResetCalc = () => {
    setAge("");
    setSex("");
    setHeightCm("");
    setWeightKg("");
    setActivity("sedentaryConfined");
    setPregnant(false);
    setBreastfeeding(false);
    setDiabetes(false);
    setCalcResult(null);
    setCalcError("");
  };

  return (
    <div className="space-y-4">
      {/* 1. Daily Energy & Macronutrient Estimator */}
      <section className="rounded-3xl border border-[#d8e3d6] bg-white p-5 sm:p-6 shadow-xs">
        <button
          type="button"
          onClick={() => setCalcOpen(!calcOpen)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#1c573e]">
              <Activity size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#163826]">
                {am ? "የዕለታዊ ሃይል እና ንጥረ-ምግብ ግምት" : "Daily Energy & Macro Estimator"}
              </h3>
              <p className="text-[11px] text-[#637d6a]">
                {am ? "በ 1-ክሊክ ፈጣን የካሎሪና ማክሮ ስሌት" : "1-click adult nutrition reference"}
              </p>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#637d6a] transition-transform duration-200 ${
              calcOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {calcOpen && (
          <form onSubmit={handleCalculate} className="mt-5 space-y-4 border-t border-[#edf3ec] pt-4">
            {/* Input Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#405647] mb-1">
                  {am ? "ዕድሜ (ዓመት)" : "Age (years)"}
                </label>
                <input
                  type="number"
                  min="18"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="28"
                  className="w-full rounded-xl border border-[#cbd8cb] bg-[#fbfdfa] px-3 py-2 text-xs text-[#183b2d] focus:border-[#1c573e] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#405647] mb-1">
                  {am ? "ጾታ" : "Sex"}
                </label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as FormulaSex)}
                  className="w-full rounded-xl border border-[#cbd8cb] bg-[#fbfdfa] px-3 py-2 text-xs text-[#183b2d] focus:border-[#1c573e] focus:bg-white focus:outline-hidden"
                >
                  <option value="">{am ? "ይምረጡ" : "Select"}</option>
                  <option value="female">{am ? "ሴት" : "Female"}</option>
                  <option value="male">{am ? "ወንድ" : "Male"}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#405647] mb-1">
                  {am ? "ቁመት (ሴ.ሜ)" : "Height (cm)"}
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="165"
                  className="w-full rounded-xl border border-[#cbd8cb] bg-[#fbfdfa] px-3 py-2 text-xs text-[#183b2d] focus:border-[#1c573e] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#405647] mb-1">
                  {am ? "ክብደት (ኪ.ግ)" : "Weight (kg)"}
                </label>
                <input
                  type="number"
                  min="30"
                  max="300"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  placeholder="62"
                  className="w-full rounded-xl border border-[#cbd8cb] bg-[#fbfdfa] px-3 py-2 text-xs text-[#183b2d] focus:border-[#1c573e] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-[11px] font-semibold text-[#405647] mb-1">
                {am ? "የእንቅስቃሴ መጠን" : "Activity Level"}
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="w-full rounded-xl border border-[#cbd8cb] bg-[#fbfdfa] px-3 py-2 text-xs text-[#183b2d] focus:border-[#1c573e] focus:bg-white focus:outline-hidden"
              >
                <option value="sedentaryConfined">
                  {am ? "አብዛኛውን ጊዜ ተቀምጦ (ቀላል)" : "Sedentary / Desk work"}
                </option>
                <option value="sedentary">
                  {am ? "መጠነኛ የእግር ጉዞ ያለው" : "Light walking during day"}
                </option>
                <option value="light">
                  {am ? "ቀላል ስፖርት ወይም የቤት ስራ" : "Light exercise / Active household"}
                </option>
                <option value="lightModerate">
                  {am ? "መካከለኛ እንቅስቃሴ (በሳምንት 3-4 ቀን)" : "Moderate workout (3–4 days/wk)"}
                </option>
                <option value="heavy">
                  {am ? "ከፍተኛ የጉልበት ስራ ወይም አትሌቲክስ" : "Heavy physical labor / High training"}
                </option>
              </select>
            </div>

            {/* Special Conditions Toggle */}
            <div className="rounded-2xl border border-[#e8efe6] bg-[#f8faf7] p-3 text-xs">
              <span className="block text-[11px] font-bold text-[#35523f] mb-1.5">
                {am ? "ልዩ ሁኔታዎች ካሉ ምልክት ያድርጉ" : "Special conditions:"}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPregnant(!pregnant)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    pregnant
                      ? "bg-[#8f5a14] text-white"
                      : "border border-[#cbd8cb] bg-white text-[#4f6756]"
                  }`}
                >
                  {am ? "እርጉዝ" : "Pregnant"}
                </button>
                <button
                  type="button"
                  onClick={() => setBreastfeeding(!breastfeeding)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    breastfeeding
                      ? "bg-[#8f5a14] text-white"
                      : "border border-[#cbd8cb] bg-white text-[#4f6756]"
                  }`}
                >
                  {am ? "ጡት እያጠባሁ" : "Breastfeeding"}
                </button>
                <button
                  type="button"
                  onClick={() => setDiabetes(!diabetes)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
                    diabetes
                      ? "bg-[#8f5a14] text-white"
                      : "border border-[#cbd8cb] bg-white text-[#4f6756]"
                  }`}
                >
                  {am ? "ስኳር በሽታ" : "Diabetes"}
                </button>
              </div>
            </div>

            {/* Condition Warning / Hotline Referral */}
            {blocked && (
              <div className="rounded-2xl border border-[#f0dac8] bg-[#fdf7f2] p-3 text-xs text-[#7d4826]">
                <div className="flex items-start gap-2">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-[#b2572b]" />
                  <p className="leading-relaxed">
                    {am
                      ? "ለእርግዝና፣ ጡት ማጥባት ወይም ለስኳር በሽታ ይህ አጠቃላይ ቀመር አይሰራም። ለትክክለኛ ክሊኒካዊ ምክር ቡድናችንን ያግኙ።"
                      : "General mathematical formulas cannot calculate customized targets for pregnancy, lactation, or diabetes."}
                  </p>
                </div>
                <a
                  href="tel:+251988720194"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#1c573e] hover:underline"
                >
                  <PhoneCall size={12} />
                  <span>+251 98 872 0194 (Trinity Care Desk)</span>
                </a>
              </div>
            )}

            {calcError && (
              <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-xl">
                {calcError}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={blocked}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1c573e] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#154631] transition disabled:opacity-50"
              >
                <Calculator size={14} />
                <span>{am ? "ግምት አስላ" : "Calculate"}</span>
              </button>

              {(calcResult || age || heightCm || weightKg) && (
                <button
                  type="button"
                  onClick={handleResetCalc}
                  className="rounded-xl border border-[#cbd8cb] p-2.5 text-[#5e7765] hover:bg-[#f6faf5]"
                  title={am ? "አጽዳ" : "Reset"}
                >
                  <RotateCcw size={14} />
                </button>
              )}
            </div>

            {/* Results Grid */}
            {calcResult && (
              <div className="rounded-2xl border border-[#d2e4d0] bg-[#f4f9f3] p-3.5 space-y-2.5 text-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#d8e8d6] pb-2">
                  <span className="text-[#55705d]">{am ? "የተገመተ TDEE" : "Estimated TDEE"}</span>
                  <span className="font-extrabold text-[#163826] text-sm">
                    {calcResult.tdee} kcal/day
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                  <div className="rounded-xl bg-white p-2 border border-[#dce8da]">
                    <span className="block text-[10px] text-[#698572] font-semibold">
                      {am ? "ፕሮቲን" : "Protein"}
                    </span>
                    <span className="text-xs font-bold text-[#1c573e]">
                      ~{calcResult.proteinGrams}g
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-2 border border-[#dce8da]">
                    <span className="block text-[10px] text-[#698572] font-semibold">
                      {am ? "ስብ" : "Fats"}
                    </span>
                    <span className="text-xs font-bold text-[#1c573e]">
                      {calcResult.fatGrams.min}-{calcResult.fatGrams.max}g
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-2 border border-[#dce8da]">
                    <span className="block text-[10px] text-[#698572] font-semibold">
                      {am ? "ካርቦሃይድሬት" : "Carbs"}
                    </span>
                    <span className="text-xs font-bold text-[#1c573e]">
                      {calcResult.carbohydrateGrams.min}-{calcResult.carbohydrateGrams.max}g
                    </span>
                  </div>
                </div>

                <p className="text-[10px] leading-relaxed text-[#68826f] pt-1">
                  {am
                    ? "ማስታወሻ፡ ይህ አጠቃላይ ግምት ነው፤ የግል የምግብ እቅድ አይደለም።"
                    : "Broad educational estimate. Not an individualized meal prescription."}
                </p>
              </div>
            )}
          </form>
        )}
      </section>

      {/* 2. Infant & Young Child Feeding Quick Reference */}
      <section className="rounded-3xl border border-[#d8e3d6] bg-white p-5 shadow-xs">
        <button
          type="button"
          onClick={() => setInfantOpen(!infantOpen)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#1c573e]">
              <Baby size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#163826]">
                {am ? "የህፃናት ተጨማሪ ምግብ ደረጃዎች" : "Infant Feeding Milestones"}
              </h3>
              <p className="text-[11px] text-[#637d6a]">
                {am ? "ዕድሜን መሰረት ያደረገ የአመጋገብ መመሪያ" : "Ethiopian complementary feeding protocol"}
              </p>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#637d6a] transition-transform duration-200 ${
              infantOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {infantOpen && (
          <div className="mt-4 border-t border-[#edf3ec] pt-3 space-y-2 text-xs">
            <div className="rounded-xl bg-[#f8faf7] p-2.5 border border-[#e5ede3]">
              <span className="font-bold text-[#1c573e] block text-[11px]">
                {am ? "0 – 6 ወራት" : "0 – 6 Months"}
              </span>
              <p className="text-[#45604e] text-[11px] mt-0.5 leading-relaxed">
                {am
                  ? "የእናት ጡት ወተት ብቻ (ውሃ እንኳን አያስፈልግም)።"
                  : "Exclusive breastfeeding on demand. No water, tea, or other fluids."}
              </p>
            </div>

            <div className="rounded-xl bg-[#f8faf7] p-2.5 border border-[#e5ede3]">
              <span className="font-bold text-[#1c573e] block text-[11px]">
                {am ? "6 – 8 ወራት" : "6 – 8 Months"}
              </span>
              <p className="text-[#45604e] text-[11px] mt-0.5 leading-relaxed">
                {am
                  ? "የተፈጨ አጃ፣ የተፈጨ ድንችና ካሮት (በቀን 2-3 ጊዜ) ከጡት ወተት ጋር።"
                  : "Soft mashes (oats, carrots, potatoes, lentils) 2–3 times daily alongside breastmilk."}
              </p>
            </div>

            <div className="rounded-xl bg-[#f8faf7] p-2.5 border border-[#e5ede3]">
              <span className="font-bold text-[#1c573e] block text-[11px]">
                {am ? "9 – 24 ወራት" : "9 – 24 Months"}
              </span>
              <p className="text-[#45604e] text-[11px] mt-0.5 leading-relaxed">
                {am
                  ? "የተፈጨ እንቁላል፣ ጥራጥሬዎችና የቤተሰብ ምግብ (በቀን 3-4 ጊዜ) + ጤናማ መክሰስ።"
                  : "Chopped family foods, well-cooked eggs, legumes, soft fruits + 1–2 healthy snacks."}
              </p>
            </div>

            {onSelectPrompt && (
              <button
                type="button"
                onClick={() =>
                  onSelectPrompt(
                    am
                      ? "ለ 6 ወር ህጻን ምን አይነት ተጨማሪ ምግብ መስጠት አለብኝ?"
                      : "What should I feed my 6-month-old infant?"
                  )
                }
                className="w-full text-center py-2 text-xs font-bold text-[#1c573e] hover:underline"
              >
                {am ? "ስለ ህፃናት ተጨማሪ ምግብ ኦፓልን ጠይቁ →" : "Ask Opal about infant meals →"}
              </button>
            )}
          </div>
        )}
      </section>

      {/* 3. Safe Drinking Water Protocol */}
      <section className="rounded-3xl border border-[#d8e3d6] bg-white p-5 shadow-xs">
        <button
          type="button"
          onClick={() => setWaterOpen(!waterOpen)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eaf4eb] text-[#1c573e]">
              <Droplets size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#163826]">
                {am ? "አስተማማኝ የመጠጥ ውሃ ፕሮቶኮል" : "Safe Drinking Water Guide"}
              </h3>
              <p className="text-[11px] text-[#637d6a]">
                {am ? "የውሃ ማጣራትና አያያዝ ዘዴዎች" : "3-step household purification checklist"}
              </p>
            </div>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#637d6a] transition-transform duration-200 ${
              waterOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {waterOpen && (
          <div className="mt-4 border-t border-[#edf3ec] pt-3 space-y-2 text-xs">
            <div className="flex items-start gap-2 text-[11px] text-[#45604e] leading-relaxed">
              <CheckCircle2 size={14} className="text-[#1c573e] shrink-0 mt-0.5" />
              <span>
                {am
                  ? "ውሃውን ቢያንስ ለ 1 ደቂቃ ያህል በከፍተኛ ሙቀት ማፍላት።"
                  : "Rolling boil for at least 1 continuous minute to kill waterborne pathogens."}
              </span>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#45604e] leading-relaxed">
              <CheckCircle2 size={14} className="text-[#1c573e] shrink-0 mt-0.5" />
              <span>
                {am
                  ? "የተጣራውን ውሃ ንጹህና ክዳን ባለው እቃ ውስጥ ማከማቸት።"
                  : "Store cooled water in a clean, sanitized, covered container with a narrow dispensing tap or ladle."}
              </span>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-[#45604e] leading-relaxed">
              <CheckCircle2 size={14} className="text-[#1c573e] shrink-0 mt-0.5" />
              <span>
                {am
                  ? "እጅዎን ከውሃው እቃ ውስጥ እንዳይነኩ ጥንቃቄ ማድረግ።"
                  : "Never dip unwashed cups or hands directly into drinking containers."}
              </span>
            </div>

            {onSelectPrompt && (
              <button
                type="button"
                onClick={() =>
                  onSelectPrompt(
                    am
                      ? "በቤት ውስጥ የመጠጥ ውሃን እንዴት አስተማማኝ ማድረግ ይቻላል?"
                      : "How do I make drinking water safe for my family?"
                  )
                }
                className="w-full text-center py-2 text-xs font-bold text-[#1c573e] hover:underline"
              >
                {am ? "ስለ ውሃ ንጽህና ኦፓልን ጠይቁ →" : "Ask Opal about water safety →"}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
