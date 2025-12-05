import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const Challenge = ({ navigation }) => {
    const { colors, isDark } = useTheme();

    const questionData = {
        currentQuestion: 1,
        totalQuestions: 8,
        progressPercentage: 0,
        tags: ["Human Values", "Medium"],
        question: "What quality did Draupadi demonstrate during her humiliation?",
        options: [
            "Revenge and anger",
            "Faith and inner strength",
            "Submission and defeat",
            "Indifference"
        ],
        currentScore: "0/0"
    };

    const QuizOption = ({ text, onPress }) => (
        <TouchableOpacity style={[styles.optionButton, { backgroundColor: colors.muted, borderColor: colors.border }]} onPress={onPress}>
            <Text style={[styles.optionText, { color: colors.foreground }]}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.card }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={colors.foreground} />
                    </TouchableOpacity>
                    <Text style={[styles.questionText, { color: colors.secondary }]}>{`Question ${questionData.currentQuestion}/${questionData.totalQuestions}`}</Text>
                </View>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressLine, { backgroundColor: colors.secondary }]} />
                    <View style={[styles.progressBarWrapper, { backgroundColor: colors.border }]}>
                        <View style={[styles.progressBar, { width: `${questionData.progressPercentage}%`, backgroundColor: colors.secondary }]} />
                    </View>
                    <Text style={[styles.progressText, { color: colors.mutedForeground }]}>{`${questionData.progressPercentage}% complete`}</Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <View style={styles.tagContainer}>
                        <View style={[styles.tag, styles.primaryTag, { backgroundColor: colors.secondary }]}>
                            <Text style={[styles.primaryTagText, { color: colors.foreground }]}>{questionData.tags[0]}</Text>
                        </View>
                        <View style={[styles.tag, { backgroundColor: colors.muted }]}>
                            <Text style={[styles.tagText, { color: colors.foreground }]}>{questionData.tags[1]}</Text>
                        </View>
                    </View>

                    <Text style={[styles.questionTitle, { color: colors.foreground }]}>{questionData.question}</Text>

                    <View style={styles.optionsList}>
                        {questionData.options.map((option, index) => (
                            <QuizOption
                                key={index}
                                text={option}
                                onPress={() => console.log(`Selected: ${option}`)}
                            />
                        ))}
                    </View>
                </View>

                <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <FontAwesome name="trophy" size={20} color={colors.secondary} />
                    <Text style={[styles.scoreText, { color: colors.foreground }]}>{`Current Score: ${questionData.currentScore}`}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        paddingHorizontal: 5,
    },
    questionText: {
        fontSize: 14,
        fontWeight: '500',
    },
    progressContainer: {
        paddingVertical: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    progressLine: {
        width: '100%',
        height: 4,
        marginBottom: 2,
    },
    progressBarWrapper: {
        width: '100%',
        height: 4,
    },
    progressBar: {
        height: '100%',
    },
    progressText: {
        fontSize: 12,
        marginTop: 5,
    },
    card: {
        borderRadius: 15,
        padding: 20,
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginRight: 10,
    },
    tagText: {
        fontSize: 13,
        fontWeight: '500',
    },
    primaryTag: {},
    primaryTagText: {
        fontSize: 13,
        fontWeight: '600',
    },
    questionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 25,
        lineHeight: 28,
    },
    optionsList: {
        gap: 12,
    },
    optionButton: {
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 20,
        alignItems: 'flex-start',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '500',
    },
    scoreCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 15,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    scoreText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
    }
});

export default Challenge;