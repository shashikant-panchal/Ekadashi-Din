import { useEffect, useState } from "react";
import { ActivityIndicator, Appearance, StatusBar, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import "./src/i18n"; // Import i18n configuration
import BottomTab from "./src/navigation/bottomnavigation/BottomTab";
import { store } from "./src/redux/store";
import { loadTheme, updateSystemTheme } from "./src/redux/themeSlice";
import { setSession } from "./src/redux/userSlice";
import Login from "./src/screens/Login";
import { supabase } from "./src/utils/supabase";

function Root() {
  const { session } = useSelector((state) => state.user);
  const { loading: themeLoading } = useSelector((state) => state.theme);
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Load theme from AsyncStorage on app start
    dispatch(loadTheme());

    // Listen for system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      dispatch(updateSystemTheme());
    });

    return () => subscription?.remove();
  }, [dispatch]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession(session));
      setIsAuthChecked(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (!isAuthChecked || themeLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background}
        />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      {session ? <BottomTab /> : <Login />}
    </>
  );
}

function AppContent() {
  return (
    <ThemeProvider>
      <Root />
      <Toast />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
