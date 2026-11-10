import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/expo";
import { useAction } from "convex/react";
import { anyApi } from "convex/server";
import { useRouter, type Href } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GuestHomeHeader } from "../components/public/GuestHomeHeader";
import { OpalConsentModal } from "../components/opal/OpalConsentModal";
import { OpalHealthTools } from "../components/opal/OpalHealthTools";
import {
  OpalMessageRenderer,
  type OpalSource,
  type OpalStructuredAnswer,
} from "../components/opal/OpalMessageRenderer";
import { AUTHENTICATED_HOME_TABS } from "../constants/authRoutes";
import {
  classifyOpalQuestion,
  containsLikelyPersonalDetails,
  getOpalPrivacyResponse,
  getOpalSafetyResponse,
} from "../lib/opal/safety";
import { useTrinityStore } from "../store/useTrinityStore";

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: number;
  role: "user" | "opal";
  text: string;
  sources?: OpalSource[];
  safety?: boolean;
  redFlag?: "none" | "clinical" | "urgent";
  structured?: OpalStructuredAnswer;
  error?: boolean;
};

type AskOpalResult = {
  answer: string;
  safety: boolean;
  redFlag: "none" | "clinical" | "urgent";
  sources: OpalSource[];
  structured?: OpalStructuredAnswer;
};

type ActiveTab = "chat" | "tools";

// ─── Quick prompt suggestions (expanded to match web) ─────────────────────────

const QUICK_PROMPTS = [
  {
    id: "water-safety",
    en: "How do I make drinking water safe?",
    am: "የመጠጥ ውሃን እንዴት ደህንነቱን እጠብቃለሁ?",
  },
  {
    id: "pregnancy-food",
    en: "What foods should I choose during pregnancy?",
    am: "በእርግዝና ጊዜ ምን ልመገብ?",
  },
  {
    id: "infant-feeding",
    en: "What should I feed my 6-month-old?",
    am: "ለ 6 ወር ህጻን ምን ምግብ ልስጥ?",
  },
  {
    id: "food-hygiene",
    en: "How can I keep food preparation clean?",
    am: "የምግብ ማዘጋጃ ቦታን እንዴት ንጹህ ማድረግ እችላለሁ?",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function OpalScreen() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const language = useTrinityStore((state) => state.language);
  const askOpal = useAction(anyApi.opal.ask);

  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const nextMessageId = useRef(0);
  const scrollRef = useRef<ScrollView>(null);
  const am = language === "am";

  const homeRoute = isSignedIn ? AUTHENTICATED_HOME_TABS : "/public/home";
  const profileRoute = isSignedIn ? "/(app)/(tabs)/profile" : "/public/profile";
  const savedRoute = isSignedIn ? "/(app)/(tabs)/saved" : "/public/saved";

  // ── Sending logic ───────────────────────────────────────────────────────────

  const sendToGemini = async (text: string) => {
    const userMsgId = nextMessageId.current++;
    const opalMsgId = nextMessageId.current++;

    setMessages((prev) => [...prev, { id: userMsgId, role: "user", text }]);
    setDraft("");
    setIsSending(true);
    // Auto-scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const result = (await askOpal({
        consented: true,
        language,
        question: text,
      })) as AskOpalResult;

      setMessages((prev) => [
        ...prev,
        {
          id: opalMsgId,
          role: "opal",
          text: result.answer,
          safety: result.safety,
          redFlag: result.redFlag,
          sources: result.sources,
          structured: result.structured,
        },
      ]);
    } catch (error) {
      const code = error instanceof Error ? error.message : "";
      let message: string;
      if (code.includes("OPAL_NOT_CONFIGURED")) {
        message = am
          ? "ኦፓል ገና ከGemini ጋር አልተገናኘም። GEMINI_API_KEY ያስፈልጋል።"
          : "Opal is not connected to Gemini yet. Add GEMINI_API_KEY in Convex settings.";
      } else if (code.includes("OPAL_RATE_LIMIT")) {
        message = am
          ? "የGemini ነፃ ደረጃ ወደ ሙላቱ ደርሷል። ቆይተው እንደገና ይሞክሩ።"
          : "Gemini's free tier limit reached. Please try again later.";
      } else if (code.includes("OPAL_INVALID_API_KEY")) {
        message = am
          ? "የGemini API ቁልፉ አልሰራም። GEMINI_API_KEY ያረጋግጡ።"
          : "The Gemini API key was rejected. Check GEMINI_API_KEY in Convex settings.";
      } else {
        message = am
          ? "ኦፓል አሁን መልስ ማግኘት አልቻለም። ኢንተርኔትዎን ያረጋግጡ።"
          : "Opal couldn't get an answer right now. Check your connection.";
      }
      setMessages((prev) => [
        ...prev,
        { id: opalMsgId, role: "opal", text: message, error: true },
      ]);
    } finally {
      setIsSending(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    }
  };

  const initiateAsk = (rawText: string) => {
    const text = rawText.trim();
    if (!text || isSending) return;

    if (text.length > 1000) {
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId.current++,
          role: "opal",
          text: am
            ? "ጥያቄው በጣም ረጅም ነው። እስከ 1000 ፊደላት ድረስ ያሳጥሩት።"
            : "That question is too long. Please keep it under 1,000 characters.",
          error: true,
        },
      ]);
      return;
    }

    if (containsLikelyPersonalDetails(text)) {
      setMessages((prev) => [
        ...prev,
        {
          id: nextMessageId.current++,
          role: "opal",
          text: getOpalPrivacyResponse(language),
          safety: true,
        },
      ]);
      setDraft("");
      return;
    }

    const safetyIntent = classifyOpalQuestion(text);
    if (safetyIntent !== "safe") {
      const userMsgId = nextMessageId.current++;
      const opalMsgId = nextMessageId.current++;
      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", text },
        {
          id: opalMsgId,
          role: "opal",
          text: getOpalSafetyResponse(safetyIntent, language),
          safety: true,
          redFlag: safetyIntent,
        },
      ]);
      setDraft("");
      return;
    }

    if (aiConsent) {
      void sendToGemini(text);
      return;
    }

    // Show just-in-time consent modal instead of Alert
    setPendingQuestion(text);
    setConsentModalOpen(true);
  };

  const handleConsentConfirmed = () => {
    setAiConsent(true);
    setConsentModalOpen(false);
    const question = pendingQuestion ?? draft.trim();
    setPendingQuestion(null);
    if (question) void sendToGemini(question);
  };

  const handleConsentDismissed = () => {
    setConsentModalOpen(false);
    setPendingQuestion(null);
  };

  const submitDraft = () => initiateAsk(draft);

  const callCareTeam = async () => {
    try {
      await Linking.openURL("tel:+251988720194");
    } catch {
      // silent
    }
  };

  const handleSourcePress = (sourceId: string) => {
    router.push(`/public/article/${encodeURIComponent(sourceId)}` as Href);
  };

  // Switch to chat tab when a prompt from tools is selected
  const handleToolPrompt = (text: string) => {
    setActiveTab("chat");
    setTimeout(() => initiateAsk(text), 150);
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* ── Page header ── */}
        <View style={styles.pageHeader}>
          <GuestHomeHeader
            language={language}
            onHomePress={() => router.replace(homeRoute as Href)}
            onSavedPress={() => router.push(savedRoute as Href)}
            onSettingsPress={() => router.push(profileRoute as Href)}
          />
        </View>

        {/* ── Title row ── */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.eyebrow}>{am ? "ትንሽ መመሪያ" : "A LITTLE GUIDANCE"}</Text>
            <Text style={styles.title}>{am ? "ኦፓልን ይጠይቁ" : "Ask Opal"}</Text>
          </View>
          <Text style={styles.subtitle}>
            {am
              ? "Gemini ከታተሙ ትምህርቶች ጋር ምላሽ ይሰጣል።"
              : "Gemini answers using published lessons."}
          </Text>
        </View>

        {/* ── Tab switcher ── */}
        <View style={styles.tabBar}>
          <Pressable
            onPress={() => setActiveTab("chat")}
            style={[styles.tabBtn, activeTab === "chat" && styles.tabBtnActive]}
            accessibilityRole="tab"
          >
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={activeTab === "chat" ? "#fff" : "#547963"}
            />
            <Text
              style={[styles.tabText, activeTab === "chat" && styles.tabTextActive]}
            >
              {am ? "የኦፓል ውይይት" : "Message Opal"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("tools")}
            style={[styles.tabBtn, activeTab === "tools" && styles.tabBtnActive]}
            accessibilityRole="tab"
          >
            <Ionicons
              name="calculator-outline"
              size={14}
              color={activeTab === "tools" ? "#fff" : "#547963"}
            />
            <Text
              style={[styles.tabText, activeTab === "tools" && styles.tabTextActive]}
            >
              {am ? "የጤና መሳሪያዎች" : "Health Tools"}
            </Text>
          </Pressable>
        </View>

        {/* ── Chat panel ── */}
        {activeTab === "chat" && (
          <>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.conversation}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.conversationScroll}
            >
              {/* Welcome / empty state */}
              {!messages.length && (
                <>
                  <View style={styles.welcomeRow}>
                    <View style={styles.leafBadge}>
                      <Ionicons name="leaf" size={18} color="#2E8A4D" />
                    </View>
                    <View style={styles.welcomeBubble}>
                      <Text style={styles.welcomeTitle}>
                        {am ? "ሰላም! ምን እንመርምር?" : "Selam! What shall we explore?"}
                      </Text>
                      <Text style={styles.welcomeText}>
                        {am
                          ? "ከታች ያለውን ይምረጡ ወይም አጠቃላይ ጥያቄ ይጻፉ። የመገለጫ መረጃዎ አይላክም።"
                          : "Pick a question below or ask your own. Your profile is never sent."}
                      </Text>
                    </View>
                  </View>

                  {/* 2×2 quick prompts grid */}
                  <View style={styles.quickGrid}>
                    {QUICK_PROMPTS.map((q) => (
                      <Pressable
                        key={q.id}
                        accessibilityRole="button"
                        disabled={isSending}
                        onPress={() => initiateAsk(am ? q.am : q.en)}
                        style={({ pressed }) => [
                          styles.quickCard,
                          pressed && styles.quickCardPressed,
                        ]}
                      >
                        <Text style={styles.quickCardText} numberOfLines={3}>
                          {am ? q.am : q.en}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              {/* Message thread */}
              {!!messages.length && (
                <View style={styles.messageList}>
                  {messages.map((message) => {
                    const isOpal = message.role === "opal";
                    return (
                      <View
                        key={message.id}
                        style={[
                          styles.messageRow,
                          !isOpal && styles.userMessageRow,
                        ]}
                      >
                        {isOpal && (
                          <View style={styles.messageLeaf}>
                            <Ionicons name="leaf" size={13} color="#2E8A4D" />
                          </View>
                        )}
                        <View
                          style={[
                            styles.messageBubble,
                            isOpal
                              ? message.safety
                                ? styles.safetyBubble
                                : message.error
                                  ? styles.errorBubble
                                  : styles.opalBubble
                              : styles.userBubble,
                          ]}
                        >
                          {isOpal && !message.error ? (
                            <OpalMessageRenderer
                              text={message.text}
                              structured={message.structured}
                              language={language}
                              sources={message.sources}
                              redFlag={message.redFlag}
                              onSourcePress={handleSourcePress}
                            />
                          ) : (
                            <Text
                              style={[
                                styles.messageText,
                                !isOpal && styles.userMessageText,
                              ]}
                            >
                              {message.text}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}

                  {isSending && (
                    <View style={styles.messageRow}>
                      <View style={styles.messageLeaf}>
                        <Ionicons name="leaf" size={13} color="#2E8A4D" />
                      </View>
                      <View style={[styles.messageBubble, styles.opalBubble]}>
                        <Text style={styles.messageText}>
                          {am ? "ኦፓል እያሰበ ነው..." : "Opal is thinking..."}
                        </Text>
                      </View>
                    </View>
                  )}

                  <Pressable
                    disabled={isSending}
                    onPress={() => setMessages([])}
                    style={styles.resetButton}
                  >
                    <Ionicons name="refresh-outline" size={14} color="#438451" />
                    <Text style={styles.resetText}>
                      {am ? "አዲስ ውይይት ጀምር" : "Start a new conversation"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>

            {/* Chat composer */}
            <View style={styles.composerSection}>
              <View style={styles.composer}>
                <TextInput
                  accessibilityLabel={am ? "ጥያቄዎን ይጻፉ" : "Ask Opal a question"}
                  onChangeText={setDraft}
                  editable={!isSending}
                  onSubmitEditing={submitDraft}
                  placeholder={
                    am
                      ? "ስለ ምግብ፣ ውሃ ወይም ንጽህና ይጠይቁ..."
                      : "Ask about food, water or hygiene..."
                  }
                  placeholderTextColor="#9AA79D"
                  returnKeyType="send"
                  style={styles.input}
                  value={draft}
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={am ? "ጥያቄ ላክ" : "Send question"}
                  disabled={!draft.trim() || isSending}
                  onPress={submitDraft}
                  style={[
                    styles.sendButton,
                    (!draft.trim() || isSending) && styles.sendDisabled,
                  ]}
                >
                  <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
              <Text style={styles.disclaimer}>
                {am
                  ? "አጠቃላይ ትምህርት ብቻ። የመገለጫ መረጃ አይላክም፤ የግል ዝርዝሮችን አያስገቡ።"
                  : "General education only. Your profile isn't sent; don't include personal details."}
              </Text>
            </View>
          </>
        )}

        {/* ── Health Tools panel ── */}
        {activeTab === "tools" && (
          <OpalHealthTools
            language={language}
            onSelectPrompt={handleToolPrompt}
          />
        )}
      </KeyboardAvoidingView>

      {/* ── JIT Consent modal ── */}
      <OpalConsentModal
        isOpen={consentModalOpen}
        language={language}
        onClose={handleConsentDismissed}
        onConfirm={handleConsentConfirmed}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F8FBF8", flex: 1 },
  keyboardView: { flex: 1 },
  conversationScroll: { flex: 1 },

  pageHeader: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E2EAE3",
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 5,
  },

  titleRow: {
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#edf3ec",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  eyebrow: {
    color: "#438451",
    fontFamily: "Righteous_400Regular",
    fontSize: 11,
    letterSpacing: 1.1,
  },
  title: {
    color: "#203A28",
    fontFamily: "Righteous_400Regular",
    fontSize: 22,
    lineHeight: 25,
  },
  subtitle: {
    color: "#718075",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
  },

  // Tab bar
  tabBar: {
    backgroundColor: "#fff",
    borderBottomColor: "#e2eae3",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 6,
    padding: 8,
  },
  tabBtn: {
    alignItems: "center",
    borderColor: "#d2ddd0",
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 9,
  },
  tabBtnActive: {
    backgroundColor: "#1c573e",
    borderColor: "#1c573e",
  },
  tabText: {
    color: "#547963",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },
  tabTextActive: { color: "#fff" },

  // Conversation
  conversation: { paddingBottom: 10, paddingHorizontal: 15, paddingTop: 13 },

  // Welcome
  welcomeRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 7,
    marginBottom: 14,
  },
  leafBadge: {
    alignItems: "center",
    backgroundColor: "#E5F2E7",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    marginTop: 3,
    width: 28,
  },
  welcomeBubble: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DDE8DF",
    borderRadius: 14,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  welcomeTitle: {
    color: "#203A28",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
  },
  welcomeText: {
    color: "#657568",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  // 2×2 quick prompts
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DEE8DF",
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 60,
    padding: 10,
    width: "47.5%",
  },
  quickCardPressed: { backgroundColor: "#EEF7EF" },
  quickCardText: {
    color: "#4B6751",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 17,
  },

  // Messages
  messageList: { gap: 10, marginTop: 4 },
  messageRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 6,
  },
  userMessageRow: { justifyContent: "flex-end" },
  messageLeaf: {
    alignItems: "center",
    backgroundColor: "#E5F2E7",
    borderRadius: 11,
    height: 22,
    justifyContent: "center",
    width: 22,
  },
  messageBubble: { borderRadius: 13, maxWidth: "88%", padding: 11 },
  opalBubble: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DDE8DF",
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  safetyBubble: {
    backgroundColor: "#FFF8E8",
    borderColor: "#E6C982",
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  errorBubble: {
    backgroundColor: "#FFF1EE",
    borderColor: "#EBC6BD",
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  userBubble: { backgroundColor: "#347346", borderBottomRightRadius: 4 },
  messageText: {
    color: "#435649",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 19,
  },
  userMessageText: { color: "#FFFFFF" },

  resetButton: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 4,
    padding: 7,
  },
  resetText: {
    color: "#438451",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },

  // Composer
  composerSection: {
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E2EAE3",
    borderTopWidth: 1,
    paddingHorizontal: 13,
    paddingTop: 8,
    paddingBottom: 4,
  },
  composer: { alignItems: "center", flexDirection: "row", gap: 7 },
  input: {
    backgroundColor: "#F4F8F4",
    borderColor: "#CFE0D2",
    borderRadius: 18,
    borderWidth: 1,
    color: "#2A4431",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    height: 38,
    paddingHorizontal: 12,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: "#73B589",
    borderRadius: 17,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  sendDisabled: { backgroundColor: "#AFC7B4" },
  disclaimer: {
    color: "#829087",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 17,
    marginHorizontal: 4,
    marginTop: 5,
    marginBottom: 2,
    textAlign: "center",
  },
});
