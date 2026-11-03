import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter, type Href } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTrinityStore } from "../store/useTrinityStore";

type OpalFloatingButtonProps = {
  href: Href;
};

export default function OpalFloatingButton({
  href,
}: OpalFloatingButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const language = useTrinityStore((state) => state.language);

  if (pathname.endsWith("/opal") || pathname.includes("/article/")) return null;

  const label = language === "am" ? "ኦፓልን ይጠይቁ" : "Ask Opal";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push(href)}
      style={({ pressed }) => [
        styles.button,
        { bottom: 80 + insets.bottom },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="chatbubble-outline" size={21} color="#FFFFFF" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#0E7A33",
    borderColor: "#7DC21E",
    borderRadius: 999,
    borderWidth: 2,
    elevation: 8,
    flexDirection: "row",
    gap: 8,
    height: 52,
    paddingHorizontal: 16,
    position: "absolute",
    right: 16,
    shadowColor: "#0E7A33",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    zIndex: 15,
  },
  label: {
    color: "#FFFFFF",
    fontFamily: "Righteous_400Regular",
    fontSize: 17,
  },
  pressed: { opacity: 0.78 },
});
