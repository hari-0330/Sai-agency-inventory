import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Animated,
  Pressable,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import theme from "../styles/theme";
import { ipAddress } from "../ipConfig";

// Floating Label Input Component
const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  icon,
  secureTextEntry,
  showToggle,
  toggleSecure,
  keyboardType = "default",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute",
    left: 40,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={styles.floatingContainer}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View style={styles.inputRow}>
        {icon && (
          <Icon
            name={icon}
            size={20}
            color={theme.colors.secondary}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.floatingInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          placeholderTextColor="#aaa"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
        />
        {showToggle && (
          <Pressable onPress={toggleSecure} style={styles.eyeIcon}>
            <Icon
              name={secureTextEntry ? "visibility-off" : "visibility"}
              size={20}
              color="#888"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (phone === "111" && password === "admin") {
        Alert.alert("Success", "Admin Login Successful!");
        navigation.replace("AdminDashboard");
        return;
      }

      const response = await fetch(`http://${ipAddress}:5000/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("userPhone", phone);
        Alert.alert("Success", "Login Successful!");
        navigation.replace("Home");
      } else {
        Alert.alert("Error", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Server connection failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Icon name="water-drop" size={40} color={theme.colors.primary} />
          <Text style={styles.title}>Water Supply</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
        </View>

        <FloatingLabelInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          icon="phone"
          keyboardType="phone-pad"
        />

        <FloatingLabelInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          showToggle={true}
          toggleSecure={() => setShowPassword(!showPassword)}
          icon="lock"
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogin}
            style={styles.loginButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>
        </Animated.View>

        <Pressable
          style={styles.signupLink}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={styles.signupTextBold}>Sign Up</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: 20,
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    padding: 20,
    width: "90%",
    height: "70%",
    alignSelf: "center",
    ...theme.shadows.medium,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness.small,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  signupLink: {
    marginTop: 24,
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  signupTextBold: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  floatingContainer: {
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 6,
    position: "relative",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  floatingInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: theme.colors.text,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    outlineStyle: "none",
  },
  inputIcon: {
    marginRight: 8,
  },
  eyeIcon: {
    paddingHorizontal: 6,
  },
});

export default Login;
