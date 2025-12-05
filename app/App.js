import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import BottomTab from "./src/navigation/bottomnavigation/BottomTab";
import { store } from "./src/redux/store";
import { setSession } from "./src/redux/userSlice";
import Login from "./src/screens/Login";
import { supabase } from "./src/utils/supabase";

function Root() {
  const { session } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

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

  if (!isAuthChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return session ? <BottomTab /> : <Login />;
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
      <Toast />
    </Provider>
  );
}

