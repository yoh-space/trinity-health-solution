import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ACTIVITY_FACTORS,
  calculateEnergyEstimate,
  type ActivityLevel,
  type FormulaSex,
} from "../../lib/nutrition/energyEstimate";
import type { OpalLanguage } from "./opalTypes";

interface Props {
  language: OpalLanguage;
  onSelectPrompt?: (text: string) => void;
}

export function OpalHealthTools({ language, onSelectPrompt }: Props) {
  const am = language === "am";

  // ── Calculator state ────────────────────────────────────────────────────────
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

  const [infantOpen, setInfantOpen] = useState(false);
  const [waterOpen, setWaterOpen] = useState(false);

  const blocked = pregnant || breastfeeding || diabetes;

  const handleCalculate = () => {
    setCalcError("");
    setCalcResult(null);
    if (blocked) return;

    const numAge = Number(age);
    const numHeight = Number(heightCm);
    const numWeight = Number(weightKg);

    if (!age || isNaN(numAge) || numAge < 18 || numAge > 120) {
      setCalcError(am ? "እባክዎ ዕድሜዎን (18-120) ያስገቡ።" : "Enter a valid adult age (18–120).");
      return;
    }
    if (!sex) {
      setCalcError(am ? "እባክዎ ጾታ ይምረጡ።" : "Select sex for the biological formula.");
      return;
    }
    if (!heightCm || isNaN(numHeight) || numHeight < 100 || numHeight > 250) {
      setCalcError(am ? "ቁመትዎን በሴ.ሜ. ያስገቡ (100-250)።" : "Enter height in cm (100–250).");
      return;
    }
    if (!weightKg || isNaN(numWeight) || numWeight < 30 || numWeight > 300) {
      setCalcError(am ? "ክብደትዎን በኪ.ግ. ያስገቡ (30-300)።" : "Enter weight in kg (30–300).");
      return;
    }

    const result = calculateEnergyEstimate({
      age: numAge,
      sex: sex as FormulaSex,
      heightCm: numHeight,
      weightKg: numWeight,
      activity,
    });

    if (!result) {
      setCalcError(am ? "ስሌቱን ማጠናቀቅ አልተቻለም።" : "Could not complete estimate.");
    } else {
      setCalcResult(result);
    }
  };

  const resetCalc = () => {
    setAge(""); setSex(""); setHeightCm(""); setWeightKg("");
    setActivity("sedentaryConfined");
    setPregnant(false); setBreastfeeding(false); setDiabetes(false);
    setCalcResult(null); setCalcError("");
  };

  const activityOptions: { value: ActivityLevel; en: string; am: string }[] = [
    { value: "sedentaryConfined", en: "Sedentary / Desk work", am: "አብዛኛውን ጊዜ ተቀምጦ" },
    { value: "sedentary",        en: "Light walking during day", am: "ቀላል የእግር ጉዞ" },
    { value: "light",            en: "Light exercise / Active household", am: "ቀላል ስፖርት ወይም የቤት ስራ" },
    { value: "lightModerate",    en: "Moderate workout (3–4 days/wk)", am: "መካከለኛ እንቅስቃሴ (3-4 ቀን)" },
    { value: "heavy",            en: "Heavy labor / High training", am: "ከፍተኛ የጉልበት ስራ" },
  ];

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── 1. Daily Energy & Macro Estimator ───────────────────────────────── */}
      <View style={styles.card}>
        <Pressable
          onPress={() => setCalcOpen(!calcOpen)}
          style={styles.cardHeader}
          accessibilityRole="button"
        >
          <View style={styles.cardIconWrap}>
            <Ionicons name="fitness-outline" size={18} color="#1c573e" />
          </View>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.cardTitle}>
              {am ? "የዕለታዊ ሃይል እና ንጥረ-ምግብ ግምት" : "Daily Energy & Macro Estimator"}
            </Text>
            <Text style={styles.cardSubtitle}>
              {am ? "1-ክሊክ ፈጣን የካሎሪና ማክሮ ስሌት" : "Quick adult nutrition reference"}
            </Text>
          </View>
          <Ionicons
            name={calcOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#637d6a"
          />
        </Pressable>

        {calcOpen && (
          <View style={styles.cardBody}>
            {/* Input Grid */}
            <View style={styles.inputGrid}>
              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>{am ? "ዕድሜ (ዓ.)" : "Age (years)"}</Text>
                <TextInput
                  style={styles.textInput}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  placeholder="28"
                  placeholderTextColor="#94a297"
                  maxLength={3}
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>{am ? "ጾታ" : "Sex"}</Text>
                <View style={styles.segmentRow}>
                  {(["female", "male"] as FormulaSex[]).map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => setSex(s)}
                      style={[styles.segmentBtn, sex === s && styles.segmentBtnActive]}
                    >
                      <Text
                        style={[styles.segmentText, sex === s && styles.segmentTextActive]}
                      >
                        {s === "female"
                          ? (am ? "ሴት" : "Female")
                          : (am ? "ወንድ" : "Male")}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>{am ? "ቁመት (ሴ.ሜ)" : "Height (cm)"}</Text>
                <TextInput
                  style={styles.textInput}
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="decimal-pad"
                  placeholder="165"
                  placeholderTextColor="#94a297"
                  maxLength={5}
                />
              </View>

              <View style={styles.inputHalf}>
                <Text style={styles.inputLabel}>{am ? "ክብደት (ኪ.ግ)" : "Weight (kg)"}</Text>
                <TextInput
                  style={styles.textInput}
                  value={weightKg}
                  onChangeText={setWeightKg}
                  keyboardType="decimal-pad"
                  placeholder="62"
                  placeholderTextColor="#94a297"
                  maxLength={5}
                />
              </View>
            </View>

            {/* Activity picker */}
            <Text style={styles.inputLabel}>{am ? "የእንቅስቃሴ መጠን" : "Activity Level"}</Text>
            <View style={styles.activityList}>
              {activityOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setActivity(opt.value)}
                  style={[styles.activityBtn, activity === opt.value && styles.activityBtnActive]}
                >
                  <Text style={[styles.activityText, activity === opt.value && styles.activityTextActive]}>
                    {am ? opt.am : opt.en}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Special conditions */}
            <View style={styles.conditionsCard}>
              <Text style={styles.conditionsLabel}>
                {am ? "ልዩ ሁኔታዎች:" : "Special conditions:"}
              </Text>
              <View style={styles.conditionChips}>
                {[
                  { key: "pregnant", label: am ? "እርጉዝ" : "Pregnant", value: pregnant, set: setPregnant },
                  { key: "bf", label: am ? "ጡት እያጠቡ" : "Breastfeeding", value: breastfeeding, set: setBreastfeeding },
                  { key: "dm", label: am ? "ስኳር በሽታ" : "Diabetes", value: diabetes, set: setDiabetes },
                ].map((cond) => (
                  <Pressable
                    key={cond.key}
                    onPress={() => cond.set(!cond.value)}
                    style={[styles.condChip, cond.value && styles.condChipActive]}
                  >
                    <Text style={[styles.condChipText, cond.value && styles.condChipTextActive]}>
                      {cond.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Blocked warning */}
            {blocked && (
              <View style={styles.blockedCard}>
                <Ionicons name="alert-circle-outline" size={15} color="#b2572b" />
                <Text style={styles.blockedText}>
                  {am
                    ? "ለእርግዝና፣ ጡት ማጥባት ወይም ለስኳር በሽታ ይህ ቀመር አይሰራም። ቡድናችንን ያነጋግሩ።"
                    : "General formulas cannot estimate targets for pregnancy, lactation, or diabetes. Please consult our care team."}
                </Text>
              </View>
            )}

            {/* Error */}
            {!!calcError && (
              <Text style={styles.errorText}>{calcError}</Text>
            )}

            {/* Buttons */}
            <View style={styles.calcButtons}>
              <Pressable
                style={[styles.calcBtn, blocked && styles.calcBtnDisabled]}
                onPress={handleCalculate}
                disabled={blocked}
              >
                <Ionicons name="calculator-outline" size={15} color="#fff" />
                <Text style={styles.calcBtnText}>{am ? "ግምት አስላ" : "Calculate"}</Text>
              </Pressable>
              {(calcResult || age || heightCm || weightKg) ? (
                <Pressable style={styles.resetBtn} onPress={resetCalc}>
                  <Ionicons name="refresh-outline" size={15} color="#547963" />
                </Pressable>
              ) : null}
            </View>

            {/* Results */}
            {calcResult && (
              <View style={styles.resultsCard}>
                <View style={styles.resultsRow}>
                  <Text style={styles.resultsLabel}>
                    {am ? "የተገመተ TDEE" : "Estimated TDEE"}
                  </Text>
                  <Text style={styles.tdeeValue}>{calcResult.tdee} kcal/day</Text>
                </View>
                <View style={styles.macroGrid}>
                  <View style={styles.macroCell}>
                    <Text style={styles.macroName}>{am ? "ፕሮቲን" : "Protein"}</Text>
                    <Text style={styles.macroValue}>~{calcResult.proteinGrams}g</Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={styles.macroName}>{am ? "ስብ" : "Fats"}</Text>
                    <Text style={styles.macroValue}>
                      {calcResult.fatGrams.min}–{calcResult.fatGrams.max}g
                    </Text>
                  </View>
                  <View style={styles.macroCell}>
                    <Text style={styles.macroName}>{am ? "ካርቦ" : "Carbs"}</Text>
                    <Text style={styles.macroValue}>
                      {calcResult.carbohydrateGrams.min}–{calcResult.carbohydrateGrams.max}g
                    </Text>
                  </View>
                </View>
                <Text style={styles.resultsNote}>
                  {am
                    ? "ማስታወሻ፡ ይህ አጠቃላይ ግምት ነው። የግል የምግብ እቅድ አይደለም።"
                    : "Educational estimate only. Not an individualized meal plan."}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* ── 2. Infant Feeding Milestones ────────────────────────────────────── */}
      <View style={styles.card}>
        <Pressable
          onPress={() => setInfantOpen(!infantOpen)}
          style={styles.cardHeader}
          accessibilityRole="button"
        >
          <View style={styles.cardIconWrap}>
            <Ionicons name="happy-outline" size={18} color="#1c573e" />
          </View>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.cardTitle}>
              {am ? "የህፃናት ተጨማሪ ምግብ ደረጃዎች" : "Infant Feeding Milestones"}
            </Text>
            <Text style={styles.cardSubtitle}>
              {am ? "ዕድሜን መሰረት ያደረገ መመሪያ" : "Ethiopian complementary feeding protocol"}
            </Text>
          </View>
          <Ionicons
            name={infantOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#637d6a"
          />
        </Pressable>

        {infantOpen && (
          <View style={styles.cardBody}>
            {[
              {
                range: am ? "0 – 6 ወራት" : "0 – 6 Months",
                text: am
                  ? "የእናት ጡት ወተት ብቻ (ውሃ እንኳን አያስፈልግም)።"
                  : "Exclusive breastfeeding on demand. No water, tea, or other fluids.",
              },
              {
                range: am ? "6 – 8 ወራት" : "6 – 8 Months",
                text: am
                  ? "የተፈጨ አጃ፣ ድንችና ካሮት (በቀን 2-3 ጊዜ) ከጡት ወተት ጋር።"
                  : "Soft mashes (oats, carrots, potatoes, lentils) 2–3 times daily alongside breastmilk.",
              },
              {
                range: am ? "9 – 24 ወራት" : "9 – 24 Months",
                text: am
                  ? "የተፈጨ እንቁላል፣ ጥራጥሬዎችና የቤተሰብ ምግብ (3-4 ጊዜ) + ጤናማ መክሰስ።"
                  : "Chopped family foods, well-cooked eggs, legumes, soft fruits + 1–2 healthy snacks.",
              },
            ].map((item, idx) => (
              <View key={idx} style={styles.milestoneCard}>
                <Text style={styles.milestoneRange}>{item.range}</Text>
                <Text style={styles.milestoneText}>{item.text}</Text>
              </View>
            ))}
            {onSelectPrompt && (
              <Pressable
                style={styles.promptLink}
                onPress={() =>
                  onSelectPrompt(
                    am
                      ? "ለ 6 ወር ህጻን ምን አይነት ተጨማሪ ምግብ መስጠት አለብኝ?"
                      : "What should I feed my 6-month-old infant?",
                  )
                }
              >
                <Text style={styles.promptLinkText}>
                  {am ? "ስለ ህፃናት ምግብ ኦፓልን ጠይቁ →" : "Ask Opal about infant meals →"}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* ── 3. Safe Drinking Water Protocol ─────────────────────────────────── */}
      <View style={styles.card}>
        <Pressable
          onPress={() => setWaterOpen(!waterOpen)}
          style={styles.cardHeader}
          accessibilityRole="button"
        >
          <View style={styles.cardIconWrap}>
            <Ionicons name="water-outline" size={18} color="#1c573e" />
          </View>
          <View style={styles.cardTitleGroup}>
            <Text style={styles.cardTitle}>
              {am ? "አስተማማኝ የመጠጥ ውሃ ፕሮቶኮል" : "Safe Drinking Water Guide"}
            </Text>
            <Text style={styles.cardSubtitle}>
              {am ? "3-ደረጃ የቤት ውስጥ ማጣሪያ ዝርዝር" : "3-step household purification checklist"}
            </Text>
          </View>
          <Ionicons
            name={waterOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color="#637d6a"
          />
        </Pressable>

        {waterOpen && (
          <View style={styles.cardBody}>
            {[
              am
                ? "ውሃውን ቢያንስ ለ 1 ደቂቃ ያህል በከፍተኛ ሙቀት ያፍሉ።"
                : "Rolling boil for at least 1 continuous minute to kill waterborne pathogens.",
              am
                ? "የተጣራውን ውሃ ንጹህና ክዳን ባለው እቃ ውስጥ ያኑሩ።"
                : "Store cooled water in a clean, sanitized, covered container with a narrow tap.",
              am
                ? "እጅዎን ከውሃው እቃ ውስጥ እንዳይነኩ ጥንቃቄ ያድርጉ።"
                : "Never dip unwashed cups or hands directly into drinking containers.",
            ].map((step, idx) => (
              <View key={idx} style={styles.waterStep}>
                <Ionicons name="checkmark-circle" size={16} color="#1c573e" />
                <Text style={styles.waterStepText}>{step}</Text>
              </View>
            ))}
            {onSelectPrompt && (
              <Pressable
                style={styles.promptLink}
                onPress={() =>
                  onSelectPrompt(
                    am
                      ? "በቤት ውስጥ የመጠጥ ውሃን እንዴት አስተማማኝ ማድረግ ይቻላል?"
                      : "How do I make drinking water safe for my family?",
                  )
                }
              >
                <Text style={styles.promptLinkText}>
                  {am ? "ስለ ውሃ ንጽህና ኦፓልን ጠይቁ →" : "Ask Opal about water safety →"}
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { gap: 12, padding: 15 },

  card: {
    backgroundColor: "#fff",
    borderColor: "#d8e3d6",
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 15,
  },
  cardIconWrap: {
    alignItems: "center",
    backgroundColor: "#eaf4eb",
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  cardTitleGroup: { flex: 1 },
  cardTitle: { color: "#163826", fontFamily: "Righteous_400Regular", fontSize: 14 },
  cardSubtitle: { color: "#637d6a", fontFamily: "Righteous_400Regular", fontSize: 12, marginTop: 1 },

  cardBody: {
    borderTopColor: "#edf3ec",
    borderTopWidth: 1,
    gap: 12,
    padding: 15,
  },

  // Inputs
  inputGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  inputHalf: { width: "47%" },
  inputLabel: {
    color: "#405647",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: "#fbfdfa",
    borderColor: "#cbd8cb",
    borderRadius: 12,
    borderWidth: 1,
    color: "#183b2d",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },

  // Sex segment
  segmentRow: { flexDirection: "row", gap: 6 },
  segmentBtn: {
    alignItems: "center",
    borderColor: "#cbd8cb",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  segmentBtnActive: { backgroundColor: "#1c573e", borderColor: "#1c573e" },
  segmentText: { color: "#4f6756", fontFamily: "Righteous_400Regular", fontSize: 12 },
  segmentTextActive: { color: "#fff" },

  // Activity
  activityList: { gap: 6 },
  activityBtn: {
    borderColor: "#d4e0d4",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  activityBtnActive: { backgroundColor: "#eaf4eb", borderColor: "#1c573e" },
  activityText: { color: "#4f6756", fontFamily: "Righteous_400Regular", fontSize: 13 },
  activityTextActive: { color: "#1c573e" },

  // Conditions
  conditionsCard: {
    backgroundColor: "#f8faf7",
    borderColor: "#e8efe6",
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  conditionsLabel: { color: "#35523f", fontFamily: "Righteous_400Regular", fontSize: 12 },
  conditionChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  condChip: {
    borderColor: "#cbd8cb",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  condChipActive: { backgroundColor: "#8f5a14", borderColor: "#8f5a14" },
  condChipText: { color: "#4f6756", fontFamily: "Righteous_400Regular", fontSize: 12 },
  condChipTextActive: { color: "#fff" },

  blockedCard: {
    backgroundColor: "#fdf7f2",
    borderColor: "#f0dac8",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  blockedText: {
    color: "#7d4826",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },

  errorText: {
    backgroundColor: "#fff1ee",
    borderRadius: 10,
    color: "#c0392b",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    padding: 10,
  },

  calcButtons: { alignItems: "center", flexDirection: "row", gap: 10 },
  calcBtn: {
    alignItems: "center",
    backgroundColor: "#1c573e",
    borderRadius: 12,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 12,
  },
  calcBtnDisabled: { opacity: 0.45 },
  calcBtnText: { color: "#fff", fontFamily: "Righteous_400Regular", fontSize: 14 },
  resetBtn: {
    alignItems: "center",
    borderColor: "#cbd8cb",
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    padding: 11,
  },

  resultsCard: {
    backgroundColor: "#f4f9f3",
    borderColor: "#d2e4d0",
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  resultsRow: {
    alignItems: "center",
    borderBottomColor: "#d8e8d6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
  },
  resultsLabel: { color: "#55705d", fontFamily: "Righteous_400Regular", fontSize: 13 },
  tdeeValue: { color: "#163826", fontFamily: "Righteous_400Regular", fontSize: 16 },
  macroGrid: { flexDirection: "row", gap: 8 },
  macroCell: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#dce8da",
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 8,
  },
  macroName: { color: "#698572", fontFamily: "Righteous_400Regular", fontSize: 11 },
  macroValue: { color: "#1c573e", fontFamily: "Righteous_400Regular", fontSize: 13 },
  resultsNote: {
    color: "#68826f",
    fontFamily: "Righteous_400Regular",
    fontSize: 11,
    lineHeight: 16,
  },

  // Infant
  milestoneCard: {
    backgroundColor: "#f8faf7",
    borderColor: "#e5ede3",
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    padding: 11,
  },
  milestoneRange: { color: "#1c573e", fontFamily: "Righteous_400Regular", fontSize: 12 },
  milestoneText: {
    color: "#45604e",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },

  // Water
  waterStep: { alignItems: "flex-start", flexDirection: "row", gap: 8 },
  waterStepText: {
    color: "#45604e",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },

  // Shared
  promptLink: { alignItems: "center", paddingVertical: 6 },
  promptLinkText: { color: "#1c573e", fontFamily: "Righteous_400Regular", fontSize: 13 },
});
