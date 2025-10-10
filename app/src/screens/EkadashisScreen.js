import { Feather, Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Dimension Utilities ---
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);
// ----------------------------------------

// --- Static Data for the Month Grid ---
const YEAR_DATA = [
  { month: 'January', ekadashis: 2, isUpcoming: false },
  { month: 'February', ekadashis: 2, isUpcoming: false },
  { month: 'March', ekadashis: 2, isUpcoming: false },
  { month: 'April', ekadashis: 2, isUpcoming: false },
  { month: 'May', ekadashis: 2, isUpcoming: false },
  { month: 'June', ekadashis: 2, isUpcoming: false },
  { month: 'July', ekadashis: 2, isUpcoming: false },
  { month: 'August', ekadashis: 2, isUpcoming: false },
  { month: 'September', ekadashis: 2, isUpcoming: false },
  // Assuming current month is October based on the previous screen
  { month: 'October', ekadashis: 2, isUpcoming: true, isCurrent: true },
  { month: 'November', ekadashis: 2, isUpcoming: true },
  { month: 'December', ekadashis: 2, isUpcoming: true },
];

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
  <View style={styles.nextEkadashiCard}>
    <View style={styles.moonPlaceholder}>
      {/* Placeholder for the moon image/icon */}
      <Ionicons name="moon" size={relativeWidth(10)} color="#212529" />
    </View>
    <View style={styles.nextEkadashiTextContainer}>
      <Text style={styles.nextEkadashiTitle}>{title}</Text>
      <Text style={styles.nextEkadashiDate}>{date}</Text>
      <Text style={styles.nextEkadashiDetails}>{details}</Text>
    </View>
  </View>
);


const EkadashiScreen = ({ navigation }) => {

  const handleMonthPress = (month) => {
    // Example navigation logic: navigate back to the calendar screen
    // and set the view to the selected month.
    // navigation.navigate('Calendar', { month: month });
    console.log(`Navigating to ${month} calendar view`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* --- Title Header --- */}
        <View style={styles.screenHeader}>
          <Text style={styles.mainTitle}>Ekadashi Calendar 2025</Text>
          <Text style={styles.subtitle}>Complete spiritual calendar for the year</Text>
          <View style={styles.subtitleUnderline} />
        </View>

        {/* --- Summary Cards --- */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCardTotal}>
            <Text style={styles.summaryCount}>24</Text>
            <Text style={styles.summaryLabel}>TOTAL EKADASHIS</Text>
          </View>
          <View style={styles.summaryCardRemaining}>
            <Feather name="star" size={relativeWidth(5)} color="#F1C40F" />
            <Text style={styles.summaryCountRemaining}>5</Text>
            <Text style={styles.summaryLabel}>REMAINING</Text>
          </View>
        </View>

        {/* --- Browse by Month Section --- */}
        <Text style={styles.sectionTitle}>Browse by Month</Text>

        <View style={styles.monthGrid}>
          {YEAR_DATA.map((item, index) => (
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
        <Text style={styles.sectionTitle}>Next Ekadashi</Text>

        <NextEkadashiCard
          title="Rama Ekadashi"
          date="17 Oct 2025 • Ashwin"
          details="Sacred to Lord Rama, grants victory and righteousness."
        />

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    paddingHorizontal: relativeWidth(4),
    paddingBottom: relativeHeight(5),
  },

  // --- Header/Title Styles ---
  screenHeader: {
    alignItems: 'center',
    paddingVertical: relativeHeight(3),
  },
  mainTitle: {
    fontSize: relativeWidth(6),
    fontWeight: '700',
    color: '#2C3E50', // Dark blue text
  },
  subtitle: {
    fontSize: relativeWidth(3.5),
    color: '#6c757d',
    marginTop: relativeHeight(0.5),
  },
  subtitleUnderline: {
    width: relativeWidth(15),
    height: relativeHeight(0.3),
    backgroundColor: '#2C3E50',
    marginTop: relativeHeight(1),
  },

  // --- Summary Cards ---
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: relativeHeight(3),
  },
  summaryCardTotal: {
    width: '48%',
    backgroundColor: '#E9ECF0', // Light gray/blue
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCardRemaining: {
    width: '48%',
    backgroundColor: '#FFFBEA', // Light yellow
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE085',
  },
  summaryCount: {
    fontSize: relativeWidth(8),
    fontWeight: '700',
    color: '#2C3E50',
  },
  summaryCountRemaining: {
    fontSize: relativeWidth(5),
    fontWeight: '700',
    color: '#F1C40F',
    marginTop: relativeHeight(0.5),
  },
  summaryLabel: {
    fontSize: relativeWidth(3),
    fontWeight: '500',
    color: '#6c757d',
    marginTop: relativeHeight(0.5),
  },

  // --- Browse by Month Grid ---
  sectionTitle: {
    fontSize: relativeWidth(5),
    fontWeight: '600',
    color: '#212529',
    marginBottom: relativeHeight(1.5),
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: relativeHeight(3),
  },
  monthCard: {
    width: '48%', // Allows two columns with a small gap
    backgroundColor: '#fff',
    borderRadius: relativeWidth(2),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(1.5),
    borderWidth: 1,
    borderColor: '#eee',
  },
  monthCardUpcoming: {
    width: '48%',
    backgroundColor: '#E6F0FF', // Light blue for upcoming
    borderRadius: relativeWidth(2),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(1.5),
    borderWidth: 1,
    borderColor: '#B3CFFC',
    position: 'relative',
  },
  monthText: {
    fontSize: relativeWidth(4.2),
    fontWeight: '600',
    color: '#212529',
  },
  monthTextUpcoming: {
    fontSize: relativeWidth(4.2),
    fontWeight: '600',
    color: '#2C3E50',
  },
  ekadashiCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: relativeHeight(0.5),
  },
  ekadashiCountText: {
    fontSize: relativeWidth(3.5),
    color: '#6c757d',
    marginLeft: relativeWidth(1.5),
  },
  upcomingBadge: {
    position: 'absolute',
    top: relativeWidth(3),
    right: relativeWidth(3),
    backgroundColor: '#fff',
    borderRadius: relativeWidth(1),
    paddingHorizontal: relativeWidth(2),
    paddingVertical: relativeHeight(0.3),
    borderWidth: 1,
    borderColor: '#B3CFFC',
  },
  upcomingBadgeText: {
    fontSize: relativeWidth(2.8),
    fontWeight: '600',
    color: '#2C3E50',
  },

  // --- Next Ekadashi Card ---
  nextEkadashiCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    borderWidth: 1,
    borderColor: '#eee',
  },
  moonPlaceholder: {
    width: relativeWidth(15),
    height: relativeWidth(15),
    borderRadius: relativeWidth(7.5),
    backgroundColor: '#E9ECF0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: relativeWidth(4),
  },
  nextEkadashiTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nextEkadashiTitle: {
    fontSize: relativeWidth(4.5),
    fontWeight: '600',
    color: '#212529',
  },
  nextEkadashiDate: {
    fontSize: relativeWidth(3.5),
    color: '#6c757d',
    marginVertical: relativeHeight(0.3),
  },
  nextEkadashiDetails: {
    fontSize: relativeWidth(3.5),
    color: '#495057',
  },
});

export default EkadashiScreen;