import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { bhagavadGitaChapters, getTodaysVerse } from '../data/bhagavadGitaData';
import { fetchChapterVerses } from '../services/gitaApi';
import * as ReadingService from '../services/readingProgress';

// Sample verses for each chapter (placeholder - in production, fetch from API)
const sampleChapterVerses = {
    1: [
        {
            verse: 1,
            sanskrit: "धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||१-१||",
            transliteration: "dhṛtarāṣṭra uvāca . dharmakṣetre kurukṣetre samavetā yuyutsavaḥ . māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya ||1-1||",
            translation: "1.1 The King Dhritarashtra asked: \"O Sanjaya! What happened on the sacred battlefield of Kurukshetra, when my people gathered against the Pandavas?\"",
            significance: "व्याख्या--'धर्मक्षेत्रे' 'कुरुक्षेत्रे' --कुरुक्षेत्रमें देवताओंने यज्ञ किया था। राजा कुरुने भी यहाँ तपस्या की थी। यज्ञादि धर्ममय कार्य होनेसे तथा राजा कुरुकी तपस्याभूमि होनेसे इसको धर्मभूमि कुरुक्षेत्र कहा गया है।"
        },
        {
            verse: 2,
            sanskrit: "सञ्जय उवाच | दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा | आचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ||१-२||",
            transliteration: "sañjaya uvāca . dṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanastadā . ācāryamupasaṅgamya rājā vacanamabravīt ||1-2||",
            translation: "1.2 Sanjaya said: Having seen the army of the Pandavas drawn up in battle array, King Duryodhana approached his teacher Drona and spoke these words.",
            significance: "दुर्योधन ने पाण्डव सेना की व्यूह-रचना देखकर द्रोणाचार्य के पास जाकर उनसे बातचीत की।"
        }
    ],
    2: [
        {
            verse: 47,
            sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
            transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana | mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi ||",
            translation: "You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.",
            significance: "This verse encapsulates the essence of Karma Yoga. Krishna advises Arjuna to perform his duty without attachment to results."
        },
        {
            verse: 48,
            sanskrit: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय | सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ||",
            transliteration: "yoga-sthaḥ kuru karmāṇi saṅgaṁ tyaktvā dhanañjaya | siddhy-asiddhyoḥ samo bhūtvā samatvaṁ yoga ucyate ||",
            translation: "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
            significance: "This verse defines yoga as equanimity of mind, maintaining balance in all circumstances."
        }
    ]
};

// Generate placeholder verses for a chapter
const getChapterVerses = (chapterId, verseCount) => {
    if (sampleChapterVerses[chapterId]) {
        return sampleChapterVerses[chapterId];
    }
    const chapter = bhagavadGitaChapters.find(c => c.id === chapterId);
    return Array.from({ length: Math.min(verseCount, 5) }, (_, i) => ({
        verse: i + 1,
        sanskrit: `श्लोक ${i + 1} - अध्याय ${chapterId}`,
        transliteration: `Verse ${i + 1} - Chapter ${chapterId}`,
        translation: `This is verse ${i + 1} of Chapter ${chapterId}: ${chapter?.englishName || 'Bhagavad Gita'}. Full translation coming soon.`,
        significance: `The significance of this verse will be available in a future update.`
    }));
};

// Reusable component for the Chapter List Item
const ChapterListItem = ({ chapterNumber, title, verseCount, progress, onPress, colors }) => (
    <View >
        <View style={[chapterStyles.itemContainer, { backgroundColor: colors.lightBlueBg }]}>
            <View style={[chapterStyles.numberContainer, { backgroundColor: colors.card }]}>
                <Text style={[chapterStyles.numberText, { color: colors.foreground }]}>{chapterNumber}</Text>
            </View>
            <View style={chapterStyles.textContainer}>
                <Text style={[chapterStyles.titleText, { color: colors.foreground }]}>{`Chapter ${chapterNumber}: ${title}`}</Text>
                <Text style={[chapterStyles.progressText, { color: colors.mutedForeground }]}>{`${progress}/${verseCount} verses`}</Text>
            </View>
            <TouchableOpacity style={[chapterStyles.continueButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
                <Text style={[chapterStyles.buttonText, { color: colors.foreground }]}>Continue</Text>
            </TouchableOpacity>
        </View>
    </View>
);


const DailyReading = ({ navigation }) => {
    const user = useSelector((state) => state.user.user);
    const { colors, isDark } = useTheme();
    const [todaysVerse, setTodaysVerse] = useState(null);
    const [chapterProgress, setChapterProgress] = useState([]);
    const [stats, setStats] = useState({
        totalVersesRead: 0,
        chaptersCompleted: 0,
        currentStreak: 0,
        averageReadingTime: 0
    });
    const [loading, setLoading] = useState(true);

    // Modal state for verse reader
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [chapterVerses, setChapterVerses] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    const loadReadingData = async () => {
        if (!user?.id) {
            setLoading(false);
            const verse = getTodaysVerse();
            setTodaysVerse(verse);
            return;
        }

        try {
            setLoading(true);
            const verse = getTodaysVerse();
            setTodaysVerse(verse);

            const progressData = await ReadingService.fetchReadingProgress(user.id);
            const chapters = ReadingService.calculateChapterProgress(progressData);
            setChapterProgress(chapters);

            const calculatedStats = ReadingService.calculateReadingStats(progressData, chapters);
            setStats(calculatedStats);
        } catch (error) {
            console.error('Error loading reading data:', error);
            const verse = getTodaysVerse();
            setTodaysVerse(verse);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReadingData();
    }, [user?.id]);

    const totalChapters = bhagavadGitaChapters.length;
    const studyProgress = totalChapters > 0 ? stats.chaptersCompleted / totalChapters : 0;

    const showToast = (message) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } else {
            Alert.alert('Daily Reading', message);
        }
    };

    const handleMarkAsRead = async () => {
        if (!user?.id || !verse) {
            console.warn('No user logged in or no verse selected');
            showToast('Please log in to track your progress');
            return;
        }

        try {
            const result = await ReadingService.markVerseComplete(user.id, verse.chapter, verse.verse);
            if (result?.already_read) {
                showToast("You've already read this verse today! 🙏");
            } else {
                showToast('Verse marked as read! Hare Krishna! 🙏');
                await loadReadingData();
            }
        } catch (error) {
            console.error('Error marking verse as read:', error);
            showToast('Error saving progress. Please try again.');
        }
    };

    const handleOpenChapter = async (chapter) => {
        const chapterId = chapter.id || chapter.chapter;
        setSelectedChapter(chapter);
        setCurrentVerseIndex(0);
        setModalVisible(true);
        setModalLoading(true);

        try {
            const verses = await fetchChapterVerses(chapterId);
            setChapterVerses(verses);
        } catch (error) {
            console.error('Error fetching chapter verses:', error);
            const fallbackVerses = getChapterVerses(chapterId, chapter.verseCount || chapter.totalVerses);
            setChapterVerses(fallbackVerses);
        } finally {
            setModalLoading(false);
        }
    };

    const handlePreviousVerse = () => {
        if (currentVerseIndex > 0) {
            setCurrentVerseIndex(currentVerseIndex - 1);
        }
    };

    const handleNextVerse = () => {
        if (currentVerseIndex < chapterVerses.length - 1) {
            setCurrentVerseIndex(currentVerseIndex + 1);
        }
    };

    const handleModalMarkAsRead = async () => {
        if (!user?.id) {
            showToast('Please log in to track your progress');
            return;
        }

        const currentVerse = chapterVerses[currentVerseIndex];
        const chapterId = selectedChapter?.id || selectedChapter?.chapter;

        try {
            const result = await ReadingService.markVerseComplete(user.id, chapterId, currentVerse.verse);
            if (result?.already_read) {
                showToast("You've already read this verse today! 🙏");
            } else {
                showToast('Verse marked as read! Hare Krishna! 🙏');
                await loadReadingData();
            }
        } catch (error) {
            console.error('Error marking verse as read:', error);
            showToast('Error saving progress. Please try again.');
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedChapter(null);
        setChapterVerses([]);
        setCurrentVerseIndex(0);
    };

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

    const currentModalVerse = chapterVerses[currentVerseIndex];
    const chapterEnglishName = selectedChapter?.englishName || '';
    const totalVerseCount = selectedChapter?.verseCount || selectedChapter?.totalVerses || chapterVerses.length;

    const styles = getStyles(colors);
    const mStyles = getModalStyles(colors);

    if (loading && !todaysVerse) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading reading progress...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={colors.mutedForeground} />
                        <Text style={{
                            paddingHorizontal: 10,
                            color: colors.mutedForeground,
                            fontSize: 14,
                            fontWeight: '700'
                        }}>Back</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.headerTitleContainer}>
                    <View style={[styles.headerIconBg, { backgroundColor: colors.lightBlueBg }]}>
                        <Ionicons name="book-outline" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.headerTitle, { color: colors.foreground }]}>Daily Reading</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>Bhagavad Gita study</Text>
                </View>
                <View style={styles.placeholderRight} />

                {/* Study Progress Card */}
                <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                    <View style={styles.progressHeader}>
                        <Text style={[styles.progressTitle, { color: colors.foreground }]}>Study Progress</Text>
                        <Text style={[styles.progressCounter, { color: colors.mutedForeground }]}>{stats.chaptersCompleted}/{totalChapters} chapters</Text>
                    </View>

                    <View style={[styles.progressBarContainer, { backgroundColor: colors.muted }]}>
                        <View style={[styles.progressBarFill, { width: `${studyProgress * 100}%`, backgroundColor: colors.secondary }]} />
                    </View>

                    <View style={styles.progressStats}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.foreground }]}>{stats.chaptersCompleted}</Text>
                            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Completed</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: colors.foreground }]}>{stats.currentStreak}</Text>
                            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Days streak</Text>
                        </View>
                    </View>
                </View>

                {/* Today's Verse Card */}
                <View style={[styles.verseCard, { backgroundColor: colors.card }]}>
                    <View style={styles.verseHeader}>
                        <Feather name="book-open" size={20} color={colors.foreground} />
                        <Text style={[styles.verseTitle, { color: colors.foreground }]}>Today's Verse</Text>
                    </View>
                    <Text style={[styles.verseChapter, { color: colors.mutedForeground }]}>Chapter {verse.chapter}, Verse {verse.verse}</Text>

                    <View style={[styles.verseContent, { backgroundColor: colors.lightBlueBg }]}>
                        <Text style={[styles.sanskritText, { color: colors.foreground }]}>{sanskritVerse}</Text>
                        <Text style={[styles.transliterationText, { color: colors.primary }]}>{transliteration}</Text>
                    </View>

                    <Text style={[styles.englishMeaningText, { color: colors.foreground }]}>{englishMeaning}</Text>

                    <Text style={[styles.significanceText, { color: colors.mutedForeground }]}>
                        <Text style={{ fontWeight: 'bold' }}>Significance:</Text>
                        {significance.replace("Significance: ", "")}
                    </Text>

                    <TouchableOpacity style={[styles.markAsReadButton, { backgroundColor: colors.primary }]} onPress={handleMarkAsRead} disabled={loading}>
                        <Text style={styles.markAsReadButtonText}>Mark as Read</Text>
                    </TouchableOpacity>
                </View>

                {/* Bhagavad Gita Chapters Section */}
                <View style={[styles.chapterSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.chapterSectionTitle, { color: colors.foreground }]}>Bhagavad Gita Chapters</Text>


                    {(chapterProgress.length > 0 ? chapterProgress : bhagavadGitaChapters.map((ch, i) => ({
                        chapter: ch.id,
                        title: ch.englishName,
                        totalVerses: ch.verseCount,
                        completedVerses: 0,
                        isCompleted: false
                    }))).map(chapter => (
                        <ChapterListItem
                            key={chapter.chapter}
                            chapterNumber={chapter.chapter}
                            title={chapter.title}
                            verseCount={chapter.totalVerses}
                            progress={chapter.completedVerses}
                            onPress={() => handleOpenChapter(chapter)}
                            colors={colors}
                        />
                    ))}

                </View>

                {/* Footer Metrics */}
                <View style={styles.footerMetricsContainer}>
                    <View style={[styles.footerMetricCard, { backgroundColor: colors.card }]}>
                        <MaterialCommunityIcons name="clock-outline" size={32} color={colors.secondary} />
                        <Text style={[styles.footerMetricValue, { color: colors.foreground }]}>{stats.averageReadingTime}</Text>
                        <Text style={[styles.footerMetricLabel, { color: colors.mutedForeground }]}>Avg minutes</Text>
                    </View>
                    <View style={[styles.footerMetricCard, { backgroundColor: colors.card }]}>
                        <Ionicons name="book-outline" size={32} color={colors.primary} />
                        <Text style={[styles.footerMetricValue, { color: colors.foreground }]}>{stats.totalVersesRead}</Text>
                        <Text style={[styles.footerMetricLabel, { color: colors.mutedForeground }]}>Verses read</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Verse Reader Modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <SafeAreaView style={[mStyles.container, { backgroundColor: colors.background }]}>
                    {/* Modal Header */}
                    <View style={[mStyles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                        <TouchableOpacity onPress={handleCloseModal} style={mStyles.closeButton}>
                            <AntDesign name="close" size={24} color={colors.mutedForeground} />
                        </TouchableOpacity>
                        <View style={mStyles.headerCenter}>
                            <Text style={[mStyles.chapterTitle, { color: colors.foreground }]}>Chapter {selectedChapter?.id || selectedChapter?.chapter}</Text>
                            <Text style={[mStyles.chapterSubtitle, { color: colors.mutedForeground }]}>{chapterEnglishName}</Text>
                        </View>
                        <Text style={[mStyles.verseCounter, { color: colors.mutedForeground }]}>{currentVerseIndex + 1} / {totalVerseCount}</Text>
                    </View>

                    {/* Verse Content */}
                    <ScrollView style={mStyles.scrollView} contentContainerStyle={mStyles.scrollContent}>
                        {modalLoading ? (
                            <View style={mStyles.loadingContainer}>
                                <ActivityIndicator size="large" color={colors.primary} />
                                <Text style={[mStyles.loadingText, { color: colors.mutedForeground }]}>Loading verses...</Text>
                            </View>
                        ) : currentModalVerse && (
                            <>
                                {/* Sanskrit Banner */}
                                <View style={[mStyles.sanskritBanner, { backgroundColor: colors.primary }]}>
                                    <Text style={mStyles.sanskritBannerText}>{currentModalVerse.sanskrit}</Text>
                                </View>

                                {/* Verse Card */}
                                <View style={[mStyles.verseCard, { backgroundColor: colors.card }]}>
                                    <View style={mStyles.verseHeader}>
                                        <View style={mStyles.verseLabelContainer}>
                                            <Feather name="book-open" size={18} color={colors.primary} />
                                            <Text style={[mStyles.verseLabel, { color: colors.foreground }]}>Verse {currentModalVerse.verse}</Text>
                                        </View>
                                        <TouchableOpacity style={[mStyles.readBadge, { backgroundColor: colors.lightBlueBg }]} onPress={handleModalMarkAsRead}>
                                            <AntDesign name="check" size={14} color={colors.primary} />
                                            <Text style={[mStyles.readBadgeText, { color: colors.primary }]}>Read</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={[mStyles.verseContent, { backgroundColor: colors.lightBlueBg }]}>
                                        <Text style={[mStyles.verseSanskrit, { color: colors.foreground }]}>{currentModalVerse.sanskrit}</Text>
                                        <Text style={[mStyles.verseTransliteration, { color: colors.mutedForeground }]}>{currentModalVerse.transliteration}</Text>
                                    </View>

                                    <View style={mStyles.translationSection}>
                                        <Text style={[mStyles.translationLabel, { color: colors.foreground }]}>Translation</Text>
                                        <Text style={[mStyles.translationText, { color: colors.mutedForeground }]}>{currentModalVerse.translation}</Text>
                                    </View>

                                    <View style={[mStyles.significanceSection, { borderTopColor: colors.border }]}>
                                        <Text style={[mStyles.significanceLabel, { color: colors.foreground }]}>Significance</Text>
                                        <Text style={[mStyles.significanceText, { color: colors.mutedForeground }]}>{currentModalVerse.significance}</Text>
                                    </View>
                                </View>
                            </>
                        )}
                    </ScrollView>

                    {/* Navigation Footer */}
                    <View style={[mStyles.footer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                        <TouchableOpacity
                            style={[mStyles.navButton, mStyles.prevButton, { backgroundColor: colors.muted, borderColor: colors.border }, currentVerseIndex === 0 && mStyles.disabledButton]}
                            onPress={handlePreviousVerse}
                            disabled={currentVerseIndex === 0}
                        >
                            <AntDesign name="left" size={16} color={currentVerseIndex === 0 ? colors.mutedForeground : colors.foreground} />
                            <Text style={[mStyles.navButtonText, { color: currentVerseIndex === 0 ? colors.mutedForeground : colors.foreground }]}>Previous</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[mStyles.navButton, mStyles.nextButton, { backgroundColor: colors.primary }]}
                            onPress={handleNextVerse}
                            disabled={currentVerseIndex >= chapterVerses.length - 1}
                        >
                            <Text style={mStyles.nextButtonText}>Next</Text>
                            <AntDesign name="right" size={16} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={mStyles.markReadButton} onPress={handleModalMarkAsRead}>
                            <AntDesign name="check" size={16} color={colors.primary} />
                            <Text style={[mStyles.markReadText, { color: colors.primary }]}>Read</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

const CARD_BASE_STYLE = {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
};

const getStyles = (colors) => StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    placeholderRight: {
        width: 40,
    },
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
    },
    progressCounter: {
        fontSize: 14,
    },
    progressBarContainer: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 16,
    },
    progressBarFill: {
        height: '100%',
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
    },
    statLabel: {
        fontSize: 14,
    },
    statDivider: {
        width: 1,
        height: '80%',
        alignSelf: 'center',
    },
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
        marginLeft: 8,
    },
    verseChapter: {
        fontSize: 14,
        marginBottom: 16,
        marginLeft: 4,
    },
    verseContent: {
        alignItems: 'flex-start',
        marginBottom: 16,
        borderRadius: 10,
        padding: '5%'
    },
    sanskritText: {
        fontSize: 20,
        lineHeight: 30,
        fontWeight: '600',
        fontFamily: Platform.OS === 'android' ? 'sans-serif' : 'Arial',
    },
    transliterationText: {
        fontSize: 12,
        lineHeight: 18,
        fontStyle: 'italic',
        marginTop: 4,
    },
    englishMeaningText: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
        fontWeight: '500',
    },
    significanceText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    markAsReadButton: {
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
    },
    markAsReadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    chapterSection: {
        marginHorizontal: 16,
        borderRadius: 10,
        borderWidth: 0.5,
        marginBottom: 20,
    },
    chapterSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
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
    },
    footerMetricValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 8,
    },
    footerMetricLabel: {
        fontSize: 14,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
});

const chapterStyles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    numberText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '500',
    },
    progressText: {
        fontSize: 12,
        marginTop: 2,
    },
    continueButton: {
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 0.5,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});

const getModalStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 8,
    },
    headerCenter: {
        alignItems: 'center',
        flex: 1,
    },
    chapterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    chapterSubtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    verseCounter: {
        fontSize: 14,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    sanskritBanner: {
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    sanskritBannerText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '500',
    },
    verseCard: {
        margin: 16,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    verseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    verseLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    verseLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    readBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    readBadgeText: {
        fontSize: 14,
        marginLeft: 4,
        fontWeight: '500',
    },
    verseContent: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    verseSanskrit: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 12,
    },
    verseTransliteration: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 22,
    },
    translationSection: {
        marginBottom: 16,
    },
    translationLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    translationText: {
        fontSize: 15,
        lineHeight: 24,
    },
    significanceSection: {
        borderTopWidth: 1,
        paddingTop: 16,
    },
    significanceLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    significanceText: {
        fontSize: 14,
        lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    prevButton: {
        borderWidth: 1,
    },
    nextButton: {},
    disabledButton: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 16,
        marginLeft: 8,
    },
    nextButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        marginRight: 8,
    },
    markReadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    markReadText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
    },
});

export default DailyReading;