// Floating button that opens the Telegram community link
import React from "react";
import { Pressable, StyleSheet, Linking, Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TELEGRAM_URL = "https://t.me/Trinity_health_solution";

export default function CommunityFloatingButton() {
  const insets = useSafeAreaInsets();

  const handlePress = async () => {
    const supported = await Linking.canOpenURL(TELEGRAM_URL);
    if (supported) {
      await Linking.openURL(TELEGRAM_URL);
    } else {
      Alert.alert("Unable to open Telegram link");
    }
  };

  return (
    <View style={[styles.container, { bottom: 20 + insets.bottom }]}>
      <Pressable
        onPress={handlePress}
        style={styles.button}
        accessibilityLabel="Community Telegram"
      >
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 20,
    zIndex: 10,
  },
  button: {
    backgroundColor: "#1c573e",
    borderRadius: 30,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
