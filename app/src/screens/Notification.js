import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationCard from '../components/NotificationCard';
import { dw } from '../constants/Dimensions';

const notificationsData = [
    {
        id: 1,
        icon: 'moon',
        color: '#E6E6FA',
        iconColor: '#483D8B',
        title: 'Ekadashi Reminder',
        description: 'Tomorrow is Mokshada Ekadashi. Prepare for fasting and spiritual practices.',
        time: '2 hours ago',
        tag: 'ekadashi',
        unread: true,
    },
    {
        id: 2,
        icon: 'star',
        color: '#FFF9C4',
        iconColor: '#FFC107',
        title: 'Daily Wisdom',
        description: 'New spiritual quote from Bhagavad Gita Chapter 7 is available.',
        time: '5 hours ago',
        tag: 'wisdom',
        unread: true,
        descriptionStyle: { color: '#007bff' },
    },

    {
        id: 3,
        icon: 'target',
        color: '#E0F7FA',
        iconColor: '#00BCD4',
        title: 'Morning Japa Reminder',
        description: 'Time for your morning japa meditation session.',
        time: '1 day ago',
        tag: 'japa',
        unread: false,
    },
    {
        id: 4,
        icon: 'clock',
        color: '#FEEBEE',
        iconColor: '#F44336',
        title: 'Panchang Update',
        description: "Today's panchang data has been updated with fresh information.",
        time: '2 days ago',
        tag: 'panchang',
        unread: false,
    },
    {
        id: 5,
        icon: 'gift',
        color: '#E8F5E9',
        iconColor: '#4CAF50',
        title: 'Spiritual Festival',
        description: 'Govardhan Puja is approaching next week. Get ready for celebrations!',
        time: '3 days ago',
        tag: 'festival',
        unread: false,
    },
];

const NotificationScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.markAsReadButton}>
                    <Text style={styles.markAsReadText}>Mark all as read</Text>
                </TouchableOpacity>
                <ScrollView style={styles.scrollView}>
                    {notificationsData.map(item => (
                        <NotificationCard key={item.id} {...item} />
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    markAsReadButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginVertical: 12,
        width: dw / 3,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    markAsReadText: {
        color: '#555',
        fontSize: 14,
        fontWeight: '500',
    },
    scrollView: {
        paddingHorizontal: 16,
    },
});

export default NotificationScreen;