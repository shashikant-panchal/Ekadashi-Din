import { Ionicons } from "@expo/vector-icons"; // ✅ Import Ionicons
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { DarkBlue, LightBlue } from "../constants/Colors";
import { useNextEkadashi } from "../hooks/useEkadashi";
import { getTodayEkadashi } from "../services/api";
import { useState, useEffect } from "react";

// --- Configuration ---

const CARD_WHITE = "#ffffff";
const GRADIENT_START = "rgb(233, 237, 241)";
const GRADIENT_END = "#F4F5F0";

// --- Next Ekadashi Card Component ---

const NextEkadashiCard = () => {
  const { nextEkadashi, loading, error } = useNextEkadashi();
  const [todayEkadashi, setTodayEkadashi] = useState(null);

  useEffect(() => {
    const fetchTodayEkadashi = async () => {
      const today = await getTodayEkadashi();
      setTodayEkadashi(today);
    };
    fetchTodayEkadashi();
  }, []);

  const handleViewDetails = () => {
    console.log("View Details Pressed!");
    // Navigation logic here
  };

  // Calculate days remaining
  const getDaysRemaining = (ekadashiDate) => {
    if (!ekadashiDate) return null;
    const date = moment(ekadashiDate);
    const today = moment();
    const days = date.diff(today, 'days');
    return days > 0 ? `${days} days remaining` : days === 0 ? "Today" : "Passed";
  };

  // Determine which Ekadashi to display
  const displayEkadashi = todayEkadashi || nextEkadashi;
  const isToday = todayEkadashi !== null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = moment(dateString);
    return date.format('dddd, MMMM D, YYYY');
  };

  if (loading) {
    return (
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={[GRADIENT_START, GRADIENT_END]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.2 }}
          style={styles.gradientBackground}
        />
        <View style={[styles.cardContentContainer, { alignItems: 'center', justifyContent: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={DarkBlue} />
        </View>
      </View>
    );
  }

  if (error || !displayEkadashi) {
    return (
      <View style={styles.cardWrapper}>
        <LinearGradient
          colors={[GRADIENT_START, GRADIENT_END]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1.2 }}
          style={styles.gradientBackground}
        />
        <View style={styles.cardContentContainer}>
          <Text style={styles.errorText}>{error || "No upcoming Ekadashi found"}</Text>
        </View>
      </View>
    );
  }

  const ekadashiName = displayEkadashi.name || displayEkadashi.ekadashi_name || (isToday ? "Today's Ekadashi" : "Next Ekadashi");
  const ekadashiDate = displayEkadashi.date || displayEkadashi.ekadashi_date;
  const daysRemaining = isToday ? "Today" : getDaysRemaining(ekadashiDate);

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
            <Text style={styles.nextEkadashiText}>{isToday ? "Today's Ekadashi" : "Next Ekadashi"}</Text>
            <Text style={[styles.ekadashiNameText, { color: LightBlue }]}>{ekadashiName}</Text>
          </View>

          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingText}>{isToday ? "Today" : "Upcoming"}</Text>
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
              <Text style={styles.dateText}>{formatDate(ekadashiDate)}</Text>
              {daysRemaining && <Text style={styles.daysRemainingText}>{daysRemaining}</Text>}
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
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    textAlign: "center",
    padding: 20,
  },
});

export default NextEkadashiCard;
