import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GuestChoiceChip } from "../components/public/GuestChoiceChip";
import { useTrinityStore } from "../store/useTrinityStore";

const ingredients = [
  { id: "lentils", en: "Lentils", am: "ምስር" },
  { id: "shiro", en: "Shiro", am: "ሽሮ" },
  { id: "cabbage", en: "Cabbage", am: "ጎመን" },
  { id: "egg", en: "Egg", am: "እንቁላል" },
  { id: "oats", en: "Oats", am: "አጃ" },
  { id: "potato", en: "Potato", am: "ድንች" },
  { id: "carrot", en: "Carrot", am: "ካሮት" },
  { id: "avocado", en: "Avocado", am: "አቮካዶ" },
  { id: "injera", en: "Teff injera", am: "ጤፍ እንጀራ" },
];

const allergies = [
  { id: "egg", en: "Egg", am: "እንቁላል" },
  { id: "nuts", en: "Peanuts / tree nuts", am: "ኦቾሎኒ / ለውዝ" },
  { id: "dairy", en: "Milk / dairy", am: "ወተት እና የወተት ተዋጽኦ" },
  { id: "sesame", en: "Sesame", am: "ሰሊጥ" },
];

const recipes = [
  {
    id: "lentil-vegetable",
    en: "Lentil and vegetable plate",
    am: "የምስርና አትክልት ምግብ",
    ingredients: ["lentils", "carrot", "cabbage"],
    allergens: [],
  },
  {
    id: "shiro-injera",
    en: "Shiro with teff injera",
    am: "ሽሮ ከጤፍ እንጀራ ጋር",
    ingredients: ["shiro", "injera"],
    allergens: ["sesame"],
  },
  {
    id: "potato-cabbage",
    en: "Potato and cabbage stew",
    am: "የድንችና ጎመን ወጥ",
    ingredients: ["potato", "cabbage", "carrot"],
    allergens: [],
  },
];

export default function FoodIdeasScreen() {
  const language = useTrinityStore((state) => state.language);
  const am = language === "am";
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [audience, setAudience] = useState<"family" | "child">("family");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [noKnownAllergies, setNoKnownAllergies] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const toggleIngredient = (id: string) => {
    setHasGenerated(false);
    setSelectedIngredients((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const toggleAllergy = (id: string) => {
    setHasGenerated(false);
    setNoKnownAllergies(false);
    setSelectedAllergies((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  const confirmNoAllergies = () => {
    setHasGenerated(false);
    setSelectedAllergies([]);
    setNoKnownAllergies((current) => !current);
  };

  const showIdeas = () => {
    if (!selectedIngredients.length) {
      Alert.alert(
        am ? "ግብዓት ይምረጡ" : "Choose an ingredient",
        am ? "ቢያንስ አንድ ግብዓት ይምረጡ።" : "Select at least one ingredient.",
      );
      return;
    }
    if (!noKnownAllergies && !selectedAllergies.length) {
      Alert.alert(
        am ? "ምርጫ ይምረጡ" : "Choose an allergy option",
        am
          ? "የተዘረዘረ ምርጫ ይምረጡ ወይም ምንም የታወቀ አለርጂ እንደሌለ ያመልክቱ።"
          : "Choose listed allergies, or confirm that none are known.",
      );
      return;
    }
    setHasGenerated(true);
  };

  const matches = recipes.filter(
    (recipe) =>
      recipe.ingredients.some((id) => selectedIngredients.includes(id)) &&
      !recipe.allergens.some((id) => selectedAllergies.includes(id)),
  );

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>
          {am ? "በኩሽና ውስጥ እንጀምር" : "LET’S START IN THE KITCHEN"}
        </Text>
        <Text style={styles.title}>
          {am ? "ዛሬ ምን እናብስል?" : "What should we cook today?"}
        </Text>
        <Text style={styles.subtitle}>
          {am
            ? "የተለመዱ ግብዓቶች። ቀላል የቤት ምግብ ሀሳቦች።"
            : "Familiar ingredients. Simple meal ideas for home."}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.stepNumber}>01</Text>{" "}
            {am ? "በቤትዎ ምን አለ?" : "What do you have at home?"}
          </Text>
          <View style={styles.chips}>
            {ingredients.map((ingredient) => (
              <GuestChoiceChip
                key={ingredient.id}
                label={am ? ingredient.am : ingredient.en}
                selected={selectedIngredients.includes(ingredient.id)}
                onPress={() => toggleIngredient(ingredient.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.stepNumber}>02</Text>{" "}
            {am ? "ለማን እናዘጋጃለን?" : "Who are we cooking for?"}
          </Text>
          <View style={styles.chips}>
            <GuestChoiceChip
              role="radio"
              label={am ? "ቤተሰብ" : "Family"}
              selected={audience === "family"}
              onPress={() => setAudience("family")}
            />
            <GuestChoiceChip
              role="radio"
              label={am ? "ታዳጊ ህፃን · ከ6 ወር በላይ" : "Young child · 6+ months"}
              selected={audience === "child"}
              onPress={() => setAudience("child")}
            />
          </View>
          {audience === "child" && (
            <Text style={styles.audienceNote}>
              {am
                ? "የሙከራ ምግብ ሀሳቦች ብቻ ናቸው። ለህፃኑ ዕድሜና ፍላጎት ባለሙያን ያማክሩ።"
                : "Sample ideas only. Ask a qualified professional about a child’s individual needs."}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.stepNumber}>03</Text>{" "}
            {am ? "የማይካተቱ ነገሮች" : "Ingredients to avoid"}
          </Text>
          <Text style={styles.sectionHint}>
            {am
              ? "ለዚህ ሙከራ ብቻ ምርጫ ያድርጉ። ምርጫዎች አይቀመጡም።"
              : "Choose for this demo only. Your selections are not saved."}
          </Text>
          <View style={styles.chips}>
            <GuestChoiceChip
              label={am ? "ምንም የታወቀ የለም" : "None known"}
              selected={noKnownAllergies}
              onPress={confirmNoAllergies}
            />
            {allergies.map((allergy) => (
              <GuestChoiceChip
                key={allergy.id}
                label={am ? allergy.am : allergy.en}
                selected={selectedAllergies.includes(allergy.id)}
                onPress={() => toggleAllergy(allergy.id)}
              />
            ))}
          </View>
          <View style={styles.safetyNote}>
            <Ionicons name="warning-outline" size={16} color="#A46A22" />
            <Text style={styles.safetyText}>
              {am
                ? "ይህ የአለርጂ ደህንነት ማረጋገጫ አይደለም። የተዘረዘሩ ምልክቶችን ብቻ ይመለከታል። የምርት መለያዎችንና የመቀላቀል አደጋን ያረጋግጡ።"
                : "This is not an allergy-safety check. Filtering only uses listed tags. Check every label and consider cross-contact; ask a qualified professional when needed."}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={showIdeas}
          style={({ pressed }) => [
            styles.generateButton,
            pressed && styles.generatePressed,
          ]}
        >
          <Text style={styles.generateText}>
            {am ? "የምግብ ሀሳቦችን አሳይ" : "Show meal ideas"}
          </Text>
          <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
        </Pressable>

        {hasGenerated && (
          <View style={styles.results}>
            <Text style={styles.resultsTitle}>
              {am ? "ከምርጫዎችዎ ጋር የሚስማሙ ሀሳቦች" : "Ideas matching your selections"}
            </Text>
            {matches.length ? (
              matches.map((recipe) => (
                <View key={recipe.id} style={styles.recipeCard}>
                  <Ionicons
                    name="restaurant-outline"
                    size={18}
                    color="#367A49"
                  />
                  <Text style={styles.recipeName}>
                    {am ? recipe.am : recipe.en}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noMatches}>
                {am
                  ? "ምርጫዎቹን የሚያሟላ የሙከራ ሀሳብ የለም። ምርጫዎችን ይቀይሩ።"
                  : "No sample ideas match those selections. Try adjusting them."}
              </Text>
            )}
            <Text style={styles.localNote}>
              {am
                ? "የቀጥታ መረጃ የለም። የአካባቢ የሙከራ ሀሳቦች ብቻ።"
                : "No live data is used. These are local sample ideas only."}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7FAF7", flex: 1 },
  content: { padding: 18, paddingBottom: 28 },
  eyebrow: {
    color: "#438451",
    fontFamily: "Bold",
    fontSize: 9,
    letterSpacing: 1,
  },
  title: { color: "#1C3524", fontFamily: "MBold", fontSize: 24, marginTop: 8 },
  subtitle: {
    color: "#69786D",
    fontFamily: "Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4EBE4",
    borderRadius: 17,
    borderWidth: 1,
    marginTop: 14,
    padding: 13,
  },
  sectionTitle: { color: "#314638", fontFamily: "Bold", fontSize: 12 },
  stepNumber: { color: "#41824F" },
  sectionHint: {
    color: "#7A887D",
    fontFamily: "Regular",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 10 },
  audienceNote: {
    color: "#78877B",
    fontFamily: "Regular",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 9,
  },
  safetyNote: {
    alignItems: "flex-start",
    backgroundColor: "#FFF8EC",
    borderRadius: 11,
    flexDirection: "row",
    gap: 7,
    marginTop: 12,
    padding: 10,
  },
  safetyText: {
    color: "#795B35",
    flex: 1,
    fontFamily: "Regular",
    fontSize: 9,
    lineHeight: 14,
  },
  generateButton: {
    alignItems: "center",
    backgroundColor: "#08783D",
    borderRadius: 14,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    marginTop: 17,
    minHeight: 48,
  },
  generatePressed: { opacity: 0.82 },
  generateText: { color: "#FFFFFF", fontFamily: "Bold", fontSize: 12 },
  results: { marginTop: 18 },
  resultsTitle: {
    color: "#2C4231",
    fontFamily: "MBold",
    fontSize: 14,
    marginBottom: 9,
  },
  recipeCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E3EBE4",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    marginBottom: 8,
    padding: 12,
  },
  recipeName: {
    color: "#394E3E",
    flex: 1,
    fontFamily: "SemiBold",
    fontSize: 11,
  },
  noMatches: {
    color: "#6E7D72",
    fontFamily: "Regular",
    fontSize: 11,
    lineHeight: 17,
  },
  localNote: {
    color: "#859187",
    fontFamily: "Regular",
    fontSize: 9,
    marginTop: 5,
  },
});
