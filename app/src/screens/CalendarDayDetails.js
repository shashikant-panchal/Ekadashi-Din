import { Feather } from "@expo/vector-icons";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../context/ThemeContext";
import { getAllBhajans } from "../data/bhajansData";
import { useEkadashiList } from "../hooks/useEkadashi";

const SCREEN_WIDTH = Dimensions.get("window").width;

// --- Icon Component using Feather ---
const AppIcon = ({ name, style, size = 24, color }) => (
  <Feather name={name} size={size} color={color} style={style} />
);

// --- Reusable Card Component ---
const DetailCard = ({ iconName, title, children, colors }) => (
  <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
    <View style={styles.cardHeader}>
      <AppIcon name={iconName} style={styles.cardIcon} color={colors.primary} />
      <ThemedText
        type="heading"
        style={[styles.cardTitle, { color: colors.foreground }]}
      >
        {title}
      </ThemedText>
    </View>
    <View style={styles.cardContent}>{children}</View>
  </View>
);

// --- Section 1: Significance ---
const SignificanceSection = ({ onLearnMore, ekadashi, colors }) => (
  <DetailCard iconName="book-open" title="Significance" colors={colors}>
    <ThemedText style={[styles.bodyText, { color: colors.mutedForeground }]}>
      Ekadashi means the 11th day of each lunar cycle. Every Hindu month has two
      Ekadashis—one in the Shukla Paksha and one in the Krishna Paksha.
    </ThemedText>
    <TouchableOpacity
      style={[styles.readButton, { borderColor: colors.primary }]}
      onPress={onLearnMore}
    >
      <ThemedText
        type="defaultSemiBold"
        style={[styles.readButtonText, { color: colors.primary }]}
      >
        Learn More
      </ThemedText>
    </TouchableOpacity>
  </DetailCard>
);

// --- Section 2: Story ---
const StorySection = ({ onReadStory, ekadashi, colors }) => {
  const description =
    ekadashi?.description ||
    ekadashi?.vrataKatha ||
    ekadashi?.significance ||
    "Observing Ekadashi with devotion helps overcome life's obstacles and brings inner peace. This sacred day is particularly beneficial for those seeking spiritual growth and material prosperity.";
  const benefit =
    "Observing this Ekadashi with devotion brings spiritual purification, removes past karmas, and grants divine blessings. It helps devotees progress on the path of devotion and attain inner peace.";

  return (
    <DetailCard iconName="book-open" title="Story" colors={colors}>
      <ThemedText style={[styles.bodyText, { color: colors.mutedForeground }]}>
        {description}
      </ThemedText>
      <ThemedText
        style={[
          styles.bodyText,
          { color: colors.mutedForeground, marginTop: 10 },
        ]}
      >
        {benefit}
      </ThemedText>
      <TouchableOpacity
        style={[
          styles.readButton,
          { borderColor: colors.primary, marginTop: 15 },
        ]}
        onPress={onReadStory}
      >
        <ThemedText
          type="defaultSemiBold"
          style={[styles.readButtonText, { color: colors.primary }]}
        >
          Read Full Story
        </ThemedText>
      </TouchableOpacity>
    </DetailCard>
  );
};

// --- Section 3: Vrata Rules & Guidelines ---
const VrataRulesSection = ({ ekadashi, colors }) => {
  const defaultRules = [
    "Begin fasting from sunrise on Ekadashi day",
    "Avoid grains, beans, and certain vegetables",
    "Stay hydrated with water and fruit juices",
    "Spend time in prayer and meditation",
    "Read spiritual texts or chant mantras",
  ];
  const rules = ekadashi?.fastingRules || defaultRules;

  return (
    <DetailCard
      iconName="heart"
      title="Vrata Rules & Guidelines"
      colors={colors}
    >
      {rules.map((rule, index) => (
        <View key={index} style={styles.ruleItem}>
          <View
            style={[
              styles.ruleNumberCircle,
              { borderColor: colors.grey, backgroundColor: colors.card },
            ]}
          >
            <ThemedText
              type="small"
              style={[styles.ruleNumberText, { color: colors.foreground }]}
            >
              {index + 1}
            </ThemedText>
          </View>
          <ThemedText
            style={[styles.ruleText, { color: colors.mutedForeground }]}
          >
            {rule}
          </ThemedText>
        </View>
      ))}
    </DetailCard>
  );
};

// --- Section 4: Important Timings ---
const TimingsSection = ({ panchangData, colors }) => {
  const sunrise = panchangData?.sunrise || "06:09 AM";
  const sunset = panchangData?.sunset || "06:09 PM";

  return (
    <DetailCard iconName="clock" title="Important Timings" colors={colors}>
      <View style={styles.timingRow}>
        <View style={styles.timingItem}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.timingLabel, { color: colors.foreground }]}
          >
            Fasting Begins
          </ThemedText>
          <ThemedText style={[styles.timingValue, { color: colors.primary }]}>
            {sunrise}
          </ThemedText>
        </View>
        <View style={styles.timingItem}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.timingLabel, { color: colors.foreground }]}
          >
            Parana Window
          </ThemedText>
          <ThemedText style={[styles.timingValue, { color: colors.primary }]}>
            {sunrise} - {sunset}
          </ThemedText>
        </View>
      </View>
    </DetailCard>
  );
};

// --- Section 5: Bhajans & Mantras ---
const BhajansSection = ({ onBhajanPress, bhajans, colors }) => {
  const displayBhajans = bhajans || getAllBhajans().slice(0, 3);

  return (
    <DetailCard iconName="music" title="Bhajans & Mantras" colors={colors}>
      {displayBhajans.map((bhajan) => (
        <TouchableOpacity
          key={bhajan.id}
          style={[
            styles.bhajanButton,
            { borderColor: colors.border, backgroundColor: colors.muted },
          ]}
          onPress={() => onBhajanPress(bhajan)}
        >
          <AppIcon
            name="music"
            style={styles.bhajanIcon}
            color={colors.primary}
            size={18}
          />
          <View style={styles.bhajanTextContainer}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.bhajanText, { color: colors.foreground }]}
            >
              {bhajan.name}
            </ThemedText>
            {bhajan.artist && (
              <ThemedText
                type="caption"
                style={[styles.bhajanArtist, { color: colors.mutedForeground }]}
              >
                {bhajan.artist}
              </ThemedText>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </DetailCard>
  );
};

// --- Section 6: Sattvic Recipes ---
const RecipesSection = ({ colors }) => {
  const recipes = [
    { name: "Fruit Salad", desc: "Mixed seasonal fruits with honey" },
    { name: "Sabudana Kheer", desc: "Sweet tapioca pudding with nuts" },
    { name: "Kuttu Roti", desc: "Buckwheat flatbread with yogurt" },
  ];

  return (
    <DetailCard iconName="feather" title="Sattvic Recipes" colors={colors}>
      {recipes.map((recipe, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.recipeItem,
            { borderColor: colors.border, backgroundColor: colors.muted },
          ]}
        >
          <ThemedText
            type="defaultSemiBold"
            style={[styles.recipeName, { color: colors.foreground }]}
          >
            {recipe.name}
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.recipeDesc, { color: colors.mutedForeground }]}
          >
            {recipe.desc}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </DetailCard>
  );
};

// --- Modal 1: Significance Details ---
const SignificanceModal = ({ isVisible, onClose, colors }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.modalOverlay,
          {
            backgroundColor: colors.isDark
              ? "rgba(0,0,0,0.7)"
              : "rgba(0, 0, 0, 0.5)",
          },
        ]}
      >
        <View
          style={[styles.storyModalContainer, { backgroundColor: colors.card }]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <AppIcon name="book-open" size={20} color={colors.primary} />
            <ThemedText
              type="subtitle"
              style={[styles.modalTitle, { color: colors.foreground }]}
            >
              What is Ekadashi?
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AppIcon name="x" size={24} color={colors.grey} />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.storyModalContent}
          >
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              Ekadashi means{" "}
              <ThemedText style={{ fontWeight: "bold" }}>
                the 11th day
              </ThemedText>{" "}
              of each lunar cycle. Every Hindu month has two Ekadashis—one in
              the Shukla Paksha and one in the Krishna Paksha.
            </ThemedText>
            <View
              style={[
                styles.infoBox,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
            >
              <ThemedText
                style={[
                  styles.modalContentText,
                  { color: colors.mutedForeground },
                ]}
              >
                🗓 Ekadashi comes twice a month, on the 11th day after each New
                Moon and Full Moon.
              </ThemedText>
            </View>
            <ThemedText
              type="subtitle"
              style={[styles.modalContentHeading, { color: colors.foreground }]}
            >
              ✨ Significance of Ekadashi
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalSubHeading, { color: colors.foreground }]}
            >
              1. A Day of Cleansing — Body, Mind & Soul
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              • Calms the mind{"\n"}• Reduces cravings{"\n"}• Improves digestion
              {"\n"}• Increases mental clarity
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalSubHeading, { color: colors.foreground }]}
            >
              2. Reducing Material Influence
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              💭 Mind becomes more sattvic{"\n"}
              🧘 Senses become easier to control{"\n"}
              📿 Meditation becomes deeper
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalSubHeading, { color: colors.foreground }]}
            >
              3. Devotional Connection to Lord Vishnu / Krishna
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              • Removes past karma{"\n"}• Builds devotion (bhakti){"\n"}•
              Attains peace{"\n"}• Reconnecting with the divine
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalSubHeading, { color: colors.foreground }]}
            >
              4. Conscious Eating
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              Avoiding grains is meaningful—digestive fire is lower on Ekadashi.
              {"\n"}• Light food{"\n"}• Fruits{"\n"}• Water{"\n"}• Simplicity
              and rest for the body
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalSubHeading, { color: colors.foreground }]}
            >
              5. Discipline & Willpower
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              • Breaking habits{"\n"}• Controlling desires{"\n"}• Living
              intentionally
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalContentHeading, { color: colors.foreground }]}
            >
              🕉 Meaning of Ekadashi (Spiritual)
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              Scriptures describe Ekadashi as{" "}
              <ThemedText style={{ fontWeight: "bold" }}>
                "the doorway between the material and spiritual."
              </ThemedText>
              {"\n"}✨ Purifies consciousness{"\n"}✨ Strengthens devotion{"\n"}
              ✨ Brings mental clarity{"\n"}✨ Reduces negative tendencies
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalContentHeading, { color: colors.foreground }]}
            >
              🌼 Why People Feel Ekadashi is Powerful
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              • Mind settles faster during japa{"\n"}• Emotions feel lighter
              {"\n"}• Food cravings reduce{"\n"}• Thoughts become clearer{"\n"}•
              Devotion feels deeper{"\n"}• Energy feels purer
            </ThemedText>
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.primary + "15",
                  borderColor: colors.primary + "30",
                },
              ]}
            >
              <ThemedText
                type="subtitle"
                style={[styles.modalSubHeading, { color: colors.foreground }]}
              >
                ❤️ Simple Summary
              </ThemedText>
              <ThemedText
                style={[
                  styles.modalContentText,
                  { color: colors.mutedForeground, fontWeight: "600" },
                ]}
              >
                Ekadashi = A spiritual reset day.
              </ThemedText>
              <ThemedText
                style={[
                  styles.modalContentText,
                  { color: colors.mutedForeground },
                ]}
              >
                • Rest the stomach{"\n"}• Cleanse the mind{"\n"}• Connect with
                Krishna{"\n"}• Reduce negative energy{"\n"}• Be peaceful &
                mindful
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// --- Modal 2: Story Details ---
const StoryModal = ({ isVisible, onClose, ekadashi, colors }) => {
  const ekadashiName = ekadashi?.name || ekadashi?.ekadashi_name || "Ekadashi";
  const description =
    ekadashi?.description ||
    ekadashi?.vrataKatha ||
    "Long ago, in the celestial realm, there lived a demon named Mura who tormented the demigods and sages. Unable to defeat him through conventional means, Lord Vishnu engaged in a fierce battle that lasted for thousands of years. During this cosmic struggle, a divine maiden emerged from the Lord's body, radiating immense spiritual power. This celestial being, born from the Lord's transcendental energy, defeated the demon Mura with ease. Pleased with her service, Lord Vishnu granted her a boon. She requested that those who fast on her appearance day would be blessed with spiritual advancement and liberation from material bondage. The Lord named her Ekadashi, as she appeared on the eleventh day of the lunar month. He declared that observing Ekadashi with devotion, fasting, and spiritual practices would grant devotees immense spiritual benefit, purification of consciousness, and progress on the path of devotion.";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[
          styles.modalOverlay,
          {
            backgroundColor: colors.isDark
              ? "rgba(0,0,0,0.7)"
              : "rgba(0, 0, 0, 0.5)",
          },
        ]}
      >
        <View
          style={[styles.storyModalContainer, { backgroundColor: colors.card }]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <AppIcon name="book-open" size={20} color={colors.primary} />
            <ThemedText
              type="subtitle"
              style={[styles.modalTitle, { color: colors.foreground }]}
            >
              {ekadashiName} - Complete Story
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AppIcon name="x" size={24} color={colors.grey} />
            </TouchableOpacity>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.storyModalContent}
          >
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              {description}
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalContentHeading, { color: colors.foreground }]}
            >
              The Sacred Legend
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              The story of Ekadashi dates back to ancient times when Lord Vishnu
              was engaged in a cosmic battle with the demon Mura. This powerful
              demon had been causing great distress to the demigods and sages.
              After a long and intense battle, a divine maiden emerged from Lord
              Vishnu's transcendental body. This celestial being, known as
              Ekadashi Devi, easily defeated the demon and saved the universe.
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              Pleased with her service, Lord Vishnu granted Ekadashi Devi a
              boon. She requested that those who observe fasting and engage in
              spiritual practices on her appearance day (the 11th day of each
              lunar fortnight) would receive immense spiritual benefits,
              purification of consciousness, and progress on the path of
              devotion.
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              Lord Vishnu declared that observing Ekadashi with devotion,
              fasting, prayer, and meditation would grant devotees liberation
              from material bondage, removal of past karmas, and spiritual
              advancement. This is why Ekadashi is considered one of the most
              sacred days in the Hindu calendar.
            </ThemedText>
            <ThemedText
              type="subtitle"
              style={[styles.modalContentHeading, { color: colors.foreground }]}
            >
              Spiritual Significance
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              Ekadashi represents the transcendence of material consciousness
              and the awakening of spiritual awareness. By observing this sacred
              day, devotees align themselves with higher spiritual vibrations,
              purify their hearts, and develop deeper love and devotion for the
              Supreme Lord.
            </ThemedText>
            <ThemedText
              style={[
                styles.modalContentText,
                { color: colors.mutedForeground },
              ]}
            >
              The practice of fasting on Ekadashi is not merely about
              restricting food intake; it is a powerful spiritual discipline
              intended to reduce bodily demands and increase concentration on
              transcendental sound and service. This helps devotees progress on
              their spiritual journey and attain inner peace and divine
              blessings.
            </ThemedText>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// --- Modal 3: Bhajan Player ---
const BhajanModal = ({
  isVisible,
  onClose,
  selectedBhajan,
  onBhajanChange,
  colors,
}) => {
  const allBhajans = getAllBhajans();
  const currentBhajan =
    typeof selectedBhajan === "object"
      ? selectedBhajan
      : allBhajans.find((b) => b.name === selectedBhajan) || allBhajans[0];

  const soundCloudEmbedUrl = currentBhajan?.url
    ? `https://w.soundcloud.com/player/?url=${encodeURIComponent(
      currentBhajan.url
    )}&auto_play=true&visual=true&show_artwork=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`
    : null;

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
      <View
        style={[
          styles.modalOverlay,
          {
            backgroundColor: colors.isDark
              ? "rgba(0,0,0,0.7)"
              : "rgba(0, 0, 0, 0.5)",
          },
        ]}
      >
        <View
          style={[
            styles.bhajanModalContainer,
            { backgroundColor: colors.card },
          ]}
        >
          <View
            style={[styles.bhajanHandle, { backgroundColor: colors.border }]}
          />

          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor: colors.border,
                backgroundColor: colors.card,
              },
            ]}
          >
            <AppIcon
              name="music"
              size={24}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <ThemedText
              type="subtitle"
              style={[styles.modalTitle, { flex: 1, color: colors.foreground }]}
              numberOfLines={1}
            >
              {currentBhajan?.name || "Bhajan"}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AppIcon name="x" size={24} color={colors.grey} />
            </TouchableOpacity>
          </View>

          <View style={styles.webviewContainer}>
            {soundCloudEmbedUrl ? (
              <WebView
                source={{ uri: soundCloudEmbedUrl }}
                style={styles.webview}
                scrollEnabled={false}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
              />
            ) : (
              <View
                style={[
                  styles.errorContainer,
                  { backgroundColor: colors.muted },
                ]}
              >
                <ThemedText style={[styles.errorText, { color: colors.grey }]}>
                  Audio not available
                </ThemedText>
              </View>
            )}
          </View>

          <ThemedText
            style={[styles.devotionalText, { color: colors.mutedForeground }]}
          >
            Playing devotional music for your spiritual journey
          </ThemedText>

          <View style={styles.bhajanListFooter}>
            {allBhajans.map((bhajan) => (
              <TouchableOpacity
                key={bhajan.id}
                style={[
                  styles.footerBhajanButton,
                  { borderColor: colors.grey },
                  currentBhajan?.id === bhajan.id && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => handleBhajanSelect(bhajan)}
              >
                <ThemedText
                  type="small"
                  style={[
                    styles.footerBhajanText,
                    { color: colors.foreground },
                    currentBhajan?.id === bhajan.id &&
                    styles.activeFooterBhajanText,
                  ]}
                  numberOfLines={1}
                >
                  {bhajan.name}
                </ThemedText>
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
  const { colors, isDark } = useTheme();
  const [isSignificanceModalVisible, setSignificanceModalVisible] =
    useState(false);
  const [isStoryModalVisible, setStoryModalVisible] = useState(false);
  const [isBhajanModalVisible, setBhajanModalVisible] = useState(false);
  const [activeBhajan, setActiveBhajan] = useState(getAllBhajans()[0]);
  const [ekadashi, setEkadashi] = useState(null);
  const [panchangData, setPanchangData] = useState(null);

  // Get location from Redux store
  const location = useSelector((state) => state.location);

  const ekadashiFromRoute = route?.params?.ekadashi;
  // Use useMemo to prevent recreating moment object on every render
  const ekadashiDateString = useMemo(
    () => route?.params?.date || moment().format("YYYY-MM-DD"),
    [route?.params?.date]
  );
  const ekadashiDate = useMemo(
    () => moment(ekadashiDateString),
    [ekadashiDateString]
  );
  const currentYear = moment().year();
  const { ekadashiList } = useEkadashiList(currentYear);

  // Memoize location values to prevent unnecessary re-renders
  const locationLat = useMemo(() => location?.latitude, [location?.latitude]);
  const locationLon = useMemo(() => location?.longitude, [location?.longitude]);

  // Use ref to track if we've already fetched for this date/location combination
  const lastFetchedRef = useRef({ date: null, lat: null, lon: null });

  useEffect(() => {
    if (ekadashiFromRoute) {
      setEkadashi(ekadashiFromRoute);
    } else if (ekadashiList && ekadashiList.length > 0) {
      const foundEkadashi = ekadashiList.find((e) => {
        const eDate = moment(e.date || e.ekadashi_date);
        return eDate.isSame(ekadashiDate, "day");
      });
      if (foundEkadashi) {
        setEkadashi(foundEkadashi);
      }
    }
  }, [ekadashiFromRoute, ekadashiList, ekadashiDateString]);

  useEffect(() => {
    // Only fetch if date or location has actually changed
    const shouldFetch =
      lastFetchedRef.current.date !== ekadashiDateString ||
      lastFetchedRef.current.lat !== locationLat ||
      lastFetchedRef.current.lon !== locationLon;

    if (!shouldFetch) {
      return;
    }

    const fetchPanchang = async () => {
      try {
        const { getPanchangData } = require("../services/api");
        // Pass location to getPanchangData if available
        const locationData =
          locationLat && locationLon
            ? { latitude: locationLat, longitude: locationLon }
            : null;
        const data = await getPanchangData(ekadashiDateString, locationData);

        // Update ref to track what we fetched
        lastFetchedRef.current = {
          date: ekadashiDateString,
          lat: locationLat,
          lon: locationLon,
        };

        setPanchangData(data);
      } catch (error) {
        console.error("Error fetching panchang:", error);
      }
    };
    fetchPanchang();
  }, [ekadashiDateString, locationLat, locationLon]);

  const handleBhajanPress = (bhajan) => {
    setActiveBhajan(bhajan);
    setBhajanModalVisible(true);
  };

  const handleBhajanChange = (bhajan) => {
    setActiveBhajan(bhajan);
  };

  const formattedDate = ekadashiDate.format("dddd D MMMM");
  const ekadashiName = ekadashi?.name || ekadashi?.ekadashi_name || "Ekadashi";

  const Header = () => (
    <View
      style={[
        styles.header,
        { borderBottomColor: colors.border, backgroundColor: colors.card },
      ]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <AppIcon name="arrow-left" size={24} color={colors.foreground} />
      </TouchableOpacity>
      <View>
        <ThemedText
          type="subtitle"
          style={[styles.mainTitle, { color: colors.foreground }]}
        >
          {ekadashiName}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.subtitle, { color: colors.mutedForeground }]}
        >
          {formattedDate}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.card }]}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <SignificanceSection
          onLearnMore={() => setSignificanceModalVisible(true)}
          ekadashi={ekadashi}
          colors={colors}
        />
        <StorySection
          onReadStory={() => setStoryModalVisible(true)}
          ekadashi={ekadashi}
          colors={colors}
        />
        <VrataRulesSection ekadashi={ekadashi} colors={colors} />
        <TimingsSection panchangData={panchangData} colors={colors} />
        <BhajansSection
          onBhajanPress={handleBhajanPress}
          bhajans={getAllBhajans().slice(0, 3)}
          colors={colors}
        />
        <RecipesSection colors={colors} />
        <View style={{ height: 40 }} />
      </ScrollView>

      <SignificanceModal
        isVisible={isSignificanceModalVisible}
        onClose={() => setSignificanceModalVisible(false)}
        colors={colors}
      />
      <StoryModal
        isVisible={isStoryModalVisible}
        onClose={() => setStoryModalVisible(false)}
        ekadashi={ekadashi}
        colors={colors}
      />
      <BhajanModal
        isVisible={isBhajanModalVisible}
        onClose={() => setBhajanModalVisible(false)}
        selectedBhajan={activeBhajan}
        onBhajanChange={handleBhajanChange}
        colors={colors}
      />
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    paddingRight: 15,
  },
  mainTitle: {
    fontSize: responsiveFontSize(18),
  },
  subtitle: {
    fontSize: responsiveFontSize(14),
  },
  cardContainer: {
    borderRadius: 12,
    padding: 18,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: responsiveFontSize(20),
  },
  cardContent: {
    paddingTop: 5,
  },
  bodyText: {
    fontSize: responsiveFontSize(15),
    lineHeight: responsiveFontSize(22),
    marginBottom: 15,
  },
  readButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  readButtonText: {
    fontSize: responsiveFontSize(14),
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  ruleNumberCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  ruleNumberText: {
    fontSize: responsiveFontSize(12),
  },
  ruleText: {
    flex: 1,
    fontSize: responsiveFontSize(15),
  },
  timingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  timingItem: {
    width: SCREEN_WIDTH / 2 - 32 - 8,
  },
  timingLabel: {
    fontSize: responsiveFontSize(15),
    marginBottom: 4,
  },
  timingValue: {
    fontSize: responsiveFontSize(16),
  },
  bhajanButton: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: responsiveFontSize(15),
  },
  bhajanArtist: {
    fontSize: responsiveFontSize(12),
    marginTop: 2,
  },
  recipeItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 6,
  },
  recipeName: {
    fontSize: responsiveFontSize(16),
  },
  recipeDesc: {
    fontSize: responsiveFontSize(13),
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  storyModalContainer: {
    flex: 1,
    borderRadius: 12,
    margin: 10,
    marginTop: Platform.OS === "ios" ? 50 : 20,
    overflow: "hidden",
  },
  storyModalContent: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: responsiveFontSize(16),
    marginLeft: 8,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  modalContentHeading: {
    fontSize: responsiveFontSize(18),
    marginBottom: 10,
    marginTop: 15,
  },
  modalSubHeading: {
    fontSize: responsiveFontSize(16),
    marginBottom: 8,
    marginTop: 12,
    fontWeight: "600",
  },
  infoBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 10,
  },
  modalContentText: {
    fontSize: responsiveFontSize(15),
    lineHeight: responsiveFontSize(22),
    marginBottom: 10,
  },
  bhajanModalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 8,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  bhajanHandle: {
    width: 40,
    height: 5,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 8,
  },
  webviewContainer: {
    height: 200,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 15,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: responsiveFontSize(14),
  },
  devotionalText: {
    fontSize: responsiveFontSize(14),
    textAlign: "center",
    marginVertical: 15,
  },
  bhajanListFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  footerBhajanButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    margin: 5,
  },
  activeFooterBhajanButton: {},
  footerBhajanText: {
    fontSize: responsiveFontSize(14),
  },
  activeFooterBhajanText: {
    color: "white",
  },
});

export default CalendarDayDetails;
