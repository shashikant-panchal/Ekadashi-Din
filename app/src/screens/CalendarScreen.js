import { Feather, Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar'; // For device calendar access (functionality only)
import moment from 'moment'; // Crucial for dynamic month manipulation
import { useMemo, useState } from 'react';
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Dimension Utilities ---
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);
// ----------------------------------------

// --- Static Day Names ---
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// --- Helper Functions for Calendar Logic ---

/**
 * Generates the 2D array of date strings for the given month/year.
 * @param {moment.Moment} monthMoment The moment object representing the month to display.
 * @returns {Array<Array<string>>} 2D array of dates.
 */
const generateCalendarGrid = (monthMoment) => {
  const startOfMonth = monthMoment.clone().startOf('month');
  const endOfMonth = monthMoment.clone().endOf('month');
  const today = moment().format('YYYY-MM-DD');

  // Find the start of the first week (Sun) that contains the startOfMonth
  const startDay = startOfMonth.clone().startOf('week');

  const calendarGrid = [];
  let day = startDay.clone();

  while (day.isBefore(endOfMonth) || day.isSame(endOfMonth) || calendarGrid.length < 6) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const isCurrentMonth = day.month() === monthMoment.month();
      const dateString = day.date().toString();

      // We only include the day number if it's in the current month or for padding
      week.push(isCurrentMonth ? dateString : '');
      day.add(1, 'day');
    }
    calendarGrid.push(week);

    // Safety break to prevent infinite loop, max 6 weeks is typical
    if (calendarGrid.length >= 6 && day.isAfter(endOfMonth.clone().endOf('week'))) break;
  }

  return calendarGrid;
};

// --- Custom Data Logic (Replace with real API) ---
// In a real app, this would fetch from your Ekadashi database based on the month
const getEkadashiDates = (monthMoment) => {
  // For demonstration, we use fixed days (3rd and 17th) of the displayed month
  const ekadashi1 = monthMoment.clone().date(3).format('D');
  const ekadashi2 = monthMoment.clone().date(17).format('D');
  return [ekadashi1, ekadashi2];
};
// ----------------------------------------------------


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

  const ekadashiIcon = isEkadashi
    ? <Text style={styles.ekadashiIcon}>{'😊'}</Text>
    : null;

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

  // Recalculate the grid and special dates whenever the month changes
  const calendarData = useMemo(() => generateCalendarGrid(currentDate), [currentDate]);
  const ekadashiDates = useMemo(() => getEkadashiDates(currentDate), [currentDate]);
  const todayDate = moment().date().toString(); // Day number of today

  // --- Month Navigation Handlers ---
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => prevDate.clone().subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(prevDate => prevDate.clone().add(1, 'month'));
  };
  // ------------------------------------

  // --- (Placeholder for expo-calendar device event fetching) ---
  const fetchEkadashiEvents = async () => {
    // ... (The expo-calendar permission and fetching logic from the previous response)
    if (Platform.OS === 'android') {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission required", "Need calendar permissions to fetch device events.");
        return;
      }
    }
    Alert.alert("Expo Calendar", "Fetching device calendar events for the current month now!");
  };
  // ----------------------------------------------------------------


  // Helper component for Observance Items (Static Mockup)
  const renderObservanceItem = (title, date, phase, imageType) => (
    <View style={styles.observanceItem}>
      <View style={styles.observanceImagePlaceholder}>
        <Text style={{ fontSize: relativeWidth(5) }}>{imageType === 'waxing' ? '🌕' : '🌑'}</Text>
      </View>
      <View style={styles.observanceTextContainer}>
        <Text style={styles.observanceTitleText}>{title}</Text>
        <Text style={styles.observanceDateText}>{date}</Text>
      </View>
      <View style={styles.phaseBadge}>
        <Text style={styles.phaseBadgeText}>{phase}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* --- Header: Month Name and Navigation --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Ionicons name="chevron-back" size={relativeWidth(6)} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentDate.format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons name="chevron-forward" size={relativeWidth(6)} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* --- Ekadashi Summary Card --- */}
        <View style={styles.ekadashiSummaryCard}>
          <View>
            <Text style={styles.summaryTitle}>2 Ekadashis this month</Text>
            <Text style={styles.summarySubtitle}>Tap on dates to view details</Text>
          </View>
          {/* Linked to expo-calendar functionality */}
          <TouchableOpacity style={styles.calendarIconContainer} onPress={fetchEkadashiEvents}>
            <Feather name="calendar" size={relativeWidth(6)} color="#444" />
          </TouchableOpacity>
        </View>

        {/* --- Calendar Grid (Dynamic Rendering) --- */}
        <View style={styles.calendarGrid}>
          {/* Day Names Row */}
          <View style={styles.daysRow}>
            {DAYS.map((day, index) => (
              <Text key={index} style={styles.dayNameText}>{day}</Text>
            ))}
          </View>

          {/* Date Cells */}
          {calendarData.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.datesRow}>
              {week.map((date, dateIndex) => (
                <DateCell
                  key={dateIndex}
                  date={date}
                  // Check if the date is the current day number AND if the month is today's month
                  isToday={date === todayDate && currentDate.isSame(moment(), 'month')}
                  isEkadashi={ekadashiDates.includes(date)}
                />
              ))}
            </View>
          ))}
        </View>

        {/* --- Observances Section --- */}
        <View style={styles.observancesSection}>
          <View style={styles.observancesHeader}>
            <Feather name="star" size={relativeWidth(5)} color="#FFC107" style={styles.starIcon} />
            <Text style={styles.observancesTitle}>Ekadashi Observances</Text>
          </View>

          {/* Static Mockup, in a real app this would be filtered based on currentDate */}
          {renderObservanceItem('Papanuksha Ekadashi', 'Fri, Oct 3', 'Shukla', 'waxing')}
          {renderObservanceItem('Rama Ekadashi', 'Fri, Oct 17', 'Krishna', 'waning')}
        </View>

        {/* --- Legend --- */}
        <View style={styles.legendContainer}>
          <View>
            <Text style={styles.legendText}>Legend</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, styles.todayColor]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColorBox, styles.ekadashiColor]} />
            <Text style={styles.legendText}>Ekadashi</Text>
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
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    paddingHorizontal: relativeWidth(4),
    paddingBottom: relativeHeight(5),
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: relativeWidth(4),
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: relativeWidth(5.5),
    fontWeight: '600',
    color: '#000',
  },

  // Ekadashi Summary Card Styles
  ekadashiSummaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E6F0FF',
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    marginVertical: relativeHeight(2),
  },
  summaryTitle: {
    fontSize: relativeWidth(4.5),
    fontWeight: '600',
    color: '#212529',
  },
  summarySubtitle: {
    fontSize: relativeWidth(3.5),
    color: '#6c757d',
    marginTop: relativeHeight(0.5),
  },
  calendarIconContainer: {
    padding: relativeWidth(2),
    backgroundColor: '#fff',
    borderRadius: relativeWidth(2),
  },

  // Calendar Grid Styles
  calendarGrid: {
    backgroundColor: '#fff',
    borderRadius: relativeWidth(3),
    padding: relativeWidth(3),
    marginBottom: relativeHeight(2),
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: relativeHeight(1.5),
  },
  dayNameText: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: relativeWidth(3.8),
    fontWeight: '500',
    color: '#495057',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: relativeHeight(1.5),
  },
  dateCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dateCellText: {
    fontSize: relativeWidth(4),
    fontWeight: '400',
    color: '#212529',
  },

  // Styles for Date Highlighting
  ekadashiIcon: {
    position: 'absolute',
    top: relativeWidth(-0.5),
    right: relativeWidth(-0.5),
    fontSize: relativeWidth(3),
    zIndex: 1,
  },
  todayBackground: {
    backgroundColor: '#2C3E50',
    borderRadius: 999,
  },
  todayText: {
    color: '#fff',
    fontWeight: '600',
  },

  // Observances Section Styles
  observancesSection: {
    backgroundColor: '#fff',
    borderRadius: relativeWidth(3),
    padding: relativeWidth(4),
    marginBottom: relativeHeight(2),
    marginTop: relativeHeight(1),
  },
  observancesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: relativeHeight(2),
  },
  starIcon: {
    marginRight: relativeWidth(2),
  },
  observancesTitle: {
    fontSize: relativeWidth(4.5),
    fontWeight: '600',
    color: '#000',
  },

  // Observance Item Styles
  observanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: relativeHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
    justifyContent: 'space-between',
  },
  observanceImagePlaceholder: {
    width: relativeWidth(10),
    height: relativeWidth(10),
    borderRadius: relativeWidth(5),
    backgroundColor: '#f1f3f5',
    marginRight: relativeWidth(3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  observanceTextContainer: {
    flex: 1,
  },
  observanceTitleText: {
    fontSize: relativeWidth(4),
    fontWeight: '500',
    color: '#000',
  },
  observanceDateText: {
    fontSize: relativeWidth(3.5),
    color: '#6c757d',
  },
  phaseBadge: {
    backgroundColor: '#F1F3F5',
    borderRadius: relativeWidth(1.5),
    paddingHorizontal: relativeWidth(3),
    paddingVertical: relativeWidth(1),
  },
  phaseBadgeText: {
    fontSize: relativeWidth(3.2),
    fontWeight: '500',
    color: '#495057',
  },

  // Legend Styles
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: relativeWidth(4),
    paddingVertical: relativeHeight(1),
    backgroundColor: '#fff',
    borderRadius: relativeWidth(3),
  },
  legendText: {
    fontSize: relativeWidth(3.5),
    color: '#6c757d',
    marginRight: relativeWidth(4),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: relativeWidth(4),
  },
  legendColorBox: {
    width: relativeWidth(3.5),
    height: relativeWidth(3.5),
    borderRadius: relativeWidth(0.5),
    marginRight: relativeWidth(1.5),
  },
  todayColor: {
    backgroundColor: '#2C3E50',
  },
  ekadashiColor: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
});

export default CalendarScreen;