import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useTrinityStore } from "../store/useTrinityStore";

const starterContent = [
  {
    _id: "starter-1",
    category: "Family wellbeing",
    readMinutes: 4,
    title: "Build a balanced family plate",
    titleAm: "ለቤተሰብ የተመጣጠነ ምግብ ያዘጋጁ",
    summary: "Simple, familiar foods can form a nourishing meal.",
    summaryAm: "ቀላል እና የምናውቃቸው ምግቦች ገንቢ ምግብ ሊሆኑ ይችላሉ።",
    content:
      "Choose familiar foods from different groups and make small changes that work for your household.",
    contentAm: "ከተለያዩ የምግብ ቡድኖች የምናውቃቸውን ምግቦች ይምረጡ፣ ለቤተሰብዎ የሚሰሩ ትንሽ ለውጦች ያድርጉ።",
  },
  {
    _id: "starter-2",
    category: "Daily habits",
    readMinutes: 3,
    title: "Small routines, stronger days",
    titleAm: "ትንሽ ልምዶች፣ የተሻሉ ቀናት",
    summary: "Make room for rest, water, movement, and shared meals.",
    summaryAm: "ለእረፍት፣ ለውሃ፣ ለእንቅስቃሴ እና ለጋራ ምግብ ቦታ ይስጡ።",
    content:
      "A supportive routine does not need to be perfect. Begin with one useful habit.",
    contentAm: "ደጋፊ ልምድ ፍጹም መሆን አይጠበቅበትም። በአንድ ጠቃሚ ልምድ ይጀምሩ።",
  },
];

type EducationItem = (typeof starterContent)[number];

export default function LearningScreen() {
  // The generated API regains full typing after `convex dev` is connected.
  const published = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const content: EducationItem[] = published?.length
    ? published
    : starterContent;
  const { language, savedIds, toggleSaved } = useTrinityStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["58%", "88%"], []);
  const selected = content.find((item) => item._id === selectedId);

  const openArticle = useCallback((id: string) => {
    setSelectedId(id);
    sheetRef.current?.snapToIndex(0);
  }, []);

  const save = (id: string) => {
    const alreadySaved = savedIds.includes(id);
    toggleSaved(id);
    Toast.show({
      type: "success",
      text1: alreadySaved ? "Removed from saved learning" : "Saved for later",
    });
  };

  const am = language === "am";
  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scroll}
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

        <View style={styles.hero}>
          <Text style={styles.heroKicker}>
            {am ? "ዛሬ ትንሽ ይማሩ" : "LEARN A LITTLE TODAY"}
          </Text>
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {am ? "ለእርስዎ የተመረጠ" : "Picked for you"}
          </Text>
          <Text style={styles.sectionMeta}>
            {content.length} {am ? "ትምህርቶች" : "lessons"}
          </Text>
        </View>
        {content.map((item, index) => {
          const title = am ? item.titleAm : item.title;
          const summary = am ? item.summaryAm : item.summary;
          const saved = savedIds.includes(item._id);
          return (
            <Pressable
              key={item._id}
              onPress={() => openArticle(item._id)}
              style={[styles.card, index === 0 && styles.featuredCard]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.category}>
                  {item.category.toUpperCase()}
                </Text>
                <Pressable hitSlop={8} onPress={() => save(item._id)}>
                  <Ionicons
                    color={saved ? "#087A3D" : "#6C7D70"}
                    name={saved ? "bookmark" : "bookmark-outline"}
                    size={21}
                  />
                </Pressable>
              </View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text numberOfLines={2} style={styles.cardBody}>
                {summary}
              </Text>
              <Text style={styles.readTime}>
                {item.readMinutes} {am ? "ደቂቃ ንባብ" : "min read"}
              </Text>
            </Pressable>
          );
        })}
        <Text style={styles.safeNote}>
          {am
            ? "ትሪኒቲ የጤና ትምህርት ብቻ ይሰጣል።"
            : "Trinity provides health learning, not clinical care."}
        </Text>
      </ScrollView>

      <BottomSheet
        backgroundStyle={styles.sheetBackground}
        enablePanDownToClose
        index={-1}
        ref={sheetRef}
        snapPoints={snapPoints}
      >
        {selected && (
          <BottomSheetView style={styles.sheetContent}>
            <Text style={styles.category}>
              {selected.category.toUpperCase()}
            </Text>
            <Text style={styles.sheetTitle}>
              {am ? selected.titleAm : selected.title}
            </Text>
            <Text style={styles.sheetBody}>
              {am ? selected.contentAm : selected.content}
            </Text>
            <Pressable
              onPress={() => save(selected._id)}
              style={styles.saveButton}
            >
              <Ionicons
                color="#FFFFFF"
                name={
                  savedIds.includes(selected._id)
                    ? "bookmark"
                    : "bookmark-outline"
                }
                size={19}
              />
              <Text style={styles.saveButtonText}>
                {savedIds.includes(selected._id)
                  ? am
                    ? "ተቀምጧል"
                    : "Saved"
                  : am
                    ? "ለኋላ ያስቀምጡ"
                    : "Save for later"}
              </Text>
            </Pressable>
          </BottomSheetView>
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAF6" },
  scroll: { padding: 22, paddingBottom: 100 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  brand: {
    color: "#087A3D",
    fontFamily: "Bold",
    fontSize: 13,
    letterSpacing: 2.3,
  },
  greeting: {
    color: "#183A25",
    fontFamily: "MBold",
    fontSize: 22,
    marginTop: 5,
  },
  languageBadge: {
    alignItems: "center",
    backgroundColor: "#DDEEE0",
    borderRadius: 16,
    justifyContent: "center",
    minHeight: 38,
    minWidth: 44,
  },
  languageText: { color: "#087A3D", fontFamily: "Bold", fontSize: 12 },
  hero: {
    backgroundColor: "#087A3D",
    borderRadius: 26,
    marginTop: 24,
    overflow: "hidden",
    padding: 24,
  },
  heroKicker: {
    color: "#BBE5BE",
    fontFamily: "Bold",
    fontSize: 11,
    letterSpacing: 1.4,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: "MBold",
    fontSize: 31,
    lineHeight: 38,
    marginTop: 13,
  },
  heroBody: {
    color: "#D8EFDA",
    fontFamily: "Regular",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  sectionHeader: {
    alignItems: "baseline",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 29,
    marginBottom: 12,
  },
  sectionTitle: { color: "#183A25", fontFamily: "Bold", fontSize: 20 },
  sectionMeta: { color: "#738278", fontFamily: "Medium", fontSize: 13 },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1EAE2",
    borderRadius: 21,
    borderWidth: 1,
    marginBottom: 13,
    padding: 18,
  },
  featuredCard: { borderColor: "#B9DBBF", borderWidth: 1.5 },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    color: "#087A3D",
    fontFamily: "Bold",
    fontSize: 10,
    letterSpacing: 1.1,
  },
  cardTitle: {
    color: "#183A25",
    fontFamily: "Bold",
    fontSize: 19,
    lineHeight: 25,
    marginTop: 12,
  },
  cardBody: {
    color: "#627267",
    fontFamily: "Regular",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
  },
  readTime: {
    color: "#809084",
    fontFamily: "Medium",
    fontSize: 12,
    marginTop: 15,
  },
  safeNote: {
    color: "#728177",
    fontFamily: "Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    textAlign: "center",
  },
  sheetBackground: { backgroundColor: "#FFFFFF", borderRadius: 28 },
  sheetContent: { padding: 24 },
  sheetTitle: {
    color: "#183A25",
    fontFamily: "MBold",
    fontSize: 27,
    lineHeight: 34,
    marginTop: 12,
  },
  sheetBody: {
    color: "#526258",
    fontFamily: "Regular",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 17,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#087A3D",
    borderRadius: 18,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    marginTop: 26,
    paddingVertical: 14,
  },
  saveButtonText: { color: "#FFFFFF", fontFamily: "Bold", fontSize: 15 },
});
