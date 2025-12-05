import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useEkadashiList, useNextEkadashi } from "../hooks/useEkadashi";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);

const EkadashiScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const currentYear = moment().year();
  const { ekadashiList, loading: listLoading, error: listError } = useEkadashiList(currentYear);
  const { nextEkadashi, loading: nextLoading } = useNextEkadashi();

  const handleMonthPress = (month, index) => {
    const selectedMonth = moment().month(index).year(currentYear);
    navigation.navigate('CalendarMonth', {
      month: selectedMonth.format('YYYY-MM'),
      monthName: month
    });
  };

  const getEkadashisByMonth = () => {
    if (!ekadashiList || ekadashiList.length === 0) return {};

    const grouped = {};
    ekadashiList.forEach((ekadashi) => {
      const date = moment(ekadashi.date || ekadashi.ekadashi_date);
      const monthName = date.format('MMMM');

      if (!grouped[monthName]) {
        grouped[monthName] = [];
      }
      grouped[monthName].push(ekadashi);
    });

    return grouped;
  };


  const getMonthData = () => {
    const grouped = getEkadashisByMonth();
    const months = moment.months();
    const today = moment();

    return months.map((month, index) => {
      const monthEkadashis = grouped[month] || [];
      const monthDate = moment().month(index);
      const isUpcoming = monthDate.isAfter(today, 'month') || (monthDate.month() === today.month() && monthDate.year() === today.year());

      return {
        month,
        ekadashis: monthEkadashis.length,
        isUpcoming,
        isCurrent: monthDate.month() === today.month() && monthDate.year() === today.year()
      };
    });
  };

  const totalEkadashis = ekadashiList ? ekadashiList.length : 0;
  const today = moment();
  const remainingEkadashis = ekadashiList
    ? ekadashiList.filter(e => {
      const date = moment(e.date || e.ekadashi_date);
      return date.isAfter(today, 'day');
    }).length
    : 0;

  const getNextEkadashiData = () => {
    if (!nextEkadashi) return null;

    const date = moment(nextEkadashi.date || nextEkadashi.ekadashi_date);
    const month = date.format('MMM');
    const day = date.format('D');
    const year = date.format('YYYY');

    const hinduMonth = nextEkadashi.month || month;

    return {
      title: nextEkadashi.name || nextEkadashi.ekadashi_name || "Next Ekadashi",
      date: `${day} ${month} ${year} • ${hinduMonth}`,
      details: nextEkadashi.significance || nextEkadashi.description || "A sacred day for fasting and devotion."
    };
  };

  const monthData = getMonthData();
  const nextEkadashiData = getNextEkadashiData();

  const MonthCard = ({ month, ekadashis, isUpcoming, onPress }) => {
    const cardStyle = isUpcoming
      ? [styles.monthCardUpcoming, { backgroundColor: colors.lightBlueBg, borderColor: isDark ? colors.border : '#B3CFFC' }]
      : [styles.monthCard, { backgroundColor: colors.card, borderColor: colors.border }];
    const textStyle = isUpcoming
      ? [styles.monthTextUpcoming, { color: colors.foreground }]
      : [styles.monthText, { color: colors.foreground }];

    return (
      <TouchableOpacity style={cardStyle} onPress={onPress}>
        <Text style={textStyle}>{month}</Text>
        <View style={styles.ekadashiCountContainer}>
          <Feather name="clock" size={relativeWidth(3.5)} color={colors.mutedForeground} />
          <Text style={[styles.ekadashiCountText, { color: colors.mutedForeground }]}>{ekadashis} Ekadashis</Text>
        </View>
        {isUpcoming && (
          <View style={[styles.upcomingBadge, { backgroundColor: colors.card, borderColor: isDark ? colors.border : '#B3CFFC' }]}>
            <Text style={[styles.upcomingBadgeText, { color: colors.foreground }]}>Upcoming</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const NextEkadashiCard = ({ title, date, details }) => (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('DayDetails')}>
      <LinearGradient
        colors={isDark ? [colors.card, colors.muted] : [colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.nextEkadashiCard, { borderColor: colors.border }]}
      >
        <View style={[styles.moonPlaceholder, { backgroundColor: colors.lightBlueBg }]}>
          <Ionicons name="moon" size={relativeWidth(10)} color={colors.secondary} />
        </View>
        <View style={styles.nextEkadashiTextContainer}>
          <Text style={[styles.nextEkadashiTitle, { color: colors.foreground }]}>{title}</Text>
          <Text style={[styles.nextEkadashiDate, { color: colors.mutedForeground }]}>{date}</Text>
          <Text style={[styles.nextEkadashiDetails, { color: colors.foreground }]}>{details}</Text>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );

  if (listLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.screenHeader}>
          <Text style={[styles.mainTitle, { color: colors.foreground }]}>Ekadashi Calendar {currentYear}</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Complete spiritual calendar for the year
          </Text>
          <View style={[styles.subtitleUnderline, { backgroundColor: colors.primary }]} />
        </View>

        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCardTotal, { backgroundColor: colors.lightBlueBg }]}>
            <Text style={[styles.summaryCount, { color: colors.foreground }]}>{totalEkadashis}</Text>
            <Text style={[styles.summaryLabel, { color: colors.foreground }]}>TOTAL EKADASHIS</Text>
          </View>
          <View style={[styles.summaryCardRemaining, { backgroundColor: isDark ? colors.muted : '#FFFBEA', borderColor: isDark ? colors.secondary : '#FEE085' }]}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="star" size={relativeWidth(5)} color={colors.secondary} />
              <Text style={[styles.summaryCountRemaining, { color: colors.secondary }]}>{remainingEkadashis}</Text>
            </View>
            <Text style={[styles.summaryLabel, { color: colors.secondary }]}>
              REMAINING
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Browse by Month</Text>

        <View style={styles.monthGrid}>
          {monthData.map((item, index) => (
            <MonthCard
              key={item.month}
              month={item.month}
              ekadashis={item.ekadashis}
              isUpcoming={item.isUpcoming}
              onPress={() => handleMonthPress(item.month, index)}
            />
          ))}
        </View>

        {nextEkadashiData && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Next Ekadashi</Text>
            <NextEkadashiCard
              title={nextEkadashiData.title}
              date={nextEkadashiData.date}
              details={nextEkadashiData.details}
            />
          </>
        )}

        {listError && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: colors.destructive, fontSize: 14 }}>{listError}</Text>
          </View>
        )}
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
  screenHeader: {
    alignItems: "center",
    paddingVertical: relativeHeight(3),
  },
  mainTitle: {
    fontSize: relativeWidth(6),
    fontWeight: "700",
  },
  subtitle: {
    fontSize: relativeWidth(3.5),
    marginTop: relativeHeight(0.5),
  },
  subtitleUnderline: {
    width: relativeWidth(15),
    height: relativeHeight(0.3),
    marginTop: relativeHeight(1),
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: relativeHeight(3),
  },
  summaryCardTotal: {
    width: "48%",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCardRemaining: {
    width: "48%",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  summaryCount: {
    fontSize: relativeWidth(8),
    fontWeight: "700",
  },
  summaryCountRemaining: {
    fontSize: relativeWidth(5),
    fontWeight: "700",
    marginTop: relativeHeight(0.5),
  },
  summaryLabel: {
    fontSize: relativeWidth(3),
    fontWeight: "500",
    marginTop: relativeHeight(0.5),
  },
  sectionTitle: {
    fontSize: relativeWidth(5),
    fontWeight: "600",
    marginBottom: relativeHeight(1.5),
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: relativeHeight(3),
  },
  monthCard: {
    width: "48%",
    borderRadius: relativeWidth(2),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(1.5),
    borderWidth: 1,
  },
  monthCardUpcoming: {
    width: "48%",
    borderRadius: relativeWidth(2),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(1.5),
    borderWidth: 1,
    position: "relative",
  },
  monthText: {
    fontSize: relativeWidth(4.2),
    fontWeight: "600",
  },
  monthTextUpcoming: {
    fontSize: relativeWidth(4.2),
    fontWeight: "600",
  },
  ekadashiCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: relativeHeight(0.5),
  },
  ekadashiCountText: {
    fontSize: relativeWidth(3.5),
    marginLeft: relativeWidth(1.5),
  },
  upcomingBadge: {
    position: "absolute",
    top: relativeWidth(3),
    right: relativeWidth(3),
    borderRadius: relativeWidth(1),
    paddingHorizontal: relativeWidth(2),
    paddingVertical: relativeHeight(0.3),
    borderWidth: 1,
  },
  upcomingBadgeText: {
    fontSize: relativeWidth(2.8),
    fontWeight: "600",
  },
  nextEkadashiCard: {
    flexDirection: "row",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    borderWidth: 1,
  },
  moonPlaceholder: {
    width: relativeWidth(15),
    height: relativeWidth(15),
    borderRadius: relativeWidth(7.5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: relativeWidth(4),
  },
  nextEkadashiTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nextEkadashiTitle: {
    fontSize: relativeWidth(4.5),
    fontWeight: "600",
  },
  nextEkadashiDate: {
    fontSize: relativeWidth(3.5),
    marginVertical: relativeHeight(0.3),
  },
  nextEkadashiDetails: {
    fontSize: relativeWidth(3.5),
  },
});

export default EkadashiScreen;
