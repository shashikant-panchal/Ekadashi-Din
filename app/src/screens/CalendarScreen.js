import { Feather, Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../context/ThemeContext";
import { getEkadashiByMonth } from "../data/ekadashiData";
import { getFestivalsByMonth } from "../data/festivalData";
import { getMoonPhasesByMonth } from "../data/moonPhaseData";

const WINDOW_WIDTH = Dimensions.get("window").width;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const SummaryChip = ({ icon, label, count, color, bg, borderColor }) => (
  <View style={[styles.summaryChip, { backgroundColor: bg, borderColor: borderColor }]}>
    {icon}
    <ThemedText style={[styles.summaryChipText, { color: color }]}>
      <ThemedText style={{ fontWeight: 'bold', color: color }}>{count}</ThemedText> {label}
    </ThemedText>
  </View>
);

const SectionHeader = ({ icon, title, color }) => (
  <View style={styles.sectionHeader}>
    {icon}
    <ThemedText style={[styles.sectionTitle, { color: '#052962' }]}>{title}</ThemedText>
  </View>
);

const DateCell = ({ date, isEkadashi, isToday, isFestival, isMoon, colors }) => {
  if (!date) return <View style={styles.dateCell} />;

  let containerStyle = [styles.dateCell];
  let textStyle = [styles.dateCellText, { color: '#052962' }];
  let dot = null;

  if (isToday) {
    containerStyle.push({ backgroundColor: '#052962', borderRadius: 12 });
    textStyle.push({ color: '#fff', fontWeight: 'bold' });
  } else {
    if (isEkadashi) {
      containerStyle.push({ backgroundColor: '#FFF5F5' }); // Light pink
      dot = <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />;
    } else if (isFestival) {
      containerStyle.push({ backgroundColor: '#FEFCE8' }); // Light yellow
      dot = <View style={[styles.dot, { backgroundColor: '#EAB308' }]} />;
    } else if (isMoon) {
      dot = <View style={[styles.dot, { backgroundColor: '#9CA3AF' }]} />;
    }
  }

  return (
    <View style={containerStyle}>
      <ThemedText style={textStyle}>{date}</ThemedText>
      {dot}
    </View>
  );
};

const CalendarScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [currentDate, setCurrentDate] = useState(moment());

  const currentMonth = currentDate.month();
  const currentYear = currentDate.year();

  // Data Logic
  const monthEkadashis = useMemo(() => getEkadashiByMonth(currentMonth).sort((a, b) => a.date - b.date), [currentMonth]);
  const ekadashiDates = useMemo(() => monthEkadashis.map(e => e.date.getDate().toString()), [monthEkadashis]);

  // Dynamic Festivals and Moon Phases
  const festivals = useMemo(() => getFestivalsByMonth(currentMonth).sort((a, b) => a.date - b.date), [currentMonth]);
  const festivalDates = useMemo(() => festivals.map(f => f.date.getDate().toString()), [festivals]);

  const moonPhases = useMemo(() => getMoonPhasesByMonth(currentMonth), [currentMonth]);
  const moonDates = useMemo(() => moonPhases.map(m => m.date.date().toString()), [moonPhases]);


  // Calendar Grid Logic
  const startOfMonth = currentDate.clone().startOf("month");
  const endOfMonth = currentDate.clone().endOf("month");
  const startDayOfWeek = startOfMonth.day();

  const calendarGrid = [];
  let week = Array(startDayOfWeek).fill("");
  let day = startOfMonth.clone();

  while (day.isSameOrBefore(endOfMonth)) {
    week.push(day.date().toString());
    if (week.length === 7) {
      calendarGrid.push(week);
      week = [];
    }
    day.add(1, "day");
  }
  if (week.length > 0) {
    while (week.length < 7) week.push("");
    calendarGrid.push(week);
  }

  const todayDate = moment().date().toString();
  const isCurrentMonth = currentDate.isSame(moment(), 'month');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FAFBFF' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentDate(d => d.clone().subtract(1, 'M'))}>
          <Ionicons name="chevron-back" size={24} color="#052962" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <ThemedText style={styles.headerMonth}>{currentDate.format("MMMM YYYY")}</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Today</ThemedText>
        </View>
        <TouchableOpacity onPress={() => setCurrentDate(d => d.clone().add(1, 'M'))}>
          <Ionicons name="chevron-forward" size={24} color="#052962" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Summary Chips */}
        <View style={styles.chipsContainer}>
          <SummaryChip
            icon={<Feather name="moon" size={12} color="#EF4444" />}
            count={monthEkadashis.length}
            label="Ekadashi"
            color="#EF4444"
            bg="#FEF2F2"
            borderColor="#FECACA"
          />
          <SummaryChip
            icon={<Feather name="sun" size={12} color="#D97706" />}
            count={festivals.length}
            label="Festivals"
            color="#D97706"
            bg="#FFFBEB"
            borderColor="#FDE68A"
          />
          <SummaryChip
            icon={<Feather name="circle" size={12} color="#4F46E5" />}
            count={moonPhases.length}
            label="Moon Phases"
            color="#4F46E5"
            bg="#EEF2FF"
            borderColor="#C7D2FE"
          />
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          <View style={styles.daysHeader}>
            {DAYS.map((d, i) => <ThemedText key={i} style={styles.dayText}>{d}</ThemedText>)}
          </View>
          {calendarGrid.map((week, i) => (
            <View key={i} style={styles.weekRow}>
              {week.map((date, j) => (
                <DateCell
                  key={j}
                  date={date}
                  isToday={isCurrentMonth && date === todayDate}
                  isEkadashi={ekadashiDates.includes(date)}
                  isFestival={festivalDates.includes(date)}
                  isMoon={moonDates.includes(date)}
                  colors={colors}
                />
              ))}
            </View>
          ))}

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#052962' }]} /><ThemedText style={styles.legendText}>Today</ThemedText></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FCA5A5' }]} /><ThemedText style={styles.legendText}>Ekadashi</ThemedText></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#FCD34D' }]} /><ThemedText style={styles.legendText}>Festival</ThemedText></View>
            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#CBD5E1' }]} /><ThemedText style={styles.legendText}>Moon</ThemedText></View>
          </View>
        </View>

        {/* Ekadashi Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            icon={<Feather name="moon" size={20} color="#EF4444" />}
            title="Ekadashi Observances"
          />
          {monthEkadashis.map((item, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => navigation.navigate('DayDetails', { ekadashi: item, date: moment(item.date).format('YYYY-MM-DD') })}
            >
              <View style={[styles.card, { backgroundColor: '#FFF5F5', borderColor: '#FECACA' }]}>
                <View style={[styles.iconBox, { backgroundColor: '#111' }]}>
                  <Ionicons name="moon" size={20} color="#FFF" />
                </View>
                <View style={styles.cardContent}>
                  <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
                  <ThemedText style={styles.cardSubtitle}>{moment(item.date).format("ddd, MMM D")}</ThemedText>
                </View>
                <View style={[styles.pill, { borderColor: '#FCA5A5', backgroundColor: '#FFF' }]}>
                  <ThemedText style={[styles.pillText, { color: '#EF4444' }]}>{item.paksha}</ThemedText>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>

        {/* Festivals Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            icon={<Feather name="star" size={20} color="#D97706" />}
            title="Hindu Festivals"
          />
          {festivals.map((item, index) => (
            <View key={index} style={[styles.card, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Feather name="star" size={18} color="#D97706" />
              </View>
              <View style={styles.cardContent}>
                <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
                <ThemedText style={styles.cardSubtitle}>{moment(item.date).format("ddd, MMM D")} • {item.deity}</ThemedText>
              </View>
              <View style={[styles.pill, { backgroundColor: item.type === 'regional' ? '#14B8A6' : '#F59E0B', borderWidth: 0 }]}>
                <ThemedText style={[styles.pillText, { color: '#FFF' }]}>{item.type}</ThemedText>
              </View>
            </View>
          ))}
          {festivals.length === 0 && (
            <ThemedText style={[styles.cardSubtitle, { textAlign: 'center', marginTop: 10 }]}>No festivals this month</ThemedText>
          )}
        </View>

        {/* Moon Phases Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            icon={<View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#D4AF37' }} />}
            title="Moon Phases"
          />
          {moonPhases.map((item, index) => (
            <View key={index} style={[styles.card, { backgroundColor: '#FFF', borderColor: '#E2E8F0' }]}>
              <View style={[styles.iconBox, { backgroundColor: '#F1F5F9' }]}>
                {item.phase === 'full'
                  ? <Ionicons name="moon" size={20} color="#94A3B8" />
                  : <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#000' }} />
                }
              </View>
              <View style={styles.cardContent}>
                <ThemedText style={styles.cardTitle}>{item.name}</ThemedText>
                <ThemedText style={styles.cardSubtitle}>{item.date.format("ddd, MMM D")}</ThemedText>
              </View>
              <View style={[styles.pill, { borderColor: '#CBD5E1', backgroundColor: '#FFF' }]}>
                <ThemedText style={[styles.pillText, { color: '#64748B' }]}>{item.type}</ThemedText>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerMonth: { fontSize: 18, color: '#052962', fontWeight: 'bold' },
  headerSubtitle: { fontSize: 13, color: '#3B82F6' },

  chipsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, paddingVertical: 16 },
  summaryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 6 },
  summaryChipText: { fontSize: 12, fontWeight: '500' },

  calendarCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 20 },
  daysHeader: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  dayText: { color: '#475569', fontWeight: '600', width: 32, textAlign: 'center' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },

  dateCell: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  dateCellText: { fontSize: 15, fontWeight: '500' },
  dot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },

  legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12, color: '#64748B' },

  sectionContainer: { marginTop: 10, paddingHorizontal: 16, marginBottom: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },

  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  iconBox: { width: 40, height: 40, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#052962', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#475569' },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  pillText: { fontSize: 11, fontWeight: '600' }
});

export default CalendarScreen;
