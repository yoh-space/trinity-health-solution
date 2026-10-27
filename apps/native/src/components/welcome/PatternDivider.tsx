import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

const diamonds = Array.from({ length: 25 }, (_, index) => index);

interface PatternDividerProps {
  style?: StyleProp<ViewStyle>;
}

export function PatternDivider({ style }: PatternDividerProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.container, style]}
    >
      <View style={styles.line} />
      <View style={styles.row}>
        {diamonds.map((diamond) => (
          <View key={diamond} style={styles.itemWrapper}>
            <View
              style={[
                styles.diamond,
                diamond % 2 === 0 ? styles.darkDiamond : styles.greenDiamond,
              ]}
            />
            {diamond % 2 === 0 ? <View style={styles.dot} /> : null}
          </View>
        ))}
      </View>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    width: "100%",
  },
  line: {
    backgroundColor: "#D5E6D3",
    height: 1,
    opacity: 0.7,
    width: "100%",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    paddingVertical: 3,
  },
  itemWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  diamond: {
    height: 4.5,
    transform: [{ rotate: "45deg" }],
    width: 4.5,
  },
  dot: {
    backgroundColor: "#2F8F4E",
    borderRadius: 1.5,
    height: 2.5,
    opacity: 0.65,
    width: 2.5,
  },
  darkDiamond: { backgroundColor: "#0E7A33", opacity: 0.88 },
  greenDiamond: { backgroundColor: "#7DC21E", opacity: 0.88 },
});
