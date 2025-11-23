import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const BackIcon = '←';
const CalendarIcon = '\u{1F4C5}'; // 📅
const ForwardIcon = '>';
const MoonIcon = '☾';


const ekadashiData = [
    {
        id: 1,
        title: "Pausha Putrada Ekadashi",
        date: "10 Jan 2025",
        paksha: "Shukla Paksha",
        description: "Grants happiness, prosperity and children to devotees",
    },
    {
        id: 2,
        title: "Shat Tila Ekadashi",
        date: "25 Jan 2025",
        paksha: "Krishna Paksha",
        description: "Removes all sins and grants liberation",
    },
];


const Header = () => (
    <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>{BackIcon} Back</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>January</Text>
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

const EkadashiItem = ({ item, navigation }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('DayDetails')}>
        <View style={styles.cardContent}>

            <View style={styles.moonIconWrapper}>
                <Text style={styles.moonIcon}>{MoonIcon}</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>


                <View style={styles.dateRow}>
                    <Text style={styles.dateText}>
                        <Text style={styles.icon}>{CalendarIcon}</Text> {item.date}
                    </Text>
                    <PakshaPill paksha={item.paksha} />
                </View>

                <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={styles.arrowContainer}>
                <Text style={styles.arrowIcon}>{ForwardIcon}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const CalendarMonth = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView style={styles.scrollView}>
                <View style={styles.listContainer}>
                    {ekadashiData.map((item) => (
                        <EkadashiItem key={item.id} item={item} navigation={navigation} />
                    ))}
                </View>
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
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
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
    moonIcon: {
        fontSize: 24,
        color: '#374151',
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