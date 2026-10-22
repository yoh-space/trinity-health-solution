import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Platform, StatusBar, View } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import ConvexClientProvider from "../../ConvexClientProvider";

const statusBarHeight =
  Platform.OS === "ios" ? 50 : (StatusBar.currentHeight ?? 0);

export default function RootLayout() {
  const [loaded] = useFonts({
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

  if (!loaded) return null;

  return (
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
        <Toast />
        </View>
      </BottomSheetModalProvider>
    </ConvexClientProvider>
  );
}
