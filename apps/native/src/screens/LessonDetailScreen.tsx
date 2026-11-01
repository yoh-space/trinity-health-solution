import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getEducationContent,
  type EducationItem,
} from "../components/public/educationContent";
import { useTrinityStore } from "../store/useTrinityStore";

const CATEGORY_HERO_FALLBACKS: Record<string, string> = {
  "food-safety":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
  "maternal-nutrition":
    "https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1000&q=80",
  "child-feeding":
    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80",
  default:
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1000&q=80",
};

function resolveHeroImage(item: EducationItem): string {
  if (item.coverImageUrl) return item.coverImageUrl;
  const cat = (item.category || "").toLowerCase();
  if (cat.includes("food") || cat.includes("safe")) return CATEGORY_HERO_FALLBACKS["food-safety"];
  if (cat.includes("matern") || cat.includes("pregnan")) return CATEGORY_HERO_FALLBACKS["maternal-nutrition"];
  if (cat.includes("child") || cat.includes("feed")) return CATEGORY_HERO_FALLBACKS["child-feeding"];
  return CATEGORY_HERO_FALLBACKS.default;
}

export default function LessonDetailScreen() {
  const router = useRouter();
  const { articleId } = useLocalSearchParams<{ articleId: string }>();
  const language = useTrinityStore((state) => state.language);
  const savedIds = useTrinityStore((state) => state.savedIds);
  const toggleSaved = useTrinityStore((state) => state.toggleSaved);
  const published = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const content = getEducationContent(published);
  const item = content.find((lesson) => lesson._id === articleId);
  const [markedRead, setMarkedRead] = useState(false);
  const am = language === "am";

  if (!item) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <View style={styles.missing}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={19} color="#345B40" />
          </Pressable>
          <Text style={styles.missingTitle}>
            {am ? "ትምህርቱ አልተገኘም" : "Lesson not found"}
          </Text>
          <Text style={styles.missingBody}>
            {am
              ? "ወደ ትምህርቶች ይመለሱ እና ሌላ ይምረጡ።"
              : "Go back to the lesson library and choose another lesson."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const saved = savedIds.includes(item._id);
  const sections = item.sections?.length
    ? item.sections
    : [
        {
          title: am ? "ዋና ሀሳብ" : "The main idea",
          titleAm: "ዋና ሀሳብ",
          body: item.content,
          bodyAm: item.contentAm,
        },
      ];

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={am ? "ተመለስ" : "Go back"}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={19} color="#345B40" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              saved
                ? am
                  ? "ከተቀመጡ አስወግድ"
                  : "Remove saved lesson"
                : am
                  ? "ትምህርት አስቀምጥ"
                  : "Save lesson"
            }
            onPress={() => toggleSaved(item._id)}
            style={styles.backButton}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={19}
              color="#087A3D"
            />
          </Pressable>
        </View>

        {/* Hero Cover Image Banner */}
        <View style={styles.heroCard}>
          <Image
            source={{ uri: resolveHeroImage(item) }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>{item.category.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.title}>{am ? item.titleAm : item.title}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color="#718075" />
          <Text style={styles.metaText}>
            {item.readMinutes} {am ? "ደቂቃ ንባብ" : "min read"}
          </Text>
        </View>
        <Text style={styles.summary}>{am ? item.summaryAm : item.summary}</Text>

        <View style={styles.introCard}>
          <Ionicons name="leaf-outline" size={19} color="#087A3D" />
          <Text style={styles.introText}>
            {am ? item.contentAm : item.content}
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={`${item._id}-section-${index}`} style={styles.section}>
            <View style={styles.sectionHeading}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.sectionTitle}>
                {am ? section.titleAm : section.title}
              </Text>
            </View>
            <Text style={styles.sectionBody}>
              {am ? section.bodyAm : section.body}
            </Text>
          </View>
        ))}

        {(item.takeaway || item.takeawayAm) && (
          <View style={styles.takeaway}>
            <Text style={styles.takeawayLabel}>
              {am ? "ዋና መልዕክት" : "KEY TAKEAWAY"}
            </Text>
            <Text style={styles.takeawayText}>
              {am ? item.takeawayAm : item.takeaway}
            </Text>
          </View>
        )}

        <View style={styles.sourceCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#52735A"
          />
          <Text style={styles.sourceText}>
            {am
              ? "ይህ ገጽ አጠቃላይ የትምህርት ማስታወሻ ነው፣ የግል የህክምና ምክር አይደለም። ለግል ጥያቄዎች ብቁ የጤና ባለሙያን ያነጋግሩ።"
              : "Source: Trinity community learning notes. This is general education, not individual medical advice. For personal concerns, speak with a qualified health professional."}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => setMarkedRead(true)}
          style={[styles.readButton, markedRead && styles.readButtonDone]}
        >
          <Ionicons
            name={markedRead ? "checkmark-circle-outline" : "checkmark"}
            size={18}
            color={markedRead ? "#087A3D" : "#FFFFFF"}
          />
          <Text
            style={[
              styles.readButtonText,
              markedRead && styles.readButtonTextDone,
            ]}
          >
            {markedRead
              ? am
                ? "ለዚህ ጉብኝት ተነቧል"
                : "Marked read for this visit"
              : am
                ? "አንብቤዋለሁ"
                : "Mark as read"}
          </Text>
        </Pressable>
        <Text style={styles.sessionNote}>
          {am
            ? "ይህ ምልክት በአሁኑ ጉብኝት ብቻ ይቆያል።"
            : "Read status lasts only for this visit."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7FAF6", flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  heroCard: {
    backgroundColor: "#163826",
    borderRadius: 20,
    height: 190,
    marginTop: 6,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  heroImage: {
    height: "100%",
    width: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 40, 25, 0.25)",
  },
  heroBadge: {
    backgroundColor: "rgba(8, 122, 61, 0.92)",
    borderRadius: 12,
    bottom: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: "absolute",
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontFamily: "Righteous_400Regular",
    fontSize: 10,
    letterSpacing: 0.8,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E9E1",
    borderRadius: 13,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  category: {
    color: "#087A3D",
    fontFamily: "Righteous_400Regular",
    fontSize: 10,
    letterSpacing: 1.1,
  },
  title: {
    color: "#183A25",
    fontFamily: "Righteous_400Regular",
    fontSize: 28,
    lineHeight: 35,
    marginTop: 9,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
  },
  metaText: { color: "#718075", fontFamily: "Righteous_400Regular", fontSize: 11 },
  summary: {
    color: "#536458",
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 19,
  },
  introCard: {
    alignItems: "flex-start",
    backgroundColor: "#EAF4EB",
    borderRadius: 17,
    flexDirection: "row",
    gap: 10,
    marginTop: 21,
    padding: 15,
  },
  introText: {
    color: "#35543C",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 20,
  },
  section: { marginTop: 25 },
  sectionHeading: { alignItems: "center", flexDirection: "row", gap: 10 },
  numberBadge: {
    alignItems: "center",
    backgroundColor: "#DDEEE0",
    borderRadius: 13,
    height: 27,
    justifyContent: "center",
    width: 27,
  },
  numberText: { color: "#087A3D", fontFamily: "Righteous_400Regular", fontSize: 12 },
  sectionTitle: {
    color: "#203A28",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    lineHeight: 22,
  },
  sectionBody: {
    color: "#5D6B61",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 21,
    marginLeft: 37,
    marginTop: 9,
  },
  takeaway: {
    backgroundColor: "#FFF7E8",
    borderRadius: 16,
    marginTop: 25,
    padding: 16,
  },
  takeawayLabel: {
    color: "#93621F",
    fontFamily: "Righteous_400Regular",
    fontSize: 9,
    letterSpacing: 1,
  },
  takeawayText: {
    color: "#634B2A",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
  sourceCard: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E9E1",
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginTop: 19,
    padding: 13,
  },
  sourceText: {
    color: "#68766B",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 10,
    lineHeight: 16,
  },
  readButton: {
    alignItems: "center",
    backgroundColor: "#087A3D",
    borderRadius: 15,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 20,
    paddingVertical: 14,
  },
  readButtonDone: { backgroundColor: "#E4F1E6" },
  readButtonText: { color: "#FFFFFF", fontFamily: "Righteous_400Regular", fontSize: 13 },
  readButtonTextDone: { color: "#087A3D" },
  sessionNote: {
    color: "#849087",
    fontFamily: "Righteous_400Regular",
    fontSize: 10,
    marginTop: 8,
    textAlign: "center",
  },
  missing: { flex: 1, justifyContent: "center", padding: 24 },
  missingTitle: {
    color: "#183A25",
    fontFamily: "Righteous_400Regular",
    fontSize: 21,
    marginTop: 18,
  },
  missingBody: {
    color: "#68766B",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 7,
  },
});
