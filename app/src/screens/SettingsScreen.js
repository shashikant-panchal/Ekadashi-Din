import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useState } from "react";
import {
  Dimensions, // <-- Import Modal
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AppYellow,
  BackgroundGrey,
  DarkBlue,
  LightBlue,
} from "../constants/Colors";
// Assume DarkBlue and LightBlue are defined in constants/Colors

const { width, height } = Dimensions.get("window");
const dw = width / 100; // dw is a constant (1% of width)
const dh = height / 100; // dh is a constant (1% of height)

// --- 1. Language Data ---
const LANGUAGES = [
  { key: "en", name: "English", native: "English" },
  { key: "hi", name: "Hindi", native: "हिंदी" },
  { key: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { key: "bn", name: "Bengali", native: "বাংলা" },
  { key: "fr", name: "French", native: "Français" },
  { key: "de", name: "German", native: "Deutsch" },
];

const LanguageModal = ({
  modalVisible,
  setModalVisible,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={modalStyles.listItem}
      onPress={() => {
        setSelectedLanguage(item.name);
        setModalVisible(false);
      }}
    >
      {selectedLanguage === item.name ? (
        <Feather
          name="check"
          size={5 * dw}
          color={DarkBlue}
          style={modalStyles.checkIcon}
        />
      ) : (
        <View style={modalStyles.checkIconPlaceholder} />
      )}
      <Text style={modalStyles.listItemText}>{item.native}</Text>
    </TouchableOpacity>
  );

  // Calculate the approximate position of the dropdown modal
  // to appear right over the Language card.
  // Using dh and dw as multipliers
  const topPosition = 35 * dh;
  const rightPosition = 6 * dw;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={modalStyles.centeredView}
        activeOpacity={1}
        onPress={() => setModalVisible(false)} // Close modal when background is pressed
      >
        {/* Dropdown Box positioned relative to the screen */}
        <View
          style={[
            modalStyles.modalView,
            { top: topPosition, right: rightPosition },
          ]}
        >
          <FlatList
            data={LANGUAGES}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            style={modalStyles.list}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const SettingsScreen = () => {
  const [autoDetect, setAutoDetect] = useState(false);
  const [ekadashiReminder, setEkadashiReminder] = useState(true);
  const [morningReminder, setMorningReminder] = useState(true);
  const [paranaReminder, setParanaReminder] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);

  // New State for Language Dropdown
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>Settings</Text>
        <Text style={styles.subHeader}>Customize your experience</Text>
        <View style={styles.divider} />

        {/* LOCATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color={DarkBlue} />
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
              trackColor={{ false: "#E5E7EB", true: DarkBlue }}
              thumbColor="#fff"
              value={autoDetect}
              onValueChange={setAutoDetect}
            />
          </View>
        </View>

        {/* LANGUAGE */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="language" size={16} color={DarkBlue} />
            <Text style={styles.sectionTitle}>Language</Text>
          </View>

          <View
            style={[
              styles.rowBetween,
              {
                justifyContent: "space-between",
                borderBottomWidth: 0,
                marginVertical: 0,
              },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="globe" size={20} color="black" />
              <View style={{ marginHorizontal: 10 }}>
                <Text style={styles.label}>App Language</Text>
                <Text style={styles.subLabel}>{selectedLanguage}</Text>
              </View>
            </View>

            {/* --- Custom Dropdown Trigger --- */}
            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setLanguageModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedLanguage}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={22}
                color={DarkBlue}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Language Modal (Custom Dropdown) --- */}
        <LanguageModal
          modalVisible={languageModalVisible}
          setModalVisible={setLanguageModalVisible}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />

        {/* NOTIFICATIONS */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={18} color={DarkBlue} />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Ekadashi Reminders</Text>
              <Text style={styles.subLabel}>Day before notification</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: DarkBlue }}
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
              trackColor={{ false: "#E5E7EB", true: DarkBlue }}
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
              trackColor={{ false: "#E5E7EB", true: DarkBlue }}
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
              <Ionicons name="time-outline" size={16} color={DarkBlue} />
              <Text style={styles.timeText}>06:00 AM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DISPLAY */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="eye" size={18} color={DarkBlue} />
            <Text style={styles.sectionTitle}>Display</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>Dark Mode</Text>
              <Text style={styles.subLabel}>Easier on the eyes</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: DarkBlue }}
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
              trackColor={{ false: "#E5E7EB", true: DarkBlue }}
              thumbColor="#fff"
              value={largeText}
              onValueChange={setLargeText}
            />
          </View>
        </View>

        {/* CALENDAR INTEGRATION */}
        <View style={[styles.card]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={18} color={AppYellow} />
            <Text style={[styles.sectionTitle]}>Calendar Integration</Text>
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
            <Feather name="info" size={18} color={DarkBlue} />
            <Text style={styles.sectionTitle}>App Information</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Version</Text>
            <Text style={[styles.subLabel, { color: DarkBlue }]}>1.0.0</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Last Updated</Text>
            <Text style={[styles.subLabel, { color: DarkBlue }]}>
              Jan 25, 2025
            </Text>
          </View>

          <TouchableOpacity style={styles.updateBtn}>
            <Text style={styles.updateText}>Check for Updates</Text>
          </TouchableOpacity>
        </View>

        {/* SUPPORT */}
        <View style={[styles.card]}>
          <View style={styles.sectionHeader}>
            <Entypo name="heart-outlined" size={20} color={AppYellow} />
            <Text style={[styles.sectionTitle]}>Support</Text>
          </View>

          <TouchableOpacity style={styles.coffeeBtn}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <SimpleLineIcons name="cup" size={17} color="black" />
              <Text style={styles.coffeeText}>Coffee for Designer</Text>
            </View>
            <View style={styles.thankTag}>
              <Text style={styles.thankText}>☕ Thank you!</Text>
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

// --- Stylesheet for the Dropdown Modal ---
const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // Use an almost transparent background to allow visual context of the screen
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  modalView: {
    // Positioned absolutely to appear near the dropdown trigger
    position: "absolute",
    // CORRECTED: Using dw as a multiplier
    width: 50 * dw,
    backgroundColor: "white",
    // CORRECTED: Using dw as a multiplier
    borderRadius: 2 * dw,
    // CORRECTED: Using dh as a multiplier
    paddingVertical: 0.8 * dh,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      // CORRECTED: Using dh as a multiplier
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  list: {
    // CORRECTED: Using dh as a multiplier
    maxHeight: 40 * dh,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    // CORRECTED: Using dh and dw as multipliers
    paddingVertical: 1.5 * dh,
    paddingHorizontal: 4 * dw,
  },
  listItemText: {
    // CORRECTED: Using dw as a multiplier
    fontSize: 4.5 * dw,
    color: DarkBlue,
    fontWeight: "500",
  },
  checkIcon: {
    // CORRECTED: Using dw as a multiplier
    marginRight: 2 * dw,
  },
  checkIconPlaceholder: {
    // CORRECTED: Using dw as a multiplier
    width: 5 * dw,
    marginRight: 2 * dw,
  },
});

// --- Stylesheet for the Main Screen ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 4 * dw,
  },
  header: {
    fontSize: 5 * dw,
    fontWeight: "700",
    color: DarkBlue,
  },
  subHeader: {
    fontSize: 3.5 * dw,
    color: LightBlue,
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
    color: DarkBlue,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1.5 * dh,
    // Add bottom border to rows, except the last one if applicable, but for this structured list it's fine.
    borderBottomColor: "#F3F4F6",
    borderBottomWidth: 1,
    paddingBottom: 1.5 * dh,
  },
  // Remove bottom border from the last row in a section
  // Note: This requires manually setting borderBottomWidth: 0 on the last row of each section.

  label: {
    fontSize: 3.8 * dw,
    fontWeight: "500",
    color: DarkBlue,
  },
  subLabel: {
    fontSize: 3.3 * dw,
    color: LightBlue,
  },
  smallBtn: {
    borderWidth: 0.5,
    borderColor: DarkBlue,
    borderRadius: 1.5 * dw,
    paddingVertical: 0.8 * dh,
    paddingHorizontal: 3 * dw,
  },
  smallBtnText: {
    color: DarkBlue,
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
    color: DarkBlue,
    fontSize: 3.5 * dw,
    fontWeight: "500",
  },
  // Custom dropdown button style
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 1.5 * dw,
    paddingVertical: 0.8 * dh,
    paddingHorizontal: 3 * dw,
  },
  dropdownText: {
    marginRight: 1 * dw,
    color: DarkBlue,
    fontSize: 3.5 * dw,
    fontWeight: "500",
  },
  updateBtn: {
    marginTop: 2 * dh,
    borderColor: BackgroundGrey,
    borderWidth: 0.5,
    // backgroundColor: "#F3F4F6",
    borderRadius: 1.5 * dw,
    paddingVertical: 1.2 * dh,
    alignItems: "center",
  },
  updateText: {
    color: DarkBlue,
    fontWeight: "600",
    fontSize: 3.6 * dw,
  },
  coffeeBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#FFFBEA",
    borderWidth: 0.5,
    borderColor: BackgroundGrey,
    borderRadius: 1.5 * dw,
    paddingVertical: 1 * dh,
    paddingHorizontal: 3 * dw,
    alignItems: "center",
  },
  coffeeText: {
    color: DarkBlue,
    fontWeight: "600",
    fontSize: 3.5 * dw,
    marginHorizontal: 5,
  },
  thankTag: {
    backgroundColor: "#FDE68A",
    paddingVertical: 0.3 * dh,
    paddingHorizontal: 2 * dw,
    borderRadius: 1 * dw,
  },
  thankText: {
    color: DarkBlue,
    fontWeight: "600",
    fontSize: 3.3 * dw,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EF4443",
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
