import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Platform,
    ProgressBarAndroid,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { DarkBlue, LightBlue } from '../constants/Colors';
import { mantrasList } from '../data/bhajansData';

const MorningJapaScreen = ({ navigation }) => {
    const [roundsCompleted, setRoundsCompleted] = useState(0);
    const totalRounds = 16;
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    // Timer logic for the current round
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

    const handleStartStopJapa = () => {
        setIsRunning(!isRunning);
    };

    const handleCompleteRound = () => {
        if (roundsCompleted < totalRounds) {
            setRoundsCompleted(prev => prev + 1);
            setIsRunning(false);
            setTime(0);
        }
    };

    const handleResetSession = () => {
        setRoundsCompleted(0);
        setTime(0);
        setIsRunning(false);
    };

    const progress = roundsCompleted / totalRounds;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="#333" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                </View>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerIconBg}>
                        <SimpleLineIcons name="fire" size={28} color="#FFD700" />
                    </View>
                    <Text style={styles.headerTitle}>Morning Japa</Text>
                    <Text style={styles.headerSubtitle}>16 rounds of divine chanting</Text>
                </View>
                <View style={styles.placeholderRight} />

                {/* Today's Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>Today's Progress</Text>
                        <Text style={styles.progressCounter}>{roundsCompleted}/{totalRounds} rounds</Text>
                    </View>
                    {/* Progress Bar */}
                    {Platform.OS === 'ios' ? (
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                    ) : (
                        <ProgressBarAndroid
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={progress}
                            color="#FFD700"
                            style={{ width: '100%', height: 10 }}
                        />
                    )}

                    <View style={styles.progressStats}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Days streak</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statLabel}>Total rounds</Text>
                        </View>
                    </View>
                </View>

                {/* Round 1 Card */}
                <View style={styles.roundCard}>
                    <Text style={styles.roundTitle}>Round {roundsCompleted + 1}</Text>
                    <Text style={styles.roundTime}>{formatTime(time)}</Text>
                    <TouchableOpacity style={styles.startButton} onPress={handleStartStopJapa}>
                        <Feather name={isRunning ? "pause" : "play"} size={20} color={DarkBlue} />
                        <Text style={styles.startButtonText}>{isRunning ? 'Pause Japa' : 'Start Japa'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Hare Krishna Maha Mantra Card */}
                <View style={styles.mantraCard}>
                    {(() => {
                        const hareKrishnaMantra = mantrasList.find(m => m.name === "Hare Krishna Mahamantra") || mantrasList[0];
                        return (
                            <>
                                <Text style={styles.mantraCardTitle}>{hareKrishnaMantra.name}</Text>
                                {hareKrishnaMantra.sanskrit.split('\n').map((line, index) => (
                                    <Text key={index} style={styles.sanskritMantra}>{line}</Text>
                                ))}
                                {hareKrishnaMantra.transliteration.split('\n').map((line, index) => (
                                    <Text key={index} style={styles.englishMantra}>{line}</Text>
                                ))}
                            </>
                        );
                    })()}
                </View>

                {/* Complete Round Button */}
                <TouchableOpacity
                    style={[styles.bottomActionButton, styles.completeButton]}
                    onPress={handleCompleteRound}
                    disabled={roundsCompleted >= totalRounds}
                >
                    <Feather name="target" size={20} color={DarkBlue} />
                    <Text style={styles.bottomActionButtonText}>Complete Round {roundsCompleted + 1}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.bottomActionButton, styles.resetButton]}
                    onPress={handleCompleteRound}
                    disabled={roundsCompleted >= totalRounds}
                >
                    <AntDesign name="reload" size={20} color={'#fff'} />
                    <Text style={styles.resetButtontext}>Reset Session </Text>
                </TouchableOpacity>

                {/* Reset Session Button (appears after progress or a new round) */}
                {/* {roundsCompleted > 0 && (
                    <TouchableOpacity
                        style={[styles.bottomActionButton, styles.resetButton]}
                        onPress={handleResetSession}
                    >
                        <Feather name="refresh-cw" size={20} color="#666" />
                        <Text style={[styles.bottomActionButtonText, styles.resetButtonText]}>Reset Session</Text>
                    </TouchableOpacity>
                )} */}



                {/* Japa Tips Card */}
                <View style={styles.japaTipsCard}>
                    <View style={styles.japaTipsHeader}>
                        <Feather name="clock" size={20} color={DarkBlue} />
                        <Text style={styles.japaTipsTitle}>Japa Tips</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>Chant clearly and attentively</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>Complete 16 rounds daily before breakfast</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>Focus on hearing the holy names</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>Average time per round: 7-8 minutes</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// <--- FIX APPLIED HERE --->
// 1. Define the reusable style object OUTSIDE of StyleSheet.create
const CARD_BASE_STYLE = {
    backgroundColor: '#fff',
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
        backgroundColor: '#f8f9fa',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    // Header styles
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
        backgroundColor: '#FFFBE6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
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

    // Today's Progress Card
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
        backgroundColor: '#FFD700',
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

    // Round 1 Card
    roundCard: {
        ...CARD_BASE_STYLE, // <--- Now using the external constant
        alignItems: 'center',
    },
    roundTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: DarkBlue,
        marginBottom: 8,
    },
    roundTime: {
        fontSize: 36,
        fontWeight: '400',
        color: LightBlue,
        marginBottom: 20,
        fontVariant: ['tabular-nums'],
    },
    startButton: {
        flexDirection: 'row',
        width: '95%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CED9E3',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DarkBlue,
        marginLeft: 10,
    },

    // Mantra Card
    mantraCard: {
        ...CARD_BASE_STYLE, // <--- Now using the external constant
        backgroundColor: '#1E293B',
        paddingVertical: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    mantraCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    sanskritMantra: {
        fontSize: 20,
        fontWeight: 'bold',
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

    // Bottom Action Buttons
    bottomActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        paddingVertical: 15,
        marginHorizontal: 16,
        marginBottom: 12,
    },
    completeButton: {
        backgroundColor: '#FFD700',
    },
    resetButton: {
        backgroundColor: '#EF4443'
    },
    resetButtontext: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
    },
    bottomActionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: DarkBlue,
        marginLeft: 10,
    },
    // resetButton: {
    //     backgroundColor: '#e0e0e0',
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    // },
    resetButtonText: {
        color: '#666',
    },

    // Japa Tips Card
    japaTipsCard: {
        ...CARD_BASE_STYLE, // <--- Now using the external constant
        backgroundColor: '#fff',
        padding: 20,
    },
    japaTipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    japaTipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DarkBlue,
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
        color: DarkBlue,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: DarkBlue,
        lineHeight: 20,
    },
    backText: {
        paddingHorizontal: 10,
        color: LightBlue,
        fontSize: 14,
        fontWeight: '700'
    }
});

export default MorningJapaScreen;