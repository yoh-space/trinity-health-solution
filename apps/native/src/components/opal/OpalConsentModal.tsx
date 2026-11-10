import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { OpalLanguage } from "./opalTypes";

interface Props {
  isOpen: boolean;
  language: OpalLanguage;
  onClose: () => void;
  onConfirm: () => void;
}

export function OpalConsentModal({ isOpen, language, onClose, onConfirm }: Props) {
  const am = language === "am";
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 22,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 400,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Dimmed backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Sheet */}
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#1c573e" />
            </View>
            <Text style={styles.headerTitle}>
              {am ? "Gemini የሚቀበለው መረጃ" : "What Gemini Will Receive"}
            </Text>
            <Pressable
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel={am ? "ዝጋ" : "Close"}
            >
              <Ionicons name="close" size={18} color="#637d6a" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.body}
            contentContainerStyle={styles.bodyContent}
            showsVerticalScrollIndicator={false}
          >
            {/* What IS sent */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="checkmark-circle-outline" size={15} color="#1c573e" />
                <Text style={styles.infoCardLabel}>
                  {am ? "ለGemini ምን ይላካል" : "What is sent to Gemini"}
                </Text>
              </View>
              <Text style={styles.bodyText}>
                {am
                  ? "• ጥያቄዎ\n• ተዛማጅ የታተሙ የጤና ትምህርቶች"
                  : "• Your question\n• Relevant published health lesson text"}
              </Text>
            </View>

            {/* What is NOT sent */}
            <View style={styles.infoCardAlt}>
              <View style={styles.infoCardHeader}>
                <Ionicons name="close-circle-outline" size={15} color="#b85626" />
                <Text style={[styles.infoCardLabel, { color: "#7d3010" }]}>
                  {am ? "የማይላክ መረጃ" : "What is never sent"}
                </Text>
              </View>
              <Text style={styles.bodyText}>
                {am
                  ? "• የሂሳብ ማንነት ወይም ስም\n• የውይይት ታሪክ\n• የቅድሚያ ምዝገባ ፕሮፋይልዎ"
                  : "• Your account identity or name\n• Your earlier chat messages\n• Your onboarding profile"}
              </Text>
            </View>

            {/* Free-tier notice */}
            <View style={styles.noticeCard}>
              <Ionicons name="information-circle-outline" size={15} color="#8f5a14" />
              <Text style={styles.noticeText}>
                {am
                  ? "በነፃ ደረጃ፣ Google ምርቶቹን ለማሻሻል ጥያቄዎችንና መልሶችን ሊጠቀምባቸው ወይም የሰው ገምጋሚዎች ሊያዩአቸው ይችላሉ። ስም፣ የስልክ ቁጥር ወይም የጤና ዝርዝሮችን አያስገቡ።"
                  : "On the free tier, Google may use submitted questions and answers to improve its products, and human reviewers may see them. Do not enter names, contact details, or personal health information."}
              </Text>
            </View>

            {/* General education disclaimer */}
            <Text style={styles.disclaimer}>
              {am
                ? "ኦፓል አጠቃላይ የጤና ትምህርት ይሰጣል። የግል ምርመራ ወይም ሕክምና አይሰጥም።"
                : "Opal provides general health education only — not personal diagnosis or treatment."}
            </Text>
          </ScrollView>

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable
              style={styles.cancelBtn}
              onPress={onClose}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>{am ? "ተመለስ" : "Cancel"}</Text>
            </Pressable>
            <Pressable
              style={styles.confirmBtn}
              onPress={onConfirm}
              accessibilityRole="button"
            >
              <Ionicons name="checkmark-outline" size={16} color="#fff" />
              <Text style={styles.confirmText}>
                {am ? "እስማማለሁ፣ ቀጥል" : "Agree & Continue"}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,25,15,0.45)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 20,
  },
  safeArea: { paddingHorizontal: 20 },
  handle: {
    alignSelf: "center",
    backgroundColor: "#dde6de",
    borderRadius: 999,
    height: 4,
    marginBottom: 16,
    marginTop: 10,
    width: 40,
  },

  // Header
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  headerIcon: {
    alignItems: "center",
    backgroundColor: "#eaf4eb",
    borderRadius: 10,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  headerTitle: {
    color: "#163826",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 16,
  },
  closeBtn: { padding: 4 },

  // Body
  body: { maxHeight: 340 },
  bodyContent: { gap: 12, paddingBottom: 8 },
  bodyText: {
    color: "#355742",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: "#f4f9f4",
    borderColor: "#cce0cc",
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  infoCardAlt: {
    backgroundColor: "#fff9f5",
    borderColor: "#f3d6c4",
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  infoCardHeader: { alignItems: "center", flexDirection: "row", gap: 6 },
  infoCardLabel: {
    color: "#1c573e",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    fontWeight: "700",
  },

  noticeCard: {
    backgroundColor: "#fdf7f0",
    borderColor: "#e8c88a",
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  noticeText: {
    color: "#6b4710",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },

  disclaimer: {
    color: "#637d6a",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },

  // Actions
  actions: {
    borderTopColor: "#e5eee5",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    paddingBottom: 8,
    paddingTop: 14,
  },
  cancelBtn: {
    alignItems: "center",
    borderColor: "#c8d8c8",
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 13,
  },
  cancelText: {
    color: "#547963",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
  confirmBtn: {
    alignItems: "center",
    backgroundColor: "#1c573e",
    borderRadius: 14,
    flex: 2,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 13,
  },
  confirmText: {
    color: "#fff",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
});
