import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';

const NotificationCard = ({
    icon,
    color,
    iconColor,
    title,
    description,
    time,
    tag,
    unread,
    descriptionStyle = {},
}) => {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.card, { backgroundColor: unread ? (isDark ? colors.muted : '#EEEFF2') : colors.card }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDark ? colors.muted : color }]}>
                <Icon name={icon} size={20} color={isDark ? colors.primary : iconColor} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
                    {unread && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.description, { color: colors.mutedForeground }, descriptionStyle]}>{description}</Text>
                <View style={styles.footerRow}>
                    <Text style={[styles.time, { color: colors.mutedForeground }]}>{time}</Text>
                    {tag && (
                        <View style={[styles.tag, { backgroundColor: colors.muted }]}>
                            <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{tag}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    description: {
        fontSize: 14,
        marginBottom: 8,
        lineHeight: 20,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    time: {
        fontSize: 12,
    },
    tag: {
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '500',
    },
});

export default NotificationCard;