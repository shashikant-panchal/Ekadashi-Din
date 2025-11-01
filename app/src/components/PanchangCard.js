import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import moment from 'moment'
import { BackgroundGrey, LightBlue } from '../constants/Colors'
import { dh, dw } from '../constants/Dimensions'
import { usePanchang } from '../hooks/usePanchang'

const PanchangCard = () => {
    const { panchangData, loading, error, refreshData } = usePanchang();

    const handleRefresh = () => {
        refreshData && refreshData();
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Ionicons name="moon-outline" size={dw * 0.05} color="#1C2C56" />
                <Text style={styles.headerTitle}>Today's Panchang</Text>
            </View>
            <TouchableOpacity onPress={handleRefresh}>
                <Ionicons name="refresh-outline" size={dw * 0.05} color="#1C2C56" />
            </TouchableOpacity>
        </View>
    )

    // Format time from API response
    const formatTime = (timeString) => {
        if (!timeString) return "N/A";
        // Handle different time formats
        if (typeof timeString === 'string') {
            // If already formatted
            if (timeString.includes(':')) {
                return timeString.split(' ')[0]; // Get HH:MM part
            }
            // If it's a timestamp or date string
            return moment(timeString).format('HH:mm');
        }
        return "N/A";
    };

    // Extract tithi name from API response
    const getTithi = () => {
        if (!panchangData) return "N/A";
        return panchangData.tithi?.name || 
               panchangData.tithi?.details?.tithi_name || 
               panchangData.tithi_name || 
               "N/A";
    };

    // Extract location from API response
    const getLocation = () => {
        if (!panchangData) return "N/A";
        return panchangData.location || 
               (panchangData.latitude && panchangData.longitude 
                ? `${panchangData.latitude.toFixed(2)}°, ${panchangData.longitude.toFixed(2)}°`
                : "N/A");
    };

    // Extract sunrise from API response
    const getSunrise = () => {
        if (!panchangData) return "N/A";
        return formatTime(panchangData.sunrise || panchangData.sunrise_time || panchangData.suryoday);
    };

    // Extract sunset from API response
    const getSunset = () => {
        if (!panchangData) return "N/A";
        return formatTime(panchangData.sunset || panchangData.sunset_time || panchangData.suryast);
    };

    // Extract moonrise from API response
    const getMoonrise = () => {
        if (!panchangData) return "N/A";
        return formatTime(panchangData.moonrise || panchangData.moonrise_time || panchangData.chandroday);
    };

    // Extract nakshatra from API response
    const getNakshatra = () => {
        if (!panchangData) return "N/A";
        return panchangData.nakshatra?.name || 
               panchangData.nakshatra_name || 
               panchangData.nakshatra || 
               "N/A";
    };

    // Extract yoga from API response
    const getYoga = () => {
        if (!panchangData) return "N/A";
        return panchangData.yoga?.name || 
               panchangData.yoga_name || 
               panchangData.yoga || 
               "N/A";
    };

    // Extract karana from API response
    const getKarana = () => {
        if (!panchangData) return "N/A";
        return panchangData.karana?.name || 
               panchangData.karana_name || 
               panchangData.karana || 
               "N/A";
    };

    if (loading) {
        return (
            <View style={styles.card}>
                {renderHeader()}
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#1C2C56" />
                </View>
            </View>
        );
    }

    if (error || !panchangData) {
        return (
            <View style={styles.card}>
                {renderHeader()}
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: '#dc3545', fontSize: 14 }}>{error || "Failed to load Panchang data"}</Text>
                </View>
            </View>
        );
    }

    const renderInfoCard = (label, value, bgColor, align = 'flex-start') => (
        <View style={[styles.smallCard, { backgroundColor: bgColor, alignItems: align }]}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    )

    const renderIconCard = (icon, iconType, label, value, bgColor, iconBgColor, iconColor) => (
        <View style={[styles.smallCard, styles.rowAlign, { backgroundColor: bgColor }]}>
            <View style={[styles.iconBackground, iconBgColor && { backgroundColor: iconBgColor }]}>
                {iconType === 'fa5' && <FontAwesome5 name={icon} size={dw * 0.05} color={iconColor} />}
                {iconType === 'mc' && <MaterialCommunityIcons name={icon} size={dw * 0.055} color={iconColor} />}
                {iconType === 'ion' && <Ionicons name={icon} size={dw * 0.05} color={iconColor} />}
            </View>
            <View style={styles.iconTextContainer}>
                <Text style={styles.subLabel}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    )

    const renderBottomCard = (label, value, bgColor) => (
        <View style={[styles.bottomCard, { backgroundColor: bgColor }]}>
            <Text style={styles.subLabel}>{label}</Text>
            <Text style={styles.value} numberOfLines={2}>{value}</Text>
        </View>
    )

    return (
        <View style={styles.card}>
            {renderHeader()}

            <View style={styles.row}>
                {renderInfoCard('TITHI', getTithi(), '#E8F0FB')}
                {renderInfoCard('LOCATION', getLocation(), '#E8F0FB')}
            </View>

            {/* Second Row */}
            <View style={styles.row}>
                {renderIconCard('sun', 'fa5', 'Sunrise', getSunrise(), '#F1F6FE', null, '#1C2C56')}
                {renderIconCard('weather-sunset-down', 'mc', 'Sunset', getSunset(), '#FFF7E5', '#FEFCEB', '#FAE013')}
            </View>

            {/* Moonrise */}
            <View style={[styles.fullCard, { backgroundColor: '#F1F6FE' }]}>
                <View style={[styles.iconBackground, { backgroundColor: BackgroundGrey }]}>
                    <Ionicons name="moon" size={dw * 0.05} color="#1C2C56" />
                </View>
                <View style={styles.iconTextContainer}>
                    <Text style={styles.subLabel}>Moonrise</Text>
                    <Text style={styles.value}>{getMoonrise()}</Text>
                </View>
            </View>

            {/* Bottom Row */}
            <View style={styles.row}>
                {renderBottomCard('Nakshatra', getNakshatra(), '#E9F0E6')}
                {renderBottomCard('Yoga', getYoga(), '#EDE7F6')}
                {renderBottomCard('Karana', getKarana(), '#E7EFFA')}
            </View>
        </View>
    )
}

export default PanchangCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: dw * 0.03,
        padding: dw * 0.04,
        margin: dw * 0.04,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: dh * 0.01,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: dw * 0.045,
        fontWeight: '600',
        color: '#1C2C56',
        marginLeft: dw * 0.015,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: dh * 0.007,
    },
    smallCard: {
        flex: 1,
        borderRadius: dw * 0.025,
        paddingVertical: dh * 0.015,
        paddingHorizontal: dw * 0.05,
        marginHorizontal: dw * 0.01,
    },
    fullCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: dw * 0.025,
        paddingVertical: dh * 0.015,
        marginVertical: dh * 0.01,
    },
    bottomCard: {
        flex: 1,
        borderRadius: dw * 0.025,
        paddingVertical: dh * 0.012,
        alignItems: 'center',
        marginHorizontal: dw * 0.01,
    },
    label: {
        fontSize: dw * 0.032,
        fontWeight: '600',
        color: LightBlue,
        textAlign: 'flex-start',
    },
    subLabel: {
        fontSize: dw * 0.034,
        color: LightBlue,
        marginTop: dh * 0.004,
    },
    value: {
        fontSize: dw * 0.036,
        padding: 4,
        fontWeight: '600',
        color: '#1C2C56',
        marginTop: dh * 0.003,
        textAlign: 'center',
    },
    iconBackground: {
        backgroundColor: "#D5DBE2",
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    iconTextContainer: {
        marginLeft: dw * 0.03,
    },
    rowAlign: {
        flexDirection: 'row',
        alignItems: 'center',
    },
})
