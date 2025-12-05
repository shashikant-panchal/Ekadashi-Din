import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { ThemedText } from "../components/ThemedText";
import { useTheme } from "../context/ThemeContext";
import { clearError, resetRegistrationSuccess, signIn, signInWithGoogle, signUp } from "../redux/userSlice";

const { width } = Dimensions.get("window");

export default function Login() {
  const [activeTab, setActiveTab] = useState("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, registrationSuccess } = useSelector((state) => state.user);
  const { colors, isDark, typography } = useTheme();

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: error,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (registrationSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Welcome! You are now logged in.',
      });
      dispatch(resetRegistrationSuccess());
    }
  }, [registrationSuccess, dispatch]);

  const handleSignIn = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both email and password.',
      });
      return;
    }
    dispatch(signIn({ email, password }));
  };

  const handleSignUp = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter email and password.',
      });
      return;
    }
    dispatch(signUp({ email, password, displayName }));
  };

  const handleGoogleSignIn = () => {
    dispatch(signInWithGoogle());
  };

  const styles = getStyles(colors, typography);

  const renderSignIn = () => (
    <>
      <ThemedText type="subtitle" style={styles.formTitle}>Welcome Back</ThemedText>
      <ThemedText style={styles.formSubtitle}>
        Sign in to continue your spiritual journey
      </ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Email</ThemedText>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={18} color={colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Password</ThemedText>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color={colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.passwordOptions}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity style={[styles.checkbox, { borderColor: colors.border }]}>
          </TouchableOpacity>
          <ThemedText type="small" style={styles.checkboxLabel}>Remember me</ThemedText>
        </View>
        <TouchableOpacity>
          <ThemedText type="small" style={styles.forgotPassword}>Forgot password?</ThemedText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <ThemedText type="defaultSemiBold" style={styles.signInButtonText}>Sign In</ThemedText>
            <Feather
              name="arrow-right"
              size={20}
              color="#fff"
              style={{ marginLeft: 10 }}
            />
          </>
        )}
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <ThemedText type="caption" style={styles.orText}>OR CONTINUE WITH</ThemedText>
        <View style={styles.dividerLine} />
      </View>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
          }}
          style={styles.googleIcon}
        />
        <ThemedText type="defaultSemiBold" style={styles.googleButtonText}>Continue with Google</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity>
        <ThemedText type="caption" style={styles.privacyText}>
          By continuing, you agree to our{" "}
          <ThemedText type="caption" style={styles.privacyLink}>Privacy Policy</ThemedText>
        </ThemedText>
      </TouchableOpacity>
    </>
  );

  const renderSignUp = () => (
    <>
      <ThemedText type="subtitle" style={styles.formTitle}>Create Account</ThemedText>
      <ThemedText style={styles.formSubtitle}>
        Start your spiritual journey with us
      </ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Display Name</ThemedText>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your display name"
            placeholderTextColor={colors.mutedForeground}
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Email</ThemedText>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={18} color={colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <ThemedText type="defaultSemiBold" style={styles.inputLabel}>Password</ThemedText>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color={colors.mutedForeground} style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Feather
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={18}
              color={colors.mutedForeground}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignUp} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Feather
              name="user-plus"
              size={20}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <ThemedText type="defaultSemiBold" style={styles.signInButtonText}>Create Account</ThemedText>
          </>
        )}
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <ThemedText type="caption" style={styles.orText}>OR CONTINUE WITH</ThemedText>
        <View style={styles.dividerLine} />
      </View>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
          }}
          style={styles.googleIcon}
        />
        <ThemedText type="defaultSemiBold" style={styles.googleButtonText}>Continue with Google</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity>
        <ThemedText type="caption" style={styles.privacyText}>
          By continuing, you agree to our{" "}
          <ThemedText type="caption" style={styles.privacyLink}>Privacy Policy</ThemedText>
        </ThemedText>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={[styles.logoContainer, { backgroundColor: colors.lightBlueBg }]}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <ThemedText type="title" style={styles.title}>Ekadashi Din</ThemedText>
          <ThemedText style={styles.subtitle}>
            Your spiritual companion for Ekadashi observance and daily practice.
          </ThemedText>
          <View style={styles.card}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab("signIn")}
                style={[styles.tab, activeTab === "signIn" && styles.activeTab]}
              >
                <ThemedText
                  style={
                    activeTab === "signIn"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Sign In
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("signUp")}
                style={[styles.tab, activeTab === "signUp" && styles.activeTab]}
              >
                <ThemedText
                  style={
                    activeTab === "signUp"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </View>
            {activeTab === "signIn" ? renderSignIn() : renderSignUp()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const getStyles = (colors, typography) => StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 28,
    color: colors.foreground,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  card: {
    width: width * 0.9,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    borderBottomWidth: 0,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.mutedForeground,
  },
  activeTabText: {
    fontSize: 16,
    color: colors.primary,
  },
  formTitle: {
    fontSize: 22,
    color: colors.foreground,
    textAlign: "center",
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: colors.foreground,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.muted,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colors.foreground,
    fontFamily: typography?.family?.sans,
  },
  passwordOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    borderWidth: 1,
    borderRadius: 4,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  forgotPassword: {
    fontSize: 14,
    color: colors.primary,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    textAlign: "center",
    color: colors.mutedForeground,
    marginHorizontal: 10,
    fontSize: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 25,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    color: colors.foreground,
  },
  privacyText: {
    fontSize: 12,
    color: colors.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },
  privacyLink: {
    color: colors.primary,
  },
});
