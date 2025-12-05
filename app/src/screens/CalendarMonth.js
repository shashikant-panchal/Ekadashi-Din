import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
import { useEkadashiList } from '../hooks/useEkadashi';
import { DarkBlue, LightBlue, GRADIENT_START, GRADIENT_END } from '../constants/Colors';

const BackIcon = '←';
const CalendarIcon = '\u{1F4C5}'; // 📅
const ForwardIcon = '>';
const MoonIcon = '☾';


const Header = ({ monthName, onBack }) => (
    <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>{BackIcon} Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>{monthName}</Text>
            <Text style={styles.subtitle}>Ekadashi days this month</Text>
        </View>
    </View>
);

const PakshaPill = ({ paksha }) => {
    const isShukla = paksha.includes('Shukla');
    const pillStyle = isShukla ? styles.shuklaPill : styles.krishnaPill;
    return (
        <View style={[styles.pill, pillStyle]}>
            <Text style={styles.pillText}>{paksha}</Text>
        </View>
    );
};

const EkadashiItem = ({ item, navigation }) => {
    const ekadashiDate = moment(item.date || item.ekadashi_date);
    const formattedDate = ekadashiDate.format('D MMM YYYY');
    const paksha = item.paksha || '';
    const pakshaDisplay = paksha === 'Shukla' ? 'Shukla Paksha' : paksha === 'Krishna' ? 'Krishna Paksha' : paksha;

    // Check if ekadashi is in the past
    const today = moment();
    const isPast = ekadashiDate.isBefore(today, 'day');

    const CardWrapper = isPast ? View : LinearGradient;
    const cardWrapperProps = isPast
        ? { style: [styles.card, styles.pastCard] }
        : {
            colors: [GRADIENT_START, GRADIENT_END],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 1 },
            style: styles.card
        };

    return (
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('DayDetails', {
            ekadashi: item,
            date: ekadashiDate.format('YYYY-MM-DD')
        })}>
            <CardWrapper {...cardWrapperProps}>
                <View style={styles.cardContent}>

                    <View style={[styles.moonIconWrapper, isPast && styles.pastMoonWrapper]}>
                        <Text style={styles.moonIcon}>{MoonIcon}</Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[styles.cardTitle, isPast && styles.pastText]}>{item.name || item.ekadashi_name || item.title}</Text>

                        <View style={styles.dateRow}>
                            <Text style={[styles.dateText, isPast && styles.pastText]}>
                                <Text style={styles.icon}>{CalendarIcon}</Text> {formattedDate}
                            </Text>
                            {pakshaDisplay && <PakshaPill paksha={pakshaDisplay} />}
                        </View>

                        <Text style={[styles.description, isPast && styles.pastText]}>{item.significance || item.description || ''}</Text>
                    </View>
                    <View style={styles.arrowContainer}>
                        <Text style={[styles.arrowIcon, isPast && styles.pastText]}>>{ForwardIcon}</Text>
                    </View>
                </View>
            </CardWrapper>
        </TouchableOpacity>
    );
};

const CalendarMonth = ({ navigation, route }) => {
    const [month, setMonth] = useState(moment());
    const currentYear = moment().year();
    const { ekadashiList, loading, error } = useEkadashiList(currentYear);

    useEffect(() => {
        // Get month from route params if available
        if (route?.params?.month) {
            setMonth(moment(route.params.month));
        }
    }, [route?.params?.month]);

    // Filter ekadashis for the selected month
    const monthEkadashis = ekadashiList?.filter(ekadashi => {
        const ekadashiDate = moment(ekadashi.date || ekadashi.ekadashi_date);
        return ekadashiDate.isSame(month, 'month') && ekadashiDate.isSame(month, 'year');
    }) || [];

    const monthName = month.format('MMMM');

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header monthName={monthName} />
            <ScrollView style={styles.scrollView}>
                {loading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={DarkBlue} />
                    </View>
                ) : error ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#dc3545', fontSize: 14 }}>{error}</Text>
                    </View>
                ) : monthEkadashis.length > 0 ? (
                    <View style={styles.listContainer}>
                        {monthEkadashis.map((item, index) => (
                            <EkadashiItem key={index} item={item} navigation={navigation} />
                        ))}
                    </View>
                ) : (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: LightBlue, fontSize: 14 }}>No Ekadashis this month</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CalendarMonth


const primaryColor = '#1e3a8a';
const lightGray = '#f3f4f6';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    listContainer: {
        gap: 12,
        paddingBottom: 20, // Space at the bottom
    },


    headerContainer: {
        paddingTop: 20,
        paddingBottom: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb', // Light border for separation
        backgroundColor: '#fff',
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    backButtonText: {
        fontSize: 14,
        color: primaryColor,
        fontWeight: '500',
    },
    titleContainer: {
        marginTop: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '400',
    },


    card: {
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        marginBottom: 12,
    },
    pastCard: {
        backgroundColor: '#f9fafb',
        opacity: 0.7,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },


    moonIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: lightGray,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    pastMoonWrapper: {
        backgroundColor: '#e5e7eb',
    },
    moonIcon: {
        fontSize: 24,
        color: '#374151',
    },
    pastText: {
        color: '#9ca3af',
    },

    // Text Content styles
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 5,
    },

    // Date and Pill row styles
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
        marginRight: 10,
    },
    icon: {
        fontSize: 12,
    },

    // Paksha Pill styles
    pill: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    shuklaPill: {
        backgroundColor: '#dbeafe', // Light blue background
        borderColor: '#93c5fd',
        borderWidth: 1,
    },
    krishnaPill: {
        backgroundColor: '#fef3c7', // Light yellow/sand background
        borderColor: '#fcd34d',
        borderWidth: 1,
    },
    pillText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#374151',
    },

    // Description text styles
    description: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 18,
    },

    // Arrow styles
    arrowContainer: {
        padding: 10,
        alignSelf: 'flex-start',
    },
    arrowIcon: {
        fontSize: 18,
        color: '#9ca3af', // Gray arrow
    }
});