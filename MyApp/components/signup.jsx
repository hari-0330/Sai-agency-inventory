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

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      useNativeDriver: true,
    }).start();
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://${ipAddress}:5000/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, gender, phone, password }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "User registered successfully!");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.error || "Signup failed");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Icon name="water-drop" size={40} color={theme.colors.primary} />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <FloatingLabelInput label="Full Name" value={name} onChangeText={setName} icon="person" />
        <FloatingLabelInput label="Age" value={age} onChangeText={setAge} icon="cake" keyboardType="numeric" />
        <FloatingLabelInput label="Gender" value={gender} onChangeText={setGender} icon="person-outline" />
        <FloatingLabelInput label="Phone Number" value={phone} onChangeText={setPhone} icon="phone" keyboardType="phone-pad" />

        <FloatingLabelInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          showToggle
          toggleSecure={() => setShowPassword(!showPassword)}
          icon="lock"
        />

        <FloatingLabelInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          showToggle
          toggleSecure={() => setShowConfirm(!showConfirm)}
          icon="lock"
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSignup}
            style={styles.signupButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.surface} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>
        </Animated.View>

        <Pressable style={styles.loginLink} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginTextBold}>Login</Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness.medium,
    padding: 20,
    width: "90%",
    ...theme.shadows.medium,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 4,
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
    height: 25,
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
  signupButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.roundness.small,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 16,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  loginTextBold: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});

export default Signup;
