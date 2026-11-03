import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  const currentCategory = item.categoryKey ?? item.category.toLowerCase();
  const relatedItems = content
    .filter((lesson) => lesson._id !== item._id)
    .sort((first, second) => {
      const firstMatches =
        (first.categoryKey ?? first.category.toLowerCase()) === currentCategory;
      const secondMatches =
        (second.categoryKey ?? second.category.toLowerCase()) === currentCategory;
      return Number(secondMatches) - Number(firstMatches);
    })
    .slice(0, 4);

  const openRelatedArticle = (id: string) =>
    router.push(`/public/article/${encodeURIComponent(id)}`);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: resolveHeroImage(item) }}
          resizeMode="cover"
          style={styles.heroBanner}
          imageStyle={styles.heroImage}
        >
          <View pointerEvents="none" style={styles.heroOverlay} />
          <View style={styles.heroTopBar}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={am ? "ተመለስ" : "Go back"}
              onPress={() => router.back()}
              style={styles.heroIconButton}
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
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
              accessibilityState={{ selected: saved }}
              onPress={() => toggleSaved(item._id)}
              style={styles.heroIconButton}
            >
              <Ionicons
                name={saved ? "bookmark" : "bookmark-outline"}
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>{item.category}</Text>
            </View>
            <View style={styles.heroPublisher}>
              <View style={styles.publisherMark}>
                <Ionicons name="leaf" size={13} color="#FFFFFF" />
              </View>
              <Text style={styles.heroPublisherText}>
                {am ? "የትሪኒቲ የጤና ትምህርት" : "TRINITY HEALTH LEARNING"}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.articleHeader}>
          <Text style={styles.title}>{am ? item.titleAm : item.title}</Text>
          <Text style={styles.summary}>{am ? item.summaryAm : item.summary}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={17} color="#52735A" />
              <Text style={styles.metaText}>
                {item.readMinutes} {am ? "ደቂቃ ንባብ" : "min read"}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={16} color="#52735A" />
              <Text style={styles.metaText}>
                {sections.length} {am ? "ክፍሎች" : "sections"}
              </Text>
            </View>
          </View>
        </View>

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

        {relatedItems.length > 0 ? (
          <View style={styles.relatedSection}>
            <View style={styles.relatedHeader}>
              <View style={styles.relatedHeading}>
                <View style={styles.relatedIcon}>
                  <Ionicons
                    name="albums-outline"
                    size={18}
                    color="#287544"
                  />
                </View>
                <View style={styles.relatedHeadingCopy}>
                  <Text style={styles.relatedTitle}>
                    {am ? "ተዛማጅ ትምህርቶች" : "Related stories"}
                  </Text>
                  <Text style={styles.relatedSubtitle}>
                    {am
                      ? "የበለጠ ለማወቅ ይቀጥሉ"
                      : "Keep learning at your pace"}
                  </Text>
                </View>
              </View>
              <Text style={styles.relatedCount}>
                {relatedItems.length.toString().padStart(2, "0")}
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={styles.relatedList}
              showsHorizontalScrollIndicator={false}
            >
              {relatedItems.map((related) => (
                <Pressable
                  accessibilityRole="button"
                  key={related._id}
                  onPress={() => openRelatedArticle(related._id)}
                  style={({ pressed }) => [
                    styles.relatedCard,
                    pressed && styles.relatedCardPressed,
                  ]}
                >
                  <ImageBackground
                    source={{ uri: resolveHeroImage(related) }}
                    resizeMode="cover"
                    style={styles.relatedImage}
                    imageStyle={styles.relatedImageStyle}
                  >
                    <View style={styles.relatedImageShade} />
                    <Text numberOfLines={1} style={styles.relatedCategory}>
                      {related.category}
                    </Text>
                  </ImageBackground>
                  <View style={styles.relatedCardBody}>
                    <Text numberOfLines={2} style={styles.relatedCardTitle}>
                      {am ? related.titleAm : related.title}
                    </Text>
                    <View style={styles.relatedReadTime}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color="#66816B"
                      />
                      <Text style={styles.relatedReadTimeText}>
                        {related.readMinutes} {am ? "ደቂቃ" : "min"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7FAF6", flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 42 },
  heroBanner: {
    backgroundColor: "#163826",
    borderRadius: 25,
    height: 320,
    justifyContent: "space-between",
    overflow: "hidden",
    padding: 16,
  },
  heroImage: { borderRadius: 25 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#10271970",
  },
  heroTopBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  heroIconButton: {
    alignItems: "center",
    backgroundColor: "#122A1F70",
    borderColor: "#FFFFFF50",
    borderRadius: 15,
    borderWidth: 1,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  heroBottom: { gap: 12 },
  heroBadge: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFFF2",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    maxWidth: "90%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroBadgeDot: {
    backgroundColor: "#23804A",
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  heroBadgeText: {
    color: "#205B35",
    flexShrink: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },
  heroPublisher: { alignItems: "center", flexDirection: "row", gap: 8 },
  publisherMark: {
    alignItems: "center",
    backgroundColor: "#FFFFFF30",
    borderColor: "#FFFFFF50",
    borderRadius: 11,
    borderWidth: 1,
    height: 31,
    justifyContent: "center",
    width: 31,
  },
  heroPublisherText: {
    color: "#FFFFFF",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  articleHeader: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5ECE5",
    borderRadius: 21,
    borderWidth: 1,
    marginTop: -4,
    padding: 19,
    shadowColor: "#294433",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
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
  title: {
    color: "#183A25",
    fontFamily: "Righteous_400Regular",
    fontSize: 29,
    lineHeight: 37,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  metaItem: { alignItems: "center", flexDirection: "row", gap: 6 },
  metaDivider: { backgroundColor: "#D9E5DA", height: 18, width: 1 },
  metaText: {
    color: "#5F7564",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },
  summary: {
    color: "#536458",
    fontFamily: "Righteous_400Regular",
    fontSize: 17,
    lineHeight: 25,
    marginTop: 12,
  },
  introCard: {
    alignItems: "flex-start",
    backgroundColor: "#EAF4EB",
    borderColor: "#D9E9DA",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 21,
    padding: 15,
  },
  introText: {
    color: "#35543C",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E7EDE7",
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 14,
    padding: 16,
  },
  sectionHeading: { alignItems: "center", flexDirection: "row", gap: 10 },
  numberBadge: {
    alignItems: "center",
    backgroundColor: "#DDEEE0",
    borderRadius: 14,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  numberText: {
    color: "#087A3D",
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
  },
  sectionTitle: {
    color: "#203A28",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 19,
    lineHeight: 26,
  },
  sectionBody: {
    color: "#5D6B61",
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    lineHeight: 25,
    marginLeft: 42,
    marginTop: 11,
  },
  takeaway: {
    backgroundColor: "#FFF7E8",
    borderColor: "#F1E4C8",
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    padding: 17,
  },
  takeawayLabel: {
    color: "#93621F",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    letterSpacing: 1,
  },
  takeawayText: {
    color: "#634B2A",
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 7,
  },
  sourceCard: {
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E9E1",
    borderRadius: 17,
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
    fontSize: 14,
    lineHeight: 22,
  },
  readButton: {
    alignItems: "center",
    backgroundColor: "#087A3D",
    borderRadius: 16,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 20,
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  readButtonDone: { backgroundColor: "#E4F1E6" },
  readButtonText: { color: "#FFFFFF", fontFamily: "Righteous_400Regular", fontSize: 16 },
  readButtonTextDone: { color: "#087A3D" },
  sessionNote: {
    color: "#849087",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  relatedSection: { marginTop: 30 },
  relatedHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  relatedHeading: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  relatedIcon: {
    alignItems: "center",
    backgroundColor: "#E5F0E6",
    borderRadius: 13,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  relatedHeadingCopy: { flex: 1, gap: 2 },
  relatedTitle: {
    color: "#183A25",
    fontFamily: "Righteous_400Regular",
    fontSize: 19,
  },
  relatedSubtitle: {
    color: "#6A7B6D",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },
  relatedCount: {
    color: "#438451",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
  relatedList: { gap: 12, paddingBottom: 7, paddingRight: 2 },
  relatedCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E2EAE2",
    borderRadius: 18,
    borderWidth: 1,
    elevation: 2,
    overflow: "hidden",
    shadowColor: "#294433",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    width: 246,
  },
  relatedCardPressed: { opacity: 0.85, transform: [{ scale: 0.985 }] },
  relatedImage: { height: 126, justifyContent: "flex-end", padding: 11 },
  relatedImageStyle: { borderTopLeftRadius: 17, borderTopRightRadius: 17 },
  relatedImageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#10271950",
  },
  relatedCategory: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFFE8",
    borderRadius: 999,
    color: "#205B35",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    overflow: "hidden",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  relatedCardBody: { gap: 11, padding: 13 },
  relatedCardTitle: {
    color: "#203A28",
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 21,
    minHeight: 42,
  },
  relatedReadTime: { alignItems: "center", flexDirection: "row", gap: 5 },
  relatedReadTimeText: {
    color: "#66816B",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
  },
  missing: { flex: 1, justifyContent: "center", padding: 24 },
  missingTitle: {
    color: "#183A25",
    fontFamily: "Righteous_400Regular",
    fontSize: 24,
    marginTop: 18,
  },
  missingBody: {
    color: "#68766B",
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    lineHeight: 20,
    marginTop: 7,
  },
});
