import { AntDesign, Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function Login() {
  const [activeTab, setActiveTab] = useState("signUp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
            <Feather name="square" size={18} color="#ccc" />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>OR CONTINUE WITH</Text>
      <TouchableOpacity style={styles.googleButton}>
        <AntDesign name="google" size={20} color="#333" style={styles.icon} />
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
          <Feather name="user" size={18} color="#777" style={styles.icon} />
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
      <TouchableOpacity style={styles.signInButton}>
        <Text style={styles.signInButtonText}>Create Account</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>OR CONTINUE WITH</Text>
      <TouchableOpacity style={styles.googleButton}>
        <AntDesign name="google" size={20} color="#333" style={styles.icon} />
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
              source={{
                uri: "https://placehold.co/100x100/544974/ffffff?text=Icon",
              }}
              style={styles.logo}
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
                style={styles.tab}
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
                style={styles.tab}
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
    backgroundColor: "#f5f5f5",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#544974",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 16,
    color: "#777",
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#544974",
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  formSubtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
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
    borderRadius: 5,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#777",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#544974",
    textDecorationLine: "underline",
  },
  signInButton: {
    backgroundColor: "#544974",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  orText: {
    textAlign: "center",
    color: "#777",
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  privacyText: {
    fontSize: 12,
    color: "#777",
    textAlign: "center",
  },
  privacyLink: {
    color: "#544974",
    textDecorationLine: "underline",
  },
});
