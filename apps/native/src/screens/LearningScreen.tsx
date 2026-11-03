import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getEducationContent,
  type EducationItem,
} from "../components/public/educationContent";
import { useTrinityStore } from "../store/useTrinityStore";

const topics = [
  { key: "all", en: "All", am: "ሁሉም" },
  { key: "pregnancy", en: "Pregnancy", am: "እርግዝና" },
  { key: "breastfeeding", en: "Breastfeeding", am: "ጡት ማጥባት" },
  { key: "child-nutrition", en: "Child nutrition", am: "የህፃናት አመጋገብ" },
  { key: "food-safety", en: "Food safety", am: "የምግብ ደህንነት" },
  { key: "safe-water", en: "Clean water & hygiene", am: "ንጹህ ውሃ እና ንጽህና" },
];

export default function LearningScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("all");
  const published = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const content: EducationItem[] = getEducationContent(published);
  const language = useTrinityStore((state) => state.language);
  const savedIds = useTrinityStore((state) => state.savedIds);
  const toggleSaved = useTrinityStore((state) => state.toggleSaved);
  const am = language === "am";
  const filteredContent = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return content.filter((item) => {
      const matchesTopic =
        activeTopic === "all" ||
        (item.categoryKey ??
          item.category.toLowerCase().replaceAll(" ", "-")) === activeTopic;
      const searchable = [
        item.title,
        item.titleAm,
        item.summary,
        item.summaryAm,
        item.category,
      ]
        .join(" ")
        .toLocaleLowerCase();
      return matchesTopic && (!query || searchable.includes(query));
    });
  }, [activeTopic, content, search]);

  const openArticle = (id: string) =>
    router.push(`/public/article/${encodeURIComponent(id)}` as Href);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>TRINITY</Text>
            <Text style={styles.greeting}>
              {am ? "ለቤተሰብዎ የጤና ትምህርት" : "Health learning for your family"}
            </Text>
          </View>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{am ? "አማ" : "EN"}</Text>
          </View>
        </View>

        <ImageBackground
          source={require("../assets/images/health-worker-consultation.jpg")}
          imageStyle={styles.heroImage}
          style={styles.hero}
        >
          <View pointerEvents="none" style={styles.heroShade} />
          <View pointerEvents="none" style={styles.heroOrb} />
          <View style={styles.heroContent}>
            <View style={styles.heroKickerRow}>
              <View style={styles.heroSparkle}>
                <Ionicons name="sparkles" size={15} color="#E4F2BF" />
              </View>
              <Text style={styles.heroKicker}>
                {am ? "ዛሬ ትንሽ ይማሩ" : "LEARN A LITTLE TODAY"}
              </Text>
            </View>
            <Text style={styles.heroTitle}>
              {am
                ? "ቀላል መረጃ፣ ጤናማ ምርጫዎች"
                : "Clear information. Confident choices."}
            </Text>
            <Text style={styles.heroBody}>
              {am
                ? "በቤትዎ ውስጥ የሚሰሩ ትንሽ እርምጃዎችን ያግኙ።"
                : "Discover small, practical actions that fit your home."}
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color="#738278" />
          <TextInput
            accessibilityLabel={am ? "ትምህርት ፈልግ" : "Search lessons"}
            onChangeText={setSearch}
            placeholder={am ? "ትምህርት ፈልግ..." : "Search lessons..."}
            placeholderTextColor="#87938A"
            returnKeyType="search"
            style={styles.searchInput}
            value={search}
          />
          {search.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={am ? "ፍለጋን አጽዳ" : "Clear search"}
              hitSlop={8}
              onPress={() => setSearch("")}
            >
              <Ionicons name="close-circle" size={18} color="#89958C" />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.topicList}
          showsHorizontalScrollIndicator={false}
        >
          {topics.map((topic) => {
            const active = activeTopic === topic.key;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                key={topic.key}
                onPress={() => setActiveTopic(topic.key)}
                style={[styles.topicChip, active && styles.topicChipActive]}
              >
                <Text
                  style={[styles.topicText, active && styles.topicTextActive]}
                >
                  {am ? topic.am : topic.en}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeadingGroup}>
            <View style={styles.sectionIcon}>
              <Ionicons name="library-outline" size={18} color="#287544" />
            </View>
            <Text style={styles.sectionTitle}>
              {am ? "ለእርስዎ የተመረጠ" : "Picked for you"}
            </Text>
          </View>
          <View style={styles.sectionCount}>
            <Text style={styles.sectionMeta}>
              {filteredContent.length} {am ? "ትምህርቶች" : "lessons"}
            </Text>
          </View>
        </View>

        {filteredContent.length ? (
          filteredContent.map((item, index) => {
            const saved = savedIds.includes(item._id);
            return (
              <Pressable
                accessibilityRole="button"
                key={item._id}
                onPress={() => openArticle(item._id)}
                style={[styles.card, index === 0 && styles.featuredCard]}
              >
                <View style={styles.cardTop}>
                  <View style={styles.categoryPill}>
                    <View style={styles.categoryDot} />
                    <Text style={styles.category}>
                      {item.category}
                    </Text>
                  </View>
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
                    hitSlop={8}
                    onPress={(event) => {
                      event.stopPropagation();
                      toggleSaved(item._id);
                    }}
                  >
                    <View style={styles.saveButton}>
                      <Ionicons
                        color={saved ? "#087A3D" : "#6C7D70"}
                        name={saved ? "bookmark" : "bookmark-outline"}
                        size={19}
                      />
                    </View>
                  </Pressable>
                </View>
                <Text style={styles.cardTitle}>
                  {am ? item.titleAm : item.title}
                </Text>
                <Text numberOfLines={2} style={styles.cardBody}>
                  {am ? item.summaryAm : item.summary}
                </Text>
                <View style={styles.cardFooter}>
                  <View style={styles.readTimePill}>
                    <Ionicons
                      name="time-outline"
                      size={15}
                      color="#5F8066"
                    />
                    <Text style={styles.readTime}>
                      {item.readMinutes} {am ? "ደቂቃ ንባብ" : "min read"}
                    </Text>
                  </View>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={25}
                    color="#438451"
                  />
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={24} color="#65906E" />
            <Text style={styles.emptyTitle}>
              {am ? "ትምህርት አልተገኘም" : "No lessons found"}
            </Text>
            <Text style={styles.emptyCopy}>
              {am
                ? "ሌላ ቃል ይሞክሩ ወይም ሌላ ርዕስ ይምረጡ።"
                : "Try another search or choose a different topic."}
            </Text>
          </View>
        )}

        <Text style={styles.safeNote}>
          {am
            ? "ትሪኒቲ የጤና ትምህርት ብቻ ይሰጣል።"
            : "Trinity provides health learning, not clinical care."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7FAF6", flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 112 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  brand: {
    color: "#087A3D",
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    letterSpacing: 2.3,
  },
  greeting: {
    color: "#183A25",
    fontFamily: "Righteous_400Regular",
    fontSize: 23,
    marginTop: 5,
  },
  languageBadge: {
    alignItems: "center",
    backgroundColor: "#E8F2E9",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 42,
    minWidth: 48,
  },
  languageText: { color: "#087A3D", fontFamily: "Righteous_400Regular", fontSize: 15 },
  hero: {
    backgroundColor: "#173B27",
    borderRadius: 24,
    marginTop: 22,
    minHeight: 238,
    overflow: "hidden",
  },
  heroImage: { borderRadius: 24 },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#102C1FBA",
  },
  heroOrb: {
    borderColor: "#FFFFFF26",
    borderRadius: 90,
    borderWidth: 1,
    height: 180,
    position: "absolute",
    right: -54,
    top: 31,
    width: 180,
  },
  heroContent: { justifyContent: "center", minHeight: 238, padding: 21 },
  heroKickerRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  heroSparkle: {
    alignItems: "center",
    backgroundColor: "#FFFFFF28",
    borderRadius: 12,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  heroKicker: {
    color: "#E2F0D8",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    letterSpacing: 0.6,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: "Righteous_400Regular",
    fontSize: 30,
    lineHeight: 34,
    marginTop: 11,
  },
  heroBody: {
    color: "#F1F6EC",
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 11,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E9E1",
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 9,
    marginTop: 18,
    paddingHorizontal: 13,
    height: 54,
    shadowColor: "#294433",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    color: "#24392A",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
    height: "100%",
  },
  topicList: { gap: 9, paddingVertical: 16 },
  topicChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1EAE2",
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  topicChipActive: { backgroundColor: "#087A3D", borderColor: "#087A3D" },
  topicText: { color: "#59695E", fontFamily: "Righteous_400Regular", fontSize: 14 },
  topicTextActive: { color: "#FFFFFF", fontFamily: "Righteous_400Regular" },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
    marginBottom: 13,
  },
  sectionHeadingGroup: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 9,
  },
  sectionIcon: {
    alignItems: "center",
    backgroundColor: "#E5F0E6",
    borderRadius: 12,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  sectionTitle: {
    color: "#183A25",
    flexShrink: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 21,
  },
  sectionCount: {
    backgroundColor: "#EAF3EA",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  sectionMeta: { color: "#438451", fontFamily: "Righteous_400Regular", fontSize: 13 },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1EAE2",
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 11,
    padding: 17,
    shadowColor: "#294433",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  featuredCard: { borderColor: "#B9DBBF", borderWidth: 1.5, backgroundColor: "#FCFEFC" },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryPill: {
    alignItems: "center",
    backgroundColor: "#EAF4EB",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    maxWidth: "82%",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryDot: { backgroundColor: "#438451", borderRadius: 4, height: 7, width: 7 },
  category: {
    color: "#287544",
    flexShrink: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#F1F6F1",
    borderRadius: 14,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  cardTitle: {
    color: "#183A25",
    fontFamily: "Righteous_400Regular",
    fontSize: 20,
    lineHeight: 28,
    marginTop: 12,
  },
  cardBody: {
    color: "#627267",
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
  cardFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  readTimePill: {
    alignItems: "center",
    backgroundColor: "#F1F6F1",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  readTime: {
    color: "#5F8066",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },
  empty: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E1EAE2",
    borderRadius: 18,
    borderWidth: 1,
    padding: 24,
  },
  emptyTitle: {
    color: "#314938",
    fontFamily: "Righteous_400Regular",
    fontSize: 17,
    marginTop: 9,
  },
  emptyCopy: {
    color: "#738176",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 5,
    textAlign: "center",
  },
  safeNote: {
    color: "#728177",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 16,
    textAlign: "center",
  },
});
