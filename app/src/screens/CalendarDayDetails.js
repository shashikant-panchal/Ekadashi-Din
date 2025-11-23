import { useEffect, useState } from 'react';
import { Dimensions, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { DarkBlue, Grey, LightBlue } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useEkadashiList } from '../hooks/useEkadashi';
import { getAllBhajans, getBhajanById } from '../data/bhajansData';

const PRIMARY_COLOR = '#4A90E2';
const SECONDARY_BG = '#F5F5F5';

const BORDER_COLOR = '#E0E0E0';
const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Icon Component using Feather ---
const AppIcon = ({ name, style, size = 24, color = PRIMARY_COLOR }) => (
    <Feather name={name} size={size} color={color} style={style} />
);

// --- Reusable Card Component ---
const DetailCard = ({ iconName, title, children }) => (
    <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
            <AppIcon name={iconName} style={styles.cardIcon} color={DarkBlue} />
            <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.cardContent}>{children}</View>
    </View>
);

// --- Section 1: Story & Significance ---
const StorySection = ({ onReadStory, ekadashi }) => (
    <DetailCard iconName="book-open" title="Story & Significance">
        <Text style={styles.bodyText}>
            {ekadashi?.significance || ekadashi?.vrataKatha || "Observing Ekadashi with devotion helps overcome life's obstacles and brings inner peace. This sacred day is particularly beneficial for those seeking spiritual growth and material prosperity."}
        </Text>
        <TouchableOpacity style={styles.readButton} onPress={onReadStory}>
            <Text style={styles.readButtonText}>Read Full Story</Text>
        </TouchableOpacity>
    </DetailCard>
);

// --- Section 2: Vrata Rules & Guidelines ---
const VrataRulesSection = ({ ekadashi }) => {
    const defaultRules = [
        "Begin fasting from sunrise on Ekadashi day",
        "Avoid grains, beans, and certain vegetables",
        "Stay hydrated with water and fruit juices",
        "Spend time in prayer and meditation",
        "Read spiritual texts or chant mantras",
    ];
    const rules = ekadashi?.fastingRules || defaultRules;

    return (
        <DetailCard iconName="heart" title="Vrata Rules & Guidelines">
            {rules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                    <View style={styles.ruleNumberCircle}>
                        <Text style={styles.ruleNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.ruleText}>{rule}</Text>
                </View>
            ))}
        </DetailCard>
    );
};

// --- Section 3: Important Timings ---
const TimingsSection = ({ panchangData }) => {
    const sunrise = panchangData?.sunrise || "06:09 AM";
    const sunset = panchangData?.sunset || "06:09 PM";
    
    return (
        <DetailCard iconName="clock" title="Important Timings">
            <View style={styles.timingRow}>
                <View style={styles.timingItem}>
                    <Text style={styles.timingLabel}>Fasting Begins</Text>
                    <Text style={[styles.timingValue, { color: PRIMARY_COLOR }]}>{sunrise}</Text>
                </View>
                <View style={styles.timingItem}>
                    <Text style={styles.timingLabel}>Parana Window</Text>
                    <Text style={[styles.timingValue, { color: PRIMARY_COLOR }]}>{sunrise} - {sunset}</Text>
                </View>
            </View>
        </DetailCard>
    );
};

// --- Section 4: Bhajans & Mantras ---
const BhajansSection = ({ onBhajanPress, bhajans }) => {
    const displayBhajans = bhajans || getAllBhajans().slice(0, 3); // Show first 3 by default
    
    return (
        <DetailCard iconName="music" title="Bhajans & Mantras">
            {displayBhajans.map((bhajan) => (
                <TouchableOpacity
                    key={bhajan.id}
                    style={[styles.bhajanButton, { borderColor: BORDER_COLOR, backgroundColor: SECONDARY_BG }]}
                    onPress={() => onBhajanPress(bhajan)}
                >
                    <AppIcon name="music" style={styles.bhajanIcon} color={PRIMARY_COLOR} size={18} />
                    <View style={styles.bhajanTextContainer}>
                        <Text style={styles.bhajanText}>{bhajan.name}</Text>
                        {bhajan.artist && (
                            <Text style={styles.bhajanArtist}>{bhajan.artist}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            ))}
        </DetailCard>
    );
};

// --- Section 5: Sattvic Recipes ---
const RecipesSection = () => {
    const recipes = [
        { name: "Fruit Salad", desc: "Mixed seasonal fruits with honey" },
        { name: "Sabudana Kheer", desc: "Sweet tapioca pudding with nuts" },
        { name: "Kuttu Roti", desc: "Buckwheat flatbread with yogurt" },
    ];

    return (
        // Using 'chef' from FontAwesome or similar is more accurate, but sticking to Feather's 'feather' as placeholder.
        <DetailCard iconName="feather" title="Sattvic Recipes">
            {recipes.map((recipe, index) => (
                <TouchableOpacity key={index} style={[styles.recipeItem, { borderColor: BORDER_COLOR, backgroundColor: SECONDARY_BG }]}>
                    <Text style={styles.recipeName}>{recipe.name}</Text>
                    <Text style={styles.recipeDesc}>{recipe.desc}</Text>
                </TouchableOpacity>
            ))}
        </DetailCard>
    );
};

// --- Modal 1: Story Details ---
const StoryModal = ({ isVisible, onClose, ekadashi }) => {
    const ekadashiName = ekadashi?.name || ekadashi?.ekadashi_name || "Ekadashi";
    const vrataKatha = ekadashi?.vrataKatha || "Long ago, in the celestial realm, there lived a demon named Mura who tormented the demigods and sages. Unable to defeat him through conventional means, Lord Vishnu engaged in a fierce battle that lasted for thousands of years. During this cosmic struggle, a divine maiden emerged from the Lord's body, radiating immense spiritual power. This celestial being, born from the Lord's transcendental energy, defeated the demon Mura with ease. Pleased with her service, Lord Vishnu granted her a boon. She requested that those who fast on her appearance day would be blessed with spiritual advancement and liberation from material bondage. The Lord named her Ekadashi, as she appeared on the eleventh day of the lunar month. He declared that observing Ekadashi with devotion, fasting, and spiritual practices would grant devotees immense spiritual benefit, purification of consciousness, and progress on the path of devotion.";
    const significance = ekadashi?.significance || "Ekadashi represents the transcendence of material consciousness and the awakening of spiritual awareness. By observing this sacred day, devotees align themselves with higher spiritual vibrations, purify their hearts, and develop deeper love and devotion for the Supreme Lord. The practice of fasting on Ekadashi is not merely about restricting food intake; it is a powerful spiritual discipline intended to reduce bodily demands and increase concentration on transcendental sound and service.";
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.modalOverlay}>
                <View style={styles.storyModalContainer}>
                    <View style={styles.modalHeader}>
                        <AppIcon name="book-open" size={20} color={DarkBlue} />
                        <Text style={styles.modalTitle}>{ekadashiName} - Complete Story</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AppIcon name="x" size={24} color={Grey} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.storyModalContent}>
                        <Text style={[styles.modalContentHeading, { color: DarkBlue }]}>The Sacred Legend</Text>
                        <Text style={[styles.modalContentText, { color: LightBlue }]}>
                            {vrataKatha}
                        </Text>
                        <Text style={[styles.modalContentHeading, { color: DarkBlue }]}>Spiritual Significance</Text>
                        <Text style={[styles.modalContentText, { color: LightBlue }]}>
                            {significance}
                        </Text>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

// --- Modal 2: Bhajan Player ---
const BhajanModal = ({ isVisible, onClose, selectedBhajan, onBhajanChange }) => {
    const [isOpening, setIsOpening] = useState(false);
    const allBhajans = getAllBhajans();
    const currentBhajan = typeof selectedBhajan === 'object' ? selectedBhajan : allBhajans.find(b => b.name === selectedBhajan) || allBhajans[0];

    const handlePlay = async () => {
        if (!currentBhajan?.url) return;
        
        setIsOpening(true);
        try {
            const canOpen = await Linking.canOpenURL(currentBhajan.url);
            if (canOpen) {
                await Linking.openURL(currentBhajan.url);
            } else {
                alert('Unable to open this URL. Please check your internet connection.');
            }
        } catch (error) {
            console.error('Error opening URL:', error);
            alert('Unable to open this URL. Please try again.');
        } finally {
            setIsOpening(false);
        }
    };

    const handleBhajanSelect = (bhajan) => {
        if (onBhajanChange) {
            onBhajanChange(bhajan);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.bhajanModalContainer}>
                    <View style={[styles.bhajanHandle]} />
                    <View style={styles.modalHeader}>
                        <AppIcon name="music" size={24} color={DarkBlue} style={{ marginRight: 8 }} />
                        <Text style={[styles.modalTitle, { flex: 1 }]} numberOfLines={1}>
                            {currentBhajan?.name || 'Bhajan'}
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <AppIcon name="x" size={24} color={Grey} />
                        </TouchableOpacity>
                    </View>

                    {/* --- Player Area --- */}
                    <View style={styles.playerPlaceholder}>
                        <View style={styles.playerArtwork}>
                            <AppIcon name="music" size={40} color={Grey} />
                        </View>
                        <View style={styles.playerControls}>
                            <Text style={styles.playerTitle} numberOfLines={1}>
                                {currentBhajan?.name || 'Bhajan'}
                            </Text>
                            {currentBhajan?.artist && (
                                <Text style={styles.playerArtist} numberOfLines={1}>
                                    {currentBhajan.artist}
                                </Text>
                            )}
                            {currentBhajan?.description && (
                                <Text style={styles.playerDescription} numberOfLines={2}>
                                    {currentBhajan.description}
                                </Text>
                            )}
                            {currentBhajan?.duration && (
                                <Text style={styles.playerDuration}>{currentBhajan.duration}</Text>
                            )}
                            
                            {/* Progress bar placeholder */}
                            <View style={styles.progressBarContainer}>
                                <View style={styles.progressBar} />
                            </View>
                            
                            <View style={styles.playerActions}>
                                <Text style={styles.privacyText}>*Opens in external player</Text>
                                <TouchableOpacity 
                                    style={styles.playButton}
                                    onPress={handlePlay}
                                    disabled={isOpening || !currentBhajan?.url}
                                >
                                    {isOpening ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <AppIcon name="play-circle" size={40} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {currentBhajan?.sanskrit && (
                        <View style={styles.mantraDisplay}>
                            <Text style={styles.mantraSanskrit}>{currentBhajan.sanskrit}</Text>
                            {currentBhajan.transliteration && (
                                <Text style={styles.mantraTransliteration}>{currentBhajan.transliteration}</Text>
                            )}
                        </View>
                    )}

                    <Text style={styles.devotionalText}>
                        Tap play to open in your preferred music app
                    </Text>

                    <View style={styles.bhajanListFooter}>
                        {allBhajans.map((bhajan) => (
                            <TouchableOpacity
                                key={bhajan.id}
                                style={[
                                    styles.footerBhajanButton,
                                    currentBhajan?.id === bhajan.id && styles.activeFooterBhajanButton
                                ]}
                                onPress={() => handleBhajanSelect(bhajan)}
                            >
                                <Text
                                    style={[
                                        styles.footerBhajanText,
                                        currentBhajan?.id === bhajan.id && styles.activeFooterBhajanText
                                    ]}
                                    numberOfLines={1}
                                >
                                    {bhajan.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};


// --- Main Component: CalendarDayDetails ---
const CalendarDayDetails = ({ navigation, route }) => {
    const [isStoryModalVisible, setStoryModalVisible] = useState(false);
    const [isBhajanModalVisible, setBhajanModalVisible] = useState(false);
    const [activeBhajan, setActiveBhajan] = useState(getAllBhajans()[0]);
    const [ekadashi, setEkadashi] = useState(null);
    const [panchangData, setPanchangData] = useState(null);

    // Get ekadashi from route params or fetch from list
    const ekadashiFromRoute = route?.params?.ekadashi;
    const ekadashiDate = route?.params?.date ? moment(route.params.date) : moment();
    const currentYear = moment().year();
    const { ekadashiList } = useEkadashiList(currentYear);

    useEffect(() => {
        if (ekadashiFromRoute) {
            setEkadashi(ekadashiFromRoute);
        } else if (ekadashiList && ekadashiList.length > 0) {
            // Find ekadashi for the date
            const foundEkadashi = ekadashiList.find(e => {
                const eDate = moment(e.date || e.ekadashi_date);
                return eDate.isSame(ekadashiDate, 'day');
            });
            if (foundEkadashi) {
                setEkadashi(foundEkadashi);
            }
        }
    }, [ekadashiFromRoute, ekadashiList, ekadashiDate]);

    // Fetch panchang data for the date
    useEffect(() => {
        const fetchPanchang = async () => {
            try {
                const { getPanchangData } = require('../services/api');
                const data = await getPanchangData(ekadashiDate.format('YYYY-MM-DD'));
                setPanchangData(data);
            } catch (error) {
                console.error('Error fetching panchang:', error);
            }
        };
        fetchPanchang();
    }, [ekadashiDate]);

    const handleBhajanPress = (bhajan) => {
        setActiveBhajan(bhajan);
        setBhajanModalVisible(true);
    };

    const handleBhajanChange = (bhajan) => {
        setActiveBhajan(bhajan);
    };

    // Format date for display
    const formattedDate = ekadashiDate.format('dddd D MMMM');
    const ekadashiName = ekadashi?.name || ekadashi?.ekadashi_name || "Ekadashi";

    // Navigation Header
    const Header = () => (
        <View style={[styles.header, { borderBottomColor: BORDER_COLOR }]}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
                <AppIcon name="arrow-left" size={24} color={DarkBlue} />
            </TouchableOpacity>
            <View>
                <Text style={styles.mainTitle}>{ekadashiName}</Text>
                <Text style={styles.subtitle}>{formattedDate}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header />
            <ScrollView style={[styles.container, { backgroundColor: SECONDARY_BG }]} contentContainerStyle={styles.contentContainer}>
                <StorySection onReadStory={() => setStoryModalVisible(true)} ekadashi={ekadashi} />
                <VrataRulesSection ekadashi={ekadashi} />
                <TimingsSection panchangData={panchangData} />
                <BhajansSection onBhajanPress={handleBhajanPress} bhajans={getAllBhajans().slice(0, 3)} />
                <RecipesSection />
                {/* Spacer for bottom padding */}
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* --- Modals --- */}
            <StoryModal
                isVisible={isStoryModalVisible}
                onClose={() => setStoryModalVisible(false)}
                ekadashi={ekadashi}
            />
            <BhajanModal
                isVisible={isBhajanModalVisible}
                onClose={() => setBhajanModalVisible(false)}
                selectedBhajan={activeBhajan}
                onBhajanChange={handleBhajanChange}
            />
        </SafeAreaView>
    );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: 0,
    },
    // --- Header Styles ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        backgroundColor: 'white',
    },
    backButton: {
        paddingRight: 15,
    },
    mainTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: DarkBlue,
    },
    subtitle: {
        fontSize: 14,
        color: LightBlue,
    },
    // --- Card Styles ---
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 18,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardIcon: {
        marginRight: 8,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: DarkBlue,
    },
    cardContent: {
        paddingTop: 5,
    },
    // --- Story Section Styles ---
    bodyText: {
        fontSize: 15,
        lineHeight: 22,
        color: LightBlue,
        marginBottom: 15,
    },
    readButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
    },
    readButtonText: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        fontSize: 14,
    },
    // --- Vrata Rules Styles (Updated to match the image: white circle with border) ---
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    ruleNumberCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Grey || '#A0A0A0', // Use Grey from constants or fallback
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 2,
    },
    ruleNumberText: {
        color: DarkBlue,
        fontSize: 12,
        fontWeight: '700',
    },
    ruleText: {
        flex: 1,
        fontSize: 15,
        color: LightBlue,
    },
    // --- Timings & Bhajans (styles remain mostly the same) ---
    timingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    timingItem: {
        width: SCREEN_WIDTH / 2 - 32 - 8,
    },
    timingLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: DarkBlue,
        marginBottom: 4,
    },
    timingValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bhajanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        marginVertical: 6,
    },
    bhajanIcon: {
        marginRight: 10,
    },
    bhajanTextContainer: {
        flex: 1,
    },
    bhajanText: {
        fontSize: 15,
        fontWeight: '500',
        color: DarkBlue,
    },
    bhajanArtist: {
        fontSize: 12,
        color: LightBlue,
        marginTop: 2,
    },
    // --- Recipes Styles (styles remain mostly the same) ---
    recipeItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        marginVertical: 6,
    },
    recipeName: {
        fontSize: 16,
        fontWeight: '600',
        color: DarkBlue,
    },
    recipeDesc: {
        fontSize: 13,
        color: LightBlue,
        marginTop: 2,
    },
    // --- Modal Styles ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end', // For Bhajan Modal
    },
    // Story Modal specific
    storyModalContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        margin: 10,
        marginTop: Platform.OS === 'ios' ? 50 : 20, // Keep modal away from status bar
        overflow: 'hidden',
    },
    storyModalContent: {
        padding: 20,
    },
    // Shared Modal Header
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        backgroundColor: 'white',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: DarkBlue,
        marginLeft: 8,
        flex: 1,
    },
    closeButton: {
        padding: 5,
    },
    modalContentHeading: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        marginTop: 15,
    },
    modalContentText: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 10,
    },
    // Bhajan Modal specific
    bhajanModalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 8,
        maxHeight: Dimensions.get('window').height * 0.8,
    },
    bhajanHandle: {
        width: 40,
        height: 5,
        backgroundColor: BORDER_COLOR,
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: 8,
    },
    playerPlaceholder: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: SECONDARY_BG,
        borderRadius: 10,
        padding: 15,
        marginVertical: 15,
    },
    playerArtwork: {
        width: 100,
        height: 100,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 12,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8,
    },
    playerControls: {
        flex: 1,
        justifyContent: 'space-between',
        minHeight: 100,
    },
    playerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: DarkBlue,
        marginBottom: 4,
    },
    playerArtist: {
        fontSize: 14,
        color: LightBlue,
        marginBottom: 4,
    },
    playerDescription: {
        fontSize: 12,
        color: LightBlue,
        marginBottom: 8,
        lineHeight: 16,
    },
    playerDuration: {
        fontSize: 11,
        color: Grey,
        marginBottom: 8,
    },
    progressBarContainer: {
        marginVertical: 10,
    },
    progressBar: {
        height: 4,
        width: '100%',
        backgroundColor: BORDER_COLOR,
        borderRadius: 2,
    },
    playerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    playButton: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 25,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    privacyText: {
        fontSize: 10,
        color: LightBlue,
    },
    mantraDisplay: {
        backgroundColor: SECONDARY_BG,
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
    },
    mantraSanskrit: {
        fontSize: 18,
        fontWeight: '600',
        color: DarkBlue,
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 28,
    },
    mantraTransliteration: {
        fontSize: 14,
        color: LightBlue,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
    devotionalText: {
        fontSize: 14,
        color: LightBlue,
        textAlign: 'center',
        marginVertical: 15,
    },
    bhajanListFooter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    footerBhajanButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Grey || '#A0A0A0',
        margin: 5,
    },
    activeFooterBhajanButton: {
        borderColor: PRIMARY_COLOR,
        backgroundColor: PRIMARY_COLOR,
    },
    footerBhajanText: {
        color: DarkBlue,
        fontWeight: '500',
        fontSize: 14,
    },
    activeFooterBhajanText: {
        color: 'white',
    },
});

export default CalendarDayDetails;