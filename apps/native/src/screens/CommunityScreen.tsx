// Community screen that opens the Telegram channel
import { useEffect } from "react";
import { Linking, Alert } from "react-native";

const TELEGRAM_URL = "https://t.me/Trinity_health_solution";

export default function CommunityScreen() {
  // Open the URL when the screen is focused
  useEffect(() => {
    const open = async () => {
      const supported = await Linking.canOpenURL(TELEGRAM_URL);
      if (supported) {
        await Linking.openURL(TELEGRAM_URL);
      } else {
        Alert.alert("Unable to open Telegram link");
      }
    };
    open();
  }, []);

  return null; // No UI needed; the link opens automatically.
}
