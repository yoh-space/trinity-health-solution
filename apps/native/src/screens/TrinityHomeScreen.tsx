import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useRouter, type Href } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GuestHomeHeader } from "../components/public/GuestHomeHeader";
import { HomeLessonCard } from "../components/public/HomeLessonCard";
import { HomeQuickLink } from "../components/public/HomeQuickLink";
import { homeCopy } from "../components/public/homeContent";
import { AUTHENTICATED_HOME_TABS } from "../constants/authRoutes";
import { useTrinityStore } from "../store/useTrinityStore";

// ─── Static fallback services (shown if Convex has no published services yet) ──

const STATIC_SERVICES = [
  {
    id: "lactation",
    icon: "heart-outline",
    badgeEn: "Maternal Health",
    badgeAm: "የእናቶች ጤና",
    titleEn: "Lactation & Postpartum Support",
    titleAm: "የጡት ማጥባት እና የአራስ እናቶች",
    href: "/learn",
    accent: "#eef6f0",
  },
  {
    id: "infant",
    icon: "happy-outline",
    badgeEn: "Child Nutrition",
    badgeAm: "የህፃናት አመጋገብ",
    titleEn: "Infant Feeding & Pantry",
    titleAm: "የህፃናት ምግብ እና ጓዳ",
    href: "/#pantry",
    accent: "#f9f1e8",
  },
  {
    id: "opal",
    icon: "chatbubble-ellipses-outline",
    badgeEn: "24/7 AI Companion",
    badgeAm: "AI ረዳት",
    titleEn: "Ask Opal AI Guide",
    titleAm: "ኦፓል AI ረዳት",
    href: "/ask-opal",
    accent: "#edf3f8",
  },
  {
    id: "consult",
    icon: "people-outline",
    badgeEn: "Clinical & Community",
    badgeAm: "የባለሙያ ድጋፍ",
    titleEn: "Care Consultations",
    titleAm: "የጤና ምክክር",
    href: "/portal/consultations/new",
    accent: "#f2eff8",
  },
];

export default function TrinityHomeScreen() {
  const liveServices = useQuery(anyApi.services.listPublished);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { language, savedIds, toggleSaved } = useTrinityStore();
  const copy = homeCopy[language];
  const entrance = useRef(new Animated.Value(0)).current;

  const homeRoute = isSignedIn ? AUTHENTICATED_HOME_TABS : "/public/home";
  const profileRoute = isSignedIn ? "/(app)/(tabs)/profile" : "/public/profile";
  const savedRoute = isSignedIn ? "/(app)/(tabs)/saved" : "/public/saved";
  const foodRoute = isSignedIn ? "/(app)/(tabs)/food" : "/public/food";
  const learnRoute = isSignedIn ? "/(app)/(tabs)/learn" : "/public/learn";
  const openArticle = (id: string) =>
    router.push(`/public/article/${encodeURIComponent(id)}` as Href);
  const showSettings = () => router.push(profileRoute as Href);
  const showSavedLessons = () => router.push(savedRoute as Href);

  useEffect(() => {
    const animation = Animated.spring(entrance, {
      damping: 18,
      delay: 80,
      stiffness: 110,
      toValue: 1,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [entrance]);

  const entranceStyle = {
    opacity: entrance,
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 1],
          outputRange: [14, 0],
        }),
      },
    ],
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, entranceStyle]}>
          <GuestHomeHeader
            language={language}
            onHomePress={() => router.replace(homeRoute as Href)}
            onSavedPress={showSavedLessons}
            onSettingsPress={showSettings}
          />

          <View style={styles.intro}>
            <View style={styles.eyebrow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrowText}>{copy.eyebrow}</Text>
            </View>
            <Text style={styles.welcome}>{copy.welcome}</Text>
            <Text style={styles.subtitle}>{copy.subtitle}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${copy.foodSafety}: ${copy.lessonTitle}`}
            onPress={() => openArticle("food-safety")}
            style={({ pressed }) => [
              styles.hero,
              pressed && styles.heroPressed,
            ]}
          >
            <ImageBackground
              source={require("../assets/images/health-worker-consultation.jpg")}
              resizeMode="cover"
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
            >
              <View pointerEvents="none" style={styles.heroShade} />
              <View pointerEvents="none" style={styles.heroRing} />
              <View style={styles.heroContent}>
                <View style={styles.heroTopRow}>
                  <View style={styles.heroBadge}>
                    <Ionicons
                      name="book-outline"
                      size={13}
                      color="#E8F3BB"
                    />
                    <Text style={styles.heroBadgeText}>
                      {copy.todaysLesson}
                    </Text>
                  </View>
                  <Text style={styles.heroNumber}>{copy.lessonNumber}</Text>
                </View>

                <View style={styles.heroDetails}>
                  <View style={styles.heroCategory}>
                    <Ionicons name="leaf-outline" size={15} color="#D8F0B4" />
                    <Text style={styles.heroCategoryText}>
                      {copy.foodSafety}
                    </Text>
                  </View>
                  <Text style={styles.heroTitle}>{copy.lessonTitle}</Text>
                  <Text style={styles.heroSummary}>
                    {copy.lessonSummary}
                  </Text>
                  <View style={styles.heroBottomRow}>
                    <View style={styles.heroAction}>
                      <Text style={styles.heroActionText}>
                        {copy.learnTogether}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color="#17482C"
                      />
                    </View>
                    <View style={styles.heroDuration}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color="#F1F6EC"
                      />
                      <Text style={styles.heroDurationText}>
                        {copy.minutes}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </Pressable>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeadingGroup}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="compass-outline"
                  size={17}
                  color="#287544"
                />
              </View>
              <Text style={styles.sectionTitle}>{copy.exploreTitle}</Text>
            </View>
          </View>

          <View style={styles.quickLinks}>
            <HomeQuickLink
              icon="restaurant-outline"
              image={require("../assets/images/kitchen-meal.jpg")}
              title={copy.recipeAction}
              subtitle={copy.recipeSub}
              onPress={() => router.push(foodRoute as Href)}
            />
            <HomeQuickLink
              icon="bookmark-outline"
              title={copy.notesAction}
              subtitle={copy.notesSub}
              onPress={showSavedLessons}
            />
          </View>

          <View style={[styles.sectionHeader, styles.growthHeader]}>
            <View style={styles.sectionHeadingGroup}>
              <View style={styles.sectionIcon}>
                <Ionicons name="leaf-outline" size={17} color="#287544" />
              </View>
              <Text style={styles.sectionTitle}>{copy.growTitle}</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(learnRoute as Href)}
              style={({ pressed }) => [
                styles.seeAll,
                pressed && styles.seeAllPressed,
              ]}
            >
              <Text style={styles.seeAllText}>{copy.seeAll}</Text>
              <Ionicons name="arrow-forward" size={14} color="#287544" />
            </Pressable>
          </View>

          <HomeLessonCard
            category={copy.pregnancy}
            title={copy.pregnancyTitle}
            minutes={copy.readTime(4)}
            image={require("../assets/images/pregnancy-plate.jpg")}
            saved={savedIds.includes("pregnancy")}
            onToggleSaved={() => toggleSaved("pregnancy")}
            onPress={() => openArticle("pregnancy")}
          />
          <HomeLessonCard
            category={copy.childNutrition}
            title={copy.childNutritionTitle}
            minutes={copy.readTime(3)}
            image={require("../assets/images/child-feeding.jpg")}
            saved={savedIds.includes("child-nutrition")}
            onToggleSaved={() => toggleSaved("child-nutrition")}
            onPress={() => openArticle("child-nutrition")}
          />

          {/* ── Our Services section ── */}
          <View style={[styles.sectionHeader, styles.growthHeader]}>
            <View style={styles.sectionHeadingGroup}>
              <View style={styles.sectionIcon}>
                <Ionicons name="grid-outline" size={17} color="#287544" />
              </View>
              <Text style={styles.sectionTitle}>
                {language === "am" ? "አገልግሎቶቻችን" : "Our Services"}
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesRow}
          >
            {/* Use live Convex data if seeded, otherwise static fallback */}
            {(liveServices && liveServices.length > 0
              ? liveServices.slice(0, 5).map((s: any) => ({
                  id: s.slug ?? s._id,
                  icon: (s.icon as string) ?? "grid-outline",
                  badgeEn: s.badgeEn ?? "",
                  badgeAm: s.badgeAm ?? "",
                  titleEn: s.categoryEn ?? "",
                  titleAm: s.categoryAm ?? "",
                  href: s.primaryCtaHref ?? "/",
                  accent: "#eef6f0",
                }))
              : STATIC_SERVICES
            ).map((service: any) => (
              <Pressable
                key={service.id}
                style={({ pressed }) => [
                  styles.serviceCard,
                  { backgroundColor: service.accent ?? "#eef6f0" },
                  pressed && styles.serviceCardPressed,
                ]}
                onPress={() => {
                  const url = service.href;
                  if (url.startsWith("http")) {
                    void Linking.openURL(url);
                  } else {
                    // Deep-link or just navigate to opal tab for in-app links
                    if (url.includes("ask-opal") || url.includes("opal")) {
                      router.push("/(app)/(tabs)/opal" as Href);
                    } else if (url.includes("learn")) {
                      router.push(isSignedIn ? "/(app)/(tabs)/learn" : "/public/learn" as Href);
                    } else {
                      router.push(isSignedIn ? "/(app)/(tabs)/care" : "/public/home" as Href);
                    }
                  }
                }}
                accessibilityRole="button"
              >
                <View style={styles.serviceCardIcon}>
                  <Ionicons
                    name={(service.icon as any) ?? "grid-outline"}
                    size={18}
                    color="#1c573e"
                  />
                </View>
                <Text style={styles.serviceCardBadge} numberOfLines={1}>
                  {language === "am" ? service.badgeAm : service.badgeEn}
                </Text>
                <Text style={styles.serviceCardTitle} numberOfLines={2}>
                  {language === "am" ? service.titleAm : service.titleEn}
                </Text>
                <Ionicons name="arrow-forward-outline" size={13} color="#1c573e" style={styles.serviceCardArrow} />
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.footerIcon}>
              <Ionicons name="leaf-outline" size={14} color="#438451" />
            </View>
            <Text style={styles.footerText}>{copy.footer}</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F5F8F4", flex: 1 },
  scrollContent: { paddingBottom: 94 },
  content: { paddingHorizontal: 18, paddingTop: 8 },
  intro: { marginBottom: 19, marginTop: 2 },
  eyebrow: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#E8F2E9",
    borderRadius: 999,
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  eyebrowDot: {
    backgroundColor: "#4F9B5E",
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  eyebrowText: {
    color: "#39764A",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    letterSpacing: 0.45,
  },
  welcome: {
    color: "#1C3524",
    fontFamily: "Righteous_400Regular",
    fontSize: 29,
    lineHeight: 34,
    marginTop: 10,
  },
  subtitle: {
    color: "#69796D",
    fontFamily: "Righteous_400Regular",
    fontSize: 15,
    lineHeight: 18,
    marginTop: 3,
  },
  hero: {
    backgroundColor: "#173B27",
    borderRadius: 24,
    elevation: 8,
    marginBottom: 26,
    shadowColor: "#1A3D28",
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },
  heroPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  heroImage: { borderRadius: 24, minHeight: 310, overflow: "hidden" },
  heroImageStyle: { borderRadius: 24 },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#102C1FBA",
  },
  heroRing: {
    borderColor: "#FFFFFF24",
    borderRadius: 100,
    borderWidth: 1,
    height: 174,
    position: "absolute",
    right: -66,
    top: 54,
    width: 174,
  },
  heroContent: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: 310,
    padding: 18,
  },
  heroTopRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroBadge: {
    alignItems: "center",
    backgroundColor: "#FFFFFF24",
    borderColor: "#FFFFFF30",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    maxWidth: "75%",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  heroBadgeText: {
    color: "#FFFFFF",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },
  heroNumber: {
    color: "#F2F6E9",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  heroDetails: { marginTop: 26 },
  heroCategory: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  heroCategoryText: {
    color: "#E3F0D8",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: "Righteous_400Regular",
    fontSize: 24,
    lineHeight: 28,
  },
  heroSummary: {
    color: "#E5EEE7",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  heroBottomRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 17,
  },
  heroAction: {
    alignItems: "center",
    backgroundColor: "#E5F0CF",
    borderRadius: 999,
    flexDirection: "row",
    gap: 9,
    minHeight: 40,
    paddingHorizontal: 14,
  },
  heroActionText: {
    color: "#17482C",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
  heroDuration: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  heroDurationText: {
    color: "#F1F6EC",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  sectionTitle: {
    color: "#233D2B",
    flexShrink: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 19,
  },
  quickLinks: { flexDirection: "row", gap: 11 },
  growthHeader: { marginBottom: 13, marginTop: 26 },
  seeAll: {
    alignItems: "center",
    backgroundColor: "#E9F2E9",
    borderRadius: 999,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  seeAllPressed: { opacity: 0.72 },
  seeAllText: {
    color: "#287544",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
  footer: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 22,
  },
  footerIcon: {
    alignItems: "center",
    backgroundColor: "#E9F2E9",
    borderRadius: 999,
    height: 26,
    justifyContent: "center",
    width: 26,
  },
  footerText: {
    color: "#738176",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },

  // Services section
  servicesRow: {
    gap: 10,
    paddingBottom: 4,
    paddingHorizontal: 0,
  },
  serviceCard: {
    borderRadius: 18,
    gap: 6,
    padding: 14,
    width: 155,
  },
  serviceCardPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  serviceCardIcon: {
    alignItems: "center",
    backgroundColor: "rgba(28,87,62,0.1)",
    borderRadius: 10,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  serviceCardBadge: {
    color: "#355742",
    fontFamily: "Righteous_400Regular",
    fontSize: 11,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  serviceCardTitle: {
    color: "#163826",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 17,
  },
  serviceCardArrow: { marginTop: 4 },
});
