import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../context/ThemeContext";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);

const ProfileScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.lightBlueBg }]}>
            <Ionicons
              name="person-outline"
              size={relativeWidth(12)}
              color={colors.foreground}
            />
          </View>
          <ThemedText type="subtitle" style={[styles.username, { color: colors.foreground }]}>Devotee</ThemedText>
          <ThemedText type="small" style={[styles.profileSubtitle, { color: colors.mutedForeground }]}>Spiritual Journey Profile</ThemedText>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="calendar" size={relativeWidth(8)} color={colors.primary} />
            <ThemedText type="title" style={[styles.statCount, { color: colors.foreground }]}>0</ThemedText>
            <ThemedText type="defaultSemiBold" style={[styles.statLabel, { color: colors.mutedForeground }]}>Ekadashis</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="clock" size={relativeWidth(8)} color={colors.secondary} />
            <ThemedText type="title" style={[styles.statCount, { color: colors.foreground }]}>0</ThemedText>
            <ThemedText type="defaultSemiBold" style={[styles.statLabel, { color: colors.mutedForeground }]}>Day Streak</ThemedText>
          </View>
        </View>

        <LinearGradient
          colors={isDark ? [colors.card, colors.muted] : ["#FAF5FF", "#F6F5FF", "#F0F6FF"]}
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
                <ThemedText style={styles.challengeIcon}>ॐ</ThemedText>
              </View>
            </LinearGradient>

            <ThemedText type="heading" style={[styles.challengeTitle, { color: colors.foreground }]}>
              Spiritual Wisdom Challenge
            </ThemedText>
          </View>
          <ThemedText style={[styles.challengeDescription, { color: colors.mutedForeground }]}>
            Explore the profound wisdom of the Bhagavad Gita and Mahabharata
            through engaging questions that inspire spiritual growth.
          </ThemedText>
          <TouchableOpacity onPress={() => navigation.navigate('Challenge')}>
            <LinearGradient
              colors={["#A556F6", "#437FF6"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.challengeButtonGradient}
            >
              <ThemedText type="defaultSemiBold" style={styles.challengeButtonText}>Begin Challenge</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>

        <View style={[styles.recentActivityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.activityHeader}>
            <Feather name="calendar" size={relativeWidth(5)} color={colors.foreground} />
            <ThemedText type="heading" style={[styles.activityTitle, { color: colors.foreground }]}>Recent Activity</ThemedText>
          </View>
          <ThemedText style={[styles.noActivityText, { color: colors.mutedForeground }]}>No recent activity</ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: relativeWidth(4),
    paddingBottom: relativeHeight(5),
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: relativeHeight(3),
  },
  avatarContainer: {
    width: relativeWidth(25),
    height: relativeWidth(25),
    borderRadius: relativeWidth(12.5),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: relativeHeight(1.5),
  },
  username: {
    fontSize: relativeWidth(6),
  },
  profileSubtitle: {
    fontSize: relativeWidth(3.8),
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: relativeHeight(3),
  },
  statCard: {
    width: "48%",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statCount: {
    fontSize: relativeWidth(10),
    marginTop: relativeHeight(1),
  },
  statLabel: {
    fontSize: relativeWidth(4),
    marginTop: relativeHeight(0.5),
  },
  challengeCard: {
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
    justifyContent: "center",
    alignItems: "center",
    marginRight: relativeWidth(3),
  },
  challengeIcon: {
    fontSize: relativeWidth(5),
    color: "#fff",
  },
  challengeTitle: {
    fontSize: relativeWidth(5),
  },
  challengeDescription: {
    fontSize: relativeWidth(3.7),
    marginBottom: relativeHeight(2.5),
    lineHeight: relativeHeight(2.5),
  },
  challengeButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  challengeButtonText: {
    color: "#FFF",
    fontSize: 16,
    textTransform: "uppercase",
    backgroundColor: "transparent",
  },
  recentActivityCard: {
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    borderWidth: 1,
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
    marginLeft: relativeWidth(2),
  },
  noActivityText: {
    fontSize: relativeWidth(4),
    textAlign: "center",
    paddingVertical: relativeHeight(2),
  },
});

export default ProfileScreen;
