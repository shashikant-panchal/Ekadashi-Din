import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { ThemedText } from './ThemedText';

const DailyWisdomActionCard = ({ iconName, iconColor, iconBgColor, title, subtitle, onPress }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={1} style={[styles.actionCard, { backgroundColor: colors.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: iconBgColor }]}>
                <Ionicons name={iconName} size={24} color={iconColor} />
            </View>
            <ThemedText type="defaultSemiBold" style={[styles.actionTitle, { color: colors.foreground }]}>{title}</ThemedText>
            <ThemedText type="caption" style={[styles.actionSubtitle, { color: colors.mutedForeground }]}>{subtitle}</ThemedText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    actionCard: {
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 8,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        minHeight: 120,
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
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 12,
        textAlign: 'center',
    },
});

export default DailyWisdomActionCard;