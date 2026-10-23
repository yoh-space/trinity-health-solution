import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useRouter, type Href } from "expo-router";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
import {
  classifyOpalQuestion,
  getOpalSafetyResponse,
} from "../lib/opal/safety";
import { useTrinityStore } from "../store/useTrinityStore";

type Question = {
  id: string;
  lessonId: string;
  sectionIndex: number;
  question: string;
  questionAm: string;
  keywords: string[];
};

type Message = {
  id: number;
  role: "user" | "opal";
  text: string;
  sourceId?: string;
  safety?: boolean;
};

const questions: Question[] = [
  {
    id: "food-hands",
    lessonId: "food-safety",
    sectionIndex: 0,
    question: "How can I keep food preparation clean?",
    questionAm: "ምግብ ሲዘጋጅ ንጽህናን እንዴት መጠበቅ እችላለሁ?",
    keywords: ["food", "clean", "hand", "wash", "hygiene", "እጅ", "ምግብ", "ንጽህና"],
  },
  {
    id: "pregnancy-food",
    lessonId: "pregnancy",
    sectionIndex: 0,
    question: "What foods can I choose during pregnancy?",
    questionAm: "በእርግዝና ጊዜ ምን ልመገብ?",
    keywords: ["pregnan", "pregnancy", "food", "eat", "እርግዝና", "መመገብ"],
  },
  {
    id: "child-texture",
    lessonId: "child-nutrition",
    sectionIndex: 0,
    question: "What texture is right for a young child?",
    questionAm: "ለታዳጊ ህፃን ምን ዓይነት ምግብ ማዘጋጀት አለብኝ?",
    keywords: ["child", "baby", "texture", "feed", "ህፃን", "ህጻን", "ልጅ"],
  },
  {
    id: "breastfeeding-water",
    lessonId: "breastfeeding",
    sectionIndex: 1,
    question: "What should I drink while breastfeeding?",
    questionAm: "ጡት በማጥባት ጊዜ ምን መጠጣት አለብኝ?",
    keywords: ["breastfeed", "nursing", "drink", "water", "ጡት", "ማጥባት", "ውሃ"],
  },
  {
    id: "safe-water",
    lessonId: "safe-water",
    sectionIndex: 2,
    question: "How do I make drinking water safe?",
    questionAm: "የመጠጥ ውሃን እንዴት ደህንነቱን መጠበቅ እችላለሁ?",
    keywords: ["water", "drink", "safe", "clean", "ውሃ", "መጠጥ"],
  },
];

export default function OpalScreen() {
  const router = useRouter();
  const language = useTrinityStore((state) => state.language);
  const published = useQuery(anyApi.education.listPublished) as
    | EducationItem[]
    | undefined;
  const content = getEducationContent(published);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const nextMessageId = useRef(0);
  const am = language === "am";

  const openLesson = (id: string) =>
    router.push(`/public/article/${encodeURIComponent(id)}` as Href);

  const answerQuestion = (text: string, preferredId?: string) => {
    const safetyIntent = classifyOpalQuestion(text);
    const normalized = text.toLocaleLowerCase();
    const matched =
      safetyIntent === "safe"
        ? (questions.find((question) => question.id === preferredId) ??
          questions
            .map((question) => ({
              question,
              score: question.keywords.filter((keyword) =>
                normalized.includes(keyword.toLocaleLowerCase()),
              ).length,
            }))
            .filter(({ score }) => score > 0)
            .sort((left, right) => right.score - left.score)[0]?.question)
        : undefined;
    const lesson = matched
      ? content.find((item) => item._id === matched.lessonId)
      : undefined;
    const sourceSection =
      lesson?.sections?.[matched?.sectionIndex ?? -1] ?? lesson?.sections?.[0];
    const response =
      safetyIntent !== "safe"
        ? getOpalSafetyResponse(safetyIntent, language)
        : lesson
          ? sourceSection
            ? am
              ? sourceSection.bodyAm
              : sourceSection.body
            : am
              ? lesson.contentAm
              : lesson.content
          : am
            ? "በአሁኑ ጊዜ በተዘጋጁ የትምህርት ማስታወሻዎች ውስጥ ለዚህ ጥያቄ መልስ የለኝም። ከብቁ የጤና ባለሙያ ጋር ይነጋገሩ።"
            : "I can only help with questions covered by the prepared learning notes. I don’t have a source-backed answer for this one; please ask a qualified health professional.";
    const questionMessage: Message = {
      id: nextMessageId.current++,
      role: "user",
      text,
    };
    const answerMessage: Message = {
      id: nextMessageId.current++,
      role: "opal",
      text: response,
      ...(safetyIntent !== "safe" ? { safety: true } : {}),
      ...(lesson ? { sourceId: lesson._id } : {}),
    };
    setMessages((previous) => [...previous, questionMessage, answerMessage]);
    setDraft("");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={am ? "ተመለስ" : "Go back"}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={19} color="#345B40" />
          </Pressable>
          <View style={styles.headerCenter}>
            <View style={styles.opalAvatar}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={18}
                color="#FFFFFF"
              />
            </View>
            <View>
              <Text style={styles.headerTitle}>Opal</Text>
              <Text style={styles.headerSubtitle}>
                {am ? "የትምህርት ረዳት" : "Learning companion"}
              </Text>
            </View>
          </View>
          <View style={styles.onlineBadge} />
        </View>

        <ScrollView
          contentContainerStyle={styles.conversation}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.privacyNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color="#52735A"
            />
            <Text style={styles.privacyText}>
              {am
                ? "ይህ የተዘጋጁ የትምህርት ማስታወሻዎች ብቻ የሚጠቀም የሙከራ ረዳት ነው። የግል ወይም የጤና መረጃ አያስገቡ።"
                : "Opal uses prepared learning notes only. Don’t share personal or health details."}
            </Text>
          </View>

          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>
              {am ? "ሰላም፣ እኔ ኦፓል ነኝ።" : "Hi, I’m Opal."}
            </Text>
            <Text style={styles.welcomeBody}>
              {am
                ? "ከእነዚህ የተዘጋጁ ጥያቄዎች ይምረጡ ወይም በታች ይጻፉ። መልሶቼ ከትምህርት ማስታወሻዎች ይመጣሉ።"
                : "Choose a suggested question or type below. Answers come from the learning notes."}
            </Text>
          </View>

          {!messages.length && (
            <View style={styles.suggestions}>
              <Text style={styles.suggestionsTitle}>
                {am ? "ሊጠይቁ የሚችሉት" : "SUGGESTED QUESTIONS"}
              </Text>
              {questions.map((question) => (
                <Pressable
                  accessibilityRole="button"
                  key={question.id}
                  onPress={() =>
                    answerQuestion(
                      am ? question.questionAm : question.question,
                      question.id,
                    )
                  }
                  style={({ pressed }) => [
                    styles.suggestion,
                    pressed && styles.suggestionPressed,
                  ]}
                >
                  <Text style={styles.suggestionText}>
                    {am ? question.questionAm : question.question}
                  </Text>
                  <Ionicons name="arrow-up-outline" size={16} color="#438451" />
                </Pressable>
              ))}
            </View>
          )}

          {messages.map((message) => {
            const isOpal = message.role === "opal";
            const source = message.sourceId
              ? content.find((item) => item._id === message.sourceId)
              : undefined;
            return (
              <View
                key={message.id}
                style={[styles.messageRow, !isOpal && styles.userMessageRow]}
              >
                {isOpal && (
                  <View style={styles.messageAvatar}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={14}
                      color="#FFFFFF"
                    />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isOpal
                      ? message.safety
                        ? styles.safetyBubble
                        : styles.opalBubble
                      : styles.userBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      !isOpal && styles.userMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  {source && (
                    <Pressable
                      accessibilityRole="link"
                      onPress={() => openLesson(source._id)}
                      style={styles.sourceLink}
                    >
                      <Ionicons name="book-outline" size={14} color="#087A3D" />
                      <Text style={styles.sourceLinkText}>
                        {am ? "ምንጭ" : "Read source"}:{" "}
                        {am ? source.titleAm : source.title}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={12}
                        color="#087A3D"
                      />
                    </Pressable>
                  )}
                  {isOpal && !source && (
                    <Text style={styles.unsourcedNote}>
                      {am
                        ? "ምንጭ ያለው መልስ አልተገኘም።"
                        : "No matching source note found."}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}

          {!!messages.length && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setMessages([])}
              style={styles.resetButton}
            >
              <Ionicons name="refresh-outline" size={15} color="#438451" />
              <Text style={styles.resetText}>
                {am ? "አዲስ ውይይት ጀምር" : "Start a new conversation"}
              </Text>
            </Pressable>
          )}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            accessibilityLabel={am ? "ጥያቄዎን ይጻፉ" : "Type your question"}
            multiline
            onChangeText={setDraft}
            onSubmitEditing={() => {
              if (draft.trim()) answerQuestion(draft.trim());
            }}
            placeholder={
              am ? "የጤና ወይም የግል መረጃ አያስገቡ..." : "Ask a general question..."
            }
            placeholderTextColor="#89958C"
            returnKeyType="send"
            style={styles.input}
            value={draft}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={am ? "ጥያቄ ላክ" : "Send question"}
            disabled={!draft.trim()}
            onPress={() => answerQuestion(draft.trim())}
            style={[styles.sendButton, !draft.trim() && styles.sendDisabled]}
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#F7FAF6", flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderBottomColor: "#E5ECE5",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingVertical: 11,
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#F6F9F6",
    borderRadius: 13,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  headerCenter: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    gap: 10,
    marginLeft: 12,
  },
  opalAvatar: {
    alignItems: "center",
    backgroundColor: "#347346",
    borderRadius: 15,
    height: 38,
    justifyContent: "center",
    width: 38,
  },
  headerTitle: { color: "#203A28", fontFamily: "Bold", fontSize: 14 },
  headerSubtitle: {
    color: "#7A887D",
    fontFamily: "Regular",
    fontSize: 10,
    marginTop: 2,
  },
  onlineBadge: {
    backgroundColor: "#79B681",
    borderColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 2,
    height: 12,
    width: 12,
  },
  conversation: { padding: 17, paddingBottom: 25 },
  privacyNote: {
    alignItems: "flex-start",
    backgroundColor: "#EAF4EB",
    borderRadius: 13,
    flexDirection: "row",
    gap: 8,
    padding: 11,
  },
  privacyText: {
    color: "#49634E",
    flex: 1,
    fontFamily: "Regular",
    fontSize: 10,
    lineHeight: 15,
  },
  welcomeCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E4EBE4",
    borderRadius: 17,
    borderWidth: 1,
    marginTop: 18,
    padding: 15,
  },
  welcomeTitle: { color: "#203A28", fontFamily: "Bold", fontSize: 16 },
  welcomeBody: {
    color: "#68766B",
    fontFamily: "Regular",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  suggestions: { marginTop: 22 },
  suggestionsTitle: {
    color: "#7A887D",
    fontFamily: "Bold",
    fontSize: 9,
    letterSpacing: 1,
    marginBottom: 9,
  },
  suggestion: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E3EBE4",
    borderRadius: 13,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 13,
    paddingVertical: 12,
  },
  suggestionPressed: { backgroundColor: "#EFF6F0" },
  suggestionText: {
    color: "#35543C",
    flex: 1,
    fontFamily: "Medium",
    fontSize: 11,
    lineHeight: 16,
  },
  messageRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 7,
    marginTop: 14,
  },
  userMessageRow: { justifyContent: "flex-end" },
  messageAvatar: {
    alignItems: "center",
    backgroundColor: "#347346",
    borderRadius: 12,
    height: 25,
    justifyContent: "center",
    width: 25,
  },
  messageBubble: {
    borderRadius: 15,
    maxWidth: "84%",
    padding: 12,
  },
  opalBubble: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E3EBE4",
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  safetyBubble: {
    backgroundColor: "#FFF7E8",
    borderColor: "#E6C982",
    borderWidth: 1,
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#347346",
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: "#435649",
    fontFamily: "Regular",
    fontSize: 12,
    lineHeight: 18,
  },
  userMessageText: { color: "#FFFFFF" },
  sourceLink: {
    alignItems: "center",
    backgroundColor: "#EEF6EF",
    borderRadius: 9,
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  sourceLinkText: {
    color: "#087A3D",
    flex: 1,
    fontFamily: "SemiBold",
    fontSize: 9,
    lineHeight: 13,
  },
  unsourcedNote: {
    color: "#89958C",
    fontFamily: "Regular",
    fontSize: 9,
    marginTop: 7,
  },
  resetButton: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    gap: 5,
    marginTop: 18,
    padding: 8,
  },
  resetText: { color: "#438451", fontFamily: "SemiBold", fontSize: 10 },
  composer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopColor: "#E5ECE5",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  input: {
    backgroundColor: "#F5F8F5",
    borderColor: "#E3EBE4",
    borderRadius: 15,
    borderWidth: 1,
    color: "#283E2E",
    flex: 1,
    fontFamily: "Regular",
    fontSize: 12,
    maxHeight: 88,
    minHeight: 42,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: "#087A3D",
    borderRadius: 15,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  sendDisabled: { backgroundColor: "#A6B5A9" },
});
