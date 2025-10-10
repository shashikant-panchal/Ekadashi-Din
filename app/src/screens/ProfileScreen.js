import { Feather, Ionicons } from '@expo/vector-icons';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Dimension Utilities ---
const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;
const relativeWidth = (percentage) => WINDOW_WIDTH * (percentage / 100);
const relativeHeight = (percentage) => WINDOW_HEIGHT * (percentage / 100);
// ----------------------------------------

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>

        {/* --- Header: User Profile --- */}
        <View style={styles.profileHeader}>
          {/* Avatar Placeholder */}
          <View style={styles.avatarContainer}>
            <Ionicons name="person-outline" size={relativeWidth(12)} color="#fff" />
          </View>
          <Text style={styles.username}>Devotee</Text>
          <Text style={styles.profileSubtitle}>Spiritual Journey Profile</Text>
        </View>

        {/* --- Stats Cards --- */}
        <View style={styles.statsContainer}>
          {/* Ekadashis Card */}
          <View style={styles.statCard}>
            <Feather name="calendar" size={relativeWidth(8)} color="#2C3E50" />
            <Text style={styles.statCount}>0</Text>
            <Text style={styles.statLabel}>Ekadashis</Text>
          </View>
          {/* Day Streak Card */}
          <View style={styles.statCard}>
            <Feather name="clock" size={relativeWidth(8)} color="#2C3E50" />
            <Text style={styles.statCount}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        {/* --- Spiritual Wisdom Challenge Card --- */}
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            {/* Om Icon Placeholder */}
            <View style={styles.challengeIconBackground}>
              <Text style={styles.challengeIcon}>ॐ</Text>
            </View>
            <Text style={styles.challengeTitle}>Spiritual Wisdom Challenge</Text>
          </View>
          <Text style={styles.challengeDescription}>
            Test your knowledge of Krishna's teachings. Explore the profound wisdom of the Bhagavad Gita and Mahabharata through engaging questions that inspire spiritual growth.
          </Text>
          <TouchableOpacity style={styles.challengeButton}>
            <Text style={styles.challengeButtonText}>Begin Challenge</Text>
          </TouchableOpacity>
        </View>

        {/* --- Recent Activity Card --- */}
        <View style={styles.recentActivityCard}>
          <View style={styles.activityHeader}>
            <Feather name="calendar" size={relativeWidth(5)} color="#212529" />
            <Text style={styles.activityTitle}>Recent Activity</Text>
          </View>
          <Text style={styles.noActivityText}>No recent activity</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollViewContent: {
    paddingHorizontal: relativeWidth(4),
    paddingBottom: relativeHeight(5),
  },

  // --- Profile Header Styles ---
  profileHeader: {
    alignItems: 'center',
    paddingVertical: relativeHeight(3),
  },
  avatarContainer: {
    width: relativeWidth(25),
    height: relativeWidth(25),
    borderRadius: relativeWidth(12.5),
    backgroundColor: '#E9ECF0', // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: relativeHeight(1.5),
  },
  username: {
    fontSize: relativeWidth(6),
    fontWeight: '700',
    color: '#212529',
  },
  profileSubtitle: {
    fontSize: relativeWidth(3.8),
    color: '#6c757d',
  },

  // --- Stats Cards Styles ---
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: relativeHeight(3),
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statCount: {
    fontSize: relativeWidth(10),
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: relativeHeight(1),
  },
  statLabel: {
    fontSize: relativeWidth(4),
    fontWeight: '500',
    color: '#6c757d',
    marginTop: relativeHeight(0.5),
  },

  // --- Spiritual Wisdom Challenge Card Styles ---
  challengeCard: {
    backgroundColor: '#F5F5FC', // Very light purple/gray base
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    marginBottom: relativeHeight(3),
    overflow: 'hidden',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: relativeHeight(1.5),
  },
  challengeIconBackground: {
    width: relativeWidth(10),
    height: relativeWidth(10),
    borderRadius: relativeWidth(2),
    backgroundColor: '#9B59B6', // Base purple color (replace with gradient logic if needed)
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: relativeWidth(3),
  },
  challengeIcon: {
    fontSize: relativeWidth(5),
    color: '#fff',
    fontWeight: 'bold',
  },
  challengeTitle: {
    fontSize: relativeWidth(5),
    fontWeight: '700',
    color: '#2C3E50',
  },
  challengeDescription: {
    fontSize: relativeWidth(3.7),
    color: '#495057',
    marginBottom: relativeHeight(2.5),
    lineHeight: relativeHeight(2.5),
  },
  challengeButton: {
    // This is a complex gradient in the image; using a solid color/linear gradient package for simplicity
    backgroundColor: '#7A40F5', // Middle color for the purple-blue gradient
    paddingVertical: relativeHeight(1.5),
    borderRadius: relativeWidth(2),
    alignItems: 'center',
  },
  challengeButtonText: {
    fontSize: relativeWidth(4.5),
    fontWeight: '600',
    color: '#fff',
  },

  // --- Recent Activity Card Styles ---
  recentActivityCard: {
    backgroundColor: '#fff',
    borderRadius: relativeWidth(3),
    padding: relativeWidth(5),
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: relativeHeight(1.5),
  },
  activityTitle: {
    fontSize: relativeWidth(5),
    fontWeight: '600',
    color: '#212529',
    marginLeft: relativeWidth(2),
  },
  noActivityText: {
    fontSize: relativeWidth(4),
    color: '#6c757d',
    textAlign: 'center',
    paddingVertical: relativeHeight(2),
  },
});

export default ProfileScreen;