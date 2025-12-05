import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { DarkBlue, LIGHTBLUEBG } from "../constants/Colors";
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

  const renderSignIn = () => (
    <>
      <Text style={styles.formTitle}>Welcome Back</Text>
      <Text style={styles.formSubtitle}>
        Sign in to continue your spiritual journey
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={18} color="#777" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#777" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
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
              color="#777"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.passwordOptions}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity style={styles.checkbox}>
            {/* <Feather name="check" size={14} color={DarkBlue} /> */}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.signInButtonText}>Sign In</Text>
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
        <Text style={styles.orText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.privacyText}>
          By continuing, you agree to our{" "}
          <Text style={styles.privacyLink}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderSignUp = () => (
    <>
      <Text style={styles.formTitle}>Create Account</Text>
      <Text style={styles.formSubtitle}>
        Start your spiritual journey with us
      </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Display Name</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your display name"
            placeholderTextColor="#aaa"
            value={displayName}
            onChangeText={setDisplayName}
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <View style={styles.inputWrapper}>
          <Feather name="mail" size={18} color="#777" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#777" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
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
              color="#777"
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
            <Text style={styles.signInButtonText}>Create Account</Text>
          </>
        )}
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>OR CONTINUE WITH</Text>
        <View style={styles.dividerLine} />
      </View>
      <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButton}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png",
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.privacyText}>
          By continuing, you agree to our{" "}
          <Text style={styles.privacyLink}>Privacy Policy</Text>
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Ekadashi Din</Text>
          <Text style={styles.subtitle}>
            Your spiritual companion for Ekadashi observance and daily practice.
          </Text>
          <View style={styles.card}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab("signIn")}
                style={[styles.tab, activeTab === "signIn" && styles.activeTab]}
              >
                <Text
                  style={
                    activeTab === "signIn"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("signUp")}
                style={[styles.tab, activeTab === "signUp" && styles.activeTab]}
              >
                <Text
                  style={
                    activeTab === "signUp"
                      ? styles.activeTabText
                      : styles.tabText
                  }
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            {activeTab === "signIn" ? renderSignIn() : renderSignUp()}
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: LIGHTBLUEBG,
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
    fontWeight: "bold",
    color: DarkBlue,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A6583", // A nice blue-grey
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    // elevation: 2,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 4,
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
    borderBottomColor: DarkBlue,
  },
  tabText: {
    fontSize: 16,
    color: "#777",
    fontWeight: "500",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: DarkBlue,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: DarkBlue,
    textAlign: "center",
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#4A6583",
    textAlign: "center",
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: DarkBlue,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: "#F9FAFB",
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
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
    borderColor: "#ccc",
    borderRadius: 4,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#777",
  },
  forgotPassword: {
    fontSize: 14,
    color: DarkBlue,
    fontWeight: "600",
  },
  signInButton: {
    backgroundColor: DarkBlue,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "#E0E0E0",
  },
  orText: {
    textAlign: "center",
    color: "#999",
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: "600",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "#E0E0E0",
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
    fontWeight: "600",
    color: "#333",
  },
  privacyText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
    lineHeight: 18,
  },
  privacyLink: {
    color: DarkBlue,
    fontWeight: "600",
  },
});
