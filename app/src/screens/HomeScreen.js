import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View
              style={[styles.logoContainer, { backgroundColor: colors.card }]}
            >
              <Image resizeMode="contain" source={logo} style={styles.logo} />
            </View>
            <View style={styles.titleContainer}>
              <ThemedText
                type="subtitle"
                style={[styles.title, { color: colors.foreground }]}
              >
                Ekadashi Din
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.subtitle, { color: colors.primary }]}
              >
                Sacred Fasting Calendar
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notification")}
            style={[
              styles.notificationButton,
              { backgroundColor: colors.card },
            ]}
          >
            <Feather name="bell" size={24} color={colors.foreground} />
            <View
              style={[
                styles.notificationDot,
                { backgroundColor: colors.primary },
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Decorative Diya Section with Hindi Text */}
        <View
          style={[styles.diyaSection, { backgroundColor: colors.lightBlueBg }]}
        >
          <ThemedText type="devanagari" style={styles.diyaIcon}>
            🪔
          </ThemedText>
          <View style={styles.mantraContainer}>
            <ThemedText
              type="devanagariSemiBold"
              style={[styles.mantraText, { color: colors.primary }]}
            >
              हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे
            </ThemedText>
            <ThemedText
              type="devanagariSemiBold"
              style={[styles.mantraText, { color: colors.primary }]}
            >
              हरे राम हरे राम राम राम हरे हरे
            </ThemedText>
          </View>
          <ThemedText type="devanagari" style={styles.diyaIcon}>
            🪔
          </ThemedText>
        </View>

        <StatusBar
          style={isDark ? "light" : "auto"}
          backgroundColor={colors.background}
        />

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
            onPress={() => navigation.navigate("DailyWisdom")}
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

const getStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: colors.background,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    logoContainer: {
      width: 52,
      height: 52,
      marginRight: 12,
      borderRadius: 14,
      padding: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      width: "100%",
      height: "100%",
    },
    titleContainer: {
      justifyContent: "center",
    },
    title: {
      fontSize: 22,
    },
    subtitle: {
      fontSize: 14,
      opacity: 0.8,
    },
    notificationButton: {
      borderRadius: 14,
      padding: 12,
      position: "relative",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    notificationDot: {
      position: "absolute",
      top: 2,
      right: 2,
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    diyaSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingVertical: 16,
      paddingHorizontal: 16,
      marginHorizontal: 16,
      marginTop: 8,
      borderRadius: 16,
    },
    diyaIcon: {
      fontSize: 30,
    },
    mantraContainer: {
      marginHorizontal: 16,
      alignItems: "center",
    },
    mantraText: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 28,
    },
    cardsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
  });
