import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const roles = ["Counselor / Nutrition & education", "Clinician / NCD & therapy", "Admin / Queue & team"];

export default function StaffPortalScreen() {
  const router = useRouter();
  const [role, setRole] = useState(0);
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}><View style={styles.mark}><Ionicons name="leaf-outline" size={24} color="#237B42" /></View><View><Text style={styles.brand}>Trinity Health Solution</Text><Text style={styles.tagline}>WELLNESS WITHOUT BORDERS</Text></View></View>
        <View style={styles.eyebrowRow}><Ionicons name="shield-checkmark-outline" size={14} color="#4A8B5B" /><Text style={styles.eyebrow}>STAFF PORTAL</Text></View>
        <Text style={styles.title}>Welcome back to care.</Text>
        <Text style={styles.subtitle}>A calm desk for the people helping families feel well.</Text>
        <View style={styles.roleTabs}>{roles.map((item, index) => <Pressable key={item} onPress={() => setRole(index)} style={[styles.roleTab, role === index && styles.roleTabActive]}><Text style={[styles.roleText, role === index && styles.roleTextActive]}>{item}</Text></Pressable>)}</View>
        <View style={styles.formCard}>
          <Text style={styles.fieldLabel}>Staff ID</Text>
          <TextInput autoCapitalize="characters" onChangeText={setStaffId} placeholder="e.g. THS-0000" placeholderTextColor="#94A39A" style={styles.input} value={staffId} />
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor="#94A39A" secureTextEntry style={styles.input} value={password} />
          <Pressable onPress={() => setMessage("Prototype sign-in is not connected. Use demo access to explore the desk.")} style={styles.signInButton}><Text style={styles.signInText}>Sign in</Text><Ionicons name="arrow-forward" size={16} color="#FFFFFF" /></Pressable>
          <Pressable onPress={() => router.push("/staff-dashboard" as Href)} style={styles.demoButton}><Ionicons name="sparkles-outline" size={16} color="#287343" /><Text style={styles.demoText}>Continue with demo access</Text></Pressable>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
        <Text style={styles.disclaimer}>This is a prototype workspace. Demo access does not store or send credentials.</Text>
        <Pressable onPress={() => router.replace("/" as Href)} style={styles.backButton}><Ionicons name="arrow-back" size={16} color="#386248" /><Text style={styles.backText}>Back to the family app</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#E8F3E9", flex: 1 }, content: { flexGrow: 1, padding: 24, paddingBottom: 32 }, brandRow: { alignItems: "center", flexDirection: "row", gap: 10, marginBottom: 48 }, mark: { alignItems: "center", backgroundColor: "#D6EED9", borderRadius: 18, height: 42, justifyContent: "center", width: 42 }, brand: { color: "#1E4E2E", fontFamily: "MBold", fontSize: 16 }, tagline: { color: "#64906D", fontFamily: "Bold", fontSize: 8, letterSpacing: 1, marginTop: 3 }, eyebrowRow: { alignItems: "center", flexDirection: "row", gap: 6 }, eyebrow: { color: "#4A8B5B", fontFamily: "Bold", fontSize: 9, letterSpacing: 1.4 }, title: { color: "#182C20", fontFamily: "MBold", fontSize: 30, lineHeight: 36, marginTop: 10 }, subtitle: { color: "#68796D", fontFamily: "Regular", fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 320 }, roleTabs: { gap: 7, marginTop: 24 }, roleTab: { backgroundColor: "#F7FBF7", borderColor: "#D6E7D8", borderRadius: 12, borderWidth: 1, padding: 11 }, roleTabActive: { backgroundColor: "#287343", borderColor: "#287343" }, roleText: { color: "#4E6755", fontFamily: "SemiBold", fontSize: 10 }, roleTextActive: { color: "#FFFFFF" }, formCard: { backgroundColor: "#FFFFFF", borderColor: "#DCE9DE", borderRadius: 20, borderWidth: 1, marginTop: 18, padding: 17 }, fieldLabel: { color: "#385442", fontFamily: "SemiBold", fontSize: 10, marginBottom: 6, marginTop: 8 }, input: { borderColor: "#DCE7DE", borderRadius: 10, borderWidth: 1, color: "#263C2C", fontFamily: "Regular", fontSize: 12, minHeight: 45, paddingHorizontal: 12 }, signInButton: { alignItems: "center", backgroundColor: "#287343", borderRadius: 11, flexDirection: "row", gap: 7, justifyContent: "center", marginTop: 18, minHeight: 46 }, signInText: { color: "#FFFFFF", fontFamily: "Bold", fontSize: 11 }, demoButton: { alignItems: "center", backgroundColor: "#EEF7EF", borderRadius: 11, flexDirection: "row", gap: 7, justifyContent: "center", marginTop: 9, minHeight: 46 }, demoText: { color: "#287343", fontFamily: "SemiBold", fontSize: 11 }, message: { color: "#8A5C2B", fontFamily: "Regular", fontSize: 10, lineHeight: 15, marginTop: 12 }, disclaimer: { color: "#718075", fontFamily: "Regular", fontSize: 10, lineHeight: 15, marginTop: 15, textAlign: "center" }, backButton: { alignItems: "center", alignSelf: "center", flexDirection: "row", gap: 6, marginTop: 22, padding: 8 }, backText: { color: "#386248", fontFamily: "SemiBold", fontSize: 11 },
});
