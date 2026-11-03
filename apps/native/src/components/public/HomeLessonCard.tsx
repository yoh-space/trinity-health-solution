import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type HomeLessonCardProps = { category: string; title: string; minutes: string; image: number; saved: boolean; onPress: () => void; onToggleSaved: () => void };

export function HomeLessonCard({ category, title, minutes, image, saved, onPress, onToggleSaved }: HomeLessonCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Image source={image} style={styles.image} />
      <View style={styles.copy}><Text style={styles.category}>{category}</Text><Text style={styles.title}>{title}</Text><Text style={styles.time}>{minutes}</Text></View>
      <Pressable accessibilityRole="button" accessibilityLabel={saved ? "Remove saved lesson" : "Save lesson"} hitSlop={8} onPress={onToggleSaved} style={styles.save}><Ionicons name={saved ? "bookmark" : "bookmark-outline"} size={15} color="#62916C" /></Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderColor: "#E3EBE4", borderRadius: 17, borderWidth: 1, flexDirection: "row", gap: 12, marginBottom: 10, minHeight: 100, overflow: "hidden", padding: 10, position: "relative" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  image: { borderRadius: 12, height: 78, width: 78 },
  copy: { flex: 1, gap: 4, paddingRight: 24, paddingVertical: 2 },
  category: { color: "#39804E", fontFamily: "Righteous_400Regular", fontSize: 13, letterSpacing: 0.45 },
  title: { color: "#2D4132", fontFamily: "Righteous_400Regular", fontSize: 15, lineHeight: 20 },
  time: { color: "#849187", fontFamily: "Righteous_400Regular", fontSize: 13 },
  save: { alignItems: "center", height: 25, justifyContent: "center", position: "absolute", right: 7, top: 5, width: 25 },
});
