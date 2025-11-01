import { Feather, Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar"; // For device calendar access (functionality only)
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment"; // Crucial for dynamic month manipulation
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DarkBlue, LightBlue } from "../constants/Colors";
import { useEkadashiList } from "../hooks/useEkadashi";

// --- Dimension Utilities ---
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);
// ----------------------------------------

// --- Static Day Names ---
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --- Helper Functions for Calendar Logic ---

/**
 * Generates the 2D array of date strings for the given month/year.
 * @param {moment.Moment} monthMoment The moment object representing the month to display.
 * @returns {Array<Array<string>>} 2D array of dates.
 */
const generateCalendarGrid = (monthMoment) => {
  const startOfMonth = monthMoment.clone().startOf("month");
  const endOfMonth = monthMoment.clone().endOf("month");
  const today = moment().format("YYYY-MM-DD");

  // Find the start of the first week (Sun) that contains the startOfMonth
  const startDay = startOfMonth.clone().startOf("week");

  const calendarGrid = [];
  let day = startDay.clone();

  while (
    day.isBefore(endOfMonth) ||
    day.isSame(endOfMonth) ||
    calendarGrid.length < 6
  ) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const isCurrentMonth = day.month() === monthMoment.month();
      const dateString = day.date().toString();

      // We only include the day number if it's in the current month or for padding
      week.push(isCurrentMonth ? dateString : "");
      day.add(1, "day");
    }
    calendarGrid.push(week);

    // Safety break to prevent infinite loop, max 6 weeks is typical
    if (
      calendarGrid.length >= 6 &&
      day.isAfter(endOfMonth.clone().endOf("week"))
    )
      break;
  }

  return calendarGrid;
};

// Helper to get paksha display name
const getPakshaDisplay = (paksha) => {
  if (!paksha) return "";
  return paksha === "Shukla" ? "Shukla" : paksha === "Krishna" ? "Krishna" : paksha;
};

// Helper function to render a single date cell
const DateCell = ({ date, isEkadashi, isToday }) => {
  if (!date) {
    return <View style={styles.dateCell} />;
  }

  const cellStyle = [styles.dateCellText];
  const containerStyle = [styles.dateCell];

  if (isToday) {
    containerStyle.push(styles.todayBackground);
    cellStyle.push(styles.todayText);
  }

  if (isEkadashi) {
    containerStyle.push(styles.ekadashiColor);
  }

  const ekadashiIcon = isEkadashi ? (
    <Text style={styles.ekadashiIcon}>{"😊"}</Text>
  ) : null;

  return (
    <TouchableOpacity style={containerStyle} disabled={!date}>
      {ekadashiIcon}
      <Text style={cellStyle}>{date}</Text>
    </TouchableOpacity>
  );
};

const CalendarScreen = () => {
  // State to track the currently viewed month
  const [currentDate, setCurrentDate] = useState(moment());
  
  // Fetch ekadashi list for the current year
  const currentYear = currentDate.year();
  const { ekadashiList, loading, error } = useEkadashiList(currentYear);

  // Get ekadashi dates for the current month
  const getEkadashiDates = (monthMoment) => {
    if (!ekadashiList || ekadashiList.length === 0) return [];
    
    return ekadashiList
      .filter(ekadashi => {
        const ekadashiDate = moment(ekadashi.date || ekadashi.ekadashi_date);
        return ekadashiDate.isSame(monthMoment, 'month') && 
               ekadashiDate.isSame(monthMoment, 'year');
      })
      .map(ekadashi => {
        const ekadashiDate = moment(ekadashi.date || ekadashi.ekadashi_date);
        return ekadashiDate.format("D");
      });
  };

  // Get ekadashi details for the current month (for observances section)
  const getMonthEkadashis = () => {
    if (!ekadashiList || ekadashiList.length === 0) return [];
    
    return ekadashiList
      .filter(ekadashi => {
        const ekadashiDate = moment(ekadashi.date || ekadashi.ekadashi_date);
        return ekadashiDate.isSame(currentDate, 'month') && 
               ekadashiDate.isSame(currentDate, 'year');
      })
      .map(ekadashi => ({
        name: ekadashi.name || ekadashi.ekadashi_name || "Ekadashi",
        date: moment(ekadashi.date || ekadashi.ekadashi_date),
        paksha: ekadashi.paksha || getPakshaDisplay(ekadashi.paksha) || "",
        moonPhase: ekadashi.paksha === "Shukla" ? "waxing" : "waning"
      }))
      .sort((a, b) => a.date.diff(b.date));
  };

  // Recalculate the grid and special dates whenever the month changes
  const calendarData = useMemo(
    () => generateCalendarGrid(currentDate),
    [currentDate]
  );
  
  const ekadashiDates = useMemo(
    () => getEkadashiDates(currentDate),
    [currentDate, ekadashiList]
  );
  
  const monthEkadashis = useMemo(
    () => getMonthEkadashis(),
    [currentDate, ekadashiList]
  );
  
  const todayDate = moment().date().toString(); // Day number of today

  // --- Month Navigation Handlers ---
  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => prevDate.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => prevDate.clone().add(1, "month"));
  };
  // ------------------------------------

  // --- (Placeholder for expo-calendar device event fetching) ---
  const fetchEkadashiEvents = async () => {
    // ... (The expo-calendar permission and fetching logic from the previous response)
    if (Platform.OS === "android") {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Need calendar permissions to fetch device events."
        );
        return;
      }
    }
    Alert.alert(
      "Expo Calendar",
      "Fetching device calendar events for the current month now!"
    );
  };
  // ----------------------------------------------------------------

  // Helper component for Observance Items
  const renderObservanceItem = (ekadashi) => {
    const formattedDate = ekadashi.date.format('ddd, MMM D');
    const phase = ekadashi.paksha || "";
    
    return (
      <View key={ekadashi.date.format('YYYY-MM-DD')} style={styles.observanceItem}>
        <View style={styles.observanceImagePlaceholder}>
          <Text style={{ fontSize: relativeWidth(5) }}>
            {ekadashi.moonPhase === "waxing" ? "🌕" : "🌑"}
          </Text>
        </View>
        <View style={styles.observanceTextContainer}>
          <Text style={styles.observanceTitleText}>{ekadashi.name}</Text>
          <Text style={styles.observanceDateText}>{formattedDate}</Text>
        </View>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseBadgeText}>{phase}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header: Month Name and Navigation --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Ionicons name="chevron-back" size={relativeWidth(6)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentDate.format("MMMM YYYY")}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons
            name="chevron-forward"
            size={relativeWidth(6)}
            color="#000"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <LinearGradient
          colors={["rgb(233, 237, 241)", "rgb(244, 245, 240)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ekadashiSummaryCard}
        >
          <View>
            <Text style={styles.summaryTitle}>
              {loading ? "Loading..." : `${monthEkadashis.length} Ekadashi${monthEkadashis.length !== 1 ? 's' : ''} this month`}
            </Text>
            <Text style={styles.summarySubtitle}>
              Tap on dates to view details
            </Text>
          </View>
          <TouchableOpacity
            style={styles.calendarIconContainer}
            onPress={fetchEkadashiEvents}
          >
            <Feather name="calendar" size={relativeWidth(6)} color="#444" />
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.calendarGrid}>
          <View style={styles.daysRow}>
            {DAYS.map((day, index) => (
              <Text key={index} style={styles.dayNameText}>
                {day}
              </Text>
            ))}
          </View>

          {calendarData.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.datesRow}>
              {week.map((date, dateIndex) => (
                <DateCell
                  key={dateIndex}
                  date={date}
                  isToday={
                    date === todayDate && currentDate.isSame(moment(), "month")
                  }
                  isEkadashi={ekadashiDates.includes(date)}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.observancesSection}>
          <View style={styles.observancesHeader}>
            <Feather
              name="star"
              size={relativeWidth(5)}
              color="#FFC107"
              style={styles.starIcon}
            />
            <Text style={styles.observancesTitle}>Ekadashi Observances</Text>
          </View>
          {loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={DarkBlue} />
            </View>
          ) : monthEkadashis.length > 0 ? (
            monthEkadashis.map(ekadashi => renderObservanceItem(ekadashi))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: LightBlue, fontSize: 14 }}>No Ekadashis this month</Text>
            </View>
          )}
          {error && (
            <View style={{ padding: 10, alignItems: 'center' }}>
              <Text style={{ color: '#dc3545', fontSize: 12 }}>{error}</Text>
            </View>
          )}
        </View>

        {/* --- Legend --- */}
        <View style={styles.legendContainer}>
          <View>
            <Text
              style={{
                fontSize: relativeWidth(4),
                fontWeight: "500",
                color: DarkBlue,
              }}
            >
              Legend
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColorBox, styles.todayColor]} />
              <Text style={styles.legendText}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColorBox, styles.ekadashiColor]} />
              <Text style={styles.legendText}>Ekadashi</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet (Unchanged from previous versions) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollViewContent: {
    paddingHorizontal: relativeWidth(4),
    paddingBottom: relativeHeight(5),
  },

  // Header Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: relativeWidth(4),
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: relativeWidth(5.5),
    fontWeight: "600",
    color: "#000",
  },

  // Ekadashi Summary Card Styles
  ekadashiSummaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    marginVertical: relativeHeight(2),
  },
  summaryTitle: {
    fontSize: relativeWidth(4.5),
    fontWeight: "600",
    color: "#212529",
  },
  summarySubtitle: {
    fontSize: relativeWidth(3.5),
    color: "#6c757d",
    marginTop: relativeHeight(0.5),
  },
  calendarIconContainer: {
    padding: relativeWidth(2),
    backgroundColor: "#fff",
    borderRadius: relativeWidth(2),
  },

  // Calendar Grid Styles
  calendarGrid: {
    backgroundColor: "#fff",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(2),
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: relativeHeight(1.5),
  },
  dayNameText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontSize: relativeWidth(3.8),
    fontWeight: "500",
    color: LightBlue,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: relativeHeight(1.5),
  },
  dateCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dateCellText: {
    fontSize: relativeWidth(4),
    fontWeight: "400",
    color: "#212529",
  },

  // Styles for Date Highlighting
  ekadashiIcon: {
    position: "absolute",
    top: relativeWidth(-0.5),
    right: relativeWidth(-0.5),
    fontSize: relativeWidth(3),
    zIndex: 1,
  },
  todayBackground: {
    backgroundColor: "#2C3E50",
    borderRadius: 15,
    // marginHorizontal: 5
  },
  todayText: {
    color: "#fff",
    fontWeight: "600",
  },

  // Observances Section Styles
  observancesSection: {
    backgroundColor: "#fff",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    marginBottom: relativeHeight(2),
    marginTop: relativeHeight(1),
  },
  observancesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: relativeHeight(2),
  },
  starIcon: {
    marginRight: relativeWidth(2),
  },
  observancesTitle: {
    fontSize: relativeWidth(4.5),
    fontWeight: "600",
    color: DarkBlue,
  },

  // Observance Item Styles
  observanceItem: {
    flexDirection: "row",
    alignItems: "center",
    // paddingVertical: relativeHeight(1.5),
    // borderBottomWidth: 1,
    // borderBottomColor: '#f1f3f5',
    backgroundColor: "#F9FBFD",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    // marginVertical: 10
  },
  observanceImagePlaceholder: {
    width: relativeWidth(10),
    height: relativeWidth(10),
    borderRadius: relativeWidth(5),
    backgroundColor: "#f1f3f5",
    marginRight: relativeWidth(3),
    justifyContent: "center",
    alignItems: "center",
  },
  observanceTextContainer: {
    flex: 1,
  },
  observanceTitleText: {
    fontSize: relativeWidth(4),
    fontWeight: "500",
    color: "#000",
  },
  observanceDateText: {
    fontSize: relativeWidth(3.5),
    color: "#6c757d",
  },
  phaseBadge: {
    // backgroundColor: '#F1F3F5',
    borderWidth: 0.5,
    borderColor: "#ced4da",
    borderRadius: 10,
    paddingHorizontal: relativeWidth(3),
    paddingVertical: relativeWidth(1),
  },
  phaseBadgeText: {
    fontSize: relativeWidth(3.2),
    fontWeight: "500",
    color: "#495057",
  },

  // Legend Styles
  legendContainer: {
    justifyContent: "flex-start",
    padding: relativeWidth(4),
    // paddingHorizontal: relativeWidth(5),
    // paddingVertical: relativeHeight(3),
    backgroundColor: "#fff",
    borderRadius: relativeWidth(3),
  },
  legendText: {
    fontSize: relativeWidth(3.5),
    color: LightBlue,
    fontWeight: "500",

    marginRight: relativeWidth(4),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: relativeWidth(4),
  },
  legendColorBox: {
    width: relativeWidth(3.5),
    height: relativeWidth(3.5),
    borderRadius: relativeWidth(0.5),
    marginRight: relativeWidth(1.5),
  },
  todayColor: {
    backgroundColor: "#2C3E50",
  },
  ekadashiColor: {
    backgroundColor: "#FEF9D9",
    // borderColor: '#FFC107',
    borderRadius: 15,
  },
});

export default CalendarScreen;
