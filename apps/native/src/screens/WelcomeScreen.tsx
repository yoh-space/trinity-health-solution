import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PatternDivider } from "../components/welcome/PatternDivider";
import { WelcomeLanguagePicker } from "../components/welcome/WelcomeLanguagePicker";
import { WelcomeStoryPanel } from "../components/welcome/WelcomeStoryPanel";
import {
  type WelcomeLanguage,
  welcomeCopy,
} from "../components/welcome/welcomeCopy";
import { useTrinityStore } from "../store/useTrinityStore";

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { language: savedLanguage, setLanguage } = useTrinityStore();
  const [language, setWelcomeLanguage] =
    useState<WelcomeLanguage>(savedLanguage);
  const copy = welcomeCopy[language];
  const isTablet = width >= 900;

  const selectLanguage = (nextLanguage: WelcomeLanguage) => {
    setWelcomeLanguage(nextLanguage);
    setLanguage(nextLanguage);
  };

  const begin = () => {
    router.push("/onboarding" as Href);
  };

  const explore = () => {
    router.push("/public/home" as Href);
  };

  const phoneContent = (
    <View style={[styles.phoneContent, isTablet && styles.tabletPhoneContent]}>
      <View style={styles.brand}>
        <Image
          source={require("../assets/images/trinity-symbol.png")}
          resizeMode="contain"
          style={styles.brandSymbol}
        />
        <Text style={styles.brandName}>Trinity Health Solution</Text>
      </View>

      <View
        style={[styles.heroImageFrame, isTablet && styles.tabletHeroImageFrame]}
      >
        <Image
          source={require("../assets/images/health-worker-consultation.jpg")}
          resizeMode="cover"
          style={styles.heroImage}
          accessibilityLabel="A health worker in a white coat consulting a young patient"
        />
        <View pointerEvents="none" style={styles.heroOverlay}>
          <View style={styles.imageShade} />
          <Text style={styles.imageBadge}>{copy.badge}</Text>
        </View>
      </View>

      <View style={styles.intro}>
        <Text style={styles.eyebrow} numberOfLines={1}>
          {copy.eyebrow}
        </Text>
        <Text style={styles.title}>
          {copy.headlineFirst}
          {"\n"}
          <Text style={language === "en" ? styles.titleEmphasis : undefined}>
            {copy.headlineSecond}
          </Text>
        </Text>
        <Text style={styles.description}>{copy.introduction}</Text>
        <Text style={styles.sdgText}>{copy.sdg}</Text>
        <Text style={styles.closingText}>{copy.closing}</Text>
      </View>

      <View style={styles.categories}>
        <View style={styles.categoryPill}>
          <Ionicons
            name="book-outline"
            size={16}
            color="#365F42"
            accessibilityElementsHidden
          />
          <Text style={styles.categoryText}>{copy.categories[0]}</Text>
        </View>
        <View style={styles.categoryPill}>
          <MaterialCommunityIcons
            name="stethoscope"
            size={17}
            color="#365F42"
            accessibilityElementsHidden
          />
          <Text style={styles.categoryText}>{copy.categories[1]}</Text>
        </View>
        <View style={styles.categoryPill}>
          <Ionicons
            name="heart-outline"
            size={16}
            color="#365F42"
            accessibilityElementsHidden
          />
          <Text style={styles.categoryText}>{copy.categories[2]}</Text>
        </View>
      </View>

      <PatternDivider style={styles.patternDivider} />

      <View style={styles.languageSection}>
        <Text style={styles.languagePrompt}>{copy.languagePrompt}</Text>
        <WelcomeLanguagePicker language={language} onSelect={selectLanguage} />
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={begin}
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.primaryButtonText}>{copy.begin}</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={explore}
        style={({ pressed }) => [
          styles.exploreButton,
          pressed && styles.explorePressed,
        ]}
      >
        <Text style={styles.exploreText}>{copy.explore}</Text>
        <Ionicons name="chevron-forward" size={15} color="#586D5D" />
      </Pressable>

      <View style={styles.privacyNote}>
        <Ionicons
          name="shield-checkmark-outline"
          size={16}
          color="#558262"
          accessibilityElementsHidden
        />
        <Text style={styles.privacyText}>{copy.privacyNote}</Text>
      </View>
      {!isTablet && <View style={styles.homeIndicator} />}
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/welcome-dots.png")}
      resizeMode="repeat"
      style={styles.background}
      imageStyle={styles.patternImage}
    >
      <StatusBar backgroundColor="#E6F1E8" barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {isTablet ? (
          <View style={styles.tabletLayout}>
            <WelcomeStoryPanel />
            <View style={styles.phoneFrame}>
              <ScrollView
                contentContainerStyle={styles.tabletScroll}
                showsVerticalScrollIndicator={false}
              >
                {phoneContent}
              </ScrollView>
            </View>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.mobileScroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.mobilePhone}>{phoneContent}</View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { backgroundColor: "#E6F1E8", flex: 1 },
  patternImage: { opacity: 0.8 },
  safeArea: { flex: 1 },
  mobileScroll: { flexGrow: 1, justifyContent: "center", paddingBottom: 10 },
  mobilePhone: {
    alignSelf: "center",
    maxWidth: 460,
    width: "100%",
  },
  phoneContent: {
    backgroundColor: "#F8FCF9",
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  tabletPhoneContent: { paddingHorizontal: 17, paddingTop: 2 },
  brand: { alignItems: "center", flexDirection: "row", gap: 9, height: 47 },
  brandSymbol: { height: 38, width: 43 },
  brandName: { color: "#1B492C", fontFamily: "MBold", fontSize: 14 },
  heroImageFrame: {
    borderRadius: 18,
    height: 176,
    marginTop: 3,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  tabletHeroImageFrame: { height: 150 },
  heroImage: { height: "100%", width: "100%" },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 48, 27, 0.16)",
  },
  imageBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#08743CE8",
    borderColor: "#FFFFFF77",
    borderRadius: 15,
    borderWidth: 1,
    color: "#FFFFFF",
    fontFamily: "SemiBold",
    fontSize: 10,
    margin: 10,
    overflow: "hidden",
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  intro: { paddingTop: 14 },
  eyebrow: {
    color: "#39834F",
    fontFamily: "Bold",
    fontSize: 10,
    letterSpacing: 0.4,
  },
  title: {
    color: "#14251A",
    fontFamily: "Bold",
    fontSize: 27,
    lineHeight: 33,
    marginTop: 7,
  },
  titleEmphasis: { color: "#247B44", fontFamily: "MBold" },
  description: {
    color: "#35453A",
    fontFamily: "Regular",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
  },
  sdgText: {
    color: "#35453A",
    fontFamily: "Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  closingText: {
    color: "#267842",
    fontFamily: "SemiBold",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },
  categories: { flexDirection: "row", gap: 7, marginTop: 11 },
  categoryPill: {
    alignItems: "center",
    backgroundColor: "#E8F4EB",
    borderRadius: 20,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  categoryText: { color: "#365F42", fontFamily: "SemiBold", fontSize: 11 },
  patternDivider: { marginTop: 14, marginBottom: 2 },
  languageSection: {
    marginTop: 6,
    paddingTop: 4,
  },
  languagePrompt: {
    color: "#26382C",
    fontFamily: "SemiBold",
    fontSize: 13,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#08713B",
    borderRadius: 16,
    flexDirection: "row",
    gap: 9,
    justifyContent: "center",
    marginTop: 12,
    minHeight: 56,
    paddingHorizontal: 18,
    shadowColor: "#08713B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonPressed: { backgroundColor: "#075F32", opacity: 0.88 },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Bold",
    fontSize: 15,
  },
  exploreButton: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    marginTop: 8,
    minHeight: 38,
    paddingHorizontal: 8,
  },
  explorePressed: { opacity: 0.65 },
  exploreText: {
    color: "#586D5D",
    fontFamily: "SemiBold",
    fontSize: 12,
    textDecorationLine: "none",
  },
  privacyNote: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    marginTop: 9,
    paddingHorizontal: 2,
  },
  privacyText: {
    color: "#558262",
    flexShrink: 1,
    fontFamily: "Medium",
    fontSize: 11,
    textAlign: "center",
  },
  homeIndicator: {
    alignSelf: "center",
    backgroundColor: "#26352C",
    borderRadius: 3,
    height: 5,
    marginTop: 18,
    width: 108,
  },
  tabletLayout: {
    alignItems: "stretch",
    flex: 1,
    flexDirection: "row",
    gap: 70,
    justifyContent: "center",
    maxWidth: 1120,
    paddingHorizontal: 28,
    width: "100%",
    alignSelf: "center",
  },
  phoneFrame: {
    alignSelf: "center",
    backgroundColor: "#17231B",
    borderRadius: 31,
    borderColor: "#17231B",
    borderWidth: 6,
    elevation: 12,
    flexShrink: 0,
    height: "94%",
    maxHeight: 860,
    overflow: "hidden",
    width: 410,
  },
  tabletScroll: { flexGrow: 1 },
});
