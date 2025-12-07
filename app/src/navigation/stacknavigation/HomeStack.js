import { createStackNavigator } from "@react-navigation/stack";
import CalendarDayDetails from "../../screens/CalendarDayDetails";
import DailyReading from "../../screens/DailyReading";
import DailyWisdom from "../../screens/DailyWisdom";
import HomeScreen from "../../screens/HomeScreen";
import MorningJapaScreen from "../../screens/MorningJapaScreen";
import Notification from "../../screens/Notification";

const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        options={{ title: "Home" }}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          title: "Notifications",
        }}
        name="Notification"
        component={Notification}
      />
      <Stack.Screen
        options={{ title: "Daily Wisdom" }}
        name="DailyWisdom"
        component={DailyWisdom}
      />
      <Stack.Screen name="MorningJapa" component={MorningJapaScreen} />
      <Stack.Screen name="DailyReading" component={DailyReading} />
      <Stack.Screen name="DayDetails" component={CalendarDayDetails} />
    </Stack.Navigator>
  );
};

export default HomeStack;
