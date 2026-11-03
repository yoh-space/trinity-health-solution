import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type HomeQuickLinkProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  image?: number;
  onPress: () => void;
};

export function HomeQuickLink({ title, subtitle, icon, image, onPress }: HomeQuickLinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {image ? <Image source={image} style={styles.image} /> : <View style={styles.iconWrap}><Ionicons name={icon} size={20} color="#287544" /></View>}
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="arrow-forward" size={14} color="#77877A" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderColor: "#E1EAE2", borderRadius: 18, borderWidth: 1, elevation: 2, flex: 1, minHeight: 145, overflow: "hidden", paddingBottom: 12, shadowColor: "#294433", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 7 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.985 }] },
  image: { height: 70, marginBottom: 10, width: "100%" },
  iconWrap: { alignItems: "center", backgroundColor: "#EAF4EB", borderRadius: 13, height: 42, justifyContent: "center", margin: 12, width: 42 },
  copy: { flex: 1, paddingHorizontal: 12 },
  title: { color: "#294433", fontFamily: "Righteous_400Regular", fontSize: 15, lineHeight: 19 },
  subtitle: { color: "#7A887D", fontFamily: "Righteous_400Regular", fontSize: 13, lineHeight: 18, marginTop: 5 },
});
