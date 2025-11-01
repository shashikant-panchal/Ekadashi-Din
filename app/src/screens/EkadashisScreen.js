import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import {
  AppYellow,
  DarkBlue,
  GRADIENT_END,
  GRADIENT_START,
  LightBlue,
} from "../constants/Colors";
import { useEkadashiList, useNextEkadashi } from "../hooks/useEkadashi";

// --- Dimension Utilities ---
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);
// ----------------------------------------

// --- Component for a single Month Card ---
const MonthCard = ({ month, ekadashis, isUpcoming, onPress }) => {
  const cardStyle = isUpcoming ? styles.monthCardUpcoming : styles.monthCard;
  const textStyle = isUpcoming ? styles.monthTextUpcoming : styles.monthText;

  return (
    <TouchableOpacity style={cardStyle} onPress={onPress}>
      <Text style={textStyle}>{month}</Text>
      <View style={styles.ekadashiCountContainer}>
        <Feather name="clock" size={relativeWidth(3.5)} color="#6c757d" />
        <Text style={styles.ekadashiCountText}>{ekadashis} Ekadashis</Text>
      </View>
      {isUpcoming && (
        <View style={styles.upcomingBadge}>
          <Text style={styles.upcomingBadgeText}>Upcoming</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// --- Component for the Next Ekadashi Card ---
const NextEkadashiCard = ({ title, date, details }) => (
  <LinearGradient
    colors={[GRADIENT_START, GRADIENT_END]}
    start={{ x: 0, y: 0 }} // Top-left
    end={{ x: 1, y: 1 }} // Bottom-right
    style={styles.nextEkadashiCard}
  >
    <View style={styles.moonPlaceholder}>
      <Ionicons name="moon" size={relativeWidth(10)} color="#FFC107" />
    </View>
    <View style={styles.nextEkadashiTextContainer}>
      <Text style={styles.nextEkadashiTitle}>{title}</Text>
      <Text style={styles.nextEkadashiDate}>{date}</Text>
      <Text style={styles.nextEkadashiDetails}>{details}</Text>
    </View>
  </LinearGradient>
);

const EkadashiScreen = ({ navigation }) => {
  const currentYear = moment().year();
  const { ekadashiList, loading: listLoading, error: listError } = useEkadashiList(currentYear);
  const { nextEkadashi, loading: nextLoading } = useNextEkadashi();

  const handleMonthPress = (month) => {
    // Example navigation logic: navigate back to the calendar screen
    // and set the view to the selected month.
    // navigation.navigate('Calendar', { month: month });
    console.log(`Navigating to ${month} calendar view`);
  };

  // Group ekadashis by month
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

  // Get month data with real counts
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

  // Calculate totals
  const totalEkadashis = ekadashiList ? ekadashiList.length : 0;
  const today = moment();
  const remainingEkadashis = ekadashiList 
    ? ekadashiList.filter(e => {
        const date = moment(e.date || e.ekadashi_date);
        return date.isAfter(today, 'day') || date.isSame(today, 'day');
      }).length
    : 0;

  // Format next ekadashi data
  const getNextEkadashiData = () => {
    if (!nextEkadashi) return null;
    
    const date = moment(nextEkadashi.date || nextEkadashi.ekadashi_date);
    const month = date.format('MMM');
    const day = date.format('D');
    const year = date.format('YYYY');
    
    // Get Hindu month name if available, otherwise use English month
    const hinduMonth = nextEkadashi.month || month;
    
    return {
      title: nextEkadashi.name || nextEkadashi.ekadashi_name || "Next Ekadashi",
      date: `${day} ${month} ${year} • ${hinduMonth}`,
      details: nextEkadashi.significance || nextEkadashi.description || "A sacred day for fasting and devotion."
    };
  };

  const monthData = getMonthData();
  const nextEkadashiData = getNextEkadashiData();

  if (listLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={DarkBlue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* --- Title Header --- */}
        <View style={styles.screenHeader}>
          <Text style={styles.mainTitle}>Ekadashi Calendar {currentYear}</Text>
          <Text style={styles.subtitle}>
            Complete spiritual calendar for the year
          </Text>
          <View style={styles.subtitleUnderline} />
        </View>

        {/* --- Summary Cards --- */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCardTotal}>
            <Text style={styles.summaryCount}>{totalEkadashis}</Text>
            <Text style={styles.summaryLabel}>TOTAL EKADASHIS</Text>
          </View>
          <View style={styles.summaryCardRemaining}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="star" size={relativeWidth(5)} color={AppYellow} />
              <Text style={styles.summaryCountRemaining}>{remainingEkadashis}</Text>
            </View>
            <Text style={[styles.summaryLabel, { color: AppYellow }]}>
              REMAINING
            </Text>
          </View>
        </View>

        {/* --- Browse by Month Section --- */}
        <Text style={styles.sectionTitle}>Browse by Month</Text>

        <View style={styles.monthGrid}>
          {monthData.map((item, index) => (
            <MonthCard
              key={item.month}
              month={item.month}
              ekadashis={item.ekadashis}
              isUpcoming={item.isUpcoming}
              onPress={() => handleMonthPress(item.month)}
            />
          ))}
        </View>

        {/* --- Next Ekadashi Section --- */}
        {nextEkadashiData && (
          <>
            <Text style={styles.sectionTitle}>Next Ekadashi</Text>
            <NextEkadashiCard
              title={nextEkadashiData.title}
              date={nextEkadashiData.date}
              details={nextEkadashiData.details}
            />
          </>
        )}
        
        {listError && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#dc3545', fontSize: 14 }}>{listError}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollViewContent: {
    paddingHorizontal: relativeWidth(4),
    paddingBottom: relativeHeight(5),
  },

  // --- Header/Title Styles ---
  screenHeader: {
    alignItems: "center",
    paddingVertical: relativeHeight(3),
  },
  mainTitle: {
    fontSize: relativeWidth(6),
    fontWeight: "700",
    color: DarkBlue, // Dark blue text
  },
  subtitle: {
    fontSize: relativeWidth(3.5),
    color: LightBlue,
    marginTop: relativeHeight(0.5),
  },
  subtitleUnderline: {
    width: relativeWidth(15),
    height: relativeHeight(0.3),
    backgroundColor: "#2C3E50",
    marginTop: relativeHeight(1),
  },

  // --- Summary Cards ---
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: relativeHeight(3),
  },
  summaryCardTotal: {
    width: "48%",
    backgroundColor: "#E9ECF0", // Light gray/blue
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    alignItems: "center",
    justifyContent: "center",
  },
  summaryCardRemaining: {
    width: "48%",
    backgroundColor: "#FFFBEA", // Light yellow
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FEE085",
  },
  summaryCount: {
    fontSize: relativeWidth(8),
    fontWeight: "700",
    color: DarkBlue,
  },
  summaryCountRemaining: {
    fontSize: relativeWidth(5),
    fontWeight: "700",
    color: AppYellow,
    marginTop: relativeHeight(0.5),
  },
  summaryLabel: {
    fontSize: relativeWidth(3),
    fontWeight: "500",
    color: DarkBlue,
    marginTop: relativeHeight(0.5),
  },

  // --- Browse by Month Grid ---
  sectionTitle: {
    fontSize: relativeWidth(5),
    fontWeight: "600",
    color: "#212529",
    marginBottom: relativeHeight(1.5),
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: relativeHeight(3),
  },
  monthCard: {
    width: "48%", // Allows two columns with a small gap
    backgroundColor: "#fff",
    borderRadius: relativeWidth(2),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(1.5),
    borderWidth: 1,
    borderColor: "#eee",
  },
  monthCardUpcoming: {
    width: "48%",
    backgroundColor: "#E6F0FF", // Light blue for upcoming
    borderRadius: relativeWidth(2),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(1.5),
    borderWidth: 1,
    borderColor: "#B3CFFC",
    position: "relative",
  },
  monthText: {
    fontSize: relativeWidth(4.2),
    fontWeight: "600",
    color: "#212529",
  },
  monthTextUpcoming: {
    fontSize: relativeWidth(4.2),
    fontWeight: "600",
    color: "#2C3E50",
  },
  ekadashiCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: relativeHeight(0.5),
  },
  ekadashiCountText: {
    fontSize: relativeWidth(3.5),
    color: "#6c757d",
    marginLeft: relativeWidth(1.5),
  },
  upcomingBadge: {
    position: "absolute",
    top: relativeWidth(3),
    right: relativeWidth(3),
    backgroundColor: "#fff",
    borderRadius: relativeWidth(1),
    paddingHorizontal: relativeWidth(2),
    paddingVertical: relativeHeight(0.3),
    borderWidth: 1,
    borderColor: "#B3CFFC",
  },
  upcomingBadgeText: {
    fontSize: relativeWidth(2.8),
    fontWeight: "600",
    color: "#2C3E50",
  },

  // --- Next Ekadashi Card ---
  nextEkadashiCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    borderWidth: 1,
    borderColor: "#eee",
  },
  moonPlaceholder: {
    width: relativeWidth(15),
    height: relativeWidth(15),
    borderRadius: relativeWidth(7.5),
    backgroundColor: "#E9ECF0",
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
    color: DarkBlue,
  },
  nextEkadashiDate: {
    fontSize: relativeWidth(3.5),
    color: LightBlue,
    marginVertical: relativeHeight(0.3),
  },
  nextEkadashiDetails: {
    fontSize: relativeWidth(3.5),
    color: "black",
  },
});

export default EkadashiScreen;
