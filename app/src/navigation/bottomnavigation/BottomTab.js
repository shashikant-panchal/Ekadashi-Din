import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { ThemedText } from "../../components/ThemedText";
import { useTheme } from "../../context/ThemeContext";
import SettingsScreen from "../../screens/SettingsScreen";
import CalendarStack from "../stacknavigation/CalendarStack";
import EkadashiStack from "../stacknavigation/EkadashiStack";
import HomeStack from "../stacknavigation/HomeStack";
import ProfileStack from "../stacknavigation/ProfileStack";

const Tab = createBottomTabNavigator();

// Main screens that should show bottom tab
const MAIN_SCREENS = [
  "HomeScreen",
  "CalendarScreen",
  "Ekadashi",
  "ProfileMain",
  "Settings",
  "Home",
  "Calendar",
  "Ekadashis",
  'Profile'
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { colors, isDark } = useTheme();

  const focusedRoute = state.routes[state.index];
  const focusedRouteName = getFocusedRouteNameFromRoute(focusedRoute) || focusedRoute.name;

  const shouldShowTabBar = MAIN_SCREENS.includes(focusedRouteName);

  if (!shouldShowTabBar) {
    return null;
  }

  const styles = getStyles(colors, isDark);

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const iconName = options.tabBarIconName;
          const iconColor = isFocused ? colors.tabActiveText : colors.tabInactiveText;
          const textColor = isFocused ? colors.tabActiveText : colors.tabInactiveText;

          const TabContent = () => (
            <>
              <Feather name={iconName} size={24} color={iconColor} />
              <ThemedText style={[styles.tabLabel, { color: textColor }]}>
                {String(label)}
              </ThemedText>
            </>
          );

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
            >
              {isFocused ? (
                <LinearGradient
                  colors={isDark ? [colors.primary, colors.accent] : ['#34629E', '#16366B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.tabPill, styles.tabPillActive]}
                >
                  <TabContent />
                </LinearGradient>
              ) : (
                <View style={styles.tabPill}>
                  <TabContent />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const BottomTab = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIconName: "home",
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarStack}
        options={{
          tabBarLabel: "Calendar",
          tabBarIconName: "calendar",
        }}
      />
      <Tab.Screen
        name="Ekadashis"
        component={EkadashiStack}
        options={{
          tabBarLabel: "Ekadashis",
          tabBarIconName: "list",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarIconName: "user",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIconName: "settings",
        }}
      />
    </Tab.Navigator>
  );
};

const getStyles = (colors, isDark) => StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  screenText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabBarWrapper: {
    backgroundColor: colors.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: colors.tabBarBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 10,
    height: 90,
    paddingTop: 5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingHorizontal: 5,
    paddingBottom: 5,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 75,
  },
  tabPill: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    minWidth: 70,
    height: 65,
  },
  tabPillActive: {
    borderRadius: 15,
    borderWidth: 3,
    borderColor: isDark ? colors.border : "#C2CAD5",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default BottomTab;
