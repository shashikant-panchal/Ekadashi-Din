import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { responsiveFontSize } from "../utils/responsive";
import { ThemedText } from "./ThemedText";

const SplitCard = ({
  icon,
  iconColor,
  iconBackground,
  list,
  title,
  subTitle,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      {list ? (
        <View
          style={[styles.iconBackground, { backgroundColor: iconBackground }]}
        >
          <MaterialCommunityIcons name={list} size={24} color={iconColor} />
        </View>
      ) : (
        <View
          style={[styles.iconBackground, { backgroundColor: iconBackground }]}
        >
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
      )}
      <ThemedText
        type="defaultSemiBold"
        style={[styles.title, { color: colors.foreground }]}
      >
        {title}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.subtitle, { color: colors.mutedForeground }]}
      >
        {subTitle}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default SplitCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 0.5,
    elevation: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  iconBackground: {
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: responsiveFontSize(18),
    marginVertical: 5,
  },
  subtitle: {
    fontSize: responsiveFontSize(14),
  },
});
