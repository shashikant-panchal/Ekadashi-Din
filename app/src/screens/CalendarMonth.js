import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../components/ThemedText';
import { DarkTheme, LightTheme } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';
import { useEkadashiList } from '../hooks/useEkadashi';

const BackIcon = '←';
const CalendarIcon = '\u{1F4C5}';
const ForwardIcon = '>';
const MoonIcon = '☾';


const CalendarMonth = ({ navigation, route }) => {
    const { colors, isDark } = useTheme();
    const [month, setMonth] = useState(moment());
    const currentYear = moment().year();
    const { ekadashiList, loading, error } = useEkadashiList(currentYear);

    useEffect(() => {
        if (route?.params?.month) {
            setMonth(moment(route.params.month));
        }
    }, [route?.params?.month]);

    const monthEkadashis = ekadashiList?.filter(ekadashi => {
        const ekadashiDate = moment(ekadashi.date || ekadashi.ekadashi_date);
        return ekadashiDate.isSame(month, 'month') && ekadashiDate.isSame(month, 'year');
    }) || [];

    const monthName = month.format('MMMM');

    const Header = () => (
        <View style={[styles.headerContainer, { backgroundColor: colors.card, borderBottomColor: colors.border, flexDirection: 'row', alignContent: 'center' }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <ThemedText type="link" style={[styles.backButtonText, { color: colors.primary }]}>{BackIcon} Back</ThemedText>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <ThemedText type="heading" style={[styles.title, { color: colors.foreground }]}>{monthName}</ThemedText>
                <ThemedText style={[styles.subtitle, { color: colors.mutedForeground }]}>Ekadashi days this month</ThemedText>
            </View>
        </View>
    );

    const PakshaPill = ({ paksha }) => {
        const isShukla = paksha.includes('Shukla');
        const pillStyle = isShukla
            ? { backgroundColor: isDark ? colors.muted : '#dbeafe', borderColor: isDark ? colors.border : '#93c5fd' }
            : { backgroundColor: isDark ? colors.muted : '#fef3c7', borderColor: isDark ? colors.border : '#fcd34d' };
        return (
            <View style={[styles.pill, pillStyle]}>
                <ThemedText type="small" style={[styles.pillText, { color: colors.foreground }]}>{paksha}</ThemedText>
            </View>
        );
    };

    const EkadashiItem = ({ item }) => {
        const ekadashiDate = moment(item.date || item.ekadashi_date);
        const formattedDate = ekadashiDate.format('D MMM YYYY');
        const paksha = item.paksha || '';
        const pakshaDisplay = paksha === 'Shukla' ? 'Shukla Paksha' : paksha === 'Krishna' ? 'Krishna Paksha' : paksha;

        const today = moment();
        const isPast = ekadashiDate.isBefore(today, 'day');

        // New Card Icon Component to simulate the combined calendar/moon look
        // Uses inline styles to avoid changing the external styles object
        const NewCardIcon = () => (
            <View
                // moonIconWrapper style
                style={[styles.moonIconWrapper, {
                    backgroundColor: colors.lightBlueBg,
                    position: 'relative', // for absolute positioning of text
                    overflow: 'visible', // allow spillover
                }]}
            >
                {/* Moon Icon (primary icon) */}
                <ThemedText style={[styles.moonIcon, { fontSize: 32 }]}>{MoonIcon}</ThemedText>

                {/* Date/Calendar Text (to simulate the small calendar icon with date 17) */}
                <View style={{
                    position: 'absolute',
                    bottom: -5,
                    right: -5,
                    backgroundColor: colors.background, // background circle for date
                    borderRadius: 10,
                    padding: 2,
                    borderWidth: 1,
                    borderColor: colors.border,
                }}>
                    <ThemedText style={{ fontSize: 10, color: colors.foreground }}>
                        {CalendarIcon} {ekadashiDate.format('D')}
                    </ThemedText>
                </View>
            </View>
        );

        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('DayDetails', {
                ekadashi: item,
                date: ekadashiDate.format('YYYY-MM-DD')
            })}>
                {isPast ? (
                    <View style={[styles.card, styles.pastCard, { backgroundColor: colors.primaryForeground, borderColor: colors.border }]}>
                        <View style={styles.cardContent}>
                            <View style={[styles.moonIconWrapper, { backgroundColor: '#41464F' }]}>
                                <ThemedText style={styles.moonIcon}>{MoonIcon}</ThemedText>
                            </View>
                            <View style={styles.textContainer}>
                                <ThemedText type="subtitle" style={[styles.cardTitle, { color: isDark ? DarkTheme.primary : LightTheme.primary }]}>{item.name || item.ekadashi_name || item.title}</ThemedText>
                                <View style={styles.dateRow}>
                                    <ThemedText type="small" style={[styles.dateText, { color: colors.mutedForeground }]}>
                                        <ThemedText style={styles.icon}>{CalendarIcon}</ThemedText> {formattedDate}
                                    </ThemedText>
                                    {pakshaDisplay && <PakshaPill paksha={pakshaDisplay} />}
                                </View>
                                <ThemedText style={[styles.description, { color: colors.mutedForeground }]}>{item.significance || item.description || ''}</ThemedText>
                            </View>
                            <View style={styles.arrowContainer}>
                                <ThemedText style={[styles.arrowIcon, { color: colors.mutedForeground }]}>{ForwardIcon}</ThemedText>
                            </View>
                        </View>
                    </View>
                ) : (
                    // START: Updated structure for Current/Future Card (LinearGradient)
                    <LinearGradient
                        colors={isDark ? [colors.card, colors.muted] : [colors.gradientStart, colors.gradientEnd]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.card, { borderColor: colors.border }]}
                    >
                        <View style={styles.cardContent}>

                            {/* 1. Icon (Updated to NewCardIcon) */}
                            <NewCardIcon />

                            <View style={styles.textContainer}>

                                {/* 2. Title and Arrow Container in one row (to match the top-right arrow) */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <ThemedText
                                        type="subtitle"
                                        style={[styles.cardTitle, { color: colors.foreground, marginBottom: 5, flex: 1 }]}
                                    >
                                        {item.name || item.ekadashi_name || item.title}
                                    </ThemedText>
                                    {/* The arrow is moved inside the text container's row for better alignment with the title */}
                                    <View style={[styles.arrowContainer, { padding: 0, alignSelf: 'auto', marginLeft: 10 }]}>
                                        <ThemedText style={[styles.arrowIcon, { color: colors.mutedForeground }]}>{ForwardIcon}</ThemedText>
                                    </View>
                                </View>

                                {/* 3. Date and Paksha Pill in one row */}
                                <View style={[styles.dateRow, { marginBottom: 8 }]}>
                                    <ThemedText type="small" style={[styles.dateText, { color: colors.mutedForeground, marginRight: 15 }]}>
                                        {/* Removed the CalendarIcon from here as it's now part of the main icon */}
                                        {formattedDate}
                                    </ThemedText>
                                    {pakshaDisplay && <PakshaPill paksha={pakshaDisplay} />}
                                </View>

                                {/* 4. Description/Significance */}
                                {/* Using the description from the second image card: "Grants happiness, prosperity and children to devotees" */}
                                <ThemedText style={[styles.description, { color: colors.mutedForeground }]}>
                                    {item.significance || item.description || 'Grants happiness, prosperity and children to devotees'}
                                </ThemedText>
                            </View>

                            {/* Removed the original arrow container from the end of cardContent */}
                            {/* It is now nested inside the textContainer for proper alignment */}
                        </View>
                    </LinearGradient>
                    // END: Updated structure for Current/Future Card (LinearGradient)
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.card }]}>
            <Header />
            <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]}>
                {loading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : error ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ThemedText style={{ color: colors.destructive, fontSize: 14 }}>{error}</ThemedText>
                    </View>
                ) : monthEkadashis.length > 0 ? (
                    <View style={styles.listContainer}>
                        {monthEkadashis.map((item, index) => (
                            <EkadashiItem key={index} item={item} />
                        ))}
                    </View>
                ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ThemedText style={{ color: colors.mutedForeground, fontSize: 14 }}>No Ekadashis this month</ThemedText>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CalendarMonth


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    listContainer: {
        gap: 12,
        paddingBottom: 20,
    },
    headerContainer: {
        paddingTop: 20,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
    },
    backButton: {
        alignSelf: 'center',
        marginRight: 20,
        // marginBottom: 8,
    },
    backButtonText: {
        fontSize: 14,
    },
    titleContainer: {
        // marginTop: 5,
    },
    title: {
        fontSize: 24,
    },
    subtitle: {
        fontSize: 14,
    },
    card: {
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 12,
    },
    pastCard: {
        opacity: 0.9,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moonIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    moonIcon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        marginBottom: 5,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 12,
        marginRight: 10,
    },
    icon: {
        fontSize: 12,
    },
    pill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
    },
    pillText: {
        fontSize: 10,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
    },
    arrowContainer: {
        padding: 10,
        alignSelf: 'flex-start',
    },
    arrowIcon: {
        fontSize: 18,
    }
});