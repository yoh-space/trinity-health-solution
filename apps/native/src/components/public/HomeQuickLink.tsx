import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type HomeQuickLinkProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export function HomeQuickLink({
  title,
  subtitle,
  icon,
  onPress,
}: HomeQuickLinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={19} color="#287544" />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={15} color="#77877A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E4EBE4",
    borderRadius: 15,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    minHeight: 66,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  pressed: { opacity: 0.8 },
  iconWrap: {
    alignItems: "center",
    backgroundColor: "#EAF4EB",
    borderRadius: 11,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  copy: { flex: 1, gap: 3 },
  title: { color: "#294433", fontFamily: "SemiBold", fontSize: 9 },
  subtitle: {
    color: "#7A887D",
    fontFamily: "Regular",
    fontSize: 8,
    lineHeight: 11,
  },
});
