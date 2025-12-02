import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNextEkadashi } from "../hooks/useEkadashi";
import { getTodayEkadashi } from "../services/api";

// --- Next Ekadashi Card Component ---

const NextEkadashiCard = () => {
  const { nextEkadashi, loading, error } = useNextEkadashi();
  const [todayEkadashi, setTodayEkadashi] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const fetchTodayEkadashi = async () => {
      const today = await getTodayEkadashi();
      setTodayEkadashi(today);
    };
    fetchTodayEkadashi();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const displayEkadashi = todayEkadashi || nextEkadashi;
    if (!displayEkadashi || todayEkadashi) return;

    const ekadashiDate = displayEkadashi.date || displayEkadashi.ekadashi_date;

    const updateCountdown = () => {
      const now = moment();
      const targetDate = moment(ekadashiDate);
      const diff = targetDate.diff(now);

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Refresh to check if it's today
        fetchTodayEkadashi();
        return;
      }

      const duration = moment.duration(diff);
      setCountdown({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextEkadashi, todayEkadashi]);

  const handleBeginObservance = () => {
    console.log("Begin Observance Pressed!");
    // Navigation logic here
  };

  const handleViewDetails = () => {
    console.log("View Details Pressed!");
    // Navigation logic here
  };

  // Determine which Ekadashi to display
  const displayEkadashi = todayEkadashi || nextEkadashi;
  const isToday = todayEkadashi !== null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = moment(dateString);
    return date.format('ddd, MMM D');
  };

  if (loading) {
    return (
      <View style={styles.nextCardContainer}>
        <View style={styles.nextCardWrapper}>
          <View style={[styles.nextCardContent, { alignItems: 'center', justifyContent: 'center', padding: 40 }]}>
            <ActivityIndicator size="large" color="#1C2C56" />
          </View>
        </View>
      </View>
    );
  }

  if (error || !displayEkadashi) {
    return (
      <View style={styles.nextCardContainer}>
        <View style={styles.nextCardWrapper}>
          <View style={styles.nextCardContent}>
            <Text style={styles.errorText}>{error || "No upcoming Ekadashi found"}</Text>
          </View>
        </View>
      </View>
    );
  }

  const ekadashiName = displayEkadashi.name || displayEkadashi.ekadashi_name || (isToday ? "Today's Ekadashi" : "Next Ekadashi");
  const ekadashiDate = displayEkadashi.date || displayEkadashi.ekadashi_date;

  // Render "Today is Ekadashi!" card
  if (isToday) {
    return (
      <View style={styles.todayOuterContainer}>
        <View style={styles.todayCardWrapper}>
          <View style={styles.todayCardContent}>
            {/* "Today is Ekadashi!" Gradient Badge */}
            <LinearGradient
              colors={['#EF4444', '#F59E0B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.todayBadge}
            >
              <Text style={styles.todayBadgeText}>Today is Ekadashi!</Text>
            </LinearGradient>

            {/* Moon Icon in Yellow Circle */}
            <View style={styles.moonIconContainer}>
              <Text style={styles.moonIcon}>🌙</Text>
            </View>

            {/* Ekadashi Name */}
            <Text style={styles.todayEkadashiName}>{ekadashiName}</Text>

            {/* Begin Observance Button with Gradient */}
            <TouchableOpacity onPress={handleBeginObservance} activeOpacity={0.8}>
              <LinearGradient
                colors={['#F59E0B', '#F97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.observanceButton}
              >
                <Text style={styles.observanceButtonText}>Begin Observance</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Render "Next Ekadashi" card with countdown
  return (
    <View style={styles.nextCardContainer}>
      <View style={styles.nextCardWrapper}>
        <View style={styles.nextCardContent}>
          {/* Header */}
          <Text style={styles.nextHeaderText}>NEXT EKADASHI</Text>

          {/* Ekadashi Name and Date Row */}
          <View style={styles.nameAndDateRow}>
            <View style={styles.nameSection}>
              <Text style={styles.moonIconSmall}>🌙</Text>
              <Text style={styles.nextEkadashiName}>{ekadashiName}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(ekadashiDate)}</Text>
          </View>

          {/* Countdown Timer */}
          <View style={styles.countdownContainer}>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownNumber}>{countdown.days}</Text>
              <Text style={styles.countdownLabel}>Days</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownNumber}>{countdown.hours}</Text>
              <Text style={styles.countdownLabel}>Hours</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownNumber}>{countdown.minutes}</Text>
              <Text style={styles.countdownLabel}>Minutes</Text>
            </View>
            <View style={styles.countdownBox}>
              <Text style={styles.countdownNumber}>{countdown.seconds}</Text>
              <Text style={styles.countdownLabel}>Seconds</Text>
            </View>
          </View>

          {/* View Details Button */}
          <TouchableOpacity style={styles.viewDetailsButton} onPress={handleViewDetails}>
            <Text style={styles.viewDetailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Today's Ekadashi Card Styles
  todayOuterContainer: {
    backgroundColor: "#E8EFF7",
    borderRadius: 24,
    margin: 16,
    marginTop: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  todayCardWrapper: {
    backgroundColor: "#FEF9E7",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#F9E79F",
    overflow: "visible",
  },
  todayCardContent: {
    padding: 32,
    paddingTop: 16,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  todayBadge: {
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: -28,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  todayBadgeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  moonIconContainer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#FDE68A",
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  moonIcon: {
    fontSize: 35,
  },
  todayEkadashiName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#7C2D12",
    textAlign: "center",
    marginBottom: 20,
  },
  observanceButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 80,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  observanceButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  // Next Ekadashi Card Styles
  nextCardContainer: {
    backgroundColor: "#E8EFF7",
    borderRadius: 24,
    margin: 16,
    marginTop: 20,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  nextCardWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",
  },
  nextCardContent: {
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  nextHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7AB8",
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  nameAndDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  moonIconSmall: {
    fontSize: 28,
    marginRight: 12,
  },
  nextEkadashiName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C2C56",
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C2C56",
  },
  countdownContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    gap: 12,
  },
  countdownBox: {
    flex: 1,
    backgroundColor: "#EEF2F6",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1C2C56",
    marginBottom: 4,
  },
  countdownLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7AB8",
  },
  viewDetailsButton: {
    backgroundColor: "#1C2C56",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  viewDetailsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // Common Styles
  errorText: {
    fontSize: 14,
    color: "#dc3545",
    textAlign: "center",
    padding: 20,
  },
});

export default NextEkadashiCard;
