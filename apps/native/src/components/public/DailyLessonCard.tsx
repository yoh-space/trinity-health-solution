import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DailyLessonCardProps = {
  copy: {
    todaysLesson: string;
    lessonNumber: string;
    foodSafety: string;
    lessonTitle: string;
    lessonSummary: string;
    learnTogether: string;
    minutes: string;
  };
  onPress: () => void;
};

export function DailyLessonCard({ copy, onPress }: DailyLessonCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.kicker}>{copy.todaysLesson}</Text>
        <Text style={styles.number}>{copy.lessonNumber}</Text>
      </View>
      <View style={styles.titleRow}>
        <View style={styles.iconWrap}>
          <Ionicons name="leaf-outline" size={16} color="#D7F0D8" />
        </View>
        <Text style={styles.category}>{copy.foodSafety}</Text>
      </View>
      <Text style={styles.title}>{copy.lessonTitle}</Text>
      <Text style={styles.summary}>{copy.lessonSummary}</Text>
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [
            styles.action,
            pressed && styles.actionPressed,
          ]}
        >
          <Text style={styles.actionText}>{copy.learnTogether}</Text>
          <Ionicons name="arrow-forward" size={16} color="#1D6E3B" />
        </Pressable>
        <View style={styles.duration}>
          <Ionicons name="time-outline" size={14} color="#D9EEDB" />
          <Text style={styles.durationText}>{copy.minutes}</Text>
        </View>
      </View>
      <View pointerEvents="none" style={styles.decorCircle} />
      <View pointerEvents="none" style={styles.decorLeaf}>
        <Ionicons name="leaf" size={86} color="#FFFFFF17" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#126D3A",
    borderRadius: 22,
    marginBottom: 15,
    overflow: "hidden",
    padding: 18,
    position: "relative",
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  kicker: {
    color: "#D2EBD4",
    fontFamily: "Bold",
    fontSize: 9,
    letterSpacing: 0.9,
  },
  number: { color: "#C2E4C6", fontFamily: "SemiBold", fontSize: 9 },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 17,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#FFFFFF1A",
    borderRadius: 9,
    height: 27,
    justifyContent: "center",
    width: 27,
  },
  category: { color: "#E1F2E3", fontFamily: "Bold", fontSize: 9 },
  title: {
    color: "#FFFFFF",
    fontFamily: "MBold",
    fontSize: 20,
    lineHeight: 27,
    marginTop: 10,
    maxWidth: "94%",
  },
  summary: {
    color: "#D8EBDD",
    fontFamily: "Regular",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
    maxWidth: "94%",
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    marginTop: 17,
  },
  action: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    flexDirection: "row",
    gap: 7,
    minHeight: 37,
    paddingHorizontal: 12,
  },
  actionPressed: { opacity: 0.82 },
  actionText: { color: "#23673A", fontFamily: "Bold", fontSize: 10 },
  duration: { alignItems: "center", flexDirection: "row", gap: 5 },
  durationText: { color: "#D9EEDB", fontFamily: "Medium", fontSize: 9 },
  decorCircle: {
    borderColor: "#FFFFFF10",
    borderRadius: 100,
    borderWidth: 18,
    height: 150,
    position: "absolute",
    right: -57,
    top: 35,
    width: 150,
  },
  decorLeaf: { bottom: -4, position: "absolute", right: 0 },
});
