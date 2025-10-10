import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- Configuration ---
// These colors are picked to closely match the screenshot
const PRIMARY_BLUE = "#007AFF";
const ACCENT_GREY = "#f5f5f5"; // Light grey background for icons
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#666666"; // Slightly darker light text for better contrast
const BORDER_COLOR = "#eeeeee";
const CARD_WHITE = "#ffffff";

// Gradient colors for the subtle outer glow/border effect
const GRADIENT_START = "#e0f0ff"; // Light blue
const GRADIENT_END = "#ffffff";

// --- Next Ekadashi Card Component ---

const NextEkadashiCard = () => {
  return (
    // The LinearGradient is used to create the soft, diffused light blue border
    // and overall light shadow effect seen wrapping the card.
    <LinearGradient
      colors={[GRADIENT_START, GRADIENT_END]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1.2 }}
      style={styles.gradientWrapper}
    >
      <View style={styles.cardContent}>
        {/* Top Section: Next Ekadashi & Upcoming Tag */}
        <View style={styles.topSection}>
          <View style={styles.iconTextGroup}>
            {/* Calendar Icon Container */}
            <View style={[styles.iconContainer, styles.topIconPadding]}>
              <MaterialCommunityIcons
                name="calendar-range"
                size={28}
                color={PRIMARY_BLUE}
              />
            </View>
            {/* Ekadashi Name */}
            <View style={styles.details}>
              <Text style={styles.label}>Next Ekadashi</Text>
              <Text style={styles.name}>Papankusha Ekadashi</Text>
            </View>
          </View>

          {/* Upcoming Tag */}
          <View style={styles.upcomingTag}>
            <Text style={styles.upcomingText}>Upcoming</Text>
          </View>
        </View>

        {/* Separator Line */}
        <View style={styles.separator} />

        {/* Bottom Section: Date & View Details */}
        <View style={styles.bottomSection}>
          <View style={styles.iconTextGroup}>
            {/* Clock Icon Container */}
            <View style={[styles.iconContainer, styles.bottomIconPadding]}>
              <MaterialCommunityIcons
                name="clock-time-three-outline"
                size={24}
                color={PRIMARY_BLUE}
              />
            </View>
            {/* Date and Remaining Days */}
            <View style={styles.details}>
              <Text style={styles.date}>Friday, October 3, 2025</Text>
              <Text style={styles.remaining}>5 days remaining</Text>
            </View>
          </View>

          {/* View Details Button */}
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

// --- Stylesheet ---

const styles = StyleSheet.create({
  gradientWrapper: {
    // Outer wrapper for the gradient border effect
    borderRadius: 16,
    marginHorizontal: 15,
    marginTop: 20,
    // Use a soft shadow to enhance the floating effect
    shadowColor: PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardContent: {
    // Inner view to hold the pure white background and content padding
    backgroundColor: CARD_WHITE,
    borderRadius: 16,
    padding: 20,
    // Use a slight margin to reveal the gradient border underneath
    margin: 1,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconTextGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1, // Allow text to wrap if needed
  },
  iconContainer: {
    // Background style for all icons
    backgroundColor: ACCENT_GREY,
    borderRadius: 10,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
    // The padding is slightly different for top and bottom icons
  },
  topIconPadding: {
    width: 44, // Match width/height for calendar icon
    height: 44,
    padding: 8, // Center icon visually
  },
  bottomIconPadding: {
    width: 40, // Match width/height for clock icon
    height: 40,
    padding: 8, // Center icon visually
  },
  details: {
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    color: TEXT_LIGHT,
    fontWeight: "500",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: PRIMARY_BLUE,
    marginTop: 2,
  },
  upcomingTag: {
    // Light blue background for the tag
    backgroundColor: PRIMARY_BLUE + "20",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  upcomingText: {
    color: PRIMARY_BLUE,
    fontWeight: "600",
    fontSize: 12,
  },
  separator: {
    // Subtle separator line
    height: 1,
    backgroundColor: BORDER_COLOR,
    marginVertical: 15,
  },
  date: {
    fontSize: 16,
    color: TEXT_DARK,
    fontWeight: "600",
  },
  remaining: {
    fontSize: 12,
    color: TEXT_LIGHT,
    marginTop: 2,
  },
  viewDetailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  viewDetailsText: {
    color: PRIMARY_BLUE,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default NextEkadashiCard;
