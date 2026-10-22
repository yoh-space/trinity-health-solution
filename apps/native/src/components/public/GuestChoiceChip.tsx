import { Pressable, StyleSheet, Text } from "react-native";

type GuestChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  role?: "checkbox" | "radio";
};

export function GuestChoiceChip({
  label,
  selected,
  onPress,
  role = "checkbox",
}: GuestChoiceChipProps) {
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <Text style={[styles.label, selected && styles.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DCE7DD",
    borderRadius: 13,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  selectedChip: { backgroundColor: "#EAF4EB", borderColor: "#238047" },
  label: { color: "#526357", fontFamily: "Medium", fontSize: 12 },
  selectedLabel: { color: "#206B3B", fontFamily: "SemiBold" },
});
