import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type GuestHomeHeaderProps = {
  language: "am" | "en";
  onHomePress: () => void;
  onSavedPress: () => void;
  onSettingsPress: () => void;
};

export function GuestHomeHeader({ language, onHomePress, onSavedPress, onSettingsPress }: GuestHomeHeaderProps) {
  const am = language === "am";
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel={am ? "ትሪኒቲ ሄልዝ ሶሉሽን መነሻ" : "Trinity Health Solution home"} onPress={onHomePress} style={styles.brand}>
        <Image source={require("../../assets/images/trinity-symbol.png")} resizeMode="contain" style={styles.symbol} />
        <View style={styles.brandCopy}>
          <Text style={styles.brandName}>Trinity Health Solution</Text>
          <Text style={styles.tagline}>{am ? "ትንሽ እውቀት፣ ብዙ እንክብካቤ" : "A little learning. A lot of care."}</Text>
        </View>
      </Pressable>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" accessibilityLabel={am ? "የተቀመጡ ትምህርቶች" : "Saved lessons"} onPress={onSavedPress} style={styles.iconButton}>
          <Ionicons name="bookmark-outline" size={19} color="#365B41" />
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={am ? "ቅንብሮች" : "Settings"} onPress={onSettingsPress} style={styles.iconButton}>
          <Ionicons name="settings-outline" size={19} color="#365B41" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  brand: { alignItems: "center", flex: 1, flexDirection: "row", gap: 8 },
  symbol: { height: 38, width: 38 },
  brandCopy: { flex: 1, gap: 3 },
  brandName: { color: "#23472E", fontFamily: "Righteous_400Regular", fontSize: 16 },
  tagline: { color: "#77867A", fontFamily: "Righteous_400Regular", fontSize: 13 },
  actions: { flexDirection: "row", gap: 8 },
  iconButton: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E2EAE3", borderRadius: 14, borderWidth: 1, height: 40, justifyContent: "center", width: 40 },
});
