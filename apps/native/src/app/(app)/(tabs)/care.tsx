import { View, Text, StyleSheet } from "react-native";

export default function CareScreen() {
  return (
    <View style={styles.page}>
      <Text style={styles.eyebrow}>TRINITY CARE</Text>
      <Text style={styles.title}>Support starts with safe information.</Text>
      <Text style={styles.body}>
        This prototype offers health learning only. It does not collect medical
        histories, provide diagnoses, or replace professional care.
      </Text>
      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Need urgent help?</Text>
        <Text style={styles.noticeBody}>
          Contact your local emergency service or a qualified health professional.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FAF6", padding: 24, paddingTop: 52 },
  eyebrow: { color: "#087A3D", fontSize: 12, fontFamily: "Bold", letterSpacing: 1.8 },
  title: { color: "#183A25", fontSize: 32, fontFamily: "MBold", lineHeight: 39, marginTop: 12 },
  body: { color: "#5B6B60", fontSize: 16, fontFamily: "Regular", lineHeight: 24, marginTop: 18 },
  notice: { backgroundColor: "#EAF4EB", borderRadius: 20, marginTop: 28, padding: 18 },
  noticeTitle: { color: "#183A25", fontSize: 16, fontFamily: "Bold" },
  noticeBody: { color: "#4E6153", fontSize: 14, fontFamily: "Regular", lineHeight: 21, marginTop: 6 },
});
