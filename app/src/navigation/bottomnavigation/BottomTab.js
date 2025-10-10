import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import CalendarScreen from "../../screens/CalendarScreen";
import EkadashisScreen from "../../screens/EkadashisScreen";
import HomeScreen from "../../screens/HomeScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import SettingsScreen from "../../screens/SettingsScreen";

const TAB_ACTIVE_COLOR = "#16366B";
const PALE_COLOR = "#34629E";
const TEXT_INACTIVE_COLOR = "#4071BF";
const TEXT_ACTIVE_COLOR = "#FFFFFF";
const TAB_BAR_BACKGROUND_COLOR = "#FAFBFA";
const ACTIVE_BORDER_COLOR = "#C2CAD5";

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
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
          const iconColor = isFocused ? TEXT_ACTIVE_COLOR : TEXT_INACTIVE_COLOR;
          const textColor = isFocused ? TEXT_ACTIVE_COLOR : TEXT_INACTIVE_COLOR;

          const iconType = iconName;

          const TabContent = () => (
            <>
              <Feather name={iconType} size={24} color={iconColor} />
              <Text style={[styles.tabLabel, { color: textColor }]}>
                {String(label)}
              </Text>
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
                  colors={[PALE_COLOR, TAB_ACTIVE_COLOR]}
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
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIconName: "home",
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: "Calendar",
          tabBarIconName: "calendar",
        }}
      />
      <Tab.Screen
        name="Ekadashis"
        component={EkadashisScreen}
        options={{
          tabBarLabel: "Ekadashis",
          tabBarIconName: "list",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  screenText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabBarWrapper: {
    backgroundColor: TAB_BAR_BACKGROUND_COLOR,
    borderTopWidth: 1,
    borderTopColor: "#CED9E4",
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
    borderColor: ACTIVE_BORDER_COLOR,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default BottomTab;
