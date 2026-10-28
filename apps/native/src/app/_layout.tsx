import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import ConvexClientProvider from "../../ConvexClientProvider";

const statusBarHeight =
  Platform.OS === "ios" ? 50 : (StatusBar.currentHeight ?? 0);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Bold: require("../assets/fonts/Inter-Bold.ttf"),
    SemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
    Medium: require("../assets/fonts/Inter-Medium.ttf"),
    Regular: require("../assets/fonts/Inter-Regular.ttf"),
    MBold: require("../assets/fonts/Montserrat-Bold.ttf"),
    MSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
    MMedium: require("../assets/fonts/Montserrat-Medium.ttf"),
    MRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
    MLight: require("../assets/fonts/Montserrat-Light.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.warn("Font loading error:", error);
    }
  }, [error]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexClientProvider>
        <BottomSheetModalProvider>
          <View style={{ flex: 1 }}>
            <View style={{ height: statusBarHeight, backgroundColor: "#E6F1E8" }}>
              <StatusBar
                translucent
                backgroundColor="#E6F1E8"
                barStyle="dark-content"
              />
            </View>
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </BottomSheetModalProvider>
      </ConvexClientProvider>
    </GestureHandlerRootView>
  );
}
