import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NextEkadashiCard from "../components/NextEkadashiCard";
import PanchangCard from "../components/PanchangCard";
import SplitCard from "../components/SplitCard";
import { BackgroundGrey, DarkBlue } from "../constants/Colors";
import { dw } from "../constants/Dimensions";
import { logo } from "../constants/Images";

const HomeScreen = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Logo, Title and Notification Bell */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image resizeMode="contain" source={logo} style={styles.logo} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ekadashi Din</Text>
              <Text style={styles.subtitle}>Sacred Fasting Calendar</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')} style={styles.notificationButton}>
            <Feather name="bell" size={22} color="#1C2C56" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Decorative Diya Section with Hindi Text */}
        <View style={styles.diyaSection}>
          <Text style={styles.diyaIcon}>🪔</Text>
          <View style={styles.mantraContainer}>
            <Text style={styles.mantraText}>हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे</Text>
            <Text style={styles.mantraText}>हरे राम हरे राम राम राम हरे हरे</Text>
          </View>
          <Text style={styles.diyaIcon}>🪔</Text>
        </View>

        <StatusBar style="auto" backgroundColor="grey" />

        {/* Next Ekadashi Card */}
        <NextEkadashiCard />

        {/* Daily Wisdom and Calendar Cards Row */}
        <View style={styles.cardsRow}>
          <SplitCard
            width={dw / 2.25}
            icon={"book-outline"}
            iconColor={DarkBlue}
            iconBackground={BackgroundGrey}
            title={"Daily Wisdom"}
            subTitle={"Spiritual guidance"}
            onPress={() => navigation.navigate('DailyWisdom')}
          />
          <SplitCard
            icon={"calendar-outline"}
            iconColor={"#FAE013"}
            iconBackground={"#FEFCEB"}
            title={"Calendar"}
            subTitle={"Monthly view"}
          />
        </View>

        {/* All Ekadashi Card */}
        <SplitCard
          width={dw}
          list={"format-list-bulleted"}
          iconBackground={BackgroundGrey}
          iconColor={DarkBlue}
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 8,
  },
  titleContainer: {
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C2C56",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#5B7AB8",
    fontWeight: "500",
  },
  notificationButton: {
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#1C2C56",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  diyaSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8EFF7",
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
    color: "#4675C2",
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
