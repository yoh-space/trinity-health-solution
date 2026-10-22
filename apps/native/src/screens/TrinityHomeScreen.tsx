import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DailyLessonCard } from "../components/public/DailyLessonCard";
import { GuestHomeHeader } from "../components/public/GuestHomeHeader";
import { HomeLessonCard } from "../components/public/HomeLessonCard";
import { HomeQuickLink } from "../components/public/HomeQuickLink";
import { homeCopy } from "../components/public/homeContent";
import { useTrinityStore } from "../store/useTrinityStore";

export default function TrinityHomeScreen() {
  const router = useRouter();
  const { language, setLanguage, savedIds } = useTrinityStore();
  const copy = homeCopy[language];
  const am = language === "am";

  const openLearn = () => router.push("/public/learn" as Href);

  const showLanguageSettings = () => {
    Alert.alert(copy.settingsTitle, undefined, [
      { text: copy.english, onPress: () => setLanguage("en") },
      { text: copy.amharic, onPress: () => setLanguage("am") },
      { text: copy.cancel, style: "cancel" },
    ]);
  };

  const showSavedLessons = () => router.push("/public/saved" as Href);

  const showOpalInfo = () => {
    Alert.alert(copy.opalTitle, copy.opalMessage, [
      { text: copy.cancel, style: "cancel" },
      { text: copy.openLearn, onPress: openLearn },
    ]);
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <GuestHomeHeader
          language={language}
          onSavedPress={showSavedLessons}
          onSettingsPress={showLanguageSettings}
        />

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
          <Text style={styles.welcome}>{copy.welcome}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>
        </View>

        <DailyLessonCard copy={copy} onPress={openLearn} />

        <View style={styles.quickLinks}>
          <HomeQuickLink
            icon="restaurant-outline"
            title={copy.recipeAction}
            subtitle={copy.recipeSub}
            onPress={() => router.push("/public/food" as Href)}
          />
          <HomeQuickLink
            icon="bookmark-outline"
            title={copy.notesAction}
            subtitle={copy.notesSub}
            onPress={showSavedLessons}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{copy.growTitle}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={openLearn}
            style={styles.seeAll}
          >
            <Text style={styles.seeAllText}>{copy.seeAll}</Text>
            <Ionicons
              name={am ? "arrow-back" : "arrow-forward"}
              size={13}
              color="#438451"
            />
          </Pressable>
        </View>

        <HomeLessonCard
          category={copy.pregnancy}
          title={copy.pregnancyTitle}
          minutes={copy.readTime(4)}
          icon="heart-outline"
          onPress={openLearn}
        />
        <HomeLessonCard
          category={copy.childNutrition}
          title={copy.childNutritionTitle}
          minutes={copy.readTime(3)}
          icon="nutrition-outline"
          onPress={openLearn}
        />

        <Pressable
          accessibilityRole="button"
          onPress={showOpalInfo}
          style={({ pressed }) => [
            styles.opalCard,
            pressed && styles.opalPressed,
          ]}
        >
          <View style={styles.opalIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.opalCopy}>
            <Text style={styles.opalTitle}>{copy.askOpal}</Text>
            <Text style={styles.opalSubtitle}>{copy.askOpalSub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
        </Pressable>

        <View style={styles.footer}>
          <Ionicons name="leaf-outline" size={15} color="#6B9272" />
          <Text style={styles.footerText}>{copy.footer}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7FAF7", flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 6 },
  intro: { marginBottom: 16 },
  eyebrow: {
    color: "#54805E",
    fontFamily: "Bold",
    fontSize: 8,
    letterSpacing: 1,
  },
  welcome: {
    color: "#1C3524",
    fontFamily: "MBold",
    fontSize: 23,
    marginTop: 7,
  },
  subtitle: {
    color: "#6D7B70",
    fontFamily: "Regular",
    fontSize: 11,
    marginTop: 4,
  },
  quickLinks: { flexDirection: "row", gap: 9, marginBottom: 23 },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  sectionTitle: { color: "#233D2B", fontFamily: "MBold", fontSize: 16 },
  seeAll: { alignItems: "center", flexDirection: "row", gap: 4 },
  seeAllText: { color: "#438451", fontFamily: "SemiBold", fontSize: 9 },
  opalCard: {
    alignItems: "center",
    backgroundColor: "#315F3E",
    borderRadius: 16,
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    padding: 13,
  },
  opalPressed: { opacity: 0.85 },
  opalIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF26",
    borderRadius: 12,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  opalCopy: { flex: 1, gap: 4 },
  opalTitle: { color: "#FFFFFF", fontFamily: "SemiBold", fontSize: 10 },
  opalSubtitle: { color: "#DBE9DD", fontFamily: "Regular", fontSize: 8 },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    marginTop: 18,
  },
  footerText: { color: "#829086", fontFamily: "Regular", fontSize: 8 },
});
