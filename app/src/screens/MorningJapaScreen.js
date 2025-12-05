import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ProgressBarAndroid,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { ThemedText } from '../components/ThemedText';
import { useTheme } from '../context/ThemeContext';
import { mantrasList } from '../data/bhajansData';
import * as JapaService from '../services/japaSessions';

const MorningJapaScreen = ({ navigation }) => {
    const { colors, isDark } = useTheme();
    const user = useSelector((state) => state.user.user);
    const [todaySession, setTodaySession] = useState(null);
    const [stats, setStats] = useState({
        totalRounds: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageRounds: 0,
        totalSessions: 0
    });
    const [loading, setLoading] = useState(true);
    const totalRounds = 16;
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else if (!isRunning && timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleStartStopJapa = async () => {
        if (!user?.id) {
            console.warn('No user logged in');
            return;
        }

        if (!isRunning && !todaySession?.start_time) {
            try {
                const session = await JapaService.startSession(user.id);
                setTodaySession(session);
            } catch (error) {
                console.error('Error starting session:', error);
            }
        }
        setIsRunning(!isRunning);
    };

    const handleCompleteRound = async () => {
        if (!user?.id) {
            console.warn('No user logged in');
            return;
        }

        const currentRounds = todaySession?.completed_rounds || 0;
        if (currentRounds < totalRounds) {
            try {
                const updatedSession = await JapaService.completeRound(user.id);
                setTodaySession(updatedSession);
                await loadSessionData();
            } catch (error) {
                console.error('Error completing round:', error);
            }
        }
    };

    const handleResetSession = async () => {
        if (!user?.id) {
            console.warn('No user logged in');
            return;
        }

        try {
            const resetSession = await JapaService.resetSession(user.id);
            setTodaySession(resetSession);
            setTime(0);
            setIsRunning(false);
            await loadSessionData();
        } catch (error) {
            console.error('Error resetting session:', error);
        }
    };

    const loadSessionData = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const session = await JapaService.fetchTodaySession(user.id);
            setTodaySession(session);

            const sessions = await JapaService.fetchRecentSessions(user.id);
            const calculatedStats = JapaService.calculateStats(sessions);
            setStats(calculatedStats);
        } catch (error) {
            console.error('Error loading session data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessionData();
    }, [user?.id]);

    useEffect(() => {
        if (todaySession?.start_time && !todaySession.end_time) {
            const startTime = new Date(todaySession.start_time);
            const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
            setTime(elapsed);
        }
    }, [todaySession]);

    const roundsCompleted = todaySession?.completed_rounds || 0;
    const progress = roundsCompleted / totalRounds;

    if (loading && !todaySession) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <ThemedText style={[styles.loadingText, { color: colors.mutedForeground }]}>Loading session...</ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={colors.mutedForeground} />
                        <ThemedText type="link" style={[styles.backText, { color: colors.mutedForeground }]}>Back</ThemedText>
                    </TouchableOpacity>
                </View>
                <View style={styles.headerTitleContainer}>
                    <View style={[styles.headerIconBg, { backgroundColor: isDark ? colors.muted : '#FFFBE6' }]}>
                        <SimpleLineIcons name="fire" size={28} color={colors.secondary} />
                    </View>
                    <ThemedText type="heading" style={[styles.headerTitle, { color: colors.foreground }]}>Morning Japa</ThemedText>
                    <ThemedText style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>16 rounds of divine chanting</ThemedText>
                </View>

                <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                    <View style={styles.progressHeader}>
                        <ThemedText type="subtitle" style={[styles.progressTitle, { color: colors.foreground }]}>Today's Progress</ThemedText>
                        <ThemedText style={[styles.progressCounter, { color: colors.mutedForeground }]}>{roundsCompleted}/{totalRounds} rounds</ThemedText>
                    </View>
                    {Platform.OS === 'ios' ? (
                        <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: colors.secondary }]} />
                        </View>
                    ) : (
                        <ProgressBarAndroid
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={progress}
                            color={colors.secondary}
                            style={{ width: '100%', height: 10 }}
                        />
                    )}

                    <View style={styles.progressStats}>
                        <View style={styles.statItem}>
                            <ThemedText type="heading" style={[styles.statValue, { color: colors.foreground }]}>{stats.currentStreak}</ThemedText>
                            <ThemedText type="small" style={[styles.statLabel, { color: colors.mutedForeground }]}>Days streak</ThemedText>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.statItem}>
                            <ThemedText type="heading" style={[styles.statValue, { color: colors.foreground }]}>{stats.totalRounds}</ThemedText>
                            <ThemedText type="small" style={[styles.statLabel, { color: colors.mutedForeground }]}>Total rounds</ThemedText>
                        </View>
                    </View>
                </View>

                <View style={[styles.roundCard, { backgroundColor: colors.card }]}>
                    <ThemedText type="subtitle" style={[styles.roundTitle, { color: colors.foreground }]}>Round {roundsCompleted + 1}</ThemedText>
                    <ThemedText style={[styles.roundTime, { color: colors.mutedForeground }]}>{formatTime(time)}</ThemedText>
                    <TouchableOpacity style={[styles.startButton, { borderColor: colors.border, backgroundColor: colors.card }]} onPress={handleStartStopJapa}>
                        <Feather name={isRunning ? "pause" : "play"} size={20} color={colors.foreground} />
                        <ThemedText type="defaultSemiBold" style={[styles.startButtonText, { color: colors.foreground }]}>{isRunning ? 'Pause Japa' : 'Start Japa'}</ThemedText>
                    </TouchableOpacity>
                </View>

                <View style={[styles.mantraCard, { backgroundColor: isDark ? colors.primary : '#1E293B' }]}>
                    {(() => {
                        const hareKrishnaMantra = mantrasList.find(m => m.name === "Hare Krishna Mahamantra") || mantrasList[0];
                        return (
                            <>
                                <ThemedText type="defaultSemiBold" style={styles.mantraCardTitle}>{hareKrishnaMantra.name}</ThemedText>
                                {hareKrishnaMantra.sanskrit.split('\n').map((line, index) => (
                                    <ThemedText type="devanagari" key={index} style={styles.sanskritMantra}>{line}</ThemedText>
                                ))}
                                {hareKrishnaMantra.transliteration.split('\n').map((line, index) => (
                                    <ThemedText key={index} style={styles.englishMantra}>{line}</ThemedText>
                                ))}
                            </>
                        );
                    })()}
                </View>

                <TouchableOpacity
                    style={[styles.bottomActionButton, styles.completeButton, { backgroundColor: colors.secondary }]}
                    onPress={handleCompleteRound}
                    disabled={roundsCompleted >= totalRounds}
                >
                    <Feather name="target" size={20} color={colors.foreground} />
                    <ThemedText type="defaultSemiBold" style={[styles.bottomActionButtonText, { color: colors.foreground }]}>Complete Round {roundsCompleted + 1}</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.bottomActionButton, styles.resetButton]}
                    onPress={handleResetSession}
                    disabled={loading}
                >
                    <AntDesign name="reload" size={20} color={'#fff'} />
                    <ThemedText type="defaultSemiBold" style={styles.resetButtontext}>Reset Session </ThemedText>
                </TouchableOpacity>

                <View style={[styles.japaTipsCard, { backgroundColor: colors.card }]}>
                    <View style={styles.japaTipsHeader}>
                        <Feather name="clock" size={20} color={colors.primary} />
                        <ThemedText type="subtitle" style={[styles.japaTipsTitle, { color: colors.foreground }]}>Japa Tips</ThemedText>
                    </View>
                    <View style={styles.tipItem}>
                        <ThemedText style={[styles.bullet, { color: colors.foreground }]}>•</ThemedText>
                        <ThemedText style={[styles.tipText, { color: colors.foreground }]}>Chant clearly and attentively</ThemedText>
                    </View>
                    <View style={styles.tipItem}>
                        <ThemedText style={[styles.bullet, { color: colors.foreground }]}>•</ThemedText>
                        <ThemedText style={[styles.tipText, { color: colors.foreground }]}>Complete 16 rounds daily before breakfast</ThemedText>
                    </View>
                    <View style={styles.tipItem}>
                        <ThemedText style={[styles.bullet, { color: colors.foreground }]}>•</ThemedText>
                        <ThemedText style={[styles.tipText, { color: colors.foreground }]}>Focus on hearing the holy names</ThemedText>
                    </View>
                    <View style={styles.tipItem}>
                        <ThemedText style={[styles.bullet, { color: colors.foreground }]}>•</ThemedText>
                        <ThemedText style={[styles.tipText, { color: colors.foreground }]}>Average time per round: 7-8 minutes</ThemedText>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const CARD_BASE_STYLE = {
    borderRadius: 12,
    padding: 16,
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
        alignItems: 'center'
    },
    headerTitleContainer: {
        alignItems: 'center',
        marginVertical: '5%'
    },
    headerIconBg: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 22,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        textAlign: 'center',
    },
    progressCard: {
        ...Platform.select({
            ios: { paddingBottom: 20 },
            android: { paddingBottom: 16 },
        }),
        ...CARD_BASE_STYLE,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitle: {
        fontSize: 18,
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
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
    },
    statLabel: {
        fontSize: 14,
    },
    statDivider: {
        width: 1,
        height: '80%',
        alignSelf: 'center',
    },
    roundCard: {
        ...CARD_BASE_STYLE,
        alignItems: 'center',
    },
    roundTitle: {
        fontSize: 24,
        marginBottom: 8,
    },
    roundTime: {
        fontSize: 36,
        marginBottom: 20,
        fontVariant: ['tabular-nums'],
    },
    startButton: {
        flexDirection: 'row',
        width: '95%',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    startButtonText: {
        fontSize: 16,
        marginLeft: 10,
    },
    mantraCard: {
        ...CARD_BASE_STYLE,
        paddingVertical: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    mantraCardTitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 15,
    },
    sanskritMantra: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
        lineHeight: 30,
    },
    englishMantra: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 2,
        lineHeight: 20,
    },
    bottomActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 15,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    completeButton: {},
    resetButton: {
        backgroundColor: '#EF4443'
    },
    resetButtontext: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'normal',
    },
    bottomActionButtonText: {
        fontSize: 16,
        marginLeft: 10,
    },
    japaTipsCard: {
        ...CARD_BASE_STYLE,
        padding: 20,
    },
    japaTipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    japaTipsTitle: {
        fontSize: 18,
        marginLeft: 10,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    bullet: {
        fontSize: 16,
        marginRight: 8,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    backText: {
        paddingHorizontal: 10,
        fontSize: 14,
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

export default MorningJapaScreen;