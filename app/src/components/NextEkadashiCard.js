import { Ionicons } from "@expo/vector-icons"; // ✅ Import Ionicons
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DarkBlue, LightBlue } from "../constants/Colors";

// --- Configuration ---

const CARD_WHITE = "#ffffff";
const GRADIENT_START = "rgb(233, 237, 241)";
const GRADIENT_END = "#F4F5F0";

// --- Next Ekadashi Card Component ---

const NextEkadashiCard = () => {
  const handleViewDetails = () => {
    console.log("View Details Pressed!");
    // Navigation logic here
  };

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient
        colors={[GRADIENT_START, GRADIENT_END]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1.2 }}
        style={styles.gradientBackground}
      />

      <View style={styles.cardContentContainer}>
        {/* --- Top Section --- */}
        <View style={styles.topSection}>
          <View style={styles.iconBackground}>
            {/* ✅ Replaced Calendar emoji with Ionicon */}
            <Ionicons name="calendar-outline" size={24} color={DarkBlue} />
          </View>

          <View style={styles.textGroup}>
            <Text style={styles.nextEkadashiText}>Next Ekadashi</Text>
            <Text style={[styles.ekadashiNameText, { color: LightBlue }]}>Rama Ekadashi</Text>
          </View>

          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingText}>Upcoming</Text>
          </View>
        </View>

        {/* --- Bottom Section --- */}
        <View style={styles.bottomSection}>
          <View style={styles.dateInfoContainer}>
            {/* ✅ Replaced Clock emoji with Ionicon */}
            <Ionicons
              name="time-outline"
              size={18}
              color="#6c757d"
              style={{ marginRight: 10 }}
            />
            <View>
              <Text style={styles.dateText}>Friday, October 17, 2025</Text>
              <Text style={styles.daysRemainingText}>7 days remaining</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={handleViewDetails}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: CARD_WHITE,
    borderRadius: 16,
    margin: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContentContainer: {
    padding: 16,
    backgroundColor: "transparent",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  iconBackground: {
    backgroundColor: "#D5DBE2",
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    flex: 1,
    justifyContent: "center",
  },
  nextEkadashiText: {
    fontSize: 16,
    color: DarkBlue,
    fontWeight: "600",

    marginBottom: 2,
  },
  ekadashiNameText: {
    fontSize: 14,

  },
  upcomingBadge: {
    backgroundColor: "#e9ecef",
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: "#ced4da",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  upcomingText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#495057",
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  dateInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#343a40",
  },
  daysRemainingText: {
    fontSize: 12,
    color: LightBlue,
  },
  detailsButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: DarkBlue,
  },
});

export default NextEkadashiCard;
