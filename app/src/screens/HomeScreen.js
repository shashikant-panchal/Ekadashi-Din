import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NextEkadashiCard from "../components/NextEkadashiCard";
import PanchangCard from "../components/PanchangCard";
import SplitCard from "../components/SplitCard";
import { ThemedText } from "../components/ThemedText";
import { dw } from "../constants/Dimensions";
import { logo } from "../constants/Images";
import { useTheme } from "../context/ThemeContext";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();

  const styles = getStyles(colors);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Logo, Title and Notification Bell */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image resizeMode="contain" source={logo} style={[styles.logo, { backgroundColor: colors.card }]} />
            <View style={styles.titleContainer}>
              <ThemedText type="subtitle" style={[styles.title, { color: colors.foreground }]}>Ekadashi Din</ThemedText>
              <ThemedText type="small" style={[styles.subtitle, { color: colors.mutedForeground }]}>Sacred Fasting Calendar</ThemedText>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={[styles.notificationButton, { backgroundColor: colors.card }]}>
            <Feather name="bell" size={22} color={colors.foreground} />
            <View style={[styles.notificationDot, { backgroundColor: colors.primary, borderColor: colors.card }]} />
          </TouchableOpacity>
        </View>

        {/* Decorative Diya Section with Hindi Text */}
        <View style={[styles.diyaSection, { backgroundColor: colors.lightBlueBg }]}>
          <ThemedText style={styles.diyaIcon}>🪔</ThemedText>
          <View style={styles.mantraContainer}>
            <ThemedText type="devanagariSemiBold" style={[styles.mantraText, { color: colors.primary }]}>हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे</ThemedText>
            <ThemedText type="devanagariSemiBold" style={[styles.mantraText, { color: colors.primary }]}>हरे राम हरे राम राम राम हरे हरे</ThemedText>
          </View>
          <ThemedText style={styles.diyaIcon}>🪔</ThemedText>
        </View>

        <StatusBar style={isDark ? "light" : "auto"} backgroundColor={colors.background} />

        {/* Next Ekadashi Card */}
        <NextEkadashiCard />

        {/* Daily Wisdom and Calendar Cards Row */}
        <View style={styles.cardsRow}>
          <SplitCard
            width={dw / 2.25}
            icon={"book-outline"}
            iconColor={colors.primary}
            iconBackground={colors.lightBlueBg}
            title={"Daily Wisdom"}
            subTitle={"Spiritual guidance"}
            onPress={() => navigation.navigate('DailyWisdom')}
          />
          <SplitCard
            icon={"calendar-outline"}
            iconColor={colors.secondary}
            iconBackground={isDark ? colors.muted : "#FEFCEB"}
            title={"Calendar"}
            subTitle={"Monthly view"}
          />
        </View>

        {/* All Ekadashi Card */}
        <SplitCard
          width={dw}
          list={"format-list-bulleted"}
          iconBackground={colors.lightBlueBg}
          iconColor={colors.primary}
          title={"All Ekadashi"}
          subTitle={"Complete list"}
        />

        {/* Today's Panchang Card */}
        <PanchangCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const getStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 16,
    borderRadius: 16,
    padding: 8,
  },
  titleContainer: {
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  notificationButton: {
    borderRadius: 16,
    padding: 14,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
  },
  diyaSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
  },
  diyaIcon: {
    fontSize: 36,
  },
  mantraContainer: {
    marginHorizontal: 20,
    alignItems: "center",
  },
  mantraText: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
    lineHeight: 24,
  },
  cardsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
