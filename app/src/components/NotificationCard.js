import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { DarkBlue, LightBlue } from '../constants/Colors';

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
    return (
        <View style={[styles.card, { backgroundColor: unread ? '#EEEFF2' : '#fff' }]}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <Icon name={icon} size={20} color={iconColor} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{title}</Text>
                    {unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={[styles.description, descriptionStyle]}>{description}</Text>
                <View style={styles.footerRow}>
                    <Text style={styles.time}>{time}</Text>
                    {tag && (
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

// Styles for THIS component ONLY
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        // Shadow for Android
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20, // Makes it a circle
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
        color: DarkBlue,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007bff', // Blue dot
    },
    description: {
        fontSize: 14,
        color: LightBlue,
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
        // color: '#888',
    },
    tag: {
        // backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    tagText: {
        fontSize: 11,
        color: '#555',
        fontWeight: '500',
    },
});

export default NotificationCard;