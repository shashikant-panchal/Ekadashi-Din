import { Feather, Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useEkadashiList } from "../hooks/useEkadashi";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const generateCalendarGrid = (monthMoment) => {
  const startOfMonth = monthMoment.clone().startOf("month");
  const endOfMonth = monthMoment.clone().endOf("month");

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
      week.push(isCurrentMonth ? dateString : "");
      day.add(1, "day");
    }
    calendarGrid.push(week);

    if (
      calendarGrid.length >= 6 &&
      day.isAfter(endOfMonth.clone().endOf("week"))
    )
      break;
  }

  return calendarGrid;
};

const getPakshaDisplay = (paksha) => {
  if (!paksha) return "";
  return paksha === "Shukla" ? "Shukla" : paksha === "Krishna" ? "Krishna" : paksha;
};

const DateCell = ({ date, isEkadashi, isToday, colors, isDark }) => {
  if (!date) {
    return <View style={styles.dateCell} />;
  }

  const cellStyle = [styles.dateCellText, { color: colors.foreground }];
  const containerStyle = [styles.dateCell];

  if (isToday) {
    containerStyle.push({ backgroundColor: colors.primary });
    cellStyle.push({ color: '#fff', fontWeight: '600' });
  }

  if (isEkadashi) {
    containerStyle.push({ backgroundColor: isDark ? colors.muted : "#FEF9D9", borderRadius: 15 });
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

const CalendarScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(moment());

  const currentYear = currentDate.year();
  const { ekadashiList, loading, error } = useEkadashiList(currentYear);

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

  const todayDate = moment().date().toString();

  const goToPreviousMonth = () => {
    setCurrentDate((prevDate) => prevDate.clone().subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentDate((prevDate) => prevDate.clone().add(1, "month"));
  };

  const fetchEkadashiEvents = async () => {
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

  const renderObservanceItem = (ekadashi) => {
    const formattedDate = ekadashi.date.format('ddd, MMM D');
    const phase = ekadashi.paksha || "";

    return (
      <TouchableWithoutFeedback onPress={() => navigation.navigate('DayDetails', {
        ekadashi: {
          ...ekadashi,
          date: ekadashi.date.format('YYYY-MM-DD')
        },
        date: ekadashi.date.format('YYYY-MM-DD')
      })}>
        <View key={ekadashi.date.format('YYYY-MM-DD')} style={[styles.observanceItem, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <View style={[styles.observanceImagePlaceholder, { backgroundColor: colors.lightBlueBg }]}>
            <Text style={{ fontSize: relativeWidth(5) }}>
              {ekadashi.moonPhase === "waxing" ? "🌕" : "🌑"}
            </Text>
          </View>
          <View style={styles.observanceTextContainer}>
            <Text style={[styles.observanceTitleText, { color: colors.foreground }]}>{ekadashi.name}</Text>
            <Text style={[styles.observanceDateText, { color: colors.mutedForeground }]}>{formattedDate}</Text>
          </View>
          <View style={[styles.phaseBadge, { borderColor: colors.border }]}>
            <Text style={[styles.phaseBadgeText, { color: colors.foreground }]}>{phase}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Ionicons name="chevron-back" size={relativeWidth(6)} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {currentDate.format("MMMM YYYY")}
        </Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons
            name="chevron-forward"
            size={relativeWidth(6)}
            color={colors.foreground}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <LinearGradient
          colors={isDark ? [colors.card, colors.muted] : ["rgb(233, 237, 241)", "rgb(244, 245, 240)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ekadashiSummaryCard}
        >
          <View>
            <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
              {loading ? "Loading..." : `${monthEkadashis.length} Ekadashi${monthEkadashis.length !== 1 ? 's' : ''} this month`}
            </Text>
            <Text style={[styles.summarySubtitle, { color: colors.mutedForeground }]}>
              Tap on dates to view details
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.calendarIconContainer, { backgroundColor: colors.card }]}
            onPress={fetchEkadashiEvents}
          >
            <Feather name="calendar" size={relativeWidth(6)} color={colors.foreground} />
          </TouchableOpacity>
        </LinearGradient>

        <View style={[styles.calendarGrid, { backgroundColor: colors.card }]}>
          <View style={styles.daysRow}>
            {DAYS.map((day, index) => (
              <Text key={index} style={[styles.dayNameText, { color: colors.mutedForeground }]}>
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
                  colors={colors}
                  isDark={isDark}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={[styles.observancesSection, { backgroundColor: colors.card }]}>
          <View style={styles.observancesHeader}>
            <Feather
              name="star"
              size={relativeWidth(5)}
              color={colors.secondary}
              style={styles.starIcon}
            />
            <Text style={[styles.observancesTitle, { color: colors.foreground }]}>Ekadashi Observances</Text>
          </View>
          {loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : monthEkadashis.length > 0 ? (
            monthEkadashis.map(ekadashi => renderObservanceItem(ekadashi))
          ) : (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>No Ekadashis this month</Text>
            </View>
          )}
          {error && (
            <View style={{ padding: 10, alignItems: 'center' }}>
              <Text style={{ color: colors.destructive, fontSize: 12 }}>{error}</Text>
            </View>
          )}
        </View>

        <View style={[styles.legendContainer, { backgroundColor: colors.card }]}>
          <View>
            <Text style={{ fontSize: relativeWidth(4), fontWeight: "500", color: colors.foreground }}>
              Legend
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColorBox, { backgroundColor: colors.primary }]} />
              <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Today</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColorBox, { backgroundColor: isDark ? colors.muted : "#FEF9D9", borderRadius: relativeWidth(0.5) }]} />
              <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Ekadashi</Text>
            </View>
          </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: relativeWidth(4),
  },
  headerTitle: {
    fontSize: relativeWidth(5.5),
    fontWeight: "600",
  },
  ekadashiSummaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    marginVertical: relativeHeight(2),
  },
  summaryTitle: {
    fontSize: relativeWidth(4.5),
    fontWeight: "600",
  },
  summarySubtitle: {
    fontSize: relativeWidth(3.5),
    marginTop: relativeHeight(0.5),
  },
  calendarIconContainer: {
    padding: relativeWidth(2),
    borderRadius: relativeWidth(2),
  },
  calendarGrid: {
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
  },
  ekadashiIcon: {
    position: "absolute",
    top: relativeWidth(-0.5),
    right: relativeWidth(-0.5),
    fontSize: relativeWidth(3),
    zIndex: 1,
  },
  observancesSection: {
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
  },
  observanceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  observanceImagePlaceholder: {
    width: relativeWidth(10),
    height: relativeWidth(10),
    borderRadius: relativeWidth(5),
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
  },
  observanceDateText: {
    fontSize: relativeWidth(3.5),
  },
  phaseBadge: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: relativeWidth(3),
    paddingVertical: relativeWidth(1),
  },
  phaseBadgeText: {
    fontSize: relativeWidth(3.2),
    fontWeight: "500",
  },
  legendContainer: {
    justifyContent: "flex-start",
    padding: relativeWidth(4),
    borderRadius: relativeWidth(3),
  },
  legendText: {
    fontSize: relativeWidth(3.5),
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
});

export default CalendarScreen;
