import { useEffect, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppYellow, DarkBlue, LightBlue, LIGHTBLUEBG } from '../constants/Colors';
import { bhagavadGitaChapters, getTodaysVerse } from '../data/bhagavadGitaData';

// Reusable component for the Chapter List Item
const ChapterListItem = ({ chapterNumber, title, verseCount, progress, onPress }) => (
    <View >
        <View style={chapterStyles.itemContainer}>
            <View style={chapterStyles.numberContainer}>
                <Text style={chapterStyles.numberText}>{chapterNumber}</Text>
            </View>
            <View style={chapterStyles.textContainer}>
                <Text style={chapterStyles.titleText}>{`Chapter ${chapterNumber}: ${title}`}</Text>
                <Text style={chapterStyles.progressText}>{`${progress}/${verseCount} verses`}</Text>
            </View>
            <TouchableOpacity style={chapterStyles.continueButton} onPress={onPress}>
                <Text style={chapterStyles.buttonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    </View>
);


const DailyReading = ({ navigation }) => {
    const [todaysVerse, setTodaysVerse] = useState(null);
    const [chaptersCompleted, setChaptersCompleted] = useState(0);
    const [totalVersesRead, setTotalVersesRead] = useState(0);

    useEffect(() => {
        // Get today's verse dynamically
        const verse = getTodaysVerse();
        setTodaysVerse(verse);

        // Calculate progress from chapters (in a real app, this would come from API/database)
        const completed = bhagavadGitaChapters.filter(ch => ch.completed).length;
        setChaptersCompleted(completed);

        // Calculate total verses read (placeholder - would come from API in real app)
        setTotalVersesRead(1);
    }, []);

    const totalChapters = bhagavadGitaChapters.length;
    const studyProgress = totalChapters > 0 ? chaptersCompleted / totalChapters : 0;

    // Use today's verse or fallback
    const verse = todaysVerse || {
        chapter: 4,
        verse: 7,
        sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
        transliteration: "yadā yadā hi dharmasya glānirbhavati bhārata |\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham ||",
        translation: "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion—at that time I descend Myself.",
        purport: "The Supreme Lord appears in this world to reestablish dharma (righteousness) and protect the devotees. This verse assures us that divine intervention comes whenever darkness threatens to overcome light."
    };

    const sanskritVerse = verse.sanskrit;
    const transliteration = verse.transliteration;
    const englishMeaning = verse.translation;
    const significance = verse.purport || "This famous verse explains the purpose of divine incarnation - to restore dharma when it declines.";


    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={LightBlue} />
                        <Text style={{
                            paddingHorizontal: 10,
                            color: LightBlue,
                            fontSize: 14,
                            fontWeight: '700'
                        }}>Back</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerIconBg}>
                        <Ionicons name="book-outline" size={32} color={DarkBlue} />
                    </View>
                    <Text style={styles.headerTitle}>Daily Reading</Text>
                    <Text style={styles.headerSubtitle}>Bhagavad Gita study</Text>
                </View>
                <View style={styles.placeholderRight} />

                {/* Study Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Study Progress</Text>
                        <Text style={styles.progressCounter}>{chaptersCompleted}/{totalChapters} chapters</Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: `${studyProgress * 100}%` }]} />
                    </View>

                    <View style={styles.progressStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>1</Text>
                            <Text style={styles.statLabel}>Days streak</Text>
                        </View>
                    </View>
                </View>

                {/* Today's Verse Card */}
                <View style={styles.verseCard}>
                    <View style={styles.verseHeader}>
                        <Feather name="book-open" size={20} color="#333" />
                        <Text style={styles.verseTitle}>Today's Verse</Text>
                    </View>
                    <Text style={styles.verseChapter}>Chapter {verse.chapter}, Verse {verse.verse}</Text>

                    <View style={styles.verseContent}>
                        <Text style={styles.sanskritText}>{sanskritVerse}</Text>
                        <Text style={styles.transliterationText}>{transliteration}</Text>
                    </View>

                    <Text style={styles.englishMeaningText}>{englishMeaning}</Text>

                    <Text style={styles.significanceText}>
                        <Text style={{ fontWeight: 'bold' }}>Significance:</Text>
                        {significance.replace("Significance: ", "")}
                    </Text>

                    <TouchableOpacity style={styles.markAsReadButton}>
                        <Text style={styles.markAsReadButtonText}>Mark as Read</Text>
                    </TouchableOpacity>
                </View>

                {/* Bhagavad Gita Chapters Section */}
                <View style={styles.chapterSection}>
                    <Text style={styles.chapterSectionTitle}>Bhagavad Gita Chapters</Text>


                    {bhagavadGitaChapters.map(chapter => (
                        <ChapterListItem
                            key={chapter.id}
                            chapterNumber={chapter.id}
                            title={chapter.englishName}
                            verseCount={chapter.verseCount}
                            progress={chapter.completed ? chapter.verseCount : 0}
                            onPress={() => console.log(`Navigating to Chapter ${chapter.id}`)}
                        />
                    ))}

                </View>

                {/* Footer Metrics */}
                <View style={styles.footerMetricsContainer}>
                    <View style={styles.footerMetricCard}>
                        <MaterialCommunityIcons name="clock-outline" size={32} color={AppYellow} />
                        <Text style={styles.footerMetricValue}>0</Text>
                        <Text style={styles.footerMetricLabel}>Avg minutes</Text>
                    </View>
                    <View style={styles.footerMetricCard}>
                        <Ionicons name="book-outline" size={32} color={DarkBlue} />
                        <Text style={styles.footerMetricValue}>{totalVersesRead}</Text>
                        <Text style={styles.footerMetricLabel}>Verses read</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

// Reusable card base style definition (prevents "cardBase of undefined" errors)
const CARD_BASE_STYLE = {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    // --- Header Styles ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
        // marginBottom: 20,
    },
    backButton: {
        padding: 8,
        flexDirection: 'row',
        alignItems: "center"
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: '5%'
    },
    headerIconBg: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: LIGHTBLUEBG, // Light Blue background
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 8,

    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: DarkBlue,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: LightBlue,
        textAlign: 'center',
    },
    placeholderRight: {
        width: 40,
    },
    // --- Study Progress Card ---
    progressCard: {
        ...CARD_BASE_STYLE,
        padding: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DarkBlue,
    },
    progressCounter: {
        fontSize: 14,
        color: LightBlue,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFD700', // Yellow/Gold
        borderRadius: 4,
    },
    progressStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: DarkBlue,
    },
    statLabel: {
        fontSize: 14,
        color: LightBlue,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#eee',
        alignSelf: 'center',
    },
    // --- Today's Verse Card ---
    verseCard: {
        ...CARD_BASE_STYLE,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    verseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    verseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DarkBlue,
        marginLeft: 8,
    },
    verseChapter: {
        fontSize: 14,
        color: LightBlue,
        marginBottom: 16,
        marginLeft: 4,
    },
    verseContent: {
        // borderBottomWidth: 1,
        // borderBottomColor: '#eee',
        backgroundColor: LIGHTBLUEBG,
        alignItems: 'flex-start',
        // paddingBottom: 16,
        marginBottom: 16,
        borderRadius: 10,
        padding: '5%'
    },
    sanskritText: {
        fontSize: 20,
        lineHeight: 30,
        fontWeight: '600',
        color: DarkBlue,
        // textAlign: 'right',
        fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'Arial', // Fallback for Devanagari
    },
    transliterationText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#007bff', // Blue
        // textAlign: 'right',
        fontStyle: 'italic',
        marginTop: 4,
    },
    englishMeaningText: {
        fontSize: 16,
        lineHeight: 24,
        color: DarkBlue,
        marginBottom: 16,
        fontWeight: '500',
    },
    significanceText: {
        fontSize: 14,
        lineHeight: 20,
        color: LightBlue,
        marginBottom: 20,
    },
    markAsReadButton: {
        backgroundColor: '#1E293B', // Dark Blue
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    markAsReadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // --- Chapter List Section ---
    chapterSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        marginBottom: 20,
    },
    chapterSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: DarkBlue,
        margin: 10,
    },
    // --- Footer Metrics ---
    footerMetricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginTop: 10,
    },
    footerMetricCard: {
        ...CARD_BASE_STYLE,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        // Resetting marginHorizontal because CARD_BASE_STYLE adds 16

    },
    footerMetricValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: DarkBlue,
        marginTop: 8,
    },
    footerMetricLabel: {
        fontSize: 14,
        color: LightBlue,
        textAlign: 'center',
    }
});

// Styles specifically for the Chapter List Items
const chapterStyles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LIGHTBLUEBG,
        padding: 18,
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 10,
        alignSelf: 'center',
    },
    numberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    numberText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: DarkBlue,
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '500',
        color: DarkBlue,
    },
    progressText: {
        fontSize: 12,
        color: LightBlue,
        marginTop: 2,
    },
    continueButton: {
        backgroundColor: '#fff', // Light blue background
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderColor: '##D7E0EA',
    },
    buttonText: {
        color: DarkBlue,
        fontSize: 14,
        fontWeight: 'bold',
    },
    horizontalLine: {
        height: 10,
        width: 100,
        backgroundColor: 'red'
    }
});

export default DailyReading;