import moment from "moment";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DarkBlue } from "../constants/Colors";
import { useNextEkadashi } from "../hooks/useEkadashi";
import { getTodayEkadashi } from "../services/api";

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

  const handleBeginObservance = () => {
    console.log("Begin Observance Pressed!");
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
        <View style={[styles.cardContentContainer, { alignItems: 'center', justifyContent: 'center', padding: 40 }]}>
          <ActivityIndicator size="large" color={DarkBlue} />
        </View>
      </View>
    );
  }

  if (error || !displayEkadashi) {
    return (
      <View style={styles.cardWrapper}>
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
      <View style={styles.cardContentContainer}>
        {/* Moon Icon and "Today is Ekadashi!" Text in Same Row */}
        <View style={styles.headerRow}>
          <Text style={styles.moonIcon}>🌙</Text>
          <Text style={styles.todayText}>Today is Ekadashi!</Text>
        </View>

        {/* Ekadashi Name */}
        <Text style={styles.ekadashiNameText}>{ekadashiName}</Text>

        {/* Begin Observance Button */}
        <TouchableOpacity style={styles.observanceButton} onPress={handleBeginObservance}>
          <Text style={styles.observanceButtonText}>Begin Observance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: CARD_WHITE,
    borderRadius: 20,
    margin: 16,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardContentContainer: {
    padding: 32,
    backgroundColor: CARD_WHITE,
    alignItems: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  moonIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  todayText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1C2C56",
  },
  ekadashiNameText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5B7AB8",
    textAlign: "center",
    marginBottom: 24,
  },
  observanceButton: {
    backgroundColor: "#1C2C56",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  observanceButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    textAlign: "center",
    padding: 20,
  },
});

export default NextEkadashiCard;
