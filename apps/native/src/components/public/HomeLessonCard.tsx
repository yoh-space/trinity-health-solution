import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HomeLessonCardProps = {
  category: string;
  title: string;
  minutes: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function HomeLessonCard({
  category,
  title,
  minutes,
  icon,
  onPress,
}: HomeLessonCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={18} color="#317A48" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{minutes}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#7B8A7E" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E3EBE4",
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    marginBottom: 9,
    padding: 11,
  },
  pressed: { opacity: 0.8 },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#EDF5EE",
    borderRadius: 12,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  copy: { flex: 1, gap: 3 },
  category: {
    color: "#39804E",
    fontFamily: "Bold",
    fontSize: 8,
    letterSpacing: 0.4,
  },
  title: {
    color: "#2D4132",
    fontFamily: "SemiBold",
    fontSize: 10,
    lineHeight: 14,
  },
  time: { color: "#849187", fontFamily: "Regular", fontSize: 8 },
});
