import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import moment from "moment";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { dh, dw } from "../constants/Dimensions";
import { useTheme } from "../context/ThemeContext";
import { usePanchang } from "../hooks/usePanchang";
import CalendarModal from "./CalendarModal";
import { ThemedText } from "./ThemedText";

const PanchangCard = () => {
  const { colors, isDark } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const { panchangData, loading, error, refreshData } =
    usePanchang(selectedDate);
  const { city } = useSelector((state) => state.location);

  const handleRefresh = () => {
    refreshData && refreshData();
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerLeft}
        onPress={() => setIsCalendarVisible(true)}
      >
        <Ionicons
          name="moon-outline"
          size={dw * 0.05}
          color={colors.foreground}
        />
        <View style={{ marginLeft: dw * 0.015 }}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.headerTitle, { color: colors.foreground }]}
          >
            {isToday(selectedDate)
              ? "Today's Panchang"
              : `Panchang: ${moment(selectedDate).format("DD MMM YYYY")}`}
          </ThemedText>
          {!isToday(selectedDate) && (
            <ThemedText
              style={{ fontSize: 10, color: colors.primary, marginTop: 2 }}
            >
              Tap to change
            </ThemedText>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={16}
          color={colors.mutedForeground}
          style={{ marginLeft: 4, marginTop: 2 }}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {!isToday(selectedDate) && (
          <TouchableOpacity
            onPress={() => setSelectedDate(new Date())}
            style={styles.todayButton}
          >
            <ThemedText style={styles.todayButtonText}>Today</ThemedText>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons
            name="refresh-outline"
            size={dw * 0.05}
            color={colors.foreground}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    if (typeof timeString === "string") {
      if (timeString.includes(":")) {
        return timeString.split(" ")[0];
      }
      return moment(timeString).format("HH:mm");
    }
    return "N/A";
  };

  const getTithi = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.tithi ||
      panchangData.tithi?.name ||
      panchangData.tithi?.details?.tithi_name ||
      panchangData.tithi_name ||
      "N/A"
    );
  };

  // Helper to safely get nested properties
  const safeGet = (obj, path, fallback = "N/A") => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj) || fallback;
  };

  const getLocation = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.location ||
      (panchangData.latitude && panchangData.longitude
        ? `${panchangData.latitude.toFixed(2)}°, ${panchangData.longitude.toFixed(2)}°`
        : "N/A")
    );
  };

  const getSunrise = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.sunrise ||
      formatTime(panchangData.sunrise_time || panchangData.suryoday) ||
      "N/A"
    );
  };

  const getSunset = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.sunset ||
      formatTime(panchangData.sunset_time || panchangData.suryast) ||
      "N/A"
    );
  };

  const getMoonrise = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.moonrise ||
      formatTime(panchangData.moonrise_time || panchangData.chandroday) ||
      "N/A"
    );
  };

  const getNakshatra = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.nakshatra ||
      panchangData.nakshatra?.name ||
      panchangData.nakshatra_name ||
      "N/A"
    );
  };

  const getYoga = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.yoga ||
      panchangData.yoga?.name ||
      panchangData.yoga_name ||
      "N/A"
    );
  };

  const getKarana = () => {
    if (!panchangData) return "N/A";
    return (
      panchangData.karana ||
      panchangData.karana?.name ||
      panchangData.karana_name ||
      "N/A"
    );
  };

  const renderInfoCard = (label, value, bgColor, align = "flex-start") => (
    <View
      style={[
        styles.smallCard,
        { backgroundColor: isDark ? colors.muted : bgColor, alignItems: align },
      ]}
    >
      <ThemedText
        type="defaultSemiBold"
        style={[styles.label, { color: colors.mutedForeground }]}
      >
        {label}
      </ThemedText>
      <ThemedText
        type="defaultSemiBold"
        style={[styles.value, { color: colors.foreground }]}
      >
        {value}
      </ThemedText>
    </View>
  );

  const renderIconCard = (
    icon,
    iconType,
    label,
    value,
    bgColor,
    iconBgColor,
    iconColor
  ) => (
    <View
      style={[
        styles.smallCard,
        styles.rowAlign,
        { backgroundColor: isDark ? colors.muted : bgColor },
      ]}
    >
      <View
        style={[
          styles.iconBackground,
          {
            backgroundColor: isDark
              ? colors.lightBlueBg
              : iconBgColor || colors.muted,
          },
        ]}
      >
        {iconType === "fa5" && (
          <FontAwesome5
            name={icon}
            size={dw * 0.05}
            color={isDark ? colors.primary : iconColor}
          />
        )}
        {iconType === "mc" && (
          <MaterialCommunityIcons
            name={icon}
            size={dw * 0.055}
            color={isDark ? colors.secondary : iconColor}
          />
        )}
        {iconType === "ion" && (
          <Ionicons
            name={icon}
            size={dw * 0.05}
            color={isDark ? colors.primary : iconColor}
          />
        )}
      </View>
      <View style={styles.iconTextContainer}>
        <ThemedText
          style={[styles.subLabel, { color: colors.mutedForeground }]}
        >
          {label}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.value, { color: colors.foreground }]}
        >
          {value}
        </ThemedText>
      </View>
    </View>
  );

  const renderBottomCard = (label, value, bgColor) => (
    <View
      style={[
        styles.bottomCard,
        { backgroundColor: isDark ? colors.muted : bgColor },
      ]}
    >
      <ThemedText style={[styles.subLabel, { color: colors.mutedForeground }]}>
        {label}
      </ThemedText>
      <ThemedText
        type="defaultSemiBold"
        style={[styles.value, { color: colors.foreground }]}
        numberOfLines={2}
      >
        {value}
      </ThemedText>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {renderHeader()}
        <View style={{ padding: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
        <CalendarModal
          visible={isCalendarVisible}
          onClose={() => setIsCalendarVisible(false)}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
      </View>
    );
  }

  if (error || !panchangData) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {renderHeader()}
        <View style={{ padding: 20, alignItems: "center" }}>
          <ThemedText style={{ color: colors.destructive, fontSize: 14 }}>
            {error || "Failed to load Panchang data"}
          </ThemedText>
        </View>
        <CalendarModal
          visible={isCalendarVisible}
          onClose={() => setIsCalendarVisible(false)}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {renderHeader()}

      <View style={styles.row}>
        {renderInfoCard("TITHI", getTithi(), "#E8F0FB")}
        {renderInfoCard("LOCATION", city ? city : getLocation(), "#E8F0FB")}
      </View>

      <View style={styles.row}>
        {renderIconCard(
          "sun",
          "fa5",
          "Sunrise",
          getSunrise(),
          "#F1F6FE",
          null,
          colors.foreground
        )}
        {renderIconCard(
          "weather-sunset-down",
          "mc",
          "Sunset",
          getSunset(),
          "#FFF7E5",
          "#FEFCEB",
          "#FAE013"
        )}
      </View>

      <View
        style={[
          styles.fullCard,
          { backgroundColor: isDark ? colors.muted : "#F1F6FE" },
        ]}
      >
        <View
          style={[
            styles.iconBackground,
            { backgroundColor: colors.lightBlueBg },
          ]}
        >
          <Ionicons name="moon" size={dw * 0.05} color={colors.primary} />
        </View>
        <View style={styles.iconTextContainer}>
          <ThemedText
            style={[styles.subLabel, { color: colors.mutedForeground }]}
          >
            Moonrise
          </ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.value, { color: colors.foreground }]}
          >
            {getMoonrise()}
          </ThemedText>
        </View>
      </View>

      <View style={styles.row}>
        {renderBottomCard("Nakshatra", getNakshatra(), "#E9F0E6")}
        {renderBottomCard("Yoga", getYoga(), "#EDE7F6")}
        {renderBottomCard("Karana", getKarana(), "#E7EFFA")}
      </View>

      {/* New Fields: Samvatsara, Masa, Ritu */}
      {(panchangData.samvatsara || panchangData.masa || panchangData.ritu) && (
        <View style={[styles.row, { marginTop: 8 }]}>
          {panchangData.samvatsara && renderBottomCard("Samvatsara", panchangData.samvatsara, "#F1F6FE")}
          {panchangData.masa && renderBottomCard("Masa", panchangData.masa, "#FFF7E5")}
          {panchangData.ritu && renderBottomCard("Ritu", panchangData.ritu, "#E9F0E6")}
        </View>
      )}

      <CalendarModal
        visible={isCalendarVisible}
        onClose={() => setIsCalendarVisible(false)}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
      />
    </View>
  );
};

export default PanchangCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: dw * 0.03,
    padding: dw * 0.04,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dh * 0.01,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: dw * 0.045,
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
  },
  todayButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155'
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: dh * 0.007,
    gap: 8,
  },
  smallCard: {
    flex: 1,
    borderRadius: dw * 0.025,
    paddingVertical: dh * 0.01,
    paddingHorizontal: dw * 0.03,
  },
  fullCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: dw * 0.025,
    paddingVertical: dh * 0.015,
    marginVertical: dh * 0.01,
  },
  bottomCard: {
    flex: 1,
    borderRadius: dw * 0.025,
    paddingVertical: dh * 0.012,
    alignItems: "center",
  },
  label: {
    fontSize: dw * 0.032,
    textAlign: "flex-start",
  },
  subLabel: {
    fontSize: dw * 0.034,
    marginTop: dh * 0.004,
  },
  value: {
    fontSize: dw * 0.036,
    padding: 4,
    marginTop: dh * 0.003,
    textAlign: "center",
  },
  iconBackground: {
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconTextContainer: {
    marginLeft: dw * 0.03,
  },
  rowAlign: {
    flexDirection: "row",
    alignItems: "center",
  },
});
