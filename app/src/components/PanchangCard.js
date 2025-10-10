import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import { BackgroundGrey, LightBlue } from '../constants/Colors'
import { dh, dw } from '../constants/Dimensions'

const PanchangCard = () => {
    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Ionicons name="moon-outline" size={dw * 0.05} color="#1C2C56" />
                <Text style={styles.headerTitle}>Today's Panchang</Text>
            </View>
            <Ionicons name="refresh-outline" size={dw * 0.05} color="#1C2C56" />
        </View>
    )

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
                {renderInfoCard('TITHI', 'Ekadashi', '#E8F0FB')}
                {renderInfoCard('LOCATION', '19.08°, 72.88°', '#E8F0FB')}
            </View>

            {/* Second Row */}
            <View style={styles.row}>
                {renderIconCard('sun', 'fa5', 'Sunrise', '06:52', '#F1F6FE', null, '#1C2C56')}
                {renderIconCard('weather-sunset-down', 'mc', 'Sunset', '18:42', '#FFF7E5', '#FEFCEB', '#FAE013')}
            </View>

            {/* Moonrise */}
            <View style={[styles.fullCard, { backgroundColor: '#F1F6FE' }]}>
                <View style={[styles.iconBackground, { backgroundColor: BackgroundGrey }]}>
                    <Ionicons name="moon" size={dw * 0.05} color="#1C2C56" />
                </View>
                <View style={styles.iconTextContainer}>
                    <Text style={styles.subLabel}>Moonrise</Text>
                    <Text style={styles.value}>19:15</Text>
                </View>
            </View>

            {/* Bottom Row */}
            <View style={styles.row}>
                {renderBottomCard('Nakshatra', 'Purva Phalguni', '#E9F0E6')}
                {renderBottomCard('Yoga', 'Vishkumbha', '#EDE7F6')}
                {renderBottomCard('Karana', 'Bava', '#E7EFFA')}
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
