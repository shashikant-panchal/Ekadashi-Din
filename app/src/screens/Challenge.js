import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppYellow, DarkBlue, LightBlue } from '../constants/Colors';


// Option Component for reuse
const QuizOption = ({ text, onPress }) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
        <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
);

const Challenge = ({ navigation }) => {
    // Mock data for the screen
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* --- Header/Navbar --- */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.questionText}>{`Question ${questionData.currentQuestion}/${questionData.totalQuestions}`}</Text>
                </View>

                {/* --- Progress Bar Container --- */}
                <View style={styles.progressContainer}>
                    {/* The yellow line above the bar in the original design */}
                    <View style={styles.progressLine} />

                    <View style={styles.progressBarWrapper}>
                        {/* Progress Bar (0% width) */}
                        <View style={[styles.progressBar, { width: `${questionData.progressPercentage}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{`${questionData.progressPercentage}% complete`}</Text>
                </View>

                {/* --- Content Card --- */}
                <View style={styles.card}>
                    {/* Tags */}
                    <View style={styles.tagContainer}>
                        <View style={[styles.tag, styles.primaryTag]}>
                            <Text style={styles.primaryTagText}>{questionData.tags[0]}</Text>
                        </View>
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>{questionData.tags[1]}</Text>
                        </View>
                    </View>

                    {/* Question */}
                    <Text style={styles.questionTitle}>{questionData.question}</Text>

                    {/* Options */}
                    <View style={styles.optionsList}>
                        {questionData.options.map((option, index) => (
                            <QuizOption
                                key={index}
                                text={option}
                                // Placeholder for option selection logic
                                onPress={() => console.log(`Selected: ${option}`)}
                            />
                        ))}
                    </View>
                </View>

                {/* --- Score Card (Bottom) --- */}
                <View style={styles.scoreCard}>
                    <FontAwesome name="trophy" size={20} color="#333" />
                    <Text style={styles.scoreText}>{`Current Score: ${questionData.currentScore}`}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff', // White background for the whole screen
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f8f8f8', // Light gray background to match the screenshot
    },
    // --- Header Styling ---
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingHorizontal: 5, // Match padding of original screen
    },
    questionText: {
        fontSize: 14,
        fontWeight: '500',
        color: AppYellow,
    },
    // --- Progress Bar Styling ---
    progressContainer: {
        paddingVertical: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    progressLine: {
        width: '100%',
        height: 4,
        backgroundColor: AppYellow,
        marginBottom: 2,
    },
    progressBarWrapper: {
        width: '100%',
        height: 4,
        backgroundColor: '#e0e0e0', // Base color of the bar
    },
    progressBar: {
        height: '100%',
        backgroundColor: AppYellow,
    },
    progressText: {
        fontSize: 12,
        color: LightBlue,
        marginTop: 5,
    },
    // --- Card/Question Styling ---
    card: {
        backgroundColor: '#fff',
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
        backgroundColor: '#f1f1f1',
    },
    tagText: {
        fontSize: 13,
        fontWeight: '500',
        color: DarkBlue,
    },
    primaryTag: {
        backgroundColor: AppYellow,
        // Using a slightly darker text color for contrast on the yellow background
    },
    primaryTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: DarkBlue, // White text on primary color
    },
    questionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: DarkBlue,
        marginBottom: 25,
        lineHeight: 28,
    },
    optionsList: {
        gap: 12, // Spacing between options
    },
    optionButton: {
        backgroundColor: '#F9FBFD',
        borderWidth: 1,
        borderColor: '#e0e0e0',
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
        color: DarkBlue,
        fontWeight: '500',
    },
    // --- Score Card Styling ---
    scoreCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
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
        color: DarkBlue,
    }
});

export default Challenge;