import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { OpalLanguage } from "./opalTypes";

// ─── Shared types ─────────────────────────────────────────────────────────────

export type OpalSource = { id: string; title: string; titleAm: string };

export type OpalStructuredSection = {
  title: string;
  points: string[];
};

export type OpalServiceSuggestion = {
  title: string;
  description: string;
  actionText: string;
  actionUrl: string;
  phone?: string;
};

export type OpalStructuredAnswer = {
  summary: string;
  sections: OpalStructuredSection[];
  practicalTips?: string[];
  warningSigns?: string[];
  suggestedServices?: OpalServiceSuggestion[];
  supportPhone?: string;
  emergencyHelpline?: string;
};

// ─── Inline bold markdown renderer ───────────────────────────────────────────

function renderInlineBold(text: string, baseStyle: object): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={[baseStyle, styles.bold]}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    return (
      <Text key={index} style={baseStyle}>
        {part}
      </Text>
    );
  });
}

// ─── Raw markdown block parser ────────────────────────────────────────────────

type Block =
  | { type: "heading"; content: string }
  | { type: "bullet"; content: string }
  | { type: "paragraph"; content: string };

function parseMarkdownBlocks(raw: string): Block[] {
  const blocks: Block[] = [];
  for (const line of raw.split(/\r?\n/).map((l) => l.trim())) {
    if (!line) continue;
    if (line.startsWith("###") || line.startsWith("##")) {
      blocks.push({ type: "heading", content: line.replace(/^#{2,3}\s*/, "") });
    } else if (
      line.startsWith("•") ||
      line.startsWith("-") ||
      line.startsWith("*") ||
      /^\d+\.\s/.test(line)
    ) {
      blocks.push({ type: "bullet", content: line.replace(/^[•\-*\d.]+\s*/, "") });
    } else {
      blocks.push({ type: "paragraph", content: line });
    }
  }
  return blocks;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  text: string;
  structured?: OpalStructuredAnswer;
  language: OpalLanguage;
  sources?: OpalSource[];
  redFlag?: "none" | "clinical" | "urgent";
  onSourcePress?: (sourceId: string) => void;
}

export function OpalMessageRenderer({
  text,
  structured,
  language,
  sources,
  redFlag,
  onSourcePress,
}: Props) {
  const am = language === "am";
  const isUrgent = redFlag === "urgent";
  const isClinical = redFlag === "clinical";

  const callSupport = async (phone: string) => {
    try {
      await Linking.openURL(`tel:${phone.replace(/\s/g, "")}`);
    } catch {
      // silent fail — user can manually dial
    }
  };

  // ── Structured rendering ──────────────────────────────────────────────────

  if (structured && !isUrgent && !isClinical) {
    return (
      <View style={styles.root}>
        {/* Summary paragraph */}
        {!!structured.summary && (
          <Text style={styles.summary}>
            {renderInlineBold(structured.summary, styles.summary)}
          </Text>
        )}

        {/* Numbered section cards */}
        {structured.sections?.map((section, sIdx) => (
          <View key={sIdx} style={styles.sectionCard}>
            {!!section.title && (
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionBadge}>
                  <Text style={styles.sectionBadgeText}>{sIdx + 1}</Text>
                </View>
                <Text style={styles.sectionTitle}>
                  {section.title.replace(/^[\d.\s]+/, "")}
                </Text>
              </View>
            )}
            {section.points?.map((point, pIdx) => (
              <View key={pIdx} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>
                  {renderInlineBold(point, styles.bulletText)}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Practical tips card */}
        {structured.practicalTips && structured.practicalTips.length > 0 && (
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={15} color="#1c573e" />
              <Text style={styles.tipsLabel}>
                {am ? "ተግባራዊ እርምጃዎች" : "Practical Action Steps"}
              </Text>
            </View>
            {structured.practicalTips.map((tip, idx) => (
              <View key={idx} style={styles.tipRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#1c573e" />
                <Text style={styles.tipText}>
                  {renderInlineBold(tip, styles.tipText)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Warning signs card */}
        {structured.warningSigns && structured.warningSigns.length > 0 && (
          <View style={styles.warningCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="warning-outline" size={15} color="#b85626" />
              <Text style={styles.warningLabel}>
                {am
                  ? "አስቸኳይ ህክምና የሚፈልጉ ምልክቶች"
                  : "When to Seek Urgent Care"}
              </Text>
            </View>
            {structured.warningSigns.map((warning, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <View style={styles.warningBullet} />
                <Text style={styles.warningText}>
                  {renderInlineBold(warning, styles.warningText)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Trinity support strip */}
        <SupportStrip
          am={am}
          phone={structured.supportPhone ?? "+251988720194"}
          onCall={callSupport}
        />

        {/* Lesson sources */}
        {sources && sources.length > 0 && (
          <SourceLinks am={am} sources={sources} onPress={onSourcePress} />
        )}
      </View>
    );
  }

  // ── Fallback: raw markdown block rendering ────────────────────────────────

  const blocks = parseMarkdownBlocks(text);

  return (
    <View style={styles.root}>
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          return (
            <Text key={idx} style={styles.heading}>
              {renderInlineBold(block.content, styles.heading)}
            </Text>
          );
        }
        if (block.type === "bullet") {
          return (
            <View key={idx} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>
                {renderInlineBold(block.content, styles.bulletText)}
              </Text>
            </View>
          );
        }
        return (
          <Text key={idx} style={styles.paragraph}>
            {renderInlineBold(block.content, styles.paragraph)}
          </Text>
        );
      })}

      {/* Support strip for non-urgent fallback responses */}
      {!isUrgent && (
        <SupportStrip am={am} phone="+251988720194" onCall={callSupport} />
      )}

      {sources && sources.length > 0 && (
        <SourceLinks am={am} sources={sources} onPress={onSourcePress} />
      )}
    </View>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SupportStrip({
  am,
  phone,
  onCall,
}: {
  am: boolean;
  phone: string;
  onCall: (phone: string) => Promise<void>;
}) {
  return (
    <View style={styles.supportStrip}>
      <View style={styles.supportHeader}>
        <Ionicons name="heart-half-outline" size={14} color="#1c573e" />
        <Text style={styles.supportTitle}>
          {am
            ? "የትሪኒቲ ሄልዝ ሶሉሽን ድጋፍና አገልግሎቶች"
            : "Trinity Health Solution Support"}
        </Text>
        <View style={styles.supportBadge}>
          <Ionicons name="call-outline" size={10} color="#1c573e" />
          <Text style={styles.supportBadgeText}>
            {am ? "የደንበኞች አገልግሎት" : "Support"}
          </Text>
        </View>
      </View>
      <View style={styles.supportActions}>
        <Pressable
          onPress={() => void onCall(phone)}
          style={styles.callButton}
          accessibilityRole="button"
          accessibilityLabel={am ? "ስልክ ይደውሉ" : "Call support"}
        >
          <Ionicons name="call-outline" size={13} color="#fff" />
          <Text style={styles.callButtonText}>
            {am ? "ስልክ ይደውሉ · " : "Call Support · "}
            {phone.replace("+251988720194", "+251 98 872 0194")}
          </Text>
        </Pressable>
        <View style={styles.emergencyBadge}>
          <Text style={styles.emergencyLabel}>
            {am ? "ድንገተኛ:" : "Emergency:"}
          </Text>
          <Text style={styles.emergencyNumber}>952</Text>
        </View>
      </View>
    </View>
  );
}

function SourceLinks({
  am,
  sources,
  onPress,
}: {
  am: boolean;
  sources: OpalSource[];
  onPress?: (id: string) => void;
}) {
  return (
    <View style={styles.sources}>
      {sources.map((source) => (
        <Pressable
          key={source.id}
          style={styles.sourceLink}
          onPress={() => onPress?.(source.id)}
          accessibilityRole="link"
        >
          <Ionicons name="book-outline" size={13} color="#087A3D" />
          <Text style={styles.sourceLinkText} numberOfLines={2}>
            {am ? `ምንጭ: ${source.titleAm}` : `Read source: ${source.title}`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { gap: 10 },
  bold: { fontFamily: "Righteous_400Regular", color: "#143d2b" },

  // Summary
  summary: {
    color: "#1b3d2c",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },

  // Sections
  sectionCard: {
    backgroundColor: "#fafcf9",
    borderColor: "#e4ede3",
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  sectionTitleRow: {
    alignItems: "center",
    borderBottomColor: "#e9efe8",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingBottom: 8,
  },
  sectionBadge: {
    alignItems: "center",
    backgroundColor: "#1c573e",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  sectionBadgeText: {
    color: "#fff",
    fontFamily: "Righteous_400Regular",
    fontSize: 10,
  },
  sectionTitle: {
    color: "#16442f",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
  },

  // Bullets
  bulletRow: { alignItems: "flex-start", flexDirection: "row", gap: 8 },
  bullet: {
    backgroundColor: "#257348",
    borderRadius: 3,
    height: 6,
    marginTop: 7,
    width: 6,
  },
  bulletText: {
    color: "#2c4737",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },

  // Headings (fallback)
  heading: {
    color: "#16442f",
    fontFamily: "Righteous_400Regular",
    fontSize: 14,
    marginTop: 4,
  },
  paragraph: {
    color: "#22392c",
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },

  // Practical tips
  tipsCard: {
    backgroundColor: "#f2f8f3",
    borderColor: "#cbe1d0",
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  tipsHeader: { alignItems: "center", flexDirection: "row", gap: 6 },
  tipsLabel: {
    color: "#1c573e",
    fontFamily: "Righteous_400Regular",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  tipRow: { alignItems: "flex-start", flexDirection: "row", gap: 8 },
  tipText: {
    color: "#234b35",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },

  // Warning signs
  warningCard: {
    backgroundColor: "#fffaf5",
    borderColor: "#f3d6c4",
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  warningLabel: {
    color: "#b85626",
    fontFamily: "Righteous_400Regular",
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  warningBullet: {
    backgroundColor: "#b85626",
    borderRadius: 3,
    height: 6,
    marginTop: 7,
    width: 6,
  },
  warningText: {
    color: "#733515",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },

  // Support strip
  supportStrip: {
    backgroundColor: "#f4f9f4",
    borderColor: "#d2e2d6",
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    marginTop: 4,
    padding: 12,
  },
  supportHeader: { alignItems: "center", flexDirection: "row", gap: 6, flexWrap: "wrap" },
  supportTitle: {
    color: "#16442f",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
  },
  supportBadge: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#cfe0d4",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  supportBadgeText: {
    color: "#1c573e",
    fontFamily: "Righteous_400Regular",
    fontSize: 10,
  },
  supportActions: {
    alignItems: "center",
    borderTopColor: "#d8e6dc",
    borderTopWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 8,
  },
  callButton: {
    alignItems: "center",
    backgroundColor: "#1c573e",
    borderRadius: 999,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  callButtonText: {
    color: "#fff",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
  },
  emergencyBadge: { alignItems: "center", flexDirection: "row", gap: 4 },
  emergencyLabel: {
    color: "#64806e",
    fontFamily: "Righteous_400Regular",
    fontSize: 11,
  },
  emergencyNumber: {
    backgroundColor: "#ffece2",
    borderRadius: 4,
    color: "#a74619",
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  // Sources
  sources: { gap: 6, marginTop: 2 },
  sourceLink: {
    alignItems: "center",
    backgroundColor: "#EEF6EF",
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  sourceLinkText: {
    color: "#087A3D",
    flex: 1,
    fontFamily: "Righteous_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },
});
