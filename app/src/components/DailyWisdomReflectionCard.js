import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { DarkBlue } from "../constants/Colors";
import { dh, dw } from "../constants/Dimensions";

const DailyWisdomReflectionCard = ({
  reflectionText,
  timeOfDay = "evening",
}) => {
  const isMorning = timeOfDay === "morning";
  const title = isMorning ? "Morning Inspiration" : "Evening Reflection";
  const iconName = isMorning ? "sunny-outline" : "moon-outline";
  const defaultText = isMorning
    ? "Begin your day with the holy names on your lips and Krishna in your heart"
    : "Evening is the perfect time to reflect on Krishna presence in every moment";

  return (
    <View style={styles.reflectionCard}>
      <View style={styles.reflectionIconContainer}>
        <Ionicons name={iconName} size={24} color={DarkBlue} />
      </View>
      <View style={styles.reflectionContent}>
        <Text style={styles.reflectionTitle}>{title}</Text>
        <Text style={styles.reflectionDescription}>
          {reflectionText || defaultText}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  reflectionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reflectionIconContainer: {
    width: dw / 10,
    height: dh / 20,
    alignSelf: "flex-start",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  reflectionContent: {
    flex: 1,
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: DarkBlue,
    marginBottom: 4,
  },
  reflectionDescription: {
    fontSize: 14,
    color: DarkBlue,
    lineHeight: 20,
  },
});

export default DailyWisdomReflectionCard;
