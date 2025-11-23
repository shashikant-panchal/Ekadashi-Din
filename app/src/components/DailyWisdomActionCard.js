import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DarkBlue, LightBlue } from '../constants/Colors';

const DailyWisdomActionCard = ({ iconName, iconColor, iconBgColor, title, subtitle, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={styles.actionCard}>
            <View style={[styles.actionIconContainer, { backgroundColor: iconBgColor }]}>
                <Ionicons name={iconName} size={24} color={iconColor} />
            </View>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionSubtitle}>{subtitle}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 8, // Half of the main screen's margin to get 16px between cards
        flex: 1, // Allows cards to share space horizontally
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 120, // To ensure they have a consistent height
    },
    actionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DarkBlue,
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 12,
        color: LightBlue,
        textAlign: 'center',
    },
});

export default DailyWisdomActionCard;