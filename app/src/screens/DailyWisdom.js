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
import {
  AppYellow,
  DarkBlue,
  LightBlue,
  LIGHTBLUEBG,
} from "../constants/Colors";
import { getTimeBasedWisdom, getTodaysWisdom } from "../data/dailyWisdomData";

const DailyWisdom = ({ navigation }) => {
  const [currentWisdom, setCurrentWisdom] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [wisdom, setWisdom] = useState(null);
  const [reflectionText, setReflectionText] = useState("");

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setTimeOfDay("morning");
    } else if (hour < 18) {
      setTimeOfDay("afternoon");
    } else {
      setTimeOfDay("evening");
    }

    // Get today's wisdom
    const todaysWisdom = getTodaysWisdom();
    setWisdom(todaysWisdom);

    // Get time-based reflection
    const reflection = getTimeBasedWisdom(timeOfDay);
    setReflectionText(reflection);
  }, []);

  const nextWisdom = () => {
    const todaysWisdom = getTodaysWisdom();
    setCurrentWisdom((prev) => (prev + 1) % 3);
    setWisdom(todaysWisdom);
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Wisdom</Text>
        <View style={styles.placeholderRight} />
        <Text style={styles.headerSubtitle}>
          Spiritual teachings for your journey
        </Text>
        <DailyWisdomReflectionCard
          reflectionText={reflectionText}
          timeOfDay={timeOfDay}
        />
        <View style={styles.mantraCard}>
          <View style={styles.mantraHeader}>
            <View style={styles.mantraIconContainer}>
              <Entypo
                style={{ backgroundColor: "#fff" }}
                name="quote"
                size={20}
                color={"grey"}
              />
            </View>
            <Text style={styles.mantraTag}>
              {displayWisdom.type?.toUpperCase() || "MANTRA"}
            </Text>
            <View style={styles.bhagavadGitaTag}>
              <Text style={styles.bhagavadGitaText}>
                {displayWisdom.verse || "Bhagavad Gita 7.7"}
              </Text>
            </View>
          </View>
          <View style={styles.mainMantraContainer}>
            <Text style={styles.sanskritMantra}>{displayWisdom.sanskrit}</Text>
            <Text style={styles.englishMantra}>
              {displayWisdom.transliteration}
            </Text>
          </View>

          <Text style={styles.mantraDescription}>{displayWisdom.english}</Text>

          <View style={styles.mantraFooter}>
            <View style={styles.mantraActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Feather
                  name="heart"
                  size={18}
                  color={isLiked ? "#FF6B6B" : LightBlue}
                  fill={isLiked ? "#FF6B6B" : "none"}
                />
                <Text style={styles.actionText}>
                  {isLiked ? "Loved" : "Love"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="share-2" size={18} color={LightBlue} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={nextWisdom}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Action Cards Container */}
        <View style={styles.actionCardsContainer}>
          <DailyWisdomActionCard
            iconName="sunny-outline"
            iconColor={AppYellow} // Orange
            iconBgColor="#FEFCEA" // Light Orange
            title="Morning Japa"
            subtitle="16 rounds of chanting"
            onPress={() => navigation.navigate("MorningJapa")}
          />
          <DailyWisdomActionCard
            iconName="book-outline"
            iconColor={DarkBlue} // Blue
            iconBgColor="#E7EBF5" // Light Blue
            title="Daily Reading"
            subtitle="Bhagavad Gita study"
            onPress={() => navigation.navigate("DailyReading")}
          />
        </View>
        {/* Bottom Card */}
        <View style={styles.bottomCard}>
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
    backgroundColor: "#f8f9fa", // Light grey background
  },
  scrollViewContent: {
    paddingBottom: 20, // Add some padding at the bottom
  },
  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 10 : 0, // Adjust for Android status bar
  },
  backButton: {
    padding: 8, // Make touchable area larger
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: DarkBlue,
    flex: 1, // Allow title to take available space
    textAlign: "center",
    marginLeft: -40, // Adjust to visually center due to back button
  },
  placeholderRight: {
    width: 40, // Match back button width to keep title centered
  },
  headerSubtitle: {
    fontSize: 14,
    color: LightBlue,
    textAlign: "center",
    marginBottom: 16,
  },

  mainMantraContainer: {
    backgroundColor: LIGHTBLUEBG,
    borderRadius: 7,
    padding: 10,
    alignItems: "flex-start",
  },
  // Mantra Card Styles
  mantraCard: {
    backgroundColor: "#fff",
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
    // backgroundColor: '#e0e0e0',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  mantraTag: {
    fontSize: 12,
    fontWeight: "500",
    color: LightBlue,
    marginRight: "auto", // Pushes Bhagavad Gita tag to the right
  },
  bhagavadGitaTag: {
    backgroundColor: LIGHTBLUEBG, // Light blue background
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  bhagavadGitaText: {
    fontSize: 11,
    color: DarkBlue, // Blue text
    fontWeight: "500",
  },
  sanskritMantra: {
    fontSize: 20,
    fontWeight: "bold",
    color: DarkBlue,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 30,
  },
  englishMantra: {
    fontSize: 16,
    fontStyle: "italic",
    color: LightBlue,
    // textAlign: 'center',
    marginBottom: 16,
  },
  mantraDescription: {
    fontSize: 14,
    color: DarkBlue,
    marginVertical: 15,
    marginHorizontal: 10,
    lineHeight: 20,
  },
  mantraFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
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
    color: LightBlue,
    marginLeft: 6,
  },
  nextButton: {
    backgroundColor: DarkBlue, // Blue button
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
    backgroundColor: DarkBlue,
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
    color: "#fff", // Light grey
    textAlign: "center",
    lineHeight: 25,
  },
});

export default DailyWisdom;
