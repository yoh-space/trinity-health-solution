import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useAction, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GuestChoiceChip } from "../components/public/GuestChoiceChip";
import { AUTHENTICATED_HOME_TABS } from "../constants/authRoutes";
import { useTrinityStore } from "../store/useTrinityStore";

const ingredients = [
  { id: "lentils", en: "Misir", am: "ምስር" }, { id: "shiro", en: "Shiro", am: "ሽሮ" },
  { id: "cabbage", en: "Gommen", am: "ጎመን" }, { id: "egg", en: "Eggs", am: "እንቁላል" },
  { id: "oats", en: "Oats", am: "አጃ" }, { id: "potato", en: "Potatoes", am: "ድንች" },
  { id: "carrot", en: "Carrots", am: "ካሮት" }, { id: "avocado", en: "Avocado", am: "አቮካዶ" },
  { id: "injera", en: "Teff injera", am: "ጤፍ እንጀራ" },
];
const allergies = [{ id: "egg", en: "Egg", am: "እንቁላል" }, { id: "nuts", en: "Peanuts / tree nuts", am: "ኦቾሎኒ / ለውዝ" }, { id: "dairy", en: "Milk / dairy", am: "ወተት እና የወተት ተዋጽኦ" }, { id: "sesame", en: "Sesame", am: "ሰሊጥ" }];
const recipes = [
  { id: "lentil-vegetable", en: "Lentil and vegetable plate", am: "የምስርና አትክልት ምግብ", ingredients: ["lentils", "carrot", "cabbage"], allergens: [] },
  { id: "shiro-injera", en: "Shiro with teff injera", am: "ሽሮ ከጤፍ እንጀራ ጋር", ingredients: ["shiro", "injera"], allergens: ["sesame"] },
  { id: "potato-cabbage", en: "Potato and cabbage stew", am: "የድንችና ጎመን ወጥ", ingredients: ["potato", "cabbage", "carrot"], allergens: [] },
];

type MealIdea = {
  title: string;
  summary: string;
  steps: string[];
  tip: string;
};

export default function FoodIdeasScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const language = useTrinityStore((state) => state.language);
  const am = language === "am";
  const homeRoute = isSignedIn ? AUTHENTICATED_HOME_TABS : "/public/home";
  const profileRoute = isSignedIn ? "/(app)/(tabs)/profile" : "/public/profile";
  const savedRoute = isSignedIn ? "/(app)/(tabs)/saved" : "/public/saved";
  const opalRoute = isSignedIn ? "/(app)/(tabs)/opal" : "/public/opal";
  const hasSavedProfile = useQuery(anyApi.onboarding.hasProfile);
  const generateMealIdea = useAction(anyApi.pantry.generateMealIdea);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customIngredients, setCustomIngredients] = useState("");
  const [audience, setAudience] = useState<
    "family" | "child" | "adolescent" | "pregnantAdult"
  >("family");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [noKnownAllergies, setNoKnownAllergies] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [mealIdea, setMealIdea] = useState<MealIdea | null>(null);
  const [aiConsent, setAiConsent] = useState(false);
  const [profileConsent, setProfileConsent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const resetIdea = () => {
    setError("");
    setHasGenerated(false);
    setMealIdea(null);
  };
  const toggleIngredient = (id: string) => {
    resetIdea();
    setSelectedIngredients((items) =>
      items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id],
    );
  };
  const toggleAllergy = (id: string) => {
    resetIdea();
    setNoKnownAllergies(false);
    setSelectedAllergies((items) =>
      items.includes(id)
        ? items.filter((item) => item !== id)
        : [...items, id],
    );
  };
  const confirmNoAllergies = () => {
    resetIdea();
    setSelectedAllergies([]);
    setNoKnownAllergies((value) => !value);
  };
  const showIdeas = async () => {
    const chosenIngredients = [
      ...ingredients
        .filter((item) => selectedIngredients.includes(item.id))
        .map((item) => (am ? item.am : item.en)),
      ...customIngredients
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ];
    if (!chosenIngredients.length) {
      setError(am ? "ቢያንስ አንድ ግብዓት ያስገቡ።" : "Add at least one ingredient.");
      return;
    }
    if (!noKnownAllergies && !selectedAllergies.length) {
      setError(am ? "የአለርጂ ምርጫ ያድርጉ።" : "Choose an allergy option.");
      return;
    }
    if (!aiConsent) {
      setError(
        am
          ? "ወደ Gemini መላክን ለመቀጠል ፈቃድዎን ያረጋግጡ።"
          : "Please consent to sharing the meal details with Gemini to continue.",
      );
      return;
    }
    setError("");
    setHasGenerated(false);
    setMealIdea(null);
    setIsGenerating(true);
    try {
      const result = (await generateMealIdea({
        consented: true,
        includeProfilePreferences: profileConsent && Boolean(hasSavedProfile),
        ingredients: chosenIngredients,
        audience,
        excludedAllergens: selectedAllergies,
        language,
      })) as MealIdea;
      setMealIdea(result);
      setHasGenerated(true);
    } catch (requestError) {
      const code = requestError instanceof Error ? requestError.message : "";
      if (code.includes("PANTRY_INVALID_INGREDIENTS")) {
        setError(
          am
            ? "ከ1–12 ግብዓቶች ያስገቡ፤ እያንዳንዱ ስም ከ50 ቁምፊ በታች ይሁን።"
            : "Enter 1–12 ingredients, with each name under 50 characters.",
        );
      } else if (code.includes("PANTRY_INGREDIENTS_ONLY")) {
        setError(
          am
            ? "የግብዓት ስሞችን ብቻ ያስገቡ፤ የግል ወይም የጤና መረጃ አያካትቱ።"
            : "Enter ingredient names only—not personal or health details.",
        );
      } else if (code.includes("PANTRY_SIGN_IN_REQUIRED")) {
        setError(
          am
            ? "የተቀመጡ የምግብ ምርጫዎችን ለመጠቀም እንደገና ይግቡ።"
            : "Sign in again to use saved food preferences.",
        );
      } else if (code.includes("PANTRY_PROFILE_NOT_FOUND")) {
        setError(
          am
            ? "የተቀመጠ መገለጫ አልተገኘም። የመገለጫ ማበጀትን ያጥፉና እንደገና ይሞክሩ።"
            : "No saved profile was found. Turn off profile personalization and try again.",
        );
      } else if (code.includes("PANTRY_RATE_LIMIT")) {
        setError(
          am
            ? "የGemini ጥያቄ ገደብ ደርሷል። ቆይተው እንደገና ይሞክሩ።"
            : "Gemini’s request limit was reached. Please try again later.",
        );
      } else if (
        code.includes("PANTRY_NOT_CONFIGURED") ||
        code.includes("PANTRY_INVALID_API_KEY")
      ) {
        setError(
          am
            ? "የGemini አገልግሎት አሁን አልተዋቀረም።"
            : "Gemini is not configured correctly right now.",
        );
      } else {
        setError(
          am
            ? "የምግብ ሀሳብ ማዘጋጀት አልተቻለም። ኢንተርኔትዎን ያረጋግጡና እንደገና ይሞክሩ።"
            : "We couldn't create a meal idea. Check your connection and try again.",
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };
  const matches = recipes.filter((recipe) => recipe.ingredients.some((id) => selectedIngredients.includes(id)) && !recipe.allergens.some((id) => selectedAllergies.includes(id)));

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Trinity Health Solution home" onPress={() => router.replace(homeRoute as Href)} style={styles.brand}><View style={styles.logo}><Ionicons name="leaf-outline" size={19} color="#16803F" /></View><View><Text style={styles.brandName}>Trinity Health Solution</Text><Text style={styles.brandTag}>GROWING GOOD, TOGETHER</Text></View></Pressable>
          <View style={styles.headerActions}><Pressable accessibilityLabel={am ? "የተቀመጡ ትምህርቶች" : "Saved lessons"} onPress={() => router.push(savedRoute as Href)} style={styles.headerIcon}><Ionicons name="bookmark-outline" size={18} color="#365B41" /></Pressable><Pressable accessibilityLabel={am ? "መገለጫ እና ቅንብሮች" : "Profile and settings"} onPress={() => router.push(profileRoute as Href)} style={styles.headerIcon}><Ionicons name="settings-outline" size={18} color="#365B41" /></Pressable></View>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>{am ? "በኩሽና ውስጥ እንጀምር" : "LET’S START IN THE KITCHEN"}</Text>
          <Text style={styles.title}>{am ? "ካለዎት ነገር ጥሩ ነገር ይስሩ።" : "Something good from\nwhat you have."}</Text>
          <Text style={styles.subtitle}>{am ? "የተለመዱ ግብዓቶች። ለቤተሰብ ጠረጴዛ ቀላል ሀሳቦች።" : "Familiar ingredients. Simple ideas for the family table."}</Text>
          <View style={styles.section}><Text style={styles.sectionTitle}><Text style={styles.step}>01</Text> {am ? "በኩሽናዎ ምን አለ?" : "What’s in your kitchen?"}</Text><View style={styles.ingredientGrid}>{ingredients.map((item) => <GuestChoiceChip key={item.id} compact label={am ? item.am : item.en} selected={selectedIngredients.includes(item.id)} onPress={() => toggleIngredient(item.id)} />)}</View></View>
          <View style={styles.customIngredients}>
            <Text style={styles.fieldLabel}>
              {am
                ? "ሌሎች ግብዓቶችን ያክሉ (በኮማ ይለዩ)"
                : "Add other ingredients (separate with commas)"}
            </Text>
            <TextInput
              accessibilityLabel={am ? "ሌሎች ግብዓቶች" : "Other ingredients"}
              onChangeText={(value) => {
                resetIdea();
                setCustomIngredients(value);
              }}
              placeholder={
                am
                  ? "ለምሳሌ፦ ቲማቲም፣ ሽንኩርት"
                  : "e.g. tomatoes, onions"
              }
              placeholderTextColor="#89968B"
              style={styles.ingredientInput}
              value={customIngredients}
              maxLength={300}
            />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Text style={styles.step}>02</Text>{" "}
              {am ? "ማን ነው የሚመገበው?" : "Who’s gathering at the table?"}
            </Text>
            <View style={styles.audienceStack}>
              <GuestChoiceChip
                role="radio"
                label={am ? "ቤተሰብ" : "The family"}
                selected={audience === "family"}
                onPress={() => {
                  resetIdea();
                  setAudience("family");
                }}
              />
              <GuestChoiceChip
                role="radio"
                label={
                  am ? "ታዳጊ ህፃን · ከ6 ወር በላይ" : "A young child · 6 months or older"
                }
                selected={audience === "child"}
                onPress={() => {
                  resetIdea();
                  setAudience("child");
                }}
              />
              <GuestChoiceChip
                role="radio"
                label={am ? "ታዳጊ ወጣት" : "Adolescent"}
                selected={audience === "adolescent"}
                onPress={() => {
                  resetIdea();
                  setAudience("adolescent");
                }}
              />
              <GuestChoiceChip
                role="radio"
                label={am ? "ነፍሰ ጡር አዋቂ" : "Pregnant adult"}
                selected={audience === "pregnantAdult"}
                onPress={() => {
                  resetIdea();
                  setAudience("pregnantAdult");
                }}
              />
            </View>
            {audience === "adolescent" || audience === "pregnantAdult" ? (
              <Text style={styles.hint}>
                {am
                  ? "አጠቃላይ የምግብ ሀሳቦች ብቻ ናቸው፤ የግል የሕክምና ወይም የአመጋገብ ምክር አይደሉም።"
                  : "General meal ideas only—not personalized clinical or nutrition advice."}
              </Text>
            ) : null}
          </View>
          <View style={styles.section}><Text style={styles.sectionTitle}><Text style={styles.step}>03</Text> {am ? "ምን እንዳይካተት?" : "Anything to leave out?"}</Text><Text style={styles.hint}>{am ? "ለዚህ ሀሳብ ብቻ ምረጥ። የምግብ ደህንነትን ያረጋግጡ።" : "Choose exclusions for this idea. Always verify food safety."}</Text><View style={styles.ingredientGrid}><GuestChoiceChip compact label={am ? "ምንም የታወቀ የለም" : "None known"} selected={noKnownAllergies} onPress={confirmNoAllergies} />{allergies.map((item) => <GuestChoiceChip compact key={item.id} label={am ? item.am : item.en} selected={selectedAllergies.includes(item.id)} onPress={() => toggleAllergy(item.id)} />)}</View></View>
          <View style={styles.consentSection}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: aiConsent }}
              onPress={() => {
                setAiConsent((value) => !value);
                setError("");
              }}
              style={styles.consentRow}
            >
              <Ionicons
                name={aiConsent ? "checkbox" : "square-outline"}
                size={21}
                color={aiConsent ? "#25804A" : "#7D8D80"}
              />
              <Text style={styles.consentText}>
                {am
                  ? "የግብዓት ዝርዝሬ፣ ማን እንደሚመገብ ምርጫዬ እና የአለርጂ ክልከላዎች (ካሉ) ይህን ሀሳብ ለማዘጋጀት ወደ Google Gemini እንዲላኩ እስማማለሁ። ዝርዝሬ አይቀመጥም። Gemini የአለርጂ ደህንነትን ማረጋገጥ አይችልም፤ ምርቶችንና ተሻጋሪ ብክለትን ያረጋግጡ።"
                  : "I agree to send my ingredients, serving choice, and selected allergen exclusions (if any) to Google Gemini to create this idea. The list is not saved. Gemini cannot guarantee allergy safety—check product labels and cross-contact."}
              </Text>
            </Pressable>
            {hasSavedProfile === true ? (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: profileConsent }}
                onPress={() => setProfileConsent((value) => !value)}
                style={styles.consentRow}
              >
                <Ionicons
                  name={profileConsent ? "checkbox" : "square-outline"}
                  size={21}
                  color={profileConsent ? "#25804A" : "#7D8D80"}
                />
                <Text style={styles.consentText}>
                  {am
                    ? "የተቀመጡትን ክሊኒካዊ ያልሆኑ የምግብ ምርጫዎቼንም ይጠቀሙ። የተመረጡ የእፅዋት ምግብ፣ በጀት፣ ጤናማ አመጋገብ ወይም የቤተሰብ ምግብ ዝርዝሮች ብቻ ይጋራሉ፤ ዕድሜ፣ የጤና ሁኔታ፣ መለኪያ ወይም ሌላ መረጃ አይላክም።"
                    : "Also use my saved non-clinical food preferences. Only selected plant-based, budget, healthy-eating, or family-meal preferences are shared—not age, health conditions, measurements, or other profile details."}
                </Text>
              </Pressable>
            ) : null}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !aiConsent || isGenerating }}
            disabled={!aiConsent || isGenerating}
            onPress={() => void showIdeas()}
            style={[
              styles.generate,
              (!aiConsent || isGenerating) && styles.generateDisabled,
            ]}
          >
            <Text style={styles.generateText}>
              {isGenerating
                ? am
                  ? "የምግብ ሀሳብ በማዘጋጀት ላይ..."
                  : "Creating your meal idea..."
                : am
                  ? "በAI የምግብ ሀሳብ ያዘጋጁ"
                  : "Create an AI meal idea"}
            </Text>
            <Ionicons
              name={isGenerating ? "hourglass-outline" : "restaurant-outline"}
              size={18}
              color="#FFFFFF"
            />
          </Pressable>
          {mealIdea ? (
            <View style={styles.aiResult}>
              <Text style={styles.aiEyebrow}>
                {am ? "የእርስዎ የAI ሀሳብ" : "YOUR AI MEAL IDEA"}
              </Text>
              <Text style={styles.aiTitle}>{mealIdea.title}</Text>
              <Text style={styles.aiSummary}>{mealIdea.summary}</Text>
              <View style={styles.stepsList}>
                {mealIdea.steps.map((step, index) => (
                  <View key={`${index}-${step}`} style={styles.aiStep}>
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                    <Text style={styles.aiStepText}>{step}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.tipBox}>
                <Ionicons name="bulb-outline" size={18} color="#A16A37" />
                <Text style={styles.tipText}>{mealIdea.tip}</Text>
              </View>
              <Text style={styles.safetyNote}>
                {am
                  ? "ማስታወሻ፦ ይህ አጠቃላይ የምግብ ሀሳብ ነው፤ የሕክምና ወይም የአለርጂ ምክር አይደለም።"
                  : "For everyday inspiration only—not medical advice or a guarantee of allergen safety."}
              </Text>
            </View>
          ) : null}
          {hasGenerated ? <View style={styles.results}><Text style={styles.resultsTitle}>{am ? "የሚስማሙ ቀላል ሀሳቦች" : "More simple ideas"}</Text>{matches.length ? matches.map((recipe) => <View key={recipe.id} style={styles.recipe}><Ionicons name="restaurant-outline" size={20} color="#367A49" /><Text style={styles.recipeText}>{am ? recipe.am : recipe.en}</Text></View>) : <Text style={styles.hint}>{am ? "ከተመረጡት ግብዓቶች ጋር የሚስማማ ሀሳብ የለም።" : "No additional sample ideas match those selections."}</Text>}</View> : null}
          <View style={styles.bottomSpace} />
        </ScrollView>
        <Pressable accessibilityLabel="Ask Opal" onPress={() => router.push(opalRoute as Href)} style={styles.opal}><Ionicons name="chatbubble-ellipses-outline" size={17} color="#FFFFFF" /><Text style={styles.opalText}>Ask Opal</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7FAF7", flex: 1 },
  page: { flex: 1 },
  header: {
    alignItems: "center",
    backgroundColor: "#F7FAF7",
    borderBottomColor: "#E4ECE5",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 56,
    paddingHorizontal: 16,
  },
  brand: { alignItems: "center", flexDirection: "row", gap: 8 },
  logo: {
    alignItems: "center",
    backgroundColor: "#E7F4E8",
    borderRadius: 13,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  brandName: { color: "#285638", fontFamily: "Righteous_400Regular", fontSize: 15 },
  brandTag: {
    color: "#7D9581",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    letterSpacing: 0.6,
    marginTop: 3,
  },
  headerActions: { flexDirection: "row", gap: 8 },
  headerIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2EAE3",
    borderRadius: 13,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  content: { paddingBottom: 58, paddingHorizontal: 16, paddingTop: 16 },
  eyebrow: {
    color: "#438451",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: "#1D3023",
    fontFamily: "Righteous_400Regular",
    fontSize: 27,
    lineHeight: 31,
  },
  subtitle: {
    color: "#6D7B70",
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 18,
    marginTop: 8,
  },
  section: { marginTop: 18 },
  sectionTitle: {
    color: "#283D2D",
    fontFamily: "Righteous_400Regular",
    fontSize: 18,
    lineHeight: 21,
  },
  step: { color: "#4A8657", fontFamily: "Righteous_400Regular" },
  ingredientGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  customIngredients: { marginTop: 12 },
  fieldLabel: {
    color: "#405647",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 19,
    marginBottom: 7,
  },
  ingredientInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D6E1D7",
    borderRadius: 12,
    borderWidth: 1,
    color: "#263B2B",
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  audienceStack: { gap: 8, marginTop: 10 },
  consentSection: {
    backgroundColor: "#F0F6EF",
    borderColor: "#DCE8DC",
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginTop: 18,
    padding: 13,
  },
  consentRow: { alignItems: "flex-start", flexDirection: "row", gap: 9 },
  consentText: {
    color: "#526357",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  hint: {
    color: "#7B897E",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 6,
  },
  error: {
    color: "#A25B43",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 10,
  },
  generate: {
    alignItems: "center",
    backgroundColor: "#16803F",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 16,
    minHeight: 46,
    paddingHorizontal: 16,
  },
  generateDisabled: { opacity: 0.55 },
  generateText: { color: "#FFFFFF", fontFamily: "Righteous_400Regular", fontSize: 16 },
  aiResult: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE7DD",
    borderRadius: 17,
    borderWidth: 1,
    marginTop: 18,
    padding: 16,
  },
  aiEyebrow: {
    color: "#8A7550",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    letterSpacing: 0.8,
  },
  aiTitle: {
    color: "#1D3C29",
    fontFamily: "Righteous_400Regular",
    fontSize: 21,
    lineHeight: 27,
    marginTop: 7,
  },
  aiSummary: {
    color: "#5A6C5F",
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 7,
  },
  stepsList: { gap: 11, marginTop: 16 },
  aiStep: { alignItems: "flex-start", flexDirection: "row", gap: 10 },
  stepNumber: {
    alignItems: "center",
    backgroundColor: "#E8F1E7",
    borderRadius: 13,
    color: "#2D7142",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    height: 25,
    includeFontPadding: false,
    lineHeight: 25,
    overflow: "hidden",
    textAlign: "center",
    width: 25,
  },
  aiStepText: {
    color: "#405647",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 22,
    paddingTop: 2,
  },
  tipBox: {
    alignItems: "flex-start",
    backgroundColor: "#F8F5EC",
    borderRadius: 12,
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
    padding: 12,
  },
  tipText: {
    color: "#5B5140",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  safetyNote: {
    color: "#718276",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 12,
  },
  results: { marginTop: 18 },
  resultsTitle: {
    color: "#294433",
    fontFamily: "Righteous_400Regular",
    fontSize: 18,
    lineHeight: 21,
    marginBottom: 10,
  },
  recipe: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E9E2",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    marginBottom: 8,
    minHeight: 46,
    padding: 12,
  },
  recipeText: {
    color: "#364C3B",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 20,
  },
  bottomSpace: { height: 48 },
  opal: {
    alignItems: "center",
    backgroundColor: "#178344",
    borderRadius: 24,
    bottom: 8,
    elevation: 5,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: "absolute",
    right: 16,
    shadowColor: "#123B20",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  opalText: { color: "#FFFFFF", fontFamily: "Righteous_400Regular", fontSize: 15 },
  modalBackdrop: { backgroundColor: "#17321C66", flex: 1, justifyContent: "flex-end", padding: 14 },
  modal: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16 },
  modalTitle: {
    color: "#28412F",
    fontFamily: "Righteous_400Regular",
    fontSize: 19,
    marginBottom: 8,
  },
  modalOption: {
    borderColor: "#E1EAE2",
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    padding: 13,
  },
  modalText: { color: "#3B5C44", fontFamily: "Righteous_400Regular", fontSize: 16 },
});
