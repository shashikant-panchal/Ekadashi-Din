import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const dw = width / 100;
const dh = height / 100;

const SettingsScreen = () => {
  const [autoDetect, setAutoDetect] = useState(false);
  const [ekadashiReminder, setEkadashiReminder] = useState(true);
  const [morningReminder, setMorningReminder] = useState(true);
  const [paranaReminder, setParanaReminder] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Settings</Text>
        <Text style={styles.subHeader}>Customize your experience</Text>
        <View style={styles.divider} />

        {/* LOCATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color="#0A2342" />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Current Location</Text>
              <Text style={styles.subLabel}>Not detected</Text>
            </View>
            <TouchableOpacity style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Auto-detect Location</Text>
              <Text style={styles.subLabel}>Use GPS for accurate timings</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#0A2342" }}
              thumbColor="#fff"
              value={autoDetect}
              onValueChange={setAutoDetect}
            />
          </View>
        </View>

        {/* LANGUAGE */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="language" size={16} color="#0A2342" />
            <Text style={styles.sectionTitle}>Language</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>App Language</Text>
              <Text style={styles.subLabel}>English</Text>
            </View>
            <TouchableOpacity style={styles.dropdown}>
              <MaterialIcons name="keyboard-arrow-down" size={22} color="#0A2342" />
            </TouchableOpacity>
          </View>
        </View>

        {/* NOTIFICATIONS */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={18} color="#0A2342" />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Ekadashi Reminders</Text>
              <Text style={styles.subLabel}>Day before notification</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#0A2342" }}
              thumbColor="#fff"
              value={ekadashiReminder}
              onValueChange={setEkadashiReminder}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Morning Reminders</Text>
              <Text style={styles.subLabel}>Fasting start notification</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#0A2342" }}
              thumbColor="#fff"
              value={morningReminder}
              onValueChange={setMorningReminder}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Parana Reminders</Text>
              <Text style={styles.subLabel}>Fast breaking time</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#0A2342" }}
              thumbColor="#fff"
              value={paranaReminder}
              onValueChange={setParanaReminder}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Notification Time</Text>
              <Text style={styles.subLabel}>Daily reminder time</Text>
            </View>
            <TouchableOpacity style={styles.timeBtn}>
              <Ionicons name="time-outline" size={16} color="#0A2342" />
              <Text style={styles.timeText}>06:00 AM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DISPLAY */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="eye" size={18} color="#0A2342" />
            <Text style={styles.sectionTitle}>Display</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Dark Mode</Text>
              <Text style={styles.subLabel}>Easier on the eyes</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#0A2342" }}
              thumbColor="#fff"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Large Text</Text>
              <Text style={styles.subLabel}>Improve readability</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#0A2342" }}
              thumbColor="#fff"
              value={largeText}
              onValueChange={setLargeText}
            />
          </View>
        </View>

        {/* CALENDAR INTEGRATION */}
        <View style={[styles.card, styles.yellowCard]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={18} color="#7A6200" />
            <Text style={[styles.sectionTitle, { color: "#7A6200" }]}>
              Calendar Integration
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Sync with Google Calendar</Text>
              <Text style={styles.subLabel}>Add Ekadashi events</Text>
            </View>
            <TouchableOpacity style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Connect</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Export to iCal</Text>
              <Text style={styles.subLabel}>Download calendar file</Text>
            </View>
            <TouchableOpacity style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* APP INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={18} color="#0A2342" />
            <Text style={styles.sectionTitle}>App Information</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Version</Text>
            <Text style={[styles.subLabel, { color: "#0A2342" }]}>1.0.0</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={[styles.subLabel, { color: "#0A2342" }]}>
              Jan 25, 2025
            </Text>
          </View>

          <TouchableOpacity style={styles.updateBtn}>
            <Text style={styles.updateText}>Check for Updates</Text>
          </TouchableOpacity>
        </View>

        {/* SUPPORT */}
        <View style={[styles.card, styles.yellowCard]}>
          <View style={styles.sectionHeader}>
            <AntDesign name="hearto" size={18} color="#7A6200" />
            <Text style={[styles.sectionTitle, { color: "#7A6200" }]}>Support</Text>
          </View>

          <TouchableOpacity style={styles.coffeeBtn}>
            <Text style={styles.coffeeText}>☕ Coffee for Designer</Text>
            <View style={styles.thankTag}>
              <Text style={styles.thankText}>💛 Thank you!</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 4 * dw,
  },
  header: {
    fontSize: 5 * dw,
    fontWeight: "700",
    color: "#0A2342",
  },
  subHeader: {
    fontSize: 3.5 * dw,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 2 * dh,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 2 * dw,
    padding: 4 * dw,
    marginBottom: 3 * dh,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  yellowCard: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FFE69C",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2 * dh,
  },
  sectionTitle: {
    fontSize: 4 * dw,
    fontWeight: "600",
    marginLeft: 1.5 * dw,
    color: "#0A2342",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1.5 * dh,
  },
  label: {
    fontSize: 3.8 * dw,
    fontWeight: "500",
    color: "#0A2342",
  },
  subLabel: {
    fontSize: 3.3 * dw,
    color: "#6B7280",
  },
  smallBtn: {
    backgroundColor: "#F3F4F6",
    borderRadius: 1.5 * dw,
    paddingVertical: 0.8 * dh,
    paddingHorizontal: 3 * dw,
  },
  smallBtnText: {
    color: "#0A2342",
    fontSize: 3.5 * dw,
    fontWeight: "500",
  },
  timeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 1.5 * dw,
    paddingVertical: 0.8 * dh,
    paddingHorizontal: 3 * dw,
  },
  timeText: {
    marginLeft: 1 * dw,
    color: "#0A2342",
    fontSize: 3.5 * dw,
    fontWeight: "500",
  },
  dropdown: {
    padding: 1 * dh,
  },
  updateBtn: {
    marginTop: 2 * dh,
    backgroundColor: "#F3F4F6",
    borderRadius: 1.5 * dw,
    paddingVertical: 1.2 * dh,
    alignItems: "center",
  },
  updateText: {
    color: "#0A2342",
    fontWeight: "600",
    fontSize: 3.6 * dw,
  },
  coffeeBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFBEA",
    borderRadius: 1.5 * dw,
    paddingVertical: 1 * dh,
    paddingHorizontal: 3 * dw,
    alignItems: "center",
  },
  coffeeText: {
    color: "#7A6200",
    fontWeight: "600",
    fontSize: 3.5 * dw,
  },
  thankTag: {
    backgroundColor: "#FDE68A",
    paddingVertical: 0.3 * dh,
    paddingHorizontal: 2 * dw,
    borderRadius: 1 * dw,
  },
  thankText: {
    color: "#7A6200",
    fontWeight: "600",
    fontSize: 3.3 * dw,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DC2626",
    borderRadius: 1.5 * dw,
    paddingVertical: 1.2 * dh,
    marginTop: 2 * dh,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 3.8 * dw,
    marginLeft: 1 * dw,
  },
});
