import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import DailyWisdomActionCard from "../components/DailyWisdomActionCard";
import DailyWisdomReflectionCard from "../components/DailyWisdomReflectionCard";
import { useTheme } from "../context/ThemeContext";
import { dailyWisdoms, getTimeBasedWisdom, getTodaysWisdom } from "../data/dailyWisdomData";

const DailyWisdom = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [currentWisdom, setCurrentWisdom] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [wisdom, setWisdom] = useState(dailyWisdoms[0]);
  const [reflectionText, setReflectionText] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    let currentTimeOfDay = "morning";
    if (hour < 12) {
      currentTimeOfDay = "morning";
    } else if (hour < 18) {
      currentTimeOfDay = "afternoon";
    } else {
      currentTimeOfDay = "evening";
    }
    setTimeOfDay(currentTimeOfDay);

    const todaysWisdom = getTodaysWisdom();
    const todayIndex = dailyWisdoms.findIndex(
      w => w.sanskrit === todaysWisdom.sanskrit
    );
    if (todayIndex !== -1) {
      setCurrentWisdom(todayIndex);
      setWisdom(todaysWisdom);
    }

    const reflection = getTimeBasedWisdom(currentTimeOfDay);
    setReflectionText(reflection);
  }, []);

  const nextWisdom = () => {
    const nextIndex = (currentWisdom + 1) % dailyWisdoms.length;
    setCurrentWisdom(nextIndex);
    setWisdom(dailyWisdoms[nextIndex]);
    setIsLiked(false);
  };

  const displayWisdom = wisdom || {
    sanskrit: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे",
    transliteration: "Hare Krishna Hare Krishna Krishna Krishna Hare Hare",
    english:
      "Chanting the holy names purifies the heart and connects us with the divine consciousness",
    verse: "Bhagavad Gita 7.7",
    type: "mantra",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Daily Wisdom</Text>
        <View style={styles.placeholderRight} />
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          Spiritual teachings for your journey
        </Text>
        <DailyWisdomReflectionCard
          reflectionText={reflectionText}
          timeOfDay={timeOfDay}
        />
        <View style={[styles.mantraCard, { backgroundColor: colors.card }]}>
          <View style={styles.mantraHeader}>
            <View style={[styles.mantraIconContainer, { backgroundColor: colors.card }]}>
              <Entypo
                name="quote"
                size={20}
                color={colors.mutedForeground}
              />
            </View>
            <Text style={[styles.mantraTag, { color: colors.mutedForeground }]}>
              {displayWisdom.type?.toUpperCase() || "MANTRA"}
            </Text>
            <View style={[styles.bhagavadGitaTag, { backgroundColor: colors.lightBlueBg }]}>
              <Text style={[styles.bhagavadGitaText, { color: colors.primary }]}>
                {displayWisdom.verse || "Bhagavad Gita 7.7"}
              </Text>
            </View>
          </View>
          <View style={[styles.mainMantraContainer, { backgroundColor: colors.lightBlueBg }]}>
            <Text style={[styles.sanskritMantra, { color: colors.foreground }]}>{displayWisdom.sanskrit}</Text>
            <Text style={[styles.englishMantra, { color: colors.mutedForeground }]}>
              {displayWisdom.transliteration}
            </Text>
          </View>

          <Text style={[styles.mantraDescription, { color: colors.foreground }]}>{displayWisdom.english}</Text>

          <View style={[styles.mantraFooter, { borderTopColor: colors.border }]}>
            <View style={styles.mantraActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Feather
                  name="heart"
                  size={18}
                  color={isLiked ? "#FF6B6B" : colors.mutedForeground}
                />
                <Text style={[styles.actionText, { color: colors.mutedForeground }]}>
                  {isLiked ? "Loved" : "Love"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="share-2" size={18} color={colors.mutedForeground} />
                <Text style={[styles.actionText, { color: colors.mutedForeground }]}>Share</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={nextWisdom}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionCardsContainer}>
          <DailyWisdomActionCard
            iconName="sunny-outline"
            iconColor={colors.secondary}
            iconBgColor={isDark ? colors.muted : "#FEFCEA"}
            title="Morning Japa"
            subtitle="16 rounds of chanting"
            onPress={() => navigation.navigate("MorningJapa")}
          />
          <DailyWisdomActionCard
            iconName="book-outline"
            iconColor={colors.primary}
            iconBgColor={colors.lightBlueBg}
            title="Daily Reading"
            subtitle="Bhagavad Gita study"
            onPress={() => navigation.navigate("DailyReading")}
          />
        </View>
        <View style={[styles.bottomCard, { backgroundColor: colors.primary }]}>
          <Ionicons
            name="heart"
            size={32}
            color="#fff"
            style={styles.bottomCardIcon}
          />
          <Text style={styles.bottomCardTitle}>Hare Krishna!</Text>
          <Text style={styles.bottomCardDescription}>
            The easiest and most sublime process for understanding the Supreme
            Personality of Godhead is to hear about Him.
          </Text>
          <Text style={styles.bottomCardDescription}> Srila Prabhupada</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: -40,
  },
  placeholderRight: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  mainMantraContainer: {
    borderRadius: 7,
    padding: 10,
    alignItems: "flex-start",
  },
  mantraCard: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mantraHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mantraIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  mantraTag: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: "auto",
  },
  bhagavadGitaTag: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  bhagavadGitaText: {
    fontSize: 11,
    fontWeight: "500",
  },
  sanskritMantra: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 30,
  },
  englishMantra: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 16,
  },
  mantraDescription: {
    fontSize: 14,
    marginVertical: 15,
    marginHorizontal: 10,
    lineHeight: 20,
  },
  mantraFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  mantraActions: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  nextButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
    marginBottom: 16,
  },
  bottomCard: {
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 160,
  },
  bottomCardIcon: {
    marginBottom: 10,
  },
  bottomCardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  bottomCardDescription: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    lineHeight: 25,
  },
});

export default DailyWisdom;
