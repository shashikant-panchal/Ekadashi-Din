import { Feather, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
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
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'all'

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
      // Logic for upcoming: If it's the current month or future month
      const isUpcoming = monthDate.isAfter(today, 'month') || (monthDate.month() === today.month() && monthDate.year() === today.year());

      // Specifically check for December if needed, but generic logic holds
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
      dateFormatted: `${day} ${month} ${year}`,
      hinduMonth: hinduMonth,
      details: nextEkadashi.significance || nextEkadashi.description || "Makes all endeavors successful and fruitful..."
    };
  };

  const monthData = getMonthData();
  const nextEkadashiData = getNextEkadashiData();

  const MonthCard = ({ month, ekadashis, isUpcoming, onPress }) => {
    // Styling based on UI: White card, rounded corners, centered text
    return (
      <TouchableOpacity
        style={[styles.monthCard, { borderColor: colors.border }]}
        onPress={onPress}
      >
        <ThemedText type="defaultSemiBold" style={[styles.monthText, { color: colors.foreground }]}>{month}</ThemedText>
        <View style={styles.ekadashiCountContainer}>
          <Feather name="clock" size={relativeWidth(3.5)} color={colors.primary} />
          <ThemedText type="small" style={[styles.ekadashiCountText, { color: colors.primary }]}>{ekadashis} Ekadashis</ThemedText>
        </View>
        {isUpcoming && (
          <View style={styles.upcomingBadge}>
            {/* Yellow badge in UI */}
            <ThemedText type="caption" style={styles.upcomingBadgeText}>Upcoming</ThemedText>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const NextEkadashiCardSimple = ({ title, dateFormatted, hinduMonth, details }) => (
    <TouchableWithoutFeedback onPress={() => navigation.navigate('DayDetails')}>
      <View style={[styles.nextEkadashiCard, { backgroundColor: isDark ? colors.card : '#F9F9F7' }]}>
        <View style={styles.nextEkadashiMoonContainer}>
          <Ionicons name="moon" size={relativeWidth(6)} color="#FFFFFF" />
        </View>
        <View style={styles.nextEkadashiContent}>
          <ThemedText type="defaultSemiBold" style={[styles.nextEkadashiTitle, { color: colors.foreground }]}>{title}</ThemedText>
          <ThemedText type="small" style={[styles.nextEkadashiDate, { color: colors.primary }]}>{dateFormatted} • {hinduMonth}</ThemedText>
          <ThemedText numberOfLines={2} type="small" style={[styles.nextEkadashiDetails, { color: colors.mutedForeground }]}>{details}</ThemedText>
        </View>
      </View>
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.screenHeader}>
          <ThemedText style={styles.mainTitle}>Ekadashi Calendar {currentYear}</ThemedText>
          <ThemedText style={styles.subtitle}>
            Complete spiritual calendar for the year
          </ThemedText>
          <View style={styles.subtitleUnderline} />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#F3E8FF' }]}>
            <ThemedText style={[styles.statNumber, { color: '#7E22CE' }]}>{totalEkadashis}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: '#7E22CE' }]}>TOTAL EKADASHIS</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#FFEDD5' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="star" size={24} color="#C2410C" style={{ marginRight: 6 }} />
              <ThemedText style={[styles.statNumber, { color: '#C2410C' }]}>{remainingEkadashis}</ThemedText>
            </View>
            <ThemedText style={[styles.statLabel, { color: '#C2410C' }]}>REMAINING</ThemedText>
          </View>
        </View>

        {/* Toggle View */}
        <View style={styles.toggleContainerWrapper}>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'month' && styles.toggleButtonActive]}
              onPress={() => setViewMode('month')}
            >
              <Feather name="calendar" size={16} color={viewMode === 'month' ? '#0F172A' : '#64748B'} style={{ marginRight: 8 }} />
              <ThemedText style={[styles.toggleText, viewMode === 'month' ? styles.toggleTextActive : styles.toggleTextInactive]}>By Month</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'all' && styles.toggleButtonActive]}
              onPress={() => setViewMode('all')}
            >
              <Feather name="list" size={16} color={viewMode === 'all' ? '#0F172A' : '#64748B'} style={{ marginRight: 8 }} />
              <ThemedText style={[styles.toggleText, viewMode === 'all' ? styles.toggleTextActive : styles.toggleTextInactive]}>All Ekadashis</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {viewMode === 'month' ? (
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
        ) : (
          <View style={styles.listContainer}>
            {ekadashiList && ekadashiList.map((ekadashi, index) => {
              const date = moment(ekadashi.date || ekadashi.ekadashi_date);
              const isPast = date.isBefore(today, 'day');
              // If it's today, we can treat it as upcoming or give it a special status, 
              // but reference only has Past/Upcoming/Today logic might be needed. 
              // Ref image shows 'Upcoming' for Dec 15 2025.
              // Let's assume generic 'Upcoming' for future.

              const status = isPast ? 'Past' : 'Upcoming';

              return (
                <View key={index} style={[styles.listCard, { borderColor: colors.border }]}>
                  <View style={styles.listMoonContainer}>
                    <Ionicons name="moon" size={relativeWidth(5)} color="#FFFFFF" style={{ opacity: 0.8 }} />
                  </View>

                  <View style={styles.listContent}>
                    <ThemedText type="defaultSemiBold" style={[styles.listTitle, { color: colors.foreground }]}>
                      {ekadashi.name || ekadashi.ekadashi_name}
                    </ThemedText>
                    <View style={styles.listDateRow}>
                      <Feather name="calendar" size={12} color={colors.mutedForeground} style={{ marginRight: 4 }} />
                      <ThemedText type="small" style={[styles.listDate, { color: colors.mutedForeground }]}>
                        {date.format('D MMM YYYY')}
                      </ThemedText>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[
                      styles.statusBadge,
                      status === 'Past' ? styles.statusBadgePast : styles.statusBadgeUpcoming,
                      status === 'Upcoming' && { borderColor: colors.border }
                    ]}>
                      <ThemedText style={[
                        styles.statusText,
                        status === 'Past' ? styles.statusTextPast : { color: colors.foreground }
                      ]}>
                        {status}
                      </ThemedText>
                    </View>
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} style={{ marginLeft: 8 }} />
                  </View>
                </View>
              );
            })}
          </View>
        )}


        {nextEkadashiData && (
          <View style={styles.nextEkadashiSection}>
            <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.foreground }]}>Next Ekadashi</ThemedText>
            <NextEkadashiCardSimple
              title={nextEkadashiData.title}
              dateFormatted={nextEkadashiData.dateFormatted}
              hinduMonth={nextEkadashiData.hinduMonth}
              details={nextEkadashiData.details}
            />
          </View>
        )}

        {listError && (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ThemedText type="small" style={{ color: colors.destructive }}>{listError}</ThemedText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView >
  );
};

/* Refined Styles for Ditto UI */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F8FAFC'
  },
  screenHeader: {
    alignItems: "center",
    paddingVertical: relativeHeight(3),
  },
  mainTitle: {
    fontSize: 28, // Larger for header
    fontFamily: 'serif', // Serif font as requested
    fontWeight: 'bold',
    color: '#0F172A', // Dark Navy Blue
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#334155', // Slate 700
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: '#334155', // Darker blue line
    borderRadius: 2,
  },

  /* Stats Cards Refinement */
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: relativeHeight(3),
  },
  statCard: {
    width: "48%",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  /* Toggle Refinement */
  toggleContainerWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    width: '100%',
    backgroundColor: '#F1F5F9', // Light slate bg
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#0F172A', // Dark Navy
  },
  toggleTextInactive: {
    color: '#64748B', // Slate 500
  },

  /* Month Grid Refinement */
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: relativeHeight(2),
  },
  monthCard: {
    width: "48%",
    backgroundColor: '#F8FAFC', // Very light blue tint
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Light blue border
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCardUpcoming: {
    width: "48%",
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF', // Light blue for upcoming
    borderColor: '#BAE6FD',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A', // Dark Navy
    marginBottom: 8,
  },
  ekadashiCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ekadashiCountText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  upcomingBadge: {
    marginTop: 12,
    backgroundColor: '#FACC15', // Yellow 400
    paddingHorizontal: 16, // Pill shape
    paddingVertical: 6,
    borderRadius: 20,
  },
  upcomingBadgeText: {
    color: '#422006', // Dark Brown/Black for contrast
    fontSize: 12,
    fontWeight: '700',
  },

  /* List View Refinement */
  listContainer: {
    marginBottom: relativeHeight(2),
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9', // Slate 100
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // Add subtle shadow
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listMoonContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#475569', // Slate 600
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155', // Slate 700
    marginBottom: 4,
  },
  listDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listDate: {
    fontSize: 13,
    color: '#64748B', // Slate 500
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  statusBadgePast: {
    backgroundColor: '#FDE047', // Yellow
  },
  statusBadgeUpcoming: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1', // Slate 300
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextPast: {
    color: '#422006', // Dark contrast
  },

  /* Next Ekadashi Refinement */
  nextEkadashiSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#0F172A', // Dark Navy
  },
  nextEkadashiCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF', // Clean White
    // Shadow
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  nextEkadashiMoonContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#000000', // Black as per image
    borderRadius: 8, // Square with slight radius
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  nextEkadashiContent: {
    flex: 1,
  },
  nextEkadashiTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A', // Dark Navy
    marginBottom: 4,
  },
  nextEkadashiDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6', // Blue 500
    marginBottom: 8,
  },
  nextEkadashiDetails: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569', // Slate 600
  },
});

export default EkadashiScreen;
