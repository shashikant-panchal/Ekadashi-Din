import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
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
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { detectLocation, setAutoDetect } from "../redux/locationSlice";
import { saveTheme, toggleTheme } from "../redux/themeSlice";
import { signOut } from "../redux/userSlice";

const { width, height } = Dimensions.get("window");
const dw = width / 100;
const dh = height / 100;

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
  i18n,
  colors,
}) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[modalStyles.listItem, { backgroundColor: colors.card }]}
      onPress={() => {
        setSelectedLanguage(item.name);
        i18n.changeLanguage(item.key);
        setModalVisible(false);
      }}
    >
      {selectedLanguage === item.name ? (
        <Feather
          name="check"
          size={5 * dw}
          color={colors.primary}
          style={modalStyles.checkIcon}
        />
      ) : (
        <View style={modalStyles.checkIconPlaceholder} />
      )}
      <Text style={[modalStyles.listItemText, { color: colors.foreground }]}>{item.native}</Text>
    </TouchableOpacity>
  );

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
        style={[modalStyles.centeredView, { backgroundColor: colors.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.05)' }]}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View
          style={[
            modalStyles.modalView,
            {
              top: topPosition,
              right: rightPosition,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
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
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const { city, country, autoDetect, loading } = useSelector((state) => state.location);
  const { resolvedTheme } = useSelector((state) => state.theme);

  const [ekadashiReminder, setEkadashiReminder] = useState(true);
  const [morningReminder, setMorningReminder] = useState(true);
  const [paranaReminder, setParanaReminder] = useState(true);
  const [largeText, setLargeText] = useState(false);

  // New State for Language Dropdown
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleToggleDarkMode = () => {
    dispatch(toggleTheme());
    dispatch(saveTheme(resolvedTheme === 'dark' ? 'light' : 'dark'));
  };

  const styles = getStyles(colors, dw, dh);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header */}
        <Text style={styles.header}>{t('settings.title')}</Text>
        <Text style={styles.subHeader}>{t('settings.subtitle')}</Text>
        <View style={styles.divider} />

        {/* LOCATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('settings.location.title')}</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.location.current')}</Text>
              <Text style={styles.subLabel}>{loading ? t('settings.location.detecting') : (city ? `${city}, ${country}` : t('settings.location.detected').replace('detected', 'Not detected'))}</Text>
            </View>
            <TouchableOpacity style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>{t('common.change')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.location.autoDetect')}</Text>
              <Text style={styles.subLabel}>{t('settings.location.autoDetectDesc')}</Text>
            </View>
            <Switch
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#fff"
              value={autoDetect}
              onValueChange={(value) => {
                dispatch(setAutoDetect(value));
                if (value) {
                  dispatch(detectLocation());
                }
              }}
            />
          </View>
        </View>

        {/* LANGUAGE */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="language" size={16} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('settings.language.title')}</Text>
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
              <Feather name="globe" size={20} color={colors.foreground} />
              <View style={{ marginHorizontal: 10 }}>
                <Text style={styles.label}>{t('settings.language.appLanguage')}</Text>
                <Text style={styles.subLabel}>{selectedLanguage}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.dropdownTrigger}
              onPress={() => setLanguageModalVisible(true)}
            >
              <Text style={styles.dropdownText}>{selectedLanguage}</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={22}
                color={colors.primary}
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
          i18n={i18n}
          colors={colors}
        />

        {/* NOTIFICATIONS */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('settings.notifications.title')}</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.notifications.ekadashiReminders')}</Text>
              <Text style={styles.subLabel}>{t('settings.notifications.ekadashiRemindersDesc')}</Text>
            </View>
            <Switch
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#fff"
              value={ekadashiReminder}
              onValueChange={setEkadashiReminder}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.notifications.morningReminders')}</Text>
              <Text style={styles.subLabel}>{t('settings.notifications.morningRemindersDesc')}</Text>
            </View>
            <Switch
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#fff"
              value={morningReminder}
              onValueChange={setMorningReminder}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.notifications.paranaReminders')}</Text>
              <Text style={styles.subLabel}>{t('settings.notifications.paranaRemindersDesc')}</Text>
            </View>
            <Switch
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#fff"
              value={paranaReminder}
              onValueChange={setParanaReminder}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.notifications.notificationTime')}</Text>
              <Text style={styles.subLabel}>{t('settings.notifications.dailyReminderTime')}</Text>
            </View>
            <TouchableOpacity style={styles.timeBtn}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
              <Text style={styles.timeText}>06:00 AM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DISPLAY */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="eye" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('settings.display.title')}</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.display.darkMode')}</Text>
              <Text style={styles.subLabel}>{t('settings.display.darkModeDesc')}</Text>
            </View>
            <Switch
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#fff"
              value={isDark}
              onValueChange={handleToggleDarkMode}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.display.largeText')}</Text>
              <Text style={styles.subLabel}>{t('settings.display.largeTextDesc')}</Text>
            </View>
            <Switch
              trackColor={{ false: colors.muted, true: colors.primary }}
              thumbColor="#fff"
              value={largeText}
              onValueChange={setLargeText}
            />
          </View>
        </View>

        {/* CALENDAR INTEGRATION */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar-outline" size={18} color={colors.secondary} />
            <Text style={styles.sectionTitle}>{t('settings.calendar.title')}</Text>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.calendar.syncGoogle')}</Text>
              <Text style={styles.subLabel}>{t('settings.calendar.syncGoogleDesc')}</Text>
            </View>
            <TouchableOpacity style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>{t('common.connect')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.label}>{t('settings.calendar.exportICal')}</Text>
              <Text style={styles.subLabel}>{t('settings.calendar.exportICalDesc')}</Text>
            </View>
            <TouchableOpacity style={styles.smallBtn}>
              <Text style={styles.smallBtnText}>{t('common.export')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* APP INFO */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Feather name="info" size={18} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t('settings.appInfo.title')}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>{t('settings.appInfo.version')}</Text>
            <Text style={[styles.subLabel, { color: colors.primary }]}>1.0.0</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>{t('settings.appInfo.lastUpdated')}</Text>
            <Text style={[styles.subLabel, { color: colors.primary }]}>
              Jan 25, 2025
            </Text>
          </View>

          <TouchableOpacity style={styles.updateBtn}>
            <Text style={styles.updateText}>{t('settings.appInfo.checkUpdates')}</Text>
          </TouchableOpacity>
        </View>

        {/* SUPPORT */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Entypo name="heart-outlined" size={20} color={colors.secondary} />
            <Text style={styles.sectionTitle}>{t('settings.support.title')}</Text>
          </View>

          <TouchableOpacity style={styles.coffeeBtn}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <SimpleLineIcons name="cup" size={17} color={colors.foreground} />
              <Text style={styles.coffeeText}>{t('settings.support.coffeeDesigner')}</Text>
            </View>
            <View style={styles.thankTag}>
              <Text style={styles.thankText}>☕ {t('settings.support.thankYou')}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => dispatch(signOut())}>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
            <Text style={styles.logoutText}>{t('settings.support.logout')}</Text>
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
  },
  modalView: {
    position: "absolute",
    width: 50 * dw,
    borderRadius: 2 * dw,
    paddingVertical: 0.8 * dh,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 1,
  },
  list: {
    maxHeight: 40 * dh,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 1.5 * dh,
    paddingHorizontal: 4 * dw,
  },
  listItemText: {
    fontSize: 4.5 * dw,
    fontWeight: "500",
  },
  checkIcon: {
    marginRight: 2 * dw,
  },
  checkIconPlaceholder: {
    width: 5 * dw,
    marginRight: 2 * dw,
  },
});

// --- Dynamic Stylesheet for the Main Screen ---
const getStyles = (colors, dw, dh) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 4 * dw,
  },
  header: {
    fontSize: 5 * dw,
    fontWeight: "700",
    color: colors.foreground,
  },
  subHeader: {
    fontSize: 3.5 * dw,
    color: colors.mutedForeground,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 2 * dh,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 2 * dw,
    padding: 4 * dw,
    marginBottom: 3 * dh,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.foreground,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1.5 * dh,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingBottom: 1.5 * dh,
  },
  label: {
    fontSize: 3.8 * dw,
    fontWeight: "500",
    color: colors.foreground,
  },
  subLabel: {
    fontSize: 3.3 * dw,
    color: colors.mutedForeground,
  },
  smallBtn: {
    borderWidth: 0.5,
    borderColor: colors.primary,
    borderRadius: 1.5 * dw,
    paddingVertical: 0.8 * dh,
    paddingHorizontal: 3 * dw,
  },
  smallBtnText: {
    color: colors.primary,
    fontSize: 3.5 * dw,
    fontWeight: "500",
  },
  timeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: 1.5 * dw,
    paddingVertical: 0.8 * dh,
    paddingHorizontal: 3 * dw,
  },
  timeText: {
    marginLeft: 1 * dw,
    color: colors.foreground,
    fontSize: 3.5 * dw,
    fontWeight: "500",
  },
  dropdownTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.muted,
    borderRadius: 1.5 * dw,
    paddingVertical: 0.8 * dh,
    paddingHorizontal: 3 * dw,
  },
  dropdownText: {
    marginRight: 1 * dw,
    color: colors.foreground,
    fontSize: 3.5 * dw,
    fontWeight: "500",
  },
  updateBtn: {
    marginTop: 2 * dh,
    borderColor: colors.border,
    borderWidth: 0.5,
    borderRadius: 1.5 * dw,
    paddingVertical: 1.2 * dh,
    alignItems: "center",
  },
  updateText: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 3.6 * dw,
  },
  coffeeBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 1.5 * dw,
    paddingVertical: 1 * dh,
    paddingHorizontal: 3 * dw,
    alignItems: "center",
  },
  coffeeText: {
    color: colors.foreground,
    fontWeight: "600",
    fontSize: 3.5 * dw,
    marginHorizontal: 5,
  },
  thankTag: {
    backgroundColor: colors.secondary,
    paddingVertical: 0.3 * dh,
    paddingHorizontal: 2 * dw,
    borderRadius: 1 * dw,
  },
  thankText: {
    color: colors.secondaryForeground,
    fontWeight: "600",
    fontSize: 3.3 * dw,
  },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.destructive,
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
