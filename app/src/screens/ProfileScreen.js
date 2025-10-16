import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppYellow, DarkBlue, LightBlue } from "../constants/Colors";

// --- Dimension Utilities ---
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);
// ----------------------------------------

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* --- Header: User Profile --- */}
        <View style={styles.profileHeader}>
          {/* Avatar Placeholder */}
          <View style={styles.avatarContainer}>
            <Ionicons
              name="person-outline"
              size={relativeWidth(12)}
              color="black"
            />
          </View>
          <Text style={styles.username}>Devotee</Text>
          <Text style={styles.profileSubtitle}>Spiritual Journey Profile</Text>
        </View>

        {/* --- Stats Cards --- */}
        <View style={styles.statsContainer}>
          {/* Ekadashis Card */}
          <View style={styles.statCard}>
            <Feather name="calendar" size={relativeWidth(8)} color={DarkBlue} />
            <Text style={styles.statCount}>0</Text>
            <Text style={styles.statLabel}>Ekadashis</Text>
          </View>
          {/* Day Streak Card */}
          <View style={styles.statCard}>
            <Feather name="clock" size={relativeWidth(8)} color={AppYellow} />
            <Text style={styles.statCount}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <LinearGradient
          colors={["#FAF5FF", "#F6F5FF", "#F0F6FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.challengeCard}
        >
          <View style={styles.challengeHeader}>
            <LinearGradient
              colors={["#A556F6", "#437FF6"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.challengeIconBackground}
            >
              <View>
                <Text style={styles.challengeIcon}>ॐ</Text>
              </View>
            </LinearGradient>

            <Text style={styles.challengeTitle}>
              Spiritual Wisdom Challenge
            </Text>
          </View>
          <Text style={styles.challengeDescription}>
            Explore the profound wisdom of the Bhagavad Gita and Mahabharata
            through engaging questions that inspire spiritual growth.
          </Text>
          <TouchableOpacity>
            <LinearGradient
              // 1. Define vibrant, spiritual colors (e.g., deep orange to gold)
              colors={["#A556F6", "#437FF6"]}
              // 2. Define the gradient direction (Horizontal for a smooth sweep)
              start={{ x: 0, y: 0.5 }} // Left edge
              end={{ x: 1, y: 0.5 }} // Right edge
              style={styles.challengeButtonGradient} // 3. Apply the visual styles here
            >
              <Text style={styles.challengeButtonText}>Begin Challenge</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        {/* --- Recent Activity Card --- */}
        <View style={styles.recentActivityCard}>
          <View style={styles.activityHeader}>
            <Feather name="calendar" size={relativeWidth(5)} color="#212529" />
            <Text style={styles.activityTitle}>Recent Activity</Text>
          </View>
          <Text style={styles.noActivityText}>No recent activity</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollViewContent: {
    paddingHorizontal: relativeWidth(4),
    paddingBottom: relativeHeight(5),
  },

  // --- Profile Header Styles ---
  profileHeader: {
    alignItems: "center",
    paddingVertical: relativeHeight(3),
  },
  avatarContainer: {
    width: relativeWidth(25),
    height: relativeWidth(25),
    borderRadius: relativeWidth(12.5),
    backgroundColor: "#E9ECF0", // Light gray background
    justifyContent: "center",
    alignItems: "center",
    marginBottom: relativeHeight(1.5),
  },
  username: {
    fontSize: relativeWidth(6),
    fontWeight: "700",
    color: DarkBlue,
  },
  profileSubtitle: {
    fontSize: relativeWidth(3.8),
    color: LightBlue,
  },

  // --- Stats Cards Styles ---
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: relativeHeight(3),
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statCount: {
    fontSize: relativeWidth(10),
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: relativeHeight(1),
  },
  statLabel: {
    fontSize: relativeWidth(4),
    fontWeight: "500",
    color: LightBlue,
    marginTop: relativeHeight(0.5),
  },

  // --- Spiritual Wisdom Challenge Card Styles ---
  challengeCard: {
    backgroundColor: "#F5F5FC", // Very light purple/gray base
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    marginBottom: relativeHeight(3),
    overflow: "hidden",
  },
  challengeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: relativeHeight(1.5),
  },
  challengeIconBackground: {
    width: relativeWidth(10),
    height: relativeWidth(10),
    borderRadius: relativeWidth(2),
    backgroundColor: "#9B59B6", // Base purple color (replace with gradient logic if needed)
    justifyContent: "center",
    alignItems: "center",
    marginRight: relativeWidth(3),
  },
  challengeIcon: {
    fontSize: relativeWidth(5),
    color: "#fff",
    fontWeight: "bold",
  },
  challengeTitle: {
    fontSize: relativeWidth(5),
    fontWeight: "700",
    color: "#2C3E50",
  },
  challengeDescription: {
    fontSize: relativeWidth(3.7),
    color: LightBlue,
    marginBottom: relativeHeight(2.5),
    lineHeight: relativeHeight(2.5),
  },
  challengeButtonContainer: {
    // Inherit the margin if needed, or define the width
    marginVertical: 10,
    borderRadius: 10, // Must match the gradient border radius
    overflow: "hidden", // Ensures the gradient respects the border radius
  },

  // This style is applied to the LinearGradient component
  challengeButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10, // Matches the container
    alignItems: "center",
    justifyContent: "center",
    width: "100%", // Ensure it fills the Touchable container
  },

  challengeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
    backgroundColor: "transparent", // Crucial to ensure text color shows over gradient
  },

  // --- Recent Activity Card Styles ---
  recentActivityCard: {
    backgroundColor: "#fff",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: relativeHeight(1.5),
  },
  activityTitle: {
    fontSize: relativeWidth(5),
    fontWeight: "600",
    color: "#212529",
    marginLeft: relativeWidth(2),
  },
  noActivityText: {
    fontSize: relativeWidth(4),
    color: LightBlue,
    textAlign: "center",
    paddingVertical: relativeHeight(2),
  },
});

export default ProfileScreen;
